---
trigger: always_on
---

# Marketiv Finance - Supabase Security Contract

## Purpose

This document defines the security model used during Marketiv Finance development.

The goal is to allow rapid feature implementation while maintaining authentication requirements.

This contract applies to all AI agents, developers, and future contributors.

---

# Development Philosophy

Marketiv Finance is currently:

- Internal application
- Single organization
- Small user base
- Development stage

The priority is:

- Feature completion
- Business logic validation
- Integration speed

The priority is NOT:

- Multi-tenant isolation
- Enterprise-grade row security
- Fine-grained permission enforcement

These concerns will be implemented during production hardening.

---

# Authentication Requirement

All application access requires authentication.

Unauthenticated users must never access:

- Dashboard
- RAB
- Transactions
- Reports
- Audit Trail
- User Management

Authentication is enforced through Supabase Auth and protected routes.

---

# Authorization Model

Application roles:

- ADMIN
- MEMBER

Roles are stored in:

public.users.role

---

# Frontend Responsibility

Role-based access control is enforced primarily in the application layer.

ADMIN:

- Dashboard
- RAB
- Transactions
- Reports
- Audit Trail
- User Management

MEMBER:

- Dashboard
- RAB
- Transactions
- Reports
- Audit Trail

MEMBER cannot access:

- User Management

---

# Database Access Rules

During development:

Authenticated users may perform:

- SELECT
- INSERT
- UPDATE
- DELETE

on the following tables:

- budget_categories
- budget_activities
- budget_items
- transactions
- attachments
- activity_logs

Reason:

Development velocity is prioritized over granular database permissions.

---

# Users Table Exception

The users table remains protected.

Users may only read:

their own profile

Admins may read:

all user profiles

Users table security rules are defined separately and must not be relaxed.

---

# Required CRUD Policies

The following tables must always contain CRUD policies for authenticated users:

budget_categories

budget_activities

budget_items

transactions

attachments

activity_logs

Each table must support:

SELECT
INSERT
UPDATE
DELETE

for authenticated users.

---

# AI Agent Requirements

Before implementing any feature:

1. Verify RLS policies exist.
2. Verify table privileges exist.
3. Verify authenticated users have required CRUD access.
4. Never assume policies exist.
5. Never disable authentication.
6. Never bypass Supabase Auth.

---

# Production Note

This contract is development-only.

Before production release:

- Review all policies
- Implement least-privilege access
- Restrict sensitive operations
- Audit attachment access
- Harden user management permissions

Production security will be defined in a future contract.
