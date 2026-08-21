# [EPIC] Identity & Access Management

<!-- GitHub title: [EPIC] Identity & Access Management
     Labels: epic, auth, security
     Milestone: Sprint 02 - Identity & Access Management
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 010-015 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: auth
## Sprint: Sprint 02 - Identity & Access Management

---

## Purpose

Build the security foundation for the ERP platform: authentication, authorization, roles, and
permissions.

Every enterprise application must answer three questions before it can do anything else:

```text
Who are you?

        ↓

What can you access?

        ↓

What actions can you perform?
```

## Business Value

Identity is a hard dependency for every module that follows. HR data, salaries, customer terms,
supplier pricing, and financial statements are all access-controlled. A module built before this
epic would have to be retrofitted with access control, endpoint by endpoint.

The permission model created here is enforced across roughly 90 endpoints by the end of the
programme, and audited in Sprint 11.

## Issues

- [ ] #10 Create User Authentication API
- [ ] #11 Implement User Management
- [ ] #12 Implement Role Management
- [ ] #13 Implement Permission System
- [ ] #14 Create Authentication UI
- [ ] #15 Add Security Testing

## Domain Model

```text
User  ←→  Role  ←→  Permission

User        A person who can access the system
Role        A named collection of permissions
Permission  A specific action allowed in the system
```

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Users can register and authenticate securely
- [ ] Passwords hashed with a modern algorithm
- [ ] JWT issued, validated, and expiring
- [ ] Roles assignable to users
- [ ] Permissions enforced server-side on every protected endpoint
- [ ] Login UI working with protected routes
- [ ] Authorization denial tested, not only success
- [ ] Release v0.3.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-02-identity-access-management.md` |
| Phase overview | `academy/08-sprints/phase-01-core-platform/phase-overview.md` |
| Hardened further in | Sprint 11 - Security Hardening (Issues 069-074) |
| Release | v0.3.0 |
