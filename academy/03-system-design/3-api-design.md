# API Design

**Version:** 1.0

---

# Purpose

API Design defines how different software components communicate with one another.

In this ERP bootcamp, the frontend communicates with the backend through RESTful APIs. A well-designed API provides a consistent, secure, and maintainable interface that allows applications, services, and future integrations to exchange data reliably.

Every ERP module must have its API designed and documented before implementation begins.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand RESTful API principles
- Design consistent API endpoints
- Use appropriate HTTP methods and status codes
- Design request and response payloads
- Implement authentication and authorization
- Handle validation and error responses
- Document APIs professionally

---

# What is an API?

An **Application Programming Interface (API)** is a contract that defines how software components communicate.

In this ERP system:

```text
Frontend (React / Next.js)

        │

HTTPS Request

        │

        ▼

Backend API (Node.js)

        │

Business Logic

        │

        ▼

Database
```

The frontend should never communicate directly with the database.

---

# API Design in the SDLC

API Design begins after the System Architecture and ERD have been approved.

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
Entity Relationship Diagram
        │
        ▼
API Design
        │
        ▼
Development
```

A well-designed API reduces rework during implementation.

---

# REST Architecture

This bootcamp follows REST (Representational State Transfer) principles.

REST APIs should be:

- Stateless
- Resource-oriented
- Predictable
- Consistent
- Secure
- Versioned

Example:

```text
GET /api/v1/employees

POST /api/v1/employees

GET /api/v1/employees/{id}

PUT /api/v1/employees/{id}

DELETE /api/v1/employees/{id}
```

---

# API Versioning

All endpoints should be versioned.

Example:

```text
/api/v1/
/api/v2/
```

Versioning allows new functionality without breaking existing clients.

---

# Resource Naming

Resources should use plural nouns.

Good examples:

```text
/employees

/customers

/products

/orders

/invoices
```

Avoid:

```text
/getEmployee

/createOrder

/deleteCustomer
```

Endpoints represent resources, not actions.

---

# HTTP Methods

Use the appropriate HTTP verb for each operation.

| Method | Purpose |
|---------|----------|
| GET | Retrieve data |
| POST | Create new resource |
| PUT | Replace existing resource |
| PATCH | Partially update resource |
| DELETE | Delete resource (or soft delete) |

Example:

```text
GET /employees

POST /employees

GET /employees/{id}

PATCH /employees/{id}

DELETE /employees/{id}
```

---

# Request Structure

Example:

```http
POST /api/v1/employees
```

Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "departmentId": 5
}
```

Requests should contain only the data required for the operation.

---

# Response Structure

Successful response:

```json
{
  "success": true,
  "data": {
    "employeeId": 101,
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Employee not found."
}
```

A consistent response format simplifies frontend development.

---

# HTTP Status Codes

Use standard HTTP status codes.

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

Status codes should accurately represent the outcome of the request.

---

# Validation

The API should validate incoming requests.

Examples:

- Required fields
- Invalid email format
- Duplicate records
- Invalid dates
- Invalid foreign keys

Example:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
  ]
}
```

Validation protects data integrity.

---

# Authentication

Protected APIs require authentication.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

Authentication verifies the identity of the caller.

---

# Authorization

Authorization determines what an authenticated user is allowed to do.

Example:

| Role | Permission |
|------|-------------|
| Employee | View own profile |
| Manager | Approve leave |
| HR | Manage employees |
| Administrator | Full access |

Authorization should always be enforced on the backend.

---

# Filtering

Support filtering where appropriate.

Example:

```text
GET /employees?department=HR
```

```text
GET /orders?status=APPROVED
```

Filtering reduces unnecessary data transfer.

---

# Sorting

Example:

```text
GET /employees?sort=lastName
```

```text
GET /products?sort=price&order=desc
```

Sorting should be predictable and documented.

---

# Pagination

Large datasets should support pagination.

Example:

```text
GET /employees?page=2&limit=20
```

Example response:

```json
{
  "page": 2,
  "limit": 20,
  "total": 153,
  "data": []
}
```

Pagination improves performance.

---

# Search

Example:

```text
GET /employees?search=john
```

Search functionality should be documented and consistent across resources.

---

# Idempotency

Some operations should be idempotent.

Examples:

```text
GET
PUT
DELETE
```

Executing the same request multiple times should produce the same result.

POST requests are generally **not** idempotent.

---

# Error Handling

Errors should be informative but should not expose sensitive information.

Example:

```json
{
  "success": false,
  "message": "Employee not found."
}
```

Avoid exposing stack traces or database details in production responses.

---

# API Documentation

Every endpoint should include:

- Endpoint URL
- HTTP Method
- Description
- Authentication requirements
- Request Body
- Query Parameters
- Response Examples
- Error Responses
- Validation Rules

Clear documentation improves collaboration and onboarding.

---

# Example Endpoint

## Create Employee

**Endpoint**

```http
POST /api/v1/employees
```

**Authentication**

Required

**Request**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "departmentId": 3
}
```

**Success Response**

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "employeeId": 205
  }
}
```

**Validation Rules**

- First name is required
- Last name is required
- Email must be unique
- Department must exist

---

# Relationship to Other Documents

API Design builds upon previous SDLC artifacts.

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
Entity Relationship Diagram
        │
        ▼
API Design
        │
        ▼
Development
        │
        ▼
Testing
```

API documentation should remain synchronized with the implemented code.

---

# GitHub Workflow

Every API feature follows the team's GitHub workflow.

```text
User Story
        │
        ▼
Acceptance Criteria
        │
        ▼
GitHub Issue
        │
        ▼
API Design
        │
        ▼
Feature Branch
        │
        ▼
Implementation
        │
        ▼
Unit Tests
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

API contracts should be reviewed before coding begins to minimize implementation changes.

---

# Best Practices

Professional engineers should:

- Keep endpoints resource-oriented.
- Use consistent naming conventions.
- Return meaningful HTTP status codes.
- Validate all input.
- Secure every protected endpoint.
- Version APIs.
- Document every endpoint.
- Keep responses predictable.

---

# Common Mistakes

Avoid:

- Using verbs in endpoint names.
- Returning inconsistent response structures.
- Ignoring HTTP status codes.
- Exposing internal implementation details.
- Skipping input validation.
- Breaking backward compatibility without versioning.
- Failing to update API documentation after changes.

---

# API Design in This Bootcamp

Every ERP module introduced during the bootcamp must include an API specification before implementation.

API documentation should evolve alongside the project and remain synchronized with:

- System Architecture
- Entity Relationship Diagram
- Database Schema
- Source Code
- Automated Tests

This ensures that all engineering artifacts remain consistent throughout the Software Development Life Cycle.

---

# Expected Outcome

By completing this section, the learner should understand how to design secure, scalable, and maintainable REST APIs using industry-standard conventions.

Throughout this bootcamp, API Design serves as the contract between the frontend and backend, ensuring that every ERP module exposes a consistent and well-documented interface that supports development, testing, and future integrations.