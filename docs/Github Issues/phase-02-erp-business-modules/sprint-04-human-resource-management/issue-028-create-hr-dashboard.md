# [FEATURE] Create HR Dashboard

<!-- GitHub title: [FEATURE] Create HR Dashboard
     Labels: feature, hr, priority: medium
     Milestone: Sprint 04 - Human Resource Management
     Branch: feature/028-create-hr-dashboard
     Epic: Human Resource Management
     Depends on: 024, 025, 026
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [x] Medium
- [ ] High
- [ ] Critical

## Module: hr
## Sprint: Sprint 04 - Human Resource Management

---

## Summary

Build the HR dashboard: headcount, department distribution, attendance status, leave activity, and
pending approvals, presented as metrics HR can act on.

## Background

HR now holds employee, attendance, and leave data across separate tables. Answering "how many
people are off today?" currently means querying three of them by hand.

This is the first aggregation-heavy feature in the system, and the first place where query cost
becomes visible: counting attendance across an organization is a very different workload from
fetching one employee. The queries written here are among the first candidates for optimization in
Sprint 12 and are superseded by the reporting read models in Sprint 09.

Because of that, the aggregation logic should live in a dedicated service rather than being spread
across the existing HR services — so that Sprint 09 can replace it in one place.

The dashboard is also role-scoped: an HR Officer sees the organization, a Manager sees their team.
The same widget must return different data depending on who asks.

## User Story

As an HR Officer,
I want a dashboard showing workforce and leave activity at a glance,
So that I can spot issues without running manual queries across HR records.

## Acceptance Criteria

```gherkin
Given an authenticated HR Officer
When they open the HR dashboard
Then organization-wide metrics are displayed
```

```gherkin
Given an authenticated Manager
When they open the HR dashboard
Then metrics are scoped to their own team only
```

```gherkin
Given the dashboard displays total active employees
When the figure is compared against the employee list
Then the two agree exactly
```

```gherkin
Given a date range filter is applied
When the dashboard reloads
Then every time-based widget reflects the selected range
```

- [ ] `GET /api/hr/dashboard` returns dashboard metrics
- [ ] Total employees and active employees displayed
- [ ] Employees by department displayed
- [ ] Employees by employment status displayed
- [ ] Employees currently on leave displayed
- [ ] Today's attendance summary: present, absent, incomplete, late
- [ ] Pending leave requests count
- [ ] Leave utilization by leave type
- [ ] Upcoming probation confirmations
- [ ] Date range filter applied to all time-based widgets
- [ ] Metrics scoped by role: HR sees all, Manager sees their team
- [ ] Every figure reconciles with its source records
- [ ] Aggregation logic isolated in a dedicated service
- [ ] Loading, empty, and error states present
- [ ] Permissions declared and enforced
- [ ] Metric definitions documented

## Expected Result

HR Officers and Managers open one page and see the state of their workforce. Every number matches
what the underlying records say, and the same dashboard shows appropriately different data to
different roles.

---

## Scope

### Included

- Dashboard metrics endpoint
- Headcount, department, and status distribution
- Attendance summary
- Leave activity and utilization
- Pending approvals count
- Probation confirmation reminders
- Date range filtering
- Role-based scoping
- Dedicated aggregation service
- Frontend dashboard with charts
- Metric definition documentation

### Out of Scope

- Cross-module KPIs (Sprint 09, Issue 059)
- Executive dashboard (Sprint 09, Issue 060)
- Report export (Sprint 09, Issue 061)
- Scheduled report delivery (Sprint 09, Issue 062)
- Query optimization and caching (Sprint 12, Issues 076, 077)
- Headcount forecasting

## Technical Requirements

**Endpoint**

```text
GET /api/hr/dashboard?dateFrom=&dateTo=
```

**Metrics**

| Metric | Definition |
|--------|-----------|
| Total Employees | Count of all employee records excluding Terminated and Resigned |
| Active Employees | Count where status is Probation, Regular, or Contractual |
| Employees by Department | Grouped count of active employees |
| Employees by Status | Grouped count across all statuses |
| On Leave Today | Employees with an approved leave request covering today |
| Attendance Today | Counts of Present, Incomplete, Late, Absent for today |
| Pending Leave Requests | Count of leave requests with status Pending |
| Leave Utilization | Used days ÷ allocated days, per leave type, for the period |
| Probation Ending | Employees whose probation end date falls in the next 30 days |

Document each formula so Sprint 09 can reproduce the same figures in the reporting layer.

**Role scoping**

```text
HR Officer   → all employees
Manager      → employees where managerId resolves to them, at any depth
Employee     → no dashboard access
```

Scoping is applied in the query, not by filtering results after the fact.

**Structure**

```text
backend/src/modules/hr/dashboard/
├── hr-dashboard.controller.ts
└── hr-dashboard.service.ts      all aggregation lives here
```

Keeping aggregation in one service is deliberate: Sprint 09 replaces these queries with read
models, and Sprint 12 optimizes them. Both are far cheaper if they touch one file.

**Frontend**

```text
frontend/src/features/hr/dashboard/
```

Reuse the shared chart and stat components rather than creating HR-specific ones.

**Permissions to add**

```text
HR_DASHBOARD_READ_ALL
HR_DASHBOARD_READ_TEAM
```

## Dependencies

- Issue 024 — attendance data.
- Issue 025 — leave request data.
- Issue 026 — leave balance data.
- Issue 021 — reporting hierarchy, for manager scoping.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for each metric calculation
- [ ] Integration test confirming every metric reconciles with its source records
- [ ] Test confirming manager scoping returns only their own team
- [ ] Test confirming employees cannot access the dashboard
- [ ] Frontend component tests including loading and empty states
- [ ] Query cost measured and recorded for Sprint 12 reference
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and metric definitions updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md` § 7 |
| Epic | Human Resource Management |
| Superseded by | Issues 057, 059 (Sprint 09 reporting read models) |
| Optimized by | Issues 076, 077 (Sprint 12) |
| Pull Request | _to be linked_ |
