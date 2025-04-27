import type { Student, Course, CourseChoice } from '../types';


export const addStudent = (student: Student, students: Student[]) => {
  // TODO
};

export const updateStudent = (student: Student, students: Student[]) => {
  // TODO
};

export const deleteStudent = (id: string, students: Student[]) => {
  // TODO
};

export const addCourse = (course: Course) => {
  // TODO
};

export const updateCourse = (course: Course) => {
  // TODO
};

export const deleteCourse = (id: string) => {
  // TODO
};

export const addCourseChoice = (courseChoice: CourseChoice) => {
  // TODO
};

export const updateCourseChoice = (courseChoice: CourseChoice) => {
  // TODO
};

export const deleteCourseChoice = (studentId: string, courseId: string) => {
  // TODO
};

// Statistics and Info functions
// export const getStudentInfo = (studentId: string, students: Student[]) => {
//   const student = students.find(s => s.id === studentId);
//   if (!student) {
//     console.log(`Student with id ${studentId} not found.`);
//     return null;
//   }

//   // const studentCourses = courseChoices.filter(cc => cc.studentId === studentId);
//   // const averageScore = getStudentAverageScore(studentId);

//   return {
//     personalInfo: student,
//     // courses: studentCourses.map(cc => ({
//     //   ...courses.find(c => c.id === cc.courseId),
//     //   score: cc.score,
//     //   chosenYear: cc.chosenYear
//     // })),
//     // averageScore
//   };
// };

export const getClassInfo = (className: string) => {
  // TODO
};

export const getStudentAverageScore = (studentId: string) => {
  // TODO
};

export const getClassAverageScore = (className: string) => {
  // TODO
};

export const getAllStudentsAverageScore = () => {
  // TODO
};

export const getCourseAverageScore = (courseId: string) => {
  // TODO
};