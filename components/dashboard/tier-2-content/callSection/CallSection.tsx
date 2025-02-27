// CallSection.tsx
'use client';

import { Users } from 'lucide-react';
import { CallItem } from '@/types/types';
import { ContentSectionHeader } from '@/components/dashboard/ui/ContentSectionHeader';
import { CallCard } from '@/components/dashboard/calls/CallCard';

interface CallSectionProps {
    calls: CallItem[];
}

export const CallSection: React.FC<CallSectionProps> = ({ calls }) => {
    return (
        <div>
            <ContentSectionHeader
                title="Upcoming Zoom Calls"
                viewAllLink="/dashboard/tier-1/calls"
                icon={<Users className="ml-1 w-4 h-4" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calls && calls.length > 0 ? (
                    calls.map((call) => (
                        <CallCard key={call.id} call={call} />
                    ))
                ) : (
                    <div className="col-span-2 text-center py-8 bg-black/20 rounded-lg">
                        <p className="text-gray-400">No upcoming calls scheduled yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};