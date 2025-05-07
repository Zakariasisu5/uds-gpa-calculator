
import { useState, useEffect } from "react";
import { Course, generateId } from "@/lib/gpaCalculator";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

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
    
    setIsLoaded(true);
  }, [user]);

  // Save courses to local storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(courses));
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
