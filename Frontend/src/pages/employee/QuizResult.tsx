import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Course, Assignment } from '../../types';

export const QuizResult: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { getCourseById } = useCourses();
  const { fetchEmployeeAssignments, loading: asgLoading } = useAssignments();

  const [course, setCourse] = useState<Course | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loadingLocal, setLoadingLocal] = useState(true);

  // If score was passed in react-router state
  const stateResult = location.state?.result;

  useEffect(() => {
    const loadDetails = async () => {
      if (!courseId || !user) return;
      setLoadingLocal(true);
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        const userAsgs = await fetchEmployeeAssignments(user.id);
        const matchedAsg = userAsgs.find(a => a.courseId === courseId);
        if (matchedAsg) {
          setAssignment(matchedAsg);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLocal(false);
      }
    };
    loadDetails();
  }, [courseId, user]);

  if (asgLoading || loadingLocal) {
    return <LoadingState type="profile" />;
  }

  if (!course || !assignment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">Enrollment transcript not found.</h2>
        <Button onClick={() => navigate('/employee/courses')} className="mt-4">
          Go to Courses
        </Button>
      </div>
    );
  }

  // Display values: take from state if freshly submitted, otherwise fall back to assignment record
  const score = stateResult ? stateResult.score : (assignment.score || 0);
  const passed = stateResult ? stateResult.passed : (assignment.status === 'completed');
  const correctCount = stateResult ? stateResult.correctCount : Math.round((score / 100) * 5);
  const incorrectCount = 5 - correctCount;

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      {/* Result Card */}
      <Card className="shadow-lg border border-slate-200 overflow-hidden bg-white">
        {/* Pass/Fail Banner */}
        <div className={`p-8 text-center text-white space-y-3 ${
          passed 
            ? 'bg-emerald-600' 
            : 'bg-rose-600'
        }`}>
          <div className="inline-flex bg-white/20 rounded-full p-3 shadow-inner">
            {passed ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : (
              <XCircle className="w-12 h-12" />
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight leading-none">
            {passed ? 'Assessment Passed' : 'Assessment Failed'}
          </h2>
          <span className="text-xs uppercase font-sans font-bold tracking-widest bg-black/10 px-3 py-1 rounded-full border border-white/10 inline-block leading-none">
            Passing Score: 80%
          </span>
        </div>

        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="text-center">
            <span className="text-slate-450 text-xs font-bold uppercase tracking-wider block">Your Score</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mt-1 leading-none">
              {score}%
            </h1>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-650 space-y-3">
            <div className="flex justify-between border-b border-slate-200/50 pb-2">
              <span className="text-slate-450 font-semibold">Course:</span>
              <span className="font-bold text-slate-900 text-right">{course.title}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-2">
              <span className="text-slate-450 font-semibold">Correct Answers:</span>
              <span className="font-bold text-slate-900">{correctCount} of 5</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-2">
              <span className="text-slate-450 font-semibold">Attempts Remaining:</span>
              <span className="font-bold text-slate-900">{assignment.attemptsRemaining} of 3</span>
            </div>
            {assignment.completedDate && (
              <div className="flex justify-between">
                <span className="text-slate-450 font-semibold">Completion Date:</span>
                <span className="font-bold text-slate-900">{formatDate(assignment.completedDate)}</span>
              </div>
            )}
          </div>

          {/* Feedback Blocks */}
          {passed ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-4 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
              <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Congratulations!</span>
                <span className="text-emerald-700 block mt-0.5">Your official course completion certificate has been generated and validated.</span>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-800 border border-rose-100 rounded-xl p-4 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
              <RotateCcw className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Almost there!</span>
                <span className="text-rose-700 block mt-0.5">Review the required modules and study logs to clarify misunderstandings before your next attempt.</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {passed ? (
              <Button
                onClick={() => navigate('/employee/certificates')}
                className="w-full bg-emerald-650 hover:bg-emerald-700 text-white font-bold"
                rightIcon={<Award className="w-4 h-4" />}
              >
                View Certificate
              </Button>
            ) : (
              <Button
                onClick={() => navigate(`/employee/courses/${courseId}/quiz`)}
                disabled={assignment.attemptsRemaining <= 0}
                className="w-full bg-rose-650 hover:bg-rose-700 text-white font-bold"
                rightIcon={<RotateCcw className="w-4 h-4" />}
              >
                {assignment.attemptsRemaining > 0 ? 'Try Assessment Again' : 'No Attempts Left'}
              </Button>
            )}
            
            <Button
              onClick={() => navigate(`/employee/courses/${courseId}`)}
              variant="outline"
              className="w-full font-bold"
            >
              Back to Course Modules
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default QuizResult;
