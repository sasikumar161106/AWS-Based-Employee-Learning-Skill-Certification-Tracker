import React, { useEffect, useState, useMemo } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { Card, CardContent } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, Hourglass, Minus, Search, BarChart2, Star, TrendingDown, BookOpen } from 'lucide-react';
import { SkillMatrixRow } from '../../types';

export const AdminSkillMatrix: React.FC = () => {
  const { skillMatrix, fetchSkillMatrix, loading } = useDashboard();
  
  const [deptFilter, setDeptFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSkillMatrix();
  }, [fetchSkillMatrix]);

  const departments = useMemo(() => {
    if (!skillMatrix || !skillMatrix.matrix) return [];
    return ['all', ...Array.from(new Set(skillMatrix.matrix.map((row: any) => row.department)))];
  }, [skillMatrix]);

  // Apply filters
  const filteredMatrix = useMemo(() => {
    if (!skillMatrix || !skillMatrix.matrix) return [];
    let result = skillMatrix.matrix;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row: any) => row.employeeName.toLowerCase().includes(query));
    }

    if (deptFilter !== 'all') {
      result = result.filter((row: any) => row.department === deptFilter);
    }

    return result;
  }, [skillMatrix, searchQuery, deptFilter]);

  if (loading || !skillMatrix) {
    return <LoadingState type="table" rows={4} />;
  }

  const { strongestSkill, largestSkillGap } = skillMatrix;

  const renderCellIcon = (status: "completed" | "in_progress" | "none") => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center justify-center text-emerald-600 gap-1 font-semibold select-none bg-emerald-50 rounded px-1 py-0.5 border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Competent</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center justify-center text-amber-600 gap-1 font-semibold select-none bg-amber-50 rounded px-1 py-0.5 border border-amber-100">
            <Hourglass className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[10px]">Studying</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center text-slate-400 gap-1 select-none">
            <Minus className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] text-slate-350 font-bold uppercase tracking-wider">Gap</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
          Corporate Skill Gap Matrix
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Map employee training statuses against key corporate competencies to identify skill gaps.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strongest skill */}
        <Card className="bg-gradient-to-br from-white to-brand-50/10 border-brand-100">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block leading-none">
                Strongest Team Competency
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                {strongestSkill} Certified
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Skill with the highest employee completion counts.
              </p>
            </div>
            <div className="bg-brand-50 text-brand-650 p-3.5 rounded-xl shrink-0 border border-brand-100">
              <Star className="w-6 h-6 fill-brand-200" />
            </div>
          </CardContent>
        </Card>

        {/* Largest skill gap */}
        <Card className="bg-gradient-to-br from-white to-rose-50/10 border-rose-100">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block leading-none">
                Largest Skill Gap
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                {largestSkillGap} Modules
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Competency needing additional enrollment campaigns.
              </p>
            </div>
            <div className="bg-rose-50 text-rose-650 p-3.5 rounded-xl shrink-0 border border-rose-100">
              <TrendingDown className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Filter Options */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Filter grid by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-350 bg-white rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs"
          />
        </div>

        <Select
          label=""
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Departments' },
            ...departments.filter(d => d !== 'all').map(d => ({ value: d, label: d }))
          ]}
          className="w-full sm:w-48 h-[34px] py-0.5 text-xs shadow-xs"
        />
      </div>

      {/* Matrix Table representation */}
      {filteredMatrix.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 bg-white rounded-xl">
          <BarChart2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No employees match active filters.</h3>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider select-none text-left">
                <th className="px-6 py-3.5 text-left">Employee Name</th>
                <th className="px-6 py-3.5 text-left">Department</th>
                <th className="px-6 py-3.5 text-center">AWS Cloud (COURSE001)</th>
                <th className="px-6 py-3.5 text-center">Java Backend (COURSE002)</th>
                <th className="px-6 py-3.5 text-center">Python Analytics (COURSE003)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-650 text-left">
              {filteredMatrix.map((row: any) => (
                <tr key={row.employeeId} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-[10px] select-none shrink-0">
                      {row.employeeName.split(' ').map((n: string)=>n[0]).join('')}
                    </div>
                    <span>{row.employeeName}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded-full border bg-slate-50 text-[10px] text-slate-600 font-semibold">
                      {row.department}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex justify-center">{renderCellIcon(row.skills.AWS)}</div>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex justify-center">{renderCellIcon(row.skills.Java)}</div>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex justify-center">{renderCellIcon(row.skills.Python)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminSkillMatrix;
