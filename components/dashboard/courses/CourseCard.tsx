// CourseCard.tsx
'use client';

import { CourseItem } from '@/types/types';

interface CourseCardProps {
    course: CourseItem;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    return (
        <div className="bg-black/30 rounded-lg overflow-hidden border border-red-900/20 hover:border-red-600/40 transition-colors">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                    <img
                        src={course.thumbnail || "/placeholder-thumbnail.jpg"}
                        alt={course.title || "Course thumbnail"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-thumbnail.jpg";
                        }}
                    />
                </div>
                <div className="p-4 md:w-2/3">
                    <h3 className="font-semibold text-white">{course.title || "Untitled Course"}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{course.description || "No description available"}</p>

                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">{course.lessons || 0} Lessons</span>
                        <button className="text-xs bg-red-900/30 hover:bg-red-900/50 text-white px-3 py-1 rounded">
                            Start Course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
