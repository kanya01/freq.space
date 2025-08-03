import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../services/api';
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

    // const { isUploading, uploadProgress } = useSelector((state) => state.content);
    const { loading: isUploading, uploadProgress, error } = useSelector((state) => state.content);


    // State management
    const [selectedType, setSelectedType] = useState(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState('');


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
        altText: ''
    });
    const [tagInput, setTagInput] = useState('');

    // Refs
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const dropZoneRef = useRef(null);

    // Content type configuration
    const contentTypes = [
        {
            type: 'image',
            label: 'Image',
            icon: PhotoIcon,
            accept: 'image/jpeg,image/png,image/gif,image/webp',
            maxSize: 10, // MB
            color: 'from-flame-50 to-flame-100',
            borderColor: 'border-flame-300',
            iconBg: 'bg-flame-100',
            iconColor: 'text-flame-600'
        },
        {
            type: 'video',
            label: 'Video',
            icon: VideoCameraIcon,
            accept: 'video/mp4,video/webm,video/ogg,video/quicktime',
            maxSize: 50, // MB
            maxDuration: 40, // seconds
            color: 'from-timberwolf-100 to-timberwolf-200',
            borderColor: 'border-timberwolf-400',
            iconBg: 'bg-timberwolf-200',
            iconColor: 'text-black-olive'
        },
        {
            type: 'audio',
            label: 'Audio',
            icon: MusicalNoteIcon,
            accept: 'audio/mpeg,audio/wav,audio/mp3,audio/ogg,audio/flac',
            maxSize: 30, // MB
            color: 'from-black-olive-100 to-black-olive-200',
            borderColor: 'border-black-olive-400',
            iconBg: 'bg-black-olive-100',
            iconColor: 'text-eerie-black'
        }
    ];

    // Drag and drop handlers
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.add('border-flame-500', 'bg-flame-50');
        }
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('border-flame-500', 'bg-flame-50');
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('border-flame-500', 'bg-flame-50');
        }

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && selectedType) {
            handleFileSelect(droppedFile);
        }
    }, [selectedType]);

    // File handling
    const handleFileSelect = async (selectedFile) => {
        setValidationError('');

        // Get content type config
        const typeConfig = contentTypes.find(t => t.type === selectedType);
        if (!typeConfig) return;

        // Validate file type
        const fileType = selectedFile.type.split('/')[0];
        if (fileType !== selectedType) {
            setValidationError(`Please select a valid ${selectedType} file`);
            return;
        }

        // Validate file size
        const maxSizeBytes = typeConfig.maxSize * 1024 * 1024;
        if (selectedFile.size > maxSizeBytes) {
            setValidationError(`File size must be less than ${typeConfig.maxSize}MB`);
            return;
        }

        setFile(selectedFile);

        // Generate preview based on type
        switch (selectedType) {
            case 'image':
                const imageUrl = URL.createObjectURL(selectedFile);
                setFilePreview(imageUrl);
                // Auto-fill title from filename
                if (!formData.title) {
                    const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
                    setFormData(prev => ({ ...prev, title: nameWithoutExt }));
                }
                break;

            case 'video':
                const videoUrl = URL.createObjectURL(selectedFile);
                setFilePreview(videoUrl);
                // Validate video duration
                validateVideoDuration(selectedFile);
                break;

            case 'audio':
                const audioUrl = URL.createObjectURL(selectedFile);
                setFilePreview(audioUrl);
                // Generate waveform
                try {
                    const waveform = await generateWaveformData(selectedFile);
                    setWaveformData(waveform);
                } catch (err) {
                    console.error('Error generating waveform:', err);
                }
                break;
        }
    };

    // Video duration validation
    const validateVideoDuration = (videoFile) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            setVideoDuration(video.duration);
            if (video.duration > 40) {
                setValidationError('Video must be 40 seconds or less');
                setFile(null);
                setFilePreview(null);
            }
        };
        video.src = URL.createObjectURL(videoFile);
    };

    // Handle cover image
    const handleCoverChange = (e) => {
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

        // setIsUploading(true);
        // setUploadProgress(0);

        try {
            const uploadData = new FormData();
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

            // REMOVE THE DIRECT API CALL - Only use Redux action
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

            setValidationError(error.response?.data?.message || 'Failed to upload content. Please try again.');
            // setIsUploading(false);
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
                                    className={`group relative overflow-hidden rounded-xl p-8 bg-gradient-to-br ${type.color} border-2 ${type.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}
                                >
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className={`w-20 h-20 ${type.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className={`h-10 w-10 ${type.iconColor}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-eerie-black">{type.label}</h3>
                                        <p className="text-sm text-black-olive-600">
                                            Max {type.maxSize}MB
                                            {type.maxDuration && ` • ${type.maxDuration}s max`}
                                        </p>
                                    </div>

                                    <div className="absolute top-2 right-2">
                                        <SparklesIcon className="h-5 w-5 text-flame-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Upload Form */}
            {selectedType && (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* File Upload Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* File Dropzone */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-timberwolf-200">
                            <h3 className="text-xl font-semibold text-eerie-black mb-4">
                                Upload {contentTypes.find(t => t.type === selectedType)?.label}
                            </h3>

                            <div
                                ref={dropZoneRef}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                                    file
                                        ? 'border-flame-400 bg-flame-50'
                                        : 'border-timberwolf-300 hover:border-flame-300 hover:bg-timberwolf-50'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={contentTypes.find(t => t.type === selectedType)?.accept}
                                    onChange={(e) => handleFileSelect(e.target.files[0])}
                                    className="hidden"
                                />

                                {!file ? (
                                    <>
                                        <CloudArrowUpIcon className="h-16 w-16 text-black-olive-400 mx-auto mb-4" />
                                        <p className="text-lg font-medium text-eerie-black mb-2">
                                            Drag and drop or click to browse
                                        </p>
                                        <p className="text-sm text-black-olive-600">
                                            {contentTypes.find(t => t.type === selectedType)?.accept.split(',').join(', ')}
                                        </p>
                                    </>
                                ) : (
                                    <div>
                                        {/* File preview based on type */}
                                        {selectedType === 'image' && filePreview && (
                                            <div className="relative">
                                                <img
                                                    src={editedImage ? URL.createObjectURL(editedImage) : filePreview}
                                                    alt="Preview"
                                                    className="max-h-64 mx-auto rounded-lg shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowImageEditor(true);
                                                    }}
                                                    className="absolute top-2 right-2 p-2 bg-eerie-black text-white rounded-lg hover:bg-black-olive transition-colors"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}

                                        {selectedType === 'video' && filePreview && (
                                            <VideoPreview
                                                src={filePreview}
                                                duration={videoDuration}
                                                maxDuration={40}
                                            />
                                        )}

                                        {selectedType === 'audio' && filePreview && (
                                            <AudioWaveform
                                                src={filePreview}
                                                waveformData={waveformData}
                                            />
                                        )}

                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-eerie-black">{file.name}</p>
                                            <p className="text-xs text-black-olive-600">
                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                                setFilePreview(null);
                                                setEditedImage(null);
                                                setWaveformData(null);
                                            }}
                                            className="mt-4 inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Cover Image Upload (for video/audio) */}
                            {(selectedType === 'video' || selectedType === 'audio') && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                        Cover Image (optional)
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            ref={coverInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverChange}
                                            className="hidden"
                                        />

                                        {coverPreview ? (
                                            <div className="relative">
                                                <img
                                                    src={coverPreview}
                                                    alt="Cover"
                                                    className="h-20 w-20 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCoverFile(null);
                                                        setCoverPreview('');
                                                    }}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => coverInputRef.current?.click()}
                                                className="flex items-center px-4 py-2 bg-timberwolf-100 text-black-olive-700 rounded-lg hover:bg-timberwolf-200 transition-colors"
                                            >
                                                <PhotoIcon className="h-4 w-4 mr-2" />
                                                Add Cover
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Metadata Form */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-timberwolf-200">
                            <h3 className="text-xl font-semibold text-eerie-black mb-4">Details</h3>

                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-3 bg-timberwolf-50 border border-timberwolf-300 rounded-lg text-eerie-black placeholder-black-olive-500 focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-flame-500 transition-all"
                                        placeholder={`${selectedType === 'image' ? 'Image' : selectedType === 'video' ? 'Video' : 'Track'} title`}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-timberwolf-50 border border-timberwolf-300 rounded-lg text-eerie-black placeholder-black-olive-500 focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-flame-500 transition-all resize-none"
                                        placeholder="Tell people about your content..."
                                    />
                                </div>

                                {/* Type-specific fields */}
                                {selectedType === 'audio' && (
                                    <div>
                                        <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                            Genre
                                        </label>
                                        <select
                                            value={formData.genre}
                                            onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                                            className="w-full px-4 py-3 bg-timberwolf-50 border border-timberwolf-300 rounded-lg text-eerie-black focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-flame-500 transition-all"
                                        >
                                            <option value="">Select a genre (optional)</option>
                                            {genreOptions.map(genre => (
                                                <option key={genre} value={genre}>{genre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {selectedType === 'image' && (
                                    <div>
                                        <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                            Alt Text
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.altText}
                                            onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                                            className="w-full px-4 py-3 bg-timberwolf-50 border border-timberwolf-300 rounded-lg text-eerie-black placeholder-black-olive-500 focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-flame-500 transition-all"
                                            placeholder="Describe the image for accessibility"
                                        />
                                    </div>
                                )}

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-black-olive-700 mb-2">
                                        Tags
                                    </label>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="relative flex-1">
                                            <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black-olive-500" />
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddTag();
                                                    }
                                                }}
                                                className="w-full pl-10 pr-4 py-3 bg-timberwolf-50 border border-timberwolf-300 rounded-lg text-eerie-black placeholder-black-olive-500 focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-flame-500 transition-all"
                                                placeholder="Add tags (press Enter)"
                                                disabled={formData.tags.length >= 5}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            disabled={!tagInput.trim() || formData.tags.length >= 5}
                                            className="px-4 py-3 bg-flame-600 text-white rounded-lg hover:bg-flame-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center px-3 py-1 bg-timberwolf-100 text-black-olive-700 rounded-full text-sm border border-timberwolf-300"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(tag)}
                                                        className="ml-2 text-black-olive-500 hover:text-red-600"
                                                    >
                                                        <XMarkIcon className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-black-olive-500 mt-2">
                                        Add up to 5 tags to help people discover your content
                                    </p>
                                </div>

                                {/* Privacy Setting */}
                                <div>
                                    <label className="block text-sm font-medium text-black-olive-700 mb-3">
                                        Privacy
                                    </label>
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={formData.isPublic}
                                                onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center transition-all ${
                                                formData.isPublic
                                                    ? 'border-flame-500 bg-flame-500'
                                                    : 'border-timberwolf-400'
                                            }`}>
                                                {formData.isPublic && (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span className="text-eerie-black">Public</span>
                                        </label>

                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={!formData.isPublic}
                                                onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center transition-all ${
                                                !formData.isPublic
                                                    ? 'border-flame-500 bg-flame-500'
                                                    : 'border-timberwolf-400'
                                            }`}>
                                                {!formData.isPublic && (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span className="text-eerie-black">Private</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {validationError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700 text-sm font-medium">{validationError}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-4 bg-white border-2 border-eerie-black text-eerie-black rounded-xl hover:bg-timberwolf-100 transition-colors font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isUploading || !file || !formData.title.trim()}
                            className="relative px-8 py-4 bg-eerie-black text-floral-white rounded-xl hover:bg-black-olive transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
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