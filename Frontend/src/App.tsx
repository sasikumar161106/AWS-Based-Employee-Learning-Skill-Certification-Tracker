import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { Login } from './pages/auth/Login';
import { VerifyCertificate } from './pages/auth/VerifyCertificate';

// Employee Pages
import { EmployeeDashboard } from './pages/employee/Dashboard';
import { EmployeeCourses } from './pages/employee/Courses';
import { EmployeeCourseDetail } from './pages/employee/CourseDetail';
import { Quiz } from './pages/employee/Quiz';
import { QuizResult } from './pages/employee/QuizResult';
import { EmployeeCertificates } from './pages/employee/Certificates';
import { Profile as EmployeeProfile } from './pages/employee/Profile';

// HR Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminCourses } from './pages/admin/Courses';
import { CreateCourse } from './pages/admin/CreateCourse';
import { AdminEmployeeDetail } from './pages/admin/EmployeeDetail';
import { AdminAssignments } from './pages/admin/Assignments';
import { AdminEmployees } from './pages/admin/Employees';
import { AdminSkillMatrix } from './pages/admin/SkillMatrix';
import { AdminProfile } from './pages/admin/Profile';

// Protected Route Guard Wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "employee" | "hr";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Validating Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    // If logged in but wrong role, route to correct dashboard
    return role === 'hr' 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/employee/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
        
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Employee Routes (Protected) */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRole="employee">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="courses" element={<EmployeeCourses />} />
          <Route path="courses/:courseId" element={<EmployeeCourseDetail />} />
          <Route path="courses/:courseId/quiz" element={<Quiz />} />
          <Route path="courses/:courseId/result" element={<QuizResult />} />
          <Route path="certificates" element={<EmployeeCertificates />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* HR Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="hr">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/:courseId" element={<AdminCourses />} /> {/* Admin course detail redirects to course list management */}
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="employees/:employeeId" element={<AdminEmployeeDetail />} />
          <Route path="skill-matrix" element={<AdminSkillMatrix />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
