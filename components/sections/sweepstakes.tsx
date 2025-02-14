import React, { type HTMLAttributes } from 'react';
import { Timer } from 'lucide-react';

const ComingSoonCard = () => (
    <div className="group relative">
        <div className="relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>
            <div className="block relative rounded-2xl bg-black/90 p-6 backdrop-blur-sm border border-[#BC1A1E]/20 hover:border-[#BC1A1E]/40 transition-all duration-300">
                <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-black/50 flex items-center justify-center">
                    <Timer className="w-16 h-16 text-red-500" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Coming Soon</h3>
                    </div>
                    <p className="text-gray-400">Exciting sweepstakes opportunities are on the way. Stay tuned!</p>
                </div>
            </div>
        </div>
    </div>
);

const SweepstakesComingSoon: React.FC = () => {
    return (
        <div className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                            linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] animate-pulse delay-700" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative inline-block">
                        Our Sweepstakes
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Get ready for exciting opportunities with our upcoming sweepstakes program
                    </p>
                </div>

                {/* Main Grid Layout */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid gap-8">
                        {/* Top Row - 3 Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <ComingSoonCard />
                                </div>
                            ))}
                        </div>

                        {/* Bottom Row - 2 Cards Centered */}
                        <div className="flex justify-center gap-8 flex-wrap md:flex-nowrap">
                            {[...Array(2)].map((_, index) => (
                                <div key={index} className="w-full md:w-1/3">
                                    <ComingSoonCard />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SweepstakesComingSoon;