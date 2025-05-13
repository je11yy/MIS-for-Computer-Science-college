export interface Student {
  id: string;
  name: string;
  sex: string;
  entranceAge: number;
  entranceYear: number;
  studentClass: string;
  courses: ChosenCourse[];
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
  courses: Course[];
}

export interface CoursesByTeacher {
  courses: Course[];
}

export interface ChosenCourse extends Course {
  chosenYear: number;
  score: number | null;
}

export interface CourseChoice {
  studentId: string;
  courseId: string;
  chosenYear: number;
  score: number | null;
}

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  role: UserRole;
  name: string;
  student_id?: string;
  teacher_id?: string;
}

export interface ClassInfo {
  className: string;
  students: Student[];
  averageScore: number;
}

export interface StudentWithScore extends Student {
  score: number | null;
}
