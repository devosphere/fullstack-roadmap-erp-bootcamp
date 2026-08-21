# AGENTS.md

Bootcamp monorepo that teaches the SDLC by building an enterprise ERP system. Learners work through sprints (Issues -> branches -> PRs -> review -> CI -> merge) exactly as a real engineering org would.

## Current state (important)

- **No application code exists yet.** `frontend/`, `backend/`, `database/`, `tests/`, `infrastructure/`, `scripts/` contain only placeholder `README.md` files.
- **No `package.json`, lockfile, tsconfig, docker-compose, or ESLint/Prettier config exists.** There are no npm/build/test/lint commands to run. Do not invent or assume them.
- `.github/workflows/ci.yml`, `CONTRIBUTING.MD`, and `CHANGELOG.MD` are empty stubs — Sprint 00 specifies they must be populated (CI validates repository health / markdown; CHANGELOG tracks releases).
- Repo sits at the end of Sprint 00; Sprint 01 ("Application Foundation & Full-Stack Setup") is next.

## Source of truth

- `academy/` is NOT just learning material — `academy/01-software-engineering/`, `academy/04-development/`, and `academy/08-sprints/` define the mandatory workflows, coding standards, folder structure, and Definition of Done.
- The current sprint's doc (`academy/08-sprints/phase-00-foundation/sprint-00-project-foundation.md`) is the active spec. When docs and README conflict, trust the sprint/academy docs.

## Git & GitHub workflow (mandatory)

- Protected branches: `main` (production), `development` (integration). Local checkout is `development`. Never commit directly to protected branches.
- Remote branches: `main`, `development`, `staging`, `production`. All work flows `main <- development <- feature branches`.
- Create one branch per GitHub Issue. Naming per Sprint 00: `feature/<issue-number>-description`, `bugfix/`, `hotfix/`, `docs/` (e.g. `feature/001-user-authentication`).
- Commits must follow Conventional Commits: `<type>(<scope>): <description>` (types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`, `revert`; scopes like `auth`, `hr`, `inventory`, `frontend`, `backend`, `database`, `ci`, `docs`). One commit = one purpose.
- Squash-merge feature/bugfix branches; merge-commit release branches; merge hotfixes into both `main` and `development`.
- Every feature needs a GitHub Issue -> branch -> PR -> code review -> passing CI before merge. Small, reviewable PRs only.

## Conventions from the academy (apply to any new code)

- **Organize code by feature, not file type.** Backend modules live under `backend/src/`: `auth/`, `users/`, `employees/`, `inventory/`, `sales/`, `procurement/`, `finance/`, `common/`, `config/`. Frontend is feature-based (`app/`, `components/`, `features/`, `hooks/`, `layouts/`, `lib/`, `providers/`, `services/`, `styles/`, `types/`, `utils/`, `public/`, `tests/`).
- File naming: lowercase dirs, dot-separated files like `employee.service.ts`, `employee.controller.ts`, `create-employee.dto.ts`.
- Controllers handle request/validation/response; business logic lives in services. TypeScript strict mode, no `any`. ESLint + Prettier for formatting. Comments explain *why*, not *what*.
- **Definition of Done:** coding standards + lint + tests + code review + CI pass + documentation updated + acceptance criteria met. Docs and code must change together (e.g. update `docs/` deliverables when implementing a feature).

## Planned tech stack (Sprint 01+, not yet scaffolded)

- Backend: Node.js (LTS) + TypeScript + NestJS + Prisma ORM + PostgreSQL + JWT, tested with Vitest + Supertest, containerized with Docker.
- Frontend: React + Next.js + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + Zustand + React Hook Form + Zod, tested with Vitest + Playwright.
- Releases are per-sprint and semver'd (Sprint 00 -> v0.1.0, Sprint 01 -> v0.2.0, ...).
