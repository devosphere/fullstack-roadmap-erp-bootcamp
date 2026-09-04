# Invariants: Rules the Database Cannot Enforce

## Why This File Exists

A schema can only express so much. Postgres will happily stop you from
saving a `sales_order_line` with no `product_id`, or two departments with the
same code in one company — those are structural rules, and a `NOT NULL` or a
`@@unique` constraint is enough.

But a large part of what makes this ERP *correct* is not structural. It's
rules like "the cached stock count must always equal the sum of the ledger
that backs it" — and Postgres has no built-in way to say that. Every rule on
this page is a promise the schema *implies* but does not *enforce*. Keeping
that promise is the service layer's job.

**Read this file before writing any service that touches money, stock, leave
balances, or approvals.** Every rule below has a concrete way to break it if
ignored, and most of the breakage is silent — it will not throw an error, it
will just be wrong, and it may take months to notice.

The general fix for the "cached counter" category below is always the same
shape: **write the counter and its ledger row inside one database
transaction** (`prisma.$transaction(...)`), so the two either both succeed
or both fail together. Never write one and then the other in separate
calls.

## Cached Counters That Must Match Their Ledger

These pairs exist for performance — reading a running total is much cheaper
than summing thousands of rows on every page load — but the ledger is the
source of truth, and the counter is only a cache of it.

| Counter | Must equal | If they disagree |
| --- | --- | --- |
| [`leave_balance.used_days`](03-human-resources.md#leave_balance) | Sum of [`leave_balance_transaction.days`](03-human-resources.md#leave_balance_transaction) for that balance | An employee sees the wrong number of days remaining. |
| [`inventory.quantity_on_hand`](04-inventory.md#inventory) | Sum of [`stock_movement.quantity`](04-inventory.md#stock_movement) for that product/warehouse | The system thinks stock exists that was already sold, or vice versa. |
| [`sales_order_line.delivered_quantity`](05-sales.md#sales_order--sales_order_line) | Sum of matching [`delivery_line.quantity`](05-sales.md#delivery--delivery_line) rows, and must never exceed `quantity` | An order shows as fully delivered when it wasn't, or can be over-shipped. |
| [`purchase_order_line.received_quantity`](06-purchasing.md#purchase_order--purchase_order_line) | Sum of accepted [`goods_receipt_line.accepted_quantity`](06-purchasing.md#goods_receipt--goods_receipt_line) rows, and must never exceed `quantity` | A PO looks fully received when goods are still outstanding. |
| [`receivable.outstanding_amount`](07-finance.md#receivable) | `original_amount` minus the sum of [`payment_application.applied_amount`](07-finance.md#payment--payment_application) against it | AR shows a customer owing money they already paid. |
| [`payable.outstanding_amount`](07-finance.md#payable) | `original_amount` minus the sum of `payment_application.applied_amount` against it | AP shows a supplier bill as unpaid after it was settled. |

## Double-Entry Rules (Finance)

| Rule | Where | Why |
| --- | --- | --- |
| `SUM(debit_amount) = SUM(credit_amount)` across all lines | [`journal_entry`](07-finance.md#journal_entry--journal_entry_line) — checked before `status` can move from `DRAFT` to `POSTED` | This *is* double-entry bookkeeping. An entry that doesn't balance is not a valid accounting record — the whole discipline exists to catch exactly this kind of error. |
| Exactly one of `debit_amount` / `credit_amount` is non-zero | [`journal_entry_line`](07-finance.md#journal_entry--journal_entry_line), per line | A line that is both a debit and a credit (or neither) is meaningless. |
| No entry may post into a `CLOSED` period | [`fiscal_period.status`](07-finance.md#fiscal_period) checked at posting time | This is what makes closing a period mean anything — a "closed" month whose numbers can still change isn't actually closed. |

## Exactly-One-Of Rules

These model a value that must be one of two things, never both and never
neither — the alternative (one shared "party" column) would lose real
foreign-key protection, as discussed when the schema was designed.

| Rule | Where |
| --- | --- |
| Exactly one of `customer_id` / `supplier_id` is set, matching `payment_type` | [`payment`](07-finance.md#payment--payment_application) |
| Exactly one of `receivable_id` / `payable_id` is set | [`payment_application`](07-finance.md#payment--payment_application), and the sum of `applied_amount` for one payment must not exceed that payment's `amount` |

## Tenant Integrity

| Rule | Where | Why |
| --- | --- | --- |
| `employee.company_id` must equal `employee.user.company_id` | [`employee`](02-organization.md#employee) | An employee record and its login must belong to the same tenant. Nothing in the schema ties these together — set `company_id` from the linked user's company when creating an employee, never from request input directly. |

## Loose References That Skip Foreign Keys

A handful of relationships are deliberately *not* real foreign keys, because
the referenced table changes depending on context. The trade-off is that the
database cannot protect you from a dangling reference — the service must.

| Field(s) | Where | Handle by |
| --- | --- | --- |
| `document_type` + `document_id` | [`workflow_instance`](09-workflow.md#workflow_instance) | Deleting any document that can go through approval must cancel its `workflow_instance` rows in the same transaction. |
| `source_type` + `source_id` | [`journal_entry`](07-finance.md#journal_entry--journal_entry_line) | Read-only lineage — nothing currently deletes journal entries, so this is lower risk, but the same care applies if that ever changes. |
| `reference_type` + `reference_id` | [`stock_movement`](04-inventory.md#stock_movement) | Same as above. |

## Structural Rules With No Constraint to Express Them

| Rule | Where | Why |
| --- | --- | --- |
| No cycles in the account tree | [`account.parent_account_id`](07-finance.md#account) | A ring of accounts each claiming the next as its parent would make financial statement roll-ups infinite-loop. |
| No overlapping `ACTIVE` date ranges for the same `(product_id, currency)` | [`price_list`](05-sales.md#price_list) | Two valid prices on the same day makes "what does this cost today?" ambiguous. |
| `created_by` must differ from `approved_by` | [`inventory_adjustment`](04-inventory.md#inventory_adjustment) | The whole point of requiring approval on a stock write-off is a second pair of eyes — one person reporting and approving their own adjustment defeats it. |
| No overlapping active date ranges for the same `delegator_id` | [`delegation`](09-workflow.md#delegation) | Two simultaneous delegations make "who is currently standing in for this person?" ambiguous. |
| Read with a row lock inside the creating transaction | [`document_sequence`](11-platform.md#document_sequence) | Without `SELECT ... FOR UPDATE`, two concurrent requests can read the same `last_number` and mint the same document number twice. |

## Append-Only Tables

These tables are written once per row and never updated or deleted — which
is also why none of them has an `updated_at` column. Treating one of these
as editable (fixing a mistake by `UPDATE` instead of inserting a correcting
row) breaks the property that makes each of them trustworthy: a complete,
unaltered history.

- [`employment_history`](03-human-resources.md#employment_history)
- [`leave_balance_transaction`](03-human-resources.md#leave_balance_transaction)
- [`stock_movement`](04-inventory.md#stock_movement)
- [`workflow_audit_log`](09-workflow.md#workflow_audit_log)
- [`security_audit_log`](10-security.md#security_audit_log)

A posted `journal_entry` is a related case: not append-only as a table (it
starts `DRAFT` and can be edited before posting), but **immutable once
`POSTED`**. A mistake there is corrected by posting a new entry that
reverses it (`reversal_of_id`), never by editing the original.

## Seed Data Required Before Features Work Correctly

Not a database rule, but the same category of "silently wrong, not
obviously broken":

- [`holiday`](03-human-resources.md#holiday) must be populated with a
  company's public holidays *before* leave requests are tested. An empty
  holiday table doesn't error — it just silently over-counts every leave
  request's working days, because the calculation has nothing to exclude.
- [`leave_type`](03-human-resources.md#leave_type) must exist before any
  `leave_request` can be created, since every request requires one.

## Keeping This List Accurate

When you add a new cached counter, a new append-only table, or a new
exactly-one-of relationship anywhere in the schema, add a row here in the
same Pull Request. This file is the single place these rules live — do not
duplicate them into individual module files beyond a short pointer back
here.
