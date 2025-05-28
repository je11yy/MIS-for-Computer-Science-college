import { School } from "lucide-react";
import { Teacher } from "../../types";

export const TeacherProfile = ({ teacher }: { teacher: Teacher }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <School className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Teacher Profile
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                    {teacher.name}
                </p>
            </div>
        </div>
        <div className="space-y-4">
            <div>
                <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Teacher ID
                </h2>
                <p className="text-lg text-neutral-900 dark:text-white">
                    {teacher.id}
                </p>
            </div>
        </div>
    </div>
);
