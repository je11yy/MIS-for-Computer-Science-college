import React from 'react';
import { StudentList } from '../components/StudentList';
import { getStudents, deleteStudent, updateStudent } from '../lib/data';

export const StudentsPage = () => {
  const students = getStudents();

  const handleEdit = (student: any) => {
    console.log('Edit student:', student);
    // In a real implementation, this would open a modal or form
    // updateStudent(student);
  };

  const handleDelete = (id: string) => {
    console.log('Delete student:', id);
    deleteStudent(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Management</h1>
      </div>
      <StudentList
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};