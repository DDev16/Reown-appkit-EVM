'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VideoItem } from '@/types/types';

interface VideoProgress {
  videoId: string;
  progress: number;
  lastPosition: number;
  lastWatched: string;
  completed: boolean;
}

export const useVideoProgress = (userId: string) => {
  const [videoProgresses, setVideoProgresses] = useState<Record<string, VideoProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load all video progress data for the user
  useEffect(() => {
    const loadVideoProgress = async () => {
      try {
        if (!userId) {
          setIsLoading(false);
          return;
        }
        
        const userProgressDoc = doc(db, 'userProgress', userId);
        const userProgressSnapshot = await getDoc(userProgressDoc);
        
        if (userProgressSnapshot.exists()) {
          const data = userProgressSnapshot.data();
          setVideoProgresses(data.videos || {});
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading video progress:', error);
        setIsLoading(false);
      }
    };
    
    loadVideoProgress();
  }, [userId]);

  // Save video progress
  const saveVideoProgress = useCallback(async (
    videoId: string, 
    currentTime: number, 
    duration: number
  ) => {
    try {
      if (!userId) return;
      
      const progress = Math.floor((currentTime / duration) * 100);
      const completed = progress > 90; // Consider watched if > 90%
      
      const videoProgress: VideoProgress = {
        videoId,
        progress,
        lastPosition: currentTime,
        lastWatched: new Date().toISOString(),
        completed
      };
      
      // Update local state
      setVideoProgresses(prev => ({
        ...prev,
        [videoId]: videoProgress
      }));
      
      // Save to Firestore
      const userProgressDoc = doc(db, 'userProgress', userId);
      await setDoc(userProgressDoc, {
        videos: {
          ...videoProgresses,
          [videoId]: videoProgress
        }
      }, { merge: true });
      
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  }, [userId, videoProgresses]);

  // Get progress for a specific video
  const getVideoProgress = useCallback((videoId: string): VideoProgress | null => {
    return videoProgresses[videoId] || null;
  }, [videoProgresses]);

  // Mark video as watched
  const markVideoAsWatched = useCallback(async (videoId: string) => {
    try {
      if (!userId) return;
      
      const videoProgress: VideoProgress = {
        videoId,
        progress: 100,
        lastPosition: 0,
        lastWatched: new Date().toISOString(),
        completed: true
      };
      
      // Update local state
      setVideoProgresses(prev => ({
        ...prev,
        [videoId]: videoProgress
      }));
      
      // Save to Firestore
      const userProgressDoc = doc(db, 'userProgress', userId);
      await setDoc(userProgressDoc, {
        videos: {
          ...videoProgresses,
          [videoId]: videoProgress
        }
      }, { merge: true });
      
    } catch (error) {
      console.error('Error marking video as watched:', error);
    }
  }, [userId, videoProgresses]);

  // Enhance videos with progress information
  const enhanceVideosWithProgress = useCallback((videos: VideoItem[]): VideoItem[] => {
    return videos.map(video => {
      const progress = videoProgresses[video.id];
      if (progress) {
        return {
          ...video,
          progress: progress.progress,
          lastPosition: progress.lastPosition,
          completed: progress.completed
        };
      }
      return video;
    });
  }, [videoProgresses]);

  return {
    isLoading,
    saveVideoProgress,
    getVideoProgress,
    markVideoAsWatched,
    enhanceVideosWithProgress
  };
};