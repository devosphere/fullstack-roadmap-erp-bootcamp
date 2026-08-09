# [FEATURE] Setup Frontend Application

<!-- GitHub title: [FEATURE] Setup Frontend Application
     Labels: feature, frontend, priority: high
     Milestone: Sprint 01 - Application Foundation
     Branch: feature/005-setup-frontend-application
     Epic: Application Foundation
     Blocks: 008, 009
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

## Module: frontend
## Sprint: Sprint 01 - Application Foundation & Full-Stack Environment Setup

---

## Summary

Create the frontend application foundation in `frontend/` using Next.js and TypeScript, with
linting, formatting, and environment configuration in place, so ERP feature modules have a
scalable base to build on.

## Background

Sprint 00 established the engineering workflow, but no application code exists yet — `frontend/`
currently contains only a placeholder `README.md`.

The frontend is the entry point of the ERP platform: every future module (IAM, HR, Inventory,
Sales) renders through it. Establishing the project structure, TypeScript configuration, and
code-quality tooling now prevents inconsistent conventions from spreading across modules later,
when refactoring cost is much higher.

## User Story

As a Frontend Developer,
I want a configured Next.js and TypeScript application skeleton,
So that ERP feature modules can be built on a consistent, type-safe foundation.

## Acceptance Criteria

```gherkin
Given the repository is cloned and dependencies are installed
When the developer runs the frontend development server
Then the application starts without errors and serves the base page on the configured port
```

```gherkin
Given a TypeScript file containing a type error
When the type check is run
Then the build fails and reports the error
```

- [ ] Next.js application initialized inside `frontend/`
- [ ] TypeScript configured with `strict` mode enabled (no `any`)
- [ ] Feature-based folder structure created: `src/app/`, `src/components/`, `src/features/`, `src/hooks/`, `src/services/`, `src/types/`, `public/`
- [ ] Tailwind CSS configured
- [ ] ESLint and Prettier configured, and lint runs clean on the initial codebase
- [ ] Environment variables configured via `.env.example` (`NEXT_PUBLIC_API_URL`), with `.env` git-ignored
- [ ] A basic landing page renders successfully
- [ ] An API client service exists in `src/services/` ready to call the backend
- [ ] Local setup steps documented in `frontend/README.md`

## Expected Result

The developer can install dependencies, start the frontend, and load a working page in the
browser. Type checking and linting run against the project and pass. No secrets are committed.

---

## Scope

### Included

- Next.js + TypeScript project initialization
- Base folder structure per academy project-structure standards
- Tailwind CSS setup
- ESLint + Prettier configuration
- Environment variable configuration (`.env.example`)
- Basic landing page
- API client scaffold
- Frontend setup documentation

### Out of Scope

- Backend API implementation (Issue 006)
- Live API integration verification (once Issue 006 lands)
- Dockerization of the frontend (Issue 008)
- CI pipeline wiring (Issue 009)
- Authentication UI (Issue 014, Sprint 02)
- Business module screens

## Technical Requirements

**Stack**

| Concern | Choice |
|---------|--------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Package manager | npm or pnpm — record the choice in `frontend/README.md` |

**Target structure**

```text
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── services/
│   └── types/
├── public/
├── .env.example
├── package.json
└── tsconfig.json
```

**Conventions**

- Organize code by feature, not by file type.
- Lowercase directory names; dot-separated file names (`employee.service.ts`).
- Comments explain *why*, not *what*.

## Dependencies

None. This issue can start immediately alongside Issue 006.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Tests added or explicitly deferred with justification
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-01-application-foundation.md` § 1 |
| Coding standards | `academy/04-development/` |
| Branching strategy | `academy/01-software-engineering/4-branching-strategy.md` |
| Epic | Application Foundation |
| BRD / SRS | Not yet authored |
| Pull Request | _to be linked_ |
