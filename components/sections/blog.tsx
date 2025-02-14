"use client";

import { ArrowRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const BlogPreview: React.FC = () => {
    const blogPosts = [
        {
            title: "Understanding DeFi Fundamentals",
            excerpt: "Learn the basic concepts of decentralized finance and how it's revolutionizing traditional banking.",
            date: "Jan 28, 2025",
            readTime: "5 min read",
            image: "/placeholder/600/400",
            category: "Blockchain"
        },
        {
            title: "Advanced NFT Trading Strategies",
            excerpt: "Discover proven strategies for trading NFTs and maximizing your returns in the digital asset market.",
            date: "Jan 25, 2025",
            readTime: "7 min read",
            image: "/placeholder/600/400",
            category: "NFT"
        },
        {
            title: "The Future of Web3 Education",
            excerpt: "Explore how blockchain technology is transforming educational systems and creating new opportunities.",
            date: "Jan 22, 2025",
            readTime: "6 min read",
            image: "/placeholder/600/400",
            category: "Education"
        }
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background grid pattern */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                            linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                />

                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px]">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2"></div>
                    </div>
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section with glow effect */}
                <div className="text-center mb-20 relative" data-aos="fade-down">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 blur-[10px] scale-110">
                            <h2 className="text-[#BC1A1E] text-5xl font-bold">Latest Insights</h2>
                        </div>
                        <h2 className="text-5xl font-bold text-white relative">
                            Latest Insights
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent animate-pulse"></div>
                        </h2>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Dive deep into cutting-edge trends and transformative insights in the Web3 ecosystem.
                    </p>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <article
                            key={index}
                            className="group relative"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            {/* Glow border */}
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>

                            {/* Inner glow */}
                            <div className="absolute inset-[1px] rounded-xl opacity-0 group-hover:opacity-20 bg-gradient-to-b from-[#BC1A1E] to-transparent transition-opacity duration-500 blur-xl"></div>

                            {/* Content */}
                            <div className="relative rounded-xl p-6 backdrop-blur-sm border border-[#BC1A1E]/20 bg-black/90">
                                {/* Image Container */}
                                <div className="relative h-56 rounded-lg overflow-hidden mb-6">
                                    <div className="absolute inset-0 bg-[#242223] flex items-center justify-center">
                                        <span className="text-gray-400">Placeholder {index + 1}</span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] p-[1px] rounded-full">
                                            <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                                                <span className="text-xs font-medium text-white">{post.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center text-sm text-gray-400 space-x-2">
                                        <span>{post.date}</span>
                                        <span className="text-[#BC1A1E]">•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-[#BC1A1E] transition-colors duration-300">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-400 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-4">
                                        <button className="flex items-center text-[#BC1A1E] hover:text-[#FF4B51] font-semibold transition-colors duration-300 group/btn">
                                            <span>Read More</span>
                                            <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-16 text-center">
                    <button className="group relative px-8 py-4 font-semibold">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-lg blur-md transition-all duration-500 group-hover:blur-lg" />
                        <span className="relative bg-black block rounded-lg px-8 py-4 text-white transition-colors duration-300 group-hover:bg-black/80">
                            View All Posts
                            <ChevronRight className="inline-block ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes flow-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                    50% { transform: translate(-30px, 30px) scale(1.1); opacity: 0.3; }
                }
                @keyframes flow-2 {
                    0%, 100% { transform: translate(0, 0) scale(1.1); opacity: 0.15; }
                    50% { transform: translate(30px, -30px) scale(1); opacity: 0.25; }
                }
                
                .animate-flow-1 {
                    animation: flow-1 10s ease-in-out infinite;
                }
                .animate-flow-2 {
                    animation: flow-2 10s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default BlogPreview;