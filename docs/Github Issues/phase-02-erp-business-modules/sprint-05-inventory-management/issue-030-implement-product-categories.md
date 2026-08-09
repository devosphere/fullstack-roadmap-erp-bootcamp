# [FEATURE] Implement Product Categories

<!-- GitHub title: [FEATURE] Implement Product Categories
     Labels: feature, inventory, priority: medium
     Milestone: Sprint 05 - Inventory Management
     Branch: feature/030-implement-product-categories
     Epic: Inventory Management
     Blocks: 029
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [x] Medium
- [ ] High
- [ ] Critical

## Module: inventory
## Sprint: Sprint 05 - Inventory Management

---

## Summary

Create product categories with support for nesting, so products can be grouped and reported on by
category hierarchy.

## Background

Categories are how a catalogue stays navigable as it grows. A flat list of 5,000 products is
unusable; the same list under Electronics → Computers → Laptops is not.

Categories nest, which makes this the third self-referencing hierarchy in the system after
departments (Issue 017) and the employee reporting line (Issue 021). The cycle-prevention and
traversal logic is the same problem for the third time — a signal worth noting for the shared
domain layer extracted in Sprint 14.

Categories are also a reporting dimension. Sprint 09 groups sales and stock turnover by category,
which means "all products under Electronics" must include products in every descendant category,
not just direct children.

## User Story

As an Inventory Manager,
I want to organize products into nested categories,
So that the catalogue stays navigable and stock can be reported by product group.

## Acceptance Criteria

```gherkin
Given an authenticated inventory manager
When they create a category under an existing parent
Then the category is created and appears nested beneath its parent
```

```gherkin
Given category A is an ancestor of category B
When a user attempts to set B as the parent of A
Then the request is rejected because it would create a cycle
```

```gherkin
Given a category containing products or child categories
When a user attempts to delete it
Then the request is rejected with a clear message
```

```gherkin
Given a parent category with products in its descendant categories
When products are requested for that parent
Then products from all descendant levels are included
```

- [ ] `GET /api/product-categories` lists categories
- [ ] `GET /api/product-categories/tree` returns the nested hierarchy
- [ ] `POST /api/product-categories` creates a category
- [ ] `GET /api/product-categories/{id}` returns a category
- [ ] `PUT /api/product-categories/{id}` updates a category
- [ ] `DELETE /api/product-categories/{id}` deletes only when unreferenced
- [ ] `GET /api/product-categories/{id}/products` returns products including descendants
- [ ] Category code uniqueness enforced
- [ ] Parent category optional — top-level categories have no parent
- [ ] Circular parent references rejected at any depth
- [ ] A category cannot be its own parent
- [ ] Categories with products or children cannot be deleted
- [ ] Categories can be deactivated instead
- [ ] Product count per category available, including descendants
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Products are organized into a navigable hierarchy. Querying a parent category returns everything
beneath it, and invalid structures are rejected at write time.

---

## Scope

### Included

- Category CRUD endpoints
- Self-referencing parent hierarchy
- Tree retrieval endpoint
- Cycle prevention at any depth
- Descendant-inclusive product listing
- Deletion guards and deactivation
- Product counts
- Permission enforcement
- ERD update

### Out of Scope

- Products themselves (Issue 029)
- Category-based pricing rules (Sprint 06)
- Category-based reporting (Sprint 09, Issue 059)
- Category images and merchandising attributes

## Technical Requirements

**Endpoints**

```text
GET    /api/product-categories
GET    /api/product-categories/tree
POST   /api/product-categories
GET    /api/product-categories/{id}
PUT    /api/product-categories/{id}
DELETE /api/product-categories/{id}
GET    /api/product-categories/{id}/products
```

**Schema**

```text
ProductCategory

id
categoryCode       unique
name
description
parentCategoryId   → ProductCategory, nullable
status             enum: ACTIVE | INACTIVE
createdAt
updatedAt
```

**Hierarchy example**

```text
Electronics
    Computers
        Laptops
        Desktops
    Peripherals

Furniture
    Office Furniture

Raw Materials
```

**Validation rules**

- `parentCategoryId` cannot equal the category's own id.
- The proposed parent must not appear in the category's descendant set — validate the full chain,
  not just the direct parent.
- A category with `status = INACTIVE` cannot be assigned to new products.

**Descendant query**

```text
GET /api/product-categories/{id}/products
```

Returns products whose category is the given category **or any descendant of it**. Implement this
with a recursive query rather than fetching the tree and issuing one query per node.

**Permissions to add**

```text
PRODUCT_CATEGORY_READ
PRODUCT_CATEGORY_CREATE
PRODUCT_CATEGORY_UPDATE
PRODUCT_CATEGORY_DELETE
```

## Dependencies

None — this issue can start immediately and should land before or with Issue 029.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for cycle detection at depth 1, 2, and 3+
- [ ] Unit tests for deletion guards
- [ ] Integration tests for all endpoints including the tree endpoint
- [ ] Test confirming descendant-inclusive product listing returns nested products
- [ ] Test confirming the descendant query does not issue one query per node
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md` § 2 |
| Epic | Inventory Management |
| Same pattern as | Issue 017 (departments), Issue 021 (reporting line) |
| Consolidated by | Issue 089 (Sprint 14, shared domain layer) |
| Pull Request | _to be linked_ |
