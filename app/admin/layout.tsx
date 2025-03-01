'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

// Change to an array with both admin addresses
const ADMIN_ADDRESSES = [
    '0x9211db27CE13c765f7Ff2BA0fdDfEDAcB4c2d108',
    '0xd0cfD2e3Be2D49976D870898fcD6fE94Dbc98f37',
    '0x51c0BD4bA7B521601bBBEC907365E24d5de65BA5'
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { address, isConnected } = useAccount()
    const [isAdmin, setIsAdmin] = useState(false)

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Settings', path: '/admin/settings' },
        { name: 'Post Blog', path: '/admin/post-blog' },
        { name: 'Upload', path: '/admin/upload' },
    ]

    useEffect(() => {
        // Check if user is connected and is one of the admins
        if (isConnected) {
            // Use Array.some to check if the connected address matches any admin address
            if (
                ADMIN_ADDRESSES.some(
                    (adminAddr) =>
                        adminAddr.toLowerCase() === address?.toLowerCase()
                )
            ) {
                setIsAdmin(true)
            } else {
                // Redirect non-admin users
                router.push('/unauthorized-admin')
            }
        } else {
            // Redirect if not connected
            router.push('/')
        }
    }, [isConnected, address, router])

    // Render a loading or placeholder state during initial check
    if (!isConnected || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Checking admin access...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple header */}
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-lg font-semibold">Admin Panel</h1>
                    <nav className="flex gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${pathname === item.path
                                    ? 'text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}
