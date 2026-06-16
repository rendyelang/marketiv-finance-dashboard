---
trigger: always_on
---

# Marketiv Finance Database Schema v1

## Overview

The database is designed to support:

- Budget Planning (RAB)
- Budget Realization
- Financial Transactions
- Attachments
- Activity Tracking
- User Management

The structure follows the real Marketiv P2MW budgeting format:

Budget Category
↓
Budget Activity
↓
Budget Item
↓
Transaction
↓
Attachment

---

# Table: users

Represents authenticated system users.

Fields:

- id (uuid, primary key)
- full_name (text)
- email (text, unique)
- role (text)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)

Role values:

- admin
- member

---

# Table: budget_categories

Represents top-level RAB categories.

Examples:

- Pengembangan Produk/Riset
- Produksi
- Legalitas, Perizinan, Sertifikasi
- Peningkatan Kompetensi SDM Bersertifikasi
- ATK dan Penunjang

Fields:

- id (uuid, primary key)
- name (text)
- description (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

Relationship:

budget_categories (1)
↓
budget_activities (N)

---

# Table: budget_activities

Represents activities inside a category.

Examples:

- Lisensi AI Team
- Backend-as-a-Service
- Tools Desain Promosi
- Marketing Ads
- HAKI

Fields:

- id (uuid, primary key)
- category_id (uuid, foreign key)
- name (text)
- description (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

Relationship:

budget_activities (1)
↓
budget_items (N)

---

# Table: budget_items

Represents individual budgeted items.

Examples:

- Individual Pro
- Canva Pro Team Business
- Meta Ads
- Domain & Hosting

Fields:

- id (uuid, primary key)

- activity_id (uuid, foreign key)

- name (text)

- quantity (numeric)

- unit (text)

- unit_price (numeric)

- total_budget (numeric)

- reference_url (text, nullable)

- target_achievement (text)

- person_in_charge (text)

- approved_budget (numeric)

- is_archived (boolean)

- created_at (timestamp)

- updated_at (timestamp)

---

# Budget Item Calculations

Used Amount is NOT stored.

Used Amount:

SUM(all expense transactions linked to this item)

---

Budget Status is NOT stored.

Status is calculated dynamically.

Rules:

Used Amount = 0

→ Planned

---

0 < Used Amount < Total Budget

→ In Progress

---

Used Amount >= Total Budget

→ Completed

---

# Budget Item Archive Policy

If no transactions exist:

Budget Item may be deleted.

---

If transactions exist:

Budget Item must be archived.

Never permanently delete historical financial records.

---

# Table: transactions

Represents financial activity.

Types:

- income
- expense

Fields:

- id (uuid, primary key)

- transaction_number (text)

- type (text)

- date (date)

- amount (numeric)

- description (text)

- budget_item_id (uuid, nullable)

- person_in_charge (text)

- notes (text, nullable)

- status (text)

- created_by (uuid)

- created_at (timestamp)

- updated_at (timestamp)

- archived_at (timestamp, nullable)

---

# Transaction Rules

Expense Transactions

Must have:

- budget_item_id

---

Income Transactions

Must NOT require:

- budget_item_id

---

Multiple income transactions are allowed.

Examples:

- P2MW Funding
- Sponsorship
- Revenue
- Partnership Income

---

# Table: attachments

Represents supporting documents.

Examples:

- invoice.pdf
- receipt.jpg
- transfer-proof.png

Fields:

- id (uuid, primary key)

- transaction_id (uuid)

- file_name (text)

- file_url (text)

- file_type (text)

- file_size (bigint)

- uploaded_by (uuid)

- created_at (timestamp)

Relationship:

transactions (1)
↓
attachments (N)

---

# Supported File Types

- PDF
- JPG
- JPEG
- PNG
- WEBP

---

# Storage

Supabase Storage Bucket:

transaction-documents

Files are stored in Supabase Storage.

Database stores metadata only.

---

# Table: activity_logs

Represents system activity and audit history.

Fields:

- id (uuid, primary key)

- user_id (uuid)

- entity_type (text)

- entity_id (uuid)

- action (text)

- old_value (jsonb, nullable)

- new_value (jsonb, nullable)

- created_at (timestamp)

---

# Entity Types

Examples:

- transaction
- budget_item
- attachment
- user

---

# Actions

Examples:

- TRANSACTION_CREATED

- TRANSACTION_UPDATED

- TRANSACTION_ARCHIVED

- ATTACHMENT_UPLOADED

- ATTACHMENT_DELETED

- BUDGET_ITEM_CREATED

- BUDGET_ITEM_UPDATED

- BUDGET_ITEM_ARCHIVED

- USER_CREATED

- USER_UPDATED

---

# Dashboard Metrics

Dashboard values are calculated.

Never manually entered.

---

Total Income

SUM(all income transactions)

---

Total Expense

SUM(all expense transactions)

---

Net Balance

Total Income - Total Expense

---

Total Budget

SUM(all budget_items.total_budget)

---

Budget Utilization

Total Expense / Total Budget

---

Remaining Budget

Total Budget - Total Expense

---

# Realization Rules

Realization is derived from transactions.

Never manually edited.

---

Budget Item

Total Budget:
Rp500.000

Used:
Rp300.000

Remaining:
Rp200.000

Progress:
60%

All values are calculated dynamically.

---

# Security

Authentication:

Supabase Auth

---

Authorization:

Admin

- Full Access

Member

- Read Only

---

Permissions must be enforced:

- UI Layer
- Supabase RLS Layer
