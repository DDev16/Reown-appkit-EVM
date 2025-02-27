'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Minimize2, Volume2, VolumeX, Bookmark, BookmarkCheck } from 'lucide-react';
import { VideoItem } from '@/types/content';
import { formatDate, formatDuration } from '@/utils/formatters';
import { useWagmiAnalytics } from '@/hooks/useWeb3Analytics';

interface VideoModalProps {
    video: VideoItem | null;
    isOpen: boolean;
    onClose: () => void;
    onProgress?: (videoId: string, currentTime: number, duration: number) => void;
}

export const VideoModalWithWagmi: React.FC<VideoModalProps> = ({
    video,
    isOpen,
    onClose
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Analytics hook for tracking using wagmi
    const { trackVideoWatched, isWalletConnected } = useWagmiAnalytics();

    // Track progress at intervals and on close
    useEffect(() => {
        if (!isOpen || !video || !videoRef.current || !isWalletConnected) {
            console.log("Video tracking not initialized:", {
                isOpen,
                videoId: video?.id,
                videoRef: !!videoRef.current,
                isWalletConnected
            });
            return;
        }

        console.log("Video tracking initialized for:", video.id, "wallet connected:", isWalletConnected);

        // Set initial state
        setIsMuted(videoRef.current.muted);

        // Start playback from the last position if available
        if (video.lastPosition && videoRef.current) {
            videoRef.current.currentTime = video.lastPosition;
        }

        // Update local state when duration is available
        const handleDurationChange = () => {
            if (videoRef.current) {
                setDuration(videoRef.current.duration);
                console.log("Video duration set:", videoRef.current.duration);
            }
        };

        // Update current time while playing
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
            }
        };

        // Calculate progress percentage
        const getProgressPercentage = () => {
            if (!videoRef.current || !duration) return 0;
            return (videoRef.current.currentTime / duration) * 100;
        };

        // Track video progress at regular intervals (10 seconds)
        const progressInterval = setInterval(() => {
            if (videoRef.current && videoRef.current.currentTime > 0 && !videoRef.current.paused) {
                const progressPercentage = getProgressPercentage();
                console.log("Interval tracking:", video.id, videoRef.current.currentTime,
                    progressPercentage, "wallet:", isWalletConnected);

                trackVideoWatched(
                    video.id,
                    videoRef.current.currentTime,
                    progressPercentage
                );
            }
        }, 10000);

        // Track on pause
        const handlePause = () => {
            if (videoRef.current && videoRef.current.currentTime > 0) {
                const progressPercentage = getProgressPercentage();
                console.log("Pause tracking:", video.id, videoRef.current.currentTime,
                    progressPercentage, "wallet:", isWalletConnected);

                trackVideoWatched(
                    video.id,
                    videoRef.current.currentTime,
                    progressPercentage
                );
            }
        };

        // Track when the video ends
        const handleEnded = () => {
            if (videoRef.current) {
                console.log("End tracking:", video.id, videoRef.current.duration,
                    100, "wallet:", isWalletConnected);

                trackVideoWatched(
                    video.id,
                    videoRef.current.duration,
                    100
                );
            }
        };

        // Add event listeners
        const videoElement = videoRef.current;
        videoElement.addEventListener('durationchange', handleDurationChange);
        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        videoElement.addEventListener('pause', handlePause);
        videoElement.addEventListener('ended', handleEnded);

        return () => {
            clearInterval(progressInterval);
            console.log("Cleaning up video tracking");

            // Remove event listeners
            if (videoElement) {
                videoElement.removeEventListener('durationchange', handleDurationChange);
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
                videoElement.removeEventListener('pause', handlePause);
                videoElement.removeEventListener('ended', handleEnded);
            }

            // Save final progress on close if video was played
            if (isWalletConnected && videoElement && videoElement.currentTime > 0) {
                const finalProgress = getProgressPercentage();
                console.log("Final tracking on close:", {
                    videoId: video.id,
                    time: videoElement.currentTime,
                    progress: finalProgress,
                    walletConnected: isWalletConnected,
                    duration: videoElement.duration
                });

                // Use async/await approach to ensure tracking completes
                (async () => {
                    try {
                        await trackVideoWatched(
                            video.id,
                            videoElement.currentTime,
                            finalProgress
                        );
                        console.log("Final tracking completed successfully");
                    } catch (e) {
                        console.error("Error in final tracking:", e);
                    }
                })();
            } else {
                console.log("No final tracking - conditions not met:", {
                    walletConnected: isWalletConnected,
                    videoElement: !!videoElement,
                    currentTime: videoElement?.currentTime || 0
                });
            }
        };
    }, [isOpen, video, trackVideoWatched, isWalletConnected]);

    // Watch for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isFullscreen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose, isFullscreen]);

    // Close when clicking outside of video container
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!videoRef.current) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen();
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(!isMuted);
    };

    // Toggle bookmark
    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // This could also trigger a Firestore write to save the bookmark state
    };

    // Format for progress display (1:23 / 3:45)
    const formatProgress = () => {
        if (!duration) return '0:00 / 0:00';
        return `${formatDuration(Math.floor(currentTime))} / ${formatDuration(Math.floor(duration))}`;
    };

    // Handle wallet connection message
    const renderWalletWarning = () => {
        if (isWalletConnected) return null;

        return (
            <div className="absolute top-0 left-0 right-0 bg-yellow-900/80 text-yellow-100 px-4 py-2 text-sm">
                Connect your wallet to track video progress
            </div>
        );
    };

    if (!isOpen || !video) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            ref={modalRef}
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-4xl mx-4 bg-zinc-900 rounded-lg overflow-hidden">
                {/* Wallet connection warning */}
                {renderWalletWarning()}

                {/* Video header with title and close button */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <h3 className="text-white font-medium truncate pr-2">{video.title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Close"
                        data-testid="video-modal-close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Video player */}
                <div className="relative bg-black aspect-video">
                    <video
                        ref={videoRef}
                        src={video.url}
                        className="w-full h-full"
                        controls
                        autoPlay
                        poster={video.thumbnail}
                        data-testid="video-player"
                    >
                        Your browser does not support the video tag.
                    </video>

                    {/* Custom video controls overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 to-transparent">
                        {/* Left controls */}
                        <div className="flex space-x-2">
                            <button
                                onClick={toggleBookmark}
                                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                                data-testid="video-bookmark-button"
                            >
                                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                            </button>
                            <span className="text-white text-xs self-center ml-2">
                                {formatProgress()}
                            </span>
                        </div>

                        {/* Right controls */}
                        <div className="flex space-x-2">
                            <button
                                onClick={toggleMute}
                                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                                data-testid="video-mute-button"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                data-testid="video-fullscreen-button"
                            >
                                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Progress indicator for resume */}
                    {video.progress && video.progress < 90 && (
                        <div className="absolute top-2 left-2 flex items-center bg-black/70 px-2 py-1 rounded-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
                            <span className="text-white text-xs">Resume at {formatDuration(video.lastPosition || 0)}</span>
                        </div>
                    )}
                </div>

                {/* Video info */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-white">{video.title}</h4>
                        <span className="text-xs text-gray-400">
                            {formatDuration(video.duration)} duration
                        </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-2">{video.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Added on {formatDate(video.date)}</span>
                        {video.views && (
                            <span>{video.views.toLocaleString()} views</span>
                        )}
                    </div>

                    {/* Progress bar */}
                    {!isNaN(currentTime) && !isNaN(duration) && duration > 0 && (
                        <div className="mt-3">
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-600"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">
                                    {Math.round((currentTime / duration) * 100)}% watched
                                </span>
                                {currentTime / duration >= 0.9 && (
                                    <span className="text-xs text-green-500 flex items-center">
                                        <BookmarkCheck size={12} className="mr-1" />
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};