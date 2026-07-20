# Security

**Version:** 1.0

---

# Purpose

Security is a fundamental aspect of software engineering that protects systems, users, and business data from unauthorized access, data breaches, and malicious activities.

Security is **not** a separate phase of the Software Development Life Cycle (SDLC). Instead, it must be considered throughout planning, design, development, testing, deployment, and maintenance.

Throughout this bootcamp, every ERP module must follow secure development practices before it can be considered production-ready.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand fundamental security principles
- Design secure applications
- Implement authentication and authorization
- Protect sensitive business data
- Identify common web application vulnerabilities
- Apply secure coding practices
- Integrate security into the SDLC

---

# Security in the SDLC

Security should be integrated into every phase of development.

```text
Business Requirements
        │
        ▼
Security Requirements
        │
        ▼
System Architecture
        │
        ▼
Secure Development
        │
        ▼
Security Testing
        │
        ▼
Deployment
        │
        ▼
Monitoring
```

Security is everyone's responsibility.

---

# Core Security Principles

Every ERP system should follow these principles:

- Confidentiality
- Integrity
- Availability
- Authentication
- Authorization
- Accountability
- Least Privilege
- Defense in Depth

These principles guide every security decision.

---

# Confidentiality

Confidentiality ensures that sensitive information is only accessible to authorized users.

Examples:

- Employee salary information
- Customer records
- Financial transactions
- Payroll data

Techniques:

- Encryption
- Authentication
- Authorization
- Secure communication (HTTPS)

---

# Integrity

Integrity ensures that data cannot be modified without authorization.

Examples:

- Prevent unauthorized salary changes.
- Prevent inventory manipulation.
- Protect financial records.

Techniques:

- Database constraints
- Audit logs
- Transactions
- Input validation

---

# Availability

The ERP system should remain available to authorized users.

Examples:

- Reliable infrastructure
- Regular backups
- Disaster recovery plans
- Monitoring
- Redundant services

---

# Authentication

Authentication verifies a user's identity.

This bootcamp uses:

- Email and password
- JWT Access Tokens
- Refresh Tokens

Example login flow:

```text
User

↓

Login

↓

Authentication Service

↓

JWT Issued

↓

Protected API Access
```

Authentication must occur before accessing protected resources.

---

# Authorization

Authorization determines what authenticated users are allowed to do.

The ERP uses **Role-Based Access Control (RBAC).**

Example:

| Role | Example Permissions |
|------|----------------------|
| Employee | View own profile |
| Manager | Approve requests |
| HR | Manage employees |
| Finance | Manage payroll |
| Administrator | Full system access |

Authorization must always be enforced on the backend.

---

# Password Security

Passwords should never be stored in plain text.

Requirements:

- Hash passwords using a strong algorithm (e.g., Argon2 or bcrypt).
- Enforce minimum password complexity.
- Never log passwords.
- Never expose passwords in API responses.

---

# Secure Communication

All communication must use HTTPS.

```text
Browser

↓

HTTPS

↓

Backend API
```

Never transmit sensitive information over unsecured connections.

---

# Input Validation

Never trust user input.

Validate:

- Required fields
- Data types
- Length
- Formats
- Allowed values

Example:

```text
Email

✓ Valid email

Password

✓ Minimum length

Age

✓ Positive integer
```

Validation should occur on both the frontend and backend, with the backend acting as the final authority.

---

# SQL Injection

Poor validation can allow attackers to manipulate database queries.

Mitigation:

- Parameterized queries
- ORM (e.g., Prisma)
- Input validation
- Least privilege database accounts

Never concatenate raw user input into SQL statements.

---

# Cross-Site Scripting (XSS)

XSS occurs when malicious scripts are injected into web pages.

Mitigation:

- Escape user-generated content
- Sanitize HTML when necessary
- Use secure frontend frameworks
- Apply a Content Security Policy (CSP)

---

# Cross-Site Request Forgery (CSRF)

CSRF tricks authenticated users into performing unwanted actions.

Mitigation:

- CSRF tokens (when using cookie-based authentication)
- SameSite cookies
- Origin and Referer validation

When using JWTs, understand the storage strategy and associated risks.

---

# Sensitive Data Protection

Examples of sensitive data:

- Passwords
- Personal information
- Financial records
- Access tokens
- API keys

Guidelines:

- Encrypt sensitive data at rest where appropriate.
- Do not expose secrets in logs.
- Never commit secrets to GitHub.
- Use environment variables or secret managers.

---

# API Security

Every protected API should:

- Require authentication
- Validate authorization
- Validate input
- Return appropriate HTTP status codes
- Limit exposed information

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Logging and Auditing

Important security events should be logged.

Examples:

- Login
- Logout
- Failed login attempts
- Password changes
- Role changes
- Record deletions
- Permission changes

Logs support incident investigation and compliance.

---

# Rate Limiting

Protect APIs against abuse.

Examples:

- Login attempts
- Password reset requests
- Public APIs

Rate limiting reduces brute-force and denial-of-service attacks.

---

# Error Handling

Do not expose internal implementation details.

Good:

```json
{
  "message": "Unauthorized."
}
```

Avoid:

```json
{
  "message": "SQL Error: Table employees does not exist."
}
```

Generic error messages reduce information leakage.

---

# Security Headers

The application should implement common HTTP security headers.

Examples:

- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Strict-Transport-Security

These headers improve browser-side security.

---

# Dependency Management

Third-party packages should be:

- Regularly updated
- Reviewed before installation
- Monitored for vulnerabilities

Avoid unnecessary dependencies.

---

# Security Testing

Security should be verified throughout development.

Examples:

- Unit Tests
- Integration Tests
- Authentication Tests
- Authorization Tests
- Input Validation Tests
- Dependency Scanning
- Static Code Analysis

Security testing complements functional testing.

---

# OWASP Top 10

Developers should be familiar with common web application risks.

Examples include:

- Broken Access Control
- Cryptographic Failures
- Injection
- Insecure Design
- Security Misconfiguration
- Vulnerable Components
- Identification and Authentication Failures
- Software and Data Integrity Failures
- Logging and Monitoring Failures
- Server-Side Request Forgery (SSRF)

Understanding these risks helps prevent common vulnerabilities.

---

# Relationship to Other Documents

Security influences every technical artifact.

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
Development
        │
        ▼
Testing
        │
        ▼
Deployment
```

Security should be considered at every stage of the SDLC.

---

# GitHub Workflow

Security should be part of every Pull Request.

```text
GitHub Issue
        │
        ▼
Development
        │
        ▼
Security Review
        │
        ▼
Automated Tests
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

Security concerns identified during review should be addressed before merging.

---

# Best Practices

Professional engineers should:

- Follow the principle of least privilege.
- Never trust user input.
- Keep dependencies up to date.
- Protect secrets.
- Enforce authentication and authorization.
- Log important security events.
- Use HTTPS everywhere.
- Review code for security risks.
- Include security testing in CI/CD.

---

# Common Mistakes

Avoid:

- Storing passwords in plain text.
- Hardcoding secrets in source code.
- Trusting client-side validation alone.
- Returning sensitive error messages.
- Ignoring authorization checks.
- Skipping dependency updates.
- Leaving debug endpoints enabled in production.

Security weaknesses often arise from small oversights.

---

# Security in This Bootcamp

Every ERP feature developed during this bootcamp must be designed with security in mind.

Before a Pull Request can be merged, the learner should verify that:

- Authentication is implemented where required.
- Authorization rules are enforced.
- Input validation is complete.
- Sensitive data is protected.
- Automated tests pass.
- Documentation is updated.

Security is part of the project's Definition of Done and is expected in every Sprint.

---

# Expected Outcome

By completing this section, the learner should understand the principles of secure software development and be able to apply them throughout the ERP project.

Throughout this bootcamp, security is treated as a continuous engineering responsibility, ensuring that every feature is designed, implemented, tested, and deployed with the protection of users, business data, and system integrity in mind.