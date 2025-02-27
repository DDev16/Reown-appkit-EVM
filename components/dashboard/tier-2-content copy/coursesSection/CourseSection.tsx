// CourseSection.tsx
'use client';

import { GraduationCap } from 'lucide-react';
import { CourseItem } from '@/types/types';
import { ContentSectionHeader } from '@/components/dashboard/ui/ContentSectionHeader';
import { CourseCard } from '@/components/dashboard/courses/CourseCard';

interface CourseSectionProps {
    courses: CourseItem[];
}

export const CourseSection: React.FC<CourseSectionProps> = ({ courses }) => {
    return (
        <div className="mb-8">
            <ContentSectionHeader
                title="Latest Courses"
                viewAllLink="/dashboard/tier-1/courses"
                icon={<GraduationCap className="ml-1 w-4 h-4" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses && courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))
                ) : (
                    <div className="col-span-2 text-center py-8 bg-black/20 rounded-lg">
                        <p className="text-gray-400">No courses available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};