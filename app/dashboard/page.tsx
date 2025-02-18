'use client';

import {
    LineChart,
    Wallet,
    Trophy,
    LockKeyhole,
    ChevronRight,
    Sparkles,
    Crown,
    Shield,
    Rocket,
    Star,
    Diamond,
    Gem,
    CloudLightning,
    Gift
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import Link from 'next/link';
import { ReferralButton } from '@/components/sales/ReferralButton';
import Image from 'next/image';

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");

// Referral-related contract ABI functions
const REFERRAL_ABI = [
    {
        name: "getReferrer",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [{ name: "referrer", type: "address" }]
    },
    {
        name: "getTotalReferrals",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "referrer", type: "address" }],
        outputs: [{ name: "totalReferrals", type: "uint256" }]
    },
    {
        name: "getTotalReferralRewards",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "referrer", type: "address" }],
        outputs: [{ name: "totalRewards", type: "uint256" }]
    }
];

const MEMBERSHIP_TIERS = [
    {
        id: 1,
        name: 'Top Tier',
        tier: 'Tier 1',
        description: 'The ultimate experience/exclusive access & premium benefits',
        path: '/dashboard/tier-1',
        color: 'from-[#d4af37] via-[#d4af37] to-[#b3941f]',
        icon: '/tier-icons/DBW-icon.png',
        highlighted: true,
        subtitle: 'Exclusive Tier'
    },
    {
        id: 2,
        name: 'RHODIUM',
        tier: 'Tier 2',
        description: 'Premium access to advanced features and dedicated support',
        path: '/dashboard/tier-2',
        color: 'from-[#00bf63] via-[#00bf63] to-[#009e52]',
        icon: '/tier-icons/Rh-icon.png',
        subtitle: 'Premium Tier'
    },
    {
        id: 3,
        name: 'PLATINUM',
        tier: 'Tier 3',
        description: 'Elite membership with enhanced capabilities and priority access',
        path: '/dashboard/tier-3',
        color: 'from-[#ff8018] via-[#ff8018] to-[#e67216]',
        icon: '/tier-icons/Pt-icon.png',
        subtitle: 'Elite Tier'
    },
    {
        id: 4,
        name: 'GOLD',
        tier: 'Tier 4',
        description: 'Professional grade features with advanced trading capabilities',
        path: '/dashboard/tier-4',
        color: 'from-[#d4af37] via-[#d4af37] to-[#b3941f]',
        icon: '/tier-icons/Au-icon.png',
        subtitle: 'Pro Tier'
    },
    {
        id: 5,
        name: 'RUTHENIUM',
        tier: 'Tier 5',
        description: 'Advanced tools and features for serious traders',
        path: '/dashboard/tier-5',
        color: 'from-[#f6cefc] via-[#f6cefc] to-[#eab5f1]',
        icon: '/tier-icons/Ru-icon.png',
        subtitle: 'Advanced Tier'
    },
    {
        id: 6,
        name: 'IRIDIUM',
        tier: 'Tier 6',
        description: 'Perfect starting point for your DBW journey',
        path: '/dashboard/tier-6',
        color: 'from-[#BC1A1E] via-[#BC1A1E] to-[#8B1315]',
        icon: '/tier-icons/Ir-icon.png',
        subtitle: 'Starter Tier'
    },
    {
        id: 7,
        name: 'OSMIUM',
        tier: 'Tier 7',
        description: 'Essential features to begin your DBW experience',
        path: '/dashboard/tier-7',
        color: 'from-[#0099CC] via-[#0099CC] to-[#007399]',
        icon: '/tier-icons/Os-icon.png',
        subtitle: 'Entry Tier'
    },
    {
        id: 8,
        name: 'PALLADIUM',
        tier: 'Tier 8',
        description: 'Basic access to fundamental DBW features + more',
        path: '/dashboard/tier-8',
        color: 'from-[#2ECC71] via-[#2ECC71] to-[#27AE60]',
        icon: '/tier-icons/Pd-icon.png',
        subtitle: 'Advanced Tier'
    },
    {
        id: 9,
        name: 'RHENIUM',
        tier: 'Tier 9',
        description: 'Basic access to fundamental DBW features',
        path: '/dashboard/tier-9',
        color: 'from-[#FFD700] via-[#FFD700] to-[#FFC000]',
        icon: '/tier-icons/Re-icon.png',
        subtitle: 'Basic Tier'
    }
];

export default function DashboardPage() {
    // Get user's connected wallet address
    const { address, isConnected } = useAccount();

    // Read contract for referral data
    const { data: totalReferralsData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'getTotalReferrals',
        args: isConnected ? [address] : ['0x0000000000000000000000000000000000000000'],
    });

    const { data: totalRewardsData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'getTotalReferralRewards',
        args: isConnected ? [address] : ['0x0000000000000000000000000000000000000000'],
    });

    // Convert BigInt to readable format
    const totalReferrals = isConnected && totalReferralsData
        ? Number(totalReferralsData)
        : 0;

    const totalRewards = isConnected && totalRewardsData
        ? Number(totalRewardsData) / 1e18 // Assuming rewards are in wei
        : 0;

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-red-950 to-black p-6 border border-red-900/30">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        Welcome to DeFiBullWorld
                    </h1>
                    <p className="mt-2 text-gray-400 max-w-2xl">
                        Access exclusive trading education, market insights, and professional strategies through our tiered membership system.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 blur-3xl" />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Basic Stats */}
                <div className="group relative bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-400 font-medium">Active Membership</h3>
                        <div className="text-red-600 group-hover:scale-110 transition-transform">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">None</p>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">Current tier</p>
                        <p className="text-sm text-gray-500">No active tier</p>
                    </div>
                </div>

                <div className="group relative bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-400 font-medium">Achievements</h3>
                        <div className="text-red-600 group-hover:scale-110 transition-transform">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">Completed lessons</p>
                        <p className="text-sm text-gray-500">0 pending</p>
                    </div>
                </div>

                {/* Token Rewards */}
                <div className="group relative bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-400 font-medium">ERC20 Rewards</h3>
                        <div className="text-red-600 group-hover:scale-110 transition-transform">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">DBW Token</span>
                            <span className="text-lg font-semibold text-white">0.00</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">BULL Token</span>
                            <span className="text-lg font-semibold text-white">0.00</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">24h Change</p>
                        <p className="text-sm text-emerald-500">+0.00</p>
                    </div>
                </div>

                {/* Affiliate Rewards Card */}
                <div className="group relative bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-400 font-medium">Affiliate Rewards</h3>
                        <div className="text-red-600 group-hover:scale-110 transition-transform">
                            <Gift className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Total Referrals</span>
                            <span className="text-lg font-semibold text-white">
                                {isConnected ? totalReferrals : '-'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Total Rewards</span>
                            <span className="text-lg font-semibold text-white">
                                {isConnected ? `${totalRewards.toFixed(2)} FLR` : '-'}
                            </span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-500">Recent Referrals</p>
                            <Link
                                href="/referrals"
                                className="text-xs text-red-600 hover:text-red-500 transition-colors"
                            >
                                View All
                            </Link>
                        </div>
                        {!isConnected ? (
                            <p className="text-xs text-gray-500 text-center">
                                Connect wallet to see referrals
                            </p>
                        ) : totalReferrals === 0 ? (
                            <p className="text-xs text-gray-500 text-center">No referrals yet</p>
                        ) : (
                            <p className="text-xs text-gray-500 text-center">
                                You have {totalReferrals} referral(s)
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Affiliate Rewards Section */}
            <div className="mb-6 flex items-center justify-between">
                <ReferralButton />
            </div>

            {/* Membership Tiers */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Membership Tiers</h2>
                    <button className="text-sm text-red-600 hover:text-red-500 transition-colors">
                        View All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MEMBERSHIP_TIERS.map((tier) => (
                        <Link
                            key={tier.id}
                            href={tier.path}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl">
                                <div className={`w-full h-full bg-gradient-to-r ${tier.color} opacity-20`} />
                            </div>
                            <div className={`relative bg-black/40 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 ${tier.highlighted ? 'ring-2 ring-[#FFD700]/50' : ''
                                } ${tier.color.replace('from-', 'border-').replace('to-', 'hover:border-')}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${tier.color} text-white relative w-12 h-12`}>
                                            <Image
                                                src={tier.icon}
                                                alt={`${tier.name} icon`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">{tier.tier}</p>
                                            <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                                            <p className="text-xs text-gray-500">{tier.subtitle}</p>
                                        </div>
                                    </div>
                                    {tier.highlighted && (
                                        <div className="flex items-center gap-1 bg-[#FFD700]/10 px-2 py-1 rounded-full">
                                            <Sparkles className="w-3 h-3 text-[#FFD700]" />
                                            <span className="text-xs text-[#FFD700]">Limited</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-400 mb-3 line-clamp-2 text-sm">
                                    {tier.description}
                                </p>
                                <div className="flex items-center justify-between">

                                    <span className="flex items-center text-sm text-red-600 group-hover:text-red-500 transition-colors">
                                        Access Content
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}