# [DOCS] Produce Threat Model and Security Requirements

<!-- GitHub title: [DOCS] Produce Threat Model and Security Requirements
     Labels: documentation, security, priority: critical
     Milestone: Sprint 11 - Security Hardening
     Branch: docs/069-produce-threat-model-and-security-requirements
     Epic: Security Hardening
     Blocks: 070, 071, 072, 073, 074
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [x] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [ ] High
- [x] Critical

## Module: ci
## Sprint: Sprint 11 - Security Hardening

---

## Summary

Map the system's assets, entry points, and trust boundaries, identify threats per module, rate
each by likelihood and impact, and assign a control and an owning issue to every high or critical
finding — before any fix is written.

## Background

Ten sprints of feature work were each individually correct and none of them were built with an
adversary in mind. This issue is where the system is examined as something someone might attack,
rather than something a user might misuse by accident.

The reason this issue blocks every other issue in the sprint: **fixing threats before naming them
means guessing which vulnerabilities matter.** A threat model forces the question in the right
order — what could go wrong, before what should we build — so Issues 070-074 fix problems this
document identified, not problems that happened to be convenient to fix.

The method matters as much as the output. A structured approach (STRIDE, or an equivalent) applied
per module surfaces categories of risk that ad hoc review misses — the difference between "did we
think about SQL injection?" and "did we think about every module a request enters the system
through?"

## User Story

As a Security Administrator,
I want a documented threat model covering every module,
So that Sprint 11's remediation work targets real, prioritized risks rather than guesswork.

## Acceptance Criteria

```gherkin
Given the completed threat model
When any module built through Sprint 10 is checked against it
Then the module's assets, entry points, and trust boundaries are represented
```

```gherkin
Given a threat rated High or Critical
When the threat model is reviewed
Then it names a specific control and links to the issue that will implement it
```

```gherkin
Given a threat the team decides not to address in this sprint
When it is recorded
Then the acceptance decision, its justification, and an accountable owner are documented
```

- [ ] Assets inventoried: what data and capabilities the system holds, module by module
- [ ] Entry points mapped: every API surface, file upload, webhook, and external dependency
- [ ] Trust boundaries identified: where authentication, authorization, and validation apply
- [ ] Threats identified per module using a structured method
- [ ] Each threat rated by likelihood and impact
- [ ] Each High and Critical threat mapped to a specific control
- [ ] Each control mapped to an issue number (069-074) responsible for implementing it
- [ ] Accepted risks documented with justification, owner, and review date
- [ ] Threat model reviewed by someone other than its author
- [ ] Document committed to `docs/Architecture/` and versioned
- [ ] Process documented for reviewing the threat model when a new module is added

## Expected Result

A committed, reviewed document exists naming what could go wrong across the whole system, with
every serious finding pointing at the issue that will fix it. Issues 070-074 can be worked from
this document rather than from intuition.

---

## Scope

### Included

- Asset and entry point inventory
- Trust boundary mapping
- Threat identification and rating per module
- Control assignment linking findings to issues 070-074
- Accepted risk register
- Peer review
- Documentation of the update process

### Out of Scope

- Implementing any control (Issues 070-074)
- Penetration testing (a candidate for Issue 074's scanning or beyond)
- Third-party or vendor security assessments
- Physical and personnel security

## Technical Requirements

**Method**

```text
What are we building?          asset and entry point inventory

        ↓

What can go wrong?             threat identification per module,
                                using STRIDE or an equivalent structured method

        ↓

What are we going to do about it?    control assignment, mapped to an issue

        ↓

Did we do a good job?          peer review, then re-checked after 070-074 land
```

**Structured threat categories** (STRIDE, as a reference framework)

```text
Spoofing                 impersonating a user or system
Tampering                unauthorized modification of data
Repudiation               denying an action without a trace
Information Disclosure    exposing data to unauthorized parties
Denial of Service         degrading availability
Elevation of Privilege     gaining unauthorized capability
```

Apply this per module (auth, HR, inventory, sales, procurement, finance, reporting, workflow) so
coverage is systematic rather than opportunistic.

**Document structure**

```text
docs/Architecture/threat-model.md

1. System overview and trust boundaries
2. Asset inventory
3. Entry point inventory
4. Threats by module, each with:
     - description
     - STRIDE category
     - likelihood (Low / Medium / High)
     - impact (Low / Medium / High / Critical)
     - rating (derived)
     - control
     - owning issue
     - status (Open / Addressed / Accepted)
5. Accepted risk register
6. Review and update process
```

**Known candidate threats to verify are covered** (not exhaustive — the review must go beyond this
list, but it should not miss these):

```text
Credential stuffing and brute force        → Issue 070
Token replay after logout                  → Issue 070
IDOR across employee, financial, and order records   → Issue 071
Missing permission checks on newer endpoints (Sprints 06-10)   → Issue 071
SQL and command injection                  → Issue 072
Stored and reflected XSS                   → Issue 072
Secrets committed to source control        → Issue 073
Supplier bank detail tampering (flagged in Issue 043)   → Issue 071, Issue 073
Vulnerable dependencies                    → Issue 074
```

## Dependencies

None — this is the starting issue for Sprint 11 and blocks every other issue in it.

## Definition of Done

- [ ] Content accurate and reflects the system as built through Sprint 10
- [ ] Every module has at least one identified threat
- [ ] Every High and Critical threat maps to a specific control and issue number
- [ ] Accepted risks documented with owner and justification
- [ ] Peer reviewed by someone other than the author
- [ ] Links resolve correctly
- [ ] Renders correctly on GitHub
- [ ] Code review completed
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-11-security-hardening.md` § 1 |
| Epic | Security Hardening |
| Drives | Issues 070, 071, 072, 073, 074 |
| Pull Request | _to be linked_ |
