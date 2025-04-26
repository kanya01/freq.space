import React from 'react';
import { MapPinIcon, BriefcaseIcon, StarIcon } from '@heroicons/react/24/outline';

const ProfileAbout = ({ user }) => {
    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>

            {/* Bio */}
            {user.profile.bio && (
                <p className="text-gray-300 whitespace-pre-wrap mb-6">
                    {user.profile.bio}
                </p>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                {(user.profile.location?.city || user.profile.location?.country) && (
                    <div className="flex items-center text-gray-400">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>
                            {[user.profile.location.city, user.profile.location.country]
                                .filter(Boolean)
                                .join(', ')}
                        </span>
                    </div>
                )}

                {/* Experience Level */}
                {user.profile.experienceLevel && (
                    <div className="flex items-center text-gray-400">
                        <StarIcon className="h-5 w-5 mr-2" />
                        <span>{user.profile.experienceLevel}</span>
                    </div>
                )}

                {/* User Type */}
                {user.profile.userType && (
                    <div className="flex items-center text-gray-400">
                        <BriefcaseIcon className="h-5 w-5 mr-2" />
                        <span>{user.profile.userType}</span>
                    </div>
                )}
            </div>

            {/* Skills */}
            {user.profile.skills?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.profile.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Links - FIXED SECTION */}
            {user.profile.socialLinks && Object.keys(user.profile.socialLinks).length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(user.profile.socialLinks).map(([platform, url]) => (
                            url && (
                                <a
                                    key={platform}
                                    href={url.startsWith('http') ? url : `https://${url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 capitalize"
                                >
                                    {platform}
                                </a>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileAbout;

