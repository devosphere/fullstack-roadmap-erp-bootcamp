# Sprint 07 - Purchasing Management

**Sprint:** Sprint 07  
**Phase:** Phase 02 - ERP Business Modules  
**Duration:** 4 Weeks  
**Release Target:** v0.8.0  
**Status:** Planned

---

# Sprint Goal

Implement the Purchasing Management module by introducing supplier management, purchase requisitions, approval routing, purchase orders, goods receipt, and supplier invoice matching.

At the end of this sprint, the ERP platform should support the complete procure-to-pay workflow, from an internal request for goods to receiving stock and validating the supplier invoice.

---

# Sprint Context

Previous sprints established:

```text
Phase 01
Identity, Organization, Employees

        ↓

Sprint 05
Inventory Management
Products, Warehouses, Stock

        ↓

Sprint 06
Sales Management
Order-to-Cash
```

Sprint 07 completes the operational core of the ERP system.

```text
Sales reduces inventory

        ↓

Purchasing replenishes inventory
```

This sprint also introduces the first multi-step **approval workflow**, where a document cannot proceed until an authorized person approves it. That concept is generalized into a reusable engine in Sprint 10.

---

# Business Outcome

After completing this sprint, the ERP platform will support:

- Supplier master data management.
- Internal purchase requests.
- Approval routing based on organizational hierarchy.
- Purchase order issuance.
- Goods receipt and inventory replenishment.
- Supplier invoice verification.
- Procurement reporting.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- The procure-to-pay business process.
- Supplier master data management.
- Approval workflows and authorization limits.
- Receiving processes and inventory replenishment.
- Three-way matching.
- Business control and segregation of duties.

---

# Sprint Theme

## "Controls Exist Because Money Leaves the Company"

Purchasing is the first module where the system commits company funds.

Every enterprise purchasing process therefore answers three control questions:

```text
Was the purchase requested and approved?

        ↓

Did we actually receive the goods?

        ↓

Does the supplier invoice match both?
```

That final check is the **three-way match**.

---

# Business Capability

## Purchasing Management

The purchasing module provides capabilities for:

- Supplier management.
- Requisition management.
- Approval management.
- Purchase order management.
- Goods receipt management.
- Procurement reporting.

---

# Domain Concepts

---

# Supplier

Represents a vendor that provides goods or services to the company.

Example:

```text
Global Parts Supply Inc.
accounts@globalparts.com
Net 45
```

Stores:

- Supplier Code.
- Supplier Name.
- Contact Information.
- Address.
- Payment Terms.
- Status.

---

# Purchase Requisition

An internal request to purchase goods, raised before any supplier is contacted.

Status flow:

```text
Draft → Submitted → Approved → Rejected → Converted → Cancelled
```

A requisition states *what is needed*, not *who will supply it*.

---

# Approval

A decision recorded by an authorized user that allows a document to proceed.

Example:

```text
Requisition Value ≤ 50,000    → Department Manager
Requisition Value > 50,000    → Finance Officer
```

---

# Purchase Order

A formal commitment issued to a supplier.

Status flow:

```text
Draft → Issued → Partially Received → Received → Invoiced → Closed → Cancelled
```

---

# Goods Receipt

Represents goods physically arriving at the warehouse.

A goods receipt increases inventory recorded in Sprint 05.

```text
Purchase Order Issued

        ↓

Goods Receipt Created

        ↓

Stock Movement (Stock In)

        ↓

Inventory Increased
```

---

# Supplier Invoice

A payment request received from a supplier.

Before approval it is validated using the three-way match:

```text
Purchase Order

        ↓

Goods Receipt

        ↓

Supplier Invoice
```

Payment execution and accounting entries are delivered in Sprint 08.

---

# Sprint Scope

---

# 1. Supplier Management

## Objective

Create supplier master data management.

## Features

Users can:

- Create suppliers.
- Update supplier information.
- View supplier profile.
- Search and filter suppliers.
- Deactivate suppliers.

## Business Rules

- Supplier Code must be unique.
- A supplier cannot be deleted if purchase documents reference it.
- Deactivated suppliers cannot be selected on new purchase orders.

## Acceptance Criteria

- Supplier CRUD available.
- Supplier Code uniqueness enforced.
- Supplier list supports search and pagination.
- Access is role-based.

---

# 2. Purchase Requisition

## Objective

Allow employees to request goods internally.

## Features

Users can:

- Create requisitions with multiple product lines.
- Specify required quantity and required date.
- Submit requisitions for approval.
- View their own requisitions.
- Cancel requisitions.

## Business Rules

- Only `Draft` requisitions can be edited.
- A submitted requisition cannot be edited.
- Requester and approver must be different users.
- Required date cannot be in the past.

## Acceptance Criteria

- Requisition CRUD available.
- Submission locks the document.
- Requester sees requisition status.
- Validation errors are clear.

---

# 3. Approval Workflow

## Objective

Route requisitions to the correct approver based on value and organizational hierarchy.

## Features

Users can:

- View requisitions awaiting their approval.
- Approve with comments.
- Reject with a required reason.
- View the approval history of a document.

## Business Rules

- Approval routing uses the employee reporting hierarchy from Sprint 03.
- Approval limits are configurable by role.
- A user cannot approve their own requisition.
- Rejection requires a reason.
- Every approval action is recorded with user, timestamp, and comment.

## Acceptance Criteria

- Approval queue displays pending items.
- Routing selects the correct approver.
- Self-approval blocked.
- Approval history is visible and immutable.

---

# 4. Purchase Order Management

## Objective

Issue formal commitments to suppliers.

## Features

Users can:

- Create purchase orders from approved requisitions.
- Select a supplier and agree unit prices.
- Issue purchase orders.
- Cancel purchase orders.
- View purchase order history per supplier.

## Business Rules

- A purchase order can only be created from an approved requisition.
- Document numbers are generated automatically and are unique.
- Only `Draft` purchase orders can be edited.
- A purchase order with receipts cannot be cancelled.
- Ordered quantity cannot exceed the approved requisition quantity.

## Acceptance Criteria

- Purchase order CRUD available.
- Creation from requisition works and links both documents.
- Automatic document numbering works.
- Status transitions enforced.

---

# 5. Goods Receipt and Inventory Replenishment

## Objective

Record received goods and keep inventory accurate.

## Features

Users can:

- Create a goods receipt from an issued purchase order.
- Receive full or partial quantities.
- Record the receiving warehouse.
- Reject damaged quantities.
- View receipt history.

## Business Rules

- Received quantity cannot exceed the ordered quantity.
- Each receipt creates a `Stock In` movement in the inventory module.
- Purchase order status updates to `Partially Received` or `Received` automatically.
- Inventory update and receipt creation must succeed or fail together.
- Rejected quantities do not increase inventory.

## Acceptance Criteria

- Goods receipt created from a purchase order.
- Inventory increased correctly.
- Partial receipt supported.
- Over-receipt rejected.
- Purchase order status reflects receipt progress.

---

# 6. Supplier Invoice and Three-Way Match

## Objective

Validate supplier invoices before payment is authorized.

## Features

Users can:

- Record a supplier invoice against a purchase order.
- Run the three-way match.
- View match discrepancies.
- Approve or hold an invoice.

## Business Rules

- Invoice quantity must match the received quantity.
- Invoice price must match the purchase order price.
- Discrepancies beyond the configured tolerance place the invoice on hold.
- A held invoice cannot be approved without a documented override.

## Acceptance Criteria

- Supplier invoice recorded against a purchase order.
- Three-way match executed automatically.
- Discrepancies reported clearly.
- Matching invoices approved; mismatched invoices held.

---

# 7. Procurement Dashboard and Reporting

## Objective

Provide procurement visibility to business users.

## Dashboard Metrics

Examples:

- Total Purchase Value.
- Pending Approvals.
- Open Purchase Orders.
- Pending Receipts.
- Invoices on Hold.
- Spend by Supplier.

## Acceptance Criteria

- Procurement metrics displayed.
- Date range filtering works.
- Data matches transactional records.
- Access is role-based.

---

# Database Design

## New Entities

```text
Supplier
PurchaseRequisition
PurchaseRequisitionLine
Approval
PurchaseOrder
PurchaseOrderLine
GoodsReceipt
GoodsReceiptLine
SupplierInvoice
SupplierInvoiceLine
```

---

# Supplier Table

```text
Supplier

id
supplierCode
name
email
phone
address
paymentTerms
status
createdAt
updatedAt
```

---

# Purchase Requisition Table

```text
PurchaseRequisition

id
requisitionNumber
requestedBy
departmentId
requiredDate
status
totalEstimatedAmount
createdAt
```

---

# Approval Table

```text
Approval

id
documentType
documentId
approverId
decision
comment
decidedAt
```

---

# Purchase Order Table

```text
PurchaseOrder

id
orderNumber
supplierId
requisitionId
orderDate
expectedDate
status
totalAmount
createdBy
```

---

# Goods Receipt Table

```text
GoodsReceipt

id
receiptNumber
purchaseOrderId
warehouseId
receiptDate
receivedBy
status
```

---

# Supplier Invoice Table

```text
SupplierInvoice

id
invoiceNumber
supplierId
purchaseOrderId
invoiceDate
dueDate
matchStatus
status
totalAmount
```

---

# Entity Relationships

```text
Employee → PurchaseRequisition → Approval

                    ↓

               PurchaseOrder → GoodsReceipt → SupplierInvoice

                    ↓               ↓

            PurchaseOrderLine   StockMovement

                    ↓               ↓

                Product         Inventory

Supplier → PurchaseOrder
```

---

# API Requirements

## Supplier APIs

```text
GET    /api/suppliers
POST   /api/suppliers
GET    /api/suppliers/{id}
PUT    /api/suppliers/{id}
```

---

## Purchase Requisition APIs

```text
GET    /api/procurement/requisitions
POST   /api/procurement/requisitions
GET    /api/procurement/requisitions/{id}
PUT    /api/procurement/requisitions/{id}
POST   /api/procurement/requisitions/{id}/submit
```

---

## Approval APIs

```text
GET    /api/procurement/approvals/pending
POST   /api/procurement/approvals/{id}/approve
POST   /api/procurement/approvals/{id}/reject
GET    /api/procurement/approvals/history/{documentId}
```

---

## Purchase Order APIs

```text
GET    /api/procurement/orders
POST   /api/procurement/orders
GET    /api/procurement/orders/{id}
POST   /api/procurement/orders/{id}/issue
POST   /api/procurement/orders/{id}/cancel
```

---

## Goods Receipt APIs

```text
POST   /api/procurement/receipts
GET    /api/procurement/receipts
GET    /api/procurement/orders/{id}/receipts
```

---

## Supplier Invoice APIs

```text
POST   /api/procurement/invoices
GET    /api/procurement/invoices
POST   /api/procurement/invoices/{id}/match
```

---

## Procurement Reporting APIs

```text
GET    /api/procurement/dashboard
GET    /api/procurement/reports/by-supplier
```

---

# GitHub Execution

---

# Epic

## Epic: Purchasing Management

Purpose:

Build the procure-to-pay capability required for ERP supply operations.

---

# GitHub Issues

---

# Issue 043 - Create Supplier Management Module

Type:

```
Feature
```

Acceptance Criteria:

- Supplier CRUD completed.
- Supplier Code uniqueness enforced.
- Supplier search implemented.

---

# Issue 044 - Create Purchase Requisition Module

Type:

```
Feature
```

Acceptance Criteria:

- Requisition CRUD completed.
- Multi-line requisitions supported.
- Submission locks the document.

---

# Issue 045 - Implement Requisition Approval Workflow

Type:

```
Feature
```

Acceptance Criteria:

- Approval routing uses the employee hierarchy.
- Approval limits enforced by role.
- Self-approval blocked.
- Approval history recorded.

---

# Issue 046 - Create Purchase Order Module

Type:

```
Feature
```

Acceptance Criteria:

- Purchase order created from an approved requisition.
- Automatic document numbering works.
- Status transitions enforced.

---

# Issue 047 - Implement Goods Receipt and Inventory Replenishment

Type:

```
Feature
```

Acceptance Criteria:

- Goods receipt created from a purchase order.
- Inventory increased through a stock movement.
- Partial receipt supported.
- Over-receipt rejected.

---

# Issue 048 - Implement Supplier Invoice Three-Way Match

Type:

```
Feature
```

Acceptance Criteria:

- Supplier invoice recorded against a purchase order.
- Three-way match executed.
- Discrepancies place the invoice on hold.

---

# Issue 049 - Create Procurement Dashboard

Type:

```
Feature
```

Acceptance Criteria:

- Procurement metrics displayed.
- Pending approvals visible.
- Access is role-based.

---

# Development Workflow

Every change follows:

```text
GitHub Issue

        ↓

Feature Branch

        ↓

Development

        ↓

Commit

        ↓

Pull Request

        ↓

Code Review

        ↓

Merge

        ↓

Release
```

---

# Testing Requirements

## Unit Testing

Required:

- Approval routing rules.
- Approval limit calculations.
- Self-approval prevention.
- Receipt quantity validation.
- Three-way match logic and tolerance handling.

---

## Integration Testing

Test:

- Supplier APIs.
- Requisition APIs.
- Approval APIs.
- Purchase Order APIs.
- Goods Receipt APIs and inventory side effects.
- Supplier Invoice APIs.

---

## End-to-End Testing

### Procure-to-Pay Flow

```text
Create Supplier

        ↓

Create Requisition

        ↓

Submit for Approval

        ↓

Approve Requisition

        ↓

Create Purchase Order

        ↓

Issue Purchase Order

        ↓

Receive Goods

        ↓

Verify Inventory Increased

        ↓

Record Supplier Invoice

        ↓

Three-Way Match Passes
```

---

### Approval Rejection Flow

```text
Submit Requisition

        ↓

Approver Rejects with Reason

        ↓

Requisition Status = Rejected

        ↓

No Purchase Order Can Be Created
```

---

# Documentation Deliverables

## Business Documentation

- Purchasing BRD.
- Procure-to-pay process flow.
- Approval matrix and authorization limits.

---

## Technical Documentation

- Purchasing module architecture.
- Updated ERD.
- Procurement API documentation.
- ADR: approval routing design.

---

# Sprint Deliverables

## Purchasing Module

Completed:

- Supplier Management.
- Purchase Requisitions.
- Approval Workflow.
- Purchase Orders.
- Goods Receipt.
- Supplier Invoice Matching.
- Procurement Dashboard.

---

## Engineering

Completed:

- APIs implemented.
- Database updated.
- Approval routing implemented.
- Automated tests created.

---

## Documentation

Completed:

- Procurement workflows documented.
- Approval matrix documented.
- Technical design updated.

---

# Sprint Review

The learner demonstrates:

1. Create a supplier.
2. Raise a purchase requisition.
3. Route and approve the requisition.
4. Create and issue a purchase order.
5. Receive goods and show inventory increase.
6. Record a supplier invoice and run the three-way match.
7. View the procurement dashboard.

---

# Sprint Retrospective

## Discussion Topics

- Approval workflow design.
- Segregation of duties.
- Handling partial receipts.
- Lessons learned.
- Process improvements.

---

# Release

**Version:** `v0.8.0`

---

# Release Notes

```markdown
# v0.8.0

## Added

- Supplier Management
- Purchase Requisitions
- Requisition Approval Workflow
- Purchase Order Management
- Goods Receipt and Inventory Replenishment
- Supplier Invoice Three-Way Match
- Procurement Dashboard
```

---

# Definition of Done

Sprint 07 is complete when:

- [ ] Supplier management completed.
- [ ] Purchase requisitions completed.
- [ ] Approval workflow completed.
- [ ] Purchase orders completed.
- [ ] Goods receipt and inventory replenishment completed.
- [ ] Three-way match completed.
- [ ] Procurement dashboard completed.
- [ ] APIs documented.
- [ ] Tests passing.
- [ ] Documentation completed.
- [ ] Pull Request approved.
- [ ] Release v0.8.0 published.

---

# Skills Acquired

After completing Sprint 07, learners will understand:

## Business Analysis

- Procure-to-pay workflows.
- Authorization limits and approval matrices.
- Business controls and segregation of duties.

---

## Backend Development

- Workflow state management.
- Hierarchy-based routing.
- Document matching logic.
- Transactional inventory updates.

---

## Frontend Development

- Approval queues and inboxes.
- Multi-step document interfaces.
- Procurement dashboards.

---

## ERP Engineering

- Designing controlled business processes.
- Building auditable approval trails.
- Completing the inventory supply cycle.

---

# Next Sprint Preview

# Sprint 08 - Finance & Accounting

Planned:

- Chart of Accounts.
- Journal Entries and Double-Entry Posting.
- General Ledger.
- Accounts Receivable and Accounts Payable.
- Payment Processing.
- Financial Reporting.
