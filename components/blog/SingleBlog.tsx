'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, Clock, User, ArrowLeft, Heart, Share2, Bookmark, MessageSquare } from 'lucide-react';
import {
    Alert,
    AlertDescription
} from "@/components/ui/alert";

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

interface SingleBlogProps {
    post: BlogPost;
}

const SingleBlog: React.FC<SingleBlogProps> = ({ post }) => {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [showShareAlert, setShowShareAlert] = useState<boolean>(false);

    const formatDate = (timestamp: { seconds: number; nanoseconds: number }): string => {
        const date = new Date(timestamp.seconds * 1000);
        return format(date, 'MMMM dd, yyyy');
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

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {showShareAlert && (
                <Alert className="bg-green-500/10 text-green-400 border-green-500/20">
                    <AlertDescription>
                        Link copied to clipboard!
                    </AlertDescription>
                </Alert>
            )}

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 mb-8 transition-colors duration-300"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Blog</span>
            </button>

            <article className="bg-black/90 backdrop-blur-lg rounded-2xl border border-gray-800 overflow-hidden">
                {/* Featured Image */}
                {post.imageUrl && (
                    <div className="relative w-full h-96 overflow-hidden bg-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10" />
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="p-8">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag: string, index: number) => (
                                <span key={index}
                                    className="px-3 py-1 text-sm bg-red-500/10 text-red-400 
                                             rounded-full border border-red-500/20 hover:bg-red-500/20 
                                             cursor-pointer transition-all duration-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 
                                 bg-clip-text text-transparent mb-6">
                        {post.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.createdAt)}</span>
                        </div>
                        {post.readTime && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime} min read</span>
                            </div>
                        )}
                        {post.authorEmail && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{post.authorEmail}</span>
                            </div>
                        )}
                    </div>

                    {/* Full Content */}
                    <div className="prose prose-invert max-w-none">
                        {post.content.split('\n').map((paragraph: string, index: number) => (
                            <p key={index} className="text-gray-300 leading-relaxed mb-6">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Engagement Actions */}
                    <div className="mt-12 pt-6 border-t border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`flex items-center gap-2 transition-colors duration-300
                                              ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                                </button>
                                <button
                                    className="flex items-center gap-2 text-gray-400 hover:text-blue-500 
                                             transition-colors duration-300"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    <span>Comment</span>
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 text-gray-400 hover:text-green-500 
                                             transition-colors duration-300"
                                >
                                    <Share2 className="w-5 h-5" />
                                    <span>Share</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`flex items-center gap-2 transition-colors duration-300
                                          ${isBookmarked ? 'text-purple-500' : 'text-gray-400 hover:text-purple-500'}`}
                            >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default SingleBlog;