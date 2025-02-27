'use client';

import { useState } from 'react';
import {
    collection, addDoc, serverTimestamp,
    query, getDocs, 
} from 'firebase/firestore';
import {
    ref, uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { createWeb3AnalyticsService } from '@/services/analytics/web3AnalyticsService';
import { UploadStatus, ContentType } from '../types';

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
    const uploadContentFile = async (contentFile: File, contentType: ContentType): Promise<string> => {
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
                const analyticsService = createWeb3AnalyticsService(walletAddress);
                await analyticsService.refreshContentCounts();
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
        for (const tierId of selectedTiers) {
            const finalContentData = {
                ...contentData,
                tier: tierId,
                createdAt: serverTimestamp(),
                date: new Date().toISOString()
            };

            // Add document to the appropriate collection
            await addDoc(collection(db, contentType), finalContentData);
        }

        // Update analytics for all users to reflect new content
        if (contentType === 'videos') {
            console.log('New video uploaded, updating analytics for all users');
            await updateAllUserAnalytics(contentType);
        }
    };

    return {
        uploadStatus,
        setUploadStatus,
        uploadThumbnail,
        uploadContentFile,
        saveContentToFirestore
    };
}