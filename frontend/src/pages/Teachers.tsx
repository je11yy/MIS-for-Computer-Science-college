import { useEffect, useState } from 'react';
import { TeacherList } from '../components/TeacherList';
import { TeacherForm } from '../components/TeacherForm';
import { TeacherCourseManager } from '../components/TeacherCourseManager';
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from '../utils/Fetches';
import type { Teacher } from '../types';
import { UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseManagerOpen, setIsCourseManagerOpen] = useState(false);
  const { user } = useAuth();

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teachers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleManageCourses = (teacher: Teacher) => {
      setSelectedTeacher(teacher);
      setIsCourseManagerOpen(true);
    };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  };

  const handleCourseManagerSubmit = async (data: Teacher) => {
      try {
        await updateTeacher(data);
        await fetchTeachers();
        setIsCourseManagerOpen(false);
      } catch (err) {
        setError('Failed to update teacher courses');
      }
    };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(id);
        await fetchTeachers();
      } catch (err) {
        setError('Failed to delete teacher');
      }
    }
  };

  const handleFormSubmit = async (data: Teacher) => {
    try {
      if (selectedTeacher) {
        await updateTeacher(data);
      } else {
        await addTeacher(data);
      }
      await fetchTeachers();
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to save teacher');
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
          <UserCog className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>)}

      <TeacherList
        teachers={teachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageCourses={handleManageCourses}
      />

      {isFormOpen && (
        <TeacherForm
          teacher={selectedTeacher || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isCourseManagerOpen && selectedTeacher && (
        <TeacherCourseManager
          teacher={selectedTeacher}
          onSubmit={handleCourseManagerSubmit}
          onClose={() => setIsCourseManagerOpen(false)}
        />
      )}
    </div>
  );
};