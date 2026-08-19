import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../../components/courses/CourseCard';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { BookOpen, Search, Filter } from 'lucide-react';
import { Course, Assignment } from '../../types';

export const EmployeeCourses: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading: coursesLoading } = useCourses();
  const { fetchEmployeeAssignments, loading: asgLoading } = useAssignments();
  const navigate = useNavigate();

  const [assignedAsgs, setAssignedAsgs] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');
  const [loadingLocal, setLoadingLocal] = useState(true);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoadingLocal(true);
        const data = await fetchEmployeeAssignments(user.id);
        setAssignedAsgs(data);
        setLoadingLocal(false);
      };
      loadData();
    }
  }, [user, fetchEmployeeAssignments]);

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(courses.map(c => c.category)))];
  }, [courses]);

  // Combined filters & sorting
  const filteredCourseCards = useMemo(() => {
    let result = assignedAsgs.map(asg => {
      const course = courses.find(c => c.id === asg.courseId);
      return { asg, course };
    }).filter(item => item.course !== undefined) as { asg: Assignment; course: Course }[];

    // 1. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.course.title.toLowerCase().includes(query) ||
        item.course.description.toLowerCase().includes(query) ||
        item.course.instructor.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.asg.status === statusFilter);
    }

    // 3. Category Filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.course.category === categoryFilter);
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === 'title-asc') {
        return a.course.title.localeCompare(b.course.title);
      }
      if (sortBy === 'title-desc') {
        return b.course.title.localeCompare(a.course.title);
      }
      if (sortBy === 'due-asc') {
        return new Date(a.asg.dueDate).getTime() - new Date(b.asg.dueDate).getTime();
      }
      if (sortBy === 'progress-desc') {
        return b.asg.progress - a.asg.progress;
      }
      return 0;
    });

    return result;
  }, [assignedAsgs, courses, searchQuery, statusFilter, categoryFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('title-asc');
  };

  if (coursesLoading || asgLoading || loadingLocal) {
    return <LoadingState type="card" rows={3} />;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
            My Assigned Courses
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Browse and complete courses assigned to you by the HR administration.
          </p>
        </div>
      </div>

      {/* Filter and Sorting bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col lg:flex-row gap-4">
        
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search by title, description or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-350 bg-white rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs"
          />
        </div>

        {/* Filters Stack */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
          <Select
            label=""
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'not_started', label: 'Not Started' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'overdue', label: 'Overdue' }
            ]}
            className="h-[38px] py-1 shadow-xs"
          />

          <Select
            label=""
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.filter(c => c !== 'all').map(c => ({ value: c, label: c }))
            ]}
            className="h-[38px] py-1 shadow-xs"
          />

          <Select
            label=""
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'title-asc', label: 'Title (A-Z)' },
              { value: 'title-desc', label: 'Title (Z-A)' },
              { value: 'due-asc', label: 'Due Date' },
              { value: 'progress-desc', label: 'Highest Progress' }
            ]}
            className="h-[38px] py-1 shadow-xs"
          />

          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors h-[38px]"
          >
            Clear Filters
          </button>
        </div>

      </div>

      {/* Grid List */}
      {filteredCourseCards.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses matched"
          description="Try adjusting your keywords, sorting options, status checkboxes or category selectors."
          actionText="Clear Filters"
          onActionClick={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourseCards.map(({ course, asg }) => (
            <CourseCard
              key={course.id}
              course={course}
              assignment={asg}
              onActionClick={() => navigate(`/employee/courses/${course.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default EmployeeCourses;
