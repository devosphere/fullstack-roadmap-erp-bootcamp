# [FEATURE] Implement Order Fulfillment and Inventory Deduction

<!-- GitHub title: [FEATURE] Implement Order Fulfillment and Inventory Deduction
     Labels: feature, sales, inventory, priority: critical
     Milestone: Sprint 06 - Sales Management
     Branch: feature/040-implement-order-fulfillment-and-inventory-deduction
     Epic: Sales Management
     Depends on: 033, 039
     Blocks: 041
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

## Module: sales
## Sprint: Sprint 06 - Sales Management

---

## Summary

Implement delivery: ship goods against a confirmed sales order, reduce inventory through the stock
movement service, release the corresponding reservation, and advance the order's fulfillment status.

## Background

This is the first issue in the programme where **one module writes into another module's data**,
and it is the highest-risk issue in Sprint 06.

A delivery must do four things as a single unit:

```text
1. Create the delivery record
2. Record a Stock Out movement          (Issue 033 service)
3. Release the reservation held for it  (Issue 032 service)
4. Update the order line's delivered quantity and the order status
```

If any of these succeed while another fails, the system enters a state nobody can explain: goods
shipped but still in stock, or stock reduced twice, or an order that looks undelivered while the
customer has the goods.

The rule that prevents this: **never touch `Inventory.quantityOnHand` directly.** All stock change
goes through the Issue 033 movement service, inside the delivery's transaction. Issue 047 does the
mirror operation for goods receipt and must use the same path.

Partial delivery is the normal case, not an edge case. Warehouses ship what they have.

## User Story

As a Warehouse Supervisor,
I want to record deliveries against confirmed orders,
So that shipped goods are deducted from stock and the order reflects what has actually gone out.

## Acceptance Criteria

```gherkin
Given a confirmed order for 100 units with 100 reserved
When a delivery of 60 units is recorded
Then stock decreases by 60, the reservation reduces by 60, and the order status becomes Partially Delivered
```

```gherkin
Given an order line for 100 units with 60 already delivered
When a delivery of 40 units is recorded
Then the order status becomes Delivered
```

```gherkin
Given an order line for 100 units with 60 already delivered
When a delivery of 50 units is attempted
Then the request is rejected because it would exceed the ordered quantity
```

```gherkin
Given a delivery where the stock movement fails
When the transaction completes
Then no delivery record exists and stock is unchanged
```

```gherkin
Given a delivery is recorded
When the stock movement history is inspected
Then a Stock Out movement exists referencing the delivery document
```

```gherkin
Given a sales order with status Draft
When a delivery is attempted
Then the request is rejected because only confirmed orders can be delivered
```

- [ ] `POST /api/sales/deliveries` creates a delivery from a sales order
- [ ] `GET /api/sales/deliveries` lists deliveries with filtering
- [ ] `GET /api/sales/deliveries/{id}` returns a delivery with lines
- [ ] `GET /api/sales/orders/{id}/deliveries` lists an order's deliveries
- [ ] `POST /api/sales/deliveries/{id}/cancel` reverses a delivery
- [ ] Delivery number generated automatically and unique
- [ ] Only Confirmed or Partially Delivered orders can be delivered
- [ ] Delivery lines reference sales order lines
- [ ] Delivered quantity cannot exceed the remaining ordered quantity
- [ ] Stock reduced through the Issue 033 movement service, never directly
- [ ] Reservation released for the delivered quantity
- [ ] Delivery, movement, reservation release, and status update are one transaction
- [ ] Partial delivery supported across multiple deliveries
- [ ] Order status advances to Partially Delivered or Delivered automatically
- [ ] Insufficient physical stock rejected with a clear message
- [ ] Every movement records the delivery as its source document
- [ ] Cancellation reverses stock via a compensating movement
- [ ] Stock balance still reconciles with movement history after delivery
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Shipping goods reduces stock exactly once, releases the matching reservation, and moves the order
forward. Every stock change is traceable to the delivery that caused it, and no partial failure can
leave the two modules disagreeing.

---

## Scope

### Included

- Delivery creation from a sales order
- Delivery lines referencing order lines
- Over-delivery prevention
- Stock deduction via the movement service
- Reservation release
- Atomic transaction across all four operations
- Partial delivery across multiple deliveries
- Automatic order status advancement
- Delivery cancellation with compensating movement
- Permission enforcement
- ERD update

### Out of Scope

- Invoicing (Issue 041)
- Sales dashboard (Issue 042)
- Shipping carrier integration and tracking numbers
- Packing lists and delivery notes as printed documents
- Returns and credit notes
- Goods receipt — the mirror operation (Sprint 07, Issue 047)

## Technical Requirements

**Endpoints**

```text
POST   /api/sales/deliveries
GET    /api/sales/deliveries
GET    /api/sales/deliveries/{id}
GET    /api/sales/orders/{id}/deliveries
POST   /api/sales/deliveries/{id}/cancel
```

**Schema**

```text
Delivery

id
deliveryNumber      unique
salesOrderId        → SalesOrder
warehouseId         → Warehouse
deliveryDate
status              enum: COMPLETED | CANCELLED
notes
deliveredBy         → User
createdAt

DeliveryLine

id
deliveryId          → Delivery
salesOrderLineId    → SalesOrderLine
productId           → Product
quantity
stockMovementId     → StockMovement
lineNumber
```

Storing `stockMovementId` on the line makes the link between the business document and the stock
ledger explicit and testable in both directions.

**The delivery transaction**

```text
BEGIN

  1. Validate order status is CONFIRMED or PARTIALLY_DELIVERED
  2. For each line:
       a. Validate quantity <= (orderLine.quantity - orderLine.deliveredQuantity)
       b. recordStockOut(...) via the Issue 033 service, referencing this delivery
       c. release(...) the reservation via the Issue 032 service
       d. Increment orderLine.deliveredQuantity
  3. Insert Delivery and DeliveryLine rows
  4. Recalculate and set the order status

COMMIT
```

Any failure rolls back everything. The movement service must accept the caller's transaction —
this is the interface Issue 033 was required to expose.

**Order status recalculation**

```text
All lines fully delivered              → DELIVERED
Some quantity delivered, not all       → PARTIALLY_DELIVERED
Nothing delivered                      → CONFIRMED
```

Derived from line quantities, not set manually, so it cannot drift from the delivery records.

**Over-delivery**

```text
remaining = orderLine.quantity - orderLine.deliveredQuantity

reject if requestedQuantity > remaining
```

Checked inside the transaction, not before it, so concurrent deliveries against the same line
cannot both pass.

**Cancellation**

Reverses the delivery with a compensating `STOCK_IN` movement referencing the original, restores
the reservation, decrements `deliveredQuantity`, and recalculates the order status. The original
delivery and its movements are never deleted.

**Permissions to add**

```text
SALES_DELIVERY_CREATE
SALES_DELIVERY_READ
SALES_DELIVERY_CANCEL
```

## Dependencies

- Issue 039 — confirmed sales orders with reserved stock.
- Issue 033 — the stock movement service, which must accept an external transaction.
- Issue 032 — the reservation release service.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for over-delivery prevention and status recalculation
- [ ] **Atomicity test**: a failing stock movement leaves no delivery record and unchanged stock
- [ ] **Atomicity test**: a failing reservation release rolls back the movement
- [ ] Test confirming partial deliveries accumulate correctly across multiple deliveries
- [ ] Test confirming stock is never written outside the movement service
- [ ] **Reconciliation test**: stock balance equals movement history sum after a delivery sequence
- [ ] Concurrency test: two simultaneous deliveries against one order line cannot over-deliver
- [ ] Test confirming cancellation restores stock and reservation exactly
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md` § 5 |
| Epic | Sales Management |
| Uses | Issue 033 (stock movement), Issue 032 (reservation) |
| Mirror operation | Issue 047 (goods receipt, Sprint 07) |
| Invoiced by | Issue 041 |
| Pull Request | _to be linked_ |
