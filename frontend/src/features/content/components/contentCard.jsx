import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    PlayIcon,
    MusicalNoteIcon,
    PhotoIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
    EyeIcon,
    ClockIcon,
    PauseIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import AudioWaveform from './AudioWaveform';
import VideoPreview from './VideoPreview';
import { generateWaveformData } from '../../../utils/audioUtils';

const ContentCard = ({ content, onUpdate, isLegacy = false }) => {
    const [waveformData, setWaveformData] = useState(null);
    const [isLiked, setIsLiked] = useState(false);

    // Handle both new content format and legacy format
    const contentId = content._id || content.id;
    const mediaUrl = content.mediaUrl || '';
    const coverUrl = content.coverUrl || content.thumbnailUrl || '';

    useEffect(() => {
        // Generate waveform data for audio content
        if (content.mediaType === 'audio' && mediaUrl) {
            loadWaveformData();
        }
    }, [content.mediaType, mediaUrl]);

    const loadWaveformData = async () => {
        try {
            // Fetch the audio file and generate waveform
            const response = await fetch(mediaUrl);
            const blob = await response.blob();
            const waveform = await generateWaveformData(blob);
            setWaveformData(waveform);
        } catch (error) {
            console.error('Failed to generate waveform:', error);
            // Use a default waveform pattern as fallback
            setWaveformData(Array(50).fill(0).map(() => Math.random() * 0.5 + 0.3));
        }
    };

    const getContentIcon = () => {
        const iconClass = "h-5 w-5 text-black-olive-600";
        switch(content.mediaType) {
            case 'video':
                return <PlayIcon className={iconClass} />;
            case 'audio':
                return <MusicalNoteIcon className={iconClass} />;
            case 'image':
                return <PhotoIcon className={iconClass} />;
            default:
                return null;
        }
    };

    const getContentPreview = () => {
        switch(content.mediaType) {
            case 'image':
                return (
                    <div className="relative h-64 bg-timberwolf-100 overflow-hidden group">
                        {mediaUrl ? (
                            <img
                                src={mediaUrl}
                                alt={content.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-timberwolf-100', 'to-timberwolf-200');
                                }}
                            />
                        ) : (
                            <div className="h-full bg-gradient-to-br from-timberwolf-100 to-timberwolf-200 flex items-center justify-center">
                                <PhotoIcon className="h-16 w-16 text-black-olive-300" />
                            </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                );

            case 'video':
                return (
                    <div className="relative h-64 bg-eerie-black overflow-hidden">
                        {mediaUrl ? (
                            <div className="h-full">
                                <VideoPreview
                                    src={mediaUrl}
                                    duration={content.duration || 0}
                                    maxDuration={600} // 10 minutes max
                                />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gradient-to-br from-black-olive to-eerie-black">
                                <PlayIcon className="h-16 w-16 text-timberwolf-500" />
                            </div>
                        )}
                    </div>
                );

            case 'audio':
                return (
                    <div className="relative h-64 bg-gradient-to-br from-flame-500 to-flame-700 p-6">
                        {coverUrl ? (
                            <div className="absolute inset-0">
                                <img
                                    src={coverUrl}
                                    alt={content.title}
                                    className="w-full h-full object-cover opacity-30"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
                            </div>
                        ) : null}

                        <div className="relative z-10 h-full flex flex-col justify-center">
                            {mediaUrl && waveformData ? (
                                <AudioWaveform
                                    src={mediaUrl}
                                    waveformData={waveformData}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <MusicalNoteIcon className="h-16 w-16 text-white/80" />
                                    <div className="w-full h-16 flex items-center justify-center">
                                        <div className="w-full bg-white/20 rounded-full h-1">
                                            <div className="bg-white h-full w-0 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="h-64 bg-gradient-to-br from-timberwolf-100 to-timberwolf-200 flex items-center justify-center">
                        <div className="text-black-olive-400">
                            <PhotoIcon className="h-16 w-16 mx-auto mb-2" />
                            <p className="text-sm">No preview available</p>
                        </div>
                    </div>
                );
        }
    };

    const handleLike = (e) => {
        e.preventDefault();
        setIsLiked(!isLiked);
        // TODO: Implement actual like functionality
    };

    return (
        <Link
            to={`/content/${contentId}`}
            className="block group"
        >
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Media Preview */}
                {getContentPreview()}

                {/* Content Info */}
                <div className="p-4 space-y-3">
                    {/* Title and Type */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-eerie-black truncate group-hover:text-flame-600 transition-colors">
                                {content.title || 'Untitled'}
                            </h3>
                            {content.description && (
                                <p className="text-sm text-black-olive-600 line-clamp-2 mt-1">
                                    {content.description}
                                </p>
                            )}
                        </div>
                        <div className="ml-2 flex-shrink-0">
                            {getContentIcon()}
                        </div>
                    </div>

                    {/* Tags */}
                    {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {content.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-timberwolf-200 text-black-olive-700"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {content.tags.length > 3 && (
                                <span className="text-xs text-black-olive-500">
                                    +{content.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Stats and Time */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleLike}
                                className="flex items-center space-x-1 text-black-olive-600 hover:text-flame-600 transition-colors"
                            >
                                {isLiked ? (
                                    <HeartIconSolid className="h-4 w-4 text-flame-600" />
                                ) : (
                                    <HeartIcon className="h-4 w-4" />
                                )}
                                <span>{content.likes || 0}</span>
                            </button>
                            <div className="flex items-center space-x-1 text-black-olive-600">
                                <ChatBubbleLeftIcon className="h-4 w-4" />
                                <span>{content.comments || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-black-olive-600">
                                <EyeIcon className="h-4 w-4" />
                                <span>{content.views || 0}</span>
                            </div>
                        </div>
                        <div className="flex items-center text-black-olive-500">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            <time className="text-xs">
                                {formatDistanceToNow(new Date(content.createdAt || Date.now()), { addSuffix: true })}
                            </time>
                        </div>
                    </div>
                </div>

                {/* Legacy Badge */}
                {isLegacy && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                        Sample
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ContentCard;