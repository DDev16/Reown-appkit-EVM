"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Hero: React.FC = () => {
    const backgroundRef = useRef<HTMLDivElement>(null);
    const bullHeadRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Initialize AOS for scroll animations
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
            disable: 'phone'
        });

        const handleNavigation = () => {
            router.push('/membership/tier-1');
        };

        // Function to check if the device is mobile based on width
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Scroll handler applies parallax for the background on all devices.
        // For the bull head, it applies a parallax effect only when not mobile.
        const handleScroll = () => {
            const scrollPosition = window.pageYOffset;
            requestAnimationFrame(() => {
                if (backgroundRef.current) {
                    backgroundRef.current.style.transform = `translateY(${scrollPosition * 0.5}px)`;
                }
                if (bullHeadRef.current) {
                    bullHeadRef.current.style.transform = isMobile
                        ? 'none'
                        : `translateY(${scrollPosition * 0.3}px)`;
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile, router]); // Added router to dependencies

    return (
        <div className="relative min-h-screen bg-[#242223] overflow-hidden">
            <div
                ref={backgroundRef}
                className="absolute inset-0"
                style={{
                    backgroundImage: 'url("/assets/BullBG2.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    willChange: 'transform'
                }}
            />

            <div className="relative min-h-screen pb-24 sm:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Left-side Content */}
                        <div
                            className="lg:w-1/2 text-left space-y-8 order-1 lg:order-none z-10 relative"
                            data-aos="fade-right"
                            data-aos-duration="800"
                        >
                            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                                <span
                                    className="block text-transparent bg-clip-text bg-gradient-to-r from-[#BC1A1E] to-[#BC1A1E]/90"
                                    data-aos="zoom-in"
                                    data-aos-duration="800"
                                >
                                    Master DeFi Education
                                </span>
                                <span
                                    className="block mt-4 text-white"
                                    data-aos="fade-right"
                                    data-aos-delay="400"
                                    data-aos-duration="800"
                                >
                                    Unlock Your Financial Future
                                </span>
                            </h1>

                            <p
                                className="text-sml sm:text-2xl text-gray-300"
                                data-aos="fade-up"
                                data-aos-delay="800"
                                data-aos-duration="800"
                            >
                                Join the revolution in decentralized finance education. Learn, earn, and grow.
                            </p>
                            <div
                                className="hidden lg:flex flex-col sm:flex-row gap-6"
                                data-aos="fade-up"
                                data-aos-delay="200"
                                data-aos-duration="600"
                            >
                                <button
                                    onClick={() => router.push('/membership/tier-1')}
                                    className="group inline-flex items-center px-8 py-4 rounded-lg text-lg font-medium text-white bg-[#BC1A1E] hover:bg-[#BC1A1E]/90 transition-colors"
                                >
                                    <span className="flex items-center">
                                        Start Learning & Earning
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </span>
                                </button>
                                <button
                                    onClick={() => router.push('/membership/tier-1')}
                                    className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-medium text-white bg-transparent border border-[#BC1A1E]/30 hover:border-[#BC1A1E] transition-colors"
                                >
                                    View Membership
                                </button>
                            </div>
                        </div>

                        {/* Bull Head Section */}
                        <div
                            ref={bullHeadRef}
                            className="lg:w-1/2 flex justify-center items-center order-2 lg:order-none relative z-10 -mt-12 sm:-mt-20 lg:mt-0"
                        >
                            <div className="relative mt-8 w-full max-w-lg">
                                <div className="absolute -inset-4 bg-[#BC1A1E]/20 rounded-full blur-3xl"></div>
                                <Image
                                    src="/assets/BullHead.png"
                                    alt="Bull Head"
                                    width={800}
                                    height={800}
                                    className="relative w-800 h-800 object-contain"
                                />
                            </div>
                        </div>

                        {/* Mobile Buttons */}
                        <div
                            className="flex lg:hidden flex-col sm:flex-row gap-6 order-3 w-full z-10 relative"
                            data-aos="fade-up"
                            data-aos-delay="200"
                            data-aos-duration="600"
                        >
                            <button
                                onClick={() => router.push('/membership/tier-1')}
                                className="group inline-flex items-center px-8 py-4 rounded-lg text-lg font-medium text-white bg-[#BC1A1E] hover:bg-[#BC1A1E]/90 transition-colors"
                            >
                                <span className="flex items-center">
                                    Start Learning
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </span>
                            </button>
                            <button
                                onClick={() => router.push('/membership/tier-1')}
                                className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-medium text-white bg-transparent border border-[#BC1A1E]/30 hover:border-[#BC1A1E] transition-colors"
                            >
                                View Membership
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg
                        className="relative block w-full"
                        viewBox="0 0 1440 200"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,64 C480,150 960,150 1440,64 L1440,200 L0,200 Z"
                            fill="#BC1A1E"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Hero;