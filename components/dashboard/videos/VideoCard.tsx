import React, { useState } from 'react';
import { PlayCircle, Clock, BookmarkCheck } from 'lucide-react';
import { VideoItem } from '@/types/types';
import { formatDate, formatDuration } from '@/utils/formatters';

interface VideoCardProps {
    video: VideoItem;
    onClick: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
    const [isHovering, setIsHovering] = useState(false);

    // Determine if the video is completed (progress >= 90%)
    const isCompleted = video.progress && video.progress >= 90;

    // Determine if the video is in progress (0 < progress < 90%)
    const isInProgress = video.progress && video.progress > 0 && video.progress < 90;

    return (
        <div
            className="bg-zinc-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
            onClick={() => onClick(video)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Thumbnail with overlay */}
            <div className="relative aspect-video bg-zinc-900">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />

                {/* Play overlay */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    <PlayCircle size={48} className="text-white opacity-80" />
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDuration(video.duration)}
                </div>

                {/* Completion badge */}
                {isCompleted && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-900/80 text-white text-xs rounded-md flex items-center">
                        <BookmarkCheck size={12} className="mr-1" />
                        Completed
                    </div>
                )}

                {/* Resume indicator */}
                {isInProgress && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
                        Resume
                    </div>
                )}

                {/* Progress bar for in-progress videos */}
                {video.progress !== undefined && video.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                        <div
                            className={`h-full ${isCompleted ? 'bg-green-600' : 'bg-red-600'}`}
                            style={{ width: `${video.progress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Video info */}
            <div className="p-3">
                <h3 className="font-medium text-white text-sm mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{video.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(video.date)}</span>
                    {video.views && (
                        <span>{video.views.toLocaleString()} views</span>
                    )}
                </div>

                {/* Progress percentage for in-progress videos */}
                {isInProgress && (
                    <div className="mt-2 text-xs text-gray-400">
                        {video.progress}% watched
                    </div>
                )}
            </div>
        </div>
    );
};