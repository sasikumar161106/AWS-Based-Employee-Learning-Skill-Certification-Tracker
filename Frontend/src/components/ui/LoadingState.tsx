import React from 'react';

interface LoadingStateProps {
  type?: 'card' | 'table' | 'profile';
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'card',
  rows = 3
}) => {
  if (type === 'table') {
    return (
      <div className="w-full border border-slate-200 rounded-lg bg-white overflow-hidden animate-pulse">
        <div className="bg-slate-100 h-10 border-b border-slate-200" />
        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between gap-4">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/6" />
              <div className="h-4 bg-slate-200 rounded w-1/6" />
              <div className="h-4 bg-slate-200 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="border border-slate-200 rounded-xl p-6 bg-white animate-pulse">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-slate-200 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/5" />
          </div>
        </div>
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="border border-slate-200 rounded-xl p-6 bg-white space-y-4 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-8 bg-slate-200 rounded w-full pt-4" />
        </div>
      ))}
    </div>
  );
};
export default LoadingState;
