// BlogCard.tsx
'use client';

import { BookOpen } from 'lucide-react';
import { BlogItem } from '@/types/types';
import { formatDate } from '@/utils/formatters';

interface BlogCardProps {
    blog: BlogItem;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    return (
        <div className="bg-black/30 rounded-lg overflow-hidden border border-red-900/20 hover:border-red-600/40 transition-colors">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/5">
                    <img
                        src={blog.thumbnail || "/placeholder-thumbnail.jpg"}
                        alt={blog.title || "Blog thumbnail"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-thumbnail.jpg";
                        }}
                    />
                </div>
                <div className="p-4 md:w-4/5">
                    <h3 className="font-semibold text-white">{blog.title || "Untitled Blog"}</h3>
                    <p className="text-gray-400 text-sm mt-1">{blog.description || "No description available"}</p>

                    <div className="flex flex-wrap gap-3 justify-between items-center mt-3">
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                            <span>{blog.author || "Unknown Author"}</span>
                            <span>•</span>
                            <span>{formatDate(blog.date)}</span>
                            <span>•</span>
                            <span>{blog.readTime || 5} min read</span>
                        </div>

                        <button className="text-xs bg-red-900/30 hover:bg-red-900/50 text-white px-3 py-1 rounded flex items-center">
                            <BookOpen size={14} className="mr-1" />
                            Read Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};