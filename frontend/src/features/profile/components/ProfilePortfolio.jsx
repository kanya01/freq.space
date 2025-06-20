import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { portfolioService } from '../../../services/portfolioService';
import ContentCard from '../../content/components/ContentCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import {
    PhotoIcon,
    VideoCameraIcon,
    MusicalNoteIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ProfilePortfolio = ({ userId, isOwnProfile }) => {
    const [portfolio, setPortfolio] = useState({
        images: [],
        videos: [],
        audio: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [error, setError] = useState(null);

    // Keep existing hardcoded items as fallback during transition
    const legacyPortfolioItems = [
        {
            id: 'legacy-1',
            mediaType: 'audio',
            title: 'Midnight Sessions',
            description: 'Late night acoustic vibes',
            mediaUrl: '/assets/audio/sample1.mp3',
            tags: ['acoustic', 'chill'],
            createdAt: new Date('2024-01-15'),
            isLegacy: true
        },
        {
            id: 'legacy-2',
            mediaType: 'image',
            title: 'Urban Landscapes',
            description: 'City photography series',
            mediaUrl: '/assets/images/urban1.jpg',
            tags: ['photography', 'urban'],
            createdAt: new Date('2024-01-10'),
            isLegacy: true
        }
    ];

    useEffect(() => {
        if (userId) {
            fetchPortfolioContent();
        }
    }, [userId]);

    const fetchPortfolioContent = async () => {
        try {
            setLoading(true);
            const data = await portfolioService.getUserPortfolio(userId);
            setPortfolio(data.content);
        } catch (err) {
            // If API fails, show legacy content
            console.error('Failed to fetch portfolio:', err);
            setError('Using offline content');
            // Convert legacy items to proper format
            const grouped = {
                images: legacyPortfolioItems.filter(item => item.mediaType === 'image'),
                videos: legacyPortfolioItems.filter(item => item.mediaType === 'video'),
                audio: legacyPortfolioItems.filter(item => item.mediaType === 'audio')
            };
            setPortfolio(grouped);
        } finally {
            setLoading(false);
        }
    };

    const filterContent = () => {
        switch(activeTab) {
            case 'images':
                return portfolio.images;
            case 'videos':
                return portfolio.videos;
            case 'audio':
                return portfolio.audio;
            default:
                return [
                    ...portfolio.images,
                    ...portfolio.videos,
                    ...portfolio.audio
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    };

    const tabConfig = [
        { id: 'all', label: 'All', icon: null },
        { id: 'images', label: 'Images', icon: PhotoIcon },
        { id: 'videos', label: 'Videos', icon: VideoCameraIcon },
        { id: 'audio', label: 'Audio', icon: MusicalNoteIcon }
    ];

    if (loading) return <LoadingSpinner message="Loading portfolio..." />;

    const filteredContent = filterContent();
    const hasContent = filteredContent.length > 0;

    return (
        <div className="space-y-8">
            {/* Header with Upload Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-eerie-black">Portfolio</h2>
                {isOwnProfile && (
                    <Link
                        to="/upload"
                        className="inline-flex items-center px-4 py-2 bg-flame-600 text-white rounded-lg hover:bg-flame-700 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Content
                    </Link>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-timberwolf-100 p-1 rounded-xl">
                {tabConfig.map(tab => {
                    const Icon = tab.icon;
                    const count = tab.id === 'all'
                        ? portfolio.images.length + portfolio.videos.length + portfolio.audio.length
                        : portfolio[tab.id]?.length || 0;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white shadow-sm text-eerie-black'
                                    : 'text-black-olive-600 hover:text-eerie-black'
                            }`}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{tab.label}</span>
                            <span className="text-xs bg-timberwolf-200 px-2 py-0.5 rounded-full">
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 text-sm">{error}</p>
                </div>
            )}

            {/* Content Grid */}
            {!hasContent ? (
                <div className="text-center py-16 bg-timberwolf-50 rounded-2xl">
                    <div className="max-w-sm mx-auto">
                        {activeTab === 'all' ? (
                            <>
                                <div className="w-20 h-20 bg-timberwolf-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PhotoIcon className="h-10 w-10 text-black-olive-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-eerie-black mb-2">
                                    No content yet
                                </h3>
                                <p className="text-black-olive-600 mb-6">
                                    {isOwnProfile
                                        ? "Start building your portfolio by uploading your first piece of content."
                                        : "This user hasn't uploaded any content yet."}
                                </p>
                                {isOwnProfile && (
                                    <Link
                                        to="/upload"
                                        className="inline-flex items-center px-6 py-3 bg-eerie-black text-floral-white rounded-lg hover:bg-black-olive transition-colors"
                                    >
                                        <PlusIcon className="h-5 w-5 mr-2" />
                                        Upload Content
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="text-black-olive-600">
                                    No {activeTab} uploaded yet
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContent.map(item => (
                        <ContentCard
                            key={item._id || item.id}
                            content={item}
                            onUpdate={fetchPortfolioContent}
                            isLegacy={item.isLegacy}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePortfolio;