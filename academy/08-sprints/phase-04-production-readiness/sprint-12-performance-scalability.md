# Sprint 12 - Performance & Scalability

**Sprint:** Sprint 12  
**Phase:** Phase 04 - Production Readiness  
**Duration:** 3-4 Weeks  
**Release Target:** v0.13.0  
**Status:** Planned

---

# Sprint Goal

Make the ERP platform's performance measurable, predictable, and adequate under realistic load by establishing baselines and budgets, optimizing database and API access, introducing caching, improving frontend delivery, and validating the result through load testing.

At the end of this sprint, every performance claim should be backed by a measurement, not an assumption.

---

# Sprint Context

Twelve sprints of features have been built on development-sized data:

```text
Development                    Production

10 employees                   2,000 employees
50 products                    20,000 products
100 orders                     500,000 orders
1 concurrent user              200 concurrent users
```

Code that is fast on ten rows can be unusable on ten thousand. The reporting layer added in Sprint 09 made this risk concrete: analytical queries now run against the same database as transactional writes.

Sprint 12 finds where the system breaks before real users do.

---

# Business Outcome

After completing this sprint, the ERP platform will have:

- Documented performance budgets per endpoint class.
- A measured performance baseline.
- Optimized database access with no N+1 query patterns.
- A caching layer for expensive, stable reads.
- Consistent pagination across all list endpoints.
- Improved frontend load performance.
- Load and stress test results with identified limits.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- How to measure before optimizing.
- Query plan analysis and indexing.
- The N+1 query problem and its solutions.
- Caching strategies and invalidation.
- Pagination and payload control.
- Frontend bundle and rendering performance.
- Load, stress, and soak testing.
- How to identify a system's actual bottleneck.

---

# Sprint Theme

## "Measure, Then Optimize"

The most common performance mistake is optimizing the wrong thing.

```text
Guess the bottleneck        →  Optimize        →  No improvement

Measure the bottleneck      →  Optimize        →  Verified improvement
```

Every optimization in this sprint must record a before and after number. An optimization without a measurement is not accepted.

---

# Business Capability

## Performance & Scalability

This sprint delivers:

- Performance measurement.
- Database optimization.
- Caching.
- API efficiency.
- Frontend efficiency.
- Load validation.

---

# Domain Concepts

---

# Performance Budget

An agreed maximum response time for a class of operation.

Example:

| Operation Class | Budget (p95) |
|-----------------|--------------|
| Authentication | 300 ms |
| Simple read (single record) | 200 ms |
| List with pagination | 500 ms |
| Transactional write | 800 ms |
| Standard report | 3 s |
| Complex analytical report | 10 s |
| Dashboard load | 2 s |

A budget is a requirement, not an aspiration.

---

# Baseline

The measured performance of the system before any optimization.

Without a baseline, improvement cannot be proven.

---

# N+1 Query Problem

One query to fetch a list, then one additional query per row.

```text
Fetch 100 sales orders          → 1 query

Fetch customer for each order   → 100 queries

Total                           → 101 queries
```

Fixed by eager loading or a single joined query.

---

# Index

A database structure that avoids scanning every row.

```text
Without index    → Sequential Scan  → cost grows with table size

With index       → Index Scan       → cost grows with matched rows
```

---

# Cache

A stored copy of a computed result, used to avoid recomputing it.

```text
Request → Cache Hit  → Return stored value

Request → Cache Miss → Compute → Store → Return
```

The hard part is not storing. It is knowing when to invalidate.

---

# Load, Stress, and Soak Testing

| Test | Question |
|------|----------|
| Load | Does it meet budgets at expected traffic? |
| Stress | At what traffic does it break, and how? |
| Soak | Does it degrade over hours of sustained use? |

---

# Sprint Scope

---

# 1. Performance Baseline and Budgets

## Objective

Establish what "fast enough" means and measure where the system stands.

## Tasks

- Agree performance budgets per operation class.
- Generate a realistic seed dataset at production scale.
- Instrument API response times.
- Measure every endpoint against its budget.
- Record the baseline as a committed document.
- Rank failing endpoints by user impact.

## Business Rules

- Budgets are expressed at the 95th percentile, not the average.
- Measurements are taken against the production-scale dataset.
- The baseline document is versioned and updated at the end of the sprint.

## Acceptance Criteria

- Performance budgets documented and agreed.
- Production-scale seed data generated and repeatable.
- Every endpoint measured.
- Baseline document committed.
- Failing endpoints ranked and turned into work items.

---

# 2. Database Optimization

## Objective

Reduce the cost of data access.

## Tasks

- Capture and analyse query plans for the slowest endpoints.
- Identify and eliminate N+1 query patterns.
- Add indexes for frequent filters, joins, and sorts.
- Remove unused and duplicate indexes.
- Review reporting aggregations from Sprint 09.
- Configure connection pooling.

## Business Rules

- Every added index must be justified by a query plan.
- Index changes ship as reviewed migrations.
- Write-heavy tables are assessed for index overhead before adding.
- No optimization is merged without a before and after measurement.

## Acceptance Criteria

- Query plans captured for the ten slowest endpoints.
- N+1 patterns eliminated and verified by query count assertions.
- Indexes added with documented justification.
- Unused indexes removed.
- Connection pooling configured and tuned.
- Before and after measurements recorded.

---

# 3. Caching Strategy

## Objective

Avoid recomputing expensive, stable results.

## Tasks

- Identify cacheable data by volatility and cost.
- Introduce a cache layer.
- Define a cache key and time-to-live per data class.
- Implement invalidation on write.
- Add cache hit and miss metrics.

## Cacheable Data Classes

| Data | Volatility | Strategy |
|------|-----------|----------|
| Chart of accounts | Very low | Long TTL |
| Product catalogue | Low | TTL with invalidation on update |
| User permissions | Low | Invalidate on role change |
| Dashboard KPIs | Medium | Short TTL |
| Report results | Medium | Cache per parameter set |
| Transactional records | High | Not cached |

## Business Rules

- Financial balances are never served from a stale cache.
- Permission caches invalidate immediately on role change.
- A cache failure must degrade to a direct read, never an error.
- Cache keys include the tenant and the user's permission scope where results differ by user.

## Acceptance Criteria

- Cache layer implemented.
- TTL and invalidation defined per data class.
- Invalidation verified by test.
- Cache failure falls back gracefully.
- Hit and miss metrics exposed.

---

# 4. API Performance and Pagination

## Objective

Control the cost and size of API responses.

## Tasks

- Apply consistent pagination to every list endpoint.
- Enforce a maximum page size.
- Allow field selection on large resources.
- Remove unnecessary nested data from list responses.
- Add response compression.
- Add slow request logging.

## Business Rules

- No list endpoint returns unbounded results.
- Default page size is modest; maximum page size is enforced server-side.
- Pagination metadata is consistent across all endpoints.
- List responses return summaries; full detail requires fetching the record.
- Requests exceeding their budget are logged with their parameters.

## Acceptance Criteria

- All list endpoints paginated consistently.
- Maximum page size enforced.
- Response payload sizes reduced and measured.
- Compression enabled.
- Slow request logging in place.

---

# 5. Frontend Performance

## Objective

Reduce the time until the user can work.

## Tasks

- Measure current bundle size and load metrics.
- Apply route-level code splitting.
- Lazy-load heavy components such as charts and data grids.
- Optimize images and fonts.
- Review and tune client-side query caching.
- Add loading and skeleton states for slow operations.

## Business Rules

- Initial bundle size must meet the agreed budget.
- Core Web Vitals must meet the agreed thresholds.
- No blocking request may delay first render beyond the budget.
- Perceived performance counts: a skeleton is better than a frozen screen.

## Acceptance Criteria

- Bundle size measured, reduced, and within budget.
- Route-level code splitting implemented.
- Heavy components lazy-loaded.
- Core Web Vitals thresholds met.
- Loading states present on all slow operations.
- Before and after measurements recorded.

---

# 6. Load and Stress Testing

## Objective

Discover the system's limits before production does.

## Tasks

- Define realistic user scenarios and traffic mix.
- Build load test scripts.
- Run load tests at expected traffic.
- Run stress tests to find the breaking point.
- Run a soak test over an extended period.
- Document limits, bottlenecks, and failure modes.

## Test Scenarios

```text
Scenario A: Daily operations
  60% reads, 30% writes, 10% reports
  Expected concurrent users

Scenario B: Month-end close
  40% reads, 20% writes, 40% reports
  Peak concurrent users

Scenario C: Soak
  Scenario A sustained for several hours
```

## Business Rules

- Load tests run against an environment matching production configuration.
- Tests measure response time, error rate, and resource usage together.
- A failure mode must be described, not only a failure point.
- Results are documented whether or not they are good.

## Acceptance Criteria

- Load test scripts committed and repeatable.
- Load test at expected traffic meets budgets.
- Stress test identifies the breaking point and failure mode.
- Soak test shows no memory leak or progressive degradation.
- Load test report produced with findings and recommendations.

---

# Performance Improvement Summary

Each optimization records:

| Field | Example |
|-------|---------|
| Endpoint | `GET /api/sales/orders` |
| Problem | N+1 query loading customer per order |
| Fix | Eager load customer in a single query |
| Before (p95) | 4,200 ms |
| After (p95) | 380 ms |
| Verified by | Query count assertion and load test |

---

# Database Changes

## Changes

```text
Indexes added on frequent filter, join, and sort columns
Unused indexes removed
Materialized aggregates for reporting read models
Connection pool configuration
```

No new business entities are introduced in this sprint.

---

# Infrastructure Requirements

```text
Cache service (Redis or equivalent)
Load testing tooling
Metrics collection for response times
Production-scale seed data generator
```

---

# GitHub Execution

---

# Epic

## Epic: Performance & Scalability

Purpose:

Make the platform's performance measured, predictable, and adequate for production load.

---

# GitHub Issues

---

# Issue 075 - Establish Performance Baseline and Budgets

Type:

```
Task
```

Acceptance Criteria:

- Performance budgets documented and agreed.
- Production-scale seed data generated and repeatable.
- Every endpoint measured against its budget.
- Baseline document committed.
- Failing endpoints ranked by impact.

---

# Issue 076 - Optimize Database Queries and Indexing

Type:

```
Improvement
```

Acceptance Criteria:

- Query plans captured for the slowest endpoints.
- N+1 patterns eliminated and asserted by tests.
- Indexes added with documented justification.
- Unused indexes removed.
- Before and after measurements recorded.

---

# Issue 077 - Implement Caching Strategy

Type:

```
Feature
```

Acceptance Criteria:

- Cache layer implemented.
- TTL and invalidation defined per data class.
- Invalidation verified by test.
- Cache failure degrades gracefully.
- Hit and miss metrics exposed.

---

# Issue 078 - Improve API Performance and Pagination

Type:

```
Improvement
```

Acceptance Criteria:

- All list endpoints paginated consistently.
- Maximum page size enforced.
- Payload sizes reduced and measured.
- Compression enabled.
- Slow request logging in place.

---

# Issue 079 - Improve Frontend Performance

Type:

```
Improvement
```

Acceptance Criteria:

- Bundle size within budget.
- Route-level code splitting implemented.
- Heavy components lazy-loaded.
- Core Web Vitals thresholds met.
- Loading states present on slow operations.

---

# Issue 080 - Run Load and Stress Testing

Type:

```
Task
```

Acceptance Criteria:

- Load test scripts committed and repeatable.
- Load test at expected traffic meets budgets.
- Stress test identifies breaking point and failure mode.
- Soak test shows no progressive degradation.
- Load test report produced.

---

# Development Workflow

Every change follows:

```text
GitHub Issue

        ↓

Feature Branch

        ↓

Measure Before

        ↓

Optimize

        ↓

Measure After

        ↓

Pull Request (with both measurements)

        ↓

Code Review

        ↓

Merge

        ↓

Release
```

---

# Testing Requirements

## Unit Testing

Required:

- Cache key generation.
- TTL and expiry logic.
- Invalidation triggers.
- Pagination boundary handling.
- Maximum page size enforcement.

---

## Integration Testing

Test:

- Query count assertions on list endpoints.
- Cache hit and miss behaviour.
- Cache invalidation on write.
- Cache unavailability fallback.
- Pagination consistency across endpoints.

---

## Performance Testing

### Baseline Verification

```text
Seed production-scale dataset

        ↓

Run measurement suite

        ↓

Compare against budgets

        ↓

Fail the build if a budget regresses
```

---

### Load Test

```text
Ramp to expected concurrent users

        ↓

Sustain for the agreed duration

        ↓

Assert p95 within budget

        ↓

Assert error rate below threshold
```

---

### Stress Test

```text
Increase load until failure

        ↓

Record breaking point

        ↓

Record failure mode

        ↓

Verify recovery after load drops
```

---

## Regression Testing

Validate:

- All existing functional tests still pass after optimization.
- No behaviour changed while improving performance.

---

# Documentation Deliverables

## Business Documentation

- Performance budgets and service expectations.
- Capacity findings and scaling recommendations.

---

## Technical Documentation

- Performance baseline document.
- Optimization log with before and after measurements.
- Load and stress test report.
- Index catalogue with justifications.
- ADR: caching strategy and invalidation model.
- ADR: pagination standard.

---

# Sprint Deliverables

## Performance

Completed:

- Budgets and baseline.
- Database optimization.
- Caching layer.
- API pagination and payload control.
- Frontend performance improvements.
- Load, stress, and soak test results.

---

## Engineering

Completed:

- Optimizations implemented and measured.
- Query count assertions added.
- Load test scripts committed.
- Performance regression gate added to CI.

---

## Documentation

Completed:

- Baseline and optimization log documented.
- Load test report produced.

---

# Sprint Review

The learner demonstrates:

1. Show the performance budgets and the original baseline.
2. Show a query plan before and after an index was added.
3. Show an N+1 pattern eliminated with query count evidence.
4. Show a cache hit and a cache invalidation.
5. Show frontend bundle size reduction and Core Web Vitals.
6. Run a load test and show budgets met.
7. Show the stress test breaking point and failure mode.

---

# Sprint Retrospective

## Discussion Topics

- Where the bottleneck actually was versus where it was assumed to be.
- Optimizations that produced no measurable gain.
- Trade-offs between caching and correctness.
- Whether earlier sprints could have avoided these problems.
- Lessons learned.

---

# Release

**Version:** `v0.13.0`

---

# Release Notes

```markdown
# v0.13.0

## Added

- Caching Layer for Expensive Reads
- Cache Hit and Miss Metrics
- Slow Request Logging
- Load and Stress Test Suite

## Changed

- Database indexes added and query plans optimized
- N+1 query patterns eliminated
- All list endpoints paginated with enforced maximum page size
- Response compression enabled
- Frontend bundle reduced through code splitting and lazy loading

## Performance

- Performance budgets defined and met at expected load
```

---

# Definition of Done

Sprint 12 is complete when:

- [ ] Performance budgets documented and agreed.
- [ ] Baseline measured and committed.
- [ ] Production-scale seed data available and repeatable.
- [ ] Database optimization completed with recorded measurements.
- [ ] N+1 patterns eliminated.
- [ ] Caching layer implemented with verified invalidation.
- [ ] All list endpoints paginated.
- [ ] Frontend performance budgets met.
- [ ] Load test passes at expected traffic.
- [ ] Stress and soak test results documented.
- [ ] Performance regression gate added to CI.
- [ ] All existing functional tests still pass.
- [ ] Documentation completed.
- [ ] Pull Request approved.
- [ ] Release v0.13.0 published.

---

# Skills Acquired

After completing Sprint 12, learners will understand:

## Measurement

- Establishing baselines and budgets.
- Percentile-based measurement.
- Proving improvement with evidence.

---

## Database Engineering

- Query plan analysis.
- Index design and maintenance.
- N+1 detection and elimination.
- Connection pooling.

---

## Backend Engineering

- Caching design and invalidation.
- Pagination standards.
- Payload optimization.

---

## Frontend Engineering

- Bundle analysis and code splitting.
- Lazy loading.
- Core Web Vitals.
- Perceived performance.

---

## Engineering Practice

- Load, stress, and soak testing.
- Capacity planning.
- Optimizing without changing behaviour.

---

# Next Sprint Preview

# Sprint 13 - Production Release

Planned:

- Production infrastructure.
- Environment and secrets management.
- Continuous deployment pipeline.
- Backup and disaster recovery.
- Production readiness review.
- The v1.0.0 release.
