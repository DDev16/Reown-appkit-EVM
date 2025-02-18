"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight, ShieldCheck, Play, BookOpen, Users, Gift } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ReferralButton } from './ReferralButton';
import ReferralHandler from './ReferralHandler';

// Reusable UI Components
const GradientBackground = () => (
    <div className="absolute inset-0">
        <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
                backgroundImage: `
                    linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                    linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
            }}
        />
        <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className={`absolute w-96 h-96 transition-all duration-1000 ease-in-out
                        ${index === 0 ? 'left-[20%] top-[20%]' :
                            index === 1 ? 'left-[50%] top-[50%]' : 'left-[80%] top-[30%]'}`}
                >
                    <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                    <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2"></div>
                </div>
            ))}
        </div>
    </div>
);

const SectionWrapper = ({ children, className = '', dataAos = '' }: { children: React.ReactNode; className?: string; dataAos?: string }) => (
    <div
        className={`relative group ${className}`}
        data-aos={dataAos}
    >
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>
        <div className="relative rounded-xl backdrop-blur-sm border border-[#BC1A1E]/20 bg-black/90">
            {children}
        </div>
    </div>
);

const SalesPageContent = () => {
    const searchParams = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });

        // Handle referral code
        const refCode = searchParams.get('ref');
        if (refCode) {
            localStorage.setItem('referralCode', refCode);

            toast({
                title: "Referral Link Detected",
                description: "Your referral has been saved for your purchase",
            });
        }
    }, [searchParams, toast]);

    const benefits = [
        {
            icon: <BookOpen className="w-full h-full" />,
            title: "Expert Education",
            description: "Comprehensive DeFi knowledge from industry experts"
        },
        {
            icon: <Users className="w-full h-full" />,
            title: "Active Community",
            description: "Join a thriving network of DeFi enthusiasts"
        },
        {
            icon: <Play className="w-full h-full" />,
            title: "Premium Content",
            description: "Access exclusive educational materials"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <GradientBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-20">
                {/* Hero Section */}
                <div className="text-center mb-20" data-aos="fade-down">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 blur-[10px] scale-110">
                            <h1 className="text-[#BC1A1E] text-5xl font-bold">Start Your DeFi Journey</h1>
                        </div>
                        <h1 className="text-5xl font-bold text-white relative">
                            Start Your DeFi Journey
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent animate-pulse"></div>
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Join our exclusive community and master DeFi with expert education
                    </p>
                </div>

                {/* Benefits Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <SectionWrapper
                            key={benefit.title}
                            dataAos="fade-up"
                            className="h-full"
                        >
                            <div className="p-6 h-full">
                                <div className="relative z-10 h-full">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] p-2.5 mb-4">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                                    <p className="text-gray-400">{benefit.description}</p>
                                </div>
                            </div>
                        </SectionWrapper>
                    ))}
                </div>

                {/* Video Sections */}
                <div className="space-y-20">
                    {/* Primary Video */}
                    <SectionWrapper dataAos="fade-up">
                        <div className="aspect-video relative">
                            <div className="absolute inset-0 flex items-center justify-center p-6">
                                <span className="text-gray-500">Primary Video Content</span>
                            </div>
                        </div>
                    </SectionWrapper>

                    {/* Secondary Video */}
                    <SectionWrapper dataAos="fade-up">
                        <div className="aspect-video relative">
                            <div className="absolute inset-0 flex items-center justify-center p-6">
                                <span className="text-gray-500">Secondary Video Content</span>
                            </div>
                        </div>
                    </SectionWrapper>
                </div>

                {/* Call to Action Section */}
                <SectionWrapper dataAos="fade-up" className="max-w-3xl mx-auto">
                    <div className="p-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Choose your membership tier and get instant access to our platform
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                            <Link href="/mint">
                                <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(188,26,30,0.3)] transform hover:scale-[1.02] group">
                                    <Sparkles className="w-5 h-5" />
                                    <span>Mint Your NFT Now</span>
                                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </button>
                            </Link>

                            <Link href="/membership/compare">
                                <button className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-[#BC1A1E] rounded-lg font-bold text-white hover:bg-[#BC1A1E]/10 transition-all duration-300 group">
                                    <span>Compare Tiers</span>
                                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </button>
                            </Link>
                        </div>

                        <div className="mb-6">
                            <ReferralButton />
                        </div>

                    </div>
                </SectionWrapper>
            </div>

            <style jsx>{`
                @keyframes flow-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                    50% { transform: translate(-30px, 30px) scale(1.1); opacity: 0.3; }
                }
                @keyframes flow-2 {
                    0%, 100% { transform: translate(0, 0) scale(1.1); opacity: 0.15; }
                    50% { transform: translate(30px, -30px) scale(1); opacity: 0.25; }
                }
                
                .animate-flow-1 {
                    animation: flow-1 10s ease-in-out infinite;
                }
                .animate-flow-2 {
                    animation: flow-2 10s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

// Main export component
export const SalesPage = () => {
    return (
        <div className="min-h-screen bg-transparent">
            <ReferralHandler />
            <SalesPageContent />
        </div>
    );
};