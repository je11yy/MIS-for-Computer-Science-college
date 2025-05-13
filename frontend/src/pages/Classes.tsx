import { useEffect, useState } from 'react';
import { ClassList } from '../components/ClassList';
import { StudentList } from '../components/StudentList';
import { getStudents } from '../utils/Fetches';
import type { Student } from '../types';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

export const ClassesPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);

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

  const handleViewStudents = (className: string) => {
    setSelectedClass(className);
    setIsStudentsOpen(true);
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

  const classStudents = selectedClass
    ? students.filter(student => student.studentClass === selectedClass)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to="/students"
          className="inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
        >
          <Users className="h-4 w-4 mr-2" />
          View All Students
        </Link>
      </div>

      <ClassList
        students={students}
        onViewStudents={handleViewStudents}
      />

      {isStudentsOpen && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Students in {selectedClass}
              </h2>
              <button
                onClick={() => setIsStudentsOpen(false)}
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 text-2xl"
              >
                ×
              </button>
            </div>
            <StudentList students={classStudents} />
          </div>
        </div>
      )}
    </div>
  );
};