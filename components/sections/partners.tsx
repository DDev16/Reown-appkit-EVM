"use client";
import { useEffect, ReactElement } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Partner {
    name: string;
    logo: string;
    website: string;
    featured: boolean;
}

const Partners = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 44,
        });
    }, []);

    const partners: Partner[] = [
        {
            name: "True Gems",
            logo: "/assets/truegems.svg",
            website: "#",
            featured: true
        },
        {
            name: "Flare Community",
            logo: "/assets/FLRCommunity.png",
            website: "https://x.com/CommunityFlare",
            featured: false
        },
        {
            name: "DevD Services",
            logo: "/assets/devdservices.png",
            website: "https://github.com/ddev16",
            featured: false
        }

    ];

    const renderPartnerLogo = (partner: Partner, index: number): ReactElement => (
        <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            className="group relative flex items-center justify-center h-32"
            data-aos="fade-up"
            data-aos-delay={index * 44}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-gradient-to-b from-[#BC1A1E] to-transparent transition-opacity duration-440"></div>

            {/* Logo Container */}
            <div className="relative p-4 w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-440">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#BC1A1E]/10 via-[#FF4B51]/10 to-[#BC1A1E]/10 rounded-xl"></div>
                    <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                </div>

                {/* Logo */}
                <div className="relative z-10 transition-transform duration-440 group-hover:scale-110 w-full h-full flex items-center justify-center">
                    <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={244}
                        height={144}
                        className="object-contain filter group-hover:brightness-110"
                    />


                    {/* Enhanced Hover Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-sm rounded-xl">
                        <h3 className="text-white font-bold mb-2">{partner.name}</h3>
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <button className="bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] hover:from-[#FF4B51] hover:to-[#BC1A1E] text-white px-4 py-2 border border-[#BC1A1E] rounded-lg flex items-center gap-2">
                                Visit Website
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );

    return (
        <section className="py-20 relative overflow-hidden">
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
                        maskImage: 'radial-gradient(circle at 44% 44%, black, transparent 80%)'
                    }}
                />

                {/* Animated Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-2/4 w-44 h-44">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2"></div>
                    </div>
                    <div className="absolute top-1/4 left-1/4 w-44 h-44">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2"></div>
                    </div>
                    <div className="absolute top-1/4 right-2/4 w-44 h-44">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2"></div>
                    </div>
                    <div className="absolute top-1/4 right-1/4 w-44 h-44">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2"></div>
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Title */}
                <div className="text-center mb-16 relative" data-aos="fade-down">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 blur-[10px] scale-110">
                            <h2 className="text-[#BC1A1E] text-5xl font-bold">Our Partners</h2>
                        </div>
                        <h2 className="text-5xl font-bold text-white relative">
                            Our Partners
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent animate-pulse"></div>
                        </h2>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
                        Collaborating with industry leaders to build the future of DeFi
                    </p>
                </div>

                {/* Partners Grid - Centered for two partners */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-[800px] mx-auto">
                    {partners.map((partner, index) => (
                        <div key={index} className="w-full md:w-1/2 max-w-[300px]">
                            {renderPartnerLogo(partner, index)}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes flow-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                    44% { transform: translate(-30px, 30px) scale(1.1); opacity: 0.3; }
                }
                @keyframes flow-2 {
                    0%, 100% { transform: translate(0, 0) scale(1.1); opacity: 0.15; }
                    44% { transform: translate(30px, -30px) scale(1); opacity: 0.25; }
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

export default Partners;