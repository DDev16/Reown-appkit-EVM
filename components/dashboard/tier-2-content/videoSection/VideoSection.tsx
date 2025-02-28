'use client';

import { Play } from 'lucide-react';
import { VideoItem } from '@/types/types';
import Link from 'next/link';

interface VideoSectionProps {
    videos: VideoItem[];
    title?: string;
    viewAllLink?: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
    videos,
    title = "Latest Videos",
    viewAllLink = "/dashboard/tier-2/view-all-videos",
}) => {
    // Sort videos by newest first
    const sortedVideos = [...videos].sort((a, b) => {
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
                <Link
                    href={viewAllLink}
                    className="text-red-500 hover:text-red-400 transition-colors duration-300"
                >
                    View All
                </Link>
            </div>

            {/* Video list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedVideos.length > 0 ? (
                    sortedVideos.map((video) => (
                        <div key={video.id} className="p-4 bg-gray-800 rounded">
                            <h3 className="text-white">{video.title}</h3>
                            {/* You can add additional video details here */}
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-8 bg-black/20 rounded-lg">
                        <p className="text-gray-400">No videos available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
