# Sprint 11 - Security Hardening

**Sprint:** Sprint 11  
**Phase:** Phase 04 - Production Readiness  
**Duration:** 3-4 Weeks  
**Release Target:** v0.12.0  
**Status:** Planned

---

# Sprint Goal

Harden the ERP platform against realistic attacks by producing a threat model, strengthening authentication and authorization, closing input validation gaps, securing secrets and transport, and adding automated security testing to the pipeline.

At the end of this sprint, the platform should have no known high or critical vulnerabilities, and every finding should be traceable to a documented control.

---

# Sprint Context

Sprint 02 delivered working authentication and authorization.

Working is not the same as secure:

```text
Sprint 02 delivered            Sprint 11 asks

Login works                    What happens after 1,000 failed attempts?
Roles are checked              Is every endpoint checked, or only most?
Passwords are hashed           Can a token be replayed after logout?
Data is stored                 Can user A request user B's record by ID?
```

The system now holds employee records, salaries, customer data, supplier terms, and financial statements. The value of a breach has grown with every sprint.

---

# Business Outcome

After completing this sprint, the ERP platform will have:

- A documented threat model.
- Hardened authentication including multi-factor authentication.
- Verified least-privilege authorization on every endpoint.
- Comprehensive input validation.
- Secrets managed outside source control.
- Enforced transport security.
- Automated security scanning in CI.
- A documented security test report.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- Threat modelling methods.
- Common web application vulnerability classes.
- Authentication and session security.
- Authorization failure modes, including IDOR.
- Injection and validation defence.
- Secrets management.
- Dependency and supply chain risk.
- Security testing automation.

---

# Sprint Theme

## "Assume the Attacker Has Your Source Code"

Security by obscurity fails the moment a repository leaks, a developer leaves, or a dependency is compromised.

Every control in this sprint must hold even if the attacker knows exactly how the system works:

```text
Who are you?          → Authentication that resists guessing and replay

What can you do?      → Authorization checked on every request, server-side

What did you send?    → Validation that rejects anything unexpected

What do you know?     → Secrets the application holds but never reveals
```

---

# Business Capability

## Security Hardening

This sprint delivers:

- Threat identification.
- Authentication strengthening.
- Authorization verification.
- Input validation coverage.
- Secrets and transport security.
- Continuous security validation.

---

# Domain Concepts

---

# Threat Model

A structured description of what could go wrong and what prevents it.

Method:

```text
What are we building?

        ↓

What can go wrong?

        ↓

What are we going to do about it?

        ↓

Did we do a good job?
```

---

# Attack Surface

Every point where untrusted input enters the system.

```text
Public API endpoints
Authenticated API endpoints
File uploads
Report parameters
Webhook receivers
Environment configuration
Third-party dependencies
```

---

# Least Privilege

Every user, service, and process gets the minimum access needed.

```text
Employee      → own records only
Manager       → own team's records
HR Officer    → all employee records
Finance       → financial records only
Administrator → configuration, not employee salaries
```

---

# IDOR (Insecure Direct Object Reference)

An authorization failure where a valid user accesses another user's data by changing an identifier.

```text
GET /api/employees/1042    → allowed  (own record)

GET /api/employees/1043    → must be denied, not merely hidden in the UI
```

---

# Defence in Depth

Multiple independent controls, so a single failure is not a breach.

```text
Network → Transport → Authentication → Authorization → Validation → Audit
```

---

# Sprint Scope

---

# 1. Threat Modelling and Security Requirements

## Objective

Identify what needs protecting before writing any fix.

## Tasks

- Map the system's assets, entry points, and trust boundaries.
- Identify threats per module using a structured method.
- Rate each threat by likelihood and impact.
- Define a control for each accepted threat.
- Record the threat model as a versioned document.

## Business Rules

- Every high or critical threat must have an assigned control or a documented acceptance decision.
- The threat model is reviewed whenever a new module is added.

## Acceptance Criteria

- Threat model document produced and reviewed.
- Assets, entry points, and trust boundaries mapped.
- Threats rated and prioritized.
- Each high and critical threat mapped to a control and an issue.

---

# 2. Authentication Hardening

## Objective

Make identity difficult to steal, guess, or replay.

## Features

- Password policy with minimum length and complexity.
- Account lockout after repeated failures.
- Multi-factor authentication.
- Refresh token rotation.
- Server-side session revocation on logout.
- Password change and reset flows with re-authentication.

## Business Rules

- Passwords are hashed with a modern algorithm and per-user salt.
- Failed login responses must not reveal whether the account exists.
- Access tokens are short-lived; refresh tokens rotate on use.
- A reused refresh token invalidates the entire token family.
- Logout revokes the session server-side, not only in the browser.
- MFA is mandatory for administrator and finance roles.

## Acceptance Criteria

- Password policy enforced.
- Lockout triggers after the configured threshold and expires correctly.
- MFA enrolment and challenge working.
- Refresh token rotation implemented and reuse detected.
- Logout invalidates tokens server-side.
- Login responses do not leak account existence.

---

# 3. Authorization Review and Least Privilege

## Objective

Verify that every endpoint enforces permissions server-side.

## Tasks

- Inventory every API endpoint and its required permission.
- Add permission checks where missing.
- Add record-level ownership checks where role checks are insufficient.
- Review role definitions and remove excess permissions.
- Add automated tests that assert denial, not only success.

## Business Rules

- Authorization is enforced in the backend; UI hiding is not a control.
- Every endpoint has an explicitly declared required permission.
- Record-level access is checked for any resource belonging to a person or department.
- Denied requests return a consistent response that does not leak existence.

## Acceptance Criteria

- Endpoint and permission inventory complete.
- Every endpoint enforces a declared permission.
- IDOR tests pass for employees, payslips, orders, invoices, and reports.
- Roles reviewed and excess permissions removed.
- Negative authorization tests added to the test suite.

---

# 4. Input Validation and Injection Defence

## Objective

Reject untrusted input before it reaches business logic or the database.

## Tasks

- Apply schema validation to every request body, query parameter, and path parameter.
- Confirm all database access uses parameterized queries.
- Encode output rendered in the frontend.
- Validate file uploads by type, size, and content.
- Add rate limiting to authentication and report endpoints.
- Configure security response headers.

## Business Rules

- Unknown fields are rejected, not silently ignored.
- Numeric and date inputs are range-checked.
- Report parameters are validated against their definitions.
- No user input is concatenated into a query, command, or file path.
- Errors return a safe message; details go to the log, not the response.

## Acceptance Criteria

- Validation applied to every endpoint.
- Injection tests pass for SQL and command injection.
- Cross-site scripting tests pass.
- File upload restrictions enforced.
- Rate limiting applied and verified.
- Security headers present on all responses.

---

# 5. Secrets Management and Transport Security

## Objective

Ensure secrets are never committed, logged, or transmitted in the clear.

## Tasks

- Audit the repository history for committed secrets.
- Move all secrets to environment configuration.
- Document every required variable in `.env.example` with no real values.
- Enforce HTTPS and secure cookie attributes.
- Redact secrets and personal data from logs.
- Rotate any credential that was ever committed.

## Business Rules

- No secret value appears in source control, logs, or error responses.
- Cookies use `Secure`, `HttpOnly`, and an appropriate `SameSite` value.
- HTTPS is enforced with redirection and HSTS.
- Database credentials differ per environment.
- Rotation procedure is documented.

## Acceptance Criteria

- Repository scanned; findings remediated and credentials rotated.
- All secrets sourced from environment configuration.
- `.env.example` complete and value-free.
- HTTPS and secure cookie attributes enforced.
- Log redaction verified.

---

# 6. Security Testing and Dependency Scanning

## Objective

Make security validation automatic and continuous.

## Tasks

- Add static analysis to the CI pipeline.
- Add dependency vulnerability scanning.
- Add secret scanning to the pipeline.
- Write automated abuse-case tests.
- Produce a security test report.
- Define the vulnerability triage and remediation process.

## Business Rules

- CI fails on new high or critical findings.
- Dependency scanning runs on every pull request and on a schedule.
- Every finding is triaged with an owner and a due date.
- Accepted risks are documented with a justification and an expiry date.

## Acceptance Criteria

- Static analysis, dependency scanning, and secret scanning run in CI.
- Build fails on high and critical findings.
- Abuse-case tests added to the suite.
- Security test report produced.
- Triage process documented.

---

# Security Controls Summary

| Threat | Control | Verified By |
|--------|---------|-------------|
| Credential guessing | Password policy, lockout, MFA | Authentication tests |
| Token theft and replay | Short-lived tokens, rotation, revocation | Session tests |
| Privilege escalation | Server-side permission checks | Negative authorization tests |
| IDOR | Record-level ownership checks | IDOR test suite |
| SQL injection | Parameterized queries, schema validation | Injection tests |
| Cross-site scripting | Output encoding, security headers | XSS tests |
| Secret exposure | Environment config, log redaction, scanning | Secret scan in CI |
| Vulnerable dependency | Dependency scanning, CI gate | Scheduled scan |
| Denial of service | Rate limiting, payload limits | Rate limit tests |

---

# Database Changes

## New Entities

```text
UserMfaSetting
RefreshToken
LoginAttempt
SecurityAuditLog
```

---

# User MFA Setting Table

```text
UserMfaSetting

id
userId
method
secret
isEnabled
enrolledAt
```

---

# Refresh Token Table

```text
RefreshToken

id
userId
tokenFamilyId
tokenHash
issuedAt
expiresAt
revokedAt
replacedById
```

---

# Login Attempt Table

```text
LoginAttempt

id
usernameAttempted
ipAddress
succeeded
attemptedAt
```

---

# Security Audit Log Table

```text
SecurityAuditLog

id
userId
eventType
ipAddress
userAgent
detail
createdAt
```

---

# API Requirements

## Authentication APIs

```text
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/password/change
POST   /api/auth/password/reset-request
POST   /api/auth/password/reset-confirm
```

---

## MFA APIs

```text
POST   /api/auth/mfa/enroll
POST   /api/auth/mfa/verify
POST   /api/auth/mfa/disable
```

---

## Session APIs

```text
GET    /api/auth/sessions
POST   /api/auth/sessions/{id}/revoke
```

---

## Security Audit APIs

```text
GET    /api/security/audit-log
GET    /api/security/login-attempts
```

---

# GitHub Execution

---

# Epic

## Epic: Security Hardening

Purpose:

Reduce the platform's attack surface and prove, with tests, that its security controls hold.

---

# GitHub Issues

---

# Issue 069 - Produce Threat Model and Security Requirements

Type:

```
Documentation
```

Acceptance Criteria:

- Assets, entry points, and trust boundaries mapped.
- Threats identified per module and rated.
- Each high and critical threat mapped to a control.
- Threat model document reviewed and committed.

---

# Issue 070 - Harden Authentication and Add MFA

Type:

```
Improvement
```

Acceptance Criteria:

- Password policy and account lockout enforced.
- MFA enrolment and challenge working.
- Refresh token rotation implemented and reuse detected.
- Logout revokes tokens server-side.
- Login responses do not leak account existence.

---

# Issue 071 - Review Authorization and Enforce Least Privilege

Type:

```
Improvement
```

Acceptance Criteria:

- Endpoint and permission inventory complete.
- Every endpoint enforces a declared permission.
- Record-level ownership checks added.
- IDOR tests pass across all modules.
- Negative authorization tests added.

---

# Issue 072 - Implement Input Validation and Injection Defence

Type:

```
Improvement
```

Acceptance Criteria:

- Schema validation applied to every endpoint.
- Injection and XSS tests pass.
- File upload restrictions enforced.
- Rate limiting applied.
- Security headers present on all responses.

---

# Issue 073 - Implement Secrets Management and Transport Security

Type:

```
Task
```

Acceptance Criteria:

- Repository scanned and findings remediated.
- Exposed credentials rotated.
- All secrets sourced from environment configuration.
- HTTPS and secure cookie attributes enforced.
- Log redaction verified.

---

# Issue 074 - Add Security Testing and Dependency Scanning to CI

Type:

```
Task
```

Acceptance Criteria:

- Static analysis, dependency scanning, and secret scanning run in CI.
- Build fails on new high or critical findings.
- Abuse-case tests added.
- Security test report produced.
- Triage process documented.

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

Commit

        ↓

Pull Request

        ↓

Code Review

        ↓

Merge

        ↓

Release
```

Security findings are reported privately and never in a public issue body before remediation.

---

# Testing Requirements

## Unit Testing

Required:

- Password policy validation.
- Lockout threshold and expiry logic.
- Token rotation and family invalidation.
- Permission resolution.
- Record ownership checks.
- Input validation schemas.

---

## Integration Testing

Test:

- Authentication and MFA flows.
- Session revocation.
- Every endpoint's permission enforcement.
- Rate limiting behaviour.
- Security header presence.

---

## Security Testing

### Authorization Abuse Cases

```text
Authenticate as Employee A

        ↓

Request Employee B's payslip by ID

        ↓

Expect 403 or 404, never the record
```

---

### Token Replay

```text
Log in and capture refresh token

        ↓

Log out

        ↓

Replay refresh token

        ↓

Expect rejection and family invalidation
```

---

### Injection

```text
Submit crafted payloads to every input

        ↓

Expect validation rejection

        ↓

Expect no database or command execution
```

---

## Automated Scanning

Run in CI:

- Static application security testing.
- Dependency vulnerability scanning.
- Secret scanning.

---

# Documentation Deliverables

## Business Documentation

- Security policy.
- Data classification and access matrix.
- Accepted risk register.

---

## Technical Documentation

- Threat model.
- Endpoint and permission inventory.
- Security test report.
- Secrets management and rotation procedure.
- ADR: authentication and session strategy.
- ADR: authorization model.

---

# Sprint Deliverables

## Security

Completed:

- Threat model.
- Authentication hardening and MFA.
- Authorization review and least privilege.
- Input validation and injection defence.
- Secrets management and transport security.
- Automated security scanning.

---

## Engineering

Completed:

- Security controls implemented.
- Negative and abuse-case tests created.
- CI security gates added.

---

## Documentation

Completed:

- Threat model documented.
- Security test report produced.
- Security policy written.

---

# Sprint Review

The learner demonstrates:

1. Walk through the threat model.
2. Show account lockout after repeated failures.
3. Enrol and use MFA.
4. Show a token replay being rejected.
5. Attempt an IDOR and show it denied.
6. Show an injection payload rejected by validation.
7. Show CI failing on an introduced vulnerable dependency.

---

# Sprint Retrospective

## Discussion Topics

- Vulnerabilities found and their root causes.
- Whether earlier sprints could have prevented them.
- Trade-offs between security and usability.
- Cost of retrofitting security versus building it in.
- Lessons learned.

---

# Release

**Version:** `v0.12.0`

---

# Release Notes

```markdown
# v0.12.0

## Added

- Multi-Factor Authentication
- Account Lockout and Password Policy
- Refresh Token Rotation and Session Revocation
- Security Audit Logging
- Automated Security and Dependency Scanning in CI

## Changed

- Authorization enforced server-side on every endpoint
- Input validation applied across all APIs
- Secrets moved to environment configuration

## Security

- Threat model documented
- Known high and critical vulnerabilities remediated
```

---

# Definition of Done

Sprint 11 is complete when:

- [ ] Threat model documented and reviewed.
- [ ] Authentication hardening completed.
- [ ] MFA implemented for privileged roles.
- [ ] Authorization enforced on every endpoint.
- [ ] IDOR tests pass across all modules.
- [ ] Input validation applied everywhere.
- [ ] Secrets removed from source control and rotated.
- [ ] HTTPS and secure cookies enforced.
- [ ] Security scanning running in CI and gating the build.
- [ ] No known high or critical vulnerabilities remain.
- [ ] Security test report produced.
- [ ] Tests passing.
- [ ] Documentation completed.
- [ ] Pull Request approved.
- [ ] Release v0.12.0 published.

---

# Skills Acquired

After completing Sprint 11, learners will understand:

## Security Analysis

- Threat modelling.
- Risk rating and acceptance.
- Attack surface reduction.

---

## Backend Security

- Secure authentication and session design.
- Authorization enforcement patterns.
- Injection and validation defence.
- Secrets handling.

---

## Frontend Security

- Secure token storage.
- Output encoding.
- Security headers and CSP.

---

## Engineering Practice

- Writing tests that assert denial.
- Automating security in CI.
- Responsible disclosure and triage.

---

# Next Sprint Preview

# Sprint 12 - Performance & Scalability

Planned:

- Performance baseline and budgets.
- Database and query optimization.
- Caching strategy.
- API performance and pagination.
- Frontend performance.
- Load and stress testing.
