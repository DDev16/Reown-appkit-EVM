// StatCard.tsx
'use client';

import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
    label: string;
    value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon,
    iconBgColor,
    iconColor,
    label,
    value
}) => {
    return (
        <div className="bg-black/30 rounded-lg p-4 border border-red-900/20">
            <div className="flex items-center">
                <div className={`${iconBgColor} p-3 rounded-lg`}>
                    {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${iconColor}` })}
                </div>
                <div className="ml-4">
                    <h3 className="text-gray-400 text-sm">{label}</h3>
                    <p className="text-xl font-semibold text-white">{value}</p>
                </div>
            </div>
        </div>
    );
};