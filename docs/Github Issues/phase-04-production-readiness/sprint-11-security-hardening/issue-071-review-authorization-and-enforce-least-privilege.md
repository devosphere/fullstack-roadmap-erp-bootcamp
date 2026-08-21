# [IMPROVEMENT] Review Authorization and Enforce Least Privilege

<!-- GitHub title: [IMPROVEMENT] Review Authorization and Enforce Least Privilege
     Labels: improvement, auth, security, priority: critical
     Milestone: Sprint 11 - Security Hardening
     Branch: feature/071-review-authorization-and-enforce-least-privilege
     Epic: Security Hardening
     Depends on: 013, 069
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

Inventory every API endpoint built through Sprint 10, verify each declares and enforces a
permission, add record-level ownership checks wherever a resource belongs to a specific person or
department, and prove denial with tests across every module — not just success.

## Background

Issue 013 built the permission guard in Sprint 02. Since then, roughly ninety endpoints have been
added across nine sprints, each one supposed to declare a required permission on its handler. This
issue is where that assumption gets checked, not assumed.

Two gaps are worth calling out specifically, because they were noted as risks when their modules
were built:

- **Role-based permission is not the same as record-level access.** A Manager holding
  `EMPLOYEE_READ` can see employee records generally, but Issue 027's self-service portal
  deliberately resolves `/me` endpoints from the token so an employee can never request another
  employee's record by changing an id. Every place a similar pattern *should* exist but might not
  — Issue 065's task inbox, financial statements — needs the same check verified.
- **Sensitive fields need field-level, not just record-level, protection.** Issue 022's government
  identifiers and Issue 043's supplier bank details were built with a separate permission for
  exactly this reason. This issue confirms that separation actually holds under test, not only in
  the original design intent.

The test that proves this issue did its job is the same one used since Issue 015 in Sprint 02: for
every endpoint, three identities — no token, authenticated without permission, authenticated with
permission — get exactly 401, 403, and success respectively.

## User Story

As a Security Administrator,
I want every endpoint's authorization verified with tests that demonstrate denial,
So that a missing or broken permission check is caught before production, not after an incident.

## Acceptance Criteria

```gherkin
Given the full endpoint inventory
When each endpoint is checked
Then every one declares an explicit required permission
```

```gherkin
Given an authenticated user without the required permission
When they call any inventoried endpoint
Then the response is 403 and no data changes or is returned
```

```gherkin
Given an employee record, a leave request, or a financial document belonging to another user
When a different authenticated user attempts to access it by id
Then the request is rejected regardless of their general role permissions
```

```gherkin
Given the reviewed role definitions
When a role's granted permissions are inspected
Then no role holds a permission its job function does not require
```

- [ ] Complete inventory of every API endpoint and its required permission produced and committed
- [ ] Every endpoint found without a permission check has one added
- [ ] Record-level ownership checks added for every resource that belongs to a specific person or department, beyond what Issue 027 already covers
- [ ] IDOR test suite covering employees, payslips-adjacent data, leave requests, sales orders, purchase requisitions, invoices, and reports
- [ ] Role definitions reviewed; excess permissions removed
- [ ] Negative authorization tests (the 401/403/success matrix) added for every endpoint in the inventory
- [ ] Denied requests return a consistent response shape that does not confirm or deny resource existence
- [ ] Supplier bank details (Issue 043) and government identifiers (Issue 022) re-verified as excluded from responses for unauthorized roles
- [ ] Findings and fixes documented against the Issue 069 threat model

## Expected Result

Every endpoint in the system enforces its declared permission, every resource that belongs to a
specific person or department cannot be reached by anyone else via id substitution, and this is
proven by tests that assert denial, not only success.

---

## Scope

### Included

- Full endpoint and permission inventory
- Gap remediation for missing permission checks
- Record-level (IDOR) checks beyond existing self-service patterns
- Role permission review and cleanup
- Negative authorization test suite across all modules
- Consistent denial response shape
- Re-verification of sensitive field exclusion (Issues 022, 043)

### Out of Scope

- Authentication itself (Issue 070)
- Input validation (Issue 072)
- New permission features (delegation, time-bound grants) — out of scope for a hardening sprint
- Multi-tenant data partitioning

## Technical Requirements

**Inventory process**

```text
For every controller across every module built through Sprint 10:

    1. List each route
    2. Confirm a permission decorator is present (Issue 013's pattern)
    3. Record: method, path, required permission, and whether a record-level check exists
    4. Flag any route missing a permission decorator
    5. Flag any route that returns another user's data based on a client-supplied id
       without an ownership check
```

Commit the resulting inventory to `docs/Architecture/endpoint-permission-inventory.md` — it becomes
a living reference, not a one-time artifact, and future sprints should update it.

**The three-identity test matrix**

Applied to every endpoint in the inventory, extending the pattern from Issue 015:

| Identity | Expected |
|----------|----------|
| No token | 401 |
| Authenticated, missing required permission | 403 |
| Authenticated, holding required permission | Success |

**Record-level check pattern**

For any endpoint accepting a resource id where the resource logically belongs to a specific
person, department, or document owner:

```text
Resolve the resource by id

    ↓

Does the requester's role grant broad access (e.g. HR Officer, Administrator)?
    → yes: proceed
    → no: does the resource belong to the requester (or their team, via the reporting hierarchy)?
        → yes: proceed
        → no: 403, identical in shape to "permission missing"
```

Apply this specifically to: leave request detail by id, sales order detail for a representative's
own orders (Issue 042's scoping), purchase requisition detail (Issue 044's `/me` already covers
listing — verify the single-record endpoint too), and any financial document detail endpoint.

**Sensitive field re-verification**

Re-run the field-group tests from Issue 022 (government identifiers) and Issue 043 (supplier bank
details) against the current codebase — confirm nothing regressed across the six sprints since
those issues were built.

**Consistent denial shape**

```text
403 response body is identical whether:
    - the resource doesn't exist
    - the resource exists but belongs to someone else
    - the user lacks the general permission entirely
```

A 404-vs-403 distinction, or a body that names the resource, leaks existence information — matching
the principle already established for login responses in Issue 010.

## Dependencies

- Issue 013 — the permission guard this issue audits.
- Issue 069 — the threat model identifying where this review should focus first.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Endpoint and permission inventory committed and complete
- [ ] Every endpoint has a passing three-identity test
- [ ] IDOR test suite passing across all named modules
- [ ] Role permissions reviewed; excess access removed and documented
- [ ] Sensitive field tests (Issues 022, 043) re-verified passing
- [ ] Denial response shape verified consistent across a sample of endpoints from different modules
- [ ] Code review completed
- [ ] CI green
- [ ] Findings documented against the threat model in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-11-security-hardening.md` § 3 |
| Epic | Security Hardening |
| Audits | Issue 013 |
| Re-verifies | Issue 022, Issue 043 |
| Extends the pattern from | Issue 027 |
| Driven by | Issue 069 |
| Pull Request | _to be linked_ |
