import { useEffect, useState } from 'react';
import { StudentList } from '../components/StudentList';
import { StudentForm } from '../components/StudentForm';
import { StudentDetails } from '../components/StudentDetails';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../utils/Fetches';
import type { Student } from '../types';
import { UserPlus } from 'lucide-react';

export const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleFormSubmit = async (data: Student) => {
    try {
      if (selectedStudent) {
        await updateStudent(data);
      } else {
        await addStudent(data);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Management</h1>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors shadow-sm hover:shadow"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      <StudentList
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
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
          onClose={() => setIsDetailsOpen(false)} />
      )}
    </div>
  );
};