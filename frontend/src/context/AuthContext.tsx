import React, { createContext, useContext, useState } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const users: { email: string; password: string; role: UserRole; name: string }[] = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'teacher@example.com', password: 'teacher123', role: 'teacher', name: 'Teacher User' },
  { email: 'student@example.com', password: 'student123', role: 'student', name: 'Student User' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    const userObj: User = { id: email, role: foundUser.role, name: foundUser.name };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const register = async (email: string, password: string, role: UserRole, name: string) => {
    if (users.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    users.push({ email, password, role, name });
    const userObj: User = { id: email, role, name };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};