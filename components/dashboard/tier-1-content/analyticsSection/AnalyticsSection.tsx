import React, { useState, useEffect, useCallback } from 'react';
import { VideoItem, CourseItem, BlogItem, CallItem, TestItem, UserAnalytics } from '@/types/types';
import { useAccount } from 'wagmi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define prop types to match the data structure from useTierContent
interface AnalyticsSectionProps {
    videos: VideoItem[];
    courses: CourseItem[];
    blogs: BlogItem[];
    calls: CallItem[];
    tests: TestItem[];
    tier: number; // Add current tier as a prop
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
    videos,
    courses,
    blogs,
    calls,
    tests,
    tier
}) => {
    // State to hold analytics data
    const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recentProgress, setRecentProgress] = useState<any[]>([]);
    const [completedContent, setCompletedContent] = useState({
        videos: 0,
        videosInProgress: 0,
        courses: 0,
        blogs: 0,
        calls: 0,
        tests: 0
    });
    const [dataFetched, setDataFetched] = useState(false);

    // Get wallet connection status
    const { address, isConnected } = useAccount();

    // Fetch user progress data directly from Firebase
    const fetchUserProgress = useCallback(async (userId: string) => {
        try {
            console.log("Fetching user progress for:", userId);
            const userProgressRef = doc(db, 'userProgress', userId);
            const userProgressDoc = await getDoc(userProgressRef);

            if (userProgressDoc.exists()) {
                const userData = userProgressDoc.data();
                console.log("Found user data:", userData);
                return userData;
            } else {
                console.log("No user progress document found");
            }
            return null;
        } catch (error) {
            console.error('Error fetching user progress:', error);
            return null;
        }
    }, []);

    // Load analytics data from Firebase when wallet is connected
    useEffect(() => {
        // Skip if already fetched or not connected
        if (dataFetched || !isConnected || !address) {
            if (!isConnected) {
                setLoading(false);
            }
            return;
        }

        const loadAnalyticsData = async () => {
            try {
                setLoading(true);
                setError(null);

                const userId = address.toLowerCase();

                // Get detailed progress from Firebase
                const progressData = await fetchUserProgress(userId);
                console.log("Progress data:", progressData);

                if (progressData && progressData.items) {
                    // Filter items that match the current tier
                    // For videos, courses, etc. we need to find items by matching IDs from the tier's content
                    const videoIds = videos.map(v => v.id);
                    const courseIds = courses.map(c => c.id);
                    const blogIds = blogs.map(b => b.id);
                    const callIds = calls.map(c => c.id);
                    const testIds = tests.map(t => t.id);

                    // Filter items by matching them with the current tier's content IDs
                    const tierFilteredItems = progressData.items.filter((item: any) => {
                        if (item.contentType === 'video') {
                            return videoIds.includes(item.id);
                        } else if (item.contentType === 'course') {
                            return courseIds.includes(item.id);
                        } else if (item.contentType === 'blog') {
                            return blogIds.includes(item.id);
                        } else if (item.contentType === 'call') {
                            return callIds.includes(item.id);
                        } else if (item.contentType === 'test') {
                            return testIds.includes(item.id);
                        }
                        return false;
                    });

                    console.log(`Filtered items for tier ${tier}:`, tierFilteredItems);

                    // Sort by last updated time (most recent first)
                    const sortedItems = [...tierFilteredItems].sort((a, b) => {
                        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                    });

                    // Count completed content by type
                    const completed = {
                        videos: 0,
                        videosInProgress: 0,
                        courses: 0,
                        blogs: 0,
                        calls: 0,
                        tests: 0
                    };

                    // Process all items to get completion counts
                    tierFilteredItems.forEach((item: any) => {
                        if (item.contentType === 'video') {
                            if (item.completed) {
                                completed.videos++;
                            } else if (item.progress > 0) {
                                completed.videosInProgress++;
                            }
                        } else if (item.contentType === 'course' && item.completed) {
                            completed.courses++;
                        } else if (item.contentType === 'blog' && item.completed) {
                            completed.blogs++;
                        } else if (item.contentType === 'call' && item.completed) {
                            completed.calls++;
                        } else if (item.contentType === 'test' && item.completed) {
                            completed.tests++;
                        }
                    });

                    console.log(`Counted completed content for tier ${tier}:`, completed);
                    setCompletedContent(completed);

                    // Take just the 5 most recent items for display
                    setRecentProgress(sortedItems.slice(0, 5));
                }

                setDataFetched(true);
                setLoading(false);
            } catch (err) {
                console.error('Error loading analytics data:', err);
                setError('Failed to load analytics data');
                setLoading(false);
                setDataFetched(true); // Mark as fetched even on error to prevent infinite retries
            }
        };

        loadAnalyticsData();
    }, [address, isConnected, fetchUserProgress, dataFetched, videos, courses, blogs, calls, tests, tier]);

    // Calculate statistics based on Firebase data
    const videoStats = {
        completed: completedContent.videos,
        inProgress: completedContent.videosInProgress,
        total: videos.length
    };

    const courseStats = {
        completed: completedContent.courses,
        inProgress: 0,
        total: courses.length
    };

    const blogStats = {
        completed: completedContent.blogs,
        total: blogs.length
    };

    const callStats = {
        completed: completedContent.calls,
        total: calls.length
    };

    const testStats = {
        completed: completedContent.tests,
        total: tests.length
    };

    // If wallet is not connected
    if (!isConnected) {
        return (
            <div className="bg-zinc-800 p-6 rounded-lg text-center">
                <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="6" width="20" height="12" rx="2" fill="#991b1b" />
                    <path d="M16 14H20V10H16C14.8954 10 14 10.8954 14 12C14 13.1046 14.8954 14 16 14Z" fill="#111" />
                    <circle cx="16" cy="12" r="1" fill="white" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-4">
                    Connect your wallet to view your progress analytics and access your personalized dashboard.
                </p>
            </div>
        );
    }

    // If still loading, show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-400">Loading analytics...</span>
            </div>
        );
    }

    // If there was an error, show error state
    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-2">{error}</p>
                <button
                    onClick={() => {
                        setDataFetched(false);
                        setError(null);
                    }}
                    className="px-4 py-2 bg-red-800 hover:bg-red-700 rounded text-sm font-medium"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold">Tier {tier} Progress Dashboard</h2>
                {address && (
                    <div className="ml-auto flex items-center px-3 py-1 bg-zinc-800 rounded-full text-xs text-gray-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Connected: {`${address.slice(0, 6)}...${address.slice(-4)}`}
                    </div>
                )}
            </div>

            {/* Progress Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <StatCard
                    title="Videos Watched"
                    value={videoStats.completed}
                    inProgress={videoStats.inProgress}
                    total={videoStats.total}
                    icon={
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="4" width="20" height="16" rx="3" fill="#991b1b" />
                            <path d="M10 16.5V7.5L16 12L10 16.5Z" fill="white" />
                        </svg>
                    }
                />

                <StatCard
                    title="Courses Completed"
                    value={courseStats.completed}
                    inProgress={courseStats.inProgress}
                    total={courseStats.total}
                    icon={
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2" width="20" height="20" rx="2" fill="#991b1b" />
                            <path d="M7 7H17M7 12H17M7 17H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                />

                <StatCard
                    title="Articles Read"
                    value={blogStats.completed}
                    total={blogStats.total}
                    icon={
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2" width="20" height="20" rx="2" fill="#991b1b" />
                            <path d="M6 7H18M6 11H14M6 15H10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                />

                <StatCard
                    title="Calls Attended"
                    value={callStats.completed}
                    total={callStats.total}
                    icon={
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="#991b1b" />
                            <path d="M15.5 11C15.5 11 16 12.5 16 14C16 15.5 15 17 13 17C11 17 9 15 9 12C9 9 11 7 13 7C14.5 7 15.5 8.5 15.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                />

                <StatCard
                    title="Tests Completed"
                    value={testStats.completed}
                    total={testStats.total}
                    icon={
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2" width="20" height="20" rx="2" fill="#991b1b" />
                            <path d="M8 12L11 15L16 9M7 5H17C18.1046 5 19 5.89543 19 7V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V7C5 5.89543 5.89543 5 7 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    }
                />

                {/* Total Content Card */}
                <div className="bg-gradient-to-br from-red-900 to-red-950 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Tier {tier} Content</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Videos:</span>
                            <span>{videos.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Courses:</span>
                            <span>{courses.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Articles:</span>
                            <span>{blogs.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Calls:</span>
                            <span>{calls.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tests:</span>
                            <span>{tests.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Progress - only show for current tier */}
            {recentProgress.length > 0 && (
                <div className="bg-zinc-800 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium mb-3">Recent Tier {tier} Activity</h3>
                    <div className="space-y-4">
                        {recentProgress.map((item, index) => (
                            <div key={`${item.contentType}-${item.id}`} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        {getContentTypeIcon(item.contentType)}
                                        <span className="text-sm truncate">
                                            {/* Add item number for ordering clarity */}
                                            {index + 1}. {item.title}
                                        </span>
                                        {item.completed ? (
                                            <span className="text-xs text-green-500 bg-green-900/20 px-2 py-0.5 rounded">Completed</span>
                                        ) : (
                                            <span className="text-xs text-yellow-500 bg-yellow-900/20 px-2 py-0.5 rounded">In Progress</span>
                                        )}
                                    </div>
                                    {item.progress !== undefined && (
                                        <span className="text-xs text-gray-400">{item.progress}%</span>
                                    )}
                                </div>
                                {item.progress !== undefined && (
                                    <div className="bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.completed ? 'bg-green-600' : 'bg-red-600'}`}
                                            style={{ width: `${item.progress || 0}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recentProgress.length === 0 && (
                <div className="bg-zinc-800 p-4 rounded-lg mb-6 text-center">
                    <p className="text-gray-400">No recent activity for Tier {tier} content</p>
                </div>
            )}
        </div>
    );
};

// Helper function to get icon based on content type
const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
        case 'video':
            return (
                <div className="w-6 h-6 flex-shrink-0 bg-red-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 16.5V7.5L16 12L10 16.5Z" fill="white" />
                    </svg>
                </div>
            );
        case 'course':
            return (
                <div className="w-6 h-6 flex-shrink-0 bg-red-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 7H17M7 12H17M7 17H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            );
        case 'blog':
            return (
                <div className="w-6 h-6 flex-shrink-0 bg-red-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 7H18M6 11H14M6 15H10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            );
        case 'call':
            return (
                <div className="w-6 h-6 flex-shrink-0 bg-red-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 11C15.5 11 16 12.5 16 14C16 15.5 15 17 13 17C11 17 9 15 9 12C9 9 11 7 13 7C14.5 7 15.5 8.5 15.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            );
        case 'test':
            return (
                <div className="w-6 h-6 flex-shrink-0 bg-red-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            );
        default:
            return null;
    }
};

// Helper component for stats cards
interface StatCardProps {
    title: string;
    value: number;
    inProgress?: number;
    total: number;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, inProgress = 0, total, icon }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex items-center mb-3">
                {icon}
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-red-400 text-sm font-medium">{percentage}%</span>
            </div>
            <div className="bg-zinc-700 h-2 rounded overflow-hidden">
                <div
                    className="bg-red-700 h-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="mt-1 text-xs text-gray-400">
                {value} of {total} completed
                {inProgress > 0 && (
                    <span className="ml-1">({inProgress} in progress)</span>
                )}
            </div>
        </div>
    );
};