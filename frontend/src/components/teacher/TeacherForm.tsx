import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Course, TeacherFormData, TeacherFormProps } from "../../types";
import { teacherSchema } from "../../utils/schemas";
import { TeacherIdField, TeacherNameField } from "../../utils/fields";

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
            {isEdit ? "Update" : "Add"} Teacher
        </button>
    </div>
);

export const TeacherForm: React.FC<TeacherFormProps> = ({
    teacher,
    onSubmit,
    onCancel,
}) => {
    const [selectedCourses] = useState<Course[]>(teacher?.courses || []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TeacherFormData>({
        resolver: zodResolver(teacherSchema),
        defaultValues: teacher
            ? { id: teacher.id, name: teacher.name }
            : { id: "00000", name: "" },
    });

    const onFormSubmit = (data: TeacherFormData) => {
        onSubmit({
            ...data,
            courses: selectedCourses,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
                    {teacher ? "Edit Teacher" : "Add New Teacher"}
                </h2>
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {teacher && (
                                <TeacherIdField
                                    register={register}
                                    error={errors.id?.message}
                                />
                            )}
                            <TeacherNameField
                                register={register}
                                error={errors.name?.message}
                            />
                        </div>
                    </div>
                    <FormActions onCancel={onCancel} isEdit={!!teacher} />
                </form>
            </div>
        </div>
    );
};
