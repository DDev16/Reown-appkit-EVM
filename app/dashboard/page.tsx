'use client';

import {
    Wallet,
    Trophy,
    ChevronRight,
    Sparkles,
    Gift,
    Clock
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import Link from 'next/link';
import { ReferralButton } from '@/components/sales/ReferralButton';
import Image from 'next/image';
import { MEMBERSHIP_TIERS } from '@/components/member-tiers/membership_tiers_dash';
import REFERRAL_ABI from '@/lib/contract-abi.json';

// Type definitions for contract return values
type ReferralStatsReturn = [bigint, bigint, bigint]; // [totalReferrals, totalEarned, lastReferralTime]
type ReferralHistoryReturn = {
    users: `0x${string}[]`;
    amounts: bigint[];
    timestamps: bigint[];
    tiers: bigint[];
};

// Type definition for tier ownership
type TierOwnership = {
    tier: bigint;
    amount: bigint;
    mintTimestamp: bigint;
};

// Type definition for user ownership info
type UserOwnershipInfoReturn = [
    TierOwnership[], // ownedTiers
    bigint,          // highestTier
    bigint           // totalNFTs
];

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");

// Map tier IDs to names based on contract constants
const TIER_NAMES = {
    0: 'TOP TIER',
    1: 'RHODIUM',
    2: 'PLATINUM',
    3: 'GOLD',
    4: 'RUTHENIUM',
    5: 'IRIDIUM',
    6: 'OSMIUM',
    7: 'PALLADIUM',
    8: 'RHENIUM',
    9: 'SILVER'
};

export default function DashboardPage() {
    // Get user's connected wallet address
    const { address, isConnected } = useAccount();

    // Read contract for referral data using getReferralStats
    const { data: referralStatsData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'getReferralStats',
        args: isConnected ? [address] : ['0x0000000000000000000000000000000000000000'],
    }) as { data: ReferralStatsReturn | undefined };

    // Read contract for total referral rewards
    const { data: totalRewardsData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'getTotalReferralRewards',
        args: isConnected ? [address] : ['0x0000000000000000000000000000000000000000'],
    }) as { data: bigint | undefined };

    // Read contract for referral history
    const { data: referralHistoryData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'getReferralHistory',
        args: isConnected ? [address] : ['0x0000000000000000000000000000000000000000'],
    }) as { data: ReferralHistoryReturn | undefined };

    // Read contract for user's membership tiers
    const { data: userOwnershipData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'getUserOwnershipInfo',
        args: isConnected ? [address] : ['0x0000000000000000000000000000000000000000'],
    }) as { data: UserOwnershipInfoReturn | undefined };

    // Parse ownership data
    const ownedTiers = userOwnershipData && userOwnershipData[0] ? userOwnershipData[0] : [];
    const highestTier = userOwnershipData && userOwnershipData[1]
        ? Number(userOwnershipData[1]) < Number.MAX_SAFE_INTEGER
            ? Number(userOwnershipData[1])
            : null
        : null;
    const totalNFTs = userOwnershipData && userOwnershipData[2] ? Number(userOwnershipData[2]) : 0;

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

    // Backup for total rewards if getReferralStats fails
    const totalRewards = isConnected && totalRewardsData
        ? Number(totalRewardsData) / 1e18 // Converting from wei
        : totalEarned; // Use totalEarned from getReferralStats if available

    // Format the last referral time
    const formatLastReferralTime = () => {
        if (!lastReferralTime) return 'No referrals yet';

        const date = new Date(lastReferralTime * 1000);
        return date.toLocaleDateString();
    };

    // Format timestamp for tier purchase
    const formatPurchaseDate = (timestamp: bigint) => {
        if (!timestamp) return 'N/A';

        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString();
    };

    // Get recent referrals (up to 3)
    const recentReferrals: `0x${string}`[] = (
        referralHistoryData &&
        referralHistoryData.users &&
        Array.isArray(referralHistoryData.users)
    )
        ? (referralHistoryData.users as `0x${string}`[]).slice(0, 3)
        : [];

    // Function to truncate address for display
    const truncateAddress = (address: string): string => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Find tier information by ID from MEMBERSHIP_TIERS
    const getTierInfo = (tierId: number) => {
        const tierName = TIER_NAMES[tierId as keyof typeof TIER_NAMES];
        const baseTier = MEMBERSHIP_TIERS.find(tier => tier.name === tierName) || null;

        // Special case color overrides
        if (tierName === 'SILVER') {
            return baseTier ? { ...baseTier, color: 'from-pink-500 to-fuchsia-600' } : null;
        } else if (tierName === 'RHENIUM') {
            return baseTier ? { ...baseTier, color: 'from-yellow-400 to-yellow-600' } : null;
        } else if (tierName === 'IRIDIUM') {
            return baseTier ? { ...baseTier, color: 'from-red-500 to-red-700' } : null;
        }

        return baseTier;
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-red-950 to-black p-6 border border-red-900/30">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        Welcome to DeFiBullWorld
                    </h1>
                    <p className="mt-2 text-gray-400 max-w-2xl text-center">
                        Access exclusive trading education, market insights, and professional strategies through our tiered membership system.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 blur-3xl" />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Owned Memberships Card - Updated */}
                <div className="group relative bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-4 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-400 font-medium">Owned Memberships</h3>
                        <div className="text-red-600 group-hover:scale-110 transition-transform">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{totalNFTs || 0}</p>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">Tiers</p>
                        <Link
                            href="/dashboard/wallet/"
                            className="text-xs text-red-600 hover:text-red-500 transition-colors"
                        >
                            View All
                        </Link>
                    </div>

                    {isConnected ? (
                        <div className="mt-2 space-y-1">
                            {ownedTiers && ownedTiers.length > 0 ? (
                                ownedTiers.map((tierData: TierOwnership, index: number) => {
                                    const tierInfo = getTierInfo(Number(tierData.tier));
                                    return (
                                        <div key={index} className="flex justify-between items-center text-xs border-t border-gray-800 pt-1">
                                            <div className="flex items-center gap-1">
                                                {tierInfo && (
                                                    <div className={`w-2 h-2 rounded-full ${TIER_NAMES[Number(tierData.tier) as keyof typeof TIER_NAMES] === 'SILVER'
                                                        ? 'bg-pink-500'
                                                        : TIER_NAMES[Number(tierData.tier) as keyof typeof TIER_NAMES] === 'RHENIUM'
                                                            ? 'bg-yellow-500'
                                                            : TIER_NAMES[Number(tierData.tier) as keyof typeof TIER_NAMES] === 'IRIDIUM'
                                                                ? 'bg-red-600'
                                                                : tierInfo.color.replace('from-', 'bg-').split(' ')[0]
                                                        }`} />
                                                )}
                                                <span className="text-gray-300">
                                                    {TIER_NAMES[Number(tierData.tier) as keyof typeof TIER_NAMES] || `Tier ${tierData.tier}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-white font-medium">
                                                    {Number(tierData.amount)}
                                                </span>
                                                <span className="text-gray-500 text-xxs">
                                                    {formatPurchaseDate(tierData.mintTimestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-gray-500 text-center mt-2">No memberships owned</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 text-center mt-2">Connect wallet to see memberships</p>
                    )}
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
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Last Referral</span>
                            <span className="text-sm font-semibold text-white flex items-center">
                                {isConnected ? formatLastReferralTime() : '-'}
                                {lastReferralTime > 0 && <Clock className="w-3 h-3 ml-1 text-gray-500" />}
                            </span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-500">Recent Referrals</p>
                            <Link
                                href="/dashboard/referrals/"
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
                        ) : recentReferrals && recentReferrals.length > 0 ? (
                            <div className="text-xs space-y-1">
                                {recentReferrals.map((user: string, index: number) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-gray-400">{truncateAddress(user)}</span>
                                        <span className="text-emerald-500">
                                            {referralHistoryData &&
                                                referralHistoryData.amounts &&
                                                index < referralHistoryData.amounts.length
                                                ? (Number(referralHistoryData.amounts[index]) / 1e18).toFixed(2) + ' FLR'
                                                : '0.00 FLR'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 text-center">
                                You have {totalReferrals} referral(s)
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Affiliate Rewards Section */}
            <div className="mb-6 flex-center justify-between">
                <ReferralButton />
            </div>

            {/* Membership Tiers */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-center w-full">Membership Tiers</h2>


                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MEMBERSHIP_TIERS.map((tier) => {
                        // Check if user owns this tier
                        const owned = ownedTiers && ownedTiers.some(
                            (t: TierOwnership) =>
                                TIER_NAMES[Number(t.tier) as keyof typeof TIER_NAMES] === tier.name
                        );

                        return (
                            <Link
                                key={tier.id}
                                href={tier.path}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl">
                                    <div className={`w-full h-full bg-gradient-to-r ${tier.color} opacity-20`} />
                                </div>
                                <div className={`relative bg-black/40 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 
                                    ${tier.highlighted ? 'ring-2 ring-[#FFD700]/50' : ''} 
                                    ${owned && tier.name !== 'IRIDIUM'
                                        ? 'border-emerald-500 hover:border-emerald-400'
                                        : tier.name === 'SILVER'
                                            ? 'border-pink-500 hover:border-fuchsia-500'
                                            : tier.name === 'RHENIUM'
                                                ? 'border-yellow-500 hover:border-yellow-400'
                                                : tier.name === 'IRIDIUM'
                                                    ? 'border-red-600 hover:border-red-500'
                                                    : tier.color.replace('from-', 'border-').replace('to-', 'hover:border-')
                                    }`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${tier.name === 'SILVER'
                                                ? 'from-pink-500 to-fuchsia-600'
                                                : tier.name === 'RHENIUM'
                                                    ? 'from-yellow-400 to-yellow-600'
                                                    : tier.name === 'IRIDIUM'
                                                        ? 'from-red-500 to-red-700'
                                                        : tier.color
                                                } text-white relative w-12 h-12`}>
                                                <Image
                                                    src={tier.icon}
                                                    alt={`${tier.name} icon`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium">{tier.tier}</p>
                                                <h3 className="text-lg font-semibold text-white flex items-center">
                                                    {tier.name}
                                                    {owned && (
                                                        <span className="ml-2 inline-block w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                                            <span className="text-xs text-white">✓</span>
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-xs text-gray-500">{tier.subtitle}</p>
                                            </div>
                                        </div>
                                        {tier.highlighted && !owned && (
                                            <div className="flex items-center gap-1 bg-[#FFD700]/10 px-2 py-1 rounded-full">
                                                <Sparkles className="w-3 h-3 text-[#FFD700]" />
                                                <span className="text-xs text-[#FFD700]">Limited</span>
                                            </div>
                                        )}
                                        {tier.highlighted && owned && (
                                            <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                                                <Sparkles className="w-3 h-3 text-emerald-500" />
                                                <span className="text-xs text-emerald-500">Owned</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-400 mb-3 line-clamp-2 text-sm">
                                        {tier.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center text-sm text-red-600 group-hover:text-red-500 transition-colors">
                                            {owned ? 'Access Content' : 'Purchase Tier'}
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}