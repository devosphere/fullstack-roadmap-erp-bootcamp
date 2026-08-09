# [TASK] Establish Performance Baseline and Budgets

<!-- GitHub title: [TASK] Establish Performance Baseline and Budgets
     Labels: task, backend, performance, priority: high
     Milestone: Sprint 12 - Performance & Scalability
     Branch: feature/075-establish-performance-baseline-and-budgets
     Epic: Performance & Scalability
     Blocks: 076
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [x] Task
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

Agree performance budgets per operation class, generate a repeatable production-scale seed dataset,
measure every endpoint against its budget, and rank the failures — before any optimization work
begins.

## Background

Twelve sprints of features were built and manually tested against a handful of rows. Nobody has yet
run the system against data shaped like a real deployment: thousands of employees, tens of
thousands of orders, hundreds of thousands of stock movements.

This issue exists to remove guessing from every issue that follows it. Without a baseline, "the
sales dashboard feels slow" is an opinion. With one, "the sales dashboard's top-products widget
scans 400,000 rows and returns in 4.2 seconds against a 500ms budget" is a fact that Issue 076 can
be pointed at directly.

Several dashboards already flagged themselves as candidates when they were built — Issue 024's
attendance query, Issues 028/035/042/049/056/060's aggregation services, Issue 052's ledger join,
and Issue 057's own reporting baseline. This issue is where those flags get turned into measured
numbers, ranked by actual impact rather than by how loudly they were flagged.

## User Story

As a Backend Developer,
I want documented performance budgets and a measured baseline against realistic data,
So that optimization work in this sprint targets real, ranked bottlenecks instead of guesses.

## Acceptance Criteria

```gherkin
Given the agreed performance budgets
When any endpoint is measured against production-scale data
Then its p95 response time is recorded and compared to its budget
```

```gherkin
Given the production-scale seed dataset
When it is regenerated
Then the resulting data shape and volume are consistent and documented
```

```gherkin
Given the full set of measured endpoints
When the results are reviewed
Then every endpoint failing its budget is ranked by estimated user impact and turned into a work item
```

- [ ] Performance budgets documented per operation class (authentication, simple read, list, write, standard report, complex report, dashboard)
- [ ] Budgets expressed at the 95th percentile, not the average
- [ ] Production-scale seed data generator built and committed, producing a repeatable dataset
- [ ] Seed volumes documented: employee count, order count, movement count, and so on, chosen to represent a realistic multi-year deployment
- [ ] Every endpoint across every module measured against the seeded dataset
- [ ] Measurement includes p50 and p95 response time for each endpoint
- [ ] Baseline document committed, versioned, and includes the named targets from earlier sprints (Issues 024, 028, 035, 042, 049, 052, 056, 057, 060)
- [ ] Failing endpoints ranked by impact and converted into scoped work covered by Issues 076-079
- [ ] Baseline document updated at the end of the sprint with post-optimization figures for comparison

## Expected Result

A committed baseline exists showing exactly which endpoints meet their budget and which do not, on
data that actually resembles production — replacing every prior sprint's "measure this later" note
with an actual number.

---

## Scope

### Included

- Performance budget definition per operation class
- Production-scale seed data generator
- Baseline measurement across all endpoints
- Consolidation of every previously flagged optimization target
- Ranked list of failing endpoints as scoped work for the rest of the sprint
- Baseline document, updated again at sprint end

### Out of Scope

- Actually fixing any measured bottleneck (Issues 076-079)
- Load testing under concurrent traffic (Issue 080 — this issue measures single-request latency, not throughput under load)
- Frontend-specific metrics beyond noting their existence (Issue 079 owns Core Web Vitals measurement)

## Technical Requirements

**Budget table**

| Operation Class | Budget (p95) |
|-----------------|--------------|
| Authentication | 300 ms |
| Simple read (single record) | 200 ms |
| List with pagination | 500 ms |
| Transactional write | 800 ms |
| Standard report | 3 s |
| Complex analytical report | 10 s |
| Dashboard load | 2 s |

These are starting figures to agree and adjust, not immutable — document the final agreed values
and who approved them.

**Seed data generator**

```text
scripts/seed-production-scale.ts (or equivalent)

Target volumes (adjust to a realistic multi-year deployment):
    Employees:            ~2,000
    Products:              ~20,000
    Customers/Suppliers:    ~1,000 each
    Sales orders:           ~500,000, spread across ~3 years
    Purchase orders:         ~100,000
    Stock movements:        ~2,000,000
    Journal entries:         proportional to the above transactional volume
    Attendance records:      ~2,000 employees × ~250 working days/year × 3 years
```

The generator must be repeatable — running it twice against a clean database produces the same
shape, even if not byte-identical data, so measurements taken weeks apart remain comparable.

**Measurement approach**

```text
For each endpoint:

    1. Warm the cache/connection pool (discard the first request)
    2. Issue N requests (e.g. 50) with representative parameters
    3. Record p50 and p95
    4. Capture the query plan for the endpoint's primary query, if applicable
```

**Named targets to explicitly include**

```text
Issue 024   GET /api/attendance (team and report views) at one year of seeded data
Issue 028   GET /api/hr/dashboard
Issue 035   GET /api/inventory/dashboard
Issue 042   GET /api/sales/dashboard
Issue 049   GET /api/procurement/dashboard
Issue 052   GET /api/finance/ledger/account/{accountId}
Issue 056   GET /api/finance/reports/* (all three financial statements)
Issue 057   the read model queries underlying Issue 058's report execution
Issue 060   GET /api/analytics/dashboard
```

**Baseline document**

```text
docs/Architecture/performance-baseline.md

- Budgets and their approval
- Seed data generator description and volumes
- Full measurement table: endpoint, p50, p95, budget, pass/fail
- Ranked list of failures with estimated user impact
- (Updated at sprint end) post-optimization comparison
```

## Dependencies

None — this is the starting issue for Sprint 12.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Seed data generator committed and verified repeatable
- [ ] Budgets documented and agreed
- [ ] Every endpoint measured; results committed in the baseline document
- [ ] Every named target from earlier sprints explicitly measured
- [ ] Failing endpoints ranked and turned into scoped follow-up work
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-12-performance-scalability.md` § 1 |
| Epic | Performance & Scalability |
| Consolidates targets from | Issues 024, 028, 035, 042, 049, 052, 056, 057, 060 |
| Drives | Issues 076, 077, 078, 079 |
| Pull Request | _to be linked_ |
