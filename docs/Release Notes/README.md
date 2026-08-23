# Release Notes

## Document Information

| Field | Value |
| --- | --- |
| Document Type | Release Notes Index |
| Product | Enterprise Resource Planning System |
| Scope | Versioned release summaries |
| Status | Draft |
| Owner | Release Owner |
| Reviewers | Product Owner, Technical Lead, QA Lead |
| Related Roadmap | `academy/08-sprints/README.md` |
| Related Release Template | `academy/07-templates/6-release-template.md` |

## 1. Purpose

This folder stores release notes for ERP project versions.

Release notes explain what changed in a release. They should be clear enough for business readers while still useful for the project team.

## 2. When To Create Release Notes

Create release notes for every sprint release.

Examples:

- Sprint 00 produces `v0.1.0`.
- Sprint 01 produces `v0.2.0`.
- Sprint 02 produces `v0.3.0`.

Release notes should be written after the sprint work is completed and before or during release publication.

## 3. File Naming

Release note files should use the version plus release title.

```text
v0.1.0-project-foundation.md
v0.2.0-application-foundation.md
v0.3.0-identity-access-management.md
```

Use lowercase words separated by hyphens.

## 4. Audience

Release notes are written for both business and technical readers.

Business readers should understand the value delivered. Technical readers should understand the main changes and where to look for related details.

## 5. Change Categories

Use simple changelog categories:

- Added
- Changed
- Fixed
- Removed

Only include categories that apply to the release.

## 6. Suggested Release Notes Template

```markdown
# vX.Y.Z - [Release Title]

## Release Information

| Field | Value |
| --- | --- |
| Version | vX.Y.Z |
| Release Date | YYYY-MM-DD |
| Sprint | Sprint XX - [Sprint Name] |
| Status | Draft / Released |
| Release Owner | |

## Summary

[Short explanation of what this release delivers.]

## Added

- [New feature, document, workflow, or capability.]

## Changed

- [Updated behavior, structure, process, or documentation.]

## Fixed

- [Bug fix or correction.]

## Removed

- [Removed feature, document, workflow, or behavior.]

## Related Work

- Sprint Report: [link]
- GitHub Milestone: [link]
- GitHub Issues: [link]
- Pull Requests: [link]
```

## 7. Writing Guidelines

- Write release notes in plain language.
- Focus on what changed and why it matters.
- Keep technical detail brief unless it affects users or release behavior.
- Link to sprint reports, issues, and pull requests when available.
- Do not include internal debugging notes unless they affect release understanding.

## 8. Relationship To Sprint Reports

Release notes and sprint reports are related but different.

| Document | Purpose |
| --- | --- |
| Sprint Report | Explains sprint execution, blockers, outcomes, and lessons learned. |
| Release Notes | Explains what changed in the released version. |

Release notes should summarize delivered changes. Sprint reports can contain more process detail.

## 9. Traceability

Release notes should link to related artifacts when available:

- Sprint report
- GitHub milestone
- GitHub issues
- Pull requests
- Release tag
- Tests/checks

Traceability helps future readers understand what was delivered and where the supporting evidence lives.

## 10. Completion Standard

Release notes are complete when:

- Version and release title are clear.
- Summary explains the release value.
- Changes are grouped under changelog categories.
- Related sprint or issue links are included when available.
- Release status is stated.
