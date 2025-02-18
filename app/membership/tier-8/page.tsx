"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import Swal, { SweetAlertResult } from 'sweetalert2';
import {
    Crown, Play, BookOpen, Users, Award, Rocket, Coins,
    Gift, Video, ArrowUpRight, Ticket, ChartBar, Sparkles,
} from 'lucide-react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import TierNavbar from '@/components/ui/tier-navbar';

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");

const TIER_8 = 7; // Updated to Tier 7
// Updated ABI to include referrer
const CONTRACT_ABI = [
    {
        name: "mint",
        type: "function",
        stateMutability: "payable",
        inputs: [
            { name: "tier", type: "uint256" },
            { name: "amount", type: "uint256" },
            { name: "_referrer", type: "address" }
        ],
        outputs: []
    },
    {
        name: "getTierSupply",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "tier", type: "uint256" }],
        outputs: [
            { name: "current", type: "uint256" },
            { name: "max", type: "uint256" }
        ]
    },
    {
        name: "getTierPrice",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "tier", type: "uint256" }],
        outputs: [{ name: "price", type: "uint256" }]
    }
];

// Updated benefits for Tier 8 Palladium
const benefits = [
    {
        title: "Access to the video Library",
        icon: <Play />,
        description: "Access to our educational video content library",
    },
    {
        title: "Access to the general Blog",
        icon: <BookOpen />,
        description: "Access to our general blog content and updates",
    },
    {
        title: "Access to our dictionary",
        icon: <BookOpen />,
        description: "Access to our dictionary of terms and definitions",
    },
    {
        title: "Education Value",
        icon: <BookOpen />,
        description: "60+ months of education for just 1 USD per month",
    },
];

const Tier8Page = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [hasShownConfetti, setHasShownConfetti] = useState(false);
    const [referrerAddress, setReferrerAddress] = useState<string | null>(null);

    // Contract reads
    const { data: supplyData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierSupply',
        args: [TIER_8],
    });

    const { data: priceData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierPrice',
        args: [TIER_8],
    });

    // Contract write for minting
    const { writeContract, data: hash, error } = useWriteContract();

    // Wait for transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });


    // Check for referral code on component mount
    useEffect(() => {
        // Check localStorage for referral code
        const storedReferralCode = localStorage.getItem('referralCode');
        if (storedReferralCode) {
            setReferrerAddress(storedReferralCode);
        }
    }, []);

    // Confetti effect function with Palladium colors
    const fireConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999 };

        const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#2ECC71', '#27AE60', '#2ECC71', '#27AE60'], // Palladium themed colors
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#2ECC71', '#27AE60', '#2ECC71', '#27AE60'], // Palladium themed colors
            });
        }, 250);
    };

    // Watch for successful mint and trigger confetti
    useEffect(() => {
        if (isConfirmed) {
            setIsMinting(false);
            if (!hasShownConfetti) {
                fireConfetti();
                setHasShownConfetti(true);

                // Show success message with SweetAlert2
                Swal.fire({
                    title: 'Congratulations on your DBW Palladium Tier NFT! 🎉',
                    text: 'Now that you own one, sign up for an account to access your token gated education page where only users who own Tier-8 NFT have access to!',
                    icon: 'success',
                    confirmButtonText: 'Sign Up Now',
                    confirmButtonColor: '#2ECC71',
                    background: '#1a1a1a',
                    color: '#ffffff',
                    showClass: {
                        popup: 'animate__animated animate__fadeInUp animate__faster'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutDown animate__faster'
                    }
                }).then((result: SweetAlertResult) => {
                    if (result.isConfirmed) {
                        window.location.href = '/signup';
                    }
                });
            }
        }
    }, [isConfirmed, hasShownConfetti]);


    // Handle mint with optional referrer
    const handleMint = async () => {
        if (isMinting) return;

        try {
            setIsMinting(true);
            if (!priceData) {
                throw new Error("Price data not available");
            }

            const price = BigInt(priceData.toString());

            // Mint with referrer if available, otherwise use zero address
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'mint',
                args: [
                    TIER_8,
                    1,
                    referrerAddress || '0x0000000000000000000000000000000000000000'
                ],
                value: price
            });
        } catch (err) {
            console.error('Minting error:', err);
            setIsMinting(false);
        }
    };

    // Format supply and price data
    const formatSupply = () => {
        if (!supplyData || !Array.isArray(supplyData)) return "0/25";
        const [current, max] = supplyData as [bigint, bigint];
        return `${current.toString()}/${max.toString()}`;
    };

    const formatPrice = () => {
        if (!priceData) return "1,250";
        return (Number(priceData) / 1e18).toLocaleString();
    };

    // Animation observer effect
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-fade-in");
                }
            });
        });

        document.querySelectorAll(".benefit-card").forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Get mint button text
    const getMintButtonText = () => {
        if (isConfirming) return "Confirming...";
        if (isMinting) return "Minting...";
        if (isConfirmed) return "Minted!";
        return "Mint Your NFT";
    };

    return (
        <div className="min-h-screen text-white overflow-auto">
            <TierNavbar />
            <div className="relative min-h-screen">
                {/* Background Gradients - Updated to Palladium theme */}
                <div className="absolute inset-0 bg-gradient-radial from-[#2ECC71]/20 via-transparent to-transparent opacity-40"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2ECC71]/10 to-transparent"></div>

                {/* Main content container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-5 relative z-10 flex flex-col justify-center py-8">
                    <div className="grid lg:grid-cols-2 gap-4 items-center">
                        {/* Left Side – NFT & Content */}
                        <div className="space-y-4">
                            {/* Header & Description */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-10 h-10 text-[#2ECC71]" />
                                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2ECC71] to-[#27AE60]">
                                        Palladium Tier NFT
                                    </h1>
                                </div>
                                <p className="text-lg text-gray-400">
                                    Start your DeFi education journey with our most affordable membership
                                </p>
                                {referrerAddress && (
                                    <div className="fixed bottom-4 right-4 bg-black/50 border border-[#2ECC71] rounded-lg p-2 text-sm text-white">
                                        Referral Active: {referrerAddress.slice(0, 6)}...{referrerAddress.slice(-4)}
                                    </div>
                                )}
                            </div>

                            {/* Price / Supply & Mint Button */}
                            <div className="flex items-center justify-center space-y-2 flex-wrap gap-8">
                                <div className="px-4 py-2 bg-black border border-[#2ECC71] rounded-xl text-center shadow-lg shadow-[#2ECC71]/50">
                                    <p className="text-gray-300 text-base font-semibold">
                                        Price: <span className="text-[#2ECC71]">{formatPrice()} FLR</span>
                                    </p>
                                    <p className="text-gray-300 text-base font-semibold">
                                        Supply: <span className="text-[#2ECC71]">{formatSupply()}</span>
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71] via-[#27AE60] to-[#2ECC71] rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                                    <button
                                        onClick={handleMint}
                                        disabled={isMinting || isConfirming || isConfirmed}
                                        className="relative px-7 py-2 bg-black rounded-xl group transition-all duration-300 hover:shadow-2xl hover:shadow-[#2ECC71]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                                        <span className="relative flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-[#2ECC71] group-hover:scale-110 transition-transform duration-300" />
                                            <span className="text-base font-semibold text-white">
                                                {getMintButtonText()}
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* NFT Image */}
                            <div className="relative group">
                                <div className="absolute -inset-3 bg-gradient-to-br from-[#2ECC71] via-[#27AE60] to-[#2ECC71]/50 rounded-2xl opacity-75 group-hover:opacity-100 blur-2xl transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-black/80 to-black p-1 rounded-2xl">
                                    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 2px 2px, rgba(46, 204, 113, 0.4) 2px, transparent 0)",
                                                backgroundSize: "24px 24px",
                                            }}
                                        ></div>
                                        <div className="relative w-full h-full rounded-xl transform group-hover:scale-[1.02] transition-transform duration-500">
                                            <Image
                                                src="/nfts/Palladium.jpg"
                                                alt="Palladium Tier NFT"
                                                fill
                                                sizes="(min-width: 1024px) 40vw, 70vw"
                                                className="object-contain p-2"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side – Benefits Grid & Education Banner */}
                        <div className="space-y-2 overflow-auto">
                            <h2 className="text-2xl font-bold text-center">Basic Benefits</h2>
                            {/* Responsive Benefits Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="benefit-card opacity-0 group relative p-4 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-[#2ECC71]/20 hover:border-[#2ECC71]/40 transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#2ECC71] via-[#27AE60] to-[#2ECC71] rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500"></div>
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2ECC71] to-[#27AE60] p-2 mb-2">
                                                <div className="w-full h-full text-white">{benefit.icon}</div>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                                            <p className="text-gray-400 text-xs">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Education Banner */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-[#2ECC71] to-[#27AE60] relative overflow-hidden">
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage:
                                            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                                        backgroundSize: "20px 20px",
                                    }}
                                ></div>
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">Only $1 USD per Month!</h2>
                                        <p className="text-white/80 text-xs">
                                            60+ months of education in one place at our lowest price
                                        </p>
                                    </div>
                                    <BookOpen className="w-12 h-12 text-white/90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animation Keyframes */}
                <style jsx>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fade-in {
                        animation: fadeIn 0.6s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Tier8Page;