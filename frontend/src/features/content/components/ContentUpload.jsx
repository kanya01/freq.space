import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadContent } from '../contentSlice';
import {
    CloudArrowUpIcon,
    PhotoIcon,
    VideoCameraIcon,
    MusicalNoteIcon,
    XMarkIcon,
    TagIcon,
    ArrowLeftIcon,
    SparklesIcon,
    PencilIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import ImageEditor from './ImageEditor';
import VideoPreview from './VideoPreview';
import AudioWaveform from './AudioWaveform';
import { generateWaveformData } from '../../../utils/audioUtils';

const ContentUpload = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading: isUploading, uploadProgress, error } = useSelector((state) => state.content);

    // State management
    const [selectedType, setSelectedType] = useState(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState('');
    const [tagInput, setTagInput] = useState('');

    const [validationError, setValidationError] = useState('');
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [editedImage, setEditedImage] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [waveformData, setWaveformData] = useState(null);

    // Form fields
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: [],
        isPublic: true,
        // Type-specific fields
        genre: '',
        altText: '',
        location: '',
        collaborators: '',
        equipment: '',
        // Video specific
        resolution: '',
        frameRate: '',
        // Audio specific
        bpm: '',
        key: '',
        instruments: ''
    });

    // File input ref
    const fileInputRef = useRef(null);

    const contentTypes = [
        {
            type: 'image',
            label: 'Image',
            icon: PhotoIcon,
            description: 'Photography, artwork, graphics',
            accept: 'image/*',
            maxSize: '10MB'
        },
        {
            type: 'video',
            label: 'Video',
            icon: VideoCameraIcon,
            description: 'Films, animations, tutorials',
            accept: 'video/*',
            maxSize: '100MB'
        },
        {
            type: 'audio',
            label: 'Audio',
            icon: MusicalNoteIcon,
            description: 'Music, podcasts, sound effects',
            accept: 'audio/*',
            maxSize: '50MB'
        }
    ];

    const MAX_FILE_SIZES = {
        image: 10 * 1024 * 1024, // 10MB
        video: 100 * 1024 * 1024, // 100MB
        audio: 50 * 1024 * 1024 // 50MB
    };

    // File handling
    const handleFileSelect = useCallback(async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        console.log('[ContentUpload] File selected:', {
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type
        });

        // Validate file size
        const maxSize = MAX_FILE_SIZES[selectedType];
        if (selectedFile.size > maxSize) {
            setValidationError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
            return;
        }

        // Validate file type
        const contentType = contentTypes.find(t => t.type === selectedType);
        if (!selectedFile.type.startsWith(selectedType + '/')) {
            setValidationError(`Please select a valid ${selectedType} file`);
            return;
        }

        setValidationError('');
        setFile(selectedFile);

        // Create preview
        if (selectedType === 'image') {
            const reader = new FileReader();
            reader.onload = (e) => setFilePreview(e.target.result);
            reader.readAsDataURL(selectedFile);
        } else if (selectedType === 'video') {
            const videoURL = URL.createObjectURL(selectedFile);
            setFilePreview(videoURL);
        } else if (selectedType === 'audio') {
            const audioURL = URL.createObjectURL(selectedFile);
            setFilePreview(audioURL);

            // Generate waveform data
            try {
                const waveform = await generateWaveformData(selectedFile);
                setWaveformData(waveform);
            } catch (error) {
                console.warn('Failed to generate waveform:', error);
            }
        }

        // Auto-populate title from filename
        if (!formData.title) {
            const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
            setFormData(prev => ({ ...prev, title: nameWithoutExt }));
        }
    }, [selectedType, formData.title]);

    const handleCoverImageSelect = (e) => {
        const coverImg = e.target.files[0];
        if (!coverImg) return;

        if (!coverImg.type.startsWith('image/')) {
            setValidationError('Cover must be an image file');
            return;
        }

        setCoverFile(coverImg);
        const reader = new FileReader();
        reader.onload = (e) => {
            setCoverPreview(e.target.result);
        };
        reader.readAsDataURL(coverImg);
    };

    // Tag handling
    const handleAddTag = () => {
        const trimmedTag = tagInput.trim().toLowerCase();
        if (!trimmedTag || formData.tags.length >= 5) return;

        if (!formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, trimmedTag]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[ContentUpload] Form submission started');

        console.log('[ContentUpload] File details:', {
            file: file,
            fileName: file?.name,
            fileSize: file?.size,
            fileType: file?.type
        });

        if (!file) {
            setValidationError('Please select a file to upload');
            return;
        }

        if (!formData.title.trim()) {
            setValidationError('Title is required');
            return;
        }

        try {
            const uploadData = new FormData();

            // Add the main media file
            uploadData.append('media', file);
            uploadData.append('title', formData.title);
            uploadData.append('description', formData.description);
            uploadData.append('mediaType', selectedType);
            uploadData.append('tags', JSON.stringify(formData.tags));
            uploadData.append('isPublic', formData.isPublic.toString());

            console.log('[ContentUpload] FormData prepared, starting upload...');

            // Add type-specific fields
            if (selectedType === 'audio' && formData.genre) {
                uploadData.append('genre', formData.genre);
            }
            if (selectedType === 'image' && formData.altText) {
                uploadData.append('altText', formData.altText);
            }

            // Add cover image if provided
            if (coverFile) {
                uploadData.append('cover', coverFile);
            }

            // Log FormData contents for debugging
            console.log('[ContentUpload] FormData contents:');
            for (let [key, value] of uploadData.entries()) {
                console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
            }

            // Use Redux action for upload
            const result = await dispatch(uploadContent(uploadData)).unwrap();
            console.log('[ContentUpload] Upload successful:', result);

            // Navigate to profile after successful upload
            setTimeout(() => {
                navigate('/profile');
            }, 500);

        } catch (error) {
            console.error('[ContentUpload] Upload failed:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            setValidationError(error.message || 'Failed to upload content. Please try again.');
        }
    };

    const genreOptions = [
        'Alternative', 'Ambient', 'Blues', 'Classical', 'Country',
        'Dance', 'Electronic', 'Folk', 'Funk', 'Hip-Hop', 'House',
        'Indie', 'Jazz', 'Latin', 'Metal', 'Pop', 'R&B', 'Rock',
        'Soul', 'Techno', 'World'
    ];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center space-x-2 text-black-olive-600 hover:text-eerie-black transition-colors mb-6"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    <span>Back</span>
                </button>

                <h1 className="text-4xl font-bold text-eerie-black mb-2">Upload Content</h1>
                <p className="text-xl text-black-olive-600">Share your creative work with the community</p>
            </div>

            {/* Content Type Selector */}
            {!selectedType && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-timberwolf-200">
                    <h2 className="text-2xl font-semibold text-eerie-black mb-6 text-center">
                        What would you like to upload?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contentTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.type}
                                    onClick={() => setSelectedType(type.type)}
                                    className="group p-8 border-2 border-timberwolf-200 rounded-xl hover:border-flame-400 hover:bg-flame-50 transition-all duration-200 text-center"
                                >
                                    <div className="w-16 h-16 bg-timberwolf-100 group-hover:bg-flame-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                                        <Icon className="h-8 w-8 text-black-olive-600 group-hover:text-flame-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-eerie-black mb-2">{type.label}</h3>
                                    <p className="text-black-olive-600 text-sm mb-3">{type.description}</p>
                                    <span className="text-xs text-black-olive-500">Max size: {type.maxSize}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Upload Form */}
            {selectedType && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-timberwolf-200">
                    {/* Header */}
                    <div className="p-6 border-b border-timberwolf-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {React.createElement(contentTypes.find(t => t.type === selectedType)?.icon, {
                                    className: "h-6 w-6 text-flame-600"
                                })}
                                <h2 className="text-xl font-semibold text-eerie-black">
                                    Upload {contentTypes.find(t => t.type === selectedType)?.label}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedType(null);
                                    setFile(null);
                                    setFilePreview(null);
                                    setFormData({
                                        title: '',
                                        description: '',
                                        tags: [],
                                        isPublic: true,
                                        genre: '',
                                        altText: '',
                                        location: '',
                                        collaborators: '',
                                        equipment: '',
                                        resolution: '',
                                        frameRate: '',
                                        bpm: '',
                                        key: '',
                                        instruments: ''
                                    });
                                }}
                                className="text-black-olive-500 hover:text-eerie-black transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Error Display */}
                        {(validationError || error) && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 text-sm">{validationError || error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - File Upload */}
                            <div className="space-y-6">
                                {/* File Upload Area */}
                                <div>
                                    <label className="block text-sm font-medium text-eerie-black mb-3">
                                        Select File *
                                    </label>
                                    {!file ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-timberwolf-300 rounded-xl p-8 text-center cursor-pointer hover:border-flame-400 hover:bg-flame-50 transition-colors"
                                        >
                                            <CloudArrowUpIcon className="h-12 w-12 text-black-olive-400 mx-auto mb-4" />
                                            <p className="text-black-olive-600 mb-2">Click to select a file</p>
                                            <p className="text-sm text-black-olive-500">
                                                {contentTypes.find(t => t.type === selectedType)?.accept} • Max {contentTypes.find(t => t.type === selectedType)?.maxSize}
                                            </p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept={contentTypes.find(t => t.type === selectedType)?.accept}
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* File Preview */}
                                            <div className="border border-timberwolf-200 rounded-xl p-4">
                                                {selectedType === 'image' && filePreview && (
                                                    <div className="relative">
                                                        <img
                                                            src={filePreview}
                                                            alt="Preview"
                                                            className="w-full h-48 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowImageEditor(true)}
                                                            className="absolute top-2 right-2 bg-white rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            <PencilIcon className="h-4 w-4 text-black-olive-600" />
                                                        </button>
                                                    </div>
                                                )}

                                                {selectedType === 'video' && filePreview && (
                                                    <VideoPreview
                                                        src={filePreview}
                                                        onDurationChange={setVideoDuration}
                                                    />
                                                )}

                                                {selectedType === 'audio' && filePreview && (
                                                    <AudioWaveform
                                                        src={filePreview}
                                                        waveformData={waveformData}
                                                    />
                                                )}
                                            </div>

                                            {/* File Info */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-black-olive-600">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFile(null);
                                                        setFilePreview(null);
                                                        setEditedImage(null);
                                                        setWaveformData(null);
                                                    }}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-eerie-black mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-3 border border-timberwolf-300 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent transition-colors"
                                        placeholder="Enter a title for your content"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-eerie-black mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-timberwolf-300 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="Describe your content..."
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-eerie-black mb-2">
                                        Tags (Max 5)
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex space-x-2">
                                            <div className="relative flex-1">
                                                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black-olive-500" />
                                                <input
                                                    type="text"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                                    className="w-full pl-10 pr-4 py-2 border border-timberwolf-300 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent transition-colors"
                                                    placeholder="Add a tag"
                                                    disabled={formData.tags.length >= 5}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddTag}
                                                disabled={!tagInput.trim() || formData.tags.length >= 5}
                                                className="px-4 py-2 bg-flame-600 text-white rounded-lg hover:bg-flame-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {formData.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 bg-flame-100 text-flame-700 rounded-full text-sm"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className="ml-2 text-flame-500 hover:text-flame-700"
                                                        >
                                                            <XMarkIcon className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Audio-specific fields */}
                                {selectedType === 'audio' && (
                                    <div>
                                        <label className="block text-sm font-medium text-eerie-black mb-2">
                                            Genre
                                        </label>
                                        <select
                                            value={formData.genre}
                                            onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                                            className="w-full px-4 py-3 border border-timberwolf-300 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="">Select a genre</option>
                                            {genreOptions.map(genre => (
                                                <option key={genre} value={genre}>{genre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Image-specific fields */}
                                {selectedType === 'image' && (
                                    <div>
                                        <label className="block text-sm font-medium text-eerie-black mb-2">
                                            Alt Text (for accessibility)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.altText}
                                            onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                                            className="w-full px-4 py-3 border border-timberwolf-300 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent transition-colors"
                                            placeholder="Describe the image for screen readers"
                                        />
                                    </div>
                                )}

                                {/* Privacy Settings */}
                                <div>
                                    <label className="block text-sm font-medium text-eerie-black mb-3">
                                        Privacy
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="privacy"
                                                checked={formData.isPublic}
                                                onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                                                className="h-4 w-4 text-flame-600 focus:ring-flame-500 border-timberwolf-300"
                                            />
                                            <span className="ml-2 text-sm text-eerie-black">Public - Anyone can view</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="privacy"
                                                checked={!formData.isPublic}
                                                onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                                                className="h-4 w-4 text-flame-600 focus:ring-flame-500 border-timberwolf-300"
                                            />
                                            <span className="ml-2 text-sm text-eerie-black">Private - Only you can view</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-timberwolf-200 mt-8">
                            <button
                                type="submit"
                                disabled={isUploading || !file}
                                className="relative px-8 py-3 bg-flame-600 text-white rounded-lg hover:bg-flame-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium overflow-hidden"
                            >
                                {isUploading ? (
                                    <>
                                        <span className="relative z-10">Uploading... {uploadProgress}%</span>
                                        <div
                                            className="absolute inset-0 bg-flame-600 transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <CloudArrowUpIcon className="h-5 w-5 inline mr-2" />
                                        Upload {selectedType && contentTypes.find(t => t.type === selectedType)?.label}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Image Editor Modal */}
            {showImageEditor && filePreview && (
                <ImageEditor
                    imageUrl={filePreview}
                    onSave={(editedBlob) => {
                        setEditedImage(editedBlob);
                        setShowImageEditor(false);
                    }}
                    onClose={() => setShowImageEditor(false)}
                />
            )}
        </div>
    );
};

export default ContentUpload;