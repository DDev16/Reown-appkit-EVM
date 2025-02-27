'use client';

import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this: npm install uuid @types/uuid
import { Upload, Check, Folder, Video, FileText, ChevronUp, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import { CourseFormData, CourseLessonFile } from '../../types';

interface CourseFormProps {
    formData: Partial<CourseFormData>;
    onFormChange: (data: Partial<CourseFormData>) => void;
}

interface EditingLesson {
    id: string;
    title: string;
    duration?: string;
}

// Create a custom input type that includes webkitdirectory
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    webkitdirectory?: string;
    directory?: string;
}

export default function CourseForm({ formData = {}, onFormChange }: CourseFormProps) {
    const { lessonFiles = [] } = formData;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editingLesson, setEditingLesson] = useState<EditingLesson | null>(null);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

    // Handle folder selection
    const handleFolderSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsLoading(true);

        try {
            const files = Array.from(e.target.files);

            // Filter only video and PDF files
            const validFiles = files.filter(file => {
                const fileType = file.type;
                return fileType.startsWith('video/') || fileType === 'application/pdf';
            });

            if (validFiles.length === 0) {
                alert('No valid video or PDF files found in the folder');
                setIsLoading(false);
                return;
            }

            // Sort files by name to maintain order
            validFiles.sort((a, b) => {
                // Extract numbers from filenames to sort numerically
                const aName = a.name;
                const bName = b.name;

                // Try to extract numbers from the beginning of filenames
                const aMatch = aName.match(/^(\d+)/);
                const bMatch = bName.match(/^(\d+)/);

                if (aMatch && bMatch) {
                    return parseInt(aMatch[1]) - parseInt(bMatch[1]);
                }

                // Default to alphabetical sort
                return aName.localeCompare(bName);
            });

            // Convert files to lesson files
            const newLessonFiles: CourseLessonFile[] = validFiles.map((file, index) => {
                const isVideo = file.type.startsWith('video/');

                // Generate a title from the filename
                let title = file.name;

                // Remove extension
                title = title.replace(/\.[^/.]+$/, '');
                // Remove leading numbers and common separators
                title = title.replace(/^\d+[\s_-]*/, '');
                // Convert underscores and hyphens to spaces
                title = title.replace(/[_-]/g, ' ');
                // Capitalize first letter
                title = title.charAt(0).toUpperCase() + title.slice(1);

                return {
                    id: uuidv4(),
                    order: index,
                    type: isVideo ? 'video' : 'pdf',
                    file: file,
                    title: title,
                    // For videos, we'll need to update the duration later
                    ...(isVideo && { duration: '0' })
                };
            });

            // Update form data with the new lessons
            onFormChange({
                lessonFiles: newLessonFiles,
                numLessons: newLessonFiles.length.toString()
            });

        } catch (error) {
            console.error('Error processing folder:', error);
            alert('Error processing folder: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsLoading(false);
            if (folderInputRef.current) {
                folderInputRef.current.value = '';
            }
        }
    };

    // Handle individual file selection (kept for backward compatibility)
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileType = file.type;

        if (!fileType.startsWith('video/') && fileType !== 'application/pdf') {
            alert('Please select a video or PDF file');
            return;
        }

        const isVideo = fileType.startsWith('video/');

        // Generate a title from the filename
        let title = file.name;
        title = title.replace(/\.[^/.]+$/, ''); // Remove extension
        title = title.replace(/[_-]/g, ' '); // Convert underscores and hyphens to spaces

        const newLesson: CourseLessonFile = {
            id: uuidv4(),
            order: lessonFiles.length,
            type: isVideo ? 'video' : 'pdf',
            file: file,
            title: title,
            ...(isVideo && { duration: '0' })
        };

        onFormChange({
            lessonFiles: [...lessonFiles, newLesson],
            numLessons: (lessonFiles.length + 1).toString()
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Remove a lesson file
    const removeLessonFile = (id: string) => {
        const updatedFiles = lessonFiles
            .filter(file => file.id !== id)
            .map((file, index) => ({ ...file, order: index }));

        onFormChange({
            lessonFiles: updatedFiles,
            numLessons: updatedFiles.length.toString()
        });
    };

    // Start editing a lesson
    const startEditLesson = (lesson: CourseLessonFile) => {
        setEditingLesson({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration
        });
    };

    // Save lesson edits
    const saveEditLesson = () => {
        if (!editingLesson) return;

        const updatedFiles = lessonFiles.map(file => {
            if (file.id === editingLesson.id) {
                return {
                    ...file,
                    title: editingLesson.title,
                    ...(file.type === 'video' && { duration: editingLesson.duration || '0' })
                };
            }
            return file;
        });

        onFormChange({ lessonFiles: updatedFiles });
        setEditingLesson(null);
    };

    // Move a lesson file up or down
    const moveLessonFile = (id: string, direction: 'up' | 'down') => {
        const index = lessonFiles.findIndex(file => file.id === id);
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === lessonFiles.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updatedFiles = [...lessonFiles];

        // Swap the items
        [updatedFiles[index], updatedFiles[newIndex]] = [updatedFiles[newIndex], updatedFiles[index]];

        // Update order properties
        updatedFiles.forEach((file, idx) => {
            file.order = idx;
        });

        onFormChange({ lessonFiles: updatedFiles });
    };

    // Handle drag start
    const handleDragStart = (id: string) => {
        setDraggedItemId(id);
    };

    // Handle drag over
    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        setDragOverItemId(id);
    };

    // Handle drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedItemId || !dragOverItemId || draggedItemId === dragOverItemId) {
            return;
        }

        const draggedItemIndex = lessonFiles.findIndex(file => file.id === draggedItemId);
        const dragOverItemIndex = lessonFiles.findIndex(file => file.id === dragOverItemId);

        const updatedFiles = [...lessonFiles];

        // Remove the dragged item
        const [draggedItem] = updatedFiles.splice(draggedItemIndex, 1);

        // Insert it at the new position
        updatedFiles.splice(dragOverItemIndex, 0, draggedItem);

        // Update the order
        updatedFiles.forEach((file, idx) => {
            file.order = idx;
        });

        onFormChange({ lessonFiles: updatedFiles });

        // Reset drag state
        setDraggedItemId(null);
        setDragOverItemId(null);
    };

    // Estimate video durations if possible (this is optional, as it may not work for all video formats)
    useEffect(() => {
        // Find video files with zero duration
        const videosToProcess = lessonFiles.filter(
            file => file.type === 'video' && (!file.duration || file.duration === '0')
        );

        if (videosToProcess.length === 0) return;

        // Process one video at a time to avoid memory issues
        const processVideo = async (index: number) => {
            if (index >= videosToProcess.length) return;

            const videoFile = videosToProcess[index];
            try {
                // Create video element to get duration
                const video = document.createElement('video');
                video.preload = 'metadata';

                // Create object URL for the video file
                const objectUrl = URL.createObjectURL(videoFile.file);

                // Get duration when metadata is loaded
                video.onloadedmetadata = () => {
                    // Revoke URL to free memory
                    URL.revokeObjectURL(objectUrl);

                    // Update the video duration
                    if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
                        const durationSeconds = Math.round(video.duration);

                        // Update the specific video file
                        const updatedFiles = lessonFiles.map(file => {
                            if (file.id === videoFile.id) {
                                return {
                                    ...file,
                                    duration: durationSeconds.toString()
                                };
                            }
                            return file;
                        });

                        onFormChange({ lessonFiles: updatedFiles });
                    }

                    // Process next video
                    processVideo(index + 1);
                };

                // Handle errors
                video.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    console.warn(`Could not determine duration for video: ${videoFile.file.name}`);
                    processVideo(index + 1);
                };

                // Set the source to trigger loading
                video.src = objectUrl;

            } catch (error) {
                console.error('Error estimating video duration:', error);
                processVideo(index + 1);
            }
        };

        // Start processing videos
        processVideo(0);

    }, [lessonFiles, onFormChange]);

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Total Lessons <span className="text-red-500">*</span>
                </label>
                <div className="bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white">
                    {lessonFiles.length} lessons added
                </div>
            </div>

            {/* Upload Folder Section */}
            <div className="bg-black/40 border border-red-900/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Upload Course Materials</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Folder Upload */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Upload Entire Course Folder <span className="text-red-500 text-xs">(Recommended)</span>
                        </label>
                        <input
                            type="file"
                            ref={folderInputRef}
                            onChange={handleFolderSelect}
                            {...{ webkitdirectory: "", directory: "", multiple: true } as CustomInputProps}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => folderInputRef.current?.click()}
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg flex items-center justify-center ${isLoading
                                ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                        >
                            <Folder size={16} className="mr-2" />
                            {isLoading ? 'Processing...' : 'Select Course Folder'}
                        </button>
                        <p className="text-gray-400 text-xs mt-1">
                            Select a folder containing video and PDF files. Files will be ordered by filename.
                        </p>
                    </div>

                    {/* Single File Upload */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Upload Individual File <span className="text-gray-400 text-xs">(Alternative)</span>
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="video/*,.pdf"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 rounded-lg flex items-center justify-center bg-black/60 hover:bg-black/80 text-white border border-red-900/30"
                        >
                            <Upload size={16} className="mr-2" />
                            Add Single File
                        </button>
                    </div>
                </div>

                <div className="mt-3 text-yellow-400 text-sm">
                    <p className="font-medium">File Organization Tips:</p>
                    <ul className="list-disc pl-5 text-xs mt-1 text-yellow-300">
                        <li>Number files to control order (e.g., &ldquo;01-intro.mp4&rdquo;, &ldquo;02-lesson.pdf&rdquo;)</li>
                        <li>Use clear filenames - they will be converted to lesson titles</li>
                        <li>After upload, you can edit titles and durations or reorder lessons</li>
                    </ul>
                </div>
            </div>

            {/* Lesson Files Section */}
            {lessonFiles.length > 0 && (
                <div>
                    <label className="block text-white text-sm font-medium mb-2 flex justify-between items-center">
                        <span>Course Lessons</span>
                        <span className="text-xs text-gray-400">Drag to reorder</span>
                    </label>
                    <div className="bg-black/40 border border-red-900/30 rounded-lg divide-y divide-red-900/20">
                        {lessonFiles
                            .sort((a, b) => a.order - b.order)
                            .map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className={`p-3 ${editingLesson?.id === lesson.id
                                        ? 'bg-red-900/30'
                                        : dragOverItemId === lesson.id
                                            ? 'bg-red-900/20'
                                            : ''
                                        }`}
                                    draggable={!editingLesson}
                                    onDragStart={() => !editingLesson && handleDragStart(lesson.id)}
                                    onDragOver={(e) => !editingLesson && handleDragOver(e, lesson.id)}
                                    onDrop={(e) => !editingLesson && handleDrop(e)}
                                    onDragEnd={() => {
                                        setDraggedItemId(null);
                                        setDragOverItemId(null);
                                    }}
                                >
                                    {editingLesson?.id === lesson.id ? (
                                        // Editing mode
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-white text-xs font-medium mb-1">
                                                    Lesson Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editingLesson.title}
                                                    onChange={(e) => setEditingLesson({
                                                        ...editingLesson,
                                                        title: e.target.value
                                                    })}
                                                    className="w-full bg-black/40 border border-red-900/30 rounded px-3 py-1 text-white text-sm"
                                                />
                                            </div>

                                            {lesson.type === 'video' && (
                                                <div>
                                                    <label className="block text-white text-xs font-medium mb-1">
                                                        Duration (seconds)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={editingLesson.duration || '0'}
                                                        onChange={(e) => setEditingLesson({
                                                            ...editingLesson,
                                                            duration: e.target.value
                                                        })}
                                                        className="w-full bg-black/40 border border-red-900/30 rounded px-3 py-1 text-white text-sm"
                                                        min="1"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingLesson(null)}
                                                    className="px-3 py-1 rounded text-xs bg-black/60 text-white mr-2"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={saveEditLesson}
                                                    className="px-3 py-1 rounded text-xs bg-red-600 text-white"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Display mode
                                        <div className="flex items-center gap-3 cursor-move">
                                            <div className="flex-shrink-0 text-red-500">
                                                {lesson.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="text-white font-medium">
                                                    {lesson.order + 1}. {lesson.title}
                                                </div>
                                                <div className="text-gray-400 text-sm flex items-center gap-2">
                                                    <span>{lesson.file.name.length > 30 ?
                                                        `${lesson.file.name.substring(0, 30)}...` :
                                                        lesson.file.name}
                                                    </span>
                                                    {lesson.type === 'video' && lesson.duration && lesson.duration !== '0' && (
                                                        <span>({lesson.duration} sec)</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    type="button"
                                                    onClick={() => startEditLesson(lesson)}
                                                    className="p-1 rounded hover:bg-red-900/30"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveLessonFile(lesson.id, 'up')}
                                                    disabled={lesson.order === 0}
                                                    className={`p-1 rounded hover:bg-red-900/30 ${lesson.order === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                    title="Move up"
                                                >
                                                    <ChevronUp size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveLessonFile(lesson.id, 'down')}
                                                    disabled={lesson.order === lessonFiles.length - 1}
                                                    className={`p-1 rounded hover:bg-red-900/30 ${lesson.order === lessonFiles.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                    title="Move down"
                                                >
                                                    <ChevronDown size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLessonFile(lesson.id)}
                                                    className="p-1 rounded hover:bg-red-900/30"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}