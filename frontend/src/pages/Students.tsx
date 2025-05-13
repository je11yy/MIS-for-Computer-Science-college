import { useEffect, useState } from 'react';
import { StudentList } from '../components/StudentList';
import { StudentForm } from '../components/StudentForm';
import { StudentDetails } from '../components/StudentDetails';
import { StudentCourseManager } from '../components/StudentCourseManager';
import { getStudents, addStudent, updateStudent, deleteStudent, updateCourseChoice } from '../utils/Fetches';
import type { Student } from '../types';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isCourseManagerOpen, setIsCourseManagerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        await fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Student, 'courses'>) => {
    try {
      const studentData: Student = { ...data, courses: [] }; // Add default courses
      if (selectedStudent) {
        await updateStudent(studentData);
      } else {
        await addStudent(studentData);
      }
      await fetchStudents();
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to save student');
    }
  };

  const handleViewDetails = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDetailsOpen(true);
  };

  const handleManageCourses = (student: Student) => {
    setSelectedStudent(student);
    setIsCourseManagerOpen(true);
  };

  const handleCourseManagerSubmit = async (student_id: string, chosenCourses: string[]) => {
    try {
      await updateCourseChoice(student_id, chosenCourses);
      await fetchStudents();
      setIsCourseManagerOpen(false);
    } catch (err) {
      setError('Failed to update student courses');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-solid rounded-full animate-spin 
                border-neutral-500 border-t-transparent 
                dark:border-neutral-200 dark:border-t-transparent">
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
        <span className="font-medium">Error:</span> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user?.role == "admin" && (<div className="flex justify-between items-center">
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>)}

      <StudentList
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        onManageCourses={handleManageCourses}
      />

      {isFormOpen && (
        <StudentForm
          student={selectedStudent || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isDetailsOpen && selectedStudentId && (
        <StudentDetails
          id={selectedStudentId}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}

      {isCourseManagerOpen && selectedStudent && (
        <StudentCourseManager
          student={selectedStudent}
          onSubmit={handleCourseManagerSubmit}
          onClose={() => setIsCourseManagerOpen(false)}
        />
      )}
    </div>
  );
};