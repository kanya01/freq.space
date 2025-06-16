// frontend/src/features/profile/components/ProfileHeader.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { EnvelopeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { InstagramIcon, TwitterIcon, SoundcloudIcon, SpotifyIcon, YoutubeIcon, WebsiteIcon } from './Icons';

const ProfileHeader = ({ user, isOwnProfile = false }) => {
    const [avatarError, setAvatarError] = useState(false);

    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://localhost:5001${url}`;
    };

    const avatarUrl = !avatarError ? getFullUrl(user.profile.avatarUrl) : null;

    const socialIconComponents = {
        instagram: InstagramIcon,
        twitter: TwitterIcon,
        soundcloud: SoundcloudIcon,
        spotify: SpotifyIcon,
        youtube: YoutubeIcon,
        website: WebsiteIcon
    };

    // Mock data for demo
    const mockData = {
        rating: 5.0,
        reviewCount: 656,
        responseTime: '~1h'
    };

    const getExperienceIcon = (level) => {
        switch(level) {
            case 'Hobbyist': return '🌱';
            case 'Part-time': return '⚡';
            case 'Pro': return '🎯';
            case 'Maestro': return '👑';
            default: return '🎵';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-timberwolf-200">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-2xl overflow-hidden bg-gradient-to-br from-timberwolf-200 to-timberwolf-300 shadow-xl">
                            {avatarUrl && !avatarError ? (
                                <img
                                    src={avatarUrl}
                                    alt={user.username}
                                    className="h-full w-full object-cover"
                                    onError={() => setAvatarError(true)}
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <span className="text-4xl font-bold text-eerie-black">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Verified Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 border-4 border-white shadow-lg">
                            <CheckBadgeIcon className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-eerie-black mb-2">
                            {user.profile.firstName && user.profile.lastName
                                ? `${user.profile.firstName} ${user.profile.lastName}`
                                : user.username}
                        </h1>
                        <p className="text-xl text-black-olive-700">@{user.username}</p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-6 mt-4">
                            <div className="flex items-center">
                                <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                <span className="font-bold text-eerie-black">{mockData.rating}</span>
                                <span className="text-black-olive-600 ml-1">({mockData.reviewCount} reviews)</span>
                            </div>

                            <div className="flex items-center text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm">Responds in {mockData.responseTime}</span>
                            </div>

                            {user.profile.location && (
                                <div className="flex items-center text-black-olive-600">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    <span className="text-sm">
                                        {[user.profile.location.city, user.profile.location.country]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Professional Info */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <span className="inline-flex items-center px-4 py-2 bg-eerie-black text-floral-white rounded-xl text-sm font-medium">
                                {user.profile.userType || 'Producer'}
                            </span>

                            <span className="inline-flex items-center px-4 py-2 bg-timberwolf-100 text-eerie-black rounded-xl text-sm font-medium border border-timberwolf-300">
                                <span className="mr-2">{getExperienceIcon(user.profile.experienceLevel)}</span>
                                {user.profile.experienceLevel || 'Maestro'}
                            </span>

                            <span className="text-black-olive-600 text-sm flex items-center">
                                <span className="mr-1">🔥</span>
                                {user.followers?.length || 0} followers
                            </span>
                        </div>
                    </div>

                    {/* Bio */}
                    {user.profile.bio && (
                        <p className="text-black-olive-700 leading-relaxed mb-6">
                            {user.profile.bio}
                        </p>
                    )}

                    {/* Social Links */}
                    <div className="flex items-center space-x-4">
                        {user.profile.socialLinks && Object.entries(user.profile.socialLinks).map(([platform, url]) => {
                            if (!url) return null;
                            const IconComponent = socialIconComponents[platform.toLowerCase()] || WebsiteIcon;

                            return (
                            <a
                                key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black-olive-500 hover:text-eerie-black transition-colors"
                            title={platform}
                                >
                                <IconComponent className="h-5 w-5" />
                                </a>
                        );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    {isOwnProfile ? (
                        <Link
                            to="/profile/edit"
                            className="inline-flex items-center justify-center px-6 py-3 bg-eerie-black text-floral-white rounded-xl hover:bg-black-olive transition-colors font-medium shadow-sm hover:shadow-md"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Link>
                    ) : (
                        <>
                            <button className="inline-flex items-center justify-center px-6 py-3 bg-flame-600 text-white rounded-xl hover:bg-flame-700 transition-colors font-medium shadow-sm hover:shadow-md">
                                <EnvelopeIcon className="h-4 w-4 mr-2" />
                                Message
                            </button>
                            <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-eerie-black border-2 border-eerie-black rounded-xl hover:bg-timberwolf-100 transition-colors font-medium">
                                Follow
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;