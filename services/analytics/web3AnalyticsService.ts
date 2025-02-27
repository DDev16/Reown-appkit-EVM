import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  collection,
  query,
  getDocs,
  getCountFromServer,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OverallAnalytics } from '@/components/dashboard/analytics/types';

/**
* AnalyticsService for Web3 users - uses wallet address as identifier
* Handles tracking, storing, and retrieving user analytics data.
*/
export class Web3AnalyticsService {
private walletAddress: string;
private analyticsRef: ReturnType<typeof doc>;

constructor(walletAddress: string) {
  // Convert to lowercase for consistency with Ethereum addresses
  this.walletAddress = walletAddress.toLowerCase();
  this.analyticsRef = doc(db, 'userAnalytics', this.walletAddress);
}

/**
 * Retrieve user analytics data from Firestore
 */
async getUserAnalytics(): Promise<OverallAnalytics | null> {
  try {
    const docSnapshot = await getDoc(this.analyticsRef);
    
    if (docSnapshot.exists()) {
      return docSnapshot.data() as OverallAnalytics;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving analytics:', error);
    throw new Error('Failed to retrieve analytics data');
  }
}

/**
 * Get actual count of videos from Firestore collection filtered by tier
 */
private async getActualVideoCount(tierLevel: number = 1): Promise<number> {
  try {
    console.log(`Getting video count for tier level ${tierLevel}`);
    // Query videos collection for videos with tier <= tierLevel
    const videosCollection = collection(db, 'videos');
    const tierQuery = query(videosCollection, where('tier', '<=', tierLevel));
    const snapshot = await getDocs(tierQuery);
    const count = snapshot.docs.length;
    console.log(`Found ${count} videos for tier level ${tierLevel}`);
    return count;
  } catch (error) {
    console.error('Error getting actual video count:', error);
    // If querying fails, try a direct count without filtering
    try {
      const videosCollection = collection(db, 'videos');
      const snapshot = await getDocs(videosCollection);
      return snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.tier <= tierLevel;
      }).length;
    } catch (fallbackError) {
      console.error('Fallback video count failed:', fallbackError);
      return 10; // Last resort fallback
    }
  }
}

/**
 * Get total count of courses from Firestore filtered by tier
 */
private async getActualCourseCount(tierLevel: number = 1): Promise<number> {
  try {
    const coursesCollection = collection(db, 'courses');
    const tierQuery = query(coursesCollection, where('tier', '<=', tierLevel));
    const snapshot = await getDocs(tierQuery);
    return snapshot.docs.length;
  } catch (error) {
    console.error('Error getting course count:', error);
    return 5; // Fallback
  }
}

/**
 * Get total count of blogs from Firestore filtered by tier
 */
private async getActualBlogCount(tierLevel: number = 1): Promise<number> {
  try {
    const blogsCollection = collection(db, 'blogs');
    const tierQuery = query(blogsCollection, where('tier', '<=', tierLevel));
    const snapshot = await getDocs(tierQuery);
    return snapshot.docs.length;
  } catch (error) {
    console.error('Error getting blog count:', error);
    return 15; // Fallback
  }
}

/**
 * Get total count of tests from Firestore filtered by tier
 */
private async getActualTestCount(tierLevel: number = 1): Promise<number> {
  try {
    const testsCollection = collection(db, 'tests');
    const tierQuery = query(testsCollection, where('tier', '<=', tierLevel));
    const snapshot = await getDocs(tierQuery);
    return snapshot.docs.length;
  } catch (error) {
    console.error('Error getting test count:', error);
    return 8; // Fallback
  }
}

/**
 * Get total count of calls from Firestore filtered by tier
 */
private async getActualCallCount(tierLevel: number = 1): Promise<number> {
  try {
    const callsCollection = collection(db, 'calls');
    const tierQuery = query(callsCollection, where('tier', '<=', tierLevel));
    const snapshot = await getDocs(tierQuery);
    return snapshot.docs.length;
  } catch (error) {
    console.error('Error getting call count:', error);
    return 4; // Fallback
  }
}

/**
 * Update content counts in analytics document for a specific tier
 */
async refreshContentCounts(tierLevel?: number): Promise<void> {
  try {
    const analytics = await this.getUserAnalytics();
    
    if (!analytics) {
      console.log('No analytics document found to update counts');
      return;
    }
    
    // Use provided tier or fallback to user's stored tier
    const userTier = tierLevel !== undefined ? tierLevel : analytics.tierLevel || 1;
    console.log(`Refreshing content counts for tier ${userTier}`);
    
    // Get counts for each content type filtered by tier
    const videoCount = await this.getActualVideoCount(userTier);
    const courseCount = await this.getActualCourseCount(userTier);
    const blogCount = await this.getActualBlogCount(userTier);
    const testCount = await this.getActualTestCount(userTier);
    const callCount = await this.getActualCallCount(userTier);
    
    const totalAvailable = videoCount + courseCount + blogCount + testCount + callCount;
    
    console.log(`Updating content counts for tier ${userTier}:`, {
      videos: videoCount,
      courses: courseCount,
      blogs: blogCount,
      tests: testCount,
      calls: callCount,
      total: totalAvailable
    });
    
    // Update the analytics document with new counts
    await updateDoc(this.analyticsRef, {
      'videos.totalVideos': videoCount,
      'courses.totalCourses': courseCount,
      'blogs.totalBlogs': blogCount,
      'tests.totalTests': testCount,
      'calls.totalCalls': callCount,
      'totalContentAvailable': totalAvailable,
      'lastUpdated': serverTimestamp()
    });
    
    // Update completion rate based on new counts
    const totalCompleted = 
      analytics.videos.completedVideos + 
      analytics.courses.completedCourses + 
      analytics.blogs.readBlogs + 
      analytics.tests.passedTests + 
      analytics.calls.attendedCalls;
    
    if (totalAvailable > 0) {
      const newRate = (totalCompleted / totalAvailable) * 100;
      await updateDoc(this.analyticsRef, {
        'overallCompletionRate': Math.min(100, newRate)
      });
    }
    
    console.log('Content counts updated successfully for tier', userTier);
  } catch (error) {
    console.error('Error refreshing content counts:', error);
  }
}

/**
 * Track video watch activity
 */
async trackVideoWatched(videoId: string, durationWatched: number, percentWatched: number): Promise<void> {
  try {
    console.log("Starting trackVideoWatched:", {
      videoId,
      durationWatched,
      percentWatched,
      walletAddress: this.walletAddress
    });

    // First ensure the analytics document exists
    const analytics = await this.getUserAnalytics();
    if (!analytics) {
      console.log("No analytics found, initializing for:", this.walletAddress);
      await this.initializeUserAnalytics(1); // Default to tier 1
      
      // Refresh content counts right after initialization
      await this.refreshContentCounts(1);
    } else if (analytics.videos.totalVideos === 0) {
      // Refresh counts if totalVideos is zero
      await this.refreshContentCounts(analytics.tierLevel);
    }
    
    // Check if this is the first time watching this specific video
    const isFirstWatch = !analytics?.videos.videoProgress?.[videoId];

    // Prepare analytics update
    const analyticsUpdate: Record<string, any> = {
      [`videos.videoProgress.${videoId}`]: {
        lastWatched: serverTimestamp(),
        progress: percentWatched,
        durationWatched,
      },
      'lastUpdated': serverTimestamp()
    };
    
    // If this is first watch, increment total content engaged
    if (isFirstWatch) {
      analyticsUpdate['totalContentEngaged'] = increment(1);
      analyticsUpdate['videos.totalWatched'] = increment(1);
    }
    
    // If video is considered completed (>90% watched), increment completed count
    if (percentWatched > 90) {
      analyticsUpdate['videos.completedVideos'] = increment(1);
      
      // Update overall completion rate
      if (analytics) {
        const totalCompleted = analytics.videos.completedVideos + 1; // Add current completion
        const totalAvailable = analytics.totalContentAvailable;
        if (totalAvailable > 0) {
          const newRate = (totalCompleted / totalAvailable) * 100;
          analyticsUpdate['overallCompletionRate'] = Math.min(100, newRate);
        }
      }
    }
    
    // Update total watch time - ensure we track minutes correctly
    const minutesWatched = Math.max(1, Math.floor(durationWatched / 60));
    analyticsUpdate['videos.totalWatchTimeMinutes'] = increment(minutesWatched);
    
    console.log("Updating video analytics:", {
      videoId,
      percentWatched,
      walletAddress: this.walletAddress,
      analyticsRef: this.analyticsRef.path
    });

    // Update analytics document with merge
    await updateDoc(this.analyticsRef, analyticsUpdate);
    console.log("Successfully updated video analytics for:", videoId);
    
    // Also update user progress collection for detailed progress tracking
    const progressRef = doc(db, 'userProgress', this.walletAddress);
    await setDoc(progressRef, {
      videos: {
        [videoId]: {
          progress: percentWatched,
          lastPosition: durationWatched,
          lastWatched: serverTimestamp(),
          completed: percentWatched > 90
        }
      }
    }, { merge: true });
    console.log("Successfully updated user progress for:", videoId);
    
  } catch (error) {
    console.error('Error tracking video watch:', error);
  }
}

/**
 * Track course progress
 */
async trackCourseProgress(courseId: string, percentCompleted: number, lessonId?: string): Promise<void> {
  try {
    const analyticsUpdate: Record<string, any> = {
      [`courses.courseProgress.${courseId}`]: {
        lastUpdated: serverTimestamp(),
        progress: percentCompleted,
        currentLessonId: lessonId || null
      },
      'lastUpdated': serverTimestamp()
    };
    
    // If this is the first time tracking this course, increment started courses
    const analytics = await this.getUserAnalytics();
    if (!analytics?.courses.courseProgress?.[courseId]) {
      analyticsUpdate['courses.startedCourses'] = increment(1);
      analyticsUpdate['totalContentEngaged'] = increment(1);
    }
    
    // If course is completed, increment completed count
    if (percentCompleted >= 100) {
      analyticsUpdate['courses.completedCourses'] = increment(1);
      
      // Update overall completion rate
      if (analytics) {
        const totalCompleted = analytics.courses.completedCourses + 1;
        const totalAvailable = analytics.totalContentAvailable;
        if (totalAvailable > 0) {
          const newRate = (
            (analytics.videos.completedVideos + 
             totalCompleted + 
             analytics.blogs.readBlogs + 
             analytics.tests.passedTests + 
             analytics.calls.attendedCalls) / totalAvailable
          ) * 100;
          analyticsUpdate['overallCompletionRate'] = Math.min(100, newRate);
        }
      }
    }
    
    await updateDoc(this.analyticsRef, analyticsUpdate);
    
  } catch (error) {
    console.error('Error tracking course progress:', error);
  }
}

/**
 * Track test completion
 */
async trackTestCompleted(testId: string, score: number, isPassed: boolean): Promise<void> {
  try {
    const analyticsUpdate: Record<string, any> = {
      [`tests.testScores.${testId}`]: {
        completedAt: serverTimestamp(),
        score,
        passed: isPassed
      },
      'tests.takenTests': increment(1),
      'lastUpdated': serverTimestamp()
    };
    
    // If first time taking test
    const analytics = await this.getUserAnalytics();
    if (!analytics?.tests.testScores?.[testId]) {
      analyticsUpdate['totalContentEngaged'] = increment(1);
    }
    
    if (isPassed) {
      analyticsUpdate['tests.passedTests'] = increment(1);
      
      // Update overall completion rate
      if (analytics) {
        const totalCompleted = analytics.tests.passedTests + 1;
        const totalAvailable = analytics.totalContentAvailable;
        if (totalAvailable > 0) {
          const newRate = (
            (analytics.videos.completedVideos + 
             analytics.courses.completedCourses + 
             analytics.blogs.readBlogs + 
             totalCompleted + 
             analytics.calls.attendedCalls) / totalAvailable
          ) * 100;
          analyticsUpdate['overallCompletionRate'] = Math.min(100, newRate);
        }
      }
    }
    
    await updateDoc(this.analyticsRef, analyticsUpdate);
    
  } catch (error) {
    console.error('Error tracking test completion:', error);
  }
}

/**
 * Track blog read
 */
async trackBlogRead(blogId: string, readTimeMinutes: number): Promise<void> {
  try {
    const analytics = await this.getUserAnalytics();
    const isFirstRead = !analytics?.blogs.blogReads?.[blogId];
    
    const analyticsUpdate: Record<string, any> = {
      [`blogs.blogReads.${blogId}`]: {
        readAt: serverTimestamp(),
        readTimeMinutes,
      },
      'blogs.totalReadTimeMinutes': increment(readTimeMinutes),
      'lastUpdated': serverTimestamp()
    };
    
    if (isFirstRead) {
      analyticsUpdate['blogs.readBlogs'] = increment(1);
      analyticsUpdate['totalContentEngaged'] = increment(1);
      
      // Update overall completion rate
      if (analytics) {
        const totalCompleted = analytics.blogs.readBlogs + 1;
        const totalAvailable = analytics.totalContentAvailable;
        if (totalAvailable > 0) {
          const newRate = (
            (analytics.videos.completedVideos + 
             analytics.courses.completedCourses + 
             totalCompleted + 
             analytics.tests.passedTests + 
             analytics.calls.attendedCalls) / totalAvailable
          ) * 100;
          analyticsUpdate['overallCompletionRate'] = Math.min(100, newRate);
        }
      }
    }
    
    await updateDoc(this.analyticsRef, analyticsUpdate);
    
  } catch (error) {
    console.error('Error tracking blog read:', error);
  }
}

/**
 * Track blog shared
 */
async trackBlogShared(blogId: string, platform: string): Promise<void> {
  try {
    const analyticsUpdate: Record<string, any> = {
      [`blogs.blogShares.${blogId}.${platform}`]: increment(1),
      'blogs.sharedBlogs': increment(1),
      'lastUpdated': serverTimestamp()
    };
    
    await updateDoc(this.analyticsRef, analyticsUpdate);
    
  } catch (error) {
    console.error('Error tracking blog share:', error);
  }
}

/**
 * Track call attendance
 */
async trackCallAttended(callId: string, durationMinutes: number): Promise<void> {
  try {
    const analytics = await this.getUserAnalytics();
    const isFirstAttendance = !analytics?.calls.attended?.[callId];
    
    const analyticsUpdate: Record<string, any> = {
      [`calls.attended.${callId}`]: {
        attendedAt: serverTimestamp(),
        durationMinutes
      },
      'calls.totalCallTimeMinutes': increment(durationMinutes),
      'lastUpdated': serverTimestamp()
    };
    
    if (isFirstAttendance) {
      analyticsUpdate['calls.attendedCalls'] = increment(1);
      analyticsUpdate['totalContentEngaged'] = increment(1);
      
      // Update overall completion rate
      if (analytics) {
        const totalCompleted = analytics.calls.attendedCalls + 1;
        const totalAvailable = analytics.totalContentAvailable;
        if (totalAvailable > 0) {
          const newRate = (
            (analytics.videos.completedVideos + 
             analytics.courses.completedCourses + 
             analytics.blogs.readBlogs + 
             analytics.tests.passedTests + 
             totalCompleted) / totalAvailable
          ) * 100;
          analyticsUpdate['overallCompletionRate'] = Math.min(100, newRate);
        }
      }
    }
    
    await updateDoc(this.analyticsRef, analyticsUpdate);
    
  } catch (error) {
    console.error('Error tracking call attendance:', error);
  }
}

/**
 * Get total count of content items for a specific type
 * This helps initialize analytics with proper content counts
 */
private async getTotalContentCount(contentType: string, tierLevel: number = 1): Promise<number> {
  try {
    switch (contentType) {
      case 'videos':
        return await this.getActualVideoCount(tierLevel);
      case 'courses':
        return await this.getActualCourseCount(tierLevel);
      case 'blogs':
        return await this.getActualBlogCount(tierLevel);
      case 'tests':
        return await this.getActualTestCount(tierLevel);
      case 'calls':
        return await this.getActualCallCount(tierLevel);
      default:
        return 0;
    }
  } catch (error) {
    console.error(`Error getting ${contentType} count:`, error);
    return 0;
  }
}

/**
 * Initialize analytics for a new user
 * This creates the baseline analytics document
 */
async initializeUserAnalytics(tierLevel: number): Promise<void> {
  try {
    console.log(`Initializing analytics for user ${this.walletAddress} with tier ${tierLevel}`);
    
    // Get counts of available content for this tier
    const videoCount = await this.getTotalContentCount('videos', tierLevel);
    const courseCount = await this.getTotalContentCount('courses', tierLevel);
    const blogCount = await this.getTotalContentCount('blogs', tierLevel);
    const testCount = await this.getTotalContentCount('tests', tierLevel);
    const callCount = await this.getTotalContentCount('calls', tierLevel);
    
    const totalAvailable = videoCount + courseCount + blogCount + testCount + callCount;
    
    console.log('Initializing analytics with content counts:', {
      tier: tierLevel,
      videos: videoCount,
      courses: courseCount,
      blogs: blogCount,
      tests: testCount,
      calls: callCount,
      total: totalAvailable
    });
    
    // Then use these counts in the initial analytics
    const initialAnalytics: OverallAnalytics = {
      userId: this.walletAddress,
      lastUpdated: new Date().toISOString(),
      totalContentEngaged: 0,
      totalContentAvailable: totalAvailable > 0 ? totalAvailable : 50,
      overallCompletionRate: 0,
      tierLevel,
      videos: {
        userId: this.walletAddress,
        lastUpdated: new Date().toISOString(),
        totalWatched: 0,
        totalWatchTimeMinutes: 0,
        completedVideos: 0,
        totalVideos: videoCount,
        recentlyWatched: [],
        videoProgress: {}
      },
      courses: {
        userId: this.walletAddress,
        lastUpdated: new Date().toISOString(),
        startedCourses: 0,
        completedCourses: 0,
        totalCourses: courseCount,
        avgCompletionRate: 0,
        recentCourseIds: [],
        courseProgress: {}
      },
      tests: {
        userId: this.walletAddress,
        lastUpdated: new Date().toISOString(),
        takenTests: 0,
        passedTests: 0,
        totalTests: testCount,
        avgScore: 0,
        highestScore: 0,
        testScores: {}
      },
      blogs: {
        userId: this.walletAddress,
        lastUpdated: new Date().toISOString(),
        readBlogs: 0,
        totalBlogs: blogCount,
        totalReadTimeMinutes: 0,
        sharedBlogs: 0,
        recentBlogIds: []
      },
      calls: {
        userId: this.walletAddress,
        lastUpdated: new Date().toISOString(),
        attendedCalls: 0,
        totalCalls: callCount,
        attendanceRate: 0,
        totalCallTimeMinutes: 0,
        upcomingCallIds: [],
        pastCallIds: []
      }
    };
    
    await setDoc(this.analyticsRef, initialAnalytics);
    console.log('Analytics initialized successfully for:', this.walletAddress);
    
  } catch (error) {
    console.error('Error initializing user analytics:', error);
  }
}
}

// Create a function to get service instance
export const createWeb3AnalyticsService = (walletAddress: string) => new Web3AnalyticsService(walletAddress);