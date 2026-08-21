# [EPIC] Inventory Management

<!-- GitHub title: [EPIC] Inventory Management
     Labels: epic, inventory
     Milestone: Sprint 05 - Inventory Management
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 029-035 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: inventory
## Sprint: Sprint 05 - Inventory Management

---

## Purpose

Build inventory and warehouse capabilities: product master data, warehouses, stock levels, and the
movement ledger that records every quantity change.

```text
Managing Business People

        ↓

Managing Business Resources
```

## Business Value

Inventory is the foundation for the two revenue-critical modules that follow. Sales cannot deliver
goods it cannot deduct, and purchasing cannot receive goods it cannot record.

The stock ledger created here is written to by both:

```text
Sprint 07 Goods Receipt  ──→  Stock In   ──→  Inventory  ←──  Stock Out  ←──  Sprint 06 Delivery
```

If the ledger is not authoritative, stock figures drift and every downstream report is wrong.

## Issues

- [ ] #29 Create Product Management Module
- [ ] #30 Implement Product Categories
- [ ] #31 Create Warehouse Management
- [ ] #32 Implement Inventory Tracking
- [ ] #33 Implement Stock Movement
- [ ] #34 Implement Inventory Adjustment
- [ ] #35 Create Inventory Dashboard

## Domain Model

```text
ProductCategory

        ↓

Product  ──────┐

               ├──→  Inventory  (quantity per product per warehouse)

Warehouse  ────┘

               └──→  StockMovement  (every change, append-only)
```

`Inventory.quantity` is a cached balance. `StockMovement` is the truth.

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Products and categories maintained
- [ ] Warehouses maintained
- [ ] Stock levels tracked per product per warehouse
- [ ] Every quantity change recorded as a movement
- [ ] Stock balance always reconciles with movement history
- [ ] Stock cannot go negative through normal operations
- [ ] Adjustments require a reason and are auditable
- [ ] A transaction-safe service interface exists for Sprints 06 and 07
- [ ] Release v0.6.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md` |
| Phase overview | `academy/08-sprints/phase-02-erp-business-modules/phase-overview.md` |
| Consumed by | Issue 040 (delivery), Issue 047 (goods receipt) |
| Release | v0.6.0 |
