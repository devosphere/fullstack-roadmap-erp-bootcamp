# [FEATURE] Create User Authentication API

<!-- GitHub title: [FEATURE] Create User Authentication API
     Labels: feature, auth, security, priority: critical
     Milestone: Sprint 02 - Identity & Access Management
     Branch: feature/010-create-user-authentication-api
     Epic: Identity & Access Management
     Depends on: 007
     Blocks: 011, 012, 013, 014
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [ ] High
- [x] Critical

## Module: auth
## Sprint: Sprint 02 - Identity & Access Management

---

## Summary

Implement secure user authentication: registration, login with hashed password verification, JWT
issuance and validation, and a security audit log of authentication events.

## Background

The `User` entity exists from Issue 007 but nothing authenticates against it. Every protected
endpoint in the remaining 14 sprints depends on this issue.

Three things must be right here because they are expensive to change later:

- **Password storage.** Hashing is one-way. Choosing a weak algorithm means every stored password
  must be re-hashed on next login, and until then remains at risk.
- **Token shape.** Every downstream guard reads the JWT payload. Adding a field later is easy;
  changing its meaning invalidates every issued token.
- **Error responses.** A login endpoint that says "user not found" versus "wrong password" tells an
  attacker which emails are registered.

Sprint 11 hardens this further with MFA, lockout, and refresh token rotation. This issue
establishes the correct baseline.

## User Story

As a System User,
I want to log in with my email and password and receive an authentication token,
So that I can access protected ERP resources securely.

## Acceptance Criteria

```gherkin
Given a registered user with a valid password
When they POST valid credentials to /api/auth/login
Then they receive 200 with a signed JWT and the token contains their user id
```

```gherkin
Given a registered user
When they POST an incorrect password to /api/auth/login
Then they receive 401 with a generic message that does not reveal whether the email exists
```

```gherkin
Given an email that is not registered
When a login is attempted
Then the response is identical in shape and timing to a wrong-password response
```

```gherkin
Given an expired JWT
When it is used against a protected endpoint
Then the request is rejected with 401
```

- [ ] `POST /api/auth/register` creates a user with a hashed password
- [ ] `POST /api/auth/login` verifies credentials and returns a JWT
- [ ] `GET /api/auth/me` returns the authenticated user's profile
- [ ] `POST /api/auth/logout` implemented
- [ ] Passwords hashed with bcrypt or argon2, never stored or logged in plain text
- [ ] Password hash never appears in any API response
- [ ] JWT signed with a secret loaded from environment configuration
- [ ] JWT expiry configured and enforced
- [ ] JWT guard created and applied to protected routes
- [ ] Invalid credential responses do not leak account existence
- [ ] Email format and password strength validated on registration
- [ ] Duplicate email registration rejected
- [ ] Authentication events written to a security audit log
- [ ] Authentication flow documented in `docs/API/`

## Expected Result

A user can register and log in. A valid token grants access to protected endpoints; an invalid or
expired one does not. No response, log line, or error message reveals a password hash or whether a
given email is registered.

---

## Scope

### Included

- Register, login, logout, and current-user endpoints
- Password hashing and verification
- JWT issuance, signing, and expiry
- JWT authentication guard
- Input validation on auth endpoints
- Security audit logging of authentication events
- API documentation

### Out of Scope

- User administration CRUD (Issue 011)
- Roles (Issue 012) and permissions (Issue 013)
- Login UI (Issue 014)
- Multi-factor authentication, account lockout, refresh token rotation (Sprint 11, Issue 070)
- Password reset by email (Sprint 11, Issue 070)

## Technical Requirements

**Endpoints**

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

**JWT payload**

```text
sub          user id
email        user email
iat          issued at
exp          expiry
```

Do not put roles or permissions in the token yet — they are resolved server-side in Issue 013 so
a permission change takes effect without waiting for token expiry.

**Environment variables**

```text
JWT_SECRET=
JWT_EXPIRES_IN=
```

**Module structure**

```text
backend/src/modules/auth/
├── auth.controller.ts
├── auth.service.ts
├── auth.module.ts
├── dto/
│   ├── register.dto.ts
│   └── login.dto.ts
├── guards/
│   └── jwt-auth.guard.ts
└── strategies/
    └── jwt.strategy.ts
```

**Security rules**

- Hash cost factor set deliberately and documented.
- Login failures return the same status, body, and approximate timing regardless of cause.
- `JWT_SECRET` is never committed and fails startup if missing.
- Password fields excluded from all serialized responses.

## Dependencies

- Issue 007 — the `User` entity and Prisma client must exist.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for hashing, verification, and token generation
- [ ] Integration tests for register, login, and protected access
- [ ] Negative tests: wrong password, unknown email, expired token, malformed token
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-02-identity-access-management.md` § 1, § 2, § 3, § 8 |
| Epic | Identity & Access Management |
| Hardened by | Issue 070 (Sprint 11) |
| Pull Request | _to be linked_ |
