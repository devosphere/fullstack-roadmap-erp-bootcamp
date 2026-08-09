# [FEATURE] Implement Attendance Management

<!-- GitHub title: [FEATURE] Implement Attendance Management
     Labels: feature, hr, priority: high
     Milestone: Sprint 04 - Human Resource Management
     Branch: feature/024-implement-attendance-management
     Epic: Human Resource Management
     Depends on: 023
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
- [x] High
- [ ] Critical

## Module: hr
## Sprint: Sprint 04 - Human Resource Management

---

## Summary

Implement attendance recording: employees clock in and out, the system calculates worked hours and
flags exceptions, managers review their team, and HR reports on attendance.

## Background

Attendance is the highest-volume transaction in the HR module. Every employee creates a record
every working day — 200 employees produce roughly 50,000 rows a year. This is the first table in
the system that grows without bound, which makes indexing and query shape a real concern rather
than a theoretical one.

The calculation rules are where attendance modules usually go wrong. Worked hours seem trivial
until the edge cases arrive: a shift crossing midnight, a missing clock-out, a duplicate clock-in,
a correction entered three days later. Each of these must produce a defined outcome, not a
negative number or a crash.

Corrections need care too. Attendance affects payroll, so an edited record must keep the original
value alongside the correction and record who changed it.

## User Story

As an Employee,
I want to clock in and out and see my attendance history,
So that my working time is recorded accurately without paper timesheets.

## Acceptance Criteria

```gherkin
Given an eligible employee who has not yet clocked in today
When they clock in
Then an attendance record is created with the current timestamp
```

```gherkin
Given an employee who has already clocked in today
When they attempt to clock in again
Then the request is rejected with a clear message
```

```gherkin
Given an employee who clocked in but never clocked out
When the day ends
Then the record is flagged as incomplete rather than producing a worked-hours value
```

```gherkin
Given a shift that starts at 22:00 and ends at 06:00 the next day
When worked hours are calculated
Then the result is 8 hours, not a negative value
```

```gherkin
Given a suspended employee
When they attempt to clock in
Then the request is rejected
```

```gherkin
Given an HR Officer corrects an attendance record
When the correction is saved
Then the original values are retained alongside the correction and the editor is recorded
```

- [ ] `POST /api/attendance/clock-in` records a clock-in
- [ ] `POST /api/attendance/clock-out` records a clock-out
- [ ] `GET /api/attendance/me` returns the current employee's history
- [ ] `GET /api/attendance/today` returns today's status for the current employee
- [ ] `GET /api/attendance/team` returns the manager's team attendance
- [ ] `GET /api/attendance` returns all attendance for HR with filtering
- [ ] `PUT /api/attendance/{id}` allows an HR correction
- [ ] `GET /api/attendance/report` returns a summary report
- [ ] Duplicate clock-in for the same day rejected
- [ ] Clock-out without a clock-in rejected
- [ ] Worked hours calculated correctly, including overnight shifts
- [ ] Missing clock-out flagged as incomplete, not calculated
- [ ] Late arrival and early departure flagged against the work schedule
- [ ] Employment status eligibility enforced using the gate from Issue 023
- [ ] Corrections retain original values and record the editor
- [ ] Managers see only their own team's records
- [ ] Employees see only their own records
- [ ] Attendance table indexed for date-range and employee queries
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Employees record their working time reliably. The system produces correct worked hours including
edge cases, flags exceptions rather than guessing, and lets HR correct records without losing the
original.

---

## Scope

### Included

- Clock in and clock out endpoints
- Worked hours calculation including overnight handling
- Exception flagging: incomplete, late, early departure
- Employee, team, and HR views with scoped access
- HR correction with original value retention
- Attendance summary report
- Indexing for query performance
- Permission enforcement
- ERD update

### Out of Scope

- Leave requests and their effect on attendance (Issue 025)
- Overtime calculation and approval
- Shift scheduling and rotation
- Biometric or hardware device integration
- Payroll processing
- Self-service UI (Issue 027)

## Technical Requirements

**Endpoints**

```text
POST   /api/attendance/clock-in
POST   /api/attendance/clock-out
GET    /api/attendance/me
GET    /api/attendance/today
GET    /api/attendance/team
GET    /api/attendance
PUT    /api/attendance/{id}
GET    /api/attendance/report
```

**Schema**

```text
Attendance

id
employeeId        → Employee
attendanceDate
clockInAt
clockOutAt        nullable
workedMinutes     nullable, null while incomplete
status            enum: PRESENT | INCOMPLETE | LATE | EARLY_DEPARTURE | ABSENT
notes
originalClockInAt   nullable, set on correction
originalClockOutAt  nullable, set on correction
correctedBy       → User, nullable
correctedAt       nullable
createdAt
updatedAt
```

**Calculation rules**

```text
Both timestamps present    → workedMinutes = clockOut - clockIn
Clock-out before clock-in  → treat as overnight, add 24 hours
Clock-out missing          → status = INCOMPLETE, workedMinutes = null
Difference > 16 hours      → flag for HR review, do not auto-calculate
```

Never store a negative `workedMinutes`. If the calculation would be negative, the record is an
exception, not a number.

**Indexes**

```text
(employeeId, attendanceDate)   unique — one record per employee per day
(attendanceDate)               for daily and range reports
(employeeId)                   for employee history
```

The unique constraint is what enforces duplicate clock-in prevention at the database level, not
only in application code.

**Access scoping**

| Role | Sees |
|------|------|
| Employee | Own records only |
| Manager | Own team, resolved from the reporting hierarchy |
| HR Officer | All records |

**Permissions to add**

```text
ATTENDANCE_RECORD
ATTENDANCE_READ_OWN
ATTENDANCE_READ_TEAM
ATTENDANCE_READ_ALL
ATTENDANCE_CORRECT
```

## Dependencies

- Issue 023 — the employment status eligibility gate.
- Issue 021 — the reporting hierarchy, for team scoping.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for worked hours including overnight, missing clock-out, and excessive duration
- [ ] Unit tests for duplicate prevention and eligibility gating
- [ ] Integration tests for all endpoints
- [ ] Tests confirming employees cannot read other employees' attendance
- [ ] Test confirming corrections retain original values
- [ ] Query performance verified on a seeded dataset representing one year
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md` § 3 |
| Epic | Human Resource Management |
| Performance reviewed in | Sprint 12 (Issue 076) |
| Pull Request | _to be linked_ |
