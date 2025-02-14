"use client";

import { BookOpen, Shield, Users, BarChart } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutSection = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const values = [
        {
            icon: <BookOpen className="w-12 h-12" />,
            title: "Transparent Education",
            description:
                "We deliver in-depth DeFi insights with clarity and integrity, empowering you with actionable knowledge.",
            animation: "fade-up",
        },
        {
            icon: <Shield className="w-12 h-12" />,
            title: "Robust Security",
            description:
                "Experience top-tier protection with state-of-the-art protocols that secure your digital journey.",
            animation: "fade-up",
        },
        {
            icon: <Users className="w-12 h-12" />,
            title: "Community Empowerment",
            description:
                "Become part of a global network that values collaboration, support, and shared growth.",
            animation: "fade-up",
        },
        {
            icon: <BarChart className="w-12 h-12" />,
            title: "Data-Driven Insights",
            description:
                "Leverage real-time market analysis and trends curated by industry experts to make informed decisions.",
            animation: "fade-up",
        },
    ];

    return (
        <section className="py-12 relative overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, #BC1A1E 1px, transparent 1px),
              linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
            `,
                        backgroundSize: "40px 40px",
                        maskImage:
                            "radial-gradient(circle at 50% 50%, black, transparent 80%)",
                    }}
                />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[100px] animate-flow-1 opacity-20" />
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[100px] animate-flow-2 opacity-15" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12" data-aos="fade-down">
                    <div className="inline-block">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                            <h2 className="relative text-4xl font-bold text-white mb-4 py-2">
                                Who We Are
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                            </h2>
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        We’re not just an education platform – we’re a movement dedicated to
                        redefining how decentralized finance is learned and experienced.
                    </p>
                </div>

                {/* Our Story */}
                <div className="mb-12" data-aos="fade-up">
                    <p className="text-gray-300 text-lg max-w-4xl mx-auto text-center">
                        Founded on the belief that knowledge is the foundation of empowerment,
                        our platform bridges the gap between traditional finance and the new
                        digital economy. With a team of industry experts and cutting-edge
                        technology, we’re committed to delivering a secure, transparent, and
                        collaborative environment where everyone can thrive in the DeFi space.
                    </p>
                </div>

                {/* Core Values */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="group relative p-6 rounded-xl bg-black/90 border border-[#BC1A1E]/20 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
                            data-aos={value.animation}
                            data-aos-delay={index * 100}
                        >
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-sm transition-all duration-500 group-hover:opacity-100" />

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <div className="p-3 rounded-full bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51]">
                                        {value.icon}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF4B51] transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes flow-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-50px, 50px) scale(1.1);
          }
        }
        @keyframes flow-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1.1);
          }
          50% {
            transform: translate(50px, -50px) scale(1);
          }
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

export default AboutSection;
