// frontend/src/features/profile/components/ProfileReviews.jsx

import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { formatRelativeTime } from '../../../utils/formatters';

const ProfileReviews = () => {
    // Hardcoded reviews for now
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
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
            projectDetails: {
                price: '£50-£100',
                duration: '5 days',
                service: 'Mixing & Mastering'
            },
            isRepeatClient: true
        },
        {
            _id: '2',
            reviewer: {
                username: 'saheppler',
                profile: { avatarUrl: null },
                country: 'United States'
            },
            rating: 5,
            comment: 'Another excellent job with the final mix down and master for my song. I am still new to the music production process. Beatsbmr was very patient with me and even gave me feedback on how to make better music.',
            createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000), // 65 days ago
            projectDetails: {
                price: '£50-£100',
                duration: '10 days',
                service: 'Mixing & Mastering'
            }
        },
        {
            _id: '3',
            reviewer: {
                username: 'the_preacher420',
                profile: { avatarUrl: null },
                country: 'Australia'
            },
            rating: 5,
            comment: 'Was very nice when speaking to me and put my thoughts first. Wasn\'t afraid to go back and change some things when I wanted some tweaks on it done.',
            createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000), // 70 days ago
            projectDetails: {
                price: '£50-£100',
                duration: '6 days',
                service: 'Mixing & Mastering'
            }
        }
    ];

    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, index) => (
                    <StarIcon
                        key={index}
                        className={`h-4 w-4 ${
                            index < rating ? 'text-yellow-400' : 'text-gray-700'
                        }`}
                    />
                ))}
            </div>
        );
    };

    // Review summary stats
    const averageRating = 5.0; // Hardcoded for now
    const totalReviews = 656; // Hardcoded for now

    return (
        <div className="space-y-8">
            {/* Reviews Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-md p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-end gap-4">
                        <div className="text-4xl font-light">{averageRating.toFixed(1)}</div>
                        <div className="flex flex-col items-start">
                            <div className="flex mb-1">
                                {renderStars(5)}
                            </div>
                            <div className="text-sm text-gray-500">{totalReviews} reviews</div>
                        </div>
                    </div>

                    <div className="space-x-2">
                        <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm">
                            <option>Most recent</option>
                            <option>Highest rated</option>
                            <option>Lowest rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-900 border border-gray-800 rounded-md p-6">
                        <div className="flex items-start gap-4">
                            {/* Reviewer avatar */}
                            <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                {review.reviewer.profile.avatarUrl ? (
                                    <img
                                        src={review.reviewer.profile.avatarUrl}
                                        alt={review.reviewer.username}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-lg font-medium">
                                        {review.reviewer.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* Review content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <div className="font-medium mb-1">{review.reviewer.username}</div>
                                        <div className="flex items-center">
                                            {renderStars(review.rating)}
                                            <span className="ml-2 text-gray-500 text-xs">
                                                {formatRelativeTime(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {review.reviewer.country}
                                    </div>
                                </div>

                                <p className="text-gray-300 my-4">{review.comment}</p>

                                {/* Project details */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-xs">
                                        {review.projectDetails.price}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-xs">
                                        {review.projectDetails.duration}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-xs">
                                        {review.projectDetails.service}
                                    </span>
                                    {review.isRepeatClient && (
                                        <span className="px-3 py-1 bg-gray-800 border border-blue-900/30 text-blue-400 rounded-md text-xs">
                                            Repeat Client
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                <nav className="inline-flex">
                    <button className="px-3 py-1 rounded-l-md border border-gray-800 bg-gray-900 text-gray-400">
                        Previous
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-800 bg-gray-900 text-white">
                        1
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-800 bg-gray-900 text-gray-400">
                        2
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-800 bg-gray-900 text-gray-400">
                        3
                    </button>
                    <button className="px-3 py-1 rounded-r-md border border-gray-800 bg-gray-900 text-gray-400">
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default ProfileReviews;