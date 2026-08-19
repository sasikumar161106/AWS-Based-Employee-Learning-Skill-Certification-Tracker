import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAssignments } from '../../hooks/useAssignments';
import { useCertificates } from '../../hooks/useCertificates';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { Search, Users, Eye, Sparkles } from 'lucide-react';
import { User, Assignment } from '../../types';

interface EmployeeWithStats {
  profile: User;
  coursesAssigned: number;
  completedCount: number;
  completionRate: number;
  certificatesCount: number;
  overdueCount: number;
}

export const AdminEmployees: React.FC = () => {
  const { assignments, fetchAssignments, loading: asgLoading } = useAssignments();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<User[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    const loadEmployees = async () => {
      setEmployeesLoading(true);
      try {
        const data = await authService.getEmployees();
        setEmployees(data);
        await fetchAssignments();
      } catch (err) {
        console.error(err);
      } finally {
        setEmployeesLoading(false);
      }
    };
    loadEmployees();
  }, [fetchAssignments]);

  const departments = useMemo(() => {
    return ['all', ...Array.from(new Set(employees.map(e => e.department)))];
  }, [employees]);

  // Compute stats per employee
  const employeesWithStats = useMemo(() => {
    return employees.map(emp => {
      const empAsgs = assignments.filter(a => a.employeeId === emp.id);
      
      const coursesAssigned = empAsgs.length;
      const completedCount = empAsgs.filter(a => a.status === 'completed').length;
      const overdueCount = empAsgs.filter(a => a.status === 'overdue').length;
      
      const completionRate = coursesAssigned > 0 
        ? Math.round((completedCount / coursesAssigned) * 100) 
        : 100; // 100% compliant if no courses assigned

      // Simulating certificate counts - matching completion count
      const certificatesCount = completedCount;

      return {
        profile: emp,
        coursesAssigned,
        completedCount,
        completionRate,
        certificatesCount,
        overdueCount
      };
    });
  }, [employees, assignments]);

  // Apply filters
  const filteredEmployees = useMemo(() => {
    let result = employeesWithStats;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.profile.name.toLowerCase().includes(query) ||
        item.profile.id.toLowerCase().includes(query)
      );
    }

    if (deptFilter !== 'all') {
      result = result.filter(item => item.profile.department === deptFilter);
    }

    return result;
  }, [employeesWithStats, searchQuery, deptFilter]);

  if (employeesLoading || asgLoading) {
    return <LoadingState type="table" rows={4} />;
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
          Employee Training Registry
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Audit employee learning progression, credential statuses, and specific compliance percentages.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search employees by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-350 bg-white rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs"
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
          className="w-full sm:w-48 h-[38px] py-1 shadow-xs"
        />
      </div>

      {/* Employees Table List */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 bg-white rounded-xl">
          <Users className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No employees match filters</h3>
          <button onClick={() => { setSearchQuery(''); setDeptFilter('all'); }} className="mt-2 text-xs font-bold text-brand-650 hover:underline">Reset Filters</button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Assigned Courses</TableHead>
              <TableHead>Certificates</TableHead>
              <TableHead>Compliance Rate</TableHead>
              <TableHead>Status Badge</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map(item => {
              const isOverdue = item.overdueCount > 0;
              const hasNoCourses = item.coursesAssigned === 0;
              
              const getStatusBadge = () => {
                if (isOverdue) return <Badge variant="danger">Action Required</Badge>;
                if (hasNoCourses) return <Badge variant="neutral">Not Enrolled</Badge>;
                if (item.completionRate === 100) return <Badge variant="success">Fully Compliant</Badge>;
                return <Badge variant="warning">Active Study</Badge>;
              };

              return (
                <TableRow key={item.profile.id}>
                  <TableCell className="font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-850 font-bold flex items-center justify-center text-xs shrink-0 select-none">
                        {item.profile.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="block leading-snug truncate">{item.profile.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-tight font-medium">ID: {item.profile.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">{item.profile.department}</TableCell>
                  <TableCell className="text-xs font-bold">{item.coursesAssigned} courses</TableCell>
                  <TableCell className="text-xs font-bold flex items-center gap-1">
                    <span>{item.certificatesCount} earned</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <span className={item.completionRate === 100 ? 'text-emerald-600' : 'text-slate-700'}>
                        {item.completionRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge()}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => navigate(`/admin/employees/${item.profile.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors select-none"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Transcript</span>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default AdminEmployees;
