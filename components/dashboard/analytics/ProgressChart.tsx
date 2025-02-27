'use client';

import React from 'react';

interface ProgressChartProps {
    data: {
        label: string;
        value: number;
        color: string;
        icon?: React.ReactNode;
    }[];
    title?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
    data,
    title = "Content Completion"
}) => {
    // Sort data by value (descending)
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return (
        <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>

            <div className="space-y-4">
                {sortedData.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                {item.icon && <span className="mr-2">{item.icon}</span>}
                                <span className="text-sm text-gray-300">{item.label}</span>
                            </div>
                            <span className="text-sm font-medium text-white">{Math.round(item.value)}%</span>
                        </div>

                        <div className="w-full bg-zinc-800 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${item.value}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};