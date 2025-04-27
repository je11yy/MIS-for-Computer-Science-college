import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Sun, Moon, GraduationCap, BookOpen, Users, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentsPage } from './pages/Students';
import { CoursesPage } from './pages/Courses';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';

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
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center group">
              <GraduationCap className="h-8 w-8 text-neutral-900 dark:text-white" />
              <span className="ml-2 text-xl font-bold text-neutral-900 dark:text-white">
                EduManager
              </span>
            </Link>
          </motion.div>
          {user && (
            <div className="flex items-center space-x-6">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link 
                  to="/students" 
                  className="flex items-center space-x-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Students</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link 
                  to="/courses" 
                  className="flex items-center space-x-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Courses</span>
                </Link>
              </motion.div>
              {user.role === 'admin' && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                  >
                    <UserCog className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={logout}
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                Logout
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>
            </div>
          )}
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
          <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-200">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                <Routes>
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
                  <Route path="/" element={
                    <ProtectedRoute>
                      <PageTransition>
                        <div className="text-center space-y-8">
                          <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-bold text-neutral-900 dark:text-white"
                          >
                            Welcome to EduManager
                          </motion.h1>
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-neutral-600 dark:text-neutral-300"
                          >
                            Manage your educational institution with ease
                          </motion.p>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="relative h-64 rounded-xl overflow-hidden mb-12"
                          >
                            <img 
                              src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=2000"
                              alt="Education"
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="group"
                            >
                              <Link to="/students" className="block p-6 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all">
                                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                                  <img 
                                    src="https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800"
                                    alt="Students"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  <Users className="absolute bottom-4 left-4 h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Student Management</h2>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-400">Manage student records and academic progress</p>
                              </Link>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="group"
                            >
                              <Link to="/courses" className="block p-6 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all">
                                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                                  <img 
                                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800"
                                    alt="Courses"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  <BookOpen className="absolute bottom-4 left-4 h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Course Management</h2>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-400">Organize and track course information</p>
                              </Link>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="group"
                            >
                              <Link to="/admin" className="block p-6 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all">
                                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                                  <img 
                                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800"
                                    alt="Administration"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  <UserCog className="absolute bottom-4 left-4 h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Administration</h2>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-400">Access administrative tools and settings</p>
                              </Link>
                            </motion.div>
                          </div>
                        </div>
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
                  <Route path="/courses" element={
                    <ProtectedRoute>
                      <PageTransition>
                        <CoursesPage />
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