import { useEffect, useState } from "react";
import { StudentList } from "../components/student/StudentList";
import { StudentForm } from "../components/student/StudentForm";
import { StudentDetails } from "../components/student/StudentDetails";
import { StudentCourseManager } from "../components/student/StudentCourseManager";
import {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    updateCourseChoice,
} from "../utils/Fetches";
import type { Student } from "../types";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { showError, showSuccess } from "../utils/toast";

const AddStudentButton = ({ onClick }: { onClick: () => void }) => (
    <div className="flex justify-between items-center">
        <button
            onClick={onClick}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
        >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Student
        </button>
    </div>
);

const Modals = ({
    isFormOpen,
    selectedStudent,
    onFormSubmit,
    onFormCancel,
    isDetailsOpen,
    selectedStudentId,
    onDetailsClose,
    isCourseManagerOpen,
    onCourseManagerSubmit,
    onCourseManagerClose,
}: {
    isFormOpen: boolean;
    selectedStudent: Student | null;
    onFormSubmit: (data: Omit<Student, "courses">) => Promise<void>;
    onFormCancel: () => void;
    isDetailsOpen: boolean;
    selectedStudentId: string | null;
    onDetailsClose: () => void;
    isCourseManagerOpen: boolean;
    onCourseManagerSubmit: (
        student_id: string,
        chosenCourses: string[]
    ) => Promise<void>;
    onCourseManagerClose: () => void;
}) => (
    <>
        {isFormOpen && (
            <StudentForm
                student={selectedStudent || undefined}
                onSubmit={onFormSubmit}
                onCancel={onFormCancel}
            />
        )}

        {isDetailsOpen && selectedStudentId && (
            <StudentDetails id={selectedStudentId} onClose={onDetailsClose} />
        )}

        {isCourseManagerOpen && selectedStudent && (
            <StudentCourseManager
                student={selectedStudent}
                onSubmit={onCourseManagerSubmit}
                onClose={onCourseManagerClose}
            />
        )}
    </>
);

export const StudentsPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null
    );
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
        null
    );
    const [isCourseManagerOpen, setIsCourseManagerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // Fetch students from API
    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            showError(
                err instanceof Error ? err.message : "Failed to fetch students"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Handlers
    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedStudent(null);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            setIsLoading(true);
            try {
                await deleteStudent(id);
                await fetchStudents();
            } catch (err) {
                showError(
                    err instanceof Error
                        ? err.message
                        : "Failed to delete student"
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleFormSubmit = async (data: Omit<Student, "courses">) => {
        setIsLoading(true);
        try {
            const studentData: Student = { ...data, courses: [] };
            if (selectedStudent) {
                await updateStudent(studentData);
            } else {
                await addStudent(studentData);
            }
            await fetchStudents();
        } catch (err) {
            showError(
                err instanceof Error
                    ? err.message
                    : "Failed to save student changes"
            );
        } finally {
            showSuccess("Changes saved successfully");
            setIsLoading(false);
            setIsFormOpen(false);
        }
    };

    const handleViewDetails = (studentId: string) => {
        setSelectedStudentId(studentId);
        setIsDetailsOpen(true);
    };

    const handleManageCourses = (student: Student) => {
        setSelectedStudent(student);
        setIsCourseManagerOpen(true);
    };

    const handleCourseManagerSubmit = async (
        student_id: string,
        chosenCourses: string[]
    ) => {
        setIsLoading(true);
        try {
            await updateCourseChoice(student_id, chosenCourses);
            await fetchStudents();
        } catch (err) {
            showError(
                err instanceof Error
                    ? err.message
                    : "Failed to update course choices"
            );
        } finally {
            showSuccess("Changes saved successfully");
            setIsCourseManagerOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {user?.role === "admin" && <AddStudentButton onClick={handleAdd} />}

            {isLoading && <LoadingSpinner />}

            {!isLoading && (
                <>
                    <StudentList
                        students={students}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                        onManageCourses={handleManageCourses}
                    />

                    <Modals
                        isFormOpen={isFormOpen}
                        selectedStudent={selectedStudent}
                        onFormSubmit={handleFormSubmit}
                        onFormCancel={() => setIsFormOpen(false)}
                        isDetailsOpen={isDetailsOpen}
                        selectedStudentId={selectedStudentId}
                        onDetailsClose={() => setIsDetailsOpen(false)}
                        isCourseManagerOpen={isCourseManagerOpen}
                        onCourseManagerSubmit={handleCourseManagerSubmit}
                        onCourseManagerClose={() =>
                            setIsCourseManagerOpen(false)
                        }
                    />
                </>
            )}
        </div>
    );
};
