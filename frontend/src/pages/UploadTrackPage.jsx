// frontend/src/pages/UploadTrackPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrackUpload from '../features/tracks/components/TrackUpload';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const UploadTrackPage = () => {
    const navigate = useNavigate();

    const handleUploadSuccess = (track) => {
        // Navigate to the track detail page after successful upload
        navigate(`/tracks/${track._id}`);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Back button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back</span>
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-6">Upload Track</h1>

                <TrackUpload onSuccess={handleUploadSuccess} />
            </div>
        </div>
    );
};

export default UploadTrackPage;