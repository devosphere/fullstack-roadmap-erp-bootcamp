# Docker

**Version:** 1.0

---

# Purpose

Docker is the containerization platform used throughout this bootcamp to create consistent, portable, and reproducible development environments.

Containers ensure that applications run the same way regardless of the developer's operating system or deployment environment.

Throughout this bootcamp, Docker is used to standardize local development, testing, continuous integration, and deployment of the ERP system.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand containerization concepts
- Build Docker images
- Run applications using containers
- Configure Docker Compose
- Manage multi-container applications
- Integrate Docker into CI/CD workflows
- Prepare applications for cloud deployment

---

# What is Docker?

Docker is a platform that packages an application together with its dependencies into an isolated container.

A container includes:

- Application code
- Runtime
- System libraries
- Dependencies
- Configuration

This allows the application to behave consistently across different environments.

---

# Why Docker?

Without Docker:

```text
Developer A
Windows

↓

Application Works

Developer B
macOS

↓

Application Fails

Developer C
Linux

↓

Different Behavior
```

With Docker:

```text
Docker Image

↓

Developer A

↓

Developer B

↓

Developer C

↓

Same Application
```

Docker eliminates environment-specific inconsistencies.

---

# Docker in the SDLC

Docker supports multiple stages of software development.

```text
Development
        │
        ▼
Testing
        │
        ▼
Continuous Integration
        │
        ▼
Staging
        │
        ▼
Production
```

The same container image should progress through each environment.

---

# ERP Application Architecture

The ERP system consists of multiple services.

```text
Browser
        │
        ▼
Frontend
(Next.js)
        │
        ▼
Backend API
(NestJS)
        │
        ▼
PostgreSQL
        │
        ▼
Redis (Optional)
```

Each service may run in its own Docker container.

---

# Docker Concepts

## Image

A Docker Image is a reusable blueprint used to create containers.

Examples:

- Node.js image
- PostgreSQL image
- Redis image

Images are immutable once built.

---

## Container

A container is a running instance of an image.

Containers are:

- Isolated
- Lightweight
- Portable

Containers can be created, started, stopped, and removed as needed.

---

## Dockerfile

A Dockerfile defines how an image is built.

Typical responsibilities include:

- Selecting a base image
- Installing dependencies
- Copying application code
- Building the application
- Defining the startup command

Every application should maintain a version-controlled Dockerfile.

---

## Docker Compose

Docker Compose manages multiple containers together.

Example services:

```text
Frontend

Backend

Database

Redis
```

A single command should start the complete local development environment.

---

# Development Environment

Local development should run inside Docker whenever practical.

Example environment:

```text
Frontend

↓

Backend

↓

PostgreSQL

↓

Redis
```

Every developer should have the same environment regardless of operating system.

---

# Project Structure

Example:

```text
frontend/

Dockerfile

backend/

Dockerfile

docker-compose.yml
```

Each deployable service should maintain its own Dockerfile.

---

# Volumes

Volumes provide persistent storage.

Examples:

- PostgreSQL data
- Uploaded files
- Local development data

Application data should persist independently of container lifecycle.

---

# Networks

Docker networks enable communication between services.

Example:

```text
Frontend

↓

Backend

↓

Database
```

Services communicate through internal container networking rather than fixed IP addresses.

---

# Environment Variables

Configuration should be externalized.

Examples:

```text
DATABASE_URL

JWT_SECRET

API_URL

NODE_ENV
```

Environment-specific values should never be hardcoded.

Sensitive values should be managed securely.

---

# Build Process

Typical build workflow:

```text
Source Code
        │
        ▼
Docker Build
        │
        ▼
Docker Image
        │
        ▼
Container
```

The same image should be used across all environments.

---

# Multi-Stage Builds

Production images should use multi-stage builds.

Benefits include:

- Smaller image size
- Faster deployments
- Improved security
- Reduced attack surface

Only required runtime artifacts should be included in production images.

---

# Container Lifecycle

Typical lifecycle:

```text
Build
        │
        ▼
Run
        │
        ▼
Stop
        │
        ▼
Restart
        │
        ▼
Remove
```

Containers should remain disposable and easily reproducible.

---

# Logging

Applications should write logs to standard output.

Container platforms can then collect and aggregate logs automatically.

Avoid storing application logs inside containers.

---

# Health Checks

Containers should expose health checks.

Examples:

- API availability
- Database connectivity
- Application startup

Health checks enable orchestration platforms to detect unhealthy services.

---

# Docker and GitHub Actions

Docker integrates directly into the CI/CD pipeline.

```text
Pull Request
        │
        ▼
GitHub Actions
        │
        ▼
Build Docker Image
        │
        ▼
Run Automated Tests
        │
        ▼
Publish Image (Optional)
```

Every image should be built automatically before deployment.

---

# Security Best Practices

Professional Docker images should:

- Use trusted base images.
- Keep images up to date.
- Minimize installed packages.
- Run applications as non-root users.
- Scan images for vulnerabilities.
- Avoid embedding secrets.

Container security is part of overall application security.

---

# Performance Considerations

Optimize Docker images by:

- Using lightweight base images.
- Minimizing image layers.
- Leveraging build cache.
- Removing unnecessary files.
- Using multi-stage builds.

Efficient images reduce deployment time and resource usage.

---

# GitHub Workflow

Docker participates in the project's engineering workflow.

```text
GitHub Issue
        │
        ▼
Feature Branch
        │
        ▼
Development
        │
        ▼
Docker Build
        │
        ▼
Unit Tests
        │
        ▼
Integration Tests
        │
        ▼
End-to-End Tests
        │
        ▼
Pull Request
        │
        ▼
GitHub Actions
        │
        ▼
Merge
```

Containerized builds ensure consistent execution across local development and CI.

---

# Definition of Done

A Docker implementation is complete when:

- Dockerfiles build successfully.
- Docker Compose starts the application.
- Services communicate correctly.
- Environment variables are externalized.
- Automated tests pass inside containers.
- GitHub Actions successfully build container images.
- Documentation is updated.

Containerization is considered part of the project's deployment readiness.

---

# Best Practices

Professional engineering teams should:

- Keep Dockerfiles simple.
- Use multi-stage builds.
- Version-control container configuration.
- Externalize configuration.
- Keep images lightweight.
- Rebuild images regularly.
- Scan images for vulnerabilities.
- Test applications inside containers.

---

# Common Mistakes

Avoid:

- Hardcoding secrets inside images.
- Using oversized base images.
- Running applications as the root user.
- Committing generated containers.
- Ignoring image updates.
- Building different images for different environments.
- Storing persistent data inside containers.

Containers should remain portable, secure, and reproducible.

---

# Docker in This Bootcamp

Throughout this ERP bootcamp, Docker provides a standardized development and deployment environment for the frontend, backend, and supporting services.

As new modules are introduced during each Sprint, the learner will gradually expand the containerized environment while maintaining a consistent architecture across local development, testing, and continuous integration.

Docker serves as the foundation for reliable software delivery by ensuring that applications behave consistently from development through production.

---

# Expected Outcome

By completing this section, the learner should understand how to containerize modern full-stack applications using Docker and Docker Compose.

Throughout this bootcamp, Docker enables reproducible development environments, simplifies collaboration, strengthens CI/CD pipelines, and prepares the ERP system for scalable cloud deployment.