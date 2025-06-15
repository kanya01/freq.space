// frontend/src/features/profile/components/ProfilePortfolio.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

const ProfilePortfolio = ({ user, isOwnProfile = false }) => {
    // Mock portfolio items for demo
    const portfolioItems = [
        {
            id: '1',
            title: 'Summer Vibes Beat',
            type: 'audio',
            thumbnail: null,
            plays: 1243,
            likes: 89,
            comments: 12,
            duration: '3:24',
            waveform: true
        },
        {
            id: '2',
            title: 'Hip Hop Instrumental',
            type: 'audio',
            thumbnail: null,
            plays: 892,
            likes: 67,
            comments: 8,
            duration: '2:56',
            waveform: true
        },
        {
            id: '3',
            title: 'Electronic Dance Mix',
            type: 'audio',
            thumbnail: null,
            plays: 2341,
            likes: 156,
            comments: 23,
            duration: '4:12',
            waveform: true
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4">
            {portfolioItems.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-timberwolf-200 hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex items-center space-x-4">
                        {/* Play button */}
                        <button className="flex-shrink-0 w-12 h-12 bg-flame-600 rounded-full flex items-center justify-center text-white hover:bg-flame-700 transition-colors shadow-md group-hover:scale-105 transform">
                            <PlayIcon className="h-5 w-5 ml-0.5" />
                        </button>

                        {/* Track info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-eerie-black truncate">{item.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-black-olive-600 mt-1">
                                <span>{item.duration}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                    <PlayIcon className="h-3 w-3 mr-1" />
                                    {item.plays.toLocaleString()}
                                </span>
                                <span className="flex items-center">
                                    <HeartIcon className="h-3 w-3 mr-1" />
                                    {item.likes}
                                </span>
                                <span className="flex items-center">
                                    <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
                                    {item.comments}
                                </span>
                            </div>
                        </div>

                        {/* Waveform visualization placeholder */}
                        <div className="hidden sm:block flex-1 h-12 bg-gradient-to-r from-timberwolf-100 to-timberwolf-200 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                <div className="flex space-x-1">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-black-olive-400 rounded-full"
                                            style={{
                                                height: `${Math.random() * 100}%`,
                                                opacity: 0.3 + Math.random() * 0.7
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Empty state */}
            {portfolioItems.length === 0 && (
                <div className="bg-white rounded-xl p-12 text-center border border-timberwolf-200">
                    <div className="w-16 h-16 bg-timberwolf-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MusicalNoteIcon className="h-8 w-8 text-black-olive-500" />
                    </div>
                    <p className="text-black-olive-600 mb-4">No portfolio items yet</p>
                    {isOwnProfile && (
                        <Link
                            to="/upload"
                            className="inline-flex items-center px-4 py-2 bg-flame-600 text-white rounded-lg hover:bg-flame-700 transition-colors"
                        >
                            Upload your first track
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePortfolio;