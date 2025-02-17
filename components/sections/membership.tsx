"use client";
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useEffect, ReactElement } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Tier {
    name: string;
    subtitle: string;
    description: string;
    Tier: string;
    iconPath: string;
    color: string;
    highlighted: boolean;
    path: string;
}

const MembershipTiers = () => {
    const router = useRouter();

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const tiers: Tier[] = [
        {
            name: "Top Tier",
            subtitle: "Exclusive Tier",
            description: "The ultimate experience/exclusive access & premium benefits",
            Tier: "Tier 1",
            iconPath: "/tier-icons/DBW-icon.png",
            color: "from-[#d4af37] via-[#d4af37] to-[#b3941f]",
            highlighted: true,
            path: "/membership/tier-1"
        },
        {
            name: "RHODIUM",
            subtitle: "Premium Tier",
            description: "Premium access to advanced features and dedicated support",
            Tier: "Tier 2",
            iconPath: "/tier-icons/Rh-icon.png",
            color: "from-[#00bf63] via-[#00bf63] to-[#009e52]",
            highlighted: false,
            path: "/membership/tier-2"
        },
        {
            name: "PLATINUM",
            subtitle: "Elite Tier",
            description: "Elite membership with enhanced capabilities and priority access",
            Tier: "Tier 3",
            iconPath: "/tier-icons/Pt-icon.png",
            color: "from-[#ff8018] via-[#ff8018] to-[#e67216]",
            highlighted: false,
            path: "/membership/tier-3"
        },
        {
            name: "GOLD",
            subtitle: "Pro Tier",
            description: "Professional membership with advanced features and benefits",
            Tier: "Tier 4",
            iconPath: "/tier-icons/Au-icon.png",
            color: "from-[#d4af37] via-[#d4af37] to-[#b3941f]",
            highlighted: false,
            path: "/membership/tier-4"
        },
        {
            name: "RUTHENIUM",
            subtitle: "Advanced Tier",
            description: "Advanced membership with exclusive features and benefits",
            Tier: "Tier 5",
            iconPath: "/tier-icons/Ru-icon.png",
            color: "from-[#f6cefc] via-[#f6cefc] to-[#eab5f1]",
            highlighted: false,
            path: "/membership/tier-5"
        },
        {
            name: "IRIDIUM",
            subtitle: "Starter Tier",
            description: "Perfect starting point for your DBW journey",
            Tier: "Tier 6",
            iconPath: "/tier-icons/Ir-icon.png",
            color: "from-[#BC1A1E] via-[#BC1A1E] to-[#8B1315]",
            highlighted: false,
            path: "/membership/tier-6"
        },
        {
            name: "OSMIUM",
            subtitle: "Entry Tier",
            description: "Essential features to begin your DBW experience",
            Tier: "Tier 7",
            iconPath: "/tier-icons/Os-icon.png",
            color: "from-[#0099CC] via-[#0099CC] to-[#007399]",
            highlighted: false,
            path: "/membership/tier-7"
        },
        {
            name: "PALLADIUM",
            subtitle: "Advanced Tier",
            description: "Basic access to fundamental DBW features + more",
            Tier: "Tier 8",
            iconPath: "/tier-icons/Pd-icon.png",
            color: "from-[#2ECC71] via-[#2ECC71] to-[#27AE60]", // Updated to bright green
            highlighted: false,
            path: "/membership/tier-8"
        },
        {
            name: "RHENIUM",
            subtitle: "Basic Tier",
            description: "Basic access to fundamental DBW features",
            Tier: "Tier 9",
            iconPath: "/tier-icons/Re-icon.png",
            color: "from-[#FFD700] via-[#FFD700] to-[#FFC000]", // Updated to bright yellow
            highlighted: false,
            path: "/membership/tier-9"
        }
    ];

    const handleTierClick = (path: string) => {
        router.push(path);
    };

    const renderTierCard = (tier: Tier, index: number): ReactElement => (
        <div
            key={index}
            className="group relative w-full"
            data-aos="fade-up"
            data-aos-delay={index * 100}
        >
            {/* Background Glow Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500"></div>

            <div className="relative rounded-xl p-6 h-full backdrop-blur-sm border border-[#BC1A1E]/20">
                <div className={`absolute inset-0 rounded-xl ${tier.highlighted ? 'bg-gradient-to-br from-black/90 to-black/70' : 'bg-black/90'}`}></div>

                {/* Tier Badge */}
                <div className="absolute -top-3 right-4 z-20">
                    <div className={`bg-gradient-to-r ${tier.color} px-3 py-1 rounded-full shadow-lg`}>
                        <span className="text-white text-xs font-bold">{tier.Tier}</span>
                    </div>
                </div>

                {tier.highlighted && (
                    <div className="absolute -top-4 left-4 z-20">
                        <div className="bg-white px-4 py-1 rounded-full shadow-[0_0_20px_rgba(188,26,30,0.5)] flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#BC1A1E]" />
                            <span className="text-[#BC1A1E] font-bold text-sm">Limited Edition</span>
                        </div>
                    </div>
                )}

                <div className="relative z-10 space-y-4">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 flex items-center justify-center relative bg-gradient-to-r ${tier.color} rounded-sm`}>
                            <Image
                                src={tier.iconPath}
                                alt={`${tier.name} icon`}
                                width={58}
                                height={58}
                                className="object-contain rounded-sm"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                            <p className="text-gray-400 text-sm">{tier.subtitle}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className={`text-sm ${tier.highlighted ? 'text-white/90' : 'text-gray-400'}`}>
                        {tier.description}
                    </p>

                    {/* Decorative Line */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#BC1A1E]/30 to-transparent"></div>

                    {/* CTA Button */}
                    <button
                        onClick={() => handleTierClick(tier.path)}
                        className={`w-full py-3 rounded-lg font-medium transition-all duration-500 flex items-center justify-center gap-2 
                            ${tier.highlighted ? 'bg-white text-[#BC1A1E] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white hover:shadow-[0_0_20px_rgba(188,26,30,0.3)]'} 
                            transform hover:scale-[1.02] group`}
                    >
                        View Full Details
                        <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
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

                {/* Animated Background Glows */}
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Title */}
                <div className="text-center mb-20 relative" data-aos="fade-down">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 blur-[10px] scale-110">
                            <h2 className="text-[#BC1A1E] text-5xl font-bold">DBW NFT Tiers</h2>
                        </div>
                        <h2 className="text-5xl font-bold text-white relative">
                            DBW NFT Tiers
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent animate-pulse"></div>
                        </h2>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Explore our tiered membership system and discover the perfect Tier for your needs
                    </p>
                </div>

                {/* Updated Grid Layout */}
                <div className="space-y-12">
                    {/* First Row - 2 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1600px] mx-auto">
                        {tiers.slice(0, 2).map((tier, index) => renderTierCard(tier, index))}
                    </div>
                    {/* Second Row - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
                        {tiers.slice(2, 5).map((tier, index) => renderTierCard(tier, index + 2))}
                    </div>
                    {/* Third Row - 4 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1600px] mx-auto">
                        {tiers.slice(5, 9).map((tier, index) => renderTierCard(tier, index + 5))}
                    </div>
                </div>
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

export default MembershipTiers;