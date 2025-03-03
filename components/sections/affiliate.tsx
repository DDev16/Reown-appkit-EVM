"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface Partner {
    name: string;
    logo: string;
    description: string;
    link: string;
}

const PartnerCard = ({ partner }: { partner: Partner }) => (
    <div className="group relative">
        <div className="relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>
            <a
                href={partner.link}
                className="block relative rounded-2xl bg-black/90 p-6 backdrop-blur-sm border border-[#BC1A1E]/20 hover:border-[#BC1A1E]/40 transition-all duration-300"
            >
                <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-black/50">
                    <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain p-4"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                        <ArrowUpRight className="w-5 h-5 text-red-500 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <p className="text-gray-400">{partner.description}</p>
                </div>
            </a>
        </div>
    </div>
);

const Affiliate = () => {
    const partners: Partner[] = [

        {
            name: "GOAT Sweepstakes",
            logo: "/assets/GOAT.jpeg",
            description: "Monthly sweepstakes with prize pools up to 450K $GOAT",
            link: "/sweepstakes/goat"
        },
        {
            name: "TDBT Sweepstakes",
            logo: "/assets/TDBT.jpeg",
            description: "Monthly sweepstakes with prize pools up to 450K $TDBT",
            link: "/sweepstakes/tdbt"
        },
        {
            name: "DBWT Sweepstakes",
            logo: "/assets/Bull.jpeg",
            description: "Monthly sweepstakes with prize pools up to 7.5M $DBWT",
            link: "/sweepstakes/dbwt"
        },
        {
            name: "BILLI Sweepstakes",
            logo: "/assets/Billi.jpeg",
            description: "Monthly sweepstakes with prize pools up to 1.5M $BILLI",
            link: "/sweepstakes/billi"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                            linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] animate-pulse delay-700" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative inline-block">
                        Our Sweepstakes
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Explore our monthly sweepstakes with massive prize pools and opportunities
                    </p>
                </div>

                {/* Main Grid Layout */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid gap-8">
                        {/* Top Row - 3 Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {partners.slice(0, 3).map((partner, index) => (
                                <div key={index}>
                                    <PartnerCard partner={partner} />
                                </div>
                            ))}
                        </div>

                        {/* Bottom Row - 2 Cards Centered */}
                        <div className="flex justify-center gap-8 flex-wrap md:flex-nowrap">
                            <div className="w-full md:w-1/3">
                                <PartnerCard partner={partners[3]} />
                            </div>
                            <div className="w-full md:w-1/3">
                                <PartnerCard partner={partners[4]} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Affiliate;