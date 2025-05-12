// frontend/src/features/profile/components/ProfileTrackFeed.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    fetchTracks,
    selectTracks,
    selectLoading,
    selectPagination,
    selectError,
    setCurrentTrack,
    setIsPlaying
} from '../../tracks/tracksSlice';
import { selectUser } from '../../auth/authSlice';
import EnhancedWaveform from '../../tracks/components/Waveform';
import {
    PlayIcon,
    PauseIcon,
    HeartIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/solid';
import { formatDuration } from '../../../utils/formatters';

const ProfileTrackFeed = ({
                              userId = null,
                              genre = null,
                              compact = true,
                              limit = 5,
                              showHeader = false,
                              className = ""
                          }) => {
    const dispatch = useDispatch();
    const tracks = useSelector(selectTracks);
    const isLoading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const { currentPage, totalPages } = useSelector(selectPagination);
    const currentUser = useSelector(selectUser);
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [isPlayingTrack, setIsPlayingTrack] = useState(false);

    // Fetch tracks on component mount and when filter changes
    useEffect(() => {
        dispatch(fetchTracks({
            page: 1,
            limit: limit,
            userId: userId,
            genre: genre
        }));
    }, [dispatch, userId, genre, limit]);

    // Handle play/pause for a track
    const handlePlayTrack = (track) => {
        if (currentTrackId === track._id) {
            // Toggle play/pause for current track
            setIsPlayingTrack(!isPlayingTrack);
            dispatch(setIsPlaying(!isPlayingTrack));
        } else {
            // Set new track and play it
            setCurrentTrackId(track._id);
            setIsPlayingTrack(true);
            dispatch(setCurrentTrack(track));
            dispatch(setIsPlaying(true));
        }
    };

    // Handle loading more tracks
    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            dispatch(fetchTracks({
                page: currentPage + 1,
                limit: limit,
                userId: userId,
                genre: genre
            }));
        }
    };

    return (
        <div className={className}>
            {/* Optional header */}
            {showHeader && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Tracks</h2>
                    {tracks.length > 0 && (
                        <Link to={userId ? `/u/${userId}/tracks` : "/tracks"} className="text-blue-400 text-sm hover:underline">
                            View all
                        </Link>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 rounded-lg">
                    <p className="text-red-200 text-sm">{error}</p>
                </div>
            )}

            {/* Loading state */}
            {isLoading && tracks.length === 0 && (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && tracks.length === 0 && (
                <div className="bg-gray-900/30 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No tracks found</p>
                </div>
            )}

            {/* Track list */}
            {tracks.length > 0 && (
                <div className="space-y-4">
                    {tracks.map((track) => (
                        <div key={track._id} className="bg-gray-900/40 rounded-lg overflow-hidden">
                            {/* Track header */}
                            <div className="p-4 pb-2">
                                <div className="flex items-center">
                                    {/* User avatar and info */}
                                    <Link to={`/u/${track.user?.username}`} className="flex items-center mr-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                            {track.user?.profile?.avatarUrl ? (
                                                <img
                                                    src={track.user.profile.avatarUrl}
                                                    alt={track.user?.username || 'User'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-300 font-bold">
                            {(track.user?.username || 'U').charAt(0).toUpperCase()}
                          </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">{track.title}</h3>
                                            <p className="text-sm text-gray-400">{track.user?.username}</p>
                                        </div>
                                    </Link>

                                    {/* Stats */}
                                    <div className="flex items-center space-x-4 ml-auto text-xs text-gray-400">
                                        <div className="flex items-center">
                                            <PlayIcon className="h-3 w-3 mr-1" />
                                            <span>{track.plays || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
                                            <span>{track.comments?.length || track.commentCount || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <HeartIcon className="h-3 w-3 mr-1" />
                                            <span>{track.likes?.length || track.likeCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Waveform area */}
                            <div className="px-4 pb-4 relative">
                                <div className="flex items-center">
                                    {/* Play/Pause button */}
                                    <button
                                        onClick={() => handlePlayTrack(track)}
                                        className="absolute z-10 left-8 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700"
                                    >
                                        {currentTrackId === track._id && isPlayingTrack ? (
                                            <PauseIcon className="h-5 w-5" />
                                        ) : (
                                            <PlayIcon className="h-5 w-5" />
                                        )}
                                    </button>

                                    {/* Waveform */}
                                    <div className="flex-1 h-20 ml-14">
                                        <EnhancedWaveform
                                            waveformData={track.waveformData}
                                            duration={track.duration || 0}
                                            currentTime={0}
                                            onSeek={() => handlePlayTrack(track)}
                                            isPlaying={currentTrackId === track._id && isPlayingTrack}
                                            visualizationStyle="gradient"
                                            barWidth={1.5}
                                            barSpacing={0.5}
                                        />
                                    </div>
                                </div>

                                {/* Track metadata */}
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                    <div className="flex items-center">
                    <span>
                      {new Date(track.createdAt).toLocaleDateString(undefined, {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric'
                      })}
                    </span>
                                    </div>

                                    {track.genre && (
                                        <div className="px-2 py-1 bg-gray-800 rounded-md">
                                            {track.genre}
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <span>{formatDuration(track.duration || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load more button */}
            {tracks.length > 0 && currentPage < totalPages && (
                <div className="mt-4 text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 disabled:opacity-50 text-sm"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileTrackFeed;