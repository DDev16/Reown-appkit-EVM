'use client';

import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-[#1E1E1E] rounded-lg p-8 shadow-2xl border border-red-900/30">
                    <div className="mb-6">
                        <Shield className="mx-auto h-16 w-16 text-red-600 mb-4" />
                        <h1 className="text-3xl font-bold mb-4 text-white">
                            Access Restricted
                        </h1>
                        <p className="text-gray-400 mb-6">
                            You need to mint a DefiBullWorld Membership NFT to access the Dashboard.
                            Become a member to unlock exclusive features and benefits.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/membership/tier-1"
                            className="w-full inline-flex items-center justify-center px-6 py-3 
                            bg-red-600 hover:bg-red-700 text-white font-semibold 
                            rounded-lg transition-colors duration-300 
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            View Membership Tiers
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>

                        <Link
                            href="/"
                            className="w-full inline-flex items-center justify-center px-6 py-3 
                            bg-transparent border border-red-600/50 hover:bg-red-900/20 
                            text-white font-semibold rounded-lg transition-colors duration-300 
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}