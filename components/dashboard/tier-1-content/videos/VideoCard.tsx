'use client';

import { Clock, Play, CalendarClock } from 'lucide-react';
import { VideoItem } from '@/components/dashboard/tier-1-content/utils/types';
import { formatDate, formatDuration } from '@/components/dashboard/tier-1-content/utils/formatters';

interface VideoCardProps {
    video: VideoItem;
    onPlay: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
    return (
        <div className="bg-black/30 rounded-lg overflow-hidden border border-red-900/20 hover:border-red-600/40 transition-colors group">
            <div className="relative">
                <img
                    src={video.thumbnail || "/placeholder-thumbnail.jpg"}
                    alt={video.title || "Video thumbnail"}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-thumbnail.jpg";
                    }}
                />
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDuration(video.duration)}
                </div>

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transform transition-all duration-200 hover:scale-110"
                        onClick={() => onPlay(video)}
                        aria-label={`Play ${video.title}`}
                    >
                        <Play size={24} />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-white line-clamp-1 mb-1">{video.title || "Untitled Video"}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">{video.description || "No description available"}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                        <CalendarClock size={12} className="mr-1" />
                        {formatDate(video.date)}
                    </span>

                    {/* Optional watch progress */}
                    {video.progress && (
                        <div className="w-full mt-2">
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-600"
                                    style={{ width: `${video.progress}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{video.progress}% watched</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};