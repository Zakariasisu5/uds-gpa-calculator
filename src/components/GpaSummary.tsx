
import React from "react";
import { 
  Course, 
  calculateGPA, 
  formatGPA, 
  getTotalCredits,
  getDegreeClassification,
  getClassificationColor
} from "@/lib/gpaCalculator";
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
  const classification = getDegreeClassification(gpa, totalCredits);
  const classificationColor = getClassificationColor(classification);
  
  // Calculate progress percentage for the progress bar (0-5.0 scale)
  const progressPercentage = Math.min((gpa / 5.0) * 100, 100);

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

        {/* Degree Classification - Enhanced display */}
        <div className="text-center border border-border rounded-lg p-4 bg-muted/30 shadow-sm">
          <div className={`text-2xl font-semibold ${classificationColor}`}>
            {classification}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Degree Classification
          </div>
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
