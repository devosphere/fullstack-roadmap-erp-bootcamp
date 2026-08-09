# [IMPROVEMENT] Improve Frontend Performance

<!-- GitHub title: [IMPROVEMENT] Improve Frontend Performance
     Labels: improvement, frontend, performance, priority: medium
     Milestone: Sprint 12 - Performance & Scalability
     Branch: feature/079-improve-frontend-performance
     Epic: Performance & Scalability
     Depends on: 075, 078
     Blocks: 080
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

## Module: frontend
## Sprint: Sprint 12 - Performance & Scalability

---

## Summary

Reduce the time until the application is usable: measure and cut bundle size with route-level code
splitting, lazy-load heavy components, tune client-side query caching, and add loading states
everywhere a request can be slow.

## Background

Eleven feature sprints each added routes, dashboards, and forms without a shared budget for what
they cost the browser. By this point, the frontend bundle contains every module's chart library
usage (six dashboards' worth, from Issues 028 through 060), every data table, and every form — all
loaded whether or not the current page needs them.

Two kinds of performance matter here, and they are measured differently:

- **Actual performance**: bundle size, Core Web Vitals, time to first render — measurable, budget-
  driven, the same discipline as every backend issue in this sprint.
- **Perceived performance**: whether the screen looks responsive while data loads. A skeleton state
  while Issue 060's executive dashboard fetches its KPIs is not a performance fix in the strict
  sense, but it changes how the delay feels — and after Issue 077's caching and Issue 076's query
  work, some genuine latency will still remain that no backend fix eliminates.

Both matter, and this issue addresses both explicitly rather than treating loading spinners as a
lesser concern than bundle size.

## User Story

As a User,
I want the application to load quickly and never show a frozen screen while data is fetched,
So that the interface feels responsive even when a request genuinely takes a moment.

## Acceptance Criteria

```gherkin
Given the initial application bundle
When it is measured
Then its size is within the agreed budget
```

```gherkin
Given a route the user has not yet visited
When they navigate to it
Then only the code for that route (and shared dependencies) loads, not the entire application
```

```gherkin
Given a dashboard with chart widgets (Issues 028, 035, 042, 049, 056, 060)
When the page first renders
Then the charts load lazily rather than blocking the initial paint
```

```gherkin
Given any view that fetches data taking longer than an instant
When the fetch is in progress
Then a skeleton or loading state is shown rather than a blank or frozen screen
```

```gherkin
Given the application's Core Web Vitals
When measured against the agreed thresholds
Then they are met
```

- [ ] Baseline bundle size and Core Web Vitals measured before any change
- [ ] Route-level code splitting implemented across the application
- [ ] Heavy components — chart libraries, data grids — lazy-loaded
- [ ] Client-side query caching (TanStack Query, per `AGENTS.md`) reviewed and tuned: stale time, cache time, refetch behavior
- [ ] Images and fonts optimized
- [ ] Loading and skeleton states added to every view that fetches data, including all six module dashboards
- [ ] Error boundaries confirmed present so a failed fetch degrades gracefully rather than blanking the page
- [ ] Bundle size and Core Web Vitals re-measured after changes and compared to budget
- [ ] Before/after measurements recorded in the Issue 075 baseline document

## Expected Result

The application loads faster by every measured standard, and where genuine latency remains after
backend optimization, the interface communicates that something is happening rather than appearing
broken or frozen.

---

## Scope

### Included

- Bundle size measurement and reduction
- Route-level code splitting
- Lazy loading of heavy components
- Client-side query cache tuning
- Image and font optimization
- Loading/skeleton states across all views, especially the six dashboards
- Core Web Vitals measurement

### Out of Scope

- Backend response time (Issues 076, 077, 078 — this issue assumes those inputs and optimizes what the frontend does with them)
- Server-side rendering strategy changes
- Progressive Web App / offline support
- Mobile-native app performance

## Technical Requirements

**Budgets** (agree and document specific figures; indicative targets below)

```text
Initial bundle size (gzipped)     within budget, e.g. < 250KB
Largest Contentful Paint (LCP)     within budget, e.g. < 2.5s
First Input Delay / INP             within budget
Cumulative Layout Shift (CLS)       within budget, e.g. < 0.1
```

**Code splitting**

```text
Each top-level route (per Next.js App Router conventions, per AGENTS.md's stack)
loads its own chunk, so visiting /portal does not download the code for
/finance/reports or /procurement/approvals
```

**Lazy loading — priority targets**

```text
Every chart component across the six dashboards
    (Issues 028, 035, 042, 049, 056, 060)

Every large data table/grid component
    (employee list, product list, order list, and similar)
```

These are named explicitly because each dashboard was built independently across five different
sprints and is likely to have imported its charting library eagerly at the top of its module rather
than lazily.

**Query cache tuning**

Review TanStack Query configuration:

```text
staleTime      how long data is considered fresh before a background refetch
cacheTime      how long unused data stays in memory
refetchOnWindowFocus, refetchOnReconnect   tuned per data volatility,
    following the same volatility judgment already made per data class in Issue 077
```

Align these choices conceptually with Issue 077's backend cache TTLs — data that Issue 077 treats
as low-volatility (product catalogue) should not aggressively refetch on the client either.

**Loading states**

Every view built since Issue 005 that fetches data on mount gets a skeleton or spinner state,
prioritizing:

```text
The six dashboards (highest visibility, most likely to have real latency even after backend work)
Every list/table view
Every detail view
```

**Measurement tooling**

```text
Bundle analysis: webpack-bundle-analyzer or equivalent for the Next.js build
Core Web Vitals: Lighthouse or equivalent, run against representative pages
```

## Dependencies

- Issue 075 — the baseline and budget-setting approach this issue follows for the frontend.
- Issue 078 — API response shape changes (trimmed list payloads) that this issue's frontend code
  must already assume.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Bundle size measured before and after, within budget
- [ ] Core Web Vitals measured before and after, within budget
- [ ] Route-level code splitting verified by inspecting network requests per route
- [ ] Lazy loading verified for chart components on all six dashboards
- [ ] Loading states present and tested on all six dashboards and major list/detail views
- [ ] No visual regression on pages touched by this issue
- [ ] Code review completed
- [ ] CI green
- [ ] Before/after measurements recorded in the Issue 075 baseline document
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-12-performance-scalability.md` § 5 |
| Epic | Performance & Scalability |
| Assumes response shapes from | Issue 078 |
| Lazy-loads charts from | Issues 028, 035, 042, 049, 056, 060 |
| Pull Request | _to be linked_ |
