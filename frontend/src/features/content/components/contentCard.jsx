import React from 'react';
import { Link } from 'react-router-dom';
import {
    PlayIcon,
    MusicalNoteIcon,
    PhotoIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
    EyeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const ContentCard = ({ content, onUpdate, isLegacy = false }) => {
    // Handle both new content format and legacy format
    const contentId = content._id || content.id;
    const mediaUrl = content.mediaUrl || '';
    const coverUrl = content.coverUrl || content.thumbnailUrl || '';

    const getContentIcon = () => {
        switch(content.mediaType) {
            case 'video':
                return <PlayIcon className="h-6 w-6" />;
            case 'audio':
                return <MusicalNoteIcon className="h-6 w-6" />;
            case 'image':
                return <PhotoIcon className="h-6 w-6" />;
            default:
                return null;
        }
    };

    const getContentPreview = () => {
        // For legacy content, use placeholder if media doesn't exist
        const placeholderBg = 'bg-gradient-to-br from-timberwolf-100 to-timberwolf-200';

        switch(content.mediaType) {
            case 'image':
                return mediaUrl ? (
                    <img
                        src={mediaUrl}
                        alt={content.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add(placeholderBg);
                        }}
                    />
                ) : (
                    <div className={`h-48 ${placeholderBg} flex items-center justify-center`}>
                        <PhotoIcon className="h-16 w-16 text-black-olive-300" />
                    </div>
                );

            case 'video':
                return mediaUrl ? (
                    <div className="relative">
                        <video
                            src={mediaUrl}
                            className="w-full h-48 object-cover"
                            muted
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <PlayIcon className="h-12 w-12 text-white" />
                        </div>
                    </div>
                ) : (
                    <div className={`h-48 ${placeholderBg} flex items-center justify-center`}>
                        <PlayIcon className="h-16 w-16 text-black-olive-300" />
                    </div>
                );

            case 'audio':
                return (
                    <div className="h-48 bg-gradient-to-br from-black-olive-100 to-black-olive-200 flex items-center justify-center">
                        {coverUrl ? (
                            <img
                                src={coverUrl}
                                alt={content.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <MusicalNoteIcon className="h-16 w-16 text-eerie-black opacity-20" />
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const contentLink = isLegacy ? '#' : `/content/${contentId}`;

    return (
        <div className="relative group">
            {/* Legacy Badge */}
            {isLegacy && (
                <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                    Offline
                </div>
            )}

            <Link
                to={contentLink}
                className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={(e) => {
                    if (isLegacy) {
                        e.preventDefault();
                        // Could show a modal explaining this is legacy content
                    }
                }}
            >
                {/* Preview */}
                <div className="relative overflow-hidden">
                    {getContentPreview()}

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 p-1.5 rounded-lg">
                        {getContentIcon()}
                    </div>

                    {/* Duration for video/audio */}
                    {content.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {Math.floor(content.duration / 60)}:{String(Math.floor(content.duration % 60)).padStart(2, '0')}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-eerie-black group-hover:text-flame-600 transition-colors line-clamp-1">
                        {content.title}
                    </h3>

                    {content.description && (
                        <p className="text-sm text-black-olive-600 mt-1 line-clamp-2">
                            {content.description}
                        </p>
                    )}

                    {/* Stats - only show for non-legacy content */}
                    {!isLegacy && (
                        <div className="flex items-center space-x-4 mt-3 text-sm text-black-olive-500">
                            <span className="flex items-center space-x-1">
                                <EyeIcon className="h-4 w-4" />
                                <span>{content.views || 0}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <HeartIcon className="h-4 w-4" />
                                <span>{content.likes?.length || 0}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <ChatBubbleLeftIcon className="h-4 w-4" />
                                <span>{content.comments?.length || 0}</span>
                            </span>
                        </div>
                    )}

                    {/* Tags */}
                    {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {content.tags.slice(0, 3).map(tag => (
                                <span
                                    key={tag}
                                    className="text-xs bg-timberwolf-100 text-black-olive-600 px-2 py-1 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {content.tags.length > 3 && (
                                <span className="text-xs text-black-olive-500">
                                    +{content.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center mt-3 text-xs text-black-olive-400">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {content.createdAt ? formatDistanceToNow(new Date(content.createdAt), { addSuffix: true }) : 'Some time ago'}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ContentCard;