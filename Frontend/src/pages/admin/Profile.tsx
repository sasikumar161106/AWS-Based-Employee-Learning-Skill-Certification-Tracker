import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Save, Mail } from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('+91 9876543210');
  const [bio, setBio] = useState('Lead HR Administrator managing curricula configuration, employee enrollments, compliance audits, and matrices.');
  const [submitting, setSubmitting] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const updated = await authService.updateProfile(user.id, {
        name,
      });
      updateUser(updated);
      showToast('Admin profile settings updated successfully!', 'success');
    } catch (err: any) {
      showToast('Error updating profile credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
          HR Administrator Profile
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Manage your contact credentials, avatar settings, and security overrides.
        </p>
      </div>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Account Card */}
        <div className="space-y-6">
          <Card className="bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <Avatar name={user.name} src={user.avatar} size="xl" />
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{user.name}</h3>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                  HR Admin Manager
                </span>
              </div>

              {/* Verified Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-150 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Override Enabled</span>
              </div>

              <div className="w-full pt-4 border-t border-slate-100 divide-y divide-slate-100 text-xs text-slate-650">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-450 font-medium">Admin ID:</span>
                  <span className="font-mono font-bold text-slate-800">{user.id}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-450 font-medium">Corporate Email:</span>
                  <span className="font-bold text-slate-800 truncate pl-4">{user.email}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-450 font-medium">Permission Role:</span>
                  <span className="font-bold text-slate-800 uppercase">HR / LMS Owner</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Card: Settings form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleProfileSave} className="space-y-6">
                <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100 leading-none">
                  Admin Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={submitting}
                  />

                  <Input
                    label="Contact Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-slate-700">Responsibility Bio Description</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    disabled={submitting}
                    className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400"
                  />
                </div>

                {/* Simulated notifications toggle settings */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-widest block">LMS Event Heartbeats</span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700 select-none">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-650 focus:ring-brand-500" />
                      <span>Notify me via email when an employee completes a certified course</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700 select-none">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-650 focus:ring-brand-500" />
                      <span>Notify me immediately when training due dates flag as Overdue</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    type="submit"
                    isLoading={submitting}
                    leftIcon={<Save className="w-4 h-4" />}
                    className="font-bold"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
export default AdminProfile;
