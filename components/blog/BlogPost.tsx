import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, Clock, User, ChevronRight, Heart, Share2, Bookmark } from 'lucide-react';
import {
    Alert,
    AlertDescription
} from "@/components/ui/alert";
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

interface BlogPostProps {
    post: BlogPostType;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [showShareAlert, setShowShareAlert] = useState<boolean>(false);

    const formatDate = (timestamp: Timestamp): string => {
        return format(timestamp.toDate(), 'MMMM dd, yyyy');
    };

    const handleShare = async (): Promise<void> => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.content.substring(0, 100) + '...',
                    url: window.location.href,
                });
            } catch (error) {
                setShowShareAlert(true);
            }
        } else {
            setShowShareAlert(true);
            await navigator.clipboard.writeText(window.location.href);
        }
        setTimeout(() => setShowShareAlert(false), 3000);
    };

    const handleReadMore = () => {
        router.push(`/blog/${post.id}`);
    };

    // Truncate content for preview (shorter for grid layout)
    const previewContent = post.content.split('\n')[0].substring(0, 150) + '...';

    return (
        <div className="h-full w-full">
            {showShareAlert && (
                <Alert className="fixed top-4 right-4 z-50 bg-green-500/10 text-green-400 border-green-500/20">
                    <AlertDescription>
                        Link copied to clipboard!
                    </AlertDescription>
                </Alert>
            )}

            <article className="group h-full relative bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-800 
                              overflow-hidden transition-all duration-500 hover:border-red-500/30 flex flex-col">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-red-500/5 
                              opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-red-500 
                              opacity-0 group-hover:opacity-10 blur-lg transition-all duration-500" />

                {/* Featured Image */}
                {post.imageUrl && (
                    <div className="relative aspect-video overflow-hidden bg-black cursor-pointer"
                        onClick={handleReadMore}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10" />
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full bg-black object-contain transform group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Content Container */}
                <div className="relative p-4 flex-grow bg-black/90 backdrop-blur-lg flex flex-col">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags.map((tag: string, index: number) => (
                                <span key={index}
                                    className="px-2 py-0.5 text-xs bg-red-500/10 text-red-400 
                                             rounded-full border border-red-500/20 hover:bg-red-500/20 
                                             cursor-pointer transition-all duration-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 
                                 bg-clip-text text-transparent mb-2 group-hover:from-rose-500 
                                 group-hover:to-red-500 transition-all duration-500 cursor-pointer 
                                 line-clamp-2"
                        onClick={handleReadMore}>
                        {post.title}
                    </h2>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.createdAt)}</span>
                        </div>
                        {post.readTime && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{post.readTime} min read</span>
                            </div>
                        )}
                    </div>

                    {/* Preview Content */}
                    <div className="prose prose-invert max-w-none flex-grow">
                        <p className="text-xs text-gray-400 leading-relaxed mb-4 
                                    group-hover:text-gray-300 transition-colors duration-500
                                    line-clamp-3">
                            {previewContent}
                        </p>
                    </div>

                    {/* Engagement Actions */}
                    <div className="mt-auto pt-3 border-t border-red-500/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`flex items-center gap-1 text-xs transition-colors duration-300
                                              ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                                </button> */}
                                {/* <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-500 
                                             transition-colors duration-300"
                                >
                                    <Share2 className="w-3 h-3" />
                                    <span>Share</span>
                                </button> */}
                            </div>
                            {/* 
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`flex items-center gap-1 text-xs transition-colors duration-300
                                          ${isBookmarked ? 'text-purple-500' : 'text-gray-400 hover:text-purple-500'}`}
                            >
                                <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-current' : ''}`} />
                                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                            </button> */}
                        </div>

                        {/* Read More Link */}
                        <button
                            onClick={handleReadMore}
                            className="mt-3 flex items-center gap-1 text-xs text-rose-500 hover:text-red-400 
                                     transition-colors duration-300">
                            Read More
                            <ChevronRight className="w-3 h-3 transform group-hover:translate-x-1 
                                                   transition-transform duration-500" />
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;