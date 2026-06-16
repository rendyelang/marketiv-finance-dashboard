---
trigger: always_on
---

# Marketiv Finance Supabase Conventions

## Purpose

This document defines standards for working with Supabase in the Marketiv Finance project.

All database, storage, authentication, and security implementations should follow these conventions.

---

# Supabase Services

Use:

- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Row Level Security (RLS)

Do not introduce additional backend services unless required.

---

# Naming Conventions

## Tables

Use:

snake_case

Examples:

- users
- budget_categories
- budget_activities
- budget_items
- transactions
- attachments
- activity_logs

Avoid:

CamelCase

PascalCase

---

## Columns

Use:

snake_case

Examples:

- created_at
- updated_at
- budget_item_id
- transaction_number

---

# Primary Keys

All primary keys:

uuid

Field name:

id

Example:

id uuid primary key

---

# Foreign Keys

Use:

entity_id

Examples:

- category_id
- activity_id
- budget_item_id
- transaction_id
- user_id

---

# Timestamps

All tables should contain:

created_at

updated_at

When applicable:

archived_at

Use timestamptz.

---

# Soft Delete Policy

Financial records should not be permanently deleted.

Prefer:

archived_at

or

is_archived

for historical records.

Examples:

- budget_items
- transactions

---

# Authentication

Use Supabase Auth only.

Do not build custom authentication.

Users authenticate using email and password.

---

# User Roles

Supported roles:

- admin
- member

Role values should be stored in database.

Do not hardcode permissions in UI.

---

# Authorization

Permissions must be enforced through:

1. UI checks
2. Supabase RLS

Never rely solely on frontend restrictions.

---

# Row Level Security (RLS)

Enable RLS on all tables.

Policy strategy:

Admin:

Full access

Member:

Read-only access

Default:

Deny access unless explicitly allowed.

---

# Storage

Use Supabase Storage.

Bucket:

transaction-documents

---

# Storage Folder Structure

Recommended:

transaction-documents/

transaction-id/

file-name.ext

Example:

transaction-documents/

txn-001/

invoice.pdf

---

# File Metadata

Store metadata in database.

Do not store files inside database tables.

Attachment records should reference:

- file_url
- file_name
- file_type
- file_size

---

# Environment Variables

Use:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Never hardcode credentials.

Never commit secrets.

---

# Supabase Client

Create a single shared client.

Location:

src/lib/supabase.ts

Do not create multiple Supabase clients.

---

# Service Layer Pattern

Database access should happen through services.

Preferred flow:

Component
↓
Service
↓
Supabase

Avoid:

Component
↓
Supabase

---

# Error Handling

All Supabase operations must:

- Handle errors
- Return meaningful messages
- Log failures when appropriate

Avoid silent failures.

---

# Activity Logging

Important actions should generate activity logs.

Examples:

- Transaction Created
- Transaction Updated
- Budget Item Updated
- Attachment Uploaded
- User Created

Use activity_logs table consistently.

---

# Query Principles

Prefer:

Simple queries

Readable queries

Maintainable queries

Avoid:

Premature optimization

Complex nested queries

unless required.

---

# Security Principles

Prioritize:

- Data Integrity
- Auditability
- Traceability

Financial data must remain historically accurate.

Avoid destructive operations whenever possible.

Archive instead of delete whenever financial history exists.

---

# Development Goal

Supabase should act as the single backend platform for:

- Authentication
- Database
- Storage
- Authorization

Keep the implementation simple, maintainable, and aligned with Marketiv Finance business logic.
