import { Student } from "../../types";

export const StudentCoursesTable = ({
    courses,
}: {
    courses: Student["courses"];
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
                        Score
                    </th>
                </tr>
            </thead>
            <tbody>
                {courses?.map((course) => (
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
                            {course.score ?? "Not graded"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
