# [FEATURE] Create Purchase Requisition Module

<!-- GitHub title: [FEATURE] Create Purchase Requisition Module
     Labels: feature, procurement, priority: high
     Milestone: Sprint 07 - Purchasing Management
     Branch: feature/044-create-purchase-requisition-module
     Epic: Purchasing Management
     Depends on: 019, 029
     Blocks: 045
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

## Module: procurement
## Sprint: Sprint 07 - Purchasing Management

---

## Summary

Create purchase requisitions: internal multi-line requests for goods, raised by employees against
their department, submitted for approval and locked once submitted.

## Background

A requisition states *what is needed*, not *who will supply it*. That separation is the whole point.

The person who needs a laptop knows they need a laptop. They do not know which supplier offers the
best terms, and they should not be choosing. Procurement makes that decision later, in Issue 046.
Collapsing the two — letting requesters pick suppliers — removes the buyer's leverage and the
organization's spend control.

The other defining rule is **submission locks the document**. Once a requisition enters approval, it
cannot be edited. Without that lock, an approved requisition for two laptops can be quietly edited
to twenty after approval, and the approval means nothing.

Requisitions carry an estimated value rather than a price. The real price is negotiated with the
supplier. The estimate exists so approval routing in Issue 045 knows which authority level applies.

## User Story

As an Employee,
I want to request goods I need for my work,
So that procurement can source them through the proper approval and purchasing process.

## Acceptance Criteria

```gherkin
Given an authenticated employee
When they create a requisition with product lines and a required date
Then the requisition is created with status Draft
```

```gherkin
Given a draft requisition
When it is submitted
Then its status becomes Submitted and it can no longer be edited
```

```gherkin
Given a submitted requisition
When the requester attempts to edit its lines
Then the request is rejected
```

```gherkin
Given a requisition with a required date in the past
When it is submitted
Then the request is rejected
```

```gherkin
Given an employee viewing their requisitions
When the list loads
Then they see only their own requisitions
```

```gherkin
Given a requisition with three lines
When the estimated total is calculated
Then it equals the sum of the line estimates
```

- [ ] `GET /api/procurement/requisitions` lists requisitions with filtering
- [ ] `POST /api/procurement/requisitions` creates a draft requisition
- [ ] `GET /api/procurement/requisitions/{id}` returns a requisition with lines
- [ ] `PUT /api/procurement/requisitions/{id}` updates a draft requisition
- [ ] `POST /api/procurement/requisitions/{id}/submit` submits for approval
- [ ] `POST /api/procurement/requisitions/{id}/cancel` cancels a requisition
- [ ] `GET /api/procurement/requisitions/me` lists the requester's own requisitions
- [ ] Requisition number generated automatically and unique
- [ ] Requester resolved from the authenticated user's employee record
- [ ] Department resolved from the requester's employee record
- [ ] Multiple product lines with add, edit, and remove while draft
- [ ] Required quantity and required date per line
- [ ] Estimated unit cost and line estimate captured
- [ ] Estimated total calculated as the sum of line estimates
- [ ] Required date cannot be in the past
- [ ] Only Draft requisitions are editable
- [ ] Submission locks the document
- [ ] Status transitions enforced
- [ ] Employees see only their own requisitions; procurement sees all
- [ ] Deactivated products rejected
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Employees request what they need without choosing suppliers or prices. Once submitted, the document
is fixed, so the approval in Issue 045 applies to exactly what was reviewed.

---

## Scope

### Included

- Requisition CRUD with lines
- Automatic document numbering
- Requester and department resolution from the employee record
- Estimated cost capture and total calculation
- Required date validation
- Submission locking
- Status lifecycle and transition enforcement
- Access scoping
- Permission enforcement
- ERD update

### Out of Scope

- Approval routing and decisions (Issue 045)
- Purchase orders (Issue 046)
- Supplier selection — deliberately not the requester's decision
- Budget checking against department budgets
- Requisition templates and reordering
- Notification of submission (Sprint 10, Issue 066)

## Technical Requirements

**Endpoints**

```text
GET    /api/procurement/requisitions
POST   /api/procurement/requisitions
GET    /api/procurement/requisitions/{id}
PUT    /api/procurement/requisitions/{id}
POST   /api/procurement/requisitions/{id}/submit
POST   /api/procurement/requisitions/{id}/cancel
GET    /api/procurement/requisitions/me
```

**Schema**

```text
PurchaseRequisition

id
requisitionNumber        unique
requestedBy              → Employee
departmentId             → Department
requisitionDate
requiredDate
justification
status                   enum
totalEstimatedAmount     decimal
submittedAt              nullable
createdAt
updatedAt

PurchaseRequisitionLine

id
requisitionId            → PurchaseRequisition
productId                → Product
quantity
estimatedUnitCost        decimal
lineEstimate             decimal
notes
lineNumber
```

**Status flow**

```text
DRAFT → SUBMITTED → APPROVED → CONVERTED

DRAFT     → SUBMITTED → REJECTED
DRAFT     → CANCELLED
SUBMITTED → CANCELLED     only by the requester, before a decision
```

`APPROVED` and `REJECTED` are set by Issue 045, not by this issue. `CONVERTED` is set by Issue 046.

**Requester resolution**

```text
Authenticated User

    ↓  via the link from Issue 020

Employee

    ↓

Employee.departmentId
```

The requester is never supplied in the request body. A user with no linked employee record cannot
raise a requisition, and the error should say so clearly.

**Submission lock**

Once `status != DRAFT`, no field may be updated. Enforce in the service layer and test it directly —
this is the control that makes approval meaningful.

**Document numbering**

```text
PR-YYYY-NNNNN        e.g. PR-2026-00128
```

Generated server-side with a sequence or locked counter.

**Estimated cost**

The estimate exists so Issue 045 can route by value. It is not a commitment and is replaced by the
negotiated price in Issue 046. Document this so the two figures are not mistaken for a discrepancy.

**Permissions to add**

```text
PURCHASE_REQUISITION_CREATE
PURCHASE_REQUISITION_READ_OWN
PURCHASE_REQUISITION_READ_ALL
```

Grant `PURCHASE_REQUISITION_CREATE` broadly — any employee may need to request goods.

## Dependencies

- Issue 019 — employee records.
- Issue 020 — the user-to-employee link, for requester resolution.
- Issue 029 — products.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for total calculation and required date validation
- [ ] Unit tests for every valid and invalid status transition
- [ ] Test confirming submission locks the document against all field updates
- [ ] Test confirming the requester cannot be supplied in the request body
- [ ] Test confirming a user without a linked employee cannot raise a requisition
- [ ] Test confirming employees see only their own requisitions
- [ ] Test confirming concurrent document numbering produces no duplicates
- [ ] Integration tests for all endpoints
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md` § 2 |
| Epic | Purchasing Management |
| Approved by | Issue 045 |
| Converted by | Issue 046 |
| Pull Request | _to be linked_ |
