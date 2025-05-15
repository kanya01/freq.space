// frontend/src/features/posts/components/PostForm.jsx
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, clearPostsError, selectPostsLoading, selectPostsError } from '../postsSlice';
import { selectUser } from '../../auth/authSlice';
import {
    XMarkIcon,
    PhotoIcon,
    MusicalNoteIcon,
    VideoCameraIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const PostForm = ({ onSuccess }) => {
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [validationError, setValidationError] = useState('');

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const isLoading = useSelector(selectPostsLoading);
    const apiError = useSelector(selectPostsError);
    const currentUser = useSelector(selectUser);

    // Handle text input change
    const handleContentChange = (e) => {
        setContent(e.target.value);
        if (validationError) setValidationError('');
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType =
                file.type.startsWith('image/') ||
                file.type.startsWith('audio/') ||
                file.type.startsWith('video/');

            const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB max

            return isValidType && isValidSize;
        });

        if (validFiles.length !== files.length) {
            setValidationError('Some files were invalid. Please upload images, audio, or video files under 20MB.');
        }

        // Set the valid files
        setMediaFiles(prev => [...prev, ...validFiles]);

        // Create previews
        validFiles.forEach(file => {
            const fileReader = new FileReader();
            fileReader.onload = (event) => {
                setMediaPreviews(prev => [
                    ...prev,
                    {
                        type: file.type.split('/')[0], // image, audio, video
                        url: event.target.result,
                        file
                    }
                ]);
            };
            fileReader.readAsDataURL(file);
        });
    };

    // Remove a media file
    const handleRemoveMedia = (index) => {
        setMediaPreviews(prev => prev.filter((_, i) => i !== index));
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Submit the post
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim() && mediaFiles.length === 0) {
            setValidationError('Please add some text or media to your post.');
            return;
        }

        dispatch(clearPostsError());

        const formData = new FormData();
        formData.append('content', content);
        formData.append('isPublic', isPublic);

        mediaFiles.forEach(file => {
            formData.append('media', file);
        });

        try {
            const resultAction = await dispatch(createPost(formData));

            if (createPost.fulfilled.match(resultAction)) {
                // Reset form on success
                setContent('');
                setMediaFiles([]);
                setMediaPreviews([]);

                // Callback
                if (onSuccess) onSuccess(resultAction.payload);
            }
        } catch (err) {
            console.error('Post creation failed:', err);
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
            {/* Error display */}
            {(validationError || apiError) && (
                <div className="mb-4 p-3 bg-red-900/50 rounded-md">
                    <p className="text-red-200 text-sm">{validationError || apiError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* User avatar and textarea */}
                <div className="flex space-x-3 mb-4">
                    <div className="flex-shrink-0">
                        {currentUser?.profile?.avatarUrl ? (
                            <img
                                src={currentUser.profile.avatarUrl}
                                alt={currentUser.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 font-medium">
                                    {currentUser?.username?.charAt(0).toUpperCase() || '?'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            placeholder="What's on your mind?"
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Media previews */}
                {mediaPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {mediaPreviews.map((media, index) => (
                            <div key={index} className="relative bg-gray-800 rounded-md overflow-hidden group">
                                <div className="aspect-w-16 aspect-h-9">
                                    {media.type === 'image' ? (
                                        <img
                                            src={media.url}
                                            alt="Preview"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : media.type === 'video' ? (
                                        <video
                                            src={media.url}
                                            className="object-cover w-full h-full"
                                            controls
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <MusicalNoteIcon className="h-12 w-12 text-gray-500" />
                                            <audio
                                                src={media.url}
                                                className="absolute bottom-0 w-full"
                                                controls
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveMedia(index)}
                                    className="absolute top-2 right-2 bg-gray-900/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Post actions */}
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,audio/*,video/*"
                            className="hidden"
                            multiple
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                            title="Add media"
                        >
                            <PhotoIcon className="h-5 w-5" />
                        </button>

                        {/* Privacy toggle */}
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className={`p-2 rounded-full transition-colors ${
                                isPublic
                                    ? 'text-green-500 hover:bg-green-900/20'
                                    : 'text-red-500 hover:bg-red-900/20'
                            }`}
                            title={isPublic ? 'Public - Everyone can see' : 'Private - Only you can see'}
                        >
                            <span className="text-xs font-medium">
                                {isPublic ? 'Public' : 'Private'}
                            </span>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (!content.trim() && mediaFiles.length === 0)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                        <span>{isLoading ? 'Posting...' : 'Post'}</span>
                        <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;