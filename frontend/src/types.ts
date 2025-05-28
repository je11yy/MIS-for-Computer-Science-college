import { z } from "zod";
import { courseSchema, studentSchema, teacherSchema } from "./utils/schemas";

export interface Student {
    id: string;
    name: string;
    sex: string;
    entranceAge: number;
    entranceYear: number;
    studentClass: string;
    courses: ChosenCourse[];
}

export interface Course {
    id: string;
    name: string;
    teacherId: string;
    credit: number;
    grade: number;
    canceledYear: number | null;
}

export interface Teacher {
    id: string;
    name: string;
    courses: Course[];
}

export interface CoursesByTeacher {
    courses: Course[];
}

export interface ChosenCourse extends Course {
    chosenYear: number;
    score: number | null;
}

export interface CourseChoice {
    studentId: string;
    courseId: string;
    chosenYear: number;
    score: number | null;
}

export type UserRole = "student" | "teacher" | "admin";

export interface User {
    role: UserRole;
    name: string;
    student_id?: string;
    teacher_id?: string;
}

export interface ClassInfo {
    className: string;
    students: Student[];
    averageScore: number;
}

export interface StudentWithScore extends Student {
    score: number | null;
}

export type CourseFormData = z.infer<typeof courseSchema>;

export interface CourseFormProps {
    course?: Course;
    onSubmit: (data: CourseFormData) => void;
    onCancel: () => void;
}

export interface FormInputProps {
    label: string;
    type: string;
    register: any;
    error?: string;
    disabled?: boolean;
}

export interface CourseListProps {
    courses: Course[];
    onEdit?: (course: Course) => void;
    onDelete?: (id: string) => void;
    onViewStats?: (courseId: string, courseName: string) => void;
}

export interface CourseStatisticsProps {
    id: string;
    name: string;
    credit: number;
    grade: number;
    canceledYear: number | null;
    averageScore: number;
}

export interface Props {
    id: string;
    onClose: () => void;
}

export interface StudentCourseManagerProps {
    student: Student;
    onSubmit: (student_id: string, chosenCourses: string[]) => void;
    onClose: () => void;
}

export interface SelectedCourseItemProps {
    course: ChosenCourse;
    userRole: string | undefined;
    editingScore: { courseId: string; score: string } | null;
    setEditingScore: React.Dispatch<
        React.SetStateAction<{ courseId: string; score: string } | null>
    >;
    handleScoreChange: (courseId: string) => void;
    removeCourse: (course: ChosenCourse) => void;
}

export interface AvailableCourseItemProps {
    course: Course;
    addCourse: (course: Course) => void;
}

export interface StudentDetailsProps {
    id: string;
    name: string;
    sex: string;
    entranceAge: number;
    entranceYear: number;
    studentClass: string;
    averageScore: number;
}

export interface StudentDetailsModalProps {
    id: string;
    onClose: () => void;
}

export type StudentFormData = z.infer<typeof studentSchema>;

export interface StudentFormProps {
    student?: Student;
    onSubmit: (data: StudentFormData) => void;
    onCancel: () => void;
}

export interface StudentListProps {
    students: Student[];
    onEdit?: (student: Student) => void;
    onDelete?: (id: string) => void;
    onViewDetails?: (studentId: string) => void;
    onManageCourses?: (student: Student) => void;
}

export interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export interface ClassCardProps {
    className: string;
    studentCount: number;
    averageScore?: number;
    onViewStudents: () => void;
}

export interface ClassGridProps {
    classes: string[];
    students: Student[];
    averageScores: Record<string, number>;
    isLoading: boolean;
    onViewStudents: (className: string) => void;
}

export interface ClassListProps {
    students: Student[];
    onViewStudents: (className: string) => void;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (
        username: string,
        password: string,
        studentId?: string,
        teacherId?: string
    ) => Promise<void>;
    logout: () => void;
}

export type Theme = "light" | "dark";

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export interface StudentsModalProps {
    selectedClass: string;
    students: Student[];
    onClose: () => void;
}

export interface CollegeStats {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    averageScore: number;
    totalClasses: number;
}

export interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: React.ReactNode;
    description: string;
}

export interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

export interface CourseListItemProps {
    course: Course | ChosenCourse;
    isSelected: boolean;
    onAdd?: (course: Course) => void;
    onRemove?: (course: Course) => void;
}

export interface CourseSectionProps {
    title: string;
    courses: Course[] | ChosenCourse[];
    isLoading: boolean;
    emptyMessage: string;
    isSelectedList?: boolean;
    onAddCourse?: (course: Course) => void;
    onRemoveCourse?: (course: Course) => void;
}

export interface TeacherCourseListProps {
    courses: Course[] | ChosenCourse[];
    isLoading: boolean;
    emptyMessage: string;
    isSelectedList?: boolean;
    onAddCourse?: (course: Course) => void;
    onRemoveCourse?: (course: Course) => void;
}

export interface TeacherCourseStudentsProps {
    courseId: string;
    courseName: string;
    onClose: () => void;
}

export interface EditScoreState {
    studentId: string;
    score: string;
}

export type TeacherFormData = z.infer<typeof teacherSchema>;

export interface TeacherFormProps {
    teacher?: Teacher;
    onSubmit: (data: Teacher) => void;
    onCancel: () => void;
}

export interface TeacherListProps {
    teachers: Teacher[];
    onEdit?: (teacher: Teacher) => void;
    onDelete?: (id: string) => void;
    onViewCourses?: (teacherId: string) => void;
    onManageCourses?: (teacher: Teacher) => void;
}

export interface ActionsProps {
    teacher: Teacher;
    userRole?: string;
    onEdit?: (teacher: Teacher) => void;
    onDelete?: (id: string) => void;
    onManageCourses?: (teacher: Teacher) => void;
}

export interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    fullScreen?: boolean;
}
