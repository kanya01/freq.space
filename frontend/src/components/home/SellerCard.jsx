import React from 'react';
import { Link } from 'react-router-dom';

const SellerCard = ({ seller }) => {
    // Add null check
    if (!seller || !seller.username) {
        return null;
    }

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
            to={`/u/${seller.username}`}
            className="block bg-floral-white border border-timberwolf-300 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-flame-200 min-w-[280px]"
        >
            <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {seller.profile?.avatarUrl ? (
                        <img
                            src={seller.profile.avatarUrl}
                            alt={seller.username}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-black-olive text-floral-white rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium">
                                {seller.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-eerie-black font-semibold truncate">
                        {seller.username}
                    </h3>
                    <p className="text-black-olive-600 text-sm">
                        {seller.profile?.userType || 'Creative Professional'}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg">
                            {getExperienceIcon(seller.profile?.experienceLevel)}
                        </span>
                        <span className="text-sm text-black-olive-700">
                            {seller.profile?.experienceLevel || 'Pro'}
                        </span>
                    </div>

                    {/* Skills preview */}
                    {seller.profile?.skills && seller.profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {seller.profile.skills.slice(0, 2).map((skill, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-timberwolf-100 text-floral-white px-2 py-1 rounded"
                                >
                                    {skill}
                                </span>
                            ))}
                            {seller.profile.skills.length > 2 && (
                                <span className="text-xs text-black-olive-600">
                                    +{seller.profile.skills.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default SellerCard;