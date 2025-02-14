import { Timestamp } from 'firebase/firestore';

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    tags?: string[];
    createdAt: Timestamp;
    readTime?: number;
    authorEmail?: string;
}

export interface SerializedBlogPost {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    tags?: string[];
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    readTime?: number;
    authorEmail?: string;
}

export interface BlogFormData {
    title: string;
    content: string;
    image: File | null;
}

export interface AlertState {
    type: 'success' | 'error' | '';
    message: string;
}