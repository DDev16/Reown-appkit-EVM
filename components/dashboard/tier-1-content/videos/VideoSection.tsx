'use client';

import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { VideoItem } from '@/components/dashboard/tier-1-content/utils/types';
import { VideoCard } from './VideoCard';
import { VideoModal } from './VideoModal';
import { useVideoProgress } from './useVideoProgress';

interface VideoSectionProps {
    videos: VideoItem[];
    title?: string;
    viewAllLink?: string;
    userId?: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
    videos,
    title = "Latest Videos",
    viewAllLink = "/dashboard/tier-1/videos",
    userId = "anonymous" // In a real app, this would come from auth
}) => {
    // State for selected video and modal
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use the progress hook
    const {
        isLoading: isProgressLoading,
        saveVideoProgress,
        enhanceVideosWithProgress
    } = useVideoProgress(userId);

    // Enhanced videos with progress data
    const [enhancedVideos, setEnhancedVideos] = useState<VideoItem[]>(videos);

    // Update enhanced videos when progress data changes
    useEffect(() => {
        if (!isProgressLoading) {
            setEnhancedVideos(enhanceVideosWithProgress(videos));
        }
    }, [isProgressLoading, videos, enhanceVideosWithProgress]);

    // Handle playing a video
    const handlePlayVideo = (video: VideoItem) => {
        // Find the enhanced version of this video with progress info
        const enhancedVideo = enhancedVideos.find(v => v.id === video.id) || video;
        setSelectedVideo(enhancedVideo);
        setIsModalOpen(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Handle video progress updates
    const handleVideoProgress = (videoId: string, currentTime: number, duration: number) => {
        saveVideoProgress(videoId, currentTime, duration);
    };

    // Sort videos by newest first (default behavior)
    const sortedVideos = [...enhancedVideos].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <div>
            {/* Header with title and view all link */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div className="flex items-center">
                    <Play className="w-5 h-5 text-red-500 mr-2" />
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <span className="ml-2 px-2 py-0.5 bg-red-900/50 text-red-100 rounded text-xs">
                        {videos.length}
                    </span>
                </div>


            </div>

            {/* Loading state for progress data */}
            {isProgressLoading ? (
                <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedVideos.length > 0 ? (
                        sortedVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onPlay={handlePlayVideo}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8 bg-black/20 rounded-lg">
                            <p className="text-gray-400">No videos available yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Video modal */}
            <VideoModal
                video={selectedVideo}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProgress={handleVideoProgress}
            />
        </div>
    );
};