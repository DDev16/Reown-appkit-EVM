"use client";
import { useEffect } from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface RoadmapPhase {
    quarter: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    items: string[];
}

const Roadmap = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const phases: RoadmapPhase[] = [
        {
            quarter: "Q1 2025",
            title: "Platform Launch Phase",
            description: "Initial platform features and educational content",
            status: "completed",
            items: [
                "NFT Launch (Feb 28)",
                "Web3 Platform Launch (March 15)",
                "General Blog and First Courses (March 31)"
            ]
        },
        {
            quarter: "Q2 2025",
            title: "Growth & Features Phase",
            description: "Expanding educational offerings and platform features",
            status: "current",
            items: [
                "Tier Specific Courses Launch (April 15)",
                "Platform Revenue Distribution (May 15)",
                "Sweepstakes Launch (May 30)",
                "Fassets Liquidator Launch (June 15)"
            ]
        },
        {
            quarter: "Q3-Q4 2025",
            title: "Revenue Expansion Phase",
            description: "Platform scaling and revenue optimization",
            status: "upcoming",
            items: [
                "FTSO Launch",
                "New Revenue Streams Implementation",
                "Platform Optimization",
                "Ecosystem Expansion"
            ]
        }
    ];

    const getStatusColor = (status: RoadmapPhase['status']) => {
        switch (status) {
            case 'completed':
                return 'from-[#BC1A1E] to-[#FF4B51]';
            case 'current':
                return 'from-[#FF4B51] to-[#FF8F93]';
            default:
                return 'from-gray-700 to-gray-600';
        }
    };

    const getStatusIcon = (status: RoadmapPhase['status']) => {
        switch (status) {
            case 'completed':
                return <Check className="w-6 h-6" />;
            case 'current':
                return <Sparkles className="w-6 h-6" />;
            default:
                return <Clock className="w-6 h-6" />;
        }
    };

    return (
        <section className="py-24 relative overflow-hidden">
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
                    {phases.map((_, index) => (
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
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/0 via-black/0 to-transparent z-10 opacity-70" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Title */}
                <div className="text-center mb-20 relative" data-aos="fade-down">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 blur-[10px] scale-110">
                            <h2 className="text-[#BC1A1E] text-5xl font-bold">Defi Bull World Roadmap 2025</h2>
                        </div>
                        <h2 className="text-5xl font-bold text-white relative">
                            Defi Bull World Roadmap 2025
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent animate-pulse"></div>
                        </h2>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Our strategic journey towards revolutionizing DeFi education
                    </p>
                </div>

                {/* Rest of the component remains the same */}
                {/* Roadmap Timeline */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-[#BC1A1E] via-[#FF4B51] to-transparent"></div>

                    {/* Phases */}
                    <div className="space-y-24">
                        {phases.map((phase, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                            >
                                {/* Content Box */}
                                <div className={`w-full md:w-[calc(50%-2rem)] relative group ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                                    {/* Phase Card */}
                                    <div className="relative">
                                        {/* Glowing Border */}
                                        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>

                                        <div className="relative rounded-2xl bg-black/90 p-8 backdrop-blur-sm border border-[#BC1A1E]/20">
                                            {/* Quarter Badge */}
                                            <div className="absolute top-0 transform -translate-y-1/2 left-8">
                                                <div className={`bg-gradient-to-r ${getStatusColor(phase.status)} px-4 py-1 rounded-full shadow-lg flex items-center gap-2`}>
                                                    {getStatusIcon(phase.status)}
                                                    <span className="text-white font-bold">{phase.quarter}</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="mt-6">
                                                <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>
                                                <p className="text-gray-400 mb-6">{phase.description}</p>

                                                {/* Items */}
                                                <ul className="space-y-3">
                                                    {phase.items.map((item, itemIndex) => (
                                                        <li
                                                            key={itemIndex}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <div className={`p-0.5 rounded-full bg-gradient-to-r ${getStatusColor(phase.status)} shadow-lg`}>
                                                                <div className="bg-black rounded-full p-1">
                                                                    <Check className="w-3 h-3 text-white" />
                                                                </div>
                                                            </div>
                                                            <span className="text-gray-300">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Connector */}
                                    <div className={`absolute top-1/2 ${index % 2 === 0 ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} transform -translate-y-1/2 flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} w-8`}>
                                        <div className="flex-1 h-px bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51]"></div>
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] shadow-[0_0_10px_rgba(188,26,30,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
        </section>
    );
};

export default Roadmap;