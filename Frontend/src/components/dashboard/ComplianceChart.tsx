import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { CourseCompletionStats, DepartmentCompliance } from '../../types';

// COLORS for course completion status mapping
const PIE_COLORS = {
  completed: '#10b981',   // emerald-500
  inProgress: '#f59e0b',  // amber-500
  notStarted: '#64748b',  // slate-500
  overdue: '#f43f5e',     // rose-500
};

interface CompletionChartProps {
  data: CourseCompletionStats;
}

export const CourseCompletionChart: React.FC<CompletionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Completed', value: data.completed, color: PIE_COLORS.completed },
    { name: 'In Progress', value: data.inProgress, color: PIE_COLORS.inProgress },
    { name: 'Not Started', value: data.notStarted, color: PIE_COLORS.notStarted },
    { name: 'Overdue', value: data.overdue, color: PIE_COLORS.overdue },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm font-medium text-slate-450">
        No enrollment data available.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ComplianceChartProps {
  data: DepartmentCompliance[];
}

export const DeptComplianceChart: React.FC<ComplianceChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.name,
    'Compliance Rate (%)': item.rate,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}
          />
          <Bar 
            dataKey="Compliance Rate (%)" 
            fill="#4f73ff" 
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
