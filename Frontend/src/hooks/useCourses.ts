import { useState, useEffect, useCallback } from 'react';
import { Course } from '../types';
import { courseService } from '../services/courseService';
import { useToast } from '../context/ToastContext';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
      showToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const getCourseById = useCallback(async (id: string): Promise<Course | null> => {
    setLoading(true);
    setError(null);
    try {
      const course = await courseService.getCourseById(id);
      return course;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch course details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData: Omit<Course, 'id' | 'status'>): Promise<Course | null> => {
    setLoading(true);
    setError(null);
    try {
      const newCourse = await courseService.createCourse(courseData);
      showToast(`Course "${newCourse.title}" created successfully!`, 'success');
      await fetchCourses(); // Refresh courses list
      return newCourse;
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
      showToast('Failed to create course', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses, showToast]);

  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await courseService.deleteCourse(id);
      showToast('Course deleted successfully', 'success');
      await fetchCourses(); // Refresh
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
      showToast('Failed to delete course', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses, showToast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    getCourseById,
    createCourse,
    deleteCourse
  };
};
