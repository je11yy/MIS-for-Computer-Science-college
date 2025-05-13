import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import { getStudentDetails } from '../utils/Fetches';

interface StudentDetailsProps {
  id: string;
  name: string;
  sex: string;
  entranceAge: number;
  entranceYear: number;
  studentClass: string;
  averageScore: number;
}

export const StudentDetails = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { theme } = useTheme();
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
        </div>
      </div>
    </div>
  );
};