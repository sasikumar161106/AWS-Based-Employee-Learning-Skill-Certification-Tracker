import React from 'react';
import { cn } from '../../utils/helpers';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, children, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-400',
            error && 'border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20',
            className
          )}
          {...props}
        >
          {children || options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs font-semibold text-rose-600 leading-none">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-500 leading-none">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
