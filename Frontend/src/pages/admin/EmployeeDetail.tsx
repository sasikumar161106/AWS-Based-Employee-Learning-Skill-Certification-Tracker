import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAssignments } from '../../hooks/useAssignments';
import { useCourses } from '../../hooks/useCourses';
import { useCertificates } from '../../hooks/useCertificates';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { LoadingState } from '../../components/ui/LoadingState';
import { CourseStatusBadge } from '../../components/courses/CourseStatusBadge';
import { ArrowLeft, Mail, Award } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { User, Assignment, Certificate } from '../../types';

export const AdminEmployeeDetail: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();

  const { fetchEmployeeAssignments, loading: asgLoading } = useAssignments();
  const { courses, loading: coursesLoading } = useCourses();
  const { fetchCertificates } = useCertificates();

  const [employee, setEmployee] = useState<User | null>(null);
  const [empAsgs, setEmpAsgs] = useState<Assignment[]>([]);
  const [empCerts, setEmpCerts] = useState<Certificate[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(true);

  useEffect(() => {
    const loadEmployeeData = async () => {
      if (!employeeId) return;
      setLoadingLocal(true);
      try {
        const profile = await authService.getEmployeeById(employeeId);
        setEmployee(profile);
        
        const userAsgs = await fetchEmployeeAssignments(employeeId);
        setEmpAsgs(userAsgs);

        const userCerts = await fetchCertificates(employeeId);
        setEmpCerts(userCerts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLocal(false);
      }
    };
    loadEmployeeData();
  }, [employeeId, fetchEmployeeAssignments, fetchCertificates]);

  if (coursesLoading || asgLoading || loadingLocal) {
    return <LoadingState type="profile" />;
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">Employee record not found.</h2>
        <Button onClick={() => navigate('/admin/employees')} className="mt-4">
          Return to Registry
        </Button>
      </div>
    );
  }

  // Statistics summaries
  const totalCourses = empAsgs.length;
  const completedCount = empAsgs.filter(a => a.status === 'completed').length;
  const overdueCount = empAsgs.filter(a => a.status === 'overdue').length;
  const inProgressCount = empAsgs.filter(a => a.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/admin/employees')}
          className="text-slate-500 hover:text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-xs"
          aria-label="Back to registry"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          HR Management / Staff Transcripts Audit
        </span>
      </div>

      {/* Employee Profile Header Card */}
      <Card className="bg-white border border-slate-200">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-850 font-bold flex items-center justify-center text-2xl border border-brand-200 shadow-inner select-none shrink-0">
              {employee.name.split(' ').map(n=>n[0]).join('')}
            </div>
            
            <div className="space-y-1.5 min-w-0">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">{employee.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100 border text-slate-700">{employee.department}</span>
                <span className="text-slate-400 font-bold">•</span>
                <span className="font-mono text-slate-450">ID: {employee.id}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{employee.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics columns */}
          <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 shrink-0 text-center select-none w-full md:w-auto">
            <div>
              <span className="text-slate-450 uppercase font-bold tracking-widest text-[9px] block">Enrolled</span>
              <span className="text-xl font-black text-slate-905 block mt-1">{totalCourses}</span>
            </div>
            <div>
              <span className="text-slate-450 uppercase font-bold tracking-widest text-[9px] block">Completed</span>
              <span className="text-xl font-black text-emerald-600 block mt-1">{completedCount}</span>
            </div>
            <div>
              <span className="text-slate-450 uppercase font-bold tracking-widest text-[9px] block">Overdue</span>
              <span className="text-xl font-black text-rose-600 block mt-1">{overdueCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Course checklist progress + Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Enrolled Courses List Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 leading-none">
            Assigned Course Curriculums
          </h3>

          {empAsgs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-sm font-medium text-slate-450">
                No courses assigned to this employee. Use the enrollment panel to assign training.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {empAsgs.map(asg => {
                const c = courses.find(item => item.id === asg.courseId);
                if (!c) return null;
                return (
                  <Card key={asg.id} className="bg-white">
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Name & status */}
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <CourseStatusBadge status={asg.status} />
                          <span className="text-[10px] text-brand-600 uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 border border-brand-100">
                            {c.skill}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug truncate">
                          {c.title}
                        </h4>
                        
                        {/* Progress Bar widget */}
                        <div className="flex items-center gap-3 pt-1">
                          <ProgressBar progress={asg.progress} className="w-24 sm:w-32" color={asg.status === 'overdue' ? 'danger' : 'brand'} />
                          <span className="text-xs font-bold text-slate-700">{asg.progress}% Complete</span>
                        </div>
                      </div>

                      {/* Deadlines and Scores */}
                      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-5 shrink-0 gap-3 text-xs text-slate-500 select-none">
                        {asg.status === 'completed' ? (
                          <div className="text-left sm:text-right">
                            <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-widest leading-none">Assessment Score</span>
                            <span className="font-bold text-emerald-650 block mt-1 text-sm">{asg.score || 0}% PASSED</span>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Completed: {formatDate(asg.completedDate)}</span>
                          </div>
                        ) : (
                          <div className="text-left sm:text-right">
                            <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-widest leading-none">Enrollment Deadline</span>
                            <span className={`font-bold block mt-1 ${asg.status === 'overdue' ? 'text-rose-600' : 'text-slate-700'}`}>
                              {formatDate(asg.dueDate)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Attempts Left: {asg.attemptsRemaining}</span>
                          </div>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Certificates achieved */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 leading-none">
            Earned Certifications
          </h3>

          <Card>
            <CardHeader className="py-3">
              <span className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Validated Credentials</span>
            </CardHeader>
            <CardContent className="p-0">
              {empCerts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-450 font-medium font-serif italic">
                  No verified certificates generated for this employee.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {empCerts.map(cert => (
                    <div key={cert.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-4">
                      <div className="min-w-0 flex items-center gap-2.5">
                        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-1.5 rounded-lg shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-800 block truncate leading-tight" title={cert.courseName}>{cert.courseName}</span>
                          <span className="text-[10px] text-slate-450 font-mono tracking-tight font-semibold block mt-0.5">
                            ID: {cert.id}
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            Earned: {formatDate(cert.completionDate)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[8px] px-1 py-0 shrink-0">Verified</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
export default AdminEmployeeDetail;
