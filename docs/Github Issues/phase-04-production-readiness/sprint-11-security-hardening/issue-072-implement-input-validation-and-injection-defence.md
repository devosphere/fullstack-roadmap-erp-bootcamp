# [IMPROVEMENT] Implement Input Validation and Injection Defence

<!-- GitHub title: [IMPROVEMENT] Implement Input Validation and Injection Defence
     Labels: improvement, backend, security, priority: critical
     Milestone: Sprint 11 - Security Hardening
     Branch: feature/072-implement-input-validation-and-injection-defence
     Epic: Security Hardening
     Depends on: 069
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [x] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [ ] High
- [x] Critical

## Module: backend
## Sprint: Sprint 11 - Security Hardening

---

## Summary

Apply schema validation to every request body, query parameter, and path parameter across the
system, confirm all database access is parameterized, encode frontend output, restrict file
uploads, and add rate limiting and security headers.

## Background

Every endpoint built through Sprint 10 had validation appropriate to its own feature — Issue 019's
employee number format, Issue 037's price range, Issue 058's parameter types. What has not been
checked is whether that coverage is **complete and consistent** across all ninety-odd endpoints, or
whether it has gaps a determined attacker would find first.

Two endpoints carry specific risk worth naming: **Issue 022's document upload** (arbitrary file
content) and **Issue 058's report parameters** (values that flow into a query against the Issue 057
read models). Both accept structured input that eventually reaches either the filesystem or the
database, which makes them natural targets for this issue's review even though neither is expected
to actually be vulnerable — the point of this issue is to *prove* that, not assume it.

The core discipline: **unknown fields are rejected, not silently ignored.** Silent dropping — the
same principle established for Issue 027's contact update and Issue 058's report parameters — hides
a client bug and, worse, hides an attacker probing for a field the validation forgot to declare.

## User Story

As a Security Administrator,
I want every input validated and every output safely encoded,
So that no request can inject code, corrupt data, or execute unintended commands.

## Acceptance Criteria

```gherkin
Given any endpoint's schema
When a request includes a field the schema does not declare
Then the request is rejected, not silently accepted with the field ignored
```

```gherkin
Given a crafted payload designed to break out of a SQL query
When it is submitted to any endpoint accepting text input
Then it is safely stored or rejected, never executed as SQL
```

```gherkin
Given a crafted payload containing a script tag
When it is stored and later rendered in the frontend
Then it displays as inert text, not executable script
```

```gherkin
Given a file upload (Issue 022) with a disallowed type or oversized content
When it is submitted
Then it is rejected before being written to storage
```

```gherkin
Given repeated requests to the login endpoint from one source
When the configured rate limit is exceeded
Then further requests are rejected until the window resets
```

```gherkin
Given any API response
When its headers are inspected
Then the configured security headers are present
```

- [ ] Schema validation applied to every request body, query parameter, and path parameter
- [ ] Unknown fields rejected across all endpoints, not silently dropped
- [ ] Numeric and date inputs range-checked
- [ ] Confirmed: all database access uses parameterized queries or the ORM's safe query builder — no string concatenation into a query anywhere in the codebase
- [ ] Frontend output encoding verified for all user-supplied content rendered anywhere in the UI
- [ ] File upload validation by type, size, and content for Issue 022's document upload
- [ ] Rate limiting applied to authentication endpoints (Issue 010, Issue 070)
- [ ] Rate limiting applied to report execution and export endpoints (Issues 058, 061)
- [ ] Security response headers configured: CSP, X-Content-Type-Options, X-Frame-Options, HSTS
- [ ] Error responses return a safe message; stack traces and internals never appear in a response
- [ ] Detailed error information logged server-side, not exposed to the client

## Expected Result

No endpoint accepts an unexpected field, no input reaches the database or the browser unsafely, and
the system rejects abuse of authentication and reporting endpoints before it becomes a resource
problem.

---

## Scope

### Included

- Systematic schema validation review across all endpoints
- Parameterized query confirmation
- Frontend output encoding review
- File upload hardening (Issue 022)
- Rate limiting on authentication and reporting/export endpoints
- Security response headers
- Safe error response handling

### Out of Scope

- Authentication hardening itself (Issue 070)
- Authorization and IDOR review (Issue 071)
- Web Application Firewall or edge-level protection (an infrastructure concern for Issue 081)
- Content Security Policy nonce-based script management beyond a baseline policy

## Technical Requirements

**Validation review process**

```text
For every endpoint:

    1. Confirm a validation schema exists (DTO with class-validator, or equivalent)
    2. Confirm the schema is in "reject unknown fields" mode, not "strip unknown fields"
    3. Confirm numeric fields have documented, enforced bounds where a bound is meaningful
    4. Confirm date fields reject nonsensical values (e.g. Issue 026's leave year, Issue 037's price validity)
```

**Parameterized query confirmation**

```text
grep the codebase for raw query construction that concatenates a variable into SQL text

    → any match is a finding, remediated regardless of whether it is currently exploitable
```

The ORM (Prisma, per `AGENTS.md`) parameterizes by default; this check exists to catch any raw
query escape hatch used for a complex report (Issue 057, 058) that might have been written outside
that default.

**File upload hardening** (Issue 022's `EmployeeDocument`)

```text
Accepted MIME types allow-listed, not blocked by extension alone
Maximum file size enforced before the full body is read into memory
Content sniffed to confirm it matches the declared type (magic-byte check),
    not merely the client-supplied Content-Type header
Storage path outside the web root, filenames not derived from user input
```

**Rate limiting**

```text
POST /api/auth/login              N attempts per IP per window   (complements Issue 070's lockout)
POST /api/auth/mfa/verify         N attempts per IP per window
POST /api/reports/{code}/run      N requests per user per window
POST /api/reports/{code}/export   N requests per user per window
```

Rate limiting on login is a distinct control from Issue 070's per-account lockout — this limits
request *volume* regardless of which account is targeted, catching credential-stuffing across many
accounts from one source.

**Security headers**

```text
Content-Security-Policy      restrictive default, documented exceptions
X-Content-Type-Options       nosniff
X-Frame-Options               DENY
Strict-Transport-Security     enforced, coordinated with Issue 073's HTTPS work
```

**Error handling**

```text
Client response:   { "error": "A safe, generic message" }
Server log:        full stack trace, request context, correlation reference
```

No response body ever contains a stack trace, a raw database error, or an internal file path.

## Dependencies

- Issue 069 — the threat model naming injection, XSS, and abuse as specific risks to address.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Validation schema audit completed across all endpoints; gaps closed
- [ ] Unit tests confirming unknown fields are rejected on a representative sample across modules
- [ ] **Security test**: crafted injection payloads against text inputs are safely handled, not executed
- [ ] **Security test**: crafted XSS payloads render as inert text after storage and retrieval
- [ ] File upload tests: type, size, and content-sniffing rejection cases
- [ ] Rate limit tests confirming the threshold is enforced and resets correctly
- [ ] Security header presence tested across representative endpoints
- [ ] Test confirming error responses never leak stack traces or internals
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-11-security-hardening.md` § 4 |
| Epic | Security Hardening |
| Reviews upload from | Issue 022 |
| Reviews query parameters from | Issue 058 |
| Driven by | Issue 069 |
| Pull Request | _to be linked_ |
