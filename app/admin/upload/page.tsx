'use client';

import React, { useState, useEffect } from 'react';
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
        numLessons: ''
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
            numLessons: ''
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

        setUploadStatus({
            isUploading: false,
            progress: 0,
            error: null,
            success: false,
            fileUrl: null
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
            setUploadStatus({
                ...uploadStatus,
                error: 'Please fill all required fields and select at least one tier'
            });
            return false;
        }

        // Content-specific validation
        if (contentType === 'videos' && (!videoFormData.contentFile || !videoFormData.duration)) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please upload a video file and specify the duration'
            });
            return false;
        }

        if (contentType === 'courses' && !courseFormData.numLessons) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please specify the number of lessons'
            });
            return false;
        }

        if (contentType === 'blogs' && (!blogFormData.author || !blogFormData.readTime)) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please specify the author and read time'
            });
            return false;
        }

        if (contentType === 'tests' && (!testFormData.numQuestions || !testFormData.estimatedTime)) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please specify the number of questions and estimated time'
            });
            return false;
        }

        if (contentType === 'calls' && (
            !callFormData.callHost ||
            !callFormData.callDate ||
            !callFormData.callTime ||
            !callFormData.callDuration
        )) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please fill all required fields for zoom calls'
            });
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
            setUploadStatus({
                ...uploadStatus,
                isUploading: true,
                error: null,
            });

            // Upload thumbnail
            const thumbnailUrl = await uploadThumbnail(baseFormData.thumbnailFile!, contentType);

            // Upload content file if needed
            let contentUrl = '';

            // For videos, we always need to upload the file
            if (contentType === 'videos' && videoFormData.contentFile) {
                contentUrl = await uploadContentFile(videoFormData.contentFile, contentType);
            }

            // For blogs, we upload the optional PDF/Doc file if provided
            if (contentType === 'blogs' && blogFormData.contentFile) {
                contentUrl = await uploadContentFile(blogFormData.contentFile, contentType);
            }

            // For tests, optional content file
            if (contentType === 'tests' && testFormData.contentFile) {
                contentUrl = await uploadContentFile(testFormData.contentFile, contentType);
            }

            // Create base content data
            const baseContentData = {
                title: baseFormData.title,
                description: baseFormData.description,
                thumbnail: thumbnailUrl,
            };

            // Add content-specific fields
            let contentData;
            switch (contentType) {
                case 'videos':
                    contentData = {
                        ...baseContentData,
                        url: contentUrl,
                        duration: parseInt(videoFormData.duration)
                    };
                    break;

                case 'courses':
                    contentData = {
                        ...baseContentData,
                        lessons: parseInt(courseFormData.numLessons)
                    };
                    break;

                case 'blogs':
                    contentData = {
                        ...baseContentData,
                        author: blogFormData.author,
                        readTime: parseInt(blogFormData.readTime),
                        url: contentUrl || '#'
                    };
                    break;

                case 'tests':
                    contentData = {
                        ...baseContentData,
                        questions: parseInt(testFormData.numQuestions),
                        estimatedTime: parseInt(testFormData.estimatedTime),
                        difficulty: testFormData.testDifficulty,
                        completed: false // Initial state for all users
                    };
                    break;

                case 'calls':
                    contentData = {
                        ...baseContentData,
                        host: callFormData.callHost,
                        date: callFormData.callDate,
                        time: callFormData.callTime,
                        duration: parseInt(callFormData.callDuration),
                        url: callFormData.callUrl || '#'
                    };
                    break;

                default:
                    contentData = baseContentData;
            }

            // Save to Firestore
            await saveContentToFirestore(contentType, contentData, selectedTiers);

            setUploadStatus({
                isUploading: false,
                progress: 100,
                error: null,
                success: true,
                fileUrl: contentUrl || thumbnailUrl
            });

            // Reset form after successful upload
            setTimeout(() => {
                resetForm();
                setSelectedTiers([1]);
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus({
                ...uploadStatus,
                isUploading: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                success: false
            });
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

                        {/* Upload status messages */}
                        <UploadStatus uploadStatus={uploadStatus} />

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