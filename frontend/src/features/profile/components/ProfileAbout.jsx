// frontend/src/features/profile/components/ProfileAbout.jsx
import React from 'react';
import { MapPinIcon, StarIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import PostFeed from '../../posts/components/PostFeed';

const ProfileAbout = ({ user, isOwnProfile = false }) => {
    return (
        <div className="space-y-8">
            {/* Basic info cards in a row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Location */}
                <div className="bg-gray-900/30 p-5 rounded-lg">
                    <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Location</p>
                            <p className="text-white">
                                {user.profile.location?.city || 'London'}, {user.profile.location?.country || 'United Kingdom'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Experience */}
                <div className="bg-gray-900/30 p-5 rounded-lg">
                    <div className="flex items-start">
                        <StarIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Experience</p>
                            <p className="text-white">{user.profile.experienceLevel || 'Maestro'}</p>
                        </div>
                    </div>
                </div>

                {/* Profession */}
                <div className="bg-gray-900/30 p-5 rounded-lg">
                    <div className="flex items-start">
                        <MusicalNoteIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Profession</p>
                            <p className="text-white">{user.profile.userType || 'Producer'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills section */}
            <div className="bg-gray-900/30 p-5 rounded-lg">
                <h3 className="text-xs text-gray-500 uppercase mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {user.profile.skills && user.profile.skills.length > 0 ? (
                        user.profile.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-900 rounded-md text-sm text-gray-300"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <>
                            <span className="px-3 py-1 bg-gray-900 rounded-md text-sm text-gray-300">
                                Music Production
                            </span>
                            <span className="px-3 py-1 bg-gray-900 rounded-md text-sm text-gray-300">
                                Arrangement
                            </span>
                            <span className="px-3 py-1 bg-gray-900 rounded-md text-sm text-gray-300">
                                Composition
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Post Feed */}
            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Posts</h3>
                <PostFeed userId={user._id} showPostForm={isOwnProfile} />
            </div>
        </div>
    );
};

export default ProfileAbout;