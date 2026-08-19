import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { Plus, Search, BookOpen, Trash2, Eye, ShieldAlert } from 'lucide-react';
import { Course } from '../../types';

export const AdminCourses: React.FC = () => {
  const { courses, deleteCourse, loading: coursesLoading } = useCourses();
  const { assignments, fetchAssignments, loading: asgLoading } = useAssignments();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const courseStats = useMemo(() => {
    const stats: { [courseId: string]: { assigned: number; completed: number; rate: number } } = {};
    
    courses.forEach(c => {
      const courseAsgs = assignments.filter(a => a.courseId === c.id);
      const completedCount = courseAsgs.filter(a => a.status === 'completed').length;
      const totalCount = courseAsgs.length;
      const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      stats[c.id] = {
        assigned: totalCount,
        completed: completedCount,
        rate
      };
    });

    return stats;
  }, [courses, assignments]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(c => 
      c.title.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  const handleOpenView = (course: Course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };

  const handleOpenDelete = (courseId: string) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      await deleteCourse(courseToDelete);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  if (coursesLoading || asgLoading) {
    return <LoadingState type="table" rows={4} />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
            Course Catalog Administration
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage course curriculums, view module counts, and monitor class completion distributions.
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/admin/courses/create')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold shrink-0 shadow-sm"
        >
          Create Course
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-2">
        <span className="text-slate-400 pl-1"><Search className="w-5 h-5" /></span>
        <input
          type="text"
          placeholder="Filter courses by name, category, or instructor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-0 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Courses List Table */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-355 bg-white rounded-xl">
          <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No courses matching search keywords</h3>
          <button onClick={() => setSearchQuery('')} className="mt-2 text-xs font-bold text-brand-650 hover:underline">Clear Search</button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Curriculums</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map(c => {
              const stats = courseStats[c.id] || { assigned: 0, completed: 0, rate: 0 };
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-bold text-slate-900">
                    <div className="space-y-0.5">
                      <span className="block leading-snug">{c.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono tracking-tight font-medium">ID: {c.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info" className="text-[10px]">{c.category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{c.instructor.split(' (')[0]}</TableCell>
                  <TableCell className="text-xs">{c.duration}</TableCell>
                  <TableCell className="text-xs font-bold">{stats.assigned} Employees</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span className={stats.rate === 100 ? 'text-emerald-600' : 'text-slate-700'}>
                        {stats.rate}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium font-serif italic">({stats.completed} passed)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[9px] px-2">Published</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5 select-none">
                      <button
                        onClick={() => handleOpenView(c)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                        title="View Modules"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(c.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-700 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Modules Viewer Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedCourse ? `${selectedCourse.title} - Module Structure` : 'Course Modules'}
        size="lg"
      >
        {selectedCourse && (
          <div className="space-y-4">
            <p className="text-xs text-slate-550 leading-relaxed italic border-b border-slate-100 pb-3">
              {selectedCourse.description}
            </p>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedCourse.modules.map((mod, idx) => (
                <div key={mod.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                  <div className="bg-brand-50 text-brand-600 rounded-lg p-1.5 text-xs font-bold shrink-0 mt-0.5 border border-brand-100">
                    M{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 leading-none">{mod.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{mod.description}</p>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">Reading duration: {mod.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button onClick={() => setShowViewModal(false)} size="sm">
                Close Viewer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Course Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-2.5 p-3.5 bg-rose-50 text-rose-800 rounded-lg border border-rose-100 text-xs font-semibold leading-relaxed">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <span>Warning: Deleting this course will also delete all active student enrollments, logs, and progress. This action is permanent.</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              className="w-full font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="danger"
              className="w-full font-bold text-xs"
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default AdminCourses;
