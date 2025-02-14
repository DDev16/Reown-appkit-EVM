"use client";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Stats = () => {
    const stats = [
        {
            value: "10K+",
            label: "Active Users",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            ),
            animation: "fade-right",
        },
        {
            value: "50+",
            label: "Expert Courses",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            animation: "fade-up",
        },
        {
            value: "24/7",
            label: "Community Support",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            animation: "fade-up",
        },
        {
            value: "100%",
            label: "Secure Platform",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 3L20 7V11C20 15.4183 16.4183 19 12 19C7.58172 19 4 15.4183 4 11V7L12 3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M15 10L11 14L9 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            animation: "fade-left",
        },
    ];

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
            offset: 100,
        });
    }, []);

    return (
        <div className="relative py-24">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Base Layer */}
                <div className="absolute inset-0" />
                {/* Animated Shapes */}
                <div className="absolute inset-0">
                    {/* Red Glow Orbs */}
                    <div className="absolute top-24 left-1/4 w-72 h-40 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute top-24 right-1/4 w-96 h-40 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000" />

                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(#BC1A1E 1px, transparent 1px)`,
                            backgroundSize: '50px 50px',
                        }}
                    />

                    {/* Moving Lines */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute h-full w-1/3 bg-gradient-to-b from-transparent via-[#BC1A1E]/10 to-transparent animate-moving-lines transform -skew-x-12" />
                        <div className="absolute h-full w-1/3 left-2/3 bg-gradient-to-b from-transparent via-[#BC1A1E]/10 to-transparent animate-moving-lines delay-1000 transform -skew-x-12" />
                    </div>

                    {/* Noise Texture */}
                    <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-30 mix-blend-soft-light" />
                </div>
            </div>

            {/* Stats Content */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative"
                        data-aos={stat.animation}
                        data-aos-delay={index * 100}
                    >
                        <div className="relative p-8 rounded-2xl border border-[#BC1A1E]/30 bg-black/40 backdrop-blur-md transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_8px_20px_rgba(188,26,29,0.5)]">
                            {/* Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700" />
                            {/* Content */}
                            <div className="relative flex flex-col items-center space-y-4">
                                <div className="text-[#BC1A1E] transform group-hover:scale-110 transition-transform duration-500">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-300">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes moving-lines {
          0% {
            transform: translateY(-100%) skewX(-12deg);
          }
          100% {
            transform: translateY(100%) skewX(-12deg);
          }
        }
        .animate-moving-lines {
          animation: moving-lines 8s linear infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
        </div>
    );
};

export default Stats;
