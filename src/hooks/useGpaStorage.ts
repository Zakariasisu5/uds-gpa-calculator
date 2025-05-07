
import { useState, useEffect } from "react";
import { Course, generateId } from "@/lib/gpaCalculator";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "gpa_calculator_courses";

export function useGpaStorage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load courses from local storage on initial render
  useEffect(() => {
    const savedCourses = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.error("Failed to parse saved courses:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save courses to local storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
    }
  }, [courses, isLoaded]);

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
