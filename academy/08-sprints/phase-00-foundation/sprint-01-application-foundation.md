# Sprint 01 - Application Foundation & Full-Stack Environment Setup

**Sprint:** Sprint 01  
**Phase:** Phase 00 - Foundation  
**Duration:** 2-3 Weeks  
**Release Target:** v0.2.0  
**Status:** Planned

---

# Sprint Goal

Establish the technical foundation of the ERP application by creating the full-stack development environment, configuring the application architecture, and implementing the initial software structure that will support future ERP modules.

At the end of this sprint, the learner should have a running full-stack application foundation following professional engineering practices.

---

# Sprint Context

Sprint 00 established the engineering workflow.

Sprint 01 begins the actual software development foundation.

The learner transitions from:

```
Software Project Setup

↓

Application Development
```

The focus is not building ERP business features yet.

The focus is creating a scalable foundation where future modules can be developed.

---

# Business Outcome

After completing Sprint 01, the ERP platform should have:

- A working frontend application.
- A working backend application.
- A configured database.
- API communication established.
- Development environment standardized.
- Automated quality checks running.

---

# Sprint Objectives

By the end of this sprint, the learner should understand:

- Full-stack application architecture.
- Frontend and backend separation.
- TypeScript development.
- API communication.
- Database connectivity.
- Environment configuration.
- Local development workflow.
- Basic CI validation.

---

# Sprint Theme

## "Build the Foundation Before Building Features"

Enterprise applications require strong foundations.

The architecture created today will affect every future ERP module.

---

# Target Technology Stack

## Frontend

Primary:

```
React

+

TypeScript

+

Next.js
```

Supporting:

```
Tailwind CSS

React Query

Form Validation Library
```

---

## Backend

Primary:

```
Node.js

+

TypeScript

+

NestJS
```

Supporting:

```
REST API

Validation

Authentication Foundation
```

---

## Database

Primary:

```
PostgreSQL
```

ORM:

```
Prisma
```

---

## Development Tools

Required:

```
Git

GitHub

Docker

VS Code

Node.js

npm/pnpm
```

---

# Sprint Scope

---

# 1. Frontend Application Setup

## Objective

Create the frontend application foundation.

---

## Tasks

Initialize:

```
frontend/
```

Configure:

- Next.js
- TypeScript
- ESLint
- Formatting rules
- Environment variables

---

## Initial Structure

Example:

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

├── package.json

└── tsconfig.json
```

---

## Acceptance Criteria

- Frontend runs locally.
- TypeScript enabled.
- Code formatting configured.
- Basic page created.

---

# 2. Backend Application Setup

## Objective

Create the backend service foundation.

---

## Tasks

Initialize:

```
backend/
```

Configure:

- Node.js
- NestJS
- TypeScript
- Environment configuration
- API structure

---

## Initial Structure

Example:

```text
backend/

├── src/

│   ├── modules/

│   ├── common/

│   ├── config/

│   ├── database/

│   └── main.ts

├── test/

├── package.json

└── tsconfig.json
```

---

## Acceptance Criteria

- Backend starts successfully.
- API endpoint available.
- Environment variables configured.

---

# 3. Database Foundation

## Objective

Create database connectivity.

---

## Tasks

Configure:

- PostgreSQL
- Prisma ORM
- Database connection
- Migration system

---

## Initial Database Entity

Create:

```
User
```

Example:

```
User

id

email

password

createdAt

updatedAt
```

---

## Acceptance Criteria

- Database connection works.
- Migration runs successfully.
- Database schema documented.

---

# 4. Frontend and Backend Communication

## Objective

Establish API communication.

---

## Flow

```text
Frontend

    |

    |

REST API

    |

    |

Backend

    |

    |

Database
```

---

## Implement

Example endpoint:

```
GET /api/health
```

Response:

```json
{
  "status": "healthy"
}
```

---

## Acceptance Criteria

- Frontend can call backend API.
- API errors handled properly.
- Environment URLs configured.

---

# 5. Project Configuration

## Objective

Standardize development environment.

---

## Configure

Environment files:

```
.env

.env.example
```

---

Example:

Frontend:

```
NEXT_PUBLIC_API_URL=
```

Backend:

```
DATABASE_URL=

PORT=
```

---

## Acceptance Criteria

- Secrets are not committed.
- Example configuration provided.
- Local setup documented.

---

# 6. Docker Development Environment

## Objective

Create reproducible development setup.

---

## Containers

Required:

```
Frontend

Backend

PostgreSQL
```

---

## Example

```text
docker-compose.yml

frontend

backend

database
```

---

## Acceptance Criteria

Developer can run:

```bash
docker compose up
```

and start the system.

---

# 7. Code Quality Setup

## Objective

Establish engineering standards.

---

## Configure

Frontend:

- ESLint
- Prettier

Backend:

- ESLint
- Prettier

---

## Acceptance Criteria

Code validation runs automatically.

---

# 8. Initial CI Pipeline

## Objective

Automate validation.

---

## GitHub Actions

Create:

```text
.github/workflows/ci.yml
```

---

Pipeline:

```
Push Code

↓

Install Dependencies

↓

Lint

↓

Test

↓

Build
```

---

## Acceptance Criteria

CI runs successfully on Pull Requests.

---

# GitHub Execution

---

# Epic

## Epic: Application Foundation

Purpose:

Create the technical foundation required for ERP development.

---

# GitHub Issues

---

# Issue 005 - Setup Frontend Application

Type:

```
Feature
```

Acceptance Criteria:

- Next.js created.
- TypeScript configured.
- Application runs.

---

# Issue 006 - Setup Backend Application

Type:

```
Feature
```

Acceptance Criteria:

- NestJS created.
- API running.
- Structure documented.

---

# Issue 007 - Configure Database Layer

Type:

```
Feature
```

Acceptance Criteria:

- PostgreSQL connected.
- Prisma configured.
- Migration works.

---

# Issue 008 - Setup Docker Environment

Type:

```
Task
```

Acceptance Criteria:

- Containers created.
- Application runs using Docker.

---

# Issue 009 - Configure CI Pipeline

Type:

```
DevOps
```

Acceptance Criteria:

- GitHub Actions workflow created.
- Build validation works.

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

---

# Unit Testing

Implement initial tests for:

- Utility functions
- Services
- Components

---

# Integration Testing

Validate:

- Backend startup
- Database connection
- API responses

---

# End-to-End Testing

Create initial smoke test:

Scenario:

```
Open Application

↓

Load Homepage

↓

Verify API Connection
```

---

# Documentation Requirements

Create:

## Technical Documentation

- Architecture diagram
- Local setup guide
- Environment configuration guide
- API health documentation

---

# Architecture Documentation

Initial architecture:

```text
                 User

                  |

                  |

              Next.js

                  |

                  |

              REST API

                  |

                  |

              NestJS

                  |

                  |

             PostgreSQL
```

---

# Sprint Deliverables

At completion:

## Application

✅ Frontend running

✅ Backend running

✅ Database connected

✅ API communication working

---

## Engineering

✅ Docker environment

✅ CI pipeline

✅ Code standards

---

## Documentation

✅ Architecture documented

✅ Setup guide completed

---

# Sprint Review

The learner demonstrates:

1. Running application locally.
2. Frontend communicating with backend.
3. Database connection.
4. Docker startup.
5. CI pipeline execution.
6. Pull Request workflow.

---

# Sprint Retrospective

Discuss:

## What Went Well?

Examples:

- Environment setup completed.
- Architecture understood.

---

## Challenges

Examples:

- Dependency issues.
- Configuration problems.
- Debugging setup.

---

## Improvements

Examples:

- Better documentation.
- Better automation.

---

# Release Preparation

Release:

```
v0.2.0
```

---

## Release Notes

```markdown
# v0.2.0

Application Foundation Release

Added:

- Frontend application
- Backend API
- Database connection
- Docker environment
- CI pipeline
- Development standards
```

---

# Definition of Done

Sprint 01 is complete when:

- [ ] Frontend application works.
- [ ] Backend application works.
- [ ] Database connection works.
- [ ] API communication works.
- [ ] Docker environment works.
- [ ] CI pipeline passes.
- [ ] Tests created.
- [ ] Documentation updated.
- [ ] Pull Request reviewed.
- [ ] Release v0.2.0 published.

---

# Skills Acquired

After completing Sprint 01, the learner understands:

## Frontend

- React foundation
- Next.js structure
- TypeScript usage

## Backend

- Node.js development
- API architecture
- Service structure

## Database

- PostgreSQL
- ORM concepts
- Data modeling

## Engineering

- Local development workflow
- CI/CD basics
- Professional repository practices

---

# Next Sprint Preview

## Sprint 02 - Identity & Access Management

The next sprint introduces the first ERP platform capability:

Planned:

- User authentication
- Login system
- Role-based access control
- Permission management
- Security foundation