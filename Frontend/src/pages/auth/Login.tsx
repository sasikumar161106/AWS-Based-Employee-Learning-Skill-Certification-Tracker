import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GraduationCap, Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'hr') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err: any) {
      setValidationError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (role: 'employee' | 'hr') => {
    if (role === 'employee') {
      setEmail('employee@example.com');
      setPassword('employee123');
    } else {
      setEmail('hr@example.com');
      setPassword('admin123');
    }
    setValidationError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-brand-600 text-white rounded-2xl p-3 shadow-md mx-auto">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            LearnTracker LMS Enterprise
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">
            Internal Company Learning & Skill Certification Tracker
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="shadow-lg border border-slate-200">
          <CardContent className="p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 leading-none">
              Sign In to Your Account
            </h2>

            {validationError && (
              <div className="flex gap-2.5 p-3.5 bg-rose-50 text-rose-800 rounded-lg border border-rose-100 text-xs font-semibold leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Corporate Email Address"
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="Password"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            {/* Quick Demo Logins */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                Demo Accounts Quick-Fill
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('employee')}
                  className="px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-brand-300 text-xs bg-slate-50/50 hover:bg-brand-50/10 text-left transition-all"
                >
                  <span className="font-bold text-slate-800 block">Demo Employee</span>
                  <span className="text-slate-450 block mt-0.5 font-medium truncate">employee@example.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('hr')}
                  className="px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-brand-300 text-xs bg-slate-50/50 hover:bg-brand-50/10 text-left transition-all"
                >
                  <span className="font-bold text-slate-800 block">Demo HR Admin</span>
                  <span className="text-slate-450 block mt-0.5 font-medium truncate">hr@example.com</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Lookups redirect link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/verify/CERT-2026-001')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 underline focus:outline-none"
          >
            Verify a Certificate Publicly
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
