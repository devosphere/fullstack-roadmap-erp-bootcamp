# [FEATURE] Create Purchase Order Module

<!-- GitHub title: [FEATURE] Create Purchase Order Module
     Labels: feature, procurement, priority: critical
     Milestone: Sprint 07 - Purchasing Management
     Branch: feature/046-create-purchase-order-module
     Epic: Purchasing Management
     Depends on: 043, 045
     Blocks: 047
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

## Module: procurement
## Sprint: Sprint 07 - Purchasing Management

---

## Summary

Create purchase orders: formal commitments to a supplier, created only from an approved
requisition, with negotiated prices, automatic numbering, and an enforced status lifecycle.

## Background

This is where the requisition's estimate becomes a real commitment. Issue 044 deliberately kept
requester and supplier apart; this issue is where procurement chooses the supplier and negotiates
the actual price.

The rule that matters most: **a purchase order can only be created from an approved requisition.**
Allowing a direct purchase order would bypass the entire approval chain built in Issue 045 — the
control would exist on paper and not in practice.

The second rule: **ordered quantity cannot exceed the approved requisition quantity.** The approval
covered a specific quantity at a specific estimated value. A purchase order for more than that is a
different transaction that was never approved.

Once issued, a purchase order is not editable — the same reasoning as the sales order in Issue 039.
A commitment that can be silently changed after the supplier has it is not a commitment.

## User Story

As a Procurement Officer,
I want to create purchase orders from approved requisitions,
So that formal, traceable commitments are issued to suppliers within what was actually approved.

## Acceptance Criteria

```gherkin
Given an approved requisition
When a purchase order is created from it
Then the order is created in Draft status linked to the requisition
```

```gherkin
Given a requisition that has not been approved
When a user attempts to create a purchase order from it
Then the request is rejected
```

```gherkin
Given a requisition line for 100 units
When a purchase order line is created for 150 units against it
Then the request is rejected
```

```gherkin
Given a draft purchase order
When it is issued
Then its status becomes Issued and it can no longer be edited
```

```gherkin
Given an issued purchase order with no receipts
When it is cancelled
Then its status becomes Cancelled
```

```gherkin
Given an issued purchase order with at least one goods receipt
When a user attempts to cancel it
Then the request is rejected
```

- [ ] `GET /api/procurement/orders` lists purchase orders with filtering
- [ ] `POST /api/procurement/orders` creates a draft order from an approved requisition
- [ ] `GET /api/procurement/orders/{id}` returns an order with lines
- [ ] `PUT /api/procurement/orders/{id}` updates a draft order
- [ ] `POST /api/procurement/orders/{id}/issue` issues the order
- [ ] `POST /api/procurement/orders/{id}/cancel` cancels the order
- [ ] `GET /api/suppliers/{id}/orders` lists a supplier's orders
- [ ] Document number generated automatically and unique
- [ ] Order can only be created from an APPROVED requisition
- [ ] Order lines derived from requisition lines
- [ ] Ordered quantity per line cannot exceed the approved requisition quantity
- [ ] Negotiated unit price entered per line, distinct from the requisition estimate
- [ ] Line and document totals calculated and stored
- [ ] Only Draft orders are editable
- [ ] Issued orders cannot be edited, only cancelled
- [ ] Orders with receipts cannot be cancelled
- [ ] Status transitions enforced
- [ ] Requisition marked as Converted once its order is created
- [ ] A requisition can produce a purchase order only once
- [ ] Deactivated suppliers rejected
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Purchase orders exist only for what was approved, at a price procurement negotiated, and cannot be
altered after issue. The chain from requisition to order to supplier is fully traceable.

---

## Scope

### Included

- Purchase order CRUD with lines
- Automatic document numbering
- Creation restricted to approved requisitions
- Requisition quantity ceiling enforcement
- Negotiated price capture
- Total calculation
- Status lifecycle and transition enforcement
- Requisition-to-order linkage and one-time conversion
- Cancellation guards
- Permission enforcement
- ERD update

### Out of Scope

- Goods receipt and inventory replenishment (Issue 047)
- Supplier invoice matching (Issue 048)
- Procurement dashboard (Issue 049)
- Multi-supplier splitting of one requisition
- Blanket and standing purchase orders
- Currency conversion
- Accounts payable (Sprint 08, Issue 054)

## Technical Requirements

**Endpoints**

```text
GET    /api/procurement/orders
POST   /api/procurement/orders
GET    /api/procurement/orders/{id}
PUT    /api/procurement/orders/{id}
POST   /api/procurement/orders/{id}/issue
POST   /api/procurement/orders/{id}/cancel
GET    /api/suppliers/{id}/orders
```

**Schema**

```text
PurchaseOrder

id
orderNumber          unique
supplierId           → Supplier
requisitionId        → PurchaseRequisition, unique
orderDate
expectedDate
status               enum
subtotal             decimal
totalAmount          decimal
notes
createdBy            → User
issuedBy             → User, nullable
issuedAt             nullable
createdAt
updatedAt

PurchaseOrderLine

id
purchaseOrderId      → PurchaseOrder
requisitionLineId    → PurchaseRequisitionLine
productId            → Product
quantity
unitPrice            decimal, negotiated price
lineTotal            decimal
receivedQuantity     integer, default 0
lineNumber
```

The unique constraint on `requisitionId` is what enforces one-time conversion — enforced by the
database, the same pattern as the quotation-to-order guard in Issue 038.

**Status flow**

```text
DRAFT → ISSUED → PARTIALLY_RECEIVED → RECEIVED → INVOICED → CLOSED

DRAFT  → CANCELLED
ISSUED → CANCELLED     only when no receipts exist
```

**Creation validation**

```text
1. Verify requisition.status == APPROVED
2. Verify no purchase order already references this requisition
3. For each order line, verify quantity <= corresponding requisition line quantity
4. Create the order and its lines
5. Set requisition.status = CONVERTED
```

All in one transaction.

**Document numbering**

```text
PO-YYYY-NNNNN        e.g. PO-2026-00203
```

Generated server-side with a sequence or locked counter, never by counting rows.

**Price distinction**

`PurchaseOrderLine.unitPrice` is the negotiated price; `PurchaseRequisitionLine.estimatedUnitCost`
is the estimate that drove approval routing. The two are expected to differ and both are retained —
one explains what was authorized, the other what was committed.

**Permissions to add**

```text
PURCHASE_ORDER_READ
PURCHASE_ORDER_CREATE
PURCHASE_ORDER_UPDATE
PURCHASE_ORDER_ISSUE
PURCHASE_ORDER_CANCEL
```

## Dependencies

- Issue 043 — suppliers must exist.
- Issue 045 — an approved requisition to convert.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for total calculation
- [ ] Unit tests for every valid and invalid status transition
- [ ] Test confirming creation from a non-approved requisition is rejected
- [ ] Test confirming ordered quantity cannot exceed the requisition quantity, per line
- [ ] Test confirming a requisition can convert to a purchase order only once, including under concurrency
- [ ] Test confirming orders with receipts cannot be cancelled
- [ ] Test confirming issued orders reject every field update
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md` § 4 |
| Epic | Purchasing Management |
| Created from | Issue 045 (approved requisitions) |
| Fulfilled by | Issue 047 |
| Same document pattern as | Issue 039 (sales order) |
| Pull Request | _to be linked_ |
