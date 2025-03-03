"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import Swal, { SweetAlertResult } from 'sweetalert2';
import {
    Crown, Play, BookOpen, Users, Award, Rocket, Coins,
    Gift, Video, ArrowUpRight, Ticket, ChartBar, Sparkles,
    DollarSign, Check
} from 'lucide-react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import TierNavbar from '@/components/ui/tier-navbar';
import CONTRACT_ABI from '@/lib/contract-abi.json';

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");

// ERC20 token addresses from contract
const USDT_ADDRESS = "0x0B38e83B86d491735fEaa0a791F65c2B99535396";
const USDC_E_ADDRESS = "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6";

// Standard ERC20 ABI for approvals
const ERC20_ABI = [
    {
        "inputs": [
            { "name": "spender", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "owner", "type": "address" },
            { "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

// Payment method constants from contract
const PAYMENT_FLR = 0;
const PAYMENT_USDT = 1;
const PAYMENT_USDC_E = 2;

const TIER_8 = 7;
const benefits = [
    {
        title: "Basic Access + NFT",
        icon: <Crown />,
        description: "3200 Palladium Tier NFTs. Dynamic FLR pricing, $75 USD value.",
    },
    {
        title: "Monthly Cost Structure",
        icon: <Coins />,
        description: "$1.25/month standard cost, reducible to $0 with kickback system. Guaranteed profit after 60 months.",
    },
    {
        title: "NFT Cashback Program",
        icon: <ChartBar />,
        description: "16-20% guaranteed cashback in FLR, quarterly payouts with partial guarantee.",
    },
    {
        title: "Token Package",
        icon: <Coins />,
        description: "200 DBW tokens with regular airdrops.",
    },
    {
        title: "Educational Resources",
        icon: <BookOpen />,
        description: "Access to general blog, public blog, library, dictionary, and e-books.",
    },
    {
        title: "Video Education",
        icon: <Play />,
        description: "Full access to video library and general courses.",
    },
    {
        title: "Knowledge Testing",
        icon: <Award />,
        description: "Regular knowledge tests to track your progress.",
    },
    {
        title: "Community Access",
        icon: <Video />,
        description: "Zoom meetings every 6 months.",
    },
    {
        title: "Platform Access",
        icon: <Rocket />,
        description: "Early access to platform tokens and new collections.",
    },
    {
        title: "Token Drops",
        icon: <Gift />,
        description: "Regular airdrops and exclusive giveaways.",
    },
    {
        title: "Multiple Benefits",
        icon: <ChartBar />,
        description: "Access to multiple income streams and opportunities.",
    }
];


const Tier8Page = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [hasShownConfetti, setHasShownConfetti] = useState(false);
    const [transactionType, setTransactionType] = useState<'none' | 'approval' | 'mint'>('none');
    const [referrerAddress, setReferrerAddress] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<number>(PAYMENT_FLR);
    const [approvalStatus, setApprovalStatus] = useState<Record<number, boolean>>({
        [PAYMENT_FLR]: true, // Native token doesn't need approval
        [PAYMENT_USDT]: false,
        [PAYMENT_USDC_E]: false
    });

    // Contract reads for supply and price
    const { data: supplyData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierSupply',
        args: [TIER_8],
    });

    // Get USD price
    const { data: usdPriceData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierUSDPrice',
        args: [TIER_8],
    });

    // Get current FLR price
    const { data: flrPriceData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTierFlarePrice',
        args: [TIER_8],
    });

    // Contract write for minting
    const { writeContract, data: hash, error, reset: resetWriteContract } = useWriteContract();

    // Wait for transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    // Track mint completion status separately from transaction confirmation
    const [mintCompleted, setMintCompleted] = useState(false);

    // Get the user's address from wagmi
    const { address: userAddress } = useAccount();

    // Get token allowance for USDT
    const { data: usdtAllowanceData, refetch: refetchUsdtAllowance } = useReadContract({
        address: USDT_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: userAddress ? [userAddress, CONTRACT_ADDRESS] : undefined,
        account: userAddress as `0x${string}`,
    });

    // Get token allowance for USDC-E
    const { data: usdcEAllowanceData, refetch: refetchUsdcEAllowance } = useReadContract({
        address: USDC_E_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: userAddress ? [userAddress, CONTRACT_ADDRESS] : undefined,
        account: userAddress as `0x${string}`,
    });

    // Check for referral code on component mount
    useEffect(() => {
        // Check localStorage for referral code
        const storedReferralCode = localStorage.getItem('referralCode');
        if (storedReferralCode) {
            setReferrerAddress(storedReferralCode);
        }
    }, []);

    // Check token approvals when component mounts and when allowance data changes
    useEffect(() => {
        if (usdtAllowanceData && usdPriceData) {
            const tokenAmount = getRequiredTokenAmount(PAYMENT_USDT);
            setApprovalStatus(prev => ({
                ...prev,
                [PAYMENT_USDT]: BigInt(usdtAllowanceData.toString()) >= tokenAmount
            }));
        }

        if (usdcEAllowanceData && usdPriceData) {
            const tokenAmount = getRequiredTokenAmount(PAYMENT_USDC_E);
            setApprovalStatus(prev => ({
                ...prev,
                [PAYMENT_USDC_E]: BigInt(usdcEAllowanceData.toString()) >= tokenAmount
            }));
        }
    }, [usdtAllowanceData, usdcEAllowanceData, usdPriceData]);

    // Confetti effect function with Rhenium colors
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
                colors: ['#FFD700', '#FFC000', '#FFD700', '#FFC000'], // Rhenium themed colors
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#FFD700', '#FFC000', '#FFD700', '#FFC000'], // Rhenium themed colors
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
            setIsApproving(false);
            setTransactionType('none');
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
            setIsApproving(false);

            // Show different alerts based on transaction type
            if (transactionType === 'approval') {
                // Immediately update approval status
                if (paymentMethod === PAYMENT_USDT) {
                    setApprovalStatus(prev => ({
                        ...prev,
                        [PAYMENT_USDT]: true
                    }));
                } else if (paymentMethod === PAYMENT_USDC_E) {
                    setApprovalStatus(prev => ({
                        ...prev,
                        [PAYMENT_USDC_E]: true
                    }));
                }

                // Then refresh allowances for data consistency
                refetchUsdtAllowance();
                refetchUsdcEAllowance();

                Swal.fire({
                    title: 'Approval Successful',
                    text: 'Token approval successful! You can now mint your NFT.',
                    icon: 'success',
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#d4af37',
                    background: '#1a1a1a',
                    color: '#ffffff'
                });

                // Reset transaction states
                resetWriteContract();
            } else if (transactionType === 'mint' && !hasShownConfetti) {
                // Set mint as completed
                setMintCompleted(true);

                // Refresh allowances after mint
                refetchUsdtAllowance();
                refetchUsdcEAllowance();
                fireConfetti();
                setHasShownConfetti(true);

                Swal.fire({
                    title: 'Congratulations on your Tier-8 NFT! 🎉',
                    text: 'Now that you own a NFT, You can access your token gated education dashboard where only users who own NFTs have access to!',
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

            // Reset transaction type
            setTransactionType('none');
        }
    }, [hash, error, isConfirmed, hasShownConfetti, transactionType, resetWriteContract]);

    // When payment method changes, reset mint completion state
    useEffect(() => {
        setMintCompleted(false);
    }, [paymentMethod]);

    // Helper to get required token amount based on payment method
    const getRequiredTokenAmount = (method: number): bigint => {
        if (!usdPriceData) return BigInt(0);

        const usdPriceInCents = BigInt(usdPriceData.toString());

        // USDT and USDC-E typically have 6 decimals
        const tokenDecimals = method === PAYMENT_USDT ? 6 : 6;

        // Convert USD cents to token amount (USD cents / 100 * 10^decimals)
        // Using BigInt(Math.pow(10, decimals)) to avoid bigint exponentiation
        const decimalFactor = BigInt(Math.pow(10, tokenDecimals));
        return (usdPriceInCents * decimalFactor) / BigInt(100);
    };

    // Handle ERC20 approvals
    const handleApprove = async () => {
        if (isApproving || isMinting) return;

        try {
            setIsApproving(true);
            setTransactionType('approval');

            let tokenAddress: string;
            if (paymentMethod === PAYMENT_USDT) {
                tokenAddress = USDT_ADDRESS;
            } else if (paymentMethod === PAYMENT_USDC_E) {
                tokenAddress = USDC_E_ADDRESS;
            } else {
                throw new Error("Invalid payment method");
            }

            const tokenAmount = getRequiredTokenAmount(paymentMethod);
            console.log(`Approving ${tokenAmount.toString()} tokens at address ${tokenAddress}`);

            await writeContract({
                address: tokenAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [
                    CONTRACT_ADDRESS,
                    tokenAmount
                ]
            });

        } catch (err) {
            console.error('Approval error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to approve token. Please try again.';

            Swal.fire({
                title: 'Approval Failed',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#d4af37',
                background: '#1a1a1a',
                color: '#ffffff'
            });
            setIsApproving(false);
            setTransactionType('none');
        }
    };

    // Updated handleMint function
    const handleMint = async () => {
        if (isMinting || isApproving) return;

        try {
            setIsMinting(true);
            setTransactionType('mint');

            // Ensure referrerAddress is a valid address or zero address
            const referrer = referrerAddress && /^0x[a-fA-F0-9]{40}$/.test(referrerAddress)
                ? referrerAddress
                : '0x0000000000000000000000000000000000000000';

            if (paymentMethod === PAYMENT_FLR) {
                // Mint with native token (FLR)
                if (!flrPriceData) {
                    throw new Error("Price data not available");
                }

                const price = BigInt(flrPriceData.toString());

                console.log('Minting with FLR:', {
                    tier: TIER_8,
                    amount: 1,
                    referrer,
                    price: price.toString()
                });

                await writeContract({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'mint',
                    args: [
                        BigInt(TIER_8),    // tier
                        BigInt(1),         // amount
                        referrer           // referrer address
                    ],
                    value: price           // Properly formatted as BigInt
                });
            } else {
                // Mint with ERC20 token
                console.log('Minting with ERC20:', {
                    tier: TIER_8,
                    amount: 1,
                    referrer,
                    paymentMethod
                });

                await writeContract({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'mintWithERC20',
                    args: [
                        BigInt(TIER_8),          // tier
                        BigInt(1),               // amount
                        referrer,                // referrer address
                        BigInt(paymentMethod)    // payment method
                    ]
                });
            }

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
            setTransactionType('none');
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

    // Get button text
    const getApproveButtonText = () => {
        if (isApproving) return "Approving...";
        return "Approve Token";
    };

    const getMintButtonText = () => {
        if (isConfirming && transactionType === 'mint') return "Confirming...";
        if (isMinting) return "Minting...";
        if (mintCompleted) return "Minted!";
        return "Mint Your NFT";
    };

    // Get payment method name
    const getPaymentMethodName = (methodId: number) => {
        switch (methodId) {
            case PAYMENT_FLR: return "FLR";
            case PAYMENT_USDT: return "USDT";
            case PAYMENT_USDC_E: return "USDC.e";
            default: return "Unknown";
        }
    };

    return (
        <div className="min-h-screen text-white overflow-auto">
            <TierNavbar />
            <div className="relative min-h-screen">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-radial from-[#2ECC71]/20 via-transparent to-transparent opacity-40"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2ECC71]/10 to-transparent"></div>

                {/* Main content container */}
                <div className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-5 relative z-10 flex flex-col justify-center py-8">
                    {/* Centered Header & Description */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 mb-2">
                            <Crown className="w-16 h-16 text-[#2ECC71]" />
                            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Palladium Tier NFT

                            </h1>
                        </div>
                        <p className="text-xl text-gray-400 max-w-6xl mx-auto">
                            Start your DeFi education journey with our most accessible membership





                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 items-start">
                        {/* Left Side – NFT & Content */}
                        <div className="space-y-4">
                            {/* Price / Supply & Mint Button */}
                            <div className="flex flex-col items-center justify-center space-y-4 flex-wrap gap-4">
                                {/* Price and supply info */}
                                <div className="px-4 py-2 bg-black border border-[#2ECC71] rounded-xl text-center shadow-lg shadow-[#2ECC71]/50 w-full max-w-xs">
                                    <p className="text-gray-300 text-base font-semibold">
                                        Price: <span className="text-[#2ECC71]">${formatPrices().usd} USD</span>
                                    </p>
                                    <p className="text-gray-300 text-base font-semibold">
                                        Current: <span className="text-[#2ECC71]">{formatPrices().flr} FLR</span>
                                    </p>
                                    <p className="text-gray-300 text-base font-semibold">
                                        Supply: <span className="text-[#2ECC71]">{formatSupply()}</span>
                                    </p>
                                </div>

                                {/* Payment method selection */}
                                <div className="w-full max-w-xs">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Choose Payment Method
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[PAYMENT_FLR, PAYMENT_USDT, PAYMENT_USDC_E].map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`px-2 py-2 rounded-lg transition-all duration-200 flex items-center justify-center ${paymentMethod === method
                                                    ? "bg-[#2ECC71] text-black font-semibold"
                                                    : "bg-black/60 border border-[#2ECC71]/30 text-white"
                                                    }`}
                                            >
                                                {getPaymentMethodName(method)}
                                                {paymentMethod === method && (
                                                    <Check className="ml-1 w-4 h-4" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="w-full flex flex-col gap-2 max-w-xs">
                                    {/* ERC20 Approve button - show only for ERC20 tokens that need approval */}
                                    {paymentMethod !== PAYMENT_FLR && !approvalStatus[paymentMethod] && (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71] via-[#2ECC71] to-[#2ECC71] rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                                            <button
                                                onClick={handleApprove}
                                                disabled={isApproving || isMinting || isConfirming}
                                                className="relative w-full px-6 py-2 bg-black rounded-xl group transition-all duration-300 hover:shadow-2xl hover:shadow-[#2ECC71]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71] to-[#2ECC71] opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                                                <span className="relative flex items-center justify-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-[#2ECC71] group-hover:scale-110 transition-transform duration-300" />
                                                    <span className="text-base font-semibold text-white">
                                                        {getApproveButtonText()}
                                                    </span>
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Mint button - disabled for ERC20 tokens that need approval */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71] via-[#2ECC71] to-[#2ECC71] rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                                        <button
                                            onClick={handleMint}
                                            disabled={
                                                isMinting ||
                                                isApproving ||
                                                isConfirming ||
                                                (transactionType === 'mint' && isConfirmed) ||
                                                mintCompleted ||
                                                (paymentMethod !== PAYMENT_FLR && !approvalStatus[paymentMethod])
                                            }
                                            className="relative w-full px-6 py-2 bg-black rounded-xl group transition-all duration-300 hover:shadow-2xl hover:shadow-[#2ECC71]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71] to-[#2ECC71] opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                                            <span className="relative flex items-center justify-center gap-2">
                                                <Sparkles className="w-5 h-5 text-[#2ECC71] group-hover:scale-110 transition-transform duration-300" />
                                                <span className="text-base font-semibold text-white">
                                                    {getMintButtonText()}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {referrerAddress && (
                                    <div className="fixed bottom-4 right-4 bg-black z-20 border border-[#2ECC71] rounded-lg p-2 text-sm text-white">
                                        Referral Active: {referrerAddress.slice(0, 6)}...{referrerAddress.slice(-4)}
                                    </div>
                                )}
                            </div>

                            {/* NFT Image */}
                            <div className="relative group max-w-lg mx-auto">
                                <div className="absolute -inset-3 bg-gradient-to-br from-[#2ECC71] via-[#2ECC71] to-[#2ECC71]/50 rounded-2xl opacity-75 group-hover:opacity-100 blur-2xl transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-black/80 to-black p-1 rounded-2xl">
                                    <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-xl">
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
                                                alt="Palladium NFT"
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
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="benefit-card opacity-0 group relative p-4 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-[#2ECC71]/20 hover:border-[#2ECC71]/40 transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#2ECC71] via-[#2ECC71] to-[#2ECC71] rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500"></div>
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2ECC71] to-[#2ECC71] p-2 mb-2">
                                                <div className="w-full h-full text-white">{benefit.icon}</div>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                                            <p className="text-gray-400 text-xs">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Education Banner */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-[#2ECC71] to-[#2ECC71] relative overflow-hidden">
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
                                    className="inline-flex items-center px-6 py-3 bg-black border border-[#2ECC71] text-[#2ECC71] rounded-xl hover:bg-[#2ECC71]/10 transition-all duration-300 group"
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

export default Tier8Page;