import { ChosenCourse } from "../../types";
import { Edit2, Trash2 } from "lucide-react";
import { SelectedCourseItemProps } from "../../types";

const SelectedCourseItem: React.FC<SelectedCourseItemProps> = ({
    course,
    userRole,
    editingScore,
    setEditingScore,
    handleScoreChange,
    removeCourse,
}) => (
    <div className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600 last:border-0">
        <div className="flex-grow">
            <p className="font-medium text-neutral-900 dark:text-white">
                {course.name}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                ID: {course.id} | Credit: {course.credit} | Score:{" "}
                {editingScore?.courseId === course.id ? (
                    <input
                        type="number"
                        value={editingScore.score}
                        onChange={(e) =>
                            setEditingScore({
                                courseId: course.id,
                                score: e.target.value,
                            })
                        }
                        onBlur={() => handleScoreChange(course.id)}
                        className="w-20 px-2 py-1 border rounded"
                        min="0"
                        max="100"
                    />
                ) : (
                    <span
                        className="cursor-pointer"
                        onClick={() =>
                            setEditingScore({
                                courseId: course.id,
                                score: course.score?.toString() || "",
                            })
                        }
                    >
                        {course.score ?? "Not graded yet"}
                    </span>
                )}
            </p>
        </div>
        <div className="flex space-x-2">
            {userRole === "teacher" && (
                <button
                    onClick={() =>
                        setEditingScore({
                            courseId: course.id,
                            score: course.score?.toString() || "",
                        })
                    }
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    <Edit2 className="h-5 w-5" />
                </button>
            )}
            <button
                onClick={() => removeCourse(course)}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
                <Trash2 className="h-5 w-5" />
            </button>
        </div>
    </div>
);

export const SelectedCoursesList: React.FC<{
    selectedCourses: ChosenCourse[];
    userRole: string | undefined;
    editingScore: { courseId: string; score: string } | null;
    setEditingScore: React.Dispatch<
        React.SetStateAction<{ courseId: string; score: string } | null>
    >;
    handleScoreChange: (courseId: string) => void;
    removeCourse: (course: ChosenCourse) => void;
}> = ({
    selectedCourses,
    userRole,
    editingScore,
    setEditingScore,
    handleScoreChange,
    removeCourse,
}) =>
    selectedCourses.length === 0 ? (
        <div className="p-4 text-neutral-500 dark:text-neutral-400 text-center">
            No courses selected
        </div>
    ) : (
        selectedCourses.map((course) => (
            <SelectedCourseItem
                key={course.id}
                course={course}
                userRole={userRole}
                editingScore={editingScore}
                setEditingScore={setEditingScore}
                handleScoreChange={handleScoreChange}
                removeCourse={removeCourse}
            />
        ))
    );
