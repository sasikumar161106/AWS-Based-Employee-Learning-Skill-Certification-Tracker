import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { CourseStatusBadge } from './CourseStatusBadge';
import { Button } from '../ui/Button';
import { BookOpen, User, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Course, Assignment } from '../../types';
import { formatDate } from '../../utils/helpers';

interface CourseCardProps {
  course: Course;
  assignment?: Assignment;
  onActionClick: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  assignment,
  onActionClick
}) => {
  const progress = assignment ? assignment.progress : 0;
  const status = assignment ? assignment.status : 'not_started';
  const dueDate = assignment ? assignment.dueDate : undefined;

  const getActionButtonText = () => {
    switch (status) {
      case 'completed': return 'Review Curriculum';
      case 'in_progress': return 'Continue Learning';
      case 'overdue': return 'Resume (Overdue)';
      default: return 'Start Learning';
    }
  };

  const getDueDateLabelColor = () => {
    if (status === 'overdue') return 'text-rose-600 font-semibold';
    return 'text-slate-500';
  };

  return (
    <Card hoverable className="flex flex-col h-full bg-white">
      <CardContent className="flex-1 space-y-4">
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 px-2 py-0.5 rounded bg-brand-50 border border-brand-100">
            {course.category}
          </span>
          <CourseStatusBadge status={status} />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-1 hover:line-clamp-none transition-all">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Progress Bar (if started) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between text-xs font-medium text-slate-700">
            <span>Course Progress</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar progress={progress} color={status === 'overdue' ? 'danger' : 'brand'} />
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate" title={course.instructor}>{course.instructor.split(' (')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>{course.duration}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t-0 flex items-center justify-between gap-4">
        {dueDate ? (
          <div className="text-[11px] min-w-0">
            <span className="text-slate-450 block font-medium uppercase tracking-wider leading-none">Due Date</span>
            <span className={`block mt-1 truncate ${getDueDateLabelColor()}`}>
              {formatDate(dueDate)}
            </span>
          </div>
        ) : (
          <div className="w-4" />
        )}

        <Button
          onClick={onActionClick}
          size="sm"
          variant={status === 'completed' ? 'outline' : 'primary'}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="shrink-0"
        >
          {getActionButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};
export default CourseCard;
