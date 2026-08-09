# Sprint 05 - Inventory Management

**Milestone:** Sprint 05 - Inventory Management  
**Release:** v0.6.0  
**Phase:** Phase 02 - ERP Business Modules  
**Duration:** 4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 05 - Inventory Management` |
| Due date | End of sprint |
| Description | Implement product management, warehouse operations, stock tracking, and inventory transaction workflows. Release v0.6.0. |

---

# Sprint Goal

Implement the Inventory Management module by introducing product management, warehouse operations,
stock tracking, and inventory transaction workflows.

---

# Epic

**[Inventory Management](epic-05-inventory-management.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 029 | [issue-029](issue-029-create-product-management-module.md) | `[FEATURE] Create Product Management Module` | Feature | `feature`, `inventory`, `priority: high` | `feature/029-create-product-management-module` |
| 030 | [issue-030](issue-030-implement-product-categories.md) | `[FEATURE] Implement Product Categories` | Feature | `feature`, `inventory`, `priority: medium` | `feature/030-implement-product-categories` |
| 031 | [issue-031](issue-031-create-warehouse-management.md) | `[FEATURE] Create Warehouse Management` | Feature | `feature`, `inventory`, `priority: high` | `feature/031-create-warehouse-management` |
| 032 | [issue-032](issue-032-implement-inventory-tracking.md) | `[FEATURE] Implement Inventory Tracking` | Feature | `feature`, `inventory`, `priority: critical` | `feature/032-implement-inventory-tracking` |
| 033 | [issue-033](issue-033-implement-stock-movement.md) | `[FEATURE] Implement Stock Movement` | Feature | `feature`, `inventory`, `priority: critical` | `feature/033-implement-stock-movement` |
| 034 | [issue-034](issue-034-implement-inventory-adjustment.md) | `[FEATURE] Implement Inventory Adjustment` | Feature | `feature`, `inventory`, `priority: high` | `feature/034-implement-inventory-adjustment` |
| 035 | [issue-035](issue-035-create-inventory-dashboard.md) | `[FEATURE] Create Inventory Dashboard` | Feature | `feature`, `inventory`, `priority: medium` | `feature/035-create-inventory-dashboard` |

All seven issues take **Milestone:** `Sprint 05 - Inventory Management`.

---

# Dependency Order

```text
030 Product Categories

        ↓

029 Product Management        031 Warehouse Management

        └──────────┬──────────────────┘

                   ↓

           032 Inventory Tracking

                   ↓

           033 Stock Movement

                   ↓

034 Inventory Adjustment      035 Inventory Dashboard
```

Issue 030 should land before or with 029 — products reference categories.

---

# Why This Sprint Is Load-Bearing

Issues 032 and 033 create the stock ledger that two later sprints write to:

| Writer | Effect | Sprint |
|--------|--------|--------|
| Issue 040 Delivery | Stock Out — decreases inventory | Sprint 06 |
| Issue 047 Goods Receipt | Stock In — increases inventory | Sprint 07 |

Both must go through the movement service built in Issue 033 rather than updating quantities
directly. If either writes to `Inventory.quantity` on its own, the movement history and the stock
balance will diverge and neither will be trustworthy.

Issue 033 must therefore expose a transaction-safe service interface, not just HTTP endpoints.

---

# Sprint Definition of Done

- [ ] Product and category management completed.
- [ ] Warehouse management completed.
- [ ] Inventory tracking accurate per product per warehouse.
- [ ] Stock movements recorded for every quantity change.
- [ ] Stock balance always reconciles with movement history.
- [ ] Inventory adjustments require a reason and are auditable.
- [ ] Inventory dashboard reflecting real data.
- [ ] Tests passing, including concurrency and negative-stock cases.
- [ ] Documentation and ERD updated.
- [ ] Release v0.6.0 published.

---

# Release Notes Draft

```markdown
# v0.6.0

Inventory Management Release

## Added

- Product management
- Product categories
- Warehouse management
- Inventory tracking
- Stock movement recording
- Inventory adjustments
- Inventory dashboard
```
