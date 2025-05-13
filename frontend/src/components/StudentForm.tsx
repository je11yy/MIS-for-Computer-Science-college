import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Student } from '../types';

const studentSchema = z.object({
  id: z.string().length(10, 'Student ID must be 10 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sex: z.enum(['male', 'female']),
  entranceAge: z.number().min(10).max(50),
  entranceYear: z.number().min(2000).max(new Date().getFullYear()),
  studentClass: z.string().min(1, 'Class is required')
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student
    ? {
        ...student,
        sex: student.sex === 'male' ? 'male' : 'female',
      }
    : {
        id: '0000000000',
        name: '',
        sex: 'male',
        entranceAge: 18,
        entranceYear: new Date().getFullYear(),
        studentClass: ''
      }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
          {student ? 'Edit Student' : 'Add New Student'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {student && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Student ID
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

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Sex
            </label>
            <select
              {...register('sex')}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.sex && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sex.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Entrance Age
            </label>
            <input
              type="number"
              {...register('entranceAge', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
            />
            {errors.entranceAge && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.entranceAge.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Entrance Year
            </label>
            <input
              type="number"
              {...register('entranceYear', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
            />
            {errors.entranceYear && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.entranceYear.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Class
            </label>
            <input
              type="text"
              {...register('studentClass')}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
            />
            {errors.studentClass && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentClass.message}</p>
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
              {student ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};