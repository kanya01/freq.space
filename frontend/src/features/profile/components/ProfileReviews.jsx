// frontend/src/features/profile/components/ProfileReviews.jsx

import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { formatRelativeTime } from '../../../utils/formatters';

const ProfileReviews = () => {
    const reviews = [
        {
            _id: '1',
            reviewer: {
                username: 'remy_b_rell',
                profile: { avatarUrl: null },
                country: 'United States'
            },
            rating: 5,
            comment: 'This man got the job done and communication was on point 🔥 returning to him again for the rest of my album 100% y\'all lock in with him for real',
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            projectDetails: {
                price: '£50-£100',
                duration: '5 days',
                service: 'Mixing & Mastering'
            },
            isRepeatClient: true
        },
        // ... other reviews
    ];

    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, index) => (
                    <StarIcon
                        key={index}
                        className={`h-4 w-4 ${
                            index < rating ? 'text-yellow-500' : 'text-timberwolf-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const averageRating = 5.0;
    const totalReviews = 656;

    return (
        <div className="space-y-6">
            {/* Reviews Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-timberwolf-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-end gap-4">
                        <div className="text-5xl font-light text-eerie-black">{averageRating.toFixed(1)}</div>
                        <div className="flex flex-col items-start">
                            <div className="flex mb-1">
                                {renderStars(5)}
                            </div>
                            <div className="text-sm text-black-olive-600">{totalReviews} reviews</div>
                        </div>
                    </div>

                    <div className="space-x-2">
                        <select className="bg-timberwolf-100 border border-timberwolf-300 rounded-lg px-3 py-2 text-sm text-eerie-black focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-flame-500">
                            <option>Most recent</option>
                            <option>Highest rated</option>
                            <option>Lowest rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-xl p-6 shadow-sm border border-timberwolf-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            {/* Reviewer avatar */}
                            <div className="w-12 h-12 bg-gradient-to-br from-timberwolf-200 to-timberwolf-300 rounded-full flex items-center justify-center flex-shrink-0">
                                {review.reviewer.profile.avatarUrl ? (
                                    <img
                                        src={review.reviewer.profile.avatarUrl}
                                        alt={review.reviewer.username}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-lg font-medium text-eerie-black">
                                        {review.reviewer.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* Review content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <div className="font-semibold text-eerie-black">{review.reviewer.username}</div>
                                        <div className="flex items-center mt-1">
                                            {renderStars(review.rating)}
                                            <span className="ml-2 text-black-olive-600 text-xs">
                                                {formatRelativeTime(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-black-olive-600">
                                        {review.reviewer.country}
                                    </div>
                                </div>

                                <p className="text-black-olive-700 my-4 leading-relaxed">{review.comment}</p>

                                {/* Project details */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-timberwolf-100 border border-timberwolf-300 rounded-full text-xs font-medium text-black-olive-700">
                                        {review.projectDetails.price}
                                    </span>
                                    <span className="px-3 py-1 bg-timberwolf-100 border border-timberwolf-300 rounded-full text-xs font-medium text-black-olive-700">
                                        {review.projectDetails.duration}
                                    </span>
                                    <span className="px-3 py-1 bg-timberwolf-100 border border-timberwolf-300 rounded-full text-xs font-medium text-black-olive-700">
                                        {review.projectDetails.service}
                                    </span>
                                    {review.isRepeatClient && (
                                        <span className="px-3 py-1 bg-flame-100 border border-flame-300 text-flame-700 rounded-full text-xs font-medium">
                                            Repeat Client
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileReviews;