'use client';

import { useState, useEffect } from 'react';
import { CourseItem, CourseLessonData } from '@/types/types';
import { ChevronDown, ChevronUp, Video, FileText, Play } from 'lucide-react';
import { toast } from 'sonner';
import { CourseContentModal } from './CourseModal';

// Define VideoProgress interface to match the one in CourseContentModal
interface VideoProgress {
    progress: number; // 0-100
    lastPosition: number; // seconds
    lastWatched: string; // ISO date string
    completed: boolean;
}

interface CourseCardProps {
    course: CourseItem;
    onStartCourse?: (courseId: string) => void;
    onProgressUpdate?: (lessonId: string, progress: VideoProgress) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    course,
    onStartCourse,
    onProgressUpdate
}) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<CourseLessonData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

        // If there are lessons, open the first lesson in the modal
        if (course.lessonData && course.lessonData.length > 0) {
            const firstLesson = course.lessonData.sort((a, b) => a.order - b.order)[0];
            console.log('Opening first lesson:', firstLesson);
            openLessonModal(firstLesson);

            // Also trigger the onStartCourse handler if provided
            if (onStartCourse && course.id) {
                onStartCourse(course.id);
            }
            return;
        }

        // If a custom onStartCourse handler is provided and no lessons available
        if (onStartCourse && course.id) {
            console.log('No lessons available, calling onStartCourse');
            onStartCourse(course.id);
            return;
        }

        // Fallback: Show course details or provide a default action
        if (course.id) {
            console.log('No lessons or handler available, showing toast');
            toast.info(`Starting course: ${course.title}`, {
                description: 'No lesson content available. Please contact support.',
                action: {
                    label: 'View Details',
                    onClick: () => {
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

    // Open lesson in modal
    const openLessonModal = (lesson: CourseLessonData) => {
        console.log('Opening lesson in modal:', lesson);
        setSelectedLesson(lesson);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        console.log('Closing modal');
        setIsModalOpen(false);
        // Don't reset selectedLesson immediately to allow for animations
        setTimeout(() => setSelectedLesson(null), 300);
    };

    // Handle lesson click
    const handleLessonClick = (e: React.MouseEvent, lesson: CourseLessonData) => {
        e.preventDefault(); // Prevent default link behavior
        console.log('Lesson clicked:', lesson);
        openLessonModal(lesson);
    };

    // Determine if course has lesson data
    const hasLessonData = course.lessonData && course.lessonData.length > 0;

    // Fix: Use the nullish coalescing operator for type safety
    const lessonData: CourseLessonData[] = course.lessonData ?? [];

    // Format tiers for display (if using the new tiers array)
    const formatTiers = () => {
        if (course.tiers && course.tiers.length > 0) {
            if (course.tiers.length === 1) {
                return ` • Tier ${course.tiers[0]}`;
            } else {
                return ` • Tiers ${course.tiers.sort().join(', ')}`;
            }
        } else if (course.tier) {
            // Fallback for backward compatibility
            return ` • Tier ${course.tier}`;
        }
        return '';
    };

    return (
        <>
            <div className="bg-black/30 rounded-lg overflow-hidden border border-red-900/20 hover:border-red-600/40 transition-colors">
                <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/3 h-40 md:h-auto relative">
                        <img
                            src={course.thumbnail || "/placeholder-thumbnail.jpg"}
                            alt={course.title || "Course thumbnail"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.log('Image error, using placeholder');
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
                                {hasLessonData ? lessonData.length : (course.lessons || 0)} Lessons

                            </span>

                            {hasLessonData ? (
                                <button
                                    onClick={() => {
                                        console.log(`Toggling expanded view: ${!expanded}`);
                                        setExpanded(!expanded);
                                    }}
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
                        {lessonData.sort((a, b) => a.order - b.order).map((lesson: CourseLessonData) => (
                            <div key={lesson.id} className="p-3 hover:bg-red-900/10 transition-colors">
                                <a
                                    href="#"
                                    onClick={(e) => handleLessonClick(e, lesson)}
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

            {/* Content Modal */}
            <CourseContentModal
                lesson={selectedLesson}
                isOpen={isModalOpen}
                onClose={closeModal}
                onProgressUpdate={onProgressUpdate}
            />
        </>
    );
};