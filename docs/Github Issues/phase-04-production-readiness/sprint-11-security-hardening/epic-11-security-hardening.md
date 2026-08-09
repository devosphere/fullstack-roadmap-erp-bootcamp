# [EPIC] Security Hardening

<!-- GitHub title: [EPIC] Security Hardening
     Labels: epic, security
     Milestone: Sprint 11 - Security Hardening
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 069-074 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: ci
## Sprint: Sprint 11 - Security Hardening

---

## Purpose

Reduce the platform's attack surface and prove, with tests that demonstrate denial rather than only
success, that every security control holds — assuming the attacker has the source code.

```text
Who are you?          → Authentication that resists guessing and replay

What can you do?      → Authorization checked on every request, server-side

What did you send?    → Validation that rejects anything unexpected

What do you know?     → Secrets the application holds but never reveals
```

## Business Value

The system now holds employee records, salaries, customer data, supplier bank details, and
financial statements. Every sprint since Sprint 02 added value; this sprint proves none of it can
be taken.

## Issues

- [ ] #69 Produce Threat Model and Security Requirements
- [ ] #70 Harden Authentication and Add MFA
- [ ] #71 Review Authorization and Enforce Least Privilege
- [ ] #72 Implement Input Validation and Injection Defence
- [ ] #73 Implement Secrets Management and Transport Security
- [ ] #74 Add Security Testing and Dependency Scanning to CI

## Security Controls Summary

| Threat | Control | Verified By |
|--------|---------|-------------|
| Credential guessing | Password policy, lockout, MFA | Authentication tests |
| Token theft and replay | Short-lived tokens, rotation, revocation | Session tests |
| Privilege escalation | Server-side permission checks | Negative authorization tests |
| IDOR | Record-level ownership checks | IDOR test suite |
| SQL injection | Parameterized queries, schema validation | Injection tests |
| Cross-site scripting | Output encoding, security headers | XSS tests |
| Secret exposure | Environment config, log redaction, scanning | Secret scan in CI |
| Vulnerable dependency | Dependency scanning, CI gate | Scheduled scan |
| Denial of service | Rate limiting, payload limits | Rate limit tests |

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Threat model documented and every high/critical threat mapped to a control
- [ ] MFA enforced for privileged roles; account lockout enforced
- [ ] Every endpoint's permission requirement inventoried; IDOR tests pass across all modules
- [ ] Injection and XSS tests pass; rate limiting and security headers applied
- [ ] No secret in source control; HTTPS and secure cookies enforced
- [ ] Security scanning gates CI on new high/critical findings
- [ ] No known high or critical vulnerabilities remain
- [ ] Release v0.12.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-11-security-hardening.md` |
| Phase overview | `academy/08-sprints/phase-04-production-readiness/phase-overview.md` |
| Hardens | Issue 010 (auth), Issue 013 (permissions) |
| Release | v0.12.0 |
