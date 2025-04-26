import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, updateUser } from '../../auth/authSlice';
import profileService from '../../../services/profileService';
import { TrashIcon } from '@heroicons/react/24/outline';

const PortfolioManager = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('portfolio', file);
            formData.append('title', file.name);
            formData.append('description', '');

            const updatedUser = await profileService.addPortfolioItem(formData);
            dispatch(updateUser(updatedUser));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload file');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset file input
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const updatedUser = await profileService.deletePortfolioItem(itemId);
            dispatch(updateUser(updatedUser));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete item');
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Portfolio</h2>

            {error && (
                <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Upload button */}
            <div className="mb-6">
                <label className="block">
                    <span className="sr-only">Choose file</span>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        accept="image/*,audio/*,video/*"
                        className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-gray-800 file:text-white
                            hover:file:bg-gray-700
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </label>
                <p className="mt-2 text-sm text-gray-400">
                    Upload images, audio, or video files (max 10MB)
                </p>
            </div>

            {/* Portfolio items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user?.profile?.portfolio?.map((item) => (
                    <div
                        key={item._id}
                        className="bg-gray-800 rounded-lg overflow-hidden relative group"
                    >
                        {/* Thumbnail or media type indicator */}
                        <div className="aspect-w-16 aspect-h-9 bg-gray-700">
                            {item.mediaType === 'image' ? (
                                <img
                                    src={item.mediaUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center text-gray-400">
                                    {item.mediaType === 'audio' ? '🎵' : '🎬'}
                                </div>
                            )}
                        </div>

                        {/* Item info */}
                        <div className="p-4">
                            <h3 className="text-white font-medium truncate">{item.title}</h3>
                            <p className="text-gray-400 text-sm truncate">{item.description}</p>
                        </div>

                        {/* Delete button */}
                        <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="absolute top-2 right-2 p-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <TrashIcon className="h-4 w-4 text-white" />
                        </button>
                    </div>
                ))}
            </div>

            {(!user?.profile?.portfolio || user.profile.portfolio.length === 0) && (
                <p className="text-gray-400 text-center py-8">
                    No portfolio items yet. Upload some of your work!
                </p>
            )}
        </div>
    );
};

export default PortfolioManager;