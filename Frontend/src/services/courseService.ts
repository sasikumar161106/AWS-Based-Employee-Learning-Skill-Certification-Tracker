import { Course } from '../types';
import { mockCourses } from '../data/courses';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const COURSES_KEY = 'lms_courses';

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
    await delay();
    return getStoredCourses();
  },

  async getCourseById(courseId: string): Promise<Course | null> {
    await delay(300);
    const courses = getStoredCourses();
    const course = courses.find(c => c.id === courseId);
    return course || null;
  },

  async createCourse(course: Omit<Course, 'id' | 'status'> & { id?: string }): Promise<Course> {
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
    await delay(400);
    let courses = getStoredCourses();
    courses = courses.filter(c => c.id !== courseId);
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  }
};
