# Platform QA maintenance

- `qaMaintenance.candidates`, `adopt`, `preview`, `start`, and `run` are
  platform-admin-only tRPC operations.

# Billing

- `billing.getInfo` returns the active workspace plan and recent billing items.
- `billing.initializeCheckout` creates a protected Paystack checkout for the
  active workspace.
- `billing.confirmCheckout` verifies the provider reference, requires matching
  active-workspace metadata, activates the plan, syncs included template
  licenses, and records the paid billing item.
- `POST /api/webhooks/paystack` verifies Paystack signatures and processes
  subscription payment, activation, cancellation, and past-due events.

# Dashboard tenant state

- `GET /api/dashboard-tenants/state` accepts `hostname` or `slug` and returns
  the resolved tenant slug plus onboarding state for dashboard proxy/session
  host resolution.

# Overview

- `overview.summary` returns the active company's dashboard-home counts,
  domain state, published website-version state, and domain-provisioning
  capability.

# Website and templates

- `website.activeDraft`, `builder`, and `preview` own protected website reads.
- `website.createDraft`, `ensureConfiguration`, `publish`,
  `bootstrapAiContent`, `generatePageContent`, `smartFillField`,
  `updateContentField`, and `updateThemeField` own the tenant draft lifecycle.
- `website.renderData` is the public subdomain render-data contract.
- `templates.catalog`, `licenses`, `claimFree`, and `syncPlan` own template
  discovery and entitlement lifecycle.
- `stockImages.licenses` and `purchase` own tenant stock-image entitlements and
  purchase billing.

# Properties

- `properties.list` returns filtered, sorted, cursor-paginated listings for the
  active company.
- `properties.get` returns one active-company listing and its analytics.
- `properties.create`, `update`, `toggleFeatured`, `delete`, and `deleteMany`
  own the property lifecycle. Media operations remain under `propertyMedia`.

# Human resources

- `employees.list`, `stats`, `updateStatus`, `delete`, and `deleteMany` own the
  employee table lifecycle for the active company.
- `departments.list`, `create`, `delete`, and `deleteMany` own department
  table operations.
- `leaveRequests.list`, `stats`, `create`, `updateStatus`, and
  `updateManyStatus` own leave-request workflows.
- `payroll.list`, `summary`, `periods`, `create`, `markPaid`, and
  `markManyPaid` own payroll table and period workflows.

# Blog

- `blog.list`, `stats`, and `get` own the active-company blog table, summary,
  and editor reads.
- `blog.create`, `update`, `updateStatus`, `delete`, and `deleteMany` own the
  company-scoped post lifecycle.

# Estates

- `estates.list`, `get`, `create`, `update`, and `delete` own the
  active-company estate launch lifecycle.
- `estates.createLayout` owns tenant-validated estate layout version creation.
- `estates.listPlots`, `createPlot`, `updatePlot`, and `deletePlot` own the
  company-scoped estate plot lifecycle.

# Onboarding

- `onboarding.get`, `saveProgress`, `recommendations`, and `refreshProfile`
  own authenticated resumable onboarding and profile derivation.
- `onboarding.updateInputs` refreshes recommendations for an active member.
- `onboarding.complete` owns final tenant, domain, initial website, and
  template-license creation.

# Standalone Sandbox

- `POST /api/session` on the Sandbox host persists a host-scoped platform
  session token; `DELETE /api/session` clears it.
- `/api/trpc/[trpc]` in `apps/sandbox` mounts `SandboxAppRouter`, containing
  only `auth.signIn` and the `templateSandbox` namespace.
- `templateSandbox.list`, `get`, `getOrCreateDefault`, `catalog`, `create`,
  `update`, `updateContentField`, `updateThemeField`, `clone`, `archive`, and
  `generateLiveWebsite` require a platform administrator.
- `templateSandbox.preview` is public and read-only. It accepts `shareId`,
  `pathname`, and `mode: draft | live`, rejects archived/missing profiles and
  unsupported template paths, and returns normalized render data plus resolved
  page identity.
- Dashboard `/template-sandbox/*` and tenant-site `/sandbox/*` endpoints are
  compatibility redirects to the standalone Sandbox host.
