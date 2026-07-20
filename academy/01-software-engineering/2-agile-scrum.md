# Agile & Scrum

**Version:** 1.0

---

# Purpose

Software is rarely built in a single attempt.

Business requirements evolve, customer feedback changes priorities, and engineering teams continuously improve the product through small, incremental deliveries.

Agile is a mindset that embraces this reality.

Scrum is one of the most widely adopted frameworks used to apply Agile principles in software development.

Throughout this bootcamp, the ERP project will be developed using an Agile Scrum workflow to simulate how modern engineering teams plan, build, review, and release software.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the Agile mindset
- Explain the Scrum framework
- Understand Scrum roles and responsibilities
- Plan work using Sprints
- Create and refine Product Backlogs
- Estimate work using Story Points
- Participate in Sprint Planning
- Conduct Sprint Reviews
- Perform Sprint Retrospectives
- Deliver software incrementally

---

# What is Agile?

Agile is a software development philosophy focused on delivering value through continuous collaboration, iterative development, and adaptability.

Rather than attempting to design and build an entire system upfront, Agile teams deliver software in small, working increments.

This allows teams to:

- Adapt to changing requirements
- Deliver value earlier
- Gather user feedback frequently
- Reduce project risk
- Continuously improve

---

# Agile Values

The Agile Manifesto emphasizes four core values:

- Individuals and interactions over processes and tools
- Working software over comprehensive documentation
- Customer collaboration over contract negotiation
- Responding to change over following a plan

> **Note:** Documentation remains important. In this bootcamp, documentation supports software delivery—it does not replace working software.

---

# Agile Principles

Some key Agile principles include:

- Deliver working software frequently
- Welcome changing requirements
- Collaborate closely with stakeholders
- Build software in small increments
- Maintain sustainable development pace
- Pursue technical excellence
- Continuously improve through reflection

---

# What is Scrum?

Scrum is a lightweight framework for organizing Agile software development.

Work is divided into fixed-length iterations called **Sprints**, with each Sprint delivering a potentially shippable increment of the product.

Each Sprint follows the same cycle:

```text
Sprint Planning
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Sprint Review
        │
        ▼
Sprint Retrospective
        │
        ▼
Next Sprint
```

---

# Scrum Roles

## Product Owner

Responsible for maximizing product value.

Responsibilities include:

- Defining product vision
- Managing the Product Backlog
- Prioritizing work
- Clarifying requirements
- Accepting completed work

---

## Scrum Master

Responsible for facilitating the Scrum process.

Responsibilities include:

- Removing blockers
- Facilitating Scrum ceremonies
- Improving team processes
- Coaching Agile practices

---

## Development Team

Responsible for delivering working software.

Responsibilities include:

- Designing solutions
- Writing code
- Testing features
- Reviewing code
- Maintaining quality
- Delivering Sprint goals

---

# Scrum Artifacts

## Product Backlog

The Product Backlog is an ordered list of all desired product work.

Examples:

- Authentication
- Employee Management
- Inventory Module
- CRM
- Reporting Dashboard

The backlog evolves throughout the project.

---

## Sprint Backlog

The Sprint Backlog contains the work selected for the current Sprint.

Only work committed for the Sprint should appear here.

---

## Increment

The Increment is the working software produced at the end of each Sprint.

Every Sprint should result in software that is:

- Functional
- Tested
- Documented
- Potentially releasable

---

# Scrum Ceremonies

## Sprint Planning

Purpose:

Determine what will be delivered during the Sprint.

Typical activities:

- Review priorities
- Select backlog items
- Estimate effort
- Define Sprint Goal
- Break work into tasks

Deliverables:

- Sprint Goal
- Sprint Backlog

---

## Daily Stand-up

A short daily synchronization meeting.

Typical discussion:

- What was completed?
- What will be worked on today?
- Are there any blockers?

For this bootcamp, learners should maintain a daily engineering log even if working individually.

---

## Sprint Review

Held at the end of each Sprint.

Purpose:

- Demonstrate completed work
- Validate acceptance criteria
- Gather feedback
- Identify improvements

Completed software should be reviewed before moving to the next Sprint.

---

## Sprint Retrospective

Purpose:

Reflect on the Sprint and identify improvements.

Questions to consider:

- What went well?
- What could be improved?
- What should be changed next Sprint?

Continuous improvement is a core Agile principle.

---

# User Stories

Features should be described from the user's perspective.

Format:

```text
As a <role>,
I want <capability>,
So that <business value>.
```

Example:

```text
As an Inventory Manager,

I want to record incoming stock,

So that inventory levels remain accurate.
```

---

# Acceptance Criteria

Acceptance Criteria define when a User Story is considered complete.

Example:

```text
Given a valid employee record

When the HR Manager submits the form

Then the employee should be saved successfully
```

Acceptance Criteria should be:

- Clear
- Measurable
- Testable

---

# Story Points

Story Points estimate the relative effort of completing work.

Common Fibonacci scale:

| Story Points | Relative Complexity |
|--------------|--------------------|
| 1 | Very Small |
| 2 | Small |
| 3 | Medium |
| 5 | Moderate |
| 8 | Large |
| 13 | Very Large |
| 21 | Complex |

Story Points estimate effort—not time.

---

# Sprint Workflow

Every Sprint in this bootcamp follows the same process.

```text
Sprint Planning
        │
        ▼
Create GitHub Issues
        │
        ▼
Assign Sprint Backlog
        │
        ▼
Create Feature Branches
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Pull Request
        │
        ▼
Code Review
        │
        ▼
Merge
        │
        ▼
Sprint Review
        │
        ▼
Sprint Retrospective
```

---

# Agile in This Bootcamp

Unlike many learning programs that teach concepts independently, this bootcamp applies Agile principles to a single ERP project.

Each Sprint will include:

- Sprint Goal
- Learning Objectives
- Engineering Role
- GitHub Issues
- Documentation Tasks
- Development Tasks
- Testing Tasks
- Definition of Done
- Sprint Review
- Sprint Retrospective

Every Sprint contributes to the overall ERP system.

---

# Definition of Done

A User Story is considered complete only when:

- Business requirements are satisfied
- Acceptance Criteria are met
- Code has been implemented
- Tests pass
- Documentation is updated
- Pull Request is approved
- CI pipeline succeeds
- Feature is merged into the appropriate branch

Partially completed work should not be marked as done.

---

# Agile Best Practices

Throughout the bootcamp, learners should:

- Deliver small, incremental improvements
- Keep Sprint goals realistic
- Prioritize business value
- Seek feedback early
- Maintain a healthy backlog
- Continuously improve documentation
- Refactor when necessary
- Avoid unnecessary complexity

---

# Common Misconceptions

### Agile does not mean "no planning."

Agile encourages continuous planning throughout the project.

---

### Agile does not mean "no documentation."

Documentation remains essential for maintainability and collaboration.

---

### Scrum is not the same as Agile.

Agile is a mindset.

Scrum is one framework used to implement Agile principles.

---

### Completing tasks is not the objective.

Delivering business value through working software is the objective.

---

# Expected Outcome

By completing this section, the learner should understand how modern software teams organize work, collaborate effectively, and deliver software incrementally.

Every Sprint completed during this bootcamp should reinforce the principles of Agile development and Scrum, preparing the learner to contribute confidently within a professional engineering team.