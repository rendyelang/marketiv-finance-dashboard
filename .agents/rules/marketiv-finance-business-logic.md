---
trigger: always_on
---

# Marketiv Finance Business Logic

## Core Principle

The financial system is designed around budgeting, realization tracking, transparency, and accountability.

The system is not an ERP, procurement system, or enterprise accounting platform.

Keep workflows simple and suitable for startup operations and P2MW reporting.

---

# Source of Truth

## Detailed RAB

Detailed RAB is the primary source of truth for budgeting.

All budget calculations originate from Detailed RAB items.

Dashboard metrics, realization tracking, and budget summaries must be derived from Detailed RAB and Transactions.

---

# Budget Structure

The system contains five budget categories:

- Product Development & Research
- Production
- Company Legalization
- HR Certification
- Office Supplies & Support

Each category contains multiple budget items.

Examples:

Category:
Product Development & Research

Items:

- Domain
- Hosting
- Cloud Infrastructure
- AI Development

---

# Budget Item Lifecycle

Each budget item contains:

- Budget Amount
- Used Amount
- Status

Status must be calculated automatically.

Never allow manual status editing.

Budget Items may be edited even after transactions exist.

All budget changes must generate:

- Activity History
- Audit Trail

Budget status must always be recalculated automatically.

---

# Budget Item Status Rules

If:

Used Amount = 0

Status:

Planned

---

If:

Used Amount > 0

AND

Used Amount < Budget Amount

Status:

In Progress

---

If:

Used Amount >= Budget Amount

Status:

Completed

---

# Transaction Rules

Every expense transaction must be linked to a specific Detailed RAB item.

This relationship is mandatory.

Do not allow expense transactions without a Related Budget Item.

---

Relationship:

Budget Category
↓
Budget Item
↓
Transaction

---

# Transaction Creation Flow

When a user creates an expense transaction:

1. Select Budget Category
2. Select Related Budget Item
3. Enter Amount
4. Upload Supporting Documents
5. Save Transaction

---

# Transaction Effects

When an expense transaction is created:

1. Update Used Amount of the related Budget Item
2. Recalculate Budget Item Status
3. Update Realization Metrics
4. Update Dashboard Metrics
5. Create Activity History entry
6. Create Audit Trail entry

---

# Income Transactions

Income transactions are not linked to Detailed RAB items.

Examples:

- P2MW Funding
- Sponsorship
- Revenue

Income transactions affect:

- Total Funding
- Dashboard Metrics

Only

---

# Attachment Rules

Every expense transaction should contain supporting evidence.

Supported formats:

- PDF
- JPG
- JPEG
- PNG
- WEBP

---

One transaction can contain multiple attachments.

Relationship:

Transaction (1)
↓
Attachments (N)

---

# Attachment Categories

Examples:

- Invoice
- Receipt
- Transfer Proof
- Contract
- Supporting Document
- Other

---

# Activity History

The system does not use approval workflows.

Do not implement:

- Pending Approval
- Approved
- Rejected

---

Instead use Activity History.

Examples:

- Transaction Created
- Transaction Updated
- Attachment Uploaded
- Attachment Deleted
- Budget Item Updated
- Transaction Archived

---

Activity History belongs to a specific entity.

Examples:

Transaction Activity History

Budget Item Activity History

---

# Audit Trail

Audit Trail is system-wide.

Activity History is entity-specific.

Do not confuse the two.

---

Examples:

Transaction Drawer

Displays:

Activity History

---

Audit Trail Page

Displays:

System-Wide Activity Feed

---

# Dashboard Rules

Dashboard data must never be manually entered.

Dashboard metrics are always calculated.

Examples:

Total Funding

= Sum of Income Transactions

---

Used Funds

= Sum of Expense Transactions

---

Remaining Funds

= Total Funding - Used Funds

---

Budget Utilization

= Total Expense / Total Budget

---

# Realization Rules

Realization is always derived from transactions.

Never allow manual realization editing.

---

Budget Item

Budget:
Rp500.000

Used:
Rp300.000

Remaining:
Rp200.000

Progress:
60%

All values must be calculated automatically.

---

# User Roles

Admin

Can:

- Create Transactions
- Edit Transactions
- Delete Transactions
- Manage RAB
- Manage Users
- Upload Attachments

---

Member

Read-only access.

Can:

- View Dashboard
- View Transactions
- View RAB
- View Reports
- Preview Attachments
- Download Attachments

Cannot modify data.

---

# Development Principles

Always prioritize:

- Financial Transparency
- Accountability
- Data Consistency
- Traceability

Avoid:

- Manual calculations
- Duplicate data entry
- Approval workflows
- Overengineered financial processes
