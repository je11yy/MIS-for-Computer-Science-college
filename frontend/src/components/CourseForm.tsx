import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Course } from '../types';

const courseSchema = z.object({
  id: z.string().length(7, 'Course ID must be 7 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  teacherId: z.string().min(1, 'Teacher ID is required'),
  credit: z.number().min(1, 'Credit must be at least 1'),
  grade: z.number().min(1, 'Grade must be at least 1'),
  canceledYear: z.number().nullable()
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ course, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: course || {
      id: '0000000',
      name: '',
      teacherId: '',
      credit: 1,
      grade: 1,
      canceledYear: null
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
          {course ? 'Edit Course' : 'Add New Course'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {course && (<div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Course ID
            </label>
            <input
              type="text"
              {...register('id')}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
              disabled={!!course}
            />
            {errors.id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.id.message}</p>
            )}
          </div>)}

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

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Credit
            </label>
            <input
              type="number"
              {...register('credit', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
            />
            {errors.credit && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.credit.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Grade
            </label>
            <input
              type="number"
              {...register('grade', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
            />
            {errors.grade && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.grade.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Canceled Year (optional)
            </label>
            <input
              type="number"
              {...register('canceledYear', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
            />
            {errors.canceledYear && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.canceledYear.message}</p>
            )}
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
              {course ? 'Update' : 'Add'} Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};