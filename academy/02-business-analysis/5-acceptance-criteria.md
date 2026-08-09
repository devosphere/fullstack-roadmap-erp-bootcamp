# Acceptance Criteria

**Version:** 1.0

---

# Purpose

Acceptance Criteria define the specific conditions that a software feature must satisfy before it can be considered complete.

They provide a shared understanding between the Product Owner, Business Analyst, Software Engineers, QA Engineers, and stakeholders regarding the expected behavior of the system.

Throughout this bootcamp, **every User Story and GitHub Issue must have clearly defined Acceptance Criteria before development begins.**

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of Acceptance Criteria
- Write clear and testable Acceptance Criteria
- Connect Acceptance Criteria to User Stories
- Create measurable success conditions
- Support QA testing and Sprint Reviews
- Ensure software meets business expectations

---

# What are Acceptance Criteria?

Acceptance Criteria are a list of conditions that determine whether a User Story has been successfully implemented.

They answer the question:

> **"How do we know this feature is complete?"**

Acceptance Criteria should be agreed upon before development starts.

---

# Acceptance Criteria in the SDLC

Acceptance Criteria connect business requirements to software verification.

```text
Business Requirement
        │
        ▼
Business Requirements Document
        │
        ▼
Software Requirements Specification
        │
        ▼
User Story
        │
        ▼
Acceptance Criteria
        │
        ▼
GitHub Issue
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Sprint Review
```

Without Acceptance Criteria, developers and testers may have different interpretations of what "done" means.

---

# Why Acceptance Criteria Matter

Acceptance Criteria help teams:

- Define feature completion
- Reduce ambiguity
- Improve communication
- Guide development
- Support QA testing
- Prevent misunderstandings
- Ensure business expectations are met

They serve as the foundation for both development and testing.

---

# Characteristics of Good Acceptance Criteria

Good Acceptance Criteria should be:

- Clear
- Specific
- Testable
- Measurable
- Unambiguous
- Business-focused
- Independent of implementation details

Acceptance Criteria describe **expected behavior**, not how the software is built.

---

# Writing Acceptance Criteria

Acceptance Criteria are usually written as a checklist.

Example:

### User Story

```text
As an Employee,

I want to submit a leave request,

So that I can request time off electronically.
```

Acceptance Criteria:

- Employee must be authenticated.
- Leave type must be selected.
- Start date is required.
- End date is required.
- End date cannot be earlier than the start date.
- Leave balance must be validated.
- The leave request is saved successfully.
- The employee receives a confirmation message.
- The manager is notified of the new request.

Every item should be independently verifiable.

---

# Using Given / When / Then

Many Agile teams use Behavior-Driven Development (BDD) syntax.

Format:

```text
Given

When

Then
```

Example:

```text
Given the employee is logged in,

When the employee submits a valid leave request,

Then the system creates the request and notifies the manager.
```

Another example:

```text
Given an employee has zero leave balance,

When they submit a leave request,

Then the system rejects the request and displays an appropriate error message.
```

BDD improves clarity and aligns well with automated testing.

---

# Functional Acceptance Criteria

Examples:

- Employee can create a leave request.
- Manager can approve requests.
- HR can reject requests.
- Users can search leave history.
- Notifications are sent after approval.

These describe what the software must do.

---

# Validation Acceptance Criteria

Examples:

- Required fields cannot be empty.
- Invalid dates are rejected.
- Duplicate records are prevented.
- Leave balance cannot become negative.
- Unauthorized users cannot access restricted features.

Validation rules ensure data integrity.

---

# User Interface Acceptance Criteria

Examples:

- Required fields display validation messages.
- Buttons are disabled until mandatory fields are completed.
- Success messages are shown after saving.
- Tables support sorting and filtering.
- Forms remain responsive on mobile devices.

UI Acceptance Criteria describe expected user interactions.

---

# Non-Functional Acceptance Criteria

Examples:

Performance

- API response time shall be under 500 milliseconds.

Reliability

- System uptime shall be at least 99.9%.

Security

- Only authenticated users can access protected pages.
- User sessions expire after inactivity.

Accessibility

- Forms are keyboard accessible.
- Input fields have descriptive labels.

These define quality attributes of the system.

---

# Acceptance Criteria vs Test Cases

Acceptance Criteria define **what must be true**.

Test Cases define **how it will be verified**.

Example:

Acceptance Criterion

```text
Employee can submit a leave request.
```

Test Case

```text
1. Login

2. Navigate to Leave Request

3. Enter valid information

4. Click Submit

Expected Result:

Leave request is created successfully.
```

Acceptance Criteria guide the creation of Test Cases.

---

# Example ERP Module

## Employee Leave Management

### User Story

```text
As an Employee,

I want to submit a leave request,

So that I can request leave online.
```

Acceptance Criteria

- Employee is authenticated.
- Leave type is required.
- Start date is required.
- End date is required.
- End date must not be before the start date.
- Leave balance is validated.
- Leave request is saved.
- Confirmation message is displayed.
- Manager receives a notification.
- Request appears in Leave History.

---

# Relationship with GitHub Issues

Every GitHub Issue should include Acceptance Criteria.

Example:

```text
Issue

Implement Employee Leave Request

Acceptance Criteria

- User is authenticated

- Leave balance validated

- Request saved

- Notification sent

- Tests passing
```

Developers use the Acceptance Criteria as the implementation checklist.

QA Engineers use the same criteria for validation.

---

# Definition of Done

A GitHub Issue is considered complete only when:

- Acceptance Criteria are satisfied.
- Code Review is approved.
- Automated tests pass.
- Documentation is updated.
- CI pipeline succeeds.
- Pull Request is merged.

Acceptance Criteria are only one part of the overall Definition of Done.

---

# Best Practices

Professional teams should:

- Write Acceptance Criteria before development.
- Focus on observable behavior.
- Keep criteria measurable.
- Avoid implementation details.
- Include edge cases.
- Review criteria with stakeholders.
- Use Acceptance Criteria during Sprint Reviews.

---

# Common Mistakes

Avoid:

- Writing vague requirements.
- Mixing technical implementation with expected behavior.
- Missing validation rules.
- Forgetting negative scenarios.
- Creating criteria that cannot be tested.
- Changing Acceptance Criteria during development without stakeholder agreement.

---

# Acceptance Criteria in This Bootcamp

Every ERP Sprint begins with approved User Stories and Acceptance Criteria.

The workflow is:

```text
Business Requirement
        │
        ▼
User Story
        │
        ▼
Acceptance Criteria
        │
        ▼
GitHub Issue
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Code Review
        │
        ▼
Done
```

A Sprint is considered successful only when every completed User Story satisfies its Acceptance Criteria.

---

# Expected Outcome

By completing this section, the learner should understand how to write clear, measurable, and testable Acceptance Criteria that define feature completion.

Throughout this bootcamp, Acceptance Criteria will serve as the shared agreement between business stakeholders, engineers, and QA, ensuring that every ERP feature is implemented correctly, verified thoroughly, and delivered with confidence.