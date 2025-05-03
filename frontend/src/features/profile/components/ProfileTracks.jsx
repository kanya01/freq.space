// frontend/src/features/profile/components/ProfileTracks.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import TrackFeed from '../../tracks/components/TrackFeed';
import { MusicalNoteIcon, PlusIcon } from '@heroicons/react/24/outline';

const ProfileTracks = ({ userId, isOwnProfile, showUploadButton }) => {
    return (
        <div>
            {showUploadButton && (
                <div className="mb-6 flex justify-end">
                    <Link
                        to="/upload"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Upload Track</span>
                    </Link>
                </div>
            )}

            {/* Display user's tracks */}
            <TrackFeed userId={userId} />

            {/* Empty state with upload CTA */}
            {isOwnProfile && (
                <div className="hidden">
                    {/* This is conditionally rendered by TrackFeed when empty */}
                    <div className="text-center py-12 bg-gray-900 rounded-lg">
                        <MusicalNoteIcon className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No tracks yet</h3>
                        <p className="text-gray-400 mb-6">
                            You haven't uploaded any tracks yet. Share your music with the world!
                        </p>
                        <Link
                            to="/upload"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Upload Your First Track</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileTracks;