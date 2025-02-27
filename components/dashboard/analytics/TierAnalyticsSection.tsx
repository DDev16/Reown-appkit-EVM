'use client';

import React from 'react';
import { BarChart, Video, BookOpen, Trophy, FileText, Users, Clock, CheckCircle, Wallet, RefreshCw } from 'lucide-react';
import { AnalyticsSummaryCard } from '@/components/dashboard/analytics/AnalyticsSummaryCard';
import { ProgressChart } from '@/components/dashboard/analytics/ProgressChart';
import { formatDateTime } from '@/utils/formatters';
import { OverallAnalytics } from '@/types/analytics';
import { ContentType } from '@/components/dashboard/analytics/types';

interface TierAnalyticsSectionProps {
    tier: number;
    analytics: OverallAnalytics | null;
    completionPercentages: {
        videos: number;
        courses: number;
        tests: number;
        blogs: number;
        calls: number;
        overall: number;
    } | null;
    isLoading: boolean;
    lastRefreshed: string | null;
    walletAddress: string | undefined;
    isWalletConnected: boolean;
    refreshAnalytics: () => void;
}

export const TierAnalyticsSection: React.FC<TierAnalyticsSectionProps> = ({
    tier,
    analytics,
    completionPercentages,
    isLoading,
    lastRefreshed,
    walletAddress,
    isWalletConnected,
    refreshAnalytics,
}) => {
    // Get tier name based on tier number
    const getTierName = (tier: number): string => {
        switch (tier) {
            case 1: return 'TOP TIER';
            case 2: return 'RHODIUM';
            case 3: return 'PLATINUM';
            case 4: return 'GOLD';
            case 5: return 'RUTHENIUM';
            case 6: return 'IRIDIUM';
            case 7: return 'OSMIUM';
            case 8: return 'PALLADIUM';
            case 9: return 'RHENIUM';
            case 10: return 'SILVER';
            default: return `TIER ${tier}`;
        }
    };

    // Get tier-specific styles
    const getTierStyles = () => {
        switch (tier) {
            case 1:
                return {
                    primary: 'text-red-500',
                    accent: 'bg-red-900/60',
                    button: 'bg-red-800 hover:bg-red-700',
                    highlight: 'bg-red-900/20',
                };
            case 2:
                return {
                    primary: 'text-blue-500',
                    accent: 'bg-blue-900/60',
                    button: 'bg-blue-800 hover:bg-blue-700',
                    highlight: 'bg-blue-900/20',
                };
            case 3:
                return {
                    primary: 'text-purple-500',
                    accent: 'bg-purple-900/60',
                    button: 'bg-purple-800 hover:bg-purple-700',
                    highlight: 'bg-purple-900/20',
                };
            default:
                return {
                    primary: 'text-red-500',
                    accent: 'bg-red-900/60',
                    button: 'bg-red-800 hover:bg-red-700',
                    highlight: 'bg-red-900/20',
                };
        }
    };

    const styles = getTierStyles();
    const tierName = getTierName(tier);

    if (!isWalletConnected) {
        return (
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 text-center">
                <Wallet className={`w-12 h-12 ${styles.primary} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6">Please connect your wallet to view your learning analytics</p>
            </div>
        );
    }

    if (isLoading && !analytics) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className={`w-10 h-10 border-t-2 border-${tier === 1 ? 'red' : tier === 2 ? 'blue' : 'purple'}-600 rounded-full animate-spin`}></div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-8 bg-black/20 rounded-lg">
                <p className="text-gray-400">No analytics data available yet for {tierName}.</p>
                <p className="text-gray-500 text-sm mt-2">Start engaging with content to see your progress!</p>
            </div>
        );
    }

    // Prepare summary cards data for analytics
    const summaryCardsData = !analytics ? [] : [
        {
            contentType: 'videos' as ContentType,
            title: 'Videos Watched',
            icon: <Video className={`w-5 h-5 ${styles.primary}`} />,
            primaryStat: analytics.videos.completedVideos,
            primaryLabel: `of ${analytics.videos.totalVideos}`,
            secondaryStat: analytics.videos.totalWatchTimeMinutes,
            secondaryLabel: 'Total Minutes Watched',
            color: styles.accent,
            bgGradient: 'bg-gradient-to-br from-black/40 to-black/20'
        },
        {
            contentType: 'courses' as ContentType,
            title: 'Courses Completed',
            icon: <BookOpen className="w-5 h-5 text-blue-500" />,
            primaryStat: analytics.courses.completedCourses,
            primaryLabel: `of ${analytics.courses.totalCourses}`,
            secondaryStat: analytics.courses.avgCompletionRate,
            secondaryLabel: 'Average Completion Rate',
            color: 'bg-blue-900/60',
            bgGradient: 'bg-gradient-to-br from-blue-950/40 to-black/20'
        },
        {
            contentType: 'tests' as ContentType,
            title: 'Tests Passed',
            icon: <Trophy className="w-5 h-5 text-yellow-500" />,
            primaryStat: analytics.tests.passedTests,
            primaryLabel: `of ${analytics.tests.totalTests}`,
            secondaryStat: analytics.tests.avgScore,
            secondaryLabel: 'Average Score',
            color: 'bg-yellow-900/60',
            bgGradient: 'bg-gradient-to-br from-yellow-950/40 to-black/20'
        },
        {
            contentType: 'blogs' as ContentType,
            title: 'Blogs Read',
            icon: <FileText className="w-5 h-5 text-green-500" />,
            primaryStat: analytics.blogs.readBlogs,
            primaryLabel: `of ${analytics.blogs.totalBlogs}`,
            secondaryStat: analytics.blogs.sharedBlogs,
            secondaryLabel: 'Blogs Shared',
            color: 'bg-green-900/60',
            bgGradient: 'bg-gradient-to-br from-green-950/40 to-black/20'
        },
        {
            contentType: 'calls' as ContentType,
            title: 'Calls Attended',
            icon: <Users className="w-5 h-5 text-purple-500" />,
            primaryStat: analytics.calls.attendedCalls,
            primaryLabel: `of ${analytics.calls.totalCalls}`,
            secondaryStat: analytics.calls.totalCallTimeMinutes,
            secondaryLabel: 'Total Call Minutes',
            color: 'bg-purple-900/60',
            bgGradient: 'bg-gradient-to-br from-purple-950/40 to-black/20'
        }
    ];

    // Progress chart data with tier-specific styling
    const progressChartData = !completionPercentages ? [] : [
        {
            label: 'Videos',
            value: completionPercentages.videos,
            color: tier === 1 ? 'bg-red-600' : tier === 2 ? 'bg-blue-600' : 'bg-purple-600',
            icon: <Video className={`w-4 h-4 ${styles.primary}`} />
        },
        {
            label: 'Courses',
            value: completionPercentages.courses,
            color: 'bg-blue-600',
            icon: <BookOpen className="w-4 h-4 text-blue-500" />
        },
        {
            label: 'Tests',
            value: completionPercentages.tests,
            color: 'bg-yellow-600',
            icon: <Trophy className="w-4 h-4 text-yellow-500" />
        },
        {
            label: 'Blogs',
            value: completionPercentages.blogs,
            color: 'bg-green-600',
            icon: <FileText className="w-4 h-4 text-green-500" />
        },
        {
            label: 'Calls',
            value: completionPercentages.calls,
            color: 'bg-purple-600',
            icon: <Users className="w-4 h-4 text-purple-500" />
        },
    ];

    return (
        <div className="space-y-6">
            {/* Analytics Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center">
                    <BarChart className={`w-6 h-6 ${styles.primary} mr-2`} />
                    <h2 className="text-xl font-bold text-white">{tierName} Analytics</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                    {/* Last updated info */}
                    <div className="text-sm text-gray-400 flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>
                            {lastRefreshed ? formatDateTime(lastRefreshed) : 'Never updated'}
                        </span>
                        <button
                            onClick={refreshAnalytics}
                            className="ml-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full"
                            aria-label="Refresh analytics"
                        >
                            <RefreshCw size={14} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Overall stats */}
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center w-full md:w-auto">
                    <div className={`${styles.highlight} p-4 rounded-lg mr-4`}>
                        <CheckCircle className={`w-8 h-8 ${styles.primary}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400">Overall Completion</h3>
                        <p className="text-2xl font-bold text-white">{analytics.overallCompletionRate.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="flex items-center w-full md:w-auto">
                    <div className="bg-blue-900/20 p-4 rounded-lg mr-4">
                        <Trophy className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400">Content Completed</h3>
                        <p className="text-2xl font-bold text-white">
                            {analytics.totalContentEngaged}/{analytics.totalContentAvailable}
                        </p>
                    </div>
                </div>

                <div className="flex items-center w-full md:w-auto">
                    <div className="bg-green-900/20 p-4 rounded-lg mr-4">
                        <Clock className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400">Learning Time</h3>
                        <p className="text-2xl font-bold text-white">
                            {(
                                analytics.videos.totalWatchTimeMinutes +
                                analytics.blogs.totalReadTimeMinutes +
                                analytics.calls.totalCallTimeMinutes
                            ).toLocaleString()} mins
                        </p>
                    </div>
                </div>
            </div>

            {/* Analytics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {summaryCardsData.map((card) => (
                    <AnalyticsSummaryCard
                        key={card.contentType}
                        data={card}
                    />
                ))}
            </div>

            {/* Progress chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ProgressChart
                    data={progressChartData}
                    title="Content Completion Rate"
                />

                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">{tierName} Content Overview</h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">{tierName} Content Available</p>
                            <p className="text-lg font-semibold text-white">
                                {analytics.totalContentAvailable} items
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Content Engaged</p>
                            <p className="text-lg font-semibold text-white">
                                {analytics.totalContentEngaged} items
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};