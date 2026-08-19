import { ActivityLog } from '../types';

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "ACT001",
    employeeId: "EMP004",
    employeeName: "Sneha Rao",
    action: "completed",
    target: "Java Backend Development",
    date: "2026-08-18T16:45:00Z",
    type: "pass"
  },
  {
    id: "ACT002",
    employeeId: "EMP001",
    employeeName: "Rahul Sharma",
    action: "completed",
    target: "AWS Cloud Fundamentals",
    date: "2026-08-15T10:30:00Z",
    type: "pass"
  },
  {
    id: "ACT003",
    employeeId: "EMP004",
    employeeName: "Sneha Rao",
    action: "completed",
    target: "AWS Cloud Fundamentals",
    date: "2026-08-10T11:20:00Z",
    type: "pass"
  },
  {
    id: "ACT004",
    employeeId: "EMP005",
    employeeName: "Arjun Patel",
    action: "started",
    target: "AWS Cloud Fundamentals",
    date: "2026-08-05T09:15:00Z",
    type: "start"
  },
  {
    id: "ACT005",
    employeeId: "EMP002",
    employeeName: "Priya Reddy",
    action: "started",
    target: "AWS Cloud Fundamentals",
    date: "2026-08-01T14:00:00Z",
    type: "start"
  },
  {
    id: "ACT006",
    employeeId: "EMP003",
    employeeName: "Amit Kumar",
    action: "completed",
    target: "Java Backend Development",
    date: "2026-07-20T17:00:00Z",
    type: "pass"
  },
  {
    id: "ACT007",
    employeeId: "EMP002",
    employeeName: "Priya Reddy",
    action: "flagged overdue on",
    target: "Python for Data Analytics",
    date: "2026-08-01T00:00:00Z",
    type: "fail"
  }
];
