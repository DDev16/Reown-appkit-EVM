'use client';

import React, { useState, useEffect } from 'react';
import {
    doc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

import ContentTypeSelector from './components/ContentTypeSelector';
import TierSelector from './components/TierSelector';
import BasicContentForm from './components/BasicContentForm';
import UploadStatus from './components/UploadStatus';
import VideoForm from './components/content-forms/VideoForm';
import CourseForm from './components/content-forms/CourseForm';
import BlogForm from './components/content-forms/BlogForm';
import TestForm from './components/content-forms/TestForm';
import CallForm from './components/content-forms/CallForm';
import { useContentUpload } from './hooks/useContentUpload';
import {
    ContentType, BaseContentFormData,
    VideoFormData, CourseFormData, BlogFormData,
    TestFormData, CallFormData
} from './types';

export default function AdminUploadPage() {
    const [contentType, setContentType] = useState<ContentType>('videos');
    const [selectedTiers, setSelectedTiers] = useState<number[]>([1]);

    // Base content form data
    const [baseFormData, setBaseFormData] = useState<BaseContentFormData>({
        title: '',
        description: '',
        thumbnailFile: null
    });

    // Content-specific form data
    const [videoFormData, setVideoFormData] = useState<Omit<VideoFormData, keyof BaseContentFormData>>({
        contentFile: null,
        duration: ''
    });

    const [courseFormData, setCourseFormData] = useState<Omit<CourseFormData, keyof BaseContentFormData>>({
        numLessons: '',
        lessonFiles: []
    });

    const [blogFormData, setBlogFormData] = useState<Omit<BlogFormData, keyof BaseContentFormData>>({
        author: '',
        readTime: '',
        contentFile: null
    });

    const [testFormData, setTestFormData] = useState<Omit<TestFormData, keyof BaseContentFormData>>({
        numQuestions: '',
        estimatedTime: '',
        testDifficulty: 'intermediate',
        contentFile: null
    });

    const [callFormData, setCallFormData] = useState<Omit<CallFormData, keyof BaseContentFormData>>({
        callHost: '',
        callDate: '',
        callTime: '',
        callDuration: '',
        callUrl: ''
    });

    const {
        uploadStatus,
        setUploadStatus,
        uploadThumbnail,
        uploadContentFile,
        uploadCourseLessonFiles,
        uploadLessonsToCollection, // Use the new function
        saveContentToFirestore
    } = useContentUpload();

    // Reset form when changing content type
    useEffect(() => {
        resetForm();
    }, [contentType]);

    const resetForm = () => {
        setBaseFormData({
            title: '',
            description: '',
            thumbnailFile: null
        });

        setVideoFormData({
            contentFile: null,
            duration: ''
        });

        setCourseFormData({
            numLessons: '',
            lessonFiles: []
        });

        setBlogFormData({
            author: '',
            readTime: '',
            contentFile: null
        });

        setTestFormData({
            numQuestions: '',
            estimatedTime: '',
            testDifficulty: 'intermediate',
            contentFile: null
        });

        setCallFormData({
            callHost: '',
            callDate: '',
            callTime: '',
            callDuration: '',
            callUrl: ''
        });

        // Reset upload status with all the new fields
        setUploadStatus({
            isUploading: false,
            progress: 0,
            error: null,
            success: false,
            fileUrl: null,
            transferredMB: 0,
            totalMB: 0,
            state: 'running'
        });
    };

    // Toggle tier selection
    const toggleTier = (tierId: number) => {
        setSelectedTiers(prev =>
            prev.includes(tierId)
                ? prev.filter(id => id !== tierId)
                : [...prev, tierId]
        );
    };

    // Handle form data changes
    const handleBaseFormChange = (data: Partial<BaseContentFormData>) => {
        setBaseFormData(prev => ({ ...prev, ...data }));
    };

    const handleVideoFormChange = (data: Partial<Omit<VideoFormData, keyof BaseContentFormData>>) => {
        setVideoFormData(prev => ({ ...prev, ...data }));
    };

    const handleCourseFormChange = (data: Partial<Omit<CourseFormData, keyof BaseContentFormData>>) => {
        setCourseFormData(prev => ({ ...prev, ...data }));
    };

    const handleBlogFormChange = (data: Partial<Omit<BlogFormData, keyof BaseContentFormData>>) => {
        setBlogFormData(prev => ({ ...prev, ...data }));
    };

    const handleTestFormChange = (data: Partial<Omit<TestFormData, keyof BaseContentFormData>>) => {
        setTestFormData(prev => ({ ...prev, ...data }));
    };

    const handleCallFormChange = (data: Partial<Omit<CallFormData, keyof BaseContentFormData>>) => {
        setCallFormData(prev => ({ ...prev, ...data }));
    };

    // Validate form based on content type
    const validateForm = (): boolean => {
        if (!baseFormData.title || !baseFormData.description || !baseFormData.thumbnailFile || selectedTiers.length === 0) {
            setUploadStatus(prev => ({
                ...prev,
                error: 'Please fill all required fields and select at least one tier',
                state: 'error'
            }));
            return false;
        }

        // Content-specific validation
        if (contentType === 'videos' && (!videoFormData.contentFile || !videoFormData.duration)) {
            setUploadStatus(prev => ({
                ...prev,
                error: 'Please upload a video file and specify the duration',
                state: 'error'
            }));
            return false;
        }

        if (contentType === 'courses' && (!courseFormData.lessonFiles || courseFormData.lessonFiles.length === 0)) {
            setUploadStatus(prev => ({
                ...prev,
                error: 'Please add at least one lesson to the course',
                state: 'error'
            }));
            return false;
        }

        if (contentType === 'blogs' && (!blogFormData.author || !blogFormData.readTime)) {
            setUploadStatus(prev => ({
                ...prev,
                error: 'Please specify the author and read time',
                state: 'error'
            }));
            return false;
        }

        if (contentType === 'tests' && (!testFormData.numQuestions || !testFormData.estimatedTime)) {
            setUploadStatus(prev => ({
                ...prev,
                error: 'Please specify the number of questions and estimated time',
                state: 'error'
            }));
            return false;
        }

        if (contentType === 'calls' && (
            !callFormData.callHost ||
            !callFormData.callDate ||
            !callFormData.callTime ||
            !callFormData.callDuration
        )) {
            setUploadStatus(prev => ({
                ...prev,
                error: 'Please fill all required fields for zoom calls',
                state: 'error'
            }));
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setUploadStatus(prev => ({
                ...prev,
                isUploading: true,
                error: null,
                progress: 0,
                state: 'running'
            }));

            // Upload thumbnail
            const thumbnailUrl = await uploadThumbnail(baseFormData.thumbnailFile!, contentType);

            // Create base content data
            const baseContentData = {
                title: baseFormData.title,
                description: baseFormData.description,
                thumbnail: thumbnailUrl,
            };

            let contentData;
            let docIds = [];

            // Handle different content types
            switch (contentType) {
                case 'videos': {
                    // Upload video file
                    const contentUrl = await uploadContentFile(videoFormData.contentFile!, contentType);

                    contentData = {
                        ...baseContentData,
                        url: contentUrl,
                        duration: parseInt(videoFormData.duration)
                    };

                    docIds = await saveContentToFirestore(contentType, contentData, selectedTiers);
                    break;
                }

                case 'courses': {
                    console.log('Starting course upload process...');
                    console.log(`Course has ${courseFormData.lessonFiles.length} lessons to upload for ${selectedTiers.length} tiers`);

                    try {
                        // UPDATED: Create a single course document with tiers array 
                        // instead of creating separate documents for each tier

                        // 1. Create course document with basic information
                        const courseData = {
                            ...baseContentData,
                            tiers: selectedTiers, // Store as array instead of single tier value
                            lessons: courseFormData.lessonFiles.length,
                            lessonCount: courseFormData.lessonFiles.length,
                            createdAt: serverTimestamp(),
                            date: new Date().toISOString(),
                            status: 'pending'
                        };

                        console.log(`Creating course document with tiers: ${selectedTiers.join(', ')}...`);
                        const courseRef = await addDoc(collection(db, 'courses'), courseData);
                        const courseId = courseRef.id;
                        console.log(`Created course document with ID: ${courseId}`);

                        // 2. Upload all lesson files and store lessons in lessons collection
                        console.log(`Uploading ${courseFormData.lessonFiles.length} lesson files for course ${courseId}`);

                        // Use the new uploadLessonsToCollection function that uploads to top-level lessons collection 
                        // instead of subcollections
                        const lessonCount = await uploadLessonsToCollection(
                            courseFormData.lessonFiles,
                            courseId
                        );

                        // 3. Update course document with status
                        await updateDoc(doc(db, 'courses', courseId), {
                            status: 'complete'
                        });

                        console.log(`Successfully uploaded ${lessonCount} lessons for course ${courseId}`);

                        docIds = [courseId];
                    } catch (error) {
                        console.error('Error in course upload process:', error);
                        setUploadStatus(prev => ({
                            ...prev,
                            error: `Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            isUploading: false,
                            state: 'error'
                        }));
                        throw error;
                    }

                    break;
                }

                case 'blogs': {
                    // Upload optional PDF/Doc file if provided
                    let contentUrl = '';
                    if (blogFormData.contentFile) {
                        contentUrl = await uploadContentFile(blogFormData.contentFile, contentType);
                    }

                    contentData = {
                        ...baseContentData,
                        author: blogFormData.author,
                        readTime: parseInt(blogFormData.readTime),
                        url: contentUrl || '#'
                    };

                    docIds = await saveContentToFirestore(contentType, contentData, selectedTiers);
                    break;
                }

                case 'tests': {
                    // Upload optional test content file
                    let contentUrl = '';
                    if (testFormData.contentFile) {
                        contentUrl = await uploadContentFile(testFormData.contentFile, contentType);
                    }

                    contentData = {
                        ...baseContentData,
                        questions: parseInt(testFormData.numQuestions),
                        estimatedTime: parseInt(testFormData.estimatedTime),
                        difficulty: testFormData.testDifficulty,
                        completed: false, // Initial state for all users
                        url: contentUrl || '#'
                    };

                    docIds = await saveContentToFirestore(contentType, contentData, selectedTiers);
                    break;
                }

                case 'calls': {
                    contentData = {
                        ...baseContentData,
                        host: callFormData.callHost,
                        date: callFormData.callDate,
                        time: callFormData.callTime,
                        duration: parseInt(callFormData.callDuration),
                        url: callFormData.callUrl || '#'
                    };

                    docIds = await saveContentToFirestore(contentType, contentData, selectedTiers);
                    break;
                }
            }

            setUploadStatus(prev => ({
                ...prev,
                isUploading: false,
                progress: 100,
                error: null,
                success: true,
                fileUrl: thumbnailUrl,
                state: 'success'
            }));

            // Reset form after successful upload
            setTimeout(() => {
                resetForm();
                setSelectedTiers([1]);
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus(prev => ({
                ...prev,
                isUploading: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                success: false,
                state: 'error'
            }));
        }
    };

    // Handle upload control actions
    const handlePauseUpload = () => {
        if (uploadStatus.pauseUpload) {
            uploadStatus.pauseUpload();
        }
    };

    const handleResumeUpload = () => {
        if (uploadStatus.resumeUpload) {
            uploadStatus.resumeUpload();
        }
    };

    const handleCancelUpload = () => {
        if (uploadStatus.cancelUpload) {
            uploadStatus.cancelUpload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-black/30 border border-red-900/30 rounded-lg p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Admin Upload Panel</h1>

                {/* Content type selection */}
                <ContentTypeSelector
                    contentType={contentType}
                    setContentType={setContentType}
                />

                {/* Upload form */}
                <form onSubmit={handleSubmit}>
                    {/* Tier selection */}
                    <TierSelector
                        selectedTiers={selectedTiers}
                        toggleTier={toggleTier}
                    />

                    {/* Basic content information */}
                    <BasicContentForm
                        contentType={contentType}
                        formData={baseFormData}
                        onFormChange={handleBaseFormChange}
                    />

                    {/* Content-specific fields */}
                    <div className="space-y-4 mt-4">
                        {contentType === 'videos' && (
                            <VideoForm
                                formData={videoFormData}
                                onFormChange={handleVideoFormChange}
                            />
                        )}

                        {contentType === 'courses' && (
                            <CourseForm
                                formData={courseFormData}
                                onFormChange={handleCourseFormChange}
                            />
                        )}

                        {contentType === 'blogs' && (
                            <BlogForm
                                formData={blogFormData}
                                onFormChange={handleBlogFormChange}
                            />
                        )}

                        {contentType === 'tests' && (
                            <TestForm
                                formData={testFormData}
                                onFormChange={handleTestFormChange}
                            />
                        )}

                        {contentType === 'calls' && (
                            <CallForm
                                formData={callFormData}
                                onFormChange={handleCallFormChange}
                            />
                        )}

                        {/* Upload status messages with control handlers */}
                        <UploadStatus
                            uploadStatus={uploadStatus}
                            onPause={handlePauseUpload}
                            onResume={handleResumeUpload}
                            onCancel={handleCancelUpload}
                        />

                        {/* Submit button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={uploadStatus.isUploading}
                                className={`w-full py-3 rounded-lg font-medium ${uploadStatus.isUploading
                                    ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                            >
                                {uploadStatus.isUploading ? 'Uploading...' : `Upload ${contentType.slice(0, -1)}`}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}