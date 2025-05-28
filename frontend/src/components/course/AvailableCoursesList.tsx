import { Course } from "../../types";
import { AvailableCourseItemProps } from "../../types";

const AvailableCourseItem: React.FC<AvailableCourseItemProps> = ({
    course,
    addCourse,
}) => (
    <div
        key={course.id}
        onClick={() => addCourse(course)}
        className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer border-b border-neutral-200 dark:border-neutral-600 last:border-0"
    >
        <div>
            <p className="font-medium text-neutral-900 dark:text-white">
                {course.name}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                ID: {course.id} | Credit: {course.credit} | Required average
                score: {course.grade}
            </p>
        </div>
        <div className="h-5 w-5 border-2 border-neutral-300 dark:border-neutral-500 rounded-full" />
    </div>
);

export const AvailableCoursesList: React.FC<{
    availableCourses: Course[];
    addCourse: (course: Course) => void;
}> = ({ availableCourses, addCourse }) =>
    availableCourses.length === 0 ? (
        <div className="p-4 text-neutral-500 dark:text-neutral-400 text-center">
            No available courses
        </div>
    ) : (
        availableCourses.map((course) => (
            <AvailableCourseItem
                key={course.id}
                course={course}
                addCourse={addCourse}
            />
        ))
    );
