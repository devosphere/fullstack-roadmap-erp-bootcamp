# Sales

**Sprint 06.** The document chain from "we might sell this" to "we got paid
for this": quotation → order → delivery → invoice.

Each document is a header table plus a matching `_line` table (one row per
product on that document). All four documents follow the same two rules — see
[README.md](README.md#snapshotted-line-prices) and
[README.md](README.md#stored-totals-not-derived-ones).

## Diagram

```mermaid
erDiagram
    customer ||--o{ sales_quotation : requests
    customer ||--o{ sales_order : places
    customer ||--o{ sales_invoice : "is billed"
    sales_quotation ||--o| sales_order : converts
    sales_quotation ||--o{ sales_quotation_line : contains
    sales_order ||--o{ sales_order_line : contains
    sales_order ||--o{ delivery : fulfilled_by
    delivery ||--o{ delivery_line : contains
    sales_order_line ||--o{ delivery_line : ships
    delivery_line ||--o| sales_invoice_line : bills
    sales_order ||--o{ sales_invoice : "invoiced as"
    sales_invoice ||--o{ sales_invoice_line : contains
    product ||--o{ price_list : "priced in"

    sales_order {
        string id PK
        string customer_id FK
        string quotation_id FK
        enum status
        decimal total_amount
    }
    delivery_line {
        string id PK
        string delivery_id FK
        string sales_order_line_id FK
        string stock_movement_id FK
    }
    sales_invoice_line {
        string id PK
        string sales_invoice_id FK
        string delivery_line_id FK UK
    }
```

## Tables

### `customer`

A company or person the business sells to.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `customer_code` | String | Short code, unique within the company. |
| `name`, `contact_person`, `email`, `phone`, `tax_number` | String | Basic identity and contact details. |
| `billing_address_*`, `shipping_address_*` | String, nullable | Separate billing and shipping addresses — these can differ. |
| `payment_terms_days` | Int | How many days the customer has to pay after invoicing (e.g. Net 30). |
| `credit_limit` | Decimal | The maximum outstanding balance this customer is allowed to carry. |
| `status` | Enum: `ACTIVE`, `INACTIVE` | Whether new orders can currently be placed for this customer. |

### `price_list`

A scheduled selling price for a product, in a given currency, valid for a
date range.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `product_id` | String (FK) | Which product this price applies to. |
| `currency` | String | Which currency this price is quoted in. |
| `unit_price` | Decimal | The price itself. |
| `max_discount_percent` | Decimal | The largest discount a salesperson may apply on top of this price without special approval. |
| `valid_from`, `valid_to` | Date, Date nullable | The date range this price is active for. A null `valid_to` means "until further notice." |
| `status` | Enum: `ACTIVE`, `INACTIVE` | Whether this price is currently usable. |
| `created_by` | String (FK → `user`) | Who set this price. |

*Two `ACTIVE` price rows for the same product and currency must never have
overlapping date ranges — otherwise there would be two valid prices on the
same day. Postgres cannot express that constraint; it is enforced in the
service. See [invariants.md](invariants.md). Changing a price here never
rewrites the `unit_price` already stored on an existing quotation or order
line — see [README.md](README.md#snapshotted-line-prices).*

### `sales_quotation` / `sales_quotation_line`

An offer sent to a customer before they commit to buying.

**`sales_quotation`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `quotation_number` | String | Human-readable reference (e.g. `QT-2026-00042`). |
| `customer_id` | String (FK) | Who this quotation was sent to. |
| `quotation_date`, `valid_until` | Date | When it was issued, and when it expires. |
| `status` | Enum: `DRAFT`, `SENT`, `ACCEPTED`, `CONVERTED`, `REJECTED`, `EXPIRED`, `CANCELLED` | Where the quotation stands. `CONVERTED` means it became a `sales_order`. |
| `subtotal`, `discount_total`, `total_amount` | Decimal | Stored totals — see [README.md](README.md#stored-totals-not-derived-ones). |
| `created_by` | String (FK → `user`) | Who created it. |

**`sales_quotation_line`** (one row per product quoted)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `quotation_id` | String (FK) | Which quotation this line belongs to. |
| `product_id` | String (FK) | What is being quoted. |
| `line_number` | Int | Print order on the document. |
| `quantity`, `unit_price` | Decimal | How many, and at what price — `unit_price` is a snapshot, not a live lookup. |
| `discount_percent`, `discount_amount` | Decimal | Any discount applied to this line. |
| `line_total` | Decimal | This line's total, stored. |

### `sales_order` / `sales_order_line`

A confirmed commitment to sell — the customer has agreed to buy.

**`sales_order`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `order_number` | String | Human-readable reference (e.g. `SO-2026-00042`). |
| `customer_id` | String (FK) | Who is buying. |
| `quotation_id` | String (FK), nullable | The quotation this order was converted from, if any. |
| `warehouse_id` | String (FK) | Which warehouse will fulfill this order. |
| `order_date`, `requested_delivery_date` | Date | When it was placed, and when the customer wants it. |
| `status` | Enum: `DRAFT`, `CONFIRMED`, `PARTIALLY_DELIVERED`, `DELIVERED`, `INVOICED`, `CLOSED`, `CANCELLED` | Where the order stands. |
| `subtotal`, `discount_total`, `total_amount` | Decimal | Stored totals. |
| `created_by`, `confirmed_by` | String (FK → `user`), nullable | Who created and who confirmed the order — usually two different actions, sometimes two different people. |
| `confirmed_at` | DateTime, nullable | When it was confirmed. |

**`sales_order_line`** (one row per product ordered)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `sales_order_id` | String (FK) | Which order this line belongs to. |
| `product_id` | String (FK) | What was ordered. |
| `line_number` | Int | Print order. |
| `quantity`, `unit_price` | Decimal | How many, at what snapshotted price. |
| `discount_percent`, `discount_amount`, `line_total` | Decimal | This line's discount and total. |
| `delivered_quantity` | Decimal | A running counter: how much of this line has actually shipped so far. Starts at 0. |

*`delivered_quantity` must always equal the sum of this line's
`delivery_line` rows, and can never exceed `quantity` — an order can ship in
several partial deliveries, which is what makes the `PARTIALLY_DELIVERED`
status meaningful. See [invariants.md](invariants.md).*

### `delivery` / `delivery_line`

A physical shipment against a sales order. One order can have several
deliveries (partial shipments).

**`delivery`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `delivery_number` | String | Human-readable reference. |
| `sales_order_id` | String (FK) | Which order this shipment fulfills. |
| `warehouse_id` | String (FK) | Which warehouse it shipped from. |
| `delivery_date` | Date | When it shipped. |
| `status` | Enum: `COMPLETED`, `CANCELLED` | Whether the shipment stands. |
| `delivered_by` | String (FK → `user`) | Who processed the shipment. |

**`delivery_line`** (one row per product shipped)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `delivery_id` | String (FK) | Which shipment this line belongs to. |
| `sales_order_line_id` | String (FK) | Which ordered line this fulfills. |
| `product_id` | String (FK) | What shipped. |
| `line_number` | Int | Print order. |
| `quantity` | Decimal | How much shipped on this line. |
| `stock_movement_id` | String (FK), unique | The ledger row that removed this stock from the warehouse. Required — every shipped line has exactly one matching movement, so goods can be traced from the shipment back to the ledger. |

### `sales_invoice` / `sales_invoice_line`

A bill sent to the customer for goods that have shipped.

**`sales_invoice`** (header)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `invoice_number` | String | Human-readable reference. |
| `customer_id`, `sales_order_id` | String (FK) | Who is being billed, and for which order. |
| `invoice_date`, `due_date` | Date | When it was issued, and when payment is due. |
| `status` | Enum: `DRAFT`, `ISSUED`, `PAID`, `CANCELLED` | Where the invoice stands. `OVERDUE` is deliberately *not* a stored status — it is calculated as `status = ISSUED AND due_date < today` whenever the invoice is displayed, rather than kept correct by a background job. |
| `subtotal`, `discount_total`, `total_amount` | Decimal | Stored totals. |
| `issued_by`, `issued_at` | String (FK → `user`), DateTime, nullable | Who issued it, and when. |
| `cancelled_reason` | String, nullable | Why it was cancelled, if it was. |

**`sales_invoice_line`** (one row per product billed)

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String (uuid) | Primary key. |
| `sales_invoice_id` | String (FK) | Which invoice this line belongs to. |
| `delivery_line_id` | String (FK), unique | The shipment line this bills. Unique *across the whole table*, not just per invoice — a shipment can be billed exactly once, so double-invoicing the same goods is impossible at the database level, not merely discouraged. |
| `product_id` | String (FK) | What is being billed. |
| `line_number` | Int | Print order. |
| `quantity`, `unit_price`, `discount_amount`, `line_total` | Decimal | This line's billed quantity and amount. |

*Invoices bill what actually shipped, never what was merely ordered — that
is why `sales_invoice_line` links to `delivery_line`, not `sales_order_line`
directly. You cannot bill a customer for goods still sitting in the
warehouse.*
