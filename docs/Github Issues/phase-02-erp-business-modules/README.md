# Phase 02 - ERP Business Modules

**Release Range:** v0.5.0 - v0.8.0  
**Sprints:** Sprint 04, Sprint 05, Sprint 06, Sprint 07  
**Issues:** 022 - 049  
**Phase Overview:** `academy/08-sprints/phase-02-erp-business-modules/phase-overview.md`

---

# Objective

Implement the core ERP business capabilities used by enterprise organizations, transitioning the
platform from a technical foundation into a functional business application.

---

# Milestones

| Milestone | Release | Issues | Epic |
|-----------|---------|--------|------|
| [Sprint 04 - Human Resource Management](sprint-04-human-resource-management/) | v0.5.0 | 022 - 028 | Human Resource Management |
| [Sprint 05 - Inventory Management](sprint-05-inventory-management/) | v0.6.0 | 029 - 035 | Inventory Management |
| [Sprint 06 - Sales Management](sprint-06-sales-management/) | v0.7.0 | 036 - 042 | Sales Management |
| [Sprint 07 - Purchasing Management](sprint-07-purchasing-management/) | v0.8.0 | 043 - 049 | Purchasing Management |

---

# Issue Roster

| # | Title | Type | Module | Sprint |
|---|-------|------|--------|--------|
| 022 | Enhance Employee Profile | Feature | hr | Sprint 04 |
| 023 | Implement Employment Lifecycle Management | Feature | hr | Sprint 04 |
| 024 | Implement Attendance Management | Feature | hr | Sprint 04 |
| 025 | Implement Leave Management | Feature | hr | Sprint 04 |
| 026 | Implement Leave Balance Management | Feature | hr | Sprint 04 |
| 027 | Create Employee Self-Service Portal | Feature | hr | Sprint 04 |
| 028 | Create HR Dashboard | Feature | hr | Sprint 04 |
| 029 | Create Product Management Module | Feature | inventory | Sprint 05 |
| 030 | Implement Product Categories | Feature | inventory | Sprint 05 |
| 031 | Create Warehouse Management | Feature | inventory | Sprint 05 |
| 032 | Implement Inventory Tracking | Feature | inventory | Sprint 05 |
| 033 | Implement Stock Movement | Feature | inventory | Sprint 05 |
| 034 | Implement Inventory Adjustment | Feature | inventory | Sprint 05 |
| 035 | Create Inventory Dashboard | Feature | inventory | Sprint 05 |
| 036 | Create Customer Management Module | Feature | sales | Sprint 06 |
| 037 | Implement Price List Management | Feature | sales | Sprint 06 |
| 038 | Create Sales Quotation Module | Feature | sales | Sprint 06 |
| 039 | Create Sales Order Module | Feature | sales | Sprint 06 |
| 040 | Implement Order Fulfillment and Inventory Deduction | Feature | sales | Sprint 06 |
| 041 | Implement Sales Invoicing | Feature | sales | Sprint 06 |
| 042 | Create Sales Dashboard | Feature | sales | Sprint 06 |
| 043 | Create Supplier Management Module | Feature | procurement | Sprint 07 |
| 044 | Create Purchase Requisition Module | Feature | procurement | Sprint 07 |
| 045 | Implement Requisition Approval Workflow | Feature | procurement | Sprint 07 |
| 046 | Create Purchase Order Module | Feature | procurement | Sprint 07 |
| 047 | Implement Goods Receipt and Inventory Replenishment | Feature | procurement | Sprint 07 |
| 048 | Implement Supplier Invoice Three-Way Match | Feature | procurement | Sprint 07 |
| 049 | Create Procurement Dashboard | Feature | procurement | Sprint 07 |

---

# Cross-Module Dependencies

This is the first phase where modules depend on each other's data at runtime.

```text
Sprint 05 Inventory

    Stock levels

        ↑                        ↓

  047 Goods Receipt         040 Delivery
  (Sprint 07)               (Sprint 06)

  increases stock           decreases stock
```

| Issue | Depends on another module |
|-------|---------------------------|
| 025 Leave Management | Reporting hierarchy from Issue 021 |
| 040 Order Fulfillment | Inventory and stock movement from Issues 032, 033 |
| 045 Approval Workflow | Reporting hierarchy from Issue 021, roles from Issue 012 |
| 047 Goods Receipt | Inventory and stock movement from Issues 032, 033 |
| 048 Three-Way Match | Purchase order 046 and goods receipt 047 |

Issues 040 and 047 both write to inventory. Their transaction handling must be consistent, or the
stock ledger drifts.

---

# Sprint Order

```text
Sprint 04 HR

        ↓

Sprint 05 Inventory        (foundation for sales and purchasing)

        ↓

Sprint 06 Sales            (consumes inventory)

        ↓

Sprint 07 Purchasing       (replenishes inventory, introduces approvals)
```

Sprint 05 must precede Sprints 06 and 07 because both depend on stock records existing.

---

# Phase Exit Criteria

- [ ] All 28 issues closed.
- [ ] HR, inventory, sales, and purchasing modules complete.
- [ ] Selling goods reduces stock; receiving goods increases it.
- [ ] Approval workflow operating on the reporting hierarchy.
- [ ] Three-way match validating supplier invoices.
- [ ] Cross-module transactions consistent under failure.
- [ ] Releases v0.5.0 through v0.8.0 published.
