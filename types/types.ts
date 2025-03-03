export type ContentType = 'video' | 'course' | 'blog' | 'call' | 'test';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  url: string;
  date: string;
  [key: string]: any;
}

export interface CourseItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  thumbnail?: string;
  lessons: number; // Number of lessons
  lessonData?: CourseLessonData[]; // Lesson data from either embedded or subcollection
  lessonSource?: 'embedded' | 'subcollection' | 'collection'; // Updated to include collection source
  tier?: number; // For backward compatibility
  tiers?: number[]; // NEW: Array of tier numbers this course belongs to
  completed: boolean;
  createdAt?: string | Date | any; // Support for Firestore Timestamp
  [key: string]: any; // For additional Firestore fields
}

// Course lesson data interface - updated for top-level collection
export interface CourseLessonData {
  id: string;
  title: string;
  type: 'video' | 'pdf';
  order: number;
  url: string;
  filename?: string;
  duration?: number;
  courseId?: string; // NEW: Reference to parent course for top-level collection
  createdAt?: string | Date | any; // Support for Firestore Timestamp
  [key: string]: any; // For additional fields that may come from Firestore
}

// New interface to represent course progress for a specific lesson
export interface LessonProgress {
  lessonId: string;
  courseId: string;
  progress: number; // 0-100
  lastPosition: number; // seconds
  lastWatched: string | Date; // ISO date string or Date object
  completed: boolean;
}

export interface BlogItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  readTime: number;
  date: string;
  [key: string]: any;
}

export interface CallItem {
  id: string;
  title: string;
  description: string;
  host: string;
  date: string;
  time: string;
  [key: string]: any;
}

export interface ContentSectionProps {
  title: string;
  viewAllLink: string;
  icon: React.ReactNode;
}

export interface TestItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  questions: number;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  date: string;
  completed?: boolean;
  score?: number;
  [key: string]: any;
}

// TierContentData interface including tests
export interface TierContentData {
  videos: VideoItem[];
  courses: CourseItem[];
  blogs: BlogItem[];
  calls: CallItem[];
  tests: TestItem[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export interface ProgressItem {
  id: string;
  title: string;
  contentType: ContentType;
  progress: number;
  lastPosition?: number;
  duration?: number;
  completed: boolean;
  lastUpdated: string;
}

export interface UserProgress {
  userId: string;
  items: ProgressItem[];
  lastUpdated: string;
}

export interface UserAnalytics {
  userId: string;
  videoCompleted: number;
  videoInProgress: number;
  courseCompleted: number;
  courseInProgress: number;
  blogCompleted: number;
  testCompleted: number;
  callAttended: number;
  lastUpdated: string;
}

// For lesson file uploads
export interface CourseLessonFile {
  id: string;
  order: number;
  title: string;
  type: 'video' | 'pdf';
  file: File;
  duration?: string;
}

// For upload status tracking
export interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  fileUrl: string | null;
  transferredMB: number;
  totalMB: number;
  state: 'running' | 'paused' | 'success' | 'error';
  pauseUpload?: () => void;
  resumeUpload?: () => void;
  cancelUpload?: () => void;
}

// NEW: Database document interface for lessons collection
export interface LessonDocument {
  id: string;
  courseId: string; // Reference to parent course
  order: number;
  title: string;
  type: 'video' | 'pdf';
  url: string;
  filename: string;
  duration?: number; // Duration for videos in seconds
  createdAt: any; // Firestore timestamp
}

// NEW: Database document interface for courses collection
export interface CourseDocument {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tiers: number[]; // Array of tier numbers this course belongs to
  lessons: number; // Total number of lessons
  lessonCount: number; // Actual count of uploaded lessons
  createdAt: any; // Firestore timestamp
  date: string; // ISO date string
  status: 'pending' | 'complete'; 
}