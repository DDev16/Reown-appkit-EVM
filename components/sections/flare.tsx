"use client";
import { useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Flare = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const features = [
        {
            title: "Fast & Secure",
            description: "Experience lightning-fast transactions with top-tier security on the Flare Network."
        },
        {
            title: "Cross-Chain",
            description: "Seamlessly interact with multiple blockchain networks through Flare's infrastructure."
        },
        {
            title: "Low Cost",
            description: "Benefit from minimal transaction fees while maintaining high performance."
        },
        {
            title: "Scalable",
            description: "Built for growth with Flare's highly scalable blockchain architecture."
        }
    ];

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

                {/* Animated Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-flow-1"></div>
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-flow-2"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Main Content */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left Side - Text Content */}
                    <div className="lg:w-1/2 space-y-8" data-aos="fade-right">
                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#BC1A1E]/10 to-[#FF4B51]/10 border border-[#BC1A1E]/20">
                                <Sparkles className="w-4 h-4 text-[#FF4B51]" />
                                <span className="text-white/80 text-sm">Powered by Flare Network</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white">
                                Built on{" "}
                                <span className="bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] bg-clip-text text-transparent">
                                    Flare Network
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg">
                                Leveraging the power of Flare Network&quot;s robust infrastructure for enhanced security,
                                scalability, and cross-chain capabilities.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-xl bg-gradient-to-r from-[#BC1A1E]/5 to-[#FF4B51]/5 border border-[#BC1A1E]/20 hover:border-[#BC1A1E]/40 transition-all duration-300 group"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF4B51] transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <a
                            href="https://flare.network"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-medium hover:shadow-[0_0_20px_rgba(188,26,30,0.5)] transition-all duration-300 hover:scale-105"
                        >
                            Learn More
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Right Side - Visual Element */}
                    <div className="lg:w-1/2" data-aos="fade-left">
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-full filter blur-[100px] opacity-20"></div>

                            {/* Main Image */}
                            <div className="relative rounded-2xl overflow-hidden border border-[#BC1A1E]/20 shadow-[0_0_30px_rgba(188,26,30,0.2)] transform hover:scale-105 transition-transform duration-500">
                                <Image
                                    src="/assets/flareImg.png"
                                    alt="Flare Network Integration"
                                    width={600}
                                    height={400}
                                    className="w-full h-auto"
                                />

                                {/* Overlay Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                                <Image
                                                    src="/assets/flarelogo2.png"
                                                    alt="Flare Logo"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Flare Network</h4>
                                                <p className="text-white/60 text-sm">Official Integration Partner</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default Flare;