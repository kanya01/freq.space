// frontend/src/features/tracks/components/TrackFeed.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    fetchTracks,
    selectTracks,
    selectLoading,
    selectPagination,
    selectError
} from '../tracksSlice';
import { selectUser } from '../../auth/authSlice';
import AudioPlayer from './AudioPlayer';
import { HeartIcon, ChatBubbleLeftIcon, PlayIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const TrackFeed = ({ userId = null, genre = null }) => {
    const dispatch = useDispatch();
    const tracks = useSelector(selectTracks);
    const isLoading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const { currentPage, totalPages, totalTracks } = useSelector(selectPagination);
    const currentUser = useSelector(selectUser);

    const [filter, setFilter] = useState({
        userId: userId,
        genre: genre
    });

    // Load tracks on component mount and when filter changes
    useEffect(() => {
        dispatch(fetchTracks({
            page: 1,
            limit: 10,
            userId: filter.userId,
            genre: filter.genre
        }));
    }, [dispatch, filter.userId, filter.genre]);

    // Handle loading more tracks
    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            dispatch(fetchTracks({
                page: currentPage + 1,
                limit: 10,
                userId: filter.userId,
                genre: filter.genre
            }));
        }
    };

    // Handle genre filter change
    const handleGenreChange = (selectedGenre) => {
        setFilter(prev => ({
            ...prev,
            genre: selectedGenre === filter.genre ? null : selectedGenre // Toggle off if already selected
        }));
    };

    // Popular genre options
    const popularGenres = [
        'Electronic', 'Hip-Hop', 'Pop', 'Rock', 'R&B', 'Jazz', 'Classical'
    ];

    return (
        <div className="track-feed">
            {/* Genre filters */}
            {!userId && (
                <div className="mb-6 overflow-x-auto">
                    <div className="flex space-x-2 pb-2">
                        {popularGenres.map((genreName) => (
                            <button
                                key={genreName}
                                onClick={() => handleGenreChange(genreName)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                                    filter.genre === genreName
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {genreName}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mb-6 p-4 bg-red-900 rounded-md">
                    <p className="text-red-100">{error}</p>
                </div>
            )}

            {/* Initial loading state */}
            {isLoading && tracks.length === 0 && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            {/* No tracks found */}
            {!isLoading && tracks.length === 0 && (
                <div className="text-center py-12 bg-gray-900 rounded-lg">
                    <p className="text-gray-400 text-lg">
                        {filter.userId
                            ? 'This user has not uploaded any tracks yet.'
                            : filter.genre
                                ? `No tracks found in the ${filter.genre} genre.`
                                : 'No tracks found.'}
                    </p>

                    {/* Upload CTA if viewing own profile */}
                    {filter.userId && userId === (currentUser?._id) && (
                        <Link
                            to="/upload"
                            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Upload your first track
                        </Link>
                    )}
                </div>
            )}

            {/* Track list */}
            {tracks.length > 0 && (
                <div className="space-y-6">
                    {tracks.map((track) => (
                        <div key={track._id} className="bg-gray-900 rounded-lg overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-center space-x-3 mb-4">
                                    {/* User avatar */}
                                    <Link to={`/u/${track.user?.username}`} className="flex-shrink-0">
                                        {track.user?.profile?.avatarUrl ? (
                                            <img
                                                src={track.user.profile.avatarUrl}
                                                alt={track.user.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                                                <span className="text-lg font-bold text-white">
                                                    {track.user?.username?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* User and track info */}
                                    <div className="min-w-0">
                                        <Link to={`/tracks/${track._id}`} className="block">
                                            <h3 className="text-white font-semibold truncate hover:text-blue-400">
                                                {track.title}
                                            </h3>
                                        </Link>
                                        <Link to={`/u/${track.user?.username}`} className="block">
                                            <p className="text-gray-400 text-sm truncate hover:text-gray-300">
                                                {track.user?.username || 'Unknown artist'}
                                                {track.user?.profile?.userType && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        {track.user.profile.userType}
                                                    </span>
                                                )}
                                            </p>
                                        </Link>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center space-x-4 text-gray-400 ml-auto">
                                        {/* Play count */}
                                        <div className="flex items-center space-x-1">
                                            <PlayIcon className="h-4 w-4" />
                                            <span className="text-sm">{track.plays || 0}</span>
                                        </div>

                                        {/* Comment count */}
                                        <div className="flex items-center space-x-1">
                                            <ChatBubbleLeftIcon className="h-4 w-4" />
                                            <span className="text-sm">{track.commentCount || 0}</span>
                                        </div>

                                        {/* Like count */}
                                        <div className="flex items-center space-x-1">
                                            {track.isLiked ? (
                                                <HeartIconSolid className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <HeartIcon className="h-4 w-4" />
                                            )}
                                            <span className="text-sm">{track.likeCount || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Audio player */}
                                <AudioPlayer
                                    track={track}
                                    waveformData={track.waveformData}
                                    showComments={false}
                                />

                                {/* Track details */}
                                <div className="mt-4 flex flex-wrap items-center space-x-2 text-sm">
                                    {/* Upload time */}
                                    <span className="text-gray-500">
                                        {new Date(track.createdAt).toLocaleDateString()}
                                    </span>

                                    {/* Genre tag */}
                                    {track.genre && (
                                        <span
                                            className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full cursor-pointer hover:bg-gray-700"
                                            onClick={() => handleGenreChange(track.genre)}
                                        >
                                            {track.genre}
                                        </span>
                                    )}

                                    {/* Tags */}
                                    {track.tags && track.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full cursor-pointer hover:bg-gray-700"
                                        >
                                            #{tag}
                                        </span>
                                    ))}

                                    {/* More tags indicator */}
                                    {track.tags && track.tags.length > 3 && (
                                        <span className="text-gray-500">
                                            +{track.tags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load more button */}
            {tracks.length > 0 && currentPage < totalPages && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}

            {/* Tracks count */}
            {tracks.length > 0 && (
                <div className="mt-4 text-center text-gray-500 text-sm">
                    Showing {tracks.length} of {totalTracks} tracks
                </div>
            )}
        </div>
    );
};

export default TrackFeed;