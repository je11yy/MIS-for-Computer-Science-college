import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getTeacherDetails } from '../utils/Fetches';
import type { Course } from '../types';

export const TeacherCourses = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { theme } = useTheme();
  const [teacher, setTeacher] = useState<Course[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeacher = async () => {
    try {
      const data = await getTeacherDetails(id);
      setTeacher(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teacher details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [id]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`bg-white ${theme === 'dark' ? 'dark:bg-neutral-800' : 'bg-white'} rounded-xl p-6 max-w-2xl w-full`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Courses
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-neutral-700">
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Course ID</th>
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Name</th>
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Credit</th>
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Grade</th>
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teacher.map((course) => (
                    <tr key={course.id} className="border-b dark:border-neutral-700">
                      <td className="py-2 text-neutral-900 dark:text-white">{course.id}</td>
                      <td className="py-2 text-neutral-900 dark:text-white">{course.name}</td>
                      <td className="py-2 text-neutral-900 dark:text-white">{course.credit}</td>
                      <td className="py-2 text-neutral-900 dark:text-white">{course.grade}</td>
                      <td className="py-2 text-neutral-900 dark:text-white">
                        {course.canceledYear ? `Canceled in ${course.canceledYear}` : 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};