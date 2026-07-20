# ERP Bootcamp Terminology Guide

**Document Version:** 1.0  
**Purpose:** Define standard terminology, naming conventions, and language used throughout the ERP Bootcamp project.

---

# Introduction

Large software projects fail when teams use inconsistent terminology.

This document establishes the official vocabulary used by:

- Product Management
- Business Analysis
- Software Engineering
- QA Engineering
- DevOps
- Documentation

All project documentation, GitHub Issues, Pull Requests, and technical discussions should follow these terms.

---

# 1. Product & Business Terminology

---

# Product

A software solution that delivers business value to users.

Example:

```
ERP Platform
```

A product may contain multiple modules.

---

# Module

A major functional area of a system.

Examples:

```
HR Module

Inventory Module

Sales Module

Finance Module
```

A module contains related business capabilities.

---

# Feature

A user-facing capability that provides value.

Example:

```
Employee Profile Management
```

A feature is usually implemented through one or more GitHub Issues.

---

# Capability

A broader business ability provided by the system.

Example:

```
Employee Management Capability

Includes:

- Employee Records
- Departments
- Roles
- Reporting
```

A capability may contain multiple features.

---

# Epic

A large body of work representing a significant product objective.

Example:

```
Employee Management System
```

An Epic is broken down into:

```
Epic

↓

Features

↓

User Stories

↓

Tasks
```

---

# User Story

A requirement written from the user's perspective.

Format:

```
As a <user>

I want <capability>

So that <business value>
```

Example:

```
As an HR Manager,

I want to create employee records,

So that employee information is maintained digitally.
```

---

# Task

A technical activity required to complete a user story.

Example:

```
Create Employee API Endpoint
```

---

# Bug

A defect where the system behaves differently from the expected behavior.

Example:

```
Leave balance calculation returns incorrect value.
```

---

# Improvement

An enhancement that improves an existing capability.

Example:

```
Improve employee search performance.
```

---

# 2. Software Engineering Terminology

---

# Repository (Repo)

A storage location containing project source code and related files.

Example:

```
fullstack-roadmap-erp-bootcamp
```

Contains:

- Source code
- Documentation
- Configuration
- Tests

---

# Branch

A separate development path in Git.

Examples:

```
main

develop

feature/user-login
```

---

# Main Branch

The primary stable branch.

Purpose:

- Production-ready code
- Official releases

Example:

```
main
```

---

# Development Branch

Integration branch where completed features are combined before release.

Example:

```
develop
```

---

# Feature Branch

A temporary branch created for a specific change.

Naming:

```
feature/<issue-number>-<description>
```

Example:

```
feature/101-user-authentication
```

---

# Commit

A saved unit of change in Git history.

Example:

```
feat(auth): add JWT authentication
```

---

# Pull Request (PR)

A formal request to merge code changes.

Purpose:

- Code review
- Quality validation
- Collaboration

---

# Merge

The process of combining changes from one branch into another.

Example:

```
feature branch

↓

develop
```

---

# Release

A published version of software.

Example:

```
v1.0.0
```

---

# Deployment

The process of installing software into an environment.

Example:

```
Development

↓

Testing

↓

Staging

↓

Production
```

---

# 3. Requirements Terminology

---

# BRD (Business Requirements Document)

Defines:

- Business problem
- Goals
- Scope
- Expected outcomes

Answers:

> Why are we building this?

---

# SRS (Software Requirements Specification)

Defines:

- Functional requirements
- Technical requirements
- System behavior

Answers:

> What should the system do?

---

# Acceptance Criteria

Conditions that determine whether a requirement is complete.

Example:

```
Given the user is logged in

When the user submits a form

Then the data should be saved.
```

---

# Business Rule

A rule defined by the business.

Example:

```
Only managers can approve employee leave.
```

---

# Requirement Traceability

The ability to track a requirement through the entire lifecycle.

Example:

```
BRD

↓

SRS

↓

User Story

↓

GitHub Issue

↓

Pull Request

↓

Test Case

↓

Release
```

---

# 4. Architecture Terminology

---

# Architecture

The overall design structure of a software system.

Defines:

- Components
- Communication
- Data flow
- Technology choices

---

# Component

A reusable part of a system.

Examples:

```
Authentication Service

Employee Module

Notification Service
```

---

# Service

A backend component responsible for specific business logic.

Example:

```
EmployeeService
```

---

# Controller

A backend component responsible for receiving requests and returning responses.

Example:

```
EmployeeController
```

---

# Repository Layer

A layer responsible for database communication.

Example:

```
EmployeeRepository
```

---

# API

A communication interface between software components.

Example:

```
Frontend

↓

REST API

↓

Backend
```

---

# Endpoint

A specific API URL.

Example:

```
POST /api/users
```

---

# Database Schema

The structure of stored data.

Contains:

- Tables
- Columns
- Relationships

---

# Entity

A business object represented in the database.

Examples:

```
User

Employee

Product

Order
```

---

# Migration

A controlled database structure change.

Example:

```
Create employees table
```

---

# 5. Agile Terminology

---

# Agile

A software development approach focused on:

- Iterative delivery
- Collaboration
- Continuous improvement

---

# Scrum

An Agile framework using:

- Sprints
- Backlogs
- Reviews
- Retrospectives

---

# Sprint

A fixed development period.

Typical:

```
1-2 weeks
```

---

# Sprint Goal

The main objective of a Sprint.

Example:

```
Implement authentication foundation.
```

---

# Sprint Planning

A meeting where the team selects work for the Sprint.

---

# Sprint Review

A demonstration of completed work.

Participants:

- Developers
- Product Owner
- Stakeholders

---

# Sprint Retrospective

A meeting focused on process improvement.

Questions:

- What went well?
- What went wrong?
- What should improve?

---

# Backlog

A prioritized list of work.

Contains:

- Features
- Bugs
- Improvements
- Technical tasks

---

# 6. Testing Terminology

---

# Test Case

A documented scenario used to verify system behavior.

Example:

```
Login with valid credentials.
```

---

# Test Scenario

A broader situation being tested.

Example:

```
User Authentication Flow
```

---

# Unit Test

Tests a small isolated piece of code.

Example:

```
calculateTotal()
```

---

# Integration Test

Tests multiple components working together.

Example:

```
API + Database
```

---

# End-to-End Test (E2E)

Tests complete user workflows.

Example:

```
Login

↓

Create Order

↓

Checkout
```

---

# Regression Testing

Testing existing functionality after changes.

---

# Smoke Testing

Basic validation that the system works after deployment.

---

# 7. DevOps Terminology

---

# CI (Continuous Integration)

Automatically validates code changes.

Example:

```
Commit

↓

Build

↓

Test
```

---

# CD (Continuous Delivery / Deployment)

Automates software delivery.

Example:

```
Build

↓

Test

↓

Deploy
```

---

# Pipeline

A sequence of automated steps.

Example:

```
Install

↓

Lint

↓

Test

↓

Build
```

---

# Container

A packaged application environment.

Technology:

```
Docker
```

---

# Image

A blueprint used to create containers.

Example:

```
ERP Backend Image
```

---

# Environment Variable

Configuration value stored outside application code.

Example:

```
DATABASE_URL
JWT_SECRET
```

---

# 8. Code Quality Terminology

---

# Refactoring

Improving code structure without changing behavior.

Example:

- Removing duplication
- Improving readability

---

# Technical Debt

Future cost caused by quick or temporary solutions.

---

# Code Smell

A sign of poor design.

Examples:

- Duplicate code
- Large functions
- Complex logic

---

# Clean Code

Code that is:

- Readable
- Maintainable
- Testable

---

# 9. ERP Domain Terminology

---

# Master Data

Core business information reused across processes.

Examples:

- Customers
- Products
- Employees
- Suppliers

---

# Transaction Data

Business activities recorded by the system.

Examples:

- Sales Orders
- Purchase Orders
- Payments

---

# Workflow

A sequence of business steps.

Example:

```
Order Created

↓

Manager Approval

↓

Payment

↓

Fulfillment
```

---

# Role

A collection of permissions assigned to a user.

Example:

```
HR Manager
```

---

# Permission

A specific action allowed by the system.

Example:

```
CREATE_EMPLOYEE
```

---

# Audit Trail

A record of system activities.

Example:

```
User A updated Employee B at 10:30 AM
```

---

# 10. Naming Standards

---

# Files

Use:

```
kebab-case
```

Example:

```
user-management.service.ts
```

---

# Database Tables

Use:

```
snake_case
```

Example:

```
employee_profiles
```

---

# API Endpoints

Use:

```
plural nouns
```

Example:

```
/api/employees

/api/orders
```

---

# Git Branches

Use:

```
feature/<issue>-description

bugfix/<issue>-description

hotfix/<issue>-description
```

---

# Commit Messages

Use Conventional Commits.

Examples:

```
feat: add employee module

fix: correct leave calculation

docs: update API guide
```

---

# Final Principle

The purpose of this terminology guide is not only consistency.

It teaches engineers how professional teams communicate.

A strong engineer understands that software development is a combination of:

```
Business Understanding

+

Technical Knowledge

+

Communication

+

Process Discipline
```

A shared language allows teams to build complex systems together.