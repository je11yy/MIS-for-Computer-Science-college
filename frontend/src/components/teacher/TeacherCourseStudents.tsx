import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getStudentsByCourse, updateCourseScore } from "../../utils/Fetches";
import type {
    EditScoreState,
    StudentWithScore,
    TeacherCourseStudentsProps,
} from "../../types";
import { LoadingSpinner } from "../LoadingSpinner";
import { showError, showSuccess } from "../../utils/toast";
import { StudentsTable } from "../student/StudentsTable";

const SearchInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = ({ value, onChange }) => (
    <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
        <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export const TeacherCourseStudents: React.FC<TeacherCourseStudentsProps> = ({
    courseId,
    courseName,
    onClose,
}) => {
    const [students, setStudents] = useState<StudentWithScore[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingScore, setEditingScore] = useState<EditScoreState | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const data = await getStudentsByCourse(courseId);
                setStudents(data);
            } catch (err) {
                showError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch students for course"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [courseId]);

    const handleScoreChange = async (studentId: string) => {
        if (!editingScore) return;
        setIsLoading(true);

        const score = parseFloat(editingScore.score);
        if (isNaN(score) || score < 0 || score > 100) {
            showError("Score must be between 0 and 100");
            setIsLoading(false);
            return;
        }

        try {
            await updateCourseScore(studentId, courseId, score);
            setStudents((prev) =>
                prev.map((student) =>
                    student.id === studentId ? { ...student, score } : student
                )
            );
        } catch (err) {
            showError(
                err instanceof Error ? err.message : "Failed to change score"
            );
        } finally {
            setIsLoading(false);
            showSuccess("Changes saved successfully");
            setEditingScore(null);
        }
    };

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm)
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Students in {courseName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                        ×
                    </button>
                </div>
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
                <StudentsTable
                    students={filteredStudents}
                    editingScore={editingScore}
                    setEditingScore={setEditingScore}
                    handleScoreChange={handleScoreChange}
                />
            </div>
        </div>
    );
};
