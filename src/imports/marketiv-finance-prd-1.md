# Marketiv Finance Module

## Overview

Marketiv Finance Module is an internal financial management system developed for the Marketiv startup.

The primary purpose of this module is:

* Financial transparency
* P2MW funding management
* Budget planning and realization tracking
* Financial reporting
* Audit and accountability

The system is designed for startup operations while supporting P2MW reporting requirements.

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
* Manage attachments

---

## Member

Can:

* View dashboard
* View transactions
* View RAB
* View reports
* View audit trail
* Preview attachments
* Download attachments

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

## Purpose

Provide a quick overview of the financial condition of Marketiv.

## Main Components

### KPI Cards

Display:

* Total Funding
* Used Funds
* Remaining Funds
* Budget Utilization

---

### Budget Distribution

Visualization of budget allocation across categories.

Preferred Visualization:

* Donut Chart

Categories:

* Product Development & Research
* Production
* Company Legalization
* HR Certification
* Office Supplies & Support

---

### Recent Activity

Financial activity timeline.

Examples:

* Hosting purchase
* Domain purchase
* Legal registration payment
* Research equipment purchase

---

### Budget Alerts

Display warnings when budget usage reaches certain thresholds.

---

### Budget Progress Summary

Display budget progress for each category using progress bars.

---

# Transactions

## Purpose

Manage all financial transactions.

The Transactions page acts as the primary source of financial records within the system.

All Dashboard, RAB Realization, Reports, and Audit Trail data originate from Transactions.

---

## Transaction Types

### Income

Examples:

* P2MW Funding
* Sponsorship
* Revenue

---

### Expense

Examples:

* Hosting
* Domain
* Marketing
* Legal Fees
* Training
* Operational Costs

---

## Transaction Information

Each transaction contains:

* Date
* Description
* Category
* Amount
* Person In Charge (PIC)
* Status
* Notes
* Attachments

---

## Transaction Status

* Draft
* Completed
* Archived

---

## Transaction Detail View

Transaction details should be displayed inside a right-side drawer.

Display:

* Transaction Information
* Attachments
* Activity History

Preferred UI:

* Detail Drawer
* Timeline Components
* Attachment Cards

Avoid separate detail pages.

---

# Attachment Support

One transaction can contain multiple attachments.

Relationship:

Transaction (1)
└── Attachments (N)

---

## Supported Formats

* PDF
* JPG
* JPEG
* PNG
* WEBP

---

## Attachment Categories

Examples:

* Invoice
* Receipt
* Transfer Proof
* Contract
* Supporting Document
* Other

---

## Administrator Permissions

Can:

* Upload attachments
* Replace attachments
* Delete attachments
* Preview attachments
* Download attachments

---

## Member Permissions

Can:

* Preview attachments
* Download attachments

Cannot:

* Upload attachments
* Replace attachments
* Delete attachments

---

## Attachment Display

Attachments should be displayed inside the Transaction Detail Drawer.

Each attachment should show:

* File Name
* File Type
* Attachment Category
* File Size
* Upload Date
* Uploaded By

---

## Preview Support

### Image Files

* JPG
* JPEG
* PNG
* WEBP

Support in-app image preview.

---

### PDF Files

Support embedded PDF preview.

---

## Download Support

All supported file types can be downloaded.

---

## Purpose

Attachments serve as financial evidence and supporting documentation for:

* P2MW Reporting
* Internal Transparency
* Financial Accountability
* Audit Verification

---

# Activity History

Each transaction should contain a complete activity timeline.

Examples:

* Transaction Created
* Transaction Updated
* Attachment Uploaded
* Attachment Replaced
* Attachment Deleted
* Notes Updated
* Transaction Archived

Each history item should display:

* Date
* Time
* User
* Action

Preferred Visualization:

Timeline Component

---

# RAB

## Purpose

Budget planning and budget realization management.

The RAB page is one of the core modules of the system.

---

## RAB Tabs

### Summary

Display:

* Budget per category
* Realization per category
* Remaining budget
* Progress percentage

Preferred Components:

* Summary Cards
* Progress Bars
* Financial Charts

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
* Status
* Used Amount
* Justification

---

### RAB Status

* Planned
* In Progress
* Completed

---

### Realization

Comparison between planned budget and actual spending.

Columns:

* Category
* Budget
* Realization
* Remaining
* Progress

Preferred Visualization:

* Comparison Charts
* Progress Bars

---

# Budget Categories

The system contains five primary budget categories.

---

## Product Development & Research

Examples:

* Application Development
* AI Development
* Research Activities
* Hosting
* Domain
* Cloud Infrastructure

---

## Production

Examples:

* Content Production
* Marketing Materials
* Promotional Activities
* Campaign Production

---

## Company Legalization

Examples:

* Business Permits
* Company Registration
* Legal Consultation

---

## HR Certification

Examples:

* Professional Certifications
* Training Programs
* Workshops

---

## Office Supplies & Support

Examples:

* Stationery
* Printing
* Administrative Expenses
* Operational Support

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

## Purpose

Generate financial reports.

---

## Export Formats

* PDF
* Excel

---

## Report Types

* Transaction Report
* Budget Report
* Realization Report
* Monthly Report

---

# Audit Trail

## Purpose

Track all modifications performed inside the system.

Every action should be recorded.

---

## Examples

* Transaction Created
* Transaction Updated
* Transaction Deleted
* Attachment Uploaded
* Attachment Deleted
* RAB Updated
* User Created
* User Role Changed

---

## Audit Log Information

* Date
* Time
* User
* Action
* Previous Value
* New Value

---

## Preferred Visualization

Timeline-Based Activity Feed

Avoid spreadsheet-style audit logs whenever possible.

---

# User Management

Administrator Only.

---

## Features

* Create User
* Edit User
* Delete User
* Assign Role
* Manage Access

---

## Roles

### Admin

Full Access

### Member

Read-Only Access

---

# UX Principles

The system should prioritize:

* Transparency
* Accountability
* Simplicity
* Financial Clarity

---

## Use

* Cards
* Charts
* Progress Bars
* Timelines
* Drawers
* Visual Summaries

---

## Avoid

* ERP Complexity
* Spreadsheet-Heavy Interfaces
* Dense Layouts
* Traditional Accounting Software Appearance

The interface should feel like a premium startup SaaS product that is consistent with the Marketiv Studio Design System.