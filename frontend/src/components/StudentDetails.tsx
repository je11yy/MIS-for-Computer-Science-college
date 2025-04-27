import { useTheme } from '../context/ThemeContext'; // Импортируем хук useTheme
import { useEffect, useState } from 'react';
import { getStudentDetails } from '../utils/Fetches';
import { ChosenCourse } from '../types';

interface StudentDetailsProps {
  id: string;
  name: string;
  sex: string;
  entranceAge: number;
  entranceYear: number;
  studentClass: string;
  averageScore: number;
  courses: ChosenCourse[];
}

export const StudentDetails = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { theme } = useTheme(); // Получаем текущую тему
  const [studentInfo, setStudentInfo] = useState<StudentDetailsProps>();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudent = async () => {
    try {
      const data = await getStudentDetails(id);
      setStudentInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4`}>
      <div
        className={`bg-white ${theme === 'dark' ? 'dark:bg-neutral-800' : 'bg-white'} rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Student Information</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Name</p>
                <p className="text-neutral-900 dark:text-white">{studentInfo?.name ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">ID</p>
                <p className="text-neutral-900 dark:text-white">{studentInfo?.id ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Class</p>
                <p className="text-neutral-900 dark:text-white">{studentInfo?.studentClass ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Average Score</p>
                <p className="text-neutral-900 dark:text-white">{studentInfo?.averageScore?.toFixed(2) ?? 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">Courses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-neutral-700">
                    <th className="text-left py-2 text-neutral-900 dark:text-white">ID</th>
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Name</th>
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Credit</th>
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Chosen Year</th>
                    <th className="text-left py-2 text-neutral-900 dark:text-white">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {studentInfo?.courses?.map((course: ChosenCourse) => (
                    <tr key={course.id} className="border-b dark:border-neutral-700">
                      <td className="py-2 text-neutral-900 dark:text-white">{course.id}</td>
                      <td className="py-2 text-neutral-900 dark:text-white">{course.name}</td>
                      <td className="py-2 text-neutral-900 dark:text-white">{course.credit}</td>
                      <td className="py-2 text-neutral-900 dark:text-white">{course.chosenYear}</td>
                      <td className="py-2 text-neutral-900 dark:text-white">{course.score ?? 'Not graded'}</td>
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
