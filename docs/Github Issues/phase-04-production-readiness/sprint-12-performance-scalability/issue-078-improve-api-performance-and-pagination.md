# [IMPROVEMENT] Improve API Performance and Pagination

<!-- GitHub title: [IMPROVEMENT] Improve API Performance and Pagination
     Labels: improvement, backend, performance, priority: high
     Milestone: Sprint 12 - Performance & Scalability
     Branch: feature/078-improve-api-performance-and-pagination
     Epic: Performance & Scalability
     Depends on: 075, 076, 077
     Blocks: 079
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [x] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: backend
## Sprint: Sprint 12 - Performance & Scalability

---

## Summary

Standardize pagination across every list endpoint with an enforced maximum page size, trim
oversized responses, enable compression, and log slow requests — closing the gap between endpoints
that were each built to their own module's shape rather than a shared standard.

## Background

Pagination has existed since Issue 011 in Sprint 02, but it was implemented once per module as each
sprint needed it, not designed once and reused. That is a normal outcome of building incrementally —
and it means eleven sprints later, list endpoints across HR, inventory, sales, procurement, and
finance likely paginate with slightly different parameter names, response shapes, and — critically
— no enforced ceiling on page size.

An unbounded page size is the specific risk this issue closes: a client (or an attacker) requesting
`?pageSize=1000000` against Issue 019's employee list or Issue 033's stock movement history can pull
an unreasonable amount of data in one request, regardless of how well-indexed the underlying query
is after Issue 076.

The other change here is what a list response *contains*. Several list endpoints — Issue 039's sales
orders, Issue 046's purchase orders — currently nest their full line items in the list view. A list
is for finding a record, not reading it in full; that belongs on the detail endpoint.

## User Story

As a Frontend Developer,
I want every list endpoint to paginate consistently with a bounded page size,
So that no request — accidental or malicious — can pull an unbounded amount of data.

## Acceptance Criteria

```gherkin
Given any list endpoint across any module
When its pagination parameters and response shape are inspected
Then they follow the same standard structure
```

```gherkin
Given a request for a page size above the configured maximum
When it is submitted
Then the server enforces the maximum rather than honoring the requested size
```

```gherkin
Given a list endpoint that previously returned nested line items
When it is called after this issue
Then it returns summary fields only, with full detail available from the corresponding detail endpoint
```

```gherkin
Given a request whose processing exceeds the configured slow-request threshold
When it completes
Then it is logged with its parameters and duration
```

```gherkin
Given response compression is enabled
When a large list response is requested
Then its transferred payload size is measurably smaller than before this issue
```

- [ ] A single pagination standard defined: parameter names, response envelope, metadata shape
- [ ] Every list endpoint across every module migrated to the standard
- [ ] Maximum page size enforced server-side, regardless of what the client requests
- [ ] Default page size set to a reasonable value distinct from the maximum
- [ ] List responses for multi-line documents (sales orders, purchase orders, requisitions) trimmed to summary fields
- [ ] Full detail confirmed still available via each entity's existing detail endpoint
- [ ] Response compression enabled
- [ ] Slow request logging added, capturing endpoint, parameters, and duration above a configured threshold
- [ ] Payload size measured before and after for a representative sample of list endpoints

## Expected Result

Every list endpoint in the system behaves the same way from a client's perspective, no request can
pull an unbounded result set, and payloads are smaller because they carry only what a list view
actually needs.

---

## Scope

### Included

- Unified pagination standard across all list endpoints
- Maximum page size enforcement
- List response trimming for multi-line documents
- Response compression
- Slow request logging
- Payload size measurement

### Out of Scope

- Caching (Issue 077 — a separate, already-addressed concern)
- GraphQL or field-selection query languages
- API versioning
- Rate limiting (already covered by Issue 072)

## Technical Requirements

**Pagination standard**

```text
Request parameters:
    page          (1-indexed)
    pageSize      (bounded by MAX_PAGE_SIZE)
    sortBy
    sortDirection

Response envelope:
    {
      data: [...],
      meta: {
        page, pageSize, totalItems, totalPages
      }
    }
```

Applied uniformly across every list endpoint from every prior sprint: Issue 011 (users), Issue 016
(companies), Issue 019 (employees), Issue 029 (products), Issue 036 (customers), Issue 043
(suppliers), Issue 039 (orders), Issue 046 (purchase orders), and every other list endpoint built
since.

**Maximum page size**

```text
MAX_PAGE_SIZE = 100    (example — the actual value is a judgment call to document)

requested pageSize > MAX_PAGE_SIZE
    → server uses MAX_PAGE_SIZE, does not error
    → response meta reflects the size actually used
```

Capping silently (using the max) rather than rejecting the request is the more forgiving choice for
legitimate clients while still closing the abuse path — document this decision rather than leaving
it implicit.

**List response trimming**

For documents with line items — sales orders (Issue 039), purchase orders (Issue 046), requisitions
(Issue 044), quotations (Issue 038) — the list endpoint returns header-level summary fields only:

```text
List view:    id, documentNumber, customerName/supplierName, status, totalAmount, date
Detail view:  everything above, plus the full line items (unchanged, via the existing detail endpoint)
```

This is a response shape change on existing endpoints — verify no frontend code currently depends
on line items being present in a list response before removing them.

**Compression**

```text
Enable gzip or brotli compression on API responses above a minimum size threshold,
consistent with what the Docker/production setup from Issue 008 and Issue 081 can serve
```

**Slow request logging**

```text
Any request exceeding a configured threshold (aligned with Issue 075's budgets per operation class)
    → logged with: endpoint, method, query parameters (redacted per Issue 073's rules
      if they could contain sensitive values), duration, timestamp
```

This becomes an input to Sprint 15's structured logging and correlation work (Issue 093) — build it
in a shape that will plug into that later rather than as a one-off logger.

## Dependencies

- Issue 075 — the baseline and budgets this issue's slow-request threshold aligns with.
- Issue 076 — query optimization; pagination changes are complementary, not a substitute.
- Issue 077 — caching; some list endpoints may already be addressed there.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests confirming the maximum page size is enforced regardless of requested value
- [ ] Integration tests confirming the pagination envelope is consistent across a sample of endpoints from at least four different modules
- [ ] Test confirming trimmed list responses omit line items while detail endpoints still return them in full
- [ ] Payload size measured and recorded before/after for at least three representative endpoints
- [ ] Slow request logging verified by triggering a deliberately slow request in a test environment
- [ ] All existing functional tests still pass — no behavior changed beyond the documented response shape trims
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-12-performance-scalability.md` § 4 |
| Epic | Performance & Scalability |
| Standardizes pagination first introduced in | Issue 011 |
| Slow-request logging feeds | Issue 093 (Sprint 15) |
| Pull Request | _to be linked_ |
