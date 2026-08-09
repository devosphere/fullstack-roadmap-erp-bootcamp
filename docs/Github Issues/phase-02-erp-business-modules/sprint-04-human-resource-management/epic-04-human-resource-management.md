# [EPIC] Human Resource Management

<!-- GitHub title: [EPIC] Human Resource Management
     Labels: epic, hr
     Milestone: Sprint 04 - Human Resource Management
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 022-028 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: hr
## Sprint: Sprint 04 - Human Resource Management

---

## Purpose

Turn the employee records created in Sprint 03 into working HR operations: full profiles,
employment lifecycle, attendance, leave, self-service, and HR visibility.

```text
Managing Employee Records

        ↓

Managing Employee Operations
```

## Business Value

This is the first module where ordinary employees — not administrators — use the system daily.
Leave requests and attendance are the two HR processes every organization runs manually until
software replaces them.

It is also the first module with a real approval workflow, routing leave requests through the
reporting hierarchy built in Issue 021. That pattern is generalized into a reusable engine in
Sprint 10.

## Issues

- [ ] #22 Enhance Employee Profile
- [ ] #23 Implement Employment Lifecycle Management
- [ ] #24 Implement Attendance Management
- [ ] #25 Implement Leave Management
- [ ] #26 Implement Leave Balance Management
- [ ] #27 Create Employee Self-Service Portal
- [ ] #28 Create HR Dashboard

## Domain Model

```text
Employee

    ├── EmploymentHistory      status changes over time

    ├── Attendance             daily clock in / clock out

    ├── LeaveRequest  ──→  LeaveApproval

    └── LeaveBalance   per leave type, per year
```

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Employee profiles complete for HR operations
- [ ] Employment status changes recorded with history
- [ ] Attendance recorded and reportable
- [ ] Leave requests routed to the correct approver
- [ ] Leave balances accurate and never negative
- [ ] Employees access only their own records
- [ ] HR dashboard reflecting real data
- [ ] Release v0.5.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md` |
| Phase overview | `academy/08-sprints/phase-02-erp-business-modules/phase-overview.md` |
| Depends on | Issue 019 (employees), Issue 021 (reporting hierarchy) |
| Approval logic generalized by | Sprint 10 - Workflow Engine |
| Release | v0.5.0 |
