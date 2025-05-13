import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X } from 'lucide-react';
import type { Teacher, Course } from '../types';
import { getCourses } from '../utils/Fetches';

const teacherSchema = z.object({
  id: z.string().length(5, 'Teacher ID must be 5 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: Teacher) => void;
  onCancel: () => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, onSubmit, onCancel }) => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(teacher?.courses || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher
      ? {
          id: teacher.id,
          name: teacher.name
        }
      : {
          id: '00000',
          name: ''
        }
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getCourses();
        setAvailableCourses(courses);
      } catch (err) {
        setError('Failed to fetch courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleCourse = (course: Course) => {
    setSelectedCourses(prev => {
      const isSelected = prev.some(c => c.id === course.id);
      if (isSelected) {
        return prev.filter(c => c.id !== course.id);
      } else {
        return [...prev, course];
      }
    });
  };

  const onFormSubmit = (data: TeacherFormData) => {
    onSubmit({
      ...data,
      courses: selectedCourses
    });
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
          {teacher ? 'Edit Teacher' : 'Add New Teacher'}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {teacher && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    {...register('id')}
                    className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
                    disabled
                  />
                  {errors.id && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.id.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Assigned Courses
              </label>
              <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {availableCourses.map(course => {
                    const isSelected = selectedCourses.some(c => c.id === course.id);
                    return (
                      <div
                        key={course.id}
                        className={`flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer ${
                          isSelected ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                        }`}
                        onClick={() => toggleCourse(course)}
                      >
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{course.name}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            ID: {course.id} | Credit: {course.credit} | Grade: {course.grade}
                          </p>
                        </div>
                        {isSelected ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-neutral-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Selected courses: {selectedCourses.length}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100"
            >
              {teacher ? 'Update' : 'Add'} Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};