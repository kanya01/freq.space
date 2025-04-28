/// frontend/src/features/profile/components/ProfileView.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfilePortfolio from './ProfilePortfolio';
import ProfileServices from './ProfileServices';
import ProfileReviews from './ProfileReviews';

const ProfileView = ({ user, isOwnProfile = false }) => {
    return (
        <div className="min-h-screen bg-black text-gray-100">
            <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Edit Profile Button for own profile */}
                {isOwnProfile && (
                    <div className="mb-6 flex justify-end">
                        <Link
                            to="/profile/edit"
                            className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
                        >
                            Edit Profile
                        </Link>
                    </div>
                )}

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-8 space-y-6">
                        <ProfileAbout user={user} />
                        <ProfilePortfolio user={user} isOwnProfile={isOwnProfile} />
                        <ProfileServices user={user} isOwnProfile={isOwnProfile} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <ProfileReviews user={user} />
                        {/* Add more sidebar components here if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;