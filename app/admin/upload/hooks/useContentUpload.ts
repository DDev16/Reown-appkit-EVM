'use client';

import { useState } from 'react';
import {
    collection, addDoc, serverTimestamp,
    query, where, getDocs, doc, deleteDoc, updateDoc, writeBatch, setDoc
} from 'firebase/firestore';
import {
    ref, uploadBytesResumable,
    getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { UploadStatus, ContentType, CourseLessonFile } from '../types';
import { TaskState } from 'firebase/storage';

// Define the lesson object type for better type safety
interface LessonObject {
    id: string;
    order: number;
    title: string;
    type: string;
    url: string;
    filename: string;
    duration?: number;
}

export function useContentUpload() {
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
        isUploading: false,
        progress: 0,
        error: null,
        success: false,
        fileUrl: null,
        transferredMB: 0,
        totalMB: 0,
        state: 'running'
    });

    // Helper function to map Firebase TaskState to our UploadStatus state
    const mapTaskState = (state: TaskState): UploadStatus['state'] => {
        switch (state) {
            case 'running':
                return 'running';
            case 'paused':
                return 'paused';
            case 'canceled':
                return 'error';
            case 'error':
                return 'error';
            case 'success':
                return 'success';
            default:
                return 'running';
        }
    };

    // Compress image before uploading
    const compressImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
        // Only compress image files
        if (!file.type.startsWith('image/')) {
            return file;
        }
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Scale down the image if it's larger than maxWidth
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    // Convert to blob
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Canvas to Blob failed'));
                                return;
                            }
                            
                            // Create a new File
                            const compressedFile = new File(
                                [blob],
                                file.name,
                                {
                                    type: file.type,
                                    lastModified: Date.now()
                                }
                            );
                            
                            resolve(compressedFile);
                        },
                        file.type,
                        quality
                    );
                };
                
                img.onerror = () => {
                    reject(new Error('Failed to load image'));
                };
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
        });
    };

    // Upload thumbnail with compression
    const uploadThumbnail = async (thumbnailFile: File, contentType: ContentType): Promise<string> => {
        if (!thumbnailFile) throw new Error('No thumbnail file selected');
        
        // Reset upload status
        setUploadStatus({
            isUploading: true,
            progress: 0,
            error: null,
            success: false,
            fileUrl: null,
            transferredMB: 0,
            totalMB: thumbnailFile.size / (1024 * 1024),
            state: 'running'
        });
        
        try {
            // Compress the thumbnail if it's an image
            const compressedFile = await compressImage(thumbnailFile);
            console.log(`Original size: ${thumbnailFile.size / 1024}KB, Compressed size: ${compressedFile.size / 1024}KB`);
            
            const storageRef = ref(storage, `thumbnails/${contentType}/${Date.now()}_${compressedFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, compressedFile);
            
            // Enable pause/resume/cancel
            const pauseUpload = () => {
                uploadTask.pause();
                setUploadStatus(prev => ({ ...prev, state: 'paused' }));
            };
            
            const resumeUpload = () => {
                uploadTask.resume();
                setUploadStatus(prev => ({ ...prev, state: 'running' }));
            };
            
            const cancelUpload = () => {
                uploadTask.cancel();
                setUploadStatus(prev => ({ 
                    ...prev, 
                    isUploading: false,
                    error: 'Upload cancelled',
                    state: 'error'
                }));
            };
            
            // Save these functions for UI controls
            setUploadStatus(prev => ({ 
                ...prev, 
                pauseUpload,
                resumeUpload,
                cancelUpload
            }));
            
            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        const transferredMB = snapshot.bytesTransferred / (1024 * 1024);
                        const totalMB = snapshot.totalBytes / (1024 * 1024);
                        
                        setUploadStatus(prev => ({ 
                            ...prev, 
                            progress,
                            transferredMB: Math.round(transferredMB * 10) / 10,
                            totalMB: Math.round(totalMB * 10) / 10,
                            state: mapTaskState(snapshot.state)
                        }));
                    },
                    (error) => {
                        setUploadStatus(prev => ({ 
                            ...prev, 
                            isUploading: false,
                            error: error.message,
                            state: 'error'
                        }));
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            setUploadStatus(prev => ({ 
                                ...prev, 
                                fileUrl: downloadURL,
                                success: true,
                                isUploading: false,
                                state: 'success'
                            }));
                            resolve(downloadURL);
                        } catch (error: any) {
                            setUploadStatus(prev => ({ 
                                ...prev, 
                                isUploading: false,
                                error: error.message,
                                state: 'error'
                            }));
                            reject(error);
                        }
                    }
                );
            });
        } catch (error: any) {
            setUploadStatus(prev => ({ 
                ...prev, 
                isUploading: false,
                error: error.message,
                state: 'error'
            }));
            throw error;
        }
    };

    // Upload content file with optimized chunking
    const uploadContentFile = async (
        contentFile: File, 
        contentType: ContentType, 
        customPath?: string
    ): Promise<string> => {
        if (!contentFile) throw new Error('No content file selected');

        // Reset upload status
        setUploadStatus({
            isUploading: true,
            progress: 0,
            error: null,
            success: false,
            fileUrl: null,
            transferredMB: 0,
            totalMB: contentFile.size / (1024 * 1024),
            state: 'running'
        });

        const path = customPath || `content/${contentType}`;
        const storageRef = ref(storage, `${path}/${Date.now()}_${contentFile.name}`);
        
        // Customize metadata for better caching
        const metadata = {
            contentType: contentFile.type,
            cacheControl: 'public,max-age=31536000',
        };
        
        const uploadTask = uploadBytesResumable(storageRef, contentFile, metadata);
        
        // Enable pause/resume/cancel
        const pauseUpload = () => {
            uploadTask.pause();
            setUploadStatus(prev => ({ ...prev, state: 'paused' }));
        };
        
        const resumeUpload = () => {
            uploadTask.resume();
            setUploadStatus(prev => ({ ...prev, state: 'running' }));
        };
        
        const cancelUpload = () => {
            uploadTask.cancel();
            setUploadStatus(prev => ({ 
                ...prev, 
                isUploading: false,
                error: 'Upload cancelled',
                state: 'error'
            }));
        };
        
        // Save these functions for UI controls
        setUploadStatus(prev => ({ 
            ...prev, 
            pauseUpload,
            resumeUpload,
            cancelUpload
        }));

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    const transferredMB = snapshot.bytesTransferred / (1024 * 1024);
                    const totalMB = snapshot.totalBytes / (1024 * 1024);
                    
                    setUploadStatus(prev => ({ 
                        ...prev, 
                        progress,
                        transferredMB: Math.round(transferredMB * 10) / 10,
                        totalMB: Math.round(totalMB * 10) / 10,
                        state: mapTaskState(snapshot.state)
                    }));
                },
                (error) => {
                    setUploadStatus(prev => ({ 
                        ...prev, 
                        isUploading: false,
                        error: error.message,
                        state: 'error'
                    }));
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploadStatus(prev => ({ 
                            ...prev, 
                            fileUrl: downloadURL,
                            success: true,
                            isUploading: false,
                            state: 'success'
                        }));
                        resolve(downloadURL);
                    } catch (error: any) {
                        setUploadStatus(prev => ({ 
                            ...prev, 
                            isUploading: false,
                            error: error.message,
                            state: 'error'
                        }));
                        reject(error);
                    }
                }
            );
        });
    };

   // Improved uploadCourseLessonFiles function with retry mechanism
const uploadCourseLessonFiles = async (
    lessonFiles: CourseLessonFile[],
    courseId: string
): Promise<{ lessons: LessonObject[] }> => {
    // Sort lessons by order
    const sortedLessonFiles = [...lessonFiles].sort((a, b) => a.order - b.order);
    const totalFiles = sortedLessonFiles.length;
    let completedFiles = 0;
    
    // Set initial upload status
    setUploadStatus({
        isUploading: true,
        progress: 0,
        error: null,
        success: false,
        fileUrl: null,
        transferredMB: 0,
        totalMB: sortedLessonFiles.reduce((total, file) => total + file.file.size, 0) / (1024 * 1024),
        state: 'running'
    });
    
    try {
        console.log(`Starting upload of ${totalFiles} lesson files for course ${courseId}`);
        
        // Process files sequentially for better reliability - this is better for large numbers of files
        // Even though it's slightly slower, it's more reliable
        let lessons: LessonObject[] = [];
        
        for (let i = 0; i < sortedLessonFiles.length; i++) {
            const lessonFile = sortedLessonFiles[i];
            let attempts = 0;
            const maxAttempts = 3;
            let successful = false;
            
            // Try up to 3 times to upload each file
            while (attempts < maxAttempts && !successful) {
                try {
                    attempts++;
                    console.log(`Uploading file ${i+1}/${totalFiles}: ${lessonFile.title} (Attempt ${attempts})`);
                    
                    const path = `content/courses/${courseId}/lessons`;
                    const fileUrl = await uploadContentFile(lessonFile.file, 'courses', path);
                    
                    // Update progress
                    completedFiles++;
                    const totalProgress = (completedFiles / totalFiles) * 100;
                    setUploadStatus(prev => ({ 
                        ...prev, 
                        progress: totalProgress,
                        state: 'running'
                    }));
                    
                    // Create lesson object
                    const lesson: LessonObject = {
                        id: lessonFile.id,
                        order: lessonFile.order,
                        title: lessonFile.title,
                        type: lessonFile.type,
                        url: fileUrl,
                        filename: lessonFile.file.name,
                        ...(lessonFile.type === 'video' && { 
                            duration: parseInt(lessonFile.duration || '0') 
                        })
                    };
                    
                    // Add to lessons array
                    lessons.push(lesson);
                    successful = true;
                    
                    console.log(`Successfully uploaded file ${i+1}/${totalFiles}: ${lessonFile.title}`);
                } catch (error) {
                    console.error(`Error uploading lesson file (attempt ${attempts}):`, error);
                    if (attempts === maxAttempts) {
                        throw error; // Rethrow after max attempts
                    }
                    
                    // Wait 2 seconds before retrying
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }
        
        // Mark as successful when all uploads complete
        setUploadStatus(prev => ({ 
            ...prev,
            isUploading: false,
            success: true,
            state: 'success'
        }));
        
        console.log(`All lesson uploads complete. Total lessons: ${lessons.length}`);
        return { lessons };
    } catch (error: any) {
        console.error('Error in uploadCourseLessonFiles:', error);
        setUploadStatus(prev => ({ 
            ...prev, 
            isUploading: false,
            error: error.message,
            state: 'error'
        }));
        throw error;
    }
};

// Function to upload lesson files and create documents in the lessons collection
const uploadLessonsToCollection = async (
    lessonFiles: CourseLessonFile[],
    courseId: string
): Promise<number> => {
    // Sort lessons by order
    const sortedLessonFiles = [...lessonFiles].sort((a, b) => a.order - b.order);
    const totalFiles = sortedLessonFiles.length;
    let completedFiles = 0;
    
    // Set initial upload status
    setUploadStatus({
        isUploading: true,
        progress: 0,
        error: null,
        success: false,
        fileUrl: null,
        transferredMB: 0,
        totalMB: sortedLessonFiles.reduce((total, file) => total + file.file.size, 0) / (1024 * 1024),
        state: 'running'
    });
    
    try {
        console.log(`Starting upload of ${totalFiles} lesson files for course ${courseId}`);
        
        // Create a reference to the lessons collection
        const lessonsCollectionRef = collection(db, 'lessons');
        
        // Process files sequentially with retry mechanism
        for (let i = 0; i < sortedLessonFiles.length; i++) {
            const lessonFile = sortedLessonFiles[i];
            let attempts = 0;
            const maxAttempts = 3;
            let successful = false;
            
            // Try up to 3 times to upload each file
            while (attempts < maxAttempts && !successful) {
                try {
                    attempts++;
                    console.log(`Uploading file ${i+1}/${totalFiles}: ${lessonFile.title} (Attempt ${attempts})`);
                    
                    // 1. Upload the file to Firebase Storage
                    const path = `content/courses/${courseId}/lessons`;
                    const fileUrl = await uploadContentFile(lessonFile.file, 'courses', path);
                    
                    // 2. Create lesson document in the lessons collection
                    const lessonData = {
                        courseId: courseId,  // Reference to parent course
                        id: lessonFile.id,
                        order: lessonFile.order,
                        title: lessonFile.title,
                        type: lessonFile.type,
                        url: fileUrl,
                        filename: lessonFile.file.name,
                        ...(lessonFile.type === 'video' && { 
                            duration: parseInt(lessonFile.duration || '0') 
                        }),
                        createdAt: serverTimestamp()
                    };
                    
                    // Add document to the lessons collection
                    await addDoc(lessonsCollectionRef, lessonData);
                    console.log(`Created lesson document for ${lessonFile.title}`);
                    
                    // Update progress
                    completedFiles++;
                    const totalProgress = (completedFiles / totalFiles) * 100;
                    setUploadStatus(prev => ({ 
                        ...prev, 
                        progress: totalProgress,
                        state: 'running'
                    }));
                    
                    successful = true;
                } catch (error) {
                    console.error(`Error processing lesson ${lessonFile.title} (attempt ${attempts}):`, error);
                    if (attempts === maxAttempts) {
                        throw error; // Rethrow after max attempts
                    }
                    
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }
        
        // Mark as successful when all uploads complete
        setUploadStatus(prev => ({ 
            ...prev,
            isUploading: false,
            success: true,
            state: 'success'
        }));
        
        console.log(`All ${completedFiles} lessons successfully uploaded and saved for course ${courseId}`);
        return completedFiles;
    } catch (error: any) {
        console.error('Error in uploadLessonsToCollection:', error);
        setUploadStatus(prev => ({ 
            ...prev, 
            isUploading: false,
            error: error.message,
            state: 'error'
        }));
        throw error;
    }
};

    // Update all user analytics using batch operations
    const updateAllUserAnalytics = async (contentType: ContentType) => {
        try {
            console.log(`Starting analytics update for all users after ${contentType} upload`);
            
            // Get all users who have analytics documents
            const analyticsQuery = query(collection(db, 'userAnalytics'));
            const analyticsSnapshot = await getDocs(analyticsQuery);
            
            if (analyticsSnapshot.empty) {
                console.log('No user analytics documents found to update');
                return;
            }

            console.log(`Found ${analyticsSnapshot.size} users to update`);
            
            // Use batched writes for better performance
            const batch = writeBatch(db);
            const batchSize = 500; // Firestore allows up to 500 operations per batch
            let operationsCount = 0;
            let batchCount = 1;
            
            // Process all users in batches if needed
            for (const document of analyticsSnapshot.docs) {
                const walletAddress = document.id;
                const userData = document.data();
                
                // Reference to the user's analytics document
                const userAnalyticsRef = doc(db, 'userAnalytics', walletAddress);
                
                // Update the appropriate field based on content type
                batch.update(userAnalyticsRef, {
                    [`${contentType}Count`]: (userData[`${contentType}Count`] || 0) + 1,
                    lastUpdated: serverTimestamp()
                });
                
                operationsCount++;
                
                // If we reach batch size limit, commit and start a new batch
                if (operationsCount >= batchSize) {
                    await batch.commit();
                    console.log(`Committed batch ${batchCount} (${operationsCount} operations)`);
                    
                    // Reset for next batch
                    operationsCount = 0;
                    batchCount++;
                }
            }
            
            // Commit any remaining operations
            if (operationsCount > 0) {
                await batch.commit();
                console.log(`Committed final batch (${operationsCount} operations)`);
            }
            
            console.log(`Updated analytics for ${analyticsSnapshot.size} users after ${contentType} upload`);
        } catch (error) {
            console.error('Error updating user analytics:', error);
        }
    };

    // UPDATED: Save content to Firestore with array of tiers
    const saveContentToFirestore = async (
        contentType: ContentType,
        contentData: any,
        selectedTiers: number[]
    ) => {
        console.log(`Starting saveContentToFirestore for ${contentType}`, contentData);
        
        try {
            // Create a single document with tiers array instead of multiple documents
            if (contentType === 'courses') {
                // For courses, store a single document with tiers array
                const finalContentData = {
                    ...contentData,
                    tiers: selectedTiers, // Store as array instead of single tier value
                    createdAt: serverTimestamp(),
                    date: new Date().toISOString()
                };
                
                // Add the document
                const docRef = await addDoc(collection(db, contentType), finalContentData);
                const docId = docRef.id;
                console.log(`Created course document with ID: ${docId} for tiers: ${selectedTiers.join(', ')}`);
                
                // Update analytics in background
                updateAllUserAnalytics(contentType);
                
                return [docId]; // Return as array for consistency with existing code
            } else {
                // For other content types, keep the original implementation
                const docIds: string[] = [];
                
                for (const tierId of selectedTiers) {
                    console.log(`Creating document for tier ${tierId}`);
                    const finalContentData = {
                        ...contentData,
                        tier: tierId,
                        createdAt: serverTimestamp(),
                        date: new Date().toISOString()
                    };
                    
                    // Use addDoc directly
                    const docRef = await addDoc(collection(db, contentType), finalContentData);
                    const docId = docRef.id;
                    console.log(`Created document with ID: ${docId}`);
                    
                    docIds.push(docId);
                }
                
                console.log(`Successfully created ${docIds.length} documents`, docIds);
                
                // Update analytics in background
                if (contentType === 'videos') {
                    updateAllUserAnalytics(contentType);
                }
                
                return docIds;
            }
        } catch (error) {
            console.error('Error saving content to Firestore:', error);
            throw error;
        }
    };

    // Function to query courses by tier
    const getCoursesByTier = async (tierNumber: number) => {
        try {
            const coursesRef = collection(db, 'courses');
            const q = query(coursesRef, where('tiers', 'array-contains', tierNumber));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting courses by tier:', error);
            throw error;
        }
    };

    // Define a type for lesson documents from Firestore
    interface LessonDocument {
        id: string;
        order: number;
        courseId: string;
        title: string;
        type: string;
        url: string;
        filename: string;
        duration?: number;
        createdAt?: any;
    }

    // Function to get lessons for a course
    const getLessonsForCourse = async (courseId: string): Promise<LessonDocument[]> => {
        try {
            const lessonsRef = collection(db, 'lessons');
            const q = query(lessonsRef, 
                where('courseId', '==', courseId),
                // Add orderBy if you have an index set up
                // orderBy('order', 'asc')
            );
            
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as LessonDocument))
                // Sort by order in JavaScript since we may not have the index
                .sort((a, b) => a.order - b.order);
        } catch (error) {
            console.error('Error getting lessons for course:', error);
            throw error;
        }
    };

    return {
        uploadStatus,
        setUploadStatus,
        uploadThumbnail,
        uploadContentFile,
        uploadCourseLessonFiles,
        uploadLessonsToCollection, // Renamed function
        saveContentToFirestore,
        getCoursesByTier, // New function
        getLessonsForCourse // New function
    };
}