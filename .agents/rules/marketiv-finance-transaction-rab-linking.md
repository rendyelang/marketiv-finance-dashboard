---
trigger: always_on
---

# Marketiv Finance - Transaction ↔ RAB Linking Contract

## Purpose

This document defines how financial transactions are linked to Detailed RAB.

This contract applies to:

- transactions
- budget_categories
- budget_activities
- budget_items

---

# Source of Truth

Detailed RAB is the source of truth.

Transactions must never create budget structures.

Transactions only reference existing budget structures.

Hierarchy:

Budget Category
→ Budget Activity
→ Budget Item

---

# Transaction UI Contract

The Add Transaction modal must preserve the existing UI structure.

Required fields:

- Transaction Type
- Date
- Amount
- Description
- Budget Category
- Person In Charge
- Related Budget Item
- Status
- Notes
- Attachment

Do not remove:

- Budget Category dropdown
- Related Budget Item dropdown

These fields are part of the approved UI.

---

# Dropdown Behavior

Budget Category dropdown:

Source:

public.budget_categories

Display:

category.name

Value:

category.id

---

Related Budget Item dropdown:

Source:

public.budget_items

Filtered by selected Budget Category.

Implementation:

budget_items
→ budget_activities
→ budget_categories

Only show items belonging to the selected category.

---

# Income Transactions

Income transactions are not tied to Detailed RAB.

Rules:

transaction_type = INCOME

Budget Category:
optional

Related Budget Item:
optional

No realization impact.

---

# Expense Transactions

Expense transactions must be linked to Detailed RAB.

Rules:

transaction_type = EXPENSE

Budget Category:
required

Related Budget Item:
required

---

# Database Mapping

transactions.category_id

references:

budget_categories.id

---

transactions.budget_item_id

references:

budget_items.id

---

# Realization Engine

Realization must not be stored manually.

Used amount is calculated dynamically:

SUM(transactions.amount)

Where:

transaction_type = EXPENSE

AND

budget_item_id = current item

---

# Status Calculation

Budget Item Status:

planned

used_amount = 0

in_progress

0 < used_amount < planned_amount

completed

used_amount >= planned_amount

planned_amount:

quantity × unit_price

---

# AI Agent Requirements

Never hardcode categories.

Never hardcode budget items.

Always load from Supabase.

Always filter budget items based on selected category.

Preserve current Add Transaction UI.

Do not redesign the modal.
