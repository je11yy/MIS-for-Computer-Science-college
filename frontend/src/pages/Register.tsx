import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

const InputField: React.FC<{
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}> = ({ label, type = "text", value, onChange, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-neutral-900 dark:text-white">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors"
        />
    </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 rounded bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200"
    >
        {message}
    </motion.div>
);

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [studentId, setStudentId] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            await register(username, password, studentId, teacherId);
            navigate("/");
        } catch (err) {
            setError("Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white text-center">
                        Create Account
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <ErrorMessage message={error} />}
                        {isLoading && <LoadingSpinner />}

                        <InputField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <InputField
                            label="Student ID (optional)"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                        />
                        <InputField
                            label="Teacher ID (optional)"
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-2 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                            Register
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-neutral-900 dark:text-white hover:underline"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
