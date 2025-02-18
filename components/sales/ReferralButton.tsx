
"use client";
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Users, Gift } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useToast } from "@/hooks/use-toast";


export const ReferralButton = () => {
    const { address, isConnected } = useAccount();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [clientSideConnected, setClientSideConnected] = useState(false);

    useEffect(() => {
        // This ensures we only set the connected state on the client side
        setClientSideConnected(isConnected);
    }, [isConnected]);

    const handleCreateReferral = async () => {
        if (!clientSideConnected || !address) {
            toast({
                title: "Connect Wallet",
                description: "Please connect your wallet to create a referral link",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsGenerating(true);
            const referralLink = `${window.location.origin}/sales?ref=${address}`;
            await navigator.clipboard.writeText(referralLink);

            toast({
                title: "Success!",
                description: "Referral link copied to clipboard",
            });
        } catch (error) {
            console.error('Error generating referral:', error);
            toast({
                title: "Error",
                description: "Failed to generate referral link",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Referral Info Card */}
            <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>
                <div className="relative rounded-xl p-6 backdrop-blur-sm border border-[#BC1A1E]/20 bg-black/90">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] p-2.5 shrink-0">
                            <Gift className="w-full h-full text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">How Referrals Work</h3>
                            <div className="space-y-3 text-gray-400">
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#BC1A1E] shrink-0 inline-block" />
                                    Share your unique referral link with friends
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#BC1A1E] shrink-0 inline-block" />
                                    When they mint using your link, both of you receive rewards
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#BC1A1E] shrink-0 inline-block" />
                                    Earn a percentage of their minting fee instantly
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#BC1A1E] shrink-0 inline-block" />
                                    Smart contract ensures automatic and secure rewards
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Button */}
            <button
                onClick={handleCreateReferral}
                disabled={isGenerating || !clientSideConnected}
                className={`
                    inline-flex items-center gap-2 px-6 py-3 
                    bg-black/50 border border-[#BC1A1E] rounded-lg text-white 
                    hover:bg-[#BC1A1E]/10 transition-all duration-300 group
                    disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center
                `}
            >
                <Users className="w-5 h-5 text-[#BC1A1E]" />
                <span>
                    {!clientSideConnected
                        ? "Connect Wallet for Referral"
                        : isGenerating
                            ? "Generating..."
                            : "Create Referral Link"
                    }
                </span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
        </div>
    );
};