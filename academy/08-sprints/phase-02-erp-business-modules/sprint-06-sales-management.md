# Sprint 06 - Sales Management

**Sprint:** Sprint 06  
**Phase:** Phase 02 - ERP Business Modules  
**Duration:** 4 Weeks  
**Release Target:** v0.7.0  
**Status:** Planned

---

# Sprint Goal

Implement the Sales Management module by introducing customer management, pricing, sales quotations, sales orders, order fulfillment, and sales invoicing.

At the end of this sprint, the ERP platform should support the complete order-to-cash workflow, from recording a customer inquiry to delivering goods and issuing an invoice.

---

# Sprint Context

Previous sprints established:

```text
Phase 00
Engineering Foundation

        ↓

Phase 01
Identity, Organization, Employees

        ↓

Sprint 04
Human Resource Management

        ↓

Sprint 05
Inventory Management
Products, Warehouses, Stock
```

Sprint 06 introduces revenue-generating operations.

The system evolves from:

```text
Managing Business Resources

        ↓

Selling Business Resources
```

Sales is the first module that consumes inventory. Every sales order that ships reduces stock recorded in Sprint 05, which makes this the first sprint where two business modules must stay consistent with each other.

---

# Business Outcome

After completing this sprint, the ERP platform will support:

- Customer master data management.
- Product pricing and price lists.
- Sales quotations.
- Sales order processing.
- Order fulfillment and delivery.
- Sales invoicing.
- Sales reporting and visibility.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- The order-to-cash business process.
- Customer master data management.
- Pricing and discount rules.
- Document lifecycle and status transitions.
- Cross-module transactions (sales reducing inventory).
- Data consistency across business modules.
- Business document numbering.

---

# Sprint Theme

## "Revenue Is a Workflow, Not a Record"

A sale is not a single database row.

It is a chain of business documents, each one derived from the previous:

```text
Quotation

        ↓

Sales Order

        ↓

Delivery

        ↓

Invoice

        ↓

Payment
```

Each document must be traceable back to the one before it.

---

# Business Capability

## Sales Management

The sales module provides capabilities for:

- Customer management.
- Pricing management.
- Quotation management.
- Order management.
- Fulfillment management.
- Sales reporting.

---

# Domain Concepts

---

# Customer

Represents an organization or person that buys from the company.

Example:

```text
Acme Corporation
billing@acme.com
Net 30
```

Stores:

- Customer Code.
- Customer Name.
- Contact Information.
- Billing Address.
- Shipping Address.
- Payment Terms.
- Status.

---

# Price List

Defines the selling price of a product.

Example:

```text
Product:   Laptop
Currency:  PHP
Price:     45,000.00
Valid From: 2026-01-01
```

A product can have different prices for different customers or periods.

---

# Sales Quotation

A price offer given to a customer before an order is confirmed.

Status flow:

```text
Draft → Sent → Accepted → Rejected → Expired
```

An accepted quotation can be converted into a Sales Order.

---

# Sales Order

A confirmed customer commitment to purchase.

Status flow:

```text
Draft → Confirmed → Partially Delivered → Delivered → Invoiced → Closed → Cancelled
```

---

# Sales Order Line

A single product line within a sales order.

Stores:

- Product.
- Quantity.
- Unit Price.
- Discount.
- Line Total.

---

# Delivery

Represents goods physically leaving the warehouse.

A delivery reduces inventory recorded in Sprint 05.

```text
Sales Order Confirmed

        ↓

Delivery Created

        ↓

Stock Movement (Stock Out)

        ↓

Inventory Reduced
```

---

# Sales Invoice

A financial request for payment issued to a customer.

Status flow:

```text
Draft → Issued → Paid → Overdue → Cancelled
```

Full accounting treatment of invoices is delivered in Sprint 08.

---

# Sprint Scope

---

# 1. Customer Management

## Objective

Create customer master data management.

## Features

Users can:

- Create customers.
- Update customer information.
- View customer profile.
- Search and filter customers.
- Deactivate customers.

## Business Rules

- Customer Code must be unique.
- A customer cannot be deleted if sales documents reference it.
- Deactivated customers cannot be selected on new orders.

## Acceptance Criteria

- Customer CRUD available.
- Customer Code uniqueness enforced.
- Customer list supports search and pagination.
- Access is role-based.

---

# 2. Pricing and Price Lists

## Objective

Define how selling prices are determined.

## Features

Users can:

- Define product selling prices.
- Set validity periods.
- Maintain multiple price lists.

## Business Rules

- A sales document uses the price valid on its document date.
- Price cannot be negative.
- Discounts cannot exceed the configured maximum.

## Acceptance Criteria

- Price list CRUD available.
- Correct price resolved for a given product and date.
- Invalid prices rejected with clear validation errors.

---

# 3. Sales Quotation

## Objective

Allow the sales team to offer prices before an order is confirmed.

## Features

Users can:

- Create quotations with multiple product lines.
- Calculate line totals and document totals.
- Send quotations to customers.
- Accept or reject quotations.
- Convert accepted quotations into sales orders.

## Business Rules

- Only `Draft` quotations can be edited.
- Only `Accepted` quotations can be converted.
- A quotation can be converted only once.
- Expired quotations cannot be accepted.

## Acceptance Criteria

- Quotation CRUD available.
- Totals calculated correctly.
- Status transitions enforced.
- Conversion to sales order works and links both documents.

---

# 4. Sales Order Management

## Objective

Record confirmed customer commitments.

## Features

Users can:

- Create sales orders directly or from a quotation.
- Add, edit, and remove order lines.
- Confirm orders.
- Cancel orders.
- View order history per customer.

## Business Rules

- Document numbers are generated automatically and are unique.
- Only `Draft` orders can be edited.
- A confirmed order cannot be edited, only cancelled.
- An order with deliveries cannot be cancelled.
- Order total equals the sum of its line totals.

## Acceptance Criteria

- Sales order CRUD available.
- Automatic document numbering works.
- Status transitions enforced.
- Order totals calculated correctly.

---

# 5. Order Fulfillment and Delivery

## Objective

Deliver ordered goods and keep inventory accurate.

## Features

Users can:

- Create a delivery from a confirmed sales order.
- Deliver full or partial quantities.
- View delivery history.

## Business Rules

- Delivered quantity cannot exceed the ordered quantity.
- Stock must be available in the selected warehouse.
- Each delivery creates a `Stock Out` movement in the inventory module.
- Order status updates to `Partially Delivered` or `Delivered` automatically.
- Inventory update and delivery creation must succeed or fail together.

## Acceptance Criteria

- Delivery created from a sales order.
- Inventory reduced correctly.
- Partial delivery supported.
- Over-delivery rejected.
- Insufficient stock rejected with a clear message.
- Order status reflects delivery progress.

---

# 6. Sales Invoicing

## Objective

Issue invoices for delivered goods.

## Features

Users can:

- Create an invoice from a sales order or delivery.
- View invoice details.
- Issue and cancel invoices.
- Record customer payment reference.

## Business Rules

- Invoices can only be created for delivered quantities.
- An issued invoice cannot be edited.
- Invoice due date is calculated from customer payment terms.
- Invoice total must match the delivered value.

## Acceptance Criteria

- Invoice created from delivery.
- Due date calculated from payment terms.
- Invoice totals correct.
- Status transitions enforced.

---

# 7. Sales Dashboard and Reporting

## Objective

Provide sales visibility to business users.

## Dashboard Metrics

Examples:

- Total Sales Value.
- Open Sales Orders.
- Pending Deliveries.
- Unpaid Invoices.
- Top Selling Products.
- Sales by Customer.

## Acceptance Criteria

- Sales metrics displayed.
- Date range filtering works.
- Data matches transactional records.
- Access is role-based.

---

# Database Design

## New Entities

```text
Customer
PriceList
SalesQuotation
SalesQuotationLine
SalesOrder
SalesOrderLine
Delivery
DeliveryLine
SalesInvoice
SalesInvoiceLine
```

---

# Customer Table

```text
Customer

id
customerCode
name
email
phone
billingAddress
shippingAddress
paymentTerms
status
createdAt
updatedAt
```

---

# Price List Table

```text
PriceList

id
productId
currency
unitPrice
validFrom
validTo
status
```

---

# Sales Order Table

```text
SalesOrder

id
orderNumber
customerId
quotationId
orderDate
status
totalAmount
createdBy
createdAt
```

---

# Sales Order Line Table

```text
SalesOrderLine

id
salesOrderId
productId
quantity
unitPrice
discount
lineTotal
```

---

# Delivery Table

```text
Delivery

id
deliveryNumber
salesOrderId
warehouseId
deliveryDate
status
createdBy
```

---

# Sales Invoice Table

```text
SalesInvoice

id
invoiceNumber
salesOrderId
customerId
invoiceDate
dueDate
status
totalAmount
```

---

# Entity Relationships

```text
Customer

        ↓

SalesQuotation → SalesOrder → Delivery → SalesInvoice

                      ↓            ↓

               SalesOrderLine  StockMovement

                      ↓            ↓

                  Product      Inventory
```

---

# API Requirements

## Customer APIs

```text
GET    /api/customers
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
```

---

## Price List APIs

```text
GET    /api/price-lists
POST   /api/price-lists
PUT    /api/price-lists/{id}
```

---

## Sales Quotation APIs

```text
GET    /api/sales/quotations
POST   /api/sales/quotations
PUT    /api/sales/quotations/{id}
POST   /api/sales/quotations/{id}/accept
POST   /api/sales/quotations/{id}/convert
```

---

## Sales Order APIs

```text
GET    /api/sales/orders
POST   /api/sales/orders
GET    /api/sales/orders/{id}
PUT    /api/sales/orders/{id}
POST   /api/sales/orders/{id}/confirm
POST   /api/sales/orders/{id}/cancel
```

---

## Delivery APIs

```text
POST   /api/sales/deliveries
GET    /api/sales/deliveries
GET    /api/sales/orders/{id}/deliveries
```

---

## Sales Invoice APIs

```text
POST   /api/sales/invoices
GET    /api/sales/invoices
GET    /api/sales/invoices/{id}
```

---

## Sales Reporting APIs

```text
GET    /api/sales/dashboard
GET    /api/sales/reports/by-customer
GET    /api/sales/reports/by-product
```

---

# GitHub Execution

---

# Epic

## Epic: Sales Management

Purpose:

Build the order-to-cash capability required for ERP revenue operations.

---

# GitHub Issues

---

# Issue 036 - Create Customer Management Module

Type:

```
Feature
```

Acceptance Criteria:

- Customer CRUD completed.
- Customer Code uniqueness enforced.
- Customer search implemented.

---

# Issue 037 - Implement Price List Management

Type:

```
Feature
```

Acceptance Criteria:

- Price list CRUD completed.
- Price validity periods supported.
- Correct price resolved by product and date.

---

# Issue 038 - Create Sales Quotation Module

Type:

```
Feature
```

Acceptance Criteria:

- Quotation CRUD completed.
- Document totals calculated.
- Quotation converts to a sales order.

---

# Issue 039 - Create Sales Order Module

Type:

```
Feature
```

Acceptance Criteria:

- Sales order CRUD completed.
- Automatic document numbering works.
- Order status transitions enforced.

---

# Issue 040 - Implement Order Fulfillment and Inventory Deduction

Type:

```
Feature
```

Acceptance Criteria:

- Delivery created from a sales order.
- Inventory reduced through a stock movement.
- Partial delivery supported.
- Over-delivery and insufficient stock rejected.

---

# Issue 041 - Implement Sales Invoicing

Type:

```
Feature
```

Acceptance Criteria:

- Invoice generated from delivered quantities.
- Due date calculated from payment terms.
- Invoice totals validated.

---

# Issue 042 - Create Sales Dashboard

Type:

```
Feature
```

Acceptance Criteria:

- Sales metrics displayed.
- Date filtering works.
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

- Line total and document total calculations.
- Discount rules.
- Price resolution by date.
- Document status transition rules.
- Due date calculation from payment terms.

---

## Integration Testing

Test:

- Customer APIs.
- Quotation APIs.
- Sales Order APIs.
- Delivery APIs and inventory side effects.
- Invoice APIs.

---

## End-to-End Testing

### Order-to-Cash Flow

```text
Create Customer

        ↓

Create Quotation

        ↓

Accept Quotation

        ↓

Convert to Sales Order

        ↓

Confirm Order

        ↓

Deliver Goods

        ↓

Verify Inventory Reduced

        ↓

Generate Invoice
```

---

### Partial Delivery Flow

```text
Confirm Order for 100 Units

        ↓

Deliver 60 Units

        ↓

Order Status = Partially Delivered

        ↓

Deliver 40 Units

        ↓

Order Status = Delivered
```

---

# Documentation Deliverables

## Business Documentation

- Sales BRD.
- Order-to-cash process flow.
- Pricing and discount rules.

---

## Technical Documentation

- Sales module architecture.
- Updated ERD.
- Sales API documentation.
- ADR: sales and inventory transaction consistency.

---

# Sprint Deliverables

## Sales Module

Completed:

- Customer Management.
- Price List Management.
- Sales Quotations.
- Sales Orders.
- Deliveries.
- Sales Invoices.
- Sales Dashboard.

---

## Engineering

Completed:

- APIs implemented.
- Database updated.
- Cross-module transactions implemented.
- Automated tests created.

---

## Documentation

Completed:

- Sales workflows documented.
- Technical design updated.

---

# Sprint Review

The learner demonstrates:

1. Create a customer.
2. Define product pricing.
3. Create and accept a quotation.
4. Convert the quotation to a sales order.
5. Deliver goods and show inventory reduction.
6. Generate an invoice.
7. View the sales dashboard.

---

# Sprint Retrospective

## Discussion Topics

- Document lifecycle design.
- Cross-module data consistency.
- Transaction handling between sales and inventory.
- Lessons learned.
- Process improvements.

---

# Release

**Version:** `v0.7.0`

---

# Release Notes

```markdown
# v0.7.0

## Added

- Customer Management
- Price List Management
- Sales Quotations
- Sales Order Management
- Order Fulfillment and Delivery
- Sales Invoicing
- Sales Dashboard
```

---

# Definition of Done

Sprint 06 is complete when:

- [ ] Customer management completed.
- [ ] Price list management completed.
- [ ] Sales quotations completed.
- [ ] Sales orders completed.
- [ ] Delivery and inventory deduction completed.
- [ ] Sales invoicing completed.
- [ ] Sales dashboard completed.
- [ ] APIs documented.
- [ ] Tests passing.
- [ ] Documentation completed.
- [ ] Pull Request approved.
- [ ] Release v0.7.0 published.

---

# Skills Acquired

After completing Sprint 06, learners will understand:

## Business Analysis

- Order-to-cash workflows.
- Sales document lifecycles.
- Pricing and discount policies.

---

## Backend Development

- Multi-line business documents.
- Document numbering strategies.
- Cross-module transactions.
- Status machine implementation.

---

## Frontend Development

- Multi-line document forms.
- Master-detail interfaces.
- Sales dashboards.

---

## ERP Engineering

- Designing connected business modules.
- Maintaining consistency across modules.
- Building revenue-generating capabilities.

---

# Next Sprint Preview

# Sprint 07 - Purchasing Management

Planned:

- Supplier Management.
- Purchase Requisitions.
- Approval Workflow.
- Purchase Orders.
- Goods Receipt.
- Procurement Reporting.
