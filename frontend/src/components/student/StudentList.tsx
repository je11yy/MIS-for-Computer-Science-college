import React, { useState } from "react";
import { Search, Edit2, Trash2, FileText, BookPlus } from "lucide-react";
import type { Student } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { StudentListProps } from "../../types";

const actionButtonClass =
    "transition-colors hover:text-opacity-90 text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300";

const TABLE_HEADERS = [
    "ID",
    "Name",
    "Sex",
    "Entrance year",
    "Entrance Age",
    "Class",
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
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const StudentTableHead: React.FC<{
    showActions: boolean;
}> = ({ showActions }) => (
    <thead>
        <tr className="border-b border-neutral-200 dark:border-neutral-700">
            {TABLE_HEADERS.map((header) => (
                <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                    {header}
                </th>
            ))}
            {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                </th>
            )}
        </tr>
    </thead>
);

const StudentTableRow: React.FC<{
    student: Student;
    renderActions?: (student: Student) => React.ReactNode;
}> = ({ student, renderActions }) => (
    <tr
        className="hover:bg-white/50 dark:hover:bg-neutral-700/50 transition-colors"
        key={student.id}
    >
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {student.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {student.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {student.sex}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {student.entranceYear}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {student.entranceAge}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {student.studentClass}
        </td>
        {renderActions && (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                {renderActions(student)}
            </td>
        )}
    </tr>
);

const StudentActions: React.FC<{
    student: Student;
    isAdmin: boolean;
    onEdit?: (student: Student) => void;
    onDelete?: (id: string) => void;
    onViewDetails?: (studentId: string) => void;
    onManageCourses?: (student: Student) => void;
}> = ({
    student,
    isAdmin,
    onEdit,
    onDelete,
    onViewDetails,
    onManageCourses,
}) => {
    if (!(onEdit || onDelete || onViewDetails || onManageCourses)) return null;

    return (
        <div className="flex space-x-2">
            {isAdmin && onEdit && (
                <button
                    onClick={() => onEdit(student)}
                    className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors"
                    title="Edit student"
                >
                    <Edit2 className="h-5 w-5" />
                </button>
            )}

            {isAdmin && onDelete && (
                <button
                    onClick={() => onDelete(student.id)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    title="Delete student"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            )}

            {onViewDetails && (
                <button
                    onClick={() => onViewDetails(student.id)}
                    className={actionButtonClass}
                    title="View details"
                >
                    <FileText className="h-5 w-5" />
                </button>
            )}

            {isAdmin && onManageCourses && (
                <button
                    onClick={() => onManageCourses(student)}
                    className={actionButtonClass}
                    title="Manage courses"
                >
                    <BookPlus className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export const StudentList: React.FC<StudentListProps> = ({
    students,
    onEdit,
    onDelete,
    onViewDetails,
    onManageCourses,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useAuth();

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm)
    );

    const showActions = !!(
        onEdit ||
        onDelete ||
        onViewDetails ||
        onManageCourses
    );
    const isAdmin = user?.role === "admin";

    return (
        <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />

            <div className="overflow-x-auto">
                <table className="w-full">
                    <StudentTableHead showActions={showActions} />
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {filteredStudents.map((student) => (
                            <StudentTableRow
                                key={student.id}
                                student={student}
                                renderActions={
                                    showActions
                                        ? (s) => (
                                              <StudentActions
                                                  student={s}
                                                  isAdmin={isAdmin}
                                                  onEdit={onEdit}
                                                  onDelete={onDelete}
                                                  onViewDetails={onViewDetails}
                                                  onManageCourses={
                                                      onManageCourses
                                                  }
                                              />
                                          )
                                        : undefined
                                }
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
