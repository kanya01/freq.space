// frontend/src/features/tracks/components/TrackUpload.jsx
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadTrack, selectLoading, selectError, clearError } from '../tracksSlice';
import {
    CloudArrowUpIcon,
    XCircleIcon,
    MusicalNoteIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import api from '../../../services/api'; // Use the configured api with auth token

const TrackUpload = ({ onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [tags, setTags] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [trackFile, setTrackFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [validationError, setValidationError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const trackInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const formRef = useRef(null);

    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoading);
    const apiError = useSelector(selectError);

    // Handle track file selection
    const handleTrackChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac'];
        if (!validTypes.includes(file.type)) {
            setValidationError('Invalid file type. Please upload an MP3, WAV, OGG, or FLAC audio file.');
            return;
        }

        // Validate file size (max 30MB)
        if (file.size > 30 * 1024 * 1024) {
            setValidationError('File too large. Maximum size is 30MB.');
            return;
        }

        setTrackFile(file);
        setValidationError('');

        // Auto-fill title if empty
        if (!title) {
            // Remove extension and replace dashes/underscores with spaces
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            const cleanName = nameWithoutExt
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word

            setTitle(cleanName);
        }
    };

    // Handle cover image selection
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setValidationError('Cover file must be an image.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setValidationError('Cover image too large. Maximum size is 5MB.');
            return;
        }

        setCoverFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setCoverPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        setValidationError('');
    };

    // Handle adding a tag
    const handleAddTag = (e) => {
        e.preventDefault();

        const trimmedTag = tagInput.trim().toLowerCase();
        if (!trimmedTag) return;

        // Prevent duplicate tags
        if (tags.includes(trimmedTag)) {
            setValidationError('This tag already exists');
            return;
        }

        // Limit to 5 tags max
        if (tags.length >= 5) {
            setValidationError('Maximum 5 tags allowed');
            return;
        }

        setTags([...tags, trimmedTag]);
        setTagInput('');
        setValidationError('');
    };

    // Handle removing a tag
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Test upload to diagnose issues - using pre-configured api with auth
    const testUpload = async () => {
        if (!trackFile) {
            setValidationError('Please select an audio file to test');
            return;
        }

        const formData = new FormData();
        formData.append('track', trackFile);

        try {
            console.log('Testing upload with FormData:', formData);
            console.log('Track file details:', trackFile);

            // Use the api instance that has auth interceptor configured
            const response = await api.post('/api/v1/tracks/test-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            console.log('Test upload response:', response.data);
            alert('Test upload successful! Server received the file.');
        } catch (error) {
            console.error('Test upload failed:', error.response?.data || error.message);
            setValidationError(`Test upload failed: ${error.response?.data?.msg || error.message}`);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!title.trim()) {
            setValidationError('Title is required');
            return;
        }

        if (!trackFile) {
            setValidationError('Please select an audio file to upload');
            return;
        }

        // Clear previous errors
        setValidationError('');
        dispatch(clearError());

        // Create form data for submission
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        if (genre) formData.append('genre', genre.trim());
        formData.append('isPublic', isPublic.toString());

        // Add tags as JSON string
        if (tags.length > 0) {
            formData.append('tags', JSON.stringify(tags));
        }

        // IMPORTANT: Append files - make sure these field names match what the backend expects
        formData.append('track', trackFile);
        if (coverFile) {
            formData.append('trackCover', coverFile);
        }

        // For debugging
        console.log("Form data contents:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
        }

        // Dispatch upload action - this uses the Redux action which should use your api client
        try {
            const resultAction = await dispatch(uploadTrack(formData));

            if (uploadTrack.fulfilled.match(resultAction)) {
                // Reset form on success
                setTitle('');
                setDescription('');
                setGenre('');
                setTags([]);
                setTrackFile(null);
                setCoverFile(null);
                setCoverPreview('');
                setUploadProgress(0);

                // Callback to parent component
                if (onSuccess) {
                    onSuccess(resultAction.payload);
                }
            } else if (uploadTrack.rejected.match(resultAction)) {
                console.error('Upload rejected with payload:', resultAction.payload);
                // Error will be handled by the reducer and displayed in the UI
            }
        } catch (err) {
            console.error('Upload failed with error:', err);
            setValidationError('Upload failed. Please try again.');
        }
    };

    // List of genre options
    const genreOptions = [
        'Alternative', 'Ambient', 'Blues', 'Classical', 'Country',
        'Dance', 'Electronic', 'Folk', 'Funk', 'Hip-Hop', 'House',
        'Indie', 'Jazz', 'Latin', 'Metal', 'Pop', 'R&B', 'Rock',
        'Soul', 'Techno', 'World'
    ];

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Upload New Track</h2>

            {(validationError || apiError) && (
                <div className="mb-6 p-4 bg-red-900 rounded-md">
                    <p className="text-red-100">{validationError || apiError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" ref={formRef}>
                {/* File dropzone */}
                <div className="space-y-4">
                    {/* Track upload */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            trackFile ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 'border-gray-700 hover:border-gray-500'
                        }`}
                        onClick={() => trackInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={trackInputRef}
                            onChange={handleTrackChange}
                            accept="audio/mpeg,audio/wav,audio/mp3,audio/ogg,audio/flac"
                            className="hidden"
                            name="track"
                        />

                        {trackFile ? (
                            <div className="text-center">
                                <MusicalNoteIcon className="h-10 w-10 text-blue-400 mx-auto mb-2" />
                                <p className="text-white font-medium">{trackFile.name}</p>
                                <p className="text-gray-400 text-sm">
                                    {(trackFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                                <button
                                    type="button"
                                    className="mt-2 text-red-400 hover:text-red-300 text-sm flex items-center mx-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTrackFile(null);
                                        if (trackInputRef.current) trackInputRef.current.value = '';
                                    }}
                                >
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <CloudArrowUpIcon className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                                <p className="text-white font-medium">Drag and drop or click to upload track</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    MP3, WAV, OGG, or FLAC (max 30MB)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Cover image upload */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            coverFile ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 'border-gray-700 hover:border-gray-500'
                        }`}
                        onClick={() => coverInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={handleCoverChange}
                            accept="image/*"
                            className="hidden"
                            name="trackCover"
                        />

                        {coverFile ? (
                            <div className="text-center">
                                {coverPreview ? (
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="w-32 h-32 object-cover rounded-md mx-auto mb-2"
                                    />
                                ) : (
                                    <PhotoIcon className="h-10 w-10 text-blue-400 mx-auto mb-2" />
                                )}
                                <p className="text-white font-medium">{coverFile.name}</p>
                                <button
                                    type="button"
                                    className="mt-2 text-red-400 hover:text-red-300 text-sm flex items-center mx-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCoverFile(null);
                                        setCoverPreview('');
                                        if (coverInputRef.current) coverInputRef.current.value = '';
                                    }}
                                >
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <PhotoIcon className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                                <p className="text-white font-medium">Upload cover image (optional)</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    JPG, PNG, or GIF (max 5MB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Test upload button - for debugging only */}
                <div className="bg-gray-800 p-4 rounded-md">
                    <h3 className="text-white font-medium mb-2">Troubleshooting</h3>
                    <p className="text-gray-400 text-sm mb-2">
                        If you're having trouble uploading, try this test button first to verify your file upload is working.
                    </p>
                    <button
                        type="button"
                        onClick={testUpload}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                    >
                        Test File Upload
                    </button>

                    {uploadProgress > 0 && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{uploadProgress}% uploaded</p>
                        </div>
                    )}
                </div>

                {/* Track details */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Track title"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a description (optional)"
                    />
                </div>

                <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">
                        Genre
                    </label>
                    <select
                        id="genre"
                        name="genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select a genre (optional)</option>
                        {genreOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* Tags input */}
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                        Tags
                    </label>
                    <div className="flex items-center">
                        <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add tags (press Enter to add)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag(e);
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Add
                        </button>
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <div
                                    key={tag}
                                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full flex items-center"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-gray-500 hover:text-gray-300"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                        Add up to 5 tags to help people discover your track (optional)
                    </p>
                </div>

                {/* Privacy setting */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Privacy
                    </label>
                    <div className="flex items-center space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="isPublic"
                                value="true"
                                className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-700 bg-gray-800"
                                checked={isPublic}
                                onChange={() => setIsPublic(true)}
                            />
                            <span className="ml-2 text-gray-300">Public</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="isPublic"
                                value="false"
                                className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-700 bg-gray-800"
                                checked={!isPublic}
                                onChange={() => setIsPublic(false)}
                            />
                            <span className="ml-2 text-gray-300">Private</span>
                        </label>
                    </div>
                </div>

                {/* Submit button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isLoading || !trackFile}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Uploading...' : 'Upload Track'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrackUpload;