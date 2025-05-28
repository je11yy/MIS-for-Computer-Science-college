import { GraduationCap } from "lucide-react";
import { Student } from "../../types";

export const StudentProfile = ({ student }: { student: Student }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Student Profile
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                    {student.name}
                </p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Student ID
                    </h2>
                    <p className="text-lg text-neutral-900 dark:text-white">
                        {student.id}
                    </p>
                </div>
                <div>
                    <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Class
                    </h2>
                    <p className="text-lg text-neutral-900 dark:text-white">
                        {student.studentClass}
                    </p>
                </div>
                <div>
                    <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Entrance Year
                    </h2>
                    <p className="text-lg text-neutral-900 dark:text-white">
                        {student.entranceYear}
                    </p>
                </div>
            </div>
        </div>
    </div>
);
