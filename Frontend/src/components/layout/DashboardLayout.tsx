import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Helper to determine the header page title dynamically based on routing path
  const getHeaderTitle = (): string => {
    const path = location.pathname;
    
    if (path.includes('/employee/dashboard')) return 'Employee Learning Dashboard';
    if (path.includes('/employee/courses')) {
      if (path.includes('/quiz')) return 'Assessment';
      if (path.includes('/result')) return 'Assessment Result';
      return 'My Assigned Courses';
    }
    if (path.includes('/employee/certificates')) return 'My Certifications';
    if (path.includes('/employee/profile')) return 'My Profile';

    if (path.includes('/admin/dashboard')) return 'HR Analytics & LMS Dashboard';
    if (path.includes('/admin/courses')) {
      if (path.includes('/create')) return 'Create New Course Curriculum';
      return 'Course Catalog Administration';
    }
    if (path.includes('/admin/assignments')) return 'Course Enrollments Manager';
    if (path.includes('/admin/employees')) return 'Employee Training Registry';
    if (path.includes('/admin/skill-matrix')) return 'Corporate Skill Gap Matrix';
    if (path.includes('/admin/profile')) return 'HR Admin Profile';

    return 'Learning Management System';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-45 md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
          />
          {/* Slide Drawer */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-slate-900 border-r border-slate-800 animate-in slide-in-from-left duration-250 z-50">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Frame content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          onMenuClick={() => setMobileSidebarOpen(true)} 
          title={getHeaderTitle()} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
