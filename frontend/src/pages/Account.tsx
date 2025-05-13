import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getChosenCourses, getStudentDetails, getTeacherInfo, updateCourseChoice } from '../utils/Fetches';
import { BookOpen, GraduationCap, PlusCircle, School, Users } from 'lucide-react';
import type { Student, Teacher } from '../types';
import { StudentCourseManager } from '../components/StudentCourseManager';
import { TeacherCourseStudents } from '../components/TeacherCourseStudents';

export const AccountPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Student | Teacher | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCourseManager, setShowCourseManager] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; name: string } | null>(null);

  const fetchData = async () => {
    if (!user) return;

    try {
      if (user.role === 'student' && user.student_id) {
        const studentData = await getStudentDetails(user.student_id);
        setData(studentData);
        const chosenCourses = await getChosenCourses(user.student_id);
        setData((prev) => {
          if (prev && 'studentClass' in prev) {
            return {
              ...prev,
              courses: chosenCourses,
            };
          }
          return prev;
        });
      } else if (user.role === 'teacher' && user.teacher_id) {
        const teacherData = await getTeacherInfo(user.teacher_id);
        setData(teacherData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCourseManagerSubmit = async (student_id: string, chosenCourses: string[]) => {
      try {
        await updateCourseChoice(student_id, chosenCourses);
        await fetchData();
        setShowCourseManager(false);
      } catch (err) {
        setError('Failed to update student courses');
      }
    };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
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

  if (!user || user.role === 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          {user?.role === 'admin' ? 'Administrator Account' : 'Account Not Found'}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {user?.role === 'admin' 
            ? 'You have full access to manage the system.' 
            : 'Please log in to view your account details.'}
        </p>
      </div>
    );
  }

  if (user.role === 'student' && data) {
    const studentData = data as Student;
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Student Profile
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {studentData.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Student ID
                </h2>
                <p className="text-lg text-neutral-900 dark:text-white">
                  {studentData.id}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Class
                </h2>
                <p className="text-lg text-neutral-900 dark:text-white">
                  {studentData.studentClass}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Entrance Year
                </h2>
                <p className="text-lg text-neutral-900 dark:text-white">
                  {studentData.entranceYear}
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Enrolled Courses
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">Course</th>
                  <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">ID</th>
                  <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">Credit</th>
                  <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">Score</th>
                </tr>
              </thead>
              <tbody>
                {studentData.courses?.map((course) => (
                  <tr key={course.id} className="border-b border-neutral-200 dark:border-neutral-700">
                    <td className="py-3 text-neutral-900 dark:text-white">{course.name}</td>
                    <td className="py-3 text-neutral-900 dark:text-white">{course.id}</td>
                    <td className="py-3 text-neutral-900 dark:text-white">{course.credit}</td>
                    <td className="py-3 text-neutral-900 dark:text-white">
                      {course.score ?? 'Not graded'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => setShowCourseManager(true)}
            className="mt-6 flex items-center space-x-2 px-4 py-2 border border-black dark:border-white text-black dark:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Enroll</span>
          </button>
        </div>

        {showCourseManager && (
          <StudentCourseManager
            student={studentData}
            onSubmit={handleCourseManagerSubmit}
            onClose={() => setShowCourseManager(false)}
          />
        )}


      </div>
    );
  }

  if (user.role === 'teacher' && data) {
    const teacherData = data as Teacher;
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <School className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Teacher Profile
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {teacherData.name}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Teacher ID
              </h2>
              <p className="text-lg text-neutral-900 dark:text-white">
                {teacherData.id}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Teaching Courses
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">Course</th>
                  <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">ID</th>
                  <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">Credit</th>
                  <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {teacherData.courses.map((course) => (
                  <tr key={course.id} className="border-b border-neutral-200 dark:border-neutral-700">
                    <td className="py-3 text-neutral-900 dark:text-white">{course.name}</td>
                    <td className="py-3 text-neutral-900 dark:text-white">{course.id}</td>
                    <td className="py-3 text-neutral-900 dark:text-white">{course.credit}</td>
                    <td className="py-3 text-neutral-900 dark:text-white">
                      {course.canceledYear ? `Canceled (${course.canceledYear})` : 'Active'}
                    </td>
                    <td className="py-3 text-neutral-900 dark:text-white">
                        <button
                          onClick={() => setSelectedCourse({ id: course.id, name: course.name })}
                          className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Users className="h-5 w-5 mr-1" />
                          <span>Students</span>
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedCourse && (
        <TeacherCourseStudents
          courseId={selectedCourse.id}
          courseName={selectedCourse.name}
          onClose={() => setSelectedCourse(null)}
        />
      )}
      </div>
    );
  }

  return null;
};