import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Maximize2, Minimize2, Volume2, VolumeX, Bookmark, BookmarkCheck } from 'lucide-react';
import { VideoItem } from '@/types/types';
import { formatDate, formatDuration } from '@/utils/formatters';

interface VideoModalProps {
    video: VideoItem | null;
    isOpen: boolean;
    onClose: () => void;
    onProgress?: (videoId: string, currentTime: number, duration: number) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
    video,
    isOpen,
    onClose,
    onProgress
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Clear interval on unmount
    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
        };
    }, []);

    // Start playback from the last position if available
    useEffect(() => {
        if (isOpen && videoRef.current && video?.lastPosition) {
            // Small timeout to ensure video is ready
            const timer = setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.currentTime = video.lastPosition || 0;
                }
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen, video]);

    // Report progress once when closing
    const reportFinalProgress = useCallback(() => {
        const videoElement = videoRef.current;
        if (!videoElement || !onProgress || !video) return;

        if (videoElement.currentTime > 0) {
            onProgress(video.id, videoElement.currentTime, videoElement.duration);
        }
    }, [video, onProgress]);

    // Track video progress
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement || !onProgress || !video || !isOpen) return;

        // Clear any existing interval
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }

        // Function to report progress
        const reportProgress = () => {
            if (videoElement.currentTime > 0) {
                onProgress(video.id, videoElement.currentTime, videoElement.duration);
            }
        };

        // Save progress every 5 seconds
        progressIntervalRef.current = setInterval(reportProgress, 5000);

        // Also save on pause
        const handlePause = () => {
            reportProgress();
        };

        // And save when the video ends
        const handleEnded = () => {
            onProgress(video.id, videoElement.duration, videoElement.duration);
        };

        videoElement.addEventListener('pause', handlePause);
        videoElement.addEventListener('ended', handleEnded);

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            videoElement.removeEventListener('pause', handlePause);
            videoElement.removeEventListener('ended', handleEnded);
        };
    }, [isOpen, video, onProgress]);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                reportFinalProgress();
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
    }, [isOpen, onClose, reportFinalProgress]);

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

    // Close when clicking outside of video container
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && e.target === modalRef.current) {
            reportFinalProgress();
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
        const newMutedState = !videoRef.current.muted;
        videoRef.current.muted = newMutedState;
        setIsMuted(newMutedState);
    };

    // Toggle bookmark
    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // Here you could also save this to a database
    };

    // Safe close handler
    const handleClose = () => {
        reportFinalProgress();
        onClose();
    };

    if (!isOpen || !video) return null;

    // Use consistent threshold (90%) for completion status
    const isVideoCompleted = video.progress !== undefined && video.progress >= 90;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            ref={modalRef}
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-4xl mx-4 bg-zinc-900 rounded-lg overflow-hidden">
                {/* Video header with title and close button */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <h3 className="text-white font-medium truncate pr-2">{video.title}</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Close"
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
                            >
                                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                            </button>
                        </div>

                        {/* Right controls */}
                        <div className="flex space-x-2">
                            <button
                                onClick={toggleMute}
                                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                            >
                                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Progress indicator */}
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
                        <span className="text-xs text-gray-400">{formatDuration(video.duration)}</span>
                    </div>

                    <p className="text-gray-300 text-sm mb-2">{video.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Added on {formatDate(video.date)}</span>
                        {video.views && (
                            <span>{video.views.toLocaleString()} views</span>
                        )}
                    </div>

                    {/* Progress bar */}
                    {video.progress !== undefined && (
                        <div className="mt-3">
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-600"
                                    style={{ width: `${video.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">{video.progress}% watched</span>
                                {isVideoCompleted && (
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