import React, { useState, useMemo } from "react";
import { Search, Edit2, Trash2, BarChart2 } from "lucide-react";
import type { Course } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { CourseListProps } from "../../types";

const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "credit", label: "Credit" },
    { key: "grade", label: "Grade" },
    { key: "canceledYear", label: "Canceled year" },
    { key: "actions", label: "Actions" },
];

const SearchInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
}> = ({ value, onChange }) => (
    <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
        <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-colors"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const Actions: React.FC<{
    course: Course;
    userRole?: string;
    onEdit?: (course: Course) => void;
    onDelete?: (id: string) => void;
    onViewStats?: (courseId: string, courseName: string) => void;
}> = ({ course, userRole, onEdit, onDelete, onViewStats }) => (
    <div className="flex space-x-2">
        {userRole === "admin" && (
            <>
                {onEdit && (
                    <button
                        onClick={() => onEdit(course)}
                        className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors"
                        aria-label="Edit"
                    >
                        <Edit2 className="h-5 w-5" />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(course.id)}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        aria-label="Delete"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                )}
            </>
        )}
        {onViewStats && (
            <button
                onClick={() => onViewStats(course.id, course.name)}
                className="text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
                aria-label="View stats"
            >
                <BarChart2 className="h-5 w-5" />
            </button>
        )}
    </div>
);

const CourseRow: React.FC<{
    course: Course;
    userRole?: string;
    onEdit?: (course: Course) => void;
    onDelete?: (id: string) => void;
    onViewStats?: (courseId: string, courseName: string) => void;
}> = ({ course, userRole, onEdit, onDelete, onViewStats }) => (
    <tr className="hover:bg-white/50 dark:hover:bg-neutral-700/50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {course.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {course.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {course.credit}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {course.grade}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {course.canceledYear ?? "—"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            <Actions
                course={course}
                userRole={userRole}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewStats={onViewStats}
            />
        </td>
    </tr>
);

export const CourseList: React.FC<CourseListProps> = ({
    courses,
    onEdit,
    onDelete,
    onViewStats,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useAuth();

    const filteredCourses = useMemo(
        () =>
            courses.filter(
                (course) =>
                    course.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    course.id.includes(searchTerm)
            ),
        [searchTerm, courses]
    );

    return (
        <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {filteredCourses.map((course) => (
                            <CourseRow
                                key={course.id}
                                course={course}
                                userRole={user?.role}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewStats={onViewStats}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
