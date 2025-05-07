
export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F';

export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: Grade;
}

export const GRADE_POINTS: Record<Grade, number> = {
  'A+': 5.0,
  'A': 4.5,
  'B+': 4.0,
  'B': 3.5,
  'C+': 3.0,
  'C': 2.5,
  'D+': 2.0,
  'D': 1.5,
  'F': 1.0,
};

export const GRADE_OPTIONS: Grade[] = [
  'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'
];

export const calculateGPA = (courses: Course[]): number => {
  if (courses.length === 0) {
    return 0;
  }
  
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const totalPoints = courses.reduce((sum, course) => {
    return sum + (course.credits * GRADE_POINTS[course.grade]);
  }, 0);
  
  return totalPoints / totalCredits;
};

export const formatGPA = (gpa: number): string => {
  return gpa.toFixed(2);
};

export const getTotalCredits = (courses: Course[]): number => {
  return courses.reduce((sum, course) => sum + course.credits, 0);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
