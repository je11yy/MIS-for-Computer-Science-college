import { motion } from "framer-motion";
import { LoadingSpinnerProps } from "../types";

export const LoadingSpinner = ({
    size = "md",
    fullScreen = false,
}: LoadingSpinnerProps) => {
    const sizes = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    const spinner = (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${sizes[size]} border-2 border-solid rounded-full border-neutral-500 border-t-transparent dark:border-neutral-200 dark:border-t-transparent`}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center p-4">{spinner}</div>
    );
};
