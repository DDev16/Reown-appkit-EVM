"use client";
import { BookOpen, Lock, Gift, ShoppingBag, Users, Newspaper, ExternalLink } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Link from 'next/link';

const FeaturesSection = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50
        });
    }, []);

    const features = [
        {
            icon: <BookOpen className="w-12 h-12" />,
            title: "Token-Gated Education",
            description: "Access exclusive DeFi educational content tailored to your membership tier level.",
            gradient: "from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E]",
            animation: "fade-up",
            route: "/our-features"
        },
        {
            icon: <Lock className="w-12 h-12" />,
            title: "Secure Platform",
            description: "Built with UUPS upgradeable contracts ensuring maximum security and scalability.",
            gradient: "from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E]",
            animation: "fade-up",
            route: "/our-features"
        },
        {
            icon: <Gift className="w-12 h-12" />,
            title: "Airdrops & Rewards",
            description: "Receive exclusive NFTs and tokens through our advanced airdrop system tool.",
            gradient: "from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E]",
            animation: "fade-up",
            route: "/our-features"
        },
        {
            icon: <ShoppingBag className="w-12 h-12" />,
            title: "Web3 Merchandise",
            description: "Shop exclusive merchandise using cryptocurrency through our secure payment gateway.",
            gradient: "from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E]",
            animation: "fade-up",
            route: "/our-features"
        },
        {
            icon: <Users className="w-12 h-12" />,
            title: "Community Access",
            description: "Join a thriving community of DeFi enthusiasts and experts through our platform.",
            gradient: "from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E]",
            animation: "fade-up",
            route: "/our-features"
        },
        {
            icon: <Newspaper className="w-12 h-12" />,
            title: "Latest Updates",
            description: "Stay informed with our integrated blog featuring the latest DeFi trends and insights.",
            gradient: "from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E]",
            animation: "fade-up",
            route: "/our-features"
        }
    ];

    return (
        <section className="py-8 relative overflow-hidden">

            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                            linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                />

                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[100px] animate-flow-1 opacity-20" />
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[100px] animate-flow-2 opacity-15" />
                    </div>
                </div>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 relative" data-aos="fade-down">
                    <div className="inline-block">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                            <h2 className="relative text-4xl font-bold text-white mb-4 py-2">
                                Platform Features
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                            </h2>
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Discover the comprehensive suite of tools and features designed to enhance your DeFi education journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative"
                            data-aos={feature.animation}
                            data-aos-delay={index * 100}
                        >
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-[2px] transition-all duration-500 group-hover:opacity-100" />

                            <div className="relative p-8 rounded-xl bg-black/90 border border-[#BC1A1E]/20 transition-all duration-500 group-hover:-translate-y-1 backdrop-blur-sm">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#BC1A1E]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 space-y-6">
                                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative p-3 rounded-xl bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51]">
                                            <div className="text-white flex items-center justify-center">
                                                {feature.icon}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-[#FF4B51] transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                            {feature.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <Link href={feature.route} className="inline-flex items-center text-[#BC1A1E] hover:text-[#FF4B51] transition-colors">
                                            <span className="mr-2">Learn More</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
};

export default FeaturesSection;