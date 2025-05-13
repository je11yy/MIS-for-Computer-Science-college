import React, { useEffect, useState } from 'react';
import { Search, Edit2 } from 'lucide-react';
import { getStudentsByCourse, updateCourseScore } from '../utils/Fetches';
import type { StudentWithScore } from '../types';

interface TeacherCourseStudentsProps {
  courseId: string;
  courseName: string;
  onClose: () => void;
}

export const TeacherCourseStudents: React.FC<TeacherCourseStudentsProps> = ({
  courseId,
  courseName,
  onClose
}) => {
  const [students, setStudents] = useState<StudentWithScore[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingScore, setEditingScore] = useState<{ studentId: string; score: string } | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsByCourse(courseId);
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch students');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const handleScoreChange = async (studentId: string) => {
    if (!editingScore) return;
    
    const score = parseFloat(editingScore.score);
    if (isNaN(score) || score < 0 || score > 100) {
      setError('Score must be between 0 and 100');
      return;
    }

    try {
      await updateCourseScore(studentId, courseId, score);
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId ? { ...student, score } : student
        )
      );
      setEditingScore(null);
      setError('');
    } catch (err) {
      setError('Failed to update score');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.includes(searchTerm)
  );

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Students in {courseName}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-neutral-200 dark:border-neutral-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                    {editingScore?.studentId === student.id ? (
                      <input
                        type="number"
                        value={editingScore.score}
                        onChange={(e) => setEditingScore({ studentId: student.id, score: e.target.value })}
                        onBlur={() => handleScoreChange(student.id)}
                        className="w-20 px-2 py-1 border rounded"
                        min="0"
                        max="100"
                      />
                    ) : (
                      <span>{student.score ?? 'Not graded'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                    <button
                      onClick={() => setEditingScore({ studentId: student.id, score: student.score?.toString() || '' })}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};