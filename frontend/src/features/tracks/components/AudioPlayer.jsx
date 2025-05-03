// frontend/src/features/tracks/components/AudioPlayer.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon
} from '@heroicons/react/24/solid';
import { formatDuration } from '../../../utils/formatters';
// Import the new enhanced waveform component
import EnhancedWaveform from './Waveform';
import { setCurrentTrack, setIsPlaying } from '../tracksSlice';

const AudioPlayer = ({ track, waveformData, showComments = true, expanded = false, onTimeUpdate }) => {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [visualizationStyle, setVisualizationStyle] = useState('gradient'); // 'gradient', 'pulse', 'bars'

    const dispatch = useDispatch();
    const { currentTrack, isPlaying } = useSelector(state => state.tracks);

    // Check if this player is controlling the current track
    const isCurrentTrack = currentTrack && currentTrack._id === track._id;

    // Load audio metadata when component mounts
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
                setIsLoaded(true);
            };

            audio.addEventListener('loadedmetadata', handleLoadedMetadata);

            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [track]);

    // Update time display during playback
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleTimeUpdate = () => {
                const newTime = audio.currentTime;
                setCurrentTime(newTime);
                // Pass time update to parent component if provided
                if (onTimeUpdate) {
                    onTimeUpdate(newTime);
                }
            };

            audio.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [onTimeUpdate]);

    // Sync playback state with global state
    useEffect(() => {
        const audio = audioRef.current;
        if (audio && isCurrentTrack) {
            if (isPlaying) {
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                    dispatch(setIsPlaying(false));
                });
            } else {
                audio.pause();
            }
        } else if (audio && !isCurrentTrack) {
            audio.pause();
        }
    }, [isPlaying, isCurrentTrack, dispatch]);

    // Handle end of track
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => {
                dispatch(setIsPlaying(false));
                setCurrentTime(0);
                audio.currentTime = 0;
            };

            audio.addEventListener('ended', handleEnded);

            return () => {
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, [dispatch]);

    // Handle play/pause
    const handlePlayPause = () => {
        if (!isCurrentTrack) {
            dispatch(setCurrentTrack(track));
        }
        dispatch(setIsPlaying(!isPlaying));
    };

    // Handle seeked time from waveform
    const handleSeek = (seekTime) => {
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);

            if (!isCurrentTrack) {
                dispatch(setCurrentTrack(track));
            }

            if (!isPlaying) {
                dispatch(setIsPlaying(true));
            }
        }
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);

        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (audioRef.current) {
            const newMutedState = !isMuted;
            setIsMuted(newMutedState);

            if (newMutedState) {
                audioRef.current.volume = 0;
            } else {
                audioRef.current.volume = volume;
            }
        }
    };

    // Toggle visualization style
    const cycleVisualizationStyle = () => {
        const styles = ['gradient', 'pulse', 'bars'];
        const currentIndex = styles.indexOf(visualizationStyle);
        const nextIndex = (currentIndex + 1) % styles.length;
        setVisualizationStyle(styles[nextIndex]);
    };

    return (
        <div className={`audio-player bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-4 ${expanded ? 'w-full' : ''}`}>
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={track.trackUrl}
                preload="metadata"
            />

            <div className="flex items-center space-x-4 mb-4">
                {/* Track cover */}
                <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden shadow-lg">
                    {track.coverUrl ? (
                        <img
                            src={track.coverUrl}
                            alt={track.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <span className="text-xl">🎵</span>
                        </div>
                    )}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{track.title}</h3>
                    <p className="text-gray-400 text-sm truncate">
                        {track.user?.username || 'Unknown artist'}
                    </p>
                </div>

                {/* Play/Pause button */}
                <button
                    onClick={handlePlayPause}
                    className={`p-3 rounded-full transition-all duration-300 transform active:scale-95 ${
                        isCurrentTrack && isPlaying
                            ? 'bg-white text-black shadow-lg'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600'
                    }`}
                >
                    {isCurrentTrack && isPlaying ? (
                        <PauseIcon className="w-6 h-6" />
                    ) : (
                        <PlayIcon className="w-6 h-6" />
                    )}
                </button>

                {/* Visualization style toggle button (new) */}
                <button
                    onClick={cycleVisualizationStyle}
                    className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    title="Change visualization style"
                >
                    {visualizationStyle === 'gradient' ? 'Gradient' :
                        visualizationStyle === 'pulse' ? 'Pulse' : 'Bars'}
                </button>
            </div>

            {/* Enhanced Waveform - new component */}
            <div className="mb-4">
                <EnhancedWaveform
                    waveformData={waveformData}
                    duration={duration || track.duration}
                    currentTime={isCurrentTrack ? currentTime : 0}
                    onSeek={handleSeek}
                    isPlaying={isCurrentTrack && isPlaying}
                    comments={showComments ? track.comments : []}
                    visualizationStyle={visualizationStyle}
                    // You can customize these props as needed
                    primaryColor="#3B82F6" // Blue
                    secondaryColor="#1E40AF" // Darker blue for gradient
                    barWidth={expanded ? 3 : 2}
                    barSpacing={expanded ? 1 : 0.5}
                />
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between">
                {/* Time display */}
                <div className="text-gray-300 text-sm font-mono">
                    {formatDuration(currentTime)} / {formatDuration(duration || track.duration)}
                </div>

                {/* Volume control */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleMute}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {isMuted ? (
                            <SpeakerXMarkIcon className="w-5 h-5" />
                        ) : (
                            <SpeakerWaveIcon className="w-5 h-5" />
                        )}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 accent-blue-600"
                    />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;