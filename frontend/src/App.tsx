import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Sun, Moon, GraduationCap, BookOpen, UserCog, School, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentsPage } from './pages/Students';
import { TeachersPage } from './pages/Teachers';
import { CoursesPage } from './pages/Courses';
import { ClassesPage } from './pages/Classes';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { AccountPage } from './pages/Account';
import { CollegeInfo } from './pages/CollegeInfo';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center group">
            <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <span className="ml-2 text-xl font-bold text-neutral-900 dark:text-white">
              EduManager
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/classes" 
                    title="Classes"
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                  >
                    <School className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/teachers" 
                    title="Teachers"
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                  >
                    <UserCog className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/courses" 
                    title="Courses"
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/account"
                    title="Account"
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logout}
                  title="Logout"
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </motion.button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={
                    <PageTransition>
                      <CollegeInfo />
                    </PageTransition>
                  } />
                  <Route path="/login" element={
                    <PageTransition>
                      <LoginPage />
                    </PageTransition>
                  } />
                  <Route path="/register" element={
                    <PageTransition>
                      <RegisterPage />
                    </PageTransition>
                  } />
                  <Route path="/account" element={
                    <ProtectedRoute>
                      <PageTransition>
                        <AccountPage />
                      </PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/students" element={
                    <ProtectedRoute>
                      <PageTransition>
                        <StudentsPage />
                      </PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/teachers" element={
                    <ProtectedRoute>
                      <PageTransition>
                        <TeachersPage />
                      </PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/courses" element={
                    <ProtectedRoute>
                      <PageTransition>
                        <CoursesPage />
                      </PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/classes" element={
                    <ProtectedRoute>
                      <PageTransition>
                        <ClassesPage />
                      </PageTransition>
                    </ProtectedRoute>
                  } />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;