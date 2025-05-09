
import { useState, useEffect } from "react";
import { Course, generateId } from "@/lib/gpaCalculator";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const BASE_STORAGE_KEY = "gpa_calculator_courses";

export function useGpaStorage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  
  // Create a user-specific storage key
  const getStorageKey = () => {
    return user ? `${BASE_STORAGE_KEY}_${user.id}` : BASE_STORAGE_KEY;
  };

  // Load courses from local storage on initial render and when user changes
  useEffect(() => {
    const loadCourses = async () => {
      if (user) {
        try {
          // Try to load from Supabase first
          const { data, error } = await supabase
            .from('student_courses')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) {
            console.error("Failed to fetch courses from Supabase:", error);
            // Fallback to local storage
            loadFromLocalStorage();
          } else if (data && data.length > 0) {
            // Convert Supabase format to app format
            const formattedCourses = data.map(item => ({
              id: item.id,
              name: item.title,
              credits: item.credit_hours,
              grade: item.grade as Course['grade']
            }));
            setCourses(formattedCourses);
          } else {
            // No courses in Supabase, check local storage as fallback
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error("Error loading courses:", error);
          loadFromLocalStorage();
        }
      } else {
        // Not logged in, just use local storage
        loadFromLocalStorage();
      }
      
      setIsLoaded(true);
    };
    
    const loadFromLocalStorage = () => {
      const storageKey = getStorageKey();
      const savedCourses = localStorage.getItem(storageKey);
      
      if (savedCourses) {
        try {
          setCourses(JSON.parse(savedCourses));
        } catch (error) {
          console.error("Failed to parse saved courses:", error);
        }
      } else {
        // Reset courses when switching users
        setCourses([]);
      }
    };
    
    loadCourses();
  }, [user]);

  // Save courses to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      const storageKey = getStorageKey();
      
      // Always save to local storage as backup
      localStorage.setItem(storageKey, JSON.stringify(courses));
      
      // If logged in with Supabase, sync to database
      if (user) {
        const syncToSupabase = async () => {
          try {
            // First clear existing courses
            await supabase
              .from('student_courses')
              .delete()
              .eq('user_id', user.id);
              
            // Then insert all current courses
            if (courses.length > 0) {
              // Format courses to match student_courses table structure
              const coursesToInsert = courses.map(course => ({
                id: course.id,
                user_id: user.id,
                title: course.name,
                credit_hours: course.credits,
                grade: course.grade,
                semester_id: 'current', // Add required semester_id field
                code: 'GPA-' + course.id.substring(0, 5), // Add required code field
                year: new Date().getFullYear().toString() // Add optional year field
              }));
              
              const { error } = await supabase
                .from('student_courses')
                .insert(coursesToInsert);
                
              if (error) {
                console.error("Failed to sync courses to Supabase:", error);
              }
            }
          } catch (error) {
            console.error("Error syncing to Supabase:", error);
          }
        };
        
        syncToSupabase();
      }
    }
  }, [courses, isLoaded, user]);

  const addCourse = (course: Omit<Course, "id">) => {
    const newCourse = { ...course, id: generateId() };
    setCourses([...courses, newCourse]);
    toast.success("Course added successfully");
    return newCourse;
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, ...updatedCourse } : course
      )
    );
    toast.success("Course updated successfully");
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
    toast.success("Course removed successfully");
  };

  const clearAllCourses = () => {
    setCourses([]);
    toast.success("All courses cleared");
  };

  return {
    courses,
    addCourse,
    updateCourse,
    removeCourse,
    clearAllCourses,
  };
}
