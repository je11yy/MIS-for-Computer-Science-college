import { useEffect, useState } from "react";
import { CourseList } from "../components/course/CourseList";
import { CourseForm } from "../components/course/CourseForm";
import { CourseStatistics } from "../components/course/CourseStatistics";
import {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
} from "../utils/Fetches";
import type { Course } from "../types";
import { BookPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { showError, showSuccess } from "../utils/toast";

const AddCourseButton = ({ onClick }: { onClick: () => void }) => (
    <div className="flex justify-between items-center">
        <button
            onClick={onClick}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
        >
            <BookPlus className="h-5 w-5 mr-2" />
            Add Course
        </button>
    </div>
);

const CourseModals = ({
    isFormOpen,
    selectedCourse,
    onFormSubmit,
    onFormCancel,
    isStatsOpen,
    selectedCourseId,
    onStatsClose,
}: {
    isFormOpen: boolean;
    selectedCourse: Course | null;
    onFormSubmit: (data: Course) => void;
    onFormCancel: () => void;
    isStatsOpen: boolean;
    selectedCourseId: string | null;
    onStatsClose: () => void;
}) => (
    <>
        {isFormOpen && (
            <CourseForm
                course={selectedCourse || undefined}
                onSubmit={onFormSubmit}
                onCancel={onFormCancel}
            />
        )}
        {isStatsOpen && selectedCourseId && (
            <CourseStatistics id={selectedCourseId} onClose={onStatsClose} />
        )}
    </>
);

export const CoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // Fetch courses from API
    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const data = await getCourses();
            setCourses(data);
        } catch (err) {
            showError(
                err instanceof Error ? err.message : "Failed to fetch courses"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Handlers
    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedCourse(null);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await deleteCourse(id);
                await fetchCourses();
            } catch (err) {
                showError(
                    err instanceof Error
                        ? err.message
                        : "Failed to delete course"
                );
            }
        }
    };

    const handleFormSubmit = async (data: Course) => {
        setIsLoading(true);
        try {
            if (selectedCourse) {
                await updateCourse(data);
            } else {
                await addCourse(data);
            }
            await fetchCourses();
        } catch (err) {
            showError(
                err instanceof Error
                    ? err.message
                    : "Failed to save course changes"
            );
        } finally {
            showSuccess("Changes saved successfully");
            setIsFormOpen(false);
            setIsLoading(false);
        }
    };

    const handleViewStats = (courseId: string) => {
        setSelectedCourseId(courseId);
        setIsStatsOpen(true);
    };

    return (
        <div className="space-y-6">
            {user?.role === "admin" && <AddCourseButton onClick={handleAdd} />}

            {isLoading && <LoadingSpinner />}

            {!isLoading && (
                <>
                    <CourseList
                        courses={courses}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewStats={handleViewStats}
                    />

                    <CourseModals
                        isFormOpen={isFormOpen}
                        selectedCourse={selectedCourse}
                        onFormSubmit={handleFormSubmit}
                        onFormCancel={() => setIsFormOpen(false)}
                        isStatsOpen={isStatsOpen}
                        selectedCourseId={selectedCourseId}
                        onStatsClose={() => setIsStatsOpen(false)}
                    />
                </>
            )}
        </div>
    );
};
