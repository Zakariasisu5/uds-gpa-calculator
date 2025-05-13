
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface GpaSummaryProps {
  courses: Course[];
  onClear: () => void;
  cgpa?: number | null; // Optional CGPA value
  allCredits?: number; // Total credits across all semesters
}

export const GpaSummary: React.FC<GpaSummaryProps> = ({ 
  courses, 
  onClear, 
  cgpa = null,
  allCredits = 0 
}) => {
  const gpa = calculateGPA(courses);
  const formattedGPA = formatGPA(gpa);
  const trimesterCredits = getTotalCredits(courses);
  
  // Format CGPA if available, otherwise calculate from current courses
  const formattedCGPA = cgpa !== null ? formatGPA(cgpa) : formattedGPA;
  
  // Classifications
  const trimesterClassification = getDegreeClassification(gpa, trimesterCredits, false);
  const trimesterClassColor = getClassificationColor(trimesterClassification);
  
  // CGPA classification (only if we have credits data)
  const cgpaClassification = cgpa !== null 
    ? getDegreeClassification(cgpa, allCredits, true)
    : getDegreeClassification(gpa, trimesterCredits, true);
  const cgpaClassColor = getClassificationColor(cgpaClassification);
  
  // Calculate progress percentage for the progress bar (0-5.0 scale)
  const progressPercentage = Math.min((gpa / 5.0) * 100, 100);
  const cgpaProgressPercentage = cgpa !== null ? Math.min((cgpa / 5.0) * 100, 100) : progressPercentage;
  
  // Check if credit requirement is met
  const hasMinimumTrimesterCredits = trimesterCredits >= 3;
  const hasMinimumCGPACredits = allCredits >= 3;

  // Determine which tab to show by default (show CGPA if it's available)
  const defaultTab = "cgpa";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">GPA Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="trimester">Trimester GPA</TabsTrigger>
            <TabsTrigger value="cgpa">CGPA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trimester" className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-gpa-purple to-gpa-dark-purple bg-clip-text text-transparent">
                {formattedGPA}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Current Trimester GPA
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
              <div className="flex items-center justify-center gap-1">
                <div className={`text-2xl font-semibold ${trimesterClassColor}`}>
                  {trimesterClassification}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <p>This shows an equivalent classification based on your current trimester GPA only. Your degree classification is determined by your final CGPA.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Trimester Performance
                <p className="text-xs text-muted-foreground italic mt-1">
                  (Equivalent Classification)
                </p>
                {!hasMinimumTrimesterCredits && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    (Minimum 3 credit hours required)
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-gpa-light-blue/40 dark:bg-gpa-light-blue/20 rounded-lg">
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-xs text-muted-foreground">Courses</div>
              </div>
              <div className="text-center p-3 bg-gpa-soft-green/40 dark:bg-gpa-soft-green/20 rounded-lg">
                <div className="text-2xl font-bold">{trimesterCredits}</div>
                <div className="text-xs text-muted-foreground">Credits</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cgpa" className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-gpa-soft-green to-gpa-dark-green bg-clip-text text-transparent">
                {formattedCGPA}
              </div>
              <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <span>Cumulative GPA</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[220px]">
                      <p>Your CGPA combines all courses across all trimesters/semesters and determines your final degree classification.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="relative pt-3">
              <div className="text-xs font-semibold mb-1 flex justify-between">
                <span>0.0</span>
                <span>5.0</span>
              </div>
              <Progress value={cgpaProgressPercentage} className="h-2" />
            </div>

            <div className="text-center border border-border rounded-lg p-4 bg-muted/30 shadow-sm">
              <div className={`text-2xl font-semibold ${cgpaClassColor}`}>
                {cgpaClassification}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <div className="font-semibold">Degree Classification</div>
                {!hasMinimumCGPACredits && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    (Minimum 3 credit hours required)
                  </p>
                )}
                {cgpa === null && !courses.length && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    (Add courses to calculate your CGPA)
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              <div className="text-center p-3 bg-gpa-soft-green/40 dark:bg-gpa-soft-green/20 rounded-lg">
                <div className="text-2xl font-bold">{allCredits || trimesterCredits}</div>
                <div className="text-xs text-muted-foreground">Total Credits</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
