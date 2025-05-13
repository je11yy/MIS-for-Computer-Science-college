import React, { useState } from 'react';
import { Search, Edit2, Trash2, FileText, BookPlus } from 'lucide-react';
import type { Student } from '../types';
import { useAuth } from '../context/AuthContext';

interface StudentListProps {
  students: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (studentId: string) => void;
  onManageCourses?: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onEdit,
  onDelete,
  onViewDetails,
  onManageCourses
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.includes(searchTerm)
  );

  return (
    <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Sex</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Entrance year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Entrance Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Class</th>
              {(onEdit || onDelete || onViewDetails || onManageCourses) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-white/50 dark:hover:bg-neutral-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{student.sex}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{student.entranceYear}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{student.entranceAge}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{student.studentClass}</td>
                {(onEdit || onDelete || onViewDetails || onManageCourses) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                    <div className="flex space-x-2">
                      {user?.role == "admin" && onEdit && (
                        <button
                          onClick={() => onEdit(student)}
                          className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors"
                          title="Edit student"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                      )}
                      {user?.role == "admin" && onDelete && (
                        <button
                          onClick={() => onDelete(student.id)}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                          title="Delete student"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(student.id)}
                          className="text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
                          title="View details"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                      )}
                      {user?.role == "admin" && onManageCourses && (
                        <button
                          onClick={() => onManageCourses(student)}
                          className="text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
                          title="Manage courses"
                        >
                          <BookPlus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};