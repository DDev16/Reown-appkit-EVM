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
        icon: <Image src="/tier-icons/DBW-icon.png" alt="Top Tier" width={34} height={34} />,
        bgColor: 'bg-[#BC1A1E]',
        hoverClass: 'hover:bg-[#BC1A1E] hover:bg-opacity-80',
        borderColor: 'border-[#BC1A1E]'
    },
    {
        name: 'Tier 2',
        path: '/membership/tier-2',
        icon: <Image src="/tier-icons/Rh-icon.png" alt="Tier 2" width={34} height={34} />,
        bgColor: 'bg-[#BC1A1E]',
        hoverClass: 'hover:bg-[#BC1A1E] hover:bg-opacity-80',
        borderColor: 'border-[#BC1A1E]'
    },
    {
        name: 'Tier 3',
        path: '/membership/tier-3',
        icon: <Image src="/tier-icons/Pt-icon.png" alt="Tier 3" width={34} height={34} />,
        bgColor: 'bg-gray-200',
        hoverClass: 'hover:bg-gray-300 hover:bg-opacity-80',
        borderColor: 'border-gray-400'
    },
    {
        name: 'Tier 4',
        path: '/membership/tier-4',
        icon: <Image src="/tier-icons/Au-icon.png" alt="Tier 4" width={34} height={34} />,
        bgColor: 'bg-yellow-500',
        hoverClass: 'hover:bg-yellow-500 hover:bg-opacity-80',
        borderColor: 'border-yellow-500'
    },
    {
        name: 'Tier 5',
        path: '/membership/tier-5',
        icon: <Image src="/tier-icons/Ru-icon.png" alt="Tier 5" width={34} height={34} />,
        bgColor: 'bg-orange-500',
        hoverClass: 'hover:bg-orange-500 hover:bg-opacity-80',
        borderColor: 'border-orange-500'
    },
    {
        name: 'Tier 6',
        path: '/membership/tier-6',
        icon: <Image src="/tier-icons/Ir-icon.png" alt="Tier 6" width={34} height={34} />,
        bgColor: 'bg-[#BC1A1E]',
        hoverClass: 'hover:bg-[#BC1A1E] hover:bg-opacity-80',
        borderColor: 'border-[#BC1A1E]'
    },
    {
        name: 'Tier 7',
        path: '/membership/tier-7',
        icon: <Image src="/tier-icons/Os-icon.png" alt="Tier 7" width={34} height={34} />,
        bgColor: 'bg-blue-500',
        hoverClass: 'hover:bg-blue-500 hover:bg-opacity-80',
        borderColor: 'border-blue-500'
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