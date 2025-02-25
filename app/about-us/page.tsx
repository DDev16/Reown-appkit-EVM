"use client";

import {
    BookOpen,
    Shield,
    Users,
    BarChart,
    Target,
    Globe,
    Award,
    Rocket
} from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

const AboutUsPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const coreValues = [
        {
            icon: <BookOpen className="w-12 h-12" />,
            title: "Transparent Education",
            description: "We deliver in-depth DeFi insights with clarity and integrity, empowering you with actionable knowledge.",
            fullDetail: "Education is the cornerstone of empowerment. We believe in breaking down complex blockchain concepts into digestible, actionable insights. Our commitment to transparency means no hidden agendas, just pure, unfiltered knowledge that helps you navigate the intricate world of decentralized finance."
        },
        {
            icon: <Shield className="w-12 h-12" />,
            title: "Robust Security",
            description: "Experience top-tier protection with state-of-the-art protocols that secure your digital journey.",
            fullDetail: "Security isn't just a feature—it's our fundamental promise. We've developed multi-layered security protocols that protect your digital assets, personal information, and learning journey. From advanced encryption to continuous vulnerability assessments, we ensure your peace of mind in the ever-evolving digital landscape."
        },
        {
            icon: <Users className="w-12 h-12" />,
            title: "Community Empowerment",
            description: "Become part of a global network that values collaboration, support, and shared growth.",
            fullDetail: "We're more than a platform—we're a global community of DeFi enthusiasts, learners, and innovators. Our ecosystem thrives on collaboration, mutual support, and the collective pursuit of knowledge. Every member brings unique insights, creating a rich, dynamic environment of shared learning and growth."
        },
        {
            icon: <BarChart className="w-12 h-12" />,
            title: "Data-Driven Insights",
            description: "Leverage real-time market analysis and trends curated by industry experts to make informed decisions.",
            fullDetail: "In the fast-paced world of DeFi, information is power. Our team of expert analysts provides real-time, comprehensive market insights. We transform complex data into clear, actionable intelligence, empowering you to make informed decisions with confidence and strategic precision."
        }
    ];

    const milestones = [
        {
            icon: <Target className="w-12 h-12 text-[#FF4B51]" />,
            title: "Platform Launch",
            description: "Initiated our mission to democratize DeFi education with a groundbreaking learning platform."
        },
        {
            icon: <Globe className="w-12 h-12 text-[#FF4B51]" />,
            title: "Global Expansion",
            description: "Expanded our reach, connecting DeFi learners across 50+ countries with localized content."
        },
        {
            icon: <Award className="w-12 h-12 text-[#FF4B51]" />,
            title: "Industry Recognition",
            description: "Aiming to recieve top blockchain education innovation award for our unique token-gated learning approach."
        },
        {
            icon: <Rocket className="w-12 h-12 text-[#FF4B51]" />,
            title: "Future Roadmap",
            description: "Committed to integrating AI-driven personalized learning and expanding our Web3 educational ecosystem."
        }
    ];

    return (
        <div className="text-white min-h-screen">
            {/* Background Layer */}
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

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-20" data-aos="fade-down">
                    <div className="inline-block relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                        <h1 className="relative text-5xl font-bold text-white mb-4 py-2">
                            Our Story
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-4">
                        We&apos;re not just an education platform – we&apos;re a movement dedicated to redefining how decentralized finance is learned and experienced.
                    </p>
                </div>

                {/* Detailed Origin Story */}
                <div className="bg-[#1A1A1A] rounded-xl border border-[#BC1A1E]/20 p-12 mb-16" data-aos="fade-up">
                    <h2 className="text-3xl font-bold text-[#FF4B51] mb-6">Our Vision</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Founded by a collective of blockchain pioneers, DeFi experts, and educational innovators, our platform emerged from a fundamental belief: knowledge is the true currency of the digital age. We recognized the complexity and opacity of decentralized finance and set out to create a transformative learning ecosystem.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Our mission goes beyond teaching technical skills. We aim to cultivate a global community of informed, empowered individuals who can shape the future of finance. By breaking down barriers to understanding, we&apos;re not just educating—we&apos;re democratizing access to the most revolutionary financial technology of our time.
                    </p>
                </div>

                {/* Core Values */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The principles that drive our mission and define our approach to DeFi education
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="bg-[#1A1A1A] rounded-xl border border-[#BC1A1E]/20 p-8 group"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="flex items-center mb-6">
                                    <div className="p-4 rounded-full bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] mr-6">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#FF4B51]">{value.title}</h3>
                                </div>
                                <p className="text-gray-300 mb-4">{value.description}</p>
                                <p className="text-gray-400 leading-relaxed">{value.fullDetail}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Milestones */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Key moments that have defined our path and shaped our vision
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className="bg-[#1A1A1A] rounded-xl border border-[#BC1A1E]/20 p-6 text-center"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="flex justify-center mb-6">
                                    {milestone.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#FF4B51] mb-2">{milestone.title}</h3>
                                <p className="text-gray-400">{milestone.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-[#BC1A1E]/10 rounded-xl p-12 text-center" data-aos="zoom-in">
                    <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
                    <p className="text-gray-400 max-w-3xl mx-auto mb-8">
                        Whether you&apos;re a curious beginner or an experienced DeFi professional, there&apos;s a place for you in our community. Together, we can transform the future of finance.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all"
                    >
                        Get Involved
                    </Link>
                </div>
            </div>

            {/* Animation Styles */}
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
        </div>
    );
};

export default AboutUsPage;