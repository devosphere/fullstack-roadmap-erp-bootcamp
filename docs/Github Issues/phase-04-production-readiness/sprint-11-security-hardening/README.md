# Sprint 11 - Security Hardening

**Milestone:** Sprint 11 - Security Hardening  
**Release:** v0.12.0  
**Phase:** Phase 04 - Production Readiness  
**Duration:** 3-4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-04-production-readiness/sprint-11-security-hardening.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 11 - Security Hardening` |
| Due date | End of sprint |
| Description | Threat model, harden authentication and authorization, close validation gaps, secure secrets, and gate CI on security scanning. Release v0.12.0. |

---

# Sprint Goal

Reduce the platform's attack surface to no known high or critical vulnerabilities, and prove every
control with a test that demonstrates denial, not just success.

---

# Epic

**[Security Hardening](epic-11-security-hardening.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 069 | [issue-069](issue-069-produce-threat-model-and-security-requirements.md) | `[DOCS] Produce Threat Model and Security Requirements` | Documentation | `documentation`, `security`, `priority: critical` | `docs/069-produce-threat-model-and-security-requirements` |
| 070 | [issue-070](issue-070-harden-authentication-and-add-mfa.md) | `[IMPROVEMENT] Harden Authentication and Add MFA` | Improvement | `improvement`, `auth`, `security`, `priority: critical` | `feature/070-harden-authentication-and-add-mfa` |
| 071 | [issue-071](issue-071-review-authorization-and-enforce-least-privilege.md) | `[IMPROVEMENT] Review Authorization and Enforce Least Privilege` | Improvement | `improvement`, `auth`, `security`, `priority: critical` | `feature/071-review-authorization-and-enforce-least-privilege` |
| 072 | [issue-072](issue-072-implement-input-validation-and-injection-defence.md) | `[IMPROVEMENT] Implement Input Validation and Injection Defence` | Improvement | `improvement`, `backend`, `security`, `priority: critical` | `feature/072-implement-input-validation-and-injection-defence` |
| 073 | [issue-073](issue-073-implement-secrets-management-and-transport-security.md) | `[TASK] Implement Secrets Management and Transport Security` | Task | `task`, `security`, `ci`, `priority: critical` | `feature/073-implement-secrets-management-and-transport-security` |
| 074 | [issue-074](issue-074-add-security-testing-and-dependency-scanning-to-ci.md) | `[TASK] Add Security Testing and Dependency Scanning to CI` | Task | `task`, `security`, `ci`, `priority: high` | `feature/074-add-security-testing-and-dependency-scanning-to-ci` |

All six issues take **Milestone:** `Sprint 11 - Security Hardening`.

---

# Dependency Order

```text
069 Threat Model & Security Requirements

        ↓

070 Authentication Hardening       071 Authorization Review

        ↓                                    ↓

072 Input Validation & Injection Defence

        ↓

073 Secrets & Transport Security

        ↓

074 Security Testing & Dependency Scanning in CI
```

Issue 069 must land first — every other issue in this sprint fixes a threat this document names.
Issues 070 and 071 can run in parallel once the threat model is agreed.

---

# What Gets Touched

This sprint has no new modules — it reviews and hardens every endpoint built across Sprints 00-10.

| Issue | Scope |
|-------|-------|
| 070 | Login, session, and token handling from Issue 010 |
| 071 | Every endpoint across every module — the inventory this issue produces is the sprint's largest single artifact |
| 072 | Every request body, query parameter, and file upload endpoint (Issue 022's document upload, Issue 061's export) |
| 073 | Every `.env.example` and secret reference across the codebase |
| 074 | The CI pipeline established in Issue 009 |

---

# Security Note

Findings discovered while working these issues are reported privately and never described in
detail in a public issue body before remediation lands. Reference the finding by issue number only
until the fix is merged.

---

# Sprint Definition of Done

- [ ] Threat model documented, reviewed, and every high/critical threat mapped to a control.
- [ ] MFA enforced for privileged roles; token replay rejected; lockout enforced.
- [ ] Every endpoint's permission requirement inventoried and enforced; IDOR tests pass everywhere.
- [ ] Injection and XSS tests pass; rate limiting and security headers applied.
- [ ] No secret in source control; all credentials rotated; HTTPS enforced.
- [ ] Security scanning gating CI; no known high or critical findings remain.
- [ ] Documentation and security test report published.
- [ ] Release v0.12.0 published.

---

# Release Notes Draft

```markdown
# v0.12.0

Security Hardening Release

## Added

- Multi-Factor Authentication
- Account Lockout and Password Policy
- Refresh Token Rotation and Session Revocation
- Security Audit Logging
- Automated Security and Dependency Scanning in CI

## Changed

- Authorization enforced server-side on every endpoint
- Input validation applied across all APIs
- Secrets moved to environment configuration

## Security

- Threat model documented
- Known high and critical vulnerabilities remediated
```
