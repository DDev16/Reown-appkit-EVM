'use client'

import React from 'react'

export default function DashboardPage() {
    return (
        <div>
            {/* Page header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-gray-600">Welcome to your admin dashboard</p>
            </div>

            {/* Simple stats grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Users Card */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="font-medium text-gray-600">Total Users</div>
                    <div className="mt-2 text-3xl font-bold">2,345</div>
                </div>

                {/* NFTs Minted Card */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="font-medium text-gray-600">NFTs Minted</div>
                    <div className="mt-2 text-3xl font-bold">1,234</div>
                </div>

                {/* Active Sales Card */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="font-medium text-gray-600">Active Sales</div>
                    <div className="mt-2 text-3xl font-bold">123</div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="text-sm text-gray-600">
                            No recent activity to display
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}