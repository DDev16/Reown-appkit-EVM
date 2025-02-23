'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAccount, useReadContracts } from 'wagmi';
import Link from 'next/link';
import {
    Layout,
    ChevronDown,
    Crown,
    Diamond,
    Binary,
    Gem,
    Rocket,
    Target,
    Award,
    Wallet,
    VideoIcon,
    Library,
    Newspaper,
    LayoutDashboard
} from 'lucide-react';
import { parseAbi } from 'viem';
import Image from 'next/image';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const TOTAL_TIERS = 9;

// ERC1155 minimal ABI for balanceOf
const ERC1155_ABI = parseAbi([
    'function balanceOf(address account, uint256 id) view returns (uint256)',
]);

// Define membership tiers with routes
// Define membership tiers with routes
const MEMBERSHIP_TIERS = [
    {
        id: 1,
        name: 'Top Tier Tier-1',
        path: '/dashboard/tier-1',
        iconPath: '/tier-icons/DBW-icon.png',
        color: 'from-[#d4af37] via-[#d4af37] to-[#b3941f]'
    },
    {
        id: 2,
        name: 'RHODIUM Tier-2',
        path: '/dashboard/tier-2',
        iconPath: '/tier-icons/Rh-icon.png',
        color: 'from-[#00bf63] via-[#00bf63] to-[#009e52]'
    },
    {
        id: 3,
        name: 'PLATINUM Tier-3',
        path: '/dashboard/tier-3',
        iconPath: '/tier-icons/Pt-icon.png',
        color: 'from-[#ff8018] via-[#ff8018] to-[#e67216]'
    },
    {
        id: 4,
        name: 'GOLD Tier-4',
        path: '/dashboard/tier-4',
        iconPath: '/tier-icons/Au-icon.png',
        color: 'from-[#d4af37] via-[#d4af37] to-[#b3941f]'
    },
    {
        id: 5,
        name: 'RUTHENIUM Tier-5',
        path: '/dashboard/tier-5',
        iconPath: '/tier-icons/Ru-icon.png',
        color: 'from-[#f6cefc] via-[#f6cefc] to-[#eab5f1]'
    },
    {
        id: 6,
        name: 'IRIDIUM Tier-6',
        path: '/dashboard/tier-6',
        iconPath: '/tier-icons/Ir-icon.png',
        color: 'from-[#BC1A1E] via-[#BC1A1E] to-[#8B1315]'
    },
    {
        id: 7,
        name: 'OSMIUM Tier-7',
        path: '/dashboard/tier-7',
        iconPath: '/tier-icons/Os-icon.png',
        color: 'from-[#0099CC] via-[#0099CC] to-[#007399]'
    },
    {
        id: 8,
        name: 'PALLADIUM Tier-8',
        path: '/dashboard/tier-8',
        iconPath: '/tier-icons/Pd-icon.png',
        color: 'from-[#2ECC71] via-[#2ECC71] to-[#27AE60]'
    },
    {
        id: 9,
        name: 'RHENIUM Tier-9',
        path: '/dashboard/tier-9',
        iconPath: '/tier-icons/Re-icon.png',
        color: 'from-[#FFD700] via-[#FFD700] to-[#FFC000]'
    },
    {
        id: 10,
        name: 'Video Library',
        path: '/dashboard/video-library',
        icon: <VideoIcon className="w-5 h-5" />,
        color: 'from-pink-400 to-pink-600'
    },
    {
        id: 11,
        name: 'Dictionary',
        path: '/dashboard/dictionary',
        icon: <Library className="w-5 h-5" />,
        color: 'from-teal-400 to-teal-600'
    },
    {
        id: 12,
        name: 'Wallet',
        path: '/dashboard/wallet',
        icon: <Wallet className="w-5 h-5" />,
        color: 'from-indigo-400 to-indigo-600'
    },
    {
        id: 13,
        name: 'General Blog',
        path: '/blog',
        icon: <Newspaper className="w-5 h-5" />,
        color: 'from-cyan-400 to-cyan-600'
    }
];

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { address, isConnected } = useAccount();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    // NFT ownership check
    const contracts = address
        ? Array.from({ length: TOTAL_TIERS }, (_, i) => ({
            address: CONTRACT_ADDRESS,
            abi: ERC1155_ABI,
            functionName: 'balanceOf',
            args: [address as `0x${string}`, BigInt(i)],
        }))
        : [];

    const { data: balances } = useReadContracts({
        contracts
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check wallet connection and NFT ownership
    useEffect(() => {
        if (!mounted) return;

        if (!isConnected) {
            router.push('/not-connected');
            return;
        }

        // Check if user owns any NFTs
        if (balances && address) {
            const hasNFT = balances.some(
                (result) => result.status === 'success' && result.result > BigInt(0)
            );

            if (!hasNFT) {
                router.push('/unauthorized');
            }
        }
    }, [isConnected, balances, router, mounted, address]);

    const formatAddress = (addr: string | undefined) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    // Handle initial server render
    if (!mounted) {
        return (
            <div className="min-h-screen bg-black text-white mt-0">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white mt-0">
            {/* Navigation Bar */}
            <nav className="fixed top-16 w-full border-b border-red-900/30 bg-black/90 backdrop-blur-sm z-40">
                <div className="px-4">
                    <div className="flex justify-between items-center h-12">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                        >
                            <Layout className="w-5 h-5" />
                        </button>

                        {/* Wallet Display */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-gray-300 hover:text-white bg-black/40 rounded-full px-3 py-1.5 border border-red-900/30 hover:border-red-600/50 transition-all">
                                <Wallet className="w-4 h-4" />
                                <span className="text-sm max-w-[150px] truncate">
                                    {isConnected ? formatAddress(address) : 'Connect Wallet'}
                                </span>
                                <ChevronDown size={16} />
                            </button>
                            <div className="absolute right-0 w-48 mt-2 py-2 bg-black border border-red-900/30 rounded-lg shadow-xl hidden group-hover:block">
                                <div className="px-4 py-2 border-b border-red-900/30 mb-2">
                                    <p className="text-xs text-gray-500">Connected Wallet</p>
                                    <p className="text-sm text-gray-300 truncate">
                                        {isConnected ? address : 'Not Connected'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-28 h-[calc(100vh-7rem)] bg-black/90 border-r border-red-900/30 transition-all duration-300 z-30
                    ${isSidebarOpen
                        ? 'translate-x-0 w-64'
                        : '-translate-x-full md:translate-x-0 w-0 md:w-20'}`}
            >
                <div className="p-4 overflow-hidden">
                    <div className="space-y-2">
                        <Link
                            href="/dashboard"
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === '/dashboard'
                                ? 'bg-red-900/20 text-white'
                                : 'text-gray-400 hover:bg-red-900/10 hover:text-white'
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                            {(isSidebarOpen || window?.innerWidth >= 768) && (
                                <span className={`ml-3 text-sm font-medium whitespace-nowrap ${!isSidebarOpen ? 'md:hidden' : ''}`}>
                                    Dashboard
                                </span>
                            )}
                        </Link>
                        {MEMBERSHIP_TIERS.map((tier) => (
                            <Link
                                key={tier.id}
                                href={tier.path}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === tier.path
                                    ? 'bg-red-900/20 text-white'
                                    : 'text-gray-400 hover:bg-red-900/10 hover:text-white'
                                    }`}
                            >
                                <div className="flex-shrink-0">
                                    {tier.iconPath ? (
                                        <div className={`w-5 h-5 bg-gradient-to-br ${tier.color} rounded-sm relative`}>
                                            <Image
                                                src={tier.iconPath}
                                                alt={`${tier.name} icon`}
                                                fill
                                                className="object-contain p-0.5"
                                            />
                                        </div>
                                    ) : (
                                        tier.icon
                                    )}
                                </div>
                                {(isSidebarOpen || window?.innerWidth >= 768) && (
                                    <span className={`ml-3 text-sm font-medium whitespace-nowrap ${!isSidebarOpen ? 'md:hidden' : ''}`}>
                                        {tier.name}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`pt-20 transition-all duration-300 
                ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} 
                ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}