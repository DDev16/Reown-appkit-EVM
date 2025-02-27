// BlogSection.tsx
'use client';

import { BookOpen } from 'lucide-react';
import { BlogItem } from '@/types/types';
import { ContentSectionHeader } from '@/components/dashboard/ui/ContentSectionHeader';
import { BlogCard } from '@/components/dashboard/blogs/BlogCard';

interface BlogSectionProps {
    blogs: BlogItem[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs }) => {
    return (
        <div className="mb-8">
            <ContentSectionHeader
                title="Latest Blogs"
                viewAllLink="/dashboard/tier-1/blogs"
                icon={<BookOpen className="ml-1 w-4 h-4" />}
            />

            <div className="grid grid-cols-1 gap-4">
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))
                ) : (
                    <div className="text-center py-8 bg-black/20 rounded-lg">
                        <p className="text-gray-400">No blogs available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};