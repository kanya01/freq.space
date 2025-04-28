// frontend/src/features/profile/components/ProfileHeader.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/24/outline';

const ProfileHeader = ({ user, isOwnProfile = false }) => {
    const [avatarError, setAvatarError] = useState(false);
    const [coverError, setCoverError] = useState(false);

    // Use absolute URLs for images - very important!
    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // Make sure we use the full URL including http://localhost:5001
        return `http://localhost:5001${url}`;
    };

    const avatarUrl = !avatarError ? getFullUrl(user.profile.avatarUrl) : null;
    const coverImageUrl = !coverError ? getFullUrl(user.profile.coverImageUrl) : null;

    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="h-48 sm:h-64 bg-gray-800 relative">
                {coverImageUrl ? (
                    <img
                        src={coverImageUrl}
                        alt="Cover"
                        className="w-full h-full object-cover"
                        onError={() => setCoverError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
                )}

                {/* Edit Cover Button */}
                {isOwnProfile && (
                    <Link
                        to="/profile/edit"
                        className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
                    >
                        <PencilIcon className="h-5 w-5 text-white" />
                    </Link>
                )}
            </div>

            {/* Profile Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex flex-col sm:flex-row sm:items-end sm:space-x-5 pb-8">
                    {/* Avatar */}
                    <div className="relative -mt-16 sm:-mt-20">
                        {avatarUrl && !avatarError ? (
                            <img
                                src={avatarUrl}
                                alt={user.username}
                                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-black object-cover"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-black bg-gray-700 flex items-center justify-center">
                                <span className="text-3xl sm:text-4xl font-bold text-white">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}

                        {/* Edit Avatar Button */}
                        {isOwnProfile && (
                            <Link
                                to="/profile/edit"
                                className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
                            >
                                <PencilIcon className="h-4 w-4 text-white" />
                            </Link>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="mt-6 sm:mt-0 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                                {user.profile.firstName} {user.profile.lastName}
                            </h1>
                            <p className="text-lg text-gray-400">@{user.username}</p>
                            {user.profile.userType && (
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-800 text-gray-200 mt-2">
                                    {user.profile.userType}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;