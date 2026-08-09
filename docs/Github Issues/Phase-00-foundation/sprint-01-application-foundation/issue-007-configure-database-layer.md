# [FEATURE] Configure Database Layer

<!-- GitHub title: [FEATURE] Configure Database Layer
     Labels: feature, database, priority: high
     Milestone: Sprint 01 - Application Foundation
     Branch: feature/007-configure-database-layer
     Epic: Application Foundation
     Depends on: 006
     Blocks: 008
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

## Module: database
## Sprint: Sprint 01 - Application Foundation & Full-Stack Environment Setup

---

## Summary

Connect the backend to PostgreSQL using Prisma ORM, establish the migration system, and create
the first `User` entity so that later modules have a working persistence layer and a proven
migration workflow.

## Background

The backend from Issue 006 runs but stores nothing.

Every ERP module persists data, and every one of them will add migrations to this schema. The
migration workflow established here is used roughly 40 times across the remaining sprints, and
in Sprint 13 it must run safely against a production database. Getting the pattern right now —
migrations committed to source control, applied deterministically, never edited after being
applied — is significantly cheaper than correcting it later.

`User` is created first because Sprint 02 builds authentication on top of it, and because it is
the simplest entity that exercises the full path: schema, migration, client, and query.

## User Story

As a Backend Developer,
I want a connected database with a working migration system,
So that ERP modules can persist data using a repeatable, reviewable schema workflow.

## Acceptance Criteria

```gherkin
Given PostgreSQL is running and DATABASE_URL is configured
When the backend starts
Then it connects to the database successfully
```

```gherkin
Given a clean database
When the developer runs the migration command
Then the User table is created and the migration is recorded
```

```gherkin
Given the database is unreachable
When the backend starts
Then it fails with a clear error naming the connection problem
```

- [ ] PostgreSQL connection configured via `DATABASE_URL`
- [ ] Prisma installed and initialized
- [ ] Prisma schema created with the `User` model
- [ ] Initial migration generated and committed to source control
- [ ] Migration applies successfully against a clean database
- [ ] Prisma client generated and injectable as a NestJS provider
- [ ] Database module created in `src/database/`
- [ ] Connection failure produces a clear startup error
- [ ] Graceful shutdown closes the connection
- [ ] Seed script created for local development data
- [ ] Database setup and migration commands documented in `backend/README.md`
- [ ] Schema documented and the ERD started in `docs/Architecture/`

## Expected Result

A developer with PostgreSQL running can apply migrations, start the backend, and have it
connect successfully. The `User` table exists with the correct columns. The migration is
reviewable in the Pull Request diff.

---

## Scope

### Included

- PostgreSQL connection configuration
- Prisma installation and initialization
- `User` model
- Initial migration
- Prisma service as an injectable NestJS provider
- Connection lifecycle handling
- Seed script
- Schema documentation and initial ERD

### Out of Scope

- Password hashing and authentication logic (Sprint 02, Issue 010)
- Roles and permissions (Sprint 02, Issues 012 and 013)
- Any other entity
- Dockerized PostgreSQL (Issue 008)
- Production migration strategy (Sprint 13)

## Technical Requirements

**Stack**

| Concern | Choice |
|---------|--------|
| Database | PostgreSQL |
| ORM | Prisma |

**User model**

```text
User

id           uuid, primary key
email        unique, not null
password     not null (hashed in Sprint 02)
createdAt    timestamp, default now
updatedAt    timestamp, updated on write
```

**Target structure**

```text
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── src/
    └── database/
        ├── database.module.ts
        └── prisma.service.ts
```

**Migration rules**

- Migrations are generated, committed, and reviewed like code.
- An applied migration is never edited; corrections are new migrations.
- Migration names describe the change (`init_user_table`).

## Dependencies

- Issue 006 — the NestJS application and configuration loading must exist.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Integration test verifying database connectivity added
- [ ] Migration applies cleanly on a fresh database
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-01-application-foundation.md` § 3 |
| Coding standards | `academy/04-development/` |
| Epic | Application Foundation |
| ERD | `docs/Architecture/` |
| Pull Request | _to be linked_ |
