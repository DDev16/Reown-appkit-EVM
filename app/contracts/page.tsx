"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, AlertCircle } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

// Define contract types for better type safety
interface ContractAddress {
    name: string;
    address: string;
    description: string;
    network: string;
    explorerUrl?: string;
}

const CONTRACT_ADDRESSES: ContractAddress[] = [
    {
        name: "DBW Token Contract",
        address: "0x123456789...", // Replace with actual address
        description: "Defi Bull World Token",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x123456789..." // Replace with actual address
    },
    {
        name: "DBWF Token Contract",
        address: "0x987654321...", // Replace with actual address
        description: "Defi Bull World FTSO Token",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x987654321..." // Replace with actual address
    },
    {
        name: "DBWL Token Contract",
        address: "0xabcdef123...", // Replace with actual address
        description: "Defi Bull World Liquidator Token",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0xabcdef123..." // Replace with actual address
    },
    {
        name: "NFTC Token Contract",
        address: "0x456789abc...", // Replace with actual address
        description: "Defi Bull World NFT Collection Token",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x456789abc..." // Replace with actual address
    },
    {
        name: "Membership NFT Contract",
        address: "0x123456789...", // Replace with actual address
        description: "Manages NFTs for membership tiers",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x123456789..." // Replace with actual address
    },
    {
        name: "Airdrop Contract",
        address: "0x987654321...", // Replace with actual address
        description: "Handles airdrops for Tokens",
        network: "Flare Mainnet",
        explorerUrl: "https://coston-explorer.flare.network/token/0x987654321..."
    }
];

export default function ContractAddressesPage() {
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

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

    return (
        <section className="relative min-h-screen py-12 overflow-hidden">
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

            <div className="relative z-20 max-w-6xl mx-auto px-4">
                {/* Page Title */}
                <div className="text-center mb-12" data-aos="fade-down">
                    <div className="inline-block">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                            <h1 className="relative text-4xl font-bold text-white mb-4 py-2">
                                Flare Network Contracts
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-400">Official contract addresses for the Defi Bull World ecosystem on Flare Network</p>
                </div>

                {/* Contracts Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {CONTRACT_ADDRESSES.map((contract, index) => (
                        <Card
                            key={contract.name}
                            className="group relative p-6 rounded-xl bg-black/90 border border-[#BC1A1E]/20 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-sm transition-all duration-500 group-hover:opacity-100" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">{contract.name}</h2>
                                        <p className="text-sm text-gray-400 mt-1">{contract.network}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyAddress(contract.address)}
                                        className="bg-black/50 text-white border-[#BC1A1E]/50 hover:bg-[#BC1A1E]/20"
                                    >
                                        {copiedAddress === contract.address ? (
                                            <CheckCheck className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-[#BC1A1E]/20">
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-5 w-5 text-[#FF4B51] opacity-70" />
                                        <span className="text-gray-300 font-medium text-sm truncate">
                                            {contract.address}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-gray-400 text-sm">
                                        {contract.description}
                                    </p>

                                    {contract.explorerUrl && (
                                        <a
                                            href={contract.explorerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FF4B51] hover:text-white text-sm font-medium transition-colors flex items-center"
                                        >
                                            View on Explorer
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-10 text-center text-sm text-gray-400" data-aos="fade-up">
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