# Employee Learning & Skill Certification Tracker / LMS Frontend

A polished, high-fidelity, responsive enterprise Learning Management System (LMS) dashboard frontend built using React, Vite, TypeScript, and Tailwind CSS. 

This repository implements all employee and HR administrator workflows with realistic local state interactions backed by `localStorage` persistence, allowing evaluation without any backend dependencies.

---

## 1. Tech Stack

- **Framework**: React 18 & Vite
- **Language**: TypeScript
- **Styles**: Tailwind CSS (with PostCSS auto-processing)
- **Routing**: React Router DOM (v6)
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios (ready to plug in)

---

## 2. Getting Started & Installation

To run this application locally, you will need Node.js and npm installed on your system. Follow these instructions:

### Step 1: Navigate to the Frontend Directory
```bash
cd Frontend
```

### Step 2: Install Node Dependencies
This will install all necessary modules, including React Router, Recharts, Tailwind compiler, and Lucide icons.
```bash
npm install
```

### Step 3: Run the Development Server
Launch the local server using Vite:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 4: Build for Production (Verification)
To verify that there are no TypeScript compile-time errors or build configuration conflicts:
```bash
npm run build
```
This compiles the application cleanly under `/dist`.

---

## 3. Demo Credentials

Use these corporate credentials to test role-based dashboards on the Sign In page:

### 1. Employee Account
- **Email**: `employee@example.com`
- **Password**: `employee123`
- **User Profile**: Rahul Sharma (Engineering Dept)
- **Employee ID**: `EMP001`

### 2. HR Administrator Account
- **Email**: `hr@example.com`
- **Password**: `admin123`
- **User Profile**: HR Admin Manager
- **Employee ID**: `ADM001`

---

## 4. Key Workflows Implemented

### Employee Experience
1. **Dashboard**: View overall statistics, in-progress course checklists, calendar deadlines, and recently generated certificates.
2. **My Courses Catalog**: Search and filter assigned courses by state (`Not Started`, `In Progress`, `Completed`, `Overdue`) or category.
3. **Curriculum View**: Navigate through modules, read course documentations, watch simulated media, and mark chapters complete.
4. **Quiz Engine**: Undergo multiple-choice assessments (one question at a time) with attempt safeguards (maximum 3 attempts).
5. **Certificates**: View custom completion credentials, trigger print layouts, or verify credentials on the public page.
6. **Verification Screen**: Public lookups under `/verify/:certificateId` to test credential authenticity without signing in.

### HR Admin Experience
1. **Analytics Dashboard**: Audit compliance rates, view department compliance bar charts, and view course completions pie charts.
2. **Curriculum Registry**: Manage course descriptions and create new courses (with title, category, target skill, and modular syllabus).
3. **Enrollments System**: Select courses and multi-select staff by search or department filters to assign due dates.
4. **Staff Registry**: Browse employees, view progress summaries, and click to audit detailed course records.
5. **Skill Matrix Grid**: Interactive grid visualizing staff competencies (AWS, Java, Python), highlighting gaps and core strengths.

---

## 5. Architectural Guide: Transitioning to Real APIs

This project is built using a decoupled Service Layer (`src/services/`) and React Hooks (`src/hooks/`) architecture, ensuring that mock functions can easily be swapped with real HTTP clients in the future.

Currently, hook data is loaded through services that resolve local datasets with simulated delays:
```text
React Page -> useCourses() Hook -> courseService.getCourses() -> Promise (Local Data)
```

To plug in a real backend, you only need to modify the service layer files:

### Example: Current Course Service (Mock)
```typescript
// src/services/courseService.ts
export const courseService = {
  async getCourses(): Promise<Course[]> {
    await delay(500); // Simulate API latency
    return getStoredCourses();
  }
}
```

### Example: Future Course Service (REST API)
Initialize an Axios client instance pointing to your AWS API Gateway trigger URL:
```typescript
// src/utils/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/prod',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

And update the service:
```typescript
// src/services/courseService.ts
import { api } from '../utils/api';

export const courseService = {
  async getCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  }
}
```

---

## 6. Future AWS Backend Integration Architecture

The service layer is designed around the following future REST endpoints:

- `GET    /courses` -> Retrieve all course curricula.
- `POST   /courses` -> Create a new course (HR Admin).
- `GET    /courses/{course_id}` -> Retrieve detailed modules for a course.
- `DELETE /courses/{course_id}` -> Delete a course (HR Admin).
- `POST   /courses/{course_id}/assign` -> Enroll selected employee IDs (HR Admin).
- `GET    /employees/{id}/courses` -> Fetch all course assignments for a user.
- `POST   /courses/{course_id}/quiz/submit` -> Submit quiz answers and score.
- `GET    /certificates/{employee_id}` -> Fetch earned certificate credentials.
- `GET    /verify/{cert_id}` -> Public unauthenticated certificate lookup.

### AWS Infrastructure Recommendation
1. **Cognito User Pools**: Handles employee sign-ups, custom role attributes (e.g. `custom:role = 'employee' | 'hr'`), and secure JWT token sign-ins.
2. **API Gateway**: Exposes secure REST endpoints. Requires Cognito Authorizers to validate incoming bearer tokens.
3. **Lambda Functions**: Event-driven Node.js/Python functions mapping HTTP requests to database queries.
4. **DynamoDB**: NoSQL tables to manage Users, Courses, Assignments, Quizzes, and Certificates.
5. **SES (Simple Email Service) / SNS (Simple Notification Service)**: Trigger automatic emails when a certificate is earned or when a course is overdue.
6. **S3 (Simple Storage Service)**: Stores course video lectures, reading PDFs, and avatar photos.
