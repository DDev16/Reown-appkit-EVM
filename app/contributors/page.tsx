"use client";
import React, { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from 'react-icons/fa';
import { Creator, creators } from '@/data/creators';

const CreatorCard: React.FC<{ creator: Creator }> = ({ creator }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({
        rotateX: 0,
        rotateY: 0,
        translateZ: 0
    });

    // Mapping for social icons
    const socialIcons = {
        github: FaGithub,
        linkedin: FaLinkedin,
        twitter: FaTwitter,
        discord: FaDiscord
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate rotation based on mouse position
        const rotateX = -(e.clientY - centerY) / 20;
        const rotateY = (e.clientX - centerX) / 20;

        setTransform({
            rotateX,
            rotateY,
            translateZ: 50
        });
    };

    const handleMouseLeave = () => {
        setTransform({
            rotateX: 0,
            rotateY: 0,
            translateZ: 0
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="perspective-600 group relative w-[280px] h-[400px]"
            style={{
                perspective: '600px',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Base Card */}
            <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 transition-shadow duration-300 group-hover:shadow-[0_0_50px_rgba(239,68,68,0.4)]"
                style={{
                    transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out'
                }}
            />

            {/* Elevated Content */}
            <div
                className="relative z-10 h-full w-full"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `
                        rotateX(${transform.rotateX}deg) 
                        rotateY(${transform.rotateY}deg) 
                        translateZ(${transform.translateZ}px)
                    `,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                {/* Card Content Container */}
                <div
                    className="relative p-10 flex flex-col items-center text-center bg-transparent h-full"
                    style={{
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Profile Image */}
                    <div
                        className="relative mb-3 shrink-0 transition-transform duration-300 group-hover:-translate-y-3"
                        style={{
                            transform: 'translateZ(60px)',
                            transition: 'transform 0.3s ease-out'
                        }}
                    >
                        <div
                            className="w-28 h-28 rounded-full overflow-hidden border-4 border-red-500/50 group-hover:border-red-500 transition-all duration-300 bg-zinc-800 flex items-center justify-center"
                            style={{
                                transform: 'translateZ(70px)',
                                transition: 'transform 0.3s ease-out'
                            }}
                        >
                            <img
                                src={creator.image}
                                alt={creator.name}
                                className="w-full h-full object-cover object-center  transition-all duration-300"
                                style={{
                                    transform: 'translateZ(80px)',
                                    transition: 'transform 0.3s ease-out'
                                }}
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <h3
                        className="text-xl font-bold text-white mb-1 transition-all duration-300 group-hover:-translate-y-3 group-hover:text-red-400 line-clamp-1"
                        style={{
                            transform: 'translateZ(90px)',
                            transition: 'transform 0.3s ease-out, color 0.3s ease-out'
                        }}
                    >
                        {creator.name}
                    </h3>

                    {/* Content Type */}
                    <p
                        className="text-red-500 font-medium mb-2 text-sm transition-all duration-300 group-hover:-translate-y-3 group-hover:text-red-400 line-clamp-1"
                        style={{
                            transform: 'translateZ(100px)',
                            transition: 'transform 0.3s ease-out, color 0.3s ease-out'
                        }}
                    >
                        {creator.contentType}
                    </p>

                    {/* Bio */}
                    <p
                        className="text-zinc-400 text-xs mb-3 transition-all duration-300 group-hover:-translate-y-3 group-hover:opacity-100 opacity-80 flex-grow whitespace-pre-wrap"
                        style={{
                            transform: 'translateZ(110px)',
                            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                        }}
                    >
                        {creator.bio}
                    </p>

                    {/* Specialization Label */}
                    {creator.specialization === "DeFi Analytics" ? (
                        <a
                            href="/creators-apply"
                            className="text-green-500 text-sm font-medium mb-3 inline-block transition-all duration-300 group-hover:-translate-y-3"
                            style={{
                                transform: 'translateZ(115px)',
                                transition: 'transform 0.3s ease-out, color 0.3s ease-out'
                            }}
                        >
                            DeFi Analytics Expert
                        </a>
                    ) : creator.specialization === "DeFi Education" ? (
                        <p
                            className="text-blue-500 text-sm font-medium mb-3 inline-block transition-all duration-300 group-hover:-translate-y-3"
                            style={{
                                transform: 'translateZ(115px)',
                                transition: 'transform 0.3s ease-out, color 0.3s ease-out'
                            }}
                        >
                            DeFi Educator
                        </p>
                    ) : (
                        <p
                            className="text-purple-500 text-sm font-medium mb-3 inline-block transition-all duration-300 group-hover:-translate-y-3"
                            style={{
                                transform: 'translateZ(115px)',
                                transition: 'transform 0.3s ease-out, color 0.3s ease-out'
                            }}
                        >
                            {creator.specialization}
                        </p>
                    )}

                    {/* Social Links */}
                    <div
                        className="flex space-x-3 transition-all duration-300 group-hover:-translate-y-1 shrink-0 absolute bottom-20 left-0 right-0 justify-center"
                        style={{
                            transform: 'translateZ(120px)',
                            transition: 'transform 0.3s ease-out'
                        }}
                    >
                        {Object.entries(creator.socials).map(([platform, link]) => {
                            const IconComponent = socialIcons[platform as keyof typeof socialIcons];

                            return link && IconComponent ? (
                                <a
                                    key={platform}
                                    href={link.toString()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-300 hover:text-red-500 transition-colors group/icon"
                                    style={{
                                        transform: 'translateZ(130px)',
                                        transition: 'transform 0.3s ease-out'
                                    }}
                                >
                                    <IconComponent
                                        className="w-5 h-5 group-hover/icon:scale-110 transition-transform"
                                    />
                                </a>
                            ) : null;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContentCreators: React.FC = () => {
    return (
        <div className="min-h-screen text-white py-16 px-4 ">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                        DeFi Content Creators
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        Meet our network of talented content creators who specialize in DeFi education, analysis, and insights.
                        From writers and analysts to video producers and educators, these creators help our community understand the complex world of decentralized finance.
                    </p>
                </div>

                {/* Content Creators Grid */}
                <div className="flex flex-wrap justify-center gap-6">
                    {creators.map((creator: Creator, index: number) => (
                        <CreatorCard
                            key={`${creator.name}-${index}`}
                            creator={creator}
                        />
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <a
                        href="/creators-apply"
                        className="inline-flex items-center px-8 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors group"
                    >
                        Become a Content Creator
                        <ArrowUpRight
                            className="ml-2 group-hover:rotate-45 transition-transform"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContentCreators;