'use client';

import { useState } from 'react';
import { CourseItem, CourseLessonData } from '@/types/types';
import { ChevronDown, ChevronUp, Video, FileText, Play } from 'lucide-react';
import { toast } from 'sonner';

interface CourseCardProps {
    course: CourseItem;
    onStartCourse?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    course,
    onStartCourse
}) => {
    const [expanded, setExpanded] = useState(false);

    // Format duration from seconds to mm:ss
    const formatDuration = (seconds?: number): string => {
        if (!seconds) return '';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handler for starting the course
    const handleStartCourse = () => {
        console.log('Attempting to start course:', course);

        // If a custom onStartCourse handler is provided, use it first
        if (onStartCourse) {
            onStartCourse(course.id);
            return;
        }

        // If there are lessons, go to the first lesson
        if (course.lessonData && course.lessonData.length > 0) {
            const firstLesson = course.lessonData[0];
            if (firstLesson.url) {
                window.open(firstLesson.url, '_blank');
                return;
            }
        }

        // Fallback: Show course details or provide a default action
        if (course.id) {
            // Example: Navigate to a course details page or show a modal
            toast.info(`Starting course: ${course.title}`, {
                description: 'No direct lesson URL available. Please contact support.',
                action: {
                    label: 'View Details',
                    onClick: () => {
                        // You could replace this with actual navigation or modal logic
                        console.log(`Navigating to course details: ${course.id}`);
                        // Example: router.push(`/courses/${course.id}`);
                    }
                }
            });
            return;
        }

        // Last resort error
        toast.error('Unable to start course. No start action available.');
        console.warn(`No start action available for course: ${course.title || 'Unknown Course'}`);
    };

    // Determine if course has lesson data
    const hasLessonData = course.lessonData && course.lessonData.length > 0;

    return (
        <div className="bg-black/30 rounded-lg overflow-hidden border border-red-900/20 hover:border-red-600/40 transition-colors">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto">
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
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {course.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                            {course.lessons || 0} Lessons
                            {course.tier && ` • Tier ${course.tier}`}
                        </span>

                        {hasLessonData ? (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-xs bg-red-900/30 hover:bg-red-900/50 text-white px-3 py-1 rounded flex items-center"
                            >
                                {expanded ? 'Hide Lessons' : 'View Lessons'}
                                {expanded ?
                                    <ChevronUp className="ml-1 w-3 h-3" /> :
                                    <ChevronDown className="ml-1 w-3 h-3" />
                                }
                            </button>
                        ) : (
                            <button
                                onClick={handleStartCourse}
                                className="text-xs bg-red-900/30 hover:bg-red-900/50 text-white px-3 py-1 rounded flex items-center"
                            >
                                <Play className="mr-1 w-3 h-3" /> Start Course
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded lessons list */}
            {expanded && hasLessonData && (
                <div className="border-t border-red-900/20 divide-y divide-red-900/10">
                    {course.lessonData!.sort((a, b) => a.order - b.order).map((lesson: CourseLessonData) => (
                        <div key={lesson.id} className="p-3 hover:bg-red-900/10 transition-colors">
                            <a
                                href={lesson.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <div className="flex-shrink-0 mr-3 text-red-500">
                                    {lesson.type === 'video' ?
                                        <Video size={18} /> :
                                        <FileText size={18} />
                                    }
                                </div>
                                <div className="flex-grow">
                                    <div className="text-white text-sm font-medium">
                                        {lesson.order + 1}. {lesson.title}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {lesson.type === 'video'
                                            ? (lesson.duration
                                                ? `Video • ${formatDuration(lesson.duration)}`
                                                : 'Video')
                                            : 'PDF Document'
                                        }
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                    <span className="bg-red-900/30 text-white text-xs px-2 py-1 rounded-full">
                                        {lesson.type === 'video' ? 'Watch' : 'View'}
                                    </span>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};