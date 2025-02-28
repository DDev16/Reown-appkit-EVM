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
  lessons: number;
  lessonData?: CourseLessonData[];
  tier?: number;
  completed: boolean; 

  createdAt?: string | Date;
}

// New type for course lessons
export interface CourseLessonData {
  id: string;
  title: string;
  type: 'video' | 'pdf';
  order: number;
  url: string;
  filename?: string;
  duration?: number;
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

// Update the TierContentData interface to include tests
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