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
import CONTRACT_ABI from '@/lib/contract-abi.json';

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");

const TIER_5 = 4; // Updated to Tier 5



const benefits = [
    {
        title: "Advanced Edition NFT",
        icon: <Crown />,
        description: "400 Ruthenium Tier NFTs. Dynamic FLR pricing, $600 USD value.",
    },
    {
        title: "Monthly Cost Structure",
        icon: <Coins />,
        description: "$10/month standard cost, reducible to $0 with kickback system. Guaranteed profit after 60 months.",
    },
    {
        title: "NFT Cashback Program",
        icon: <ChartBar />,
        description: "75-100% guaranteed cashback in FLR, monthly payouts with partial guarantee.",
    },
    {
        title: "Revenue Share",
        icon: <ChartBar />,
        description: "30% share from 50% of company assets, distributed monthly.",
    },
    {
        title: "Token Package",
        icon: <Coins />,
        description: "2,000 DBW, 1,875 TDB, 1,875 DRKET, 1,500 DBWF tokens.",
    },
    {
        title: "Educational Resources",
        icon: <BookOpen />,
        description: "Access to Tier 5 blog, public blog, library, dictionary, and e-books.",
    },
    {
        title: "Video Education",
        icon: <Play />,
        description: "Full access to video library and Tier 5 courses.",
    },
    {
        title: "Knowledge Testing",
        icon: <Award />,
        description: "Regular knowledge tests to track your progress.",
    },
    {
        title: "Community Access",
        icon: <Video />,
        description: "Zoom meetings every 3 months.",
    },
    {
        title: "Platform Access",
        icon: <Rocket />,
        description: "Early access to platform tokens and new collections.",
    },
    {
        title: "2025 Sweepstakes",
        icon: <Ticket />,
        description: "5 RUTHENIUM tickets for 2025 draws.",
    },
    {
        title: "Monthly Sweepstakes",
        icon: <Ticket />,
        description: "Access to DBW, TDB, DRKET, NFTC, DBWF, DBWL sweepstakes.",
    },
    {
        title: "Pool Share",
        icon: <ChartBar />,
        description: "30% share from 35% of sweepstake pools.",
    },
    {
        title: "Income Streams",
        icon: <Coins />,
        description: "Multiple income opportunities available.",
    },
    {
        title: "Additional Benefits",
        icon: <Gift />,
        description: "Regular airdrops and exclusive giveaways.",
    }
];

const Tier5Page = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [hasShownConfetti, setHasShownConfetti] = useState(false);
    const [referrerAddress, setReferrerAddress] = useState<string | null>(null);

    // Contract reads for supply and price
    const { data: supplyData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierSupply',
        args: [TIER_5],
    });

    // Get USD price
    const { data: usdPriceData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierUSDPrice',
        args: [TIER_5],
    });

    // Get current FLR price
    const { data: flrPriceData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierFlarePrice',
        args: [TIER_5],
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

    // Confetti effect function with Ruthenium colors
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
                colors: ['#f6cefc', '#eab5f1', '#f6cefc', '#eab5f1'], // Ruthenium themed colors
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#f6cefc', '#eab5f1', '#f6cefc', '#eab5f1'], // Ruthenium themed colors
            });
        }, 250);
    };

    // Watch for successful mint and trigger confetti
    useEffect(() => {
        if (hash) {
            console.log("Transaction hash:", hash);
        }

        if (error) {
            console.error("Transaction error:", error);
            setIsMinting(false);
            Swal.fire({
                title: 'Transaction Failed',
                text: error.message || 'Transaction failed. Please try again.',
                icon: 'error',
                confirmButtonColor: '#d4af37',
                background: '#1a1a1a',
                color: '#ffffff'
            });
        }

        if (isConfirmed) {
            setIsMinting(false);
            if (!hasShownConfetti) {
                fireConfetti();
                setHasShownConfetti(true);

                Swal.fire({
                    title: 'Congratulations on your Tier-1 DBW NFT! 🎉',
                    text: 'Now that you own a DBW NFT, You can access your token gated education dashboard where only users who own DBW NFTs have access to!',
                    icon: 'success',
                    confirmButtonText: 'Click here to access your dashboard!',
                    confirmButtonColor: '#d4af37',
                    background: '#1a1a1a',
                    color: '#ffffff',
                    showClass: {
                        popup: 'animate__animated animate__fadeInUp animate__faster'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutDown animate__faster'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/dashboard';
                    }
                });
            }
        }
    }, [hash, error, isConfirmed, hasShownConfetti]);

    // Updated handleMint function
    const handleMint = async () => {
        if (isMinting) return;

        try {
            setIsMinting(true);

            if (!flrPriceData) {
                throw new Error("Price data not available");
            }

            // Convert flrPriceData to BigInt
            const price = BigInt(flrPriceData.toString());

            // Ensure referrerAddress is a valid address or zero address
            const referrer = referrerAddress && /^0x[a-fA-F0-9]{40}$/.test(referrerAddress)
                ? referrerAddress
                : '0x0000000000000000000000000000000000000000';

            console.log('Minting with params:', {
                tier: TIER_5,
                amount: 1,
                referrer,
                price: price.toString()
            });

            await writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'mint',
                args: [
                    BigInt(TIER_5),    // tier
                    BigInt(1),         // amount
                    referrer          // referrer address
                ],
                value: price          // Properly formatted as BigInt
            });

        } catch (err: unknown) {
            console.error('Minting error:', err);
            const errorMessage = err instanceof Error ? err.message :
                typeof err === 'object' && err && 'message' in err ? String(err.message) :
                    'Failed to mint NFT. Please try again.';

            Swal.fire({
                title: 'Minting Failed',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#d4af37',
                background: '#1a1a1a',
                color: '#ffffff'
            });
            setIsMinting(false);
        }
    };

    // Format supply and price data
    const formatSupply = () => {
        if (!supplyData || !Array.isArray(supplyData)) return "0/25";
        const [current, max] = supplyData as [bigint, bigint];
        return `${current.toString()}/${max.toString()}`;
    };

    const formatPrices = () => {
        if (!usdPriceData || !flrPriceData) return { usd: "0.00", flr: "0.00" };

        const usdPrice = Number(usdPriceData) / 100; // Convert cents to dollars
        const flrPrice = Number(flrPriceData) / 1e18; // Convert wei to FLR

        return {
            usd: usdPrice.toFixed(2),
            flr: flrPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })
        };
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
                <div className="absolute inset-0 bg-gradient-radial from-[#f6cefc]/20 via-transparent to-transparent opacity-40"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f6cefc]/10 to-transparent"></div>

                {/* Main content container */}
                <div className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-5 relative z-10 flex flex-col justify-center py-8">
                    {/* Centered Header & Description */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 mb-2">
                            <Crown className="w-16 h-16 text-[#f6cefc]" />
                            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Ruthenium Tier NFT
                            </h1>
                        </div>
                        <p className="text-xl text-gray-400 max-w-6xl mx-auto">
                            Start your journey with our Advanced membership tier 5 and discover the world of DeFi education
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 items-start">
                        {/* Left Side – NFT & Content */}
                        <div className="space-y-4">
                            {/* Price / Supply & Mint Button */}
                            <div className="flex items-center justify-center space-y-2 flex-wrap gap-8">
                                <div className="px-4 py-2 bg-black border border-[#f6cefc] rounded-xl text-center shadow-lg shadow-[#f6cefc]/50">
                                    <p className="text-gray-300 text-base font-semibold">
                                        Price: <span className="text-[#f6cefc]">${formatPrices().usd} USD</span>
                                    </p>
                                    <p className="text-gray-300 text-base font-semibold">
                                        Current: <span className="text-[#f6cefc]">{formatPrices().flr} FLR</span>
                                    </p>
                                    <p className="text-gray-300 text-base font-semibold">
                                        Supply: <span className="text-[#f6cefc]">{formatSupply()}</span>
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#f6cefc] via-[#f6cefc] to-[#f6cefc] rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                                    <button
                                        onClick={handleMint}
                                        disabled={isMinting || isConfirming || isConfirmed}
                                        className="relative px-6 py-2 bg-black rounded-xl group transition-all duration-300 hover:shadow-2xl hover:shadow-[#f6cefc]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#f6cefc] to-[#f6cefc] opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                                        <span className="relative flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-[#f6cefc] group-hover:scale-110 transition-transform duration-300" />
                                            <span className="text-base font-semibold text-white">
                                                {getMintButtonText()}
                                            </span>
                                        </span>
                                    </button>

                                    {referrerAddress && (
                                        <div className="fixed bottom-4 right-4 bg-black z-20 border border-[#f6cefc] rounded-lg p-2 text-sm text-white">
                                            Referral Active: {referrerAddress.slice(0, 6)}...{referrerAddress.slice(-4)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* NFT Image */}
                            <div className="relative group max-w-lg mx-auto">
                                <div className="absolute -inset-3 bg-gradient-to-br from-[#f6cefc] via-[#f6cefc] to-[#f6cefc]/50 rounded-2xl opacity-75 group-hover:opacity-100 blur-2xl transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-black/80 to-black p-1 rounded-2xl">
                                    <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-xl">
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 2px 2px, rgba(246, 206, 252, 0.4) 2px, transparent 0)",
                                                backgroundSize: "24px 24px",
                                            }}
                                        ></div>
                                        <div className="relative w-full h-full rounded-xl transform group-hover:scale-[1.02] transition-transform duration-500">
                                            <Image
                                                src="/nfts/Ruthenium.png"
                                                alt="Ruthenium Tier NFT"
                                                fill
                                                sizes="(min-width: 1024px) 32rem, 100vw"
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="benefit-card opacity-0 group relative p-4 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-[#f6cefc]/20 hover:border-[#f6cefc]/40 transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#f6cefc] via-[#f6cefc] to-[#f6cefc] rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500"></div>
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f6cefc] to-[#f6cefc] p-2 mb-2">
                                                <div className="w-full h-full text-white">{benefit.icon}</div>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                                            <p className="text-gray-400 text-xs">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Education Banner */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-[#f6cefc] to-[#f6cefc] relative overflow-hidden">
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
                                        <h2 className="text-2xl text-black font-bold mb-1">60+ Months of Education!</h2>
                                        <p className="text-black/80 text-xs">
                                            Comprehensive educational content spanning over 5 years
                                        </p>
                                    </div>
                                    <BookOpen className="w-12 h-12 text-black/90" />
                                </div>
                            </div>

                            {/* Compare Membership Button */}
                            <div className="mt-4 text-center">
                                <a
                                    href="/membership/compare"
                                    className="inline-flex items-center px-6 py-3 bg-black border border-[#f6cefc] text-[#f6cefc] rounded-xl hover:bg-[#f6cefc]/10 transition-all duration-300 group"
                                >
                                    <span className="mr-2">Find Out More Details</span>
                                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                                </a>
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

export default Tier5Page;