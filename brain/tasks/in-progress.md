# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### Construction Project Management — Phase 2 (Finance and Workforce)
- [x] Added Phase 2 Prisma enums: ProjectWorkerPayBasis, ProjectWorkerStatus, ProjectPayrollRunStatus, ProjectWorkerPaymentStatus
- [x] Added Phase 2 Prisma models: ProjectBudget, ProjectBudgetLineItem, ProjectWorker, ProjectPayrollRun, ProjectPayrollEntry
- [x] Updated Project model with relations to budget, workers, and payrollRuns
- [x] Extended project.ts query module: budget CRUD, worker CRUD, payroll run CRUD, payroll entry upsert/delete
- [x] Extended projects tRPC router: getBudget, updateBudget, addBudgetLineItem, updateBudgetLineItem, deleteBudgetLineItem, listWorkers, addWorker, updateWorker, removeWorker, listPayrollRuns, getPayrollRun, createPayrollRun, updatePayrollRun, deletePayrollRun, upsertPayrollEntry, deletePayrollEntry
- [x] Created project-budget.tsx client components: BudgetSummaryCard, BudgetLineItemList, AddBudgetLineItemForm
- [x] Created project-workforce.tsx client components: WorkerList, AddWorkerForm, PayrollRunList, CreatePayrollRunForm
- [x] Created /projects/[id]/budget page
- [x] Created /projects/[id]/workforce page
- [x] Updated project detail page with Budget and Workforce navigation links

Next: Run migration (`prisma migrate dev`), then continue with Phase 3 (Customer Visibility) or Phase 4 (AI and Integrations).
