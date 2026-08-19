import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, LogOut, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

interface MockNotification {
  id: string;
  message: string;
  time: string;
  unread: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<MockNotification[]>([
    {
      id: 'n1',
      message: 'New course assigned: Python for Data Analytics',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 'n2',
      message: 'Your AWS Cloud Fundamentals course is due in 5 days!',
      time: '1 day ago',
      unread: true
    },
    {
      id: 'n3',
      message: 'Certificate successfully generated for AWS Fundamentals',
      time: '3 days ago',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'success');
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-base md:text-lg font-bold text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-none">
            {title}
          </h1>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2.5 md:gap-4">
        {/* Search placeholder (aesthetic only) */}
        <div className="hidden sm:relative max-w-xs md:max-w-sm w-44 md:w-60">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Global search courses..."
            disabled
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 placeholder:text-slate-450 focus:outline-none disabled:cursor-not-allowed"
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-150 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-brand-600 hover:text-brand-700 text-xs font-semibold"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No new alerts</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-3 text-xs transition-colors flex items-start gap-2.5 ${n.unread ? 'bg-brand-50/40' : 'hover:bg-slate-50'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-brand-500' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className="text-slate-700 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-lg transition-colors text-left"
              aria-label="User settings"
            >
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-inner">
                {user.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div className="hidden md:block">
                <div className="font-semibold text-xs text-slate-800 leading-none">{user.name}</div>
                <div className="text-[10px] text-slate-450 mt-0.5 uppercase tracking-wider font-bold">
                  {user.role === 'hr' ? 'Admin' : user.department}
                </div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate(user.role === 'hr' ? '/admin/profile' : '/employee/profile');
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-semibold text-rose-650 hover:bg-rose-50/50 transition-colors border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
