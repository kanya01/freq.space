import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    uploadTrack,
    clearError,
    selectLoading,
    selectError
} from '../tracksSlice';
import { ArrowLeftIcon, CloudArrowUpIcon, PhotoIcon, XMarkIcon, TagIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

const TrackUpload = () => {
    // Redux hooks
    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoading);
    const apiError = useSelector(selectError);

    // Navigation hook
    const navigate = useNavigate();

    // Component state
    const [trackFile, setTrackFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [validationError, setValidationError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const trackInputRef = useRef(null);
    const coverInputRef = useRef(null);

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
        setValidationError('');

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setCoverPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle adding a tag
    const handleAddTag = () => {
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

    // Handle keypress for tag input
    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // Handle removing a tag
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Test upload function - using the existing test endpoint
    const testUpload = async () => {
        if (!trackFile) {
            setValidationError('Please select an audio file to test');
            return;
        }

        const formData = new FormData();
        formData.append('track', trackFile);

        try {
            // Clear previous errors
            setValidationError('');
            dispatch(clearError());

            alert('Test upload initiated. This would connect to /api/v1/tracks/test-upload in a real implementation.');
            // In a real implementation, you would use your API client here
        } catch (error) {
            console.error('Test upload failed:', error);
            setValidationError(`Test upload failed: ${error.message}`);
        }
    };

    // Handle form submission - Using the actual Redux uploadTrack action
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

        // Append files - make sure these field names match what the backend expects
        formData.append('track', trackFile);
        if (coverFile) {
            formData.append('trackCover', coverFile);
        }

        // Dispatch Redux action to upload track
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

                // Navigate to the new track page
                navigate(`/tracks/${resultAction.payload._id}`);
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
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
                {/* Back button - using React Router navigation */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back</span>
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-8">Upload Track</h1>

                {/* Error display - connecting with validation errors and Redux errors */}
                {(validationError || apiError) && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-lg">
                        <p className="text-red-300 text-sm">{validationError || apiError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Upload dropzones section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Track upload dropzone */}
                        <div
                            className={`
                relative group cursor-pointer rounded-xl overflow-hidden
                ${trackFile
                                ? 'bg-gradient-to-br from-blue-900/40 to-gray-900 shadow-lg shadow-blue-900/10'
                                : 'bg-gradient-to-br from-gray-800/50 to-gray-900 hover:from-gray-800/70 hover:to-gray-900'}
                transition-all duration-300 border border-gray-800 hover:border-gray-700
              `}
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

                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                {trackFile ? (
                                    <>
                                        <div className="mb-4 p-3 rounded-full bg-blue-600/20 text-blue-400">
                                            <MusicalNoteIcon className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-white text-lg font-medium mb-1">{trackFile.name}</h3>
                                        <p className="text-gray-400 text-sm">
                                            {(trackFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <button
                                            type="button"
                                            className="mt-4 flex items-center px-3 py-1.5 bg-red-900/30 text-red-400 rounded-full text-sm hover:bg-red-900/50 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTrackFile(null);
                                                if (trackInputRef.current) trackInputRef.current.value = '';
                                            }}
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-1" />
                                            Remove
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-4 p-3 rounded-full bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-300 transition-colors">
                                            <CloudArrowUpIcon className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-white text-lg font-medium mb-1">Select Audio Track</h3>
                                        <p className="text-gray-400 text-sm">
                                            MP3, WAV, OGG, or FLAC (max 30MB)
                                        </p>
                                        <p className="mt-3 text-gray-500 text-xs">
                                            Drag and drop or click to browse
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Cover image upload dropzone */}
                        <div
                            className={`
                relative group cursor-pointer rounded-xl overflow-hidden
                ${coverFile
                                ? 'bg-gradient-to-br from-purple-900/30 to-gray-900 shadow-lg shadow-purple-900/10'
                                : 'bg-gradient-to-br from-gray-800/50 to-gray-900 hover:from-gray-800/70 hover:to-gray-900'}
                transition-all duration-300 border border-gray-800 hover:border-gray-700
              `}
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

                            {coverPreview ? (
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                        <button
                                            type="button"
                                            className="flex items-center px-3 py-1.5 bg-red-900/60 text-white rounded-full text-sm hover:bg-red-900/80 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCoverFile(null);
                                                setCoverPreview('');
                                                if (coverInputRef.current) coverInputRef.current.value = '';
                                            }}
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-1" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                    <div className="mb-4 p-3 rounded-full bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-300 transition-colors">
                                        <PhotoIcon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-white text-lg font-medium mb-1">Cover Image</h3>
                                    <p className="text-gray-400 text-sm">
                                        JPG, PNG, or GIF (max 5MB)
                                    </p>
                                    <p className="mt-3 text-gray-500 text-xs">
                                        Optional
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Track details section */}
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-800">
                        <h2 className="text-xl font-medium text-white mb-6">Track Details</h2>

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Track title"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Tell listeners about your track (optional)"
                                />
                            </div>

                            {/* Genre */}
                            <div>
                                <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
                                    Genre
                                </label>
                                <select
                                    id="genre"
                                    name="genre"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                                >
                                    <option value="">Select a genre (optional)</option>
                                    {genreOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                                    Tags
                                </label>
                                <div className="flex items-center">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <TagIcon className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="tags"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleTagKeyPress}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Add tags (press Enter to add)"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                                        disabled={!tagInput.trim() || tags.length >= 5}
                                    >
                                        Add
                                    </button>
                                </div>

                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {tags.map((tag) => (
                                            <div
                                                key={tag}
                                                className="group flex items-center px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700 hover:border-blue-500 transition-colors"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-2 h-4 w-4 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center hover:bg-red-900 hover:text-white transition-colors"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p className="text-gray-500 text-xs mt-2">
                                    Add up to 5 tags to help people discover your track
                                </p>
                            </div>

                            {/* Privacy setting */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Privacy
                                </label>
                                <div className="flex items-center space-x-6">
                                    <label className="relative flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isPublic"
                                            value="true"
                                            checked={isPublic}
                                            onChange={() => setIsPublic(true)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 mr-2 rounded-full border ${isPublic ? 'border-blue-500 bg-blue-500' : 'border-gray-600'} flex items-center justify-center`}>
                                            {isPublic && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </div>
                                        <span className="text-white">Public</span>
                                    </label>

                                    <label className="relative flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isPublic"
                                            value="false"
                                            checked={!isPublic}
                                            onChange={() => setIsPublic(false)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 mr-2 rounded-full border ${!isPublic ? 'border-blue-500 bg-blue-500' : 'border-gray-600'} flex items-center justify-center`}>
                                            {!isPublic && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </div>
                                        <span className="text-white">Private</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Troubleshooting section */}
                    <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-800">
                        <h2 className="text-lg font-medium text-white mb-3">Troubleshooting</h2>
                        <p className="text-gray-400 text-sm mb-4">
                            If you're having trouble uploading, try testing your file upload first.
                        </p>
                        <button
                            type="button"
                            onClick={testUpload}
                            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Test File Upload
                        </button>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isLoading || !trackFile || !title.trim()}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isLoading ? 'Uploading...' : 'Upload Track'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TrackUpload;