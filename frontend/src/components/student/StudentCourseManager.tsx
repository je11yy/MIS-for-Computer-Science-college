import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
    Course,
    ChosenCourse,
    StudentCourseManagerProps,
} from "../../types";
import {
    getCourses,
    getChosenCourses,
    getStudentDetails,
    updateCourseScore,
} from "../../utils/Fetches";
import { useAuth } from "../../context/AuthContext";
import { LoadingSpinner } from "../LoadingSpinner";
import { showError, showSuccess } from "../../utils/toast";
import { SelectedCoursesList } from "../course/SelectedCoursesList";
import { AvailableCoursesList } from "../course/AvailableCoursesList";

export const StudentCourseManager: React.FC<StudentCourseManagerProps> = ({
    student,
    onSubmit,
    onClose,
}) => {
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<ChosenCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingScore, setEditingScore] = useState<{
        courseId: string;
        score: string;
    } | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [courses, chosenCourses, studentData] = await Promise.all(
                    [
                        getCourses(),
                        getChosenCourses(student.id),
                        getStudentDetails(student.id),
                    ]
                );

                setAvailableCourses(
                    courses.filter(
                        (course) =>
                            !course.canceledYear &&
                            !chosenCourses.some((sc) => sc.id === course.id) &&
                            course.grade <= studentData.averageScore
                    )
                );
                setSelectedCourses(chosenCourses);
            } catch (err) {
                showError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch courses"
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [student.id]);

    const addCourse = (course: Course) => {
        setSelectedCourses((prev) => [
            ...prev,
            { ...course, chosenYear: new Date().getFullYear(), score: null },
        ]);
        setAvailableCourses((prev) => prev.filter((c) => c.id !== course.id));
    };

    const removeCourse = (course: ChosenCourse) => {
        setSelectedCourses((prev) => prev.filter((c) => c.id !== course.id));
        if (!course.canceledYear) {
            setAvailableCourses((prev) =>
                [...prev, course].sort((a, b) => a.name.localeCompare(b.name))
            );
        }
    };

    const handleSubmit = () => {
        onSubmit(
            student.id,
            selectedCourses.map((course) => course.id)
        );
    };

    const handleScoreChange = async (courseId: string) => {
        if (!editingScore) return;
        const score = parseFloat(editingScore.score);
        if (isNaN(score) || score < 0 || score > 100) {
            showError("Score must be between 0 and 100");
            return;
        }
        setIsLoading(true);
        try {
            await updateCourseScore(student.id, courseId, score);
            setSelectedCourses((prev) =>
                prev.map((course) =>
                    course.id === courseId ? { ...course, score } : course
                )
            );
            showSuccess("Changes saved successfully");
        } catch (err) {
            showError(
                err instanceof Error ? err.message : "Failed to change score"
            );
        } finally {
            setIsLoading(false);
            setEditingScore(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-4xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Manage Courses for {student.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">
                                Selected Courses
                            </h3>
                            <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                                <SelectedCoursesList
                                    selectedCourses={selectedCourses}
                                    userRole={user?.role}
                                    editingScore={editingScore}
                                    setEditingScore={setEditingScore}
                                    handleScoreChange={handleScoreChange}
                                    removeCourse={removeCourse}
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">
                                Available Courses
                            </h3>
                            <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                                <AvailableCoursesList
                                    availableCourses={availableCourses}
                                    addCourse={addCourse}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
