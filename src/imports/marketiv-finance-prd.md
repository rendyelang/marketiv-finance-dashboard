# Marketiv Finance Module

## Overview

Marketiv Finance Module is an internal financial management system developed for the Marketiv startup.

The primary purpose of this module is:

* Financial transparency
* P2MW funding management
* Budget planning and realization tracking
* Financial reporting
* Audit and accountability

The system will be used by startup team members and administrators.

---

# User Roles

## Administrator

Highest access level.

Can:

* Create transactions
* Edit transactions
* Delete transactions
* Manage RAB
* Manage users
* Configure system settings
* Export reports
* Access audit trail

---

## Member

Can:

* View dashboard
* View transactions
* View RAB
* View reports
* View audit trail

Cannot modify financial data.

---

# Navigation Structure

Dashboard

Transactions

RAB

Reports

Audit Trail

User Management

---

# Dashboard

Purpose:

Provide a quick overview of the financial condition of Marketiv.

Main Components:

## KPI Cards

* Total Funding
* Used Funds
* Remaining Funds
* Budget Utilization

## Budget Distribution

Visualization of budget allocation across categories.

Preferred visualization:

* Donut Chart

## Recent Activity

Financial activity timeline.

Examples:

* Hosting purchase
* Domain purchase
* Legal registration payment
* Research equipment purchase

## Budget Alerts

Display warnings when budget usage reaches certain thresholds.

## Budget Progress Summary

Display budget progress for each category using progress bars.

---

# Transactions

Purpose:

Manage all financial transactions.

Includes:

* Income
* Expenses

Each transaction contains:

* Date
* Description
* Category
* Amount
* Person In Charge (PIC)
* Status
* Notes
* Receipt Attachment

Status:

* Pending
* Approved
* Rejected

Receipt Attachment:

* Image
* PDF
* Invoice
* Transfer Proof

Transaction Detail View:

Display complete transaction information inside a side drawer.

---

# RAB

Purpose:

Budget planning and budget realization management.

The RAB page is the most important page in the system.

---

## RAB Tabs

### Summary

High-level overview of budget usage.

Display:

* Budget per category
* Realization per category
* Remaining budget
* Progress percentage

Use cards and progress bars.

---

### Detailed RAB

Detailed budget planning table.

Columns:

* Main Activity
* Activity
* Item Type
* Quantity
* Unit Price
* Total Amount
* Target Output
* Responsible Person
* Approval Status
* Used Amount
* Justification

---

### Realization

Comparison between planned budget and actual spending.

Columns:

* Category
* Budget
* Realization
* Remaining
* Progress

---

# Budget Categories

The system contains five primary budget categories.

## Product Development & Research

Examples:

* Application development
* AI development
* Research activities
* Hosting
* Domain
* Cloud infrastructure

---

## Production

Examples:

* Content production
* Marketing materials
* Promotional activities
* Campaign production

---

## Company Legalization

Examples:

* Business permits
* Company registration
* Legal consultation

---

## HR Certification

Examples:

* Professional certifications
* Training programs
* Workshops

---

## Office Supplies & Support

Examples:

* Stationery
* Printing
* Administrative expenses
* Supporting operational costs

---

# RAB Calculation Rules

Each budget category must display:

* Category Subtotal

The page must also display:

* Grand Total

Category subtotal appears directly below each category group.

Grand total appears at the bottom of the page.

---

# Reports

Purpose:

Generate financial reports.

Export Formats:

* PDF
* Excel

Report Types:

* Transaction Report
* Budget Report
* Realization Report
* Monthly Report

---

# Audit Trail

Purpose:

Track all modifications performed inside the system.

Every action should be recorded.

Examples:

* Transaction created
* Transaction updated
* Transaction deleted
* RAB updated
* User created
* User role changed

Audit Log Information:

* Date
* Time
* User
* Action
* Previous Value
* New Value

Preferred Visualization:

Timeline-based activity feed.

---

# User Management

Administrator Only.

Features:

* Create User
* Edit User
* Delete User
* Assign Role
* Manage Access

Roles:

* Admin
* Member

---

# UX Principles

The system should prioritize:

* Transparency
* Accountability
* Simplicity
* Financial clarity

Avoid:

* ERP complexity
* Spreadsheet-heavy interfaces
* Dense layouts

Use:

* Cards
* Charts
* Progress bars
* Timelines

The interface should feel like a premium startup SaaS product rather than traditional accounting software.