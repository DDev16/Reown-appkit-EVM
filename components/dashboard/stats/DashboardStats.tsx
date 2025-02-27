// DashboardStats.tsx
'use client';

import { Video, GraduationCap, Calendar } from 'lucide-react';
import { StatCard } from './StatCard';

interface DashboardStatsProps {
    videoCount: number;
    courseCount: number;
    callCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
    videoCount,
    courseCount,
    callCount
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
                icon={<Video />}
                iconBgColor="bg-red-600/20"
                iconColor="text-red-500"
                label="Video Library"
                value={`${videoCount} Videos`}
            />

            <StatCard
                icon={<GraduationCap />}
                iconBgColor="bg-green-600/20"
                iconColor="text-green-500"
                label="Courses"
                value={`${courseCount} Courses`}
            />

            <StatCard
                icon={<Calendar />}
                iconBgColor="bg-blue-600/20"
                iconColor="text-blue-500"
                label="Upcoming Events"
                value={`${callCount} Calls`}
            />
        </div>
    );
};