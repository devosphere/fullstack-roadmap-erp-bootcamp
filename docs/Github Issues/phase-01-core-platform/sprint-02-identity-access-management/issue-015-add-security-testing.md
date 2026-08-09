# [TASK] Add Security Testing

<!-- GitHub title: [TASK] Add Security Testing
     Labels: task, testing, security, priority: high
     Milestone: Sprint 02 - Identity & Access Management
     Branch: feature/015-add-security-testing
     Epic: Identity & Access Management
     Depends on: 010, 011, 012, 013, 014
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [x] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: testing
## Sprint: Sprint 02 - Identity & Access Management

---

## Summary

Build an automated test suite covering authentication and authorization behaviour, with particular
emphasis on the cases that must be **rejected**.

## Background

The tests written alongside Issues 010-014 mostly prove that things work. Security is the opposite
problem: it is about what must *not* happen.

A test suite that only asserts success will pass even if the permission guard is accidentally
removed. Every endpoint would still return 200 — for everyone. The suite would stay green while the
system became fully open.

This issue creates the tests that fail loudly when that happens. It is also the regression net that
Sprint 11's hardening work depends on: without it, there is no way to change authentication without
risking a silent security regression.

## Acceptance Criteria

```gherkin
Given the permission guard is removed from an endpoint
When the security test suite runs
Then at least one test fails
```

```gherkin
Given a user without a required permission
When they call each protected endpoint
Then every one returns 403 and performs no side effect
```

```gherkin
Given a request with no token, a malformed token, or an expired token
When it reaches a protected endpoint
Then it is rejected with 401
```

- [ ] Test suite covering authentication rejection: no token, malformed token, expired token, tampered signature
- [ ] Test suite covering authorization rejection: authenticated but unauthorized, for every protected endpoint
- [ ] Test confirming a rejected request produces no side effect in the database
- [ ] Test confirming the password hash never appears in any response body
- [ ] Test confirming login failures are indistinguishable between unknown email and wrong password
- [ ] Test confirming role revocation takes effect before token expiry
- [ ] Test confirming a user with multiple roles receives the union of their permissions
- [ ] Test confirming deactivated users cannot log in
- [ ] Test confirming a user cannot deactivate their own account
- [ ] End-to-end test covering login, protected access, and logout
- [ ] Test helpers created for authenticating as a given role
- [ ] Security tests run in CI and block merge on failure
- [ ] Testing approach documented in `academy/05-testing/`

## Expected Result

The suite proves the security controls work by demonstrating that unauthorized requests fail. A
regression that weakens authentication or authorization breaks the build.

---

## Scope

### Included

- Authentication rejection tests
- Authorization rejection tests across all protected endpoints
- Side-effect absence verification
- Response leakage tests
- Multi-role and revocation tests
- End-to-end authentication flow test
- Reusable authenticated-request test helpers
- CI integration
- Testing documentation

### Out of Scope

- Penetration testing and abuse-case fuzzing (Sprint 11, Issue 074)
- Static analysis and dependency scanning (Sprint 11, Issue 074)
- Record-level ownership and IDOR tests (Sprint 11, Issue 071)
- Load and stress testing (Sprint 12, Issue 080)

## Technical Requirements

**Stack**

| Concern | Choice |
|---------|--------|
| Unit and integration | Vitest + Supertest |
| End-to-end | Playwright |

**Test structure**

```text
backend/test/
├── helpers/
│   ├── auth.helper.ts        authenticate as a given role
│   └── db.helper.ts          reset and seed per test
└── security/
    ├── authentication.spec.ts
    ├── authorization.spec.ts
    └── data-exposure.spec.ts
```

**Coverage matrix**

Every protected endpoint is tested against three identities:

| Identity | Expected |
|----------|----------|
| No token | 401 |
| Authenticated, missing permission | 403 |
| Authenticated, holding permission | Success |

**Rules**

- A denial test asserts both the status code **and** that no data changed.
- Test helpers are reused by every later sprint rather than reinvented per module.
- The suite runs against a clean database per test to avoid order dependence.

## Dependencies

- Issues 010, 011, 012, 013 — the behaviour under test.
- Issue 014 — needed for the end-to-end flow test.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Every protected endpoint covered by the three-identity matrix
- [ ] Suite verified by temporarily removing a guard and confirming failure
- [ ] No flaky tests
- [ ] Security tests running in CI and blocking merge
- [ ] Code review completed
- [ ] CI green
- [ ] Testing documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-02-identity-access-management.md` |
| Testing guide | `academy/05-testing/` |
| Epic | Identity & Access Management |
| Extended by | Issue 074 (Sprint 11) |
| Pull Request | _to be linked_ |
