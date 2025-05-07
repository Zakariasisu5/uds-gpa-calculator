
import React from "react";
import { Course, calculateGPA, formatGPA, getTotalCredits } from "@/lib/gpaCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GpaSummaryProps {
  courses: Course[];
  onClear: () => void;
}

export const GpaSummary: React.FC<GpaSummaryProps> = ({ courses, onClear }) => {
  const gpa = calculateGPA(courses);
  const formattedGPA = formatGPA(gpa);
  const totalCredits = getTotalCredits(courses);
  
  // Calculate progress percentage for the progress bar (0-5.0 scale)
  const progressPercentage = Math.min((gpa / 5.0) * 100, 100);
  
  // Determine color based on GPA
  const getGpaColor = () => {
    if (gpa >= 4.5) return "bg-green-500";
    if (gpa >= 4.0) return "bg-green-400";
    if (gpa >= 3.5) return "bg-green-300";
    if (gpa >= 3.0) return "bg-yellow-400";
    if (gpa >= 2.5) return "bg-yellow-300";
    if (gpa >= 2.0) return "bg-orange-400";
    if (gpa >= 1.5) return "bg-orange-300";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">GPA Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold bg-gradient-to-r from-gpa-purple to-gpa-dark-purple bg-clip-text text-transparent">
            {formattedGPA}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Current GPA
          </div>
        </div>

        <div className="relative pt-3">
          <div className="text-xs font-semibold mb-1 flex justify-between">
            <span>0.0</span>
            <span>5.0</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-gpa-light-blue/40 dark:bg-gpa-light-blue/20 rounded-lg">
            <div className="text-2xl font-bold">{courses.length}</div>
            <div className="text-xs text-muted-foreground">Courses</div>
          </div>
          <div className="text-center p-3 bg-gpa-soft-green/40 dark:bg-gpa-soft-green/20 rounded-lg">
            <div className="text-2xl font-bold">{totalCredits}</div>
            <div className="text-xs text-muted-foreground">Credits</div>
          </div>
        </div>

        {courses.length > 0 && (
          <button 
            onClick={onClear}
            className="w-full mt-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear All Courses
          </button>
        )}
      </CardContent>
    </Card>
  );
};
