import React from 'react';
import { Link } from 'react-router-dom';

const SellerCard = ({ artist }) => {
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
        <Link
            to={`/u/${artist.username}`}
            className="block bg-floral-white border border-timberwolf-300 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-flame-200 min-w-[280px]"
        >
            <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {artist.profile?.avatarUrl ? (
                        <img
                            src={artist.profile.avatarUrl}
                            alt={artist.username}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-black-olive text-floral-white rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium">
                                {artist.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-eerie-black font-semibold truncate">
                        {artist.username}
                    </h3>
                    <p className="text-black-olive-600 text-sm">
                        {artist.profile?.userType || 'Artist'}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg">
                            {getExperienceIcon(artist.profile?.experienceLevel)}
                        </span>
                        <span className="text-sm text-black-olive-700">
                            {artist.profile?.experienceLevel || 'Pro'}
                        </span>
                    </div>

                    {/* Skills preview */}
                    <div className="flex flex-wrap gap-1 mt-3">
                        {artist.profile?.skills?.slice(0, 2).map((skill, index) => (
                            <span
                                key={index}
                                className="text-xs bg-timberwolf-200 text-black-olive px-2 py-1 rounded"
                            >
                                {skill}
                            </span>
                        ))}
                        {artist.profile?.skills?.length > 2 && (
                            <span className="text-xs text-black-olive-600">
                                +{artist.profile.skills.length - 2}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SellerCard;