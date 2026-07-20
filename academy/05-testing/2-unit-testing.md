# Unit Testing

**Version:** 1.0

---

# Purpose

Unit Testing verifies that individual units of code function correctly in isolation.

A unit may be:

- Function
- Method
- Class
- React Component
- Service
- Utility
- Validator

Unit tests provide immediate feedback during development and serve as the first line of defense against software defects.

Throughout this bootcamp, **every business logic implementation must include corresponding unit tests.**

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of unit testing
- Write maintainable unit tests
- Test business logic in isolation
- Mock dependencies correctly
- Follow Test-Driven Development (optional)
- Integrate unit testing into GitHub workflows

---

# Why Unit Testing?

Unit testing provides confidence that individual pieces of software work as expected.

Benefits include:

- Detect bugs early
- Reduce regressions
- Improve code quality
- Enable safe refactoring
- Improve documentation
- Increase deployment confidence

Well-written unit tests allow developers to change code with confidence.

---

# Unit Testing in the SDLC

Unit testing begins immediately after implementation.

```text
Requirements
        │
        ▼
Development
        │
        ▼
Unit Tests
        │
        ▼
Integration Tests
        │
        ▼
Pull Request
        │
        ▼
Merge
```

Unit tests should be written during development—not after deployment.

---

# Testing Philosophy

Unit tests should verify behavior rather than implementation details.

Good tests answer:

> "Does this unit produce the correct result?"

Not:

> "Does this unit call a specific internal function?"

Focus on observable behavior.

---

# Test Scope

Unit tests should isolate a single unit of code.

Examples:

- Validation function
- Salary calculator
- Leave balance computation
- Utility function
- Date formatter
- Discount calculator
- Tax computation

Avoid testing multiple systems simultaneously.

---

# What Should Be Unit Tested?

Examples include:

- Business rules
- Utility functions
- Validators
- DTO transformations
- Services
- Domain logic
- React hooks
- React components

Business-critical logic should always have unit tests.

---

# What Should NOT Be Unit Tested?

Avoid unit testing:

- Database connectivity
- External APIs
- Network communication
- Browser rendering
- Third-party libraries

These belong to higher levels of testing.

---

# Backend Unit Testing

Backend unit tests should verify:

- Service methods
- Validators
- Business calculations
- Authorization logic
- Domain services
- Utility classes

Controllers should be tested minimally because they primarily delegate work.

---

# Frontend Unit Testing

Frontend unit tests should verify:

- React components
- Custom hooks
- Utility functions
- Form validation
- State management
- Component behavior

Focus on user-visible behavior rather than implementation details.

---

# Testing Tools

The ERP project uses:

| Layer | Tool |
|--------|------|
| Frontend | Vitest |
| Backend | Vitest |
| Mocking | Vitest Mocks |
| Component Testing | React Testing Library |

Using the same testing framework across the project simplifies development.

---

# Test Structure

Every unit test should follow the **Arrange – Act – Assert (AAA)** pattern.

```text
Arrange

↓

Act

↓

Assert
```

### Arrange

Prepare inputs and dependencies.

### Act

Execute the unit under test.

### Assert

Verify the expected outcome.

---

# Example Structure

```typescript
describe("EmployeeService", () => {
  it("should calculate salary correctly", () => {
    // Arrange

    // Act

    // Assert
  });
});
```

Test names should clearly describe expected behavior.

---

# Test Naming

Use descriptive names.

Good:

```text
should calculate overtime correctly

should reject invalid email

should create employee successfully
```

Avoid:

```text
Test 1

employee test

works
```

A failing test should clearly indicate what behavior is broken.

---

# Mocking

External dependencies should be mocked.

Examples:

- Database
- Email service
- Payment gateway
- File storage
- Authentication provider

Mocking isolates the unit under test.

---

# Test Independence

Every test should be:

- Independent
- Repeatable
- Deterministic

Tests must not depend on:

- Execution order
- Shared state
- Previous tests
- External systems

A test should produce the same result every time it runs.

---

# Business Logic Testing

Business rules should receive the highest testing priority.

Examples:

- Payroll calculation
- Leave balance
- Inventory allocation
- Purchase approval
- Sales discounts
- Tax computation

Critical business logic should have comprehensive unit test coverage.

---

# Edge Cases

Tests should cover more than the happy path.

Examples:

- Invalid input
- Empty values
- Maximum limits
- Minimum limits
- Duplicate data
- Permission failures
- Null values

Edge cases often reveal hidden defects.

---

# Error Handling

Unit tests should verify expected failures.

Examples:

- Validation errors
- Unauthorized access
- Missing records
- Invalid requests

Software should fail predictably and gracefully.

---

# Test Data

Use small, readable test data.

Good:

```text
Employee A

Department HR

Salary 50000
```

Avoid using unnecessarily large datasets in unit tests.

---

# Code Coverage

Coverage is a useful indicator—but not the primary goal.

Prioritize testing:

- Business rules
- Critical workflows
- Security logic
- Financial calculations

Meaningful assertions are more valuable than high percentages.

---

# Test Organization

Tests should remain close to the code they validate.

Example:

```text
employees/

employee.service.ts

employee.service.spec.ts
```

Keeping tests near implementation improves discoverability.

---

# GitHub Workflow

Every feature includes unit tests before review.

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
Unit Tests
        │
        ▼
Local Test Execution
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
```

No Pull Request should be opened without passing unit tests.

---

# Definition of Done

A feature satisfies the unit testing requirement when:

- Business logic is tested.
- Critical edge cases are covered.
- Tests are deterministic.
- Mocks are used appropriately.
- Local execution passes.
- GitHub Actions pass.
- Code review is approved.
- Documentation is updated.

Unit testing is part of the project's Definition of Done.

---

# Best Practices

Professional engineers should:

- Write tests alongside development.
- Test behavior instead of implementation.
- Use descriptive test names.
- Keep tests independent.
- Mock external dependencies.
- Keep tests simple and readable.
- Maintain tests as the code evolves.

---

# Common Mistakes

Avoid:

- Testing private methods.
- Testing third-party libraries.
- Writing fragile tests.
- Sharing state between tests.
- Ignoring edge cases.
- Depending on databases or external services.
- Writing tests with unclear names.

Reliable unit tests should remain stable even as internal implementations change.

---

# Unit Testing in This Bootcamp

Every Sprint introduces new business logic that must be validated through unit testing.

The learner is expected to build a habit of writing tests as part of the development process rather than treating testing as a separate activity.

Unit tests become the foundation for safe refactoring, confident deployments, and long-term maintainability of the ERP system.

---

# Expected Outcome

By completing this section, the learner should be be able to write reliable, maintainable, and meaningful unit tests for frontend and backend applications.

Throughout this bootcamp, unit testing serves as the first quality gate in the engineering workflow, ensuring that individual units of software behave correctly before integration, end-to-end testing, and deployment.