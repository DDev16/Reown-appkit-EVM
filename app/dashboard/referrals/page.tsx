'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import {
    Gift,
    Users,
    Trophy,
    Calendar,
    CreditCard,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Clock,
    Filter,
    ArrowUpDown,
    PieChart,
    BarChart,
    History,
    BadgePercent
} from 'lucide-react';
import Link from 'next/link';
import REFERRAL_ABI from '@/lib/contract-abi.json';

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");

// Tier name mapping based on contract constants
const TIER_NAMES = {
    0: "Top Tier",
    1: "Rhodium",
    2: "Platinum",
    3: "Gold",
    4: "Ruthenium",
    5: "Iridium",
    6: "Osmium",
    7: "Palladium",
    8: "Rhenium",
    9: "Silver"
};

// Tier badge colors
const TIER_BADGE_COLORS = {
    0: "bg-purple-900/30 text-purple-300", // Top Tier
    1: "bg-indigo-900/30 text-indigo-300", // Rhodium
    2: "bg-blue-900/30 text-blue-300",     // Platinum
    3: "bg-yellow-900/30 text-yellow-300", // Gold
    4: "bg-emerald-900/30 text-emerald-300", // Ruthenium
    5: "bg-teal-900/30 text-teal-300",     // Iridium
    6: "bg-cyan-900/30 text-cyan-300",     // Osmium
    7: "bg-orange-900/30 text-orange-300", // Palladium
    8: "bg-pink-900/30 text-pink-300",     // Rhenium
    9: "bg-gray-900/30 text-gray-300"      // Silver
};

// Block explorer base URL (assuming Flare network)
const EXPLORER_URL = "https://flare-explorer.flare.network";

// For sample chart - we'll use this when we don't have enough data
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Page component for /dashboard/referrals
export default function ReferralsPage() {
    const { address, isConnected } = useAccount();
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({
        key: 'timestamp',
        direction: 'desc'
    });
    const [filterTier, setFilterTier] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState<{ start: string, end: string }>({
        start: '',
        end: ''
    });
    const [activeView, setActiveView] = useState<string>('table'); // table, analytics

    // Read contract for referral stats
    const { data: referralStatsData, isError: statsError, isLoading: statsLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'getReferralStats',
        args: isConnected ? [address] : ['0x0000000000000000000000000000000000000000'],
    });

    // Read contract for referral history
    const { data: referralHistoryData, isError: historyError, isLoading: historyLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'getReferralHistory',
        args: isConnected ? [address] : ['0x0000000000000000000000000000000000000000'],
    });

    // Parse referral stats data
    const totalReferrals = isConnected && referralStatsData && Array.isArray(referralStatsData)
        ? Number(referralStatsData[0])
        : 0;
    const totalEarned = isConnected && referralStatsData && Array.isArray(referralStatsData)
        ? Number(referralStatsData[1]) / 1e18
        : 0;
    const lastReferralTime = isConnected && referralStatsData && Array.isArray(referralStatsData)
        ? Number(referralStatsData[2])
        : 0;

    // Process referral history data into a more usable format
    const processedReferrals = React.useMemo(() => {
        if (!referralHistoryData) return [];

        // Check if the data is returned as an array of arrays (tuple-like)
        if (Array.isArray(referralHistoryData)) {
            // Handle tuple return type [users[], amounts[], timestamps[], tiers[]]
            const [users, amounts, timestamps, tiers] = referralHistoryData;

            if (!users || !Array.isArray(users) || users.length === 0) return [];

            return users.map((user, index) => {
                const amount = amounts && Array.isArray(amounts) && amounts[index]
                    ? Number(amounts[index]) / 1e18
                    : 0;

                const timestamp = timestamps && Array.isArray(timestamps) && timestamps[index]
                    ? Number(timestamps[index]) * 1000
                    : 0;

                const tier = tiers && Array.isArray(tiers) && tiers[index]
                    ? Number(tiers[index])
                    : 0;

                return {
                    user,
                    amount,
                    timestamp,
                    tier,
                    tierName: TIER_NAMES[tier as keyof typeof TIER_NAMES] || `Unknown Tier ${tier}`,
                    tierBadgeColor: TIER_BADGE_COLORS[tier as keyof typeof TIER_BADGE_COLORS] || "bg-gray-900/30 text-gray-300",
                    date: new Date(timestamp),
                };
            });
        } else if (referralHistoryData && typeof referralHistoryData === 'object') {
            // Handle object return type {users: [], amounts: [], timestamps: [], tiers: []}
            const { users, amounts, timestamps, tiers } = referralHistoryData as any;

            if (!users || !Array.isArray(users) || users.length === 0) return [];

            return users.map((user: string, index: number) => {
                const amount = amounts && Array.isArray(amounts) && amounts[index]
                    ? Number(amounts[index]) / 1e18
                    : 0;

                const timestamp = timestamps && Array.isArray(timestamps) && timestamps[index]
                    ? Number(timestamps[index]) * 1000
                    : 0;

                const tier = tiers && Array.isArray(tiers) && tiers[index]
                    ? Number(tiers[index])
                    : 0;

                return {
                    user,
                    amount,
                    timestamp,
                    tier,
                    tierName: TIER_NAMES[tier as keyof typeof TIER_NAMES] || `Unknown Tier ${tier}`,
                    tierBadgeColor: TIER_BADGE_COLORS[tier as keyof typeof TIER_BADGE_COLORS] || "bg-gray-900/30 text-gray-300",
                    date: new Date(timestamp),
                };
            });
        }

        return [];
    }, [referralHistoryData]);

    // Apply sorting and filtering
    const sortedAndFilteredReferrals = React.useMemo(() => {
        if (!processedReferrals || processedReferrals.length === 0) return [];

        // Apply date range filter if set
        let filtered = processedReferrals;

        if (dateRange.start) {
            const startDate = new Date(dateRange.start).getTime();
            filtered = filtered.filter(ref => ref.timestamp >= startDate);
        }

        if (dateRange.end) {
            const endDate = new Date(dateRange.end + 'T23:59:59').getTime();
            filtered = filtered.filter(ref => ref.timestamp <= endDate);
        }

        // Apply tier filter if set
        if (filterTier !== null) {
            filtered = filtered.filter(ref => ref.tier === filterTier);
        }

        // Apply sorting
        return [...filtered].sort((a, b) => {
            if (sortConfig.key === 'timestamp') {
                return sortConfig.direction === 'asc'
                    ? a.timestamp - b.timestamp
                    : b.timestamp - a.timestamp;
            }

            if (sortConfig.key === 'amount') {
                return sortConfig.direction === 'asc'
                    ? a.amount - b.amount
                    : b.amount - a.amount;
            }

            if (sortConfig.key === 'tier') {
                return sortConfig.direction === 'asc'
                    ? a.tier - b.tier
                    : b.tier - a.tier;
            }

            return 0;
        });
    }, [processedReferrals, sortConfig, filterTier, dateRange]);

    // Function to request sort
    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Function to format date
    const formatDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Function to format short date
    const formatShortDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Function to truncate address
    const truncateAddress = (address: string): string => {
        if (!address) return '';
        return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
    };

    // Calculate statistics
    const averageReward = totalReferrals > 0 ? totalEarned / totalReferrals : 0;

    // Get highest value referral
    const highestReferral = processedReferrals.length > 0
        ? processedReferrals.reduce((max, ref) => (ref.amount > max.amount ? ref : max), processedReferrals[0])
        : null;

    // Calculate referrals by tier
    const referralsByTier = processedReferrals.reduce((acc, ref) => {
        acc[ref.tier] = (acc[ref.tier] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    // Calculate earnings by tier
    const earningsByTier = processedReferrals.reduce((acc, ref) => {
        acc[ref.tier] = (acc[ref.tier] || 0) + ref.amount;
        return acc;
    }, {} as Record<number, number>);

    // Calculate average earnings by tier
    const avgEarningsByTier: Record<number, number> = {};
    for (const tier in referralsByTier) {
        if (referralsByTier[tier] > 0) {
            avgEarningsByTier[tier] = earningsByTier[tier] / referralsByTier[tier];
        } else {
            avgEarningsByTier[tier] = 0;
        }
    }

    // Calculate most lucrative tier
    const mostLucrativeTier = Object.entries(earningsByTier).length > 0
        ? Object.entries(earningsByTier).reduce(
            (max, [tier, amount]) => amount > max.amount ? { tier: Number(tier), amount } : max,
            { tier: 0, amount: 0 }
        )
        : null;

    // Get recent referrals (last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentReferrals = processedReferrals.filter(ref => ref.timestamp >= thirtyDaysAgo);
    const recentEarnings = recentReferrals.reduce((sum, ref) => sum + ref.amount, 0);

    // Helper function for sorting indicators
    const getSortIndicator = (key: string) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 ml-1" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="w-4 h-4 ml-1" />
            : <ChevronDown className="w-4 h-4 ml-1" />;
    };

    // Functions to get a tier badge with appropriate color
    const getTierBadge = (tier: number) => {
        const badgeColor = TIER_BADGE_COLORS[tier as keyof typeof TIER_BADGE_COLORS] || "bg-gray-900/30 text-gray-300";
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${badgeColor}`}>
                {TIER_NAMES[tier as keyof typeof TIER_NAMES] || `Tier ${tier}`}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Your Referrals</h1>
                <Link
                    href="/dashboard"
                    className="text-sm text-red-600 hover:text-red-500 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>

            {!isConnected ? (
                <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 text-center">
                    <p className="text-gray-400">Connect your wallet to view your referral data.</p>
                </div>
            ) : statsLoading || historyLoading ? (
                <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 text-center">
                    <p className="text-gray-400">Loading your referral data...</p>
                </div>
            ) : statsError || historyError ? (
                <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 text-center">
                    <p className="text-red-400">Error loading referral data. Please try again later.</p>
                </div>
            ) : (
                <>
                    {/* Stats Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-400 font-medium">Total Referrals</h3>
                                <Users className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-white">{totalReferrals}</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-gray-500">People referred</p>
                            </div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-400 font-medium">Total Earned</h3>
                                <Trophy className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-white">{totalEarned.toFixed(2)} FLR</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-gray-500">From all referrals</p>
                            </div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-400 font-medium">Average Reward</h3>
                                <CreditCard className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-white">{averageReward.toFixed(2)} FLR</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-gray-500">Per referral</p>
                                {mostLucrativeTier && (
                                    <div className="flex items-center">
                                        <p className="text-xs text-gray-500 mr-1">Best tier:</p>
                                        {getTierBadge(mostLucrativeTier.tier)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-400 font-medium">Last Referral</h3>
                                <Calendar className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-md font-bold text-white">
                                {lastReferralTime ? formatShortDate(lastReferralTime * 1000) : 'No referrals yet'}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-gray-500">
                                    {lastReferralTime
                                        ? `${Math.floor((Date.now() - lastReferralTime * 1000) / (1000 * 60 * 60 * 24))} days ago`
                                        : ''}
                                </p>
                                {processedReferrals.length > 0 && (
                                    <p className="text-xs text-gray-400">
                                        Total: {processedReferrals.length} transactions
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* View Selector */}
                    <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold">View Data</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveView('table')}
                                    className={`px-3 py-1 rounded-md text-sm ${activeView === 'table'
                                        ? 'bg-red-900/50 text-white'
                                        : 'bg-black/40 text-gray-400 hover:bg-black/60'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <History className="w-4 h-4 mr-1" />
                                        History
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveView('analytics')}
                                    className={`px-3 py-1 rounded-md text-sm ${activeView === 'analytics'
                                        ? 'bg-red-900/50 text-white'
                                        : 'bg-black/40 text-gray-400 hover:bg-black/60'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <PieChart className="w-4 h-4 mr-1" />
                                        Analytics
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content for each view */}
                    {activeView === 'table' && (
                        <>
                            {/* Filters */}
                            <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                                <div className="flex items-center mb-3">
                                    <Filter className="w-5 h-5 mr-2 text-red-600" />
                                    <h3 className="text-lg font-bold">Filter Referrals</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Date Range Filter */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Date Range</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="date"
                                                value={dateRange.start}
                                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                                className="bg-black/60 border border-red-900/30 rounded-md px-3 py-2 text-sm w-full"
                                            />
                                            <span className="text-gray-500 flex items-center">to</span>
                                            <input
                                                type="date"
                                                value={dateRange.end}
                                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                                className="bg-black/60 border border-red-900/30 rounded-md px-3 py-2 text-sm w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Tier Filter */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Tier</label>
                                        <select
                                            value={filterTier !== null ? filterTier : ''}
                                            onChange={(e) => setFilterTier(e.target.value ? Number(e.target.value) : null)}
                                            className="bg-black/60 border border-red-900/30 rounded-md px-3 py-2 text-sm w-full"
                                        >
                                            <option value="">All Tiers</option>
                                            {Object.entries(TIER_NAMES).map(([tier, name]) => (
                                                <option key={tier} value={tier}>{name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Reset Filters */}
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => {
                                                setFilterTier(null);
                                                setDateRange({ start: '', end: '' });
                                            }}
                                            className="bg-red-900/30 hover:bg-red-900/50 text-white px-4 py-2 rounded-md text-sm transition-colors"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Referrals Table */}
                            <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                                <h3 className="text-lg font-bold mb-3">Referral History</h3>

                                {sortedAndFilteredReferrals.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left border-b border-red-900/30">
                                                    <th className="pb-2 text-gray-400">
                                                        <button
                                                            className="flex items-center focus:outline-none"
                                                            onClick={() => requestSort('timestamp')}
                                                        >
                                                            Date {getSortIndicator('timestamp')}
                                                        </button>
                                                    </th>
                                                    <th className="pb-2 text-gray-400">Address</th>
                                                    <th className="pb-2 text-gray-400">
                                                        <button
                                                            className="flex items-center focus:outline-none"
                                                            onClick={() => requestSort('tier')}
                                                        >
                                                            Tier {getSortIndicator('tier')}
                                                        </button>
                                                    </th>
                                                    <th className="pb-2 text-gray-400">
                                                        <button
                                                            className="flex items-center focus:outline-none"
                                                            onClick={() => requestSort('amount')}
                                                        >
                                                            Reward {getSortIndicator('amount')}
                                                        </button>
                                                    </th>
                                                    <th className="pb-2 text-gray-400"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedAndFilteredReferrals.map((referral, index) => (
                                                    <tr key={index} className="border-b border-red-900/10 hover:bg-red-900/5">
                                                        <td className="py-3 text-white">
                                                            <div className="flex items-center">
                                                                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                                                {formatDate(referral.timestamp)}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-white">
                                                            <a
                                                                href={`${EXPLORER_URL}/address/${referral.user}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:text-red-500 transition-colors"
                                                            >
                                                                {truncateAddress(referral.user)}
                                                            </a>
                                                        </td>
                                                        <td className="py-3 text-white">
                                                            {getTierBadge(referral.tier)}
                                                        </td>
                                                        <td className="py-3 text-white">{referral.amount.toFixed(4)} FLR</td>
                                                        <td className="py-3 text-white">
                                                            <a
                                                                href={`${EXPLORER_URL}/address/${address}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-red-500 hover:text-red-400 flex items-center"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center py-4">
                                        {totalReferrals > 0
                                            ? 'No referrals match your filter criteria'
                                            : 'You haven\'t made any referrals yet'}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {activeView === 'analytics' && (
                        <>
                            {/* Additional Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Highest Value Referral */}
                                <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                                    <h3 className="text-lg font-bold mb-3">Highest Value Referral</h3>
                                    {highestReferral ? (
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gradient-to-r rounded-lg flex items-center justify-between"
                                                style={{
                                                    background: `linear-gradient(to right, rgba(180, 50, 50, 0.2), rgba(50, 0, 0, 0.1))`,
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-400">Referred</p>
                                                        <a
                                                            href={`${EXPLORER_URL}/address/${highestReferral.user}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-white hover:text-red-500 transition-colors font-medium"
                                                        >
                                                            {truncateAddress(highestReferral.user)}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-400">Reward</p>
                                                    <p className="text-white font-bold">{highestReferral.amount.toFixed(4)} FLR</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-black/60 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-400">Tier</p>
                                                    <div className="mt-1">{getTierBadge(highestReferral.tier)}</div>
                                                </div>
                                                <div className="bg-black/60 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-400">Date</p>
                                                    <p className="text-white">{formatShortDate(highestReferral.timestamp)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">No referrals yet</p>
                                    )}
                                </div>

                                {/* Referrals by Tier */}
                                <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                                    <h3 className="text-lg font-bold mb-3">Referrals by Tier</h3>
                                    {Object.keys(referralsByTier).length > 0 ? (
                                        <div className="space-y-4">
                                            {Object.entries(referralsByTier)
                                                .sort(([tierA], [tierB]) => Number(tierA) - Number(tierB))
                                                .map(([tier, count]) => {
                                                    const tierNumber = Number(tier);
                                                    const tierEarnings = earningsByTier[tierNumber] || 0;
                                                    const percentage = (count / totalReferrals) * 100;

                                                    return (
                                                        <div key={tier} className="space-y-1">
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center">
                                                                    {getTierBadge(tierNumber)}
                                                                    <span className="ml-2 text-white font-medium">{count}</span>
                                                                    <span className="ml-1 text-gray-500 text-sm">
                                                                        ({percentage.toFixed(1)}%)
                                                                    </span>
                                                                </div>
                                                                <span className="text-white">{tierEarnings.toFixed(2)} FLR</span>
                                                            </div>
                                                            <div className="bg-gray-800/50 h-2 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-red-600 to-red-800"
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">No referrals yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Earnings Analysis */}
                            <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4">
                                <h3 className="text-lg font-bold mb-3">Earnings Analysis</h3>
                                {processedReferrals.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Last 30 Days */}
                                        <div className="bg-black/60 p-3 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-gray-400">Last 30 Days</h4>
                                                <Calendar className="w-4 h-4 text-red-600" />
                                            </div>
                                            <p className="text-xl font-bold text-white">{recentEarnings.toFixed(2)} FLR</p>
                                            <div className="flex justify-between mt-1">
                                                <p className="text-sm text-gray-500">From {recentReferrals.length} referrals</p>
                                            </div>
                                        </div>

                                        {/* Best Performing Tier */}
                                        <div className="bg-black/60 p-3 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-gray-400">Best Performing Tier</h4>
                                                <BadgePercent className="w-4 h-4 text-red-600" />
                                            </div>
                                            {mostLucrativeTier ? (
                                                <>
                                                    <div className="flex items-center">
                                                        {getTierBadge(mostLucrativeTier.tier)}
                                                        <span className="ml-2 text-xl font-bold text-white">
                                                            {mostLucrativeTier.amount.toFixed(2)} FLR
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {(referralsByTier[mostLucrativeTier.tier] || 0)} referrals
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-gray-400">No data available</p>
                                            )}
                                        </div>

                                        {/* Most Efficient Tier */}
                                        <div className="bg-black/60 p-3 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-gray-400">Most Efficient Tier</h4>
                                                <BarChart className="w-4 h-4 text-red-600" />
                                            </div>
                                            {Object.keys(avgEarningsByTier).length > 0 ? (
                                                (() => {
                                                    const mostEfficientTier = Object.entries(avgEarningsByTier).reduce(
                                                        (max, [tier, avg]) => avg > max.avg ? { tier: Number(tier), avg } : max,
                                                        { tier: 0, avg: 0 }
                                                    );

                                                    return (
                                                        <>
                                                            <div className="flex items-center">
                                                                {getTierBadge(mostEfficientTier.tier)}
                                                                <span className="ml-2 text-xl font-bold text-white">
                                                                    {mostEfficientTier.avg.toFixed(2)} FLR
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Average per referral
                                                            </p>
                                                        </>
                                                    );
                                                })()
                                            ) : (
                                                <p className="text-gray-400">No data available</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center">No referrals yet</p>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}