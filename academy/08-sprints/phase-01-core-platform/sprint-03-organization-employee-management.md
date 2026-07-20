# Sprint 03 - Organization & Employee Management

**Sprint:** Sprint 03  
**Phase:** Phase 01 - Core Platform  
**Duration:** 3-4 Weeks  
**Release Target:** v0.4.0  
**Status:** Planned

---

# Sprint Goal

Implement the organizational foundation of the ERP platform by creating company structure, department management, employee profiles, and organizational relationships.

At the end of this sprint, the ERP system should understand the structure of the organization and its workforce.

---

# Sprint Context

Sprint 02 established the identity and security foundation.

The system now knows:

```
Who the user is

↓

What the user can access
```

Sprint 03 introduces organizational context:

```
Who the user represents

↓

Where they belong in the organization

↓

What business structure they operate within
```

This becomes the foundation for future ERP modules:

- Human Resources
- Payroll
- Attendance
- Leave Management
- Approval Workflows
- Reporting

---

# Business Outcome

After completing this sprint, the ERP platform will support:

- Company profile management.
- Department organization.
- Employee records.
- Employee-to-user relationships.
- Organizational hierarchy.
- Basic employee lifecycle management.

---

# Sprint Objectives

By the end of this sprint, the learner should understand:

- Enterprise organizational modeling.
- Master data concepts.
- Employee lifecycle concepts.
- Database relationship design.
- Business process modeling.
- Building reusable ERP foundations.

---

# Sprint Theme

## "Every Enterprise System Starts With People"

ERP systems are built around business operations.

Before managing:

- Sales
- Inventory
- Finance
- Projects

The system must understand:

```
Company

↓

Departments

↓

Employees

↓

Roles

↓

Responsibilities
```

---

# Business Capability

## Organization Management

Provides:

- Company structure.
- Departments.
- Positions.
- Organizational hierarchy.

---

## Employee Management

Provides:

- Employee profiles.
- Employment information.
- Employee status.
- User association.

---

# Domain Concepts

---

# Company

Represents the organization using the ERP system.

Example:

```
ABC Corporation
```

---

# Department

Represents a business unit within the company.

Examples:

```
Engineering

Human Resources

Finance

Sales
```

---

# Employee

Represents a person working in the organization.

Example:

```
John Smith

Software Engineer
```

---

# Position

Represents a job role or designation.

Examples:

```
Software Engineer

Product Manager

Finance Manager
```

---

# Employment Status

Defines employee state.

Examples:

```
Active

Inactive

On Leave

Resigned
```

---

# Organization Hierarchy

Defines reporting relationships.

Example:

```
CEO

 |

Engineering Director

 |

Engineering Manager

 |

Software Engineer
```

---

# Sprint Scope

---

# 1. Company Management

## Objective

Create company master data.

---

## Features

Users can:

- Create company profile.
- Update company information.
- View company details.

---

## Company Information

Example:

```
Company Name

Registration Number

Address

Contact Information

Status
```

---

## Acceptance Criteria

- Company entity created.
- Company CRUD implemented.
- Validation applied.

---

# 2. Department Management

## Objective

Create organizational departments.

---

## Features

Users can:

- Create departments.
- Update departments.
- Assign department heads.
- View department structure.

---

## Example

```
ABC Corporation

├── Engineering

├── Finance

├── HR

└── Sales
```

---

## Acceptance Criteria

- Department CRUD implemented.
- Departments linked to company.
- Department hierarchy supported.

---

# 3. Position Management

## Objective

Create organizational positions.

---

## Examples

```
Software Engineer

Senior Developer

Team Lead

Manager
```

---

## Acceptance Criteria

- Position entity created.
- Positions assigned to employees.
- Position history supported.

---

# 4. Employee Profile Management

## Objective

Create employee master records.

---

## Employee Information

Example:

```
Personal Information

Employment Information

Contact Details

Department

Position

Manager
```

---

## Acceptance Criteria

- Employee CRUD implemented.
- Employee linked to department.
- Employee linked to position.
- Employee status tracked.

---

# 5. User-Employee Association

## Objective

Connect system users with employee records.

---

## Relationship

```text
User

|

|

Employee

|

|

Department
```

---

## Example

```
System User:

john.smith@company.com


Employee:

John Smith

Department:

Engineering
```

---

## Acceptance Criteria

- User can have employee profile.
- Employee access controlled by IAM.
- Relationship documented.

---

# 6. Organizational Hierarchy

## Objective

Support reporting structures.

---

## Example

```
CEO

↓

CTO

↓

Engineering Manager

↓

Developer
```

---

## Implementation

Employee relationships:

```
employee.manager_id
```

---

## Acceptance Criteria

- Manager relationships supported.
- Organization tree view possible.

---

# 7. Employee Search & Filtering

## Objective

Provide employee discovery.

---

## Features

Search by:

- Name
- Department
- Position
- Status

---

## Acceptance Criteria

- Search works.
- Filters work.
- Pagination implemented.

---

# Database Design

Initial entities:

```text
Company

|

Department

|

Position

|

Employee

|

User
```

---

# Company Table

Example:

```
id

name

registrationNumber

address

status

createdAt
```

---

# Department Table

Example:

```
id

companyId

name

managerId

createdAt
```

---

# Position Table

Example:

```
id

name

description
```

---

# Employee Table

Example:

```
id

userId

departmentId

positionId

managerId

firstName

lastName

status

hireDate
```

---

# Relationships

```text
Company

1 ---- *

Department


Department

1 ---- *

Employee


Position

1 ---- *

Employee


Employee

1 ---- *

Employee
(manager relationship)
```

---

# API Requirements

---

# Company APIs

```
GET /api/companies

POST /api/companies

PUT /api/companies/:id
```

---

# Department APIs

```
GET /api/departments

POST /api/departments

PUT /api/departments/:id
```

---

# Employee APIs

```
GET /api/employees

POST /api/employees

PUT /api/employees/:id

GET /api/employees/:id
```

---

# Organization APIs

```
GET /api/organization/tree
```

---

# GitHub Execution

---

# Epic

## Epic: Organization & Employee Management

Purpose:

Build the organizational foundation required for ERP business processes.

---

# GitHub Issues

---

# Issue 016 - Create Company Management Module

Type:

```
Feature
```

Acceptance Criteria:

- Company CRUD available.
- Company validation implemented.

---

# Issue 017 - Create Department Management

Type:

```
Feature
```

Acceptance Criteria:

- Department CRUD available.
- Department hierarchy supported.

---

# Issue 018 - Create Position Management

Type:

```
Feature
```

Acceptance Criteria:

- Position records available.
- Employees can be assigned positions.

---

# Issue 019 - Create Employee Management Module

Type:

```
Feature
```

Acceptance Criteria:

- Employee CRUD completed.
- Employee information stored.

---

# Issue 020 - Connect Users With Employees

Type:

```
Feature
```

Acceptance Criteria:

- IAM users linked to employees.

---

# Issue 021 - Implement Organization Tree

Type:

```
Feature
```

Acceptance Criteria:

- Reporting hierarchy displayed.

---

# Development Workflow

Every change follows:

```text
GitHub Issue

↓

Feature Branch

↓

Development

↓

Pull Request

↓

Code Review

↓

Merge

↓

Release
```

---

# Testing Requirements

---

# Unit Testing

Required:

- Employee validation rules.
- Department hierarchy logic.
- Organization rules.

---

# Integration Testing

Required:

- Company APIs.
- Employee APIs.
- User relationship APIs.

---

# End-to-End Testing

Required workflow:

```
Admin Login

↓

Create Company

↓

Create Department

↓

Create Employee

↓

Assign Employee Role

↓

View Organization
```

---

# Documentation Requirements

Create:

## Business Documentation

- Organization management BRD.
- Employee lifecycle process flow.

---

## Technical Documentation

- Updated ERD.
- API documentation.
- Organization architecture.
- ADR decisions.

---

# Architecture Update

After this sprint:

```text
                 ERP Platform

                       |

        --------------------------------

        |                              |

 Identity Module              Organization Module

        |                              |

        |                       Employee Service

        |                              |

        ------------ PostgreSQL ---------
```

---

# Sprint Deliverables

At completion:

## Organization

✅ Company management

✅ Department management

✅ Position management

---

## Employee

✅ Employee profiles

✅ Employee hierarchy

✅ User association

---

## Engineering

✅ APIs documented

✅ Tests created

✅ ERD updated

---

# Sprint Review

The learner demonstrates:

1. Create company.
2. Create departments.
3. Create positions.
4. Create employees.
5. Assign employees to departments.
6. View organization hierarchy.
7. Access control validation.

---

# Sprint Retrospective

Discuss:

## What Went Well?

Examples:

- ERP domain modeling understood.
- Database relationships improved.

---

## Challenges

Examples:

- Entity relationships.
- Organizational hierarchy.

---

## Improvements

Examples:

- Better data validation.
- Better user experience.

---

# Release Preparation

Release:

```
v0.4.0
```

---

## Release Notes

```markdown
# v0.4.0

Organization & Employee Management Release

Added:

- Company management
- Department management
- Position management
- Employee profiles
- Organization hierarchy
- User-employee association
```

---

# Definition of Done

Sprint 03 is complete when:

- [ ] Company management works.
- [ ] Department management works.
- [ ] Employee management works.
- [ ] User and employee relationship works.
- [ ] Organization hierarchy works.
- [ ] APIs documented.
- [ ] Tests passing.
- [ ] Documentation updated.
- [ ] Pull Request reviewed.
- [ ] Release v0.4.0 published.

---

# Skills Acquired

After completing Sprint 03, the learner understands:

## Business Analysis

- Organizational processes.
- Master data concepts.
- ERP domain modeling.

## Backend

- Entity relationships.
- Business services.
- Complex data models.

## Frontend

- Enterprise forms.
- Data tables.
- Organization views.

## Engineering

- Building reusable ERP foundations.
- Designing scalable business modules.

---

# Next Sprint Preview

# Sprint 04 - Human Resource Management

The next sprint begins the first major ERP business module.

Planned:

- Employee lifecycle.
- Attendance.
- Leave management.
- HR workflows.
- Employee self-service.