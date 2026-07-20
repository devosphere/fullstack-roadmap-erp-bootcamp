# ERP Bootcamp Glossary

**Document Version:** 1.0  
**Purpose:** Provide a common vocabulary for software engineering, product development, and ERP system implementation.

---

# Introduction

Professional software development requires teams to share a common language.

This glossary defines commonly used terms throughout the ERP Bootcamp, covering:

- Software Engineering
- Product Management
- Agile Development
- Architecture
- Development Practices
- Testing
- DevOps
- ERP Concepts

Students should refer to this document whenever unfamiliar terminology is encountered.

---

# A

## Acceptance Criteria

A set of conditions that a software feature must satisfy before it can be considered complete.

Example:

```
Given a logged-in employee

When the employee submits a leave request

Then the request should be saved successfully
```

---

## API (Application Programming Interface)

A communication interface that allows different software systems to exchange data.

Example:

```
Frontend Application

↓

API Request

↓

Backend Service

↓

Database
```

---

## API Endpoint

A specific URL where an API operation can be performed.

Example:

```
GET /api/users
```

Retrieves users from the system.

---

## Architecture

The overall structure and design of a software system.

Architecture defines:

- Components
- Relationships
- Data flow
- Technology decisions

---

## ADR (Architecture Decision Record)

A document that records important technical decisions and the reasoning behind them.

Example:

> Decision: Use PostgreSQL as the primary database.

---

# B

## Backend

The server-side portion of an application responsible for:

- Business logic
- Database operations
- Authentication
- APIs

Example technologies:

- Node.js
- NestJS
- Java Spring Boot
- .NET

---

## BRD (Business Requirements Document)

A document describing:

- Business problems
- Goals
- Scope
- Expected outcomes

BRD answers:

> "Why are we building this?"

---

## Branch

A separate line of development in Git.

Examples:

```
main

develop

feature/user-login
```

---

## Business Logic

Rules and processes that define how a system behaves.

Example:

```
Employee cannot approve their own leave request.
```

---

# C

## CI/CD (Continuous Integration / Continuous Delivery)

A software practice that automatically builds, tests, and deploys applications.

Example:

```
Code Push

↓

GitHub Actions

↓

Tests

↓

Build

↓

Deploy
```

---

## Code Review

A process where engineers review each other's code before merging changes.

Goals:

- Improve quality
- Find defects
- Share knowledge

---

## Commit

A saved change in Git history.

Example:

```
feat: add employee authentication
```

---

## CRUD

The four basic database operations:

| Operation | Meaning |
|-----------|---------|
| Create | Add data |
| Read | View data |
| Update | Modify data |
| Delete | Remove data |

---

# D

## Database

A system used to store and manage application data.

Examples:

- PostgreSQL
- MySQL
- MongoDB

---

## Deployment

The process of making software available in an environment.

Examples:

- Development
- Testing
- Staging
- Production

---

## DevOps

A combination of development and operations practices focused on:

- Automation
- Deployment
- Infrastructure
- Reliability

---

## Docker

A technology used to package applications and their dependencies into containers.

Benefits:

- Consistent environments
- Easier deployment
- Faster onboarding

---

# E

## ERP (Enterprise Resource Planning)

A business software system that integrates multiple company processes.

Examples:

Modules:

- Human Resources
- Inventory
- Sales
- Purchasing
- Finance
- Accounting

---

## Entity

A database object representing a business concept.

Examples:

```
Employee

Customer

Product

Order
```

---

## E2E Testing (End-to-End Testing)

Testing the complete user workflow from beginning to end.

Example:

```
User Login

↓

Create Order

↓

Payment

↓

Confirmation
```

---

# F

## Frontend

The user-facing part of an application.

Responsible for:

- Interface
- User interaction
- Displaying information

Examples:

- React
- Vue
- Angular
- Next.js

---

## Framework

A software development foundation that provides structure and tools.

Examples:

- Next.js
- NestJS
- Angular

---

# G

## Git

A distributed version control system used to track software changes.

---

## GitHub

A platform for hosting Git repositories and managing software collaboration.

Used for:

- Issues
- Pull Requests
- Actions
- Code reviews

---

## GitHub Actions

A CI/CD automation platform built into GitHub.

Used for:

- Testing
- Building
- Deploying

---

# I

## Integration Testing

Testing how multiple software components work together.

Example:

```
Frontend

↓

API

↓

Database
```

---

## Issue

A GitHub task representing work that needs to be completed.

Examples:

- Feature
- Bug
- Improvement
- Documentation

---

# J

## JWT (JSON Web Token)

A secure token format used for authentication.

Example:

```
User Login

↓

JWT Token

↓

Access Protected Resources
```

---

# M

## Migration

A controlled database change.

Examples:

- Add table
- Add column
- Modify relationship

---

## Middleware

Software that runs between incoming requests and application logic.

Examples:

- Authentication
- Logging
- Validation

---

# N

## Node.js

A JavaScript runtime used for backend development.

---

## Non-Functional Requirement

A requirement describing system qualities.

Examples:

- Performance
- Security
- Availability
- Scalability

---

# P

## Pull Request (PR)

A request to merge code changes into another branch.

Purpose:

- Review changes
- Validate quality
- Discuss implementation

---

## Product Backlog

A prioritized list of work required for a product.

Contains:

- Features
- Bugs
- Improvements

---

## Product Owner (PO)

The person responsible for maximizing product value.

Responsibilities:

- Prioritization
- Requirements
- Stakeholder alignment

---

# R

## RBAC (Role-Based Access Control)

A security model where permissions are assigned through roles.

Example:

```
Administrator

↓

Manage Users
Manage Settings
```

---

## Release

A version of software delivered to users.

Example:

```
v1.0.0
```

---

## REST API

An API design approach using HTTP methods.

Examples:

```
GET

POST

PUT

DELETE
```

---

# S

## Scrum

An Agile framework for managing software development.

Key concepts:

- Sprint
- Backlog
- Review
- Retrospective

---

## Sprint

A fixed development period where a team delivers planned work.

Typical duration:

```
1-4 weeks
```

---

## SRS (Software Requirements Specification)

A document describing detailed technical requirements.

SRS answers:

> "What should the system do?"

---

## Stakeholder

A person or group affected by the software.

Examples:

- Customers
- Employees
- Managers
- Business owners

---

# T

## Technical Debt

The future cost created by choosing a faster but less optimal solution.

Example:

Temporary code that requires future improvement.

---

## TypeScript

A programming language that adds static typing to JavaScript.

Benefits:

- Better maintainability
- Fewer errors
- Improved developer experience

---

# U

## Unit Testing

Testing individual pieces of software.

Examples:

- Functions
- Classes
- Components

---

## User Story

A description of functionality from a user's perspective.

Format:

```
As a <user>

I want <feature>

So that <benefit>
```

---

# V

## Version Control

A system that tracks changes to files over time.

Example:

Git.

---

## Vue

A frontend JavaScript framework used to build user interfaces.

---

# W

## Workflow

A defined process for completing work.

Example:

```
Issue

↓

Branch

↓

Development

↓

Pull Request

↓

Review

↓

Merge
```

---

# Software Development Lifecycle (SDLC)

The complete process of building software.

Typical phases:

```
Requirements

↓

Design

↓

Development

↓

Testing

↓

Deployment

↓

Maintenance
```

---

# Environment Definitions

## Development Environment

Used by developers for building and testing locally.

---

## Testing Environment

Used for QA validation.

---

## Staging Environment

A production-like environment used before release.

---

## Production Environment

The live system used by real users.

---

# ERP Module Definitions

## Human Resources (HR)

Manages:

- Employees
- Departments
- Leave
- Attendance

---

## Inventory Management

Manages:

- Products
- Stock
- Warehouses
- Movements

---

## Sales Management

Manages:

- Customers
- Orders
- Invoices

---

## Purchasing

Manages:

- Suppliers
- Purchase Orders
- Procurement

---

## Finance

Manages:

- Transactions
- Accounting
- Reporting

---

# Engineering Principles

## DRY (Don't Repeat Yourself)

Avoid unnecessary duplication.

---

## KISS (Keep It Simple, Stupid)

Prefer simple solutions over unnecessary complexity.

---

## SOLID Principles

Object-oriented design principles:

- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

---

# Notes

This glossary should continuously evolve as the ERP project grows.

New terms should be added whenever:

- A new technology is introduced.
- A new architectural concept is adopted.
- A business domain is implemented.
- A process becomes part of the engineering workflow.

A strong engineering team develops not only code, but also a shared understanding of language and concepts.