# Database Documentation: ERP System

## Document Information

| Field | Value |
| --- | --- |
| Document Type | Data Dictionary |
| Product | Enterprise Resource Planning System |
| Scope | `backend/prisma/schema.prisma` — all modules |
| Status | Draft |
| Owner | Technical Lead |
| Reviewers | Backend Lead, QA Lead |
| Related Architecture | `docs/Architecture/README.md` |
| Related ERD (system-level) | `docs/Architecture/` |
| Source of truth | `backend/prisma/schema.prisma` |

## 1. Purpose

This folder explains what each database table and field is *for*, in plain
language, for a developer who has not read the schema yet. `docs/Architecture/`
explains how the system is structured; this folder explains what the data
means.

If this document and the schema ever disagree, **the schema is correct** —
these files describe it, they do not define it. When you change
`schema.prisma`, update the matching file here in the same Pull Request.

## 2. How This Folder Is Organized

One file per module, in the order the modules were built:

| File | Module | Sprint |
| --- | --- | --- |
| [01-identity-access.md](01-identity-access.md) | Users, roles, permissions | 02 |
| [02-organization.md](02-organization.md) | Company, departments, positions, employees | 03 |
| [03-human-resources.md](03-human-resources.md) | Attendance, leave, holidays | 04 |
| [04-inventory.md](04-inventory.md) | Products, warehouses, stock | 05 |
| [05-sales.md](05-sales.md) | Quotation → order → delivery → invoice | 06 |
| [06-purchasing.md](06-purchasing.md) | Requisition → PO → receipt → invoice | 07 |
| [07-finance.md](07-finance.md) | Accounts, journals, AR/AP, payments | 08 |
| [08-reporting.md](08-reporting.md) | Report catalog, exports, schedules | 09 |
| [09-workflow.md](09-workflow.md) | Approval engine, notifications | 10 |
| [10-security.md](10-security.md) | Audit log, sessions, MFA | 11 |
| [11-platform.md](11-platform.md) | Document numbering, account mappings | — |
| [invariants.md](invariants.md) | Rules the database cannot enforce | all |

Each module file has the same shape:

1. A one-paragraph summary of what the module does.
2. A Mermaid ER diagram of that module's tables.
3. One section per table: a plain-language purpose sentence, then a field
   table.

**`invariants.md` is the one file every contributor should read before writing
a service that touches money, stock, or leave balances.** It lists every rule
that the schema *implies* but Postgres cannot check — the rules your code has
to enforce by hand.

## 3. Conventions Used Throughout the Schema

These apply across every module, so they are explained once here instead of
repeated in every file.

### Multi-tenant by design

Almost every table carries a `company_id`. This is a multi-company system: one
database can hold several companies' data side by side, and a `company_id`
column on a table means every row belongs to exactly one company. Every query
in the service layer must filter by the caller's `company_id` — the database
does not do this automatically.

A handful of tables intentionally have **no** `company_id`. These are auth
infrastructure that exists before a tenant is known — `login_attempt`,
`refresh_token`, `password_reset_token`, `user_mfa_setting` — see
[10-security.md](10-security.md).

### Master data is deactivated, never deleted

Tables like `company`, `department`, `product`, `customer`, and `supplier` use
a `status` field (`ACTIVE` / `INACTIVE`) instead of being deleted. A supplier
referenced by a three-year-old invoice cannot be removed without breaking that
invoice's history, so "deleting" a supplier means hiding it from new
transactions while keeping the row intact.

### Ledger tables and cached counters

Several places in the schema store a running total twice: once as a fast
counter on a "current state" table, and once as a full history in an
append-only ledger table. For example:

- `inventory.quantity_on_hand` (counter) is backed by `stock_movement`
  (ledger) — every stock change is a row, and the counter should always equal
  the sum of those rows.
- `leave_balance.used_days` (counter) is backed by
  `leave_balance_transaction` (ledger).

The counter exists so a screen can show "42 units in stock" without summing
thousands of rows on every page load. The ledger exists so you can always
answer "why is it 42?" and rebuild the counter if it ever drifts. **Both must
be written together, in the same database transaction** — see
[invariants.md](invariants.md).

### Actor fields point at `user`, not `employee`

Fields like `created_by`, `approved_by`, `corrected_by`, and `posted_by`
reference `user` — the login that was active when the action happened — not
`employee`. Not every user is an employee (an auditor account, a service
account), so actor fields use the table that is guaranteed to exist.

Contrast this with fields that describe an HR fact, like `leave_request.
employee_id` or `sales_order.warehouse_id` — those reference the business
entity, not the login.

### Snapshotted line prices

Every document line (a `sales_order_line`, a `purchase_order_line`, a
`sales_invoice_line`, and so on) stores its own `unit_price`. It does **not**
look up the current price from `product` or `price_list` at read time.
Changing a price list tomorrow must never change what a customer was quoted
last month.

### Stored totals, not derived ones

Every document header (`sales_order`, `sales_invoice`, `purchase_order`, and
so on) stores `subtotal`, `discount_total`, and `total_amount` directly,
rather than calculating them from its lines on every read. An issued invoice
must always show the amount the customer agreed to, independent of whether a
line item is edited later.

### Naming

- Tables and columns are `lowercase_snake_case`, matching the table already
  merged from Issue 007 (`model user`, table `"user"`).
- A table name is always singular (`employee`, not `employees`).
- A foreign key column is the referenced table's name plus `_id`
  (`department_id`, `approved_by`... except where the relation is not to the
  row's own type, e.g. `approved_by` references `user`, not an `approver`
  table).
- Money fields are always `Decimal`, never `Float` — floating-point rounding
  errors are not acceptable in a ledger.
- Quantity fields that can be fractional (kilograms, liters) are also
  `Decimal`, not `Int`.

## 4. Reading a Table Entry

Every table in this documentation follows the same format:

> ### `table_name`
>
> One sentence: what real-world thing this table represents, and why it
> exists as its own table rather than being part of another one.
>
> | Field | Type | Meaning |
> | --- | --- | --- |
> | `field_name` | Decimal | Plain-language explanation of what this number
> or value represents, including anything non-obvious (e.g. "signed — negative
> removes stock" or "derived, not stored"). |
>
> *Notes on relationships, constraints, or invariants specific to this table,
> in italics, where they matter.*

## 5. Keeping This Documentation Accurate

- Update the matching module file in the same Pull Request that changes
  `schema.prisma`. This is a Definition of Done item per `CLAUDE.md`.
- If a field's purpose needs an inline comment in the schema to explain a
  non-obvious decision, that comment is the authoritative version — copy its
  meaning into this documentation rather than paraphrasing from memory.
- New service-layer rules (things Postgres cannot enforce) belong in
  [invariants.md](invariants.md), not scattered across module files.
