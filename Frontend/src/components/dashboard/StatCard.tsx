import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  color = 'brand',
  className
}) => {
  const iconColors = {
    brand: 'bg-brand-50 text-brand-650 border border-brand-100',
    success: 'bg-emerald-50 text-emerald-650 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-650 border border-amber-100',
    danger: 'bg-rose-50 text-rose-650 border border-rose-100',
    info: 'bg-blue-50 text-blue-650 border border-blue-100',
  };

  return (
    <Card className={cn('bg-white', className)}>
      <CardContent className="p-6 flex items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <span className="text-[11px] font-bold text-slate-450 uppercase tracking-widest leading-none block">
            {title}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            {value}
          </h2>
          {description && (
            <p className="text-xs text-slate-500 font-medium truncate" title={description}>
              {description}
            </p>
          )}
        </div>

        <div className={cn('p-3.5 rounded-xl shrink-0', iconColors[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
};
export default StatCard;
