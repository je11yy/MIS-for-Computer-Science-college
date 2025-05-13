import React, { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Course, ChosenCourse, Teacher } from '../types';
import { getCourses, getTeacherDetails } from '../utils/Fetches';

interface TeacherCourseManagerProps {
  teacher: Teacher;
  onSubmit: (teacher: Teacher) => void;
  onClose: () => void;
}

export const TeacherCourseManager: React.FC<TeacherCourseManagerProps> = ({
  teacher,
  onSubmit,
  onClose
}) => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<ChosenCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getCourses();
        const chosenCourses = await getTeacherDetails(teacher.id);
        
        const availableCourses: Course[] = courses.filter((course: Course) => 
          !course.canceledYear && 
          !chosenCourses.some((sc: Course) => sc.id === course.id)
        );

        setSelectedCourses(chosenCourses);
        setAvailableCourses(availableCourses);
      } catch (err) {
        setError('Failed to fetch courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const addCourse = (course: Course) => {
    setSelectedCourses(prev => [
      ...prev,
      { ...course, chosenYear: new Date().getFullYear(), score: null }
    ]);
    setAvailableCourses(prev => prev.filter(c => c.id !== course.id));
  };

  const removeCourse = (course: Course) => {
    setSelectedCourses(prev => prev.filter(c => c.id !== course.id));
    if (!course.canceledYear) {
      setAvailableCourses(prev => [...prev, course].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...teacher,
      courses: selectedCourses
    });
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-8 h-8 border-2 border-solid rounded-full animate-spin 
                border-neutral-500 border-t-transparent 
                dark:border-neutral-200 dark:border-t-transparent">
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
        <span className="font-medium">Error:</span> {error}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Manage Courses for {teacher.name}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">
              Selected Courses
            </h3>
            <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {selectedCourses.length === 0 ? (
                  <div className="p-4 text-neutral-500 dark:text-neutral-400 text-center">
                    No courses selected
                  </div>
                ) : (
                  selectedCourses.map(course => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600 last:border-0"
                    >
                      <div className="flex-grow">
                        <p className="font-medium text-neutral-900 dark:text-white">{course.name}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          ID: {course.id} | Credit: {course.credit} 
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => removeCourse(course)}
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Available Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">
              Available Courses
            </h3>
            <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {availableCourses.length === 0 ? (
                  <div className="p-4 text-neutral-500 dark:text-neutral-400 text-center">
                    No available courses
                  </div>
                ) : (
                  availableCourses.map(course => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer border-b border-neutral-200 dark:border-neutral-600 last:border-0"
                      onClick={() => addCourse(course)}
                    >
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{course.name}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          ID: {course.id} | Credit: {course.credit} | Required average score: {course.grade}
                        </p>
                      </div>
                      <div className="h-5 w-5 border-2 border-neutral-300 dark:border-neutral-500 rounded-full" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};