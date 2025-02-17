"use client";
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface TierFeatures {
    "Blog Access": string;
    "XXX Tokens": string;
    "Zoom Calls": string;
    "NFT Cashback": string;
    "Revenue Split": string;
    "Sweepstake Tickets": string;
    "Monthly Cost": string;
    "Contributors Access": boolean;
    "Video Library": boolean;
    "Knowledge Tests": boolean;
    "Early Features": boolean;
    "Early Launches": boolean;
    "Airdrops": boolean;
    "Monthly Giveaways"?: boolean;
    "More Courses"?: boolean;
}

interface Tier {
    name: string;
    displayName: string;
    textColor: string;
    gradientFrom: string;
    gradientTo: string;
    hoverGradient: string;
    features: TierFeatures;
}

const featureOrder: (keyof TierFeatures)[] = [
    "Video Library",
    "Blog Access",
    "Contributors Access",
    "More Courses",
    "Knowledge Tests",
    "Early Features",
    "Early Launches",
    "XXX Tokens",
    "Airdrops",
    "Monthly Giveaways",
    "Zoom Calls",
    "NFT Cashback",
    "Revenue Split",
    "Sweepstake Tickets",
    "Monthly Cost"
];

const TierComparison = () => {
    const [activeTierIndex, setActiveTierIndex] = useState(0);

    const tiers: Tier[] = [
        {
            name: "Top Tier",
            displayName: "DBW",
            textColor: "text-white",
            gradientFrom: "from-neutral-900",
            gradientTo: "to-neutral-800",
            hoverGradient: "hover:from-neutral-800 hover:to-neutral-700",
            features: {
                "Blog Access": "Tier 1 Blog",
                "XXX Tokens": "2,400,000",
                "Zoom Calls": "Weekly",
                "NFT Cashback": "100%",
                "Revenue Split": "10%",
                "Sweepstake Tickets": "64 draws",
                "Monthly Cost": "Premium",
                "Contributors Access": true,
                "Video Library": true,
                "Knowledge Tests": true,
                "Early Features": true,
                "Early Launches": true,
                "Airdrops": true,
                "Monthly Giveaways": false,
                "More Courses": true
            }
        },
        {
            name: "Rhodium",
            displayName: "Rh",
            textColor: "text-white",
            gradientFrom: "from-gray-200",
            gradientTo: "to-gray-400",
            hoverGradient: "hover:from-gray-300 hover:to-gray-500",
            features: {
                "Blog Access": "Tier 2 Blog",
                "XXX Tokens": "1,200,000",
                "Zoom Calls": "Every 2 weeks",
                "NFT Cashback": "95%",
                "Revenue Split": "15%",
                "Sweepstake Tickets": "32 draws",
                "Monthly Cost": "Premium",
                "Contributors Access": false,
                "Video Library": true,
                "Knowledge Tests": true,
                "Early Features": true,
                "Early Launches": true,
                "Airdrops": true,
                "More Courses": true
            }
        },
        {
            name: "Platinum",
            displayName: "Pt",
            textColor: "text-white",
            gradientFrom: "from-[#E5E4E2]",
            gradientTo: "to-[#A9A9A9]",
            hoverGradient: "hover:from-[#C0C0C0] hover:to-[#808080]",
            features: {
                "Blog Access": "Tier 3 Blog",
                "XXX Tokens": "600,000",
                "Zoom Calls": "Monthly",
                "NFT Cashback": "90%",
                "Revenue Split": "20%",
                "Sweepstake Tickets": "16 draws",
                "Monthly Cost": "Premium",
                "Contributors Access": false,
                "Video Library": true,
                "Knowledge Tests": true,
                "Early Features": true,
                "Early Launches": true,
                "Airdrops": true,
                "More Courses": true
            }
        },
        {
            name: "Gold",
            displayName: "Au",
            textColor: "text-white",
            gradientFrom: "from-yellow-500",
            gradientTo: "to-yellow-600",
            hoverGradient: "hover:from-yellow-400 hover:to-yellow-500",
            features: {
                "Blog Access": "Tier 4 Blog",
                "XXX Tokens": "300,000",
                "Zoom Calls": "Every 2 months",
                "NFT Cashback": "85%",
                "Revenue Split": "25%",
                "Sweepstake Tickets": "8 draws",
                "Monthly Cost": "Premium",
                "Contributors Access": false,
                "Video Library": true,
                "Knowledge Tests": true,
                "Early Features": true,
                "Early Launches": true,
                "Airdrops": true,
                "More Courses": true
            }
        },
        {
            name: "Ruthenium",
            displayName: "Ru",
            textColor: "text-white",
            gradientFrom: "from-neutral-900",
            gradientTo: "to-neutral-800",
            hoverGradient: "hover:from-neutral-800 hover:to-neutral-700",
            features: {
                "Blog Access": "General Blog",
                "XXX Tokens": "150,000",
                "Zoom Calls": "Every 3 months",
                "NFT Cashback": "80%",
                "Revenue Split": "30%",
                "Sweepstake Tickets": "4 draws",
                "Monthly Cost": "$2/month",
                "Contributors Access": false,
                "Video Library": true,
                "Knowledge Tests": true,
                "Early Features": true,
                "Early Launches": true,
                "Airdrops": false,
                "Monthly Giveaways": true
            }
        },
        {
            name: "Iridium",
            displayName: "Ir",
            textColor: "text-white",
            gradientFrom: "from-red-700",
            gradientTo: "to-red-900",
            hoverGradient: "hover:from-red-600 hover:to-red-800",
            features: {
                "Blog Access": "General Blog",
                "XXX Tokens": "15,000",
                "Zoom Calls": "Every 2 months",
                "NFT Cashback": "No",
                "Revenue Split": "No",
                "Sweepstake Tickets": "No",
                "Monthly Cost": "$2/month",
                "Contributors Access": false,
                "Video Library": true,
                "Knowledge Tests": true,
                "Early Features": true,
                "Early Launches": true,
                "Airdrops": false,
                "Monthly Giveaways": true
            }
        },
        {
            name: "Osmium",
            displayName: "Os",
            textColor: "text-white",
            gradientFrom: "from-blue-400",
            gradientTo: "to-blue-600",
            hoverGradient: "hover:from-blue-300 hover:to-blue-500",
            features: {
                "Blog Access": "General Blog",
                "XXX Tokens": "7,500",
                "Zoom Calls": "Every 3 months",
                "NFT Cashback": "No",
                "Revenue Split": "No",
                "Sweepstake Tickets": "No",
                "Monthly Cost": "$1/month",
                "Contributors Access": false,
                "Video Library": true,
                "Knowledge Tests": true,
                "Early Features": true,
                "Early Launches": true,
                "Airdrops": false,
                "Monthly Giveaways": true
            }
        }
    ];

    const nextTier = () => {
        setActiveTierIndex((prev) => (prev + 1) % tiers.length);
    };

    const prevTier = () => {
        setActiveTierIndex((prev) => (prev - 1 + tiers.length) % tiers.length);
    };

    const DesktopTable = () => (
        <div className="hidden md:block overflow-x-auto">
            <Table className="w-full border-collapse min-w-[900px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white bg-black/20 sticky left-0 z-10">Features</TableHead>
                        {tiers.map((tier) => (
                            <TableHead key={tier.name} className="text-center min-w-[150px]">
                                <div className="space-y-2">
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
                                    {typeof tier.features[feature] === 'boolean' ? (
                                        tier.features[feature] ?
                                            <Check className="mx-auto text-green-500" /> :
                                            <X className="mx-auto text-red-500" />
                                    ) : (
                                        <span className="text-gray-200">{tier.features[feature]}</span>
                                    )}
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
                                {typeof activeTier.features[feature] === 'boolean' ? (
                                    activeTier.features[feature] ? (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-green-500">Yes</span>
                                            <Check className="text-green-500 w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-red-500">No</span>
                                            <X className="text-red-500 w-5 h-5" />
                                        </div>
                                    )
                                ) : (
                                    <span className="text-gray-200 font-medium ml-4">
                                        {activeTier.features[feature]}
                                    </span>
                                )}
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
        <div className="p-4 bg-gray/50 space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Tier Comparison</h2>
            <DesktopTable />
            <MobileView />
        </div>
    );
};

export default TierComparison;