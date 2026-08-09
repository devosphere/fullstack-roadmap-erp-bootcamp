# [IMPROVEMENT] Harden Authentication and Add MFA

<!-- GitHub title: [IMPROVEMENT] Harden Authentication and Add MFA
     Labels: improvement, auth, security, priority: critical
     Milestone: Sprint 11 - Security Hardening
     Branch: feature/070-harden-authentication-and-add-mfa
     Epic: Security Hardening
     Depends on: 010, 069
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

## Module: auth
## Sprint: Sprint 11 - Security Hardening

---

## Summary

Harden the Issue 010 authentication baseline: password policy, account lockout, multi-factor
authentication, refresh token rotation with reuse detection, and server-side session revocation on
logout.

## Background

Issue 010 built correct authentication for its scope: hashed passwords, JWT issuance, generic
failure responses. Sprint 11's threat model (Issue 069) identifies what that baseline does not yet
withstand — sustained credential guessing, a stolen refresh token being replayed after the
legitimate user logged out, and privileged accounts protected by password alone.

Each control here answers one of those:

```text
Lockout             stops guessing after repeated failures, without confirming which accounts exist
MFA                  a stolen password alone is no longer sufficient for privileged roles
Token rotation       a refresh token can be used once; reuse signals theft
Server-side logout   a token doesn't remain valid just because the browser forgot it
```

**Rotation with reuse detection** is the subtlest piece: every refresh issues a new token and
invalidates the old one. If the *old* token is ever presented again, that is evidence it was
copied by someone else — the entire token family is revoked immediately, not just the one request
denied.

## User Story

As a Security Administrator,
I want authentication resistant to guessing, replay, and stolen credentials,
So that a compromised password alone is not enough to access privileged parts of the system.

## Acceptance Criteria

```gherkin
Given repeated failed login attempts against one account
When the configured threshold is reached
Then the account locks and further attempts are rejected until the lockout expires
```

```gherkin
Given a user with the Administrator or Finance Officer role
When they log in
Then they must complete an MFA challenge before receiving a session
```

```gherkin
Given a valid refresh token is used to obtain a new one
When the original token is presented again
Then the request is rejected and the entire token family is revoked
```

```gherkin
Given an authenticated user logs out
When their previously issued access token is used afterward
Then it is rejected — logout revokes the session server-side, not only in the browser
```

```gherkin
Given a login attempt against an unregistered email
When the response is compared to a login attempt with a wrong password for a real account
Then the two responses are indistinguishable in content and approximate timing
```

- [ ] Password policy enforced: minimum length and complexity
- [ ] Account lockout after a configured number of failed attempts, with a defined expiry
- [ ] MFA enrolment and challenge implemented
- [ ] MFA mandatory for Administrator and Finance Officer roles
- [ ] Refresh tokens rotate on every use
- [ ] Reused (already-rotated) refresh tokens are detected and invalidate the entire token family
- [ ] Access tokens remain short-lived, as established in Issue 010
- [ ] Logout revokes the session server-side
- [ ] `GET /api/auth/sessions` lists the current user's active sessions
- [ ] `POST /api/auth/sessions/{id}/revoke` revokes a specific session
- [ ] Login failure responses remain indistinguishable regardless of cause (extends Issue 010)
- [ ] Password reset flow requires re-authentication for sensitive changes
- [ ] All authentication events (login, lockout, MFA challenge, revocation) written to the security audit log

## Expected Result

Guessing a password no longer works past a threshold. A stolen password alone does not grant
access to privileged roles. A stolen refresh token is detected the moment it's reused. Logging out
actually ends the session everywhere.

---

## Scope

### Included

- Password policy and account lockout
- MFA enrolment, challenge, and enforcement for privileged roles
- Refresh token rotation with reuse detection
- Server-side session revocation and listing
- Audit logging of authentication events

### Out of Scope

- Authorization and permission enforcement (Issue 071)
- Input validation beyond authentication endpoints (Issue 072)
- Secrets management (Issue 073)
- Social login or SSO integration
- Biometric authentication

## Technical Requirements

**Endpoints**

```text
POST   /api/auth/mfa/enroll
POST   /api/auth/mfa/verify
POST   /api/auth/mfa/disable

GET    /api/auth/sessions
POST   /api/auth/sessions/{id}/revoke
```

Extends the existing `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`, and password
endpoints from Issue 010 rather than replacing them.

**Schema**

```text
UserMfaSetting

id
userId          → User
method          enum: TOTP
secret
isEnabled
enrolledAt

RefreshToken

id
userId          → User
tokenFamilyId
tokenHash
issuedAt
expiresAt
revokedAt       nullable
replacedById    → RefreshToken, nullable

LoginAttempt

id
usernameAttempted
ipAddress
succeeded
attemptedAt
```

**Lockout**

```text
Consecutive failures for one account >= threshold within a rolling window
    → account locked for a configured duration
    → response identical in shape to a normal failed-login response, so lockout state
      is not itself information-disclosing
```

**Token rotation and reuse detection**

```text
Refresh token used

    → verify tokenHash is valid and not revoked

    → issue a new token in the same tokenFamilyId
    → mark the used token revokedAt = now, replacedById = new token

Refresh token presented but its row shows revokedAt already set
                                          or it does not match the latest in its family

    → this is reuse: revoke every token in the tokenFamilyId immediately
    → force full re-authentication
```

This is the mechanism that turns a stolen-and-later-used token into a detectable event rather than
a silent compromise.

**MFA enforcement**

```text
Login succeeds with password

    ↓

User's role requires MFA (Administrator, Finance Officer)?

    → yes: issue a temporary challenge token, require /api/auth/mfa/verify before a full session
    → no: issue the full session directly
```

**Permissions**

No new permission codes — authentication hardening applies uniformly and is not itself
permission-gated, aside from `SUPPLIER_BANK_UPDATE` and similarly sensitive existing permissions,
which the threat model (Issue 069) may flag for mandatory MFA regardless of role.

## Dependencies

- Issue 010 — the authentication baseline this issue hardens.
- Issue 069 — the threat model naming the specific threats this issue addresses.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for lockout threshold and expiry
- [ ] Unit tests for token rotation and family invalidation on reuse
- [ ] Unit tests for MFA enrolment and challenge verification
- [ ] **Security test**: a reused refresh token is rejected and its entire family is revoked
- [ ] **Security test**: logout invalidates the session for subsequent requests using the prior token
- [ ] **Security test**: login failure responses are content- and timing-indistinguishable across causes
- [ ] Test confirming MFA is mandatory for Administrator and Finance Officer roles
- [ ] Integration tests for all endpoints
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-11-security-hardening.md` § 2 |
| Epic | Security Hardening |
| Hardens | Issue 010 |
| Driven by | Issue 069 |
| Pull Request | _to be linked_ |
