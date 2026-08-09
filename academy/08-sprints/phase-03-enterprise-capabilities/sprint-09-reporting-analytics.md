# Sprint 09 - Reporting & Analytics

**Sprint:** Sprint 09  
**Phase:** Phase 03 - Enterprise Capabilities  
**Duration:** 3-4 Weeks  
**Release Target:** v0.10.0  
**Status:** Planned

---

# Sprint Goal

Implement the Reporting and Analytics capability by introducing a dedicated reporting architecture, parameterized report definitions, cross-module KPIs, an executive dashboard, report export, and scheduled report delivery.

At the end of this sprint, business users should be able to answer questions that span multiple ERP modules without querying the database directly.

---

# Sprint Context

Previous sprints produced data in isolated modules:

```text
HR            Inventory        Sales        Purchasing        Finance

 │                │              │              │                │

 └────────────────┴──────┬───────┴──────────────┴────────────────┘

                         ↓

                  No unified view
```

Each module has its own dashboard, but no capability answers questions like:

```text
Which products generate the most revenue and the lowest stock turnover?

Which customers are both high-value and consistently overdue?

What is total spend by department this quarter?
```

Sprint 09 introduces the reporting layer that answers them.

---

# Business Outcome

After completing this sprint, the ERP platform will support:

- A reusable reporting architecture.
- Report definitions with parameters.
- Cross-module business KPIs.
- An executive dashboard.
- Report export to common formats.
- Scheduled report delivery.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- The difference between transactional and analytical data access.
- Read model and query layer design.
- Aggregation and grouping strategies.
- Report parameterization and validation.
- KPI definition and calculation.
- Data visualization principles.
- Query performance and indexing.
- Access control for reports.

---

# Sprint Theme

## "Reports Are a Different Workload"

Transactional queries touch a few rows and must be fast to write.

Analytical queries touch many rows and must be fast to read.

```text
Transactional Model            Analytical Model

Normalized                     Aggregated
Row-level access               Set-level access
Optimized for writes           Optimized for reads
```

Running analytics directly against transactional tables is the most common cause of ERP performance collapse.

---

# Business Capability

## Reporting & Analytics

The reporting capability provides:

- Report definition management.
- Cross-module data aggregation.
- KPI calculation.
- Dashboard visualization.
- Report export.
- Scheduled delivery.

---

# Domain Concepts

---

# Report Definition

A saved, reusable description of a report.

Stores:

- Report Code.
- Report Name.
- Category.
- Parameters.
- Required Permission.
- Data Source.

---

# Report Parameter

An input that changes what a report returns.

Examples:

```text
dateFrom       (date, required)
dateTo         (date, required)
customerId     (reference, optional)
warehouseId    (reference, optional)
departmentId   (reference, optional)
```

---

# Read Model

A query-optimized representation of data assembled from one or more modules.

```text
SalesOrder + SalesOrderLine + Product + Customer

                        ↓

               SalesPerformanceView
```

Read models are derived data. They are never the source of truth.

---

# KPI

A single measured value that summarizes business performance.

Examples:

```text
Monthly Revenue
Gross Margin
Inventory Turnover
Days Sales Outstanding
Order Fulfillment Rate
Employee Headcount
```

---

# Report Execution

A single run of a report with specific parameter values.

```text
Report Definition + Parameters → Report Execution → Result Set
```

---

# Report Schedule

A configuration that runs a report automatically and delivers the result.

```text
Daily / Weekly / Monthly

        ↓

Report Executed

        ↓

Delivered to Recipients
```

---

# Sprint Scope

---

# 1. Reporting Architecture and Read Models

## Objective

Establish a dedicated reporting layer separate from transactional services.

## Tasks

- Create a reporting module in the backend.
- Define read models for sales, inventory, procurement, HR, and finance.
- Add the database indexes required by aggregation queries.
- Establish a query layer that reporting services use exclusively.

## Business Rules

- Reporting queries must not write to transactional tables.
- Reporting must not bypass permission checks.
- Read models are rebuilt from source data and are never edited directly.

## Acceptance Criteria

- Reporting module created and isolated from transactional modules.
- Read models defined for each source module.
- Indexes added and documented.
- Query performance measured and recorded as a baseline.

---

# 2. Report Definitions and Parameters

## Objective

Allow reports to be defined once and run with different inputs.

## Features

Users can:

- Browse available reports by category.
- Supply parameters before running a report.
- Run a report and view results in a table.
- Sort and paginate results.

## Business Rules

- Required parameters must be supplied.
- Parameter values are validated before execution.
- Date ranges cannot be inverted.
- A user can only run reports permitted by their role.

## Acceptance Criteria

- Report catalogue available.
- Parameter validation enforced.
- Results paginated and sortable.
- Unauthorized report access blocked.

---

# 3. Cross-Module KPIs

## Objective

Calculate business metrics that span multiple modules.

## KPIs

| KPI | Source Modules |
|-----|----------------|
| Monthly Revenue | Sales, Finance |
| Gross Margin | Sales, Inventory |
| Inventory Turnover | Inventory, Sales |
| Days Sales Outstanding | Sales, Finance |
| Spend by Supplier | Purchasing, Finance |
| Order Fulfillment Rate | Sales, Inventory |
| Headcount and Attrition | HR |

## Business Rules

- Each KPI has a documented formula.
- KPI values must reconcile with the underlying module reports.
- KPIs return a value and a comparison against the previous period.

## Acceptance Criteria

- All listed KPIs implemented.
- Formulas documented.
- KPI values reconcile with module-level data.
- Period comparison available.

---

# 4. Executive Dashboard

## Objective

Provide a single view of business performance.

## Features

Users can:

- View KPI summary tiles.
- View revenue and spend trends over time.
- View top customers, products, and suppliers.
- Filter the whole dashboard by date range.
- Drill from a KPI into its detailed report.

## Business Rules

- Dashboard content adapts to the user's role.
- Every visualization states its date range and units.
- Drill-down preserves the active filters.

## Acceptance Criteria

- Dashboard renders KPI tiles and charts.
- Date range filtering applies to all widgets.
- Drill-down navigates to the detailed report with filters intact.
- Role-based visibility enforced.

---

# 5. Report Export

## Objective

Let users take report results out of the system.

## Features

Users can:

- Export report results to CSV.
- Export report results to PDF.
- Download the exported file.

## Business Rules

- Exports contain exactly the rows the user is permitted to see.
- Large exports are generated in the background.
- Export files include the report name, parameters, and generation timestamp.
- Export activity is logged.

## Acceptance Criteria

- CSV and PDF export available.
- Exported data matches on-screen results.
- Large exports do not block the request.
- Export activity recorded in the audit log.

---

# 6. Scheduled Reports

## Objective

Deliver reports automatically without user action.

## Features

Users can:

- Create a schedule for a report.
- Choose frequency and recipients.
- Save parameter values with the schedule.
- View schedule run history.
- Disable a schedule.

## Business Rules

- Schedules run as a background job.
- A failed run is retried and recorded.
- Recipients must have permission to view the report.
- Schedule history retains the last N runs.

## Acceptance Criteria

- Schedule CRUD available.
- Scheduled reports execute at the configured time.
- Results delivered to recipients.
- Failures logged and retried.
- Run history visible.

---

# Database Design

## New Entities

```text
ReportDefinition
ReportParameter
ReportExecution
ReportSchedule
ReportScheduleRun
KpiDefinition
```

---

# Report Definition Table

```text
ReportDefinition

id
reportCode
name
category
description
requiredPermission
dataSource
status
```

---

# Report Parameter Table

```text
ReportParameter

id
reportDefinitionId
parameterKey
dataType
isRequired
defaultValue
displayOrder
```

---

# Report Execution Table

```text
ReportExecution

id
reportDefinitionId
executedBy
parameters
rowCount
durationMs
executedAt
status
```

---

# Report Schedule Table

```text
ReportSchedule

id
reportDefinitionId
frequency
parameters
recipients
exportFormat
isActive
createdBy
nextRunAt
```

---

# KPI Definition Table

```text
KpiDefinition

id
kpiCode
name
formula
unit
sourceModules
comparisonPeriod
```

---

# Entity Relationships

```text
ReportDefinition → ReportParameter

ReportDefinition → ReportExecution

ReportDefinition → ReportSchedule → ReportScheduleRun

KpiDefinition → (calculated from read models)

Read Models ← Sales / Inventory / Purchasing / HR / Finance
```

---

# API Requirements

## Report Catalogue APIs

```text
GET    /api/reports
GET    /api/reports/{reportCode}
GET    /api/reports/{reportCode}/parameters
```

---

## Report Execution APIs

```text
POST   /api/reports/{reportCode}/run
GET    /api/reports/executions
GET    /api/reports/executions/{id}
```

---

## KPI APIs

```text
GET    /api/analytics/kpis
GET    /api/analytics/kpis/{kpiCode}
```

---

## Dashboard APIs

```text
GET    /api/analytics/dashboard
GET    /api/analytics/trends/revenue
GET    /api/analytics/trends/spend
GET    /api/analytics/top/customers
GET    /api/analytics/top/products
```

---

## Export APIs

```text
POST   /api/reports/{reportCode}/export
GET    /api/reports/exports/{id}/download
```

---

## Schedule APIs

```text
GET    /api/reports/schedules
POST   /api/reports/schedules
PUT    /api/reports/schedules/{id}
DELETE /api/reports/schedules/{id}
GET    /api/reports/schedules/{id}/runs
```

---

# GitHub Execution

---

# Epic

## Epic: Reporting & Analytics

Purpose:

Build the decision-support layer that turns ERP transaction data into business insight.

---

# GitHub Issues

---

# Issue 057 - Establish Reporting Architecture and Read Models

Type:

```
Feature
```

Acceptance Criteria:

- Reporting module created and isolated.
- Read models defined per source module.
- Required indexes added and documented.
- Query performance baseline recorded.

---

# Issue 058 - Implement Report Definitions and Parameters

Type:

```
Feature
```

Acceptance Criteria:

- Report catalogue available.
- Parameters validated before execution.
- Results paginated and sortable.
- Report-level permissions enforced.

---

# Issue 059 - Implement Cross-Module KPIs

Type:

```
Feature
```

Acceptance Criteria:

- All defined KPIs implemented.
- Formulas documented.
- KPI values reconcile with module reports.
- Period comparison available.

---

# Issue 060 - Create Executive Dashboard

Type:

```
Feature
```

Acceptance Criteria:

- KPI tiles and trend charts rendered.
- Global date filtering works.
- Drill-down preserves filters.
- Role-based visibility enforced.

---

# Issue 061 - Implement Report Export

Type:

```
Feature
```

Acceptance Criteria:

- CSV and PDF export available.
- Exported data matches on-screen results.
- Large exports processed in the background.
- Export activity logged.

---

# Issue 062 - Implement Scheduled Reports

Type:

```
Task
```

Acceptance Criteria:

- Schedule CRUD completed.
- Scheduled reports run automatically.
- Results delivered to recipients.
- Failures retried and logged.

---

# Development Workflow

Every change follows:

```text
GitHub Issue

        ↓

Feature Branch

        ↓

Development

        ↓

Commit

        ↓

Pull Request

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

- KPI formula calculations.
- Aggregation and grouping logic.
- Parameter validation rules.
- Date range validation.
- Export formatting.

---

## Integration Testing

Test:

- Report catalogue APIs.
- Report execution APIs against seeded data.
- KPI APIs.
- Dashboard APIs.
- Export generation.
- Schedule execution.

---

## End-to-End Testing

### Report Execution Flow

```text
Open Report Catalogue

        ↓

Select Sales by Customer

        ↓

Supply Date Range

        ↓

Run Report

        ↓

Verify Totals Match Sales Module

        ↓

Export to CSV
```

---

### Dashboard Drill-Down Flow

```text
Open Executive Dashboard

        ↓

Set Date Range

        ↓

Click Monthly Revenue KPI

        ↓

Detailed Report Opens With Same Date Range
```

---

## Performance Testing

Validate:

- Reports return within the agreed time budget on a seeded dataset.
- Dashboard loads within the agreed time budget.
- Reporting queries do not degrade transactional endpoints.

---

# Documentation Deliverables

## Business Documentation

- Reporting requirements catalogue.
- KPI definitions and formulas.
- Report access matrix.

---

## Technical Documentation

- Reporting architecture documentation.
- Read model documentation.
- Reporting API documentation.
- ADR: reporting read model strategy.
- ADR: background export and scheduling approach.

---

# Sprint Deliverables

## Reporting Capability

Completed:

- Reporting architecture and read models.
- Report definitions and parameters.
- Cross-module KPIs.
- Executive dashboard.
- Report export.
- Scheduled reports.

---

## Engineering

Completed:

- Reporting APIs implemented.
- Indexes added.
- Background jobs implemented.
- Automated tests created.
- Performance baseline recorded.

---

## Documentation

Completed:

- KPI formulas documented.
- Reporting architecture documented.

---

# Sprint Review

The learner demonstrates:

1. Browse the report catalogue.
2. Run a parameterized report.
3. Reconcile report totals against the source module.
4. Show the executive dashboard.
5. Drill from a KPI into its detail report.
6. Export a report to CSV and PDF.
7. Show a scheduled report run and its delivery.

---

# Sprint Retrospective

## Discussion Topics

- Transactional versus analytical data access.
- Read model design decisions.
- Query performance findings.
- KPI definition disagreements and how they were resolved.
- Lessons learned.

---

# Release

**Version:** `v0.10.0`

---

# Release Notes

```markdown
# v0.10.0

## Added

- Reporting Architecture and Read Models
- Report Definitions and Parameters
- Cross-Module KPIs
- Executive Dashboard
- Report Export (CSV, PDF)
- Scheduled Reports
```

---

# Definition of Done

Sprint 09 is complete when:

- [ ] Reporting architecture established.
- [ ] Read models implemented.
- [ ] Report definitions and parameters completed.
- [ ] Cross-module KPIs completed and reconciled.
- [ ] Executive dashboard completed.
- [ ] Report export completed.
- [ ] Scheduled reports completed.
- [ ] Performance budget met.
- [ ] APIs documented.
- [ ] Tests passing.
- [ ] Documentation completed.
- [ ] Pull Request approved.
- [ ] Release v0.10.0 published.

---

# Skills Acquired

After completing Sprint 09, learners will understand:

## Business Analysis

- Reporting requirement gathering.
- KPI definition and agreement.
- Presenting data for decision-making.

---

## Backend Development

- Read model design.
- Aggregation query construction.
- Query performance tuning and indexing.
- Background job processing.

---

## Frontend Development

- Data visualization.
- Dashboard composition.
- Parameterized report interfaces.
- Export and download handling.

---

## ERP Engineering

- Separating transactional and analytical workloads.
- Cross-module data integration.
- Building decision-support capability.

---

# Next Sprint Preview

# Sprint 10 - Workflow & Notification Engine

Planned:

- Configurable workflow engine.
- Approval routing and delegation.
- Task inbox.
- Notification service.
- Notification templates and preferences.
- Workflow audit trail.
