# [FEATURE] Create Customer Management Module

<!-- GitHub title: [FEATURE] Create Customer Management Module
     Labels: feature, sales, priority: high
     Milestone: Sprint 06 - Sales Management
     Branch: feature/036-create-customer-management-module
     Epic: Sales Management
     Blocks: 038, 039
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
- [x] High
- [ ] Critical

## Module: sales
## Sprint: Sprint 06 - Sales Management

---

## Summary

Create customer master data management: customer records with codes, billing and shipping
addresses, payment terms, and credit limits, searchable and maintainable by sales users.

## Background

The customer record is referenced by every sales document and, from Sprint 08, by every
receivable. Two fields on it carry more weight than they appear to:

- **Payment terms** determine the due date on every invoice this customer receives. Storing them on
  the customer rather than entering them per invoice means the terms are applied consistently and
  can be changed in one place.
- **Credit limit** is the control that prevents selling more to a customer than the business is
  willing to risk. It is captured here and enforced at order confirmation in Issue 039.

Billing and shipping addresses are separate because they genuinely differ — goods go to a warehouse,
invoices go to an accounts department. Collapsing them into one field seems simpler until the first
customer needs both.

Like every master record in this system, customers are deactivated rather than deleted: historical
orders must keep resolving.

## User Story

As a Sales Representative,
I want to maintain customer records with their terms and addresses,
So that sales documents carry correct, consistent customer information.

## Acceptance Criteria

```gherkin
Given an authenticated sales user
When they create a customer with a unique code and required details
Then the customer is created with status Active
```

```gherkin
Given an existing customer code
When a user attempts to create another customer with the same code
Then the request is rejected with a clear validation message
```

```gherkin
Given a customer referenced by sales documents
When a user attempts to delete them
Then the request is rejected and deactivation is offered instead
```

```gherkin
Given a deactivated customer
When a user attempts to create a new sales order for them
Then the request is rejected
```

- [ ] `GET /api/customers` lists customers with search, filtering, and pagination
- [ ] `POST /api/customers` creates a customer
- [ ] `GET /api/customers/{id}` returns a customer
- [ ] `PUT /api/customers/{id}` updates a customer
- [ ] `PATCH /api/customers/{id}/status` activates or deactivates
- [ ] `GET /api/customers/{id}/documents` lists the customer's sales documents
- [ ] Customer code uniqueness enforced at the database level
- [ ] Customer code auto-generated if not supplied
- [ ] Billing and shipping addresses stored separately
- [ ] Shipping address defaults to billing when not supplied
- [ ] Payment terms stored and used for invoice due dates
- [ ] Credit limit stored
- [ ] Contact person details stored
- [ ] Tax registration number stored
- [ ] Customers are never hard-deleted
- [ ] Deactivated customers rejected on new sales documents
- [ ] Search by code, name, email, and contact person
- [ ] Customer list indexed for search performance
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Sales users maintain a clean customer list. Every sales document from Issue 038 onward references a
customer by id and inherits their terms and addresses automatically.

---

## Scope

### Included

- Customer CRUD endpoints
- Code uniqueness and auto-generation
- Billing and shipping addresses
- Payment terms and credit limit
- Contact and tax details
- Activation and deactivation
- Document history per customer
- Search, filtering, and pagination
- Permission enforcement
- ERD update

### Out of Scope

- Price lists (Issue 037)
- Credit limit enforcement at order confirmation (Issue 039)
- Quotations, orders, deliveries, and invoices (Issues 038-041)
- Customer statements and aging (Sprint 08, Issue 053)
- Customer portal or self-service
- Customer segmentation and pricing tiers

## Technical Requirements

**Endpoints**

```text
GET    /api/customers
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
PATCH  /api/customers/{id}/status
GET    /api/customers/{id}/documents
```

**Schema**

```text
Customer

id
customerCode          unique
name
contactPerson
email
phone
taxNumber

billingAddressLine1
billingAddressLine2
billingCity
billingCountry

shippingAddressLine1
shippingAddressLine2
shippingCity
shippingCountry

paymentTermsDays      integer, e.g. 30 for Net 30
creditLimit           decimal
status                enum: ACTIVE | INACTIVE
createdAt
updatedAt
```

**Payment terms**

Stored as a number of days rather than a label. `Net 30` becomes `30`, which Issue 041 adds to the
invoice date without parsing text.

**Indexes**

```text
(customerCode)   unique
(name)           for search
(email)          for search
```

**Permissions to add**

```text
CUSTOMER_READ
CUSTOMER_CREATE
CUSTOMER_UPDATE
CUSTOMER_STATUS_CHANGE
```

**Rules**

- Uniqueness enforced by a database constraint, not only application validation.
- Monetary values use a decimal type, never a floating-point type.
- Deactivation is a status change; the record and its document history remain.

## Dependencies

- Issue 013 — the permission guard.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for code generation and validation rules
- [ ] Unit test confirming shipping address defaults to billing
- [ ] Integration tests for all endpoints
- [ ] Test confirming concurrent creation with the same code fails at the constraint
- [ ] Test confirming deactivated customers are rejected on new documents
- [ ] Search performance verified on a seeded customer list
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md` § 1 |
| Epic | Sales Management |
| Payment terms used by | Issue 041 (invoice due dates) |
| Credit limit enforced by | Issue 039 (order confirmation) |
| Pull Request | _to be linked_ |
