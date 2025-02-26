// ContentSectionHeader.tsx
'use client';

import Link from 'next/link';
import { ContentSectionProps } from '@/components/dashboard/tier-1-content/utils/types';

export const ContentSectionHeader: React.FC<ContentSectionProps> = ({
    title,
    viewAllLink,
    icon
}) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <Link
                href={viewAllLink}
                className="text-sm text-red-400 hover:text-red-300 flex items-center"
            >
                View All {icon}
            </Link>
        </div>
    );
};