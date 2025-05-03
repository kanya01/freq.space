//EnhancedWaveform
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { formatDuration } from '../../../utils/formatters';

const EnhancedWaveform = ({
                              waveformData,
                              duration,
                              currentTime,
                              onSeek,
                              isPlaying,
                              comments = [],
                              visualizationStyle = 'gradient', // 'gradient', 'pulse', 'bars'
                              primaryColor = '#3B82F6', // Blue default
                              secondaryColor = '#1E3A8A', // Darker blue for gradient
                              barWidth = 2,
                              barSpacing = 1,
                          }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoveredPosition, setHoveredPosition] = useState(null);
    const [parsedWaveform, setParsedWaveform] = useState([]);
    const [hoverComment, setHoverComment] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Process comments to group them by time
    const commentsByTime = useMemo(() => {
        const grouped = {};
        comments.forEach(comment => {
            const roundedTime = Math.floor(comment.timestamp);
            if (!grouped[roundedTime]) {
                grouped[roundedTime] = [];
            }
            grouped[roundedTime].push(comment);
        });
        return grouped;
    }, [comments]);

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
                } else {
                    // Create a fallback if no data is provided
                    const fallbackData = Array(100).fill(0).map(() => Math.random() * 0.5 + 0.1);
                    setParsedWaveform(fallbackData);
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

    // Handle window resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Draw waveform on canvas with animation
    useEffect(() => {
        if (isLoaded && canvasRef.current && parsedWaveform.length > 0 && dimensions.width > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions with device pixel ratio for sharper rendering
            const dpr = window.devicePixelRatio || 1;
            canvas.width = dimensions.width * dpr;
            canvas.height = dimensions.height * dpr;

            // Scale the context to account for the device pixel ratio
            ctx.scale(dpr, dpr);

            // Style for the canvas element itself
            canvas.style.width = `${dimensions.width}px`;
            canvas.style.height = `${dimensions.height}px`;

            const drawFrame = () => {
                // Clear canvas
                ctx.clearRect(0, 0, dimensions.width, dimensions.height);

                // Calculate progress
                const progress = Math.min(currentTime / duration, 1);
                const progressPosition = dimensions.width * progress;

                // Create gradient for played portion
                const playedGradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
                playedGradient.addColorStop(0, primaryColor);
                playedGradient.addColorStop(1, secondaryColor);

                // Create gradient for unplayed portion
                const unplayedGradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
                unplayedGradient.addColorStop(0, '#4B5563');
                unplayedGradient.addColorStop(1, '#1F2937');

                // Calculate bar dimensions based on data and container
                const totalBars = parsedWaveform.length;
                const actualBarWidth = Math.max(1, barWidth);
                const actualSpacing = Math.max(0, barSpacing);
                const scaleFactor = dimensions.width / (totalBars * (actualBarWidth + actualSpacing));

                // Animation time factor for pulse effect
                const now = Date.now() / 1000;

                // Draw each bar of the waveform
                parsedWaveform.forEach((amplitude, index) => {
                    // Position for this bar
                    const x = index * (actualBarWidth + actualSpacing) * scaleFactor;

                    // Skip drawing if outside visible area
                    if (x > dimensions.width) return;

                    // Determine if this bar is in the played portion
                    const isPlayed = x < progressPosition;

                    // Apply visualization effects
                    let adjustedAmplitude = amplitude;

                    if (visualizationStyle === 'pulse' && isPlayed && isPlaying) {
                        // Pulse effect - subtle wave motion for played portion
                        const pulseOffset = Math.sin(now * 3 + index * 0.2) * 0.1;
                        adjustedAmplitude = Math.max(0.05, amplitude + pulseOffset);
                    } else if (visualizationStyle === 'bars') {
                        // Bars effect - more digital looking, less smooth
                        adjustedAmplitude = Math.round(amplitude * 10) / 10;
                    }

                    // Calculate bar height and position
                    const barHeight = Math.max(2, adjustedAmplitude * dimensions.height * 0.8);
                    const y = (dimensions.height - barHeight) / 2;

                    // Set gradient based on played status
                    ctx.fillStyle = isPlayed ? playedGradient : unplayedGradient;

                    // Draw bar with rounded corners for a modern look
                    if (actualBarWidth > 3) {
                        const radius = Math.min(2, actualBarWidth / 2);
                        ctx.beginPath();
                        ctx.moveTo(x + radius, y);
                        ctx.lineTo(x + actualBarWidth - radius, y);
                        ctx.quadraticCurveTo(x + actualBarWidth, y, x + actualBarWidth, y + radius);
                        ctx.lineTo(x + actualBarWidth, y + barHeight - radius);
                        ctx.quadraticCurveTo(x + actualBarWidth, y + barHeight, x + actualBarWidth - radius, y + barHeight);
                        ctx.lineTo(x + radius, y + barHeight);
                        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
                        ctx.lineTo(x, y + radius);
                        ctx.quadraticCurveTo(x, y, x + radius, y);
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        // Simpler rendering for thin bars
                        ctx.fillRect(x, y, actualBarWidth, barHeight);
                    }
                });

                // Draw playhead
                if (isPlaying) {
                    // Draw animated playhead line
                    const playheadWidth = 2;
                    const glowSize = 10;

                    // Glow effect
                    const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
                    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)');

                    ctx.save();
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                    ctx.shadowBlur = glowSize;
                    ctx.fillStyle = gradient;
                    ctx.fillRect(progressPosition - playheadWidth/2, 0, playheadWidth, dimensions.height);
                    ctx.restore();
                } else {
                    // Simpler playhead when paused
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(progressPosition - 1, 0, 2, dimensions.height);
                }

                // Continue animation if playing
                if (isPlaying && visualizationStyle === 'pulse') {
                    animationRef.current = requestAnimationFrame(drawFrame);
                }
            };

            // Start drawing
            drawFrame();

            // For non-animated styles, we don't need continuous updates
            if (!isPlaying || visualizationStyle !== 'pulse') {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                    animationRef.current = null;
                }
            }
        }
    }, [isLoaded, parsedWaveform, currentTime, duration, isPlaying, dimensions, visualizationStyle, primaryColor, secondaryColor, barWidth, barSpacing]);

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

        // Find if there's a comment near this time
        const roundedTime = Math.floor(hoverTime);
        const nearbyComments = commentsByTime[roundedTime];

        setHoverComment(nearbyComments && nearbyComments.length > 0 ? {
            comments: nearbyComments,
            x: hoverPosition
        } : null);

        setHoveredPosition({
            x: hoverPosition,
            time: hoverTime
        });
    };

    // Clear hover position when mouse leaves
    const handleMouseLeave = () => {
        setHoveredPosition(null);
        setHoverComment(null);
    };

    return (
        <div
            ref={containerRef}
            className="enhanced-waveform relative h-24 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg cursor-pointer overflow-hidden"
            onClick={handleWaveformClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* Comment markers - modern floating dots */}
            {comments && comments.map((comment, index) => {
                // Calculate position based on timestamp
                const position = (comment.timestamp / duration) * 100;

                return (
                    <div
                        key={index}
                        className="absolute h-full flex flex-col justify-end items-center z-10"
                        style={{
                            left: `${position}%`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <div
                            className="w-2 h-2 bg-yellow-400 rounded-full cursor-pointer mb-1 hover:scale-150 transition-transform
                                       shadow-md shadow-yellow-500/50 hover:shadow-yellow-500/70"
                            title={`${comment.user?.username || 'User'}: ${comment.text}`}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent seeking when clicking on comment
                                onSeek(comment.timestamp);
                            }}
                        />
                        <div className="w-px h-4 bg-yellow-400/50"></div>
                    </div>
                );
            })}

            {/* Hover time indicator */}
            {hoveredPosition && (
                <div
                    className="absolute bg-gray-900 bg-opacity-90 text-white text-xs px-2 py-1 rounded pointer-events-none
                              transform -translate-x-1/2 backdrop-blur-sm z-20 font-mono"
                    style={{
                        left: hoveredPosition.x,
                        bottom: '100%',
                        marginBottom: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    {formatDuration(hoveredPosition.time)}
                </div>
            )}

            {/* Comment hover display */}
            {hoverComment && (
                <div
                    className="absolute bg-gray-900 bg-opacity-90 text-white text-xs px-3 py-2 rounded pointer-events-none
                              transform -translate-x-1/2 backdrop-blur-sm max-w-xs z-30"
                    style={{
                        left: hoverComment.x,
                        top: '100%',
                        marginTop: '4px'
                    }}
                >
                    <div className="flex flex-col space-y-2 max-h-28 overflow-y-auto">
                        {hoverComment.comments.map((comment, i) => (
                            <div key={i} className="flex items-start space-x-2">
                                <div className="flex-shrink-0 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-[8px] overflow-hidden">
                                    {comment.user?.profile?.avatarUrl ? (
                                        <img src={comment.user.profile.avatarUrl} alt={comment.user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{comment.user?.username?.charAt(0).toUpperCase() || '?'}</span>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium text-[10px]">{comment.user?.username || 'User'}</span>
                                    <p className="text-gray-300 text-[9px] leading-tight">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedWaveform;