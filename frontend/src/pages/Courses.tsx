import React from 'react';
import { CourseList } from '../components/CourseList';
import { getCourses, deleteCourse, updateCourse } from '../lib/data';

export const CoursesPage = () => {
  const courses = getCourses();

  const handleEdit = (course: any) => {
    console.log('Edit course:', course);
    // In a real implementation, this would open a modal or form
    // updateCourse(course);
  };

  const handleDelete = (id: string) => {
    console.log('Delete course:', id);
    deleteCourse(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
      </div>
      <CourseList
        courses={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};