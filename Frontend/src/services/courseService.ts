import { Course } from '../types';
import { mockCourses } from '../data/courses';
import { api, isApiEnabled } from '../utils/api';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const COURSES_KEY = 'lms_courses';

interface ApiCourse {
  course_id: string;
  title: string;
  description: string;
  external_video_url?: string | null;
  passing_score?: number;
  assigned_roles?: string[];
  created_at?: string;
}

const fromApiCourse = (course: ApiCourse): Course => ({
  id: course.course_id,
  title: course.title,
  description: course.description,
  category: 'AWS Training',
  skill: course.assigned_roles?.[0] || 'General',
  instructor: 'LMS Training Team',
  duration: 'Self-paced',
  status: 'not_started',
  modules: [],
  createdAt: course.created_at
});

const toApiCourse = (course: Omit<Course, 'id' | 'status'> & { id?: string }) => ({
  title: course.title,
  description: course.description,
  external_video_url: course.modules?.[0]?.videoUrl || null,
  passing_score: 70,
  assigned_roles: course.skill ? [course.skill] : []
});

const getStoredCourses = (): Course[] => {
  const courses = localStorage.getItem(COURSES_KEY);
  if (!courses) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(mockCourses));
    return mockCourses;
  }
  return JSON.parse(courses);
};

export const courseService = {
  async getCourses(): Promise<Course[]> {
    if (isApiEnabled()) {
      const response = await api.get<ApiCourse[]>('/courses');
      return response.data.map(fromApiCourse);
    }
    await delay();
    return getStoredCourses();
  },

  async getCourseById(courseId: string): Promise<Course | null> {
    if (isApiEnabled()) {
      try {
        const response = await api.get<ApiCourse>(`/courses/${courseId}`);
        return fromApiCourse(response.data);
      } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    }
    await delay(300);
    const courses = getStoredCourses();
    const course = courses.find(c => c.id === courseId);
    return course || null;
  },

  async createCourse(course: Omit<Course, 'id' | 'status'> & { id?: string }): Promise<Course> {
    if (isApiEnabled()) {
      const response = await api.post<ApiCourse>('/courses', toApiCourse(course));
      return fromApiCourse(response.data);
    }
    await delay();
    const courses = getStoredCourses();
    const id = course.id || `COURSE_${Date.now()}`;
    
    const newCourse: Course = {
      ...course,
      id,
      status: 'not_started',
      modules: course.modules || []
    };

    courses.push(newCourse);
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
    return newCourse;
  },

  async deleteCourse(courseId: string): Promise<void> {
    if (isApiEnabled()) {
      await api.delete(`/courses/${courseId}`);
      return;
    }
    await delay(400);
    let courses = getStoredCourses();
    courses = courses.filter(c => c.id !== courseId);
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  }
};
