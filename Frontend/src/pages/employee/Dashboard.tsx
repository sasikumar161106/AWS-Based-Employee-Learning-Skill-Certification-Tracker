import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';
import { useCertificates } from '../../hooks/useCertificates';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/dashboard/StatCard';
import { CourseCard } from '../../components/courses/CourseCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  BookOpen, 
  Hourglass, 
  CheckCircle, 
  Award, 
  Calendar, 
  ChevronRight, 
  FileText 
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Course, Assignment, Certificate } from '../../types';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { employeeStats, fetchEmployeeStats, loading: statsLoading } = useDashboard();
  const { courses, loading: coursesLoading } = useCourses();
  const { fetchEmployeeAssignments } = useAssignments();
  const { certificates, fetchCertificates } = useCertificates();

  const [assignedAsgs, setAssignedAsgs] = useState<Assignment[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(true);

  useEffect(() => {
    if (user) {
      const loadDashboardData = async () => {
        setLoadingLocal(true);
        await fetchEmployeeStats(user.id);
        const userAsgs = await fetchEmployeeAssignments(user.id);
        setAssignedAsgs(userAsgs);
        await fetchCertificates(user.id);
        setLoadingLocal(false);
      };
      loadDashboardData();
    }
  }, [user, fetchEmployeeStats, fetchEmployeeAssignments, fetchCertificates]);

  if (statsLoading || coursesLoading || loadingLocal) {
    return <LoadingState type="card" rows={3} />;
  }

  // Active courses (Not Completed)
  const activeAssignments = assignedAsgs.filter(a => a.status !== 'completed');
  
  // Completed courses
  const completedAssignments = assignedAsgs.filter(a => a.status === 'completed');

  // Map courses to their assignment states
  const activeCourseCards = activeAssignments.map(asg => {
    const course = courses.find(c => c.id === asg.courseId);
    return { asg, course };
  }).filter(item => item.course !== undefined) as { asg: Assignment; course: Course }[];

  // Deadlines (sorted by due date)
  const deadlines = [...activeAssignments]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3)
    .map(asg => {
      const course = courses.find(c => c.id === asg.courseId);
      return { asg, course };
    }).filter(item => item.course !== undefined) as { asg: Assignment; course: Course }[];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
            Good morning, {user?.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Track your corporate courses, complete modules, and verify skill certificates.
          </p>
        </div>
        <div className="hidden sm:block text-slate-400 font-bold bg-slate-50 p-2 border border-slate-100 rounded-lg text-xs shrink-0">
          Dept: {user?.department}
        </div>
      </div>

      {/* Analytics Statistics Row */}
      {employeeStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Assigned Courses"
            value={employeeStats.assignedCourses}
            icon={BookOpen}
            description="Total enrolled courses"
            color="brand"
          />
          <StatCard
            title="In Progress"
            value={employeeStats.inProgress}
            icon={Hourglass}
            description="Active study items"
            color="warning"
          />
          <StatCard
            title="Completed"
            value={employeeStats.completed}
            icon={CheckCircle}
            description="Finished curriculums"
            color="success"
          />
          <StatCard
            title="Certificates"
            value={employeeStats.certificates}
            icon={Award}
            description="Verified credentials"
            color="info"
          />
        </div>
      )}

      {/* Main Grid: Courses + sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Continue Learning list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 leading-none">
              Continue Learning
            </h3>
            <button 
              onClick={() => navigate('/employee/courses')}
              className="text-xs font-bold text-brand-650 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View all courses</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {activeCourseCards.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="All caught up!"
              description="You currently do not have any pending or in-progress courses. Contact HR to request enrollments."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeCourseCards.map(({ course, asg }) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  assignment={asg}
                  onActionClick={() => navigate(`/employee/courses/${course.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side Panels: Deadlines & Recent Certificates */}
        <div className="space-y-6">
          
          {/* Deadlines Section */}
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-sm font-bold text-slate-900 leading-none">Upcoming Deadlines</h3>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 p-0">
              {deadlines.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-450 font-medium">No deadlines pending</div>
              ) : (
                deadlines.map(({ course, asg }) => {
                  const isOverdue = asg.status === 'overdue';
                  return (
                    <div 
                      key={asg.id} 
                      onClick={() => navigate(`/employee/courses/${course.id}`)}
                      className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer flex items-start gap-3 justify-between"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-800 truncate block">{course.title}</span>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className={isOverdue ? 'text-rose-600' : 'text-slate-500'}>
                            {isOverdue ? 'Overdue: ' : 'Due: '}
                            {formatDate(asg.dueDate)}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center justify-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isOverdue 
                            ? 'bg-rose-50 border-rose-200 text-rose-700' 
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                          {isOverdue ? 'Overdue' : `${asg.progress}%`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Certificates Section */}
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-sm font-bold text-slate-900 leading-none">Recent Certificates</h3>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 p-0">
              {certificates.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-450 font-medium">No certificates earned yet</div>
              ) : (
                [...certificates]
                  .sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime())
                  .slice(0, 3)
                  .map(cert => (
                    <div 
                      key={cert.id}
                      onClick={() => navigate('/employee/certificates')}
                      className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-1.5 rounded-lg shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-800 block truncate">{cert.courseName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                            ID: {cert.id}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-450 shrink-0" />
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
export default EmployeeDashboard;
