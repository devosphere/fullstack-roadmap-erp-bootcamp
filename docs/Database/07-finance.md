# Finance & Accounting

**Sprint 08.** The general ledger — where every sale, purchase, and payment
finally lands as a proper double-entry accounting record.

This is where every module built so far connects: issuing a sales invoice
posts a journal entry, receiving a supplier invoice posts one too, and a
payment settles both against the ledger. The theme for this module, from the
sprint spec itself, is **"every transaction has two sides."**

## Diagram

```mermaid
erDiagram
    account ||--o{ account : "rolls up to (self-reference)"
    account ||--o{ journal_entry_line : posts_to
    fiscal_period ||--o{ journal_entry : contains
    journal_entry ||--o{ journal_entry_line : contains
    journal_entry ||--o| journal_entry : "reverses (self-reference)"
    sales_invoice ||--o| receivable : creates
    supplier_invoice ||--o| payable : creates
    receivable ||--o{ payment_application : "settled by"
    payable ||--o{ payment_application : "settled by"
    payment ||--o{ payment_application : applies
    journal_entry ||--o{ receivable : backs
    journal_entry ||--o{ payable : backs
    journal_entry ||--o{ payment : backs

    account {
        string id PK
        string parent_account_id FK
        enum account_type
        boolean is_postable
    }
    journal_entry {
        string id PK
        string fiscal_period_id FK
        enum status
        string reversal_of_id FK UK
    }
    journal_entry_line {
        string id PK
        string journal_entry_id FK
        string account_id FK
        decimal debit_amount
        decimal credit_amount
    }
```

## Tables

### `account`

One entry in the chart of accounts — e.g. "1100 Accounts Receivable", "4100
Sales Revenue". Nested into a tree, unlike most other hierarchies in this
schema — see the note below.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `account_code` | String | The account number, unique within the company. |
| `name` | String | Display name. |
| `account_type` | Enum: `ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE` | Which of the five fundamental account categories this belongs to. |
| `parent_account_id` | String (FK), nullable, self-referencing | The account this rolls up into on a financial statement (e.g. "1100 Receivables" rolls up into "1000 Assets"). |
| `is_postable` | Boolean | Whether journal entries can be posted directly to this account. A summary account like "1000 Assets" is *not* postable — you post to its specific children ("1100 Receivables"), never to the rollup itself. |
| `status` | Enum: `ACTIVE`, `INACTIVE` | Whether this account is currently in use. |

*Unlike `department` or `product_category`, this hierarchy is nested on
purpose: a balance sheet's "Total Assets" line **is** the sum of this tree,
so the rollup structure is not optional here the way it was elsewhere.*

### `fiscal_period`

A reporting window — typically a month or quarter — that can be locked once
closed.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `name` | String | e.g. "January 2026". |
| `start_date`, `end_date` | Date | The period's date range. |
| `status` | Enum: `OPEN`, `CLOSED` | Whether entries can still be posted into this period. |
| `closed_by`, `closed_at` | String (FK → `user`), DateTime, nullable | Who closed the period, and when. |

*Once `CLOSED`, no journal entry may be posted into this period — this is
what stops a prior quarter's reported numbers from silently changing after
the fact. Enforced in the service; see [invariants.md](invariants.md).*

### `journal_entry` / `journal_entry_line`

A double-entry accounting record. Every entry has at least two lines, and
the sum of all debits must equal the sum of all credits.

**`journal_entry`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `entry_number` | String | Human-readable reference (e.g. `JE-2026-00042`). |
| `entry_date` | Date | The accounting date of this entry. |
| `fiscal_period_id` | String (FK) | Which period this entry belongs to. |
| `description` | String, nullable | What this entry records. |
| `source_type`, `source_id` | String, nullable | What business event produced this entry — a sales invoice, a supplier invoice, a payment, or a manual entry. Deliberately a loose text reference rather than four separate nullable foreign keys, because the set of possible sources grows as the system grows. |
| `reversal_of_id` | String (FK), nullable, unique | If this entry exists to cancel out a previous mistake, the entry it reverses. |
| `status` | Enum: `DRAFT`, `POSTED` | Whether this entry has been finalized. Once `POSTED`, an entry is never edited again. |
| `posted_by`, `posted_at` | String (FK → `user`), DateTime, nullable | Who posted it, and when. |

**`journal_entry_line`** (one row per debit or credit)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `journal_entry_id` | String (FK) | Which entry this line belongs to. |
| `account_id` | String (FK) | Which account this line posts to. |
| `line_number` | Int | Print order. |
| `debit_amount` | Decimal | Non-zero only if this is a debit line. |
| `credit_amount` | Decimal | Non-zero only if this is a credit line. |
| `description` | String, nullable | Line-level note. |

*Two rules apply here that Postgres cannot check: exactly one of
`debit_amount` / `credit_amount` must be non-zero on each line, and the sum
of all debits across an entry must equal the sum of all credits before the
entry can move from `DRAFT` to `POSTED`. Both are enforced by the service
inside the posting transaction — see [invariants.md](invariants.md). A
mistake in a posted entry is corrected by posting a new reversing entry
(`reversal_of_id`), never by editing the original.*

### `receivable`

The Accounts Receivable subledger — what a customer owes, tracked per
invoice.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `customer_id` | String (FK) | Who owes the money. |
| `sales_invoice_id` | String (FK), unique | The invoice this receivable was created from. Unique — issuing an invoice creates exactly one receivable, so a customer can never be billed into AR twice for the same invoice. |
| `journal_entry_id` | String (FK) | The ledger entry that recorded this as a debit to Accounts Receivable. |
| `invoice_date`, `due_date` | Date | Copied from the invoice, for convenient querying. |
| `original_amount` | Decimal | The full invoice amount. |
| `outstanding_amount` | Decimal | How much is still unpaid — a cached counter. Must always equal `original_amount` minus the sum of applied payments. |
| `status` | Enum: `OPEN`, `PARTIALLY_PAID`, `SETTLED` | Where this receivable stands. |

### `payable`

The Accounts Payable subledger — the exact mirror of `receivable`, for money
the company owes suppliers.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `supplier_id` | String (FK) | Who is owed the money. |
| `supplier_invoice_id` | String (FK), unique | The invoice this payable was created from. |
| `journal_entry_id` | String (FK) | The ledger entry that recorded this as a credit to Accounts Payable. |
| `invoice_date`, `due_date` | Date | Copied from the invoice. |
| `original_amount`, `outstanding_amount` | Decimal | The full amount, and how much remains unpaid — a cached counter. |
| `status` | Enum: `OPEN`, `PARTIALLY_PAID`, `SETTLED` | Where this payable stands. |

### `payment` / `payment_application`

Money actually moving — a receipt from a customer, or a payment to a
supplier — and how it gets matched to the invoices it settles.

**`payment`**

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `payment_number` | String | Human-readable reference. |
| `payment_type` | Enum: `CUSTOMER_RECEIPT`, `SUPPLIER_PAYMENT` | Which direction the money moved. |
| `customer_id` | String (FK), nullable | Set only for a customer receipt. |
| `supplier_id` | String (FK), nullable | Set only for a supplier payment. |
| `journal_entry_id` | String (FK) | The ledger entry this payment created. |
| `payment_date`, `amount`, `method` | Date, Decimal, Enum (`CASH`, `BANK_TRANSFER`, `CHECK`, `CARD`) | When, how much, and how the payment moved. |
| `reference` | String, nullable | A bank reference, check number, or similar. |
| `status` | Enum: `POSTED`, `REVERSED` | Whether this payment still stands. |
| `created_by` | String (FK → `user`) | Who recorded it. |

*`customer_id` and `supplier_id` are both nullable, and exactly one must be
set, matching `payment_type` — a receipt has a customer, a payment has a
supplier, never both and never neither. They are two real foreign keys
rather than one generic "party" column, so the database still guarantees the
referenced customer or supplier actually exists.*

**`payment_application`**

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `payment_id` | String (FK) | Which payment this application comes from. |
| `receivable_id` | String (FK), nullable | Which receivable this settles, if this is a customer receipt. |
| `payable_id` | String (FK), nullable | Which payable this settles, if this is a supplier payment. |
| `applied_amount` | Decimal | How much of the payment was applied to this specific invoice. |

*This is a many-to-many join, and that is the whole point: one payment can
settle several invoices at once, and one invoice can be settled by several
partial payments over time. The sum of a payment's `applied_amount` rows
may never exceed the payment's own `amount`, and `receivable.
outstanding_amount` / `payable.outstanding_amount` must always reflect the
sum of applications against them — see [invariants.md](invariants.md).*
