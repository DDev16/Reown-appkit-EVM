import React, { useState, useEffect, useCallback } from 'react';
import { VideoItem } from '@/types/types';
import { VideoCard } from '../../videos/VideoCard';
import { VideoModal } from '../../videos/VideoModal';
import { useAccount } from 'wagmi';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface VideoSectionProps {
    videos: VideoItem[];
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
    // State to track videos with progress information
    const [videoList, setVideoList] = useState<VideoItem[]>(videos);
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [progressDataLoaded, setProgressDataLoaded] = useState(false);

    // Get user wallet connection status
    const { address, isConnected } = useAccount();

    // Load progress data from Firebase when component mounts or wallet connects
    useEffect(() => {
        // Skip if progress data already loaded or no wallet connection
        if (progressDataLoaded || !isConnected || !address) {
            return;
        }

        const loadProgressData = async () => {
            try {
                // Skip if no videos to process
                if (videos.length === 0) {
                    setProgressDataLoaded(true);
                    return;
                }

                // Create a copy of videos to update with progress data
                const updatedVideos = [...videos];
                const userId = address.toLowerCase();
                const userProgressRef = doc(db, 'userProgress', userId);
                const userProgressDoc = await getDoc(userProgressRef);

                if (userProgressDoc.exists()) {
                    const progressData = userProgressDoc.data();
                    const items = progressData.items || [];

                    // Update video list with progress information
                    for (let i = 0; i < updatedVideos.length; i++) {
                        const videoProgress = items.find(
                            (item: any) => item.id === updatedVideos[i].id && item.contentType === 'video'
                        );

                        if (videoProgress) {
                            updatedVideos[i] = {
                                ...updatedVideos[i],
                                progress: videoProgress.progress,
                                lastPosition: videoProgress.lastPosition,
                                completed: videoProgress.completed
                            };
                        }
                    }

                    setVideoList(updatedVideos);
                }

                setProgressDataLoaded(true);
            } catch (error) {
                console.error('Error loading progress data:', error);
                setProgressDataLoaded(true);
            }
        };

        loadProgressData();
    }, [videos, address, isConnected, progressDataLoaded]);

    // Handle video selection and open modal
    const handleVideoClick = useCallback((video: VideoItem) => {
        setSelectedVideo(video);
        setIsModalOpen(true);
    }, []);

    // Close modal
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // Save progress to Firebase
    const saveProgress = useCallback(async (
        videoId: string,
        currentTime: number,
        duration: number,
        progressPercentage: number,
        title: string
    ) => {
        if (!isConnected || !address) return;

        try {
            const userId = address.toLowerCase();
            const userProgressRef = doc(db, 'userProgress', userId);
            const userProgressDoc = await getDoc(userProgressRef);

            const isCompleted = progressPercentage >= 90;

            const videoProgress = {
                id: videoId,
                title: title,
                lastPosition: currentTime,
                duration: duration,
                progress: progressPercentage,
                completed: isCompleted,
                contentType: 'video',
                lastUpdated: new Date().toISOString()
            };

            if (userProgressDoc.exists()) {
                const data = userProgressDoc.data();
                const items = data.items || [];

                const videoIndex = items.findIndex((item: any) =>
                    item.id === videoId && item.contentType === 'video'
                );

                if (videoIndex >= 0) {
                    items[videoIndex] = {
                        ...items[videoIndex],
                        ...videoProgress
                    };
                } else {
                    items.push(videoProgress);
                }

                await updateDoc(userProgressRef, {
                    items: items,
                    lastUpdated: new Date().toISOString()
                });
            } else {
                await setDoc(userProgressRef, {
                    userId,
                    walletAddress: address,
                    items: [videoProgress],
                    lastUpdated: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }, [address, isConnected]);

    // Track video progress - memoized to prevent infinite loops
    const handleVideoProgress = useCallback((videoId: string, currentTime: number, duration: number) => {
        if (duration <= 0) return; // Prevent division by zero

        // Calculate progress percentage
        const progressPercentage = Math.floor((currentTime / duration) * 100);

        // Update the selected video and video list
        setSelectedVideo(prevSelectedVideo => {
            if (prevSelectedVideo && prevSelectedVideo.id === videoId) {
                return {
                    ...prevSelectedVideo,
                    progress: progressPercentage,
                    lastPosition: currentTime,
                    completed: progressPercentage >= 90
                };
            }
            return prevSelectedVideo;
        });

        setVideoList(prevVideos =>
            prevVideos.map(video =>
                video.id === videoId
                    ? {
                        ...video,
                        progress: progressPercentage,
                        lastPosition: currentTime,
                        completed: progressPercentage >= 90
                    }
                    : video
            )
        );

        // Find the video title
        const video = videoList.find(v => v.id === videoId);
        if (video) {
            // Save progress to Firebase (throttled by the debounce)
            saveProgress(
                videoId,
                currentTime,
                duration,
                progressPercentage,
                video.title || "Unknown Video"
            );
        }
    }, [videoList, saveProgress]);

    return (
        <div>
            {!isConnected && (
                <div className="bg-amber-900/20 border border-amber-800 text-amber-400 p-3 mb-4 rounded-md text-sm">
                    Connect your wallet to track your progress and earn rewards.
                </div>
            )}

            {videoList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No videos available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoList.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onClick={handleVideoClick}
                        />
                    ))}
                </div>
            )}

            {/* Video Modal */}
            <VideoModal
                video={selectedVideo}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProgress={handleVideoProgress}
            />
        </div>
    );
};