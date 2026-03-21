# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

Phase 2 features — all complete:

### Leave Management
- [x] Added leave-request.ts DB query module (CRUD + status counts)
- [x] Built /hr/leave page with submission form, approval/rejection/cancel workflow
- [x] Added server actions: createLeaveRequestAction, approveLeaveRequestAction, rejectLeaveRequestAction, cancelLeaveRequestAction
- [x] Added Leave link to sidebar with Plus badge

### Payroll
- [x] Added payroll.ts DB query module (CRUD + period summary + available periods)
- [x] Built /hr/payroll page with monthly records, period selector, mark paid flow
- [x] Added server actions: createPayrollEntryAction, markPayrollPaidAction
- [x] Added Payroll link to sidebar with Plus badge

### CSV Export UI
- [x] Created ExportCsvButton client component with download trigger
- [x] Added export buttons to Leads, Properties, Customers, Appointments, Employees pages

### Listing Analytics Card
- [x] Added per-property analytics card (7d/30d views, appointments) to /properties/[id]

### Agent Performance Analytics
- [x] Added getAgentPerformanceStats() query
- [x] Added agent performance section to analytics page (total/completed appointments per agent)

Next: Notification Dashboard UI, Form Standardization, or Custom Domain Purchase.
