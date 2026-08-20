import { Assignment, Certificate, ActivityLog } from '../types';
import { mockAssignments } from '../data/assignments';
import { mockCertificates } from '../data/certificates';
import { mockActivityLogs } from '../data/dashboard';
import { authService } from './authService';
import { courseService } from './courseService';
import { api, isApiEnabled } from '../utils/api';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const ASSIGNMENTS_KEY = 'lms_assignments';
const CERTIFICATES_KEY = 'lms_certificates';
const LOGS_KEY = 'lms_activity_logs';

interface ApiAssignment {
  employee_id: string;
  course_id: string;
  assigned_date: string;
  due_date: string;
  status: Assignment['status'];
}

const fromApiAssignment = (assignment: ApiAssignment): Assignment => ({
  id: `${assignment.employee_id}:${assignment.course_id}`,
  employeeId: assignment.employee_id,
  courseId: assignment.course_id,
  assignedDate: assignment.assigned_date,
  dueDate: assignment.due_date,
  progress: 0,
  status: assignment.status,
  attemptsRemaining: 3
});

export const getStoredAssignments = (): Assignment[] => {
  const asgs = localStorage.getItem(ASSIGNMENTS_KEY);
  if (!asgs) {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(mockAssignments));
    return mockAssignments;
  }
  return JSON.parse(asgs);
};

export const getStoredCertificates = (): Certificate[] => {
  const certs = localStorage.getItem(CERTIFICATES_KEY);
  if (!certs) {
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(mockCertificates));
    return mockCertificates;
  }
  return JSON.parse(certs);
};

export const getStoredLogs = (): ActivityLog[] => {
  const logs = localStorage.getItem(LOGS_KEY);
  if (!logs) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(mockActivityLogs));
    return mockActivityLogs;
  }
  return JSON.parse(logs);
};

export const assignmentService = {
  async getAssignments(): Promise<Assignment[]> {
    await delay();
    return getStoredAssignments();
  },

  async getAssignmentsByEmployee(employeeId: string): Promise<Assignment[]> {
    if (isApiEnabled()) {
      const response = await api.get<ApiAssignment[]>(`/employees/${employeeId}/courses`);
      return response.data.map(fromApiAssignment);
    }
    await delay(300);
    const asgs = getStoredAssignments();
    return asgs.filter(a => a.employeeId === employeeId);
  },

  async getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
    await delay(300);
    const asgs = getStoredAssignments();
    return asgs.filter(a => a.courseId === courseId);
  },

  async assignCourse(courseId: string, employeeIds: string[], dueDate: string): Promise<void> {
    if (isApiEnabled()) {
      await Promise.all(employeeIds.map((employeeId) => api.post(`/courses/${courseId}/assign`, {
        employee_id: employeeId,
        due_date: dueDate
      })));
      return;
    }
    await delay();
    const asgs = getStoredAssignments();
    const courses = await courseService.getCourses();
    const targetCourse = courses.find(c => c.id === courseId);
    if (!targetCourse) throw new Error('Course not found');

    const employees = await authService.getEmployees();

    employeeIds.forEach(empId => {
      const existing = asgs.find(a => a.courseId === courseId && a.employeeId === empId);
      const employee = employees.find(e => e.id === empId);

      if (!existing && employee) {
        asgs.push({
          id: `ASG_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          courseId,
          employeeId: empId,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate,
          progress: 0,
          status: 'not_started',
          attemptsRemaining: 3
        });

        // Add activity log
        const logs = getStoredLogs();
        logs.unshift({
          id: `ACT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          employeeId: empId,
          employeeName: employee.name,
          action: 'was assigned',
          target: targetCourse.title,
          date: new Date().toISOString(),
          type: 'start'
        });
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      }
    });

    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(asgs));
  },

  async updateAssignmentProgress(employeeId: string, courseId: string, progress: number): Promise<Assignment> {
    await delay(200);
    const asgs = getStoredAssignments();
    const index = asgs.findIndex(a => a.employeeId === employeeId && a.courseId === courseId);
    if (index === -1) throw new Error('Assignment not found');

    const assignment = asgs[index];
    const originalProgress = assignment.progress;
    assignment.progress = progress;

    if (progress === 100 && assignment.status !== 'completed') {
      // Complete module, but wait for quiz pass to change status to 'completed'
      assignment.status = 'in_progress';
    } else if (progress > 0 && assignment.progress < 100 && assignment.status === 'not_started') {
      assignment.status = 'in_progress';
    }

    asgs[index] = assignment;
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(asgs));

    // Log progress if it changed significantly
    if (originalProgress === 0 && progress > 0) {
      const logs = getStoredLogs();
      const employee = await authService.getEmployeeById(employeeId);
      const course = await courseService.getCourseById(courseId);
      if (employee && course) {
        logs.unshift({
          id: `ACT_${Date.now()}`,
          employeeId,
          employeeName: employee.name,
          action: 'started',
          target: course.title,
          date: new Date().toISOString(),
          type: 'start'
        });
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      }
    }

    return assignment;
  },

  async submitQuizResult(employeeId: string, courseId: string, score: number, passed: boolean): Promise<Assignment> {
    await delay();
    const asgs = getStoredAssignments();
    const index = asgs.findIndex(a => a.employeeId === employeeId && a.courseId === courseId);
    if (index === -1) throw new Error('Assignment not found');

    const assignment = asgs[index];
    assignment.attemptsRemaining -= 1;
    
    const employee = await authService.getEmployeeById(employeeId);
    const course = await courseService.getCourseById(courseId);
    const logs = getStoredLogs();

    if (passed) {
      assignment.progress = 100;
      assignment.status = 'completed';
      assignment.score = score;
      assignment.completedDate = new Date().toISOString().split('T')[0];

      // Mint a certificate
      const certs = getStoredCertificates();
      const certId = `CERT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      
      const newCert: Certificate = {
        id: certId,
        employeeId,
        courseId,
        courseName: course?.title || 'Unknown Course',
        employeeName: employee?.name || 'Unknown Employee',
        completionDate: assignment.completedDate,
        status: 'valid',
        skill: course?.skill || 'General'
      };
      
      certs.push(newCert);
      localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(certs));

      // Add success log
      logs.unshift({
        id: `ACT_${Date.now()}`,
        employeeId,
        employeeName: employee.name,
        action: 'completed',
        target: course?.title || 'Course',
        date: new Date().toISOString(),
        type: 'pass'
      });
    } else {
      // If assignment is already completed, do not revert progress.
      if (assignment.status !== 'completed') {
        assignment.progress = Math.min(95, assignment.progress);
        if (assignment.dueDate < new Date().toISOString().split('T')[0]) {
          assignment.status = 'overdue';
        } else {
          assignment.status = 'in_progress';
        }
      }
      
      // Add fail log
      logs.unshift({
        id: `ACT_${Date.now()}`,
        employeeId,
        employeeName: employee.name,
        action: 'failed quiz for',
        target: course?.title || 'Course',
        date: new Date().toISOString(),
        type: 'fail'
      });
    }

    asgs[index] = assignment;
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(asgs));
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));

    return assignment;
  }
};
