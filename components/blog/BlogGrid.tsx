import React from 'react';
import BlogPost from './BlogPost';
import { Timestamp } from 'firebase/firestore';

interface BlogPostType {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    tags?: string[];
    createdAt: Timestamp;
    readTime?: number;
    authorEmail?: string;
}

interface BlogGridProps {
    posts: BlogPostType[];
}

const BlogGrid: React.FC<BlogGridProps> = ({ posts }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <BlogPost key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default BlogGrid;