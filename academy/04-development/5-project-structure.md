# Project Structure

**Version:** 1.0

---

# Purpose

A well-defined project structure ensures that the ERP system remains organized, scalable, maintainable, and easy for engineers to navigate.

As the application grows across multiple Sprints and business modules, a consistent folder structure allows engineers to collaborate efficiently without introducing unnecessary complexity.

Throughout this bootcamp, **all development must follow the official project structure defined in this document.**

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand monorepo organization
- Navigate the ERP project efficiently
- Organize code by business features
- Separate documentation from implementation
- Maintain a scalable folder hierarchy
- Follow enterprise repository standards

---

# Project Philosophy

This repository simulates a real software engineering organization.

The repository contains everything required to deliver software:

- Academy
- Documentation
- Source Code
- Database
- Testing
- CI/CD
- GitHub Configuration

A single repository acts as the source of truth for the project.

---

# Repository Structure

```text
fullstack-roadmap-erp-bootcamp/

├── academy/
├── docs/
├── frontend/
├── backend/
├── database/
├── tests/
├── .github/
├── README.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

Each top-level directory has a specific responsibility.

---

# Academy

The `academy/` directory contains the complete learning curriculum.

```text
academy/

├── 00-program-overview/
├── 01-software-engineering/
├── 02-business-analysis/
├── 03-system-design/
├── 04-development/
├── 05-testing/
├── 06-devops/
├── 07-templates/
├── 08-sprints/
└── references/
```

The academy teaches concepts and engineering practices.

No application source code should be placed here.

---

# Documentation

The `docs/` directory contains project documentation.

```text
docs/

├── BRD/
├── SRS/
├── Architecture/
├── ADR/
├── API/
├── Sprint Reports/
├── Release Notes/
└── User Manuals/
```

This directory stores project deliverables rather than learning materials.

---

# Frontend

The frontend contains the ERP web application.

```text
frontend/

├── app/
├── components/
├── features/
├── hooks/
├── layouts/
├── lib/
├── providers/
├── services/
├── styles/
├── types/
├── utils/
├── public/
└── tests/
```

The frontend follows a feature-based architecture.

---

# Backend

The backend contains the REST API and business logic.

```text
backend/

├── src/
├── prisma/
├── test/
├── package.json
└── tsconfig.json
```

Within `src/`, business functionality is organized into modules.

Example:

```text
src/

├── auth/
├── users/
├── employees/
├── inventory/
├── sales/
├── procurement/
├── finance/
├── common/
└── config/
```

Each module owns its business logic.

---

# Database

The database directory contains database-related resources.

```text
database/

├── migrations/
├── seed/
├── diagrams/
└── scripts/
```

Responsibilities include:

- Schema evolution
- Seed data
- ERD assets
- Database utilities

---

# Tests

The `tests/` directory contains testing assets that span multiple applications.

```text
tests/

├── unit/
├── integration/
├── e2e/
├── performance/
├── fixtures/
└── reports/
```

Application-specific tests may also reside alongside the feature they test.

---

# GitHub Configuration

The `.github/` directory stores repository automation.

```text
.github/

├── workflows/
├── ISSUE_TEMPLATE/
├── PULL_REQUEST_TEMPLATE.md
└── CODEOWNERS
```

Examples include:

- GitHub Actions
- Pull Request templates
- Issue templates
- Repository governance

---

# Feature Organization

Both frontend and backend should organize code by business capability.

Example:

```text
Employees

Departments

Inventory

Products

Sales

Finance

Procurement
```

Avoid organizing large applications solely by file type.

---

# Documentation Ownership

Every Sprint may update:

```text
academy/

docs/

frontend/

backend/

database/

tests/
```

A feature is considered complete only when its documentation is updated alongside the code.

---

# Naming Conventions

Directories:

```text
employees

inventory

sales-orders
```

Files:

```text
employee.service.ts

employee.controller.ts

employee.repository.ts

employee-form.tsx
```

Documentation:

```text
brd.md

api-design.md

testing-strategy.md
```

Maintain consistent naming throughout the repository.

---

# Configuration Files

Examples:

```text
package.json

tsconfig.json

eslint.config.js

prettier.config.js

docker-compose.yml

.env.example
```

Configuration should be centralized and version controlled.

Never commit sensitive information.

---

# Generated Files

Generated files should not be manually edited.

Examples:

- Build artifacts
- Coverage reports
- Generated Prisma client
- Compiled JavaScript
- Dependency caches

These files should be excluded using `.gitignore`.

---

# Monorepo Principles

This repository follows a monorepo approach.

Benefits:

- Shared documentation
- Shared standards
- Unified Git history
- Single source of truth
- Simplified onboarding
- Consistent engineering workflow

All engineering disciplines collaborate within one repository.

---

# Relationship to the SDLC

Every Sprint follows the same repository workflow.

```text
academy/

        │

Learn

        ▼

docs/

        │

Design

        ▼

backend/

frontend/

database/

        │

Develop

        ▼

tests/

        │

Validate

        ▼

.github/

        │

Automate

        ▼

Release
```

The repository structure mirrors the Software Development Life Cycle.

---

# GitHub Workflow

Every feature follows the project's GitHub workflow.

```text
GitHub Issue
        │
        ▼
Feature Branch
        │
        ▼
Documentation
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Pull Request
        │
        ▼
Code Review
        │
        ▼
GitHub Actions
        │
        ▼
Merge
```

Documentation and code evolve together throughout the project.

---

# Best Practices

Professional engineers should:

- Organize code by feature.
- Keep modules independent.
- Maintain consistent naming.
- Separate documentation from implementation.
- Avoid unnecessary nesting.
- Remove obsolete files.
- Keep repository organization predictable.

---

# Common Mistakes

Avoid:

- Mixing unrelated features.
- Deeply nested directories.
- Duplicating utilities.
- Placing documentation inside source code folders.
- Committing generated files.
- Creating inconsistent naming conventions.
- Ignoring repository standards.

A clean repository improves productivity and onboarding.

---

# Project Structure in This Bootcamp

This repository grows incrementally as the learner progresses through each Sprint.

Every new ERP module must:

- Follow the approved folder structure.
- Respect module boundaries.
- Include documentation updates.
- Include automated tests.
- Integrate with the existing architecture.
- Pass GitHub quality gates.

The repository should remain organized from Sprint 0 through the final release.

---

# Expected Outcome

By completing this section, the learner should understand how to organize a professional software repository using a monorepo approach.

Throughout this bootcamp, the project structure serves as the foundation for collaboration between Business Analysis, System Design, Development, Testing, DevOps, and Documentation, ensuring that every ERP feature is delivered in a consistent, scalable, and maintainable manner.