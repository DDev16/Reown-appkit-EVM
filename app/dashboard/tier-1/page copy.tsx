'use client';
//C:\apps\dbw\Reown-appkit-EVM\app\dashboard\tier-1\page.tsx
import { useState, useEffect, useRef } from 'react';
import { useTierContent } from '@/hooks/useTierContent';
import { useTierSpecificAnalytics } from '@/hooks/useTierSpecificAnalytics';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { ErrorState } from '@/components/dashboard/ui/ErrorState';
import { VideoSection } from '@/components/dashboard/tier-1-content/videoSection/VideoSection';
import { CourseSection } from '@/components/dashboard/tier-1-content/coursesSection/CourseSection';
import { BlogSection } from '@/components/dashboard/tier-1-content/blogSection/BlogSection';
import { CallSection } from '@/components/dashboard/tier-1-content/callSection/CallSection';
import { TestSection } from '@/components/dashboard/tier-1-content/testSection/TestSection';
import { TierAnalyticsSection } from '@/components/dashboard/analytics/TierAnalyticsSection';
import { ContentType } from '@/components/dashboard/analytics/types';

// Define content section type
type ContentSectionId = ContentType;

export default function Tier1Page() {
    // Current tier - defined as a constant for this specific page
    const currentTier = 1;

    // Get analytics for ONLY tier 1 content - using the tier-specific hook
    const {
        analytics,
        isLoading: analyticsLoading,
        completionPercentages,
        refreshAnalytics,
        lastRefreshed,
        isWalletConnected,
        walletAddress,
    } = useTierSpecificAnalytics(currentTier);


    // Analytics refresh tracking
    const hasRefreshedRef = useRef(false);

    // Use the custom hook to fetch all content for current tier
    const {
        videos,
        courses,
        blogs,
        calls,
        tests,
        isLoading,
        error,
        refreshData
    } = useTierContent(currentTier);

    // States
    const [activeTab, setActiveTab] = useState<ContentSectionId>('all');
    const [animatedNumbers, setAnimatedNumbers] = useState({
        videos: 0,
        courses: 0,
        blogs: 0,
        calls: 0,
        tests: 0
    });

    // Refresh analytics for current tier
    useEffect(() => {
        if (isWalletConnected && !analyticsLoading && !hasRefreshedRef.current) {
            console.log(`Refreshing tier-specific analytics for Tier ${currentTier}`);
            hasRefreshedRef.current = true;

            setTimeout(() => {
                refreshAnalytics();
            }, 500);
        }
    }, [isWalletConnected, analyticsLoading, refreshAnalytics]);

    // Animate numbers
    useEffect(() => {
        if (!isLoading && !error) {
            const animationDuration = 1200; // ms
            const steps = 15;
            const interval = animationDuration / steps;

            let step = 0;
            const timer = setInterval(() => {
                step++;
                setAnimatedNumbers({
                    videos: Math.ceil((videos.length / steps) * step),
                    courses: Math.ceil((courses.length / steps) * step),
                    blogs: Math.ceil((blogs.length / steps) * step),
                    calls: Math.ceil((calls.length / steps) * step),
                    tests: Math.ceil((tests.length / steps) * step)
                });

                if (step >= steps) {
                    clearInterval(timer);
                    setAnimatedNumbers({
                        videos: videos.length,
                        courses: courses.length,
                        blogs: blogs.length,
                        calls: calls.length,
                        tests: tests.length
                    });
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [isLoading, error, videos.length, courses.length, blogs.length, calls.length, tests.length]);

    // Loading state
    if (isLoading) {
        return <LoadingState />;
    }

    // Error state
    if (error) {
        return <ErrorState message={error} onRetry={refreshData} />;
    }

    // Filter tabs - Add Analytics tab
    const filterTabs: Array<{ id: ContentSectionId, label: string }> = [
        { id: 'all', label: 'All Content' },
        { id: 'videos', label: 'Videos' },
        { id: 'courses', label: 'Courses' },
        { id: 'blogs', label: 'Articles' },
        { id: 'tests', label: 'Knowledge Tests' },
        { id: 'calls', label: 'Calls' },
        { id: 'analytics', label: 'Analytics' }
    ];

    // Stat cards data with matching branding from screenshot
    const statCards: Array<{
        id: ContentSectionId,
        title: string,
        count: number,
        icon: React.ReactNode,
        bgColor: string,
        iconBg: string,
        borderColor: string,
        textColor: string
    }> = [
            {
                id: 'videos',
                title: 'Videos',
                count: animatedNumbers.videos,
                icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="4" width="20" height="16" rx="3" fill="#991b1b" />
                        <path d="M10 16.5V7.5L16 12L10 16.5Z" fill="white" />
                    </svg>
                ),
                bgColor: 'from-red-900 to-red-950',
                iconBg: 'bg-red-900',
                borderColor: 'border-red-800',
                textColor: 'text-red-400'
            },
            {
                id: 'courses',
                title: 'Courses',
                count: animatedNumbers.courses,
                icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="2" fill="#991b1b" />
                        <path d="M7 7H17M7 12H17M7 17H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                ),
                bgColor: 'from-red-950 to-black',
                iconBg: 'bg-red-900',
                borderColor: 'border-red-900',
                textColor: 'text-red-400'
            },
            {
                id: 'blogs',
                title: 'Articles',
                count: animatedNumbers.blogs,
                icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="2" fill="#991b1b" />
                        <path d="M6 7H18M6 11H14M6 15H10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                ),
                bgColor: 'from-black to-red-950',
                iconBg: 'bg-red-900',
                borderColor: 'border-red-800',
                textColor: 'text-red-400'
            },
            {
                id: 'tests',
                title: 'Tests',
                count: animatedNumbers.tests,
                icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="2" fill="#991b1b" />
                        <path d="M8 12L11 15L16 9M7 5H17C18.1046 5 19 5.89543 19 7V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V7C5 5.89543 5.89543 5 7 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ),
                bgColor: 'from-red-900 to-black',
                iconBg: 'bg-red-900',
                borderColor: 'border-red-800',
                textColor: 'text-red-400'
            },
            {
                id: 'calls',
                title: 'Calls',
                count: animatedNumbers.calls,
                icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#991b1b" />
                        <path d="M15.5 11C15.5 11 16 12.5 16 14C16 15.5 15 17 13 17C11 17 9 15 9 12C9 9 11 7 13 7C14.5 7 15.5 8.5 15.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                ),
                bgColor: 'from-red-900 to-red-950',
                iconBg: 'bg-red-900',
                borderColor: 'border-red-800',
                textColor: 'text-red-400'
            }
        ];

    // Get section icon by id
    const getSectionIcon = (id: ContentSectionId) => {
        const card = statCards.find(card => card.id === id);
        return card ? card.icon : null;
    };

    return (
        <div className="w-full h-full bg-black text-white">
            {/* Header with content type tabs */}
            <div className="mb-6 px-1">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-white">Top Tier Dashboard</h1>
                    <button
                        onClick={refreshData}
                        className="flex items-center justify-center px-4 py-2 bg-red-800 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Content
                    </button>
                </div>

                <div className="flex space-x-2 overflow-x-auto scrollbar-none pb-2">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-red-900 text-white'
                                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => setActiveTab(card.id)}
                        className={`bg-gradient-to-br ${card.bgColor} border ${card.borderColor} rounded-lg p-4 flex items-center cursor-pointer hover:opacity-90 transition-opacity`}
                    >
                        <div className={`${card.iconBg} rounded-lg p-3 mr-3`}>
                            {card.icon}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-400">{card.title}</h3>
                            <p className="text-2xl font-bold text-white">{card.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content sections */}
            <div className="space-y-8">
                {/* Analytics section */}
                {(activeTab === 'analytics') && (
                    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">

                        <div className="p-4">
                            <TierAnalyticsSection
                                tier={currentTier}
                                analytics={analytics}
                                completionPercentages={completionPercentages}
                                isLoading={analyticsLoading}
                                lastRefreshed={lastRefreshed}
                                walletAddress={walletAddress}
                                isWalletConnected={isWalletConnected}
                                refreshAnalytics={refreshAnalytics}
                            />
                        </div>
                    </div>
                )}

                {/* Videos section */}
                {(activeTab === 'all' || activeTab === 'videos') && (
                    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                        <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center">
                                {getSectionIcon('videos')}
                                <h2 className="ml-2 text-lg font-medium">Latest Videos</h2>
                            </div>
                            <div className="flex items-center">
                                <span className="px-2 py-1 bg-red-900 text-red-100 rounded text-xs font-medium">
                                    {videos.length}
                                </span>
                                {activeTab === 'all' && (
                                    <button
                                        onClick={() => setActiveTab('videos')}
                                        className="ml-2 text-xs text-red-500 hover:text-red-400"
                                    >
                                        View All
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            <VideoSection videos={videos} />
                        </div>
                    </div>
                )}

                {/* Courses section */}
                {(activeTab === 'all' || activeTab === 'courses') && (
                    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                        <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center">
                                {getSectionIcon('courses')}
                                <h2 className="ml-2 text-lg font-medium">Featured Courses</h2>
                            </div>
                            <div className="flex items-center">
                                <span className="px-2 py-1 bg-red-900 text-red-100 rounded text-xs font-medium">
                                    {courses.length}
                                </span>
                                {activeTab === 'all' && (
                                    <button
                                        onClick={() => setActiveTab('courses')}
                                        className="ml-2 text-xs text-red-500 hover:text-red-400"
                                    >
                                        View All
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            <CourseSection courses={courses} />
                        </div>
                    </div>
                )}

                {/* Blogs section */}
                {(activeTab === 'all' || activeTab === 'blogs') && (
                    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                        <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center">
                                {getSectionIcon('blogs')}
                                <h2 className="ml-2 text-lg font-medium">Latest Articles</h2>
                            </div>
                            <div className="flex items-center">
                                <span className="px-2 py-1 bg-red-900 text-red-100 rounded text-xs font-medium">
                                    {blogs.length}
                                </span>
                                {activeTab === 'all' && (
                                    <button
                                        onClick={() => setActiveTab('blogs')}
                                        className="ml-2 text-xs text-red-500 hover:text-red-400"
                                    >
                                        View All
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            <BlogSection blogs={blogs} />
                        </div>
                    </div>
                )}

                {/* Tests section */}
                {(activeTab === 'all' || activeTab === 'tests') && (
                    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                        <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center">
                                {getSectionIcon('tests')}
                                <h2 className="ml-2 text-lg font-medium">Knowledge Tests</h2>
                            </div>
                            <div className="flex items-center">
                                <span className="px-2 py-1 bg-red-900 text-red-100 rounded text-xs font-medium">
                                    {tests.length}
                                </span>
                                {activeTab === 'all' && (
                                    <button
                                        onClick={() => setActiveTab('tests')}
                                        className="ml-2 text-xs text-red-500 hover:text-red-400"
                                    >
                                        View All
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            <TestSection tests={tests} />
                        </div>
                    </div>
                )}

                {/* Calls section */}
                {(activeTab === 'all' || activeTab === 'calls') && (
                    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                        <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center">
                                {getSectionIcon('calls')}
                                <h2 className="ml-2 text-lg font-medium">Upcoming Calls</h2>
                            </div>
                            <div className="flex items-center">
                                <span className="px-2 py-1 bg-red-900 text-red-100 rounded text-xs font-medium">
                                    {calls.length}
                                </span>
                                {activeTab === 'all' && (
                                    <button
                                        onClick={() => setActiveTab('calls')}
                                        className="ml-2 text-xs text-red-500 hover:text-red-400"
                                    >
                                        View All
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            <CallSection calls={calls} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}