'use client';

import React from 'react';
import { AnalyticsSummary, ContentType } from './types';

interface AnalyticsSummaryCardProps {
    data: AnalyticsSummary;
}

export const AnalyticsSummaryCard: React.FC<AnalyticsSummaryCardProps> = ({ data }) => {
    const {
        contentType,
        title,
        icon,
        primaryStat,
        primaryLabel,
        secondaryStat,
        secondaryLabel,
        color,
        bgGradient
    } = data;

    // Format stat with +
    const formatStat = (stat: number) => {
        return stat >= 0 ? `+${stat}` : `${stat}`;
    };

    // Format percentage
    const formatPercentage = (value: number) => {
        return `${Math.round(value)}%`;
    };

    // Optional: Add a switch statement to handle different content types if needed
    const handleContentTypeSpecificLogic = (type: ContentType) => {
        switch (type) {
            case 'videos':
                // Specific logic for videos if needed
                break;
            case 'courses':
                // Specific logic for courses if needed
                break;
            case 'tests':
                // Specific logic for tests if needed
                break;
            case 'blogs':
                // Specific logic for blogs if needed
                break;
            case 'calls':
                // Specific logic for calls if needed
                break;
            case 'analytics':
                // Specific logic for analytics if needed
                break;
            case 'all':
                // Specific logic for all content if needed
                break;
        }
    };

    // Call the content type logic
    React.useEffect(() => {
        handleContentTypeSpecificLogic(contentType);
    }, [contentType]);

    return (
        <div className={`rounded-lg border border-zinc-800 overflow-hidden ${bgGradient}`}>
            <div className="p-4">
                {/* Card header */}
                <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${color}`}>
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>

                {/* Primary stat */}
                <div className="mb-4">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-white">
                            {typeof primaryStat === 'number' && primaryStat % 1 === 0
                                ? primaryStat
                                : formatPercentage(primaryStat)}
                        </span>
                        <span className="ml-1 text-sm text-gray-400">/{primaryLabel}</span>
                    </div>
                </div>

                {/* Secondary stat */}
                <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">{secondaryLabel}</div>
                    <div className={secondaryStat >= 0 ? "text-green-500" : "text-red-500"}>
                        {formatStat(secondaryStat)}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            {primaryStat <= 100 && primaryStat >= 0 && (
                <div className="w-full bg-zinc-900 h-1">
                    <div
                        className={`h-1 ${color.replace('bg-', 'bg-')}`}
                        style={{ width: `${primaryStat}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};