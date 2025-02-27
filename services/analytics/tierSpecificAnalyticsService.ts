// services/analytics/tierSpecificAnalyticsService.ts

import { 
    doc, 
    collection, 
    query, 
    where, 
    getDocs,
    getDoc
  } from 'firebase/firestore';
  import { db } from '@/lib/firebase';
  import { createWeb3AnalyticsService } from '@/services/analytics/web3AnalyticsService';
  import { OverallAnalytics } from '@/types/analytics';
  
  /**
   * Service for filtering analytics data for tier-specific dashboards
   * Wraps the Web3AnalyticsService but filters content by exact tier match
   */
  export class TierSpecificAnalyticsService {
    private walletAddress: string;
    private tier: number;
    private baseAnalyticsService: any; // The base Web3AnalyticsService instance
  
    constructor(walletAddress: string, tier: number) {
      this.walletAddress = walletAddress;
      this.tier = tier;
      this.baseAnalyticsService = createWeb3AnalyticsService(walletAddress);
    }
  
    /**
     * Get total count of videos from Firestore for specific tier only
     */
    private async getTierSpecificVideoCount(): Promise<number> {
      try {
        console.log(`Getting videos for EXACT tier ${this.tier}`);
        const videosCollection = collection(db, 'videos');
        const tierQuery = query(videosCollection, where('tier', '==', this.tier));
        const snapshot = await getDocs(tierQuery);
        const count = snapshot.docs.length;
        console.log(`Found ${count} videos for exact tier ${this.tier}`);
        return count;
      } catch (error) {
        console.error('Error getting tier-specific video count:', error);
        return 0;
      }
    }
  
    /**
     * Get total count of courses from Firestore for specific tier only
     */
    private async getTierSpecificCourseCount(): Promise<number> {
      try {
        const coursesCollection = collection(db, 'courses');
        const tierQuery = query(coursesCollection, where('tier', '==', this.tier));
        const snapshot = await getDocs(tierQuery);
        return snapshot.docs.length;
      } catch (error) {
        console.error('Error getting tier-specific course count:', error);
        return 0;
      }
    }
  
    /**
     * Get total count of blogs from Firestore for specific tier only
     */
    private async getTierSpecificBlogCount(): Promise<number> {
      try {
        const blogsCollection = collection(db, 'blogs');
        const tierQuery = query(blogsCollection, where('tier', '==', this.tier));
        const snapshot = await getDocs(tierQuery);
        return snapshot.docs.length;
      } catch (error) {
        console.error('Error getting tier-specific blog count:', error);
        return 0;
      }
    }
  
    /**
     * Get total count of tests from Firestore for specific tier only
     */
    private async getTierSpecificTestCount(): Promise<number> {
      try {
        const testsCollection = collection(db, 'tests');
        const tierQuery = query(testsCollection, where('tier', '==', this.tier));
        const snapshot = await getDocs(tierQuery);
        return snapshot.docs.length;
      } catch (error) {
        console.error('Error getting tier-specific test count:', error);
        return 0;
      }
    }
  
    /**
     * Get total count of calls from Firestore for specific tier only
     */
    private async getTierSpecificCallCount(): Promise<number> {
      try {
        const callsCollection = collection(db, 'calls');
        const tierQuery = query(callsCollection, where('tier', '==', this.tier));
        const snapshot = await getDocs(tierQuery);
        return snapshot.docs.length;
      } catch (error) {
        console.error('Error getting tier-specific call count:', error);
        return 0;
      }
    }
  
    /**
     * Get videos that are watched by the user AND belong to the specific tier
     */
    private async getWatchedVideosInTier(watchedVideoIds: string[]): Promise<{
      videoCount: number;
      watchTimeMinutes: number;
    }> {
      if (!watchedVideoIds || watchedVideoIds.length === 0) {
        return { videoCount: 0, watchTimeMinutes: 0 };
      }
  
      try {
        let tierWatchedCount = 0;
        let tierWatchTimeMinutes = 0;
        
        // For each watched video ID, check if it belongs to this tier
        for (const videoId of watchedVideoIds) {
          const videoRef = doc(db, 'videos', videoId);
          const videoDoc = await getDoc(videoRef);
          
          if (videoDoc.exists() && videoDoc.data().tier === this.tier) {
            tierWatchedCount++;
            
            // If we have watch time data for this video, add it to the total
            // This depends on your data structure
            const userProgressRef = doc(db, 'userProgress', this.walletAddress);
            const progressDoc = await getDoc(userProgressRef);
            
            if (progressDoc.exists() && 
                progressDoc.data().videos && 
                progressDoc.data().videos[videoId]) {
              const videoProgress = progressDoc.data().videos[videoId];
              if (videoProgress.lastPosition) {
                // Convert seconds to minutes
                tierWatchTimeMinutes += Math.floor(videoProgress.lastPosition / 60);
              }
            }
          }
        }
        
        return { videoCount: tierWatchedCount, watchTimeMinutes: tierWatchTimeMinutes };
      } catch (error) {
        console.error('Error getting watched videos in tier:', error);
        return { videoCount: 0, watchTimeMinutes: 0 };
      }
    }
  
    /**
     * Get courses that are completed by the user AND belong to the specific tier
     */
    private async getCompletedCoursesInTier(completedCourseIds: string[]): Promise<number> {
      if (!completedCourseIds || completedCourseIds.length === 0) {
        return 0;
      }
  
      try {
        let tierCompletedCount = 0;
        
        // For each completed course ID, check if it belongs to this tier
        for (const courseId of completedCourseIds) {
          const courseRef = doc(db, 'courses', courseId);
          const courseDoc = await getDoc(courseRef);
          
          if (courseDoc.exists() && courseDoc.data().tier === this.tier) {
            tierCompletedCount++;
          }
        }
        
        return tierCompletedCount;
      } catch (error) {
        console.error('Error getting completed courses in tier:', error);
        return 0;
      }
    }
  
    /**
     * Get blogs that are read by the user AND belong to the specific tier
     */
    private async getReadBlogsInTier(readBlogIds: string[]): Promise<{
      blogCount: number;
      readTimeMinutes: number;
    }> {
      if (!readBlogIds || readBlogIds.length === 0) {
        return { blogCount: 0, readTimeMinutes: 0 };
      }
  
      try {
        let tierReadCount = 0;
        let tierReadTimeMinutes = 0;
        
        // For each read blog ID, check if it belongs to this tier
        for (const blogId of readBlogIds) {
          const blogRef = doc(db, 'blogs', blogId);
          const blogDoc = await getDoc(blogRef);
          
          if (blogDoc.exists() && blogDoc.data().tier === this.tier) {
            tierReadCount++;
            
            // If we have readTime data for this blog, add it to the total
            if (blogDoc.data().readTime) {
              tierReadTimeMinutes += blogDoc.data().readTime;
            }
          }
        }
        
        return { blogCount: tierReadCount, readTimeMinutes: tierReadTimeMinutes };
      } catch (error) {
        console.error('Error getting read blogs in tier:', error);
        return { blogCount: 0, readTimeMinutes: 0 };
      }
    }
  
    /**
     * Get tests that are passed by the user AND belong to the specific tier
     */
    private async getPassedTestsInTier(passedTestIds: string[]): Promise<number> {
      if (!passedTestIds || passedTestIds.length === 0) {
        return 0;
      }
  
      try {
        let tierPassedCount = 0;
        
        // For each passed test ID, check if it belongs to this tier
        for (const testId of passedTestIds) {
          const testRef = doc(db, 'tests', testId);
          const testDoc = await getDoc(testRef);
          
          if (testDoc.exists() && testDoc.data().tier === this.tier) {
            tierPassedCount++;
          }
        }
        
        return tierPassedCount;
      } catch (error) {
        console.error('Error getting passed tests in tier:', error);
        return 0;
      }
    }
  
    /**
     * Get calls that are attended by the user AND belong to the specific tier
     */
    private async getAttendedCallsInTier(attendedCallIds: string[]): Promise<{
      callCount: number;
      callTimeMinutes: number;
    }> {
      if (!attendedCallIds || attendedCallIds.length === 0) {
        return { callCount: 0, callTimeMinutes: 0 };
      }
  
      try {
        let tierAttendedCount = 0;
        let tierCallTimeMinutes = 0;
        
        // For each attended call ID, check if it belongs to this tier
        for (const callId of attendedCallIds) {
          const callRef = doc(db, 'calls', callId);
          const callDoc = await getDoc(callRef);
          
          if (callDoc.exists() && callDoc.data().tier === this.tier) {
            tierAttendedCount++;
            
            // If we have call duration data, add it to the total
            if (callDoc.data().duration) {
              tierCallTimeMinutes += callDoc.data().duration;
            }
          }
        }
        
        return { callCount: tierAttendedCount, callTimeMinutes: tierCallTimeMinutes };
      } catch (error) {
        console.error('Error getting attended calls in tier:', error);
        return { callCount: 0, callTimeMinutes: 0 };
      }
    }
  
    /**
     * Get analytics data filtered for the specific tier
     */
    async getTierSpecificAnalytics(): Promise<OverallAnalytics | null> {
      try {
        // First get the base analytics data
        const analytics = await this.baseAnalyticsService.getUserAnalytics();
        
        if (!analytics) {
          return null;
        }
  
        // Get counts for content specifically in this tier
        const videoCount = await this.getTierSpecificVideoCount();
        const courseCount = await this.getTierSpecificCourseCount();
        const blogCount = await this.getTierSpecificBlogCount();
        const testCount = await this.getTierSpecificTestCount();
        const callCount = await this.getTierSpecificCallCount();
        
        // Create a deep copy of the analytics to avoid modifying the original
        const tierAnalytics = JSON.parse(JSON.stringify(analytics));
        
        // Extract watched video IDs from the video progress data
        const watchedVideoIds = Object.keys(analytics.videos.videoProgress || {});
        const { videoCount: completedVideosInTier, watchTimeMinutes } = 
          await this.getWatchedVideosInTier(watchedVideoIds);
        
        // Extract completed course IDs 
        const completedCourseIds = Object.keys(analytics.courses.courseProgress || {})
          .filter(id => analytics.courses.courseProgress[id].progress >= 100);
        const completedCoursesInTier = await this.getCompletedCoursesInTier(completedCourseIds);
        
        // Extract read blog IDs
        const readBlogIds = Object.keys(analytics.blogs.blogReads || {});
        const { blogCount: readBlogsInTier, readTimeMinutes } = 
          await this.getReadBlogsInTier(readBlogIds);
        
        // Extract passed test IDs
        const passedTestIds = Object.keys(analytics.tests.testScores || {})
          .filter(id => analytics.tests.testScores[id].passed);
        const passedTestsInTier = await this.getPassedTestsInTier(passedTestIds);
        
        // Extract attended call IDs
        const attendedCallIds = Object.keys(analytics.calls.attended || {});
        const { callCount: attendedCallsInTier, callTimeMinutes } = 
          await this.getAttendedCallsInTier(attendedCallIds);
        
        // Update the analytics with tier-specific data
        tierAnalytics.videos.totalVideos = videoCount;
        tierAnalytics.videos.completedVideos = completedVideosInTier;
        tierAnalytics.videos.totalWatchTimeMinutes = watchTimeMinutes;
        
        tierAnalytics.courses.totalCourses = courseCount;
        tierAnalytics.courses.completedCourses = completedCoursesInTier;
        
        tierAnalytics.blogs.totalBlogs = blogCount;
        tierAnalytics.blogs.readBlogs = readBlogsInTier;
        tierAnalytics.blogs.totalReadTimeMinutes = readTimeMinutes;
        
        tierAnalytics.tests.totalTests = testCount;
        tierAnalytics.tests.passedTests = passedTestsInTier;
        
        tierAnalytics.calls.totalCalls = callCount;
        tierAnalytics.calls.attendedCalls = attendedCallsInTier;
        tierAnalytics.calls.totalCallTimeMinutes = callTimeMinutes;
        
        // Update the total available content count
        tierAnalytics.totalContentAvailable = 
          videoCount + courseCount + blogCount + testCount + callCount;
        
        // Update the tier level
        tierAnalytics.tierLevel = this.tier;
        
        // Update total content engaged
        tierAnalytics.totalContentEngaged =
          completedVideosInTier + completedCoursesInTier + 
          readBlogsInTier + passedTestsInTier + attendedCallsInTier;
        
        // If there's content available, recalculate the completion rate for this tier
        if (tierAnalytics.totalContentAvailable > 0) {
          tierAnalytics.overallCompletionRate = 
            (tierAnalytics.totalContentEngaged / tierAnalytics.totalContentAvailable) * 100;
        } else {
          tierAnalytics.overallCompletionRate = 0;
        }
        
        return tierAnalytics;
      } catch (error) {
        console.error('Error getting tier-specific analytics:', error);
        return null;
      }
    }
  
    /**
     * Refresh analytics for the specific tier
     */
    async refreshTierAnalytics(): Promise<void> {
      try {
        // First refresh the base analytics
        await this.baseAnalyticsService.refreshContentCounts();
        
        // Then get the updated analytics with tier-specific filtering
        await this.getTierSpecificAnalytics();
      } catch (error) {
        console.error('Error refreshing tier analytics:', error);
      }
    }
  }
  
  /**
   * Create a tier-specific analytics service instance
   */
  export const createTierSpecificAnalyticsService = (walletAddress: string, tier: number) => 
    new TierSpecificAnalyticsService(walletAddress, tier);