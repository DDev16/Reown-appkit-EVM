// Content types
export type ContentType = 'videos' | 'courses' | 'blogs' | 'tests' | 'calls';
export type TestDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CourseFileType = 'video' | 'pdf';

export interface UploadStatus {
    isUploading: boolean;
    progress: number;
    error: string | null;
    success: boolean;
    fileUrl: string | null;
    // New fields for improved UX
    transferredMB?: number;
    totalMB?: number;
    state?: 'running' | 'paused' | 'error' | 'success';
    // Functions for controlling upload
    pauseUpload?: () => void;
    resumeUpload?: () => void;
    cancelUpload?: () => void;
}

export interface Tier {
    id: number;
    name: string;
}

export interface ContentTypeOption {
    id: ContentType;
    label: string;
    icon: JSX.Element;
}

export interface DifficultyOption {
    value: TestDifficulty;
    label: string;
    color: string;
}

// Base content form data
export interface BaseContentFormData {
    title: string;
    description: string;
    thumbnailFile: File | null;
}

// Course lesson file
export interface CourseLessonFile {
    id: string; // Unique identifier
    order: number; // For ordering the files
    type: CourseFileType; // 'video' or 'pdf'
    file: File;
    title: string;
    duration?: string; // Duration for videos in seconds
}

// Content-specific form data
export interface VideoFormData extends BaseContentFormData {
    contentFile: File | null;
    duration: string;
}

export interface CourseFormData extends BaseContentFormData {
    numLessons: string;
    lessonFiles: CourseLessonFile[]; // Array of lesson files
}

export interface BlogFormData extends BaseContentFormData {
    author: string;
    readTime: string;
    contentFile: File | null; // Optional for blogs
}

export interface TestFormData extends BaseContentFormData {
    numQuestions: string;
    estimatedTime: string;
    testDifficulty: TestDifficulty;
    contentFile: File | null; // Optional for tests
}

export interface CallFormData extends BaseContentFormData {
    callHost: string;
    callDate: string;
    callTime: string;
    callDuration: string;
    callUrl: string;
}

// Union type for all form data
export type ContentFormData = 
    | VideoFormData
    | CourseFormData
    | BlogFormData
    | TestFormData
    | CallFormData;

// NEW: Database document interfaces

// Course document in Firestore
export interface CourseDocument {
    id?: string;
    title: string;
    description: string;
    thumbnail: string;
    tiers: number[]; // Array of tier numbers this course belongs to
    lessons: number; // Total number of lessons
    lessonCount: number; // Actual count of uploaded lessons
    createdAt?: any; // Firestore timestamp
    date: string; // ISO date string
    status?: 'pending' | 'complete';
}

// Lesson document in Firestore
export interface LessonDocument {
    id?: string;
    courseId: string; // Reference to parent course
    order: number;
    title: string;
    type: CourseFileType;
    url: string;
    filename: string;
    duration?: number; // Duration for videos in seconds
    createdAt?: any; // Firestore timestamp
}

// Existing item interfaces used in UI components
export interface CourseItem {
    id?: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    tier?: number; 
    tiers?: number[]; // NEW: Array of tier numbers
    lessons?: number;
    lessonData?: CourseLessonData[];
    status?: string;
}

export interface CourseLessonData {
    id: string;
    order: number;
    title: string;
    type: CourseFileType;
    url: string;
    duration?: number;
}