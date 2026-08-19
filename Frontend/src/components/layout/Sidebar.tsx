import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  User, 
  Settings, 
  LogOut, 
  UserCheck, 
  Users, 
  BarChart2,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      navigate('/login');
    } catch (err) {
      showToast('Error logging out', 'error');
    }
  };

  const employeeLinks = [
    { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employee/courses', label: 'My Courses', icon: BookOpen },
    { to: '/employee/certificates', label: 'Certificates', icon: Award },
    { to: '/employee/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/assignments', label: 'Assignments', icon: UserCheck },
    { to: '/admin/employees', label: 'Employees', icon: Users },
    { to: '/admin/skill-matrix', label: 'Skill Matrix', icon: BarChart2 },
    { to: '/admin/profile', label: 'Profile', icon: User },
  ];

  const links = role === 'hr' ? adminLinks : employeeLinks;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-600 rounded-lg p-1.5 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg leading-none tracking-tight">
            LearnTracker <span className="text-brand-500 font-medium text-xs block mt-0.5">LMS Enterprise</span>
          </span>
        </div>
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile} 
            className="md:hidden text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Card (Static summary in sidebar) */}
      {user && (
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/20 shrink-0 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 font-bold flex items-center justify-center text-sm shrink-0">
            {user.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate text-slate-100">{user.name}</div>
            <div className="text-xs text-slate-400 font-medium truncate capitalize">
              {role === 'hr' ? 'HR Administrator' : `${user.department} Team`}
            </div>
          </div>
        </div>
      )}

      {/* Main Nav Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-350 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Nav Links */}
      <div className="p-4 border-t border-slate-800/80 space-y-1 shrink-0 bg-slate-950/10">
        <NavLink
          to={role === 'hr' ? '/admin/profile' : '/employee/profile'}
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
