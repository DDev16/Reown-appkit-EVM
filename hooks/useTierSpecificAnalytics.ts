'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { createTierSpecificAnalyticsService } from '@/services/analytics/tierSpecificAnalyticsService';
import { OverallAnalytics } from '@/types/analytics';

/**
 * Custom hook for accessing and updating tier-specific analytics
 * This differs from useWagmiAnalytics by only showing content specific to a tier,
 * not all content accessible to a tier
 * 
 * @param tier The specific tier to show analytics for
 */
export const useTierSpecificAnalytics = (tier: number) => {
  const { address, isConnected } = useAccount();
  
  // Add a stable connection state with debounce
  const [stableConnection, setStableConnection] = useState(false);
  
  // Add initialization state to prevent UI flicker
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [analytics, setAnalytics] = useState<OverallAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  
  // Debounce connection status
  useEffect(() => {
    const timer = setTimeout(() => {
      setStableConnection(isConnected);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }, [isConnected]);
  
  // Create tier-specific analytics service instance when wallet is connected
  const analyticsService = useMemo(() => {
    if (!address || !stableConnection) return null;
    return createTierSpecificAnalyticsService(address, tier);
  }, [address, stableConnection, tier]); // Include tier in dependencies
  
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
  
  // Fetch tier-specific analytics data
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
      
      // Get tier-specific analytics
      const data = await analyticsService.getTierSpecificAnalytics();
      
      if (data) {
        setAnalytics(data);
      } else {
        // If no analytics document exists yet, initialize through the base service
        console.log('No analytics data found, tier-specific analytics cannot be calculated yet');
        setAnalytics(null);
      }
      
      setLastRefreshed(new Date().toISOString());
      setError(null);
    } catch (err) {
      console.error('Error fetching tier-specific analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
      if (isInitialLoad) setIsInitialized(true);
    }
  }, [analyticsService, isLoading]);
  
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
  
  // Refresh analytics
  const refreshAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (analyticsService) {
        await analyticsService.refreshTierAnalytics();
        const data = await analyticsService.getTierSpecificAnalytics();
        
        if (data) {
          setAnalytics(data);
        }
        
        setLastRefreshed(new Date().toISOString());
        setError(null);
      }
    } catch (err) {
      console.error('Error refreshing tier-specific analytics:', err);
      setError('Failed to refresh analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [analyticsService]);
  
  return {
    analytics,
    isLoading: isLoading || !isInitialized,
    error: stableConnection ? error : "Please connect your wallet to view analytics",
    completionPercentages,
    lastRefreshed,
    refreshAnalytics,
    isWalletConnected: stableConnection,
    walletAddress: address,
    tierLevel: tier,
  };
};