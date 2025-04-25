export interface Student {
    id: string;
    name: string;
    sex: 'male' | 'female';
    entranceAge: number;
    entranceYear: number;
    class: string;
  }
  
  export interface Course {
    id: string;
    name: string;
    teacherId: string;
    credit: number;
    grade: number;
    canceledYear: number | null;
  }
  
  export interface Teacher {
    id: string;
    name: string;
    courses: string[];
  }
  
  export interface CourseChoice {
    studentId: string;
    courseId: string;
    teacherId: string;
    chosenYear: number;
    score: number | null;
  }
  
  export type UserRole = 'student' | 'teacher' | 'admin';
  
  export interface User {
    id: string;
    role: UserRole;
    name: string;
  }