# fullstack-roadmap-erp-bootcamp
A comprehensive Software Engineering Bootcamp where learners build an enterprise ERP system while practicing the complete Software Development Life Cycle (SDLC), Agile methodologies, GitHub workflows, testing, DevOps, and production deployment.

# Bootcamp Principles

This bootcamp is designed to simulate the workflow of a modern software engineering organization.

The learner is expected to:

- Think like a Product Owner before writing code.
- Design like a Solution Architect before implementation.
- Develop using professional GitHub workflows.
- Test every feature before merging.
- Automate repetitive tasks.
- Deploy continuously through CI/CD.
- Monitor software after release.
- Document every significant engineering decision.
- Continuously improve through sprint retrospectives.

The objective is not simply to build an ERP.

The objective is to become a professional software engineer capable of delivering enterprise software from business requirements through production deployment.

# Docker Development

The local development stack runs the frontend and backend through Docker Compose. The backend connects to the configured Supabase PostgreSQL database through `DATABASE_URL`.

## First-time setup

```bash
cp .env.example .env
docker compose up --build
```

After startup:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## Common commands

```bash
docker compose up
docker compose up --build
docker compose down
docker compose down -v
```

Use `docker compose down` to stop containers. This setup does not run a local PostgreSQL container.

## Database migrations

Run Prisma migrations from inside the backend container:

```bash
docker compose exec backend npx prisma migrate deploy
```

For local development migration creation:

```bash
docker compose exec backend npx prisma migrate dev
```

Compose passes `DATABASE_URL` from `.env`, and the backend connects directly to the Supabase PostgreSQL database.

# Directory Structure
```text
fullstack-roadmap-erp-bootcamp/
│
├── academy/          # Learning materials
├── docs/             # Student-created documentation
├── frontend/
├── backend/
├── database/
├── infrastructure/   # Docker, Compose, deployment configs
├── tests/  
├── scripts/          # Helper scripts
├── .github/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE

fullstack-roadmap-erp-bootcamp/
│
├── academy/
│   ├── README.md
│   │
│   ├── 00-program-overview/
│   │   ├── roadmap.md
│   │   ├── bootcamp-philosophy.md
│   │   ├── graduation-requirements.md
│   │   └── expectations.md
│   │
│   ├── 01-software-engineering/
│   │   ├── git-github.md
│   │   ├── agile-scrum.md
│   │   ├── sdlc.md
│   │   ├── branching-strategy.md
│   │   ├── pull-request-guide.md
│   │   ├── code-review.md
│   │   └── conventional-commits.md
│   │
│   ├── 02-business-analysis/
│   │   ├── brd.md
│   │   ├── srs.md
│   │   ├── stakeholder-analysis.md
│   │   ├── user-stories.md
│   │   ├── acceptance-criteria.md
│   │   └── process-flow.md
│   │
│   ├── 03-system-design/
│   │   ├── architecture.md
│   │   ├── erd.md
│   │   ├── api-design.md
│   │   ├── sequence-diagrams.md
│   │   └── security.md
│   │
│   ├── 04-development/
│   │   ├── backend.md
│   │   ├── frontend.md
│   │   ├── coding-standards.md
│   │   ├── typescript.md
│   │   └── project-structure.md
│   │
│   ├── 05-testing/
│   │   ├── testing-strategy.md
│   │   ├── unit-testing.md
│   │   ├── integration-testing.md
│   │   ├── e2e-testing.md
│   │   └── qa-process.md
│   │
│   ├── 06-devops/
│   │   ├── github-actions.md
│   │   ├── docker.md
│   │   ├── deployment.md
│   │   ├── monitoring.md
│   │   └── release-management.md
│   │
│   ├── 07-templates/
│   │   ├── brd-template.md
│   │   ├── srs-template.md
│   │   ├── adr-template.md
│   │   ├── issue-template.md
│   │   ├── pr-template.md
│   │   ├── release-template.md
│   │   └── retrospective-template.md
│   │
│   08-sprints/
│   │
│   ├── README.md
│   │
│   ├── phase-00-foundation/
│   │   │
│   │   ├── phase-overview.md
│   │   │
│   │   ├── sprint-00-project-foundation.md
│   │   └── sprint-01-application-foundation.md
│   │
│   ├── phase-01-core-platform/
│   │   │
│   │   ├── phase-overview.md
│   │   │
│   │   ├── sprint-02-identity-access-management.md
│   │   └── sprint-03-organization-employee-management.md
│   │
│   ├── phase-02-erp-business-modules/
│   │   │
│   │   ├── phase-overview.md
│   │   │
│   │   ├── sprint-04-human-resource-management.md
│   │   ├── sprint-05-inventory-management.md
│   │   ├── sprint-06-sales-management.md
│   │   └── sprint-07-purchasing-management.md
│   │
│   ├── phase-03-enterprise-capabilities/
│   │   │
│   │   ├── phase-overview.md
│   │   │
│   │   ├── sprint-08-finance-accounting.md
│   │   ├── sprint-09-reporting-analytics.md
│   │   └── sprint-10-notification-workflow-engine.md
│   │
│   ├── phase-04-production-readiness/
│   │   │
│   │   ├── phase-overview.md
│   │   │
│   │   ├── sprint-11-security-hardening.md
│   │   ├── sprint-12-performance-scalability.md
│   │   └── sprint-13-production-release.md
│   │
│   └── phase-05-engineering-maturity/
│   │   │
│   │   ├── phase-overview.md
│   │   │
│   │   ├── sprint-14-refactoring-technical-debt.md
│   │   ├── sprint-15-observability-monitoring.md
│   │   └── sprint-16-final-capstone-release.md
│   │
│   └── references/
│   ├── glossary.md
│   ├── terminology.md
│   ├── learning-resources.md
│   └── recommended-books.md
│
├── docs/
│   ├── BRD/
│   ├── SRS/
│   ├── Architecture/
│   ├── ADR/
│   ├── API/
│   ├── Sprint Reports/
│   ├── Release Notes/
│   └── User Manuals/
│
├── frontend/
├── backend/
├── database/
├── infrastructure/
├── tests/
├── scripts/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── README.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```
