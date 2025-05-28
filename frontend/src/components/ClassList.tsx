import React, { useEffect, useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { getAverageScore } from "../utils/Fetches";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { showError } from "../utils/toast";
import {
    SearchBarProps,
    ClassCardProps,
    ClassGridProps,
    ClassListProps,
} from "../types";

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearchChange,
}) => (
    <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
        <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
    </div>
);

export const ClassCard: React.FC<ClassCardProps> = ({
    className,
    studentCount,
    averageScore,
    onViewStudents,
}) => (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-700 dark:hover:border-neutral-200 transition-colors">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                    {className}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {studentCount} student{studentCount !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Avg. score:{" "}
                    {averageScore !== undefined
                        ? averageScore.toFixed(2)
                        : "..."}
                </p>
            </div>
        </div>

        <div className="flex space-x-3">
            <button
                onClick={onViewStudents}
                className="flex items-center justify-center flex-1 px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all duration-200"
            >
                <Users className="h-4 w-4 mr-2" />
                Students
            </button>
        </div>
    </div>
);

export const ClassGrid: React.FC<ClassGridProps> = ({
    classes,
    students,
    averageScores,
    isLoading,
    onViewStudents,
}) => {
    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((className) => {
                const studentCount = students.filter(
                    (s) => s.studentClass === className
                ).length;
                const averageScore = averageScores[className];

                return (
                    <ClassCard
                        key={className}
                        className={className}
                        studentCount={studentCount}
                        averageScore={averageScore}
                        onViewStudents={() => onViewStudents(className)}
                    />
                );
            })}
        </div>
    );
};

export const ClassList: React.FC<ClassListProps> = ({
    students,
    onViewStudents,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [averageScores, setAverageScores] = useState<Record<string, number>>(
        {}
    );
    const [isLoading, setIsLoading] = useState(true);

    const classes = useMemo(
        () => Array.from(new Set(students.map((s) => s.studentClass))),
        [students]
    );

    const filteredClasses = useMemo(
        () =>
            classes.filter((className) =>
                className.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [classes, searchTerm]
    );

    useEffect(() => {
        const fetchAverages = async () => {
            setIsLoading(true);
            const scores: Record<string, number> = {};

            try {
                await Promise.all(
                    classes.map(async (className) => {
                        try {
                            const avg = await getAverageScore(className);
                            scores[className] = avg;
                        } catch (error) {
                            showError(
                                error instanceof Error
                                    ? error.message
                                    : "Failed to fetch averages"
                            );
                        }
                    })
                );
            } finally {
                setAverageScores(scores);
                setIsLoading(false);
            }
        };

        fetchAverages();
    }, [classes]);

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </div>

            <div className="p-6">
                <ClassGrid
                    classes={filteredClasses}
                    students={students}
                    averageScores={averageScores}
                    isLoading={isLoading}
                    onViewStudents={onViewStudents}
                />
            </div>
        </div>
    );
};
