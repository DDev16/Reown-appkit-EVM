"use client";

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { FaTwitter, FaYoutube, FaDiscord } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navigation = {
        platform: [
            { name: 'About Us', href: '/about-us' },
            { name: 'Features', href: '/our-features' },
            { name: 'Blog', href: '/blog' },
            { name: 'Shop', href: '/shop' }
        ],
        membership: [
            { name: 'Tier 1', href: '/membership/tier-1' },
            { name: 'Tier 2', href: '/membership/tier-2' },
            { name: 'Tier 3', href: '/membership/tier-3' },
            { name: 'Tier 4', href: '/membership/tier-4' },
            { name: 'Tier 5', href: '/membership/tier-5' },
            { name: 'Tier 6', href: '/membership/tier-6' },
            { name: 'Tier 7', href: '/membership/tier-7' },
            { name: 'Tier 8', href: '/membership/tier-8' },
            { name: 'Tier 9', href: '/membership/tier-9' },
            { name: 'Compare Plans', href: '#' }
        ],
        resources: [
            { name: 'Documentation', href: '#' },
            { name: 'Whitepaper', href: '#' },
            { name: 'FAQs', href: '#' },
            { name: 'Support', href: '/contact' }
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' }
        ]
    };

    return (
        <footer className="bg-[#1A1A1A] border-t border-[#BC1A1E]/20">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column - Full width on smallest screens */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-2">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Logo */}
                            <Image
                                src="/assets/DBWLogo.png"
                                alt="DefiBullWorld Logo"
                                width={200}
                                height={100}
                                className="h-10 sm:h-12 w-auto"
                            />
                            <p className="text-gray-400 text-sm sm:text-base max-w-sm">
                                Empowering individuals through comprehensive DeFi education and Web3 innovation.
                            </p>
                            {/* Social Links */}
                            <div className="flex space-x-4">
                                <a href="https://x.com/XRP_FLR_SGB" className="text-gray-400 hover:text-[#BC1A1E] transition-colors">
                                    <FaTwitter className="h-5 w-5 sm:h-6 sm:w-6" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-[#BC1A1E] transition-colors">
                                    <FaDiscord className="h-5 w-5 sm:h-6 sm:w-6" />
                                </a>
                                <a href="https://www.youtube.com/@DEFIBULLWORLD" className="text-gray-400 hover:text-[#BC1A1E] transition-colors">
                                    <FaYoutube className="h-5 w-5 sm:h-6 sm:w-6" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns - 2 columns on mobile, 3 on larger screens */}
                    <div className="col-span-1">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Platform</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {navigation.platform.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-400 text-sm hover:text-[#BC1A1E] transition-colors">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Membership</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {navigation.membership.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-400 text-sm hover:text-[#BC1A1E] transition-colors">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Resources</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {navigation.resources.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-400 text-sm hover:text-[#BC1A1E] transition-colors">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-[#BC1A1E]/20 bg-[#242223]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-center">
                        <div className="lg:col-span-2 text-center lg:text-left">
                            <h4 className="text-white font-semibold text-base sm:text-lg">Stay Updated</h4>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">Subscribe to our newsletter for the latest DeFi insights.</p>
                        </div>
                        <div>
                            <form className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-[#1A1A1A] border border-[#BC1A1E]/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#BC1A1E]/50 text-sm sm:text-base"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#BC1A1E] text-white px-4 py-2 rounded-lg hover:bg-[#BC1A1E]/90 transition-colors flex items-center justify-center sm:justify-start"
                                >
                                    <span className="text-sm sm:text-base">Subscribe</span>
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#BC1A1E]/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center space-y-3 sm:space-y-0">
                        <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                            © {currentYear} DefiBullWorld. All rights reserved.
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                            {navigation.legal.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-400 hover:text-[#BC1A1E] text-xs sm:text-sm transition-colors"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;