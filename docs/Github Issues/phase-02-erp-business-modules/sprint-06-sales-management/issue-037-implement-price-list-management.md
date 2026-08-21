# [FEATURE] Implement Price List Management

<!-- GitHub title: [FEATURE] Implement Price List Management
     Labels: feature, sales, priority: high
     Milestone: Sprint 06 - Sales Management
     Branch: feature/037-implement-price-list-management
     Epic: Sales Management
     Depends on: 029
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

Implement price list management: selling prices per product with validity periods, resolved
automatically onto sales documents by product and date.

## Background

A price is not a property of a product — it is a property of a product **at a point in time**.
Storing `sellingPrice` on the product record means a price change silently rewrites history: last
month's order suddenly shows this month's price, and the revenue figures no longer match the
invoices the customer received.

Validity periods fix this. Each price has a `validFrom` and `validTo`, and a document resolves the
price valid on its own date:

```text
Order dated 15 March   →   price where validFrom <= 15 March <= validTo
```

The resolved price is then **copied onto the document line**. The price list answers "what should
this cost?"; the order line records "what it did cost". Both are needed — the second is what the
customer agreed to.

Overlapping validity periods for the same product are the main failure mode: two valid prices means
the resolution is arbitrary. That must be rejected at write time.

## User Story

As a Sales Manager,
I want to define selling prices with validity periods,
So that sales documents use the correct price for their date and historical prices remain intact.

## Acceptance Criteria

```gherkin
Given a product with a price of 45,000 valid from 1 January to 31 March
When a price is requested for that product dated 15 February
Then 45,000 is returned
```

```gherkin
Given a product with an existing price valid from 1 January to 31 March
When a user creates another price for the same product overlapping that period
Then the request is rejected with a clear message naming the conflict
```

```gherkin
Given a product with no price valid on a given date
When a price is requested for that date
Then a clear error is returned rather than zero or null
```

```gherkin
Given a price is entered as a negative value
When the request is submitted
Then it is rejected
```

- [ ] `GET /api/price-lists` lists prices with filtering by product and date
- [ ] `POST /api/price-lists` creates a price entry
- [ ] `GET /api/price-lists/{id}` returns a price entry
- [ ] `PUT /api/price-lists/{id}` updates a price entry
- [ ] `PATCH /api/price-lists/{id}/status` deactivates a price entry
- [ ] `GET /api/price-lists/resolve` returns the price valid for a product on a date
- [ ] Price resolved by product and effective date
- [ ] Validity period required: `validFrom` mandatory, `validTo` optional for open-ended
- [ ] Overlapping validity periods for the same product rejected
- [ ] Negative and zero prices rejected
- [ ] Currency stored per price entry
- [ ] Maximum discount percentage configurable per product
- [ ] Missing price for a date returns a clear error, not a default
- [ ] Price entries with document references cannot be deleted
- [ ] Price history retained and viewable per product
- [ ] Resolution exposed as a service method for Issues 038 and 039
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Sales documents resolve the correct price automatically for their date. Changing a price today does
not alter what yesterday's orders recorded.

---

## Scope

### Included

- Price list CRUD endpoints
- Validity period handling
- Overlap detection and rejection
- Price resolution by product and date
- Currency per entry
- Maximum discount configuration
- Price history per product
- Resolution service method for sales documents
- Permission enforcement
- ERD update

### Out of Scope

- Customer-specific or tier pricing
- Volume and quantity break pricing
- Promotional and campaign pricing
- Purchase cost prices (Sprint 07)
- Multi-currency conversion (a single currency is assumed for now)
- Inventory valuation (Sprint 08)

## Technical Requirements

**Endpoints**

```text
GET    /api/price-lists
POST   /api/price-lists
GET    /api/price-lists/{id}
PUT    /api/price-lists/{id}
PATCH  /api/price-lists/{id}/status
GET    /api/price-lists/resolve?productId=&date=
```

**Schema**

```text
PriceList

id
productId          → Product
currency
unitPrice          decimal, > 0
maxDiscountPercent decimal, default 0
validFrom          date
validTo            date, nullable for open-ended
status             enum: ACTIVE | INACTIVE
createdBy          → User
createdAt
updatedAt
```

**Overlap rule**

For a given `productId` and `currency`, no two `ACTIVE` entries may have intersecting validity
periods:

```text
Existing:  validFrom = 2026-01-01, validTo = 2026-03-31

Rejected:  validFrom = 2026-03-15, validTo = 2026-06-30      overlaps
Rejected:  validFrom = 2026-02-01, validTo = null            open-ended, overlaps
Accepted:  validFrom = 2026-04-01, validTo = 2026-06-30      no overlap
```

Treat a null `validTo` as infinity when checking. Validate against existing entries in the same
transaction as the insert, so two concurrent creates cannot both pass.

**Resolution service**

```text
resolvePrice(productId, date, currency)

    → returns the ACTIVE entry where validFrom <= date
      and (validTo is null or validTo >= date)

    → throws a domain error if no price is found
```

Returning zero or null on a missing price would produce a zero-value order line that looks
deliberate. Fail loudly instead.

**Copy-on-use**

Issues 038 and 039 call `resolvePrice` and store the returned `unitPrice` on the document line.
Documents never join to `PriceList` at read time.

**Rules**

- Monetary values use a decimal type, never a floating-point type.
- Discounts on a document line are validated against `maxDiscountPercent` for that product.

## Dependencies

- Issue 029 — products must exist.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for price resolution including boundary dates
- [ ] Unit tests for overlap detection including open-ended periods
- [ ] Test confirming a missing price raises a clear error
- [ ] Test confirming concurrent overlapping creates cannot both succeed
- [ ] Test confirming negative and zero prices are rejected
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md` § 2 |
| Epic | Sales Management |
| Consumed by | Issues 038, 039 |
| Pull Request | _to be linked_ |
