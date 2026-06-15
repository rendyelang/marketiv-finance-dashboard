---
trigger: always_on
---

# Marketiv Finance - RAB Module Contract

## Purpose

This document defines the complete business rules, UI structure, database mapping, and workflow for the Budget Planning (RAB) module.

All future development must follow this contract.

This document is the single source of truth for the RAB feature.

---

# Core Concept

The RAB module is the master financial planning module.

All transaction records, realization calculations, dashboard metrics, and reports originate from the approved RAB structure.

Hierarchy:

Budget Category
↓
Budget Activity
↓
Budget Item

---

# Database Structure

## Categories

Table:

budget_categories

Represents the highest-level budget grouping.

Examples:

- Product Development & Research
- Production
- Company Legalization
- Office Supplies & Support

---

## Activities

Table:

budget_activities

Each activity belongs to exactly one category.

Relationship:

budget_categories.id
↓
budget_activities.category_id

Examples:

Category:
Office Supplies & Support

Activities:

- Office Supplies
- Administrative
- Equipment

---

## Budget Items

Table:

budget_items

Each item belongs to exactly one activity.

Relationship:

budget_activities.id
↓
budget_items.activity_id

Examples:

Activity:
Office Supplies

Items:

- Stationery & Office Supplies
- Printing & Copying Materials

---

# UI Mapping

## Level 1

Large expandable card.

Source:

budget_categories.name

Example:

Office Supplies & Support

---

## Level 2

Small gray subtitle below item name.

Source:

budget_activities.name

Example:

Office Supplies

Administrative

Equipment

---

## Level 3

Main budget row.

Source:

budget_items.name

Example:

Stationery & Office Supplies

Printing & Copying Materials

Administrative & Notary Expenses

Minor Office Equipment

---

# Budget Item Fields

Each budget item contains:

- name
- quantity
- unit
- unit_price
- planned_amount
- target_achievement
- person_in_charge
- status

Status values:

- PLANNED
- IN_PROGRESS
- COMPLETED

---

# Planned Amount Formula

planned_amount

=

quantity × unit_price

The system must automatically calculate planned_amount.

Users must not manually enter planned_amount.

---

# Realization

Realization is NOT stored directly in budget_items.

Realization is calculated from transactions.

Formula:

SUM(transactions.amount)

WHERE

transactions.budget_item_id = budget_items.id

---

# Used Column

UI:

Used

Formula:

SUM(transaction.amount)

For that specific budget item.

---

# Remaining Budget

Formula:

planned_amount - used_amount

---

# Budget Utilization

Formula:

(used_amount / planned_amount) × 100

---

# Category Totals

Category Budget

=

SUM(all planned_amount)

within category

---

# Category Realization

Category Realized

=

SUM(all transaction amounts)

within category

---

# Category Utilization

Formula:

(category_realized / category_budget) × 100

---

# Add Budget Item Flow

Users click:

Add Budget Item

System opens modal.

Fields:

Category
Activity
Item Name
Quantity
Unit
Unit Price
Target Achievement
Person In Charge
Status

---

# Category Selection

Category is required.

Source:

budget_categories

---

# Activity Selection

Activity is required.

Source:

budget_activities

Filtered by selected category.

---

# Item Name

Required.

Stored in:

budget_items.name

---

# Quantity

Required.

Stored in:

budget_items.quantity

---

# Unit

Required.

Stored in:

budget_items.unit

Examples:

- Month
- Package
- License
- Unit
- User

---

# Unit Price

Required.

Stored in:

budget_items.unit_price

---

# Planned Amount

Auto-calculated.

quantity × unit_price

Stored in:

budget_items.planned_amount

---

# Target Achievement

Required.

Stored in:

budget_items.target_achievement

Example:

Official company domain active

---

# Person In Charge

Required.

Stored in:

budget_items.person_in_charge

---

# Status

Default:

PLANNED

Allowed values:

- PLANNED
- IN_PROGRESS
- COMPLETED

---

# Search Behavior

Search must support:

- category name
- activity name
- item name
- person in charge

---

# Filter Behavior

Status filters:

- All
- Planned
- In Progress
- Completed

Source:

budget_items.status

---

# Delete Rules

Budget Item can be deleted only if:

No transactions reference it.

Check:

transactions.budget_item_id

If transaction exists:

Delete must be blocked.

---

# Edit Rules

Users may edit:

- name
- quantity
- unit
- unit_price
- target_achievement
- person_in_charge
- status

planned_amount must always be recalculated automatically.

---

# Transaction Dependency

Transactions depend on RAB.

Transaction creation flow:

Category
↓
Activity
↓
Budget Item

must come from existing RAB data.

Transactions may never reference a non-existent budget item.

---

# AI Agent Requirements

Before modifying any RAB-related code:

1. Read schema contract.
2. Read business logic rules.
3. Read this RAB module contract.

Never flatten the hierarchy.

Always maintain:

Category
↓
Activity
↓
Budget Item

This hierarchy is mandatory and must remain unchanged.
