# User Stories

**Version:** 1.0

---

# Purpose

User Stories describe software requirements from the perspective of the people who will use the system.

Rather than describing technical implementation, User Stories focus on the value delivered to users.

Throughout this bootcamp, every feature implemented in the ERP system will originate from one or more User Stories. These User Stories will later become GitHub Issues and Sprint Backlog items.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of User Stories
- Write clear and concise User Stories
- Identify user roles and business value
- Break large features into manageable stories
- Prioritize stories for Sprint Planning
- Connect User Stories to Acceptance Criteria and GitHub Issues

---

# What is a User Story?

A User Story is a short description of a software feature written from the user's perspective.

It explains:

- Who needs the feature
- What they need
- Why they need it

User Stories encourage teams to focus on solving business problems rather than simply building software.

---

# Standard User Story Format

Every User Story should follow this structure:

```text
As a <user role>,

I want <goal>,

So that <business value>.
```

Example:

```text
As an Employee,

I want to submit a leave request,

So that I can request time off without contacting HR manually.
```

---

# Anatomy of a User Story

```text
As a HR Manager,
│
├── User Role

I want to approve leave requests,
│
├── Goal

So that employees receive timely approval decisions.
│
└── Business Value
```

Every User Story should clearly identify these three elements.

---

# Characteristics of a Good User Story

Good User Stories should be:

- Independent
- Negotiable
- Valuable
- Estimable
- Small
- Testable

These characteristics are commonly remembered using the acronym **INVEST**.

---

# INVEST Principle

## Independent

Each story should be implementable without depending heavily on another story.

---

## Negotiable

A User Story is the beginning of a conversation, not a detailed specification.

---

## Valuable

Every story should deliver value to a user or the business.

---

## Estimable

The development team should be able to estimate the work required.

---

## Small

Stories should fit comfortably within a Sprint.

---

## Testable

Every story should have clear Acceptance Criteria.

---

# Identifying User Roles

Examples of ERP user roles include:

- Employee
- HR Manager
- Department Manager
- Sales Representative
- Procurement Officer
- Inventory Clerk
- Warehouse Supervisor
- Finance Officer
- Customer
- System Administrator

The user role should represent the individual who receives the business value.

---

# Writing Effective User Stories

Good examples:

```text
As an Employee,

I want to view my remaining leave balance,

So that I know how many leave days I have available.
```

---

```text
As a Warehouse Supervisor,

I want to receive notifications when stock falls below the reorder level,

So that inventory shortages can be prevented.
```

---

```text
As a Sales Manager,

I want to view monthly sales reports,

So that I can evaluate team performance.
```

---

# Poor User Stories

Examples:

```text
Create Login Page.
```

Problem:

No user, no business value.

---

```text
Build REST API.
```

Problem:

Describes technical work rather than user value.

---

```text
Create Database Table.
```

Problem:

This is an implementation task, not a User Story.

---

# Breaking Down Large Features

Large features should be divided into multiple User Stories.

Example:

## Epic

Employee Leave Management

Possible User Stories:

- Submit leave request
- View leave balance
- Approve leave request
- Reject leave request
- Cancel leave request
- Receive approval notification
- View leave history
- Generate leave reports

Each story delivers independent business value.

---

# User Story Lifecycle

Every User Story follows the same lifecycle.

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
Sprint Planning
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Done
```

---

# User Story to GitHub Issue

Each approved User Story should become a GitHub Issue.

Example:

User Story

```text
As an Employee,

I want to submit leave requests,

So that I can request leave online.
```

↓

GitHub Issue

```text
Implement Employee Leave Request functionality
```

↓

Sprint Assignment

↓

Development

↓

Pull Request

↓

Deployment

This ensures every feature is traceable from business need to implementation.

---

# User Story Prioritization

Product Owners prioritize User Stories based on business value.

Common priority levels:

| Priority | Description |
|-----------|-------------|
| Critical | Required for system operation |
| High | Significant business value |
| Medium | Important but not urgent |
| Low | Nice-to-have enhancement |

Priority helps determine Sprint scope.

---

# Story Estimation

During Sprint Planning, each User Story is estimated.

Example using Story Points:

| Story | Story Points |
|--------|--------------|
| Login | 3 |
| Leave Request | 5 |
| Approval Workflow | 8 |
| Reporting Dashboard | 13 |

Estimation helps teams plan Sprint capacity.

---

# Example User Stories

## Human Resources

```text
As an Employee,

I want to submit leave requests,

So that my manager can review them electronically.
```

---

```text
As a Manager,

I want to approve leave requests,

So that employee absences are managed efficiently.
```

---

## Inventory

```text
As a Warehouse Staff member,

I want to update stock quantities,

So that inventory remains accurate.
```

---

## Sales

```text
As a Sales Representative,

I want to create customer quotations,

So that I can respond to customer inquiries quickly.
```

---

## Procurement

```text
As a Procurement Officer,

I want to create purchase orders,

So that suppliers receive formal requests for goods.
```

---

# Relationship to Other Documents

User Stories connect business requirements to software implementation.

```text
Stakeholder Analysis
        │
        ▼
Business Requirements Document
        │
        ▼
Software Requirements Specification
        │
        ▼
User Stories
        │
        ▼
Acceptance Criteria
        │
        ▼
GitHub Issues
        │
        ▼
Sprint Planning
        │
        ▼
Development
```

---

# Best Practices

Professional engineers should:

- Focus on business value.
- Keep User Stories concise.
- Write from the user's perspective.
- Avoid technical implementation details.
- Ensure stories are independently testable.
- Link every story to Acceptance Criteria.
- Maintain traceability to GitHub Issues.

---

# Common Mistakes

Avoid:

- Writing technical tasks as User Stories.
- Combining multiple features into one story.
- Omitting the business value.
- Writing stories that are too large for a Sprint.
- Ignoring Acceptance Criteria.
- Failing to prioritize stories.

---

# User Stories in This Bootcamp

Every ERP Sprint begins with a prioritized set of User Stories.

Each User Story becomes a GitHub Issue, progresses through development, testing, code review, and deployment, and is considered complete only when it satisfies its Acceptance Criteria.

This approach mirrors Agile software development practices used by modern engineering teams.

---

# Expected Outcome

By completing this section, the learner should be able to write clear, valuable, and testable User Stories that accurately represent user needs.

Throughout this bootcamp, User Stories serve as the bridge between business requirements and software development, ensuring that every feature implemented in the ERP system delivers measurable value to its users.