
import React from "react";
import { useGpaStorage } from "@/hooks/useGpaStorage";
import { CourseEntry } from "@/components/CourseEntry";
import { GpaSummary } from "@/components/GpaSummary";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const { courses, addCourse, updateCourse, removeCourse, clearAllCourses } = useGpaStorage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <header className="gpa-gradient py-6 mb-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">GPA Calculator</h1>
          <p className="text-center text-white/80 mt-2">
            Track and calculate your grade point average
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: GPA Summary */}
          <div className="lg:col-span-1">
            <GpaSummary courses={courses} onClear={clearAllCourses} />
          </div>
          
          {/* Right side: Course entries */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-6">
              <CourseEntry onSave={addCourse} isNew={true} />
            </div>
            
            {courses.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-500">No courses added yet. Add your first course above!</p>
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
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} GPA Preview Pal | Build with Lovable
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
