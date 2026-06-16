---
trigger: always_on
---

# Marketiv Finance Auth Architecture

## Overview

Marketiv Finance is an internal financial management system.

It is not a public-facing application.

User access must be controlled and restricted.

---

# Authentication Provider

Use:

Supabase Auth

Authentication method:

- Email
- Password

Do not implement custom authentication systems.

---

# Registration Policy

Public registration is not allowed.

Do not create:

- Register Page
- Sign Up Page
- Public User Registration

All users must be created by an administrator.

---

# User Creation Workflow

User creation is handled through User Management.

Workflow:

Admin
↓
Create User
↓
Input Full Name
↓
Input Email
↓
Select Role
↓
Send Invitation

---

# Invitation Flow

When a user is created:

1. Supabase sends invitation email
2. User opens invitation link
3. User sets password
4. User logs in

---

# Password Ownership

Administrators must never:

- Create passwords for users
- View user passwords
- Store user passwords

Passwords belong to users only.

---

# Login Flow

Unauthenticated Users

↓

Redirect to:

/login

---

Authenticated Users

↓

Redirect to:

/dashboard

---

# Supported Pages

Public Pages:

- /login

Protected Pages:

- /dashboard
- /rab
- /transactions
- /reports
- /audit-trail
- /users

---

# Roles

Supported roles:

- admin
- member

No additional roles should be introduced unless there is a clear business requirement.

---

# Admin Permissions

Admin can:

- View Dashboard

- Create Transactions

- Edit Transactions

- Archive Transactions

- Create Budget Items

- Edit Budget Items

- Archive Budget Items

- Upload Attachments

- View Reports

- View Audit Trail

- Create Users

- Edit Users

- Disable Users

---

# Member Permissions

Member can:

- View Dashboard

- View Transactions

- View RAB

- View Reports

- View Audit Trail

- Preview Attachments

- Download Attachments

Member cannot modify financial data.

---

# Sidebar Visibility

Admin:

Display all menu items.

---

Member:

Hide:

- User Management

Member should not see functionality they cannot access.

---

# User Profile Table

Do not store role information only inside Supabase Auth.

Create a dedicated users table.

Relationship:

auth.users (1)
↓
users (1)

---

# Users Table Responsibilities

Store:

- Full Name
- Email
- Role
- Active Status

Do not store passwords.

Passwords remain managed by Supabase Auth.

---

# User Status

Supported statuses:

- Active
- Inactive

Represented by:

is_active

---

# Disable User Policy

Do not permanently delete users.

Use:

is_active = false

This preserves:

- Activity Logs
- Transaction History
- Audit Trail

---

# Session Management

Authenticated users should maintain active sessions.

Unauthenticated users must not access protected routes.

---

# Route Protection

All protected pages must verify:

1. User is authenticated
2. User is active
3. User has required permissions

Never rely solely on UI restrictions.

---

# Authorization Strategy

Authorization must be enforced at:

- Frontend Layer
- Supabase RLS Layer

---

# Activity Logging

The following actions must generate activity logs:

- User Created
- User Updated
- User Disabled
- Role Changed

Examples:

USER_CREATED

USER_UPDATED

USER_DISABLED

USER_ROLE_CHANGED

---

# Password Reset

Users should be able to reset their own passwords.

Use Supabase Password Reset workflow.

Do not build custom password reset systems.

---

# Security Principles

Prioritize:

- Least Privilege
- Auditability
- Traceability
- Simplicity

Avoid:

- Shared Accounts
- Public Registration
- Hardcoded Roles
- Password Storage

---

# MVP Goal

Provide a secure and simple authentication system suitable for:

- Marketiv Internal Team
- P2MW Financial Reporting
- Administrative Accountability

Keep authentication implementation simple and aligned with Supabase native capabilities.
