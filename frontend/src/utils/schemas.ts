import { z } from "zod";

export const courseSchema = z.object({
    id: z.string().length(7, "Course ID must be 7 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    teacherId: z.string().min(1, "Teacher ID is required"),
    credit: z.number().min(1, "Credit must be at least 1"),
    grade: z.number().min(1, "Grade must be at least 1"),
    canceledYear: z.number().nullable(),
});

export const studentSchema = z.object({
    id: z.string().length(10, "Student ID must be 10 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    sex: z.enum(["male", "female"]),
    entranceAge: z.number().min(10).max(50),
    entranceYear: z.number().min(2000).max(new Date().getFullYear()),
    studentClass: z.string().min(1, "Class is required"),
});

export const teacherSchema = z.object({
    id: z.string().length(5, "Teacher ID must be 5 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
});
