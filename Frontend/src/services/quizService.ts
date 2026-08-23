import { Quiz } from '../types';
import { mockQuizzes } from '../data/quizzes';
import { quizApi, isApiEnabled } from '../utils/api';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const quizService = {
  async getQuiz(courseId: string): Promise<Quiz | null> {
    if (isApiEnabled()) {
      const response = await quizApi.get<{ course_id: string; questions: Array<{
        question_id: string;
        question_text: string;
        options: string[];
      }> }>(`/courses/${courseId}/quiz`);

      if (response.data.questions.length === 0) return null;

      return {
        courseId,
        courseTitle: courseId,
        passingScore: 80,
        questions: response.data.questions.map(question => ({
          id: question.question_id,
          questionText: question.question_text,
          options: question.options,
          correctAnswerIndex: -1
        }))
      };
    }

    await delay(300);
    const quiz = mockQuizzes.find(q => q.courseId === courseId);
    return quiz || null;
  },

  async submitQuiz(courseId: string, answers: { [questionId: string]: number }): Promise<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
  }> {
    if (isApiEnabled()) {
      const quiz = await this.getQuiz(courseId);
      if (!quiz) throw new Error('Quiz not found');

      const storedUser = localStorage.getItem('lms_current_user');
      const user = storedUser ? JSON.parse(storedUser) : undefined;
      const response = await quizApi.post<{
        score: number;
        attempt_count: number;
        result: 'pass' | 'fail';
      }>(`/courses/${courseId}/quiz/submit`, {
        employee_id: user?.id,
        employee_name: user?.name,
        employee_email: user?.email,
        course_name: quiz.courseTitle,
        answers: Object.fromEntries(Object.entries(answers).map(([questionId, index]) => [
          questionId,
          quiz.questions.find(question => question.id === questionId)?.options[index]
        ]))
      });

      const correctCount = Math.round((response.data.score / 100) * quiz.questions.length);
      return {
        score: response.data.score,
        passed: response.data.result === 'pass',
        correctCount,
        totalCount: quiz.questions.length
      };
    }

    await delay();
    const quiz = mockQuizzes.find(q => q.courseId === courseId);
    if (!quiz) throw new Error('Quiz not found');

    let correctCount = 0;
    const totalCount = quiz.questions.length;

    quiz.questions.forEach(q => {
      const selectedIndex = answers[q.id];
      if (selectedIndex === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalCount) * 100);
    const passed = score >= quiz.passingScore;

    return {
      score,
      passed,
      correctCount,
      totalCount
    };
  }
};
