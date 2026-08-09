# [FEATURE] Create Warehouse Management

<!-- GitHub title: [FEATURE] Create Warehouse Management
     Labels: feature, inventory, priority: high
     Milestone: Sprint 05 - Inventory Management
     Branch: feature/031-create-warehouse-management
     Epic: Inventory Management
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

Create warehouse management: physical storage locations with codes, addresses, assigned managers,
and a designated default warehouse.

## Background

Stock is not a single number per product. It is a number *per product per location*. A company with
a main warehouse and a branch has two independent quantities for the same item, and shipping from
the wrong one is a real operational failure.

Modelling warehouses now — rather than assuming one location and adding it later — avoids a
migration that would have to invent a location for every historical movement.

The warehouse manager assignment links inventory to the employee records from Sprint 03, which is
what makes stock accountability possible: an adjustment has an owner.

A default warehouse matters more than it appears. Sales deliveries and goods receipts both need a
location; without a default, every transaction requires an explicit choice, and users pick
whichever appears first in the list.

## User Story

As an Inventory Manager,
I want to define the company's warehouses,
So that stock can be tracked separately per physical location.

## Acceptance Criteria

```gherkin
Given an authenticated inventory manager
When they create a warehouse with a unique code and address
Then the warehouse is created with status Active
```

```gherkin
Given a warehouse holding stock
When a user attempts to delete it
Then the request is rejected and deactivation is offered instead
```

```gherkin
Given an existing default warehouse
When another warehouse is set as default
Then exactly one warehouse remains marked as default
```

```gherkin
Given a deactivated warehouse
When a user attempts to record a stock movement against it
Then the request is rejected
```

- [ ] `GET /api/warehouses` lists warehouses
- [ ] `POST /api/warehouses` creates a warehouse
- [ ] `GET /api/warehouses/{id}` returns a warehouse
- [ ] `PUT /api/warehouses/{id}` updates a warehouse
- [ ] `PATCH /api/warehouses/{id}/status` activates or deactivates
- [ ] `PATCH /api/warehouses/{id}/set-default` sets the default warehouse
- [ ] Warehouse code uniqueness enforced
- [ ] Address and contact details stored
- [ ] Warehouse manager assignable from employee records
- [ ] Exactly one warehouse marked as default at any time
- [ ] Warehouses holding stock cannot be deleted
- [ ] Deactivated warehouses rejected in new transactions
- [ ] Deactivation blocked while the warehouse holds stock
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

The company's storage locations are defined and maintainable. Stock and movements always reference
a valid, active warehouse, and one location is designated as the default for transactions.

---

## Scope

### Included

- Warehouse CRUD endpoints
- Code uniqueness
- Address and contact details
- Manager assignment from employee records
- Default warehouse designation
- Activation and deactivation with stock guards
- Permission enforcement
- ERD update

### Out of Scope

- Stock levels per warehouse (Issue 032)
- Stock movements and transfers (Issue 033)
- Bin, aisle, or shelf-level locations
- Warehouse capacity planning
- Multi-company warehouse partitioning

## Technical Requirements

**Endpoints**

```text
GET    /api/warehouses
POST   /api/warehouses
GET    /api/warehouses/{id}
PUT    /api/warehouses/{id}
PATCH  /api/warehouses/{id}/status
PATCH  /api/warehouses/{id}/set-default
```

**Schema**

```text
Warehouse

id
warehouseCode      unique
name
description
addressLine1
addressLine2
city
country
phone
managerId          → Employee, nullable
isDefault          boolean
status             enum: ACTIVE | INACTIVE
createdAt
updatedAt
```

**Default warehouse rule**

Setting a warehouse as default must clear the flag on the previous default in the same
transaction. Two defaults is a data error that silently misroutes transactions, so enforce it with
a partial unique index where the database supports one:

```text
unique (isDefault) where isDefault = true
```

**Deactivation guard**

```text
Warehouse holds stock (any Inventory row with quantity > 0)

        ↓

Deactivation rejected with a message naming the remaining stock
```

Deactivating a warehouse that still holds stock would make that stock invisible to operations while
still counting toward totals.

**Permissions to add**

```text
WAREHOUSE_READ
WAREHOUSE_CREATE
WAREHOUSE_UPDATE
WAREHOUSE_STATUS_CHANGE
```

## Dependencies

- Issue 019 — employee records, for manager assignment.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for uniqueness and default-warehouse rules
- [ ] Test confirming only one warehouse can be default, including under concurrent updates
- [ ] Test confirming deactivation is blocked while stock remains
- [ ] Integration tests for all endpoints
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md` § 3 |
| Epic | Inventory Management |
| Referenced by | Issues 032, 033, 040, 047 |
| Pull Request | _to be linked_ |
