import React, { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import type {
    Course,
    ChosenCourse,
    Teacher,
    CourseListItemProps,
    CourseSectionProps,
    TeacherCourseListProps,
} from "../../types";
import { getCourses, getTeacherDetails } from "../../utils/Fetches";
import { LoadingSpinner } from "../LoadingSpinner";
import { showError } from "../../utils/toast";

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({
    title,
    onClose,
}) => (
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {title}
        </h2>
        <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label="Close modal"
        >
            <X className="h-6 w-6" />
        </button>
    </div>
);

const ModalFooter: React.FC<{ onCancel: () => void; onSave: () => void }> = ({
    onCancel,
    onSave,
}) => (
    <div className="flex justify-end space-x-3 mt-6">
        <button
            onClick={onCancel}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
        >
            Cancel
        </button>
        <button
            onClick={onSave}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100"
        >
            Save Changes
        </button>
    </div>
);

const CourseListItem: React.FC<CourseListItemProps> = ({
    course,
    isSelected,
    onAdd,
    onRemove,
}) => (
    <div
        className={`flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600 last:border-0 ${
            !isSelected ? "cursor-pointer" : ""
        }`}
        onClick={!isSelected ? () => onAdd?.(course) : undefined}
    >
        <div className={isSelected ? "flex-grow" : ""}>
            <p className="font-medium text-neutral-900 dark:text-white">
                {course.name}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                ID: {course.id} | Credit: {course.credit}
                {!isSelected &&
                    ` | Required average score: ${(course as Course).grade}`}
            </p>
        </div>
        {isSelected ? (
            <button
                onClick={() => onRemove?.(course)}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                aria-label="Remove course"
            >
                <Trash2 className="h-5 w-5" />
            </button>
        ) : (
            <div className="h-5 w-5 border-2 border-neutral-300 dark:border-neutral-500 rounded-full" />
        )}
    </div>
);

const CourseList: React.FC<TeacherCourseListProps> = ({
    courses,
    isLoading,
    emptyMessage,
    isSelectedList = false,
    onAddCourse,
    onRemoveCourse,
}) => {
    if (isLoading) return <LoadingSpinner />;
    return (
        <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
                {courses.length === 0 ? (
                    <div className="p-4 text-neutral-500 dark:text-neutral-400 text-center">
                        {emptyMessage}
                    </div>
                ) : (
                    courses.map((course) => (
                        <CourseListItem
                            key={course.id}
                            course={course}
                            isSelected={isSelectedList}
                            onAdd={onAddCourse}
                            onRemove={onRemoveCourse}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const CourseSection: React.FC<CourseSectionProps> = ({
    title,
    courses,
    isLoading,
    emptyMessage,
    isSelectedList,
    onAddCourse,
    onRemoveCourse,
}) => (
    <div>
        <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">
            {title}
        </h3>
        <CourseList
            courses={courses}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            isSelectedList={isSelectedList}
            onAddCourse={onAddCourse}
            onRemoveCourse={onRemoveCourse}
        />
    </div>
);

export const TeacherCourseManager: React.FC<{
    teacher: Teacher;
    onSubmit: (teacher: Teacher) => void;
    onClose: () => void;
}> = ({ teacher, onSubmit, onClose }) => {
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<ChosenCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeCourses = async () => {
            setIsLoading(true);
            try {
                const [allCourses, teacherCourses] = await Promise.all([
                    getCourses(),
                    getTeacherDetails(teacher.id),
                ]);
                const filteredAvailableCourses = allCourses.filter(
                    (course: Course) =>
                        !course.canceledYear &&
                        !teacherCourses.some(
                            (selected: Course) => selected.id === course.id
                        )
                );
                setSelectedCourses(teacherCourses);
                setAvailableCourses(filteredAvailableCourses);
            } catch (error) {
                showError(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch teacher details"
                );
            } finally {
                setIsLoading(false);
            }
        };
        initializeCourses();
    }, [teacher.id]);

    const handleAddCourse = (course: Course) => {
        const newChosenCourse: ChosenCourse = {
            ...course,
            chosenYear: new Date().getFullYear(),
            score: null,
        };
        setSelectedCourses((prev) => [...prev, newChosenCourse]);
        setAvailableCourses((prev) => prev.filter((c) => c.id !== course.id));
    };

    const handleRemoveCourse = (course: Course) => {
        setSelectedCourses((prev) => prev.filter((c) => c.id !== course.id));
        if (!course.canceledYear) {
            setAvailableCourses((prev) =>
                [...prev, course].sort((a, b) => a.name.localeCompare(b.name))
            );
        }
    };

    const handleSaveChanges = () => {
        onSubmit({
            ...teacher,
            courses: selectedCourses,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-4xl w-full">
                <ModalHeader
                    title={`Manage Courses for ${teacher.name}`}
                    onClose={onClose}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CourseSection
                        title="Selected Courses"
                        courses={selectedCourses}
                        isLoading={isLoading}
                        emptyMessage="No courses selected"
                        isSelectedList
                        onRemoveCourse={handleRemoveCourse}
                    />
                    <CourseSection
                        title="Available Courses"
                        courses={availableCourses}
                        isLoading={isLoading}
                        emptyMessage="No available courses"
                        onAddCourse={handleAddCourse}
                    />
                </div>
                <ModalFooter onCancel={onClose} onSave={handleSaveChanges} />
            </div>
        </div>
    );
};
