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
    description: string;
    thumbnail: string;
    lessons: number;
    date: string;
    [key: string]: any;
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
  
  export interface TierContentData {
    videos: VideoItem[];
    courses: CourseItem[];
    blogs: BlogItem[];
    calls: CallItem[];
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
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