import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const VideoPreview = ({ src, duration, maxDuration }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    const isOverLimit = duration > maxDuration;

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const updateTime = () => setCurrentTime(video.currentTime);
            video.addEventListener('timeupdate', updateTime);
            return () => video.removeEventListener('timeupdate', updateTime);
        }
    }, []);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative">
            <video
                ref={videoRef}
                src={src}
                className="w-full rounded-lg shadow-md"
                onEnded={() => setIsPlaying(false)}
            />

            {/* Play/Pause Overlay */}
            <button
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity group"
            >
                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isPlaying ? (
                        <PauseIcon className="h-8 w-8 text-eerie-black ml-0.5" />
                    ) : (
                        <PlayIcon className="h-8 w-8 text-eerie-black ml-1" />
                    )}
                </div>
            </button>

            {/* Duration Display */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {formatDuration(currentTime)} / {formatDuration(duration)}
            </div>

            {/* Duration Warning */}
            {isOverLimit && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                    Video exceeds {maxDuration}s limit
                </div>
            )}
        </div>
    );
};

export default VideoPreview;