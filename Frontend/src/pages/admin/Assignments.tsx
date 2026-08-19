import React, { useState, useEffect, useMemo } from 'react';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';
import { authService } from '../../services/authService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { LoadingState } from '../../components/ui/LoadingState';
import { UserCheck, Search, Filter, Calendar, Users, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { User, Course } from '../../types';

export const AdminAssignments: React.FC = () => {
  const { courses, loading: coursesLoading } = useCourses();
  const { assignCourse, loading: assignLoading } = useAssignments();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState<User[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  // Form selections
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  
  // Selection filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      setEmployeesLoading(true);
      try {
        const data = await authService.getEmployees();
        setEmployees(data);
      } catch (err) {
        showToast('Error loading employees list.', 'error');
      } finally {
        setEmployeesLoading(false);
      }
    };
    loadEmployees();
  }, [showToast]);

  // Set default selection values once courses load
  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
    // Set a default due date of 30 days from now
    if (!dueDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setDueDate(defaultDate.toISOString().split('T')[0]);
    }
  }, [courses, selectedCourseId, dueDate]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    let result = employees;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(query) || e.id.toLowerCase().includes(query));
    }

    if (deptFilter !== 'all') {
      result = result.filter(e => e.department === deptFilter);
    }

    return result;
  }, [employees, searchQuery, deptFilter]);

  const departments = useMemo(() => {
    return ['all', ...Array.from(new Set(employees.map(e => e.department)))];
  }, [employees]);

  // Checklist Actions
  const handleToggleSelectAll = () => {
    const visibleIds = filteredEmployees.map(e => e.id);
    const allVisibleSelected = visibleIds.every(id => selectedEmployeeIds.includes(id));

    if (allVisibleSelected) {
      // Unselect all visible
      setSelectedEmployeeIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Select all visible (preserving already selected non-visible)
      setSelectedEmployeeIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleToggleEmployee = (id: string) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId) {
      showToast('Please select a course to assign.', 'warning');
      return;
    }
    if (!dueDate) {
      showToast('Please specify a valid completion due date.', 'warning');
      return;
    }
    if (selectedEmployeeIds.length === 0) {
      showToast('Please check at least one employee for enrollment.', 'warning');
      return;
    }

    const success = await assignCourse(selectedCourseId, selectedEmployeeIds, dueDate);
    if (success) {
      setSelectedEmployeeIds([]); // Clear checkboxes on success
      setSearchQuery('');
    }
  };

  if (coursesLoading || employeesLoading) {
    return <LoadingState type="table" rows={4} />;
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const isAllVisibleSelected = filteredEmployees.length > 0 && filteredEmployees.map(e => e.id).every(id => selectedEmployeeIds.includes(id));

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
          Course Enrollments Manager
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Assign training curriculums to individual employees or full departments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Course details & Due Date selector (1 col) */}
        <div className="space-y-6">
          <Card className="bg-white sticky top-20 shadow-sm border border-slate-200">
            <CardHeader>
              <h3 className="text-sm font-bold text-slate-900 leading-none">Enrollment Curricular Info</h3>
            </CardHeader>
            <CardContent className="space-y-5">
              
              <Select
                label="Select Course to Enroll"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                options={courses.map(c => ({ value: c.id, label: c.title }))}
              />

              <Input
                label="Completion Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              />

              {/* Selection Summary details */}
              {selectedCourse && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-650 space-y-2">
                  <div>
                    <span className="text-slate-405 font-bold uppercase tracking-wider text-[9px] block">Target Competency:</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{selectedCourse.skill} Specialist</span>
                  </div>
                  <div>
                    <span className="text-slate-405 font-bold uppercase tracking-wider text-[9px] block">Instructor:</span>
                    <span className="font-medium text-slate-800 block mt-0.5">{selectedCourse.instructor}</span>
                  </div>
                  <div>
                    <span className="text-slate-405 font-bold uppercase tracking-wider text-[9px] block">Curriculum Duration:</span>
                    <span className="font-medium text-slate-800 block mt-0.5">{selectedCourse.duration}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500">Selected Learners:</span>
                  <Badge variant={selectedEmployeeIds.length > 0 ? 'success' : 'neutral'} className="text-xs">
                    {selectedEmployeeIds.length} Employee{selectedEmployeeIds.length === 1 ? '' : 's'}
                  </Badge>
                </div>
                <Button
                  onClick={handleAssignSubmit}
                  isLoading={assignLoading}
                  className="w-full font-bold"
                  rightIcon={<UserCheck className="w-4 h-4" />}
                >
                  Assign Course
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Staff Checklist (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 leading-none">
              Select Employees for Enrollment
            </h3>
          </div>

          {/* Directory Filter controls */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search staff by name or ID..."
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
              className="w-full sm:w-44 h-[34px] py-0.5 text-xs shadow-xs"
            />
          </div>

          {/* Checklist table */}
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-300 bg-white rounded-xl">
              <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No employees match filters.</h3>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider select-none">
                    <th className="px-6 py-3.5 w-12 text-center">
                      <button 
                        type="button" 
                        onClick={handleToggleSelectAll}
                        className="text-slate-400 hover:text-brand-650 transition-colors focus:outline-none"
                      >
                        {isAllVisibleSelected ? (
                          <CheckSquare className="w-4.5 h-4.5 text-brand-600" />
                        ) : (
                          <Square className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3.5">Employee ID</th>
                    <th className="px-6 py-3.5">Learner Name</th>
                    <th className="px-6 py-3.5">Department</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                  {filteredEmployees.map(emp => {
                    const isChecked = selectedEmployeeIds.includes(emp.id);
                    return (
                      <tr 
                        key={emp.id} 
                        onClick={() => handleToggleEmployee(emp.id)}
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                          isChecked ? 'bg-brand-50/5' : ''
                        }`}
                      >
                        <td className="px-6 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleToggleEmployee(emp.id)}
                            className="text-slate-400 hover:text-brand-650 focus:outline-none"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4.5 h-4.5 text-brand-600" />
                            ) : (
                              <Square className="w-4.5 h-4.5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-500 font-semibold">{emp.id}</td>
                        <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-[10px]">
                            {emp.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <span>{emp.name}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="px-2 py-0.5 rounded-full border bg-slate-50 text-[10px] text-slate-600">
                            {emp.department}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default AdminAssignments;
