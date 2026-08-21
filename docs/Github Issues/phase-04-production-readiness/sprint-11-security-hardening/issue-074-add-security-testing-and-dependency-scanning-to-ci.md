# [TASK] Add Security Testing and Dependency Scanning to CI

<!-- GitHub title: [TASK] Add Security Testing and Dependency Scanning to CI
     Labels: task, security, ci, priority: high
     Milestone: Sprint 11 - Security Hardening
     Branch: feature/074-add-security-testing-and-dependency-scanning-to-ci
     Epic: Security Hardening
     Depends on: 009, 069, 070, 071, 072, 073
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [x] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: ci
## Sprint: Sprint 11 - Security Hardening

---

## Summary

Add static analysis, dependency vulnerability scanning, and secret scanning to the CI pipeline so
new high or critical findings block the build, write the abuse-case tests this sprint's fixes
depend on, and define how a finding gets triaged.

## Background

Everything Issues 069-073 fixed was found by deliberate, one-time review. Without this issue,
regression is inevitable: a new endpoint six sprints from now might skip a permission check, a new
dependency might carry a known vulnerability the day it's added, a future commit might reintroduce
a secret Issue 073 just spent an issue removing.

This issue is what makes Sprint 11's work durable rather than a snapshot. It extends the CI
pipeline from Issue 009 — which validated build, lint, and test — with a fourth category: security.

The triage process matters as much as the scanning tools. A scan that fails the build on every
finding, with no path to accept a risk deliberately (documented, with an owner and an expiry, per
Issue 069's accepted risk register), trains the team to work around CI rather than through it.

## User Story

As an Engineering Lead,
I want security checks running automatically on every change,
So that a new vulnerability is caught before merge, not discovered after release.

## Acceptance Criteria

```gherkin
Given a Pull Request introducing a static analysis finding rated High or Critical
When CI runs
Then the build fails and the finding is visible in the Pull Request
```

```gherkin
Given a Pull Request adding a dependency with a known Critical vulnerability
When CI runs
Then the build fails
```

```gherkin
Given a Pull Request that accidentally includes a secret-shaped value
When CI runs
Then the build fails before the commit can be merged
```

```gherkin
Given a scheduled dependency scan runs independently of any Pull Request
When a new vulnerability is disclosed for an already-merged dependency
Then the finding is surfaced and triaged, not left unnoticed until the next Pull Request
```

```gherkin
Given a finding the team decides to accept rather than fix immediately
When it is recorded
Then it has a documented justification, an owner, and an expiry date
```

- [ ] Static analysis security testing (SAST) added to the CI pipeline
- [ ] Dependency vulnerability scanning added to CI, running on every Pull Request
- [ ] Dependency vulnerability scanning also runs on a schedule, independent of Pull Requests
- [ ] Secret scanning added to CI, running on every Pull Request
- [ ] CI fails the build on new High or Critical findings from any of the three scans
- [ ] Abuse-case tests written for the controls added in Issues 070-073, extending the pattern from Issue 015
- [ ] A security test report produced summarizing current findings and their status
- [ ] Vulnerability triage process documented: severity, response time, and accepted-risk path
- [ ] Accepted risks recorded against the Issue 069 register with owner and expiry

## Expected Result

Every future change is automatically checked for the same classes of problem this sprint fixed. A
regression is caught at the Pull Request, and a genuinely disclosed vulnerability in an already-
merged dependency is surfaced within a day, not discovered by accident.

---

## Scope

### Included

- SAST integration in CI
- Dependency scanning, both on-PR and scheduled
- Secret scanning in CI
- CI gating on new High/Critical findings
- Abuse-case test suite extending Issue 015's pattern
- Security test report
- Triage process and accepted-risk documentation

### Out of Scope

- Manual penetration testing
- Bug bounty program
- Runtime application self-protection (RASP)
- Production security monitoring and alerting (Sprint 15, Issue 097)

## Technical Requirements

**CI pipeline extension**

Extends `.github/workflows/ci.yml` from Issue 009 with a fourth job category, running alongside
lint, test, and build:

```text
security:
    - SAST scan
    - dependency vulnerability scan
    - secret scan
```

**Gating rule**

```text
New finding rated High or Critical    → build fails, Pull Request blocked
New finding rated Medium or Low       → build passes, finding logged for triage
Existing accepted-risk finding         → does not fail the build; tracked against its expiry
```

"New" is determined relative to a committed baseline, so the initial adoption of scanning does not
retroactively fail every open branch on day one — establish the baseline as part of this issue,
covering whatever Issues 069-073 did not already resolve.

**Scheduled scan**

```text
Runs daily (or on the shortest interval the tooling reasonably supports), independent of
Pull Request activity, and re-scans currently merged dependencies for newly disclosed vulnerabilities
```

**Abuse-case tests**

Extend the Issue 015 pattern (originally scoped to authentication and authorization) to cover the
new controls from this sprint:

```text
Token rotation reuse detection (Issue 070)      → replay a rotated token, expect family revocation
MFA bypass attempts (Issue 070)                  → attempt privileged access without completing MFA
IDOR across newly-checked resources (Issue 071)  → attempt cross-record access on each newly-covered endpoint
Injection payloads (Issue 072)                    → the specific payloads used in that issue's tests, re-run here as a regression suite
Rate limit bypass attempts (Issue 072)             → confirm the limit cannot be evaded by header spoofing or similar
```

**Security test report**

```text
docs/Architecture/security-test-report.md

- Summary of SAST, dependency, and secret scan status at time of writing
- Abuse-case test coverage summary
- Open findings with severity and owner
- Accepted risks with justification and expiry, cross-referenced to Issue 069's register
```

**Triage process**

```text
Finding discovered (scan or manual)

    ↓

Severity assessed

    ↓

Critical/High    → fix before merge, or escalate for an explicit accepted-risk decision
Medium           → scheduled fix, tracked as a follow-up issue
Low               → logged, reviewed periodically

    ↓

If accepted rather than fixed:
    → documented in the Issue 069 risk register with owner and expiry
    → re-reviewed at expiry, not left open indefinitely
```

## Dependencies

- Issue 009 — the CI pipeline this issue extends.
- Issues 069-073 — this issue's baseline and abuse-case tests are built against their fixes.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] SAST, dependency, and secret scanning running in CI on every Pull Request
- [ ] Scheduled dependency scan configured and verified to run independently
- [ ] CI gate verified by intentionally introducing a known-vulnerable dependency and confirming the build fails
- [ ] CI gate verified by intentionally introducing a secret-shaped value and confirming the build fails
- [ ] Abuse-case tests passing for each control listed above
- [ ] Security test report produced and committed
- [ ] Triage process documented
- [ ] No known High or Critical finding remains unaddressed or unaccepted at the end of this issue
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-11-security-hardening.md` § 6 |
| Epic | Security Hardening |
| Extends | Issue 009 (CI pipeline), Issue 015 (abuse-case testing pattern) |
| Gates | Issues 070, 071, 072, 073 |
| Continued in | Issue 097 (Sprint 15, production alerting) |
| Pull Request | _to be linked_ |
