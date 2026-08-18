# AWS-Based-Employee-Learning-Skill-Certification-Tracker
# Employee Learning & Skill Certification Tracker

A **serverless Learning Management System (LMS)** built on **Amazon Web Services (AWS)** for managing employee training, quizzes, certifications, and organizational skill-gap tracking.

The platform provides HR administrators with a centralized system to create and assign courses, while employees can access training material, complete quizzes, and automatically receive verifiable PDF certificates after successful completion.

---

## Overview

The **Employee Learning & Skill Certification Tracker** addresses the problem of employee skills and certifications being scattered across spreadsheets, emails, and disconnected systems.

The system provides:

* Course creation and management
* Role-based course assignment
* External video-based learning
* MCQ-based assessments
* Secure server-side quiz grading
* Automatic PDF certificate generation
* Automated email notifications
* Public certificate verification
* HR skill-gap dashboard
* Automated overdue-training alerts
* Serverless monitoring and logging

The entire platform uses managed AWS services and does not require EC2 instances, containers, or self-managed servers.

---

## Problem Statement

Organizations often face several challenges when managing employee training:

* Employee skills and certifications are stored in spreadsheets or emails.
* HR cannot easily determine which employees possess a particular certification.
* Course completion may be self-reported without verifiable evidence.
* Overdue mandatory training can go unnoticed.
* Certificates may not have a reliable mechanism for third-party verification.

This system provides a centralized and auditable solution for employee learning and certification management.

---

## Proposed Solution

The platform follows a **cloud-native, event-driven serverless architecture**.

```text
                    ┌─────────────────────┐
                    │     HR / Employee   │
                    │       Browser       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   S3 + CloudFront   │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Amazon Cognito   │
                    │ Authentication/RBAC │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    API Gateway      │
                    │       REST API      │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │   Course &  │      │    Quiz &   │      │  Dashboard  │
   │ Assignment  │      │ Certificate │      │  & Alerts   │
   │   Lambda    │      │   Lambda    │      │   Lambda    │
   └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     DynamoDB        │
                    │ Courses / Quizzes   │
                    │ Assignments / etc.  │
                    └─────────────────────┘

              ┌───────────────────────────────┐
              │ S3 │ SES │ SNS │ EventBridge │
              │ CloudWatch │ IAM             │
              └───────────────────────────────┘
```

The architecture is divided into presentation/identity, API, business logic, data/storage, and notification/monitoring layers.

---

# AWS Technology Stack

| Layer               | AWS Service                    | Purpose                                   |
| ------------------- | ------------------------------ | ----------------------------------------- |
| Frontend Hosting    | Amazon S3                      | Hosts the static web application          |
| CDN                 | Amazon CloudFront              | HTTPS, caching and global distribution    |
| Authentication      | Amazon Cognito                 | User authentication and role-based access |
| API                 | Amazon API Gateway             | REST API entry point                      |
| Compute             | AWS Lambda                     | Serverless backend business logic         |
| Database            | Amazon DynamoDB                | Stores application data                   |
| Certificate Storage | Amazon S3                      | Stores generated PDF certificates         |
| Email               | Amazon SES                     | Assignment and certificate emails         |
| Notifications       | Amazon SNS                     | Overdue-training alerts                   |
| Scheduling          | Amazon EventBridge             | Triggers scheduled overdue scans          |
| Monitoring          | Amazon CloudWatch              | Logs, metrics and alarms                  |
| Security            | AWS IAM                        | Least-privilege access control            |
| Infrastructure      | AWS SAM / CDK / CloudFormation | Infrastructure as Code                    |

The system is designed around managed AWS services with pay-per-use serverless infrastructure.

---

# Core Features

## HR Admin

HR administrators can:

* Create courses
* Add course descriptions
* Add external learning-video URLs
* Configure passing scores
* Create MCQ quizzes
* Assign courses by role
* Assign courses to individual employees
* Monitor employee completion
* View skill-gap statistics
* View overdue assignments

---

## Employee Portal

Employees can:

* Log in securely
* View assigned courses
* Access learning material
* Attempt quizzes
* Receive quiz results
* Retry failed quizzes up to 3 times
* Receive certificates after passing
* Download certificates through secure links

The retry limit is enforced server-side rather than relying on client-side state.

---

# Quiz and Assessment System

Each course can contain an MCQ-based assessment.

Correct answers are **never exposed to the frontend**.

Instead:

```text
Correct Answer
      │
      ▼
   SHA-256
      │
      ▼
DynamoDB
```

When an employee submits an answer:

```text
Submitted Answer
      │
      ▼
   SHA-256
      │
      ▼
Compare with stored hash
      │
      ▼
Calculate Score
```

The system allows a maximum of **3 quiz attempts**.

---

# Certificate Generation

When an employee passes a quiz:

```text
Quiz Passed
     │
     ▼
Certificate Lambda
     │
     ├── Generate PDF
     │
     ├── Store PDF → Amazon S3
     │
     ├── Store metadata → DynamoDB
     │
     └── Send email → Amazon SES
```

Each certificate contains:

* Employee name
* Course name
* Completion date
* Unique certificate ID

Certificates are stored using:

```text
/certificates/{employee_id}/{course_id}.pdf
```

The employee receives a time-limited pre-signed S3 URL for downloading the certificate.

---

# Certificate Verification

Certificates can be verified without authentication.

### Endpoint

```http
GET /verify/{cert_id}
```

### Example

```http
GET /verify/CERT-2026-001
```

### Possible Response

```json
{
  "valid": true,
  "certificate_id": "CERT-2026-001"
}
```

Invalid or unknown certificate IDs return an invalid response.

The verification endpoint is intentionally public and read-only.

---

# Skill Gap Dashboard

The HR dashboard provides organization-level visibility into employee training.

### Employee × Course Matrix

```text
                 AWS    Java    Python
---------------------------------------
Employee 1        ✓       ✓        -
Employee 2        ✓       -        ✓
Employee 3        -       ✓        ✓
```

### Department Compliance

```text
Engineering       87%
Human Resources   92%
Finance            76%
```

### Dashboard Features

* Course completion status
* Employee × course matrix
* Department-level compliance percentage
* Overdue course highlighting
* Skill-gap analysis

These dashboard capabilities are part of the defined core feature set.

---

# Automated Overdue Alerts

The system automatically identifies overdue training.

```text
Amazon EventBridge
        │
        ▼
Overdue Scan Lambda
        │
        ▼
DynamoDB
        │
        ▼
Find overdue assignments
        │
        ▼
Amazon SNS
        │
        ▼
HR Administrator
```

The overdue scan is scheduled through EventBridge and sends a digest to HR through SNS.

---

# Data Model

The system uses five DynamoDB tables.

## Courses

| Attribute            | Description                  |
| -------------------- | ---------------------------- |
| `course_id`          | Unique course identifier     |
| `title`              | Course title                 |
| `description`        | Course description           |
| `external_video_url` | YouTube/Vimeo learning link  |
| `passing_score`      | Minimum passing percentage   |
| `assigned_roles`     | Roles targeted by the course |

## Quizzes

| Attribute             | Description           |
| --------------------- | --------------------- |
| `course_id`           | Course identifier     |
| `question_id`         | Unique question       |
| `question_text`       | MCQ question          |
| `options`             | Answer choices        |
| `correct_answer_hash` | SHA-256 hashed answer |

## Assignments

| Attribute       | Description         |
| --------------- | ------------------- |
| `employee_id`   | Assigned employee   |
| `course_id`     | Assigned course     |
| `assigned_date` | Assignment date     |
| `due_date`      | Compliance deadline |
| `status`        | Training status     |

## Completions

| Attribute       | Description          |
| --------------- | -------------------- |
| `employee_id`   | Employee             |
| `course_id`     | Course               |
| `attempt_count` | Number of attempts   |
| `score`         | Latest score         |
| `result`        | Pass/fail            |
| `completed_at`  | Completion timestamp |

## Certificates

| Attribute        | Description                   |
| ---------------- | ----------------------------- |
| `certificate_id` | Public certificate identifier |
| `employee_id`    | Certificate owner             |
| `course_id`      | Related course                |
| `issued_date`    | Issue date                    |
| `s3_key`         | Certificate PDF location      |
| `status`         | Valid/revoked                 |

The five-table data model and their attributes are defined in the technical design.

---

# API Endpoints

| Method | Endpoint                           | Authentication | Purpose               |
| ------ | ---------------------------------- | -------------- | --------------------- |
| `POST` | `/courses`                         | HR Admin       | Create course         |
| `POST` | `/courses/{course_id}/assign`      | HR Admin       | Assign course         |
| `GET`  | `/employees/{id}/courses`          | Employee       | View assigned courses |
| `POST` | `/courses/{course_id}/quiz/submit` | Employee       | Submit quiz           |
| `GET`  | `/verify/{cert_id}`                | Public         | Verify certificate    |
| `GET`  | `/dashboard/skill-matrix`          | HR Admin       | View compliance       |
| `GET`  | `/dashboard/overdue`               | HR Admin       | View overdue courses  |

These represent the primary API surface defined for the application.

---

# Security

Security is implemented using multiple AWS services and controls.

### Authentication

Amazon Cognito provides separate groups:

```text
HRAdmin
Employee
```

API Gateway uses a Cognito Authorizer for protected routes.

### Quiz Security

Correct answers are stored only as SHA-256 hashes.

### Certificate Security

Certificate PDFs are private in S3 and accessed through short-lived pre-signed URLs.

### IAM

Each Lambda function uses a least-privilege execution role.

### API Security

API Gateway provides:

* Authentication
* Request validation
* CORS
* Throttling

### Monitoring

CloudWatch monitors:

* Lambda errors
* API errors
* Latency
* Throttling

The security design explicitly requires least-privilege IAM and protection of certificate files.

---

# Suggested Project Structure

```text
employee-learning-lms/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── auth/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── courses/
│   ├── assignments/
│   ├── quiz/
│   ├── certificate/
│   ├── verification/
│   ├── dashboard/
│   ├── notifications/
│   └── overdue/
│
├── infrastructure/
│   ├── template.yaml
│   ├── cognito/
│   ├── dynamodb/
│   ├── iam/
│   └── api/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── api/
│
├── docs/
│   ├── architecture/
│   └── screenshots/
│
├── .github/
│   └── workflows/
│
├── .gitignore
└── README.md
```

---

# Team Responsibilities

The project can be divided among five team members.

| Member       | Responsibility                                             |
| ------------ | ---------------------------------------------------------- |
| **Member 1** | Frontend — Employee Portal and HR Admin UI                 |
| **Member 2** | Course and Assignment Backend + SES                        |
| **Member 3** | Quiz Engine + Certificate Generation + Verification        |
| **Member 4** | AWS Infrastructure + Cognito + IAM + IaC + Deployment      |
| **Member 5** | Skill Dashboard + EventBridge + SNS + CloudWatch + Testing |

Each member owns a functional subsystem while integration happens through the shared API and AWS infrastructure.

---

# Development Phases

## Phase 1 — Foundation

### Goal

HR can create and assign courses, while employees can log in and view their assigned courses.

### Includes

* S3
* CloudFront
* Cognito
* API Gateway
* IAM
* Courses DynamoDB table
* Assignments DynamoDB table
* Course/Assignment Lambda
* SES
* Basic frontend

### Demo

```text
HR creates course
       ↓
Assigns course
       ↓
Employee receives email
       ↓
Employee sees course
```

---

## Phase 2 — Core Learning Loop

### Goal

Employees can complete quizzes and automatically receive certificates.

### Includes

* Quizzes table
* Completions table
* Certificates table
* Quiz Lambda
* Certificate Lambda
* PDF generation
* S3 certificate storage
* SES certificate delivery
* Public verification API

### Demo

```text
Employee
   ↓
Takes Quiz
   ↓
Passes
   ↓
Certificate Generated
   ↓
Email Sent
   ↓
Certificate Verified
```

---

## Phase 3 — Insight and Operations

### Goal

Provide organization-wide skill visibility and automated compliance alerts.

### Includes

* Skill-gap dashboard
* Department compliance metrics
* Overdue assignments
* EventBridge
* SNS
* CloudWatch
* IAM hardening
* Demo data

### Demo

```text
Course → Assignment → Learning → Quiz
                                      ↓
                                  Certificate
                                      ↓
                              Skill Dashboard
                                      ↓
                               Overdue Alerts
```

The three-phase plan is designed so that each phase produces an independently demonstrable working slice of the system.

---

# Testing

Testing should cover:

### Authentication

* HR login
* Employee login
* Unauthorized API access
* Role-based access

### Courses

* Create course
* Update course
* Assign course
* Invalid course ID

### Quiz

* Correct answers
* Incorrect answers
* Score calculation
* Maximum 3 attempts
* Attempt limit enforcement

### Certificates

* PDF generation
* S3 upload
* DynamoDB certificate record
* SES delivery
* Valid certificate verification
* Invalid certificate verification

### Dashboard

* Completion calculations
* Department percentages
* Overdue identification

### Security

* Correct answers not exposed
* Private S3 certificates
* IAM least privilege
* Protected API endpoints

---

# Expected Deliverables

The final project should provide:

* Working live demonstration
* Course creation and assignment
* Quiz functionality
* Automatically generated certificate
* Sample certificate PDF
* Certificate verification API
* Skill-gap dashboard
* At least 5 dummy employees
* At least 3 courses
* Valid/invalid certificate verification evidence
* Infrastructure-as-Code templates

---

# Application Technologies

### Frontend

* React
* HTML
* CSS
* JavaScript

### Backend

* Node.js / Python
* AWS Lambda
* REST APIs

### Database

* Amazon DynamoDB

### Cloud

* Amazon Web Services

### Infrastructure

* AWS SAM / CDK / CloudFormation
* GitHub Actions / CodePipeline

### Security

* Amazon Cognito
* AWS IAM
* SHA-256

### Storage and Communication

* Amazon S3
* Amazon SES
* Amazon SNS

---

# Architecture Benefits

Because the application is serverless:

* No EC2 server management
* No container management
* Automatic scaling
* Pay-per-use infrastructure
* No idle server compute
* Managed AWS services
* Event-driven processing
* Reduced infrastructure maintenance

The design specifically targets unpredictable traffic such as course launches, assignment waves, and compliance pushes.

---

# Scope and Constraints

The current version:

* Uses externally hosted video content such as YouTube/Vimeo.
* Targets a single AWS account/region.
* Does not include multi-region disaster recovery.
* Uses Cognito-managed identities.
* Does not include corporate SSO/SAML federation in v1.
* Uses on-demand DynamoDB capacity.

Multi-region DR and corporate SSO/SAML are identified as future enhancements.

---

# Future Enhancements

Potential future improvements include:

* Corporate SSO/SAML integration
* Multi-region disaster recovery
* Advanced analytics
* Skill recommendations
* Automated learning paths
* Course search and filtering
* Additional certificate formats
* Mobile application
* Advanced HR reporting
* AI-assisted skill-gap recommendations

---

# License

This project is intended for educational/internal engineering purposes.

Add the appropriate license here if the project is released publicly.

---

# Team

**Employee Learning & Skill Certification Tracker**

Built using a serverless AWS architecture.

```text
React
   +
Amazon Cognito
   +
API Gateway
   +
AWS Lambda
   +
DynamoDB
   +
S3
   +
SES / SNS
   +
EventBridge
   +
CloudWatch
   +
IAM
```

**Project Version:** 1.0
**Cloud Provider:** Amazon Web Services (AWS)
