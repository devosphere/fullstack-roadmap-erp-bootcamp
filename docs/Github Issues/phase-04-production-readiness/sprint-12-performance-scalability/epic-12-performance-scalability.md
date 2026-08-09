# [EPIC] Performance & Scalability

<!-- GitHub title: [EPIC] Performance & Scalability
     Labels: epic, performance
     Milestone: Sprint 12 - Performance & Scalability
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 075-080 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: backend
## Sprint: Sprint 12 - Performance & Scalability

---

## Purpose

Make the platform's performance measured, predictable, and adequate for production load: budgets
and a baseline, database optimization, caching, API and frontend efficiency, and load validation.

```text
Guess the bottleneck        →  Optimize        →  No improvement

Measure the bottleneck      →  Optimize        →  Verified improvement
```

## Business Value

Twelve sprints of features were built and tested on development-sized data. Production data is
orders of magnitude larger. This epic finds where the system breaks before real users do, and
every fix in it is required to prove itself with a number, not an impression.

## Issues

- [ ] #75 Establish Performance Baseline and Budgets
- [ ] #76 Optimize Database Queries and Indexing
- [ ] #77 Implement Caching Strategy
- [ ] #78 Improve API Performance and Pagination
- [ ] #79 Improve Frontend Performance
- [ ] #80 Run Load and Stress Testing

## Named Optimization Targets

Carried forward from where they were flagged in earlier sprints:

```text
Issue 024   attendance query cost at one year of seeded data
Issue 028, 035, 042, 049, 056, 060   every module dashboard's aggregation cost
Issue 052   general ledger balance join
Issue 057   the Sprint 09 reporting baseline itself
```

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Performance budgets defined and baseline measured against production-scale data
- [ ] N+1 patterns eliminated with query-count test evidence
- [ ] Caching implemented with verified invalidation and graceful degradation on failure
- [ ] All list endpoints paginated with an enforced maximum page size
- [ ] Frontend bundle and Core Web Vitals meet budget
- [ ] Load test passes at expected traffic; stress and soak results documented
- [ ] No functional regression — all existing tests still pass
- [ ] Release v0.13.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-12-performance-scalability.md` |
| Phase overview | `academy/08-sprints/phase-04-production-readiness/phase-overview.md` |
| Runs after | Sprint 11 (security fixes may change query shape) |
| Release | v0.13.0 |
