import { Edit2 } from "lucide-react";
import { EditScoreState, StudentWithScore } from "../../types";

export const StudentsTable: React.FC<{
    students: StudentWithScore[];
    editingScore: EditScoreState | null;
    setEditingScore: React.Dispatch<
        React.SetStateAction<EditScoreState | null>
    >;
    handleScoreChange: (studentId: string) => void;
}> = ({ students, editingScore, setEditingScore, handleScoreChange }) => (
    <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <StudentRow
                        key={student.id}
                        student={student}
                        editingScore={editingScore}
                        setEditingScore={setEditingScore}
                        handleScoreChange={handleScoreChange}
                    />
                ))}
            </tbody>
        </table>
    </div>
);

const StudentRow: React.FC<{
    student: StudentWithScore;
    editingScore: EditScoreState | null;
    setEditingScore: React.Dispatch<
        React.SetStateAction<EditScoreState | null>
    >;
    handleScoreChange: (studentId: string) => void;
}> = ({ student, editingScore, setEditingScore, handleScoreChange }) => (
    <tr className="border-b border-neutral-200 dark:border-neutral-700">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {student.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {student.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            {editingScore?.studentId === student.id ? (
                <input
                    type="number"
                    value={editingScore.score}
                    onChange={(e) =>
                        setEditingScore({
                            studentId: student.id,
                            score: e.target.value,
                        })
                    }
                    onBlur={() => handleScoreChange(student.id)}
                    className="w-20 px-2 py-1 border rounded"
                    min="0"
                    max="100"
                />
            ) : (
                <span>{student.score ?? "Not graded"}</span>
            )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
            <button
                onClick={() =>
                    setEditingScore({
                        studentId: student.id,
                        score: student.score?.toString() || "",
                    })
                }
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
                <Edit2 className="h-5 w-5" />
            </button>
        </td>
    </tr>
);
