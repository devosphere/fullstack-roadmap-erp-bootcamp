# Monitoring

**Version:** 1.0

---

# Purpose

Monitoring is the continuous observation of an application's health, performance, availability, and operational behavior after deployment.

Delivering software does not end when the application reaches production. Engineering teams must continuously monitor systems to detect issues, respond to incidents, and ensure reliable service for users.

Throughout this bootcamp, monitoring is considered the final stage of the Software Development Life Cycle (SDLC), providing continuous feedback that drives future improvements.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of application monitoring
- Monitor application health and availability
- Collect logs, metrics, and alerts
- Identify production issues
- Perform basic incident investigation
- Understand observability concepts
- Integrate monitoring into the deployment lifecycle

---

# Why Monitoring?

Even well-tested software can experience issues in production.

Examples include:

- Server failures
- Database outages
- Network problems
- Performance degradation
- Memory leaks
- Unexpected user behavior
- Third-party service failures

Monitoring enables engineering teams to detect and respond to these issues before they significantly impact users.

---

# Monitoring in the SDLC

Monitoring begins after deployment.

```text
Requirements
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Deployment
        │
        ▼
Monitoring
        │
        ▼
Continuous Improvement
```

Production monitoring provides valuable feedback for future development.

---

# What Should Be Monitored?

Professional systems monitor:

- Application availability
- API health
- Database performance
- Infrastructure resources
- Error rates
- Response times
- Business metrics
- Security events

Monitoring should focus on both technical health and business impact.

---

# Monitoring Categories

## Infrastructure Monitoring

Tracks infrastructure resources.

Examples:

- CPU usage
- Memory usage
- Disk utilization
- Network traffic
- Container health

Infrastructure monitoring helps identify hardware and resource bottlenecks.

---

## Application Monitoring

Tracks application behavior.

Examples:

- HTTP response times
- API requests
- Error rates
- Request throughput
- Background jobs

Application monitoring verifies that software behaves as expected.

---

## Database Monitoring

Tracks database performance.

Examples:

- Query execution time
- Connection count
- Transaction rate
- Slow queries
- Storage usage

Database monitoring helps maintain application performance.

---

## Business Monitoring

Measures business outcomes.

Examples:

- Orders created
- Employees registered
- Purchase orders approved
- Sales completed
- Active users

Business metrics help determine whether the application is delivering value.

---

# Health Checks

Applications should expose health endpoints.

Examples:

```text
/api/health

/api/status

/api/ready
```

Health checks help determine whether services are operating correctly.

---

# Logging

Applications should generate structured logs.

Useful log information includes:

- Timestamp
- Log level
- Service name
- Request ID
- User ID (where appropriate)
- Error details

Logs are essential for troubleshooting production issues.

---

# Log Levels

Common log levels include:

| Level | Purpose |
|--------|---------|
| DEBUG | Detailed troubleshooting information |
| INFO | Normal application events |
| WARN | Unexpected but recoverable situations |
| ERROR | Failures requiring attention |
| FATAL | Critical failures causing application shutdown |

Choosing appropriate log levels improves signal-to-noise ratio.

---

# Metrics

Metrics provide quantitative insight into system health.

Common metrics include:

- CPU utilization
- Memory usage
- API latency
- Error percentage
- Requests per second
- Database response time
- Active users

Metrics should be collected continuously.

---

# Alerts

Monitoring systems should generate alerts for significant events.

Examples:

- API unavailable
- High error rate
- Database connection failures
- CPU exceeds threshold
- Memory exhaustion
- Deployment failure

Alerts should notify the engineering team before users are significantly affected.

---

# Dashboards

Monitoring dashboards provide a centralized view of system health.

Typical dashboards display:

- System status
- API performance
- Infrastructure utilization
- Deployment history
- Error trends
- Business metrics

Dashboards support operational decision-making.

---

# Incident Response

When monitoring detects a problem:

```text
Alert
        │
        ▼
Investigate
        │
        ▼
Identify Root Cause
        │
        ▼
Implement Fix
        │
        ▼
Verify Resolution
        │
        ▼
Document Incident
```

A structured response minimizes downtime and supports continuous learning.

---

# Root Cause Analysis

After resolving an incident, perform a Root Cause Analysis (RCA).

The RCA should answer:

- What happened?
- Why did it happen?
- How was it detected?
- How was it resolved?
- How can it be prevented in the future?

Continuous improvement depends on learning from production incidents.

---

# Monitoring Tools

Common industry tools include:

| Purpose | Examples |
|---------|----------|
| Metrics | Prometheus |
| Dashboards | Grafana |
| Log Aggregation | ELK Stack, Loki |
| Error Tracking | Sentry |
| Cloud Monitoring | AWS CloudWatch, Azure Monitor, Google Cloud Monitoring |

The bootcamp introduces these tools conceptually. The specific tooling may vary depending on the deployment platform.

---

# Monitoring and GitHub Actions

Monitoring complements automated deployments.

```text
GitHub Actions
        │
        ▼
Deployment
        │
        ▼
Smoke Testing
        │
        ▼
Monitoring
        │
        ▼
Alerting
        │
        ▼
Incident Response
```

Automation ensures software is deployed correctly, while monitoring ensures it continues to operate correctly.

---

# Production Verification

After every deployment, verify:

- Application availability
- API functionality
- Database connectivity
- Authentication
- Critical business workflows
- System performance

Monitoring begins immediately after deployment.

---

# GitHub Workflow

Monitoring is the final stage of the engineering workflow.

```text
GitHub Issue
        │
        ▼
Development
        │
        ▼
Pull Request
        │
        ▼
GitHub Actions
        │
        ▼
Deployment
        │
        ▼
Smoke Testing
        │
        ▼
Monitoring
        │
        ▼
Incident Response
        │
        ▼
Continuous Improvement
```

Operational feedback should continuously improve future development.

---

# Definition of Done

A deployment is operationally complete when:

- Health checks succeed.
- Monitoring dashboards are updated.
- Critical metrics are available.
- Logging is functioning correctly.
- Alerts are configured.
- Smoke tests pass.
- No critical production issues are detected.

Monitoring is an essential part of delivering production-ready software.

---

# Best Practices

Professional engineering teams should:

- Monitor both technical and business metrics.
- Implement meaningful alerts.
- Use structured logging.
- Maintain operational dashboards.
- Review incidents regularly.
- Perform Root Cause Analysis.
- Continuously improve monitoring coverage.

Monitoring should provide actionable insights rather than excessive noise.

---

# Common Mistakes

Avoid:

- Monitoring only infrastructure.
- Ignoring application logs.
- Creating excessive alerts.
- Failing to investigate recurring issues.
- Deploying without monitoring.
- Collecting metrics without reviewing them.
- Treating monitoring as optional.

Monitoring should support proactive operations rather than reactive firefighting.

---

# Monitoring in This Bootcamp

Throughout this ERP bootcamp, monitoring evolves alongside the application.

Early Sprints focus on application logs and health checks. Later Sprints introduce dashboards, metrics, alerts, deployment verification, and basic observability concepts.

The learner is expected to understand that delivering software does not end with deployment. Reliable systems require continuous observation, rapid incident response, and ongoing operational improvement.

---

# Expected Outcome

By completing this section, the learner should understand how monitoring supports reliable software delivery by providing visibility into application health, performance, and business operations.

Throughout this bootcamp, monitoring serves as the operational feedback loop that connects deployment, production reliability, incident response, and continuous improvement, preparing the learner for real-world software engineering practices.