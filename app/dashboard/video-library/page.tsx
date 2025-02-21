'use client';

import React, { useState } from 'react';
import { VideoIcon, PlayCircle } from 'lucide-react';

// Mock data for videos - replace with actual data fetching logic
const mockVideos = [
    { id: 1, title: 'Introduction to Blockchain', duration: '10:30', thumbnail: '/path/to/thumbnail1.jpg' },
    { id: 2, title: 'Understanding Cryptocurrencies', duration: '15:45', thumbnail: '/path/to/thumbnail2.jpg' },
    { id: 3, title: 'NFT Basics', duration: '12:20', thumbnail: '/path/to/thumbnail3.jpg' },
    // Add more mock videos as needed
];

const VideoLibrary: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Video Library</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockVideos.map((video) => (
                    <div
                        key={video.id}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setSelectedVideo(video.id)}
                    >
                        <div className="relative">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                                <PlayCircle className="w-16 h-16 text-white" />
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                            <p className="text-sm text-gray-400 flex items-center">
                                <VideoIcon className="w-4 h-4 mr-2" />
                                {video.duration}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-4 rounded-lg max-w-3xl w-full">
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            {mockVideos.find(v => v.id === selectedVideo)?.title}
                        </h2>
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                            {/* Replace with actual video player component */}
                            <div className="bg-gray-800 flex items-center justify-center text-white">
                                Video Player Placeholder
                            </div>
                        </div>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                            onClick={() => setSelectedVideo(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoLibrary;