'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  VideoItem, 
  CourseItem, 
  BlogItem, 
  CallItem,
  TestItem,
  CourseLessonData, // Import the new type
  TierContentData 
} from '@/types/types';

export const useTierContent = (tier: number): TierContentData => {
  const [latestVideos, setLatestVideos] = useState<VideoItem[]>([]);
  const [latestCourses, setLatestCourses] = useState<CourseItem[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<BlogItem[]>([]);
  const [latestCalls, setLatestCalls] = useState<CallItem[]>([]);
  const [latestTests, setLatestTests] = useState<TestItem[]>([]); // Initialize with empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content method that can be called to refresh data
  const fetchContent = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch videos
      console.log("Fetching videos for tier:", tier);
      const videosQuery = query(
        collection(db, "videos"),
        where("tier", "==", tier)
      );
      const videoSnapshot = await getDocs(videosQuery);
      console.log("Video snapshot size:", videoSnapshot.size);

      const videosList = videoSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Untitled Video",
          description: data.description || "No description available",
          thumbnail: data.thumbnail || "/placeholder-thumbnail.jpg",
          duration: data.duration || 0,
          url: data.url || "",
          date: data.date || new Date().toISOString(),
          ...data
        };
      });

      // Sort videos manually by date (newest first)
      const sortedVideos = [...videosList].sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      }).slice(0, 3); // Limit to 3 items

      setLatestVideos(sortedVideos);

      // Fetch courses
      const coursesQuery = query(
        collection(db, "courses"),
        where("tier", "==", tier)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesList = coursesSnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Create base course object
        const courseData: CourseItem = {
          id: doc.id,
          title: data.title || "Untitled Course",
          description: data.description || "No description available",
          thumbnail: data.thumbnail || "/placeholder-thumbnail.jpg",
          lessons: data.lessons || 0,
          date: data.date || new Date().toISOString(),
          ...data
        };
        
        // Process lesson data if it exists
        if (data.lessonData && Array.isArray(data.lessonData)) {
          // Ensure each lesson has all required fields properly typed
          courseData.lessonData = data.lessonData.map((lesson: any) => ({
            id: lesson.id || `lesson-${Math.random().toString(36).substring(2, 9)}`,
            order: typeof lesson.order === 'number' ? lesson.order : 0,
            title: lesson.title || 'Untitled Lesson',
            type: lesson.type === 'pdf' ? 'pdf' : 'video',
            url: lesson.url || '',
            filename: lesson.filename || '',
            duration: typeof lesson.duration === 'number' ? lesson.duration : 0
          })) as CourseLessonData[];
        }
        
        return courseData;
      });

      // Sort courses manually by date (newest first)
      const sortedCourses = [...coursesList].sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      }).slice(0, 3); // Limit to 3 items

      setLatestCourses(sortedCourses);

      // Fetch blogs
      const blogsQuery = query(
        collection(db, "blogs"),
        where("tier", "==", tier)
      );
      const blogsSnapshot = await getDocs(blogsQuery);
      const blogsList = blogsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Untitled Blog",
          description: data.description || "No description available",
          thumbnail: data.thumbnail || "/placeholder-thumbnail.jpg",
          author: data.author || "Unknown Author",
          readTime: data.readTime || 5,
          date: data.date || new Date().toISOString(),
          ...data
        };
      });

      // Sort blogs manually by date (newest first)
      const sortedBlogs = [...blogsList].sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      }).slice(0, 3); // Limit to 3 items

      setLatestBlogs(sortedBlogs);

      // Fetch calls
      const callsQuery = query(
        collection(db, "calls"),
        where("tier", "==", tier)
      );
      const callsSnapshot = await getDocs(callsQuery);
      const callsList = callsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Untitled Call",
          description: data.description || "No description available",
          host: data.host || "Unknown Host",
          date: data.date || new Date().toISOString(),
          time: data.time || "00:00",
          ...data
        };
      });

      // Sort calls manually by date (upcoming first)
      const sortedCalls = [...callsList].sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateA - dateB; // Ascending order for calls (upcoming first)
      }).slice(0, 2); // Limit to 2 items

      setLatestCalls(sortedCalls);
      
      // Fetch knowledge tests
      try {
        const testsQuery = query(
          collection(db, "tests"),
          where("tier", "==", tier)
        );
        const testsSnapshot = await getDocs(testsQuery);
        const testsList = testsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled Test",
            description: data.description || "No description available",
            thumbnail: data.thumbnail || "/placeholder-thumbnail.jpg",
            questions: data.questions || 10,
            estimatedTime: data.estimatedTime || 15, // minutes
            difficulty: data.difficulty || "intermediate",
            date: data.date || new Date().toISOString(),
            completed: data.completed || false,
            score: data.score,
            ...data
          };
        });

        // Sort tests by difficulty (easy to hard) and then by date (newest first)
        const difficultyOrder = { "beginner": 1, "intermediate": 2, "advanced": 3 };
        const sortedTests = [...testsList].sort((a, b) => {
          // First sort by difficulty
          const diffA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 2;
          const diffB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 2;
          
          if (diffA !== diffB) {
            return diffA - diffB;
          }
          
          // Then by date (newest first) if difficulty is the same
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateB - dateA;
        }).slice(0, 6); // Limit to 6 items

        setLatestTests(sortedTests);
      } catch (testError) {
        console.error("Error fetching tests:", testError);
        // Don't fail the whole function if tests fail - just keep an empty array
        setLatestTests([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to load content. Please try again later.");
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    console.log("Fetching latest content for tier:", tier);
    fetchContent();
  }, [tier]);

  return {
    videos: latestVideos,
    courses: latestCourses,
    blogs: latestBlogs,
    calls: latestCalls,
    tests: latestTests, // Always return the tests array (empty if no data)
    isLoading,
    error,
    refreshData: fetchContent
  };
};