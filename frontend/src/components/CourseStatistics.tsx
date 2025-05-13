import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getCourseDetails } from '../utils/Fetches';

interface CourseStatisticsProps {
  id: string;
  name: string;
  credit: number;
  grade: number;
  canceledYear: number | null;
  averageScore: number;
}

export const CourseStatistics = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { theme } = useTheme();
  const [course, setCourse] = useState<CourseStatisticsProps>();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const data = await getCourseDetails(id);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
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
      <div
        className={`bg-white ${theme === 'dark' ? 'dark:bg-neutral-800' : 'bg-white'} rounded-xl p-6 max-w-2xl w-full`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Course Statistics: {course?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">Course Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Course ID</p>
                <p className="text-neutral-900 dark:text-white">{course?.id ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Credit</p>
                <p className="text-neutral-900 dark:text-white">{course?.credit ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Grade</p>
                <p className="text-neutral-900 dark:text-white">{course?.grade ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Canceled Year</p>
                <p className="text-neutral-900 dark:text-white">{course?.canceledYear ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Average Score</p>
                <p className="text-neutral-900 dark:text-white">
                  {course?.averageScore?.toFixed(2) ?? 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};