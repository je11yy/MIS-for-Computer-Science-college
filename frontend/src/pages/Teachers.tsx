import { useEffect, useState } from "react";
import { TeacherList } from "../components/teacher/TeacherList";
import { TeacherForm } from "../components/teacher/TeacherForm";
import { TeacherCourseManager } from "../components/teacher/TeacherCourseManager";
import {
    getTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
} from "../utils/Fetches";
import type { Teacher } from "../types";
import { UserCog } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { showError, showSuccess } from "../utils/toast";

const AddTeacherButton = ({ onClick }: { onClick: () => void }) => (
    <div className="flex justify-between items-center">
        <button
            onClick={onClick}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
        >
            <UserCog className="h-5 w-5 mr-2" />
            Add Teacher
        </button>
    </div>
);

const TeacherModals = ({
    isFormOpen,
    isCourseManagerOpen,
    selectedTeacher,
    onFormSubmit,
    onFormCancel,
    onCourseManagerSubmit,
    onCourseManagerClose,
}: {
    isFormOpen: boolean;
    isCourseManagerOpen: boolean;
    selectedTeacher: Teacher | null;
    onFormSubmit: (data: Teacher) => Promise<void>;
    onFormCancel: () => void;
    onCourseManagerSubmit: (data: Teacher) => Promise<void>;
    onCourseManagerClose: () => void;
}) => (
    <>
        {isFormOpen && (
            <TeacherForm
                teacher={selectedTeacher || undefined}
                onSubmit={onFormSubmit}
                onCancel={onFormCancel}
            />
        )}
        {isCourseManagerOpen && selectedTeacher && (
            <TeacherCourseManager
                teacher={selectedTeacher}
                onSubmit={onCourseManagerSubmit}
                onClose={onCourseManagerClose}
            />
        )}
    </>
);

export const TeachersPage = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isCourseManagerOpen, setIsCourseManagerOpen] = useState(false);
    const { user } = useAuth();

    // Fetch teachers from API
    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const data = await getTeachers();
            setTeachers(data);
        } catch (err) {
            showError(
                err instanceof Error ? err.message : "Failed to fetch teachers"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Handlers
    const handleManageCourses = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsCourseManagerOpen(true);
    };

    const handleEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedTeacher(null);
        setIsFormOpen(true);
    };

    const handleCourseManagerSubmit = async (data: Teacher) => {
        setIsLoading(true);
        try {
            await updateTeacher(data);
            await fetchTeachers();
        } catch (err) {
            showError(
                err instanceof Error
                    ? err.message
                    : "Failed to update teacher courses"
            );
        } finally {
            showSuccess("Changes saved successfully");
            setIsCourseManagerOpen(false);
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            try {
                await deleteTeacher(id);
                await fetchTeachers();
            } catch (err) {
                showError(
                    err instanceof Error
                        ? err.message
                        : "Failed to delete teacher"
                );
            } finally {
                showSuccess("Teacher deleted successfully");
                setIsLoading(false);
            }
        }
    };

    const handleFormSubmit = async (data: Teacher) => {
        setIsLoading(true);
        try {
            if (selectedTeacher) {
                await updateTeacher(data);
            } else {
                await addTeacher(data);
            }
            await fetchTeachers();
        } catch (err) {
            showError(
                err instanceof Error
                    ? err.message
                    : "Failed to save teacher changes"
            );
        } finally {
            showSuccess("Changes saved successfully");
            setSelectedTeacher(null);
            setIsFormOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {user?.role === "admin" && <AddTeacherButton onClick={handleAdd} />}

            {isLoading && <LoadingSpinner />}

            {!isLoading && (
                <>
                    <TeacherList
                        teachers={teachers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onManageCourses={handleManageCourses}
                    />

                    <TeacherModals
                        isFormOpen={isFormOpen}
                        isCourseManagerOpen={isCourseManagerOpen}
                        selectedTeacher={selectedTeacher}
                        onFormSubmit={handleFormSubmit}
                        onFormCancel={() => setIsFormOpen(false)}
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
