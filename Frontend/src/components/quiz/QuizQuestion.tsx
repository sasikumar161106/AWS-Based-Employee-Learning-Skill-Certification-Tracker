import React from 'react';
import { QuizQuestion as QuizQuestionType } from '../../types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionIndex: number | undefined;
  onSelectOption: (optionIndex: number) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionIndex,
  onSelectOption
}) => {
  return (
    <div className="space-y-6">
      {/* Quiz Progress header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-brand-650 uppercase tracking-widest">Assessment Question</span>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {questionNumber} of {totalQuestions}
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
        {question.questionText}
      </h3>

      {/* Options Stack */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionIndex === index;
          return (
            <label
              key={index}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/20 text-brand-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50/50'
              }`}
            >
              <input
                type="radio"
                name={`question_${question.id}`}
                value={index}
                checked={isSelected}
                onChange={() => onSelectOption(index)}
                className="w-4 h-4 text-brand-600 border-slate-350 focus:ring-brand-500 focus:ring-offset-0"
              />
              <span className="text-sm font-medium">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
export default QuizQuestion;
