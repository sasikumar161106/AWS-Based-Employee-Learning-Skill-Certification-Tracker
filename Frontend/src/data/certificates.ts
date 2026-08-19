import { Certificate } from '../types';

export const mockCertificates: Certificate[] = [
  {
    id: "CERT-2026-001",
    employeeId: "EMP001",
    courseId: "COURSE001",
    courseName: "AWS Cloud Fundamentals",
    employeeName: "Rahul Sharma",
    completionDate: "2026-08-15",
    status: "valid",
    skill: "AWS"
  },
  {
    id: "CERT-2026-002",
    employeeId: "EMP003",
    courseId: "COURSE002",
    courseName: "Java Backend Development",
    employeeName: "Amit Kumar",
    completionDate: "2026-07-20",
    status: "valid",
    skill: "Java"
  },
  {
    id: "CERT-2026-003",
    employeeId: "EMP004",
    courseId: "COURSE001",
    courseName: "AWS Cloud Fundamentals",
    employeeName: "Sneha Rao",
    completionDate: "2026-08-10",
    status: "valid",
    skill: "AWS"
  },
  {
    id: "CERT-2026-004",
    employeeId: "EMP004",
    courseId: "COURSE002",
    courseName: "Java Backend Development",
    employeeName: "Sneha Rao",
    completionDate: "2026-08-18",
    status: "valid",
    skill: "Java"
  }
];
