'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Tier } from '../types';

// All tiers
export const allTiers: Tier[] = [
    { id: 1, name: 'TOP TIER' },
    { id: 2, name: 'RHODIUM' },
    { id: 3, name: 'PLATINUM' },
    { id: 4, name: 'GOLD' },
    { id: 5, name: 'RUTHENIUM' },
    { id: 6, name: 'IRIDIUM' },
    { id: 7, name: 'OSMIUM' },
    { id: 8, name: 'PALLADIUM' },
    { id: 9, name: 'RHENIUM' },
    { id: 10, name: 'SILVER' }
];

interface TierSelectorProps {
    selectedTiers: number[];
    toggleTier: (tierId: number) => void;
}

export default function TierSelector({
    selectedTiers,
    toggleTier
}: TierSelectorProps) {
    return (
        <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
                Select Tiers <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {allTiers.map((tier) => (
                    <button
                        type="button"
                        key={tier.id}
                        onClick={() => toggleTier(tier.id)}
                        className={`py-2 px-3 rounded-lg text-sm transition-colors ${selectedTiers.includes(tier.id)
                            ? 'bg-red-600 text-white'
                            : 'bg-black/40 text-white/80 hover:bg-black/60'
                            }`}
                    >
                        {selectedTiers.includes(tier.id) && (
                            <Check size={16} className="inline-block mr-1" />
                        )}
                        {tier.name}
                    </button>
                ))}
            </div>
        </div>
    );
}