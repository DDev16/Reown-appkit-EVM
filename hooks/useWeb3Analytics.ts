'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { createWeb3AnalyticsService } from '@/services/analytics/web3AnalyticsService';
import { OverallAnalytics } from '@/types/analytics';
import { getUserTierLevel } from '@/utils/web3';

/**
 * Custom hook for accessing and updating user analytics with wagmi integration
 */
export const useWagmiAnalytics = () => {
  const { address, isConnected, chainId } = useAccount();
  
  // Add a stable connection state with debounce
  const [stableConnection, setStableConnection] = useState(false);
  
  // Add initialization state to prevent UI flicker
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [analytics, setAnalytics] = useState<OverallAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const [tierLevel, setTierLevel] = useState<number>(1);
  
  // Debounce connection status
  useEffect(() => {
    const timer = setTimeout(() => {
      setStableConnection(isConnected);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }, [isConnected]);
  
  // Create analytics service instance when wallet is connected
  const analyticsService = useMemo(() => {
    if (!address || !stableConnection) return null;
    return createWeb3AnalyticsService(address);
  }, [address, stableConnection]); // Use stable connection instead
  
  // Get user tier level - with proper error handling
  useEffect(() => {
    const fetchTierLevel = async () => {
      if (!address || !stableConnection) return;
      
      try {
        const level = await getUserTierLevel(address);
        setTierLevel(level);
      } catch (error) {
        console.error('Error fetching tier level:', error);
        // Don't set error state here - it will cause UI flicker
      }
    };
    
    fetchTierLevel();
  }, [address, stableConnection]); // Use stable connection
  
  // Calculate completion percentages from analytics data
  const completionPercentages = useMemo(() => {
    if (!analytics) return null;

    return {
      videos: analytics.videos.totalVideos > 0 
        ? (analytics.videos.completedVideos / analytics.videos.totalVideos) * 100 
        : 0,
      courses: analytics.courses.totalCourses > 0 
        ? (analytics.courses.completedCourses / analytics.courses.totalCourses) * 100 
        : 0,
      tests: analytics.tests.totalTests > 0 
        ? (analytics.tests.passedTests / analytics.tests.totalTests) * 100 
        : 0,
      blogs: analytics.blogs.totalBlogs > 0 
        ? (analytics.blogs.readBlogs / analytics.blogs.totalBlogs) * 100 
        : 0,
      calls: analytics.calls.totalCalls > 0 
        ? (analytics.calls.attendedCalls / analytics.calls.totalCalls) * 100 
        : 0,
      overall: analytics.overallCompletionRate
    };
  }, [analytics]);
  
  // Fetch analytics data with better error handling
  const fetchAnalytics = useCallback(async (isInitialLoad = false) => {
    // Don't attempt to fetch if already loading or not properly connected
    if (isLoading && !isInitialLoad) return;
    if (!analyticsService) {
      if (isInitialLoad) {
        setIsLoading(false);
        setIsInitialized(true);
      }
      return;
    }
    
    try {
      if (!isInitialLoad) setIsLoading(true);
      
      const data = await analyticsService.getUserAnalytics();
      
      if (data) {
        setAnalytics(data);
      } else {
        // If no analytics document exists yet, initialize one
        await analyticsService.initializeUserAnalytics(tierLevel);
        const newData = await analyticsService.getUserAnalytics();
        setAnalytics(newData);
      }
      
      setLastRefreshed(new Date().toISOString());
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
      if (isInitialLoad) setIsInitialized(true);
    }
  }, [analyticsService, tierLevel, isLoading]);
  
  // Initial data fetch only once we have stable connection
  useEffect(() => {
    // Only fetch if we have a stable connection and haven't initialized yet
    if (stableConnection && address && !isInitialized) {
      fetchAnalytics(true);
    } else if (!stableConnection && !isInitialized) {
      // If we're not connected, mark as initialized but not loading
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [fetchAnalytics, stableConnection, address, isInitialized]);
  
  // Listen for chain changes - but don't refetch if we're still initializing
  useEffect(() => {
    if (chainId && analytics && isInitialized && !isLoading) {
      fetchAnalytics();
    }
  }, [chainId, fetchAnalytics, analytics, isInitialized, isLoading]);
  
  // Tracking functions
  const trackVideoWatched = useCallback(async (
    videoId: string, 
    durationWatched: number, 
    percentWatched: number
  ) => {
    if (!analyticsService) return;
    await analyticsService.trackVideoWatched(videoId, durationWatched, percentWatched);
  }, [analyticsService]);
  
  const trackCourseProgress = useCallback(async (
    courseId: string, 
    percentCompleted: number, 
    lessonId?: string
  ) => {
    if (!analyticsService) return;
    await analyticsService.trackCourseProgress(courseId, percentCompleted, lessonId);
  }, [analyticsService]);
  
  const trackTestCompleted = useCallback(async (
    testId: string, 
    score: number, 
    isPassed: boolean
  ) => {
    if (!analyticsService) return;
    await analyticsService.trackTestCompleted(testId, score, isPassed);
  }, [analyticsService]);
  
  const trackBlogRead = useCallback(async (
    blogId: string, 
    readTimeMinutes: number
  ) => {
    if (!analyticsService) return;
    await analyticsService.trackBlogRead(blogId, readTimeMinutes);
  }, [analyticsService]);
  
  const trackBlogShared = useCallback(async (
    blogId: string, 
    platform: string
  ) => {
    if (!analyticsService) return;
    await analyticsService.trackBlogShared(blogId, platform);
  }, [analyticsService]);
  
  const trackCallAttended = useCallback(async (
    callId: string, 
    durationMinutes: number
  ) => {
    if (!analyticsService) return;
    await analyticsService.trackCallAttended(callId, durationMinutes);
  }, [analyticsService]);
  
  return {
    analytics,
    isLoading: isLoading || !isInitialized, // Return true if loading or not initialized
    error: stableConnection ? error : "Please connect your wallet to view analytics",
    completionPercentages,
    lastRefreshed,
    refreshAnalytics: (selectedTier: number) => fetchAnalytics(false),
    isWalletConnected: stableConnection,
    walletAddress: address,
    tierLevel,
    chainId,
    // Tracking functions
    trackVideoWatched,
    trackCourseProgress,
    trackTestCompleted,
    trackBlogRead,
    trackBlogShared,
    trackCallAttended,
  };
};