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
  // Filter out courses with zero credits to prevent calculation issues
  const validCourses = courses.filter(course => course.credits > 0);
  
  if (validCourses.length === 0) {
    return 0;
  }
  
  const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
  const totalPoints = validCourses.reduce((sum, course) => {
    return sum + (course.credits * GRADE_POINTS[course.grade]);
  }, 0);
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
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

export type DegreeClassification = 
  | 'First Class' 
  | 'Second Class Upper' 
  | 'Second Class Lower' 
  | 'Third Class' 
  | 'Pass' 
  | 'Fail' 
  | 'Not Enough Credits';

export const getDegreeClassification = (gpa: number, totalCredits: number): DegreeClassification => {
  // Check if we have enough credits for a classification
  if (totalCredits < 3) {
    return 'Not Enough Credits';
  }

  if (gpa >= 4.5) return 'First Class';
  if (gpa >= 3.5) return 'Second Class Upper';
  if (gpa >= 2.5) return 'Second Class Lower';
  if (gpa >= 2.0) return 'Third Class';
  if (gpa >= 1.5) return 'Pass';
  return 'Fail';
};

export const getClassificationColor = (classification: DegreeClassification): string => {
  switch (classification) {
    case 'First Class':
      return 'text-green-600 dark:text-green-400';
    case 'Second Class Upper':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'Second Class Lower':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'Third Class':
      return 'text-amber-600 dark:text-amber-400';
    case 'Pass':
      return 'text-orange-600 dark:text-orange-400';
    case 'Fail':
      return 'text-red-600 dark:text-red-500';
    case 'Not Enough Credits':
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};
