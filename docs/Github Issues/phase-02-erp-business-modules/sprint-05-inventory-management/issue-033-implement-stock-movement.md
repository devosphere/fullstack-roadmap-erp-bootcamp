# [FEATURE] Implement Stock Movement

<!-- GitHub title: [FEATURE] Implement Stock Movement
     Labels: feature, inventory, priority: critical
     Milestone: Sprint 05 - Inventory Management
     Branch: feature/033-implement-stock-movement
     Epic: Inventory Management
     Depends on: 032
     Blocks: 034, 040, 047
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

## Module: inventory
## Sprint: Sprint 05 - Inventory Management

---

## Summary

Implement the stock movement ledger: every quantity change is recorded as an append-only movement,
and the inventory balance is only ever changed through it.

## Background

This is the single most important issue in the sprint, and its consumers are in later sprints.

The rule it establishes: **nothing writes to `Inventory.quantityOnHand` directly.** Every change
goes through the movement service, which records the movement and updates the balance in one
transaction. That gives two properties:

- **Explicability.** The balance can always be reconstructed from movements. "Why is stock 47?"
  has an answer.
- **Consistency.** Sales deliveries (Issue 040) and goods receipts (Issue 047) cannot each invent
  their own update path and drift apart.

The same pattern appears in Issue 026 (leave balance) and again in Issue 052 (general ledger). A
cached balance plus an append-only transaction log is the standard answer whenever a number must be
both fast to read and possible to audit.

Transfers deserve specific attention: moving stock between warehouses is **two movements in one
transaction**, not one movement with two locations. Half a transfer is stock that has left one
warehouse and arrived nowhere.

## User Story

As an Inventory Clerk,
I want every stock change recorded with its reason and source,
So that current stock levels can always be explained and audited.

## Acceptance Criteria

```gherkin
Given a product with 100 units in a warehouse
When a stock-in movement of 50 is recorded
Then the balance becomes 150 and a movement record exists linking the change to its source
```

```gherkin
Given a product with 10 available units
When a stock-out movement of 15 is attempted
Then the movement is rejected and the balance remains 10
```

```gherkin
Given a transfer of 20 units from warehouse A to warehouse B
When the transfer is recorded
Then A decreases by 20 and B increases by 20, or neither changes
```

```gherkin
Given the transfer's second movement fails
When the transaction completes
Then the first movement is rolled back and no partial transfer exists
```

```gherkin
Given a series of movements for a product
When the movement history is summed
Then the total equals the current inventory balance exactly
```

```gherkin
Given a recorded movement
When a user attempts to edit or delete it
Then the request is rejected
```

- [ ] `POST /api/inventory/movements` records a movement
- [ ] `POST /api/inventory/transfers` records a warehouse transfer
- [ ] `GET /api/inventory/movements` lists movements with filtering
- [ ] `GET /api/inventory/movements/{id}` returns a movement
- [ ] `GET /api/inventory/product/{productId}/movements` returns a product's movement history
- [ ] Movement types supported: Stock In, Stock Out, Transfer In, Transfer Out, Adjustment
- [ ] Every movement updates the inventory balance in the same transaction
- [ ] Stock-out rejected when it would make the balance negative
- [ ] Transfers create paired movements atomically
- [ ] Movements are append-only — never edited or deleted
- [ ] Corrections are made by recording a reversing movement
- [ ] Every movement records its source document type and id
- [ ] Every movement records who performed it and when
- [ ] Movement service exposed for use by Sprints 06 and 07
- [ ] Service methods participate in the caller's transaction
- [ ] Balance always reconciles with the sum of movements
- [ ] Movement table indexed for product, warehouse, and date queries
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Every change to stock is recorded and explicable. The inventory balance can be reconstructed from
movements at any time. Sales and purchasing both change stock through one path.

---

## Scope

### Included

- Movement recording endpoint and service
- Warehouse transfer as paired atomic movements
- Movement history queries
- Negative stock prevention
- Append-only enforcement
- Source document linkage
- Transaction-safe service interface for later sprints
- Reconciliation between balance and movement history
- Indexing
- Permission enforcement
- ERD update

### Out of Scope

- Inventory adjustments with approval (Issue 034)
- Inventory dashboard (Issue 035)
- Sales deliveries (Sprint 06, Issue 040)
- Goods receipts (Sprint 07, Issue 047)
- Inventory valuation and costing (Sprint 08)
- Batch and serial number tracking

## Technical Requirements

**Endpoints**

```text
POST   /api/inventory/movements
POST   /api/inventory/transfers
GET    /api/inventory/movements
GET    /api/inventory/movements/{id}
GET    /api/inventory/product/{productId}/movements
```

**Schema**

```text
StockMovement

id
movementNumber      unique
productId           → Product
warehouseId         → Warehouse
movementType        enum
quantity            integer, always positive
direction           enum: IN | OUT
balanceAfter        integer, balance at the time of this movement
referenceType       nullable, e.g. SALES_DELIVERY | GOODS_RECEIPT | ADJUSTMENT | TRANSFER
referenceId         nullable
relatedMovementId   → StockMovement, nullable, links transfer pairs
reason
performedBy         → User
createdAt
```

**Movement types**

| Type | Direction | Typical source |
|------|-----------|----------------|
| `STOCK_IN` | IN | Goods receipt (Issue 047) |
| `STOCK_OUT` | OUT | Sales delivery (Issue 040) |
| `TRANSFER_OUT` | OUT | Warehouse transfer |
| `TRANSFER_IN` | IN | Warehouse transfer |
| `ADJUSTMENT` | IN or OUT | Inventory adjustment (Issue 034) |

`quantity` is always positive; `direction` carries the sign. Storing signed quantities invites
sign errors in aggregation.

**Transaction requirement**

Every movement does both of these, or neither:

```text
1. Insert the StockMovement row
2. Update Inventory.quantityOnHand
```

A transfer does four operations in one transaction:

```text
1. TRANSFER_OUT movement for warehouse A
2. Decrease A's balance
3. TRANSFER_IN movement for warehouse B
4. Increase B's balance
```

The two movements reference each other via `relatedMovementId`.

**Service interface for Sprints 06 and 07**

```text
recordStockIn(productId, warehouseId, quantity, referenceType, referenceId, reason)
recordStockOut(productId, warehouseId, quantity, referenceType, referenceId, reason)
transfer(productId, fromWarehouseId, toWarehouseId, quantity, reason)
```

All must accept and participate in an existing transaction. Issue 040 needs its delivery and the
stock-out to succeed or fail together; Issue 047 needs the same for goods receipt.

**Immutability**

No update or delete endpoints exist for movements. Corrections are new movements in the opposite
direction referencing the original. Enforce this in the service, not only by omitting the route.

**Reconciliation**

Provide a verification query used in tests and available for support:

```text
SUM(quantity where direction = IN) - SUM(quantity where direction = OUT)
    = Inventory.quantityOnHand
```

**Indexes**

```text
(productId, createdAt)
(warehouseId, createdAt)
(referenceType, referenceId)
(movementNumber)   unique
```

**Permissions to add**

```text
STOCK_MOVEMENT_CREATE
STOCK_MOVEMENT_READ
STOCK_TRANSFER_CREATE
```

## Dependencies

- Issue 032 — the inventory balance and concurrency handling.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for each movement type and direction
- [ ] Unit test confirming stock-out is rejected when it would go negative
- [ ] **Atomicity test**: a transfer whose second leg fails leaves both warehouses unchanged
- [ ] **Reconciliation test**: movement history sums exactly to the inventory balance
- [ ] Test confirming movements cannot be updated or deleted
- [ ] Test confirming service methods roll back with the caller's transaction
- [ ] Concurrency test: simultaneous movements against one product produce a correct balance
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md` § 5 |
| Epic | Inventory Management |
| Consumed by | Issue 034, Issue 040 (delivery), Issue 047 (goods receipt) |
| Same pattern as | Issue 026 (leave balance), Issue 052 (general ledger) |
| Pull Request | _to be linked_ |
