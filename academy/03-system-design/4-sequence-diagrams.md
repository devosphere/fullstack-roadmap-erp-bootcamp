# Sequence Diagrams

**Version:** 1.0

---

# Purpose

A Sequence Diagram is a Unified Modeling Language (UML) diagram that illustrates how different actors and system components interact over time to accomplish a specific business process.

Unlike a Business Process Flow, which focuses on business operations, a Sequence Diagram focuses on **system interactions**.

Throughout this bootcamp, every major ERP feature should have a Sequence Diagram before implementation begins.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of Sequence Diagrams
- Identify system actors and components
- Model interactions between services
- Represent synchronous and asynchronous communication
- Translate software requirements into implementation workflows
- Produce professional UML Sequence Diagrams

---

# What is a Sequence Diagram?

A Sequence Diagram illustrates the order of messages exchanged between users, applications, services, and databases during a particular use case.

It answers questions such as:

- Which component performs the first action?
- What happens next?
- Which services communicate?
- How does the request reach the database?
- What response is returned?

Sequence Diagrams focus on **system behavior**, not business workflows.

---

# Sequence Diagrams in the SDLC

Sequence Diagrams are created after the System Architecture and API Design.

```text
Business Requirements
        │
        ▼
Software Requirements
        │
        ▼
System Architecture
        │
        ▼
API Design
        │
        ▼
Sequence Diagram
        │
        ▼
Development
```

They help developers understand how the application should behave before implementation begins.

---

# Sequence Diagram Components

A Sequence Diagram consists of several elements.

## Actor

Represents the user or external system.

Examples:

- Employee
- Manager
- Customer
- Payment Gateway
- Email Service

---

## Lifeline

Represents a participant in the interaction.

Examples:

- Frontend
- Backend API
- Authentication Service
- Database
- Notification Service

Each participant has its own vertical lifeline.

---

## Message

A message represents communication between participants.

Examples:

```text
Login Request

Create Employee

Validate Token

Retrieve Orders

Send Email
```

Messages are ordered from top to bottom.

---

## Activation

Activation indicates when a participant is performing work.

It represents processing time before returning a response.

---

## Return Message

Represents the response sent back to the caller.

Example:

```text
Employee Created

Authentication Failed

Validation Error
```

---

# Basic Request Flow

Example:

```text
User
 │
 │ Click Save
 ▼
Frontend
 │
 │ POST /employees
 ▼
Backend API
 │
 │ Validate Request
 ▼
Database
 │
 │ Insert Record
 ▲
 │ Success
 │
Backend API
 │
 │ 201 Created
 ▲
Frontend
 │
 │ Display Success Message
 ▲
User
```

This illustrates the order of interactions during a typical API request.

---

# Authentication Example

```text
User
 │
 ▼
Frontend

 │ Login

 ▼

Authentication API

 │

 ▼

Database

 │

 ▲ User Found

 │

Authentication API

 │ Generate JWT

 ▲

Frontend

 │ Store Token

 ▲

User Logged In
```

Authentication is typically the first interaction in most secured ERP modules.

---

# Leave Request Example

## Scenario

Employee submits a leave request.

```text
Employee

│

▼

Frontend

│ POST /leave-requests

▼

Backend API

│ Validate Request

▼

Leave Service

│ Check Leave Balance

▼

Database

▲ Balance Available

│

Leave Service

│ Save Request

▼

Database

▲ Success

│

Notification Service

│ Send Email

▼

Employee

▲ Confirmation

```

This illustrates how multiple services collaborate to complete a single operation.

---

# Alternative Flows

Sequence Diagrams should include exception scenarios.

Example:

```text
Employee

↓

Submit Leave Request

↓

Validation

↓

Leave Balance?

     │

 ┌───┴────┐

 │        │

Yes      No

 │        │

 ▼        ▼

Save     Return Error

 │

 ▼

Success
```

Modeling both successful and unsuccessful paths improves system design.

---

# Asynchronous Operations

Not every action happens immediately.

Example:

```text
Employee

↓

Backend API

↓

Save Request

↓

Queue Email Job

↓

Return Success

↓

Email Service

↓

Send Email
```

The user receives an immediate response while the notification is processed in the background.

---

# ERP Example

## Purchase Order Approval

```text
Procurement Officer

↓

Frontend

↓

Backend API

↓

Purchase Order Service

↓

Approval Engine

↓

Database

↓

Notification Service

↓

Manager

↓

Approval

↓

Notification

↓

Procurement Officer
```

Large ERP workflows often involve multiple services and approval steps.

---

# Relationship with Other Documents

Sequence Diagrams complement other design artifacts.

```text
Business Process Flow

        │

        ▼

Software Requirements

        │

        ▼

System Architecture

        │

        ▼

API Design

        │

        ▼

Sequence Diagram

        │

        ▼

Development
```

While Process Flows describe business operations, Sequence Diagrams describe software interactions.

---

# GitHub Workflow

Sequence Diagrams should be created before implementation.

```text
User Story
        │
        ▼
Acceptance Criteria
        │
        ▼
API Design
        │
        ▼
Sequence Diagram
        │
        ▼
GitHub Issue
        │
        ▼
Development
        │
        ▼
Pull Request
```

Developers should reference the Sequence Diagram during implementation and code review.

---

# Best Practices

Professional engineers should:

- Keep diagrams focused on one use case.
- Include all major system participants.
- Show message order clearly.
- Include validation steps.
- Include alternative flows.
- Represent asynchronous processing where appropriate.
- Keep diagrams synchronized with implementation.

---

# Common Mistakes

Avoid:

- Mixing business workflows with system interactions.
- Omitting important system components.
- Ignoring validation steps.
- Failing to model exception scenarios.
- Including unnecessary implementation details.
- Creating overly complex diagrams.

A Sequence Diagram should be easy to follow and accurately reflect system behavior.

---

# Sequence Diagrams in This Bootcamp

Every ERP feature that involves multiple system components should include a Sequence Diagram before coding begins.

Typical examples include:

- User Authentication
- Employee Management
- Leave Approval
- Purchase Order Approval
- Inventory Updates
- Sales Order Processing
- Payment Processing
- Notification Delivery

Sequence Diagrams ensure that developers have a shared understanding of how each feature operates internally before implementation.

---

# Expected Outcome

By completing this section, the learner should understand how to model system interactions using UML Sequence Diagrams.

Throughout this bootcamp, Sequence Diagrams provide a clear visualization of how frontend applications, backend services, databases, and external systems collaborate to deliver ERP functionality, reducing ambiguity and improving communication across the engineering team.