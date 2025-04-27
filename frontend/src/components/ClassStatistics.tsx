import React from 'react';
import { getClassInfo } from '../lib/data';

interface ClassStatisticsProps {
  className: string;
  onClose: () => void;
}

export const ClassStatistics: React.FC<ClassStatisticsProps> = ({ className, onClose }) => {
  const classInfo = getClassInfo(className);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Class Statistics: {className}
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
            <h3 className="text-lg font-semibold mb-3">Overview</h3>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Average Score</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {classInfo.averageScore.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Students</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-neutral-700">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Entrance Year</th>
                  </tr>
                </thead>
                <tbody>
                  {classInfo.students.map((student) => (
                    <tr key={student.id} className="border-b dark:border-neutral-700">
                      <td className="py-2">{student.id}</td>
                      <td className="py-2">{student.name}</td>
                      <td className="py-2">{student.entranceYear}</td>
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