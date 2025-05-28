import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentFormData, StudentFormProps } from "../../types";
import { studentSchema } from "../../utils/schemas";
import {
    EntranceAgeField,
    EntranceYearField,
    NameField,
    SexField,
    StudentClassField,
    StudentIdField,
} from "../../utils/fields";

// Main Form
export const StudentForm: React.FC<StudentFormProps> = ({
    student,
    onSubmit,
    onCancel,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: student
            ? { ...student, sex: student.sex === "male" ? "male" : "female" }
            : {
                  id: "0000000000",
                  name: "",
                  sex: "male",
                  entranceAge: 18,
                  entranceYear: new Date().getFullYear(),
                  studentClass: "",
              },
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
                    {student ? "Edit Student" : "Add New Student"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {student && (
                        <StudentIdField
                            register={register}
                            error={errors.id?.message}
                            disabled
                        />
                    )}
                    <NameField
                        register={register}
                        error={errors.name?.message}
                    />
                    <SexField register={register} error={errors.sex?.message} />
                    <EntranceAgeField
                        register={register}
                        error={errors.entranceAge?.message}
                    />
                    <EntranceYearField
                        register={register}
                        error={errors.entranceYear?.message}
                    />
                    <StudentClassField
                        register={register}
                        error={errors.studentClass?.message}
                    />

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
                            {student ? "Update" : "Add"} Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
