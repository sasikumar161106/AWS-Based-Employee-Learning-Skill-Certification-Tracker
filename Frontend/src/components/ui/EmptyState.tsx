import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 rounded-xl bg-white/50 max-w-md mx-auto my-6">
      <div className="rounded-full bg-slate-100 p-4 mb-4 text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{description}</p>
      {actionText && onActionClick && (
        <Button onClick={onActionClick} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
