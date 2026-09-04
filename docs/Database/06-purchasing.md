# Purchasing

**Sprint 07.** The mirror of [Sales](05-sales.md), in the other direction:
requisition → purchase order → goods receipt → supplier invoice. Stock flows
*in*; money flows *out*.

The same conventions apply — snapshotted line prices, stored header totals,
a running counter per line (`received_quantity` here, instead of
`delivered_quantity`). What's new in this module is the **three-way match**:
before a supplier gets paid, their invoice is checked against both what was
ordered and what was actually received.

## Diagram

```mermaid
erDiagram
    supplier ||--o| supplier_bank_detail : has
    supplier ||--o{ purchase_order : "sells to"
    purchase_requisition ||--o| purchase_order : converts
    purchase_requisition ||--o{ purchase_requisition_line : contains
    purchase_requisition ||--o{ requisition_approval : "approved via"
    purchase_order ||--o{ purchase_order_line : contains
    purchase_order ||--o{ goods_receipt : "received via"
    goods_receipt ||--o{ goods_receipt_line : contains
    purchase_order_line ||--o{ goods_receipt_line : receives
    purchase_order ||--o{ supplier_invoice : "invoiced as"
    supplier_invoice ||--o{ supplier_invoice_line : contains
    purchase_order_line ||--o{ supplier_invoice_line : "priced by"
    goods_receipt_line ||--o{ supplier_invoice_line : "quantity checked by"

    purchase_order {
        string id PK
        string supplier_id FK
        string requisition_id FK UK
        enum status
        decimal total_amount
    }
    supplier_invoice {
        string id PK
        string supplier_id FK
        string purchase_order_id FK
        enum match_status
        enum status
    }
    supplier_invoice_line {
        string id PK
        string purchase_order_line_id FK
        string goods_receipt_line_id FK
        boolean quantity_match
        boolean price_match
    }
```

## Tables

### `supplier`

A company the business buys from.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `supplier_code` | String | Short code, unique within the company. |
| `name`, `contact_person`, `email`, `phone`, `tax_number` | String | Basic identity and contact details. |
| `address_line1/2`, `city`, `country` | String, nullable | Location. |
| `payment_terms_days` | Int | How many days the company has to pay this supplier after invoicing. |
| `status` | Enum: `ACTIVE`, `INACTIVE` | Whether new orders can currently be placed with this supplier. |

### `supplier_bank_detail`

The supplier's bank account for payment — split into its own table
deliberately.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `supplier_id` | String (FK), unique | Which supplier this account belongs to. |
| `bank_name`, `account_name`, `account_number`, `swift_code` | String | The account details. |
| `updated_by` | String (FK → `user`) | Who last changed this. |

*Bank details are the #1 payment-fraud target: change an account number and
future payments go to the attacker instead of the real supplier. Keeping
this in a separate table means it can be permission-gated (only Finance can
edit it) independently from ordinary supplier record edits, and every change
can be logged with the old and new value in `security_audit_log` — see
[10-security.md](10-security.md).*

### `supplier_product`

Which products a given supplier sells, and how long they take to deliver.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `supplier_id`, `product_id` | String (FK) | The supplier and the product they supply. |
| `lead_time_days` | Int, nullable | How many days this supplier typically takes to deliver this product. |

*This is what makes reorder planning meaningful: knowing a part takes 14
days to arrive tells you *when* to order, not merely that stock is running
low.*

### `purchase_requisition` / `purchase_requisition_line`

An internal request to buy something — before any supplier is committed.

**`purchase_requisition`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `requisition_number` | String | Human-readable reference. |
| `requested_by` | String (FK → `employee`) | Who is asking for this purchase. |
| `department_id` | String (FK) | Which department the spend is charged to. |
| `requisition_date`, `required_date` | Date, Date nullable | When it was requested, and when it's needed by. |
| `justification` | String, nullable | Why this purchase is needed. |
| `status` | Enum: `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, `CONVERTED`, `REJECTED`, `CANCELLED` | Where the requisition stands. `CONVERTED` means it became a `purchase_order`. |
| `total_estimated_amount` | Decimal | Rough total, before actual supplier prices are known. |
| `submitted_at` | DateTime, nullable | When it was submitted for approval. |

**`purchase_requisition_line`** (one row per item requested)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `requisition_id` | String (FK) | Which requisition this line belongs to. |
| `product_id` | String (FK) | What is being requested. |
| `line_number` | Int | Print order. |
| `quantity`, `estimated_unit_cost`, `line_estimate` | Decimal | How much, at what estimated cost. |
| `notes` | String, nullable | Additional detail. |

### `approval_limit` / `requisition_approval`

The Sprint 07 approval mechanism for requisitions — an amount threshold per
role, and the resulting per-step approval decisions.

**`approval_limit`**

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `role_id` | String (FK) | Which role this threshold applies to. |
| `step_order` | Int | This role's position in the approval chain. |
| `max_approval_amount` | Decimal | The largest requisition amount someone with this role may approve. |
| `updated_by` | String (FK → `user`) | Who last changed this threshold. |

**`requisition_approval`**

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `requisition_id` | String (FK) | Which requisition this decision belongs to. |
| `step_order` | Int | Which step in the chain this is. |
| `approver_id` | String (FK → `employee`) | Who is deciding at this step. |
| `status` | Enum: `PENDING`, `APPROVED`, `REJECTED`, `SKIPPED` | The outcome at this step. |
| `comment`, `decided_at` | String, DateTime, nullable | Any comment, and when the decision was made. |

*Both tables are superseded by the general-purpose workflow engine built in
Sprint 10 (see [09-workflow.md](09-workflow.md)) — issue-068 requires keeping
these tables read-only for requisitions that were approved before the
migration, rather than deleting them.*

### `purchase_order` / `purchase_order_line`

A confirmed commitment to buy from a specific supplier, at agreed prices.

**`purchase_order`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `order_number` | String | Human-readable reference. |
| `supplier_id` | String (FK) | Who is being ordered from. |
| `requisition_id` | String (FK), nullable, unique | The requisition this order was converted from, if any. Unique — an approved requisition can only be converted to a purchase order once, so the same approved spend can never be ordered twice. |
| `order_date`, `expected_date` | Date, Date nullable | When it was placed, and when delivery is expected. |
| `status` | Enum: `DRAFT`, `ISSUED`, `PARTIALLY_RECEIVED`, `RECEIVED`, `INVOICED`, `CLOSED`, `CANCELLED` | Where the order stands. |
| `subtotal`, `total_amount` | Decimal | Stored totals. |
| `created_by`, `issued_by`, `issued_at` | String (FK → `user`), DateTime, nullable | Who created it, and who issued it to the supplier. |

**`purchase_order_line`** (one row per item ordered)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `purchase_order_id` | String (FK) | Which order this line belongs to. |
| `requisition_line_id` | String (FK), nullable | The requisition line this fulfills, if the order came from one. |
| `product_id` | String (FK) | What was ordered. |
| `line_number` | Int | Print order. |
| `quantity`, `unit_price`, `line_total` | Decimal | How much, at what negotiated price. |
| `received_quantity` | Decimal | A running counter: how much of this line has actually arrived so far. Mirrors `delivered_quantity` on the sales side. Must equal the sum of this line's accepted `goods_receipt_line` quantities, and can never exceed `quantity`. |

### `goods_receipt` / `goods_receipt_line`

A physical delivery arriving against a purchase order. One order can have
several receipts (partial deliveries).

**`goods_receipt`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `receipt_number` | String | Human-readable reference. |
| `purchase_order_id` | String (FK) | Which order this delivery fulfills. |
| `warehouse_id` | String (FK) | Which warehouse received it. |
| `receipt_date` | Date | When it arrived. |
| `received_by` | String (FK → `user`) | Who processed the delivery. |

**`goods_receipt_line`** (one row per item received)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `receipt_id` | String (FK) | Which delivery this line belongs to. |
| `purchase_order_line_id` | String (FK) | Which ordered line this fulfills. |
| `product_id` | String (FK) | What arrived. |
| `line_number` | Int | Print order. |
| `accepted_quantity` | Decimal | How much was accepted into stock. |
| `rejected_quantity` | Decimal | How much was refused (damaged, wrong item, etc.). |
| `rejection_reason` | String, nullable | Why, if anything was rejected. |
| `stock_movement_id` | String (FK), nullable, unique | The ledger row this created. Null if the line was rejected in full — a fully rejected line moves nothing into the warehouse, so there is nothing to link. |

### `supplier_invoice` / `supplier_invoice_line`

A bill from the supplier — checked against both the order and the receipt
before it can be paid.

**`supplier_invoice`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `invoice_number` | String | Internal reference number. |
| `supplier_reference` | String, nullable | The supplier's own invoice number, for matching their paperwork. |
| `supplier_id`, `purchase_order_id` | String (FK) | Who sent the bill, and for which order. |
| `invoice_date`, `due_date` | Date | When it was issued, and when payment is due. |
| `match_status` | Enum: `PENDING`, `MATCHED`, `HELD` | The outcome of the three-way match — see below. |
| `status` | Enum: `DRAFT`, `APPROVED`, `HELD`, `CANCELLED` | Where the invoice stands for payment purposes. |
| `total_amount` | Decimal | The invoice total. |
| `overridden_by`, `override_reason`, `overridden_at` | String (FK → `user`), String, DateTime, nullable | If a mismatched invoice was manually cleared for payment anyway, who did it and why. |

**`supplier_invoice_line`** (one row per item billed)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `supplier_invoice_id` | String (FK) | Which invoice this line belongs to. |
| `purchase_order_line_id` | String (FK) | The ordered line this checks the **price** against. |
| `goods_receipt_line_id` | String (FK), nullable | The received line this checks the **quantity** against. |
| `product_id` | String (FK) | What is being billed. |
| `line_number` | Int | Print order. |
| `invoiced_quantity`, `invoiced_unit_price`, `line_total` | Decimal | What the supplier is charging for. |
| `quantity_match` | Boolean | Whether the invoiced quantity matches what was actually received. |
| `price_match` | Boolean | Whether the invoiced price matches what was agreed on the purchase order (within tolerance — see `invoice_match_tolerance` below). |
| `match_notes` | String, nullable | Details on any mismatch. |

*This is the **three-way match**: an invoice is checked against the purchase
order (the price agreed) and the goods receipt (the quantity actually
received). The two boolean flags live per-line, not as one header verdict,
so a partially wrong invoice shows exactly which line is wrong rather than
just "something doesn't match." An invoice that fails either check is `HELD`
rather than paid, and releasing it requires the explicit, attributed
override above — never a silent status change.*

### `invoice_match_tolerance`

One row per company: how much price variance the three-way match forgives
before holding an invoice.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `company_id` | String (FK), unique | One setting per company. |
| `tolerance_percent` | Decimal | The maximum price difference (as a percentage) allowed before `price_match` is considered failed. |
| `updated_by` | String (FK → `user`) | Who last changed it. |
