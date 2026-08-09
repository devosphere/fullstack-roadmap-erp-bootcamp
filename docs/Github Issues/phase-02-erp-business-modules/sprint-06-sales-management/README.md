# Sprint 06 - Sales Management

**Milestone:** Sprint 06 - Sales Management  
**Release:** v0.7.0  
**Phase:** Phase 02 - ERP Business Modules  
**Duration:** 4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 06 - Sales Management` |
| Due date | End of sprint |
| Description | Implement the order-to-cash workflow: customers, pricing, quotations, sales orders, fulfillment, and invoicing. Release v0.7.0. |

---

# Sprint Goal

Implement the Sales Management module by introducing customer management, pricing, sales
quotations, sales orders, order fulfillment, and sales invoicing.

---

# Epic

**[Sales Management](epic-06-sales-management.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 036 | [issue-036](issue-036-create-customer-management-module.md) | `[FEATURE] Create Customer Management Module` | Feature | `feature`, `sales`, `priority: high` | `feature/036-create-customer-management-module` |
| 037 | [issue-037](issue-037-implement-price-list-management.md) | `[FEATURE] Implement Price List Management` | Feature | `feature`, `sales`, `priority: high` | `feature/037-implement-price-list-management` |
| 038 | [issue-038](issue-038-create-sales-quotation-module.md) | `[FEATURE] Create Sales Quotation Module` | Feature | `feature`, `sales`, `priority: medium` | `feature/038-create-sales-quotation-module` |
| 039 | [issue-039](issue-039-create-sales-order-module.md) | `[FEATURE] Create Sales Order Module` | Feature | `feature`, `sales`, `priority: critical` | `feature/039-create-sales-order-module` |
| 040 | [issue-040](issue-040-implement-order-fulfillment-and-inventory-deduction.md) | `[FEATURE] Implement Order Fulfillment and Inventory Deduction` | Feature | `feature`, `sales`, `inventory`, `priority: critical` | `feature/040-implement-order-fulfillment-and-inventory-deduction` |
| 041 | [issue-041](issue-041-implement-sales-invoicing.md) | `[FEATURE] Implement Sales Invoicing` | Feature | `feature`, `sales`, `priority: high` | `feature/041-implement-sales-invoicing` |
| 042 | [issue-042](issue-042-create-sales-dashboard.md) | `[FEATURE] Create Sales Dashboard` | Feature | `feature`, `sales`, `priority: medium` | `feature/042-create-sales-dashboard` |

All seven issues take **Milestone:** `Sprint 06 - Sales Management`.

---

# Dependency Order

```text
036 Customer          037 Price List

        └──────┬─────────────┘

               ↓

        038 Sales Quotation

               ↓

        039 Sales Order

               ↓

        040 Fulfillment & Inventory Deduction

               ↓

        041 Sales Invoicing

               ↓

        042 Sales Dashboard
```

Issues 036 and 037 are independent and can run in parallel.

---

# The Document Chain

Sales is not one record. It is a chain where each document derives from the previous one and must
remain traceable back to it.

```text
Quotation  →  Sales Order  →  Delivery  →  Invoice
   038          039            040          041
```

Each conversion links both documents. A quotation converts once; an order delivers possibly many
times; an invoice covers what was delivered, not what was ordered.

---

# Cross-Module Dependency

**Issue 040 is the first write into another module's data.** Every delivery must reduce inventory
through the movement service built in **Issue 033** — never by updating `Inventory.quantityOnHand`
directly.

```text
Delivery created  →  StockMovement (Stock Out)  →  Inventory reduced
```

Both must succeed or neither. Issue 047 in Sprint 07 does the mirror operation for goods receipt,
and both must use the same service or the stock ledger drifts.

---

# Sprint Definition of Done

- [ ] Customer and price list management completed.
- [ ] Quotations created, accepted, and converted to orders.
- [ ] Sales orders with automatic document numbering and enforced status transitions.
- [ ] Deliveries reduce inventory atomically through the movement service.
- [ ] Partial delivery supported; over-delivery and insufficient stock rejected.
- [ ] Invoices generated from delivered quantities with correct due dates.
- [ ] Sales dashboard reflecting real data.
- [ ] Tests passing, including atomicity and stock-consistency cases.
- [ ] Documentation and ERD updated.
- [ ] Release v0.7.0 published.

---

# Release Notes Draft

```markdown
# v0.7.0

Sales Management Release

## Added

- Customer management
- Price list management
- Sales quotations
- Sales order management
- Order fulfillment and delivery
- Sales invoicing
- Sales dashboard
```
