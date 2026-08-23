# Sprint Reports

## Document Information

| Field | Value |
| --- | --- |
| Document Type | Sprint Reports Index |
| Product | Enterprise Resource Planning System |
| Scope | Sprint review and retrospective reporting |
| Status | Draft |
| Owner | Scrum Master / Product Owner |
| Reviewers | Technical Lead, QA Lead, Release Owner |
| Related Roadmap | `academy/08-sprints/README.md` |
| Related Retrospective Template | `academy/07-templates/7-retrospective-template.md` |

## 1. Purpose

This folder stores sprint reports for the ERP project.

A sprint report records what happened during a sprint, what was completed, what was difficult, what was learned, and what should improve in the next sprint.

Sprint reports should be lightweight enough to write consistently, but clear enough to support review, release history, and continuous improvement.

## 2. When To Create A Sprint Report

Create a sprint report at the end of every sprint, after sprint review and retrospective activities.

Each sprint report should be written before or alongside the related release notes.

## 3. File Naming

Sprint report files should use the sprint number and sprint title.

```text
sprint-00-project-foundation.md
sprint-01-application-foundation.md
sprint-02-identity-access-management.md
```

Use lowercase words separated by hyphens.

## 4. Required Report Sections

Each sprint report should include:

- Sprint name
- Release version
- Sprint goal
- Planned work
- Completed work
- Incomplete or moved work
- Blockers or risks
- Key outcomes
- Documentation updates
- Release status
- Retrospective
- Improvement actions

## 5. Evidence Level

Sprint reports should use light evidence by default.

Required evidence:

- Completed work summary
- Blockers or risks
- Key sprint outcomes

Optional evidence:

- Pull request links
- Test/check summary
- Release tag
- Screenshots or demo notes
- CI status

The report should prove the sprint outcome without becoming a full audit document.

## 6. Retrospective Format

The retrospective section should create actionable improvement.

Include:

- What went well
- What was difficult
- Root causes, if known
- Lessons learned
- Action items
- Owner for each action item
- Follow-up sprint or date

Retrospectives should be honest and specific. The goal is not blame; the goal is better execution in the next sprint.

## 7. Suggested Sprint Report Template

```markdown
# Sprint XX - [Sprint Name] Report

## Sprint Information

| Field | Value |
| --- | --- |
| Sprint | Sprint XX - [Sprint Name] |
| Release | vX.Y.Z |
| Status | Draft / Reviewed / Completed |
| Report Owner | |
| Review Date | |

## Sprint Goal

[Describe the sprint goal.]

## Planned Work

- [Planned item]

## Completed Work

- [Completed item]

## Incomplete Or Moved Work

- [Moved item and reason]

## Blockers Or Risks

- [Blocker or risk]

## Key Outcomes

- [Outcome]

## Documentation Updates

- [Updated document]

## Release Status

[Draft / Not Released / Released]

## Retrospective

### What Went Well

- [Win]

### What Was Difficult

- [Challenge]

### Lessons Learned

- [Lesson]

### Improvement Actions

| Action | Owner | Follow-up |
| --- | --- | --- |
| [Action item] | [Owner] | [Sprint/date] |
```

## 8. Relationship To Release Notes

Sprint reports and release notes are related but different.

| Document | Purpose |
| --- | --- |
| Sprint Report | Explains sprint execution, blockers, outcomes, and lessons learned. |
| Release Notes | Explains what changed for a specific version or release. |

A sprint report may contain internal process learning. Release notes should be cleaner and more user-facing.

## 9. Traceability

Sprint reports should link to related artifacts when available:

- Sprint specification
- GitHub milestone
- GitHub issues
- Pull requests
- Tests/checks
- Release notes
- Retrospective action items

Traceability helps future reviews understand what was planned, what changed, and what was actually delivered.

## 10. Completion Standard

A sprint report is complete when:

- Completed work is summarized.
- Incomplete or moved work is named.
- Blockers and risks are recorded.
- Key outcomes are clear.
- Retrospective lessons are written.
- Improvement actions have owners and follow-up.
- Release status is stated.
