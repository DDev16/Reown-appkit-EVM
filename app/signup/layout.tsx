'use client';
//app\dashboard\layout.tsx
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    LogOut,
    ChevronDown,
    Layout,
    Crown,
    Diamond,
    Binary,
    Gem,
    Rocket,
    Target,
    Award
} from 'lucide-react';

// Define membership tiers with routes
const MEMBERSHIP_TIERS = [
    {
        id: 1,
        name: 'Tier 1',
        path: '/dashboard/tier-1',
        icon: <Gem className="w-5 h-5" />,
        color: 'from-zinc-400 to-zinc-600'
    },
    {
        id: 2,
        name: 'Tier 2',
        path: '/dashboard/tier-2',
        icon: <Binary className="w-5 h-5" />,
        color: 'from-blue-400 to-blue-600'
    },
    {
        id: 3,
        name: 'Tier 3',
        path: '/dashboard/tier-3',
        icon: <Target className="w-5 h-5" />,
        color: 'from-green-400 to-green-600'
    },
    {
        id: 4,
        name: 'Tier 4',
        path: '/dashboard/tier-4',
        icon: <Rocket className="w-5 h-5" />,
        color: 'from-yellow-400 to-yellow-600'
    },
    {
        id: 5,
        name: 'Tier 5',
        path: '/dashboard/tier-5',
        icon: <Award className="w-5 h-5" />,
        color: 'from-orange-400 to-orange-600'
    },
    {
        id: 6,
        name: 'Tier 6',
        path: '/dashboard/tier-6',
        icon: <Diamond className="w-5 h-5" />,
        color: 'from-purple-400 to-purple-600'
    },
    {
        id: 7,
        name: 'Tier 7',
        path: '/dashboard/tier-7',
        icon: <Crown className="w-5 h-5" />,
        color: 'from-red-400 to-red-600'
    }
];
export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(auth.currentUser);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Close sidebar by default on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 border-b border-red-900/30 bg-black/90 backdrop-blur-sm">
                <div className="px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                            >
                                <Layout className="w-5 h-5" />
                            </button>
                            <Link href="/dashboard" className="flex items-center">
                                <Image
                                    src="/assets/BullHead.png"
                                    alt="DeFiBullWorld"
                                    width={40}
                                    height={40}
                                    className="ml-4 rounded-full"
                                />
                                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent">
                                    DeFiBullWorld
                                </span>
                            </Link>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                                    <span>{user?.email}</span>
                                    <ChevronDown size={20} />
                                </button>
                                <div className="absolute right-0 w-48 mt-2 py-2 bg-black border border-red-900/30 rounded-lg shadow-xl hidden group-hover:block">
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-red-900/20 w-full"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar - Different behavior for mobile and desktop */}
            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-black/90 border-r border-red-900/30 transition-all duration-300 z-40
                    md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-64'} 
                    ${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'}`}
            >
                <div className="p-4 min-w-[256px] md:min-w-0">
                    <div className="space-y-2">
                        <Link
                            href="/dashboard"
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === '/dashboard'
                                    ? 'bg-red-900/20 text-white'
                                    : 'text-gray-400 hover:bg-red-900/10 hover:text-white'
                                }`}
                        >
                            <Layout className="w-5 h-5" />
                            <span className={`ml-3 text-sm font-medium ${!isSidebarOpen ? 'md:hidden' : ''}`}>
                                Overview
                            </span>
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
                                {tier.icon}
                                <span className={`ml-3 text-sm font-medium ${!isSidebarOpen ? 'md:hidden' : ''}`}>
                                    {tier.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`pt-16 transition-all duration-300 
                ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} 
                ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
            >
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}