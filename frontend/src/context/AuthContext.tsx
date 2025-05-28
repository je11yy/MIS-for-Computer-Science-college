import React, { createContext, useContext, useState } from "react";
import type { User, UserRole } from "../types";
import { login as loginApi, register as registerApi } from "../utils/Fetches";
import { AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return {
                id: payload.username,
                role: payload.role as UserRole,
                name: payload.username,
            };
        } catch (error) {
            localStorage.removeItem("token");
            return null;
        }
    });

    const login = async (username: string, password: string) => {
        try {
            const { token } = await loginApi(username, password);
            localStorage.setItem("token", token);

            const payload = JSON.parse(atob(token.split(".")[1]));
            const userObj: User = {
                role: payload.role as UserRole,
                name: payload.username,
                student_id: payload.student_id,
                teacher_id: payload.teacher_id,
            };

            setUser(userObj);
        } catch (error) {
            throw new Error("Invalid credentials");
        }
    };

    const register = async (
        username: string,
        password: string,
        studentId?: string,
        teacherId?: string
    ) => {
        try {
            await registerApi(
                username,
                password,
                studentId || "",
                teacherId || ""
            );
            await login(username, password);
        } catch (error) {
            throw new Error("Registration failed");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
