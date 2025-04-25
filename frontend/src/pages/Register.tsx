import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, role, name);
      navigate('/');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="relative h-48 mb-8 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1000"
            alt="Education"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <h1 className="absolute bottom-4 left-4 text-3xl font-bold text-white">Create Account</h1>
        </div>
        
        <div className="bg-neutral-50 dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200"
              >
                {error}
              </motion.div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-white">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            
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
            Already have an account?{' '}
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