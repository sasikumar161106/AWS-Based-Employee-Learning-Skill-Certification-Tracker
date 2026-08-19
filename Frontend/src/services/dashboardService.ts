import { getStoredAssignments, getStoredCertificates, getStoredLogs } from './assignmentService';
import { authService } from './authService';
import { courseService } from './courseService';
import { DepartmentCompliance, CourseCompletionStats, ActivityLog } from '../types';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  async getEmployeeStats(employeeId: string) {
    await delay(300);
    const asgs = getStoredAssignments().filter(a => a.employeeId === employeeId);
    const certs = getStoredCertificates().filter(c => c.employeeId === employeeId);

    const assignedCourses = asgs.length;
    const inProgress = asgs.filter(a => a.status === 'in_progress').length;
    const completed = asgs.filter(a => a.status === 'completed').length;
    const certificates = certs.length;

    return {
      assignedCourses,
      inProgress,
      completed,
      certificates
    };
  },

  async getAdminStats() {
    await delay();
    const asgs = getStoredAssignments();
    const employees = await authService.getEmployees();
    const courses = await courseService.getCourses();
    const certs = getStoredCertificates();
    const logs = getStoredLogs();

    const totalEmployees = employees.length;
    const activeCourses = courses.length;

    // Completion Rate: percentage of completed assignments relative to total assignments
    const completedCount = asgs.filter(a => a.status === 'completed').length;
    const completionRate = asgs.length > 0 ? Math.round((completedCount / asgs.length) * 100) : 0;

    const overdueCount = asgs.filter(a => a.status === 'overdue').length;

    // Course Completion distribution
    const completionDistribution: CourseCompletionStats = {
      completed: completedCount,
      inProgress: asgs.filter(a => a.status === 'in_progress').length,
      notStarted: asgs.filter(a => a.status === 'not_started').length,
      overdue: overdueCount
    };

    // Department Compliance
    const depts = Array.from(new Set(employees.map(e => e.department)));
    const departmentCompliance: DepartmentCompliance[] = depts.map(deptName => {
      const deptEmployees = employees.filter(e => e.department === deptName);
      const deptEmpIds = deptEmployees.map(e => e.id);
      const deptAsgs = asgs.filter(a => deptEmpIds.includes(a.employeeId));
      
      const completed = deptAsgs.filter(a => a.status === 'completed').length;
      const total = deptAsgs.length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 100; // 100 if no assignments

      return {
        name: deptName,
        rate,
        completed,
        total
      };
    });

    // Recent activity
    const recentActivity = logs.slice(0, 8); // Top 8 logs

    // Overdue training list
    const overdueTrainingList = await Promise.all(
      asgs
        .filter(a => a.status === 'overdue')
        .map(async a => {
          const emp = employees.find(e => e.id === a.employeeId);
          const course = courses.find(c => c.id === a.courseId);
          return {
            id: a.id,
            employeeId: a.employeeId,
            employeeName: emp?.name || 'Unknown',
            courseName: course?.title || 'Unknown',
            dueDate: a.dueDate,
            progress: a.progress
          };
        })
    );

    return {
      totalEmployees,
      activeCourses,
      completionRate,
      overdueCourses: overdueCount,
      completionDistribution,
      departmentCompliance,
      recentActivity,
      overdueTrainingList
    };
  },

  async getSkillMatrix() {
    await delay();
    const employees = await authService.getEmployees();
    const asgs = getStoredAssignments();

    // The key skills we track: AWS, Java, Python
    const skillsTracked = ['AWS', 'Java', 'Python'];

    const matrix = employees.map(emp => {
      const empAsgs = asgs.filter(a => a.employeeId === emp.id);
      
      const skillsStatus: { [skillName: string]: "completed" | "in_progress" | "none" } = {};
      
      // AWS
      const awsAsg = empAsgs.find(a => a.courseId === 'COURSE001');
      skillsStatus['AWS'] = awsAsg ? (awsAsg.status === 'completed' ? 'completed' : 'in_progress') : 'none';

      // Java
      const javaAsg = empAsgs.find(a => a.courseId === 'COURSE002');
      skillsStatus['Java'] = javaAsg ? (javaAsg.status === 'completed' ? 'completed' : 'in_progress') : 'none';

      // Python
      const pythonAsg = empAsgs.find(a => a.courseId === 'COURSE003');
      skillsStatus['Python'] = pythonAsg ? (pythonAsg.status === 'completed' ? 'completed' : 'in_progress') : 'none';

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        skills: skillsStatus
      };
    });

    // Compute summary
    // Strongest skill (highest completion count)
    // Largest skill gap (highest 'none' count or in_progress count among assigned)
    const skillStats = skillsTracked.map(skill => {
      let completedCount = 0;
      let noneCount = 0;
      
      matrix.forEach(row => {
        if (row.skills[skill] === 'completed') completedCount++;
        if (row.skills[skill] === 'none') noneCount++;
      });

      return {
        skill,
        completedCount,
        noneCount
      };
    });

    // Strongest Skill
    const strongest = [...skillStats].sort((a, b) => b.completedCount - a.completedCount)[0]?.skill || 'AWS';
    // Largest Skill Gap (highest none count)
    const gap = [...skillStats].sort((a, b) => b.noneCount - a.noneCount)[0]?.skill || 'Python';

    return {
      matrix,
      strongestSkill: strongest,
      largestSkillGap: gap
    };
  }
};
