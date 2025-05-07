
import React from "react";
import { Link } from "react-router-dom";
import { useGpaStorage } from "@/hooks/useGpaStorage";
import { CourseEntry } from "@/components/CourseEntry";
import { GpaSummary } from "@/components/GpaSummary";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { courses, addCourse, updateCourse, removeCourse, clearAllCourses } = useGpaStorage();
  const isMobile = useIsMobile();

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
            <Link to="/about">
              <Button variant="ghost" size="icon" className="rounded-full text-white" aria-label="About">
                <Info className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: GPA Summary */}
          <div className={`${isMobile ? "order-1" : "lg:col-span-1"}`}>
            <GpaSummary courses={courses} onClear={clearAllCourses} />
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
