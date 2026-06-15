---
trigger: always_on
---

# Marketiv Finance Development Workflow

## Development Philosophy

This project prioritizes:

- Maintainability
- Simplicity
- Rapid MVP Delivery
- Clear Separation of Concerns

Avoid overengineering.

Prefer extending the existing codebase rather than performing large-scale refactoring.

The current Figma Make generated project structure is considered the source of truth.

---

# Tech Stack

Frontend:

- React
- Vite
- TypeScript
- TailwindCSS v4

Backend:

- Supabase Auth
- Supabase Database
- Supabase Storage

---

# Existing Project Structure

Current structure should be preserved whenever possible.

Example:

src/

app/

components/

figma/

rab/

transactions/

users/

ui/

Do not reorganize existing folders unless there is a strong reason.

Avoid unnecessary architecture changes.

---

# Architecture Principle

When implementing new features:

Prefer:

Extend Existing Structure

instead of:

Refactor Existing Structure

---

# Allowed New Folders

The following folders may be added when needed:

src/

services/

types/

lib/

constants/

Do not introduce additional architectural layers unless necessary.

---

# Folder Responsibilities

## app

Responsible for:

- Application entry points
- Routing
- High-level page composition

---

## components

Responsible for:

- UI Components
- Feature Components
- Tables
- Cards
- Drawers
- Modals

Existing folders should continue to be used.

Examples:

components/rab

components/transactions

components/users

---

## services

Responsible for:

- Supabase Queries
- Database Operations
- Storage Operations

Examples:

transaction.service.ts

budget.service.ts

user.service.ts

attachment.service.ts

Business logic should be centralized here whenever possible.

---

## types

Responsible for:

- Interfaces
- Types
- Enums

Examples:

Transaction

BudgetItem

User

Attachment

ActivityLog

---

## constants

Responsible for:

- Static Values
- Labels
- Categories
- Configuration

Examples:

Budget Categories

Transaction Types

Role Definitions

---

## lib

Responsible for:

- Supabase Client
- Utility Functions
- Shared Helpers

Examples:

supabase.ts

formatCurrency.ts

formatDate.ts

---

# Data Access Rules

Never access Supabase directly inside page components.

Avoid:

Component
↓
Supabase

Prefer:

Component
↓
Service
↓
Supabase

---

# Business Logic Rules

Avoid placing business logic inside UI components.

Examples of business logic:

- Budget Status Calculation
- Used Amount Calculation
- Dashboard Metrics Calculation
- Realization Calculation
- Attachment Processing

These should be handled by services or utility functions.

---

# Form Handling

Use React Hook Form whenever forms are introduced.

Examples:

- Add Transaction
- Add Budget Item
- Add User
- Edit User

All forms should support:

- Validation
- Loading State
- Error Handling

---

# Loading States

Every async operation should provide user feedback.

Examples:

- Loading Spinner
- Loading Skeleton
- Disabled Submit Button

Never leave users without feedback.

---

# Error Handling

All Supabase operations must handle errors.

Use:

- Toast Notifications
- Error Messages
- Fallback UI

Avoid silent failures.

---

# Success Feedback

Every successful action should provide feedback.

Examples:

- Transaction Created
- Budget Item Updated
- Attachment Uploaded
- User Created

Use toast notifications consistently.

---

# File Upload Workflow

Use Supabase Storage.

Workflow:

Upload File
↓
Get File URL
↓
Store Metadata in Database

Never store file content directly in database tables.

---

# Attachment Workflow

Each attachment should contain:

- Transaction Reference
- File URL
- File Name
- File Type
- File Size
- Uploaded By
- Upload Date

---

# Table Design

Tables should support:

- Search
- Filtering
- Sorting

Examples:

- Transactions
- Budget Items
- Users

---

# State Management

Prefer:

- Local React State
- React Hooks

Avoid introducing:

- Redux
- Zustand
- MobX

unless a real scaling problem exists.

---

# Reusability Principles

Before creating a new component:

Check whether an existing component can be reused.

Examples:

- StatusBadge
- MetricCard
- DataTable
- ActivityTimeline
- AttachmentCard

Avoid duplicate UI implementations.

---

# Security Principles

Never rely solely on UI permissions.

Enforce permissions at:

- UI Layer
- Supabase RLS Layer

---

# Code Quality Principles

Prioritize:

- Readability
- Simplicity
- Consistency

Avoid:

- Deep nesting
- Large components
- Duplicate business logic
- Premature optimization

---

# Development Goal

The objective is to transform the approved Marketiv Finance UI into a fully functional application with Supabase integration.

Prioritize:

- Fast iteration
- Stable business logic
- Clean implementation

Do not perform unnecessary refactoring of generated UI code.
