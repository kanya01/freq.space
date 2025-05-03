// frontend/src/features/tracks/components/Waveform.jsx
import React, { useEffect, useRef, useState } from 'react';

const Waveform = ({
                      waveformData,
                      duration,
                      currentTime,
                      onSeek,
                      isPlaying,
                      comments = []
                  }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoveredPosition, setHoveredPosition] = useState(null);
    const [parsedWaveform, setParsedWaveform] = useState([]);

    // Load waveform data
    useEffect(() => {
        const loadWaveformData = async () => {
            try {
                // If waveformData is a URL, fetch it
                if (typeof waveformData === 'string' && waveformData.startsWith('/')) {
                    const response = await fetch(waveformData);
                    const data = await response.json();
                    setParsedWaveform(data);
                } else if (Array.isArray(waveformData)) {
                    // If waveformData is already an array
                    setParsedWaveform(waveformData);
                }
                setIsLoaded(true);
            } catch (error) {
                console.error('Error loading waveform data:', error);
                // Create a fallback waveform if loading fails
                const fallbackData = Array(100).fill(0).map(() => Math.random() * 0.5 + 0.1);
                setParsedWaveform(fallbackData);
                setIsLoaded(true);
            }
        };

        loadWaveformData();
    }, [waveformData]);

    // Draw waveform on canvas
    useEffect(() => {
        if (isLoaded && canvasRef.current && parsedWaveform.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            // Set canvas dimensions
            canvas.width = containerWidth;
            canvas.height = containerHeight;

            // Clear canvas
            ctx.clearRect(0, 0, containerWidth, containerHeight);

            // Calculate progress
            const progress = Math.min(currentTime / duration, 1);
            const progressPosition = containerWidth * progress;

            // Draw waveform
            const barWidth = containerWidth / parsedWaveform.length;
            const barMargin = Math.max(0, (barWidth * 0.2));
            const drawableBarWidth = barWidth - barMargin;

            parsedWaveform.forEach((amplitude, index) => {
                const x = index * barWidth;
                const barHeight = Math.max(2, amplitude * containerHeight * 0.8); // Ensure minimum height
                const y = (containerHeight - barHeight) / 2;

                // Set color based on playback position
                if (x < progressPosition) {
                    ctx.fillStyle = '#3B82F6'; // Blue for played portion
                } else {
                    ctx.fillStyle = '#4B5563'; // Gray for unplayed portion
                }

                // Draw bar
                ctx.fillRect(x + barMargin / 2, y, drawableBarWidth, barHeight);
            });

            // Draw playhead line
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(progressPosition - 1, 0, 2, containerHeight);
        }
    }, [isLoaded, parsedWaveform, currentTime, duration, isPlaying]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            // Trigger redraw by setting a state that the useEffect depends on
            setIsLoaded(false);
            setTimeout(() => setIsLoaded(true), 10);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle click on waveform for seeking
    const handleWaveformClick = (e) => {
        if (!containerRef.current || !duration) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const seekPercentage = clickPosition / rect.width;
        const seekTime = seekPercentage * duration;

        onSeek(seekTime);
    };

    // Handle mouse movement for hover position
    const handleMouseMove = (e) => {
        if (!containerRef.current || !duration) return;

        const rect = containerRef.current.getBoundingClientRect();
        const hoverPosition = e.clientX - rect.left;
        const hoverPercentage = hoverPosition / rect.width;
        const hoverTime = hoverPercentage * duration;

        setHoveredPosition({
            x: hoverPosition,
            time: hoverTime
        });
    };

    // Clear hover position when mouse leaves
    const handleMouseLeave = () => {
        setHoveredPosition(null);
    };

    return (
        <div
            ref={containerRef}
            className="waveform-container relative h-24 bg-gray-800 rounded cursor-pointer"
            onClick={handleWaveformClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* Comment markers */}
            {comments && comments.map((comment, index) => {
                // Calculate position based on timestamp
                const position = (comment.timestamp / duration) * 100;

                return (
                    <div
                        key={index}
                        className="absolute w-1 h-4 bg-yellow-400 cursor-pointer transform -translate-x-1/2"
                        style={{
                            left: `${position}%`,
                            bottom: '0'
                        }}
                        title={`${comment.user?.username || 'User'}: ${comment.text}`}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent seeking when clicking on comment
                            onSeek(comment.timestamp);
                        }}
                    />
                );
            })}

            {/* Hover time indicator */}
            {hoveredPosition && (
                <div
                    className="absolute bg-gray-700 text-white text-xs px-2 py-1 rounded pointer-events-none transform -translate-x-1/2"
                    style={{
                        left: hoveredPosition.x,
                        bottom: '100%',
                        marginBottom: '4px'
                    }}
                >
                    {Math.floor(hoveredPosition.time / 60)}:
                    {Math.floor(hoveredPosition.time % 60).toString().padStart(2, '0')}
                </div>
            )}
        </div>
    );
};

export default Waveform;