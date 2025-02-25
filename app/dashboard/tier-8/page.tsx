// app/dashboard/tier-1/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Play, Download, Lock } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import CONTRACT_ABI from '@/lib/contract-abi.json';

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");

const TIER_8 = 7;

export default function Tier1Page() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Get connected wallet
    const { address } = useAccount();

    // Read contract to check if user has the token
    const { data: tierBalance } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'balanceOf',
        args: [address!, TIER_8],
        query: {
            enabled: true,
        },
    });

    useEffect(() => {
        if (tierBalance !== undefined) {
            // User is authorized if they have at least 1 token of TIER_8
            setIsAuthorized(Number(tierBalance) > 0);
            setIsLoading(false);
        }
    }, [tierBalance]);

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-t-2 border-red-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400">Verifying membership...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Lock className="w-16 h-16 mx-auto text-red-600" />
                    <h2 className="text-2xl font-bold">Access Required</h2>
                    <p className="text-gray-400">
                        You need to hold the Tier 8 token to access this content
                    </p>
                    <div className="space-y-2">
                        <button className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                            Purchase Tier 8 Membership
                        </button>
                        <p className="text-sm text-gray-500">
                            Already own a Tier 8 NFT? Make sure it&apos;s in your connected wallet.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-red-900/30 pb-6">
                <h1 className="text-3xl font-bold">Tier 8 - Foundation</h1>
                <p className="text-gray-400 mt-2">
                    Master the fundamentals of trading and market analysis with our comprehensive beginner-friendly content.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-black/50 border border-red-900/30 rounded-xl p-6 hover:border-red-600/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Getting Started</h3>
                        <BookOpen className="text-red-600" />
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Play size={16} className="mr-2 text-red-600" />
                            Introduction to Trading
                        </li>
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Play size={16} className="mr-2 text-red-600" />
                            Basic Market Analysis
                        </li>
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Play size={16} className="mr-2 text-red-600" />
                            Understanding Risk
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
                            Beginner&apos;s Guide PDF
                        </li>
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Download size={16} className="mr-2 text-red-600" />
                            Trading Glossary
                        </li>
                        <li className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <Download size={16} className="mr-2 text-red-600" />
                            Practice Worksheets
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}