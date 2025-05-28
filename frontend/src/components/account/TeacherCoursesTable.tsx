import { Users } from "lucide-react";
import { Teacher } from "../../types";

export const TeacherCoursesTable = ({
    courses,
    onShowStudents,
}: {
    courses: Teacher["courses"];
    onShowStudents: (id: string, name: string) => void;
}) => (
    <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">
                        Course
                    </th>
                    <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">
                        ID
                    </th>
                    <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">
                        Credit
                    </th>
                    <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">
                        Status
                    </th>
                    <th className="text-left py-3 text-neutral-500 dark:text-neutral-400">
                        Students
                    </th>
                </tr>
            </thead>
            <tbody>
                {courses.map((course) => (
                    <tr
                        key={course.id}
                        className="border-b border-neutral-200 dark:border-neutral-700"
                    >
                        <td className="py-3 text-neutral-900 dark:text-white">
                            {course.name}
                        </td>
                        <td className="py-3 text-neutral-900 dark:text-white">
                            {course.id}
                        </td>
                        <td className="py-3 text-neutral-900 dark:text-white">
                            {course.credit}
                        </td>
                        <td className="py-3 text-neutral-900 dark:text-white">
                            {course.canceledYear
                                ? `Canceled (${course.canceledYear})`
                                : "Active"}
                        </td>
                        <td className="py-3 text-neutral-900 dark:text-white">
                            <button
                                onClick={() =>
                                    onShowStudents(course.id, course.name)
                                }
                                className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                <Users className="h-5 w-5 mr-1" />
                                <span>Students</span>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
