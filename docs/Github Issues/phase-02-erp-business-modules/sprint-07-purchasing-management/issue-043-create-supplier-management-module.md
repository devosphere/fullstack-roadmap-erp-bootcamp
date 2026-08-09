# [FEATURE] Create Supplier Management Module

<!-- GitHub title: [FEATURE] Create Supplier Management Module
     Labels: feature, procurement, priority: high
     Milestone: Sprint 07 - Purchasing Management
     Branch: feature/043-create-supplier-management-module
     Epic: Purchasing Management
     Blocks: 046
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

## Module: procurement
## Sprint: Sprint 07 - Purchasing Management

---

## Summary

Create supplier master data management: supplier records with codes, addresses, payment terms, bank
details, and the products they supply.

## Background

The supplier record is the mirror of the customer record from Issue 036, with one difference that
matters: it holds **bank details**, which are the target of a well-known fraud pattern where an
attacker changes a supplier's account number and redirects payments.

That makes supplier bank details more sensitive than most master data. They belong behind a
separate permission from general supplier information, and every change to them should be
auditable. Sprint 11 revisits this specifically.

Payment terms drive the due date on every supplier invoice, as they do for customers. Storing them
on the supplier means terms are applied consistently rather than typed per invoice.

Supplier-product association is what makes purchase order entry usable: without it, a buyer scrolls
the entire catalogue to find what this supplier actually sells.

## User Story

As a Procurement Officer,
I want to maintain supplier records with their terms and supplied products,
So that purchase documents carry correct supplier information and buyers can find the right items.

## Acceptance Criteria

```gherkin
Given an authenticated procurement officer
When they create a supplier with a unique code and required details
Then the supplier is created with status Active
```

```gherkin
Given an existing supplier code
When a user attempts to create another supplier with the same code
Then the request is rejected with a clear validation message
```

```gherkin
Given a user without the supplier bank details permission
When they request a supplier record
Then bank details are absent from the response entirely
```

```gherkin
Given a supplier's bank details are changed
When the change is saved
Then an audit record captures the previous and new values and who made the change
```

```gherkin
Given a supplier referenced by purchase documents
When a user attempts to delete them
Then the request is rejected and deactivation is offered instead
```

- [ ] `GET /api/suppliers` lists suppliers with search, filtering, and pagination
- [ ] `POST /api/suppliers` creates a supplier
- [ ] `GET /api/suppliers/{id}` returns a supplier
- [ ] `PUT /api/suppliers/{id}` updates a supplier
- [ ] `PATCH /api/suppliers/{id}/status` activates or deactivates
- [ ] `PUT /api/suppliers/{id}/bank-details` updates bank details
- [ ] `GET /api/suppliers/{id}/products` lists products supplied
- [ ] `POST /api/suppliers/{id}/products` associates a product with a supplier
- [ ] `GET /api/suppliers/{id}/documents` lists the supplier's purchase documents
- [ ] Supplier code uniqueness enforced at the database level
- [ ] Supplier code auto-generated if not supplied
- [ ] Address and contact person details stored
- [ ] Payment terms stored and used for supplier invoice due dates
- [ ] Tax registration number stored
- [ ] Bank details stored behind a separate permission
- [ ] Bank detail changes written to the audit log with old and new values
- [ ] Supplier-product association with the supplier's product code and lead time
- [ ] Suppliers are never hard-deleted
- [ ] Deactivated suppliers rejected on new purchase orders
- [ ] Search by code, name, and contact person
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Procurement maintains a clean supplier list. Bank details are visible only to those who need them,
and every change to them is traceable.

---

## Scope

### Included

- Supplier CRUD endpoints
- Code uniqueness and auto-generation
- Address, contact, and tax details
- Payment terms
- Bank details behind a separate permission
- Bank detail change auditing
- Supplier-product association with lead times
- Activation and deactivation
- Document history per supplier
- Search, filtering, and pagination
- Permission enforcement
- ERD update

### Out of Scope

- Requisitions, purchase orders, receipts, and invoices (Issues 044-048)
- Supplier pricing and quotations
- Supplier performance scoring and rating
- Accounts payable and aging (Sprint 08, Issue 054)
- Payment execution (Sprint 08, Issue 055)
- Supplier portal or self-service

## Technical Requirements

**Endpoints**

```text
GET    /api/suppliers
POST   /api/suppliers
GET    /api/suppliers/{id}
PUT    /api/suppliers/{id}
PATCH  /api/suppliers/{id}/status
PUT    /api/suppliers/{id}/bank-details
GET    /api/suppliers/{id}/products
POST   /api/suppliers/{id}/products
GET    /api/suppliers/{id}/documents
```

**Schema**

```text
Supplier

id
supplierCode          unique
name
contactPerson
email
phone
taxNumber
addressLine1
addressLine2
city
country
paymentTermsDays      integer, e.g. 45 for Net 45
status                enum: ACTIVE | INACTIVE
createdAt
updatedAt

SupplierBankDetail

id
supplierId            → Supplier, unique
bankName
accountName
accountNumber
swiftCode
updatedBy             → User
updatedAt

SupplierProduct

id
supplierId            → Supplier
productId             → Product
supplierProductCode
leadTimeDays
isPreferred           boolean

unique (supplierId, productId)
```

**Bank detail sensitivity**

Bank details live in a separate table behind a separate permission for three reasons: they are a
fraud target, they are needed by fewer people than general supplier data, and separating them makes
"who can see account numbers?" a single answerable question.

```text
Response for a user without SUPPLIER_BANK_READ

    → bankDetail field is absent entirely, not null and not masked
```

An absent field does not confirm that details exist; a masked one does.

**Bank detail auditing**

Every change writes to the security audit log with the previous and new values, the user, and the
timestamp. This is the record that makes a redirected-payment fraud detectable after the fact.

**Payment terms**

Stored as a number of days. Issue 048 adds it to the invoice date without parsing text.

**Permissions to add**

```text
SUPPLIER_READ
SUPPLIER_CREATE
SUPPLIER_UPDATE
SUPPLIER_STATUS_CHANGE
SUPPLIER_BANK_READ
SUPPLIER_BANK_UPDATE
```

Grant the two bank permissions to a narrower group than the rest, and to different roles from each
other where possible.

## Dependencies

- Issue 029 — products, for supplier-product association.
- Issue 013 — the permission guard.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for code generation and validation rules
- [ ] Integration tests for all endpoints
- [ ] Test confirming bank details are absent for users without the permission
- [ ] Test confirming bank detail changes write old and new values to the audit log
- [ ] Test confirming concurrent creation with the same code fails at the constraint
- [ ] Test confirming deactivated suppliers are rejected on new purchase orders
- [ ] Denial tests for users without each permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md` § 1 |
| Epic | Purchasing Management |
| Mirror of | Issue 036 (customers) |
| Payment terms used by | Issue 048 |
| Bank details reviewed by | Issue 071 (Sprint 11) |
| Pull Request | _to be linked_ |
