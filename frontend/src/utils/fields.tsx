import { useForm } from "react-hook-form";
import { StudentFormData, TeacherFormData } from "../types";

const inputClass =
    "mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500";

const Field: React.FC<{
    label: string;
    error?: string;
    children: React.ReactNode;
}> = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
        </label>
        {children}
        {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
            </p>
        )}
    </div>
);

// Form Fields as Mini Components
export const StudentIdField: React.FC<{
    register: ReturnType<typeof useForm<StudentFormData>>["register"];
    error?: string;
    disabled?: boolean;
}> = ({ register, error, disabled }) => (
    <Field label="Student ID" error={error}>
        <input
            type="text"
            {...register("id")}
            className={inputClass}
            disabled={disabled}
        />
    </Field>
);

export const NameField: React.FC<{
    register: ReturnType<typeof useForm<StudentFormData>>["register"];
    error?: string;
}> = ({ register, error }) => (
    <Field label="Name" error={error}>
        <input type="text" {...register("name")} className={inputClass} />
    </Field>
);

export const SexField: React.FC<{
    register: ReturnType<typeof useForm<StudentFormData>>["register"];
    error?: string;
}> = ({ register, error }) => (
    <Field label="Sex" error={error}>
        <select {...register("sex")} className={inputClass}>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
    </Field>
);

export const EntranceAgeField: React.FC<{
    register: ReturnType<typeof useForm<StudentFormData>>["register"];
    error?: string;
}> = ({ register, error }) => (
    <Field label="Entrance Age" error={error}>
        <input
            type="number"
            {...register("entranceAge", { valueAsNumber: true })}
            className={inputClass}
        />
    </Field>
);

export const EntranceYearField: React.FC<{
    register: ReturnType<typeof useForm<StudentFormData>>["register"];
    error?: string;
}> = ({ register, error }) => (
    <Field label="Entrance Year" error={error}>
        <input
            type="number"
            {...register("entranceYear", { valueAsNumber: true })}
            className={inputClass}
        />
    </Field>
);

export const StudentClassField: React.FC<{
    register: ReturnType<typeof useForm<StudentFormData>>["register"];
    error?: string;
}> = ({ register, error }) => (
    <Field label="Class" error={error}>
        <input
            type="text"
            {...register("studentClass")}
            className={inputClass}
        />
    </Field>
);

export const TeacherIdField: React.FC<{
    register: ReturnType<typeof useForm<TeacherFormData>>["register"];
    error?: string;
}> = ({ register, error }) => (
    <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Teacher ID
        </label>
        <input
            type="text"
            {...register("id")}
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
            disabled
        />
        {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
            </p>
        )}
    </div>
);

export const TeacherNameField: React.FC<{
    register: ReturnType<typeof useForm<TeacherFormData>>["register"];
    error?: string;
}> = ({ register, error }) => (
    <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Name
        </label>
        <input
            type="text"
            {...register("name")}
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:border-neutral-500 focus:ring-neutral-500"
        />
        {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
            </p>
        )}
    </div>
);
