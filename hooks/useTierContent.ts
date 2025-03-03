'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  VideoItem, 
  CourseItem, 
  BlogItem, 
  CallItem,
  TestItem,
  CourseLessonData,
  TierContentData 
} from '@/types/types';

export const useTierContent = (tier: number): TierContentData => {
  const [latestVideos, setLatestVideos] = useState<VideoItem[]>([]);
  const [latestCourses, setLatestCourses] = useState<CourseItem[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<BlogItem[]>([]);
  const [latestCalls, setLatestCalls] = useState<CallItem[]>([]);
  const [latestTests, setLatestTests] = useState<TestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to fetch lessons for a course
  const fetchCourseLessons = async (courseId: string): Promise<CourseLessonData[]> => {
    try {
      // Query the top-level lessons collection instead of subcollection
      const lessonsQuery = query(
        collection(db, "lessons"),
        where("courseId", "==", courseId),
        orderBy("order", "asc") // Add orderBy if you have an index set up
      );
      
      const lessonsSnapshot = await getDocs(lessonsQuery);

      if (lessonsSnapshot.empty) {
        console.log(`No lessons found for course ${courseId}`);
        return [];
      }

      console.log(`Found ${lessonsSnapshot.size} lessons for course ${courseId}`);

      // Map the lessons data
      const lessonsData = lessonsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          order: data.order || 0,
          title: data.title || "Untitled Lesson",
          type: data.type === 'pdf' ? 'pdf' : 'video',
          url: data.url || '',
          filename: data.filename || '',
          duration: typeof data.duration === 'number' ? data.duration : 0
        } as CourseLessonData;
      });

      return lessonsData; // No need to sort since we're using orderBy in the query

    } catch (error) {
      console.error(`Error fetching lessons for course ${courseId}:`, error);
      
      // Try falling back to subcollection method for backward compatibility
      try {
        console.log(`Attempting to fetch lessons from subcollection for course ${courseId}`);
        const subcollectionQuery = query(collection(db, "courses", courseId, "lessons"));
        const subcollectionSnapshot = await getDocs(subcollectionQuery);
        
        if (subcollectionSnapshot.empty) {
          console.log(`No lessons found in subcollection for course ${courseId}`);
          return [];
        }
        
        console.log(`Found ${subcollectionSnapshot.size} lessons in subcollection`);
        
        // Map the lessons data
        const subcollectionData = subcollectionSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            order: data.order || 0,
            title: data.title || "Untitled Lesson",
            type: data.type === 'pdf' ? 'pdf' : 'video',
            url: data.url || '',
            filename: data.filename || '',
            duration: typeof data.duration === 'number' ? data.duration : 0
          } as CourseLessonData;
        });
        
        // Sort lessons by order
        return subcollectionData.sort((a, b) => a.order - b.order);
      } catch (fallbackError) {
        console.error(`Fallback method also failed for course ${courseId}:`, fallbackError);
        return [];
      }
    }
  };

  // Fetch content method that can be called to refresh data
  const fetchContent = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch videos (still using the old tier field)
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

      // Fetch courses - UPDATED to use tiers array
      console.log("Fetching courses for tier:", tier);
      const coursesQuery = query(
        collection(db, "courses"),
        where("tiers", "array-contains", tier)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      console.log("Courses snapshot size:", coursesSnapshot.size);
      
      // Get base course data first
      const coursesPromises = coursesSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // Create base course object
        const courseData: CourseItem = {
            id: doc.id,
            title: data.title || "Untitled Course",
            description: data.description || "No description available",
            thumbnail: data.thumbnail || "/placeholder-thumbnail.jpg",
            lessons: data.lessons || 0,
            date: data.date || new Date().toISOString(),
            completed: data.completed || false,
            tiers: data.tiers || [tier], // Include tiers array
            ...data
        };
        
        // Fetch lessons from top-level collection
        const lessonsData = await fetchCourseLessons(doc.id);
        
        // Update the course with lesson data and lesson count
        if (lessonsData.length > 0) {
          courseData.lessonData = lessonsData;
          courseData.lessons = lessonsData.length; // Update the lesson count to match actual lessons
          courseData.lessonSource = 'collection'; // Mark source of lessons
        } else if (data.lessonData && Array.isArray(data.lessonData)) {
          // Fallback to embedded lessonData if no collection found
          courseData.lessonData = data.lessonData.map((lesson: any) => ({
            id: lesson.id || `lesson-${Math.random().toString(36).substring(2, 9)}`,
            order: typeof lesson.order === 'number' ? lesson.order : 0,
            title: lesson.title || 'Untitled Lesson',
            type: lesson.type === 'pdf' ? 'pdf' : 'video',
            url: lesson.url || '',
            filename: lesson.filename || '',
            duration: typeof lesson.duration === 'number' ? lesson.duration : 0
          })) as CourseLessonData[];
          courseData.lessonSource = 'embedded'; // Mark source of lessons
        }
        
        return courseData;
      });
      
      // Wait for all course data to be processed
      const coursesList = await Promise.all(coursesPromises);

      // Sort courses manually by date (newest first)
      const sortedCourses = [...coursesList].sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      }).slice(0, 3); // Limit to 3 items

      setLatestCourses(sortedCourses);

      // Fetch blogs (still using the old tier field)
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

      // Fetch calls (still using the old tier field)
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
      
      // Fetch knowledge tests (still using the old tier field)
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