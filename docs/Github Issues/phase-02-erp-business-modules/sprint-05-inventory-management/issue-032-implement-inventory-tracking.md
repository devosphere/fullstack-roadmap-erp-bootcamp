# [FEATURE] Implement Inventory Tracking

<!-- GitHub title: [FEATURE] Implement Inventory Tracking
     Labels: feature, inventory, priority: critical
     Milestone: Sprint 05 - Inventory Management
     Branch: feature/032-implement-inventory-tracking
     Epic: Inventory Management
     Depends on: 029, 031
     Blocks: 033
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

Track stock levels per product per warehouse: current quantity, reserved quantity, available
quantity, and low-stock detection against reorder levels.

## Background

This issue defines the shape of the stock record that Sprints 06 and 07 both write to. Getting the
model right here is worth more than any feature in this sprint.

The critical distinction is **on-hand versus available**. Stock that is physically present but
already committed to a confirmed sales order cannot be sold again:

```text
On hand        150     physically in the warehouse
Reserved        40     committed to confirmed orders
Available      110     what can still be sold
```

Without reservation, two salespeople sell the same 150 units and one customer's order cannot be
fulfilled. Adding reservation later means revisiting every availability check in the sales module.

The second concern is **concurrency**. Two deliveries against the same product at the same moment
can both read a quantity of 10, both subtract 8, and both succeed — leaving -6 or 2 depending on
write order. This must be prevented at the database level, not by application-level checks.

## User Story

As an Inventory Clerk,
I want to see accurate stock levels per product and warehouse,
So that I know what is physically present and what is actually available to sell.

## Acceptance Criteria

```gherkin
Given a product with stock in two warehouses
When inventory is requested for that product
Then quantities are returned separately per warehouse and as a total
```

```gherkin
Given a product with 150 on hand and 40 reserved
When available quantity is requested
Then it returns 110
```

```gherkin
Given two concurrent operations each attempting to reduce the same stock record
When both execute
Then the final quantity is correct and neither operation silently overwrites the other
```

```gherkin
Given a product whose available quantity falls below its reorder level
When the low-stock report is requested
Then the product appears in it
```

```gherkin
Given no inventory record exists for a product and warehouse combination
When stock is queried
Then a zero quantity is returned rather than an error
```

- [ ] `GET /api/inventory` lists stock with filtering by product, warehouse, and status
- [ ] `GET /api/inventory/product/{productId}` returns stock across all warehouses
- [ ] `GET /api/inventory/warehouse/{warehouseId}` returns stock in one warehouse
- [ ] `GET /api/inventory/availability` returns available quantity for a product and warehouse
- [ ] `GET /api/inventory/low-stock` returns products at or below reorder level
- [ ] Stock tracked uniquely per product per warehouse
- [ ] Quantity on hand, reserved, and available all exposed
- [ ] Available quantity derived as on hand minus reserved
- [ ] Reserve and release exposed as transaction-safe service methods
- [ ] Concurrent updates prevented from producing incorrect quantities
- [ ] Quantity cannot go negative through the service interface
- [ ] Missing product-warehouse combinations return zero rather than erroring
- [ ] Low-stock detection compares available against reorder level
- [ ] Inventory table indexed for product and warehouse lookups
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Stock levels are accurate per product per warehouse, distinguish committed from available stock,
and remain correct when multiple operations touch the same record simultaneously.

---

## Scope

### Included

- Inventory query endpoints
- Per product per warehouse tracking
- On-hand, reserved, and available quantities
- Reservation and release service methods
- Concurrency-safe quantity updates
- Negative stock prevention
- Low-stock detection
- Indexing
- Permission enforcement
- ERD update

### Out of Scope

- Stock movement recording (Issue 033)
- Inventory adjustments (Issue 034)
- Inventory dashboard (Issue 035)
- Stock reservation triggered by sales orders (Sprint 06, Issue 039)
- Inventory valuation and costing (Sprint 08)
- Batch, lot, and expiry tracking

## Technical Requirements

**Endpoints**

```text
GET /api/inventory
GET /api/inventory/product/{productId}
GET /api/inventory/warehouse/{warehouseId}
GET /api/inventory/availability?productId=&warehouseId=
GET /api/inventory/low-stock
```

**Schema**

```text
Inventory

id
productId           → Product
warehouseId         → Warehouse
quantityOnHand      integer, >= 0
quantityReserved    integer, >= 0
version             integer, for optimistic locking
updatedAt

unique (productId, warehouseId)
check quantityOnHand >= 0
check quantityReserved >= 0
check quantityReserved <= quantityOnHand
```

**Derived value**

```text
quantityAvailable = quantityOnHand - quantityReserved
```

Not stored. Computed on read so it cannot drift from its inputs.

**Concurrency**

Use one of:

```text
Optimistic locking    version column, retry on conflict
Pessimistic locking   SELECT ... FOR UPDATE within the transaction
```

Document the choice in an ADR. Either is acceptable; doing neither is not. The database `CHECK`
constraints are the final defence — even if application logic is bypassed, the quantity cannot go
negative.

**Service interface for Sprints 06 and 07**

```text
getAvailable(productId, warehouseId)          → integer, 0 if no record

reserve(productId, warehouseId, quantity)     → fails if insufficient available
release(productId, warehouseId, quantity)     → fails if exceeds reserved
```

All must participate in the caller's transaction so a failing order rolls back its reservation.

**Auto-creation**

An inventory row is created on first movement for a product-warehouse pair. Queries for a
non-existent pair return zero rather than 404 — absence of a record means zero stock, not an error.

**Indexes**

```text
(productId, warehouseId)   unique
(warehouseId)              for warehouse listings
(productId)                for cross-warehouse totals
```

**Permissions to add**

```text
INVENTORY_READ
INVENTORY_RESERVE
```

## Dependencies

- Issue 029 — products must exist.
- Issue 031 — warehouses must exist.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for available quantity derivation
- [ ] Unit tests for reserve and release including insufficient-stock rejection
- [ ] **Concurrency test**: two simultaneous reservations against limited stock produce a correct final quantity
- [ ] Test confirming database constraints reject negative quantities directly
- [ ] Test confirming a missing product-warehouse pair returns zero
- [ ] Test confirming reservation rolls back with the caller's transaction
- [ ] Integration tests for all endpoints
- [ ] ADR written for the chosen concurrency strategy
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md` § 4 |
| Epic | Inventory Management |
| Consumed by | Issues 033, 034, 039, 040, 047 |
| Pull Request | _to be linked_ |
