import React, { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import type { Student } from '../types';
import { getAverageScore } from '../utils/Fetches';

interface ClassListProps {
  students: Student[];
  onViewStudents: (className: string) => void;
}

export const ClassList: React.FC<ClassListProps> = ({
  students,
  onViewStudents
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [averageScores, setAverageScores] = useState<Record<string, number>>({});
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Получить уникальные классы
  const classes = Array.from(new Set(students.map(student => student.studentClass)));
  const filteredClasses = classes.filter(className =>
    className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Загружаем средний балл для каждого класса
  useEffect(() => {
    const fetchAverages = async () => {
      const scores: Record<string, number> = {};
      await Promise.all(classes.map(async (className) => {
        try {
          const avg = await getAverageScore(className);
          scores[className] = avg;
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch students');
          scores[className] = 0;
        } finally {
          setIsLoading(false);
        }
      }));
      setAverageScores(scores);
    };

    fetchAverages();
  }, [students]);

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
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search classes..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((className) => {
            const classStudents = students.filter(student => student.studentClass === className);
            const average = averageScores[className];

            return (
              <div
                key={className}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-700 dark:hover:border-neutral-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                      {className}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {classStudents.length} student{classStudents.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      Avg. score: {average !== undefined ? average.toFixed(2) : '...'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewStudents(className)}
                    className="flex items-center justify-center flex-1 px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Students
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
