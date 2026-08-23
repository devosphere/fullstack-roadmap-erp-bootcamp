# Architecture Document: ERP System

## Document Information

| Field | Value |
| --- | --- |
| Document Type | Architecture Document |
| Product | Enterprise Resource Planning System |
| Scope | Whole ERP system |
| Status | Draft |
| Owner | Technical Lead |
| Reviewers | Product Owner, System Analyst, QA Lead |
| Related BRD | `docs/BRD/README.md` |
| Related SRS | `docs/SRS/README.md` |

## 1. Architecture Overview

The ERP system uses a modular monolith architecture. The platform is deployed as one frontend application, one backend application, and one shared database, while business capabilities are organized into clear modules.

This approach keeps the system simpler than microservices while still enforcing boundaries between ERP domains such as identity, employees, HR, inventory, purchasing, sales, finance, reporting, and workflow.

## 2. Architecture Goals

- Keep the system understandable for a full-stack bootcamp project.
- Organize code by feature and business module.
- Keep business logic separate from HTTP handling and database access.
- Enforce authentication and authorization on the backend.
- Support shared master data without allowing uncontrolled module coupling.
- Provide a structure that can grow across the full ERP roadmap.
- Prepare the system for testing, documentation, release readiness, and future production hardening.

## 3. High-Level System Context

```text
Internal Users
      |
      v
Frontend Web Application
      |
      v
REST API
      |
      v
Backend Application
      |
      v
Database
```

Primary users are internal staff, managers, administrators, and leadership. Customers and suppliers are external stakeholders represented through internal records and transactions, not direct system users in the first scope.

## 4. Application Architecture Style

The ERP uses a modular monolith.

The system should not be a tightly coupled single codebase where all business logic is mixed together. It should also not start as microservices, because separate services would add operational complexity before the product needs it.

The modular monolith approach means:

- One backend application.
- One frontend application.
- One shared database.
- Clear module boundaries.
- Feature-based organization.
- Shared infrastructure for cross-cutting concerns.
- Business logic owned by the module responsible for that domain.

## 5. Backend Architecture

The backend is responsible for business rules, validation, authorization, data access, API responses, workflow behavior, and integrations.

Backend code should be organized by feature/module:

```text
backend/src/
  auth/
  users/
  employees/
  departments/
  inventory/
  sales/
  procurement/
  finance/
  reporting/
  workflow/
  common/
  config/
```

Each module should own its local structure:

```text
employees/
  employee.controller.ts
  employee.service.ts
  employee.repository.ts
  dto/
  entities/
  validators/
  tests/
  employee.module.ts
```

Controllers must stay thin. Services contain business rules. Repositories or data-access helpers handle database operations.

## 6. Data Access Pattern

The architecture uses a repository/data-access boundary.

```text
Controller
      |
      v
Service
      |
      v
Repository / Data Access
      |
      v
Prisma / Database
```

Services should not be tightly coupled to database details. A service decides business behavior, while the repository or data-access layer handles how records are fetched and saved.

This keeps modules easier to test, refactor, and reason about as the ERP grows.

## 7. Frontend Architecture

The frontend uses feature-based organization with shared UI and shared services.

```text
frontend/
  app/
  components/
  features/
  hooks/
  layouts/
  lib/
  providers/
  services/
  styles/
  types/
  utils/
  public/
  tests/
```

Frontend responsibilities:

- Render ERP screens and workflows.
- Call backend APIs through service layers.
- Validate user input for better user experience.
- Display clear success and error states.
- Hide or disable unavailable actions based on permissions.
- Keep route/navigation behavior aligned with user roles.

Frontend permission checks improve usability, but backend authorization remains the source of truth.

## 8. API Architecture

The ERP uses REST APIs between the frontend and backend.

API design principles:

- APIs must be documented before implementation where possible.
- APIs must validate input.
- APIs must enforce authentication and authorization server-side.
- APIs must return consistent success and error responses.
- APIs should expose module capabilities without leaking unnecessary database details.
- Reporting and workflow APIs must respect data visibility and permissions.

Exact endpoint paths, request bodies, response bodies, and status codes belong in `docs/API/README.md`.

## 9. Authentication And Authorization

Authentication and authorization are enforced in both frontend and backend, with the backend as the source of truth.

Frontend responsibilities:

- Redirect unauthenticated users away from protected screens.
- Hide or disable unavailable navigation and actions.
- Show user-friendly permission messages.

Backend responsibilities:

- Validate authenticated requests.
- Enforce permissions on every protected action.
- Block unauthorized access even if the frontend is bypassed.
- Record important authentication and authorization events where required.

## 10. Shared Services And Common Layer

Cross-cutting concerns should live in shared/common areas instead of being duplicated inside every module.

Common/shared responsibilities may include:

- Authentication guards
- Authorization helpers
- Validation utilities
- Error handling
- Logging
- Pagination
- Configuration
- Response helpers
- Shared types

Business rules should remain inside the owning feature module unless the rule is truly shared across domains.

## 11. Database Architecture And Ownership

The ERP uses one shared database with module ownership rules.

One database keeps the modular monolith simple and allows connected ERP reporting. Module ownership rules prevent uncontrolled coupling.

Database ownership principles:

- Each module owns its primary records.
- Shared master data should have clear ownership.
- Other modules should access owned data through services, APIs, or approved shared data contracts.
- Modules should not freely modify records owned by unrelated modules.
- Reporting may read across modules, but must respect permissions and data visibility rules.

Exact schema, migrations, indexes, relationships, and Prisma models belong in database and architecture detail documents created during implementation sprints.

## 12. Module Boundaries

Module boundaries keep the ERP maintainable as more business areas are added.

Expected module direction:

| Module | Responsibility |
| --- | --- |
| Identity and Access | Authentication, users, roles, permissions, protected access. |
| Organization and Employees | Company structure, departments, positions, employee records. |
| Human Resources | Attendance, leave, HR workflows, employee self-service. |
| Inventory | Products, warehouses, stock movements, stock visibility. |
| Purchasing | Suppliers, requisitions, purchase orders, receiving. |
| Sales | Customers, quotations, sales orders, fulfillment, invoicing. |
| Finance | Accounts, journals, receivables, payables, payments, financial reports. |
| Reporting | Dashboards, KPIs, report definitions, analytics. |
| Workflow | Approvals, tasks, notifications, workflow history. |

## 13. Deployment Shape

The architecture uses a containerized app stack.

Initial deployment shape:

```text
Frontend service
Backend service
Database service
```

Docker should support local development and prepare the project for later deployment readiness. Full production infrastructure, managed services, scaling rules, and monitoring details will be expanded in production-readiness sprints.

## 14. Testing Architecture

Testing must match the system architecture.

Expected testing levels:

- Unit tests for business rules and utilities.
- Integration tests for API, service, repository, and database behavior.
- End-to-end tests for critical user workflows.
- Security tests for authentication, authorization, and denial cases.
- Regression tests for important ERP workflows as the system grows.

Tests should prove acceptance criteria and protect module boundaries.

## 15. Documentation And Traceability

Architecture decisions must remain traceable to business and system requirements.

Traceability direction:

- BRD defines why the ERP exists.
- SRS defines what the ERP must do.
- Architecture defines how the system is structured.
- API docs define how frontend and backend communicate.
- ADRs record major technical decisions.
- Issues and PRs implement approved work.
- Tests verify requirements.
- Release notes summarize delivered changes.

## 16. Constraints

- The architecture must follow the approved roadmap and sprint structure.
- Code must be organized by feature/module.
- Controllers must remain thin.
- Business logic must live in services.
- Database access must go through repository/data-access boundaries.
- Backend authorization must enforce protected actions.
- Shared code must not become a dumping ground for unrelated business logic.
- Production infrastructure details must be expanded in later deployment and production-readiness work.

## 17. Architecture Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Modules become tightly coupled. | High | Keep module ownership and service boundaries clear. |
| Business logic leaks into controllers. | Medium | Keep controllers thin and review service placement. |
| Services become tightly coupled to database details. | Medium | Use repository/data-access boundaries. |
| Shared folders become disorganized. | Medium | Reserve shared layers for cross-cutting concerns only. |
| Frontend permission checks are treated as security. | High | Enforce authorization on the backend. |
| Reporting bypasses access rules. | High | Apply permission checks to reporting queries and APIs. |
| Deployment complexity grows too early. | Medium | Start with a containerized app stack and expand later. |

## 18. Approval Standard

Approval means the system structure, module boundaries, frontend/backend responsibilities, data access pattern, API style, security placement, shared services, database ownership, and deployment shape are clear enough to guide API design, ADRs, and implementation planning.

The architecture should be reviewed by:

- Product Owner
- Technical Lead
- QA Lead
- DevOps / Release Owner
