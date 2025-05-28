import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import { getStudentDetails } from "../../utils/Fetches";
import { showError } from "../../utils/toast";
import { StudentDetailsProps, StudentDetailsModalProps } from "../../types";
import { PersonalInfoSection } from "./PersonalInfoSection";

const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Student Information
        </h2>
        <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
            ×
        </button>
    </div>
);

export const StudentDetails = ({ id, onClose }: StudentDetailsModalProps) => {
    const { theme } = useTheme();
    const [studentInfo, setStudentInfo] = useState<StudentDetailsProps | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    const fetchStudent = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getStudentDetails(id);
            setStudentInfo(data);
        } catch (err) {
            showError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch student details"
            );
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchStudent();
    }, [fetchStudent]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div
                className={`bg-white ${
                    theme === "dark" ? "dark:bg-neutral-800" : "bg-white"
                } rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
                <ModalHeader onClose={onClose} />
                <div className="space-y-6">
                    <PersonalInfoSection
                        studentInfo={studentInfo}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};
