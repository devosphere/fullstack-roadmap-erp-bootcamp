# User Manuals

## Document Information

| Field | Value |
| --- | --- |
| Document Type | User Manuals Index |
| Product | Enterprise Resource Planning System |
| Scope | End-user task guidance |
| Status | Draft |
| Owner | Product Owner / Documentation Owner |
| Reviewers | QA Lead, Module Owner, Support Owner |
| Related BRD | `docs/BRD/README.md` |
| Related SRS | `docs/SRS/README.md` |

## 1. Purpose

This folder stores user manuals for ERP users.

User manuals explain how users complete real tasks in the system. They should be practical, role-based, and easy to follow.

## 2. Manual Style

User manuals should be organized by role.

Role-based manuals help users answer:

- What can this role do?
- Which workflows does this role use?
- What are the basic steps?
- What result should the user expect?

## 3. Detail Level

User manuals should use short task-guide style.

Each manual should focus on clear steps for common work. Full training manuals, screenshots, FAQs, and exercises can be added later after the UI is stable.

## 4. When To Create User Manuals

Create a user manual only when a feature has a working UI or workflow.

Do not write detailed user instructions before the user experience exists, because the manual may drift from the real screens and behavior.

## 5. File Naming

User manual files should be named by role.

Examples:

```text
admin-user-guide.md
hr-staff-user-guide.md
inventory-staff-user-guide.md
sales-staff-user-guide.md
purchasing-staff-user-guide.md
finance-staff-user-guide.md
manager-user-guide.md
employee-user-guide.md
```

Use lowercase words separated by hyphens.

## 6. Suggested User Manual Template

```markdown
# [Role] User Guide

## Role Summary

[Briefly describe what this role does in the ERP.]

## Available Workflows

- [Workflow or task]

## Task: [Task Name]

### When To Use This

[Explain when the user performs this task.]

### Steps

1. [Step one]
2. [Step two]
3. [Step three]

### Expected Result

[Describe what should happen after the task is completed.]

### Common Issues

- [Issue and what the user should do]
```

## 7. Writing Guidelines

- Write from the user's point of view.
- Use simple, direct instructions.
- Keep each task short.
- Avoid implementation details.
- Match the actual UI and workflow.
- Update manuals when user-facing behavior changes.

## 8. Relationship To Other Documents

| Document | Purpose |
| --- | --- |
| BRD | Explains why the ERP exists. |
| SRS | Defines what the system must do. |
| Architecture | Defines how the system is structured. |
| API Docs | Define frontend/backend communication. |
| User Manuals | Explain how users perform tasks. |

User manuals should be created from working features, not from guesses.

## 9. Traceability

User manuals should link to related artifacts when available:

- Related module
- Related sprint
- Related feature issue
- Related release notes
- Related screenshots or demos, if available

## 10. Completion Standard

A user manual is complete when:

- The target role is clear.
- The available workflow is named.
- Steps match the working UI.
- Expected result is explained.
- Common user issues are documented when known.
- The manual is updated for user-facing behavior changes.
