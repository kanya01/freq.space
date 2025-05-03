// frontend/src/pages/HomePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';
import TrackFeed from '../features/tracks/components/TrackFeed';
import { MusicalNoteIcon, PlusIcon } from '@heroicons/react/24/outline';

function HomePage() {
    // Get user data from Redux state
    const user = useSelector(selectUser);

    return (
        <div className="min-h-screen bg-black text-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome to freq.space{user ? `, ${user.username}` : ''}!
                    </h1>

                    {user && (
                        <Link
                            to="/upload"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Upload Track</span>
                        </Link>
                    )}
                </div>

                {/* Featured sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Quick statistics */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Your Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Your Tracks</span>
                                <Link to={user ? `/u/${user.username}` : '/login'} className="text-blue-400 hover:text-blue-300">
                                    View All
                                </Link>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Liked Tracks</span>
                                <Link to={user ? '/liked' : '/login'} className="text-blue-400 hover:text-blue-300">
                                    View All
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick access */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                to="/upload"
                                className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-md hover:bg-gray-700"
                            >
                                <MusicalNoteIcon className="h-8 w-8 text-blue-400 mb-2" />
                                <span className="text-white">Upload Track</span>
                            </Link>
                            <Link
                                to="/profile"
                                className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-md hover:bg-gray-700"
                            >
                                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                                    <span className="text-white font-bold">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <span className="text-white">Your Profile</span>
                            </Link>
                        </div>
                    </div>

                    {/* What's new */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">What's New</h2>
                        <div className="space-y-4">
                            <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-md p-4">
                                <p className="text-white">
                                    New audio player with waveform visualization and timestamped comments.
                                </p>
                            </div>
                            <div className="bg-gray-800 rounded-md p-4">
                                <p className="text-gray-300">
                                    Explore new tracks from creators in your favorite genres.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main feed */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Discover Tracks</h2>
                    <TrackFeed />
                </div>
            </div>
        </div>
    );
}

export default HomePage;