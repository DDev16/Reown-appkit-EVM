'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize, Minimize, ExternalLink, RefreshCw, FileText } from 'lucide-react';
import { CourseLessonData } from '@/types/types';
import { toast } from 'sonner';

// Define VideoProgress interface since it's not in your types
interface VideoProgress {
    progress: number; // 0-100
    lastPosition: number; // seconds
    lastWatched: string; // ISO date string
    completed: boolean;
}

interface CourseContentModalProps {
    lesson: CourseLessonData | null;
    isOpen: boolean;
    onClose: () => void;
    onProgressUpdate?: (lessonId: string, progress: VideoProgress) => void;
}

export const CourseContentModal: React.FC<CourseContentModalProps> = ({
    lesson,
    isOpen,
    onClose,
    onProgressUpdate
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Format time from seconds to mm:ss
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            modalRef.current?.requestFullscreen().catch(err => {
                toast.error('Could not enter fullscreen mode', {
                    description: err.message
                });
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Track fullscreen changes initiated by browser UI
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Handle video time updates for progress tracking
    const handleTimeUpdate = () => {
        if (videoRef.current && lesson?.type === 'video') {
            const video = videoRef.current;
            const duration = video.duration;
            const currentTime = video.currentTime;
            setVideoCurrentTime(currentTime);

            if (duration > 0) {
                const progress = Math.round((currentTime / duration) * 100);
                setVideoProgress(progress);

                // Update progress when reaching significant milestones (25%, 50%, 75%, 100%)
                if (progress % 25 === 0 && progress > 0 && onProgressUpdate && lesson.id) {
                    onProgressUpdate(lesson.id, {
                        progress: progress,
                        lastPosition: currentTime,
                        lastWatched: new Date().toISOString(),
                        completed: progress >= 95 // Mark as completed at 95%+
                    });
                }
            }
        }
    };

    // Handle video end event
    const handleVideoEnded = () => {
        if (lesson?.id && onProgressUpdate) {
            onProgressUpdate(lesson.id, {
                progress: 100,
                lastPosition: videoRef.current?.duration || 0,
                lastWatched: new Date().toISOString(),
                completed: true
            });
            toast.success('Lesson completed!', {
                description: 'Your progress has been saved.'
            });
        }
    };

    // State to track if PDF fails to load
    const [pdfLoadError, setPdfLoadError] = useState(false);

    // Open external link for PDF documents
    const openExternalLink = () => {
        if (lesson?.url) {
            window.open(lesson.url, '_blank');
        }
    };

    // Handle PDF load error
    const handlePdfLoadError = () => {
        setPdfLoadError(true);
        toast.error('PDF could not be displayed in-app', {
            description: 'You can still open it in a new tab.'
        });
    };

    if (!isOpen || !lesson) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            {/* Modal content */}
            <div
                ref={modalRef}
                className={`bg-black/70 border border-red-900/30 rounded-lg w-full ${lesson.type === 'pdf' ? 'max-w-6xl h-[85vh]' : 'max-w-5xl'} overflow-hidden relative`}
            >
                {/* Close button - positioned within the modal header */}
                <div className="p-4 border-b border-red-900/30 flex justify-between items-center">
                    <h2 className="text-white font-semibold text-lg">{lesson.title}</h2>
                    <button
                        onClick={onClose}
                        className="bg-red-900/30 hover:bg-red-900/50 text-white p-2 rounded-full"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative">
                    {lesson.type === 'video' ? (
                        /* Video player */
                        <div className="aspect-video bg-black">
                            <video
                                ref={videoRef}
                                src={lesson.url}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleVideoEnded}
                            />

                            {/* Video progress bar overlay */}
                            <div className="absolute bottom-14 left-0 right-0 h-1 bg-gray-800">
                                <div
                                    className="h-full bg-red-600"
                                    style={{ width: `${videoProgress}%` }}
                                />
                            </div>

                            {/* Video time display */}
                            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
                                {formatTime(videoCurrentTime)}
                                {videoRef.current?.duration && ` / ${formatTime(videoRef.current.duration)}`}
                            </div>
                        </div>
                    ) : (
                        /* PDF document viewer with fallback */
                        <div className="aspect-video bg-gray-900 flex flex-col h-full">
                            {!pdfLoadError ? (
                                <div className="w-full h-full">
                                    <iframe
                                        src={`${lesson.url}#view=FitH`}
                                        className="w-full h-full border-0"
                                        title={lesson.title}
                                        onError={handlePdfLoadError}
                                        onLoad={() => {
                                            // Track PDF view in analytics if needed
                                            if (lesson.id && onProgressUpdate) {
                                                onProgressUpdate(lesson.id, {
                                                    progress: 100,
                                                    lastPosition: 0,
                                                    lastWatched: new Date().toISOString(),
                                                    completed: true
                                                });
                                            }
                                        }}
                                    />

                                    {/* PDF controls overlay */}
                                    <div className="absolute bottom-4 right-4 flex space-x-2">
                                        <button
                                            onClick={openExternalLink}
                                            className="flex items-center bg-black/50 hover:bg-black/80 text-white p-2 rounded"
                                            title="Open in new tab"
                                        >
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Fallback if PDF cannot be displayed in iframe */
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    <div className="text-red-500 mb-4">
                                        <FileText size={64} />
                                    </div>
                                    <p className="text-white text-center mb-2">
                                        This PDF cannot be displayed in the app
                                    </p>
                                    <p className="text-gray-400 text-center text-sm mb-6">
                                        PDF may have restrictions or require external viewer
                                    </p>
                                    <button
                                        onClick={openExternalLink}
                                        className="flex items-center bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                                    >
                                        <ExternalLink size={16} className="mr-2" />
                                        Open PDF Document
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fullscreen toggle */}
                    {lesson.type === 'video' && (
                        <button
                            onClick={toggleFullscreen}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded"
                            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                    )}
                </div>

                {/* Footer with additional controls and information */}
                <div className="p-4 border-t border-red-900/30 flex items-center justify-between">
                    <div className="text-gray-400 text-sm">
                        {lesson.type === 'video'
                            ? `Video • ${lesson.duration ? formatTime(lesson.duration) : 'Unknown length'}`
                            : 'PDF Document'
                        }
                    </div>

                    {lesson.type === 'video' ? (
                        <button
                            onClick={() => {
                                if (videoRef.current) {
                                    videoRef.current.currentTime = 0;
                                    videoRef.current.play();
                                }
                            }}
                            className="flex items-center text-xs bg-red-900/30 hover:bg-red-900/50 text-white px-3 py-1 rounded"
                        >
                            <RefreshCw size={14} className="mr-1" /> Restart Video
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={openExternalLink}
                                className="flex items-center text-xs bg-red-900/30 hover:bg-red-900/50 text-white px-3 py-1 rounded"
                            >
                                <ExternalLink size={14} className="mr-1" /> Open in New Tab
                            </button>
                            <span className="text-xs bg-green-900/30 text-white px-3 py-1 rounded">
                                PDF Viewer
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

