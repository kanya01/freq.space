// frontend/src/features/profile/components/ProfileHeader.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { InstagramIcon, TwitterIcon, SoundcloudIcon, SpotifyIcon, YoutubeIcon, WebsiteIcon } from './Icons';

const ProfileHeader = ({ user, isOwnProfile = false }) => {
    const [avatarError, setAvatarError] = useState(false);

    // Get full URL for images
    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://localhost:5001${url}`;
    };

    const avatarUrl = !avatarError ? getFullUrl(user.profile.avatarUrl) : null;

    // Social media icons mapping
    const socialIconComponents = {
        instagram: InstagramIcon,
        twitter: TwitterIcon,
        soundcloud: SoundcloudIcon,
        spotify: SpotifyIcon,
        youtube: YoutubeIcon,
        website: WebsiteIcon
    };

    return (
        <div className="pt-3 relative">
            {/* Action Buttons - Positioned absolutely at top right */}
            <div className="absolute top-0 right-0 flex space-x-3">
                <button className="px-6 py-2.5 bg-white text-black rounded-md text-sm">
                    Message
                </button>

                {isOwnProfile ? (
                    <Link
                        to="/profile/edit"
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-md text-sm"
                    >
                        Edit Profile
                    </Link>
                ) : (
                    <button className="px-6 py-2.5 bg-gray-900 text-white rounded-md text-sm">
                        Follow
                    </button>
                )}
            </div>

            <div className="flex items-start mb-8">
                {/* Avatar with Verified Badge */}
                <div className="relative mr-6">
                    <div className="h-28 w-28 rounded-full overflow-hidden bg-gray-900">
                        {avatarUrl && !avatarError ? (
                            <img
                                src={avatarUrl}
                                alt={user.username}
                                className="h-full w-full object-cover"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <span className="text-4xl font-light">{user.username.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-black">
                        <CheckBadgeIcon className="h-4 w-4 text-white" />
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                    <div className="flex items-start">
                        <div>
                            <div className="mb-1">
                                <h1 className="text-2xl font-medium">@{user.username}</h1>
                                <p className="text-gray-500 text-sm">
                                    {user.profile.location?.country || 'United Kingdom'}
                                    <span className="mx-2">·</span>
                                    {user.followers?.length || 0} followers
                                    <span className="mx-2">·</span>
                                    {user.reviews?.length || 0} reviews
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {user.profile.userType && (
                                    <span className="px-3 py-1 bg-gray-900 rounded-md text-xs">
                                        {user.profile.userType || 'Producer'}
                                    </span>
                                )}

                                {user.profile.experienceLevel && (
                                    <span className="px-3 py-1 bg-gray-900 rounded-md text-xs">
                                        {user.profile.experienceLevel || 'Maestro'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex mt-4 space-x-4">
                        {user.profile.socialLinks && Object.entries(user.profile.socialLinks).map(([platform, url]) => {
                            if (!url) return null;

                            const IconComponent = socialIconComponents[platform.toLowerCase()] || WebsiteIcon;

                            return (
                                <a
                                key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            title={platform}
                                >
                                <IconComponent className="h-5 w-5" />
                                </a>
                        );
                        })}
                    </div>
                </div>
            </div>

            {/* Biography Section - Now part of the header */}
            <div className="max-w-4xl">
                {user.profile.bio ? (
                    <p className="text-gray-300 leading-relaxed">
                        {user.profile.bio}
                    </p>
                ) : (
                    <p className="text-gray-500 italic">
                        ....
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;