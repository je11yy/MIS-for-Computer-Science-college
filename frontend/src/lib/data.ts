import type { Student, Course, Teacher, CourseChoice } from '../types';

// Mock data store
let students: Student[] = [
  {
    id: "2023000001",
    name: "John Doe",
    sex: "male",
    entranceAge: 18,
    entranceYear: 2023,
    class: "CS-A"
  },
  {
    id: "2023000002",
    name: "Jane Smith",
    sex: "female",
    entranceAge: 19,
    entranceYear: 2023,
    class: "CS-A"
  }
];

let courses: Course[] = [
  {
    id: "CSE1001",
    name: "Introduction to Computer Science",
    teacherId: "T1001",
    credit: 3,
    grade: 1,
    canceledYear: null
  },
  {
    id: "MAT2001",
    name: "Advanced Mathematics",
    teacherId: "T1002",
    credit: 4,
    grade: 2,
    canceledYear: 2024
  }
];

let teachers: Teacher[] = [
  {
    id: "T1001",
    name: "Dr. Robert Brown",
    courses: ["CSE1001"]
  },
  {
    id: "T1002",
    name: "Prof. Sarah Wilson",
    courses: ["MAT2001"]
  }
];

let courseChoices: CourseChoice[] = [
  {
    studentId: "2023000001",
    courseId: "CSE1001",
    teacherId: "T1001",
    chosenYear: 2023,
    score: 85
  }
];

// Helper functions
export const checkEligibility = (studentId: string, courseId: string): boolean => {
  const student = students.find(s => s.id === studentId);
  const course = courses.find(c => c.id === courseId);

  if (!student || !course) {
    return false;
  }

  const currentYear = new Date().getFullYear();
  const studentGrade = currentYear - student.entranceYear + 1;

  return (
    studentGrade > course.grade &&
    (!course.canceledYear || currentYear <= course.canceledYear)
  );
};

// CRUD operations
export const getStudents = () => students;
export const getCourses = () => courses;
export const getTeachers = () => teachers;
export const getCourseChoices = () => courseChoices;

export const addStudent = (student: Student) => {
  students.push(student);
};

export const updateStudent = (student: Student) => {
  students = students.map(s => s.id === student.id ? student : s);
};

export const deleteStudent = (id: string) => {
  students = students.filter(s => s.id !== id);
  // Also delete related course choices
  courseChoices = courseChoices.filter(cc => cc.studentId !== id);
};

export const addCourse = (course: Course) => {
  courses.push(course);
};

export const updateCourse = (course: Course) => {
  courses = courses.map(c => c.id === course.id ? course : c);
};

export const deleteCourse = (id: string) => {
  courses = courses.filter(c => c.id !== id);
};

export const addTeacher = (teacher: Teacher) => {
  teachers.push(teacher);
};

export const updateTeacher = (teacher: Teacher) => {
  teachers = teachers.map(t => t.id === teacher.id ? teacher : t);
};

export const deleteTeacher = (id: string) => {
  teachers = teachers.filter(t => t.id !== id);
};

export const addCourseChoice = (courseChoice: CourseChoice) => {
  courseChoices.push(courseChoice);
};

export const updateCourseChoice = (courseChoice: CourseChoice) => {
  courseChoices = courseChoices.map(cc => 
    cc.studentId === courseChoice.studentId && cc.courseId === courseChoice.courseId
      ? courseChoice
      : cc
  );
};

export const deleteCourseChoice = (studentId: string, courseId: string) => {
  courseChoices = courseChoices.filter(cc => 
    !(cc.studentId === studentId && cc.courseId === courseId)
  );
};

// Query functions
export const getStudentById = (id: string) => students.find(s => s.id === id);
export const getStudentByName = (name: string) => students.find(s => s.name === name);
export const getCourseById = (id: string) => courses.find(c => c.id === id);
export const getCourseByName = (name: string) => courses.find(c => c.name === name);
export const getTeacherById = (id: string) => teachers.find(t => t.id === id);
export const getTeacherByName = (name: string) => teachers.find(t => t.name === name);

// Statistics functions
export const getStudentAverageScore = (studentId: string) => {
  const studentScores = courseChoices.filter(cc => cc.studentId === studentId && cc.score !== null);
  if (studentScores.length === 0) return 0;
  return studentScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / studentScores.length;
};

export const getAllStudentsAverageScore = () => {
  const allScores = courseChoices.filter(cc => cc.score !== null);
  if (allScores.length === 0) return 0;
  return allScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / allScores.length;
};

export const getClassAverageScore = (className: string) => {
  const classStudents = students.filter(s => s.class === className).map(s => s.id);
  const classScores = courseChoices.filter(cc => 
    classStudents.includes(cc.studentId) && cc.score !== null
  );
  if (classScores.length === 0) return 0;
  return classScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / classScores.length;
};

export const getCourseAverageScore = (courseId: string) => {
  const courseScores = courseChoices.filter(cc => cc.courseId === courseId && cc.score !== null);
  if (courseScores.length === 0) return 0;
  return courseScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / courseScores.length;
};