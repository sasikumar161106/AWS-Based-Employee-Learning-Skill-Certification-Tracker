import React, { useEffect } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/dashboard/StatCard';
import { CourseCompletionChart, DeptComplianceChart } from '../../components/dashboard/ComplianceChart';
import { ActivityList } from '../../components/dashboard/ActivityList';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Users, BookOpen, Percent, AlertCircle, Calendar, ArrowRight, UserPlus } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const AdminDashboard: React.FC = () => {
  const { adminStats, fetchAdminStats, loading } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  if (loading || !adminStats) {
    return <LoadingState type="card" rows={3} />;
  }

  const {
    totalEmployees,
    activeCourses,
    completionRate,
    overdueCourses,
    completionDistribution,
    departmentCompliance,
    recentActivity,
    overdueTrainingList
  } = adminStats;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
            HR Analytics Dashboard
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Monitor compliance rates, assign corporate courses, manage curricula, and audit skill matrices.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            onClick={() => navigate('/admin/assignments')} 
            size="sm"
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Assign Courses
          </Button>
        </div>
      </div>

      {/* Global Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          description="Registered learners"
          color="brand"
        />
        <StatCard
          title="Active Courses"
          value={activeCourses}
          icon={BookOpen}
          description="Curricula in catalog"
          color="info"
        />
        <StatCard
          title="Average Compliance"
          value={`${completionRate}%`}
          icon={Percent}
          description="Total completion rate"
          color="success"
        />
        <StatCard
          title="Overdue Trainings"
          value={overdueCourses}
          icon={AlertCircle}
          description="Pending past due-date"
          color="danger"
        />
      </div>

      {/* Recharts Analytics Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Course Completion Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Course Completion Distribution</h3>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <CourseCompletionChart data={completionDistribution} />
          </CardContent>
        </Card>

        {/* Department Compliance Rates */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Department Compliance Rates</h3>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <DeptComplianceChart data={departmentCompliance} />
          </CardContent>
        </Card>

      </div>

      {/* Overdue trainings & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overdue trainings list (takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 leading-none">
              Urgent Overdue Enrollments
            </h3>
            <button 
              onClick={() => navigate('/admin/employees')}
              className="text-xs font-bold text-brand-650 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View all employee statuses</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Card>
            <CardContent className="p-0 overflow-hidden">
              {overdueTrainingList.length === 0 ? (
                <div className="p-8 text-center text-sm font-medium text-slate-450">
                  ✓ Great news! There are no overdue course completions in the company.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-450 uppercase tracking-wider select-none">
                        <th className="px-6 py-3">Employee</th>
                        <th className="px-6 py-3">Course</th>
                        <th className="px-6 py-3">Due Date</th>
                        <th className="px-6 py-3">Progress</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-650">
                      {overdueTrainingList.map((row: any) => (
                        <tr key={row.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-900">{row.employeeName}</td>
                          <td className="px-6 py-4">{row.courseName}</td>
                          <td className="px-6 py-4 text-rose-600 font-bold">{formatDate(row.dueDate)}</td>
                          <td className="px-6 py-4 max-w-[120px]">
                            <div className="flex items-center gap-2">
                              <ProgressBar progress={row.progress} color="danger" className="w-16" />
                              <span>{row.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate(`/admin/employees/${row.employeeId}`)}
                              className="text-brand-600 hover:text-brand-700 font-bold"
                            >
                              Audit Log
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity List Log */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 leading-none">
            Recent System Activity
          </h3>
          <Card>
            <CardContent className="p-6">
              <ActivityList logs={recentActivity} />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

// Simple Chevron helper
const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);
export default AdminDashboard;
