import { StudentDetailsProps } from "../../types";
import { LoadingSpinner } from "../LoadingSpinner";

const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: string | number | undefined;
}) => (
    <div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {label}
        </p>
        <p className="text-neutral-900 dark:text-white">{value ?? "N/A"}</p>
    </div>
);

export const PersonalInfoSection = ({
    studentInfo,
    isLoading,
}: {
    studentInfo: StudentDetailsProps | null;
    isLoading: boolean;
}) => (
    <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">
            Personal Information
        </h3>
        {isLoading ? (
            <LoadingSpinner />
        ) : (
            <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Name" value={studentInfo?.name} />
                <InfoRow label="ID" value={studentInfo?.id} />
                <InfoRow label="Class" value={studentInfo?.studentClass} />
                <InfoRow
                    label="Average Score"
                    value={
                        studentInfo?.averageScore !== undefined
                            ? studentInfo.averageScore.toFixed(2)
                            : undefined
                    }
                />
            </div>
        )}
    </div>
);
