// frontend/src/features/profile/components/ProfileHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/24/outline';

const ProfileHeader = ({ user, isOwnProfile = false }) => {
    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="h-64 bg-gray-800 relative">
                {user.profile.coverImageUrl ? (
                    <img
                        src={user.profile.coverImageUrl}
                        alt="Cover"
                        className="w-full h-full object-cover"
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
                <div className="-mt-16 sm:-mt-20 sm:flex sm:items-end sm:space-x-5">
                    {/* Avatar with Edit Option */}
                    <div className="relative flex">
                        {user.profile.avatarUrl ? (
                            <img
                                src={user.profile.avatarUrl}
                                alt={user.username}
                                className="h-32 w-32 rounded-full ring-4 ring-black"
                            />
                        ) : (
                            <div className="h-32 w-32 rounded-full ring-4 ring-black bg-gray-700 flex items-center justify-center">
                                <span className="text-4xl font-bold text-white">
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
                    <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                            <h1 className="text-2xl font-bold text-white truncate">
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