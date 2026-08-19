import React from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', id, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none select-none">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 disabled:pointer-events-none w-full',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-slate-400 pointer-events-none select-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="text-xs font-semibold text-rose-600 leading-none">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-500 leading-none">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

