import React from 'react';
import { Badge } from '../ui/Badge';
import { Assignment } from '../../types';

interface CourseStatusBadgeProps {
  status: Assignment['status'];
}

export const CourseStatusBadge: React.FC<CourseStatusBadgeProps> = ({ status }) => {
  const map = {
    completed: { label: 'Completed', variant: 'success' as const },
    in_progress: { label: 'In Progress', variant: 'warning' as const },
    not_started: { label: 'Not Started', variant: 'neutral' as const },
    overdue: { label: 'Overdue', variant: 'danger' as const },
  };

  const { label, variant } = map[status] || { label: 'Unknown', variant: 'neutral' as const };

  return <Badge variant={variant}>{label}</Badge>;
};
export default CourseStatusBadge;
