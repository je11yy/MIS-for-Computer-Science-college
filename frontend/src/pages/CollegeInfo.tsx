import { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, Trophy, School } from 'lucide-react';
import { getGlobalStatistics } from '../utils/Fetches';

interface CollegeStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  averageScore: number;
  totalClasses: number;
}

export const CollegeInfo = () => {
  const [stats, setStats] = useState<CollegeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getGlobalStatistics();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <GraduationCap className="h-16 w-16 text-blue-600 dark:text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Welcome to EduManager
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Empowering education through innovative management and collaborative learning
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white ml-3">
              Students
            </h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">
            {stats?.totalStudents}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Active learners
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <School className="h-8 w-8 text-green-600 dark:text-green-500" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white ml-3">
              Teachers
            </h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">
            {stats?.totalTeachers}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Dedicated educators
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-500" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white ml-3">
              Courses
            </h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">
            {stats?.totalCourses}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Available courses
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white ml-3">
              Average Score
            </h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">
            {stats?.averageScore.toFixed(2)}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Overall performance
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          About Our College
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-neutral-600 dark:text-neutral-400">
            EduManager is a leading educational institution committed to providing high-quality education
            and fostering academic excellence. Our diverse community of students and dedicated faculty
            members work together to create an engaging and supportive learning environment.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-4">
            We offer a wide range of courses across various disciplines, ensuring that our students
            receive comprehensive education that prepares them for their future careers. Our modern
            facilities and innovative teaching methods enable students to achieve their full potential.
          </p>
        </div>
      </div>
    </div>
  );
};