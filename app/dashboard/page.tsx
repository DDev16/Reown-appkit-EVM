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
    CloudLightning
} from 'lucide-react';
import Link from 'next/link';

const MEMBERSHIP_TIERS = [
    {
        id: 1,
        name: 'Top Tier',
        tier: 'Tier 1',
        description: 'The ultimate experience/exclusive access & premium benefits',
        path: '/dashboard/tier-1',
        color: 'from-[#FFD700] via-[#FFA500] to-[#FF4500]',
        icon: <Crown className="w-6 h-6" />,
        highlighted: true,
        subtitle: 'Exclusive Tier'
    },
    {
        id: 2,
        name: 'RHODIUM',
        tier: 'Tier 2',
        description: 'Premium access to advanced features and dedicated support',
        path: '/dashboard/tier-2',
        color: 'from-[#E5E4E2] via-[#C0C0C0] to-[#A9A9A9]',
        icon: <Diamond className="w-6 h-6" />,
        subtitle: 'Premium Tier'
    },
    {
        id: 3,
        name: 'PLATINUM',
        tier: 'Tier 3',
        description: 'Elite membership with enhanced capabilities and priority access',
        path: '/dashboard/tier-3',
        color: 'from-[#E5E4E2] via-[#C0C0C0] to-[#A9A9A9]',
        icon: <Star className="w-6 h-6" />,
        subtitle: 'Elite Tier'
    },
    {
        id: 4,
        name: 'GOLD',
        tier: 'Tier 4',
        description: 'Professional grade features with advanced trading capabilities',
        path: '/dashboard/tier-4',
        color: 'from-[#FFD700] via-[#FFA500] to-[#FF8C00]',
        icon: <Shield className="w-6 h-6" />,
        subtitle: 'Pro Tier'
    },
    {
        id: 5,
        name: 'RUTHENIUM',
        tier: 'Tier 5',
        description: 'Advanced tools and features for serious traders',
        path: '/dashboard/tier-5',
        color: 'from-[#CD7F32] via-[#B87333] to-[#A0522D]',
        icon: <CloudLightning className="w-6 h-6" />,
        subtitle: 'Advanced Tier'
    },
    {
        id: 6,
        name: 'IRIDIUM',
        tier: 'Tier 6',
        description: 'Perfect starting point for your DBW journey',
        path: '/dashboard/tier-6',
        color: 'from-[#C0C0C0] via-[#A9A9A9] to-[#808080]',
        icon: <Rocket className="w-6 h-6" />,
        subtitle: 'Starter Tier'
    },
    {
        id: 7,
        name: 'OSMIUM',
        tier: 'Tier 7',
        description: 'Essential features to begin your DBW experience',
        path: '/dashboard/tier-7',
        color: 'from-[#CD7F32] via-[#B87333] to-[#A0522D]',
        icon: <Gem className="w-6 h-6" />,
        subtitle: 'Entry Tier'
    }
];


export default function DashboardPage() {
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

                <div className="group relative bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-400 font-medium">FLR Rewards</h3>
                        <div className="text-red-600 group-hover:scale-110 transition-transform">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">0.00 FLR</p>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">24h Change</p>
                        <p className="text-sm text-emerald-500">+0.00</p>
                    </div>
                </div>
            </div>

            {/* Membership Tiers - Keep the rest the same */}
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
                            <div className={`relative bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4 hover:border-red-600/50 transition-all duration-300 ${tier.highlighted ? 'ring-2 ring-[#FFD700]/50' : ''
                                }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${tier.color} text-white`}>
                                            {tier.icon}
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
                                    <span className="text-sm text-gray-500">
                                        0% Completed
                                    </span>
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