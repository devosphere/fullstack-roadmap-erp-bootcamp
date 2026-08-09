# GitHub Issue Template

**Issue Type:** Feature | Bug | Task | Improvement | Documentation  
**Priority:** Low | Medium | High | Critical  
**Sprint:** Sprint XX  
**Module:**  
**Related Requirement:** BRD / SRS Reference  

---

# Title

## Format

Use a clear and descriptive title.

Examples:

```
[FEATURE] Add Employee Management Module

[BUG] Fix incorrect leave balance calculation

[TASK] Configure Docker development environment
```

---

# Description

## Background

Describe why this work is needed.

Include:

- Business context
- Technical context
- User impact

Example:

> HR users currently maintain employee records manually. The system requires a centralized employee management module to improve accuracy and reduce administrative effort.

---

# Objective

Describe the expected outcome.

Example:

> Implement employee CRUD functionality allowing authorized users to create, view, update, and deactivate employee records.

---

# Scope

## Included

List what is included.

Example:

- Create employee record
- Update employee information
- View employee profile
- Search employees

---

## Out of Scope

List what is not included.

Example:

- Payroll calculation
- Mobile application
- Employee self-service portal

---

# User Story

Use the standard Agile format:

```
As a <user role>

I want <capability>

So that <business value>
```

Example:

```
As an HR Administrator,

I want to create employee records,

So that employee information can be managed digitally.
```

---

# Acceptance Criteria

The issue is complete when all acceptance criteria are satisfied.

Use Given / When / Then format.

Example:

```gherkin
Given the user is logged in as an HR Administrator

When the user creates a new employee record

Then the system should save the employee information successfully
```

Additional criteria:

- [ ] User can create records
- [ ] Required fields are validated
- [ ] Error messages are displayed correctly
- [ ] Data is stored successfully
- [ ] Automated tests are added

---

# Functional Requirements

Reference the related SRS requirements.

Example:

```
SRS-001
SRS-002
SRS-003
```

---

# Technical Requirements

Describe technical implementation expectations.

Examples:

Frontend:

- Create React component
- Add form validation
- Implement API integration

Backend:

- Create REST endpoint
- Add service logic
- Add database operations

Database:

- Create migration
- Update schema

Testing:

- Add unit tests
- Add integration tests

---

# UI / UX Requirements

If applicable, describe interface expectations.

Include:

- Screens
- User flows
- Validation messages
- Design references

Example:

```
Employee List

↓

Employee Details

↓

Edit Employee
```

---

# API Requirements

If applicable:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/employees | Retrieve employees |
| POST | /api/employees | Create employee |

Reference the API Design document.

---

# Database Changes

Document required data changes.

Examples:

New Table:

```
employees
```

New Column:

```
employee.status
```

Migration Required:

```
YES / NO
```

---

# Dependencies

List dependencies.

Examples:

- Authentication Module
- User Management
- Database Migration
- External API

---

# Risks

Identify possible issues.

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large data migration | High | Migration testing |
| API changes | Medium | Version endpoint |

---

# Implementation Checklist

## Development

- [ ] Create feature branch
- [ ] Implement functionality
- [ ] Add automated tests
- [ ] Update documentation
- [ ] Run local validation

---

## Quality Assurance

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

---

## Pull Request

- [ ] PR created
- [ ] Reviewer assigned
- [ ] Code review completed
- [ ] GitHub Actions passing
- [ ] Changes approved

---

# Testing Evidence

Provide evidence of validation.

Examples:

Screenshots:

```
Attach screenshot
```

Test Results:

```
Unit Tests: PASS

Integration Tests: PASS

E2E Tests: PASS
```

---

# Definition of Done

This issue is complete when:

- [ ] Requirements are implemented
- [ ] Acceptance Criteria are satisfied
- [ ] Code follows project standards
- [ ] Tests are added
- [ ] Documentation is updated
- [ ] Pull Request is approved
- [ ] GitHub Actions pass
- [ ] Changes are merged
- [ ] Release notes are updated (if applicable)

---

# GitHub Workflow

Every issue follows the engineering workflow.

```text
Business Requirement
        │
        ▼
GitHub Issue
        │
        ▼
Sprint Planning
        │
        ▼
Feature Branch
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Pull Request
        │
        ▼
GitHub Actions
        │
        ▼
Code Review
        │
        ▼
Merge
        │
        ▼
Release
```

---

# Related Links

BRD:

```
Link here
```

SRS:

```
Link here
```

ADR:

```
Link here
```

Design:

```
Link here
```

Pull Request:

```
Link here
```

---

# Notes

This template is the standard GitHub Issue format for the ERP Bootcamp.

All development work should begin from a GitHub Issue. Issues provide traceability between business requirements, implementation, testing, and release activities.

A properly written issue should allow any engineer, QA engineer, product manager, or stakeholder to understand:

- Why the work exists
- What needs to be built
- How success is measured
- How the change will be validated