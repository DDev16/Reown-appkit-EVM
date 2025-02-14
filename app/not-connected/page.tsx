'use client';

import { Wallet, Link as LinkIcon } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

export default function NotConnectedPage() {
    return (
        <div className="min-h-screen text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-[#1E1E1E] rounded-lg p-8 shadow-2xl border border-red-900/30">
                    <div className="mb-6">
                        <Wallet className="mx-auto h-16 w-16 text-red-600 mb-4" />
                        <h1 className="text-3xl font-bold mb-4 text-white">
                            Wallet Not Connected
                        </h1>
                        <p className="text-gray-400 mb-6">
                            To access the DefiBullWorld Dashboard, you need to connect your wallet first.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-full inline-flex items-center justify-center px-6 py-3">
                            <appkit-button />
                        </div>
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