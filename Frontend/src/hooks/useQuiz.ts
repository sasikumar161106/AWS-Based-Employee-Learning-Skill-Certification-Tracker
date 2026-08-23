import { useState, useCallback } from 'react';
import { Quiz } from '../types';
import { quizService } from '../services/quizService';
import { assignmentService } from '../services/assignmentService';
import { isApiEnabled } from '../utils/api';
import { useToast } from '../context/ToastContext';

export const useQuiz = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchQuiz = useCallback(async (courseId: string): Promise<Quiz | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getQuiz(courseId);
      setQuiz(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz');
      showToast('Failed to load quiz data', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const submitQuizAnswers = useCallback(async (
    employeeId: string,
    courseId: string,
    answers: { [questionId: string]: number }
  ) => {
    setSubmitting(true);
    setError(null);
    try {
      // 1. Score the quiz
      const result = await quizService.submitQuiz(courseId, answers);
      
      // 2. Propagate to assignments and mint certificates if passed
      if (!isApiEnabled()) {
        await assignmentService.submitQuizResult(employeeId, courseId, result.score, result.passed);
      }
      
      if (result.passed) {
        showToast('Congratulations! You passed the assessment!', 'success');
      } else {
        showToast('Assessment failed. Please try again.', 'warning');
      }

      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
      showToast('Error submitting quiz answers', 'error');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [showToast]);

  return {
    quiz,
    loading,
    submitting,
    error,
    fetchQuiz,
    submitQuizAnswers
  };
};
