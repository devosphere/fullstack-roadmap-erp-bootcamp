# [EPIC] Purchasing Management

<!-- GitHub title: [EPIC] Purchasing Management
     Labels: epic, procurement
     Milestone: Sprint 07 - Purchasing Management
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 043-049 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: procurement
## Sprint: Sprint 07 - Purchasing Management

---

## Purpose

Build the procure-to-pay capability: suppliers, requisitions, approval routing, purchase orders,
goods receipt, and supplier invoice matching.

```text
Sales reduces inventory

        ↓

Purchasing replenishes inventory
```

## Business Value

This is the first module where the system commits company funds. Every enterprise purchasing
process therefore answers three control questions:

```text
Was the purchase requested and approved?

        ↓

Did we actually receive the goods?

        ↓

Does the supplier invoice match both?
```

Answering all three is the three-way match. A company that cannot answer them pays for goods nobody
authorized or never received.

## Issues

- [ ] #43 Create Supplier Management Module
- [ ] #44 Create Purchase Requisition Module
- [ ] #45 Implement Requisition Approval Workflow
- [ ] #46 Create Purchase Order Module
- [ ] #47 Implement Goods Receipt and Inventory Replenishment
- [ ] #48 Implement Supplier Invoice Three-Way Match
- [ ] #49 Create Procurement Dashboard

## Document Chain

```text
Employee → PurchaseRequisition → Approval

                    ↓

              PurchaseOrder → GoodsReceipt → SupplierInvoice

                    ↓              ↓

           PurchaseOrderLine   StockMovement

                                   ↓

                               Inventory

Supplier → PurchaseOrder
```

## Deliberate Technical Debt

Issue 045 hard-codes approval routing inside this module — the second hard-coded approval after
leave in Issue 025. **Issue 068 in Sprint 10 replaces both with a configurable engine.**

This is intentional. The right abstraction is clearer with two real implementations than with one.
Recorded here so it is not mistaken for an oversight.

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Suppliers maintained
- [ ] Requisitions routed and approved by value and hierarchy
- [ ] Self-approval blocked and approval history immutable
- [ ] Purchase orders created only from approved requisitions
- [ ] Goods receipt increases inventory through the Issue 033 movement service
- [ ] Receipt and stock increase succeed or fail together
- [ ] Partial receipt supported; over-receipt rejected
- [ ] Three-way match validates invoices with tolerance handling
- [ ] Stock ledger still reconciles after purchasing activity
- [ ] Release v0.8.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md` |
| Phase overview | `academy/08-sprints/phase-02-erp-business-modules/phase-overview.md` |
| Depends on | Issues 021, 032, 033 |
| Mirror of | Issue 040 (sales delivery) |
| Feeds | Issue 054 (accounts payable, Sprint 08) |
| Refactored by | Issue 068 (Sprint 10) |
| Release | v0.8.0 |
