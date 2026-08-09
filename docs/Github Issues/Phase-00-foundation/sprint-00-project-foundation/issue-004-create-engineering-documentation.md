# [DOCS] Create Engineering Documentation

<!-- GitHub title: [DOCS] Create Engineering Documentation
     Labels: documentation, docs, priority: high
     Milestone: Sprint 00 - Project Foundation
     Branch: docs/004-create-engineering-documentation
     Epic: Project Foundation & Engineering Setup
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
- [x] High
- [ ] Critical

## Module: docs
## Sprint: Sprint 00 - Project Foundation & Engineering Setup

---

## Summary

Write the engineering knowledge base in `academy/`: SDLC and Agile practice, coding standards,
development guidelines, code review process, and the document templates used throughout the
programme.

## Background

Issue 002 documented *how code moves*. This issue documents *how engineering is practised*.

`academy/` is not supplementary reading. Together with the sprint documents it is the
specification: it defines the mandatory workflows, coding standards, folder structure, and
Definition of Done that every later sprint is measured against. When the README and the academy
disagree, the academy wins.

Writing it now means Sprint 01 has conventions to follow instead of inventing them per file.

## Acceptance Criteria

```gherkin
Given a new contributor joining at any sprint
When they read the academy documentation
Then they can write code that matches the existing codebase conventions without review feedback on style
```

- [ ] SDLC documentation written
- [ ] Agile and Scrum practice documented
- [ ] Code review process and checklist documented
- [ ] Coding standards documented (naming, structure, TypeScript rules, comments)
- [ ] Project structure conventions documented (organize by feature, not file type)
- [ ] Testing expectations documented
- [ ] Business analysis guides written (BRD, SRS, user stories, acceptance criteria)
- [ ] Document templates created (BRD, SRS, ADR, Issue, PR, Release, Retrospective)
- [ ] Definition of Done defined and stated in one place
- [ ] All examples verified against this project
- [ ] Links resolve correctly and documents render correctly on GitHub

## Expected Result

`academy/` contains a complete engineering handbook. Every convention a later sprint relies on
is written down and findable, and the Definition of Done is stated once rather than implied in
each sprint document.

---

## Scope

### Included

- `academy/01-software-engineering/` — SDLC, Agile, git, branching, PRs, code review, commits
- `academy/02-business-analysis/` — BRD, SRS, stakeholders, user stories, acceptance criteria
- `academy/04-development/` — coding standards, TypeScript, project structure
- `academy/05-testing/` — testing strategy and expectations
- `academy/07-templates/` — BRD, SRS, ADR, issue, PR, release, retrospective templates
- `academy/README.md` — index and reading order

### Out of Scope

- Sprint documents (`academy/08-sprints/` — authored separately as roadmap planning)
- System design and DevOps guides (expanded in later phases)
- Any application code

## Technical Requirements

**Documents to produce**

```text
academy/
├── README.md
├── 00-program-overview/
├── 01-software-engineering/
│   ├── 1-git-github.md
│   ├── 2-agile-scrum.md
│   ├── 3-sdlc.md
│   ├── 4-branching-strategy.md
│   ├── 5-pull-request-guide.md
│   ├── 6-code-review.md
│   └── 7-conventional-commits.md
├── 02-business-analysis/
│   ├── 1-brd.md
│   ├── 2-srs.md
│   ├── 3-stakeholder-analysis.md
│   ├── 4-user-stories.md
│   ├── 5-acceptance-criteria.md
│   └── 6-process-flow.md
├── 04-development/
├── 05-testing/
└── 07-templates/
    ├── 1-brd-template.md
    ├── 2-srs-template.md
    ├── 3-adr-template.md
    ├── 4-issue-template.md
    ├── 5-pr-template.md
    ├── 6-release-template.md
    └── 7-retrospective-template.md
```

**Standards to state explicitly**

- Organize code by feature, not by file type.
- Lowercase directories; dot-separated file names (`employee.service.ts`).
- Controllers handle request, validation, and response; business logic lives in services.
- TypeScript strict mode; no `any`.
- ESLint and Prettier for formatting.
- Comments explain *why*, not *what*.

**Definition of Done**

```text
Coding standards → lint → tests → code review → CI green
→ documentation updated → acceptance criteria met
```

Code and its documentation change in the same Pull Request.

## Dependencies

- Issue 001 — the `academy/` folder structure must exist.
- Issue 002 — git and PR documents are authored there; this issue completes the surrounding set.

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Content accurate and complete
- [ ] Examples verified against this project
- [ ] Links resolve correctly
- [ ] Renders correctly on GitHub
- [ ] Code review completed
- [ ] CI green
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-00-project-foundation.md` § 2, § 6, § 7 |
| Academy index | `academy/README.md` |
| Epic | Project Foundation & Engineering Setup |
| Pull Request | _to be linked_ |
