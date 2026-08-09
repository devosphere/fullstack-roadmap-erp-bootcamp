# Phase 01 - Core Platform

**Phase:** Phase 01  
**Duration:** 6-8 Weeks  
**Status:** Planned  
**Release Range:** v0.3.0 - v0.4.0

---

# Phase Objective

## Purpose

Build the reusable platform capabilities that every ERP business module depends on: knowing who the user is, what they are allowed to do, who they represent in the organization, and where they sit within it.

Phase 00 produced a running application with no business meaning. Phase 01 gives it identity and structure.

The focus is understanding how enterprise platforms separate shared capability from business features:

```text
Application Foundation

        ↓

Identity and Security

        ↓

Organizational Structure

        ↓

Reusable Platform
```

No ERP business module can be built correctly before these capabilities exist.

---

# Business Outcome

After completing this phase, the ERP platform will support:

- User registration and secure authentication.
- Role-based access control.
- Permission-driven authorization.
- Company and department structure.
- Position and employee records.
- Employee-to-user relationships.
- Organizational reporting hierarchy.

The system evolves from:

```text
Working Application Foundation

        ↓

Secure Enterprise Platform
```

---

# Phase Context

This phase builds on the technical foundation created in Phase 00.

```text
Phase 00
Foundation

Repository
Engineering Process
Application Setup

        ↓

Phase 01
Core Platform

Identity
Security
Organization

        ↓

Phase 02
ERP Business Modules

HR
Inventory
Sales
Purchasing
```

---

# Phase Goals

By the end of this phase, the learner should be able to:

- [ ] Implement secure authentication.
- [ ] Design role and permission models.
- [ ] Protect API resources by permission.
- [ ] Build protected frontend routes.
- [ ] Model organizational structures.
- [ ] Design hierarchical data relationships.
- [ ] Link identity records to business records.
- [ ] Test security behaviour, including denial cases.

---

# Business Capabilities Delivered

---

# Identity & Access Management

Provides:

- User registration and login.
- Password security.
- JWT-based session handling.
- Role management.
- Permission management.
- Protected API and UI resources.

---

# Organization & Employee Management

Provides:

- Company profile management.
- Department structure.
- Position management.
- Employee records.
- Employee-to-user linkage.
- Organizational reporting hierarchy.

---

# Business Domains Covered

| Domain | Description |
|--------|-------------|
| Security | Authentication and access control |
| Administration | User, role, and permission management |
| Organization | Company, department, and position structure |
| HR Foundation | Employee master data and hierarchy |

---

# Technical Scope

## Frontend

- Login and registration pages.
- Protected route handling.
- Session and token management.
- Role-aware navigation.
- Company, department, and employee management screens.
- Organization tree visualization.

---

## Backend

- Authentication endpoints.
- Password hashing.
- JWT issuance and validation.
- Authorization guards.
- Role and permission services.
- Company, department, position, and employee modules.

---

## Database

- User, Role, and Permission entities.
- Company, Department, Position, and Employee entities.
- Many-to-many role and permission relationships.
- Self-referencing hierarchy for departments and reporting lines.
- Migrations for each entity set.

---

## DevOps

- CI validation extended to cover the new modules.
- Environment configuration for JWT secrets.
- Seed data for roles and permissions.

---

# Architecture Impact

This phase introduces the first cross-cutting services in the system.

```text
                        ERP Platform

                             │

        ┌────────────────────┼────────────────────┐

  Authentication      Authorization         Organization
     Service             Service              Service

        │                    │                    │

        └────────────────────┼────────────────────┘

                        PostgreSQL
```

Key consequence:

Every module built after this phase must go through the authorization layer. No module implements its own access control.

---

# Sprint Breakdown

This phase is executed through two sprints.

| Sprint | Objective | Release |
|--------|-----------|---------|
| Sprint 02 | Identity & Access Management | v0.3.0 |
| Sprint 03 | Organization & Employee Management | v0.4.0 |

---

# Sprint 02 Summary

**Identity & Access Management**

Delivers:

- User authentication API.
- User management.
- Role management.
- Permission system.
- Authentication UI and protected routes.
- Security testing.

Issues: 010 - 015

---

# Sprint 03 Summary

**Organization & Employee Management**

Delivers:

- Company management.
- Department management with hierarchy.
- Position management.
- Employee management.
- User-to-employee linkage.
- Organization tree.

Issues: 016 - 021

---

# Sprint Dependencies

```text
Sprint 01
Application Foundation

        ↓

Sprint 02
Identity & Access Management

        ↓

Sprint 03
Organization & Employee Management

        ↓

Phase 02
ERP Business Modules
```

Notes:

- Sprint 02 requires the database and API foundation from Sprint 01.
- Sprint 03 requires users from Sprint 02 in order to link employees to accounts.
- Phase 02 cannot begin until both are complete, because every business module depends on permissions and employee records.

---

# Business Process Flow

```text
User Registered

        ↓

Role Assigned

        ↓

Permissions Resolved

        ↓

User Logs In

        ↓

Linked to Employee Record

        ↓

Employee Belongs to Department and Position

        ↓

Reporting Hierarchy Established

        ↓

Foundation Ready for Business Modules
```

---

# GitHub Execution Model

All phase work must follow:

```text
Phase Objective

        ↓

Sprint

        ↓

Epic

        ↓

GitHub Issues

        ↓

Feature Branch

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

# GitHub Epics Created

```text
Epic: Identity & Access Management

Epic: Organization & Employee Management
```

---

# Documentation Produced

## Business Documents

- [ ] Security and access BRD.
- [ ] Role and permission matrix.
- [ ] Organizational structure definition.

---

## Technical Documents

- [ ] Updated SRS.
- [ ] Updated Architecture Documentation.
- [ ] Updated ERD.
- [ ] Authentication and organization API documentation.
- [ ] ADR: authentication strategy.
- [ ] ADR: role and permission model.

---

# Testing Strategy

## Unit Testing

Validate:

- Password hashing and verification.
- Token generation and expiry.
- Permission resolution.
- Hierarchy traversal.
- Employee and user linkage rules.

---

## Integration Testing

Validate:

- Login and registration endpoints.
- Protected endpoint access with and without permission.
- Role assignment.
- Company, department, position, and employee APIs.

---

## End-to-End Testing

Validate:

- Register, log in, and reach a protected page.
- Access denied without the required permission.
- Create a department, assign an employee, and view the organization tree.

---

# Quality Goals

| Area | Target |
|------|--------|
| Security | Passwords hashed; no credentials in logs or responses |
| Authorization | Every protected endpoint enforces a permission server-side |
| Data Integrity | Employees cannot be orphaned from the organization |
| Reusability | Business modules consume the platform, never reimplement it |
| Documentation | Role and permission matrix kept current |

---

# Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Weak authentication design | High | Follow the ADR; hardened further in Sprint 11 |
| Permission model too rigid | Medium | Model permissions as data, not code |
| Hierarchy modelling errors | Medium | Design the self-referencing relationship before implementing |
| Business logic leaking into controllers | Medium | Enforce the service layer in code review |

---

# Success Criteria

This phase is considered complete when:

- [ ] Both sprint objectives completed.
- [ ] Authentication and authorization working end to end.
- [ ] Role and permission model implemented.
- [ ] Company, department, position, and employee modules complete.
- [ ] Users linked to employee records.
- [ ] Organization hierarchy displayed.
- [ ] Documentation completed.
- [ ] Automated tests passing, including denial cases.
- [ ] Releases v0.3.0 and v0.4.0 published.
- [ ] Retrospectives completed.

---

# Skills Developed

## Business Analysis

- Access control requirements.
- Organizational structure modelling.
- Role and responsibility mapping.

---

## Backend Engineering

- Authentication implementation.
- Authorization guards and permission resolution.
- Hierarchical data modelling.
- Service layer design.

---

## Frontend Engineering

- Protected routing.
- Session handling.
- Role-aware interfaces.
- Tree visualization.

---

## Architecture

- Separating platform capability from business features.
- Designing for reuse across future modules.

---

# Lessons Learned

Document after completion:

- Authentication and session decisions and their consequences.
- Permission model flexibility in practice.
- Hierarchy modelling difficulties.
- What later modules will need that was not anticipated.

---

# Next Phase Preview

# Phase 02 - ERP Business Modules

Objective:

> Implement the core ERP business capabilities used by enterprise organizations.

Expected focus:

- Human Resource Management.
- Inventory Management.
- Sales Management.
- Purchasing Management.

---

# Final Principle

A platform is what business modules stand on.

```text
Business Value

+

Secure Access

+

Organizational Context

+

Reusable Capability
```

Every shortcut taken in this phase is paid for in every module that follows it.
