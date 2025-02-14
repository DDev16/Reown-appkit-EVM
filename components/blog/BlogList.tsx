"use client";
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where, limit, startAfter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BlogPost from './BlogPost';
import { Search, Filter, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BlogPost as BlogPostType } from '@/types/blog';
import BlogHeader from './BlogHeader';

const POSTS_PER_PAGE = 6;

const BlogList = () => {
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchPosts = async (isInitial = true) => {
        try {
            setLoadingMore(!isInitial);
            let q = query(
                collection(db, 'posts'),
                orderBy('createdAt', sortBy === 'newest' ? 'desc' : 'asc'),
                limit(POSTS_PER_PAGE)
            );

            if (!isInitial && lastVisible) {
                q = query(
                    collection(db, 'posts'),
                    orderBy('createdAt', sortBy === 'newest' ? 'desc' : 'asc'),
                    startAfter(lastVisible),
                    limit(POSTS_PER_PAGE)
                );
            }

            if (selectedTag !== 'all') {
                q = query(q, where('tags', 'array-contains', selectedTag));
            }

            const querySnapshot = await getDocs(q);
            const fetchedPosts = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt
                } as BlogPostType;
            });

            if (isInitial) {
                const allTags = new Set<string>();
                fetchedPosts.forEach(post => {
                    post.tags?.forEach(tag => allTags.add(tag));
                });
                setAvailableTags(Array.from(allTags));
            }

            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
            setHasMore(querySnapshot.docs.length === POSTS_PER_PAGE);

            if (isInitial) {
                setPosts(fetchedPosts);
            } else {
                setPosts(prev => [...prev, ...fetchedPosts]);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load blog posts');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setPosts([]);
        setLastVisible(null);
        fetchPosts();
    }, [selectedTag, sortBy]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-800/50 rounded-xl p-6 animate-pulse"
                        >
                            <div className="aspect-video bg-gray-700 rounded-lg mb-4"></div>
                            <div className="h-6 bg-gray-700 rounded-lg w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-red-500 text-xl">{error}</p>
                    <Button
                        onClick={() => fetchPosts()}
                        variant="ghost"
                        className="hover:bg-gray-800"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    const LoadingSpinner = () => (
        <div className="col-span-full flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header and Filters */}
            <div className="space-y-6 mb-8">
                <BlogHeader
                    title="Blog Posts"
                    subtitle="Discover our latest articles and insights" // Optional
                />
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex gap-2 text-white">
                        <Select
                            value={selectedTag}
                            onValueChange={setSelectedTag}
                        >
                            <SelectTrigger className="w-[140px] [&>span]:text-white">
                                <SelectValue placeholder="Filter by tag" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tags</SelectItem>
                                {availableTags.map(tag => (
                                    <SelectItem key={tag} value={tag}>
                                        {tag}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setSortBy('newest')}
                                    className={sortBy === 'newest' ? 'bg-red-500/10' : ''}
                                >
                                    Newest First
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setSortBy('oldest')}
                                    className={sortBy === 'oldest' ? 'bg-red-500/10' : ''}
                                >
                                    Oldest First
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                    <>
                        {filteredPosts.map(post => (
                            <BlogPost key={post.id} post={post} />
                        ))}
                    </>
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400 text-lg">
                            {searchQuery
                                ? "No posts found matching your search."
                                : "No blog posts available."}
                        </p>
                    </div>
                )}

                {loadingMore && <LoadingSpinner />}
            </div>

            {/* Load More Button */}
            {hasMore && !searchQuery && (
                <div className="flex justify-center mt-8">
                    <Button
                        onClick={() => fetchPosts(false)}
                        disabled={loadingMore}
                        variant="ghost"
                        className="w-full sm:w-auto hover:bg-gray-800"
                    >
                        {loadingMore ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Load More Posts
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BlogList;