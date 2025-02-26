'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ChevronRight,
    BarChart3,
    BookOpen,
    Video,
    FileText,
    Star,
    Clock,
    Download,
    Users,
    Info,
    GraduationCap,
    BookOpenCheck,
    Calendar
} from 'lucide-react';

interface TierLayoutProps {
    children: React.ReactNode;
}

export default function TierLayout({ children }: TierLayoutProps) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('overview');
    const [currentTier, setCurrentTier] = useState<number>(1);

    // Extract tier number from URL
    useEffect(() => {
        const tierMatch = pathname.match(/tier-(\d+)/);
        if (tierMatch && tierMatch[1]) {
            setCurrentTier(parseInt(tierMatch[1]));
        }
    }, [pathname]);

    // Determine which tab is active based on URL
    useEffect(() => {
        if (pathname.includes('/resources')) {
            setActiveTab('resources');
        } else if (pathname.includes('/videos')) {
            setActiveTab('videos');
        } else if (pathname.includes('/courses')) {
            setActiveTab('courses');
        } else if (pathname.includes('/blogs')) {
            setActiveTab('blogs');
        } else if (pathname.includes('/tests')) {
            setActiveTab('tests');
        } else if (pathname.includes('/calls')) {
            setActiveTab('calls');
        } else if (pathname.includes('/documents')) {
            setActiveTab('documents');
        } else if (pathname.includes('/community')) {
            setActiveTab('community');
        } else if (pathname.includes('/faq')) {
            setActiveTab('faq');
        } else {
            setActiveTab('overview');
        }
    }, [pathname]);

    // Get tier name based on tier number
    const getTierName = () => {
        const tierMap: { [key: number]: string } = {
            1: 'TOP TIER',
            2: 'RHODIUM',
            3: 'PLATINUM',
            4: 'GOLD',
            5: 'RUTHENIUM',
            6: 'IRIDIUM',
            7: 'OSMIUM',
            8: 'PALLADIUM',
            9: 'RHENIUM',
            10: 'SILVER'
        };
        return tierMap[currentTier] || `TIER ${currentTier}`;
    };

    // Get gradient color based on tier
    const getTierGradient = () => {
        const gradientMap: { [key: number]: string } = {
            1: 'from-[#d4af37] via-[#d4af37] to-[#b3941f]',
            2: 'from-[#00bf63] via-[#00bf63] to-[#009e52]',
            3: 'from-[#ff8018] via-[#ff8018] to-[#e67216]',
            4: 'from-[#d4af37] via-[#d4af37] to-[#b3941f]',
            5: 'from-[#f6cefc] via-[#f6cefc] to-[#eab5f1]',
            6: 'from-[#BC1A1E] via-[#BC1A1E] to-[#8B1315]',
            7: 'from-[#0099CC] via-[#0099CC] to-[#007399]',
            8: 'from-[#2ECC71] via-[#2ECC71] to-[#27AE60]',
            9: 'from-[#FFD700] via-[#FFD700] to-[#FFC000]',
            10: 'from-[#C0C0C0] via-[#C0C0C0] to-[#A9A9A9]'
        };
        return gradientMap[currentTier] || 'from-red-600 to-red-800';
    };

    const navigation = [
        {
            name: 'Overview',
            href: `/dashboard/tier-${currentTier}`,
            icon: <BarChart3 size={18} />,
            id: 'overview'
        },
        {
            name: 'Video Library',
            href: `/dashboard/tier-${currentTier}/videos`,
            icon: <Video size={18} />,
            id: 'videos'
        },
        {
            name: 'Courses',
            href: `/dashboard/tier-${currentTier}/courses`,
            icon: <GraduationCap size={18} />,
            id: 'courses'
        },
        {
            name: 'Blogs',
            href: `/dashboard/tier-${currentTier}/blogs`,
            icon: <BookOpen size={18} />,
            id: 'blogs'
        },
        {
            name: 'Knowledge Tests',
            href: `/dashboard/tier-${currentTier}/tests`,
            icon: <BookOpenCheck size={18} />,
            id: 'tests'
        },
        {
            name: 'Zoom Calls',
            href: `/dashboard/tier-${currentTier}/calls`,
            icon: <Calendar size={18} />,
            id: 'calls'
        },
        {
            name: 'Documents',
            href: `/dashboard/tier-${currentTier}/documents`,
            icon: <FileText size={18} />,
            id: 'documents'
        },
        {
            name: 'Resources',
            href: `/dashboard/tier-${currentTier}/resources`,
            icon: <Star size={18} />,
            id: 'resources'
        },
        {
            name: 'Community',
            href: `/dashboard/tier-${currentTier}/community`,
            icon: <Users size={18} />,
            id: 'community'
        },
        {
            name: 'FAQ',
            href: `/dashboard/tier-${currentTier}/faq`,
            icon: <Info size={18} />,
            id: 'faq'
        }
    ];

    return (
        <div>
            {/* Tier header with gradient background */}
            <div className={`bg-gradient-to-r ${getTierGradient()} mb-6 p-4 rounded-lg shadow-lg`}>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">{getTierName()} {`(Tier-${currentTier})`}</h1>

                    <div className="bg-black/20 px-3 py-1 rounded-full text-white text-sm">
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> Premium Content
                        </span>
                    </div>
                </div>
                <p className="text-white/80 mt-1">Exclusive content and resources for {getTierName()} members</p>

                {/* Tier navigation tabs */}
                <div className="mt-6 flex flex-wrap gap-2 sm:gap-0">
                    {navigation.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center px-3 py-2 rounded-t-lg text-sm font-medium transition-colors
                                ${activeTab === item.id ?
                                    'bg-black text-white' :
                                    'bg-black/20 text-white/80 hover:bg-black/40'}
                            `}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main content area */}
            <div className="bg-black/20 border border-red-900/30 rounded-lg p-4 min-h-[calc(100vh-16rem)]">
                {children}
            </div>

            {/* Recent updates section */}
            <div className="mt-6 bg-black/20 border border-red-900/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-white">Recent Updates</h2>
                    <a href="#" className="text-sm text-red-400 hover:text-red-300 flex items-center">
                        View all <ChevronRight size={16} />
                    </a>
                </div>

                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg">
                            <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded">
                                {i === 1 ? <Video size={18} /> : i === 2 ? <FileText size={18} /> : <BookOpen size={18} />}
                            </div>
                            <div>
                                <h3 className="font-medium text-white">
                                    {i === 1 ? 'New Video Added' : i === 2 ? 'Important Document Updated' : 'New Training Course'}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {i === 1
                                        ? 'Advanced strategies for tier members - watch now'
                                        : i === 2
                                            ? 'Critical updates to our methodology - version 2.5'
                                            : 'Enroll in our latest comprehensive training module'}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <button className="bg-red-900/30 hover:bg-red-900/50 text-white text-xs px-3 py-1 rounded flex items-center gap-1">
                                        <Download size={14} /> Download
                                    </button>
                                    <button className="bg-black/40 hover:bg-black/60 text-white text-xs px-3 py-1 rounded">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}