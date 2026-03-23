-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('draft', 'active', 'paused', 'delayed', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "project_type" AS ENUM ('building', 'estate', 'fit_out', 'infrastructure', 'renovation');

-- CreateEnum
CREATE TYPE "project_phase_status" AS ENUM ('not_started', 'in_progress', 'completed', 'on_hold');

-- CreateEnum
CREATE TYPE "project_milestone_status" AS ENUM ('pending', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "project_document_kind" AS ENUM ('drawing', 'contract', 'permit', 'invoice', 'receipt', 'site_report', 'inspection', 'handover', 'other');

-- CreateEnum
CREATE TYPE "project_document_visibility" AS ENUM ('internal', 'shared');

-- CreateEnum
CREATE TYPE "project_update_kind" AS ENUM ('daily', 'weekly', 'milestone', 'general');

-- CreateEnum
CREATE TYPE "project_issue_severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "project_issue_status" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "project_role" AS ENUM ('project_owner', 'project_manager', 'qs_manager', 'finance_reviewer', 'site_supervisor', 'viewer');

-- CreateEnum
CREATE TYPE "project_assignment_status" AS ENUM ('active', 'removed');

-- CreateEnum
CREATE TYPE "project_worker_pay_basis" AS ENUM ('daily', 'weekly', 'monthly', 'fixed_contract', 'milestone_based');

-- CreateEnum
CREATE TYPE "project_worker_status" AS ENUM ('active', 'inactive', 'terminated');

-- CreateEnum
CREATE TYPE "project_payroll_run_status" AS ENUM ('draft', 'finalized', 'paid');

-- CreateEnum
CREATE TYPE "project_payroll_entry_payment_status" AS ENUM ('pending', 'paid', 'on_hold');

-- CreateEnum
CREATE TYPE "project_budget_line_category" AS ENUM ('preliminaries', 'substructure', 'superstructure', 'mep', 'finishing', 'external_works', 'contingency', 'professional_fees', 'other');

-- CreateEnum
CREATE TYPE "project_customer_access_level" AS ENUM ('overview', 'detailed');

-- CreateTable
CREATE TABLE "project_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "membership_id" UUID NOT NULL,
    "project_role" "project_role" NOT NULL DEFAULT 'viewer',
    "status" "project_assignment_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_budgets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "approved_budget_minor" INTEGER NOT NULL DEFAULT 0,
    "forecast_budget_minor" INTEGER NOT NULL DEFAULT 0,
    "actual_budget_minor" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_budget_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "budget_id" UUID NOT NULL,
    "category" "project_budget_line_category" NOT NULL DEFAULT 'other',
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "unit_rate_minor" INTEGER,
    "estimated_minor" INTEGER NOT NULL DEFAULT 0,
    "actual_minor" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_budget_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_customer_access" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "level" "project_customer_access_level" NOT NULL DEFAULT 'overview',
    "enabled_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_customer_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_customer_notices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "posted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_customer_notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "kind" "project_document_kind" NOT NULL DEFAULT 'other',
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "visibility" "project_document_visibility" NOT NULL DEFAULT 'internal',
    "version_label" TEXT,
    "uploaded_by_id" TEXT,
    "approved_by_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_issues" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" "project_issue_severity" NOT NULL DEFAULT 'medium',
    "status" "project_issue_status" NOT NULL DEFAULT 'open',
    "owner_id" TEXT,
    "opened_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_milestones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "phase_id" UUID,
    "name" TEXT NOT NULL,
    "status" "project_milestone_status" NOT NULL DEFAULT 'pending',
    "due_date" DATE,
    "completed_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "customer_visible" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_payroll_runs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "status" "project_payroll_run_status" NOT NULL DEFAULT 'draft',
    "total_gross_minor" INTEGER NOT NULL DEFAULT 0,
    "total_net_minor" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_payroll_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payroll_run_id" UUID NOT NULL,
    "worker_id" UUID NOT NULL,
    "attendance_units" DOUBLE PRECISION,
    "gross_minor" INTEGER NOT NULL DEFAULT 0,
    "deduction_minor" INTEGER NOT NULL DEFAULT 0,
    "advance_minor" INTEGER NOT NULL DEFAULT 0,
    "net_minor" INTEGER NOT NULL DEFAULT 0,
    "payment_status" "project_payroll_entry_payment_status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_payroll_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_phases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "project_phase_status" NOT NULL DEFAULT 'not_started',
    "start_date" DATE,
    "end_date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_updates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "author_id" TEXT,
    "kind" "project_update_kind" NOT NULL DEFAULT 'general',
    "summary" TEXT NOT NULL,
    "details" TEXT,
    "progress_percent" INTEGER,
    "customer_visible" BOOLEAN NOT NULL DEFAULT false,
    "posted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_workers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "employee_id" UUID,
    "full_name" TEXT NOT NULL,
    "role" TEXT,
    "pay_basis" "project_worker_pay_basis" NOT NULL DEFAULT 'daily',
    "pay_rate_minor" INTEGER NOT NULL DEFAULT 0,
    "status" "project_worker_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" "project_type",
    "location" TEXT,
    "status" "project_status" NOT NULL DEFAULT 'draft',
    "start_date" DATE,
    "target_completion_date" DATE,
    "completed_at" TIMESTAMPTZ(6),
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_assignments_project_id_idx" ON "project_assignments"("project_id");

-- CreateIndex
CREATE INDEX "project_assignments_membership_id_idx" ON "project_assignments"("membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_assignments_project_membership_uniq" ON "project_assignments"("project_id", "membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_budgets_project_id_key" ON "project_budgets"("project_id");

-- CreateIndex
CREATE INDEX "project_budgets_project_id_idx" ON "project_budgets"("project_id");

-- CreateIndex
CREATE INDEX "project_budget_line_items_budget_id_idx" ON "project_budget_line_items"("budget_id");

-- CreateIndex
CREATE INDEX "project_customer_access_project_id_idx" ON "project_customer_access"("project_id");

-- CreateIndex
CREATE INDEX "project_customer_access_customer_id_idx" ON "project_customer_access"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_customer_access_project_customer_uniq" ON "project_customer_access"("project_id", "customer_id");

-- CreateIndex
CREATE INDEX "project_customer_notices_project_id_idx" ON "project_customer_notices"("project_id");

-- CreateIndex
CREATE INDEX "project_customer_notices_customer_id_idx" ON "project_customer_notices"("customer_id");

-- CreateIndex
CREATE INDEX "project_customer_notices_project_posted_idx" ON "project_customer_notices"("project_id", "posted_at");

-- CreateIndex
CREATE INDEX "project_documents_project_id_idx" ON "project_documents"("project_id");

-- CreateIndex
CREATE INDEX "project_documents_project_kind_idx" ON "project_documents"("project_id", "kind");

-- CreateIndex
CREATE INDEX "project_issues_project_id_idx" ON "project_issues"("project_id");

-- CreateIndex
CREATE INDEX "project_issues_project_status_idx" ON "project_issues"("project_id", "status");

-- CreateIndex
CREATE INDEX "project_milestones_project_id_idx" ON "project_milestones"("project_id");

-- CreateIndex
CREATE INDEX "project_milestones_project_status_idx" ON "project_milestones"("project_id", "status");

-- CreateIndex
CREATE INDEX "project_payroll_runs_project_id_idx" ON "project_payroll_runs"("project_id");

-- CreateIndex
CREATE INDEX "project_payroll_runs_project_status_idx" ON "project_payroll_runs"("project_id", "status");

-- CreateIndex
CREATE INDEX "project_payroll_entries_run_id_idx" ON "project_payroll_entries"("payroll_run_id");

-- CreateIndex
CREATE INDEX "project_payroll_entries_worker_id_idx" ON "project_payroll_entries"("worker_id");

-- CreateIndex
CREATE INDEX "project_phases_project_id_idx" ON "project_phases"("project_id");

-- CreateIndex
CREATE INDEX "project_phases_project_order_idx" ON "project_phases"("project_id", "order");

-- CreateIndex
CREATE INDEX "project_updates_project_id_idx" ON "project_updates"("project_id");

-- CreateIndex
CREATE INDEX "project_updates_project_posted_idx" ON "project_updates"("project_id", "posted_at");

-- CreateIndex
CREATE INDEX "project_workers_project_id_idx" ON "project_workers"("project_id");

-- CreateIndex
CREATE INDEX "project_workers_project_status_idx" ON "project_workers"("project_id", "status");

-- CreateIndex
CREATE INDEX "projects_company_id_idx" ON "projects"("company_id");

-- CreateIndex
CREATE INDEX "projects_company_status_idx" ON "projects"("company_id", "status");

-- CreateIndex
CREATE INDEX "projects_deleted_at_idx" ON "projects"("deleted_at");

-- AddForeignKey
ALTER TABLE "project_assignments" ADD CONSTRAINT "project_assignments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignments" ADD CONSTRAINT "project_assignments_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_budgets" ADD CONSTRAINT "project_budgets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_budget_line_items" ADD CONSTRAINT "project_budget_line_items_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "project_budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_customer_access" ADD CONSTRAINT "project_customer_access_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_customer_access" ADD CONSTRAINT "project_customer_access_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_customer_notices" ADD CONSTRAINT "project_customer_notices_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_customer_notices" ADD CONSTRAINT "project_customer_notices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_issues" ADD CONSTRAINT "project_issues_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "project_phases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_payroll_runs" ADD CONSTRAINT "project_payroll_runs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_payroll_entries" ADD CONSTRAINT "project_payroll_entries_payroll_run_id_fkey" FOREIGN KEY ("payroll_run_id") REFERENCES "project_payroll_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_payroll_entries" ADD CONSTRAINT "project_payroll_entries_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "project_workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_phases" ADD CONSTRAINT "project_phases_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_workers" ADD CONSTRAINT "project_workers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_workers" ADD CONSTRAINT "project_workers_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
