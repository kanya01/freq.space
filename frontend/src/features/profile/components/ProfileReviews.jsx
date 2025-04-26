import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

const ProfileReviews = ({ user }) => {
    // Placeholder until reviews are implemented
    const reviews = [];

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <StarIcon
                key={index}
                className={`h-5 w-5 ${
                    index < rating ? 'text-yellow-400' : 'text-gray-600'
                }`}
            />
        ));
    };

    if (!reviews?.length) {
        return (
            <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
                <p className="text-gray-400">No reviews yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-800 pb-4">
                        <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-gray-400 text-sm">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                        <p className="text-gray-400 text-sm mt-2">
                            — {review.reviewer.username}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileReviews;