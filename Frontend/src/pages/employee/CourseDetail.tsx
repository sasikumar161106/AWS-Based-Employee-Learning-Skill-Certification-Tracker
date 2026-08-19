import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { CourseStatusBadge } from '../../components/courses/CourseStatusBadge';
import { LoadingState } from '../../components/ui/LoadingState';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  User, 
  Clock, 
  Award,
  Video,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Course, Assignment } from '../../types';

export const EmployeeCourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { getCourseById, loading: coursesLoading } = useCourses();
  const { fetchEmployeeAssignments, updateProgress, loading: asgLoading } = useAssignments();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [loadingLocal, setLoadingLocal] = useState(true);

  const fetchDetails = async () => {
    if (!courseId || !user) return;
    setLoadingLocal(true);
    try {
      const courseData = await getCourseById(courseId);
      setCourse(courseData);

      const userAsgs = await fetchEmployeeAssignments(user.id);
      const matchedAsg = userAsgs.find(a => a.courseId === courseId);
      if (matchedAsg) {
        setAssignment(matchedAsg);
        
        // Calculate appropriate active module based on progress percentage
        // e.g. 50% progress -> Module 3 is active (index 2)
        const progressCount = Math.floor(matchedAsg.progress / 25);
        setActiveModuleIndex(Math.min(3, progressCount));
      } else {
        showToast('You are not assigned to this course.', 'error');
        navigate('/employee/courses');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocal(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [courseId, user]);

  const activeModule = useMemo(() => {
    if (!course || !course.modules) return null;
    return course.modules[activeModuleIndex] || course.modules[0];
  }, [course, activeModuleIndex]);

  // Determine if modules are checked based on progress percentage
  // Progress is simulated as: Module 1 checked = 25%, Module 2 checked = 50%, etc.
  const isModuleCompleted = (index: number) => {
    if (!assignment) return false;
    return assignment.progress >= (index + 1) * 25;
  };

  const handleMarkModuleComplete = async () => {
    if (!assignment || !course || !user) return;

    const nextProgress = Math.min(100, (activeModuleIndex + 1) * 25);
    
    // Only update progress if the new module progress is greater than current
    if (nextProgress > assignment.progress) {
      const updated = await updateProgress(user.id, course.id, nextProgress);
      if (updated) {
        setAssignment(updated);
        showToast(`Completed ${course.modules[activeModuleIndex].title}!`, 'success');
      }
    }

    // Switch to next module if available
    if (activeModuleIndex < 3) {
      setActiveModuleIndex(prev => prev + 1);
    }
  };

  if (coursesLoading || asgLoading || loadingLocal) {
    return <LoadingState type="profile" />;
  }

  if (!course || !assignment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">Course enrollment details not found.</h2>
        <Button onClick={() => navigate('/employee/courses')} className="mt-4">
          Return to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/employee/courses')}
          className="text-slate-500 hover:text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-xs"
          aria-label="Back to courses"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          My Courses / {course.category}
        </span>
      </div>

      {/* Course Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 px-2 py-0.5 rounded bg-brand-50 border border-brand-100">
                {course.skill} competency
              </span>
              <CourseStatusBadge status={assignment.status} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
              {course.title}
            </h2>
            <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Instructor & Duration cards */}
          <div className="flex flex-row md:flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><User className="w-4 h-4 text-slate-400" /></div>
              <div>
                <span className="text-slate-450 block font-medium uppercase tracking-widest text-[9px] leading-none">Instructor</span>
                <span className="font-bold text-slate-800 block mt-1">{course.instructor.split(' (')[0]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><Clock className="w-4 h-4 text-slate-400" /></div>
              <div>
                <span className="text-slate-450 block font-medium uppercase tracking-widest text-[9px] leading-none">Duration</span>
                <span className="font-bold text-slate-800 block mt-1">{course.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-6 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Overall Syllabus Completion</span>
            <span>{assignment.progress}% Completed</span>
          </div>
          <ProgressBar progress={assignment.progress} showText={false} />
        </div>
      </div>

      {/* Main Panel Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Active Module content viewer */}
        {activeModule && (
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-100 bg-slate-50/50">
                <div className="bg-brand-50 p-2 rounded-lg text-brand-600 border border-brand-100">
                  <Video className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 leading-none truncate">{activeModule.title}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Duration: {activeModule.duration}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Simulated Video Placeholder */}
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-inner p-6 text-center select-none">
                  <div className="rounded-full bg-slate-800/80 p-4 border border-slate-700 text-brand-400 mb-3 shadow-md">
                    <Play className="w-8 h-8 fill-brand-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">{activeModule.title} Lecture Video</h4>
                  <p className="text-[11px] text-slate-450 mt-1.5 max-w-xs leading-normal font-semibold">
                    Video streaming is disabled in mock preview mode. Please review the lecture notes and required reading documentation below.
                  </p>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-3 bg-slate-950 px-2.5 py-1 rounded">
                    Duration: {activeModule.duration}
                  </span>
                </div>

                {/* Module Reading Material */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-950 pb-2 border-b border-slate-100">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <h4 className="font-extrabold text-sm">Required Reading Documentation</h4>
                  </div>
                  <p className="text-sm text-slate-650 leading-relaxed font-sans whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                    {activeModule.readingContent}
                  </p>
                </div>
              </CardContent>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-450 font-semibold italic">
                  Complete reading and video review to unlock assessment questions.
                </span>
                
                <Button
                  onClick={handleMarkModuleComplete}
                  variant={isModuleCompleted(activeModuleIndex) ? 'outline' : 'primary'}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {isModuleCompleted(activeModuleIndex) ? 'Module Completed (Next)' : 'Mark Module Complete'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Right Side: Syllabus Index */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-4">
              <h3 className="text-sm font-bold text-slate-900 leading-none">Course Syllabus</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {course.modules.map((mod, idx) => {
                  const isActive = activeModuleIndex === idx;
                  const isCompleted = isModuleCompleted(idx);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveModuleIndex(idx)}
                      className={`w-full p-4 text-left transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                        isActive ? 'bg-brand-50/20 border-l-4 border-brand-600 pl-3' : 'pl-4'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-350" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold block ${isActive ? 'text-brand-900' : 'text-slate-700'}`}>
                          {mod.title.replace('Module ', 'M')}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                          {mod.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Gate Panel */}
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-sm text-slate-100">Module Certification Assessment</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                To earn your verified certificate, you must take a multiple-choice quiz and achieve a passing score of <span className="text-white font-bold">80% or higher</span>.
              </p>
              
              {assignment.status === 'completed' ? (
                <div className="space-y-3 pt-2">
                  <div className="bg-emerald-950/40 text-emerald-300 border border-emerald-800 rounded-lg p-3 text-xs font-bold leading-normal text-center">
                    ✓ Course Assessment Passed! Score: {assignment.score}%
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => navigate(`/employee/courses/${course.id}/quiz`)}
                      variant="outline"
                      className="border-slate-700 text-slate-100 hover:bg-slate-800 w-full font-bold text-xs"
                    >
                      Retake Practice
                    </Button>
                    <Button 
                      onClick={() => navigate('/employee/certificates')}
                      className="bg-brand-600 hover:bg-brand-700 text-white w-full font-bold text-xs"
                    >
                      View Credential
                    </Button>
                  </div>
                </div>
              ) : assignment.progress >= 100 ? (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-brand-300 font-bold uppercase tracking-wider block">Attempts Remaining: {assignment.attemptsRemaining}</span>
                  <Button
                    onClick={() => navigate(`/employee/courses/${course.id}/quiz`)}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold"
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Unlock Assessment Quiz
                  </Button>
                </div>
              ) : (
                <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700 text-[11px] text-slate-400 text-center font-bold">
                  🔐 Complete all 4 modules (100% progress) to unlock the final quiz.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
export default EmployeeCourseDetail;
