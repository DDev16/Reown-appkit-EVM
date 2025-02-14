// app/blog/[id]/page.tsx
import { Suspense } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SingleBlog from '@/components/blog/SingleBlog';
import { notFound } from 'next/navigation';

interface BlogPost {
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

async function getBlogPost(id: string) {
    try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();

        return {
            id: docSnap.id,
            ...data,
            createdAt: {
                seconds: data.createdAt.seconds,
                nanoseconds: data.createdAt.nanoseconds
            }
        } as BlogPost;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

// After
export default async function BlogPage({ params }: { params: any }) {
    const post = await getBlogPost(params.id);
    if (!post) {
        notFound();
    }
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
            }
        >
            <SingleBlog post={post} />
        </Suspense>
    );
}
