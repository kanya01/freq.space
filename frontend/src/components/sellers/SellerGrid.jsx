import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, MapPinIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

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

    const getExperienceColor = (level) => {
        switch(level) {
            case 'Hobbyist': return 'text-green-600 bg-green-50 border-green-200';
            case 'Part-time': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Pro': return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'Maestro': return 'text-flame-600 bg-flame-50 border-flame-200';
            default: return 'text-black-olive-600 bg-timberwolf-100 border-timberwolf-300';
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
            className="group block bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-timberwolf-200 hover:border-flame-300 hover:-translate-y-1 relative overflow-hidden"
        >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-flame-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            <div className="relative">
                <div className="flex items-start space-x-4">
                    {/* Avatar with status indicator */}
                    <div className="relative flex-shrink-0">
                        {seller.profile?.avatarUrl ? (
                            <img
                                src={seller.profile.avatarUrl}
                                alt={seller.username}
                                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-timberwolf-200 group-hover:ring-flame-300 transition-all duration-300"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-timberwolf-200 to-timberwolf-300 text-eerie-black rounded-2xl flex items-center justify-center ring-2 ring-timberwolf-200 group-hover:ring-flame-300 transition-all duration-300">
                                <span className="text-xl font-bold">
                                    {seller.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}

                        {/* Online status indicator */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                            <CheckBadgeIcon className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-bold text-eerie-black group-hover:text-flame-700 transition-colors truncate">
                                    {getFullName() || seller.username}
                                </h3>

                                {getFullName() && (
                                    <p className="text-black-olive-600 text-sm">@{seller.username}</p>
                                )}

                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getExperienceColor(seller.profile?.experienceLevel)}`}>
                                        <span className="mr-1">{getExperienceIcon(seller.profile?.experienceLevel)}</span>
                                        {seller.profile?.experienceLevel || 'Pro'}
                                    </span>
                                </div>
                            </div>

                            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-black-olive-400 group-hover:text-flame-600 transition-colors flex-shrink-0" />
                        </div>

                        {/* Professional type */}
                        <div className="mt-3">
                            <span className="inline-flex items-center px-3 py-1 bg-eerie-black text-floral-white text-sm font-medium rounded-lg">
                                {seller.profile?.userType || 'Creative Professional'}
                            </span>
                        </div>

                        {/* Location */}
                        {(seller.profile?.location?.city || seller.profile?.location?.country) && (
                            <div className="flex items-center text-black-olive-600 text-sm mt-3">
                                <MapPinIcon className="h-4 w-4 mr-1 text-black-olive-500" />
                                <span>
                                    {[seller.profile.location.city, seller.profile.location.country]
                                        .filter(Boolean)
                                        .join(', ')}
                                </span>
                            </div>
                        )}

                        {/* Bio preview */}
                        {seller.profile?.bio && (
                            <p className="text-black-olive-700 text-sm mt-3 line-clamp-2 leading-relaxed">
                                {seller.profile.bio}
                            </p>
                        )}

                        {/* Skills preview */}
                        {seller.profile?.skills && seller.profile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {seller.profile.skills.slice(0, 3).map((skill, index) => (
                                    <span
                                        key={index}
                                        className="text-xs bg-timberwolf-100 text-black-olive-700 px-3 py-1 rounded-full border border-timberwolf-300 font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {seller.profile.skills.length > 3 && (
                                    <span className="text-xs text-black-olive-500 px-3 py-1 font-medium">
                                        +{seller.profile.skills.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

const SellerGrid = ({ sellers, loading, onLoadMore, hasMore }) => {
    if (loading && sellers.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-timberwolf-200">
                        <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-timberwolf-200 rounded-2xl"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-timberwolf-200 rounded-lg w-3/4"></div>
                                <div className="h-3 bg-timberwolf-200 rounded-lg w-1/2"></div>
                                <div className="h-6 bg-timberwolf-200 rounded-lg w-2/3"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-timberwolf-200 rounded-lg"></div>
                                    <div className="h-3 bg-timberwolf-200 rounded-lg w-4/5"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-6 bg-timberwolf-200 rounded-full w-16"></div>
                                    <div className="h-6 bg-timberwolf-200 rounded-full w-20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (sellers.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-timberwolf-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-2xl font-bold text-eerie-black mb-4">No professionals found</h3>
                    <p className="text-black-olive-600 mb-8 leading-relaxed">
                        We couldn't find any professionals matching your criteria. Try adjusting your search or explore different skills and locations.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-6 py-3 bg-eerie-black text-floral-white rounded-xl hover:bg-black-olive transition-colors font-medium shadow-sm"
                        >
                            Browse All Professionals
                        </button>
                        <p className="text-sm text-black-olive-500">
                            Or try searching for popular skills like "mixing", "mastering", or "composition"
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sellers.map((seller) => (
                    <SellerCard key={seller._id} seller={seller} />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="text-center pt-12">
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="group inline-flex items-center px-8 py-4 bg-white border-2 border-eerie-black text-eerie-black rounded-xl hover:bg-eerie-black hover:text-floral-white transition-all duration-300 font-medium shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="mr-2">
                            {loading ? 'Loading more professionals...' : 'Load More Professionals'}
                        </span>
                        {!loading && (
                            <ArrowTopRightOnSquareIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        )}
                    </button>

                    {!loading && (
                        <p className="mt-4 text-sm text-black-olive-500">
                            Discover more talented professionals in our community
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SellerGrid;