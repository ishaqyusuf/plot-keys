# Dashboard Midday Conformance Audit

## Scope

Source audit of every Plot Keys dashboard route and its applicable Midday
architecture contract. Runtime and visual proof remain part of final browser
QA.

Canonical references:

- Midday dashboard route, table, sheet, settings, apps, reports, login, and
  onboarding implementations under
  `/Users/M1PRO/Documents/code/_kitchen_sink/midday/apps/dashboard/src`
- `/Users/M1PRO/Documents/code/skills/midday/references/feature-flow.md`
- `/Users/M1PRO/Documents/code/skills/midday/references/dashboard-tables.md`
- `/Users/M1PRO/Documents/code/skills/midday/references/state-and-routing.md`
- `/Users/M1PRO/Documents/code/skills/midday/references/package-boundaries.md`

Status meanings:

- **Source conformant**: route and supporting modules match the applicable
  Midday ownership pattern.
- **Patched**: a confirmed mismatch was fixed during this audit.
- **Adapter**: intentionally thin redirect/provider bridge with no feature UI.
- **F6 complete**: the mismatch was patched and focused verification passes.

## Shared Architecture

| Surface | Evidence | Status |
| --- | --- | --- |
| App shell | Authenticated layout owns sidebar/header, tenant URL context, notification hydration, shifted content column, and global sheet provider. Builder stays full bleed. | Source conformant |
| Table runtime | `components/tables/core` owns DnD, sticky columns, resizing, virtualization, infinite loading, horizontal scroll, selection, and bottom-bar composition. | Source conformant |
| Table feature folders | Agents, appointments, blog, customers, departments, employees, leads, leave requests, notifications, payroll, projects, properties, and teams have columns, data table, header, skeleton, and domain empty/no-results states. | Source conformant |
| URL state | Table filters/sort and navigable details/create/edit sheets use paired `load*Params` / `use*Params` hooks and `nuqs`. | Source conformant |
| Sheets | Dynamically loaded global provider registers domain create/edit/details sheets; forms and URL hooks own mutations and close/reset behavior. | Source conformant |
| Settings | Secondary-menu layout owns constrained width and section spacing; child pages remain compositional. | Source conformant |
| Runtime DB boundary | Dashboard has no runtime `@plotkeys/db` imports; the remaining live-preview import is type-only. | Source conformant |
| Domain API ownership | AI Credits, analytics, apps, reports, integrations, domains, overview, agents, appointments, leads, properties, employees, departments, leave requests, payroll, blog, estates/plots, onboarding, website, templates, stock images, customers, projects, team/settings, notifications, billing, QA maintenance, filters, and property media have dedicated routers. The generic `workspace` namespace has been removed. | Source conformant |

## Authenticated Routes

| Routes | Closest Midday pattern | Status / follow-up |
| --- | --- | --- |
| `/` | Overview widgets | Source conformant with exact Midday `overview.summary` ownership |
| `/agents` | Customers/invoices table workspace | Source conformant with dedicated list, detail, create, update, featured, single-delete, and bulk-delete ownership |
| `/appointments` | Invoices table workspace | Source conformant with dedicated list, stats, create, status, single-delete, and bulk-delete ownership |
| `/customers` | Customers | Source conformant with dedicated router |
| `/leads` | Transactions/invoices table workspace | Source conformant with dedicated list, stats, single/bulk status, and customer-conversion ownership |
| `/properties`, `/properties/[id]` | Invoices table plus URL-backed detail sheet | Source conformant with dedicated list, detail/analytics, create, update, featured, single-delete, and bulk-delete ownership; `[id]` is an intentional deep-link adapter |
| `/projects`, `/projects/[id]`, `/projects/[id]/budget`, `/projects/[id]/workforce` | Table workspace plus compositional detail subpages | Source conformant with dedicated projects router |
| `/blog`, `/blog/[id]` | Invoices table plus editor detail route | Source conformant with dedicated list, stats, detail, create, update, status, single-delete, and bulk-delete ownership |
| `/hr/departments`, `/hr/employees`, `/hr/leave`, `/hr/payroll` | Customers/invoices table workspaces | Source conformant with dedicated department, employee, leave-request, and payroll list/stat/mutation ownership |
| `/notifications` | Invoices-style table workspace | Source conformant with dedicated notifications router |
| `/team` | Customers/members table workspace | Source conformant with dedicated team router |
| `/estates`, `/estates/[slug]` | List workspace plus compositional details | Source conformant with dedicated estate list/detail/create/update/delete, layout, and plot lifecycle ownership |
| `/analytics` | Reports/metrics | Source conformant with dedicated `analytics.get` router ownership |
| `/reports` | Reports/metrics with URL period state | Source conformant with dedicated `reports.get` router ownership and report schema |
| `/ai-credits` | Billing/usage settings | Source conformant with dedicated `aiCredits.get` / `aiCredits.purchase` router ownership |
| `/billing`, `/billing/callback` | Billing plus protected provider callback | Source conformant with dedicated billing router; callback is a typed API adapter |
| `/app-store` | Apps | Source conformant with dedicated `apps.get` / `apps.setEnabled` router ownership |
| `/domains`, `/domains/connect` | Apps/settings connection flow | Source conformant with dedicated domain status, DNS, search, connect, sync, and removal ownership |
| `/integrations` | Apps/settings integrations | Source conformant with dedicated `integrations.get` / `integrations.update` router ownership |
| `/live` | Server query-backed preview surface | Source conformant with dedicated `website.preview` ownership |
| `/builder/preview` | Full-bleed tool preview | Source conformant |
| `/platform/qa-maintenance` | Protected developer/maintenance surface | Patched: metadata, platform-admin route guard, prefetch, hydration, error boundary, Suspense, header, and skeleton added |

## Settings Routes

| Routes | Closest Midday pattern | Status / follow-up |
| --- | --- | --- |
| `/settings` | Team settings sections | Source conformant with Midday-style `team.current` / `team.update` ownership |
| `/settings/notifications` | Notification settings list | Source conformant with dedicated notifications router |
| `/settings/integrations` | Connection settings list | Source conformant with dedicated integrations router ownership |

## Builder And Public Flow Routes

| Routes | Closest Midday pattern | Status / follow-up |
| --- | --- | --- |
| `/builder` | Full-bleed product tool | Source conformant with dedicated `website.*` and `templates.catalog` ownership |
| `/onboarding` | Thin server route plus onboarding feature component | Patched: route reduced to metadata and feature composition |
| Onboarding step forms | Midday `components/onboarding/steps/*` | Patched: five feature step modules share explicit navigation/save contracts |
| `/sign-in` | Midday public login route | Source conformant; tenant-aware server composition is domain-required |
| `/sign-up` | Public account creation flow | Source conformant |
| `/verify-email` | Public verification handoff | Source conformant |
| `/join/[token]` | Public invite acceptance flow | Source conformant |
| `/join/[token]/complete` | Authenticated invite profile completion | Source conformant |

## Adapter Routes

| Routes | Reason | Status |
| --- | --- | --- |
| `/template-sandbox` | Redirects authoring to the dedicated sandbox app | Adapter |
| `/template-sandbox/profiles` | Redirects authoring to the dedicated sandbox app | Adapter |
| `/template-sandbox/[profileId]` | Preserves profile/page/path while redirecting to sandbox | Adapter |
| `/api/webhooks/paystack` | Preserves the existing provider URL while executing the API-owned REST handler | Adapter |

## Completed F6 Work

1. Replaced every dashboard `trpc.workspace.*` feature contract with
   dedicated Website and Templates routers and domain-owned API schemas.
2. Updated every server caller, client query/mutation, and exact cache key
   alongside the domain move.
3. Removed the generic Workspace router; preserved dormant entitlement
   behavior under Templates and Stock Images, and removed the unsafe manual
   plan-change mutation in favor of provider-verified Billing ownership.
4. Re-ran the focused matrix; authenticated browser QA remains in F7 to
   prove responsive layout, filters, tables, sheets, modals, settings,
   full-bleed tools, auth flows, and provider callbacks.

## Current Evidence

- Full route inventory and source-pattern matrix completed.
- Shared table and sheet ownership compared directly with Midday customers,
  invoices, apps, settings, reports, login, and onboarding references.
- QA maintenance focused DB test passes.
- Onboarding/quick-fill and invite-scope focused tests pass.
- Onboarding owns five Midday-style step modules plus a shared step contract;
  the former 874-line multi-step form bundle has been removed.
- App Store state and mutations now use the dedicated `apps` router with
  router-level membership, role, plan-gate, tenant-scope, and write coverage.
- Reports and Analytics now use dedicated `reports.get` and `analytics.get`
  routers with report-period validation and tenant-scoped aggregate coverage.
- AI Credits now uses dedicated `aiCredits.get` and `aiCredits.purchase`
  procedures with tenant-scoped read and top-up ledger coverage.
- Integrations now uses dedicated `integrations.get` and
  `integrations.update` procedures with member-read, admin-write, and
  tenant-scoped upsert coverage.
- Domains now uses dedicated status, DNS-instruction, search, connect, sync,
  and removal procedures with hostname normalization, paired-domain creation,
  tenant scoping, and provisioning-guard coverage.
- Workspace settings now follows Midday's `team.current` / `team.update`
  contract, combining profile and logo updates behind the existing admin gate.
- Appointments now uses a dedicated table-domain router and domain schema;
  update and delete helpers require both appointment id and active company id.
- Leads now uses a dedicated table-domain router and domain schema; unsafe
  id-only status writes were replaced by company-qualified single, bulk, and
  conversion updates.
- Agents now uses a dedicated table/detail router and domain schema with
  company-qualified create, update, feature, single-delete, and bulk-delete
  outcomes.
- Properties now uses a dedicated table/detail router and domain schema with
  company-qualified list, analytics, create, update, feature, single-delete,
  and bulk-delete outcomes. Estate-linked writes validate the estate against
  the active company before mutation.
- Employees, Departments, Leave Requests, and Payroll now use dedicated
  routers and domain schemas. Their lists, stats, period summaries, creates,
  status/paid transitions, single actions, and bulk actions derive company
  scope from membership; employee-linked leave/payroll creates validate the
  employee against the active company.
- Employee, department, and payroll writes now return explicit
  company-scoped outcomes instead of raw Prisma not-found behavior.
- Blog now uses a dedicated table/editor router and domain schema for list,
  stats, detail, create, update, status, single-delete, and bulk-delete
  operations. Slug uniqueness and every write are company scoped, write
  failures return explicit not-found outcomes, and table bulk deletion uses
  one deduplicated API operation instead of sequential client mutations.
- Estates now uses one dedicated aggregate router and domain schema for launch
  list/detail/create/update/delete, layout version creation, and plot
  list/create/update/delete operations. Estate and plot writes use active
  company predicates with explicit not-found outcomes, plot creation validates
  the estate tenant, and update slug resolution excludes the current estate.
- Onboarding now uses a dedicated authenticated lifecycle router and domain
  schema for safe state reads, resumable progress, template recommendations,
  profile refresh/editing, and final tenant completion. Completion preserves
  the company/membership/domain/site/version/license transaction, safe starter
  template gate, signup notification, and optional domain-sync trigger.
- Dashboard Overview now follows Midday's exact `overview.summary` ownership.
  The membership-derived query returns company-scoped counts, domain state,
  published-version state, and server-derived domain-provisioning capability.
- Website builder, live preview, draft lifecycle, content/theme editing, AI
  generation, publish, and public render contracts now use the dedicated
  `website` router. Template catalog and entitlement lifecycle use
  `templates`; stock-image licenses and purchases use `stockImages`.
- The manual `workspace.changePlan` mutation was removed. Subscription changes
  remain provider-verified through Billing/webhooks and the plan-sync job.
- The combined focused F6 suite passes 126 tests with 334 assertions across 25
  files.
- Dashboard and API scans have zero `trpc.workspace.*`, `caller.workspace`,
  `workspaceRouter`, `workspace.route`, or `workspace.schema` residue.
- Scoped `git diff --check` passes for the current F6 patches.
- Browser and package typecheck proof remain intentionally pending for F7
  under the active fast Bun command discipline.
