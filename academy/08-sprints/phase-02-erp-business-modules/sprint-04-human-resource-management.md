# Sprint 04 - Human Resource Management

**Sprint:** Sprint 04  
**Phase:** Phase 02 - ERP Business Modules  
**Duration:** 4 Weeks  
**Release Target:** v0.5.0  
**Status:** Planned

---

# Sprint Goal

Implement the Human Resource Management (HRM) module by introducing employee-focused business workflows built on top of the Organization & Employee Management foundation.

At the end of this sprint, the ERP platform should support core HR operations including employee lifecycle management, attendance tracking, leave management, approval workflows, and employee self-service capabilities.

---

# Sprint Context

The previous phases established the ERP platform foundation.

```
Phase 00
Engineering Foundation

↓

Phase 01
Core Platform

• Identity & Access Management
• Organization Management
• Employee Management

↓

Phase 02
ERP Business Modules
```

Sprint 04 is the first functional ERP module where users begin performing real business operations instead of maintaining master data.

---

# Business Outcome

After completing this sprint, the ERP platform will support:

- Employee lifecycle management
- Attendance management
- Leave management
- Employee self-service
- Manager approvals
- HR reporting dashboard

---

# Sprint Objectives

By the end of this sprint, learners should be able to:

- Understand HR business processes.
- Build workflow-driven ERP applications.
- Implement approval-based systems.
- Model HR transactional data.
- Design employee-centric user experiences.
- Build secure HR APIs.

---

# Sprint Theme

## From Employee Records to Employee Operations

The previous sprint stored employee information.

This sprint allows employees, managers, and HR personnel to perform daily business activities.

```
Employee

↓

Attendance

↓

Leave Request

↓

Approval

↓

HR Reporting
```

---

# Business Capabilities

This sprint introduces:

- Employee Profile Management
- Employment Lifecycle
- Attendance Tracking
- Leave Management
- Approval Workflow
- HR Dashboard

---

# Domain Concepts

## Employee

Represents a company employee.

Stores:

- Personal Information
- Employment Information
- Department
- Position
- Manager
- Employment Status

---

## Employment Lifecycle

Tracks an employee from hiring until separation.

Example:

```
Applicant

↓

Hired

↓

Probation

↓

Active

↓

Resigned

↓

Archived
```

---

## Attendance

Represents an employee's daily work record.

Stores:

- Date
- Clock In
- Clock Out
- Working Hours
- Attendance Status

---

## Leave Request

Represents an employee leave application.

Workflow:

```
Employee

↓

Submit Request

↓

Manager Approval

↓

HR Validation

↓

Completed
```

---

## Leave Types

Examples:

- Vacation Leave
- Sick Leave
- Emergency Leave
- Maternity Leave
- Paternity Leave
- Unpaid Leave

---

# Sprint Scope

---

# 1. Employee Profile Enhancement

## Objective

Expand employee records to support HR operations.

### Features

- Employee Number
- Employment Date
- Employment Type
- Emergency Contact
- Personal Details
- Government IDs
- Employment Status

### Acceptance Criteria

- Employee profile completed.
- Validation rules implemented.
- Profile updates audited.

---

# 2. Employment Lifecycle Management

## Objective

Track employee employment status.

Supported statuses:

- Probation
- Regular
- Contractual
- On Leave
- Suspended
- Resigned
- Terminated

### Acceptance Criteria

- Status updates recorded.
- Status history maintained.
- Audit logs generated.

---

# 3. Attendance Management

## Objective

Implement attendance recording.

### Features

Employees can:

- Clock In
- Clock Out
- View Attendance History

Managers can:

- Review attendance

HR can:

- Generate attendance reports

### Attendance Record

```
Employee

Date

Clock In

Clock Out

Total Hours

Status
```

### Acceptance Criteria

- Attendance records stored.
- Late arrivals detected.
- Working hours calculated.

---

# 4. Leave Management

## Objective

Allow employees to request leave.

### Features

Employees can:

- Submit Leave Request
- View Leave Balance
- Cancel Pending Request

Managers can:

- Approve Leave
- Reject Leave

HR can:

- Monitor Leave Utilization

---

## Leave Workflow

```
Employee

↓

Create Leave Request

↓

Manager Review

↓

Approve / Reject

↓

HR Notification

↓

Leave Balance Updated
```

### Acceptance Criteria

- Leave requests submitted.
- Approval workflow functional.
- Leave balances automatically updated.

---

# 5. Leave Balance Management

## Objective

Track employee leave credits.

Example:

```
Annual Leave

Allocated: 15 Days

Used: 4 Days

Remaining: 11 Days
```

### Acceptance Criteria

- Leave credits initialized.
- Leave usage deducted automatically.
- Leave balance available in employee portal.

---

# 6. Employee Self-Service Portal

## Objective

Allow employees to manage their own HR information.

Employees can:

- View Profile
- Update Contact Information
- View Attendance
- Submit Leave
- View Leave Balance

### Acceptance Criteria

- Employees access only their own records.
- Role-based permissions enforced.

---

# 7. HR Dashboard

## Objective

Provide HR insights.

Dashboard Metrics:

- Total Employees
- Active Employees
- Employees by Department
- Employees on Leave
- Attendance Today
- Pending Leave Requests
- Leave Utilization

### Acceptance Criteria

- Dashboard loads correctly.
- Metrics update automatically.

---

# Database Design

## New Entities

```
Employee

EmploymentHistory

Attendance

LeaveType

LeaveRequest

LeaveBalance
```

---

## Employee

Example fields:

```
id

employeeNumber

userId

departmentId

positionId

employmentDate

employmentStatus
```

---

## Attendance

```
id

employeeId

attendanceDate

clockIn

clockOut

workingHours

status
```

---

## Leave Request

```
id

employeeId

leaveTypeId

startDate

endDate

reason

status

approvedBy
```

---

## Leave Balance

```
id

employeeId

leaveTypeId

allocatedDays

usedDays

remainingDays
```

---

# API Requirements

## Employee APIs

```
GET    /api/employees

GET    /api/employees/{id}

PUT    /api/employees/{id}
```

---

## Attendance APIs

```
POST   /api/attendance

GET    /api/attendance

GET    /api/attendance/{employeeId}
```

---

## Leave APIs

```
POST   /api/leaves

GET    /api/leaves

PUT    /api/leaves/{id}/approve

PUT    /api/leaves/{id}/reject
```

---

## Dashboard API

```
GET /api/hr/dashboard
```

---

# GitHub Execution

## Epic

**Human Resource Management**

---

## Issues

### Issue 022

Enhance Employee Profile

---

### Issue 023

Employment Lifecycle Management

---

### Issue 024

Attendance Management

---

### Issue 025

Leave Management

---

### Issue 026

Leave Balance Management

---

### Issue 027

Employee Self-Service Portal

---

### Issue 028

HR Dashboard

---

# Testing Requirements

## Unit Testing

Validate:

- Attendance calculations
- Leave balance calculations
- Employment status transitions
- Approval rules

---

## Integration Testing

Test:

- Employee APIs
- Attendance APIs
- Leave APIs
- Dashboard APIs

---

## End-to-End Testing

### Attendance Flow

```
Login

↓

Clock In

↓

Clock Out

↓

Attendance Recorded
```

---

### Leave Flow

```
Employee Login

↓

Submit Leave Request

↓

Manager Approval

↓

HR Review

↓

Leave Balance Updated
```

---

# Documentation Deliverables

Business Documentation:

- HR BRD
- Leave Process Flow
- Attendance Process Flow

Technical Documentation:

- HR Architecture
- Updated ERD
- API Documentation
- Business Rules ADR

---

# Sprint Deliverables

## HR Module

- Employee Profile Enhancement
- Attendance Management
- Leave Management
- Employee Self-Service
- HR Dashboard

---

## Engineering

- REST APIs
- Database Schema
- Automated Tests
- API Documentation

---

## Documentation

- BRD
- SRS Updates
- Process Flows
- ERD Updates

---

# Sprint Review

The learner demonstrates:

1. Employee profile management.
2. Attendance recording.
3. Leave request submission.
4. Manager approval.
5. Employee self-service.
6. HR dashboard reporting.

---

# Sprint Retrospective

## Discussion Topics

- Business workflow implementation
- Approval process design
- HR domain modeling
- Lessons learned
- Improvements for future modules

---

# Release

**Version:** `v0.5.0`

---

# Release Notes

```markdown
# v0.5.0

## Added

- Human Resource Management Module
- Employee Self-Service
- Attendance Management
- Leave Management
- Leave Balance Tracking
- HR Dashboard
- Approval Workflow
```

---

# Definition of Done

- [ ] Employee profiles enhanced.
- [ ] Attendance management completed.
- [ ] Leave management completed.
- [ ] Approval workflow implemented.
- [ ] Employee self-service operational.
- [ ] HR dashboard completed.
- [ ] APIs documented.
- [ ] Tests passing.
- [ ] Documentation completed.
- [ ] Pull Request approved.
- [ ] Release v0.5.0 published.

---

# Skills Acquired

After completing Sprint 04, learners will understand:

## Business Analysis

- HR business processes
- Employee lifecycle
- Approval workflows

## Backend Development

- Workflow implementation
- Business rules
- Transaction management

## Frontend Development

- Enterprise dashboards
- Employee portals
- HR user interfaces

## ERP Engineering

- Building a complete ERP business module
- Connecting master data to operational workflows
- Designing scalable business applications

---

# Next Sprint Preview

# Sprint 05 - Inventory Management

The next sprint introduces inventory operations including:

- Product Management
- Warehouse Management
- Inventory Transactions
- Stock Movement
- Inventory Reporting
- Multi-Warehouse Support