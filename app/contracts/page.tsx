"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, AlertCircle, Code, ChevronDown, ChevronUp, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import AOS from "aos";
import "aos/dist/aos.css";

// Import contract code from JS file instead of .sol files
import { ERC20ContractCode, AirdropContractCode, MembershipContractCode } from "@/data/contractsData.js";

// Define contract types for better type safety
interface ContractAddress {
    name: string;
    address: string;
    description: string;
    network: string;
    explorerUrl?: string;
    contractType: "ERC20" | "Airdrop" | "Membership";
}

const CONTRACT_ADDRESSES: ContractAddress[] = [
    {
        name: "DBW Token Contract",
        address: "0x123456789...", // Replace with actual address
        description: "Defi Bull World Token",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x123456789...", // Replace with actual address
        contractType: "ERC20"
    },
    {
        name: "DBWF Token Contract",
        address: "0x987654321...", // Replace with actual address
        description: "Defi Bull World FTSO Token",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x987654321...", // Replace with actual address
        contractType: "ERC20"
    },
    {
        name: "DBWL Token Contract",
        address: "0xabcdef123...", // Replace with actual address
        description: "Defi Bull World Liquidator Token",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0xabcdef123...", // Replace with actual address
        contractType: "ERC20"
    },
    {
        name: "NFTC Token Contract",
        address: "0x456789abc...", // Replace with actual address
        description: "Defi Bull World NFT Collection Token",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x456789abc...", // Replace with actual address
        contractType: "ERC20"
    },
    {
        name: "Membership NFT Contract",
        address: "0x123456789...", // Replace with actual address
        description: "Manages NFTs for membership tiers",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x123456789...", // Replace with actual address
        contractType: "Membership"
    },
    {
        name: "Airdrop Contract",
        address: "0x987654321...", // Replace with actual address
        description: "Handles airdrops for Tokens",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x987654321...",
        contractType: "Airdrop"
    }
];

export default function ContractAddressesPage() {
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [selectedContract, setSelectedContract] = useState<number | null>(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address).then(() => {
            setCopiedAddress(address);
            setTimeout(() => setCopiedAddress(null), 2000);
        });
    };

    const showContractCode = (index: number) => {
        setSelectedContract(index);
    };

    const closeContractCode = () => {
        setSelectedContract(null);
    };

    const navigateContract = (direction: 'prev' | 'next') => {
        if (selectedContract === null) return;

        if (direction === 'prev') {
            setSelectedContract((prev: number | null) => {
                if (prev === null) return 0;
                return prev === 0 ? CONTRACT_ADDRESSES.length - 1 : prev - 1;
            });
        } else {
            setSelectedContract((prev: number | null) => {
                if (prev === null) return 0;
                return prev === CONTRACT_ADDRESSES.length - 1 ? 0 : prev + 1;
            });
        }
    };

    // Function to get contract code and filename based on contract type
    const getContractDetails = (contractType: string) => {
        switch (contractType) {
            case "ERC20":
                return { code: ERC20ContractCode, filename: "ERC20.sol" };
            case "Airdrop":
                return { code: AirdropContractCode, filename: "Airdrop.sol" };
            case "Membership":
                return { code: MembershipContractCode, filename: "membership.sol" };
            default:
                return { code: "", filename: "" };
        }
    };

    return (
        <section className="relative min-h-screen py-8 sm:py-12 overflow-hidden">
            {/* Background Layers - Similar to Price Dashboard */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                            linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                        maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)",
                    }}
                />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[100px] animate-flow-1 opacity-20" />
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[100px] animate-flow-2 opacity-15" />
                    </div>
                </div>
            </div>

            <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6">
                {/* Page Title */}
                <div className="text-center mb-8 sm:mb-12" data-aos="fade-down">
                    <div className="inline-block">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                            <h1 className="relative text-3xl sm:text-4xl font-bold text-white mb-4 py-2">
                                Flare Network Contracts
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                            </h1>
                        </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">Official contract addresses for the Defi Bull World ecosystem on Flare Network</p>
                </div>

                {/* Contracts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {CONTRACT_ADDRESSES.map((contract, index) => (
                        <Card
                            key={contract.name}
                            className="group relative p-4 sm:p-6 rounded-xl bg-black/90 border border-[#BC1A1E]/20 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-sm transition-all duration-500 group-hover:opacity-100" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-white">{contract.name}</h2>
                                        <p className="text-xs sm:text-sm text-gray-400 mt-1">{contract.network}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyAddress(contract.address)}
                                        className="bg-black/50 text-white border-[#BC1A1E]/50 hover:bg-[#BC1A1E]/20 h-8 w-8 p-0"
                                    >
                                        {copiedAddress === contract.address ? (
                                            <CheckCheck className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-[#BC1A1E]/20">
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-[#FF4B51] opacity-70" />
                                        <span className="text-gray-300 font-medium text-xs sm:text-sm truncate max-w-[calc(100%-30px)]">
                                            {contract.address}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2 sm:gap-0">
                                    <p className="text-xs sm:text-sm text-gray-400">
                                        {contract.description}
                                    </p>

                                    {contract.explorerUrl && (
                                        <a
                                            href={contract.explorerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FF4B51] hover:text-white text-xs sm:text-sm font-medium transition-colors flex items-center whitespace-nowrap"
                                        >
                                            View on Explorer
                                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                        </a>
                                    )}
                                </div>

                                {/* View Code Button */}
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => showContractCode(index)}
                                        className="w-full bg-black/50 text-white border-[#BC1A1E]/50 hover:bg-[#BC1A1E]/20 flex justify-between items-center py-2 h-auto text-xs sm:text-sm"
                                    >
                                        <div className="flex items-center">
                                            <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                            <span>View Contract Code</span>
                                        </div>
                                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Contract Code Display Section */}
                {selectedContract !== null && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col overflow-auto" data-aos="fade">
                        <div className="sticky top-0 bg-gradient-to-b from-black to-transparent z-10 px-4 py-4 sm:px-6 sm:py-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    {CONTRACT_ADDRESSES[selectedContract].name}
                                </h2>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={closeContractCode}
                                    className="bg-black/50 z-50 mt-20 text-white border-[#BC1A1E]/50 hover:bg-[#BC1A1E]/20 h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateContract('prev')}
                                    className="bg-black/50 text-white border-[#BC1A1E]/50 hover:bg-[#BC1A1E]/20"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    <span>Previous</span>
                                </Button>

                                <span className="text-sm text-gray-400">
                                    {selectedContract + 1} of {CONTRACT_ADDRESSES.length}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateContract('next')}
                                    className="bg-black/50 text-white border-[#BC1A1E]/50 hover:bg-[#BC1A1E]/20"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 p-4 sm:p-6 overflow-auto pb-20">
                            {(() => {
                                const { code, filename } = getContractDetails(CONTRACT_ADDRESSES[selectedContract].contractType);
                                return (
                                    <div className="w-full max-w-4xl mx-auto">
                                        <CodeBlock
                                            language="solidity"
                                            filename={filename}
                                            code={code}
                                        />
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                <div className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-gray-400" data-aos="fade-up">
                    <p>
                        These are the official contract addresses for the Defi Bull World ecosystem on Flare Network.
                        Always verify contract addresses from official sources before interaction.
                    </p>
                </div>
            </div>

            {/* Custom Animations - Same as Price Dashboard */}
            <style jsx>{`
                @keyframes flow-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-50px, 50px) scale(1.1); }
                }
                @keyframes flow-2 {
                    0%, 100% { transform: translate(0, 0) scale(1.1); }
                    50% { transform: translate(50px, -50px) scale(1); }
                }
                .animate-flow-1 {
                    animation: flow-1 15s ease-in-out infinite;
                }
                .animate-flow-2 {
                    animation: flow-2 15s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}