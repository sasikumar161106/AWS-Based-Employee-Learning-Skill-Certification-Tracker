import { useState, useCallback } from 'react';
import { Assignment } from '../types';
import { assignmentService } from '../services/assignmentService';
import { useToast } from '../context/ToastContext';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getAssignments();
      setAssignments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeAssignments = useCallback(async (employeeId: string): Promise<Assignment[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getAssignmentsByEmployee(employeeId);
      setAssignments(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user assignments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const assignCourse = useCallback(async (courseId: string, employeeIds: string[], dueDate: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await assignmentService.assignCourse(courseId, employeeIds, dueDate);
      showToast(`Course successfully assigned to ${employeeIds.length} employee${employeeIds.length > 1 ? 's' : ''}.`, 'success');
      await fetchAssignments();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to assign course');
      showToast('Failed to assign course. Please try again.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAssignments, showToast]);

  const updateProgress = useCallback(async (employeeId: string, courseId: string, progress: number): Promise<Assignment | null> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await assignmentService.updateAssignmentProgress(employeeId, courseId, progress);
      // Update local state list
      setAssignments(prev => prev.map(a => a.employeeId === employeeId && a.courseId === courseId ? updated : a));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update progress');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    fetchEmployeeAssignments,
    assignCourse,
    updateProgress
  };
};
