import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VideoItem, UserProgress, ContentType } from '@/types/types';
import { useAccount } from 'wagmi';

/**
 * Custom hook to get user wallet address and methods for tracking progress
 */
export const useUserProgress = () => {
  // Get wallet address from wagmi
  const { address, isConnected } = useAccount();
  
  /**
   * Updates a user's progress for a specific video
   */
  const updateVideoProgress = async (
    videoId: string, 
    currentTime: number, 
    duration: number, 
    videoTitle: string
  ): Promise<void> => {
    try {
      if (!isConnected || !address) {
        console.error('Wallet must be connected to track progress');
        return;
      }
      
      const userId = address.toLowerCase(); // Use wallet address as user ID
      const progressPercentage = Math.floor((currentTime / duration) * 100);
      const isCompleted = progressPercentage >= 90;
      
      // Create a reference to the user's progress document
      const userProgressRef = doc(db, 'userProgress', userId);
      
      // Check if document exists
      const userProgressDoc = await getDoc(userProgressRef);
      
      // Prepare the video progress data
      const videoProgress = {
        id: videoId,
        title: videoTitle,
        lastPosition: currentTime,
        duration: duration,
        progress: progressPercentage,
        completed: isCompleted,
        contentType: 'video' as ContentType,
        lastUpdated: new Date().toISOString()
      };
      
      if (userProgressDoc.exists()) {
        // Document exists, update it
        const data = userProgressDoc.data() as UserProgress;
        
        // Find if we already have progress for this video
        const videoIndex = data.items ? data.items.findIndex(item => 
          item.id === videoId && item.contentType === 'video'
        ) : -1;
        
        if (videoIndex >= 0 && data.items) {
          // Update existing progress
          data.items[videoIndex] = {
            ...data.items[videoIndex],
            ...videoProgress
          };
        } else {
          // Add new progress
          if (!data.items) {
            data.items = [];
          }
          data.items.push(videoProgress);
        }
        
        // Update the document
        await updateDoc(userProgressRef, {
          items: data.items,
          lastUpdated: new Date().toISOString()
        });
      } else {
        // Document doesn't exist, create it
        await setDoc(userProgressRef, {
          userId,
          walletAddress: address,
          items: [videoProgress],
          lastUpdated: new Date().toISOString()
        });
      }
      
      // Also update the completion counter in a separate collection for analytics
      updateContentCompletion(userId, 'video', isCompleted);
      
    } catch (error) {
      console.error('Error updating video progress:', error);
      throw error;
    }
  };

  /**
   * Fetches a user's progress for all content
   */
  const getUserProgress = async (): Promise<UserProgress | null> => {
    try {
      if (!isConnected || !address) {
        console.error('Wallet must be connected to get progress');
        return null;
      }
      
      const userId = address.toLowerCase();
      const userProgressRef = doc(db, 'userProgress', userId);
      const userProgressDoc = await getDoc(userProgressRef);
      
      if (userProgressDoc.exists()) {
        return userProgressDoc.data() as UserProgress;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  };

  /**
   * Fetches a user's progress for a specific video
   */
  const getVideoProgress = async (videoId: string): Promise<any | null> => {
    try {
      const progress = await getUserProgress();
      
      if (!progress || !progress.items) {
        return null;
      }
      
      const videoProgress = progress.items.find(item => 
        item.id === videoId && item.contentType === 'video'
      );
      
      return videoProgress || null;
    } catch (error) {
      console.error('Error fetching video progress:', error);
      return null;
    }
  };

  /**
   * Updates user completion counters for analytics
   */
  const updateContentCompletion = async (
    userId: string, 
    contentType: ContentType, 
    completed: boolean
  ): Promise<void> => {
    try {
      // Create a reference to the user's analytics document
      const userAnalyticsRef = doc(db, 'userAnalytics', userId);
      
      // Check if document exists
      const userAnalyticsDoc = await getDoc(userAnalyticsRef);
      
      if (userAnalyticsDoc.exists()) {
        const data = userAnalyticsDoc.data();
        
        // Build the field name based on content type
        const completedField = `${contentType}Completed`;
        const inProgressField = `${contentType}InProgress`;
        
        if (completed) {
          // If completed, increment completed count and ensure it's not counted as in-progress
          await updateDoc(userAnalyticsRef, {
            [completedField]: (data[completedField] || 0) + 1,
            [inProgressField]: Math.max(0, (data[inProgressField] || 0) - 1)
          });
        } else if (!data[completedField]) {
          // If not already completed, mark as in progress
          await updateDoc(userAnalyticsRef, {
            [inProgressField]: (data[inProgressField] || 0) + 1
          });
        }
      } else {
        // Document doesn't exist, create it with initial counts
        const initialData: any = {
          userId,
          walletAddress: address,
          lastUpdated: new Date().toISOString()
        };
        
        // Set the appropriate counters based on content type and completion
        if (completed) {
          initialData[`${contentType}Completed`] = 1;
          initialData[`${contentType}InProgress`] = 0;
        } else {
          initialData[`${contentType}Completed`] = 0;
          initialData[`${contentType}InProgress`] = 1;
        }
        
        await setDoc(userAnalyticsRef, initialData);
      }
    } catch (error) {
      console.error('Error updating completion counters:', error);
    }
  };

  /**
   * Gets analytics data for the current user
   */
  const getUserAnalytics = async () => {
    try {
      if (!isConnected || !address) {
        console.error('Wallet must be connected to get analytics');
        return null;
      }
      
      const userId = address.toLowerCase();
      const userAnalyticsRef = doc(db, 'userAnalytics', userId);
      const userAnalyticsDoc = await getDoc(userAnalyticsRef);
      
      if (userAnalyticsDoc.exists()) {
        return userAnalyticsDoc.data();
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return null;
    }
  };

  return {
    address,
    isConnected,
    updateVideoProgress,
    getUserProgress,
    getVideoProgress,
    getUserAnalytics
  };
};