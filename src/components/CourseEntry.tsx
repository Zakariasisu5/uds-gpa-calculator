
import React, { useState } from "react";
import { Course, Grade, GRADE_OPTIONS } from "@/lib/gpaCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CourseEntryProps {
  course?: Course;
  onSave: (course: Omit<Course, "id">) => void;
  onUpdate?: (id: string, course: Partial<Course>) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
}

export const CourseEntry: React.FC<CourseEntryProps> = ({
  course,
  onSave,
  onUpdate,
  onDelete,
  isNew = false,
}) => {
  const [name, setName] = useState(course?.name || "");
  const [credits, setCredits] = useState(course?.credits || 3);
  const [grade, setGrade] = useState<Grade>(course?.grade || "A");
  const isMobile = useIsMobile();

  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      setCredits(value);
      if (course?.id && onUpdate) {
        onUpdate(course.id, { credits: value });
      }
    }
  };

  const handleGradeChange = (value: Grade) => {
    setGrade(value);
    if (course?.id && onUpdate) {
      onUpdate(course.id, { grade: value });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (course?.id && onUpdate) {
      onUpdate(course.id, { name: e.target.value });
    }
  };

  const handleSave = () => {
    if (name.trim() === "") return;
    
    onSave({
      name,
      credits,
      grade,
    });

    // Reset form if it's a new entry form
    if (isNew) {
      setName("");
      setCredits(3);
      setGrade("A");
    }
  };

  const handleDelete = () => {
    if (course?.id && onDelete) {
      onDelete(course.id);
    }
  };

  return (
    <Card className={`${isNew ? "gpa-gradient" : ""} animate-fade-in`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor={`course-name-${course?.id || "new"}`} className={isNew ? "text-white" : ""}>
              Course Name
            </Label>
            <Input
              id={`course-name-${course?.id || "new"}`}
              placeholder="Enter course name"
              value={name}
              onChange={handleNameChange}
              className={isNew ? "bg-white/10 text-white placeholder:text-white/70 border-white/20" : ""}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`course-credits-${course?.id || "new"}`} className={isNew ? "text-white" : ""}>
                Credits
              </Label>
              <Input
                id={`course-credits-${course?.id || "new"}`}
                type="number"
                min="0"
                step="0.5"
                value={credits}
                onChange={handleCreditsChange}
                className={isNew ? "bg-white/10 text-white placeholder:text-white/70 border-white/20" : ""}
              />
            </div>
            <div>
              <Label htmlFor={`course-grade-${course?.id || "new"}`} className={isNew ? "text-white" : ""}>
                Grade
              </Label>
              <Select value={grade} onValueChange={handleGradeChange as (value: string) => void}>
                <SelectTrigger 
                  id={`course-grade-${course?.id || "new"}`}
                  className={isNew ? "bg-white/10 text-white border-white/20" : ""}
                >
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((gradeOption) => (
                    <SelectItem key={gradeOption} value={gradeOption}>
                      {gradeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className={`flex justify-${isNew ? "center" : "between"} px-4 py-3`}>
        {isNew ? (
          <Button onClick={handleSave} className={isNew ? "bg-white text-gpa-purple hover:bg-white/90" : ""}>
            Add Course
          </Button>
        ) : (
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
