'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Play, Download, Lock } from 'lucide-react';

interface TierPageProps {
    tier: number;
    title: string;
    description: string;
}

export default function TierPage({ tier, title, description }: TierPageProps) {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // TODO: Add token verification logic here
        // This should check if the user has the required NFT/token for this tier
        setIsAuthorized(true); // Temporarily set to true for development
    }, [tier]);

    if (!isAuthorized) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Lock className="w-16 h-16 mx-auto text-red-600" />
                    <h2 className="text-2xl font-bold">Access Required</h2>
                    <p className="text-gray-400">
                        You need to hold the required tokens to access {title}
                    </p>
                    <button className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-red-900/30 pb-6">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-gray-400 mt-2">{description}</p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example content items - customize these based on tier content */}
                <div className="bg-black/50 border border-red-900/30 rounded-xl p-6 hover:border-red-600/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Educational Content</h3>
                        <BookOpen className="text-red-600" />
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Play size={16} className="mr-2 text-red-600" />
                            Introduction to Trading
                        </li>
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Play size={16} className="mr-2 text-red-600" />
                            Market Analysis Basics
                        </li>
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Play size={16} className="mr-2 text-red-600" />
                            Risk Management
                        </li>
                    </ul>
                </div>

                <div className="bg-black/50 border border-red-900/30 rounded-xl p-6 hover:border-red-600/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Resources</h3>
                        <Download className="text-red-600" />
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Download size={16} className="mr-2 text-red-600" />
                            Trading Checklist
                        </li>
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Download size={16} className="mr-2 text-red-600" />
                            Analysis Templates
                        </li>
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Download size={16} className="mr-2 text-red-600" />
                            Strategy Guide
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}