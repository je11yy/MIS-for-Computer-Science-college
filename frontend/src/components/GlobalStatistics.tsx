import React from 'react';
import { getAllStudentsAverageScore } from '../lib/data';

interface GlobalStatisticsProps {
  onClose: () => void;
}

export const GlobalStatistics: React.FC<GlobalStatisticsProps> = ({ onClose }) => {
  const averageScore = getAllStudentsAverageScore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Global Statistics
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
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Average Score (All Students)</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {averageScore.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};