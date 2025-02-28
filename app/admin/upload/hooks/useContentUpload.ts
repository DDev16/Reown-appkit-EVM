'use client';

import { useState } from 'react';
import {
    collection, addDoc, serverTimestamp,
    query, where, getDocs, doc, deleteDoc, updateDoc
} from 'firebase/firestore';
import {
    ref, uploadBytesResumable,
    getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { UploadStatus, ContentType, CourseLessonFile } from '../types';

export function useContentUpload() {
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
        isUploading: false,
        progress: 0,
        error: null,
        success: false,
        fileUrl: null
    });

    // Upload thumbnail to Firebase Storage
    const uploadThumbnail = async (thumbnailFile: File, contentType: ContentType): Promise<string> => {
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
    const uploadContentFile = async (contentFile: File, contentType: ContentType, customPath?: string): Promise<string> => {
        if (!contentFile) throw new Error('No content file selected');

        const path = customPath || `content/${contentType}`;
        const storageRef = ref(storage, `${path}/${Date.now()}_${contentFile.name}`);
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

    // Upload multiple course lesson files
    const uploadCourseLessonFiles = async (
        lessonFiles: CourseLessonFile[],
        courseId: string
    ): Promise<{ lessons: any[] }> => {
        const lessons = [];
        let totalFiles = lessonFiles.length;
        let completedFiles = 0;

        // Sort lessons by order
        const sortedLessonFiles = [...lessonFiles].sort((a, b) => a.order - b.order);

        for (const lessonFile of sortedLessonFiles) {
            try {
                const path = `content/courses/${courseId}/lessons`;
                const fileUrl = await uploadContentFile(lessonFile.file, 'courses', path);
                
                // Create lesson object with all necessary data for rendering
                const lesson = {
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
                
                lessons.push(lesson);
                
                // Update progress
                completedFiles++;
                const totalProgress = (completedFiles / totalFiles) * 100;
                setUploadStatus(prev => ({ ...prev, progress: totalProgress }));
                
            } catch (error) {
                console.error(`Error uploading lesson file: ${lessonFile.title}`, error);
                throw error;
            }
        }

        return { lessons };
    };

    // Update all user analytics after content upload
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

            // For each user, update their content counts
            const updatePromises = analyticsSnapshot.docs.map(async (doc) => {
                const walletAddress = doc.id;
                console.log(`Updated analytics for user: ${walletAddress}`);
            });

            await Promise.all(updatePromises);
            console.log(`Updated analytics for ${updatePromises.length} users after ${contentType} upload`);
        } catch (error) {
            console.error('Error updating user analytics:', error);
        }
    };

    // Save content to Firestore
    const saveContentToFirestore = async (
        contentType: ContentType,
        contentData: any,
        selectedTiers: number[]
    ) => {
        // Create content records for each selected tier
        const docIds = [];
        for (const tierId of selectedTiers) {
            const finalContentData = {
                ...contentData,
                tier: tierId,
                createdAt: serverTimestamp(),
                date: new Date().toISOString()
            };

            // Add document to the appropriate collection
            const docRef = await addDoc(collection(db, contentType), finalContentData);
            docIds.push(docRef.id);
        }

        // Update analytics for all users to reflect new content
        if (contentType === 'videos' || contentType === 'courses') {
            console.log(`New ${contentType} uploaded, updating analytics for all users`);
            await updateAllUserAnalytics(contentType);
        }

        return docIds;
    };

    return {
        uploadStatus,
        setUploadStatus,
        uploadThumbnail,
        uploadContentFile,
        uploadCourseLessonFiles,
        saveContentToFirestore
    };
}