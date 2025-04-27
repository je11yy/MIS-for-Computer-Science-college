import React from 'react';
import { getCourseAverageScore } from '../lib/data';

interface CourseStatisticsProps {
  courseId: string;
  courseName: string;
  onClose: () => void;
}

export const CourseStatistics: React.FC<CourseStatisticsProps> = ({ courseId, courseName, onClose }) => {
  const averageScore = getCourseAverageScore(courseId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Course Statistics: {courseName}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ×
          </button>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Overview</h3>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Average Score</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {averageScore.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};