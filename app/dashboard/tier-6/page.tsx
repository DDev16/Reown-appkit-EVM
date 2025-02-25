"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    BookOpen, Play, Award, Users, Video, Calendar,
    ChevronRight, CheckCircle, Clock, LucidePlayCircle,
    Menu, X, Search, Bell, User, ChevronDown, Filter, Crown,
    Star, Bookmark, Circle, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Type definitions
interface VideoType {
    id: number;
    title: string;
    thumbnail: string;
    duration: string;
    completed: boolean;
    progress: number;
    category: string;
    instructor: string;
    date: string;
    views: number;
}

interface CourseType {
    id: number;
    title: string;
    thumbnail: string;
    totalVideos: number;
    completedVideos: number;
    progress: number;
    instructor: string;
    category: string;
    difficulty: string;
    duration: string;
}

interface BlogType {
    id: number;
    title: string;
    excerpt: string;
    thumbnail: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
}

interface TestType {
    id: number;
    title: string;
    description: string;
    questions: number;
    timeLimit: string;
    difficulty: string;
    completed: boolean;
    score: number | null;
    category: string;
}

interface ZoomCallType {
    id: number;
    title: string;
    date: string;
    time: string;
    duration: string;
    host: string;
    participants: number;
    registered: boolean;
    description: string;
}

// Mock data for videos
const videoLibraryData: VideoType[] = [
    {
        id: 1,
        title: "Introduction to Blockchain Technology",
        thumbnail: "/videos/blockchain-intro.jpg",
        duration: "12:45",
        completed: true,
        progress: 100,
        category: "Blockchain",
        instructor: "Dr. Sarah Chen",
        date: "2024-01-15",
        views: 1245
    },
    {
        id: 2,
        title: "Understanding NFT Fundamentals",
        thumbnail: "/videos/nft-basics.jpg",
        duration: "18:22",
        completed: true,
        progress: 100,
        category: "NFTs",
        instructor: "Michael Roberts",
        date: "2024-01-18",
        views: 982
    },
    {
        id: 3,
        title: "Tokenomics and Sustainable Economics",
        thumbnail: "/videos/tokenomics.jpg",
        duration: "23:51",
        completed: false,
        progress: 67,
        category: "Finance",
        instructor: "Elena Martinez",
        date: "2024-01-22",
        views: 754
    },
    {
        id: 4,
        title: "Web3 Development Introduction",
        thumbnail: "/videos/web3-dev.jpg",
        duration: "32:10",
        completed: false,
        progress: 45,
        category: "Development",
        instructor: "James Wilson",
        date: "2024-01-28",
        views: 620
    },
    {
        id: 5,
        title: "Crypto Market Analysis",
        thumbnail: "/videos/market-analysis.jpg",
        duration: "26:33",
        completed: false,
        progress: 0,
        category: "Markets",
        instructor: "Dr. Sarah Chen",
        date: "2024-02-05",
        views: 412
    },
    {
        id: 6,
        title: "DeFi Protocols Explained",
        thumbnail: "/videos/defi-protocols.jpg",
        duration: "29:17",
        completed: false,
        progress: 0,
        category: "DeFi",
        instructor: "Michael Roberts",
        date: "2024-02-12",
        views: 345
    }
];

// Mock data for courses
const coursesData: CourseType[] = [
    {
        id: 1,
        title: "Complete Blockchain Fundamentals",
        thumbnail: "/courses/blockchain-course.jpg",
        totalVideos: 12,
        completedVideos: 5,
        progress: 42,
        instructor: "Dr. Sarah Chen",
        category: "Blockchain",
        difficulty: "Beginner",
        duration: "6 hours"
    },
    {
        id: 2,
        title: "NFT Creation & Marketing",
        thumbnail: "/courses/nft-course.jpg",
        totalVideos: 8,
        completedVideos: 2,
        progress: 25,
        instructor: "Michael Roberts",
        category: "NFTs",
        difficulty: "Intermediate",
        duration: "4 hours"
    },
    {
        id: 3,
        title: "Advanced Tokenomics",
        thumbnail: "/courses/tokenomics-course.jpg",
        totalVideos: 10,
        completedVideos: 0,
        progress: 0,
        instructor: "Elena Martinez",
        category: "Finance",
        difficulty: "Advanced",
        duration: "5 hours"
    }
];

// Mock data for blogs
const blogsData: BlogType[] = [
    {
        id: 1,
        title: "The Future of NFTs in Education",
        excerpt: "Exploring how NFTs are transforming educational credentials and course access...",
        thumbnail: "/blogs/nft-education.jpg",
        author: "Elena Martinez",
        date: "Feb 15, 2024",
        readTime: "5 min read",
        category: "Education"
    },
    {
        id: 2,
        title: "Understanding Layer 2 Scaling Solutions",
        excerpt: "A deep dive into the various Layer 2 solutions addressing blockchain scalability...",
        thumbnail: "/blogs/layer2.jpg",
        author: "James Wilson",
        date: "Feb 10, 2024",
        readTime: "8 min read",
        category: "Technology"
    },
    {
        id: 3,
        title: "NFT Pricing Strategies for Creators",
        excerpt: "How to effectively price your NFT collections for maximum value and sustainability...",
        thumbnail: "/blogs/nft-pricing.jpg",
        author: "Michael Roberts",
        date: "Feb 5, 2024",
        readTime: "6 min read",
        category: "Creation"
    },
    {
        id: 4,
        title: "Web3 Security Best Practices",
        excerpt: "Essential security measures every Web3 participant should implement...",
        thumbnail: "/blogs/web3-security.jpg",
        author: "Dr. Sarah Chen",
        date: "Jan 28, 2024",
        readTime: "7 min read",
        category: "Security"
    }
];

// Mock data for knowledge tests
const knowledgeTestsData: TestType[] = [
    {
        id: 1,
        title: "Blockchain Fundamentals Quiz",
        description: "Test your understanding of basic blockchain concepts and technology",
        questions: 10,
        timeLimit: "15 minutes",
        difficulty: "Beginner",
        completed: true,
        score: 8,
        category: "Blockchain"
    },
    {
        id: 2,
        title: "NFT Concepts Assessment",
        description: "Evaluate your knowledge about NFTs, standards, and marketplaces",
        questions: 15,
        timeLimit: "20 minutes",
        difficulty: "Intermediate",
        completed: false,
        score: null,
        category: "NFTs"
    },
    {
        id: 3,
        title: "Tokenomics Challenge",
        description: "Advanced questions about token economics, distribution, and utility",
        questions: 12,
        timeLimit: "25 minutes",
        difficulty: "Advanced",
        completed: false,
        score: null,
        category: "Finance"
    }
];

// Mock data for upcoming zoom calls
const zoomCallsData: ZoomCallType[] = [
    {
        id: 1,
        title: "Iridium Tier Community Meetup",
        date: "March 15, 2024",
        time: "18:00 UTC",
        duration: "1 hour",
        host: "Michael Roberts",
        participants: 42,
        registered: true,
        description: "Monthly community call for all Iridium Tier members. Updates on platform development and Q&A session."
    },
    {
        id: 2,
        title: "NFT Market Trends Discussion",
        date: "March 28, 2024",
        time: "16:00 UTC",
        duration: "1.5 hours",
        host: "Elena Martinez",
        participants: 35,
        registered: false,
        description: "Special educational session focusing on current NFT market trends and future predictions."
    }
];

// Video player component with progress tracking
interface VideoPlayerProps {
    video: VideoType;
    onProgress: (videoId: number, progress: number) => void;
    onComplete: (videoId: number) => void;
}

const VideoPlayer = ({ video, onProgress, onComplete }: VideoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(video.progress);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);

        // Simulate progress updates when playing
        if (!isPlaying && !video.completed) {
            const interval = setInterval(() => {
                setCurrentProgress(prev => {
                    const newProgress = Math.min(prev + 1, 100);

                    // Update parent component with progress
                    onProgress(video.id, newProgress);

                    // Check if completed
                    if (newProgress === 100) {
                        clearInterval(interval);
                        onComplete(video.id);
                    }

                    return newProgress;
                });
            }, 300); // Fast simulation for demo purposes

            return () => clearInterval(interval);
        }
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                {video.thumbnail ? (
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-black/50 z-10"></div>
                        <div className="relative w-full h-full opacity-60">
                            {/* This would be a real video player in production */}
                            <div className="w-full h-full flex items-center justify-center">
                                <button
                                    onClick={handlePlayPause}
                                    className="relative z-20 transform transition-all duration-300 hover:scale-110"
                                >
                                    {isPlaying ? (
                                        <div className="w-16 h-16 rounded-full bg-[#BC1A1E]/90 flex items-center justify-center">
                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-[#BC1A1E]/90 flex items-center justify-center">
                                            <LucidePlayCircle className="w-10 h-10 text-white" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-white/50">Video preview not available</div>
                )}
            </div>

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-white font-medium text-lg">{video.title}</h3>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">{video.duration}</span>
                        {video.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <Badge className={`${video.completed ? 'bg-green-600' : 'bg-[#BC1A1E]'}`}>
                        {video.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0">
                <Progress value={currentProgress} className="h-1 rounded-none bg-gray-800" />
            </div>
        </div>
    );
};

// Video card component for library and courses
interface VideoCardProps {
    video: VideoType | CourseType;
    type?: "library" | "course";
    onClick: (video: VideoType | CourseType) => void;
}

const VideoCard = ({ video, type = "library", onClick }: VideoCardProps) => {
    // Type guard to check if we're dealing with a course or video
    const isCourse = 'totalVideos' in video && 'completedVideos' in video;
    const isVideo = 'completed' in video;

    return (
        <div
            className="group relative rounded-xl overflow-hidden border border-gray-800 hover:border-[#BC1A1E]/50 transition-all duration-300 cursor-pointer bg-black/50"
            onClick={() => onClick(video)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 group-hover:opacity-70 transition-opacity z-10"></div>

                {/* Placeholder image */}
                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                    {/* This would be a real image in production */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-12 h-12 text-[#BC1A1E]/80 group-hover:text-[#BC1A1E] transition-colors" />
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-20">
                    {video.duration}
                </div>

                {/* Completion Status */}
                {isCourse ? (
                    // For courses
                    video.progress === 100 ? (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs p-1 rounded-full z-20">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                    ) : video.progress > 0 ? (
                        <div className="absolute top-2 right-2 bg-[#BC1A1E] text-white text-xs p-1 rounded-full z-20">
                            <Clock className="w-4 h-4" />
                        </div>
                    ) : null
                ) : isVideo && (
                    // For videos
                    video.completed ? (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs p-1 rounded-full z-20">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                    ) : video.progress > 0 ? (
                        <div className="absolute top-2 right-2 bg-[#BC1A1E] text-white text-xs p-1 rounded-full z-20">
                            <Clock className="w-4 h-4" />
                        </div>
                    ) : null
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="font-medium text-white truncate">{video.title}</h3>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-xs">{video.category}</span>

                    {isCourse ? (
                        <span className="text-gray-400 text-xs">{(video as CourseType).completedVideos}/{(video as CourseType).totalVideos} videos</span>
                    ) : isVideo && (
                        <span className="text-gray-400 text-xs">{(video as VideoType).instructor}</span>
                    )}
                </div>

                {/* Progress bar */}
                {(video.progress > 0 || type === "course") && (
                    <div className="mt-2">
                        <Progress
                            value={video.progress}
                            className="h-1 bg-gray-800"
                        />
                        {video.progress > 0 && (isCourse ? video.progress < 100 : isVideo && !video.completed) && (
                            <span className="text-gray-400 text-xs mt-1 block">{video.progress}% complete</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Course card component
interface CourseCardProps {
    course: CourseType;
    onClick: (course: CourseType) => void;
}

const CourseCard = ({ course, onClick }: CourseCardProps) => {
    return (
        <div
            className="group relative rounded-xl overflow-hidden border border-gray-800 hover:border-[#BC1A1E]/50 transition-all duration-300 cursor-pointer bg-black/50"
            onClick={() => onClick(course)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 group-hover:opacity-70 transition-opacity z-10"></div>

                {/* Placeholder image */}
                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                    {/* This would be a real image in production */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-[#BC1A1E]/80 group-hover:text-[#BC1A1E] transition-colors" />
                    </div>
                </div>

                {/* Course Difficulty */}
                <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-20">
                    {course.difficulty}
                </div>

                {/* Completion Badge */}
                {course.progress === 100 ? (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs p-1 rounded-full z-20">
                        <CheckCircle className="w-4 h-4" />
                    </div>
                ) : course.progress > 0 ? (
                    <div className="absolute top-2 right-2 bg-[#BC1A1E] text-white text-xs p-1 rounded-full z-20">
                        <Clock className="w-4 h-4" />
                    </div>
                ) : null}
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="font-medium text-white">{course.title}</h3>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-xs">{course.category}</span>
                    <span className="text-gray-400 text-xs">{course.duration}</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-gray-400 text-xs">{course.instructor}</span>
                    <span className="text-gray-400 text-xs">{course.completedVideos}/{course.totalVideos} videos</span>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                    <Progress
                        value={course.progress}
                        className="h-1 bg-gray-800"
                    />
                    <span className="text-gray-400 text-xs mt-1 block">{course.progress}% complete</span>
                </div>
            </div>
        </div>
    );
};

// Blog card component
interface BlogCardProps {
    blog: BlogType;
    onClick: (blog: BlogType) => void;
}

const BlogCard = ({ blog, onClick }: BlogCardProps) => {
    return (
        <div
            className="group rounded-xl overflow-hidden border border-gray-800 hover:border-[#BC1A1E]/50 transition-all duration-300 cursor-pointer bg-black/50 h-full flex flex-col"
            onClick={() => onClick(blog)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 group-hover:opacity-70 transition-opacity z-10"></div>

                {/* Placeholder image */}
                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                    {/* This would be a real image in production */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-[#BC1A1E]/80 group-hover:text-[#BC1A1E] transition-colors" />
                    </div>
                </div>

                {/* Blog Category */}
                <div className="absolute top-2 left-2 bg-[#BC1A1E]/80 text-white text-xs px-2 py-1 rounded z-20">
                    {blog.category}
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-white text-lg">{blog.title}</h3>
                <p className="text-gray-400 text-sm mt-2 flex-1">{blog.excerpt}</p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-[#BC1A1E]/20 text-[#BC1A1E] text-xs">
                                {blog.author.split(' ').map(name => name[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-400 text-xs">{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <span>{blog.date}</span>
                        <Circle className="w-1 h-1 fill-current" />
                        <span>{blog.readTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Knowledge test card component
interface KnowledgeTestCardProps {
    test: TestType;
    onClick: (test: TestType) => void;
}

const KnowledgeTestCard = ({ test, onClick }: KnowledgeTestCardProps) => {
    return (
        <div
            className="group rounded-xl overflow-hidden border border-gray-800 hover:border-[#BC1A1E]/50 transition-all duration-300 cursor-pointer bg-black/50"
            onClick={() => onClick(test)}
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <Badge className={test.difficulty === "Beginner" ? "bg-green-600" : test.difficulty === "Intermediate" ? "bg-yellow-600" : "bg-red-600"}>
                        {test.difficulty}
                    </Badge>
                    {test.completed && (
                        <Badge className="bg-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Completed
                        </Badge>
                    )}
                </div>

                <h3 className="font-medium text-white text-lg">{test.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{test.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Questions</div>
                        <div className="text-white">{test.questions}</div>
                    </div>
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Time Limit</div>
                        <div className="text-white">{test.timeLimit}</div>
                    </div>
                </div>

                {test.completed && test.score !== null && (
                    <div className="mt-4 bg-green-600/20 p-3 rounded-lg border border-green-600/20">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-200 text-sm">Your Score:</span>
                            <span className="text-white font-bold">{test.score}/{test.questions}</span>
                        </div>
                        <Progress
                            value={(test.score / test.questions) * 100}
                            className="h-1 mt-2 bg-gray-800 [&>div]:bg-green-600"
                        />
                    </div>
                )} : (
                <Button
                    className="w-full mt-4 bg-[#BC1A1E] hover:bg-[#BC1A1E]/80 text-white"
                    onClick={(e) => { e.stopPropagation(); onClick(test); }}
                >
                    Start Test
                </Button>
                )
            </div>
        </div>
    );
};

// Zoom call card component
interface ZoomCallCardProps {
    call: ZoomCallType;
    onRegister: (callId: number) => void;
}

const ZoomCallCard = ({ call, onRegister }: ZoomCallCardProps) => {
    return (
        <div className="rounded-xl overflow-hidden border border-gray-800 hover:border-[#BC1A1E]/50 transition-all duration-300 bg-black/50">
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-[#BC1A1E]">Iridium Tier</Badge>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Users className="w-3 h-3" />
                        <span>{call.participants} enrolled</span>
                    </div>
                </div>

                <h3 className="font-medium text-white text-lg">{call.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{call.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Date & Time</div>
                        <div className="text-white">{call.date}, {call.time}</div>
                    </div>
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Duration</div>
                        <div className="text-white">{call.duration}</div>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-[#BC1A1E]/20 text-[#BC1A1E] text-xs">
                            {call.host.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-400 text-sm">Hosted by {call.host}</span>
                </div>

                {call.registered ? (
                    <div className="mt-4 flex items-center gap-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                            <Calendar className="w-4 h-4 mr-2" /> Add to Calendar
                        </Button>
                        <Button className="flex-1 bg-[#BC1A1E] hover:bg-[#BC1A1E]/80 text-white">
                            <Video className="w-4 h-4 mr-2" /> Join Call
                        </Button>
                    </div>
                ) : (
                    <Button
                        className="w-full mt-4 bg-[#BC1A1E] hover:bg-[#BC1A1E]/80 text-white"
                        onClick={() => onRegister(call.id)}
                    >
                        Register Now
                    </Button>
                )}
            </div>
        </div>
    );
};

// Main Dashboard Component
const IridiumDashboard = () => {
    const [activeTab, setActiveTab] = useState<string>("videos");
    const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
    const [videos, setVideos] = useState<VideoType[]>(videoLibraryData);
    const [courses, setCourses] = useState<CourseType[]>(coursesData);
    const [blogs, setBlogs] = useState<BlogType[]>(blogsData);
    const [tests, setTests] = useState<TestType[]>(knowledgeTestsData);
    const [calls, setCalls] = useState<ZoomCallType[]>(zoomCallsData);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    // Handle video selection with type checking
    const handleVideoSelection = (video: VideoType | CourseType): void => {
        // Only set if it's a VideoType
        if ('completed' in video) {
            setSelectedVideo(video as VideoType);
        }
    };

    // Overall progress calculation for header
    const calculateOverallProgress = () => {
        const completedVideos = videos.filter(v => v.completed).length;
        const totalVideos = videos.length;
        const completedTests = tests.filter(t => t.completed).length;
        const totalTests = tests.length;

        const totalItems = totalVideos + totalTests;
        const completedItems = completedVideos + completedTests;

        return Math.round((completedItems / totalItems) * 100);
    };

    // Handle video progress update
    const handleVideoProgress = (videoId: number, progress: number): void => {
        setVideos(prev => prev.map(video =>
            video.id === videoId ? { ...video, progress } : video
        ));
    };

    // Handle video completion
    const handleVideoComplete = (videoId: number): void => {
        setVideos(prev => prev.map(video =>
            video.id === videoId ? { ...video, completed: true, progress: 100 } : video
        ));
    };

    // Handle zoom call registration
    const handleZoomRegistration = (callId: number): void => {
        setCalls(prev => prev.map(call =>
            call.id === callId ? { ...call, registered: true } : call
        ));
    };

    // Content sections based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "videos":
                return (
                    <div>
                        {selectedVideo ? (
                            <div className="space-y-4">
                                <Button
                                    variant="ghost"
                                    className="text-white hover:bg-gray-800"
                                    onClick={() => setSelectedVideo(null)}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
                                </Button>

                                <VideoPlayer
                                    video={selectedVideo}
                                    onProgress={handleVideoProgress}
                                    onComplete={handleVideoComplete}
                                />

                                <div className="mt-6">
                                    <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{selectedVideo.instructor}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{selectedVideo.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Play className="w-4 h-4" />
                                            <span>{selectedVideo.duration}</span>
                                        </div>
                                        <Badge className="bg-gray-700">{selectedVideo.category}</Badge>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="col-span-2">
                                        <h3 className="text-lg font-semibold text-white mb-2">Continue Learning</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {videos
                                                .filter(v => v.id !== selectedVideo.id && !v.completed)
                                                .slice(0, 2)
                                                .map(video => (
                                                    <VideoCard
                                                        key={video.id}
                                                        video={video}
                                                        onClick={(video) => {
                                                            if ('completed' in video) {
                                                                setSelectedVideo(video);
                                                            }
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Related Tests</h3>
                                        <div className="space-y-4">
                                            {tests
                                                .filter(test => test.category === selectedVideo.category)
                                                .slice(0, 1)
                                                .map(test => (
                                                    <KnowledgeTestCard
                                                        key={test.id}
                                                        test={test}
                                                        onClick={() => setActiveTab("tests")}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Video Library</h2>
                                        <p className="text-gray-400">Access your Iridium Tier educational videos</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search videos..."
                                                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-[#BC1A1E]"
                                            />
                                        </div>

                                        <Button variant="outline" className="border-gray-700 text-gray-400">
                                            <Filter className="w-4 h-4 mr-2" /> Filter
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Continue Watching</h3>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {videos
                                            .filter(video => video.progress > 0 && !video.completed)
                                            .map(video => (
                                                <VideoCard
                                                    key={video.id}
                                                    video={video}
                                                    onClick={(video) => {
                                                        if ('completed' in video) {
                                                            setSelectedVideo(video);
                                                        }
                                                    }}
                                                />
                                            ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">New Releases</h3>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {videos
                                            .filter(video => video.progress === 0)
                                            .map(video => (
                                                <VideoCard
                                                    key={video.id}
                                                    video={video}
                                                    onClick={(video) => {
                                                        if ('completed' in video) {
                                                            setSelectedVideo(video);
                                                        }
                                                    }} />
                                            ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Completed</h3>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {videos
                                            .filter(video => video.completed)
                                            .map(video => (
                                                <VideoCard
                                                    key={video.id}
                                                    video={video}
                                                    onClick={(video) => {
                                                        if ('completed' in video) {
                                                            setSelectedVideo(video);
                                                        }
                                                    }} />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "courses":
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Courses</h2>
                                <p className="text-gray-400">Structured learning paths for Iridium Tier members</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-[#BC1A1E]"
                                    />
                                </div>

                                <Button variant="outline" className="border-gray-700 text-gray-400">
                                    <Filter className="w-4 h-4 mr-2" /> Filter
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">In Progress</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {courses
                                    .filter(course => course.progress > 0 && course.progress < 100)
                                    .map(course => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onClick={(course) => { }}
                                        />
                                    ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Available Courses</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {courses
                                    .filter(course => course.progress === 0)
                                    .map(course => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onClick={(course) => { }}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                );

            case "blogs":
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Blog Articles</h2>
                                <p className="text-gray-400">Exclusive content for Iridium Tier members</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-[#BC1A1E]"
                                    />
                                </div>

                                <Button variant="outline" className="border-gray-700 text-gray-400">
                                    <Filter className="w-4 h-4 mr-2" /> Filter
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {blogs.map(blog => (
                                <BlogCard
                                    key={blog.id}
                                    blog={blog}
                                    onClick={(blog) => { }}
                                />
                            ))}
                        </div>
                    </div>
                );

            case "tests":
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Knowledge Tests</h2>
                                <p className="text-gray-400">Test your understanding and track your progress</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Available Tests</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {tests
                                    .filter(test => !test.completed)
                                    .map(test => (
                                        <KnowledgeTestCard
                                            key={test.id}
                                            test={test}
                                            onClick={(test) => { }}
                                        />
                                    ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Completed Tests</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {tests
                                    .filter(test => test.completed)
                                    .map(test => (
                                        <KnowledgeTestCard
                                            key={test.id}
                                            test={test}
                                            onClick={(test) => { }}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                );

            case "calls":
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Zoom Community Calls</h2>
                                <p className="text-gray-400">Live sessions exclusive to Iridium Tier members</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Upcoming Calls</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {calls.map(call => (
                                    <ZoomCallCard
                                        key={call.id}
                                        call={call}
                                        onRegister={handleZoomRegistration}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#BC1A1E]/20 p-3 rounded-full">
                                    <Calendar className="w-6 h-6 text-[#BC1A1E]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Iridium Tier Call Schedule</h3>
                                    <p className="text-gray-400 mt-1">Regular community calls are held every two weeks on Thursdays at 18:00 UTC</p>
                                    <Button className="mt-4 bg-[#BC1A1E] hover:bg-[#BC1A1E]/80 text-white">
                                        View Full Schedule
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Content not found</div>;
        }
    };

    return (
        <div className="min-h-screen text-white bg-gray-950">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-gradient-radial from-[#BC1A1E]/10 via-transparent to-transparent opacity-40 pointer-events-none"></div>
            <div className="fixed top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#BC1A1E]/5 to-transparent pointer-events-none"></div>

            {/* Header */}
            <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo & Mobile Menu Button */}
                        <div className="flex items-center">
                            <button
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <div className="flex items-center ml-4 lg:ml-0">
                                <div className="bg-[#BC1A1E] rounded-full p-1.5 mr-2">
                                    <Crown className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-xl font-bold text-white">Iridium Education</div>
                            </div>
                        </div>

                        {/* Right: Notifications & User */}
                        <div className="flex items-center gap-4">
                            <Button variant="outline" className="border-gray-700 text-gray-400">
                                <Bell className="w-5 h-5" />
                            </Button>

                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarFallback className="bg-[#BC1A1E]/20 text-[#BC1A1E]">IR</AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block">
                                    <div className="text-sm font-medium text-white">Iridium Member</div>
                                    <div className="text-xs text-gray-400">Tier 6</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 border-r border-gray-800 pt-16 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="p-4">
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Dashboard</h2>
                                <button
                                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <button
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'videos'
                                    ? 'bg-[#BC1A1E] text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                onClick={() => { setActiveTab('videos'); setSidebarOpen(false); }}
                            >
                                <Play className="mr-3 h-5 w-5" />
                                <span>Video Library</span>
                            </button>

                            <button
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'courses'
                                    ? 'bg-[#BC1A1E] text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                onClick={() => { setActiveTab('courses'); setSidebarOpen(false); }}
                            >
                                <BookOpen className="mr-3 h-5 w-5" />
                                <span>Courses</span>
                            </button>

                            <button
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'blogs'
                                    ? 'bg-[#BC1A1E] text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                onClick={() => { setActiveTab('blogs'); setSidebarOpen(false); }}
                            >
                                <BookOpen className="mr-3 h-5 w-5" />
                                <span>Blog Articles</span>
                            </button>

                            <button
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'tests'
                                    ? 'bg-[#BC1A1E] text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                onClick={() => { setActiveTab('tests'); setSidebarOpen(false); }}
                            >
                                <Award className="mr-3 h-5 w-5" />
                                <span>Knowledge Tests</span>
                            </button>

                            <button
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'calls'
                                    ? 'bg-[#BC1A1E] text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                onClick={() => { setActiveTab('calls'); setSidebarOpen(false); }}
                            >
                                <Video className="mr-3 h-5 w-5" />
                                <span>Zoom Calls</span>
                            </button>
                        </div>

                        {/* Progress Card */}
                        <div className="mt-8 p-4 bg-gray-800 rounded-xl">
                            <h3 className="text-sm font-medium text-white mb-2">Your Progress</h3>
                            <div className="mb-2">
                                <Progress value={calculateOverallProgress()} className="h-2 bg-gray-700" />
                            </div>
                            <div className="text-xs text-gray-400 flex justify-between">
                                <span>{calculateOverallProgress()}% Complete</span>
                                <span>Iridium Tier</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {/* Progress Snapshot */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="bg-gray-900/70 border-gray-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Videos Watched</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">
                                        {videos.filter(v => v.completed).length}/{videos.length}
                                    </div>
                                    <Progress
                                        value={(videos.filter(v => v.completed).length / videos.length) * 100}
                                        className="h-1 mt-2 bg-gray-800"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-900/70 border-gray-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Course Progress</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">
                                        {Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%
                                    </div>
                                    <Progress
                                        value={courses.reduce((sum, course) => sum + course.progress, 0) / courses.length}
                                        className="h-1 mt-2 bg-gray-800"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-900/70 border-gray-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Tests Completed</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">
                                        {tests.filter(t => t.completed).length}/{tests.length}
                                    </div>
                                    <Progress
                                        value={(tests.filter(t => t.completed).length / tests.length) * 100}
                                        className="h-1 mt-2 bg-gray-800"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-900/70 border-gray-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Upcoming Zoom Calls</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">
                                        {calls.length}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        Next: {calls[0].date}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content Tabs */}
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default IridiumDashboard;