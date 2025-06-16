import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { formatDuration } from '../../../utils/formatters';

const AudioWaveform = ({ src, waveformData }) => {
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const updateTime = () => setCurrentTime(audio.currentTime);
            const updateDuration = () => setDuration(audio.duration);

            audio.addEventListener('timeupdate', updateTime);
            audio.addEventListener('loadedmetadata', updateDuration);
            audio.addEventListener('ended', () => setIsPlaying(false));

            return () => {
                audio.removeEventListener('timeupdate', updateTime);
                audio.removeEventListener('loadedmetadata', updateDuration);
            };
        }
    }, []);

    // Draw waveform
    useEffect(() => {
        if (canvasRef.current && waveformData && waveformData.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            const barWidth = width / waveformData.length;
            const progress = duration > 0 ? currentTime / duration : 0;

            waveformData.forEach((amplitude, i) => {
                const x = i * barWidth;
                const barHeight = amplitude * height * 0.8;
                const y = (height - barHeight) / 2;

                // Color based on progress
                ctx.fillStyle = i / waveformData.length < progress
                    ? '#EB5E28' // flame color for played portion
                    : '#CCC5B9'; // timberwolf for unplayed

                ctx.fillRect(x, y, barWidth - 1, barHeight);
            });
        }
    }, [waveformData, currentTime, duration]);

    return (
        <div>
            <audio ref={audioRef} src={src} />

            <div className="flex items-center space-x-4">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlayPause}
                    className="w-12 h-12 bg-flame-600 rounded-full flex items-center justify-center text-white hover:bg-flame-700 transition-colors shadow-md"
                >
                    {isPlaying ? (
                        <PauseIcon className="h-6 w-6" />
                    ) : (
                        <PlayIcon className="h-6 w-6 ml-0.5" />
                    )}
                </button>

                {/* Waveform */}
                <div className="flex-1">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={60}
                        className="w-full h-16 bg-timberwolf-50 rounded-lg"
                    />
                </div>

                {/* Time Display */}
                <div className="text-sm text-black-olive-700 font-mono">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                </div>
            </div>
        </div>
    );
};

export default AudioWaveform;