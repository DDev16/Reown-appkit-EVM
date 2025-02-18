"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import MusicPlayer from "./ui/MusicPlayer";
import AppKitButton from "./appkit/appkitButton";
import { useAccount, useReadContracts } from "wagmi";
import { parseAbi } from 'viem';

const ADMIN_ADDRESS = "0xd0cfD2e3Be2D49976D870898fcD6fE94Dbc98f37";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// ERC1155 minimal ABI for balanceOf
const ERC1155_ABI = parseAbi([
    'function balanceOf(address account, uint256 id) view returns (uint256)',
]);

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMembershipOpen, setIsMembershipOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { address } = useAccount();

    // Create balance check contracts for all 9 tiers - starting from index 0
    const balanceChecks = address
        ? Array.from({ length: 9 }, (_, i) => ({
            address: CONTRACT_ADDRESS,
            abi: ERC1155_ABI,
            functionName: 'balanceOf',
            args: [address, BigInt(i)] as const, // Changed from i + 1 to i to match AppKitButton
        }))
        : [];

    // Read NFT balances for all tiers
    const { data: nftBalances } = useReadContracts({
        contracts: balanceChecks,
    });

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Add debug logs
    useEffect(() => {
        console.log('Debug Info:');
        console.log('Address:', address);
        console.log('Contract Address:', CONTRACT_ADDRESS);
        console.log('Mounted:', mounted);
        console.log('NFT Balances:', nftBalances);
    }, [address, mounted, nftBalances]);

    const isAdmin = mounted && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

    // Check if user owns any NFT from any tier using BigInt constructor
    const hasAnyNFT = mounted && nftBalances?.some(result => {
        console.log('Checking balance result:', result);
        return result.status === 'success' &&
            result.result !== undefined &&
            result.result > BigInt(0);
    });

    // Log hasAnyNFT value
    useEffect(() => {
        console.log('Has Any NFT:', hasAnyNFT);
    }, [hasAnyNFT]);

    const navItems = [
        { name: "Home", path: "/" },
        ...(hasAnyNFT ? [{ name: "Dashboard", path: "/dashboard" }] : []),
        {
            name: "More",
            subItems: [
                { name: "Blog", path: "/blog" },
                { name: "Education", path: "/education" },
                { name: "Shop", path: "/shop" },
                { name: "About Us", path: "/about-us" },
                { name: "Sale Page", path: "/sales" },
                { name: "Features", path: "/our-features" },
                { name: "Contact", path: "/contact" },
            ],
        },
        {
            name: "Membership",
            subItems: [
                { name: "Tier 1", path: "/membership/tier-1" },
                { name: "Tier 2", path: "/membership/tier-2" },
                { name: "Tier 3", path: "/membership/tier-3" },
                { name: "Tier 4", path: "/membership/tier-4" },
                { name: "Tier 5", path: "/membership/tier-5" },
                { name: "Tier 6", path: "/membership/tier-6" },
                { name: "Tier 7", path: "/membership/tier-7" },
                { name: "Tier 8", path: "/membership/tier-8" },
                { name: "Tier 9", path: "/membership/tier-9" },
                { name: "Compare", path: "/membership/compare" },
            ],
        },
        ...(isAdmin ? [{ name: "Admin", path: "/admin/dashboard" }] : []),
    ];


    return (
        <nav
            className={`fixed w-full top-0 z-[9999] border-b transition-[background-color,backdrop-filter,border-color] duration-300 ${scrolled
                ? "bg-[#242223]/95 backdrop-blur-sm border-[#BC1A1E]/50"
                : "bg-transparent border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/assets/DBWLogo.png"
                                alt="DefiBullWorld Logo"
                                width={50}
                                height={50}
                                className="brightness-100"
                            />
                            <span className="ml-2 text-xl font-bold text-white">
                                DefiBullWorld
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:items-center sm:gap-2">
                        {navItems.map((item) =>
                            item.subItems ? (
                                <div
                                    key={item.name}
                                    className="relative group"
                                    onMouseEnter={() => {
                                        if (item.name === "Membership") {
                                            setIsMembershipOpen(true);
                                        } else if (item.name === "More") {
                                            setIsMoreOpen(true);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (item.name === "Membership") {
                                            setIsMembershipOpen(false);
                                        } else if (item.name === "More") {
                                            setIsMoreOpen(false);
                                        }
                                    }}
                                >
                                    <button
                                        className="text-gray-300 hover:text-white hover:bg-[#BC1A1E]/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                                    >
                                        {item.name}
                                        <svg
                                            className={`ml-1 h-4 w-4 fill-current transform transition-transform duration-300 ${(item.name === "Membership"
                                                ? isMembershipOpen
                                                : isMoreOpen)
                                                ? "rotate-180"
                                                : ""
                                                }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 h-4 w-full" />
                                    {(item.name === "Membership"
                                        ? isMembershipOpen
                                        : isMoreOpen) && (
                                            <ul className="absolute left-0 mt-2 w-48 bg-[#242223] border border-[#BC1A1E]/20 rounded-lg shadow-lg z-[9999]">
                                                {item.subItems.map((subItem) => (
                                                    <li key={subItem.name}>
                                                        <Link
                                                            href={subItem.path}
                                                            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-[#BC1A1E]/10 transition-colors"
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                </div>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className="text-gray-300 hover:text-white hover:bg-[#BC1A1E]/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative group"
                                >
                                    {item.name}
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
                                        <div className="w-0 h-full bg-[#BC1A1E] group-hover:w-full transition-[width] duration-300"></div>
                                    </div>
                                </Link>
                            )
                        )}
                        <div className="ml-4 flex items-center">
                            <MusicPlayer />
                            <AppKitButton />
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="sm:hidden flex items-center gap-2">
                        <MusicPlayer />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-[#BC1A1E]/10 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <div
                className={`sm:hidden fixed inset-x-0 top-16 bg-[#242223] border-b border-[#BC1A1E]/20 backdrop-blur-sm bg-opacity-90 transition-all duration-300 ease-in-out z-[9999] ${isMenuOpen
                    ? "max-h-screen opacity-100 overflow-y-auto"
                    : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <div className="px-4 pt-2 pb-3 space-y-1">
                    {navItems.map((item) =>
                        item.subItems ? (
                            <div key={item.name}>
                                <button
                                    onClick={() => {
                                        if (item.name === "Membership") {
                                            setIsMembershipOpen(!isMembershipOpen);
                                        } else if (item.name === "More") {
                                            setIsMoreOpen(!isMoreOpen);
                                        }
                                    }}
                                    className="text-gray-300 hover:text-white hover:bg-[#BC1A1E]/10 block px-4 py-2 rounded-lg text-base font-medium transition-colors w-full text-left"
                                >
                                    {item.name}
                                    <svg
                                        className={`inline ml-1 h-4 w-4 fill-current transform transition-transform duration-300 ${(item.name === "Membership"
                                            ? isMembershipOpen
                                            : isMoreOpen)
                                            ? "rotate-180"
                                            : ""
                                            }`}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" />
                                    </svg>
                                </button>
                                {(item.name === "Membership"
                                    ? isMembershipOpen
                                    : isMoreOpen) && (
                                        <div className="pl-4">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.path}
                                                    className="text-gray-300 hover:text-white hover:bg-[#BC1A1E]/10 block px-4 py-2 rounded-lg text-base font-medium transition-colors"
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        if (item.name === "Membership") {
                                                            setIsMembershipOpen(false);
                                                        } else if (item.name === "More") {
                                                            setIsMoreOpen(false);
                                                        }
                                                    }}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="text-gray-300 hover:text-white hover:bg-[#BC1A1E]/10 block px-4 py-2 rounded-lg text-base font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        )
                    )}
                    <div className="pt-2 flex justify-center">
                        <AppKitButton />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
