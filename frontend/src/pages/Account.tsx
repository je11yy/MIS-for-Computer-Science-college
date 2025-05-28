import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getChosenCourses,
    getStudentDetails,
    getTeacherInfo,
} from "../utils/Fetches";
import { BookOpen } from "lucide-react";
import type { Student, Teacher } from "../types";
import { TeacherCourseStudents } from "../components/teacher/TeacherCourseStudents";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { showError } from "../utils/toast";
import { StudentProfile } from "../components/account/StudentProfile";
import { StudentCoursesTable } from "../components/account/StudentCoursesTable";
import { TeacherProfile } from "../components/account/TeacherProfile";
import { TeacherCoursesTable } from "../components/account/TeacherCoursesTable";

const AdminOrNotFound = ({ user }: { user: any }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {user?.role === "admin"
                ? "Administrator Account"
                : "Account Not Found"}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
            {user?.role === "admin"
                ? "You have full access to manage the system."
                : "Please log in to view your account details."}
        </p>
    </div>
);

export const AccountPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState<Student | Teacher | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            if (user.role === "student" && user.student_id) {
                const studentData = await getStudentDetails(user.student_id);
                setData(studentData);
                const chosenCourses = await getChosenCourses(user.student_id);
                setData((prev) => {
                    if (prev && "studentClass" in prev) {
                        return {
                            ...prev,
                            courses: chosenCourses,
                        };
                    }
                    return prev;
                });
            } else if (user.role === "teacher" && user.teacher_id) {
                const teacherData = await getTeacherInfo(user.teacher_id);
                setData(teacherData);
            }
        } catch (err) {
            showError(
                err instanceof Error ? err.message : "Failed to account data"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!user || user.role === "admin") {
        return <AdminOrNotFound user={user} />;
    }

    if (user.role === "student" && data) {
        const studentData = data as Student;
        return (
            <div className="space-y-6">
                <StudentProfile student={studentData} />
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Enrolled Courses
                        </h2>
                    </div>
                    <StudentCoursesTable courses={studentData.courses} />
                </div>
            </div>
        );
    }

    if (user.role === "teacher" && data) {
        const teacherData = data as Teacher;
        return (
            <div className="space-y-6">
                <TeacherProfile teacher={teacherData} />
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Teaching Courses
                        </h2>
                    </div>
                    <TeacherCoursesTable
                        courses={teacherData.courses}
                        onShowStudents={(id, name) =>
                            setSelectedCourse({ id, name })
                        }
                    />
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
