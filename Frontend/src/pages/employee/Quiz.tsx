import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useQuiz } from '../../hooks/useQuiz';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { QuizQuestion } from '../../components/quiz/QuizQuestion';
import { LoadingState } from '../../components/ui/LoadingState';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Course, Quiz as QuizType } from '../../types';

export const Quiz: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { getCourseById } = useCourses();
  const { fetchQuiz, submitQuizAnswers, loading: quizLoading, submitting } = useQuiz();
  const { fetchEmployeeAssignments } = useAssignments();

  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(true);

  useEffect(() => {
    const loadQuizData = async () => {
      if (!courseId || !user) return;
      setLoadingLocal(true);
      try {
        // Double check assignment
        const userAsgs = await fetchEmployeeAssignments(user.id);
        const asg = userAsgs.find(a => a.courseId === courseId);
        
        if (!asg) {
          showToast('Assignment not found.', 'error');
          navigate('/employee/courses');
          return;
        }

        if (asg.attemptsRemaining <= 0 && asg.status !== 'completed') {
          showToast('You have used all 3 attempts. Contact HR for resetting.', 'warning');
          navigate(`/employee/courses/${courseId}`);
          return;
        }

        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        const quizData = await fetchQuiz(courseId);
        setQuiz(quizData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLocal(false);
      }
    };
    loadQuizData();
  }, [courseId, user]);

  if (quizLoading || loadingLocal) {
    return <LoadingState type="profile" />;
  }

  if (!course || !quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">Quiz not found for this course.</h2>
        <Button onClick={() => navigate(`/employee/courses/${courseId}`)} className="mt-4">
          Return to Course Details
        </Button>
      </div>
    );
  }

  const activeQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (selectedAnswers[activeQuestion.id] === undefined) {
      showToast('Please select an option before moving forward.', 'warning');
      return;
    }
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleOpenConfirmation = () => {
    // Make sure the last question has an option checked
    if (selectedAnswers[activeQuestion.id] === undefined) {
      showToast('Please select an answer for this question.', 'warning');
      return;
    }

    // Check if any previous question was missed (should not happen with forward guards, but safe check)
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < totalQuestions) {
      showToast('Please complete answering all questions first.', 'warning');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!user || !courseId) return;
    setShowConfirmModal(false);
    
    const result = await submitQuizAnswers(user.id, courseId, selectedAnswers);
    if (result) {
      navigate(`/employee/courses/${courseId}/result`, { state: { result } });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/employee/courses/${courseId}`)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Assessment</span>
        </button>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Course Code: {course.id}
        </span>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Certification Assessment</span>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
          {course.title}
        </h2>
      </div>

      {/* Main Question Card */}
      <Card className="shadow-md border border-slate-200">
        <CardContent className="p-6 md:p-8 space-y-6">
          <QuizQuestion
            question={activeQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            selectedOptionIndex={selectedAnswers[activeQuestion.id]}
            onSelectOption={handleSelectOption}
          />

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
            <Button
              onClick={handlePrev}
              disabled={isFirstQuestion}
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleOpenConfirmation}
                isLoading={submitting}
                variant="primary"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="primary"
                size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Assessment Submission"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-2.5 p-3.5 bg-brand-50 text-brand-800 rounded-lg border border-brand-100 text-xs font-semibold leading-relaxed">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-brand-650" />
            <span>Are you sure you want to submit your answers? You cannot change choices after submission. This will consume 1 attempt.</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => setShowConfirmModal(false)}
              variant="outline"
              className="w-full font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFinalSubmit}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
            >
              Confirm Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Quiz;
