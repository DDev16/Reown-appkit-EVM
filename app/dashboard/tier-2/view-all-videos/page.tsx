'use client';

import { useState, useEffect } from 'react';
import {
    Play, CheckCircle, Clock, Filter, Search,
    ChevronDown, X
} from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useAccount } from 'wagmi';
import { db } from '@/lib/firebase';

interface VideoItem {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number; // in seconds
    url: string;
    date: string;
    category?: string;
    tags?: string[];
    progress?: number; // 0-100
    completed?: boolean;
}

export default function Tier1VideosPage() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Get connected wallet for tracking progress
    const { address } = useAccount();

    // Current tier
    const currentTier = 2;

    // Generate progress tracking ID (using wallet address or fallback to localStorage)
    const getProgressTrackingId = () => {
        if (address) return address;

        // Fallback to localStorage if no wallet connected
        let localId = localStorage.getItem('progressTrackingId');
        if (!localId) {
            localId = 'anonymous-' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('progressTrackingId', localId);
        }
        return localId;
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // Filter videos when search query or category changes
    useEffect(() => {
        filterVideos();
    }, [searchQuery, selectedCategory, videos]);

    // Fetch videos for the current tier
    const fetchVideos = async () => {
        try {
            setIsLoading(true);
            const trackingId = getProgressTrackingId();

            // Fetch videos
            const videosQuery = query(
                collection(db, "videos"),
                where("tier", "==", currentTier)
            );
            const videoSnapshot = await getDocs(videosQuery);
            const videosList = videoSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as VideoItem));

            // Extract unique categories
            const uniqueCategories = Array.from(
                new Set(videosList.map(video => video.category).filter(Boolean))
            ) as string[];
            setCategories(uniqueCategories);

            // Fetch user progress for videos
            const updatedVideos = await Promise.all(
                videosList.map(async (video) => {
                    try {
                        const progressRef = doc(db, "progress", `${trackingId}_video_${video.id}`);
                        const progressSnap = await getDoc(progressRef);
                        if (progressSnap.exists()) {
                            const progressData = progressSnap.data();
                            return {
                                ...video,
                                progress: progressData.progress || 0,
                                completed: progressData.completed || false
                            };
                        }
                    } catch (err) {
                        console.error(`Error fetching progress for video ${video.id}:`, err);
                    }
                    return video;
                })
            );

            setVideos(updatedVideos);
            setFilteredVideos(updatedVideos);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setIsLoading(false);
        }
    };

    // Filter videos based on search query and selected category
    const filterVideos = () => {
        let filtered = [...videos];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(video =>
                video.title.toLowerCase().includes(query) ||
                video.description.toLowerCase().includes(query) ||
                (video.tags && video.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }

        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(video => video.category === selectedCategory);
        }

        setFilteredVideos(filtered);
    };

    // Update video progress
    const updateVideoProgress = async (videoId: string, progress: number) => {
        const trackingId = getProgressTrackingId();

        const completed = progress >= 95;
        await setDoc(doc(db, "progress", `${trackingId}_video_${videoId}`), {
            progress,
            completed,
            lastUpdated: new Date().toISOString()
        }, { merge: true });

        // Update local state
        setVideos(prevVideos =>
            prevVideos.map(video =>
                video.id === videoId ? { ...video, progress, completed } : video
            )
        );
    };

    // Format seconds to MM:SS
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-8 h-8 border-t-2 border-red-600 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-gray-400">Loading videos...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">Tier 2 Video Library</h1>

                {/* Search and filter controls */}
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search videos..."
                            className="bg-black/40 border border-red-900/30 rounded-lg pl-9 pr-4 py-2 text-white w-full md:w-60"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filters panel */}
            {showFilters && (
                <div className="bg-black/30 border border-red-900/30 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium">Filter Videos</h3>
                        <button
                            onClick={clearFilters}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center"
                        >
                            Clear All <X className="ml-1 w-3 h-3" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h4 className="text-sm text-gray-400 mb-2">Categories</h4>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(prevCat => prevCat === category ? null : category)}
                                        className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedCategory === category ?
                                            'bg-red-600 text-white' :
                                            'bg-black/40 text-white/80 hover:bg-black/60'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-400">
                Showing {filteredVideos.length} of {videos.length} videos
            </div>

            {/* Videos grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => (
                        <div key={video.id} className="bg-black/30 rounded-lg overflow-hidden border border-red-900/20 hover:border-red-600/40 transition-colors">
                            <div className="relative">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                    <span className="text-white text-sm flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        {formatDuration(video.duration)}
                                    </span>
                                </div>

                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-transform transform hover:scale-110"
                                        onClick={() => {
                                            // Handle playing video
                                            console.log(`Play video: ${video.id}`);
                                            // For demonstration, update progress by 25% each click
                                            const newProgress = ((video.progress || 0) + 25) % 125;
                                            updateVideoProgress(video.id, newProgress);
                                        }}
                                    >
                                        <Play size={24} />
                                    </button>
                                </div>

                                {/* Progress bar */}
                                {(video.progress !== undefined && video.progress > 0) ? (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                                        <div
                                            className="h-full bg-red-600"
                                            style={{ width: `${video.progress}%` }}
                                        ></div>
                                    </div>
                                ) : null}

                                {/* Completed indicator */}
                                {video.completed ? (
                                    <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
                                        <CheckCircle size={16} />
                                    </div>
                                ) : null}

                                {/* Category tag */}
                                {video.category && (
                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                        {video.category}
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-white">{video.title}</h3>
                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{video.description}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs text-gray-500">{formatDate(video.date)}</span>
                                    <button
                                        className="text-xs bg-red-900/30 hover:bg-red-900/50 text-white px-3 py-1 rounded"
                                    >
                                        {video.completed ? 'Watch Again' : video.progress ? 'Continue' : 'Start'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">No videos match your filters. Try adjusting your search criteria.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-2 text-red-400 hover:text-red-300"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}