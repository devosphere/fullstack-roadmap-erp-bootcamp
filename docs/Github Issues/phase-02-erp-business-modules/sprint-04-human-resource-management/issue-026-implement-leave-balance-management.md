# [FEATURE] Implement Leave Balance Management

<!-- GitHub title: [FEATURE] Implement Leave Balance Management
     Labels: feature, hr, priority: critical
     Milestone: Sprint 04 - Human Resource Management
     Branch: feature/026-implement-leave-balance-management
     Epic: Human Resource Management
     Depends on: 023
     Blocks: 025
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

## Module: hr
## Sprint: Sprint 04 - Human Resource Management

---

## Summary

Track leave credits per employee, per leave type, per year: allocation, accrual, usage, and
remaining balance, with a complete transaction history explaining how each balance was reached.

## Background

A balance stored as a single number is unauditable. When an employee asks "why do I have 11 days
and not 12?", a number cannot answer.

The fix is the same pattern used by the general ledger in Sprint 08: the balance is **derived from
a transaction history**, not stored as a mutable figure. Every allocation, deduction, restoration,
and adjustment is a row. The balance is their sum.

This costs a little more to implement and removes an entire class of "the balance is wrong and
nobody knows why" support problems.

The balance must also never go negative. That is enforced here, at the point of deduction, rather
than trusted to the caller — because in Sprint 10 the caller changes.

## User Story

As an Employee,
I want to see my leave balance and how it was calculated,
So that I know how many days I have available and why.

## Acceptance Criteria

```gherkin
Given an employee with an annual leave allocation of 15 days and 4 days used
When they view their leave balance
Then it shows 15 allocated, 4 used, and 11 remaining
```

```gherkin
Given an employee with a remaining balance of 2 days
When a deduction of 3 days is attempted
Then the deduction is rejected and the balance remains 2
```

```gherkin
Given an employee viewing their balance
When they open the transaction history
Then every allocation, deduction, and adjustment is listed with its date, reason, and source
```

```gherkin
Given a new leave year begins
When balances are initialized
Then each employee receives their configured allocation and the previous year's balance is retained separately
```

- [ ] `GET /api/leave/balances/me` returns the current employee's balances
- [ ] `GET /api/leave/balances/{employeeId}` returns an employee's balances
- [ ] `GET /api/leave/balances/{employeeId}/transactions` returns the transaction history
- [ ] `POST /api/leave/balances/allocate` allocates credits to an employee
- [ ] `POST /api/leave/balances/adjust` applies a manual adjustment with a required reason
- [ ] `POST /api/leave/balances/initialize-year` initializes balances for a leave year
- [ ] Balance tracked per employee, per leave type, per leave year
- [ ] Balance derived from transactions, not stored as a mutable figure
- [ ] Allocated, used, and remaining values all available
- [ ] Deduction rejected when it would make the balance negative
- [ ] Deduction and restoration exposed as service methods for Issue 025
- [ ] Manual adjustments require a reason and record the author
- [ ] Transaction history is append-only
- [ ] Pro-rated allocation for employees hired mid-year
- [ ] Carry-over configurable per leave type with a maximum
- [ ] Employees see only their own balances
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Every employee has an accurate leave balance per type and year, and can see exactly how it was
reached. A balance can never be negative, and no change to it is untraceable.

---

## Scope

### Included

- Balance retrieval per employee and leave type
- Transaction-based balance derivation
- Allocation and year initialization
- Pro-rated allocation for mid-year hires
- Manual adjustment with required reason
- Deduction and restoration service methods
- Negative balance prevention
- Carry-over configuration
- Transaction history endpoint
- Permission enforcement
- ERD update

### Out of Scope

- Leave requests and approval (Issue 025)
- Self-service balance UI (Issue 027)
- Leave encashment and payout
- Monthly accrual scheduling as a background job (Sprint 10, Issue 062 provides the scheduler)
- Payroll integration

## Technical Requirements

**Endpoints**

```text
GET    /api/leave/balances/me
GET    /api/leave/balances/{employeeId}
GET    /api/leave/balances/{employeeId}/transactions
POST   /api/leave/balances/allocate
POST   /api/leave/balances/adjust
POST   /api/leave/balances/initialize-year
```

**Schema**

```text
LeaveBalance

id
employeeId         → Employee
leaveTypeId        → LeaveType
leaveYear
allocatedDays
usedDays
carriedOverDays
remainingDays      derived
updatedAt

unique (employeeId, leaveTypeId, leaveYear)

LeaveBalanceTransaction

id
leaveBalanceId     → LeaveBalance
transactionType    enum: ALLOCATION | DEDUCTION | RESTORATION | ADJUSTMENT | CARRY_OVER
days               positive for credit, negative for debit
reason
sourceType         nullable, e.g. LEAVE_REQUEST
sourceId           nullable
createdBy          → User
createdAt
```

**Balance derivation**

```text
remainingDays = SUM(LeaveBalanceTransaction.days) for that balance

allocatedDays  = SUM of ALLOCATION + CARRY_OVER
usedDays       = ABS(SUM of DEDUCTION + RESTORATION)
```

The `LeaveBalance` row caches these for query speed, but the transactions are authoritative. A
reconciliation check should be able to recompute the cached values and find them equal.

**Service interface for Issue 025**

```text
deduct(employeeId, leaveTypeId, days, sourceType, sourceId)
    → rejects if it would make the balance negative
    → writes a DEDUCTION transaction
    → must be callable inside the caller's transaction

restore(employeeId, leaveTypeId, days, sourceType, sourceId)
    → writes a RESTORATION transaction
```

Both must participate in the caller's database transaction so Issue 025's approval is atomic.

**Pro-rated allocation**

```text
Employee hired in month M of a 12-month leave year

allocation = annualAllocation × (12 - M + 1) / 12, rounded per policy
```

**Permissions to add**

```text
LEAVE_BALANCE_READ_OWN
LEAVE_BALANCE_READ_ALL
LEAVE_BALANCE_ALLOCATE
LEAVE_BALANCE_ADJUST
```

## Dependencies

- Issue 023 — employment status determines eligibility for allocation.
- Issue 019 — employee records.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for balance derivation from transactions
- [ ] Unit tests for negative balance prevention
- [ ] Unit tests for pro-rated allocation
- [ ] Test confirming cached balance equals the recomputed transaction sum
- [ ] Test confirming deduction participates in a caller transaction and rolls back correctly
- [ ] Test confirming transaction history cannot be modified
- [ ] Tests confirming employees cannot read other employees' balances
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md` § 5 |
| Epic | Human Resource Management |
| Consumed by | Issue 025 (leave requests) |
| Same pattern as | Issue 052 (general ledger, Sprint 08) |
| Pull Request | _to be linked_ |
