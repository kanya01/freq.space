// frontend/src/features/profile/components/ProfileView.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../auth/authSlice';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileTracks from './ProfileTracks';
import ProfilePortfolio from './ProfilePortfolio';
import ProfileServices from './ProfileServices';
import ProfileReviews from './ProfileReviews';
import { PlusIcon } from '@heroicons/react/24/outline';

const ProfileView = ({ user, isOwnProfile = false }) => {
    const [activeTab, setActiveTab] = useState('tracks');
    const currentUser = useSelector(selectUser);

    // Only show the upload button if viewing own profile and logged in
    const showUploadButton = isOwnProfile && currentUser && currentUser._id === user?._id;

    return (
        <div className="min-h-screen bg-black text-gray-100">
            <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Action buttons for own profile */}
                {isOwnProfile && (
                    <div className="mb-6 flex justify-end space-x-4">
                        <Link
                            to="/profile/edit"
                            className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
                        >
                            Edit Profile
                        </Link>

                        <Link
                            to="/upload"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            Upload Track
                        </Link>
                    </div>
                )}

                {/* Profile navigation tabs */}
                <div className="border-b border-gray-800 mb-6">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('tracks')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'tracks'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            Tracks
                        </button>
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'about'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'portfolio'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            Portfolio
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'services'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            Services
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'reviews'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            Reviews
                        </button>
                    </nav>
                </div>

                {/* Tab content */}
                <div>
                    {activeTab === 'tracks' && (
                        <ProfileTracks
                            userId={user._id}
                            isOwnProfile={isOwnProfile}
                            showUploadButton={showUploadButton}
                        />
                    )}

                    {activeTab === 'about' && (
                        <ProfileAbout user={user} />
                    )}

                    {activeTab === 'portfolio' && (
                        <ProfilePortfolio user={user} isOwnProfile={isOwnProfile} />
                    )}

                    {activeTab === 'services' && (
                        <ProfileServices user={user} isOwnProfile={isOwnProfile} />
                    )}

                    {activeTab === 'reviews' && (
                        <ProfileReviews user={user} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;