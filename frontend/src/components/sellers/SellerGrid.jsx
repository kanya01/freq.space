import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';

const SellerCard = ({ seller }) => {
    const getExperienceIcon = (level) => {
        switch(level) {
            case 'Hobbyist': return '🌱';
            case 'Part-time': return '⚡';
            case 'Pro': return '🎯';
            case 'Maestro': return '👑';
            default: return '🎵';
        }
    };

    const getFullName = () => {
        const { firstName, lastName } = seller.profile || {};
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        }
        return null;
    };

    return (
        <Link
            to={`/u/${seller.username}`}
            className="block bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-200 border border-gray-800 hover:border-gray-700 hover:shadow-lg"
        >
            <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {seller.profile?.avatarUrl ? (
                        <img
                            src={seller.profile.avatarUrl}
                            alt={seller.username}
                            className="w-14 h-14 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-14 h-14 bg-gray-800 text-white rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium">
                                {seller.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-semibold truncate">
                            {getFullName() || `@${seller.username}`}
                        </h3>
                        <div className="flex items-center space-x-1">
                            <span className="text-lg">
                                {getExperienceIcon(seller.profile?.experienceLevel)}
                            </span>
                        </div>
                    </div>

                    {getFullName() && (
                        <p className="text-gray-400 text-sm mb-1">@{seller.username}</p>
                    )}

                    <p className="text-blue-400 text-sm font-medium mb-2">
                        {seller.profile?.userType || 'Creative Professional'}
                    </p>

                    {/* Location */}
                    {(seller.profile?.location?.city || seller.profile?.location?.country) && (
                        <div className="flex items-center text-gray-400 text-sm mb-3">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>
                                {[seller.profile.location.city, seller.profile.location.country]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </div>
                    )}

                    {/* Bio preview */}
                    {seller.profile?.bio && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {seller.profile.bio}
                        </p>
                    )}

                    {/* Skills preview */}
                    {seller.profile?.skills && seller.profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {seller.profile.skills.slice(0, 3).map((skill, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full border border-gray-700"
                                >
                                    {skill}
                                </span>
                            ))}
                            {seller.profile.skills.length > 3 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                    +{seller.profile.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

const SellerGrid = ({ sellers, loading, onLoadMore, hasMore }) => {
    if (loading && sellers.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded-lg p-6 animate-pulse">
                        <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 bg-gray-800 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (sellers.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-white mb-2">No professionals found</h3>
                <p className="text-gray-400 mb-6">
                    Try adjusting your search criteria or explore different skills
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Browse All Professionals
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellers.map((seller) => (
                    <SellerCard key={seller._id} seller={seller} />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="text-center pt-8">
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SellerGrid;