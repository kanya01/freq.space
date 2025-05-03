// frontend/src/pages/TrackDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTrackById,
    likeTrack,
    deleteTrackById,
    selectTrackDetails,
    selectLoading
} from '../features/tracks/tracksSlice';
import { selectUser } from '../features/auth/authSlice';
import AudioPlayer from '../features/tracks/components/AudioPlayer';
import TimestampComments from '../features/tracks/components/TimestampComments';
import {
    HeartIcon,
    ShareIcon,
    PencilIcon,
    TrashIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { formatRelativeTime } from '../utils/formatters';

const TrackDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const track = useSelector(state => selectTrackDetails(state, id));
    const isLoading = useSelector(selectLoading);
    const currentUser = useSelector(selectUser);

    const [currentTime, setCurrentTime] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch track data
    useEffect(() => {
        if (id) {
            dispatch(fetchTrackById({ id, incrementPlay: true }));
        }
    }, [dispatch, id]);

    // Handle like action
    const handleLike = () => {
        if (!currentUser) {
            // Redirect to login if not authenticated
            navigate('/login', { state: { from: `/tracks/${id}` } });
            return;
        }

        dispatch(likeTrack(id));
    };

    // Handle share action
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: track?.title || 'Check out this track',
                text: `Listen to ${track?.title} by ${track?.user?.username}`,
                url: window.location.href
            }).catch(err => {
                console.error('Error sharing:', err);
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    alert('Link copied to clipboard!');
                })
                .catch(err => {
                    console.error('Error copying to clipboard:', err);
                });
        }
    };

    // Handle delete action
    const handleDelete = () => {
        if (showDeleteConfirm) {
            dispatch(deleteTrackById(id)).then((resultAction) => {
                if (!resultAction.error) {
                    navigate('/');
                }
            });
        } else {
            setShowDeleteConfirm(true);
        }
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    // Check if current user is the owner
    const isOwner = currentUser && track && currentUser._id === track.user?._id;

    // Check if current user has liked the track
    const hasLiked = currentUser && track?.likes?.some(like => like._id === currentUser._id);

    if (isLoading && !track) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!track && !isLoading) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">Track Not Found</h1>
                    <p className="text-gray-400 mb-6">The track you're looking for doesn't exist or has been removed.</p>
                    <Link to="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back to home</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
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

                {/* Track header */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Track cover */}
                        <div className="w-full md:w-48 h-48 flex-shrink-0">
                            {track.coverUrl ? (
                                <img
                                    src={track.coverUrl}
                                    alt={track.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                                    <span className="text-4xl">🎵</span>
                                </div>
                            )}
                        </div>

                        {/* Track info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">{track.title}</h1>

                            <Link
                                to={`/u/${track.user?.username}`}
                                className="inline-flex items-center space-x-2 mb-4 hover:text-blue-400"
                            >
                                {track.user?.profile?.avatarUrl ? (
                                    <img
                                        src={track.user.profile.avatarUrl}
                                        alt={track.user.username}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">
                                            {track.user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                                <span className="text-gray-300">{track.user?.username}</span>
                            </Link>

                            {/* Track description */}
                            {track.description && (
                                <p className="text-gray-300 mb-4 whitespace-pre-line">{track.description}</p>
                            )}

                            {/* Track metadata */}
                            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                                <span className="text-gray-400">
                                    {formatRelativeTime(track.createdAt)}
                                </span>

                                {track.genre && (
                                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                                        {track.genre}
                                    </span>
                                )}

                                <span className="text-gray-400">
                                    {track.plays || 0} plays
                                </span>
                            </div>

                            {/* Tags */}
                            {track.tags && track.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {track.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center space-x-4">
                                {/* Like button */}
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                                        hasLiked
                                            ? 'bg-red-900 bg-opacity-30 text-red-500'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {hasLiked ? (
                                        <HeartIconSolid className="h-5 w-5" />
                                    ) : (
                                        <HeartIcon className="h-5 w-5" />
                                    )}
                                    <span>{track.likes?.length || 0}</span>
                                </button>

                                {/* Share button */}
                                <button
                                    onClick={handleShare}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700"
                                >
                                    <ShareIcon className="h-5 w-5" />
                                    <span>Share</span>
                                </button>

                                {/* Edit button (owner only) */}
                                {isOwner && (
                                    <Link
                                        to={`/tracks/${id}/edit`}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                        <span>Edit</span>
                                    </Link>
                                )}

                                {/* Delete button (owner only) */}
                                {isOwner && (
                                    <div className="relative">
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-900 bg-opacity-30 text-red-500 rounded-full hover:bg-red-900 hover:bg-opacity-50"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                            <span>{showDeleteConfirm ? 'Confirm Delete' : 'Delete'}</span>
                                        </button>

                                        {showDeleteConfirm && (
                                            <button
                                                onClick={handleCancelDelete}
                                                className="mt-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 absolute top-full left-0 whitespace-nowrap"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audio player */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                    <AudioPlayer
                        track={track}
                        waveformData={track.waveformData}
                        showComments={true}
                        expanded={true}
                        onTimeUpdate={setCurrentTime}
                    />
                </div>

                {/* Comments section */}
                <div className="bg-gray-900 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-6">
                        Comments ({track.comments?.length || 0})
                    </h2>

                    <TimestampComments
                        trackId={id}
                        comments={track.comments || []}
                        currentTime={currentTime}
                        onSeek={(time) => {
                            // This will be handled by parent component
                            // and passed to AudioPlayer
                            setCurrentTime(time);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TrackDetailPage;