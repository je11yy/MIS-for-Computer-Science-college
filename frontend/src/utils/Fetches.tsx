import type { Student, Course, CourseChoice } from '../types';

// Base API URL
const API_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! status: ${response.status}`
    }));
    throw new Error(errorData.detail || 'API request failed');
  }
  return response.json();
};

// Students API
export const getStudents = async (): Promise<Student[]> => {
  const response = await fetch(`${API_URL}/students`);
  const data = await handleResponse(response);
  return data.students;
};

export const addStudent = async (student: Student): Promise<Student> => {
  const response = await fetch(`${API_URL}/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  const data = await handleResponse(response);
  return data.student;
};

export const updateStudent = async (student: Student): Promise<Student> => {
  const response = await fetch(`${API_URL}/students/${student.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  const data = await handleResponse(response);
  return data.student;
};

export const deleteStudent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE'
  });
  await handleResponse(response);
};

export const getStudentDetails = async (id: string) => {
  const response = await fetch(`${API_URL}/students/${id}`);
  const data = await handleResponse(response);
  return data.student;
};

// Courses API
export const getCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${API_URL}/courses`);
  const data = await handleResponse(response);
  return data.courses;
};

export const addCourse = async (course: Course): Promise<Course> => {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  const data = await handleResponse(response);
  return data.course;
};

export const updateCourse = async (course: Course): Promise<Course> => {
  const response = await fetch(`${API_URL}/courses/${course.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  const data = await handleResponse(response);
  return data.course;
};

export const deleteCourse = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'DELETE'
  });
  await handleResponse(response);
};

export const getCourseDetails = async (id: string) => {
  const response = await fetch(`${API_URL}/courses/${id}/details`);
  const data = await handleResponse(response);
  return data.details;
};

// Course Choices API
export const addCourseChoice = async (courseChoice: CourseChoice): Promise<CourseChoice> => {
  const response = await fetch(`${API_URL}/course-choices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseChoice)
  });
  const data = await handleResponse(response);
  return data.courseChoice;
};

export const updateCourseChoice = async (courseChoice: CourseChoice): Promise<CourseChoice> => {
  const response = await fetch(`${API_URL}/course-choices`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseChoice)
  });
  const data = await handleResponse(response);
  return data.courseChoice;
};

// Statistics API
export const getClassStatistics = async (className: string) => {
  const response = await fetch(`${API_URL}/statistics/class/${className}`);
  const data = await handleResponse(response);
  return data.statistics;
};

export const getCourseStatistics = async (courseId: string) => {
  const response = await fetch(`${API_URL}/statistics/course/${courseId}`);
  const data = await handleResponse(response);
  return data.statistics;
};

export const getGlobalStatistics = async () => {
  const response = await fetch(`${API_URL}/statistics/global`);
  const data = await handleResponse(response);
  return data.statistics;
};