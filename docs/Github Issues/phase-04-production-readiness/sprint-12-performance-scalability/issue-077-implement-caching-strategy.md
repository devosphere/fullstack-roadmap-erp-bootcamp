# [FEATURE] Implement Caching Strategy

<!-- GitHub title: [FEATURE] Implement Caching Strategy
     Labels: feature, backend, performance, priority: high
     Milestone: Sprint 12 - Performance & Scalability
     Branch: feature/077-implement-caching-strategy
     Epic: Performance & Scalability
     Depends on: 013, 075, 076
     Blocks: 078
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

## Module: backend
## Sprint: Sprint 12 - Performance & Scalability

---

## Summary

Introduce a cache layer for expensive, stable reads with an explicit TTL and invalidation strategy
per data class, graceful fallback on cache failure, and hit/miss metrics — while keeping financial
balances and permission checks always live.

## Background

Issue 076 fixed queries that were slow because they were doing unnecessary work. This issue is for
work that is necessary but repeated: the same product catalogue, the same permission set, the same
dashboard KPI, requested by many users within the same short window.

The hard part of caching is never storing — it's knowing when a stored value is wrong. Two rules
draw the line for this system specifically:

- **Financial balances (Issue 052) are never cached.** A stale ledger figure is not an inconvenience,
  it's a wrong number in a place where wrong numbers have consequences. Every read of an account
  balance goes to the database, always.
- **Permission caches (Issue 013) invalidate immediately on role change**, not on a TTL. Issue 013
  was built specifically so that revoking a role takes effect before a token expires; caching
  permissions with a stale TTL would quietly undo that guarantee.

Everything else is a judgment call between staleness tolerance and cost, made explicit per data
class rather than applied as one blanket policy.

## User Story

As a Backend Developer,
I want expensive, stable data cached with clear invalidation rules,
So that repeated requests for the same data don't repeat the same expensive computation, without ever serving stale financial or permission data.

## Acceptance Criteria

```gherkin
Given a cached product catalogue entry
When the underlying product is updated
Then the cache is invalidated and the next request returns the updated value
```

```gherkin
Given a user's role is changed
When their next request is authorized
Then the permission check reflects the new role immediately, not after a TTL expires
```

```gherkin
Given any request for an account balance from Issue 052
When it is served
Then it always reads from the database directly, never from a cache
```

```gherkin
Given the cache service is unavailable
When a request for cacheable data is made
Then the request falls back to a direct database read and succeeds, rather than failing
```

```gherkin
Given cache activity over a period
When hit and miss metrics are inspected
Then both counts are available and distinguishable by data class
```

- [ ] Cache layer (Redis or equivalent) integrated into the backend
- [ ] Cacheable data classes identified from Issue 075's measurements, each with a defined TTL
- [ ] Product catalogue (Issue 029) cached with a moderate TTL and invalidation on update
- [ ] Chart of accounts (Issue 050) cached with a long TTL — changes rarely
- [ ] User effective permissions (Issue 013) cached with immediate invalidation on role change, no TTL-based staleness
- [ ] Dashboard KPI figures (Issues 028, 035, 042, 049, 056, 060) cached with a short TTL
- [ ] Financial balances and receivable/payable outstanding amounts (Issues 052, 053, 054) explicitly excluded from caching
- [ ] Cache key design includes tenant/user scope wherever results differ by user
- [ ] Cache failure falls back to a direct read, never surfaces as a request error
- [ ] Hit and miss metrics exposed, broken down by data class
- [ ] Cache invalidation triggered from the write path of every cached entity, not a separate sweep

## Expected Result

Expensive, stable reads are served from cache most of the time, reducing repeated load without ever
compromising the correctness of financial figures or the immediacy of permission revocation. A
cache outage degrades performance, never correctness or availability.

---

## Scope

### Included

- Cache service integration
- Per-data-class TTL and invalidation policy
- Product catalogue, chart of accounts, and dashboard KPI caching
- Permission caching with immediate invalidation
- Explicit exclusion of financial balances from caching
- Graceful degradation on cache unavailability
- Hit/miss metrics

### Out of Scope

- Caching transactional records (orders, invoices, movements) — these are excluded by design, not deferred
- Client-side (browser) caching strategy (Issue 079)
- CDN or edge caching
- Cache warming on deployment

## Technical Requirements

**Cacheable data classes**

| Data | Volatility | TTL / Strategy |
|------|-----------|-----------------|
| Chart of accounts (Issue 050) | Very low | Long TTL, invalidate on update |
| Product catalogue (Issue 029) | Low | Moderate TTL, invalidate on update |
| User permissions (Issue 013) | Low, but must be immediate | Invalidate on role/permission change, not TTL-driven |
| Dashboard KPIs (Issues 028/035/042/049/056/060) | Medium | Short TTL |
| Report results (Issue 058), per parameter set | Medium | Cache keyed by report code + parameters |
| Transactional records (orders, invoices, movements) | High | **Not cached** |
| Financial balances (Issue 052), receivables/payables (Issues 053, 054) | High-stakes | **Not cached, regardless of volatility** |

**Cache key design**

```text
<dataClass>:<scope>:<identifier>

Examples:
    product:catalog:{productId}
    permissions:user:{userId}
    dashboard:sales:{dateFrom}:{dateTo}
    report:sales-by-customer:{parameterHash}
```

Cache keys include the user's permission scope wherever the underlying result differs by user (for
example, a dashboard scoped to "my team" per Issue 028's role-based scoping) — a single shared key
across users with different visibility would leak data across the cache.

**Invalidation on write**

```text
Product updated (Issue 029)     → invalidate product:catalog:{productId}
Role assignment changed (Issue 012)   → invalidate permissions:user:{userId} immediately, synchronously with the write
Account updated (Issue 050)      → invalidate the chart of accounts cache entry
```

The permission invalidation must be synchronous with the role change transaction — an asynchronous
or eventually-consistent invalidation here would reopen exactly the gap Issue 013 was built to
close.

**Graceful degradation**

```text
Cache read attempted

    → cache unavailable or errors

    → log the failure (rate-limited, to avoid log flooding during an outage)
    → fall through to a direct database read
    → serve the request normally
```

A cache outage must never surface as a 5xx response to the end user.

**Metrics**

```text
cache_operations_total{dataClass, result}     -- result: hit | miss | error
```

Exposed for Sprint 15's observability work to consume, and useful immediately for validating this
issue's own effectiveness.

**Explicit non-caching rule**

Add a code-level guard or lint rule, if practical, that flags any attempt to introduce caching on
the finance module's balance-reading paths (Issue 052) — making the exclusion structurally
enforced, not just documented intent.

## Dependencies

- Issue 013 — the permission system this issue caches with a stricter-than-TTL invalidation rule.
- Issue 075 — the baseline identifying which data is worth caching.
- Issue 076 — optimized queries; caching should reduce *frequency* of an already-optimized query,
  not paper over one that is still slow.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for cache key generation per data class
- [ ] Unit tests for TTL expiry behavior
- [ ] **Invalidation test**: updating a cached entity's source record invalidates its cache entry, and the next read reflects the change
- [ ] **Immediacy test**: a role change invalidates the affected user's permission cache before their next request, not after a TTL
- [ ] **Exclusion test**: a request for an account balance never hits the cache layer, verified by mocking the cache and asserting it is not called
- [ ] **Fallback test**: with the cache service unavailable, requests still succeed via direct read
- [ ] Hit/miss metrics verified present and correctly attributed
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-12-performance-scalability.md` § 3 |
| Epic | Performance & Scalability |
| Caches | Issue 029, Issue 050, Issue 013, dashboards from Issues 028/035/042/049/056/060 |
| Explicitly excludes | Issue 052, Issue 053, Issue 054 |
| Metrics consumed by | Issue 094 (Sprint 15) |
| Pull Request | _to be linked_ |
