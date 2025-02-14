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

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");
const TIER_1 = 0;

// ABI for the required functions
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

const benefits = [
    {
        title: "Access to the video Library",
        icon: <Play />,
        description: "Exclusive access to our comprehensive video library of educational content",
    },
    {
        title: "Access to the tier 1 Blog",
        icon: <BookOpen />,
        description: "Premium blog content with deep insights and analysis",
    },
    {
        title: "Access to contributors of DBW",
        icon: <Users />,
        description: "Direct access to industry experts and DBW contributors",
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
        title: "2,400,000 XXX Tokens",
        icon: <Coins />,
        description: "Substantial token allocation for top tier members",
    },
    {
        title: "Airdrops and native token drops",
        icon: <Gift />,
        description: "Regular token drops and special rewards",
    },
    {
        title: "Zoom calls every week",
        icon: <Video />,
        description: "Weekly virtual meetings with the community",
    },
    {
        title: "Up to 100% cashback of NFT price!",
        icon: <ChartBar />,
        description: "Potential for full NFT price reimbursement",
    },
    {
        title: "10% of Company revenue split!",
        icon: <ChartBar />,
        description: "Share in company success with revenue splitting",
    },
    {
        title: "Free sweepstake tickets for 64 draws!",
        icon: <Ticket />,
        description: "Multiple chances to win with free draw entries",
    },
];

const Tier1Page = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [hasShownConfetti, setHasShownConfetti] = useState(false);

    // Contract reads
    const { data: supplyData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierSupply',
        args: [TIER_1],
    });

    const { data: priceData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierPrice',
        args: [TIER_1],
    });

    // Contract write for minting
    const { writeContract, data: hash, error } = useWriteContract();

    // Wait for transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

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
                colors: ['#BC1A1E', '#FF4B51', '#FFD700', '#FFFFFF'],
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#BC1A1E', '#FF4B51', '#FFD700', '#FFFFFF'],
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
                    title: 'Congratulations on your Tier-1 DBW NFT! 🎉',
                    text: 'Now that you own a DBW NFT, You can access your token gated education dashboard where only users who own DBW NFTs have access to!',
                    icon: 'success',
                    confirmButtonText: 'Sign Up Now',
                    confirmButtonColor: '#BC1A1E',
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
                        // Redirect to sign up page
                        window.location.href = '/dashboard'; // Update this URL to your actual signup page
                    }
                });
            }
        }
    }, [isConfirmed, hasShownConfetti]);

    // Handle mint
    const handleMint = async () => {
        if (isMinting) return; // Prevent double minting

        try {
            setIsMinting(true);
            if (!priceData) {
                throw new Error("Price data not available");
            }

            // Convert priceData to bigint for the transaction
            const price = BigInt(priceData.toString());

            await writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'mint',
                args: [TIER_1, 1],
                value: price
            });

            // Don't reset isMinting here - let the useEffect handle it when the transaction confirms

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
        if (!priceData) return "400,000";
        // Convert from Wei to Ether and format
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
            <div className="relative min-h-screen">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-radial from-[#BC1A1E]/20 via-transparent to-transparent opacity-40"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#BC1A1E]/10 to-transparent"></div>

                {/* Main content container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-5 relative z-10 flex flex-col justify-center py-8">
                    <div className="grid lg:grid-cols-2 gap-4 items-center">
                        {/* Left Side – NFT & Content */}
                        <div className="space-y-4">
                            {/* Header & Description */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-10 h-10 text-[#BC1A1E]" />
                                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                        Top Tier NFT
                                    </h1>
                                </div>
                                <p className="text-lg text-gray-400">
                                    Experience the ultimate membership level with exclusive access and premium benefits
                                </p>
                            </div>

                            {/* Price / Supply & Mint Button */}
                            <div className="flex items-center justify-center space-y-2 flex-wrap gap-8">
                                <div className="px-4 py-2 bg-black border border-[#BC1A1E] rounded-xl text-center shadow-lg shadow-[#BC1A1E]/50">
                                    <p className="text-gray-300 text-base font-semibold">
                                        Price: <span className="text-[#FF4B51]">{formatPrice()} FLR</span>
                                    </p>
                                    <p className="text-gray-300 text-base font-semibold">
                                        Supply: <span className="text-[#FF4B51]">{formatSupply()}</span>
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                                    <button
                                        onClick={handleMint}
                                        disabled={isMinting || isConfirming || isConfirmed}
                                        className="relative px-6 py-2 bg-black rounded-xl group transition-all duration-300 hover:shadow-2xl hover:shadow-[#BC1A1E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                                        <span className="relative flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-[#BC1A1E] group-hover:scale-110 transition-transform duration-300" />
                                            <span className="text-base font-semibold text-white">
                                                {getMintButtonText()}
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* NFT Image */}
                            <div className="relative group">
                                <div className="absolute -inset-3 bg-gradient-to-br from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E]/50 rounded-2xl opacity-75 group-hover:opacity-100 blur-2xl transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-black/80 to-black p-1 rounded-2xl">
                                    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 2px 2px, rgba(188, 26, 30, 0.4) 2px, transparent 0)",
                                                backgroundSize: "24px 24px",
                                            }}
                                        ></div>
                                        <div className="relative w-full h-full rounded-xl transform group-hover:scale-[1.02] transition-transform duration-500">
                                            <Image
                                                src="/nfts/TopTier.png"
                                                alt="Top Tier NFT"
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
                                        className="benefit-card opacity-0 group relative p-4 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-[#BC1A1E]/20 hover:border-[#BC1A1E]/40 transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500"></div>
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#BC1A1E] to-[#FF4B51] p-2 mb-2">
                                                <div className="w-full h-full text-white">{benefit.icon}</div>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                                            <p className="text-gray-400 text-xs">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Education Banner */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] relative overflow-hidden">
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

export default Tier1Page;