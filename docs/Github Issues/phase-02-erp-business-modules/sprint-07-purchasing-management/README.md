# Sprint 07 - Purchasing Management

**Milestone:** Sprint 07 - Purchasing Management  
**Release:** v0.8.0  
**Phase:** Phase 02 - ERP Business Modules  
**Duration:** 4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 07 - Purchasing Management` |
| Due date | End of sprint |
| Description | Implement the procure-to-pay workflow: suppliers, requisitions, approval routing, purchase orders, goods receipt, and three-way matching. Release v0.8.0. |

---

# Sprint Goal

Implement the Purchasing Management module by introducing supplier management, purchase
requisitions, approval routing, purchase orders, goods receipt, and supplier invoice matching.

---

# Epic

**[Purchasing Management](epic-07-purchasing-management.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 043 | [issue-043](issue-043-create-supplier-management-module.md) | `[FEATURE] Create Supplier Management Module` | Feature | `feature`, `procurement`, `priority: high` | `feature/043-create-supplier-management-module` |
| 044 | [issue-044](issue-044-create-purchase-requisition-module.md) | `[FEATURE] Create Purchase Requisition Module` | Feature | `feature`, `procurement`, `priority: high` | `feature/044-create-purchase-requisition-module` |
| 045 | [issue-045](issue-045-implement-requisition-approval-workflow.md) | `[FEATURE] Implement Requisition Approval Workflow` | Feature | `feature`, `procurement`, `priority: critical` | `feature/045-implement-requisition-approval-workflow` |
| 046 | [issue-046](issue-046-create-purchase-order-module.md) | `[FEATURE] Create Purchase Order Module` | Feature | `feature`, `procurement`, `priority: critical` | `feature/046-create-purchase-order-module` |
| 047 | [issue-047](issue-047-implement-goods-receipt-and-inventory-replenishment.md) | `[FEATURE] Implement Goods Receipt and Inventory Replenishment` | Feature | `feature`, `procurement`, `inventory`, `priority: critical` | `feature/047-implement-goods-receipt-and-inventory-replenishment` |
| 048 | [issue-048](issue-048-implement-supplier-invoice-three-way-match.md) | `[FEATURE] Implement Supplier Invoice Three-Way Match` | Feature | `feature`, `procurement`, `priority: high` | `feature/048-implement-supplier-invoice-three-way-match` |
| 049 | [issue-049](issue-049-create-procurement-dashboard.md) | `[FEATURE] Create Procurement Dashboard` | Feature | `feature`, `procurement`, `priority: medium` | `feature/049-create-procurement-dashboard` |

All seven issues take **Milestone:** `Sprint 07 - Purchasing Management`.

---

# Dependency Order

```text
043 Supplier

        ↓

044 Purchase Requisition

        ↓

045 Approval Workflow

        ↓

046 Purchase Order

        ↓

047 Goods Receipt & Inventory Replenishment

        ↓

048 Three-Way Match

        ↓

049 Procurement Dashboard
```

This sprint is strictly sequential — each document derives from the one before it.

---

# The Control Chain

Purchasing is the first module that commits company funds. Every step exists to answer a control
question:

```text
Was the purchase requested and approved?      044 + 045

Did we actually receive the goods?            047

Does the supplier invoice match both?         048
```

That final check is the three-way match. Skipping any link means paying for goods nobody asked for
or never received.

---

# Cross-Module Dependencies

| Issue | Depends on |
|-------|-----------|
| 045 Approval routing | Reporting hierarchy (Issue 021), roles (Issue 012) |
| 047 Goods receipt | Stock movement service (Issue 033), inventory (Issue 032) |

**Issue 047 is the mirror of Issue 040.** Sales delivery decreases stock; goods receipt increases
it. Both must go through the Issue 033 movement service. If either writes to
`Inventory.quantityOnHand` directly, the stock ledger stops reconciling.

---

# Deliberate Technical Debt

Issue 045 hard-codes approval routing inside the procurement module. That is intentional.

Sprint 04 already built a single-step approval for leave (Issue 025). This sprint builds a second,
more complex one. **Sprint 10 (Issue 068) replaces both with a configurable engine.**

Writing it twice before generalizing is a teaching decision: the shape of the right abstraction is
much clearer with two real examples than with one. The debt is recorded here so it is not mistaken
for an oversight.

---

# Sprint Definition of Done

- [ ] Supplier management completed.
- [ ] Requisitions submitted and locked on submission.
- [ ] Approval routing uses the reporting hierarchy with value-based limits.
- [ ] Self-approval blocked; approval history immutable.
- [ ] Purchase orders created only from approved requisitions.
- [ ] Goods receipts increase inventory atomically through the movement service.
- [ ] Partial receipt supported; over-receipt rejected.
- [ ] Three-way match executed with tolerance handling.
- [ ] Procurement dashboard reflecting real data.
- [ ] Stock ledger still reconciles after purchasing activity.
- [ ] Documentation and ERD updated.
- [ ] Release v0.8.0 published.

---

# Release Notes Draft

```markdown
# v0.8.0

Purchasing Management Release

## Added

- Supplier management
- Purchase requisitions
- Requisition approval workflow
- Purchase order management
- Goods receipt and inventory replenishment
- Supplier invoice three-way match
- Procurement dashboard
```
