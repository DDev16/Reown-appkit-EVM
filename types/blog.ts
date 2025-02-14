// types/blog.ts
import { Timestamp } from 'firebase/firestore';

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    tags?: string[];
    createdAt: Timestamp;
    readTime?: number;
    authorAddress?: string;  // Changed from authorEmail
    authorId?: string;       
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
    authorAddress?: string;  // Changed from authorEmail
    authorId?: string;       // Wallet address that created the post
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