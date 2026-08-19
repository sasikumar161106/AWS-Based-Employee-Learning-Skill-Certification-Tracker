export interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "hr";
  department: string;
  avatar?: string;
  joinedDate?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  readingContent: string;
  videoUrl?: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  skill: string;
  instructor: string;
  duration: string;
  status: "not_started" | "in_progress" | "completed" | "overdue";
  modules: CourseModule[];
  createdAt?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  employeeId: string;
  assignedDate: string;
  dueDate: string;
  progress: number; // 0 to 100
  status: "not_started" | "in_progress" | "completed" | "overdue";
  completedDate?: string;
  score?: number;
  attemptsRemaining: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  courseId: string;
  courseTitle: string;
  questions: QuizQuestion[];
  passingScore: number; // e.g., 80
}

export interface Certificate {
  id: string;
  employeeId: string;
  courseId: string;
  courseName: string;
  employeeName: string;
  completionDate: string;
  status: "valid" | "revoked";
  skill: string;
}

export interface ActivityLog {
  id: string;
  employeeId: string;
  employeeName: string;
  action: string;
  target: string;
  date: string;
  type: "start" | "progress" | "fail" | "pass";
}

export interface SkillMatrixRow {
  employeeId: string;
  employeeName: string;
  department: string;
  skills: {
    [skillName: string]: "completed" | "in_progress" | "none";
  };
}

export interface DepartmentCompliance {
  name: string;
  rate: number;
  completed: number;
  total: number;
}

export interface CourseCompletionStats {
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
}
