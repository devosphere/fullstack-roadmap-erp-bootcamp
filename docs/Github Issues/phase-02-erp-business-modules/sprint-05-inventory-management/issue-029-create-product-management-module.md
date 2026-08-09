# [FEATURE] Create Product Management Module

<!-- GitHub title: [FEATURE] Create Product Management Module
     Labels: feature, inventory, priority: high
     Milestone: Sprint 05 - Inventory Management
     Branch: feature/029-create-product-management-module
     Epic: Inventory Management
     Depends on: 030
     Blocks: 032
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

## Module: inventory
## Sprint: Sprint 05 - Inventory Management

---

## Summary

Create product master data management: product records with codes, categories, units of measure,
and reorder levels, searchable and maintainable by authorized users.

## Background

The product record is referenced by nearly every transaction in the remaining sprints — inventory
balances, stock movements, sales order lines, purchase order lines, and inventory valuation in
finance.

Two decisions matter beyond the CRUD:

- **Unit of measure is part of the product, not the transaction.** If a product is measured in
  boxes, every quantity everywhere means boxes. Allowing per-transaction units introduces
  conversion, and conversion errors in inventory are silent and expensive.
- **Products are deactivated, not deleted.** A deleted product breaks every historical order line
  that referenced it.

Product code uniqueness is what makes the catalogue usable at all — without it, the same item gets
entered twice and stock splits across both records.

## User Story

As an Inventory Manager,
I want to maintain a product catalogue with consistent codes and units,
So that stock, sales, and purchasing all refer to the same items unambiguously.

## Acceptance Criteria

```gherkin
Given an authenticated inventory manager
When they create a product with a unique code, category, and unit of measure
Then the product is created with status Active
```

```gherkin
Given an existing product code
When a user attempts to create another product with the same code
Then the request is rejected with a clear validation message
```

```gherkin
Given a product referenced by inventory or transaction records
When a user attempts to delete it
Then the request is rejected and deactivation is offered instead
```

```gherkin
Given a catalogue of many products
When a user searches by code, name, or category
Then matching products are returned, paginated
```

- [ ] `GET /api/products` lists products with search, filtering, and pagination
- [ ] `POST /api/products` creates a product
- [ ] `GET /api/products/{id}` returns a product
- [ ] `PUT /api/products/{id}` updates a product
- [ ] `PATCH /api/products/{id}/status` activates or deactivates a product
- [ ] Product code uniqueness enforced at the database level
- [ ] Product code auto-generated if not supplied
- [ ] Category assignment required
- [ ] Unit of measure required and immutable once transactions exist
- [ ] Reorder level and reorder quantity stored
- [ ] Barcode or SKU stored and searchable
- [ ] Products are never hard-deleted
- [ ] Deactivated products cannot be added to new transactions
- [ ] Search by code, name, barcode, and category
- [ ] Products list indexed for search performance
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

An inventory manager maintains a clean, searchable product catalogue. Every later module references
products by id and gets consistent codes, names, and units.

---

## Scope

### Included

- Product CRUD endpoints
- Code uniqueness and auto-generation
- Category assignment
- Unit of measure
- Reorder level configuration
- Barcode and SKU
- Activation and deactivation
- Search, filtering, and pagination
- Permission enforcement
- ERD update

### Out of Scope

- Product categories themselves (Issue 030)
- Stock levels (Issue 032) and movements (Issue 033)
- Selling prices (Sprint 06, Issue 037)
- Purchase costs and supplier pricing (Sprint 07)
- Inventory valuation (Sprint 08)
- Product variants, bundles, and serial number tracking
- Product images

## Technical Requirements

**Endpoints**

```text
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
PATCH  /api/products/{id}/status
```

**Schema**

```text
Product

id
productCode        unique
name
description
categoryId         → ProductCategory
unitOfMeasure      enum
barcode            nullable, unique when present
reorderLevel
reorderQuantity
status             enum: ACTIVE | INACTIVE
createdAt
updatedAt
```

**Unit of measure**

```text
PIECE
BOX
CARTON
KILOGRAM
GRAM
LITER
METER
PACK
```

Stored as an enum. Once any inventory or movement record exists for a product, the unit cannot be
changed — changing it would silently reinterpret every historical quantity.

**Indexes**

```text
(productCode)   unique
(barcode)       unique where not null
(categoryId)    for category filtering
(name)          for search
```

**Permissions to add**

```text
PRODUCT_READ
PRODUCT_CREATE
PRODUCT_UPDATE
PRODUCT_STATUS_CHANGE
```

**Rules**

- Uniqueness is enforced by a database constraint, not only by an application check — concurrent
  creates would otherwise both pass validation.
- Deactivation is a status change; the record and its history remain.

## Dependencies

- Issue 030 — product categories must exist. If 030 is not yet merged, coordinate so both land
  together.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for code generation and validation rules
- [ ] Unit test confirming unit of measure cannot change once transactions exist
- [ ] Integration tests for all endpoints
- [ ] Test confirming concurrent creation with the same code fails at the constraint
- [ ] Test confirming deactivated products are rejected in new transactions
- [ ] Search performance verified on a seeded catalogue
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md` § 1 |
| Epic | Inventory Management |
| Referenced by | Issues 032, 033, 037, 039, 046 |
| Pull Request | _to be linked_ |
