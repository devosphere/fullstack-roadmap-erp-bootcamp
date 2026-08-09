# [FEATURE] Implement Inventory Adjustment

<!-- GitHub title: [FEATURE] Implement Inventory Adjustment
     Labels: feature, inventory, priority: high
     Milestone: Sprint 05 - Inventory Management
     Branch: feature/034-implement-inventory-adjustment
     Epic: Inventory Management
     Depends on: 033
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

## Module: inventory
## Sprint: Sprint 05 - Inventory Management

---

## Summary

Implement inventory adjustments and stock counts: correct recorded stock to match physical reality,
with a mandatory reason, an approval step, and a full audit trail.

## Background

Recorded stock and physical stock always diverge eventually — breakage, theft, miscounts,
unrecorded samples. Adjustment is how the system is told the truth.

It is also the only place where a user can change stock without a business document behind it,
which makes it the obvious route for concealing a loss. Every ERP system therefore treats
adjustment as a **controlled** operation rather than an edit:

```text
Reason mandatory       an adjustment without a cause is not an explanation

Approval required      the person counting is not the person approving

Fully audited          who, when, from what, to what, and why
```

The adjustment itself changes nothing directly. It records a movement through Issue 033, which is
what keeps the ledger complete — an adjusted balance is still explicable from movement history.

## User Story

As an Inventory Manager,
I want to correct stock levels after a physical count with a documented reason and approval,
So that recorded stock matches reality without allowing untraceable changes.

## Acceptance Criteria

```gherkin
Given a product with a recorded quantity of 100 and a counted quantity of 94
When an adjustment is created
Then the variance is calculated as -6 and the adjustment is created with status Pending
```

```gherkin
Given a pending adjustment
When it is created without a reason
Then the request is rejected
```

```gherkin
Given a pending adjustment
When the person who created it attempts to approve it
Then the request is rejected
```

```gherkin
Given a pending adjustment is approved
When the approval completes
Then a stock movement is recorded and the balance changes, both or neither
```

```gherkin
Given an approved adjustment
When a user attempts to edit or delete it
Then the request is rejected
```

```gherkin
Given a stock count covering many products
When it is submitted
Then one adjustment is created per product with a non-zero variance
```

- [ ] `POST /api/inventory/adjustments` creates an adjustment
- [ ] `GET /api/inventory/adjustments` lists adjustments with filtering
- [ ] `GET /api/inventory/adjustments/{id}` returns an adjustment
- [ ] `POST /api/inventory/adjustments/{id}/approve` approves and applies it
- [ ] `POST /api/inventory/adjustments/{id}/reject` rejects it with a required reason
- [ ] `POST /api/inventory/stock-counts` submits a multi-product stock count
- [ ] `GET /api/inventory/adjustments/report` returns a variance report
- [ ] Reason required and selected from a defined reason list
- [ ] Variance calculated automatically from recorded and counted quantities
- [ ] Adjustments with zero variance are not created
- [ ] Self-approval blocked
- [ ] Approval applies the change via the stock movement service
- [ ] Approval and balance change occur in one transaction
- [ ] Approved adjustments are immutable
- [ ] Rejection leaves stock unchanged
- [ ] Adjustments never bypass the movement ledger
- [ ] Negative resulting balance rejected
- [ ] All actions recorded with user, timestamp, and comment
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Stock can be corrected to match physical reality, but only with a documented reason and a second
person's approval. Every correction remains visible in the movement history.

---

## Scope

### Included

- Adjustment creation with variance calculation
- Mandatory reason from a defined list
- Approval and rejection with segregation of duties
- Application via the stock movement service
- Multi-product stock count submission
- Variance reporting
- Immutability after approval
- Audit trail
- Permission enforcement
- ERD update

### Out of Scope

- Cycle counting schedules and automation
- Financial impact of write-offs (Sprint 08)
- Configurable multi-step approval routing (Sprint 10, Issue 064)
- Notification of pending approvals (Sprint 10, Issue 066)
- Barcode scanning during counts

## Technical Requirements

**Endpoints**

```text
POST   /api/inventory/adjustments
GET    /api/inventory/adjustments
GET    /api/inventory/adjustments/{id}
POST   /api/inventory/adjustments/{id}/approve
POST   /api/inventory/adjustments/{id}/reject
POST   /api/inventory/stock-counts
GET    /api/inventory/adjustments/report
```

**Schema**

```text
InventoryAdjustment

id
adjustmentNumber     unique
productId            → Product
warehouseId          → Warehouse
recordedQuantity     balance at time of creation
countedQuantity
varianceQuantity     counted - recorded
reasonCode           enum
notes
status               enum: PENDING | APPROVED | REJECTED
createdBy            → User
approvedBy           → User, nullable
decidedAt            nullable
decisionComment      nullable
stockMovementId      → StockMovement, nullable, set on approval
createdAt
```

**Reason codes**

```text
PHYSICAL_COUNT
DAMAGE
EXPIRY
THEFT_OR_LOSS
SAMPLE_OR_PROMOTION
DATA_ENTRY_CORRECTION
OTHER
```

`OTHER` requires notes. A free-text-only reason field would defeat variance reporting.

**Approval transaction**

Approval performs all of these, or none:

```text
1. Set status to APPROVED
2. Record a movement via the Issue 033 service (direction from variance sign)
3. Store the resulting stockMovementId on the adjustment
```

If the movement would make the balance negative, the whole approval fails and the adjustment stays
`PENDING`.

**Segregation of duties**

```text
createdBy != approvedBy
```

Enforced server-side. This is the control that makes the approval meaningful.

**Stock count**

A stock count submits many product-quantity pairs for one warehouse. The service creates one
adjustment per product where `countedQuantity != recordedQuantity`, and skips the rest — a count
that matches is not a correction.

**Permissions to add**

```text
INVENTORY_ADJUSTMENT_CREATE
INVENTORY_ADJUSTMENT_READ
INVENTORY_ADJUSTMENT_APPROVE
STOCK_COUNT_SUBMIT
```

Grant `INVENTORY_ADJUSTMENT_APPROVE` to a different role than `INVENTORY_ADJUSTMENT_CREATE`.

## Dependencies

- Issue 033 — the stock movement service applies the change.
- Issue 032 — the inventory balance.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for variance calculation including positive and negative cases
- [ ] Unit test confirming zero-variance adjustments are not created
- [ ] Test confirming self-approval is blocked
- [ ] Test confirming reason is mandatory and `OTHER` requires notes
- [ ] **Atomicity test**: a failed movement leaves the adjustment pending and stock unchanged
- [ ] Test confirming approved adjustments cannot be modified
- [ ] Test confirming the balance still reconciles with movement history after adjustment
- [ ] Integration tests for all endpoints including stock count submission
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md` § 6 |
| Epic | Inventory Management |
| Applies changes via | Issue 033 (stock movement) |
| Approval generalized by | Issue 064 (Sprint 10) |
| Pull Request | _to be linked_ |
