export interface Student {
  id: string;
  name: string;
  sex: string;
  entranceAge: number;
  entranceYear: number;
  studentClass: string;
}

export interface Course {
  id: string;
  name: string;
  credit: number;
  grade: number;
  canceledYear: number | null;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface CourseChoice {
  studentId: string;
  courseId: string;
  chosenYear: number;
  score: number | null;
}

export interface ChosenCourse {
  id: string;
  name: string;
  credit: number;
  chosenYear: number;
  score: number | null;
}

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
}