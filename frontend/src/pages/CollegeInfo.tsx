import { useEffect, useState } from "react";
import { GraduationCap, Users, BookOpen, Trophy, School } from "lucide-react";
import { getGlobalStatistics } from "../utils/Fetches";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { showError } from "../utils/toast";
import { CollegeStats, StatCardProps } from "../types";

const StatCard = ({ icon, title, value, description }: StatCardProps) => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white ml-3">
                {title}
            </h3>
        </div>
        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
            {value}
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {description}
        </p>
    </div>
);

const CollegeHeader = () => (
    <div className="text-center mb-16">
        <GraduationCap className="h-16 w-16 text-blue-600 dark:text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Welcome to EduManager
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Empowering education through innovative management and collaborative
            learning
        </p>
    </div>
);

const AboutCollege = () => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            About Our College
        </h2>
        <div className="prose dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400">
                EduManager is a leading educational institution committed to
                providing high-quality education and fostering academic
                excellence. Our diverse community of students and dedicated
                faculty members work together to create an engaging and
                supportive learning environment.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4">
                We offer a wide range of courses across various disciplines,
                ensuring that our students receive comprehensive education that
                prepares them for their future careers. Our modern facilities
                and innovative teaching methods enable students to achieve their
                full potential.
            </p>
        </div>
    </div>
);

export const CollegeInfo = () => {
    const [stats, setStats] = useState<CollegeStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const data = await getGlobalStatistics();
                setStats(data);
            } catch (err) {
                showError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch college statistics"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <CollegeHeader />

            {isLoading && <LoadingSpinner />}

            {!isLoading && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <StatCard
                        icon={
                            <Users className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                        }
                        title="Students"
                        value={stats.totalStudents}
                        description="Active learners"
                    />
                    <StatCard
                        icon={
                            <School className="h-8 w-8 text-green-600 dark:text-green-500" />
                        }
                        title="Teachers"
                        value={stats.totalTeachers}
                        description="Dedicated educators"
                    />
                    <StatCard
                        icon={
                            <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-500" />
                        }
                        title="Courses"
                        value={stats.totalCourses}
                        description="Available courses"
                    />
                    <StatCard
                        icon={
                            <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                        }
                        title="Average Score"
                        value={stats.averageScore.toFixed(2)}
                        description="Overall performance"
                    />
                </div>
            )}

            <AboutCollege />
        </div>
    );
};
