'use client';

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface TierFeatures {
    "No of NFTs": number;
    "NFT Price": number;
    "Costs p/m With Kickback": number;
    "Costs p/m Without Kickback": number;
    "Profit after 60 Months": boolean | string;
    "DBW Tokens": number;
    "Airdrops": boolean;
    "Blog Access": string;
    "Public Blog": boolean;
    "Library": boolean;
    "Dictionary": boolean;
    "Video Library": boolean;
    "Courses": string;
    "Knowledge Tests": boolean;
    "E-Books": boolean;
    "Zoom Calls": string;
    "Max Cashback": string;
    "Minimum Cashback": string;
    "Cashback Guarantee": boolean;
    "Revenue Share": string;
    "Early Access Platform Tokens": boolean;
    "Early Access New Collections": boolean;
    "Token Drops": boolean;
    "Sweepstake Tickets": number;
    "Contributor Access": boolean;
}

interface Tier {
    name: string;
    displayName: string;
    icon: string;
    textColor: string;
    gradientFrom: string;
    gradientTo: string;
    hoverGradient: string;
    features: TierFeatures;
}

const TIER_COLORS = {
    1: {
        gradientFrom: "from-[#d4af37]",
        gradientTo: "to-[#b3941f]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#b3941f] hover:to-[#d4af37]"
    },
    2: {
        gradientFrom: "from-[#00bf63]",
        gradientTo: "to-[#009e52]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#009e52] hover:to-[#00bf63]"
    },
    3: {
        gradientFrom: "from-[#ff8018]",
        gradientTo: "to-[#e67216]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#e67216] hover:to-[#ff8018]"
    },
    4: {
        gradientFrom: "from-[#d4af37]",
        gradientTo: "to-[#b3941f]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#b3941f] hover:to-[#d4af37]"
    },
    5: {
        gradientFrom: "from-[#f6cefc]",
        gradientTo: "to-[#eab5f1]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#eab5f1] hover:to-[#f6cefc]"
    },
    6: {
        gradientFrom: "from-[#BC1A1E]",
        gradientTo: "to-[#8B1315]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#8B1315] hover:to-[#BC1A1E]"
    },
    7: {
        gradientFrom: "from-[#0099CC]",
        gradientTo: "to-[#007399]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#007399] hover:to-[#0099CC]"
    },
    8: {
        gradientFrom: "from-[#2ECC71]",
        gradientTo: "to-[#27AE60]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#27AE60] hover:to-[#2ECC71]"
    },
    9: {
        gradientFrom: "from-[#FFD700]",
        gradientTo: "to-[#FFC000]",
        textColor: "text-white",
        hoverGradient: "hover:from-[#FFC000] hover:to-[#FFD700]"
    }
};

const featureOrder: (keyof TierFeatures)[] = [
    "No of NFTs",
    "NFT Price",
    "Costs p/m With Kickback",
    "Costs p/m Without Kickback",
    "Profit after 60 Months",
    "DBW Tokens",
    "Airdrops",
    "Blog Access",
    "Public Blog",
    "Library",
    "Dictionary",
    "Video Library",
    "Courses",
    "Knowledge Tests",
    "E-Books",
    "Zoom Calls",
    "Max Cashback",
    "Minimum Cashback",
    "Cashback Guarantee",
    "Revenue Share",
    "Early Access Platform Tokens",
    "Early Access New Collections",
    "Token Drops",
    "Sweepstake Tickets",
    "Contributor Access"
];

const TierComparison = () => {
    const [activeTierIndex, setActiveTierIndex] = useState(0);

    const tiers: Tier[] = [
        {
            name: "Top Tier",
            displayName: "DBW",
            icon: "/tier-icons/DBW-icon.png",
            ...TIER_COLORS[1],
            features: {
                "No of NFTs": 25,
                "NFT Price": 400000,
                "Costs p/m With Kickback": 160000,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": true,
                "DBW Tokens": 32000,
                "Airdrops": true,
                "Blog Access": "Tier 1",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "Tier 1",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Weekly",
                "Max Cashback": "100%",
                "Minimum Cashback": "75%",
                "Cashback Guarantee": true,
                "Revenue Share": "10%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 12,
                "Contributor Access": true
            }
        },
        {
            name: "Rhodium",
            displayName: "Rh",
            icon: "/tier-icons/Rh-icon.png",
            ...TIER_COLORS[2],
            features: {
                "No of NFTs": 50,
                "NFT Price": 200000,
                "Costs p/m With Kickback": 80000,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": true,
                "DBW Tokens": 16000,
                "Airdrops": true,
                "Blog Access": "Tier 2",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "Tier 2",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Bi-Weekly",
                "Max Cashback": "100%",
                "Minimum Cashback": "75%",
                "Cashback Guarantee": true,
                "Revenue Share": "15%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 12,
                "Contributor Access": false
            }
        },
        {
            name: "Platinum",
            displayName: "Pt",
            icon: "/tier-icons/Pt-icon.png",
            ...TIER_COLORS[3],
            features: {
                "No of NFTs": 100,
                "NFT Price": 100000,
                "Costs p/m With Kickback": 40000,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": true,
                "DBW Tokens": 8000,
                "Airdrops": true,
                "Blog Access": "Tier 3",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "Tier 3",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Monthly",
                "Max Cashback": "100%",
                "Minimum Cashback": "75%",
                "Cashback Guarantee": true,
                "Revenue Share": "20%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 12,
                "Contributor Access": false
            }
        },
        {
            name: "Gold",
            displayName: "Au",
            icon: "/tier-icons/Au-icon.png",
            ...TIER_COLORS[4],
            features: {
                "No of NFTs": 200,
                "NFT Price": 50000,
                "Costs p/m With Kickback": 20000,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": true,
                "DBW Tokens": 4000,
                "Airdrops": true,
                "Blog Access": "Tier 4",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "Tier 4",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Per 2 months",
                "Max Cashback": "100%",
                "Minimum Cashback": "75%",
                "Cashback Guarantee": true,
                "Revenue Share": "25%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 12,
                "Contributor Access": false
            }
        },
        {
            name: "Ruthenium",
            displayName: "Ru",
            icon: "/tier-icons/Ru-icon.png",
            ...TIER_COLORS[5],
            features: {
                "No of NFTs": 400,
                "NFT Price": 25000,
                "Costs p/m With Kickback": 10000,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": true,
                "DBW Tokens": 2000,
                "Airdrops": true,
                "Blog Access": "Tier 5",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "Tier 5",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Per 3 months",
                "Max Cashback": "100%",
                "Minimum Cashback": "75%",
                "Cashback Guarantee": true,
                "Revenue Share": "30%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 12,
                "Contributor Access": false
            }
        },
        {
            name: "Iridium",
            displayName: "Ir",
            icon: "/tier-icons/Ir-icon.png",
            ...TIER_COLORS[6],
            features: {
                "No of NFTs": 800,
                "NFT Price": 10000,
                "Costs p/m With Kickback": 4000,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": true,
                "DBW Tokens": 800,
                "Airdrops": true,
                "Blog Access": "General",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "General",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Per 6 months",
                "Max Cashback": "50%",
                "Minimum Cashback": "25%",
                "Cashback Guarantee": true,
                "Revenue Share": "0%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 0,
                "Contributor Access": false
            }
        },
        {
            name: "Osmium",
            displayName: "Os",
            icon: "/tier-icons/Os-icon.png",
            ...TIER_COLORS[7],
            features: {
                "No of NFTs": 1600,
                "NFT Price": 5000,
                "Costs p/m With Kickback": 2000,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": "Likely",
                "DBW Tokens": 400,
                "Airdrops": true,
                "Blog Access": "General",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "General",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Per 6 months",
                "Max Cashback": "40%",
                "Minimum Cashback": "20%",
                "Cashback Guarantee": true,
                "Revenue Share": "0%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 0,
                "Contributor Access": false
            }
        },
        {
            name: "Palladium",
            displayName: "Pd",
            icon: "/tier-icons/Pd-icon.png",
            ...TIER_COLORS[8],
            features: {
                "No of NFTs": 3200,
                "NFT Price": 2500,
                "Costs p/m With Kickback": 1000,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": "Likely",
                "DBW Tokens": 200,
                "Airdrops": true,
                "Blog Access": "General",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "General",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Per 6 months",
                "Max Cashback": "30%",
                "Minimum Cashback": "15%",
                "Cashback Guarantee": true,
                "Revenue Share": "0%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 0,
                "Contributor Access": false
            }
        },
        {
            name: "Rhenium",
            displayName: "Re",
            icon: "/tier-icons/Re-icon.png",
            ...TIER_COLORS[9],
            features: {
                "No of NFTs": 6400,
                "NFT Price": 1250,
                "Costs p/m With Kickback": 50,
                "Costs p/m Without Kickback": 0,
                "Profit after 60 Months": "Likely",
                "DBW Tokens": 100,
                "Airdrops": true,
                "Blog Access": "General",
                "Public Blog": true,
                "Library": true,
                "Dictionary": true,
                "Video Library": true,
                "Courses": "General",
                "Knowledge Tests": true,
                "E-Books": true,
                "Zoom Calls": "Per 6 months",
                "Max Cashback": "20%",
                "Minimum Cashback": "10%",
                "Cashback Guarantee": true,
                "Revenue Share": "0%",
                "Early Access Platform Tokens": true,
                "Early Access New Collections": true,
                "Token Drops": true,
                "Sweepstake Tickets": 0,
                "Contributor Access": false
            }
        }
    ];

    const nextTier = () => {
        setActiveTierIndex((prev) => (prev + 1) % tiers.length);
    };

    const prevTier = () => {
        setActiveTierIndex((prev) => (prev - 1 + tiers.length) % tiers.length);
    };

    const renderCell = (value: any) => {
        if (typeof value === 'boolean') {
            return value ?
                <Check className="mx-auto text-green-500 w-5 h-5" /> :
                <X className="mx-auto text-red-500 w-5 h-5" />;
        }
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        return value || '-';
    };

    const DesktopTable = () => (
        <div className="hidden md:block overflow-x-auto">
            <Table className="w-full border-collapse min-w-[900px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white bg-black/20 sticky left-0 z-10">Features</TableHead>
                        {tiers.map((tier) => (
                            <TableHead key={tier.name} className="text-center min-w-[150px]">
                                <div className="space-y-2 flex flex-col items-center">
                                    <div className="w-16 h-16 mb-2">
                                        <Image
                                            src={tier.icon}
                                            alt={`${tier.name} icon`}
                                            width={64}
                                            height={64}
                                            className="object-contain"
                                        />
                                    </div>
                                    <Badge
                                        className={`w-full py-1 ${tier.textColor} bg-gradient-to-r ${tier.gradientFrom} ${tier.gradientTo} transition-all duration-300 ${tier.hoverGradient}`}
                                    >
                                        {tier.name === "Top Tier" && <Sparkles className="w-4 h-4 inline mr-1" />}
                                        {tier.displayName}
                                    </Badge>
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {featureOrder.map((feature) => (
                        <TableRow key={feature} className="border-b border-white/10">
                            <TableCell className="font-medium text-white bg-black/20 sticky left-0">{feature}</TableCell>
                            {tiers.map((tier) => (
                                <TableCell key={`${tier.name}-${feature}`} className="text-center">
                                    {renderCell(tier.features[feature])}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    const MobileView = () => {
        const activeTier = tiers[activeTierIndex];

        return (
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={prevTier}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Previous tier"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 mb-2">
                            <Image
                                src={activeTier.icon}
                                alt={`${activeTier.name} icon`}
                                width={64}
                                height={64}
                                className="object-contain"
                            />
                        </div>
                        <Badge
                            className={`px-6 py-2 ${activeTier.textColor} bg-gradient-to-r ${activeTier.gradientFrom} ${activeTier.gradientTo} text-lg`}
                        >
                            {activeTier.name === "Top Tier" && <Sparkles className="w-4 h-4 inline mr-1" />}
                            {activeTier.displayName}
                        </Badge>
                        <span className="text-gray-400 text-sm mt-2">{activeTier.name}</span>
                    </div>

                    <button
                        onClick={nextTier}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Next tier"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-3 px-2">
                    {featureOrder.map((feature) => (
                        <div
                            key={feature}
                            className="bg-black/20 p-4 rounded-lg flex justify-between items-center hover:bg-black/30 transition-colors"
                        >
                            <span className="text-white font-medium">{feature}</span>
                            <div className="flex items-center">
                                {renderCell(activeTier.features[feature])}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-2 mt-6">
                    {tiers.map((tier, index) => (
                        <button
                            key={tier.name}
                            onClick={() => setActiveTierIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === activeTierIndex
                                ? 'bg-white scale-110'
                                : 'bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to ${tier.name}`}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 bg-black/50 space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Tier Comparison</h2>
            <DesktopTable />
            <MobileView />
        </div>
    );
};

export default TierComparison;