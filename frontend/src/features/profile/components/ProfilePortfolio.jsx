// frontend/src/features/profile/components/ProfilePortfolio.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../auth/authSlice';
import TrackFeed from '../../tracks/components/TrackFeed';
import { PlusIcon } from '@heroicons/react/24/outline';

// Create a styled wrapper component that customizes how TrackFeed looks
const CompactTrackFeed = ({ userId }) => {
    // The key trick here is to add custom CSS that transforms the TrackFeed
    // This uses the existing component with all its functionality
    return (
        <div className="compact-track-feed">
            <style jsx>{`
        /* Custom CSS to transform the TrackFeed into a compact version */
        .compact-track-feed :global(.track-feed .bg-gray-900) {
          padding: 0.75rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        .compact-track-feed :global(.track-feed .audio-player) {
          padding: 0 !important;
          background: transparent !important;
        }
        
        .compact-track-feed :global(.track-feed .enhanced-waveform) {
          height: 80px !important;
        }
        
        /* Hide some elements we don't need in compact view */
        .compact-track-feed :global(.track-feed .audio-player > div:first-child) {
          display: none !important;
        }
      `}</style>

            {/* Use the original TrackFeed with all its functionality */}
            <TrackFeed userId={userId} />
        </div>
    );
};

const ProfilePortfolio = ({ user, isOwnProfile = false }) => {
    const currentUser = useSelector(selectUser);
    const showUploadButton = isOwnProfile && currentUser && currentUser._id === user?._id;

    return (
        <div>
            {/* Upload Button (only shown if viewing own profile) */}
            {/*{showUploadButton && (*/}
            {/*    <div className="mb-4 flex justify-end">*/}
            {/*        <Link*/}
            {/*            to="/upload"*/}
            {/*            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"*/}
            {/*        >*/}
            {/*            <PlusIcon className="h-5 w-5 mr-2" />*/}
            {/*            Upload Content*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* Use our wrapped component that preserves all functionality */}
            <CompactTrackFeed userId={user?._id} />
        </div>
    );
};

export default ProfilePortfolio;