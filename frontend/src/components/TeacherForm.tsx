import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Teacher, Course } from '../types';

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
  const [selectedCourses] = useState<Course[]>(teacher?.courses || []);

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


  const onFormSubmit = (data: TeacherFormData) => {
    onSubmit({
      ...data,
      courses: selectedCourses
    });
  };

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