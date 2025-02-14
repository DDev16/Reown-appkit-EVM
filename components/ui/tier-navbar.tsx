'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Crown,
    Star,
    Shield,
    Rocket,
    Bolt,
    Compass,
    Triangle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const tierItems = [
    {
        name: 'Top Tier',
        path: '/membership/tier-1',
        icon: <Crown className="w-5 h-5 text-[#BC1A1E]" />,
        hoverClass: 'hover:bg-[#BC1A1E]/30 hover:border-[#BC1A1E]',
        activeClass: 'bg-[#BC1A1E]/20 border-[#BC1A1E]'
    },
    {
        name: 'Tier 2',
        path: '/membership/tier-2',
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        hoverClass: 'hover:bg-yellow-500/30 hover:border-yellow-500',
        activeClass: 'bg-yellow-500/20 border-yellow-500'
    },
    {
        name: 'Tier 3',
        path: '/membership/tier-3',
        icon: <Shield className="w-5 h-5 text-blue-500" />,
        hoverClass: 'hover:bg-blue-500/30 hover:border-blue-500',
        activeClass: 'bg-blue-500/20 border-blue-500'
    },
    {
        name: 'Tier 4',
        path: '/membership/tier-4',
        icon: <Rocket className="w-5 h-5 text-purple-500" />,
        hoverClass: 'hover:bg-purple-500/30 hover:border-purple-500',
        activeClass: 'bg-purple-500/20 border-purple-500'
    },
    {
        name: 'Tier 5',
        path: '/membership/tier-5',
        icon: <Bolt className="w-5 h-5 text-orange-500" />,
        hoverClass: 'hover:bg-orange-500/30 hover:border-orange-500',
        activeClass: 'bg-orange-500/20 border-orange-500'
    },
    {
        name: 'Tier 6',
        path: '/membership/tier-6',
        icon: <Compass className="w-5 h-5 text-green-500" />,
        hoverClass: 'hover:bg-green-500/30 hover:border-green-500',
        activeClass: 'bg-green-500/20 border-green-500'
    },
    {
        name: 'Tier 7',
        path: '/membership/tier-7',
        icon: <Triangle className="w-5 h-5 text-pink-500" />,
        hoverClass: 'hover:bg-pink-500/30 hover:border-pink-500',
        activeClass: 'bg-pink-500/20 border-pink-500'
    },
];

const TierNavbar = () => {
    const pathname = usePathname();
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

    const toggleMobileDropdown = () => {
        setIsMobileDropdownOpen(!isMobileDropdownOpen);
    };

    const currentTier = tierItems.find(item => item.path === pathname) || tierItems[0];

    return (
        <div className="relative z-50">
            {/* Mobile Dropdown */}
            <div className="sm:hidden">
                <button
                    onClick={toggleMobileDropdown}
                    className="w-full flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-[#BC1A1E]/20"
                >
                    <div className="flex items-center gap-2">
                        {currentTier.icon}
                        <span className="text-white font-semibold">{currentTier.name}</span>
                    </div>
                    {isMobileDropdownOpen ? (
                        <ChevronUp className="text-white" />
                    ) : (
                        <ChevronDown className="text-white" />
                    )}
                </button>

                {isMobileDropdownOpen && (
                    <div className="absolute w-full bg-black/90 backdrop-blur-sm border-b border-[#BC1A1E]/20">
                        {tierItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMobileDropdownOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 
                                    transition-all duration-300 ease-in-out
                                    ${pathname === item.path
                                        ? 'bg-[#BC1A1E]/20 text-white'
                                        : 'text-gray-300 hover:bg-[#BC1A1E]/10'}
                                    border border-transparent 
                                    ${item.hoverClass}
                                    ${pathname === item.path ? item.activeClass : ''}
                                `}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:block">
                <div className="flex items-center justify-center space-x-4 px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-[#BC1A1E]/20 overflow-x-auto">
                    {tierItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
                                transition-all duration-300 ease-in-out
                                border border-transparent
                                ${pathname === item.path
                                    ? `${item.activeClass} text-white`
                                    : `text-gray-300 ${item.hoverClass}`}
                                whitespace-nowrap
                                relative
                                overflow-hidden
                                group
                            `}
                        >
                            {/* Hover effect background */}
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>

                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TierNavbar;