import { Quiz } from '../types';
import { mockQuizzes } from '../data/quizzes';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const quizService = {
  async getQuiz(courseId: string): Promise<Quiz | null> {
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
