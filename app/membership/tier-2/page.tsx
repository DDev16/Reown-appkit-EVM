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

const TIER_2 = 1; // Updated to Tier 2

// ABI remains the same
const CONTRACT_ABI = [
    {
        name: "mint",
        type: "function",
        stateMutability: "payable",
        inputs: [
            { name: "tier", type: "uint256" },
            { name: "amount", type: "uint256" }
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

// Updated benefits for Tier 2
const benefits = [
    {
        title: "Access to the video Library",
        icon: <Play />,
        description: "Exclusive access to our comprehensive video library of educational content",
    },
    {
        title: "Access to the tier 2 Blog",
        icon: <BookOpen />,
        description: "Premium blog content with deep insights and analysis",
    },
    {
        title: "Access to more courses",
        icon: <Users />,
        description: "Access to advanced educational courses and materials",
    },
    {
        title: "Monthly knowledge tests",
        icon: <Award />,
        description: "Regular assessments to track your learning progress",
    },
    {
        title: "Early access to new features",
        icon: <Rocket />,
        description: "Be the first to try new platform features",
    },
    {
        title: "Early access to new launches",
        icon: <ArrowUpRight />,
        description: "Priority access to new product launches",
    },
    {
        title: "1,200,000 XXX Tokens",
        icon: <Coins />,
        description: "Substantial token allocation for tier 2 members",
    },
    {
        title: "Airdrops and native token drops",
        icon: <Gift />,
        description: "Regular token drops and special rewards",
    },
    {
        title: "Zoom calls every 2 weeks",
        icon: <Video />,
        description: "Bi-weekly virtual meetings with the community",
    },
    {
        title: "Up to 95% cashback of NFT price!",
        icon: <ChartBar />,
        description: "Substantial NFT price reimbursement potential",
    },
    {
        title: "15% of Company revenue split!",
        icon: <ChartBar />,
        description: "Share in company success with revenue splitting",
    },
    {
        title: "Free sweepstake tickets for 32 draws!",
        icon: <Ticket />,
        description: "Multiple chances to win with free draw entries",
    },
];

const Tier2Page = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [hasShownConfetti, setHasShownConfetti] = useState(false);
    const [referrerAddress, setReferrerAddress] = useState<string | null>(null);

    // Contract reads
    const { data: supplyData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierSupply',
        args: [TIER_2],
    });

    const { data: priceData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierPrice',
        args: [TIER_2],
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

    // Confetti effect function
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
                colors: ['#00bf63', '#009e52', '#00d870', '#FFFFFF'],
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#00bf63', '#009e52', '#00d870', '#FFFFFF'],
            });
        }, 250);
    };



    // Update SweetAlert2 colors
    useEffect(() => {
        if (isConfirmed) {
            setIsMinting(false);
            if (!hasShownConfetti) {
                fireConfetti();
                setHasShownConfetti(true);

                Swal.fire({
                    title: 'Congratulations on your DBW Tier 2 NFT! 🎉',
                    text: 'Now that you own one, sign up for an account to access your token gated education page where only users who own Tier-2 NFT have access to!',
                    icon: 'success',
                    confirmButtonText: 'Sign Up Now',
                    confirmButtonColor: '#00bf63',
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
                    TIER_2,
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
        if (!supplyData || !Array.isArray(supplyData)) return "0/50";
        const [current, max] = supplyData as [bigint, bigint];
        return `${current.toString()}/${max.toString()}`;
    };

    const formatPrice = () => {
        if (!priceData) return "200,000";
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
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-radial from-[#00bf63]/20 via-transparent to-transparent opacity-40"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00bf63]/10 to-transparent"></div>

                {/* Main content container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-5 relative z-10 flex flex-col justify-center py-8">
                    <div className="grid lg:grid-cols-2 gap-4 items-center">
                        {/* Left Side – NFT & Content */}
                        <div className="space-y-4">
                            {/* Header & Description */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-10 h-10 text-[#00bf63]" />
                                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                        Rhodium Tier NFT
                                    </h1>
                                </div>
                                <p className="text-lg text-gray-400">
                                    Join our exclusive Tier 2 membership with premium benefits and advanced access
                                </p>

                                {referrerAddress && (
                                    <div className="fixed bottom-4 right-4 bg-black/50 border border-[#00bf63] rounded-lg p-2 text-sm text-white z-20">
                                        Referral Active: {referrerAddress.slice(0, 6)}...{referrerAddress.slice(-4)}
                                    </div>
                                )}
                            </div>

                            {/* Price / Supply & Mint Button */}
                            <div className="flex items-center justify-center space-y-2 flex-wrap gap-8">
                                <div className="px-4 py-2 bg-black border border-[#00bf63] rounded-xl text-center shadow-lg shadow-[#00bf63]/50">
                                    <p className="text-gray-300 text-base font-semibold">
                                        Price: <span className="text-[#00bf63]">{formatPrice()} FLR</span>
                                    </p>
                                    <p className="text-gray-300 text-base font-semibold">
                                        Supply: <span className="text-[#00bf63]">{formatSupply()}</span>
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#00bf63] via-[#00d870] to-[#00bf63] rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                                    <button
                                        onClick={handleMint}
                                        disabled={isMinting || isConfirming || isConfirmed}
                                        className="relative px-6 py-2 bg-black rounded-xl group transition-all duration-300 hover:shadow-2xl hover:shadow-[#00bf63]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#00bf63] to-[#009e52] opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                                        <span className="relative flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-[#00bf63] group-hover:scale-110 transition-transform duration-300" />
                                            <span className="text-base font-semibold text-white">
                                                {getMintButtonText()}
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* NFT Image */}
                            <div className="relative group">
                                <div className="absolute -inset-3 bg-gradient-to-br from-[#00bf63] via-[#00d870] to-[#00bf63]/50 rounded-2xl opacity-75 group-hover:opacity-100 blur-2xl transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-black/80 to-black p-1 rounded-2xl">
                                    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 2px 2px, rgba(0, 191, 99, 0.4) 2px, transparent 0)",
                                                backgroundSize: "24px 24px",
                                            }}
                                        ></div>
                                        <div className="relative w-full h-full rounded-xl transform group-hover:scale-[1.02] transition-transform duration-500">
                                            <Image
                                                src="/nfts/Rhodium.png"
                                                alt="Rhodium Tier NFT"
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
                            <h2 className="text-2xl font-bold text-center">Exclusive Benefits</h2>
                            {/* Responsive Benefits Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="benefit-card opacity-0 group relative p-4 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-[#00bf63]/20 hover:border-[#00bf63]/40 transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00bf63] via-[#00d870] to-[#00bf63] rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500"></div>
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00bf63] to-[#009e52] p-2 mb-2">
                                                <div className="w-full h-full text-white">{benefit.icon}</div>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                                            <p className="text-gray-400 text-xs">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Education Banner */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-[#00bf63] to-[#009e52] relative overflow-hidden">
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
                                        <h2 className="text-2xl font-bold mb-1">60+ Months of Education!</h2>
                                        <p className="text-white/80 text-xs">
                                            Comprehensive educational content spanning over 5 years
                                        </p>
                                    </div>
                                    <BookOpen className="w-12 h-12 text-white/90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animation Keyframes unchanged */}
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

export default Tier2Page;