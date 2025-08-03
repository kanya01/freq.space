import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../services/portfolioService';
import ContentCard from '../../content/components/ContentCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DebugPanel from '../../../components/DebugPanel';
import {
    PhotoIcon,
    VideoCameraIcon,
    MusicalNoteIcon,
    PlusIcon,
    ExclamationTriangleIcon
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
        } else {
            console.warn('[ProfilePortfolio] No userId provided');
            setLoading(false);
            setError('No user ID provided');
        }
    }, [userId]);

    const addNetworkRequest = (method, url, status, error = null) => {
        setDebugInfo(prev => ({
            ...prev,
            networkRequests: [...prev.networkRequests.slice(-4), {
                method,
                url,
                status,
                error,
                timestamp: new Date().toISOString()
            }],
            apiCallCount: prev.apiCallCount + 1
        }));
    };

    const fetchPortfolioContent = async () => {
        console.log('[ProfilePortfolio] Starting to fetch portfolio for userId:', userId);

        try {
            setLoading(true);
            setError(null);
            console.log('[ProfilePortfolio] Loading state set to true');

            const startTime = Date.now();
            addNetworkRequest('GET', `/api/v1/content/user/${userId}/portfolio`, 'PENDING');

            console.log('[ProfilePortfolio] Calling portfolioService.getUserPortfolio...');
            const data = await portfolioService.getUserPortfolio(userId);

            const endTime = Date.now();
            const duration = endTime - startTime;

            console.log('[ProfilePortfolio] API Response received:', {
                duration: `${duration}ms`,
                contentCount: {
                    images: data.content.images?.length || 0,
                    videos: data.content.videos?.length || 0,
                    audio: data.content.audio?.length || 0
                },
                total: data.total,
                hasContent: !!(data.content.images?.length || data.content.videos?.length || data.content.audio?.length),
                rawData: data
            });

            // Update debug info with success
            addNetworkRequest('GET', `/api/v1/content/user/${userId}/portfolio`, 200);
            setDebugInfo(prev => ({
                ...prev,
                lastFetchTime: new Date().toISOString(),
                lastResponseSize: JSON.stringify(data).length
            }));

            // Check if we actually got content
            const hasAnyContent = data.content.images?.length || data.content.videos?.length || data.content.audio?.length;

            if (!hasAnyContent) {
                console.log('[ProfilePortfolio] No content found, using legacy fallback');
                // Convert legacy items to proper format
                const grouped = {
                    images: legacyPortfolioItems.filter(item => item.mediaType === 'image'),
                    videos: legacyPortfolioItems.filter(item => item.mediaType === 'video'),
                    audio: legacyPortfolioItems.filter(item => item.mediaType === 'audio')
                };
                setPortfolio(grouped);
                setError('No uploaded content found - showing sample content');
            } else {
                setPortfolio(data.content);
                console.log('[ProfilePortfolio] Portfolio state updated successfully');
            }

        } catch (err) {
            console.error('[ProfilePortfolio] Error fetching portfolio:', {
                error: err,
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                userId: userId
            });

            // Update debug info with error
            addNetworkRequest('GET', `/api/v1/content/user/${userId}/portfolio`, err.response?.status || 500, err.message);

            setError(`Failed to load portfolio: ${err.message || 'Unknown error'}`);

            // Still show legacy content as fallback
            console.log('[ProfilePortfolio] Using legacy content due to error');
            const grouped = {
                images: legacyPortfolioItems.filter(item => item.mediaType === 'image'),
                videos: legacyPortfolioItems.filter(item => item.mediaType === 'video'),
                audio: legacyPortfolioItems.filter(item => item.mediaType === 'audio')
            };
            setPortfolio(grouped);
        } finally {
            console.log('[ProfilePortfolio] Setting loading to false');
            setLoading(false);
        }
    };

    const filterContent = () => {
        console.log('[ProfilePortfolio] Filtering content for tab:', activeTab);
        console.log('[ProfilePortfolio] Current portfolio state:', portfolio);

        switch(activeTab) {
            case 'images':
                return portfolio.images || [];
            case 'videos':
                return portfolio.videos || [];
            case 'audio':
                return portfolio.audio || [];
            default:
                const allContent = [
                    ...(portfolio.images || []),
                    ...(portfolio.videos || []),
                    ...(portfolio.audio || [])
                ];
                console.log('[ProfilePortfolio] All content combined:', allContent);
                return allContent;
        }
    };

    const filteredContent = filterContent();
    console.log('[ProfilePortfolio] Filtered content:', filteredContent);

    const tabs = [
        { id: 'all', label: 'All', icon: null },
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

    if (loading) {
        return (
            <div className="text-center py-12">
                <LoadingSpinner />
                <p className="mt-4 text-black-olive-600">Loading portfolio...</p>
                <DebugPanel
                    loading={loading}
                    error={error}
                    data={portfolio}
                    networkRequests={debugInfo.networkRequests}
                    componentName="ProfilePortfolio"
                    additionalInfo={{
                        userId,
                        activeTab,
                        apiCallCount: debugInfo.apiCallCount,
                        lastFetchTime: debugInfo.lastFetchTime
                    }}
                />
            </div>
        );
    }

    return (
        <div>
            {/* Error Banner */}
            {error && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-2" />
                        <span className="text-amber-800 text-sm">{error}</span>
                        <button
                            onClick={fetchPortfolioContent}
                            className="ml-auto text-amber-600 hover:text-amber-800 text-sm font-medium"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-timberwolf-100 p-1 rounded-lg">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const count = getContentCount(tab.id);

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                                activeTab === tab.id
                                    ? 'bg-white text-eerie-black shadow-sm'
                                    : 'text-black-olive-600 hover:text-eerie-black'
                            }`}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{tab.label}</span>
                            <span className="bg-black-olive-200 text-black-olive-600 px-2 py-0.5 rounded-full text-xs">
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Content Grid */}
            {filteredContent.length === 0 ? (
                <div className="text-center py-12 bg-timberwolf-50 rounded-xl border border-timberwolf-200">
                    <div className="max-w-md mx-auto">
                        {activeTab === 'all' ? (
                            <>
                                <div className="w-16 h-16 bg-black-olive-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PlusIcon className="h-8 w-8 text-black-olive-500" />
                                </div>
                                <h3 className="text-lg font-medium text-eerie-black mb-2">
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
                    apiCallCount: debugInfo.apiCallCount,
                    lastFetchTime: debugInfo.lastFetchTime,
                    lastResponseSize: debugInfo.lastResponseSize
                }}
            />
        </div>
    );
};

export default ProfilePortfolio;