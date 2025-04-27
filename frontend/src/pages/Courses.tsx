import { useEffect, useState } from 'react';
import { CourseList } from '../components/CourseList';
import { CourseForm } from '../components/CourseForm';
import { CourseStatistics } from '../components/CourseStatistics';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../utils/Fetches';
import type { Course } from '../types';
import { BookPlus } from 'lucide-react';

export const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        await fetchCourses();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  const handleFormSubmit = async (data: Course) => {
    try {
      if (selectedCourse) {
        await updateCourse(data);
      } else {
        await addCourse(data);
      }
      await fetchCourses();
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to save course');
    }
  };

  const handleViewStats = (courseId: string, courseName: string) => {
    setSelectedCourseId(courseId);
    setSelectedCourseName(courseName);
    setIsStatsOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors shadow-sm hover:shadow"
        >
          <BookPlus className="h-5 w-5 mr-2" />
          Add Course
        </button>
      </div>

      <CourseList
        courses={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewStats={handleViewStats}
      />

      {isFormOpen && (
        <CourseForm
          course={selectedCourse || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isStatsOpen && selectedCourseId && (
        <CourseStatistics
          courseId={selectedCourseId}
          courseName={selectedCourseName}
          onClose={() => setIsStatsOpen(false)}
        />
      )}
    </div>
  );
};