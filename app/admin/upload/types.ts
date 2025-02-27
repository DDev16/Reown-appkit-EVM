// Content types
export type ContentType = 'videos' | 'courses' | 'blogs' | 'tests' | 'calls';
export type TestDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface UploadStatus {
    isUploading: boolean;
    progress: number;
    error: string | null;
    success: boolean;
    fileUrl: string | null;
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

// Content-specific form data
export interface VideoFormData extends BaseContentFormData {
    contentFile: File | null;
    duration: string;
}

export interface CourseFormData extends BaseContentFormData {
    numLessons: string;
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