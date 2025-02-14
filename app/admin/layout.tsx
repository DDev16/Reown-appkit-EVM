'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';

const ADMIN_ADDRESS = '0xd0cfD2e3Be2D49976D870898fcD6fE94Dbc98f37';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { address, isConnected } = useAccount();
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const checkAccess = () => {
            if (!isConnected || !address) {
                // Not connected, redirect to home
                router.push('/');
                setLoading(false);
                return;
            }

            // Check if connected address is admin
            const isAdmin = address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

            if (!isAdmin) {
                // User is connected but not admin
                router.push('/unauthorized');
                setLoading(false);
                return;
            }

            setLoading(false);
        };

        checkAccess();
    }, [pathname, router, isConnected, address, mounted]);

    // Handle initial server render
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        );
    }

    // Show connect wallet message if not connected
    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-xl font-semibold">Connect Wallet to Access Admin</h1>
                <appkit-button></appkit-button>
            </div>
        );
    }

    // Show unauthorized message if not admin
    if (address?.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-xl font-semibold">
                    Unauthorized: Only admin wallet can access this area
                </h1>
            </div>
        );
    }

    return <section>{children}</section>;
}