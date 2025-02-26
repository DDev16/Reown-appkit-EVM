// CallCard.tsx
'use client';

import { Calendar, Clock, Users } from 'lucide-react';
import { CallItem } from '@/components/dashboard/tier-1-content/utils/types';
import { formatDate } from '@/components/dashboard/tier-1-content/utils/formatters';

interface CallCardProps {
    call: CallItem;
}

export const CallCard: React.FC<CallCardProps> = ({ call }) => {
    return (
        <div className="bg-black/30 rounded-lg overflow-hidden border border-red-900/20 hover:border-red-600/40 transition-colors p-4">
            <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-lg flex-shrink-0">
                    <Calendar size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">{call.title || "Untitled Call"}</h3>
                    <p className="text-sm text-gray-400 mt-1">{call.description || "No description available"}</p>

                    <div className="flex flex-wrap items-center mt-3 gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center">
                            <Users size={14} className="mr-1" /> Host: {call.host || "Unknown Host"}
                        </span>
                        <span className="flex items-center">
                            <Calendar size={14} className="mr-1" /> {formatDate(call.date)}
                        </span>
                        <span className="flex items-center">
                            <Clock size={14} className="mr-1" /> {call.time || "00:00"}
                        </span>
                    </div>

                    <button className="mt-3 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center w-fit">
                        <Calendar size={14} className="mr-1" />
                        Register Now
                    </button>
                </div>
            </div>
        </div>
    );
};
