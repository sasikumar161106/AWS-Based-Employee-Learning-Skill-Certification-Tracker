import React from 'react';
import { cn } from '../../utils/helpers';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showText?: boolean;
  color?: 'brand' | 'success' | 'warning' | 'danger';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
  showText = false,
  color = 'brand'
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const colors = {
    brand: 'bg-brand-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    danger: 'bg-rose-600',
  };

  return (
    <div className={cn('w-full flex items-center gap-3', className)}>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700 w-9 text-right shrink-0">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
};
export default ProgressBar;
