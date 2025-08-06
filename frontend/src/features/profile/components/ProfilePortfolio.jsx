import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../services/portfolioService';
import ContentCard from '../../content/components/ContentCard.jsx';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DebugPanel from '../../../components/DebugPanel';
import {
    PhotoIcon,
    VideoCameraIcon,
    MusicalNoteIcon,
    PlusIcon,
    ExclamationTriangleIcon,
    Squares2X2Icon
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
    const [debugInfo, setDebugInfo] = useState({
        networkRequests: [],
        lastFetchTime: null,
        apiCallCount: 0
    });

    // Sample content for development
    const legacyPortfolioItems = [
        {
            id: 'legacy-1',
            mediaType: 'audio',
            title: 'Midnight Sessions',
            description: 'Late night acoustic vibes',
            mediaUrl: '/assets/audio/sample1.mp3',
            coverUrl: '/assets/images/audio-cover1.jpg',
            tags: ['acoustic', 'chill', 'night'],
            likes: 42,
            comments: 5,
            views: 128,
            createdAt: new Date('2024-01-15'),
            isLegacy: true
        },
        {
            id: 'legacy-2',
            mediaType: 'image',
            title: 'Urban Landscapes',
            description: 'City photography series',
            mediaUrl: '/assets/images/urban1.jpg',
            tags: ['photography', 'urban', 'city'],
            likes: 89,
            comments: 12,
            views: 234,
            createdAt: new Date('2024-01-10'),
            isLegacy: true
        },
        {
            id: 'legacy-3',
            mediaType: 'video',
            title: 'Creative Process Timelapse',
            description: 'Behind the scenes of my latest project',
            mediaUrl: '/assets/videos/timelapse1.mp4',
            thumbnailUrl: '/assets/images/video-thumb1.jpg',
            tags: ['timelapse', 'process', 'creative'],
            likes: 156,
            comments: 23,
            views: 567,
            duration: 180,
            createdAt: new Date('2024-01-20'),
            isLegacy: true
        }
    ];

    useEffect(() => {
        if (userId) {
            fetchPortfolioContent();
        } else {
            console.warn('[ProfilePortfolio] No userId provided');
            setLoading(false);
            setError('No user ID provided');
        }
    }, [userId]);

    const fetchPortfolioContent = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await portfolioService.getUserPortfolio(userId);

            const hasAnyContent = data.content.images?.length ||
                data.content.videos?.length ||
                data.content.audio?.length;

            if (!hasAnyContent) {
                // Use sample content as fallback
                const grouped = {
                    images: legacyPortfolioItems.filter(item => item.mediaType === 'image'),
                    videos: legacyPortfolioItems.filter(item => item.mediaType === 'video'),
                    audio: legacyPortfolioItems.filter(item => item.mediaType === 'audio')
                };
                setPortfolio(grouped);
            } else {
                setPortfolio(data.content);
            }

        } catch (err) {
            console.error('[ProfilePortfolio] Error fetching portfolio:', err);
            setError(`Failed to load portfolio: ${err.message || 'Unknown error'}`);

            // Show sample content as fallback
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
                return portfolio.images || [];
            case 'videos':
                return portfolio.videos || [];
            case 'audio':
                return portfolio.audio || [];
            default:
                return [
                    ...(portfolio.images || []),
                    ...(portfolio.videos || []),
                    ...(portfolio.audio || [])
                ];
        }
    };

    const filteredContent = filterContent();

    const tabs = [
        { id: 'all', label: 'All', icon: Squares2X2Icon },
        { id: 'images', label: 'Images', icon: PhotoIcon },
        { id: 'videos', label: 'Videos', icon: VideoCameraIcon },
        { id: 'audio', label: 'Audio', icon: MusicalNoteIcon }
    ];

    const getContentCount = (type) => {
        switch(type) {
            case 'images':
                return portfolio.images?.length || 0;
            case 'videos':
                return portfolio.videos?.length || 0;
            case 'audio':
                return portfolio.audio?.length || 0;
            default:
                return (portfolio.images?.length || 0) +
                    (portfolio.videos?.length || 0) +
                    (portfolio.audio?.length || 0);
        }
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-timberwolf-100 rounded-xl overflow-hidden animate-pulse">
                    <div className="h-64 bg-gradient-to-br from-timberwolf-200 to-timberwolf-100" />
                    <div className="p-4 space-y-3">
                        <div className="h-6 bg-timberwolf-200 rounded w-3/4" />
                        <div className="h-4 bg-timberwolf-200 rounded" />
                        <div className="flex gap-4">
                            <div className="h-4 w-12 bg-timberwolf-200 rounded" />
                            <div className="h-4 w-12 bg-timberwolf-200 rounded" />
                            <div className="h-4 w-12 bg-timberwolf-200 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="relative min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-eerie-black">Portfolio</h2>
                </div>
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="relative min-h-[400px]">
            {/* Portfolio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-eerie-black">Portfolio</h2>
                {isOwnProfile && (
                    <Link
                        to="/upload"
                        className="inline-flex items-center justify-center px-4 py-2 bg-flame-600 text-white rounded-lg hover:bg-flame-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg group"
                    >
                        <PlusIcon className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                        Upload Content
                    </Link>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-timberwolf-100 rounded-xl mb-8 overflow-x-auto scrollbar-hide">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const count = getContentCount(tab.id);
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 min-w-fit flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                                font-medium text-sm transition-all duration-200 whitespace-nowrap
                                ${isActive
                                ? 'bg-eerie-black text-floral-white shadow-md'
                                : 'text-black-olive-700 hover:bg-timberwolf-200'
                            }
                            `}
                        >
                            {Icon && <Icon className="h-5 w-5" />}
                            <span>{tab.label}</span>
                            <span className={`
                                ml-2 px-2 py-0.5 text-xs rounded-full
                                ${isActive
                                ? 'bg-floral-white/20'
                                : 'bg-black-olive-200 text-black-olive-700'
                            }
                            `}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-800">{error}</p>
                        {!filteredContent.length && (
                            <p className="text-red-600 text-sm mt-1">
                                Showing sample content as fallback
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Content Grid or Empty State */}
            {filteredContent.length === 0 ? (
                <div className="col-span-full text-center py-16 px-8 bg-timberwolf-50 rounded-xl border-2 border-dashed border-timberwolf-300">
                    <div className="max-w-sm mx-auto">
                        {activeTab === 'all' ? (
                            <>
                                <div className="w-20 h-20 mx-auto mb-4 bg-timberwolf-200 rounded-full flex items-center justify-center">
                                    <Squares2X2Icon className="h-10 w-10 text-black-olive-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-eerie-black mb-2">
                                    {isOwnProfile ? 'No content uploaded yet' : 'No content available'}
                                </h3>
                                <p className="text-black-olive-600 mb-6">
                                    {isOwnProfile
                                        ? "Start building your portfolio by uploading your first piece of content."
                                        : "This user hasn't uploaded any content yet."}
                                </p>
                                {isOwnProfile && (
                                    <Link
                                        to="/upload"
                                        className="inline-flex items-center px-6 py-3 bg-eerie-black text-floral-white rounded-lg hover:bg-black-olive transition-colors group"
                                    >
                                        <PlusIcon className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fadeIn">
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

            {/* Debug Panel */}
            <DebugPanel
                loading={loading}
                error={error}
                data={portfolio}
                networkRequests={debugInfo.networkRequests}
                componentName="ProfilePortfolio"
                additionalInfo={{
                    userId,
                    activeTab,
                    filteredContentCount: filteredContent.length,
                    totalContent: getContentCount('all'),
                }}
            />
        </div>
    );
};

export default ProfilePortfolio;