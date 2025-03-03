'use client';

import { GraduationCap } from 'lucide-react';
import { CourseItem } from '@/types/types';
import { ContentSectionHeader } from '@/components/dashboard/ui/ContentSectionHeader';
import { CourseCard } from '@/components/dashboard/courses/CourseCard';

interface CourseSectionProps {
    courses: CourseItem[];
    title?: string;
    viewAllLink?: string;
}

export const CourseSection: React.FC<CourseSectionProps> = ({
    courses,
    title = "Latest Courses",
    viewAllLink = "/dashboard/tier-1/courses"
}) => {
    // Count total number of lessons across all courses
    const totalLessons = courses?.reduce((sum, course) => sum + (course.lessons || 0), 0) || 0;

    // Count courses with lesson data
    const coursesWithLessons = courses?.filter(course =>
        course.lessonData && course.lessonData.length > 0
    ).length || 0;

    return (
        <div className="mb-8">
            <ContentSectionHeader
                title={title}
                viewAllLink={viewAllLink}
                icon={<GraduationCap className="ml-1 w-4 h-4" />}
            />

            {coursesWithLessons > 0 && (
                <div className="mb-4 px-1">
                    <p className="text-gray-400 text-xs">
                        <span className="text-red-500 font-medium">{coursesWithLessons}</span> courses have
                        detailed lesson content available. Click &quot;View Lessons&quot; to explore.
                    </p>
                </div>
            )}

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