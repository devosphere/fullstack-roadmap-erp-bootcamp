# TypeScript

**Version:** 1.0

---

# Purpose

TypeScript is the primary programming language used throughout this bootcamp for both frontend and backend development.

It extends JavaScript by adding static typing, enabling engineers to detect errors during development, improve maintainability, and build scalable enterprise applications.

Throughout this bootcamp, **all application code must be written in TypeScript**.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the benefits of TypeScript
- Apply static typing effectively
- Use interfaces, types, and generics
- Write maintainable and scalable code
- Leverage TypeScript for frontend and backend development
- Follow project-wide TypeScript standards

---

# Why TypeScript?

Modern software projects prioritize maintainability, scalability, and developer productivity.

TypeScript helps achieve these goals by:

- Detecting errors before runtime
- Improving code readability
- Providing intelligent editor support
- Enforcing type safety
- Making large codebases easier to maintain
- Improving team collaboration

For enterprise applications, TypeScript has become the industry standard.

---

# TypeScript in the Bootcamp

TypeScript is used across the entire project.

```text
Frontend
React
Next.js
TypeScript

        │

REST API

        ▼

Backend
NestJS
TypeScript

        │

Prisma ORM

        ▼

PostgreSQL
```

The learner is expected to become comfortable using TypeScript in every layer of the application.

---

# Basic Types

Common primitive types include:

```typescript
string
number
boolean
null
undefined
bigint
symbol
```

Example:

```typescript
const employeeName: string = "John Doe";
const age: number = 25;
const isActive: boolean = true;
```

Explicit typing improves readability and catches mistakes early.

---

# Arrays

Example:

```typescript
const departments: string[] = [
  "HR",
  "Finance",
  "IT"
];
```

---

# Objects

Example:

```typescript
const employee = {
  firstName: "John",
  lastName: "Doe"
};
```

When object structures are reused, define a type or interface.

---

# Interfaces

Interfaces define the shape of an object.

Example:

```typescript
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
```

Interfaces are preferred for describing contracts between components and services.

---

# Type Aliases

Type aliases define reusable custom types.

Example:

```typescript
type EmployeeStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ON_LEAVE";
```

Use type aliases for unions, utility types, and complex compositions.

---

# Optional Properties

Some fields may not always exist.

Example:

```typescript
interface Employee {
  id: number;
  firstName: string;
  middleName?: string;
}
```

The `?` indicates an optional property.

---

# Functions

Always specify parameter and return types.

Example:

```typescript
function calculateSalary(
  hourlyRate: number,
  hoursWorked: number
): number {
  return hourlyRate * hoursWorked;
}
```

Function signatures should clearly describe inputs and outputs.

---

# Enums

Enums represent a fixed set of values.

Example:

```typescript
enum LeaveStatus {
  Pending,
  Approved,
  Rejected
}
```

Prefer string literal unions unless an enum provides a clear advantage.

---

# Generics

Generics enable reusable, type-safe code.

Example:

```typescript
function identity<T>(value: T): T {
  return value;
}
```

Generics reduce duplication while preserving strong typing.

---

# Utility Types

TypeScript provides powerful utility types.

Examples:

```typescript
Partial<T>

Required<T>

Readonly<T>

Pick<T>

Omit<T>

Record<K, T>
```

These utilities simplify common type transformations.

---

# Null and Undefined

Enable strict null checking.

Example:

```typescript
const employee: Employee | null = null;
```

Always handle nullable values explicitly.

---

# Strict Mode

The project must enable TypeScript strict mode.

Benefits:

- Stronger type safety
- Earlier error detection
- Improved maintainability
- Fewer runtime errors

Strict mode is mandatory throughout the bootcamp.

---

# Avoid Using `any`

Avoid the `any` type whenever possible.

Bad:

```typescript
let data: any;
```

Better:

```typescript
let data: Employee;
```

If `any` is unavoidable, document the reason in the code review or Pull Request.

---

# Immutability

Prefer immutable data structures.

Good:

```typescript
const updatedEmployee = {
  ...employee,
  status: "ACTIVE"
};
```

Avoid mutating shared objects directly unless necessary.

---

# Asynchronous Programming

Use `async` and `await` for asynchronous operations.

Example:

```typescript
async function getEmployees() {
  return await employeeService.findAll();
}
```

Avoid deeply nested Promise chains.

---

# Error Handling

Handle errors explicitly.

Example:

```typescript
try {
  await employeeService.create(data);
} catch (error) {
  logger.error(error);
}
```

Do not ignore exceptions silently.

---

# Frontend Standards

Frontend TypeScript guidelines:

- Type component props.
- Type API responses.
- Type hooks.
- Avoid implicit `any`.
- Use interfaces for component contracts.
- Keep components strongly typed.

Strong typing improves developer productivity and UI reliability.

---

# Backend Standards

Backend TypeScript guidelines:

- Type DTOs.
- Type services.
- Type repositories.
- Type controllers.
- Use Prisma-generated types where appropriate.
- Validate incoming data before processing.

Every API should expose predictable, type-safe contracts.

---

# Prisma Integration

Prisma generates TypeScript types automatically.

Benefits:

- Compile-time safety
- Typed queries
- Typed models
- Reduced runtime errors

Prefer generated types over manually duplicating database models.

---

# Project Structure

Type definitions should remain close to the feature they belong to.

Example:

```text
employees/

├── dto/
├── interfaces/
├── types/
├── validators/
└── services/
```

Avoid creating a single global folder containing unrelated types.

---

# Linting

TypeScript code should comply with:

- ESLint
- Prettier
- Project Coding Standards

Formatting should always be automated.

---

# Testing

TypeScript code should be tested using:

Frontend:

- Vitest
- Playwright

Backend:

- Vitest
- Supertest

Strong typing complements—but does not replace—automated testing.

---

# GitHub Workflow

Every TypeScript feature follows the project's engineering workflow.

```text
GitHub Issue
        │
        ▼
Feature Branch
        │
        ▼
Implementation
        │
        ▼
Type Checking
        │
        ▼
Linting
        │
        ▼
Automated Tests
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

A Pull Request should not be merged if type checking fails.

---

# Definition of Done

A TypeScript implementation is complete when:

- Strong typing is applied.
- Strict mode passes.
- No unnecessary `any` types remain.
- Linting passes.
- Automated tests pass.
- Code review is approved.
- GitHub Actions pipeline passes.
- Documentation is updated.

Type safety is considered part of software quality.

---

# Best Practices

Professional TypeScript engineers should:

- Enable strict mode.
- Prefer interfaces for contracts.
- Use type aliases for unions.
- Avoid `any`.
- Write small, focused functions.
- Leverage utility types.
- Use generics when appropriate.
- Keep types close to their features.

---

# Common Mistakes

Avoid:

- Overusing `any`.
- Disabling strict mode.
- Creating duplicate type definitions.
- Ignoring compiler warnings.
- Mixing unrelated types in shared files.
- Using overly complex generics without justification.

TypeScript should improve clarity—not introduce unnecessary complexity.

---

# TypeScript in This Bootcamp

TypeScript is the foundation of the ERP project.

Every Sprint builds upon a shared, strongly typed codebase that spans the frontend, backend, APIs, database models, and automated tests.

The learner is expected to use TypeScript not only as a language, but as a tool for designing reliable software, improving collaboration, and preventing defects before code reaches production.

---

# Expected Outcome

By completing this section, the learner should be able to build enterprise-grade applications using TypeScript across the full stack.

Throughout this bootcamp, TypeScript provides the foundation for developing secure, maintainable, and scalable ERP software while reinforcing professional engineering practices such as strong typing, automated testing, code review, and continuous integration.