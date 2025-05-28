import { useEffect, useState } from "react";
import { getCourseDetails } from "../../utils/Fetches";
import { LoadingSpinner } from "../LoadingSpinner";
import { showError } from "../../utils/toast";
import { CourseStatisticsProps, Props } from "../../types";

export const CourseStatistics: React.FC<Props> = ({ id, onClose }) => {
    const [course, setCourse] = useState<CourseStatisticsProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            setIsLoading(true);
            try {
                const data = await getCourseDetails(id);
                setCourse(data);
            } catch (err) {
                showError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch course statistics"
                );
                setCourse(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <Modal onClose={onClose}>
            {isLoading ? (
                <LoadingSpinner />
            ) : course ? (
                <>
                    <ModalHeader
                        title={`Course Statistics: ${course.name}`}
                        onClose={onClose}
                    />
                    <CourseInfoSection course={course} />
                </>
            ) : (
                <p className="text-center text-neutral-600 dark:text-neutral-300">
                    Course data not available.
                </p>
            )}
        </Modal>
    );
};

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
    children,
}) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-2xl w-full relative">
            {children}
        </div>
    </div>
);

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
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 text-2xl leading-none"
            aria-label="Close"
        >
            ×
        </button>
    </div>
);

const CourseInfoSection: React.FC<{ course: CourseStatisticsProps }> = ({
    course,
}) => (
    <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Course Info
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Course ID" value={course.id} />
            <Info label="Credit" value={course.credit} />
            <Info label="Grade" value={course.grade} />
            <Info label="Canceled Year" value={course.canceledYear ?? "—"} />
            <Info
                label="Average Score"
                value={
                    course.averageScore !== undefined
                        ? course.averageScore.toFixed(2)
                        : "N/A"
                }
            />
        </div>
    </div>
);

const Info = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <p className="text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="text-neutral-900 dark:text-white font-medium">{value}</p>
    </div>
);
