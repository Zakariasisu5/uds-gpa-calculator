
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGpaStorage } from "@/hooks/useGpaStorage";
import { CourseEntry } from "@/components/CourseEntry";
import { GpaSummary } from "@/components/GpaSummary";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Course, GRADE_POINTS } from "@/lib/gpaCalculator";
import { toast } from "sonner";

const Index = () => {
  const { courses, addCourse, updateCourse, removeCourse, clearAllCourses } = useGpaStorage();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load historical courses to calculate CGPA when component mounts or user changes
  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!user) {
        // Clear CGPA for non-logged in users
        setCgpa(null);
        setTotalCredits(0);
        return;
      }

      setIsLoading(true);
      try {
        // Get all courses for this user to calculate CGPA
        const { data: historicalCourses, error } = await supabase
          .from('student_courses')
          .select('credit_hours, grade')
          .eq('user_id', user.id);
        
        if (error) {
          console.error("Error fetching historical courses:", error);
          toast.error("Failed to load your course history");
          return;
        }

        // If we have historical data, calculate CGPA
        if (historicalCourses && historicalCourses.length > 0) {
          let totalPoints = 0;
          let totalCreditHours = 0;
          
          // Calculate using GPA formula
          historicalCourses.forEach(course => {
            const credits = course.credit_hours || 0;
            if (credits > 0 && course.grade) {
              // Convert grade string to our Grade type and get points
              const gradePoints = getGradePoints(course.grade);
              totalPoints += credits * gradePoints;
              totalCreditHours += credits;
            }
          });
          
          // Set CGPA and total credits
          if (totalCreditHours > 0) {
            setCgpa(totalPoints / totalCreditHours);
            setTotalCredits(totalCreditHours);
          } else {
            setCgpa(0);
            setTotalCredits(0);
          }
        } else {
          // No historical data, just use current courses for CGPA
          if (courses.length > 0) {
            let totalPoints = 0;
            let totalCreditHours = 0;
            
            courses.forEach(course => {
              const credits = course.credits || 0;
              if (credits > 0) {
                totalPoints += credits * GRADE_POINTS[course.grade];
                totalCreditHours += credits;
              }
            });
            
            if (totalCreditHours > 0) {
              setCgpa(totalPoints / totalCreditHours);
              setTotalCredits(totalCreditHours);
            } else {
              setCgpa(0);
              setTotalCredits(0);
            }
          } else {
            setCgpa(0);
            setTotalCredits(0);
          }
        }
      } catch (error) {
        console.error("Failed to calculate CGPA:", error);
        toast.error("Failed to calculate your CGPA");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistoricalData();
  }, [user, courses]); // Recalculate when courses or user changes

  // Helper function to convert grade string to grade points
  const getGradePoints = (grade: string): number => {
    const gradeMap: Record<string, number> = {
      'A+': 5.0, 'A': 4.5, 'B+': 4.0, 'B': 3.5, 'C+': 3.0,
      'C': 2.5, 'D+': 2.0, 'D': 1.5, 'F': 1.0
    };
    
    return gradeMap[grade] || 0;
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Toaster position="top-center" />
      
      <header className="gpa-gradient py-6 mb-6 shadow-md relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-center">UDS GPA Calculator</h1>
            <p className="text-center text-white/80 mt-2">
              Track and calculate your grade point average
            </p>
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center mr-2">
                <span className="text-white text-sm mr-2">Hello, {user.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-white" 
                  aria-label="Logout"
                  onClick={logout}
                >
                  <LogOut className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
            )}
            <Link to="/about">
              <Button variant="ghost" size="icon" className="rounded-full text-white" aria-label="About">
                <Info className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Mobile user info bar */}
      {user && isMobile && (
        <div className="container mx-auto px-4 mb-4 flex items-center justify-between bg-card rounded-lg p-2">
          <span>Hello, {user.name}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      )}
      
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: GPA Summary */}
          <div className={`${isMobile ? "order-1" : "lg:col-span-1"}`}>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your CGPA...</p>
                </div>
              </div>
            ) : (
              <GpaSummary 
                courses={courses} 
                onClear={clearAllCourses} 
                cgpa={cgpa} 
                allCredits={totalCredits}
              />
            )}
          </div>
          
          {/* Right side: Course entries */}
          <div className={`${isMobile ? "order-0" : "lg:col-span-2"} space-y-6 mb-6`}>
            <div className="mb-6">
              <CourseEntry onSave={addCourse} isNew={true} />
            </div>
            
            {courses.length === 0 ? (
              <div className="text-center p-8 bg-card rounded-lg shadow-sm border border-border">
                <p className="text-muted-foreground">No courses added yet. Add your first course above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Courses</h2>
                {courses.map((course) => (
                  <CourseEntry
                    key={course.id}
                    course={course}
                    onSave={addCourse}
                    onUpdate={updateCourse}
                    onDelete={removeCourse}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} UDS GPA Calculator
          </p>
          <Link to="/about" className="text-sm text-primary hover:underline">
            About
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
