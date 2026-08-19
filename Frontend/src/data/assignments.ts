import { Assignment } from '../types';

export const mockAssignments: Assignment[] = [
  // Rahul Sharma (EMP001)
  {
    id: "ASG_001",
    courseId: "COURSE001",
    employeeId: "EMP001",
    assignedDate: "2026-07-01",
    dueDate: "2026-08-25",
    progress: 100,
    status: "completed",
    completedDate: "2026-08-15",
    score: 85,
    attemptsRemaining: 2
  },
  {
    id: "ASG_002",
    courseId: "COURSE002",
    employeeId: "EMP001",
    assignedDate: "2026-08-01",
    dueDate: "2026-09-10",
    progress: 50,
    status: "in_progress",
    attemptsRemaining: 3
  },
  {
    id: "ASG_003",
    courseId: "COURSE003",
    employeeId: "EMP001",
    assignedDate: "2026-08-10",
    dueDate: "2026-10-05",
    progress: 0,
    status: "not_started",
    attemptsRemaining: 3
  },

  // Priya Reddy (EMP002)
  {
    id: "ASG_004",
    courseId: "COURSE001",
    employeeId: "EMP002",
    assignedDate: "2026-08-01",
    dueDate: "2026-08-30",
    progress: 25,
    status: "in_progress",
    attemptsRemaining: 3
  },
  {
    id: "ASG_005",
    courseId: "COURSE003",
    employeeId: "EMP002",
    assignedDate: "2026-07-01",
    dueDate: "2026-08-01", // Overdue
    progress: 10,
    status: "overdue",
    attemptsRemaining: 3
  },

  // Amit Kumar (EMP003)
  {
    id: "ASG_006",
    courseId: "COURSE002",
    employeeId: "EMP003",
    assignedDate: "2026-06-15",
    dueDate: "2026-07-25",
    progress: 100,
    status: "completed",
    completedDate: "2026-07-20",
    score: 90,
    attemptsRemaining: 3
  },
  {
    id: "ASG_007",
    courseId: "COURSE003",
    employeeId: "EMP003",
    assignedDate: "2026-08-01",
    dueDate: "2026-09-01",
    progress: 60,
    status: "in_progress",
    attemptsRemaining: 3
  },

  // Sneha Rao (EMP004)
  {
    id: "ASG_008",
    courseId: "COURSE001",
    employeeId: "EMP004",
    assignedDate: "2026-07-15",
    dueDate: "2026-08-20",
    progress: 100,
    status: "completed",
    completedDate: "2026-08-10",
    score: 95,
    attemptsRemaining: 3
  },
  {
    id: "ASG_009",
    courseId: "COURSE002",
    employeeId: "EMP004",
    assignedDate: "2026-07-20",
    dueDate: "2026-08-25",
    progress: 100,
    status: "completed",
    completedDate: "2026-08-18",
    score: 85,
    attemptsRemaining: 3
  },
  {
    id: "ASG_010",
    courseId: "COURSE003",
    employeeId: "EMP004",
    assignedDate: "2026-08-01",
    dueDate: "2026-08-25",
    progress: 80,
    status: "in_progress",
    attemptsRemaining: 3
  },

  // Arjun Patel (EMP005)
  {
    id: "ASG_011",
    courseId: "COURSE001",
    employeeId: "EMP005",
    assignedDate: "2026-08-05",
    dueDate: "2026-09-15",
    progress: 0,
    status: "not_started",
    attemptsRemaining: 3
  }
];
