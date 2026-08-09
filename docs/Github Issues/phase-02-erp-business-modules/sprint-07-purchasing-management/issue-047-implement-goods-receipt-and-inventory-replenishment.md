# [FEATURE] Implement Goods Receipt and Inventory Replenishment

<!-- GitHub title: [FEATURE] Implement Goods Receipt and Inventory Replenishment
     Labels: feature, procurement, inventory, priority: critical
     Milestone: Sprint 07 - Purchasing Management
     Branch: feature/047-implement-goods-receipt-and-inventory-replenishment
     Epic: Purchasing Management
     Depends on: 033, 046
     Blocks: 048
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

Implement goods receipt: record goods arriving against an issued purchase order, increase inventory
through the stock movement service, reject damaged quantities, and advance the order's fulfillment
status.

## Background

This is the exact mirror of Issue 040. Where a sales delivery decreases stock, a goods receipt
increases it — and it must go through the **same** movement service built in Issue 033, for the
same reason: if sales and purchasing each invent their own way to touch
`Inventory.quantityOnHand`, the stock ledger stops reconciling and nobody can tell which path is
wrong.

A receipt does four things as one unit:

```text
1. Create the receipt record
2. Record a Stock In movement          (Issue 033 service)
3. Update the order line's received quantity and the order status
4. Track accepted versus rejected quantity separately
```

Rejected quantity is the one detail this issue adds beyond Issue 040's pattern: goods can arrive
damaged. A damaged unit was delivered but must not increase sellable stock. Recording it separately
— rather than simply not counting it — keeps the receipt document honest about what physically
arrived, which matters for the three-way match in Issue 048 and for supplier performance
conversations that are out of scope here but will want this data later.

Partial receipt is the normal case. Suppliers ship in batches; a purchase order for 500 units might
arrive as three separate receipts.

## User Story

As a Warehouse Supervisor,
I want to record goods received against purchase orders,
So that received stock increases inventory accurately and damaged goods are excluded.

## Acceptance Criteria

```gherkin
Given an issued purchase order for 100 units with none yet received
When a receipt of 60 units is recorded, all accepted
Then stock increases by 60 and the order status becomes Partially Received
```

```gherkin
Given a purchase order line for 100 units with 60 already received
When a receipt of 40 units is recorded
Then the order status becomes Received
```

```gherkin
Given a purchase order line for 100 units with 60 already received
When a receipt of 50 units is attempted
Then the request is rejected because it would exceed the ordered quantity
```

```gherkin
Given a receipt of 50 units where 5 are recorded as damaged
When the receipt is saved
Then stock increases by 45, not 50
```

```gherkin
Given a receipt where the stock movement fails
When the transaction completes
Then no receipt record exists and stock is unchanged
```

```gherkin
Given a purchase order with status Draft
When a receipt is attempted
Then the request is rejected because only issued orders can be received against
```

- [ ] `POST /api/procurement/receipts` creates a receipt from a purchase order
- [ ] `GET /api/procurement/receipts` lists receipts with filtering
- [ ] `GET /api/procurement/receipts/{id}` returns a receipt with lines
- [ ] `GET /api/procurement/orders/{id}/receipts` lists an order's receipts
- [ ] Receipt number generated automatically and unique
- [ ] Only Issued or Partially Received orders can be received against
- [ ] Receipt lines reference purchase order lines
- [ ] Received quantity cannot exceed the remaining ordered quantity
- [ ] Accepted and rejected quantities recorded separately per line
- [ ] Only accepted quantity increases inventory
- [ ] Stock increased through the Issue 033 movement service, never directly
- [ ] Receipt, movement, and status update are one transaction
- [ ] Partial receipt supported across multiple receipts
- [ ] Order status advances to Partially Received or Received automatically
- [ ] Every movement records the receipt as its source document
- [ ] Stock balance still reconciles with movement history after receipt
- [ ] Receiving warehouse recorded
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Receiving goods increases stock exactly once and excludes damaged units. Every stock increase from
purchasing is traceable to a receipt, and it never diverges from what sales does through the same
ledger.

---

## Scope

### Included

- Goods receipt creation from a purchase order
- Receipt lines referencing order lines
- Accepted and rejected quantity tracking
- Over-receipt prevention
- Stock increase via the movement service, accepted quantity only
- Atomic transaction across receipt, movement, and status update
- Partial receipt across multiple receipts
- Automatic order status advancement
- Receiving warehouse capture
- Permission enforcement
- ERD update

### Out of Scope

- Supplier invoice matching (Issue 048)
- Procurement dashboard (Issue 049)
- Quality inspection workflows
- Returns to supplier for rejected quantities
- Serial and batch number capture
- Receipt cancellation and reversal (the same pattern as Issue 040's cancellation can be added as a follow-up if needed)

## Technical Requirements

**Endpoints**

```text
POST   /api/procurement/receipts
GET    /api/procurement/receipts
GET    /api/procurement/receipts/{id}
GET    /api/procurement/orders/{id}/receipts
```

**Schema**

```text
GoodsReceipt

id
receiptNumber        unique
purchaseOrderId      → PurchaseOrder
warehouseId          → Warehouse
receiptDate
notes
receivedBy           → User
createdAt

GoodsReceiptLine

id
receiptId            → GoodsReceipt
purchaseOrderLineId  → PurchaseOrderLine
productId            → Product
acceptedQuantity
rejectedQuantity
rejectionReason       nullable, required when rejectedQuantity > 0
stockMovementId       → StockMovement, nullable — set only when acceptedQuantity > 0
lineNumber
```

**The receipt transaction**

```text
BEGIN

  1. Validate order status is ISSUED or PARTIALLY_RECEIVED
  2. For each line:
       a. Validate (acceptedQuantity + rejectedQuantity) <=
                    (orderLine.quantity - orderLine.receivedQuantity)
       b. If acceptedQuantity > 0:
            recordStockIn(...) via the Issue 033 service, referencing this receipt
       c. Increment orderLine.receivedQuantity by (acceptedQuantity + rejectedQuantity)
  3. Insert GoodsReceipt and GoodsReceiptLine rows
  4. Recalculate and set the order status

COMMIT
```

`receivedQuantity` on the order line tracks total quantity accounted for — accepted plus rejected —
because a rejected unit was still delivered against the order and should not be requested again as
if it never arrived. Only the accepted portion moves through inventory.

**Order status recalculation**

```text
All lines fully accounted for (received + rejected)   → RECEIVED
Some quantity accounted for, not all                   → PARTIALLY_RECEIVED
Nothing yet                                             → ISSUED
```

Derived from line quantities, matching the pattern in Issue 040.

**Over-receipt**

```text
remaining = orderLine.quantity - orderLine.receivedQuantity

reject if (acceptedQuantity + rejectedQuantity) > remaining
```

Checked inside the transaction so concurrent receipts against the same line cannot both pass.

**Rejected quantity**

`rejectionReason` is required whenever `rejectedQuantity > 0`. Rejected units do not generate a
stock movement — they were never usable inventory.

**Permissions to add**

```text
GOODS_RECEIPT_CREATE
GOODS_RECEIPT_READ
```

## Dependencies

- Issue 046 — issued purchase orders.
- Issue 033 — the stock movement service, which must accept an external transaction.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for over-receipt prevention and status recalculation
- [ ] **Atomicity test**: a failing stock movement leaves no receipt record and unchanged stock
- [ ] Test confirming rejected quantity never generates a stock movement
- [ ] Test confirming rejection reason is required when rejectedQuantity > 0
- [ ] Test confirming partial receipts accumulate correctly across multiple receipts
- [ ] Test confirming stock is never written outside the movement service
- [ ] **Reconciliation test**: stock balance equals movement history sum after a receipt sequence
- [ ] Concurrency test: two simultaneous receipts against one order line cannot over-receive
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md` § 5 |
| Epic | Purchasing Management |
| Uses | Issue 033 (stock movement) |
| Mirror operation | Issue 040 (sales delivery) |
| Matched by | Issue 048 |
| Pull Request | _to be linked_ |
