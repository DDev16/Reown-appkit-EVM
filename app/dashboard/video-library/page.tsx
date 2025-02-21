"use client";
import React, { useState, useEffect } from 'react';
import { Search, PlayCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for videos - replace with actual data fetching logic
const mockVideos = [
    {
        id: 1,
        title: 'Introduction to Blockchain',
        description: 'Learn the basics of blockchain technology and its potential applications.',
        duration: '10:30',
        thumbnail: '/path/to/thumbnail1.jpg',
        category: 'Blockchain',
        views: 1200,
        likes: 156,
        uploadDate: '2023-05-15'
    },
    {
        id: 2,
        title: 'Understanding Cryptocurrencies',
        description: 'Dive into the world of cryptocurrencies and how they work.',
        duration: '15:45',
        thumbnail: '/path/to/thumbnail2.jpg',
        category: 'Cryptocurrency',
        views: 980,
        likes: 132,
        uploadDate: '2023-06-02'
    },
    {
        id: 3,
        title: 'NFT Basics',
        description: 'Explore the concept of Non-Fungible Tokens and their impact on digital ownership.',
        duration: '12:20',
        thumbnail: '/path/to/thumbnail3.jpg',
        category: 'NFTs',
        views: 1500,
        likes: 201,
        uploadDate: '2023-06-20'
    },
    // Add more mock videos as needed
];

const VideoLibrary: React.FC = () => {
    const [videos, setVideos] = useState(mockVideos);
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...Array.from(new Set(mockVideos.map(video => video.category)))];

    useEffect(() => {
        // Filter videos based on search term and category
        const filteredVideos = mockVideos.filter(video =>
            (selectedCategory === 'All' || video.category === selectedCategory) &&
            (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setVideos(filteredVideos);
    }, [searchTerm, selectedCategory]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger the useEffect to filter videos
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Video Library</h1>

            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        className="flex-grow p-2 rounded-l-lg bg-gray-800 text-white border-2 border-red-600 focus:outline-none focus:border-red-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-red-600 text-white p-2 rounded-r-lg hover:bg-red-700 transition-colors"
                    >
                        <Search className="w-6 h-6" />
                    </button>
                </form>

                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-full ${selectedCategory === category
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
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
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded">
                                {video.duration}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{video.description}</p>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{video.views} views</span>
                                <span>{formatDate(video.uploadDate)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-4 rounded-lg max-w-4xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">
                                {videos.find(v => v.id === selectedVideo)?.title}
                            </h2>
                            <button
                                className="text-gray-400 hover:text-white"
                                onClick={() => setSelectedVideo(null)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                            {/* Replace with actual video player component */}
                            <div className="bg-gray-800 flex items-center justify-center text-white">
                                Video Player Placeholder
                            </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                            {videos.find(v => v.id === selectedVideo)?.description}
                        </p>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>{videos.find(v => v.id === selectedVideo)?.views} views</span>
                            <span>{videos.find(v => v.id === selectedVideo)?.likes} likes</span>
                            <span>{formatDate(videos.find(v => v.id === selectedVideo)?.uploadDate || '')}</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                                onClick={() => setSelectedVideo(prevId => {
                                    const index = videos.findIndex(v => v.id === prevId);
                                    return index > 0 ? videos[index - 1].id : prevId;
                                })}
                            >
                                <ChevronLeft className="w-6 h-6" />
                                Previous
                            </button>
                            <button
                                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                                onClick={() => setSelectedVideo(prevId => {
                                    const index = videos.findIndex(v => v.id === prevId);
                                    return index < videos.length - 1 ? videos[index + 1].id : prevId;
                                })}
                            >
                                Next
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoLibrary;