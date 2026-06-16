---
trigger: always_on
---

# Marketiv Finance - Database Schema Contract

## Purpose

This document is the single source of truth for all database table names, column names, enum values, and relationships.

All AI agents, contributors, and future development must follow this contract exactly.

Never infer, rename, pluralize, singularize, or substitute any table name, column name, or enum value unless this document is explicitly updated.

---

# Core Principle

Database schema is a contract.

Code must adapt to the schema.

Schema must not be guessed from code.

If implementation and schema differ:

The implementation is wrong.

The schema contract is correct.

---

# Users

Table:

users

Columns:

- id (uuid)
- full_name (text)
- email (text)
- position (text)
- role (text)
- status (text)
- auth_user_id (uuid)
- last_active_at (timestamptz)
- created_at (timestamptz)
- updated_at (timestamptz)

Role values:

- ADMIN
- MEMBER

Status values:

- ACTIVE
- INVITED

Authentication mapping:

auth.users.id

↓

users.auth_user_id

Application profile loading must always use:

auth_user_id = session.user.id

Never query users by email if auth_user_id exists.

---

# Budget Categories

Table:

budget_categories

Columns:

- id
- name
- description
- created_at
- updated_at

---

# Budget Activities

Table:

budget_activities

Columns:

- id
- category_id
- name
- description
- created_at
- updated_at

Relationship:

budget_categories.id

↓

budget_activities.category_id

---

# Budget Items

Table:

budget_items

Columns:

- id
- activity_id
- name
- quantity
- unit
- unit_price
- reference_url
- target_achievement
- person_in_charge
- created_at
- updated_at

Relationship:

budget_activities.id

↓

budget_items.activity_id

---

# Transactions

Table:

transactions

Columns:

- id
- budget_item_id
- type
- date
- amount
- description
- category_id
- person_in_charge
- status
- notes
- created_by
- created_at
- updated_at

Relationship:

budget_items.id

↓

transactions.budget_item_id

---

# Attachments

Table:

attachments

Columns:

- id
- transaction_id
- file_name
- file_url
- uploaded_at

Relationship:

transactions.id

↓

attachments.transaction_id

Storage Bucket:

transaction-documents

Bucket Visibility:

public

---

# Activity Logs

Table:

activity_logs

Columns:

- id
- action
- entity_type
- entity_id
- old_value
- new_value
- created_at

---

# Naming Rules

Never rename:

users
budget_categories
budget_activities
budget_items
transactions
attachments
activity_logs

Never create alternative names such as:

profiles
user_profiles
expenses
budgets
transaction_files
audit_logs

Use only names defined in this document.

---

# AI Agent Requirements

Before writing any query:

1. Read this schema contract.
2. Verify table names.
3. Verify column names.
4. Verify enum values.
5. Verify relationships.

Never assume.

Never generate replacement names.

Never create duplicate tables.

Never create shadow schemas.

Schema contract always wins.
