import type { Student, Course, CourseChoice, Teacher, ChosenCourse, StudentWithScore } from '../types';

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
  return data;
};

export const getStudentsByCourse = async (courseId: string): Promise<StudentWithScore[]> => {
  const response = await fetch(`${API_URL}/courses/${courseId}/students`);
  const data = await handleResponse(response);
  return data;
};

export const addStudent = async (student: Student): Promise<void> => {
  const response = await fetch(`${API_URL}/students/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to add student');
  }
};

export const updateStudent = async (student: Student): Promise<void> => {
  const response = await fetch(`${API_URL}/students/${student.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update student');
  }
};

export const deleteStudent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete student');
  }
};

export const getStudentDetails = async (id: string) => {
  const response = await fetch(`${API_URL}/students/${id}`);
  const data = await handleResponse(response);
  return data;
};

// Teachers API
export const getTeachers = async (): Promise<Teacher[]> => {
  const response = await fetch(`${API_URL}/teachers`);
  const data = await handleResponse(response);
  return data;
};

export const addTeacher = async (teacher: Teacher): Promise<void> => {
  const response = await fetch(`${API_URL}/teachers/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacher)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to add teacher');
  }
};

export const updateTeacher = async (teacher: Teacher): Promise<void> => {
  const response = await fetch(`${API_URL}/teachers/${teacher.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacher)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update student');
  }
};

export const deleteTeacher = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/teachers/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete teacher');
  }
};

export const getTeacherDetails = async (id: string) => {
  const response = await fetch(`${API_URL}/teachers/${id}`);
  const data = await handleResponse(response);
  return data;
};

export const getTeacherInfo = async (id: string) => {
  const response = await fetch(`${API_URL}/teachers/details/${id}`);
  const data = await handleResponse(response);
  return data;
};

// Courses API
export const getCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${API_URL}/courses`);
  const data = await handleResponse(response);
  return data;
};

export const addCourse = async (course: Course): Promise<void> => {
  const response = await fetch(`${API_URL}/courses/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to add course');
  }
};

export const updateCourse = async (course: Course): Promise<void> => {
  const response = await fetch(`${API_URL}/courses/${course.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update student');
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete course');
  }
};

export const getCourseDetails = async (id: string) => {
  const response = await fetch(`${API_URL}/courses/${id}`);
  const data = await handleResponse(response);
  return data;
};

// Course Choices API
export const addCourseChoice = async (courseChoice: CourseChoice): Promise<CourseChoice> => {
  const response = await fetch(`${API_URL}/course-choices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseChoice)
  });
  const data = await handleResponse(response);
  return data;
};

export const updateCourseChoice = async (student_id: string, courseChoice: string[]): Promise<void> => {
  const response = await fetch(`${API_URL}/students/course-choice/${student_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseChoice)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete course');
  }
};

export const updateCourseScore = async (studentId: string, courseId: string, score: number): Promise<void> => {
  const response = await fetch(`${API_URL}/students/course-choice/${studentId}/${courseId}/${score}`, {
    method: 'PUT'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update course score');
  }
};

export const getChosenCourses = async (studentId: string): Promise<ChosenCourse[]> => {
  const response = await fetch(`${API_URL}/students/course-choice/${studentId}`);
  const data = await handleResponse(response);
  return data;
};

// Statistics API
export const getClassStatistics = async (className: string) => {
  const response = await fetch(`${API_URL}/statistics/class/${className}`);
  const data = await handleResponse(response);
  return data;
};

export const getCourseStatistics = async (courseId: string) => {
  const response = await fetch(`${API_URL}/statistics/course/${courseId}`);
  const data = await handleResponse(response);
  return data;
};

export const getGlobalStatistics = async () => {
  const response = await fetch(`${API_URL}/statistics`);
  const data = await handleResponse(response);
  return data;
};

export const getAverageScore = async (className: string): Promise<number> => {
  const response = await fetch(`${API_URL}/class/${className}`);
  const data = await handleResponse(response);
  return data;
}

export const login = async (username: string, password: string): Promise<{ token: string }> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }

  return response.json();
}

export const register = async (username: string, password: string, student_id: string, teacher_id: string): Promise<void> => {
  let role = student_id ? 'student' : 'teacher';
  if (role == "teacher" && !teacher_id) {
    role = 'admin';
  }
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role, student_id, teacher_id })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed');
  }
};