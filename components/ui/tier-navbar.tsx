'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

const tierItems = [
    {
        name: 'Top Tier',
        path: '/membership/tier-1',
        icon: <Image src="/tier-icons/DBW-icon.png" alt="Top Tier" width={28} height={28} />,
        bgColor: 'bg-[#d4af37]',
        hoverClass: 'hover:bg-[#d4af37] hover:bg-opacity-80',
        borderColor: 'border-[#d4af37]'
    },
    {
        name: 'Tier 2',
        path: '/membership/tier-2',
        icon: <Image src="/tier-icons/Rh-icon.png" alt="Tier 2" width={28} height={28} />,
        bgColor: 'bg-[#00bf63]',
        hoverClass: 'hover:bg-[#00bf63] hover:bg-opacity-80',
        borderColor: 'border-[#00bf63]'
    },
    {
        name: 'Tier 3',
        path: '/membership/tier-3',
        icon: <Image src="/tier-icons/Pt-icon.png" alt="Tier 3" width={28} height={28} />,
        bgColor: 'bg-[#ff8018]',
        hoverClass: 'hover:bg-[#ff8018] hover:bg-opacity-80',
        borderColor: 'border-[#ff8018]'
    },
    {
        name: 'Tier 4',
        path: '/membership/tier-4',
        icon: <Image src="/tier-icons/Au-icon.png" alt="Tier 4" width={28} height={28} />,
        bgColor: 'bg-[#d4af37]',
        hoverClass: 'hover:bg-[#d4af37] hover:bg-opacity-80',
        borderColor: 'border-[#d4af37]'
    },
    {
        name: 'Tier 5',
        path: '/membership/tier-5',
        icon: <Image src="/tier-icons/Ru-icon.png" alt="Tier 5" width={28} height={28} />,
        bgColor: 'bg-[#f6cefc]',
        hoverClass: 'hover:bg-[#f6cefc] hover:bg-opacity-80',
        borderColor: 'border-[#f6cefc]'
    },
    {
        name: 'Tier 6',
        path: '/membership/tier-6',
        icon: <Image src="/tier-icons/Ir-icon.png" alt="Tier 6" width={28} height={28} />,
        bgColor: 'bg-[#BC1A1E]',
        hoverClass: 'hover:bg-[#BC1A1E] hover:bg-opacity-80',
        borderColor: 'border-[#BC1A1E]'
    },
    {
        name: 'Tier 7',
        path: '/membership/tier-7',
        icon: <Image src="/tier-icons/Os-icon.png" alt="Tier 7" width={28} height={28} />,
        bgColor: 'bg-[#0099CC]',
        hoverClass: 'hover:bg-[#0099CC] hover:bg-opacity-80',
        borderColor: 'border-[#0099CC]'
    },
    {
        name: 'Tier 8',
        path: '/membership/tier-8',
        icon: <Image src="/tier-icons/Pd-icon.png" alt="Tier 8" width={28} height={28} />,
        bgColor: 'bg-[#2ECC71]',
        hoverClass: 'hover:bg-[#2ECC71] hover:bg-opacity-80',
        borderColor: 'border-[#2ECC71]'
    },
    {
        name: 'Tier 9',
        path: '/membership/tier-9',
        icon: <Image src="/tier-icons/Re-icon.png" alt="Tier 9" width={28} height={28} />,
        bgColor: 'bg-[#FFD700]',
        hoverClass: 'hover:bg-[#FFD700] hover:bg-opacity-80',
        borderColor: 'border-[#FFD700]'
    }
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
                    className={`w-full flex items-center justify-between px-4 py-3 ${currentTier.bgColor} bg-opacity-90 backdrop-blur-sm border-b ${currentTier.borderColor}`}
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
                    <div className="absolute w-full bg-black/90 backdrop-blur-sm">
                        {tierItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMobileDropdownOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 
                                    transition-all duration-300 ease-in-out
                                    ${pathname === item.path ? `${item.bgColor} bg-opacity-90` : 'hover:bg-opacity-20'}
                                    ${item.hoverClass}
                                    border-b ${item.borderColor}
                                    text-white
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
                                ${item.bgColor} ${pathname === item.path ? 'bg-opacity-90' : 'bg-opacity-20'}
                                ${item.hoverClass}
                                border ${item.borderColor}
                                text-white
                                whitespace-nowrap
                                relative
                                group
                            `}
                        >
                            {/* Shimmer effect */}
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