"use client";
import { useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const RoadmapComingSoon = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const placeholderPhases = [1, 2, 3, 4];

    return (
        <div className="py-24 relative overflow-hidden">
            {/* Background Elements */}
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

                {/* Animated Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {placeholderPhases.map((_, index) => (
                        <div
                            key={index}
                            className={`absolute w-96 h-96 transition-all duration-1000 ease-in-out
                                ${index % 2 === 0 ? 'left-0 md:left-1/4' : 'right-0 md:right-1/4'}
                                ${index === 0 ? 'top-[10%]' :
                                    index === 1 ? 'top-[35%]' :
                                        index === 2 ? 'top-[55%]' : 'top-[75%]'}`}
                        >
                            <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                            <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2 delay-75"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/0 to-transparent z-10 opacity-70" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Title */}
                <div className="text-center mb-20 relative" data-aos="fade-down">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 blur-[10px] scale-110">
                            <h2 className="text-[#BC1A1E] text-5xl font-bold">Roadmap</h2>
                        </div>
                        <h2 className="text-5xl font-bold text-white relative">
                            Roadmap
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent animate-pulse"></div>
                        </h2>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Our strategic journey is being crafted. Stay tuned for updates!
                    </p>
                </div>

                {/* Coming Soon Message */}
                <div className="relative">
                    <div className="relative mx-auto max-w-2xl">
                        <div className="relative">
                            {/* Glowing Border */}
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>

                            <div className="relative rounded-2xl bg-black/90 p-8 backdrop-blur-sm border border-[#BC1A1E]/20 text-center">
                                <div className="flex justify-center mb-6">
                                    <Sparkles className="w-16 h-16 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Roadmap Coming Soon</h3>
                                <p className="text-gray-400 mb-6">
                                    We&quot;re carefully planning our journey to ensure we deliver the best possible experience for our community. Our comprehensive roadmap will be revealed shortly.
                                </p>
                                <div className="flex justify-center">
                                    <Clock className="w-8 h-8 text-red-500 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
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
        </div>
    );
};

export default RoadmapComingSoon;