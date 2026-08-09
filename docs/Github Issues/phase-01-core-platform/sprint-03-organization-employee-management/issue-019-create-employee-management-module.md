# [FEATURE] Create Employee Management Module

<!-- GitHub title: [FEATURE] Create Employee Management Module
     Labels: feature, hr, priority: critical
     Milestone: Sprint 03 - Organization & Employee Management
     Branch: feature/019-create-employee-management-module
     Epic: Organization & Employee Management
     Depends on: 017, 018
     Blocks: 020, 021
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [ ] High
- [x] Critical

## Module: hr
## Sprint: Sprint 03 - Organization & Employee Management

---

## Summary

Create employee master records: personal and employment details, department and position
assignment, employment status, and employee search and filtering.

## Background

The employee record is the most referenced entity in the ERP system after `User`. Attendance, leave,
payroll, approvals, requisitions, and HR reporting all resolve back to it.

Two decisions shape everything downstream:

- **Employee is separate from User.** Not every employee has a login (factory staff, contractors),
  and not every user is an employee (a system integration account). Merging them seems simpler until
  the first employee without an account needs a leave record. They are linked in Issue 020, not merged.
- **Records are never deleted.** Employment history must remain intact for audit, payroll, and legal
  retention. Employees are terminated, not removed.

This record also holds personal data, which makes it the first module where access control is about
privacy rather than function.

## User Story

As an HR Administrator,
I want to create and maintain employee records with their department and position,
So that the organization's workforce is accurately represented for HR and approval processes.

## Acceptance Criteria

```gherkin
Given an authenticated HR administrator
When they create an employee with a unique employee number, department, and position
Then the employee record is created with status Active
```

```gherkin
Given an existing employee
When an administrator sets their status to Terminated with an end date
Then the record is retained and excluded from active employee lists
```

```gherkin
Given a user without employee read permission
When they request the employee list
Then the request is rejected with 403
```

```gherkin
Given an employee list containing many records
When a user searches by name, department, or position
Then only matching records are returned, paginated
```

- [ ] `GET /api/employees` lists employees with pagination
- [ ] `POST /api/employees` creates an employee
- [ ] `GET /api/employees/{id}` returns an employee profile
- [ ] `PUT /api/employees/{id}` updates an employee
- [ ] `PATCH /api/employees/{id}/status` changes employment status
- [ ] Employee number uniqueness enforced and auto-generated if not supplied
- [ ] Personal details stored: name, date of birth, gender, contact, address
- [ ] Employment details stored: hire date, department, position, employment type
- [ ] Employment status lifecycle enforced
- [ ] Employees are never hard-deleted
- [ ] Search by name, employee number, department, position, and status
- [ ] Filtering combinable and paginated
- [ ] Terminated employees excluded from default listings
- [ ] Permissions declared and enforced on every endpoint
- [ ] ERD updated

## Expected Result

An HR administrator can maintain the full employee roster, search it efficiently, and change
employment status without losing history. Unauthorized users cannot read personal data.

---

## Scope

### Included

- Employee CRUD endpoints
- Personal and employment detail fields
- Department and position assignment
- Employment status lifecycle
- Search, filtering, and pagination
- Permission enforcement
- ERD update

### Out of Scope

- Linking employees to user accounts (Issue 020)
- Reporting hierarchy and manager assignment (Issue 021)
- Extended profile: documents, emergency contacts, qualifications (Sprint 04, Issue 022)
- Full employment lifecycle: probation, promotion, transfer (Sprint 04, Issue 023)
- Attendance and leave (Sprint 04)
- Salary and compensation

## Technical Requirements

**Endpoints**

```text
GET    /api/employees
POST   /api/employees
GET    /api/employees/{id}
PUT    /api/employees/{id}
PATCH  /api/employees/{id}/status
```

**Schema**

```text
Employee

id
employeeNumber     unique
firstName
lastName
middleName
dateOfBirth
gender
email
phone
address
hireDate
endDate            nullable
departmentId       → Department
positionId         → Position
employmentType     enum
status             enum
createdAt
updatedAt
```

**Employment status**

```text
ACTIVE → ON_LEAVE → SUSPENDED → TERMINATED
```

`TERMINATED` is terminal — reinstatement creates a new employment record rather than reopening the
old one.

**Employment type**

```text
FULL_TIME
PART_TIME
CONTRACT
PROBATIONARY
INTERN
```

**Permissions to add**

```text
EMPLOYEE_READ
EMPLOYEE_CREATE
EMPLOYEE_UPDATE
EMPLOYEE_STATUS_CHANGE
```

Assign `EMPLOYEE_READ` to HR Officer and Manager; restrict the rest to HR Officer.

**Rules**

- Search must be indexed — this list grows and is queried by every later HR feature.
- Setting status to `TERMINATED` requires an end date.
- Date of birth and address are personal data; ensure they are not written to logs.

## Dependencies

- Issue 017 — departments must exist.
- Issue 018 — positions must exist.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for status transition rules and employee number generation
- [ ] Integration tests for CRUD, search, and filtering
- [ ] Denial tests for users without employee read permission
- [ ] Test confirming terminated employees are excluded by default
- [ ] Search performance acceptable on a seeded dataset
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-03-organization-employee-management.md` § 4, § 7 |
| Epic | Organization & Employee Management |
| Extended by | Issues 022, 023 (Sprint 04) |
| Pull Request | _to be linked_ |
