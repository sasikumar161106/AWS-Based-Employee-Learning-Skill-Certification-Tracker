import React from 'react';
import { ActivityLog } from '../../types';
import { Play, CheckCircle2, AlertTriangle, XCircle, Award, Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface ActivityListProps {
  logs: ActivityLog[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ logs }) => {
  const getLogIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'pass':
        return <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-1.5 rounded-lg shrink-0"><Award className="w-4 h-4" /></div>;
      case 'fail':
        return <div className="bg-rose-50 text-rose-600 border border-rose-100 p-1.5 rounded-lg shrink-0"><XCircle className="w-4 h-4" /></div>;
      case 'start':
        return <div className="bg-blue-50 text-blue-600 border border-blue-100 p-1.5 rounded-lg shrink-0"><Play className="w-4 h-4" /></div>;
      default:
        return <div className="bg-slate-50 text-slate-600 border border-slate-100 p-1.5 rounded-lg shrink-0"><Sparkles className="w-4 h-4" /></div>;
    }
  };

  const getRelativeTime = (isoString: string): string => {
    const past = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 600);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return past.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {logs.length === 0 ? (
        <div className="text-center py-6 text-sm text-slate-450 font-medium">
          No recent activity logs found.
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {logs.map((log, logIdx) => (
              <li key={log.id}>
                <div className="relative pb-6">
                  {logIdx !== logs.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3 items-start">
                    <div>
                      {getLogIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm font-medium text-slate-800">
                        <span className="font-bold text-slate-900">{log.employeeName}</span>{' '}
                        {log.action}{' '}
                        <span className="font-bold text-slate-900 leading-none">{log.target}</span>
                      </p>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                        {getRelativeTime(log.date)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default ActivityList;
