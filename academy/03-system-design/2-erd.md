# Entity Relationship Diagram (ERD)

**Version:** 1.0

---

# Purpose

An Entity Relationship Diagram (ERD) is a visual representation of the data model used by the system. It defines the entities, their attributes, and the relationships between them.

The ERD serves as the foundation for database design and ensures that business requirements are accurately translated into a structured and maintainable database.

Throughout this bootcamp, every ERP module that stores business data must update the project's ERD before implementation begins.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand relational database concepts
- Identify entities from business requirements
- Define entity attributes
- Establish relationships between entities
- Apply database normalization principles
- Design scalable ERP databases
- Create professional ERDs

---

# What is an ERD?

An Entity Relationship Diagram models the business data used by an application.

It answers questions such as:

- What data should be stored?
- How is the data related?
- What are the primary keys?
- What are the foreign keys?
- How is data integrity maintained?

An ERD focuses on **data structure**, not application logic.

---

# ERD in the SDLC

Database design begins after the System Architecture has been defined.

```text
Business Requirements
        │
        ▼
Software Requirements
        │
        ▼
System Architecture
        │
        ▼
Entity Relationship Diagram
        │
        ▼
Database Schema
        │
        ▼
Development
```

The ERD provides the blueprint for the physical database.

---

# Core Database Concepts

## Entity

An entity represents a business object.

Examples:

- Employee
- Customer
- Product
- Supplier
- Department
- Sales Order
- Purchase Order
- Warehouse

Each entity typically becomes a database table.

---

## Attribute

Attributes describe an entity.

Example:

Employee

- Employee ID
- First Name
- Last Name
- Email
- Hire Date
- Status

Each attribute usually becomes a table column.

---

## Primary Key (PK)

A Primary Key uniquely identifies a record.

Example:

```text
Employee
---------
employee_id (PK)
```

Every table should have exactly one Primary Key.

---

## Foreign Key (FK)

A Foreign Key creates relationships between tables.

Example:

```text
Department
-----------
department_id (PK)

Employee
---------
employee_id (PK)
department_id (FK)
```

Foreign Keys enforce referential integrity.

---

# Relationship Types

## One-to-One (1:1)

One record is associated with exactly one other record.

Example:

```text
Employee
    │
    │
    ▼
Employee Profile
```

This relationship is relatively uncommon in ERP systems.

---

## One-to-Many (1:N)

One record relates to many records.

Example:

```text
Department

      │

      ▼

Employees
```

One Department can have many Employees.

Each Employee belongs to one Department.

This is the most common relationship type.

---

## Many-to-Many (M:N)

Many records relate to many other records.

Example:

```text
Employees

       │

Employee_Project

       │

Projects
```

Many-to-many relationships require a junction table.

---

# Example ERP Data Model

```text
Department
-----------
department_id (PK)
name

        │
        │ 1
        │
        │ N
        ▼

Employee
---------
employee_id (PK)
department_id (FK)
manager_id (FK)
first_name
last_name
email

        │
        │ 1
        │
        │ N
        ▼

Leave Request
-------------
leave_request_id (PK)
employee_id (FK)
leave_type
start_date
end_date
status
```

This demonstrates a simple HR module.

---

# ERP Core Entities

Throughout this bootcamp, the ERP system will gradually introduce the following core entities.

```text
Users

Roles

Permissions

Employees

Departments

Customers

Suppliers

Products

Categories

Warehouses

Inventory

Sales Orders

Purchase Orders

Invoices

Payments

Leave Requests

Audit Logs

Notifications
```

New entities will be added as new ERP modules are implemented.

---

# Naming Conventions

Database naming should remain consistent.

Tables:

```text
employees

departments

leave_requests

sales_orders
```

Columns:

```text
employee_id

department_id

created_at

updated_at

deleted_at
```

Primary Keys:

```text
id

or

employee_id
```

Foreign Keys:

```text
department_id

customer_id

product_id
```

Consistency improves maintainability.

---

# Normalization

Normalization reduces data duplication and improves consistency.

This bootcamp aims for **Third Normal Form (3NF)**.

### First Normal Form (1NF)

- No repeating groups
- Atomic values

---

### Second Normal Form (2NF)

- Remove partial dependencies

---

### Third Normal Form (3NF)

- Remove transitive dependencies

Well-normalized databases are easier to maintain and scale.

---

# Audit Fields

Most ERP tables should include standard audit fields.

Example:

```text
id

created_at

updated_at

created_by

updated_by

deleted_at
```

These fields support auditing, reporting, and soft deletion.

---

# Soft Delete

Instead of permanently deleting records, ERP systems often use soft deletion.

Example:

```text
deleted_at
```

If `deleted_at` is NULL, the record is active.

Otherwise, it is considered deleted.

This preserves historical business data.

---

# Example Table

```text
employees

--------------------------------

employee_id (PK)

department_id (FK)

first_name

last_name

email

hire_date

status

created_at

updated_at

deleted_at
```

Every table should have a clear purpose and avoid unnecessary duplication.

---

# Relationship with Other Documents

The ERD is derived from the requirements gathered during Business Analysis and System Design.

```text
Business Requirements
        │
        ▼
Software Requirements
        │
        ▼
System Architecture
        │
        ▼
Entity Relationship Diagram
        │
        ▼
API Design
        │
        ▼
Development
```

Changes to business requirements may require updates to the ERD.

---

# Best Practices

Professional engineers should:

- Keep entities focused on a single responsibility.
- Use meaningful names.
- Enforce Primary and Foreign Keys.
- Normalize data appropriately.
- Include audit fields.
- Document relationships.
- Review the ERD before implementation.

---

# Common Mistakes

Avoid:

- Duplicating data across multiple tables.
- Missing Primary Keys.
- Missing Foreign Keys.
- Poor naming conventions.
- Over-normalizing simple data.
- Ignoring future scalability.
- Designing tables without business justification.

A well-designed ERD simplifies development and reduces technical debt.

---

# ERD in This Bootcamp

The ERP system will evolve incrementally across multiple Sprints.

Each Sprint may introduce:

- New entities
- New relationships
- New attributes
- New constraints

The ERD should always reflect the current state of the application and remain synchronized with the database schema and ORM models.

Every Pull Request that changes the database structure must also update:

- The ERD
- Database migrations
- ORM models
- Related documentation

This ensures that architecture, implementation, and documentation remain aligned.

---

# Expected Outcome

By completing this section, the learner should understand how to identify entities, model relationships, normalize business data, and create professional Entity Relationship Diagrams.

Throughout this bootcamp, the ERD serves as the single source of truth for the ERP database design, ensuring that every module is built upon a consistent, scalable, and maintainable data model.