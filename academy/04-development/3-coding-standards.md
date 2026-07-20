# Coding Standards

**Version:** 1.0

---

# Purpose

Coding Standards establish a common set of rules, conventions, and best practices that every engineer must follow throughout this bootcamp.

The purpose of coding standards is not to restrict creativity, but to ensure that software remains readable, maintainable, scalable, and easy for other engineers to understand.

Professional software is developed by teams, not individuals. Therefore, consistency is more important than personal preference.

Throughout this bootcamp, **all source code submitted for review must comply with these standards.**

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Write clean and maintainable code
- Follow consistent naming conventions
- Apply software engineering best practices
- Organize projects using a modular architecture
- Produce code suitable for professional code reviews
- Minimize technical debt

---

# Engineering Principles

Every line of code should follow these principles.

## Readability

Code should be written for humans first.

Good code explains itself.

If another engineer cannot understand your code within a few minutes, it is probably too complex.

---

## Simplicity

Prefer simple solutions over clever solutions.

Avoid unnecessary abstraction.

A straightforward implementation is almost always easier to maintain.

---

## Consistency

Follow existing project conventions.

Do not introduce new coding styles within the same project.

Consistency is more valuable than personal preference.

---

## Maintainability

Write code that future engineers can safely modify.

Avoid tightly coupled components.

Keep modules small and focused.

---

## Testability

Code should be easy to test.

Business logic should be isolated from infrastructure.

Avoid writing code that requires manual testing for every change.

---

# General Rules

Every engineer should:

- Write meaningful code.
- Avoid duplicated logic.
- Remove unused code.
- Keep functions focused.
- Keep classes focused.
- Prefer composition over inheritance.
- Document complex decisions.
- Refactor continuously.

---

# Naming Conventions

Names should clearly describe their purpose.

Good:

```text
calculatePayroll()

employeeRepository

createPurchaseOrder()
```

Poor:

```text
calc()

repo1()

tempFunction()
```

Avoid abbreviations unless they are widely understood.

---

# Variables

Variables should:

- Have descriptive names.
- Represent one concept.
- Avoid unnecessary abbreviations.
- Minimize mutable state.

Good:

```typescript
const employeeCount = 25;
```

Avoid:

```typescript
const x = 25;
```

---

# Functions

Functions should:

- Perform one responsibility.
- Be easy to understand.
- Be reusable.
- Minimize side effects.

Good functions are usually short and focused.

Avoid functions that perform multiple unrelated tasks.

---

# Classes

Each class should have a single responsibility.

Example:

Good

```text
EmployeeService
```

Avoid

```text
EmployeeServiceManagerUtilityProcessor
```

Large classes are difficult to maintain.

---

# File Organization

Organize code by feature rather than by file type whenever possible.

Example:

```text
employees/

controller

service

repository

dto

tests
```

Avoid placing unrelated functionality in the same folder.

---

# Folder Naming

Use lowercase folders.

Examples:

```text
employees

inventory

authentication

reports
```

Avoid spaces and inconsistent capitalization.

---

# File Naming

Use consistent naming.

Examples:

```text
employee.service.ts

employee.controller.ts

employee.repository.ts

create-employee.dto.ts
```

---

# Component Standards (Frontend)

Components should:

- Have a single responsibility.
- Be reusable where appropriate.
- Receive data through props.
- Avoid unnecessary complexity.

Large components should be divided into smaller components.

---

# API Standards (Backend)

Controllers should:

- Receive requests.
- Validate input.
- Delegate work to services.
- Return responses.

Business logic belongs inside services.

---

# Business Logic

Business rules should:

- Be centralized.
- Be reusable.
- Never be duplicated.
- Remain independent from UI implementation.

---

# Error Handling

Always handle expected errors.

Examples:

- Validation errors
- Authentication failures
- Missing records
- External service failures

Do not silently ignore errors.

---

# Comments

Comments should explain **why**, not **what**.

Good:

```typescript
// Inventory reservations prevent overselling during checkout.
```

Avoid:

```typescript
// Increment i
i++;
```

Well-written code usually requires very few comments.

---

# TypeScript Standards

Use TypeScript consistently.

Guidelines:

- Enable strict mode.
- Avoid the `any` type.
- Use interfaces and types appropriately.
- Prefer enums only when necessary.
- Leverage type inference when it improves readability.

Strong typing reduces runtime errors.

---

# Formatting

Formatting should be automated.

Use:

- ESLint
- Prettier

Do not manually format code inconsistently.

---

# Logging

Log important business and system events.

Examples:

- User login
- Purchase approval
- Payment processing
- System failures

Avoid excessive logging that creates unnecessary noise.

---

# Security

Secure code should:

- Validate all input.
- Protect secrets.
- Avoid SQL injection.
- Avoid XSS vulnerabilities.
- Enforce authorization.
- Never expose sensitive data.

Security is part of coding quality.

---

# Performance

Optimize only when necessary.

Avoid:

- Premature optimization
- Duplicate API calls
- Unnecessary database queries
- Inefficient rendering

Always prioritize correctness before optimization.

---

# Code Duplication

Do not repeat identical logic.

If code appears in multiple places, consider refactoring into a reusable function or module.

Follow the **DRY (Don't Repeat Yourself)** principle.

---

# Code Review Checklist

Before opening a Pull Request, verify:

- Code follows project standards.
- Naming is consistent.
- Business logic is properly organized.
- No duplicated code exists.
- Automated tests pass.
- Documentation is updated.
- No secrets are committed.
- Linting passes.
- Formatting is correct.

---

# GitHub Workflow

Every code change follows the standard engineering workflow.

```text
GitHub Issue
        │
        ▼
Feature Branch
        │
        ▼
Development
        │
        ▼
Linting
        │
        ▼
Testing
        │
        ▼
Pull Request
        │
        ▼
Code Review
        │
        ▼
GitHub Actions
        │
        ▼
Merge
```

No code should be merged directly into the main branch.

---

# Definition of Done

A coding task is complete when:

- Coding standards are followed.
- Code compiles successfully.
- Linting passes.
- Automated tests pass.
- Code review is approved.
- GitHub Actions pipeline passes.
- Documentation is updated.
- Acceptance Criteria are satisfied.

---

# Common Mistakes

Avoid:

- Large functions.
- Large classes.
- Magic numbers.
- Hardcoded configuration.
- Duplicate code.
- Ignoring lint warnings.
- Excessive comments.
- Mixing business logic with presentation.
- Using `any` without justification.

---

# Coding Standards in This Bootcamp

Every contribution to the ERP project must comply with these standards.

These rules apply to:

- Frontend
- Backend
- Database
- API Development
- Testing
- DevOps
- Automation Scripts
- GitHub Actions

Coding standards are enforced through:

- ESLint
- Prettier
- Code Reviews
- GitHub Actions
- Pull Request approvals

Consistency across the codebase is considered a core engineering responsibility.

---

# Expected Outcome

By completing this section, the learner should understand how to write clean, maintainable, secure, and production-quality software.

Throughout this bootcamp, coding standards establish a shared engineering culture where every contribution is readable, testable, scalable, and suitable for collaborative software development in a professional engineering organization.