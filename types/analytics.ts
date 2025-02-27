/**
 * Types for the analytics system
 * These types define the structure of the analytics data stored in Firestore
 */

// Base type for all user-related analytics
export interface UserActivityData {
    userId: string;
    lastUpdated: string; // ISO date string
  }
  
  // Video-specific analytics
  export interface VideoAnalytics extends UserActivityData {
    totalWatched: number;
    totalWatchTimeMinutes: number;
    completedVideos: number;
    totalVideos: number;
    recentlyWatched: string[]; // videoIds
    videoProgress: Record<string, VideoProgress>;
  }
  
  export interface VideoProgress {
    progress: number; // 0-100
    lastPosition: number; // seconds
    lastWatched: string; // ISO date string
    completed: boolean;
  }
  
  // Course-specific analytics
  export interface CourseAnalytics extends UserActivityData {
    startedCourses: number;
    completedCourses: number;
    totalCourses: number;
    avgCompletionRate: number;
    recentCourseIds: string[];
    courseProgress: Record<string, CourseProgress>;
  }
  
  export interface CourseProgress {
    progress: number; // 0-100
    currentLessonId?: string;
    lastUpdated: string; // ISO date string
    completedLessons?: string[]; // lessonIds
  }
  
  // Test-specific analytics
  export interface TestAnalytics extends UserActivityData {
    takenTests: number;
    passedTests: number;
    totalTests: number;
    avgScore: number;
    highestScore: number;
    testScores: Record<string, TestScore>;
  }
  
  export interface TestScore {
    score: number; // 0-100
    passed: boolean;
    completedAt: string; // ISO date string
    timeSpentMinutes?: number;
  }
  
  // Blog-specific analytics
  export interface BlogAnalytics extends UserActivityData {
    readBlogs: number;
    totalBlogs: number;
    totalReadTimeMinutes: number;
    sharedBlogs: number;
    recentBlogIds: string[];
    blogReads?: Record<string, BlogRead>;
    blogShares?: Record<string, Record<string, number>>; // blogId -> platform -> count
  }
  
  export interface BlogRead {
    readAt: string; // ISO date string
    readTimeMinutes: number;
    completedReading: boolean;
  }
  
  // Call-specific analytics
  export interface CallAnalytics extends UserActivityData {
    attendedCalls: number;
    totalCalls: number;
    attendanceRate: number;
    totalCallTimeMinutes: number;
    upcomingCallIds: string[];
    pastCallIds: string[];
    attended?: Record<string, CallAttendance>;
    registered?: Record<string, { registeredAt: string }>;
  }
  
  export interface CallAttendance {
    attendedAt: string; // ISO date string
    durationMinutes: number;
    rating?: number; // Optional user rating
  }
  
  // Comprehensive analytics record
  export interface OverallAnalytics {
    userId: string;
    lastUpdated: string;
    totalContentEngaged: number;
    totalContentAvailable: number;
    overallCompletionRate: number;
    tierLevel?: number;
    videos: VideoAnalytics;
    courses: CourseAnalytics;
    tests: TestAnalytics;
    blogs: BlogAnalytics;
    calls: CallAnalytics;
  }
  
  // Simplified version for display cards
  export interface AnalyticsSummary {
    contentType: 'videos' | 'courses' | 'tests' | 'blogs' | 'calls';
    title: string;
    icon: React.ReactNode;
    primaryStat: number;
    primaryLabel: string;
    secondaryStat: number;
    secondaryLabel: string;
    color: string;
    bgGradient: string;
  }