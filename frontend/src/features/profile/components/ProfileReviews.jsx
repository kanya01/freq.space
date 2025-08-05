// frontend/src/features/profile/components/ProfileReviews.jsx

import React from 'react';
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const ProfileReviews = ({ user, isOwnProfile }) => {
    // For MVP launch - show empty state instead of hardcoded reviews
    return (
        <div className="space-y-6">
            {/* Empty Reviews Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-timberwolf-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-end gap-4">
                        <div className="text-5xl font-light text-black-olive-300">-</div>
                        <div className="flex flex-col items-start">
                            <div className="flex mb-1">
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className="h-4 w-4 text-timberwolf-300"
                                    />
                                ))}
                            </div>
                            <div className="text-sm text-black-olive-600">No reviews yet</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            <div className="text-center py-16 px-8 bg-white rounded-xl border-2 border-dashed border-timberwolf-300 shadow-sm">
                <div className="max-w-sm mx-auto">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-timberwolf-100 to-timberwolf-200 rounded-full flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-10 w-10 text-black-olive-400" />
                    </div>

                    {/* Main message */}
                    <h3 className="text-xl font-bold text-eerie-black mb-3">
                        No Reviews Yet
                    </h3>

                    <p className="text-black-olive-600 mb-6 leading-relaxed">
                        {isOwnProfile
                            ? "Once you start completing projects, client reviews will appear here to build your reputation."
                            : "This professional hasn't received any reviews yet. Be the first to work with them!"
                        }
                    </p>

                    {/* Different messages for own profile vs viewing others */}
                    <div className="bg-timberwolf-50 rounded-lg p-4 border border-timberwolf-200">
                        {isOwnProfile ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-eerie-black">
                                    Start building your reputation:
                                </p>
                                <ul className="text-sm text-black-olive-700 space-y-1">
                                    <li>• Complete your first project</li>
                                    <li>• Deliver excellent service</li>
                                    <li>• Ask clients to leave reviews</li>
                                </ul>
                            </div>
                        ) : (
                            <p className="text-sm text-black-olive-700">
                                Reviews help you make informed decisions when choosing professionals.
                                Check back later as this profile grows!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileReviews;