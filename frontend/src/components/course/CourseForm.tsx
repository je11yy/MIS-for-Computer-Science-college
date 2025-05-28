import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
    CourseFormProps,
    FormInputProps,
    CourseFormData,
} from "../../types";
import { courseSchema } from "../../utils/schemas";

const FormInput: React.FC<FormInputProps> = ({
    label,
    type,
    register,
    error,
    disabled = false,
}) => (
    <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
        </label>
        <input
            type={type}
            {...register}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border ${
                error
                    ? "border-red-500 dark:border-red-400"
                    : "border-neutral-300 dark:border-neutral-600"
            } bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:ring-neutral-500 focus:border-neutral-500`}
        />
        {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
            </p>
        )}
    </div>
);

const FormActions: React.FC<{
    onCancel: () => void;
    isEdit: boolean;
}> = ({ onCancel, isEdit }) => (
    <div className="flex justify-end space-x-3 mt-6">
        <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
        >
            Cancel
        </button>
        <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100"
        >
            {isEdit ? "Update" : "Add"} Course
        </button>
    </div>
);

const CourseFormFields: React.FC<{
    register: ReturnType<typeof useForm<CourseFormData>>["register"];
    errors: any;
    isEdit: boolean;
}> = ({ register, errors, isEdit }) => (
    <>
        {isEdit && (
            <FormInput
                label="Course ID"
                type="text"
                register={register("id")}
                error={errors.id?.message}
                disabled
            />
        )}
        <FormInput
            label="Name"
            type="text"
            register={register("name")}
            error={errors.name?.message}
        />
        <FormInput
            label="Credit"
            type="number"
            register={register("credit", { valueAsNumber: true })}
            error={errors.credit?.message}
        />
        <FormInput
            label="Grade"
            type="number"
            register={register("grade", { valueAsNumber: true })}
            error={errors.grade?.message}
        />
        <FormInput
            label="Canceled Year (optional)"
            type="number"
            register={register("canceledYear", { valueAsNumber: true })}
            error={errors.canceledYear?.message}
        />
    </>
);

export const CourseForm: React.FC<CourseFormProps> = ({
    course,
    onSubmit,
    onCancel,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: course || {
            id: "0000000",
            name: "",
            teacherId: "",
            credit: 1,
            grade: 1,
            canceledYear: null,
        },
    });

    const isEdit = Boolean(course);

    return (
        <Modal>
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
                    {isEdit ? "Edit Course" : "Add New Course"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <CourseFormFields
                        register={register}
                        errors={errors}
                        isEdit={isEdit}
                    />
                    <FormActions onCancel={onCancel} isEdit={isEdit} />
                </form>
            </div>
        </Modal>
    );
};

const Modal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        {children}
    </div>
);
