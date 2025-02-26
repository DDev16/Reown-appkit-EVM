'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Video, BookOpen, FileText, Trophy, Users, Upload,
    Check, AlertCircle, X, ChevronDown, Calendar
} from 'lucide-react';
import {
    collection, addDoc, serverTimestamp,
    query, where, getDocs, doc, deleteDoc, updateDoc
} from 'firebase/firestore';
import {
    ref, uploadBytesResumable,
    getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// Content types
type ContentType = 'videos' | 'courses' | 'blogs' | 'tests' | 'calls';
type TestDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface UploadStatus {
    isUploading: boolean;
    progress: number;
    error: string | null;
    success: boolean;
    fileUrl: string | null;
}

export default function AdminUploadPage() {
    const [contentType, setContentType] = useState<ContentType>('videos');
    const [selectedTiers, setSelectedTiers] = useState<number[]>([1]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [contentFile, setContentFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
        isUploading: false,
        progress: 0,
        error: null,
        success: false,
        fileUrl: null
    });

    // Additional fields for different content types
    const [duration, setDuration] = useState('');
    const [author, setAuthor] = useState('');
    const [readTime, setReadTime] = useState('');
    const [numQuestions, setNumQuestions] = useState('');
    const [estimatedTime, setEstimatedTime] = useState(''); // renamed from timeLimit
    const [testDifficulty, setTestDifficulty] = useState<TestDifficulty>('intermediate');
    const [numLessons, setNumLessons] = useState('');
    const [callHost, setCallHost] = useState('');
    const [callDate, setCallDate] = useState('');
    const [callTime, setCallTime] = useState('');
    const [callDuration, setCallDuration] = useState('');
    const [callUrl, setCallUrl] = useState('');

    // References for file inputs
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const contentInputRef = useRef<HTMLInputElement>(null);

    // All tiers
    const allTiers = [
        { id: 1, name: 'TOP TIER' },
        { id: 2, name: 'RHODIUM' },
        { id: 3, name: 'PLATINUM' },
        { id: 4, name: 'GOLD' },
        { id: 5, name: 'RUTHENIUM' },
        { id: 6, name: 'IRIDIUM' },
        { id: 7, name: 'OSMIUM' },
        { id: 8, name: 'PALLADIUM' },
        { id: 9, name: 'RHENIUM' },
        { id: 10, name: 'SILVER' }
    ];

    // Reset form when changing content type
    useEffect(() => {
        resetForm();
    }, [contentType]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setThumbnailFile(null);
        setContentFile(null);
        setDuration('');
        setAuthor('');
        setReadTime('');
        setNumQuestions('');
        setEstimatedTime('');
        setTestDifficulty('intermediate');
        setNumLessons('');
        setCallHost('');
        setCallDate('');
        setCallTime('');
        setCallDuration('');
        setCallUrl('');
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

    // Handle thumbnail upload
    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    // Handle content file upload
    const handleContentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setContentFile(e.target.files[0]);
        }
    };

    // Upload thumbnail to Firebase Storage
    const uploadThumbnail = async (): Promise<string> => {
        if (!thumbnailFile) throw new Error('No thumbnail file selected');

        const storageRef = ref(storage, `thumbnails/${contentType}/${Date.now()}_${thumbnailFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, thumbnailFile);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadStatus(prev => ({ ...prev, progress }));
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    };

    // Upload content file to Firebase Storage (for videos, PDFs, etc.)
    const uploadContentFile = async (): Promise<string> => {
        if (!contentFile) throw new Error('No content file selected');

        const storageRef = ref(storage, `content/${contentType}/${Date.now()}_${contentFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, contentFile);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadStatus(prev => ({ ...prev, progress }));
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description || !thumbnailFile || selectedTiers.length === 0) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please fill all required fields and select at least one tier'
            });
            return;
        }

        // Content-specific validation
        if (contentType === 'videos' && (!contentFile || !duration)) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please upload a video file and specify the duration'
            });
            return;
        }

        if (contentType === 'courses' && !numLessons) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please specify the number of lessons'
            });
            return;
        }

        if (contentType === 'blogs' && (!author || !readTime)) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please specify the author and read time'
            });
            return;
        }

        if (contentType === 'tests' && (!numQuestions || !estimatedTime)) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please specify the number of questions and estimated time'
            });
            return;
        }

        if (contentType === 'calls' && (!callHost || !callDate || !callTime || !callDuration)) {
            setUploadStatus({
                ...uploadStatus,
                error: 'Please fill all required fields for zoom calls'
            });
            return;
        }

        try {
            setUploadStatus({
                ...uploadStatus,
                isUploading: true,
                error: null,
            });

            // Upload thumbnail
            const thumbnailUrl = await uploadThumbnail();

            // Upload content file if needed
            let contentUrl = '';
            if (contentFile) {
                // For videos, we always need to upload the file
                // For blogs, we upload the optional PDF/Doc file if provided
                if (contentType === 'videos' || contentType === 'blogs') {
                    contentUrl = await uploadContentFile();
                }
            }

            // Create content records for each selected tier
            for (const tierId of selectedTiers) {
                const baseContentData = {
                    title,
                    description,
                    thumbnail: thumbnailUrl,
                    tier: tierId,
                    createdAt: serverTimestamp(),
                    date: new Date().toISOString()
                };

                let contentData;

                switch (contentType) {
                    case 'videos':
                        contentData = {
                            ...baseContentData,
                            url: contentUrl,
                            duration: parseInt(duration)
                        };
                        break;

                    case 'courses':
                        contentData = {
                            ...baseContentData,
                            lessons: parseInt(numLessons)
                        };
                        break;

                    case 'blogs':
                        contentData = {
                            ...baseContentData,
                            author,
                            readTime: parseInt(readTime),
                            url: contentUrl || '#'
                        };
                        break;

                    case 'tests':
                        contentData = {
                            ...baseContentData,
                            questions: parseInt(numQuestions),
                            estimatedTime: parseInt(estimatedTime),
                            difficulty: testDifficulty,
                            completed: false // Initial state for all users
                        };
                        break;

                    case 'calls':
                        contentData = {
                            ...baseContentData,
                            host: callHost,
                            date: callDate,
                            time: callTime,
                            duration: parseInt(callDuration),
                            url: callUrl || '#'
                        };
                        break;

                    default:
                        contentData = baseContentData;
                }

                // Add document to the appropriate collection
                await addDoc(collection(db, contentType), contentData);
            }

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

    // Content type configuration
    const contentTypes = [
        { id: 'videos', label: 'Videos', icon: <Video size={20} /> },
        { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
        { id: 'blogs', label: 'Blogs', icon: <FileText size={20} /> },
        { id: 'tests', label: 'Knowledge Tests', icon: <Trophy size={20} /> },
        { id: 'calls', label: 'Zoom Calls', icon: <Users size={20} /> }
    ];

    // Test difficulty options
    const difficultyOptions = [
        { value: 'beginner', label: 'Beginner', color: 'bg-green-700 hover:bg-green-600' },
        { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-700 hover:bg-yellow-600' },
        { value: 'advanced', label: 'Advanced', color: 'bg-red-700 hover:bg-red-600' }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-black/30 border border-red-900/30 rounded-lg p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Admin Upload Panel</h1>

                {/* Content type selection */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {contentTypes.map((type) => (
                        <button
                            key={type.id}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${contentType === type.id ?
                                    'bg-red-600 text-white' :
                                    'bg-black/40 text-white/80 hover:bg-black/60'}`}
                            onClick={() => setContentType(type.id as ContentType)}
                        >
                            <span className="mr-2">{type.icon}</span>
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Upload form */}
                <form onSubmit={handleSubmit}>
                    {/* Tier selection */}
                    <div className="mb-6">
                        <label className="block text-white text-sm font-medium mb-2">
                            Select Tiers <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {allTiers.map((tier) => (
                                <button
                                    type="button"
                                    key={tier.id}
                                    onClick={() => toggleTier(tier.id)}
                                    className={`py-2 px-3 rounded-lg text-sm transition-colors ${selectedTiers.includes(tier.id)
                                        ? 'bg-red-600 text-white'
                                        : 'bg-black/40 text-white/80 hover:bg-black/60'
                                        }`}
                                >
                                    {selectedTiers.includes(tier.id) && (
                                        <Check size={16} className="inline-block mr-1" />
                                    )}
                                    {tier.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Basic content information */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                placeholder={`Enter ${contentType.slice(0, -1)} title`}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                placeholder={`Enter ${contentTypes.find(t => t.id === contentType)?.label.toLowerCase() || 'content'} description`}
                                rows={3}
                                required
                            />
                        </div>

                        {/* Thumbnail upload */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Thumbnail Image <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={thumbnailInputRef}
                                onChange={handleThumbnailUpload}
                                className="hidden"
                            />
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className="bg-black/40 hover:bg-black/60 border border-red-900/30 rounded-lg px-4 py-2 text-white flex items-center"
                                >
                                    <Upload size={16} className="mr-2" />
                                    {thumbnailFile ? 'Change Thumbnail' : 'Upload Thumbnail'}
                                </button>
                                {thumbnailFile && (
                                    <span className="text-green-400 text-sm flex items-center">
                                        <Check size={16} className="mr-1" />
                                        {thumbnailFile.name.length > 25 ?
                                            thumbnailFile.name.substring(0, 25) + '...' :
                                            thumbnailFile.name
                                        }
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content-specific fields */}
                        {contentType === 'videos' && (
                            <>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Video File <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        ref={contentInputRef}
                                        onChange={handleContentUpload}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => contentInputRef.current?.click()}
                                            className="bg-black/40 hover:bg-black/60 border border-red-900/30 rounded-lg px-4 py-2 text-white flex items-center"
                                        >
                                            <Upload size={16} className="mr-2" />
                                            {contentFile ? 'Change Video' : 'Upload Video'}
                                        </button>
                                        {contentFile && (
                                            <span className="text-green-400 text-sm flex items-center">
                                                <Check size={16} className="mr-1" />
                                                {contentFile.name.length > 25 ?
                                                    contentFile.name.substring(0, 25) + '...' :
                                                    contentFile.name
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Duration (seconds) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                        placeholder="Enter video duration in seconds"
                                        min="1"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {contentType === 'courses' && (
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Number of Lessons <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={numLessons}
                                    onChange={(e) => setNumLessons(e.target.value)}
                                    className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                    placeholder="Enter number of lessons"
                                    min="1"
                                    required
                                />
                            </div>
                        )}

                        {contentType === 'blogs' && (
                            <>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Author <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                        placeholder="Enter blog author"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Read Time (minutes) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={readTime}
                                        onChange={(e) => setReadTime(e.target.value)}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                        placeholder="Enter estimated read time in minutes"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Blog Content File (PDF/Doc)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        ref={contentInputRef}
                                        onChange={handleContentUpload}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => contentInputRef.current?.click()}
                                            className="bg-black/40 hover:bg-black/60 border border-red-900/30 rounded-lg px-4 py-2 text-white flex items-center"
                                        >
                                            <Upload size={16} className="mr-2" />
                                            {contentFile ? 'Change File' : 'Upload File'}
                                        </button>
                                        {contentFile && (
                                            <span className="text-green-400 text-sm flex items-center">
                                                <Check size={16} className="mr-1" />
                                                {contentFile.name.length > 25 ?
                                                    contentFile.name.substring(0, 25) + '...' :
                                                    contentFile.name
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {contentType === 'tests' && (
                            <>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Difficulty Level <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {difficultyOptions.map((option) => (
                                            <button
                                                type="button"
                                                key={option.value}
                                                onClick={() => setTestDifficulty(option.value as TestDifficulty)}
                                                className={`py-2 px-3 rounded-lg text-sm transition-colors text-white
                                                    ${testDifficulty === option.value
                                                        ? option.color
                                                        : 'bg-black/40 hover:bg-black/60'}`}
                                            >
                                                {testDifficulty === option.value && (
                                                    <Check size={16} className="inline-block mr-1" />
                                                )}
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Number of Questions <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={numQuestions}
                                        onChange={(e) => setNumQuestions(e.target.value)}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                        placeholder="Enter number of questions"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Estimated Time (minutes) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={estimatedTime}
                                        onChange={(e) => setEstimatedTime(e.target.value)}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                        placeholder="Enter estimated completion time in minutes"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Test Content File (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.json"
                                        ref={contentInputRef}
                                        onChange={handleContentUpload}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => contentInputRef.current?.click()}
                                            className="bg-black/40 hover:bg-black/60 border border-red-900/30 rounded-lg px-4 py-2 text-white flex items-center"
                                        >
                                            <Upload size={16} className="mr-2" />
                                            {contentFile ? 'Change File' : 'Upload Test Document'}
                                        </button>
                                        {contentFile && (
                                            <span className="text-green-400 text-sm flex items-center">
                                                <Check size={16} className="mr-1" />
                                                {contentFile.name.length > 25 ?
                                                    contentFile.name.substring(0, 25) + '...' :
                                                    contentFile.name
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Upload a document with test questions and answers (PDF, Word, or JSON format)
                                    </p>
                                </div>
                            </>
                        )}

                        {contentType === 'calls' && (
                            <>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Host <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={callHost}
                                        onChange={(e) => setCallHost(e.target.value)}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                        placeholder="Enter call host name"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={callDate}
                                            onChange={(e) => setCallDate(e.target.value)}
                                            className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            value={callTime}
                                            onChange={(e) => setCallTime(e.target.value)}
                                            className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Duration (minutes) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={callDuration}
                                        onChange={(e) => setCallDuration(e.target.value)}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                        placeholder="Enter call duration in minutes"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Zoom URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={callUrl}
                                        onChange={(e) => setCallUrl(e.target.value)}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg px-4 py-2 text-white"
                                        placeholder="Enter Zoom meeting URL"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Upload status and messages */}
                        {(uploadStatus.error || uploadStatus.success || uploadStatus.isUploading) && (
                            <div className={`p-4 rounded-lg ${uploadStatus.error ? 'bg-red-900/20 border border-red-500' :
                                uploadStatus.success ? 'bg-green-900/20 border border-green-500' :
                                    'bg-blue-900/20 border border-blue-500'
                                }`}>
                                {uploadStatus.error && (
                                    <div className="flex items-start">
                                        <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-red-500 font-medium">Upload Failed</p>
                                            <p className="text-red-400 text-sm">{uploadStatus.error}</p>
                                        </div>
                                    </div>
                                )}

                                {uploadStatus.isUploading && (
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-blue-400">Uploading...</p>
                                            <p className="text-blue-400">{Math.round(uploadStatus.progress)}%</p>
                                        </div>
                                        <div className="w-full bg-blue-900/40 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${uploadStatus.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {uploadStatus.success && (
                                    <div className="flex items-start">
                                        <Check size={20} className="text-green-500 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-green-500 font-medium">Upload Successful</p>
                                            <p className="text-green-400 text-sm">
                                                Content has been uploaded and is now available to the selected tiers.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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