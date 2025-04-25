import React, { useState } from 'react';
import { Search, BookPlus, Edit2, Trash2 } from 'lucide-react';
import type { Course } from '../types';

interface CourseListProps {
  courses: Course[];
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.id.includes(searchTerm)
  );

  return (
    <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors shadow-sm hover:shadow">
          <BookPlus className="h-5 w-5 mr-2" />
          Add Course
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-colors"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Teacher ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Credit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-white/50 dark:hover:bg-neutral-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{course.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{course.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{course.teacherId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{course.credit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{course.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.canceledYear 
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200'
                      : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-200'
                  }`}>
                    {course.canceledYear ? `Canceled (${course.canceledYear})` : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit?.(course)}
                      className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete?.(course.id)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};