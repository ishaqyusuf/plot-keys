# Progress

## 2026-07-20 — Dashboard Mutation Form Props Boundary Parity

- Continued the remaining dashboard/page parity audit by comparing simple mutation forms against Midday's local `type Props` form source shape.
- Renamed local form prop boundaries to `Props` in Customer, Department, Appointment, Leave Request, and Payroll Entry forms.
- Preserved every field, schema, default value, mutation, invalidation target, cancel/success callback, and sheet-owned close behavior.

## 2026-07-20 — Conditional Invite Route Prefetch Boundary Parity

- Continued the remaining dashboard/page parity audit by checking invite-capable route prefetch arrays against Midday's static route `batchPrefetch` source shape.
- Removed conditional spread entries from Agents, Employees, and Team route `batchPrefetch` calls; permission-gated invite data now prefetches through explicit `prefetch(trpc.team.listInvites.queryOptions())` calls.
- Converted Agents' remaining single list prefetch from `batchPrefetch` to `prefetch(...)` while preserving invite visibility, membership permission checks, HydrateClient boundaries, table settings, filters/sort inputs, and infinite query cursors.

## 2026-07-20 — Remaining Static Single-Query Route Prefetch Parity

- Continued the remaining dashboard/page parity audit by scanning dashboard route `batchPrefetch([...])` calls for static one-query arrays.
- Updated the Departments table route and Project Workforce detail route to use Midday's `prefetch(...)` helper for their single query options.
- Preserved their authenticated session guards, HydrateClient boundaries, Suspense skeletons, table/content rendering, filters/sort handling, and query option inputs while keeping true grouped and conditional route prefetch arrays on `batchPrefetch`.

## 2026-07-20 — Dashboard Table Actions Menu Props Boundary Parity

- Continued the remaining dashboard/table parity audit by comparing domain `actions-menu.tsx` files against Midday's invoices action-menu source shape.
- Renamed action-menu prop type boundaries from `ActionsMenuProps` to local `Props` across Agents, Appointments, Blog, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team.
- Removed redundant action-menu wrapper `onClick` stop-propagation handlers where the shared virtual-row action column already treats `actions` cells as non-clickable, and removed the stale Team display-name local while preserving menu actions, mutation invalidation, permission gates, route/sheet params, and sticky action-column rendering.

## 2026-07-20 — Dashboard Table Empty-State Props Boundary Parity

- Continued the remaining dashboard/table parity audit by comparing active table empty-state files against Midday's local empty/no-results references.
- Renamed prop-bearing domain empty-state type boundaries to local `Props` in Blog, Customers, Employees, Leads, Leave Requests, Notifications, Payroll, and Projects.
- Preserved every empty-state description/action, create-sheet or create-route trigger, clear-filter handler, status-specific copy, payroll period display, and core empty/no-results wrapper usage.

## 2026-07-20 — Dashboard Table DataTable Props Boundary Parity

- Continued the remaining dashboard/page parity audit by comparing active Plot Keys table `data-table.tsx` files against Midday's customers/invoices/vault/transactions table references.
- Renamed the local table prop type boundary from `DataTableProps` to `Props` across Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team tables.
- Preserved every existing table prop, route-owned initial settings handoff, can-manage/can-invite flags, payroll period props, row selection, bulk action behavior, and infinite-query runtime.

## 2026-07-18 — Dashboard Single-Query Prefetch Helper Parity

- Continued the remaining dashboard/page parity audit by comparing route-level server prefetch calls against Midday's split between one-off `prefetch(...)` and grouped `batchPrefetch([...])`.
- Updated Dashboard Home, Analytics, Reports, Billing, Integrations, AI Credits, Settings, Settings Notifications, Settings Integrations, Blog detail, Estate list/detail, and Project overview/budget detail pages to use `prefetch(...)` for single query options.
- Preserved the existing HydrateClient wrappers, Suspense skeletons, ErrorBoundary placement, URL parameter normalization, authenticated session guards, and every true grouped prefetch array.

## 2026-07-18 — Template Sandbox Server Query-Client Parity

- Continued the remaining dashboard/page parity audit by scanning sandbox route entrypoints for direct server tRPC client usage outside the Midday options-proxy route pattern.
- Updated the Template Sandbox redirect and detail pages to use `getQueryClient().fetchQuery(...)` with `trpc.templateSandbox.*.queryOptions(...)`, matching Midday's server page query-client contract.
- Removed the page-only `getServerTrpcClient` export from the dashboard tRPC server boundary while preserving default sandbox profile redirects, detail not-found behavior, preview `page` / `path` URL normalization, and the existing template sandbox client query/mutation hooks.

## 2026-07-18 — Dashboard DB Route Helper Server-Only Boundary Parity

- Continued the remaining dashboard/page parity audit by scanning dashboard app, lib, and component modules for runtime `@plotkeys/db/queries` imports.
- Added explicit `server-only` imports to the remaining DB-backed server route/helper modules that are not API route handlers: session, notifications, company-app context, onboarding, invite join, invite profile completion, and billing callback.
- Preserved auth/session resolution, notification bell loading, app-store context, onboarding persistence, invite acceptance/profile setup, and Paystack billing callback activation while keeping the larger API/tRPC extraction as a future verified slice.
- Validation: runtime dashboard DB imports under pages/libs/components are now either in server-only guarded modules, API route handlers, or type-only component imports.

## 2026-07-18 — Dashboard Route Metadata And SearchParams Sweep

- Continued the remaining dashboard/page parity audit by scanning every dashboard `page.tsx` for missing metadata exports and object-shaped optional `searchParams` props.
- Updated Sign In, Sign Up, Onboarding, Verify Email, Invite Join, Invite Profile Completion, and Template Sandbox detail pages to export typed Next metadata and accept `Promise<SearchParams>` from `nuqs`.
- Normalized repeated query keys before passing strings into the existing auth, onboarding, invite, verification, and sandbox flows, preserving redirects, error display, tenant handoff URLs, profile setup behavior, and template preview `page` / `path` selection.
- Validation: focused scans now show no dashboard `page.tsx` missing `metadata` / `generateMetadata`, no object-shaped optional `searchParams` page props, and no optional `params` page props.

## 2026-07-18 — Builder And Billing Route SearchParams Boundary Parity

- Continued the remaining dashboard/page parity audit by scanning dashboard route entrypoints outside and inside the authenticated `(app)` pages for bespoke URL query types.
- Updated the full-screen Builder route to export typed Next metadata and accept `Promise<SearchParams>` from `nuqs`, and updated the Billing route to accept `Promise<SearchParams>` instead of a bespoke interval-only object.
- Normalized repeated query keys before passing supported builder notice flags plus `page` / `path` into `BuilderWorkspace` and `interval` into billing utilities, preserving the authenticated builder shell, current-page selection, preview-path selection, existing notice behavior, billing prefetching, hydration, and selected interval behavior.
- Added the Midday-matched `server-only` dashboard dependency so the existing `trpc/server.tsx` and guarded dashboard server-component imports resolve from the package graph.

## 2026-07-18 — Dashboard Server-Only DB Boundary Parity

- Continued the remaining dashboard/page parity audit by scanning dashboard app/components for runtime `@plotkeys/db/queries` imports and comparing the result against Midday's dashboard component boundary, where component imports from `@midday/db/queries` are type-only.
- Added explicit `server-only` imports to the remaining DB-backed server component entrypoints, `LivePreviewContent` and `BuilderWorkspace`, matching the existing dashboard-home builder guard and keeping those query-backed components out of client bundles.
- Preserved live-preview hostname/subdomain resolution, builder workspace draft loading, template access checks, preview data resolution, and existing route-owned rendering while leaving a fuller API/tRPC extraction for a future verified slice.

## 2026-07-18 — Midday App Store Card Header Slot Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' App Store view and skeleton against Midday's Apps / `UnifiedAppComponent` / Apps skeleton references.
- Wrapped the installed status pill in the same `flex items-center gap-2` header slot used by Midday's app card reference and cleaned the App Store empty-search clear-link button so visual props stay grouped before `asChild`.
- Preserved the existing plan-gated upgrade action, enable/disable toggle behavior, search/tab filtering, installed empty state copy, skeleton geometry, and the RSC cached `getCompanyAppsContext` data boundary that is shared with the dashboard layout/sidebar.

## 2026-07-18 — Midday Direct Table Skeleton Ownership Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' table skeleton files against Midday customers/invoices skeleton references.
- Converted Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team skeletons from the local `createTableSkeleton` factory to direct `TableSkeleton` wrapper functions.
- Removed the `createTableSkeleton` factory and exported skeleton prop helper types from the shared table core surface while preserving each domain's columns, row count, sticky column ids, actions column, and loading geometry.

## 2026-07-18 — Midday Table Core Internal Import Boundary Parity

- Continued the remaining dashboard/page parity audit by scanning table-core consumers for private `core/types` import residue.
- Changed `data-table-header.tsx` to import `SelectColumnHeader`, sticky action classes, and `TableScrollState` from relative core modules instead of routing through the app alias/private types path.
- Preserved the shared header factory, sort controls, sticky-column behavior, DnD, resize handles, and domain table-header consumers.

## 2026-07-18 — Midday Table Core Barrel Export Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared table core barrel against Midday's `components/tables/core/index.ts` reference.
- Reordered the public primitive exports so `BottomBar`, empty states, skeleton cell/table skeleton, table constants/types, and `VirtualRow` lead the barrel in Midday order.
- Preserved Plot Keys' additional shared table actions, shell/content/header exports, select-column helpers, table skeleton factory/types, and runtime hooks after the Midday-shaped public block.

## 2026-07-18 — Midday Sheet Params Schema Order Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' sheet/detail URL-param hooks against Midday customer, invoice, transaction, and document param references.
- Reordered property params so the selected record key `propertyId` leads the schema before create/detail support params.
- Reordered estate params so the selected record key `estateSlug` leads the schema before create/edit flags, preserving every URL key and all sheet consumers.

## 2026-07-18 — Midday Filter Hook Return Shape Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' URL filter hooks against Midday's filter hook return-shape references.
- Reordered agent, appointment, blog, customer, department, employee, lead, leave-request, notification, payroll, project, property, and team filter hooks so canonical setters return before `hasFilters`.
- Preserved Plot Keys' `filters` / `setFilters` aliases, null-clearing wrappers, schemas, loaders, resolver helpers, and all URL state names.

## 2026-07-18 — Midday Table Config Public Boundary Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared `table-configs.ts` import boundary against the Midday reference.
- Changed `StickyColumnConfig` and `TableConfig` to import from the public `components/tables/core` barrel instead of the private `core/types` module.
- Preserved every Plot Keys table id, sticky-column config, sort map, non-reorderable set, row height, summary height, and complete table configuration value.

## 2026-07-18 — Midday Table Settings Utility Contract Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared table settings utility against the Midday reference.
- Restored the Midday documentation boundary for table IDs, single/all table settings, cookie ownership, default visibility/settings, merge defaults, column-id extraction, and saved-order normalization.
- Aligned settings object field order to `columns`, `sizing`, `order` while preserving Plot Keys' required `select`-first and `actions`-last column-order normalization.

## 2026-07-18 — Midday Sticky Columns Hook Default Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared `useStickyColumns` hook against the Midday reference.
- Added the table-config import and changed the optional sticky-column fallback from an empty array to the closest Plot Keys shared directory table config, `STICKY_COLUMNS.customers`.
- Preserved all active table callers because data-table headers, skeletons, and runtime column helpers already pass explicit table-specific sticky configurations.

## 2026-07-18 — Midday Error Fallback Source Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared `ErrorFallback` against the Midday reference.
- Aligned the recoverable error-state wrapper class order and retry `Button` prop order to the exact Midday source shape.
- Preserved the router refresh retry behavior, visible copy, outline styling, and every shared `ErrorBoundary` consumer.

## 2026-07-18 — Midday Scroll Header Hook Source Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared `useScrollHeader` hook against the Midday reference.
- Restored Midday's CSS-variable documentation, options interface, hook comment, typed refs, and internal `prev*` ref naming in the shared hook source.
- Preserved the existing header offset, route reset, requestAnimationFrame scroll handling, summary-grid extra offset, body overflow behavior, and all dashboard shell/table consumers.

## 2026-07-18 — Midday Scrollable Content Shell Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared `ScrollableContent` page-shell wrapper against the Midday reference.
- Changed `ScrollableContentProps` from a type alias to the Midday-style interface and restored the reference comment describing the scroll-to-hide header behavior for table/page content.
- Preserved the existing `--header-offset` transform, transition timing, will-change styling, and all dashboard route wrappers.

## 2026-07-18 — Midday Collapsible Summary Component Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared `CollapsibleSummary` component against the Midday reference.
- Changed `CollapsibleSummaryProps` from a type alias to the Midday-style interface and restored the reference component comment describing the shared `--header-offset` / `--header-transition` collapse contract.
- Preserved the existing transform, transition, will-change styling, Customers summary collapse, and table scroll behavior.

## 2026-07-18 — Midday Customer Summary Grid Class Parity

- Continued the remaining dashboard/page parity audit by comparing the Plot Keys Customers route summary grid against Midday customer and invoice route references.
- Reordered the Customers `CollapsibleSummary` grid classes to match Midday's `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6` contract.
- Preserved customer summary cards, Suspense boundaries, prefetching, header, table, and scroll-collapse behavior.

## 2026-07-18 — Midday Summary Scroll Offset Parity

- Continued the remaining dashboard/page parity audit by comparing summary-bearing table scroll offsets against Midday invoice/customer references.
- Changed Customers to use Midday's `180` pixel `SUMMARY_GRID_HEIGHTS` offset for its `CollapsibleSummary`.
- Removed the stale Properties summary-grid offset from table config and table runtime because the Properties route has no collapsible summary section, preserving header collapse, table virtualization, sticky columns, and properties row behavior.

## 2026-07-18 — Midday Table Row Height Baseline Parity

- Continued the remaining dashboard/page parity audit by comparing active table row-height runtime against Midday's table config and virtual-row references.
- Changed Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team to use the Midday `45` pixel virtual row-height baseline.
- Preserved sticky columns, virtualization, selection, action menus, shared table headers, and skeleton behavior.

## 2026-07-18 — Midday Action Column Header Metadata Parity

- Continued the remaining dashboard/page parity audit by comparing active table action-column header metadata against Midday invoice/customer action column references.
- Changed Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team action columns from empty headers to `header: "Actions"`, matching the existing `headerLabel`.
- Preserved action column widths, sticky classes, row menus, icon skeleton metadata, and table header rendering.

## 2026-07-18 — Midday Action Column Skeleton Metadata Parity

- Continued the remaining dashboard/page parity audit by comparing active table action-column skeleton metadata against Midday invoice/customer/vault action column references.
- Changed Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team action columns to use `skeleton: { type: "icon" }` instead of text-width skeletons.
- Preserved action column widths, sticky classes, row menus, and loading row structure.

## 2026-07-18 — Midday Sticky Table Column Metadata Parity

- Continued the remaining dashboard/page parity audit by comparing active table sticky column metadata against Midday invoice/customer column class contracts.
- Normalized primary sticky columns and action sticky columns across Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team to use unprefixed sticky backgrounds, row-hover sticky backgrounds, z-index tokens, and action border classes shaped like the Midday references.
- Preserved column widths, row actions, selection behavior, table virtualization, and the shared table runtime.

## 2026-07-18 — Midday Positive Value Token Parity

- Continued the remaining dashboard/page parity audit by scanning dashboard raw color utilities against Midday's positive amount/status references.
- Replaced generic `text-green-600` on report emphasized counts, analytics completed-appointment counts, and project budget positive variance with Midday's `text-[#00C969]` positive token.
- Preserved App Store and Integrations installed pills because their green-pill classes already match Midday's `UnifiedApp` reference.

## 2026-07-18 — Midday Visual-First Action Button Prop Parity

- Continued the remaining dashboard/page parity audit by scanning for action buttons where behavior props still preceded `variant`.
- Reordered form cancel actions, publish modal cancel, billing disabled plan actions, quick-fill trigger, and error retry to pass `variant` / `size` / local classes before event/disabled/type props.
- Preserved cancel callbacks, disabled-state behavior, publish modal ownership, billing plan copy, quick-fill trigger behavior, and router refresh retry.

## 2026-07-18 — Midday Visual-First Link Action Button Parity

- Continued the remaining dashboard/page parity audit by comparing dashboard link actions against the migrated Midday visual-first button call contract.
- Reordered route/header CTAs, auth/join/onboarding links, builder/template actions, notification footer, settings upgrade, and dashboard-home actions so `variant` / `size` / local classes are passed before `asChild`.
- Preserved live preview, builder, billing, domain, auth, invite, template sandbox, notification, and empty-state routing behavior; the active dashboard scan now has no `Button asChild` calls where visual props still follow `asChild`.

## 2026-07-18 — Midday App Card Action Button Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' App Store and Integrations card actions against Midday's `UnifiedAppComponent` action-button call shape.
- Reordered locked app upgrade, integration configure, and integration docs buttons so `variant` and the local width class stay grouped before `asChild`.
- Preserved billing/settings/docs routing, locked-plan copy, external-link icon behavior, installed status pills, and app-card anatomy.

## 2026-07-18 — Midday Pending Action Label Parity

- Continued the remaining dashboard/page parity audit by scanning for dynamic pending action labels after the submit-button migration pass.
- Changed `OnboardingBrandAvatar`, `TemplateSandboxIndex`, and `BuilderAiToolControl` to use the shared `SubmitButton` with stable visible copy and spinner-owned pending state.
- Preserved file-picker behavior, logo preview/error handling, router refresh, sandbox creation form submission, profile invalidation, post-create routing, AI generation triggers, disabled guards, result messages, and error copy.

## 2026-07-18 — Midday Auth Billing And Upload SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' auth and billing submit/actions against Midday's auth `SubmitButton` and plan checkout action references.
- Changed `SignUpForm`, invited signup, billing checkout actions, billing repair submit, and estate plan upload to use the shared `SubmitButton` with stable visible copy and spinner-owned pending state where applicable.
- Preserved signup validation, dev-account capture, invite acceptance, redirects, checkout mutation payloads, billing callback routing, current-plan disabled state, repair-reference form handling, estate plan file upload, create-layout mutation, and estate detail invalidation.

## 2026-07-18 — Midday Project Subresource SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' inline project subresource create forms against Midday's form `SubmitButton` pattern and the already-migrated project form submit surfaces.
- Changed phase, milestone, issue, and update create forms to use the shared `SubmitButton` with stable visible copy and spinner-owned pending state.
- Preserved inline form layout, required fields, controlled select fields, create mutations, project cache invalidation, form resets, and existing list/status action buttons.

## 2026-07-18 — Midday Pending Action Button Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' last dynamic non-submit pending labels against Midday's stable create/action button references and the local shared `SubmitButton` pending-action pattern.
- Changed `CreateBlogPostButton`, `BuilderPreviewFieldEditor`, shared `QuickFill`, and `DevFormQuickFillButton` to use the shared `SubmitButton` with stable visible copy and spinner-owned pending state.
- Preserved blog create mutation/routing/query invalidation, optional add icon/variant/size props, builder save transition, AI fill transition, quick-fill busy guards, custom quick-fill labels, secondary full-width save styling, ghost compact AI-fill styling, and dev-only quick-fill visibility.

## 2026-07-18 — Midday Invite Profile SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `InviteProfileCompletionForm` submit action against Midday's form `SubmitButton` pattern.
- Changed the invite profile completion primary submit to use the shared `SubmitButton` with stable `Save and continue` copy and spinner-owned pending state.
- Preserved the skip link, quick-fill controls, uncontrolled field refs, invite profile completion mutation, token payload, and post-success routing.

## 2026-07-18 — Midday Onboarding Step SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared onboarding `StepActions` footer against Midday's onboarding `SubmitButton` pattern.
- Changed `StepActions` to use the shared `SubmitButton` with stable step-specific copy and spinner-owned pending state.
- Preserved quick-fill placement, back/cancel link buttons, step save mutations, redirect behavior, dashboard URL generation, and the final `Open builder` label.

## 2026-07-18 — Midday Property Media SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `PropertyDetails` media upload form against Midday's form `SubmitButton` pattern.
- Changed the property media upload submit action to use the shared `SubmitButton` with stable `Add media` copy and spinner-owned pending state.
- Preserved detail-sheet ownership, media URL/type/cover inputs, add-media mutation, property/media/list invalidations, form reset, and existing per-media action buttons.

## 2026-07-18 — Midday Leave Request Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `LeaveRequestForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `LeaveRequestForm` to use the shared `SubmitButton` with stable `Submit request` copy and spinner-owned pending state.
- Preserved the cancel action, employee availability disabled guard, controlled employee/type selects, date validation, create mutation, error placement, leave-request list/stat invalidations, form reset, and sheet success callback.

## 2026-07-18 — Midday Property Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `PropertyForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `PropertyForm` to use the shared `SubmitButton` with stable create/edit copy and spinner-owned pending state.
- Preserved the cancel action, quick-fill controls, pricing-plan draft fields, land-listing field guards, field validation, active create/update mutation selection, error placement, property list/detail/stat invalidations, form reset, and sheet success callback.

## 2026-07-18 — Midday Agent Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `AgentForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `AgentForm` to use the shared `SubmitButton` with stable create/edit copy and spinner-owned pending state.
- Preserved the cancel action, quick-fill controls, field validation, active create/update mutation selection, error placement, agent list/detail invalidations, form reset, and sheet success callback.

## 2026-07-18 — Midday Estate Launch Details Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `EstateLaunchDetailsForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `EstateLaunchDetailsForm` to use the shared `SubmitButton` with stable `Save launch` copy and spinner-owned pending state.
- Preserved quick fill, publish-state control, asset upload helpers, field validation, update mutation, error placement, form reset from returned estate data, estate/detail/stat invalidations, and sheet success callback.

## 2026-07-18 — Midday Estate Launch Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `CreateEstateForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `CreateEstateForm` to use the shared `SubmitButton` with stable `Create launch` copy and spinner-owned pending state.
- Preserved quick fill, field validation, create mutation, error placement, form reset, estate list invalidation, and sheet success callback.

## 2026-07-18 — Midday Blog Post Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `BlogPostForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `BlogPostForm` to use the shared `SubmitButton` with stable `Save changes` copy and spinner-owned pending state.
- Preserved rich-text editing, validation, update mutation, saved-state alert, form reset from returned post data, and blog post/list/stats invalidations.

## 2026-07-18 — Midday Payroll Entry Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `PayrollEntryForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `PayrollEntryForm` to use the shared `SubmitButton` with stable `Add entry` copy and spinner-owned pending state.
- Preserved cancel behavior, employee/month/year controls, amount validation, empty-employee disabled guard, create mutation, error placement, payroll invalidations, form reset, and success callback.

## 2026-07-18 — Midday Project Payroll Run Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `CreatePayrollRunForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `CreatePayrollRunForm` to use the shared `SubmitButton` with stable `Create payroll run` copy and spinner-owned pending state.
- Preserved date validation, create mutation, error placement, project/workforce/payroll invalidations, form reset, router refresh, and sheet success callback.

## 2026-07-18 — Midday Project Budget Line Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `CreateBudgetLineForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `CreateBudgetLineForm` to use the shared `SubmitButton` with stable `Add line item` copy and spinner-owned pending state.
- Preserved line validation, category select, amount/quantity parsing, create mutation, error placement, project/budget invalidations, form reset, router refresh, and sheet success callback.

## 2026-07-18 — Midday Project Budget Summary Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `ProjectBudgetSummaryForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `ProjectBudgetSummaryForm` to use the shared `SubmitButton` with stable `Create budget` copy and spinner-owned pending state.
- Preserved budget validation, currency normalization, upsert mutation, error placement, project/budget invalidations, router refresh, and sheet success callback.

## 2026-07-18 — Midday Project Worker Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `CreateWorkerForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `CreateWorkerForm` to use the shared `SubmitButton` with stable `Add worker` copy and spinner-owned pending state.
- Preserved worker validation, pay-basis select, create mutation, error placement, project/workforce invalidations, form reset, router refresh, and sheet success callback.

## 2026-07-18 — Midday Project Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `ProjectForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `ProjectForm` to use the shared `SubmitButton` with stable `Create project` copy and spinner-owned pending state.
- Preserved the cancel action, quick-fill controls, project type select, validation, create mutation, error placement, project invalidation, form reset, and sheet success callback.

## 2026-07-18 — Midday Appointment Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `AppointmentForm` submit action against Midday's form `SubmitButton` pattern.
- Changed `AppointmentForm` to use the shared `SubmitButton` with stable `Schedule` copy and spinner-owned pending state.
- Preserved the cancel action, agent select, form validation, create mutation, error message placement, appointment/stat invalidations, form reset, and close callback.

## 2026-07-18 — Midday Department Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `DepartmentForm` submit action against Midday's create-form `SubmitButton` pattern.
- Changed `DepartmentForm` to use the shared `SubmitButton` with stable `Add department` copy and spinner-owned pending state.
- Preserved the cancel action, error message placement, create mutation, form reset, department list invalidation, and sheet success callback.

## 2026-07-18 — Midday Customer Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `CustomerForm` submit action against Midday's customer form submit pattern.
- Changed `CustomerForm` to use the shared `SubmitButton` with stable create/edit copy and spinner-owned pending state.
- Preserved the cancel action, active create/update mutation selection, error alert, cache invalidations, form reset, and sheet success callback.

## 2026-07-18 — Midday Invite Form SubmitButton Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' team, agent, and employee invite forms against Midday's `InviteForm` submit action pattern.
- Changed the invite form primary submit actions to use the shared `SubmitButton` with stable `Send invite` copy and spinner-owned pending state.
- Preserved cancel buttons, form validation, role fields, quick-fill controls, invite mutations, query invalidation, and success callbacks.

## 2026-07-18 — Midday Recommendation Submit Label Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' recommendation modal primary action against Midday's shared `SubmitButton` pending pattern.
- Changed `RecommendTemplateActions` to keep the primary action label stable while the shared submit button owns the spinner and hidden-label loading state.
- Preserved the dialog footer, cancel action, disabled state, recommendation mutation trigger, and action copy.

## 2026-07-18 — Midday Builder Modal Close-State Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' publish and recommendation modal owners against Midday's reset-on-close modal pattern.
- Changed `PublishConfirmationDialog` and `RecommendTemplatePanel` to route `Dialog` `onOpenChange` through local handlers that reset transient error/result state and restore form/profile inputs when the modal closes.
- Preserved trigger placement, dialog header/content/footer ownership, mutations, router refreshes, and publish/recommendation action behavior.

## 2026-07-18 — Midday Builder Publish Actions Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' publish confirmation footer against Midday's modal footer submit patterns.
- Changed `PublishConfirmationActions` to use an outline cancel `Button` followed by the shared `SubmitButton` with `isSubmitting`, `disabled`, and `type="submit"`.
- Preserved quick-fill placement, cancel callback, form submission, pending disabled state, and publish action ownership.

## 2026-07-18 — Midday Builder Recommendation Actions Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' builder recommendation modal footer against Midday's invoice settings modal footer pattern.
- Changed `RecommendTemplateActions` to use a cancel `Button` followed by the shared `SubmitButton` with `isSubmitting`, `onClick`, and `disabled`.
- Preserved the dialog footer, cancel callback, recommendation mutation trigger, pending disabled state, and action copy.

## 2026-07-18 — Midday Builder Recommendation Trigger Call-Shape Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' builder recommendation modal trigger against Midday's outline small-button references in connector/action surfaces.
- Reordered `RecommendTemplatePanel`'s trigger props to pass `variant="outline"` and `size="sm"` before the local width and disabled props.
- Preserved the dialog trigger, disabled state, recommendation profile fields, mutation, router refresh, and close behavior.

## 2026-07-18 — Midday Customer Edit Action Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' customer edit sheet header action trigger against Midday's customer edit sheet reference.
- Changed the dropdown trigger to the Midday-shaped plain `button type="button"` around `Icon.MoreVertical`, removing the local classed/labelled button shell.
- Preserved the edit sheet header, delete confirmation, customer invalidations, URL close behavior, and customer form ownership.

## 2026-07-18 — Midday Table Header Sort Call-Shape Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared `CoreDataTableHeader` sort header calls against Midday's invoices and customers table-header references.
- Reordered the primary and generic sortable `SortButton` call sites to pass `label` and `sortField` before current sort state and `onSort`, matching the Midday header call shape.
- Preserved sort-query behavior, horizontal pagination, sticky columns, DnD sorting, resize handles, and all domain table-header consumers that use the shared core header.

## 2026-07-18 — Midday Bulk Delete Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared bulk delete action against Midday's transactions destructive bulk-action trigger and bottom-bar references.
- Changed `BulkClientDeleteAction` to use Midday's `size="icon"` / `variant="ghost"` trigger shape, destructive hover class ordering, and explicit `Icon.Delete size={18}`.
- Preserved the shared alert-dialog confirmation, disabled state, selected-count copy, and selected-row table callers across customers, properties, agents, appointments, blog, departments, employees, projects, and team tables.

## 2026-07-18 — Midday Blog Create Button Call-Shape Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' `CreateBlogPostButton` against Midday's invoice/customer/add-transaction create button references.
- Moved `variant={variant}` before `size={size}` so the shared blog create action follows Midday's create/open button call order more closely.
- Preserved pending disabling, explicit button type, create mutation, route push, query invalidation, header icon usage, and empty-state text action.

## 2026-07-18 — Midday Blog Create Icon Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' blog create action against Midday's create/open-sheet add affordances.
- Changed `CreateBlogPostButton` to render the shared `Icon.Add` glyph instead of the local `Icon.PlusCircle` variant when the blog header requests an icon.
- Preserved the blog create mutation, pending label, route push, query invalidation, header placement, and empty-state text action.

## 2026-07-18 — Midday Invite Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' invite openers against Midday's pending-invites table header and invite-team-members modal trigger.
- Changed team, agent, and employee invite openers from local outline icon-only `Icon.Users` buttons to Midday-shaped text `Button` triggers.
- Preserved Plot Keys' URL-backed global invite sheets, permission/header placement, invite form ownership, and success/cancel close behavior.

## 2026-07-18 — Midday Builder Preview Navigation Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' builder template preview header against Midday's widget back button and tracker period/day compact navigation references.
- Changed the builder back action from `Icon.ChevronLeft` to the Midday-named `Icon.ArrowBack` affordance.
- Aligned previous/next template button and chevron class ordering to Midday's `p-0 w-6 h-6 hover:bg-transparent ...` and `w-6 h-6` compact navigation pattern while preserving builder routing, template cycling callbacks, mobile picker, and theme toggle behavior.

## 2026-07-18 — Midday Settings Trigger Icon Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' settings/edit triggers against Midday's invoice settings menu, tracker settings, and notification settings affordances.
- Changed the builder sidebar settings trigger and estate launch edit trigger from the local `Icon.Settings2` variant to the Midday-shaped `Icon.Settings` glyph.
- Preserved the existing outline button shells, mobile builder drawer behavior, URL-backed estate launch edit state, and `size-4` icon sizing used by nearby Midday settings controls.

## 2026-07-18 — Midday Notification Bell Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' notification bell trigger against Midday's notification-center trigger and dashboard header composition.
- Aligned the popover trigger to Midday's outline icon-button shell and explicit `Icon.Bell size={16}` call shape instead of the local ghost/p-0 button and `size-4` icon class.
- Preserved Plot Keys' unread count badge, screen-reader label, recent notification content, and popover placement.

## 2026-07-18 — Midday Leave Request Open Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' leave-request create trigger against Midday's invoice, customer, and tracker open-sheet references.
- Changed `OpenLeaveRequestSheet` from a local calendar icon with `size-4` to the Midday-shaped bare `Icon.Add` create affordance.
- Preserved the outline icon button shell, URL-backed `createLeaveRequest` state, and existing global leave-request sheet ownership.

## 2026-07-18 — Midday Shared Table Sort Icon Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared table `SortButton` against Midday's invoices and customers table-header references.
- Changed active ascending/descending sort icons from local `size-4` class sizing to Midday's explicit `size={16}` call shape.
- Preserved the ghost sort button, stop-propagation behavior, sort-field mapping, active sort state, and all domain table-header factories that consume the shared header.

## 2026-07-18 — Midday Search Filter Trigger Icon Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared search-filter trigger against Midday's invoice and transactions search-filter references.
- Removed the local `size-4` class from the inline `Icon.Filter` trigger so the shared search filter now renders the same bare filter icon call as Midday's references.
- Preserved prompt state, filter menu visibility, active opacity, URL-filter updates, hotkeys, search input spacing, filter chips, and the generic filter-list contract.

## 2026-07-18 — Midday Shared Bulk Action Submit Shape Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared table bulk action wrapper against Midday's invoices/vault bottom-bar `SubmitButton` call shape.
- Aligned `BulkClientAction` so `isSubmitting`, `onClick`, and `disabled` are passed in the Midday bottom-bar order before Plot Keys' local `variant`, `size`, and explicit `type="button"` props.
- Preserved the shared bulk action abstraction, small sizing, variant override, loading state, explicit button type, and existing table bulk mutation callers.

## 2026-07-18 — Midday Customer Action And Open Add Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys customer inline table actions and open-sheet create triggers against Midday's customers table columns and open invoice/customer sheet references.
- Aligned the customer columns action trigger to Midday's ghost icon-button shape with the `h-8 w-8 p-0` button, `h-4 w-4` more icon, and no local per-row action aria label, while preserving edit/details/status/delete behavior, delete dialog ownership, stop-propagation, and customer mutations.
- Removed local `size-4` icon sizing from create-style `Icon.Add` open-sheet triggers for agents, appointments, customers, departments, estate creation, payroll entries, projects, and properties so they match Midday's bare add-icon open-sheet reference while preserving URL-param payloads, defaults, and domain-specific non-create icons.

## 2026-07-18 — Midday Table Actions Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys table action-menu triggers against Midday's invoices and orders action-menu references.
- Aligned Agents, Appointments, Blog, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team action-menu triggers to the Midday shape: `Button variant="ghost" className="h-8 w-8 p-0"` with the MoreHorizontal icon using `h-4 w-4`.
- Removed the local per-row `aria-label` / `size-4` trigger residue while preserving centered action wrappers, row-click stop propagation, menu content, permission gates, mutations, invalidation, links, and domain-specific actions.

## 2026-07-18 — Midday Shared Table Core Call-Shape Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared table shell/content/runtime path against Midday's invoices and customers data-table references.
- Aligned the shared `useDashboardTable` `useReactTable` option order with the Midday data-table call sequence for data, row IDs, columns, row selection, core row model, column visibility, resizing, sizing, ordering, state, and metadata.
- Aligned the shared `CoreDataTableContent` DnD wrapper, `VirtualRow`, and fallback table-cell prop order with Midday's table body references while preserving Plot Keys' generic table abstraction, row selection state, virtualization, DnD, sticky columns, column sizing/order/visibility, and domain-owned empty/no-results states.

## 2026-07-18 — Midday Table Bottom Bar Comment Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared table `BottomBar` abstraction against Midday's invoices bottom-bar reference.
- Removed Plot Keys-only prop and component narration comments from the shared bottom bar so the component reads closer to Midday's lean implementation, while preserving the reference blur-layer comment, portal/motion structure, selected count text, deselect action, and injected bulk action slot.

## 2026-07-18 — Midday Filter Chip Clear Icon Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared search-filter chip list against Midday's `FilterList` reference.
- Added the Midday-named `Icon.Clear` alias in the shared UI icon namespace and switched the shared search-filter chip remove affordance from `Icon.Close` to `Icon.Clear`, while preserving the same glyph, hover reveal classes, chip class contract, date-range clearing behavior, and generic filter value rendering.
- Left unrelated close buttons on `Icon.Close` because those represent close/dismiss controls rather than Midday filter-chip clear affordances.

## 2026-07-18 — Midday Search Filter Chrome Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys' shared `SearchFilter` abstraction against Midday's invoice search/filter reference.
- Aligned shared search-filter chrome with Midday's dropdown structure: `cn` import placement, submenu content prop order, checkbox item event/checked prop order, and the inline filter trigger's `onClick` / `type` / `className` ordering now follow the reference more closely.
- Removed the Plot Keys-only hidden text child from the filter icon trigger while preserving the generic filter-list data contract, search prompt state, escape/meta+s hotkeys, date-range filters, option toggling, filter chips, and URL-param update behavior.

## 2026-07-18 — Midday Open Sheet Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys `Open*Sheet` trigger components against Midday's `open-customer-sheet.tsx` and `open-invoice-sheet.tsx` references.
- Aligned open-sheet trigger buttons for customers, properties, agents, appointments, departments, estates, team invites, employee invites, agent invites, leave requests, payroll entries, and projects to the Midday open-button call shape: `variant="outline"`, `size="icon"`, then the URL-param `onClick` handler, with no local `type="button"` or hidden text child.
- Added the Midday-named `Icon.Add` alias in the shared UI icon namespace and switched create-style open-sheet triggers from `Icon.Plus` to `Icon.Add`, while preserving existing URL state payloads, property defaults, project className pass-through, and domain-specific invite/edit icons.

## 2026-07-18 — Midday Dashboard Route Stack Gap Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys list/table route entrypoints against Midday's customers and invoices page references.
- Aligned the remaining table/list route body stacks from `flex flex-col gap-5` to Midday's `flex flex-col gap-6` page-shell spacing across Notifications, Employees, Leave Requests, Payroll, Departments, Blog, Projects, Team, Agents, Leads, and Appointments.
- Preserved each route's server-side session guard, search-param loading, table settings, tRPC prefetching, header/summary/invite composition, `HydrateClient`, `ScrollableContent`, `ErrorBoundary`, `Suspense`, and domain table skeleton behavior.

## 2026-07-18 — Midday Table Header Mobile Action Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys table header action groups and shared column visibility controls against Midday's customers/invoices header and column-visibility references.
- Aligned table header action groups across Customers, Properties, Agents, Blog, Employees, Appointments, Leave Requests, Projects, Departments, Leads, Payroll, Team, and Notifications so column visibility remains visible on mobile like Midday's header pattern, while create/invite/mark-all-read actions stay wrapped in `hidden sm:block` where the current product surface keeps those actions desktop-only.
- Preserved permission gates, table-specific search/filter controls, status/period tabs, sheet triggers, notification mutation behavior, and column visibility store wiring, while also aligning the touched Notifications action button to the migrated `variant`-first button call shape.

## 2026-07-18 — Midday Virtual Table Row Default Boundary Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys table core empty states, skeletons, bottom bar, skeleton cells, and virtual rows against Midday's shared table core references.
- Removed the extra exported `DEFAULT_NON_CLICKABLE_COLUMNS` surface from the shared virtual row module so `VirtualRow` owns the same local `new Set(["select", "actions"])` default shape as Midday, while preserving select/actions as non-clickable cells and row-click behavior for all other columns.
- Updated the Plot Keys-only `CoreDataTableContent` wrapper to use the same local non-clickable column default instead of importing the removed virtual-row constant, preserving the generic table content abstraction, DnD wrapper, sticky styles, virtualization, row selection metadata, and domain table factories.

## 2026-07-18 — Midday Shared Table Header Call-Shape Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys shared table headers against Midday's invoices/customers `DataTableHeader`, `HorizontalPagination`, and `DraggableHeader` references.
- Aligned the shared core table header primary-column pagination call with Midday's prop ordering by passing scroll callbacks before `className`, preserving horizontal table pagination behavior across domain table headers.
- Aligned the shared core table `SortButton` with Midday's `Button` call shape by placing `variant="ghost"` before the click handler, preserving sort toggling, stop-propagation, active sort icons, and all domain-specific sort-field mappings.
- Aligned `DraggableHeader` grip icon sizing with Midday's explicit `size={14}` call while preserving the shared Plot Keys icon namespace, DnD attributes/listeners, drag styling, and disabled behavior.

## 2026-07-18 — Midday Notification Settings Row Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys notification preferences against Midday's settings notifications route, settings list, `NotificationSettings`, and `NotificationSetting` component boundaries.
- Added `NotificationPreferenceSetting` so the settings body maps each notification type to a dedicated row owner like Midday's `NotificationSetting`, while preserving Plot Keys' local notification taxonomy, tenant-backed `listPreferences` query, email/in-app channels, checkbox labels, pending-disabled state, and exact preference invalidation behavior.
- Removed the remaining local `type="submit"` prop from the integrations settings save `SubmitButton`, matching the already migrated settings-card save-button call surface while preserving form submission through the enclosing form, pending spinner behavior, disabled state, mutation invalidation, and footer layout.

## 2026-07-17 — Midday Dashboard User Menu Row Parity

- Continued the remaining dashboard/page parity audit by comparing the split Plot Keys dashboard user menu against Midday's `UserMenu` and `SignOut` references.
- Aligned editable settings save-button call surfaces with Midday's `CompanyName` settings-card reference by removing local `type="submit"` props from the company name and primary market `SubmitButton` calls while preserving form submission, pending spinner behavior, disabled state, mutation invalidation, and card footer layout.
- Aligned settings read-only cell value typography with the migrated Midday settings/detail class contract by adding explicit `text-sm` before `font-semibold text-foreground`, preserving plan/status badges, billing upgrade link behavior, read-only labels, and disabled danger action behavior.
- Aligned the shared `SecondaryMenu` active-tab class contract with Midday's settings/account menu reference by moving the active `text-primary` token before `font-medium`, preserving settings layout routing, tab labels, prefetch behavior, underline treatment, and the Plot Keys page-owned `ScrollableContent` wrapper.
- Moved `GlobalSheetsProvider` below the dashboard page content inside `DashboardChrome`, matching Midday's global overlay mount position after children while keeping it under `SiteNav.Provider` so Plot Keys global search still has nav context; sheet registry entries, URL-state ownership, and page rendering behavior remain unchanged.
- Extracted dashboard sign-out behavior into a local `SignOut` dropdown item component like Midday's `SignOut`, leaving `DashboardUserMenu` focused on avatar/menu/profile/settings composition while preserving Plot Keys' session clearing, pending sign-out label, disabled duplicate-submit guard, `/sign-in` redirect, router refresh, and the Midday-style `data-track="User Signed Out"` attribute.
- Added `Icon.ArrowUpward` and `Icon.ArrowDownward` aliases and switched the search modal footer arrow affordances to those Midday-named icons, preserving the underlying glyphs, footer layout, command-key strip, and existing `ArrowUp` / `ArrowDown` compatibility aliases.
- Aligned the search modal footer return-key affordance with Midday's icon-based footer: added a central `Icon.SubdirectoryArrowLeft` fallback and replaced the local text return glyph with the shared icon while preserving footer dimensions, border/background classes, logo mark, arrow-key affordances, and the existing global search modal composition.
- Aligned shared `SiteNav` list structure with Midday's `MainMenu` by moving the `mt-4 w-full` wrapper onto an outer div and keeping `nav` as the inner `w-full` element, preserving Plot Keys' flattened registry, deduping, active-state calculation, explicit item expansion, and mobile close behavior.
- Re-aligned shared `SiteNav` item and child-item class contracts with Midday's `MainMenu`: menu background rows, icon cells, label rows, chevron buttons, child-row transitions, and child-label utility order now mirror the reference source more closely while preserving Plot Keys' generalized link registry, active-child detection, explicit expansion state, mobile close behavior, and fallback icon handling.
- Aligned the shared mobile navigation trigger with Midday's `MobileMenu` call shape: the outline/icon button now follows the reference prop ordering, the menu icon uses the reference `size={16}` call form, and `SheetContent` orders `side` before className while preserving Plot Keys' accessibility label, explicit button type, sr-only navigation title, shared nav list, and close-on-select behavior.
- Tightened the dashboard header top-right chrome to Midday's `Header` / `UserMenu` class contract by matching the action-group class order and removing the local `items-center` addition, and by aligning the user-menu secondary label to Midday's `text-xs text-[#606060] font-normal` ordering while preserving notification, theme, avatar, settings, and sign-out behavior.
- Re-aligned the shared `SiteNav.Sidebar` shell and Plot Keys logo strip with Midday's sidebar class contract: the aside class grouping, main-menu wrapper ordering, and logo rail ordering now mirror the reference more closely, and the local `text-sidebar-foreground` sidebar residue was removed while preserving shared nav expansion, delayed hover behavior, no-sidebar opt-out, logo placement, and nav rendering.
- Consolidated Dashboard Home's one-use header/stat/section skeleton wrapper files into `dashboard/home/skeleton.tsx`, matching Midday's overview skeleton pattern where related loading placeholders live together in one feature skeleton module, while preserving the same header, stat-card, and section placeholder geometry.
- Inlined the one-use notification bell trigger into `NotificationBell` so the popover owner directly owns the header button, icon, unread badge, and screen-reader label while preserving the existing content/item modules, unread count display, recent notification rendering, empty state, and notifications route link.
- Inlined the one-use dashboard user-menu trigger and content wrappers into `DashboardUserMenu` so the avatar trigger, dropdown profile row, settings item, separator layout, and sign-out item are owned directly by the menu component like Midday's `UserMenu`, while preserving Plot Keys' initials fallback, settings route, pending sign-out label, session clearing, sign-in redirect, and router refresh behavior.
- Inlined the no-prop publish and recommendation modal header wrappers back into their dialog owners so the builder modal shells directly own `DialogHeader`, `DialogTitle`, and `DialogDescription` like Midday modal references, while preserving disabled publish chrome, summary/live-note modules, recommendation fields, profile summary, error handling, footer actions, mutations, and close behavior.
- Inlined the no-prop `BuilderSidebarDrawerHeader` wrapper into `BuilderSidebarDrawer` so the builder settings sheet shell directly owns its `SheetHeader` and title, while preserving the documented `BuilderSidebarDrawerContent` body split, URL-backed open state, left-side sheet shell, and builder controls.
- Inlined the one-use `PropertyDetailsHeader` wrapper into `PropertyDetails` so the property detail body directly owns its `SheetHeader`, not-found state, subtitle, featured/publish badges, and detail content like the Midday customer detail component, while preserving publish-state badge variants, listing availability copy, and media/detail behavior.
- Inlined the one-use customer detail header, unavailable, and row wrappers into `CustomerDetails` so the customer detail body owns its `SheetHeader`, not-found state, status badge, formatted detail rows, and row layout like Midday's customer detail component while preserving loading behavior, status variant mapping, query placeholder data, date formatting, and sheet layout.
- Inlined the one-use `CustomerEditSheetHeader` wrapper into `CustomerEditSheet` so the edit-customer sheet directly owns its `SheetHeader`, action dropdown, and delete confirmation like Midday's customer edit sheet, while preserving Plot Keys' delete pending state, disabled dialog actions, delete copy, cache invalidation, and URL close behavior.
- Inlined the one-use `PropertyDetailsContent` wrapper into `PropertyDetailsSheet` so the property details sheet now directly owns its `SheetContent` and `PropertyDetails`, matching Midday's customer details sheet shape while preserving detail URL close behavior and the 620px sheet width.
- Inlined the one-use `CustomerContent` wrapper into `CustomerCreateSheet` so the create-customer sheet now directly owns `SheetContent stack`, the stacked Midday-style header, `CustomerFormContext`, and `CustomerForm`, matching Midday's customer create sheet ownership while preserving close, cancel, success, and URL-param behavior.
- Split the dashboard global-search command body into `components/search/search.tsx` so `search-modal.tsx` now matches Midday's wrapper ownership (`Dialog` / hotkey / conditional `Search` / `SearchFooter`), moved `SearchModal` into `GlobalSheets`, and shifted `GlobalSheetsProvider` from the app layout into the `SiteNav.Provider` dashboard shell so search keeps its nav context while following Midday's global overlay owner; `OpenSearchButton` now uses Midday's explicit `size={18}` search-icon call shape, the modal uses Midday's `meta+k` hotkey registration, and the search body owns the Escape hotkey like Midday while preserving Plot Keys' SiteNav-derived results, tenant-aware routing, command item labels, and icon namespace.
- Rechecked the remaining shared `Card` surfaces against Midday's app-card and settings-card references: App Store/Integrations app tiles, Integration Settings, Notification Preferences, logo upload, and workspace settings remain intentional `Card` patterns, while settings and integration save actions now use the reference `isSubmitting`-before-`disabled` `SubmitButton` call shape and editable settings inputs keep their local class override before the autoComplete/autoCapitalize/autoCorrect/spellCheck block.
- Rechecked App Store and Integrations card surfaces against Midday's `UnifiedAppComponent` and kept their shared `Card` anatomy intentional, then aligned mapped app-card `Card` prop order and outline action `Button` prop order while preserving app availability, plan-gated upgrade, enable toggles, integration configure/docs links, and skeleton card layout.
- Cleared the dev quick-fill helper's dashed panel residue by moving it to the same plain `border border-border` shared-token strip used by migrated dev helper chrome, and aligned its compact preset button prop order while preserving the production guard, preset labels, and fill callbacks.
- Removed the remaining builder template picker square-avatar override so the template initials now use the shared Midday-shaped `Avatar` / `AvatarFallback` contract with only size and text classes supplied locally, preserving template selection, locked-template state, usage counts, and template labels.
- Replaced Template Sandbox's generated-websites dashed no-data panel with a Midday-style centered empty state using the app/connectors empty-state text hierarchy, and aligned the nearby clone/archive button prop order while preserving profile generation, configure/preview links, clone/archive mutations, and profile count behavior.
- Aligned the agent pending-invites list with the already migrated staff/team invite list shell by replacing the dashed standalone panel with the table-like `border-x border-b border-border` treatment, matching the heading wrapper, and restoring the destructive revoke action tone while preserving invite filtering, dev links, revoke mutation, and cache invalidation.
- Cleared the remaining exact active dashboard `font-medium text-sm` typography residues and the nearby `size`-before-`variant` button call residue across AI credits, billing, invite lists, notification preferences, property media, and blog empty actions while preserving all copy, row data, invite revocation, media actions, and create-post behavior; the shared table core empty-state title intentionally keeps Midday's exact `font-medium text-lg` reference ordering.
- Re-aligned the shared table core empty-state shell with Midday's exact `tables/core/empty-states.tsx` reference for the title class and default outline action button prop shape while preserving Plot Keys' optional custom action support used by create actions and permission-gated empty states.
- Confirmed the active dashboard TSX source no longer has raw `<select>` / `<option>` elements or `NativeSelect` usage after the focused form/project placeholder migration passes; remaining parity work can move beyond select primitives.
- Replaced the project customer-access grant and notice former placeholder selectors with controlled Midday-shaped shared `Select` controls using a local sentinel mapped back to the existing empty-string guard, preserving required-customer validation, email/customer labels, FormData payloads, cache invalidation, and post-success reset flow.
- Replaced the project team member former placeholder selector with a controlled Midday-shaped shared `Select` using a local sentinel mapped back to the existing empty-string guard, preserving required-member validation, available-member filtering, role submission, assignment mutation, cache invalidation, and post-success reset flow.
- Replaced the payroll entry required employee native select with a controlled Midday-shaped shared `Select` using a local sentinel mapped back to the existing empty-string form value, preserving employee validation, disabled empty-employee submission guard, salary labels, payroll payload, summary/list invalidation, and form reset flow.
- Replaced the leave-request required employee native select with a controlled Midday-shaped shared `Select` using a local sentinel mapped back to the existing empty-string form value, preserving employee validation, disabled empty-employee submission guard, request payload, cache invalidation, and form reset flow.
- Replaced the project milestone optional phase native select with a controlled Midday-shaped shared `Select` using a local sentinel mapped back to `null`, preserving no-phase behavior, selected phase IDs, FormData submission, cache invalidation, and post-create form reset.
- Replaced the appointment form optional agent native select with a controlled Midday-shaped shared `Select` using a local sentinel mapped back to the existing empty-string form value, preserving optional assignment semantics, create payload undefined conversion, appointment list/stat invalidation, and form reset flow.
- Replaced the project create form type placeholder native select with a controlled Midday-shaped shared `Select` using a local sentinel mapped back to the existing empty-string form value, preserving optional project type semantics, quick-fill compatibility, create payload null conversion, cache invalidation, and form reset flow.
- Replaced the property form listing-type placeholder native select with a controlled Midday-shaped shared `Select` using a local sentinel mapped back to the existing empty-string form value, preserving optional listing-type semantics, land-listing conditional fields, create/edit payload null conversion, quick-fill behavior, and form reset flow.
- Replaced the payroll entry month native select with a controlled Midday-shaped shared `Select`, preserving month labels, string month form values, numeric payload parsing, default/reset period values, payroll summary/list invalidation, and add-entry behavior.
- Replaced the leave-request type native select with a controlled Midday-shaped shared `Select`, preserving leave-type enum values, default annual type, label mapping, request payload, cache invalidation, and form reset flow.
- Replaced the estate launch publish-state native select with a controlled Midday-shaped shared `Select`, preserving draft/published/archived enum values, estate default/reset values, update payload, cache invalidation, quick-fill compatibility, and launch save behavior.
- Replaced the property form featured native select with a controlled Midday-shaped shared `Select`, preserving the `"false"` / `"true"` schema values, default create/edit values, boolean payload conversion, quick-fill behavior, cache invalidation, and form reset flow.
- Replaced the property form status native select with a controlled Midday-shaped shared `Select`, preserving the active/sold/rented/off-market enum values, default active value, property create/edit payload, quick-fill behavior, cache invalidation, and form reset flow.
- Replaced the project budget-line category native select with a Midday-shaped shared controlled `Select` inside the existing `FormField`, preserving budget category enum values, default other value, label mapping, budget-line payload, cache invalidation, reset, and router refresh flow.
- Replaced the project workforce pay-basis native select with a Midday-shaped shared controlled `Select` inside the existing `FormField`, preserving the pay-basis enum values, default daily value, label mapping, project worker payload, cache invalidation, reset, and router refresh flow.
- Replaced the invite-employee work-role native select with a controlled Midday-shaped shared `Select`, preserving the employee work-role value set, default operations role, label mapping, quick-fill adapter compatibility, and staff invite mutation payload.
- Replaced the invite-member role native select with a controlled Midday-shaped shared `Select`, preserving the admin/agent/staff enum values, default staff role, descriptive option labels, quick-fill adapter compatibility, and team invite mutation flow.
- Replaced the agent form's featured native select with a controlled Midday-shaped shared `Select`, preserving the `"false"` / `"true"` schema values, default create/edit values, boolean payload conversion, quick-fill adapter compatibility, and agent create/update mutation flow.
- Replaced the customer sheet form's status native select with the Midday-shaped shared controlled `Select` field, preserving the active/VIP/inactive values, existing `FormField` validation ownership, customer create/update payload behavior, and sheet form reset/invalidation flow.
- Replaced the project customer-access level form's no-empty native select with the Midday-shaped shared `Select` primitive, preserving `name="level"`, default overview submission, access-level labels/options, grant-access behavior, and the separately migrated customer placeholder selectors.
- Replaced the project team role form's no-empty native select with the Midday-shaped shared `Select` primitive, preserving `name="projectRole"`, default viewer submission, role labels/options, assignment behavior, and the separately migrated membership placeholder selector.
- Replaced property media upload's no-empty native selects with the Midday-shaped shared `Select` primitive for media type and cover status, preserving `name="kind"`, `name="isCover"`, default submitted values, labels, options, and property media upload behavior.
- Replaced the project update type form's no-empty native select with the Midday-shaped shared `Select` primitive, preserving `name="kind"`, the default general update submission, labels, options, and project update creation behavior.
- Replaced the project issue severity form's no-empty native select with the Midday-shaped shared `Select` primitive, preserving `name="severity"`, the default low severity submission, labels, options, and issue creation behavior while avoiding placeholder/registered native-select cases that need a more careful migration.
- Replaced Template Sandbox's controlled create-profile native selects with the Midday-shaped shared `Select` primitive for template and plan selection, preserving form field names, defaults, submitted values, catalog labels, and profile creation behavior; the later dashboard-wide audit confirmed no active dashboard TSX raw/native select residue remains.
- Removed the last active dashboard `ButtonGroup` dependency from the builder template preview header and reshaped the template previous/next controls to Midday's bordered flex shell with ghost compact icon buttons, preserving back navigation, template cycling callbacks, theme toggle, and picker behavior.
- Matched the shared dashboard search-field and generic search-filter search icon classes to Midday's references by removing the local explicit `size-4` token from the absolutely positioned search icon while preserving query-state behavior, input props, filter menu handling, and spacing.
- Aligned the remaining local domain/billing muted metadata order where it diverged from the migrated size-before-tone convention: domain status/helper text and billing plan date metadata now use `text-sm/text-xs` before the raw Midday muted color token while preserving all metadata copy and panel layout.
- Normalized the remaining auth/invite/estate page heading-label order to the migrated Midday typography shape: signup and verify-email side-panel labels now use `text-sm font-medium ...`, and invite/estate page headings now use `text-2xl font-semibold ...` while preserving all copy, auth handoff behavior, invite states, and estate header content.
- Aligned estate launch/detail card headings and property detail analytics/media headings with Midday detail/value typography ordering (`text-base font-medium`, `text-lg font-medium`) while preserving estate plan/group content, upload behavior, property analytics values, media management, and sheet layout.
- Aligned billing plan-card typography with the Midday plan/detail value ordering by moving the current plan label, tier labels, and plan price to size-before-weight class order while preserving tier labels, pricing, checkout behavior, current-plan disabling, and interval copy.
- Removed the remaining active dashboard `tracking-normal` typography residue from migrated page headers, public sign-in headings, summary/stat values, and project/domain/billing/integration/template headers after confirming Midday's dashboard references do not carry that utility on equivalent heading or metric text; copy, values, colors, routes, and layout structure were preserved.
- Aligned the remaining custom-domain panel headings with the Midday invoice/detail heading order by moving domain control, DNS hostname, and hostname-intake labels to size-before-weight typography (`text-base font-medium` / `text-sm font-semibold`) while preserving all domain setup copy, DNS instructions, and provisioning behavior.
- Normalized the remaining active dashboard error `Alert` call shapes that combined `variant="destructive"` with local spacing/size classes so onboarding, join-complete, invite revocation, domain provisioning/table errors, project mutation errors, and builder preview errors now use the same variant-first component prop ordering already applied to migrated button/badge surfaces, without changing alert variants, class strings, copy, or behavior.
- Tightened the editable settings card input/save-button shape: company name and primary-market inputs now keep the local class override before the autoComplete/autoCapitalize/autoCorrect/spellCheck block, and settings save `SubmitButton` calls now follow the Midday settings-card `isSubmitting`-before-`disabled` order.
- Aligned the compact notification popover with the migrated Midday utility conventions by adding explicit `border-border` edge tokens, moving the header label to size-before-weight order, and converting notification row conditional classes to shared `cn`; the onboarding checklist also now uses shared `cn` instead of a template-string class join while preserving current/done/upcoming states.
- Removed stale shadcn-era `data-slot=select-viewport` selectors from Template Sandbox floating select popovers after confirming the shared Midday-shaped select primitive no longer emits those hooks, and aligned the remaining floating rail tiny-label plus notification count text classes to Midday's size/weight/tone ordering while preserving popper placement, mutation states, and count behavior.
- Cleared another focused set of active dashboard text and border ordering residues: Estate Detail stage metrics, builder preview footer headings, and dashboard user menu secondary text now follow Midday's size/weight/tone ordering, and Analytics list separators now use side-before-token border ordering while preserving raw reference colors and list behavior.
- Cleared the active dashboard `Button` / shared `SubmitButton` `size`-before-`variant` call-shape residues across link/header actions, quick-fill, blog editor/detail actions, stacked sheet close controls, project actions/AI/phases/milestones/issues/updates, export CSV, builder template preview navigation, and bulk table actions while preserving routes, mutations, disabled states, labels, and icon behavior.
- Flattened the development helper FAB surface to the shared Midday-shaped `Button` and square bordered panel treatment, and neutralized dev tenant/signup/quick-fill helper chrome from amber-only local styling to shared border/background/muted tokens while preserving dev-only guards, preset fill callbacks, tenant links, and toggle behavior.
- Aligned the Estate Detail land-price warning label with Midday's size/weight/tone text ordering while preserving the warning color and property price content.
- Cleared the remaining active dashboard `Badge` call-shape residues under `apps/dashboard/src/app` and `apps/dashboard/src/components` so reports, domains, customer/property details, notification metadata, blog status, table status/type cells, builder template controls, flow shell, and notification header status chips now use Midday's `variant`-first prop ordering without changing variants or labels.
- Cleared the remaining active dashboard `Button` call-shape residues under `apps/dashboard/src/app` and `apps/dashboard/src/components` so sign-in launch, estate launch asset links, pricing-plan add action, blog delete action, builder picker trigger, and shared bulk delete action now follow Midday's `variant`-first prop ordering without behavior changes.
- Aligned builder/template control buttons with Midday's `variant`-first call shape across Template Sandbox shuffle/export actions, builder AI generation, builder drawer trigger, and focused-field editor actions while preserving pending states, tooltips, drawer behavior, and save/fill mutations.
- Re-aligned the shared `HorizontalPagination` table control with Midday's exact component shape by matching import order, interface props, and `Button` prop order while preserving Plot Keys' icon namespace and scroll behavior.
- Aligned another focused set of multiline shared `Button` calls with Midday's `variant`-first call shape across sign-in, sign-out, recommend-template, and domain-remove actions while preserving labels, disabled states, destructive styling, and mutation behavior.
- Cleared the remaining dashboard single-line `Button` prop-order residue where local calls placed `className` before `variant`, aligning billing, builder template picker, notification bell, notification menu, and sign-in create-account actions with the Midday `variant`-first button call shape without changing behavior.
- Aligned the shared dashboard `SearchField` with Midday's app/search-field setter and input prop shape by removing local `void setSearch(...)` calls and matching the reference `autoComplete` / `autoCapitalize` ordering while preserving the existing Plot Keys icon namespace and explicit icon sizing.
- Aligned the App Store app-card surface and skeleton with Midday's `UnifiedAppComponent` anatomy by normalizing app-grid/card/header/content/action class ordering, switching enabled cards to the positive `Installed` pill, and removing local title-side `Available` / `Locked` status pills while preserving Plot Keys' plan-gated upgrade action and enable/disable toggle behavior.
- Aligned the Integrations overview grid and loading skeleton with Midday's Apps grid density by moving from the local two-column grid to the reference responsive app grid and 12-card skeleton, normalized integration tile class ordering against Midday's `UnifiedAppComponent` card anatomy, and matched its positive installed-pill behavior by removing the local "Not connected" title pill while preserving configure/docs behavior.
- Aligned integration settings credential inputs with Midday settings-card input prop shape by switching the remaining boolean `spellCheck={false}` to the reference `spellCheck="false"` form while preserving the existing settings form and mutation flow.
- Replaced the remaining dashboard raw red utility tokens with Midday-style destructive tokens for error/negative states in project budget variance, the dev tenant FAB error copy, and Template Sandbox floating field mutation-error chrome.
- Aligned the Template Sandbox floating configuration rail with Midday's square bordered control treatment by removing local rounded rail, row, icon-frame, and bottom-action button chrome while preserving expanded/collapsed behavior, tooltips, shuffle/live actions, and export links.
- Aligned Blog detail header/section label, title, and description class ordering with the remaining Midday detail/settings text conventions while preserving the editor page structure, actions, status badges, and update/delete behavior.
- Aligned Project and Estate detail/subpage headers and section title/description class ordering with the same Midday detail/settings text conventions while preserving their badges, navigation, open-sheet actions, and mutation controls.
- Aligned Domains, Connect Domain, Live Preview, and Integrations header/section text class ordering with the same Midday page/detail conventions while preserving their links, badges, counts, setup content, and operational actions.
- Aligned Billing, AI Credits, Dashboard Home, Analytics, Reports, and Template Sandbox header/section/card text class ordering with the same Midday page/detail conventions while preserving all tabs, actions, metrics, generated-profile behavior, and export controls.
- Aligned dashboard metric/stat card typography across Payroll, Blog, Estates, Projects, AI Credits, Customers, and Dashboard Home with the same Midday metric-card label/value/meta ordering while preserving counts, currencies, links, and budget variance color semantics.
- Aligned builder workspace/sidebar/template-preview text and metadata class ordering with the same Midday label/meta conventions while preserving template selection, preview navigation, editable-field counts, and configuration summaries.
- Cleared the remaining old-order dashboard text markers across builder, template sandbox, project workforce, billing, AI credits, domains, notification, invite, onboarding, sign-in, join, and property/detail surfaces so muted/destructive meta copy now follows the same Midday size-before-tone convention without changing behavior.
- Removed the last active dashboard `SheetTitle` / `SheetDescription` residue by moving the builder settings drawer header to the Midday-style `SheetHeader` plus visible `h2` pattern, and aligned the remaining builder dialog roots to Midday's `open` before `onOpenChange` prop order while preserving the left drawer shell, settings content, triggers, and mutation flows.
- Aligned the remaining builder preview/editor chrome with Midday's plain bordered control treatment by removing local rounded wrappers from preview page tabs, section hover labels, the focused field editor panel, template preview style/color controls, and the workspace configuration summary while preserving focus rings, swatches, page navigation, and editable-field behavior.
- Aligned remaining non-search-footer dashboard border class ordering with Midday's side-before-token convention (`border-b border-border`, `border-t border-border`, `border-x border-b border-border`) across invite lists, report/project tables, project skeletons, builder sidebars/skeletons, and shared sidebar shells; the search footer remains unchanged because it already matches Midday's exact `border border-border border-t-[0px]` reference.
- Cleared the remaining foreground/primary text class-order residues across estate detail, customer details, project workforce, flow shell, secondary navigation, dashboard publishing status, template sandbox controls, dev FAB, and notification rows so active label/value copy follows the same Midday size/weight/tone ordering used by the rest of the migrated dashboard surfaces.
- Reworked Dashboard Home quick actions to match Midday's widget quick-action anatomy more closely: actions are now data-driven icon+label links using the shared icon namespace, reference `cursor-pointer group` action chrome, group-hover icon color, and centered wrapping while preserving the existing Plot Keys destinations.
- Aligned the customer edit sheet action dropdown with Midday's edit-sheet menu prop order (`sideOffset={10}` before `align="end"`) while preserving the vertical dots trigger, delete confirmation, pending state, and destructive menu item styling.
- Moved the development pricing-plan QuickFill modal from the old wide `sm:max-w-xl` shell to Midday's compact `max-w-[455px]` dialog with an inner `p-4 space-y-4` body while preserving every field, template update, fill action, and development-only guard.
- Aligned Dashboard Home stat and connected-domain cards with Midday's `WidgetCard` shell contract by adding the reference `h-full`, `cursor-pointer group`, and class ordering, and matched the stat skeleton ordering to Midday's overview skeleton while preserving labels, counts, domain links, and empty-state content.
- Aligned the Dashboard Home connected-domains empty state wrapper with the same Midday overview widget-shell ordering (`border border-border p-5 min-h-[110px] flex ...`) while preserving the empty-state copy and domains link.
- Aligned compact builder modal summary cards with the same Midday-style border/background and title/meta class ordering: publish/recommend summaries now use `border bg-white border-[#e6e6e6]` shells and explicit size/weight/tone title classes, and the publish live-note highlight now uses explicit `text-xs font-medium text-foreground` while preserving copy and modal behavior.
- Aligned the settings danger-card disabled delete trigger and description copy with Midday's `DeleteTeam` / `DeleteAccount` danger-card surface while preserving the current no-op disabled state until a workspace deletion flow exists.
- Aligned editable settings card inputs and save actions with Midday's `CompanyName` settings-card contract by using the reference input prop shape, `spellCheck="false"`, and default `SubmitButton` sizing while preserving Plot Keys mutations and market-field semantics.
- Aligned the settings logo card wrapper/avatar/image/input prop ordering with Midday's `CompanyLogo` reference while preserving the existing `/api/upload` path, accepted file types, and workspace logo mutation.
- Aligned remaining settings read-only labels and workspace footer note class ordering with Midday's settings-card references while preserving Plot Keys billing/subdomain content.
- Removed the leftover icon-led settings/sign-out dropdown rows and aligned the avatar/menu content class ordering with Midday's plain `w-[240px]` user-menu surface.
- Aligned the shared search-filter dropdown root/content prop ordering with Midday's invoice search-filter shell while preserving generic filter definitions, chips, and date-range submenu behavior.
- Replaced the standalone builder template picker's hand-rolled rounded desktop dropdown trigger with the shared Midday-shaped builder picker button and added reference `sideOffset={10}` spacing for the dropdown selector.
- Removed duplicated local rounded/padded radio-item chrome from builder template, theme, font, and page dropdown selectors so the Midday-matched shared dropdown primitive owns item styling, while preserving multiline item content and locked-template behavior.
- Added explicit `sideOffset={10}` spacing to the remaining builder sidebar selector menus to match the Midday dropdown selector spacing contract.
- Aligned builder dropdown content prop ordering and font-group label styling with Midday selector references, removing the local label padding override while preserving grouped font options and save behavior.
- Preserved the local `/settings` navigation target, pending sign-out label, session clearing, router redirect, and compact initials avatar trigger.

## 2026-07-17 — Midday Embedded Customer Table Action Menu Parity

- Continued the table action-menu audit by checking embedded column-owned menus after the standalone `actions-menu.tsx` files had been normalized.
- Aligned the Customers table embedded `ActionsCell` wrapper to Midday's row-action class contract (`flex items-center justify-center w-full`), fixed the dropdown trigger indentation, and moved the ghost button prop order to `variant` before compact `className`.
- Preserved customer edit/detail/status/delete behavior, the delete confirmation dialog, row stop-propagation, and horizontal dots usage for table row actions.

## 2026-07-17 — Midday Customer Edit Sheet Menu Icon Parity

- Continued the non-shared sheet-header audit by comparing Plot Keys `CustomerEditSheetHeader` against Midday's customer/product/category edit sheet menu headers.
- Added a central `Icon.MoreVertical` fallback to the shared UI icon namespace and switched the customer edit sheet action trigger from horizontal dots to vertical dots, matching Midday's edit-sheet menu orientation.
- Preserved the existing accessible trigger label, button type, destructive alert flow, delete pending state, and horizontal dots usage in row action menus.

## 2026-07-17 — Midday Stacked Sheet Header Close Button Parity

- Continued the stacked sheet audit by comparing the shared Plot Keys `StackedSheetHeader` against Midday's create/edit sheet header references.
- Aligned the shared close button with Midday's `size="icon"` / `variant="ghost"` close-button contract and reference class ordering while retaining Plot Keys accessibility labels and explicit button type.
- Aligned optional sheet-description class ordering to `mt-1 text-sm text-[#808080]`.
- Preserved visible `h2` title ownership, close behavior, icon usage, and every active stacked sheet caller.

## 2026-07-17 — Midday Stacked SheetContent Prop Surface Parity

- Continued the sheet-content audit by comparing active Plot Keys stacked create/edit/invite sheets against Midday's stacked sheet references.
- Removed Plot Keys-only `title` props from stacked `SheetContent` usage across appointment, property, team invite, agent, payroll entry, leave request, project, employee invite, estate, department, customer edit/create content, and agent invite sheets.
- Preserved visible title ownership in `StackedSheetHeader`, close controls, form composition, URL close behavior, and sheet content stacking.

## 2026-07-17 — Midday Sheet Wrapper Prop Order Parity

- Continued the sheet wrapper audit by comparing active Plot Keys create/edit/invite/drawer sheets against Midday's create/edit sheet references.
- Normalized repeated sheet roots from local `onOpenChange`-before-`open` ordering to Midday's `open={isOpen}` before `onOpenChange={...}` shape across appointment, property, agent, employee invite, estate, customer, leave request, department, team invite, builder drawer, payroll entry, project, and agent invite sheets.
- Preserved every sheet's URL-state close behavior, `SheetContent` props, stacked headers, forms, drawer content, and mutation flows.

## 2026-07-17 — Midday Property Detail Sheet Header Parity

- Continued the detail-sheet audit by comparing Plot Keys property details against the Midday customer/document detail-sheet header and body patterns.
- Reworked `PropertyDetailsHeader` from generic `SheetTitle` / `SheetDescription` wrappers to Midday-style visible `h2` / muted paragraph text inside `SheetHeader className="flex justify-between items-center flex-row px-6 mb-4"`.
- Reworked the property detail body and not-found state to use the same full-height `h-full flex flex-col min-h-0 -mx-6` sheet structure with scrollable `px-6` content as the customer detail sheet pass, preserving analytics, detail rows, media upload, cover selection, and delete behavior.
- Aligned customer/property detail sheet wrapper prop ordering with Midday's `open` before `onOpenChange` shape.

## 2026-07-17 — Midday Builder Modal Shell Parity

- Continued the active dialog audit by comparing Plot Keys builder publish/recommend modals against Midday's compact modal composition.
- Reworked `PublishConfirmationDialog` and `RecommendTemplatePanel` from `sm:max-w-md` content directly under `DialogContent` to Midday's `max-w-[455px]` dialog shell with an inner `p-4 space-y-4` body.
- Preserved each modal's trigger, form fields, mutation flow, error handling, summary/live-note/profile result surfaces, and footer actions.

## 2026-07-17 — Midday Customer Detail Sheet Header Parity

- Continued the sheet/modal audit by comparing Plot Keys customer detail sheet helpers against Midday's customer detail sheet header/body pattern.
- Reworked the customer detail sheet body into Midday's full-height `h-full flex flex-col min-h-0 -mx-6` structure with a scrollable `px-6` content region, preserving the existing customer query, placeholder cache lookup, status badge, and detail rows.
- Replaced generic `SheetTitle` / `SheetDescription` usage in the customer detail header and unavailable state with visible `h2` / muted paragraph text inside Midday-style `SheetHeader` layout.
- Kept the simpler Plot Keys customer data contract intact instead of copying Midday-only enrichment, invoice statement, or portal actions that do not exist in the current API surface.

## 2026-07-17 — Midday Analytics And Reports Header Parity

- Continued the analytics/reports page audit by comparing Plot Keys analytics and reports routes against Midday's reports metrics page and widget-header layout.
- Removed the non-Midday workspace headline block from Analytics so the route now hands directly from `ScrollableContent` into the route error/suspense boundary and analytics content.
- Reworked Reports header ownership into a Midday-style right-aligned `py-6` control row for the period tab strip, removing the old title/description marketing block while preserving period URL state.
- Trimmed Analytics and Reports skeletons so loading states no longer reintroduce removed page-headline placeholders; Reports fallback now assumes the period control row is outside Suspense.

## 2026-07-17 — Midday Table Action Menu Wrapper Parity

- Continued the table action-menu audit by comparing Plot Keys row action dropdown triggers against Midday's invoice `ActionsMenu` reference.
- Aligned active table action menu wrappers to Midday's `flex items-center justify-center w-full` class-string contract across Agents, Appointments, Blog, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team.
- Aligned the repeated ghost icon trigger prop ordering with Midday's `variant` before compact `className` shape while preserving Plot Keys accessibility labels, stop-propagation boundaries, row mutations, links, and destructive item behavior.

## 2026-07-17 — Midday Column Visibility Popover Parity

- Continued the table/header control audit by comparing the shared `CoreColumnVisibility` adapter against Midday's invoice and customers column visibility popovers.
- Confirmed the trigger, outline icon button, Tune icon sizing, popover dimensions, hideable-column filtering, checkbox rows, visibility toggles, and label fallback behavior are Midday-aligned or intentional generic-table adaptations.
- Aligned the popover body class-string ordering with Midday's `flex flex-col p-4 space-y-2 ... overflow-auto` reference shape while preserving the shared 450px max height used by the broader table set.

## 2026-07-17 — Midday Filter Chip Date Range Formatting

- Continued the filter-chip audit by comparing Plot Keys generic `FilterList` against Midday's shared `filter-list` reference.
- Added the Midday `little-date` dependency to the dashboard package so route filter chips can use the same `formatDateRange(..., { includeTime: false })` behavior as Midday.
- Updated generic date-range filter chips to use `formatDateRange` when both start and end dates are present, while keeping the existing single-date fallback and Plot Keys generic `endValue` support.
- Preserved chip chrome, remove behavior, option-label lookup, boolean labels, array labels, and date-range paired clearing.

## 2026-07-17 — Midday Date Range Filter Reference Check

- Continued the search/filter audit by comparing Plot Keys `DateRangeFilter` against Midday's shared `date-range-filter` reference.
- Confirmed the preset select, two-month range calendar, date serialization, selected range handling, and calendar prop ordering already match the Midday component.
- Aligned the import grouping with the Midday reference.
- Identified the only remaining reference difference: Midday derives `weekStartsOn` from `user?.weekStartsOnMonday`, while Plot Keys currently has no dashboard user preference hook or `weekStartsOnMonday` data contract to read from. The component keeps the Sunday default until that user setting exists.

## 2026-07-17 — Midday Search Control Anatomy Parity

- Continued the page-header/filter audit by comparing shared `SearchField` and generic `SearchFilter` against Midday's `search-field` and invoice search-filter references.
- Aligned the shared search field wrapper, icon class ordering, input class ordering, handler naming, and `spellCheck` prop shape with Midday while preserving Plot Keys' explicit icon sizing.
- Aligned the generic search-filter wrapper class order, form submit shape, input prop order, and `spellCheck` prop shape with Midday's invoice search-filter anatomy.
- Preserved generic filter definitions, date-range filters, chip removal, `setFilters(null)` empty-search behavior, no-menu-filter support, and Plot Keys icon namespace usage.

## 2026-07-17 — Midday Header Link Tab Contract Cleanup

- Continued the route-based header-tab audit after moving status and period tabs onto the shared Midday strip wrapper.
- Removed the dead `HeaderLinkTab` variant type/prop and the remaining `variant="muted"` caller attributes from Billing interval tabs and Reports period tabs.
- Preserved the single Midday-shaped tab visual contract, Link-based URL navigation, active-state calculations, Billing interval behavior, Reports period behavior, and the shared tab-strip wrapper.

## 2026-07-17 — Midday Header Link Tab Strip Parity

- Continued the route-based header-tab audit after aligning individual `HeaderLinkTab` chrome with Midday tab triggers.
- Added a shared `HeaderLinkTabList` wrapper that owns Midday's contiguous tab-strip surface with `relative flex flex-wrap items-stretch bg-[#f7f7f7] dark:bg-[#131313] w-fit`.
- Replaced separated `gap-2` tab rows with the shared strip wrapper across Blog, Leads, Appointments, Employees, Projects, Leave Requests, Notifications, Payroll periods, Reports periods, and Billing interval tabs.
- Preserved route-based navigation, active-state calculations, counts, period labels, Billing savings copy, and the existing `HeaderLinkTab` prop surface.

## 2026-07-17 — Midday Header Link Tab Visual Parity

- Continued the active page-header audit by comparing Plot Keys list/status/period tabs with Midday's Apps, Transactions, and Inbox tab references.
- Reworked the shared route-based `HeaderLinkTab` class contract from the old inverted black active pill to Midday's tab trigger surface: `h-[34px]`, `text-[14px]`, transparent border, light/dark base backgrounds, and light/dark active backgrounds.
- Moved Payroll period tabs off their inline inverted link styling and onto `HeaderLinkTab`, keeping their route-based month/year navigation.
- Preserved Link-based navigation, active-state ownership, tab labels/counts, and the existing `variant` prop surface for Billing and Reports callers while making the visual treatment Midday-shaped.

## 2026-07-17 — Midday UI Cn Import Path Completion

- Continued the shared UI primitive audit by scanning for remaining compatibility `../lib/utils` imports after the active dashboard primitives had already moved to Midday's canonical `../utils` path.
- Repointed the remaining shared UI component and hook `cn` imports to the canonical `../utils` or `../../../utils` barrels across breadcrumb, item, kbd, menubar, pagination, resizable, sidebar, toggle, toggle-group, sticky-column hook, and legacy custom data-table helpers.
- Confirmed no `packages/ui/src` files still import `cn` from the old `lib/utils` compatibility path.
- Preserved component logic, class strings, exports, and the existing compatibility file for any external callers that still import it directly.

## 2026-07-17 — Midday Button Size Contract Parity

- Continued the shared primitive audit after active compact icon actions were migrated off Plot Keys-only button sizes.
- Compared the shared `Button` primitive against Midday's button reference and confirmed active dashboard code no longer calls the extra `xs`, `icon-xs`, `icon-sm`, or `icon-lg` size variants.
- Removed those unused Plot Keys-only size variants from `buttonVariants`, leaving the Midday size contract of `default`, `sm`, `lg`, and `icon`.
- Preserved button variants, default sizing, `asChild` behavior, and all active dashboard explicit compact icon classes.

## 2026-07-17 — Midday Compact Icon Button Size Parity

- Continued the remaining action-surface audit by scanning active dashboard components for Plot Keys-only button sizes that do not exist in the Midday button primitive.
- Replaced the remaining active `size="icon-sm"` usage with Midday-style explicit `h-8 w-8 p-0` compact icon button classes in the notification bell trigger, property pricing-plan remove control, and shared bulk delete action.
- Preserved each button's ghost/destructive styling, disabled state, accessible labels, unread badge placement, pricing-plan remove behavior, and bulk delete confirmation flow.
- Confirmed no active dashboard or SiteNav component still uses Plot Keys-only `icon-sm`, `icon-xs`, `icon-lg`, or `xs` button sizes.

## 2026-07-17 — Midday Bottom Bar Submit Action Parity

- Continued the remaining shared table audit by comparing Plot Keys table skeleton, empty states, table primitives, and bottom-bar helpers against the closest Midday table references.
- Confirmed the shared table skeleton and table primitive are already package-renamed Midday matches, with only intentional Plot Keys generic table extensions.
- Reworked the shared `BulkClientAction` helper to render through the Midday-style `SubmitButton` primitive so selected-row bulk actions get the same spinner-overlay pending behavior as Midday bottom-bar actions.
- Updated Leave Requests, Leads, Notifications, and Payroll bulk status/read/paid actions to pass mutation pending state through `isSubmitting` instead of only disabling the button.
- Preserved the shared `BottomBar` portal/motion/blur/deselect chrome, row-selection clearing, mutation handlers, and domain-specific bulk action labels.

## 2026-07-17 — Midday Core Table Header Sort Parity

- Continued the table parity audit by comparing shared `CoreDataTableHeader` against Midday's invoice `DataTableHeader` reference.
- Aligned the shared table header wrapper, row, primary-column wrapper, and horizontal-pagination class-string anatomy with the Midday invoice header reference.
- Swapped shared table sort indicators from chevron aliases to explicit `ArrowDown` / `ArrowUp` icons so ascending and descending states match Midday's sort icon semantics.
- Added explicit `ArrowDown` and `ArrowUp` aliases to the shared `Icon` namespace, also covering the new search footer keyboard affordance icons.
- Preserved generic table-id configuration, sticky columns, DnD column reordering, resizing, selection header ownership, sort query behavior, and horizontal scroll controls.

## 2026-07-17 — Midday List Header Row Class Parity

- Continued the page-header parity audit by comparing active dashboard list headers against Midday's `invoice-header` and `customers-header` references.
- Removed local `gap-3` additions from invoice-style header rows in Blog, Departments, Employees, Leave Requests, Notifications, Payroll, Projects, and Team headers so the search/action row uses Midday's `flex items-center justify-between` shape.
- Preserved stacked status-tab wrappers, search/filter components, column visibility controls, create/invite/open actions, permissions, and tab/period controls.

## 2026-07-17 — Midday Header Global Search Trigger Parity

- Continued the dashboard shell/header audit by comparing shared `SiteNav.Header` and `DashboardChrome` against Midday's `Header`, `OpenSearchButton`, and search-store references.
- Added a Midday-shaped `OpenSearchButton` to the dashboard header's left slot with the reference outline button class surface, search icon, "Find anything..." label, `data-track="Search Opened"`, and command-key affordance.
- Added a small Zustand-backed search store matching Midday's open/toggle ownership pattern.
- Added a `SearchModal` mounted inside `SiteNav.Provider` so it can search the current permission-filtered SiteNav registry and navigate with the tenant-aware router.
- Aligned the search modal wrapper with Midday's `Dialog` / transparent `DialogContent` / `search-container` / `global-search-list` / footer structure, while keeping the current registry-backed result source until backend global search exists.
- Preserved the existing notification bell, theme toggle, user menu, tenant link behavior, and builder route header escape.

## 2026-07-17 — Midday SiteNav Flat Main Menu Behavior Parity

- Continued the sidebar parity audit by comparing shared `NavsList`, `NavItem`, and `NavChildItem` against Midday's flat `MainMenu` reference.
- Flattened the rendered navigation list across dashboard registry modules/sections so app-store grouping remains a data concern but no longer renders visible module headers or section labels in the sidebar.
- Replaced the old module-expansion plus hover-delayed child reveal behavior with Midday's explicit per-item expanded state that resets when the sidebar expands or collapses.
- Preserved permission-filtered registry input, first-seen duplicate href deduping, active-link detection, custom tenant `Link` integration, and mobile expanded rendering.
- Added Midday child-link transition delay support to the shared child item guide-line treatment.

## 2026-07-17 — Midday SiteNav Mobile Sheet And Shell Container Parity

- Continued the sidebar parity audit by comparing shared `SiteNav.Sidebar` / `MobileSidebar` against Midday's `sidebar` and `mobile-menu` references.
- Replaced the desktop sidebar's nested outer `nav` wrapper with a plain flex container, matching Midday's sidebar container ownership and leaving `NavsList` as the semantic navigation landmark.
- Removed the stale sidebar-token scroll/padding wrapper classes from the desktop menu container and aligned it with Midday's `border-border`, bottom border, `pt-[70px]`, and `mb-3` shape.
- Rebuilt `MobileSidebar` on shared `Button`, `Sheet`, `SheetContent`, `Icon.Menu`, and `PlotKeysLogo` primitives, matching Midday's mobile sheet architecture instead of the old custom overlay/sidebar-token drawer.
- Added `@plotkeys/ui` as a workspace dependency of `@plotkeys/site-nav` so shared navigation can use the Midday-aligned UI primitives directly.

## 2026-07-17 — Midday SiteNav Item Chrome Parity

- Continued dashboard sidebar audit by comparing shared SiteNav nav items, child items, and list wrapper against Midday main-menu item and child-item references.
- Reworked shared nav item active/background/icon/text/chevron classes from sidebar-token hover boxes to Midday's explicit light/dark active surface, text-primary hover emphasis, 40px icon cell, and 20px icon sizing.
- Reworked shared child nav items from boxed mini rows to Midday's indented 32px guide-line text treatment.
- Removed local inner nav overflow/bottom padding from `NavsList` so the sidebar shell owns scroll and padding like Midday.
- Preserved generalized nav modules, active-link detection, hover child reveal, custom Link integration, and mobile/sidebar shell behavior.

## 2026-07-17 — Midday SiteNav Sidebar Shell Parity

- Continued the remaining dashboard shell/sidebar audit by comparing Plot Keys `DashboardChrome`, shared `SiteNav.Header`, `SiteNav.Sidebar`, and dashboard sidebar logo rail against Midday's header/sidebar references.
- Confirmed `ScrollableContent` already matches Midday's transform/transition behavior and `SiteNav.Header` carries Midday's header class/scroll transform shape.
- Aligned the shared `SiteNav.Sidebar` shell with Midday's sidebar container anatomy by switching the outer shell to `border-border border-r bg-background`, adding `items-center`, `pb-4`, and desktop top/bottom-left rounding.
- Preserved the shared nav model, hover expansion delay, `NavsList`, children slot, no-sidebar escape, dashboard logo rail, and existing nav item token behavior.

## 2026-07-17 — Midday Settings Secondary Menu Layout Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys settings layout and `SecondaryMenu` against Midday's settings layout and secondary-menu references.
- Confirmed the shared `SecondaryMenu` component is an exact package-renamed match for Midday's `secondary-menu` component.
- Aligned the settings layout inner container with Midday's `max-w-[800px]` shape by removing the local `mx-auto w-full` additions.
- Preserved Plot Keys' page-owned `ScrollableContent` wrapper for settings because active dashboard routes own scroll containers per page, while Midday's settings layout sits under a different parent shell.

## 2026-07-17 — Midday App Store Tabs Reference Parity

- Continued the remaining dashboard/page parity audit by comparing Plot Keys App Store tabs/header against Midday's `apps-tabs` and `apps-header` references.
- Confirmed the App Store header already matches Midday's tab plus search-field wrapper shape.
- Aligned `AppStoreTabs` prop ordering and class-string anatomy with Midday's `AppsTabs` reference while preserving Plot Keys package imports, component naming, query-state behavior, and tab labels.
- Confirmed the shared column visibility popover remains aligned with Midday's invoice column visibility contract, with the intentional Plot Keys generalization for `meta.headerLabel` labels.

## 2026-07-17 — Midday Open Sheet Trigger Wrapper Parity

- Continued the remaining dashboard/page parity audit by comparing active `Open*Sheet` trigger components against Midday's `open-invoice-sheet`, `open-customer-sheet`, and `open-tracker-sheet` references.
- Restored the Midday wrapper anatomy around active open/create/invite sheet trigger buttons across Property, Customer, Agent, Project, Agent Invite, Employee Invite, Team Invite, Appointment, Department, Leave Request, Payroll Entry, Estate Create, and Estate Launch Details triggers.
- Preserved each trigger's existing `setParams(...)` URL-state behavior, `variant="outline"`, `size="icon"`, icon namespace usage, optional project `className` prop, and PlotKeys accessibility labels.
- Validation: focused scans confirmed active `open-*sheet.tsx` triggers now return the wrapper shape and retain icon outline button state.

## 2026-07-17 — Midday List Header Action Group Parity

- Continued the remaining dashboard/page parity audit by comparing active list/table page headers and open-button groups against Midday's `invoice-header` and `open-invoice-sheet` references.
- Normalized invoice-style header action groups to Midday's `hidden sm:flex space-x-2` anatomy across Properties, Projects, Blog, Employees, Agents, Customers, Departments, Leads, Leave Requests, Payroll, Appointments, Team, and Notifications actions.
- Removed nested mobile-hiding wrappers around create/invite/open-sheet actions where the shared header action group now owns the responsive visibility.
- Preserved each page's search/filter component, status tabs, column visibility controls, invite/create/open-sheet permissions, and action ordering.

## 2026-07-17 — Midday SearchFilter Clear Behavior Parity

- Continued the remaining dashboard/page parity audit by comparing the shared generic `SearchFilter` against Midday's `invoice-search-filter` reference after the route-boundary exception audit.
- Confirmed active dashboard class-helper imports already use the Midday-style `@plotkeys/ui/cn` path, while remaining `@plotkeys/utils` imports are domain utilities rather than class composition helpers.
- Confirmed the reusable table sticky, resize, header, select-column, virtual-row, and bottom-bar layers remain aligned with the closest Midday invoice table references or are intentional domain-table generalizations.
- Aligned shared `SearchFilter` empty-input behavior with Midday by clearing the full filter state with `setFilters(null)` when the search field is emptied instead of only clearing the active search key.
- Preserved submit behavior, Escape clearing, filter chips, date-range filter removal, option selection, no-menu-filter mode, and existing generic filter definitions.

## 2026-07-17 — Midday Route Boundary Exception Audit

- Continued the remaining dashboard/page parity audit by rechecking authenticated `(app)` page files for `ScrollableContent`, `ErrorBoundary`, `Suspense`, and `HydrateClient` ownership.
- Confirmed the remaining `ScrollableContent` / `ErrorBoundary` / `Suspense` omissions are intentional route exceptions: settings pages inherit the settings layout shell and match Midday's settings subroute shape, billing callback and property detail pages are redirect/control-flow routes, and builder preview remains a full-screen preview route with its own boundary/skeleton.
- Confirmed the remaining non-hydrated content routes are intentionally client-owned or static route shells: App Store, Live Preview, and Connect Domain own route scroll/error/suspense boundaries but do not server-prefetch query data at the page boundary.
- Confirmed `joinClasses` is not a Midday dashboard pattern and remains outside the dashboard shell/pages migration path; Midday and the migrated UI primitives use the shared `cn` utility shape.
- No source changes were needed in this pass because the inspected route-boundary hits are reference-aligned exceptions rather than stale page composition.

## 2026-07-17 — Midday Table Action Trigger Parity

- Continued the remaining dashboard/page parity audit by comparing active table action-menu triggers against Midday's invoice table action menu reference.
- Added Midday's `className="relative"` trigger wrapper class to active table action dropdown triggers across Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team.
- Preserved each table action menu's ghost icon button, accessible labels, row mutation handlers, navigation actions, confirmation dialogs, and dropdown content.
- Validation: focused scans confirmed active table action triggers now carry `asChild className="relative"` and scoped whitespace validation passed.

## 2026-07-17 — Midday Dropdown Destructive Item Parity

- Continued the remaining dashboard/page parity audit by checking active table action menus and user menu dropdowns after the primitive `cn` import cleanup.
- Reworked destructive `DropdownMenuItem` usages in Employees, Projects, Appointments, Team, Properties, Customers, Agents, Departments, Leave Requests, and the dashboard user sign-out menu from the retired primitive-owned `variant="destructive"` prop to Midday-style `className="text-destructive"` styling.
- Preserved all delete/cancel/reject/remove mutation handlers, disabled states, confirmation dialog triggers, user sign-out behavior, and non-dropdown destructive button/bulk-action variants.
- Validation: focused scans confirmed active `DropdownMenuItem` usages no longer pass `variant="destructive"`, remaining destructive variants are alerts/buttons/bulk actions, and scoped whitespace validation passed.

## 2026-07-17 — Midday Active Primitive Cn Import Parity

- Continued the remaining dashboard/page parity audit by checking active shared UI primitives after the sheet/dialog `cn` import cleanup.
- Aligned `button`, `empty`, `native-select`, `field`, `input-group`, and active builder `button-group` with the canonical `../utils` `cn` import path used by Midday-aligned primitives, removing their old `../lib/utils` compatibility-shim imports.
- Preserved the existing button variant/size contract, migrated empty-state primitives, PlotKeys native-select adapter behavior, dashboard form field/input-group behavior, and builder preview header grouped-button behavior.
- Validation: focused scans confirmed the six active dashboard-facing primitives now import `cn` from `../utils`, no `../lib/utils` residue remains in those files, and scoped whitespace validation passed.

## 2026-07-17 — Midday Stacked Sheet Header Parity

- Continued the remaining dashboard/page parity audit by comparing shared stacked sheet headers against Midday create/edit sheet references.
- Reworked `StackedSheetHeader` from `SheetTitle` / `SheetDescription` wrappers and local `items-start` / `gap` / `p-0` chrome to Midday's visible `h2`, optional muted description paragraph, and `mb-6 flex justify-between items-center flex-row` header shape.
- Aligned the shared sheet close button class ordering with Midday's create/edit sheet close controls.
- Aligned the Customer edit sheet header class shape and destructive menu item with Midday's class-based dropdown item pattern.
- Preserved all sheet URL close behavior, accessible close labels, invite/create/edit form placement, and customer delete confirmation behavior.
- Validation: focused scans confirmed stale `SheetTitle` / `SheetDescription` usage was removed from `StackedSheetHeader`, the Midday header/button class markers are present, the old customer dropdown destructive variant prop is gone, and scoped whitespace validation passed.

## 2026-07-17 — Midday Sheet Dialog Cn Import Parity

- Continued the remaining dashboard/page parity audit by checking shared sheet/dialog primitive anatomy against Midday after the search-filter pass.
- Confirmed the shared sheet primitive class and content structure remains aligned with Midday, then removed the remaining old `../lib/utils` `cn` import path from the active Midday primitives: `sheet`, `dialog`, and `alert-dialog`.
- Aligned those primitives with Midday's canonical `../utils` import path while preserving their existing overlay/content/header/footer behavior.
- Validation: focused scans confirmed the three primitives now import `cn` from `../utils`, no `../lib/utils` residue remains in those files, and scoped whitespace validation passed.

## 2026-07-17 — Midday SearchFilter Layout And Escape Parity

- Continued the remaining dashboard/page parity audit by comparing shared page-filter controls against Midday's `invoice-search-filter` reference after the q-only `SearchField` update.
- Aligned shared `SearchFilter` with Midday's filter wrapper layout by using the reference `items-start` / `space-y-4` mobile stack and removing the local `md:w-auto` / `items-stretch` treatment.
- Aligned Escape behavior with Midday by clearing active input whenever a prompt exists instead of gating the hotkey behind local focus state.
- Aligned the search icon, input, and filter trigger class ordering with the Midday reference while preserving the generic no-menu-filter guard.
- Preserved generic filter definitions, q/search-key resolution, date-range filters, dropdown filter menus, filter chips, and all table header callers.
- Validation: focused scans confirmed local focus state and input focus/blur handlers were removed, the shared filter now carries the Midday wrapper/input/trigger class shape, and scoped whitespace validation passed.

## 2026-07-17 — Midday SearchField Query State Parity

- Continued the remaining dashboard/page parity audit by checking shared page-header search/filter controls after the open-sheet trigger wrapper cleanup.
- Confirmed active sheet/modal files no longer carry stale shared-card, rounded-shell, raw destructive paragraph, direct lucide, `joinClasses`, or relative tRPC import residues.
- Aligned shared `SearchField` with Midday's query-state boundary by keeping the reference-compatible `shallow` prop surface for callers but using `useQueryState("q")` directly instead of passing the prop into the hook.
- Preserved q-only search behavior, escape-to-clear behavior, App Store header call shape, and all existing search-field callers.
- Validation: focused scans confirmed `SearchField` no longer passes `shallow` into `useQueryState`, while App Store can still pass the reference-compatible prop.

## 2026-07-17 — Midday Open Sheet Trigger Wrapper Cleanup

- Continued the remaining dashboard/page parity audit by checking active open-sheet trigger components after the Project AI icon-label cleanup.
- Removed no-op wrapper `<div>` elements from `OpenPropertySheet` and `OpenCustomerSheet` so their triggers match the direct Midday-style icon-button shape used by the other migrated open-sheet controls.
- Preserved property default URL params, customer create URL params, icon-only trigger styling, and accessible labels.
- Validation: focused scans confirmed the touched open-sheet triggers now return direct `Button` controls and scoped whitespace validation passed.

## 2026-07-17 — Midday Project AI Action Icon Label Cleanup

- Continued the remaining dashboard/page parity audit by checking Project AI action controls after converting its mutation errors to shared alerts.
- Reworked Project AI summary, risk-analysis, customer-draft, and no-risk feedback labels from inline emoji glyphs into shared `@plotkeys/ui/icons` namespace icons.
- Preserved all Project AI mutation behavior, pending labels, result rendering, risk badges, and customer-draft guidance.
- Validation: focused scans confirmed the removed emoji labels are gone from `ProjectAiInsights` and the component now uses shared `Icon.*` entries.

## 2026-07-17 — Midday Billing Credits Publish And Project AI Error Notice Cleanup

- Continued the remaining dashboard/page parity audit by checking active purchase/checkout and publish modal error notices after the pending invite cleanup.
- Reworked AI Credits top-up, Billing checkout, Publish Confirmation dialog, and Recommend Template error surfaces from raw destructive text paragraphs into shared destructive `Alert` / `AlertDescription` notices.
- Reworked Project AI summary, risk-flag, and customer-draft mutation failures into shared destructive `Alert` / `AlertDescription` notices instead of local destructive text paragraphs.
- Reworked Domains sync failures, DNS instruction last-error notices, and remove-domain action errors into shared destructive `Alert` / `AlertDescription` notices while leaving destructive action button styling intact.
- Preserved purchase credits mutation invalidation, billing checkout tier/interval behavior, publish confirmation form submission/routing, and recommend-template fallback copy.
- Preserved Project AI summary/risk/customer-draft mutation behavior, result rendering, risk badges, and customer draft guidance.
- Preserved domain sync/remove mutation behavior, DNS instruction rendering, last-error copy, and provisioned-domain table actions.
- Validation: focused scans confirmed the touched billing, AI credits, modal, Project AI, and Domains files now use shared destructive alert notices and no longer contain the targeted raw destructive paragraph classes.

## 2026-07-17 — Midday Pending Invite Error Notice Cleanup

- Continued the remaining dashboard/page parity audit by checking non-builder raw destructive notice residues after the route/surface checkpoint.
- Reworked Agent, Employee, and Team pending invite revoke errors from raw destructive text paragraphs into shared destructive `Alert` / `AlertDescription` surfaces.
- Preserved invite filtering, dev invite links, revoke mutation state, pending button disabling, query invalidation, and pending invite list layout.
- Validation: focused scans confirmed the old raw `revokeError` destructive paragraphs were removed and the three pending invite components now use shared destructive alert notices.

## 2026-07-17 — Midday Route And Residue Audit Checkpoint

- Continued the remaining dashboard/page parity audit after completing the dashboard icon namespace cleanup.
- Rechecked active dashboard route boundaries against the Midday settings and page patterns: table/detail routes continue to use `HydrateClient`, `ScrollableContent`, `ErrorBoundary`, and `Suspense`; settings subroutes intentionally match Midday's route-level `Suspense` handoff while the shared settings layout owns `ScrollableContent`.
- Rechecked non-builder/template/dev surface residues: the remaining shared `Card` imports are the previously verified App Store, Integration, Notification Preferences, and Workspace Settings card patterns rather than stale generic page-section chrome.
- Confirmed dashboard-owned `joinClasses`, direct `lucide-react`, and `DashboardTopbar` residues remain absent from `apps/dashboard/src`.
- No source changes were needed in this pass because the inspected route and surface residues are now reference-aligned or intentionally control/editor chrome.

## 2026-07-17 — Midday Active Action Icon Namespace Cleanup

- Continued the remaining dashboard/page parity audit by checking active action/header/detail icon ownership after the open sheet trigger cleanup.
- Reworked Blog create, Sign In benefit/dev picker, Integrations settings/card/catalog, Notifications table, Notification Preferences skeleton, Dashboard user menu settings/sign-out, shared table header/drag handle, Template Sandbox visibility/template/config/live-code controls, Builder preview mobile menu, Dev FAB, Property Details media, App Store locked-plan action, Onboarding brand edit badge, Pricing Plan add/remove, Project Budget/Workforce remove, Billing plan/repair actions, and Estate Detail launch-asset icons from direct `lucide-react` imports to shared `@plotkeys/ui/icons` namespace equivalents.
- Added central inline `Icon.Edit`, `Icon.Lock`, `Icon.LogOut`, `Icon.RefreshCcw`, `Icon.Menu`, `Icon.ChevronsUpDown`, `Icon.Code`, `Icon.Shuffle`, `Icon.Template`, `Icon.Rows`, `Icon.Hexagon`, `Icon.SlidersHorizontal`, and `Icon.Wrench` fallbacks for action/control glyphs that had no existing Hugeicons export wired into the shared namespace.
- Preserved create-post mutation behavior, sign-in routing/dev account picker behavior, integration settings/docs navigation, integration catalog rendering/counting, notification row rendering, notification settings grouping, user-menu navigation/sign-out behavior, table sorting/drag/resize behavior, template visibility toggles/selects/live-site/config export behavior, builder preview mobile menu behavior, dev FAB behavior, property media forms, app-store plan upgrade links, onboarding logo upload behavior, pricing-plan add/remove behavior, project budget/workforce delete actions, billing checkout/repair behavior, estate brochure/plan action links, and all existing button/table layout classes.
- Validation: focused scans confirmed dashboard `apps/dashboard/src/components` and `apps/dashboard/src/app` no longer import `lucide-react` directly; touched callers now use shared `Icon.*` namespace entries.

## 2026-07-17 — Midday Open Sheet Trigger Icon Ownership Cleanup

- Continued the remaining dashboard/page parity audit by checking active header/open-sheet trigger ownership after the Dashboard header ownership cleanup.
- Reworked `OpenInviteAgentSheet` from a direct `lucide-react` `UserPlus` import to the shared `@plotkeys/ui/icons` namespace used by the other migrated open/invite sheet triggers.
- Preserved the agent invite URL state, icon-only outline trigger shape, accessible label, and sheet-opening behavior.
- Validation: focused scans confirmed no direct `lucide-react` import remains in `OpenInviteAgentSheet` and the trigger now uses `Icon.Users`.

## 2026-07-17 — Midday Dashboard Header Ownership Cleanup

- Continued the remaining dashboard/page parity audit by checking old dashboard wrapper and header abstractions after the Reports skeleton and Join alert cleanup.
- Inlined the dashboard `SiteNav.Header` right-side ownership into `DashboardChrome` and removed the one-use `DashboardTopbar` wrapper component.
- Preserved notification bell data, theme toggle, user menu props, builder-route chrome bypass, sidebar provider context, and child content placement.
- Validation: focused scans confirmed `DashboardTopbar` is no longer imported, rendered, or present as a wrapper file.

## 2026-07-17 — Midday Reports Skeleton And Join Alert Cleanup

- Continued the remaining dashboard/page parity audit by checking stale rounded/error surface tokens after the Builder Template Preview canvas frame cleanup.
- Reworked Reports period loading placeholders to square `h-8` skeletons so the loading state mirrors the squared `HeaderLinkTab` period controls.
- Replaced Join invite inline rounded destructive paragraphs with shared destructive `Alert` / `AlertDescription` surfaces, matching the adjacent join profile-completion error pattern.
- Preserved report loading layout, join invite lookup, tenant sign-in URL generation, signed-in email mismatch behavior, URL error display, account creation, and accept-invite actions.
- Validation: focused scans confirmed the old rounded Reports period skeleton and Join invite destructive paragraph classes were removed.

## 2026-07-17 — Midday Builder Template Preview Canvas Frame Cleanup

- Continued the remaining dashboard/page parity audit by checking the final rounded builder/template residues after the onboarding choice-row cleanup.
- Reworked the Builder Template Preview inner website canvas frame and matching loading skeleton from rounded explicit `border-border` wrappers into square plain bordered frames.
- Preserved template resolution, page-section rendering, theme background/font application, browser-frame header, skeleton section layout, and template preview route composition.
- Left picker buttons, hover labels, inline editor popovers, floating config controls, and dev FAB chrome untouched because those are interactive/editor controls rather than structural page/frame surfaces.
- Validation: focused scans confirmed the active Builder Template Preview canvas frame and skeleton no longer render rounded bordered frame wrappers.

## 2026-07-17 — Midday Onboarding Choice Row Chrome Cleanup

- Continued the remaining dashboard/page parity audit by checking active onboarding choice rows after the Estate Detail payment table frame cleanup.
- Compared the property-type and content-readiness checklist rows against Midday onboarding/selection row references and removed the rounded label-box chrome.
- Reworked both choice-row groups to square bordered `bg-background` blocks while preserving checkbox state wiring, field names, hover affordance, form validation, save progress, and completion flow.
- Validation: focused scans confirmed the targeted onboarding choice rows no longer contain rounded bordered label classes.

## 2026-07-17 — Midday Estate Detail Payment Table Frame Cleanup

- Continued the remaining dashboard/page parity audit by checking active rounded table residues after the Project Detail child surface cleanup.
- Reworked the Estate Detail payment-plan mini table wrapper from a rounded explicit `border-border` shell into a square plain bordered table frame, matching the Midday data-table frame direction.
- Preserved payment-plan parsing, empty-state copy, table columns, compact cell sizing, and offer-card/table placement.
- Validation: focused scans confirmed the Estate Detail payment-plan table no longer renders the rounded table wrapper.

## 2026-07-16 — Midday Project Detail Child Surface Cleanup

- Continued the remaining dashboard/page parity audit by checking rounded bordered child surfaces after the header-tab chrome cleanup.
- Reworked Project Detail phase, milestone, customer-access, team, issue, update, AI summary, risk-flag, and customer-draft result panels from rounded local boxes into plain bordered surfaces.
- Preserved all project mutations, cache invalidation behavior, status/visibility actions, badges, relative date formatting, generated AI text display, and customer-visible controls.
- Left builder/editor control chrome and onboarding choice controls untouched because those are interactive controls rather than page/detail child content surfaces.
- Validation: focused scans confirmed the touched Project Detail child components no longer contain rounded bordered surface classes.

## 2026-07-16 — Midday Header Tab Chrome Cleanup

- Continued the remaining dashboard/page parity audit by checking tab-like header controls after the app/settings card residue verification.
- Reworked Reports period tabs to use the shared `HeaderLinkTab` instead of local rounded link classes.
- Removed the rounded chrome from the shared `HeaderLinkTab` muted variant so Billing interval tabs and Reports period tabs follow the square bordered Midday tab treatment.
- Preserved report period URL generation, active period state, Billing interval URL generation, active interval state, and existing header copy/layout.
- Validation: focused scans confirmed the rounded header-tab residue is gone from Reports and the shared muted tab class.

## 2026-07-16 — Midday App And Settings Card Residue Verification

- Continued the remaining dashboard/page parity audit by rechecking the final broad shared-card residues after the join invite surface cleanup.
- Compared App Store tiles and their skeleton against Midday's `unified-app` / `apps.skeleton` references and confirmed the shared `Card` / `CardHeader` / `CardContent` anatomy is intentional there.
- Confirmed Integration overview tiles follow the same Midday app-tile anatomy, while integration, notification, and workspace settings residues remain aligned with Midday's settings-card pattern.
- No source changes were needed in this pass because the remaining card primitives are reference-aligned rather than stale generic page-section chrome.
- Validation: focused scans narrowed active shared-card residues to app-store/integration app tiles and settings-card surfaces.

## 2026-07-16 — Midday Join Invite Surface Primitive Cleanup

- Continued the remaining dashboard/page parity audit by checking public join invite surfaces after the FlowShell primary surface cleanup.
- Reworked join invite not-found, expired, accept/sign-up, and profile-completion wrappers from shared `Card` / header / content / footer primitives into local plain `border bg-background` sections.
- Preserved invite lookup and expiry handling, tenant sign-in link generation, account creation form, signed-in email mismatch/error states, accept-invite action, profile-completion form, role/company copy, and final guidance text.
- Validation: focused scans confirmed the join invite pages no longer import or render shared card primitives and now expose local plain bordered auth/status sections.

## 2026-07-16 — Midday FlowShell Primary Surface Primitive Cleanup

- Continued the remaining dashboard/page parity audit by revisiting the shared FlowShell after Billing, Domains, Template Sandbox, and Estate surfaces no longer used shared card wrappers.
- Reworked the primary FlowShell content column from shared `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` anatomy into a local plain `border bg-background` section.
- Preserved the brand/header action placement, badge, eyebrow, title, description, child form slot, side-panel slot, and signup/verify/onboarding route behavior.
- Validation: focused scans confirmed FlowShell no longer imports or renders shared card primitives and both FlowShell columns now use local plain bordered surfaces.

## 2026-07-16 — Midday Billing Plan Tile Primitive Cleanup

- Continued the remaining dashboard/page parity audit by checking the last shared card primitive in Billing after the Template Sandbox index cleanup.
- Reworked available-plan comparison tiles from shared `Card` wrappers into local plain `border bg-background p-5` surfaces.
- Preserved the current-plan highlighted border, tier labels, pricing copy, feature list, checkout initialization, current-plan disabled state, support fallback, and inline checkout error handling.
- Validation: focused scans confirmed Billing section components no longer import or render shared card primitives and now expose local plain bordered plan tiles.

## 2026-07-16 — Midday Template Sandbox Index Primitive Cleanup

- Continued the remaining dashboard/page parity audit by checking Template Sandbox index card residue after the Domains primitive cleanup.
- Reworked the Configure template panel from a shared `Card` wrapper into a local plain `border bg-background` form panel.
- Reworked generated profile items from shared `Card` / `CardContent` wrappers into local plain bordered `article` surfaces.
- Preserved template creation mutation behavior, field/control wiring, generated profile metadata, preview/configure/clone/archive actions, empty state, and generated-profile grid layout.
- Validation: focused scans confirmed the Template Sandbox index no longer imports or renders shared card primitives and now exposes local plain bordered form/profile surfaces.

## 2026-07-16 — Midday Domains Plain Surface Primitive Cleanup

- Continued the remaining dashboard/page parity audit by checking Domains and Connect Domain surfaces after the Estate Detail card cleanup.
- Reworked pending DNS instruction panels from shared `Card` wrappers into local plain `border bg-background p-5` surfaces.
- Reworked Connect Domain setup-step and DNS guidance panels from shared `Card` wrappers into local plain bordered surfaces.
- Preserved domain sync/control behavior, DNS instruction table content, last-error copy, hostname intake form, setup-step copy, DNS record badges, and route/body composition.
- Validation: focused scans confirmed the touched Domains surfaces no longer import or render shared card primitives and now expose the migrated local plain bordered surfaces.

## 2026-07-16 — Midday Estate Detail Image Card Surface Parity

- Continued the remaining dashboard/page parity audit by checking the last shared card primitives in Estate Detail after the feature and plan item pass.
- Reworked the image-bearing Launch brief panel from shared `Card` / `CardContent` anatomy into a plain `overflow-hidden border bg-background` surface.
- Reworked Estate offer cards from shared `Card` / `CardContent` anatomy into plain bordered `article` surfaces.
- Preserved hero/listing image rendering, no-image fallback, publish/phase/approval badges, location/landmark/payment info tiles, listing links, payment plan table, quantity metadata, and offer-card grid behavior.
- Validation: focused scans confirmed Estate Detail content no longer imports or renders shared card primitives and now uses local plain bordered image/card surfaces.

## 2026-07-16 — Midday Estate Detail Feature And Plan Item Surface Parity

- Continued the remaining dashboard/page parity audit by checking the Estate Detail feature and plan import sections after the Estates launch list item pass.
- Reworked the Estate features repeated panels from shared `Card` / `CardHeader` / `CardTitle` / `CardContent` anatomy into plain `border bg-background` surfaces with local labels and direct badge/empty content.
- Reworked the Estate plan upload and layout-version panels from shared card/header/content anatomy into plain bordered surfaces, preserving dashed upload treatment and layout version metadata.
- Preserved the parent `EstateSection` heading/description ownership, amenities/approvals/special-purpose badges, estate plan upload form wiring, layout status badges, and source URL copy.
- Validation: focused scans confirmed the touched Estate Detail feature/plan slice no longer renders shared card header/title primitives and now exposes the migrated plain bordered item surfaces.

## 2026-07-16 — Midday Estates Launch Item Surface Parity

- Continued the remaining dashboard/page parity audit by checking the active Estates launches list after the FlowShell side-panel pass.
- Reworked `EstateLaunchCard` from shared `Card` / `CardHeader` / `CardTitle` / `CardContent` anatomy into a plain `article` with `border bg-background` treatment and direct local typography.
- Preserved estate title, location fallback, publish-state badge, description clamp, inventory metric cells, created-date metadata, and the Open action.
- Validation: focused scans confirmed the Estates launch item no longer imports or renders shared card primitives and now exposes the migrated plain bordered list-item surface.

## 2026-07-16 — Midday FlowShell Side Panel Surface Parity

- Continued the remaining dashboard/page parity audit by checking the shared FlowShell wrapper after the onboarding side-panel tile pass.
- Reworked the FlowShell side-panel container used by signup, verify-email, and onboarding flows from rounded explicit `border-border bg-background` chrome into a plain `border bg-background` surface.
- Preserved the primary FlowShell card anatomy, brand/header action placement, side-panel content slots, and existing signup/verify/onboarding route behavior.
- Validation: focused scans confirmed the shared FlowShell side-panel no longer uses the targeted rounded explicit shell class and now exposes the migrated plain bordered surface.

## 2026-07-16 — Midday Onboarding Side-Panel Tile Surface Parity

- Continued the remaining dashboard/page parity audit by checking onboarding side-panel helper tiles after the builder unavailable and summary pass.
- Reworked the verification handoff contract tiles from rounded `border-border bg-muted/50` panels into plain `border bg-background` info surfaces.
- Reworked the onboarding checklist rows from rounded explicit `border-border` panels into plain bordered rows while preserving current, completed, and pending visual states.
- Removed a duplicated `line-through` token from completed onboarding checklist rows.
- Validation: focused scans confirmed the touched onboarding side-panel no longer uses the targeted rounded helper tile classes, no duplicated line-through token remains, and the migrated plain bordered tile classes are present.

## 2026-07-16 — Midday Builder Unavailable And Summary Surface Parity

- Continued the remaining dashboard/page parity audit by checking the active builder unavailable branches after the workspace shell pass.
- Reworked `BuilderWorkspaceUnavailable` from a shared `Card` / `CardContent` wrapper around a nested bordered empty state into a single plain `Empty` surface with `border bg-background` treatment.
- Flattened the shared builder configuration summary used by the desktop sidebar and mobile drawer from a rounded explicit `border-border bg-background` mini-panel into a plain `border bg-background` info surface.
- Preserved the database-unavailable, company-not-found, and draft-not-found branch copy and the existing `EmptyHeader` / `EmptyTitle` / `EmptyDescription` composition.
- Preserved active configuration metadata, version/saved-count copy, badge/text status display, desktop sidebar usage, and mobile drawer usage.
- Validation: focused scans confirmed the builder unavailable component no longer imports or renders shared card primitives, the configuration summary no longer uses the targeted rounded explicit border shell, and both surfaces now expose migrated plain bordered treatment.

## 2026-07-16 — Midday Builder Workspace Structural Shell Surface Parity

- Continued the remaining dashboard/page parity audit by checking the active builder workspace after the builder template preview shell pass.
- Reworked the builder workspace desktop sidebar, toolbar, outer preview shell, and non-canvas preview runtime frame from rounded explicit `border-border bg-background` shells into plain `border bg-background` surfaces.
- Left the preview section labels, status pills, picker triggers, and field-editor overlay controls intact because they are transient/editor controls rather than page section shells.
- Preserved embedded/canvas branches, sticky sidebar behavior, toolbar context/actions, read-only notices, inline editing runtime, and preview section rendering.
- Validation: focused scans confirmed the touched builder workspace shell files no longer contain the targeted rounded structural shell classes and now use migrated plain surface tokens.

## 2026-07-16 — Midday Builder Template Preview Shell Surface Parity

- Continued the remaining dashboard/page parity audit by checking active `/builder/preview` surfaces after the remaining card-residue cleanup.
- Reworked the builder template preview outer grid, desktop sidebar, publish-status row, and preview frame from rounded explicit `border-border bg-background` shells into plain `border bg-background` surfaces.
- Updated the matching builder template preview skeleton shells to the same plain surfaces.
- Preserved template selection, tier tabs, publish toggle, preview header actions, browser-frame header metadata, inner website canvas framing, and skeleton structure.
- Validation: focused scans confirmed the touched builder template preview loaded and skeleton files no longer use the targeted rounded generic shell classes and now share the migrated plain surface tokens.

## 2026-07-16 — Midday Remaining Card Residue Audit Cleanup

- Continued the remaining dashboard/page parity audit by scanning active shared-card anatomy after the sign-in info-tile pass.
- Confirmed App Store/integration app tiles and notification/integration settings cards match nearby Midday `unified-app` and settings-card patterns, so those card primitives remain intentional.
- Removed the unused `NotificationDemo` component after scans found no active imports or route usage; this eliminates a dead dashboard demo panel carrying old rounded generic shell chrome.
- Preserved active notification preference settings, integration settings, app-store cards, and auth/join flow card anatomy.
- Validation: focused scans confirmed `NotificationDemo` no longer exists or has active references, while settings/app card surfaces remain as intentional Midday-pattern matches.

## 2026-07-16 — Midday Sign-In Info Tile Surface Parity

- Continued the remaining dashboard/page parity audit by checking remaining non-builder generic shell residues after the empty-panel pass.
- Verified `NotificationDemo` had no active imports before a later cleanup pass removed the demo-only panel.
- Reworked the active tenant sign-in scoped-host notice from a rounded `border-border bg-background` panel into the flat light/dark bordered info-tile surface used by migrated auth/onboarding helper panels.
- Preserved sign-in form submission, dev account picker behavior, field layout, redirect handling, and surrounding `FlowShell` card anatomy.
- Validation: focused scans confirmed the active sign-in form no longer contains the targeted old rounded notice shell and now uses migrated light/dark surface tokens.

## 2026-07-16 — Midday Empty Panel Surface Parity

- Continued the remaining dashboard/page parity audit by checking single empty-state panels after the Estate Detail Launch assets pass.
- Reworked the Estate Detail Offer cards empty state from a shared `Card` / `CardContent` wrapper into a plain `border bg-background` section panel.
- Reworked the Template Sandbox generated-websites empty state from a dashed shared `Card` / `CardContent` wrapper into a plain dashed bordered panel.
- Preserved generated profile cards, estate offer cards, estate plan upload card, empty-state copy, profile actions, and offer-card grid behavior.
- Validation: focused scans confirmed the two targeted empty states no longer render shared card content wrappers while intentional profile/upload/item cards remain untouched.

## 2026-07-16 — Midday Estate Detail Launch Assets Surface Parity

- Continued the remaining dashboard/page parity audit by checking Estate Detail Launch brief secondary panels after the Live Preview frame pass.
- Reworked the Launch assets side panel from a nested `CardHeader` / `CardTitle` / `CardContent` card into a plain `border bg-background` surface with a compact local heading.
- Preserved the image-bearing Launch brief card, brochure link, latest estate plan link, empty asset copy, and button/action behavior.
- Validation: focused scans confirmed the Launch assets block now uses the migrated plain surface while later feature/plan/offer item cards keep their local card anatomy.

## 2026-07-16 — Midday Live Preview Frame Surface Parity

- Continued the remaining dashboard/page parity audit by checking the active Live Preview route after the shared subdomain helper surface pass.
- Reworked the loaded Live Preview frame from the old rounded `border-border bg-background` shell into the plain `overflow-hidden border bg-background` surface used by migrated dashboard table/content frames.
- Aligned the Live Preview skeleton frame to the same plain border surface.
- Preserved route-level Suspense/ErrorBoundary composition, preview data loading, section rendering, theme resolution, and skeleton section placeholders.
- Validation: focused scans confirmed the touched Live Preview frame and skeleton no longer render the old rounded/explicit `border-border` outer frame shell and now share the migrated plain surface token.

## 2026-07-16 — Midday Subdomain Preview Surface Parity

- Continued the remaining dashboard/page parity audit by checking shared signup/onboarding form helpers after the Estate Detail inventory and pipeline pass.
- Reworked `SubdomainField`'s hostname preview from a nested `CardHeader` / `CardTitle` / `CardContent` panel into a flat light/dark bordered info-tile surface.
- Preserved subdomain normalization, controlled input wiring, field description, website/dashboard hostname generation, and signup form integration.
- Validation: focused scans confirmed the subdomain helper no longer imports or renders shared card primitives and now uses the migrated flat info-tile tokens.

## 2026-07-16 — Midday Estate Detail Inventory And Pipeline Surface Parity

- Continued the remaining dashboard/page parity audit by checking Estate Detail table/widget surfaces after the modal and onboarding info-tile pass.
- Reworked the Grouped land inventory table shell from a shared `Card` wrapper into the plain `overflow-hidden border bg-background` table surface used by other migrated dashboard tables.
- Reworked Purchase pipeline stage metrics from `Card` / `CardContent` metric cards into flat light/dark bordered widgets with compact value typography.
- Preserved listing links, quantity/payment/price/status cells, empty table row, add-property sheet action, reservation count, and pipeline stage labels.
- Validation: focused scans confirmed the Estate Detail inventory table now uses the migrated plain table shell and the pipeline stages now use flat widget tokens instead of card metric wrappers.

## 2026-07-16 — Midday Modal And Onboarding Info Tile Surface Parity

- Continued the remaining dashboard/page parity audit by checking compact modal/onboarding summary boxes after the Template Sandbox and Estate loading pass.
- Reworked the recommend-template profile summary and publish-confirmation summary boxes from rounded `border-border bg-background` shells into flat light/dark bordered info-tile surfaces.
- Reworked the onboarding side-panel company/subdomain preview from the same rounded generic shell into the flat light/dark info-tile treatment while leaving step-state rows unchanged.
- Preserved modal copy, publish-confirmation field rendering, recommendation summary values, onboarding step-state styling, and tenant subdomain preview behavior.
- Validation: focused scans confirmed the touched modal summary and onboarding files no longer contain the targeted old rounded generic info-box classes and now use migrated light/dark surface tokens.

## 2026-07-16 — Midday Template Sandbox And Estate Loading Surface Parity

- Continued the remaining dashboard/page parity audit by checking loading-state wrappers and repeated nested cards after the Blog Detail and Dashboard Home surface pass.
- Reworked Template Sandbox skeleton configure/profile panels from rounded `border-border bg-background` wrappers into plain shared card surfaces that match the migrated shared `Card` primitive.
- Reworked Estate list skeleton launch-card panels from rounded generic shells into plain shared card surfaces.
- Reworked Estate launch-card nested inventory metric cells from rounded `border-border bg-background` mini-cards into flat light/dark bordered widgets.
- Preserved Estate launch card item-card anatomy, badges, inventory counts, open links, Template Sandbox profile card anatomy, empty state, and skeleton row structure.
- Validation: focused scans confirmed the touched template sandbox skeleton, estate skeleton, and estate launch card no longer contain the targeted old rounded generic panel/mini-card classes and now use the migrated surface tokens.

## 2026-07-16 — Midday Blog Detail And Home Surface Parity

- Continued the remaining dashboard/page parity audit by checking active Blog Detail and Dashboard Home section surfaces after the domains pass.
- Removed the duplicate `CardHeader` / `CardTitle` / `CardContent` wrapper around the Blog Detail edit form because `BlogDetailSection` already owns the section heading and description.
- Reworked the Blog Detail loading form panel and Dashboard Home section skeleton panel from rounded `border-border bg-background` wrappers into plain shared card surfaces.
- Reworked the Dashboard Home Publishing control Primary URL nested tile from the old rounded generic shell into the flat light/dark bordered info-tile treatment used by migrated dashboard widgets.
- Preserved blog post query/mutation invalidation, delete/archive/publish actions, form behavior, route loading composition, publishing badges, and public-site/domain/builder links.
- Validation: focused scans confirmed the touched blog detail and dashboard home files no longer contain the targeted shared-card wrapper imports/usages or old rounded generic panel shells.

## 2026-07-16 — Midday Domains Section Surface Parity

- Continued the remaining dashboard/page parity audit by checking active `/domains` and `/domains/connect` section bodies after the billing section pass.
- Reworked the Domain control and Hostname intake bodies from single shared `Card` wrappers into plain `border bg-background` section surfaces.
- Reworked the Provisioned domains table shell and Domains loading section panels from rounded `border-border bg-background` wrappers into plain shared surfaces.
- Preserved DNS instruction cards, setup-step cards, custom-domain form behavior, domain sync mutation, provisioned-domain actions, table rows, and empty state.
- Validation: focused scans confirmed the touched domain section, connect view, and skeleton files no longer contain the old single-body `Card` wrappers or rounded table/loading panel shells targeted by this pass.

## 2026-07-16 — Midday Billing Section Surface Parity

- Continued the remaining dashboard/page parity audit by checking active `/billing` lower sections after the billing skeleton surface migration.
- Reworked the Current plan and Repair payment section bodies from shared `Card` wrappers into plain `border bg-background` surfaces owned by their parent `BillingSection` headings.
- Reworked the Billing history table shell from the old rounded `border-border bg-background` wrapper into a plain shared table surface.
- Preserved plan comparison item cards, checkout initialization, repair-payment redirect behavior, billing table rows, empty state, and section copy.
- Validation: focused scans confirmed the touched billing section file no longer uses the old rounded billing history table shell and now renders plain section-body surfaces for current-plan and repair-payment content.

## 2026-07-16 — Midday AI Credits Section Surface Parity

- Continued the remaining dashboard/page parity audit by checking active `/ai-credits` lower sections after the summary stat and skeleton migrations.
- Reworked the Top up credits body from a `Card` / `CardContent` wrapper into a plain shared card surface.
- Reworked the Usage by feature table shell and lower section skeleton panels from rounded `border-border bg-background` shells into plain `border bg-background` surfaces.
- Preserved purchase mutation behavior, credit copy, table rows, empty state, summary cards, and route suspense composition.
- Validation: focused scans confirmed the touched AI Credits section and skeleton files no longer import/render shared card primitives or old rounded lower-section shells, and now use the migrated plain surface tokens.

## 2026-07-16 — Midday Project Subpage Table Shell Surface Parity

- Continued the remaining dashboard/page parity audit by checking active project budget/workforce list shells after their summary/form surfaces were migrated.
- Reworked the outer Budget line-items, Workforce workers, and Workforce payroll-runs section shells from rounded `border-border bg-background` panels into the same plain shared table/card surface used by adjacent migrated project bodies.
- Updated the matching budget and workforce skeleton list shells to the same plain outer surface.
- Preserved table row rendering, table/list internal borders, grouped worker subsections, badges, empty states, mutations, and scrolling behavior.
- Validation: focused scans confirmed the touched project budget/workforce content and skeleton files no longer render the old rounded outer table shell class while retaining inner table border structure.

## 2026-07-16 — Midday Estate Detail Offer Tile Surface Parity

- Continued the remaining dashboard/page parity audit by checking the remaining Estate Detail card surfaces after the Launch brief and skeleton pass.
- Kept estate feature/plan cards intact because their local titles label repeated item cards rather than duplicating a parent section title.
- Reworked the Offer card nested Payment plan information tile from a rounded `border-border bg-background` mini-card into the same flat Midday-style bordered widget surface used by Launch brief Location/Landmarks tiles.
- Preserved the image-bearing offer card, listing link, payment plan table, quantity display, and offer-card grid behavior.
- Validation: focused scans confirmed Estate Detail no longer has the old rounded nested info tile classes for Location, Landmarks, or Payment plan, and those tiles now use the migrated flat surface tokens.

## 2026-07-16 — Midday Estate Detail Launch Brief Surface Parity

- Continued the remaining dashboard/page parity audit by checking estate detail after project detail section-wrapper migrations.
- Reworked the estate detail skeleton's lower section body panels from rounded `border-border bg-background` shells into the shared plain card surface used by other migrated detail skeletons.
- Reworked the Launch brief Location and Landmarks nested information tiles from rounded `border-border bg-background` mini-cards into flat Midday-style bordered widgets.
- Preserved the image-bearing launch brief card, launch asset actions, estate feature/plan/offer cards, inventory table, and purchase pipeline for separate evidence passes.
- Validation: focused scans confirmed the touched estate detail skeleton no longer uses the old rounded lower section shell, and the Launch brief Location/Landmarks tiles now use the migrated flat surface tokens.

## 2026-07-16 — Midday Project Detail Overview Surface Parity

- Continued the remaining dashboard/page parity audit by checking project detail overview sections, which already render headings and descriptions through `ProjectSection`.
- Removed the repeated `CardHeader` / `CardTitle` / `CardContent` wrapper from each project overview section so the parent `ProjectSection` remains the sole section heading owner.
- Reworked the project detail skeleton overview body panel from the rounded `border-border bg-background` shell into the same plain shared card surface as the loaded overview bodies.
- Preserved all project overview section content, nested forms, lists, budget/workforce/customer access behavior, and project AI placement.
- Validation: focused scans confirmed the touched project detail content and skeleton files no longer import or render shared card primitives or the old rounded overview skeleton panel class.

## 2026-07-16 — Midday Project AI Section Surface Parity

- Continued the remaining dashboard/page parity audit by checking `ProjectAiInsights`, which is rendered inside a parent `ProjectSection` on the project detail page.
- Removed the duplicate `CardHeader` / `CardTitle` / `CardContent` wrapper and stale inner `AI Insights` title so the parent `ProjectSection` remains the heading/description owner.
- Reworked the AI action group into a plain shared card surface while preserving executive summary, risk analysis, customer update draft actions, credit copy, mutation behavior, and generated result displays.
- Validation: focused scans confirmed the touched project AI file no longer imports or renders shared card primitives, stale card wrapper classes, or the duplicate `AI Insights` title.

## 2026-07-16 — Midday Project Workforce Form Surface Parity

- Continued the remaining dashboard/page parity audit by checking the active project workforce subpage after the project budget surface migration.
- Removed duplicate `CardHeader` / `CardTitle` / `CardContent` wrappers around the add-worker and create-payroll-run forms because `ProjectSection` already owns each section heading and description.
- Reworked the workforce form skeleton panel from a rounded `border-border bg-background` shell into the same plain shared card surface used by the loaded form bodies.
- Preserved workforce/payroll table shells, worker/payroll empty states, form components, mutation invalidation, and existing list behavior for a separate table-shell pass.
- Validation: focused scans confirmed the touched workforce content and skeleton files no longer import shared card primitives, render duplicate form card titles, or use the old rounded form skeleton panel class.

## 2026-07-16 — Midday Project Budget Surface Parity

- Continued the remaining dashboard/page parity audit by checking the active project budget subpage after summary-stat and skeleton surface migrations.
- Removed duplicate `CardHeader` / `CardTitle` / `CardContent` wrappers around the budget summary and add-line-item form because `ProjectSection` already owns the section heading and description.
- Reworked budget summary metric tiles from rounded nested `border-border bg-background` mini-cards with bold values into flat Midday-style bordered widgets with compact value typography.
- Updated the project budget skeleton's summary panel and metric placeholders to match the loaded budget summary surface.
- Preserved budget data loading, budget setup form fallback, line-item table shell, create-line-item form, mutation invalidation, and existing BOQ table behavior.
- Validation: focused scans confirmed the touched budget content and skeleton files no longer import shared card primitives, render duplicate card headers/content, or use the old rounded summary metric placeholder classes.

## 2026-07-16 — Midday Customers Summary Stat Surface Parity

- Continued the remaining dashboard/page parity audit by checking active `/customers` summary stat cards and their suspense fallback after the broader summary-stat widget migration.
- Reworked Total, Active, VIP, and Inactive customer stat cards from `CardHeader` / `CardTitle` / `CardContent` metric anatomy into direct flat Midday-style bordered widget surfaces with label, value, and detail copy.
- Reworked `CustomerSummarySkeleton` to match the same flat label/value/detail loading structure instead of rendering the old card title/content skeleton.
- Preserved the existing customer stats query, total calculation, responsive `hidden sm:block` visibility, and route-level Suspense composition.
- Validation: focused scans confirmed the touched customer stat files no longer import or render shared card primitives, old font-serif metric title classes, or old fixed-height title/content skeleton placeholders, and now use the migrated flat surface tokens.

## 2026-07-16 — Midday Billing Skeleton Card Surface Parity

- Continued the remaining dashboard/page parity audit by comparing the active billing suspense fallback against the migrated billing card surfaces and the shared Midday-style `Card` primitive.
- Reworked billing skeleton section panels from rounded `border-border bg-background` shells into the shared card primitive's plain `border bg-background` surface.
- Preserved billing header, interval placeholder, section heading placeholders, action placeholder, and row placeholder structure.
- Validation: focused scans confirmed the old rounded billing skeleton panel class is gone and the shared primitive-aligned `border bg-background p-5` shell is present.

## 2026-07-16 — Midday Summary Stat Skeleton Surface Parity

- Continued the remaining dashboard/page parity audit by locating active loading-state counterparts for the summary stat widgets that were migrated to flat Midday-style panels.
- Reworked AI credits, estates list, estate detail, and project detail summary-stat skeleton tiles from rounded generic `border-border bg-background` cards into the same flat light/dark bordered surfaces used by the loaded stat widgets.
- Removed the AI credits skeleton's stale circular icon placeholder so its loading anatomy now matches the loaded label/value/suffix summary cards.
- Preserved lower page-section skeleton placeholders that represent separate content areas not covered by this summary-stat slice.
- Validation: focused scans confirmed the touched summary-stat skeleton rows now use the migrated flat surface tokens, no longer use oversized `mt-3 h-8` value placeholders, and no longer render the stale AI credits round icon placeholder.

## 2026-07-16 — Midday Summary Stat Widget Surface Parity

- Continued the remaining dashboard/page parity audit by scanning active summary-stat components that still rendered simple label/value metrics through `Card` / `CardContent` wrappers.
- Reworked blog, payroll, estates list, estate detail, project detail, and AI credits summary stat tiles into direct Midday-style flat bordered widget surfaces with compact label/value typography.
- Preserved all existing query inputs, status/summary values, suffix copy, and responsive grid layouts for the touched summary components.
- Validation: focused scans confirmed the touched summary-stat files no longer import shared card primitives or use the old heavy `font-semibold text-2xl` metric typography, and now use the migrated flat surface tokens.

## 2026-07-16 — Midday Analytics And Reports Skeleton Surface Parity

- Continued the remaining dashboard/page parity audit by checking active `/analytics` and `/reports` suspense fallbacks after the content panels were flattened.
- Reworked analytics metric/section skeleton panels and reports section skeleton panels from rounded generic `border-border bg-background` shells into the same flat light/dark bordered surfaces used by the migrated content.
- Preserved route fallback composition, heading/period placeholders, and row placeholder structure for both pages.
- Validation: focused scans confirmed the touched skeleton files no longer contain old rounded generic panel shells and now share the migrated `border-[#e6e6e6]` / dark border surface tokens.

## 2026-07-16 — Midday Analytics Surface Card Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys analytics panels against Midday's reports metrics cards and overview widget surfaces.
- Reworked analytics metric cards, page-view chart, event mix, ranked-list/share panels, agent performance, and recent-events panels from shared card header/content stacks into direct bordered analytics surfaces with internal headings.
- Replaced nested rounded list-item cards inside analytics panels with divided row treatment while preserving chart bars, lead/source shares, property links, agent counts, and recent-event timestamps.
- Validation: focused scans confirmed the touched analytics section no longer imports or renders shared card primitives, old card-header primitives, or the old rounded nested row surface.

## 2026-07-16 — Midday Reports Surface Card Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys report sections against Midday's reports metrics route and overview widget-card surfaces.
- Reworked the business summary, agent performance, and listings performance report sections from `CardHeader` / `CardTitle` / `CardContent` stacks into direct bordered report surfaces with internal heading/action rows.
- Aligned monthly summary metric tiles with Midday's flat bordered widget-card treatment instead of nested rounded background tiles.
- Preserved CSV export actions, monthly labels, empty states, report tables, and existing report-section descriptions.
- Validation: focused scans confirmed the touched reports section no longer imports or renders shared card primitives or the old rounded nested summary tile surface.

## 2026-07-16 — Midday Template Sandbox Configure Card Surface Parity

- Continued the remaining dashboard/page parity audit by scanning non-settings card-header/card-description surfaces after the dashboard home publishing panel was flattened.
- Reworked the template sandbox configure form from `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` anatomy into a plain padded card with a simple title, muted description, and direct form body.
- Preserved the existing client create mutation, native-select controls, default form values, generated-profile cards, and profile navigation/clone/archive behavior.
- Validation: focused scans confirmed the touched template sandbox index no longer imports or renders `CardDescription`, `CardHeader`, or `CardTitle`, while the generated-profile card content remains intact.

## 2026-07-16 — Midday Dashboard Home Publishing Panel Surface Parity

- Continued the remaining dashboard/page parity audit by revisiting dashboard home surfaces after form-control, alert, and badge residue scans were clean.
- Reworked `PublishingControl` from a nested `CardHeader` / `CardContent` card into the same direct bordered overview panel style used by Midday widget cards and the migrated home quick-action/domain surfaces.
- Preserved published-version status, domain-provisioning status, live-site URL display, and existing view/manage/edit actions.
- Validation: focused scans confirmed the touched publishing panel no longer imports or renders shared card header/content/title primitives, and no old hard-coded muted `text-[#878787]` copy remains in that file.

## 2026-07-16 — Midday Builder Toolbar Badge Variant Parity

- Continued the remaining dashboard/page parity audit by scanning for local toggle/status chrome after the select, checkbox, and alert residue checks were clean.
- Normalized the builder workspace toolbar's onboarding status badge to use the shared `Badge` secondary variant instead of custom primary-tinted border/background/text classes.
- Preserved the existing onboarding-step gating and toolbar action composition.
- Validation: focused scans confirmed the old `border-primary/30 bg-primary/10 text-primary` toolbar badge residue is gone and shared badge usage remains present.

## 2026-07-16 — Midday Notification Setting Row Anatomy Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys notification preference rows directly against Midday's `NotificationSetting` component.
- Reworked notification preference rows to use Midday's left description block plus right channel-control group shape instead of the prior responsive row with an extra type-code label beside the event name.
- Kept PlotKeys' in-app/email-only channel set, existing `ChannelToggle` mutation behavior, accordion grouping, and preference invalidation intact.
- Validation: focused scans confirmed the old inline notification type-label expression and old responsive row class are gone, while shared `Label` / `Checkbox` channel controls remain present.

## 2026-07-16 — Midday Notification Channel Checkbox Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys notification channel toggles against Midday's `NotificationSetting` channel controls.
- Replaced local icon pill-button channel toggles with shared `Checkbox` / `Label` controls for in-app and email channels, matching Midday's per-channel checkbox pattern.
- Preserved the existing `notifications.updatePreference` mutation payloads, pending disabled state, preference invalidation, category accordion grouping, and current in-app/email state composition.
- Validation: focused scans confirmed the old primary pill styling and lucide channel icon imports are gone from the notification preference cells and shared checkbox usage is present.

## 2026-07-16 — Midday Onboarding Checkbox Primitive Parity

- Continued the remaining dashboard/page parity audit by scanning dashboard components and routes for raw native checkbox/radio controls after wrapper, select, and alert residue checks.
- Replaced the onboarding property-type multi-select and content-readiness flag raw checkbox inputs with the shared Midday-style `Checkbox` primitive.
- Preserved the existing React Hook Form controller state, selected property-type array behavior, content-readiness boolean fields, labels, and onboarding submit flow.
- Validation: focused scans confirmed no leftover native checkbox inputs or `accent-primary` checkbox styling in the touched onboarding form file and confirmed shared `Checkbox` usage is present.

## 2026-07-16 — Midday Verification Dev Alert Default Surface Parity

- Continued the remaining dashboard/page parity audit by checking development-only verification shortcut alerts that still overrode the shared alert surface with local primary classes.
- Normalized the tenant onboarding verification shortcut and global verify-email shortcut alerts to the shared default `Alert` surface while preserving their dev-only gating, link display, and action buttons.
- Kept badge-like status indicators and auth inline errors out of this slice because they are not dashboard alert-panel surfaces.
- Validation: focused scans confirmed the old `border-primary/20 bg-primary/5` alert residue is gone from the touched verification pages and shared alert usage remains present.

## 2026-07-16 — Midday Status Alert Default Primitive Parity

- Continued the remaining dashboard/page parity audit by checking shared `Alert` instances that still carried local primary-colored status classes.
- Normalized the blog post saved notice and builder workspace status notice to the shared default `Alert` surface instead of local `border-primary` / `bg-primary` overrides.
- Preserved saved-state visibility, message content, and builder notice composition while staying within the Midday alert variant contract.
- Validation: focused scans confirmed the old primary alert class residue is gone from the touched blog and builder files and shared alert usage remains present.

## 2026-07-16 — Midday Onboarding Form Error Alert Primitive Parity

- Continued the remaining dashboard/page parity audit by scanning local primary/destructive notice styling after the dashboard wrapper and raw select residue checks came back clean.
- Replaced the onboarding content-readiness form's raw destructive `formError` paragraph with the shared `Alert` / `AlertDescription` primitive using `variant="destructive"`.
- Preserved the existing form error state, step action layout, quick-fill control, and submit behavior.
- Validation: focused scans confirmed the old `rounded-md bg-destructive/10` onboarding form error residue is gone from the touched file and shared destructive alert usage is present.

## 2026-07-16 — Midday Domains Error Cell Alert Primitive Parity

- Continued the remaining dashboard/page parity audit by checking domain error displays for hand-rolled destructive notice boxes.
- Replaced the provisioned-domains table `DomainLastErrorCell` boxed error surface with the shared `Alert` / `AlertDescription` primitive using `variant="destructive"` while preserving the compact table-cell width and padding.
- Kept the plain inline DNS setup-card last-error text unchanged because it is not a framed notice surface.
- Validation: focused scans confirmed the old domain `border-destructive/20 bg-destructive/10` boxed error residue is gone from the touched table-cell module and shared destructive alert usage is present.

## 2026-07-16 — Midday Builder Error Alert Primitive Parity

- Continued the remaining dashboard/page parity audit by scanning builder error/status notice surfaces for hand-rolled destructive panels.
- Replaced the builder preview inline error strip with the shared `Alert` / `AlertDescription` primitive using `variant="destructive"` while preserving its placement above the preview runtime body.
- Replaced the builder workspace error notice's local destructive border/background classes with the shared destructive alert variant.
- Validation: focused scans confirmed the old builder `border-destructive` / `bg-destructive/10` error panel residue is gone from the touched files and destructive shared alert usage is present.

## 2026-07-16 — Midday Blog Detail Notice Primitive Parity

- Continued the remaining dashboard/page parity audit by scanning raw status/error notice panels for shared primitive replacement opportunities.
- Reworked `BlogDetailNotice` to delegate to the shared `Alert` / `AlertDescription` primitive instead of constructing local primary/destructive border and background classes by hand.
- Preserved the existing `default` / `destructive` notice API and the blog status/delete error display path.
- Validation: focused scans confirmed the old `border-destructive/30 bg-destructive/10` and `border-primary/20 bg-primary/10` classes are gone from the blog detail notice wrapper and shared alert usage is present.

## 2026-07-16 — Midday Project Subpage Alert Primitive Parity

- Continued the remaining dashboard/page parity audit by scanning project budget/workforce subpages for hand-rolled destructive mutation error panels.
- Replaced raw destructive error `<div>` panels in budget line-item deletion, worker update/delete, and payroll-run update flows with the shared `Alert` / `AlertDescription` primitive using `variant="destructive"`.
- Preserved mutation ownership, invalidation behavior, message content, table placement, and existing form-level alert behavior.
- Validation: focused scans confirmed no leftover raw `border-destructive/30 bg-destructive/10` project subpage panels in the touched files and confirmed destructive `Alert` usage is present.

## 2026-07-16 — Midday Template Sandbox Native Select Primitive Parity

- Continued the remaining dashboard/page parity audit by scanning the template sandbox create form for raw select controls with local `rounded-md border-input bg-background` styling.
- Replaced the template and plan-context raw selects with the shared `NativeSelect` / `NativeSelectOption` primitive while preserving the existing `templateKey` and `planTier` field names, default values, and option values.
- Kept the existing client mutation, catalog lookup, profile navigation, and sandbox creation payload contract unchanged.
- Validation: focused scans confirmed no leftover raw select/option tags or old select class residue in the touched template sandbox index module, and confirmed the shared native-select primitive is now used there.

## 2026-07-16 — Midday Property And Estate Native Select Primitive Parity

- Continued the remaining dashboard/page parity audit by scanning listing/estate forms for raw select controls with local `rounded-md border-input bg-background` styling.
- Replaced raw selects in `PropertyForm` for listing type, status, and featured state with the shared `NativeSelect` / `NativeSelectOption` primitive while preserving registered field names and option values.
- Replaced the raw publish-state select in `EstateLaunchDetailsForm` with the shared native-select primitive while preserving the existing `publishState` form contract.
- Validation: focused scans confirmed no leftover raw select/option tags or old select class residue in the touched property and estate launch form modules, and confirmed the shared native-select primitive is now used in both files.

## 2026-07-16 — Midday Project Native Select Primitive Parity

- Continued the remaining dashboard/page parity audit by scanning project detail forms for local form-control styling residue that diverges from the shared Midday-style input primitive.
- Replaced repeated raw native `<select>` / `<option>` controls in project customer-access, team, issue, milestone, and update forms with the shared `NativeSelect` / `NativeSelectOption` primitive already used by dashboard form modules.
- Removed the repeated pre-migration select class string from those project forms while preserving field names, option values, native select behavior, mutation payloads, and project cache invalidation.
- Validation: focused scans confirmed no leftover raw select/option tags or old select class residue in the touched project form modules, and confirmed the shared native-select primitive is now used in each touched file.

## 2026-07-16 — Midday Settings Company Name And Logo Exactness

- Continued the remaining dashboard/page parity audit by rechecking PlotKeys settings root cards against Midday's `CompanyName` and `CompanyLogo` references.
- Tightened the company-name schema from `min(1).max(32)` to Midday's exact `min(2).max(32)` validation while preserving the existing `workspace.updateCompanyProfile` mutation path.
- Aligned the logo avatar spinner/image/fallback rendering with Midday's `CompanyLogo` card by using `Spinner className="h-4 w-4"`, explicit `height={64}` / `width={64}` image props, and the default `AvatarFallback` styling instead of PlotKeys-only size/image padding/fallback rounding.
- Preserved PlotKeys' `/api/upload` storage path, company-settings invalidation, hidden file input, spinner, and Midday card header/footer anatomy.
- Validation: focused scans confirmed the old `min(1)`, 64-character residue, spinner `size={16}`, padded logo image class, and rounded fallback override are gone, and the Midday min/logo props are present.

## 2026-07-16 — Midday Settings Company Name Limit Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys company-name settings against Midday's `CompanyName` settings card.
- Preserved Midday's settings card anatomy (`CardHeader`, `CardDescription`, `CardContent`, `CardFooter`) after confirming that this surface should not be flattened.
- Aligned the company-name validation and input cap with Midday's 32-character limit instead of PlotKeys' previous 64-character limit.
- Updated the company-name description and footer copy to include Midday's company-or-department guidance and 32-character maximum.
- Validation: focused scans confirmed the old 64-character company-name limit/copy is gone and the 32-character Midday contract is present in schema, input, and footer.

## 2026-07-16 — Midday Domains Card Surface Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys domain management and connect-domain surfaces against Midday's plain settings/billing card composition patterns.
- Reworked the domain control card from `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` composition into a plain padded card with title text, muted status copy, and existing sync/connect actions.
- Reworked DNS instruction cards from amber-tinted card headers and framed error boxes into plain padded cards with muted instruction text, scrollable DNS record tables, and plain destructive error text.
- Flattened the connect-domain intake and setup guidance cards to plain padded cards, removing decorative step icons and the remaining card-header/card-description split while preserving supported-TLD copy, DNS guidance, badges, and the existing connect form.
- Validation: focused scans confirmed no leftover domain `CardDescription`, `CardHeader`, `CardTitle`, `CardContent`, amber DNS card surfaces, decorative setup icons, or old framed destructive surfaces in the touched domain files.

## 2026-07-16 — Midday Billing Plan Card Surface Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys billing cards against Midday's billing `ManageSubscription` card and `Plans` card primitives.
- Reworked the current-plan billing card from `CardHeader` / `CardTitle` / `CardDescription` composition into a Midday-style plain `Card` with `flex flex-col gap-4 p-4`, current-plan label/value, status badge, and muted date metadata.
- Reworked plan comparison cards from nested card headers/descriptions into text-first padded cards with plan name, price, trial/billing note, feature list, and existing checkout actions.
- Flattened the repair-payment form into the same plain padded `Card` surface while preserving the Paystack reference repair behavior.
- Preserved Paystack checkout initialization, selected interval handling, current-plan disabling, downgrade support messaging, and billing history behavior.
- Validation: focused scans confirmed the touched billing card slice no longer uses `CardDescription`, `CardHeader`, `CardTitle`, `CardContent`, or old current-plan copy.

## 2026-07-16 — Midday Dashboard Home Connected Domains Widget Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys connected-domain home cards against Midday's text-first overview `WidgetCard` pattern.
- Reworked connected-domain cards from generic `CardHeader` / `CardTitle` / `CardDescription` surfaces with status badges into Midday-style bordered widget links with label, hostname value, and status detail text.
- Flattened the empty connected-domains state to a plain bordered panel while preserving the existing `/domains` action.
- Validation: focused scans confirmed no leftover card-description imports, generic card header primitives, badge imports, or old softened card surface tokens in the touched connected-domains file.

## 2026-07-16 — Midday Dashboard Home Widget Surface Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys dashboard home widgets against Midday's overview `WidgetCards` and `QuickActions` patterns.
- Reworked dashboard home stat cards from icon-led rounded cards into Midday-style text-first bordered widget links with label, value, and detail text, and aligned their skeleton to the same compact card structure.
- Flattened home quick actions from stacked descriptive cards with decorative icon capsules into a Midday-style compact action strip while preserving the existing builder, properties, leads, appointments, and analytics links.
- Removed the decorative publishing status icon capsule and `CardDescription` composition so the publishing card uses a simpler title plus muted status text, preserving badges, URL display, and actions.
- Validation: focused scans confirmed no leftover home `CardDescription`, decorative icon capsule, or removed lucide icon symbols in the touched dashboard home files.

## 2026-07-16 — Midday App Store Grid And Empty-State Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys `/app-store` list composition against Midday's `Apps` grid and `AppsSkeleton`.
- Flattened the App Store body from PlotKeys-only plan summary plus category section wrappers into Midday's single responsive app grid (`mx-auto mt-8`, `grid-cols-1`, `md`, `lg`, `2xl`).
- Replaced the local empty card with Midday-style full-grid empty states for no installed apps and no search results, including the clear-search outline action routed to `/app-store`.
- Updated `AppStoreSkeleton` to Midday's 12-card app grid loader with `Card`, round logo placeholder, text skeletons, and paired bottom action placeholders.
- Preserved PlotKeys-specific plan gating, locked upgrade links, enabled/disabled module toggles, registry search matching, and installed-tab filtering.
- Validation: focused scans confirmed no stale App Store summary/category wrapper symbols and no old skeleton wrapper symbols in the touched files.

## 2026-07-16 — Midday App Store Toggle Chrome Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys `AppToggle` against Midday's compact app-settings switch rows.
- Removed local error state and the extra vertical wrapper from `AppToggle` so the App Store tile bottom row renders a direct switch control instead of a switch plus inline error stack.
- Preserved the existing `workspace.setAppEnabled` mutation, pending disabled state, and `router.refresh()` behavior required by the server-composed `getCompanyAppsContext` App Store data.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports, no leftover local toggle error/wrapper symbols, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday App Store Card Tile Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys App Store cards against Midday's `UnifiedAppComponent` app tile.
- Reworked App Store cards from a settings-card header/content/toggle layout into a Midday-style app tile with top logo/status strip, compact title/status header, short description body, and bottom action area.
- Updated the App Store grid to use Midday's app-store responsive columns (`grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`, `2xl:grid-cols-4`) and aligned `AppStoreSkeleton` to the new tile anatomy.
- Preserved plan gating, upgrade links, enabled/disabled state, `AppToggle` behavior, search, tabs, and plan summary behavior.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports, no leftover old app-card helper/chrome symbols, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Integration Overview App Tile Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys integration overview cards against Midday's app-store `UnifiedAppComponent` tile structure.
- Reworked `IntegrationCard` from a settings-card header/content/actions layout into a Midday-style app tile: top logo/status strip, compact card header, short description body, and bottom full-width outline actions.
- Updated the integrations overview skeleton to mirror the new app-tile anatomy with logo/status, title/status, description, and bottom action placeholders.
- Preserved integration connection detection, settings configuration links, documentation links, and connected-count behavior.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports, no leftover old integration-card helper symbols, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Integration Settings Form Primitive Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys integration settings against Midday's zod-backed settings form-card pattern.
- Replaced manual integration form state with the existing `useZodForm` hook and a focused zod schema for Google Analytics, Facebook Pixel, WhatsApp, and Calendly fields.
- Reworked each integration input to render through shared `Form`, `FormField`, `FormControl`, `FormItem`, and `FormMessage` primitives while preserving the existing icon, label, description, and bordered setting-row layout.
- Replaced the plain save button and saving text swap with shared `SubmitButton` spinner-overlay behavior, preserving the existing `workspace.updateCompanyIntegration` mutation and null-on-blank payload contract.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports, no leftover manual state/button symbols in the touched integration form, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Settings Logo Minimal Upload Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys' `LogoUploadForm` directly against Midday's `CompanyLogo` card.
- Removed the PlotKeys-only logo card content area with manual URL input, upload/remove buttons, and inline error banner so the active card now mirrors Midday's header, clickable avatar upload target, hidden file input, spinner, and footer-only structure.
- Preserved the existing `/api/upload` plus `workspace.setCompanyLogo` mutation path behind the avatar click while keeping failures outside the card UI, matching Midday's minimal logo-card surface.
- Removed the unused legacy `LogoUpload` component that still carried the old preview, upload-vs-URL mode switcher, manual URL save, remove button, and Supabase-specific upload path.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports, no leftover manual logo controls in the active logo form, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Settings Profile Form Primitive Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys' editable profile cards against Midday's `CompanyName` form-card pattern.
- Replaced local manual state and `FieldGroup` form chrome in the Company name and Primary market cards with shared `Form`, `FormField`, `FormControl`, `FormItem`, and `FormMessage` primitives.
- Added focused zod-backed form schemas through the existing `useZodForm` hook, preserving the current `workspace.updateCompanyProfile` mutation payloads and company-settings invalidation.
- Replaced local saving-label buttons with shared `SubmitButton` spinner-overlay behavior, matching the Midday settings-card submit pattern.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports, no leftover manual field/state/button symbols in the touched settings slice, no trailing whitespace, and clean `git diff --check` for the edited file.

## 2026-07-16 — Midday Integration Settings Card Footer Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys integration settings against Midday's settings-list card and app settings patterns.
- Moved integration settings `CardContent` and `CardFooter` ownership into the client settings form so the outer settings-list card owns only the card/header, error boundary, and suspense handoff.
- Reworked the integration settings body into bordered setting rows with shared `FieldContent` / `FieldDescription` primitives and moved the save action plus blank-field guidance into the card footer.
- Updated the integration settings skeleton to mirror the card content/footer structure, including icon, field, helper-text, and action placeholders.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Notification Settings Accordion Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys notification preferences against Midday's `NotificationsSettingsList` and grouped `NotificationSettings` accordion pattern.
- Added local notification category/order metadata for Website, Workspace, and Account events while preserving each notification type id and existing preference mutation contract.
- Reworked `NotificationPreferencesSettings` from flat bordered rows into Midday-style grouped accordion sections with category-header skeleton rows.
- Preserved the existing in-app/email channel toggles and `notifications.updatePreference` behavior inside the new grouped rendering.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Settings Workspace And Danger Card Chrome Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys' workspace and danger settings cards against Midday's `TeamIdSection` and `DeleteTeam` settings card patterns.
- Removed local padding overrides from the Workspace card so it uses shared Midday-style `CardHeader` / `CardContent` spacing, and added a `CardFooter` note for workspace routing and billing context.
- Flattened the Danger Zone card to Midday's destructive-card pattern: destructive border on the card, `CardHeader` copy, and the delete action in `CardFooter` instead of a nested bordered panel.
- Kept the destructive action disabled, preserving current PlotKeys behavior while aligning its visual ownership and button variant to the Midday delete-card shape.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Settings Logo Card Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys' company logo setting against Midday's `CompanyLogo` settings card.
- Moved logo settings card ownership into `LogoUploadForm`, matching Midday's card structure with a header row, clickable square avatar target, and `CardFooter` guidance.
- Updated the primary upload path to save the uploaded logo URL immediately after `/api/upload` returns, matching Midday's upload-and-mutate flow while preserving PlotKeys' manual URL fallback.
- Kept the existing `workspace.setCompanyLogo` API contract unchanged and kept the settings route/component contract stable through `SettingsBrandingCard`.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Settings Profile Card Split Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys settings root components against Midday's general settings cards such as `CompanyName`, `CompanyLogo`, and `CompanyCountry`.
- Split the combined PlotKeys company profile card into discrete Midday-style settings cards for `Company name` and `Primary market`, while keeping the public `SettingsProfileCard` route contract stable.
- Moved editable setting actions into `CardFooter` sections, matching Midday's settings card pattern for form guidance and save actions.
- Kept the existing workspace settings API contract unchanged: the name card sends `name`, and the market card sends nullable `market` through the existing `workspace.updateCompanyProfile` mutation.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Builder Preview Route Boundary Parity

- Continued the remaining dashboard/page parity audit by classifying the remaining non-boundary dashboard pages: billing callback and property detail are redirect-only routes, settings routes match Midday's settings shapes, and Builder Preview was the remaining UI route without a boundary.
- Added feature-owned `BuilderTemplatePreviewSkeleton`, mirroring the template preview sidebar, toolbar, publish strip, and framed website preview surface.
- Updated the Builder Preview route to wrap `BuilderTemplatePreview` in route-level `ErrorBoundary` / `Suspense`, matching the route-owned boundary pattern used by the migrated dashboard pages.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Settings Subroute Suspense Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys settings notification/integration subroutes against Midday's settings notification route.
- Added route-level `Suspense` wrappers around `NotificationPreferencesSettingsList` and `IntegrationSettingsList`, matching Midday's settings subroute handoff pattern while preserving the feature-owned inner `ErrorBoundary` / skeleton fallbacks.
- Kept the settings root unchanged because the current route already matches Midday's general settings page shape: server prefetch plus `HydrateClient` around a vertical settings stack.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Connect Domain Route Boundary Parity

- Continued the remaining dashboard/page parity audit by moving the Connect Domain page onto the same Midday route/body boundary pattern as the migrated dashboard pages.
- Added feature-owned `ConnectDomainContent` so session enforcement and Vercel provisioning-readiness resolution live behind the route body boundary.
- Added feature-owned `ConnectDomainSkeleton` matching the current connect-domain header, hostname intake card, setup-step cards, and DNS instruction surface.
- Updated the Connect Domain route to stay thin: it renders `ScrollableContent` and wraps the async body in `ErrorBoundary` / `Suspense` with the feature-owned skeleton.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Live Preview Route Boundary Parity

- Continued the remaining dashboard/page parity audit by moving the Live Preview page toward the Midday route composition pattern used by migrated dashboard pages.
- Added feature-owned `LivePreviewContent` so session lookup, hostname normalization, and `getLivePreviewData` now live behind the route body boundary instead of blocking the route shell directly.
- Added feature-owned `LivePreviewSkeleton` matching the existing live preview header plus framed website preview surface.
- Updated the Live Preview route to stay thin: it now resolves URL `searchParams`, renders `ScrollableContent`, and wraps the async body in `ErrorBoundary` / `Suspense` with the feature-owned skeleton.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched source slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday App Store Header/Search Tabs Route Parity

- Continued the remaining dashboard/page parity audit by comparing PlotKeys App Store against Midday's Apps page, header, tabs, search, suspense, and error-boundary composition.
- Added feature-owned `AppStoreHeader` and `AppStoreTabs`, matching Midday's `AppsHeader` / `AppsTabs` shape with URL-backed `tab=all|installed` state and a shallow `q` search field.
- Extended the shared dashboard `SearchField` with Midday's optional `shallow` query-state behavior while keeping existing q-search callers compatible.
- Moved App Store body loading into feature-owned `AppStoreContent`, leaving the route responsible for thin `searchParams` handoff, `AppStoreHeader`, and `ErrorBoundary` / `Suspense` composition with `AppStoreSkeleton`.
- Updated `AppStoreView` so `q` / `tab` drive status/category filtering and empty-state rendering, keeping toggle cards focused on app status, plan gating, and category grids.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Team Joined Date Range Contract Wiring

- Continued the remaining dashboard/page parity audit by applying the Midday-style `start` / `end` date-range data contract to Team, whose visible `Joined` column is backed by membership `createdAt`.
- Extended `useTeamFilterParams` so Team URLs, server prefetch, client infinite queries, and filter resets understand `start` / `end` alongside q-search and sort state.
- Extended the `team.listMembers` tRPC input and `listMembershipsForCompany` DB query options to accept `start` / `end` date range filters.
- Implemented Team joined-date filtering against membership `createdAt`, composing with existing search and sort behavior.
- Kept the Team header on the Midday-style simple `SearchField` pattern rather than introducing a non-reference filter button into the header.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Notifications Created Date Range Contract Wiring

- Continued the remaining dashboard/page parity audit by applying the Midday-style `start` / `end` date-range data contract to Notifications, whose visible meta cell displays `createdAt`.
- Extended `useNotificationsFilterParams` so server prefetch, client infinite queries, and clear/reset behavior understand `start` / `end` alongside `q` and unread filter state.
- Extended the `notifications.list` tRPC input and `listNotificationsForUser` DB query options to accept `start` / `end` date range filters.
- Implemented Notifications created-date filtering against `createdAt`, composing with the existing unread/read and search filters.
- Updated the Notifications table no-results branch to use `hasFilters`, so unread/date/search filters all render the filtered-empty state consistently.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Customers Added Date Range Contract Completion

- Continued the remaining dashboard/page parity audit by comparing PlotKeys Customers against Midday's customer page, header, filter params, and table data flow.
- Kept the Customers header on the Midday-matching simple `SearchField` pattern instead of replacing it with the generic filter button.
- Completed the existing Customer `start` / `end` URL-state contract by extending the `customers.get` tRPC input and customer DB query options to accept date ranges.
- Added an `Added` date-range descriptor to the customer filter metadata route, matching the visible `Added` / `createdAt` table column.
- Implemented Customers date filtering against `createdAt` for both the paginated customer list and filtered customer helper path.
- Validation: focused scans confirmed no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Employees Start Date Range Filter Wiring

- Continued the remaining dashboard/page parity audit by applying the Midday-style date-range filter contract to the active Employees table page, whose visible Department cell includes the employee `Started` date backed by `startDate`.
- Added a `Start date` `type: "date-range"` filter to `EmployeesSearchFilter`, using the generic `start` / `end` filter state shape expected by the Midday-style `DateRangeFilter` and filter chip list.
- Extended `useEmployeesFilterParams` so Employees URLs load, set, clear, and prefetch `start` / `end` values alongside `q`, `status`, `department`, and `sort`.
- Extended the `workspace.listEmployees` tRPC input and `listEmployeesForCompany` DB query options to accept `start` / `end` date range filters.
- Implemented Employees start-date filtering against `startDate`, so records without a start date naturally fall out only when a start-date range is active.
- Validation: focused scans confirmed the date-range markers, no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Leads Captured Date Range Filter Wiring

- Continued the remaining dashboard/page parity audit by applying the Midday-style date-range filter contract to the active Leads table page, whose visible `Captured` column is backed by `createdAt`.
- Added a `Captured date` `type: "date-range"` filter to `LeadsSearchFilter`, using the generic `start` / `end` filter state shape expected by the Midday-style `DateRangeFilter` and filter chip list.
- Extended `useLeadFilterParams` so Leads URLs load, set, and prefetch `start` / `end` values alongside `q`, `status`, and `sort`.
- Extended the `workspace.listLeads` tRPC input and `listLeadsForCompany` DB query options to accept `start` / `end` date range filters.
- Implemented Leads captured-date filtering against `createdAt`, matching the visible table column and existing sort field.
- Validation: focused scans confirmed the date-range markers, no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Blog Published Date Range Filter Wiring

- Continued the remaining dashboard/page parity audit by applying the Midday-style date-range filter contract to the active Blog table page, whose visible `Activity` column includes `Published` and whose default ordering is backed by `publishedAt`.
- Added a `Published date` `type: "date-range"` filter to `BlogSearchFilter`, using the generic `start` / `end` filter state shape expected by the Midday-style `DateRangeFilter` and filter chip list.
- Extended `useBlogFilterParams` so Blog URLs load, set, clear, and prefetch `start` / `end` values alongside `q`, `status`, and `sort`.
- Extended the `workspace.listBlogPosts` tRPC input and `listBlogPostsForCompany` DB query options to accept `start` / `end` date range filters.
- Implemented Blog published-date filtering against `publishedAt`, so drafts or archived posts with no published date naturally fall out when a published-date range is active.
- Validation: focused scans confirmed the date-range markers, no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Appointments Schedule Date Range Filter Wiring

- Continued the remaining dashboard/page parity audit by applying the Midday-style date-range filter contract to the active Appointments table page, whose visible `Schedule` column is backed by `scheduledAt`.
- Added a `Schedule` `type: "date-range"` filter to `AppointmentsSearchFilter`, using the generic `start` / `end` filter state shape expected by the Midday-style `DateRangeFilter` and filter chip list.
- Extended `useAppointmentFilterParams` so Appointments URLs load, set, and prefetch `start` / `end` values alongside `q`, `status`, `view`, and `sort`.
- Extended the `workspace.listAppointments` tRPC input and `listAppointmentsForCompany` DB query options to accept `start` / `end` date range filters.
- Implemented scheduled appointment filtering against `scheduledAt`, composing cleanly with the existing `upcoming` view by using the later lower bound when both filters are active.
- Validation: focused scans confirmed the date-range markers, no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Projects Timeline Date Range Filter Wiring

- Continued the remaining dashboard/page parity audit by applying the Midday-style date-range filter contract to the active Projects table page, whose visible `Timeline` column already exposes start and target completion dates.
- Added a `Timeline` `type: "date-range"` filter to `ProjectsSearchFilter`, using the generic `start` / `end` filter state shape expected by the Midday-style `DateRangeFilter` and filter chip list.
- Extended `useProjectsFilterParams` so Projects URLs load, set, clear, and prefetch `start` / `end` values alongside `q`, `status`, and `sort`.
- Extended the `projects.list` tRPC input and `listProjectsForCompany` DB query options to accept `start` / `end` date range filters.
- Implemented Projects timeline filtering as interval overlap, so a project is included when its `startDate` / `targetCompletionDate` window intersects the selected filter range.
- Validation: focused scans confirmed the date-range markers, no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Leave Request Date Range Filter Wiring

- Continued the remaining dashboard/page parity audit by carrying the newly added Midday-style date range filter contract into an active table page with visible date semantics.
- Added a `Leave date` `type: "date-range"` filter to `LeaveRequestsSearchFilter`, using the generic `start` / `end` filter state shape expected by the Midday-style `DateRangeFilter` and filter chip list.
- Extended `useLeaveRequestsFilterParams` so leave request table URLs load, set, clear, and prefetch `start` / `end` values alongside `q`, `status`, and `sort`.
- Extended the `workspace.listLeaveRequests` tRPC input and `listLeaveRequestsForCompany` DB query options to accept `start` / `end` date range filters.
- Implemented leave request date filtering as interval overlap, so a request is included when its `startDate` / `endDate` window intersects the selected filter range.
- Validation: focused scans confirmed the date-range markers, no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday Dashboard Date Range Filter Support Parity

- Continued the remaining dashboard/page parity audit by comparing Midday's `date-range-filter.tsx`, `date-presets.ts`, invoice search filter, transaction search filter, and filter chip list against PlotKeys' generic dashboard `search-filter` surface.
- Added `apps/dashboard/src/utils/date-presets.ts` with Midday's date preset options for this month, last month, quarters, year-to-date, last year, and recent 30/60/90 day ranges.
- Added `apps/dashboard/src/components/date-range-filter.tsx` with Midday's select preset plus two-month range calendar contract, adapted only from `@midday/ui` imports to `@plotkeys/ui` imports and defaulting week start to Sunday because PlotKeys does not yet expose Midday's `useUserQuery().weekStartsOnMonday` setting.
- Extended the generic dashboard `SearchFilter` to render `type: "date-range"` filters as Midday-style `DateRangeFilter` submenu content, writing `start`/`end`-style URL filter state and keeping ordinary option filters on the existing checkbox list path.
- Extended generic filter chips so date-range filters format the visible chip as a start/end date range and clear both range keys together, matching Midday's `start`/`end` chip lifecycle.
- Validation: focused scans confirmed date-range markers, no stale `@midday`, `useUserQuery`, `little-date`, or `Icons.*` imports in the touched slice, no trailing whitespace, and clean `git diff --check` for the edited files.

## 2026-07-16 — Midday UI Hooks Barrel Parity

- Continued the shared dashboard support-surface audit by comparing Midday's UI hook barrel against PlotKeys' UI package hooks.
- Added `packages/ui/src/hooks/use-media-query.ts` with Midday's string-query `matchMedia` hook contract for responsive dashboard modal and wrapper behavior.
- Added `packages/ui/src/hooks/use-enter-submit.ts` with Midday's textarea enter-to-submit form hook contract.
- Updated `packages/ui/src/hooks/index.ts` to export `use-enter-submit` and `use-media-query` alongside PlotKeys' existing mobile, resize, sticky-column, and table-scroll hooks.
- Exposed `./hooks` from `packages/ui/package.json` to match Midday's direct `@midday/ui/hooks` import path while retaining PlotKeys' existing `./hooks/*` export.
- Validation: focused scans confirmed the hook contracts, package export, no stale `@midday` imports, no active dashboard callers requiring migration, no trailing whitespace, and clean `git diff --check`.

## 2026-07-16 — Midday Date Picker And Morph Feedback Infrastructure Parity

- Continued the shared dashboard filter/form-feedback primitive audit by comparing Midday's `date-range-picker`, `animated-size-container`, `text-morph`, `text-shimmer`, `submit-button-morph`, and `use-resize-observer` surfaces against PlotKeys' missing UI package surface.
- Added `packages/ui/src/components/date-range-picker.tsx` with Midday's `DateRangePicker` contract, range calendar popover behavior, two-month range calendar, outline trigger button, placeholder text, disabled trigger support, and end-aligned popover.
- Added `packages/ui/src/hooks/use-resize-observer.ts` and `packages/ui/src/hooks/index.ts` so Midday-style components can import shared hooks through `../hooks`.
- Added `packages/ui/src/components/animated-size-container.tsx` with Midday's framer-motion width/height measurement animation contract.
- Added `packages/ui/src/components/text-morph.tsx` and `packages/ui/src/components/text-shimmer.tsx` with Midday's animated text transition and shimmer contracts.
- Added `packages/ui/src/components/submit-button-morph.tsx` with Midday's animated submit button state contract, composed from `AnimatedSizeContainer`, `TextMorph`, `Spinner`, and the shared `Button`.
- Exposed `./date-range-picker`, `./animated-size-container`, `./text-morph`, `./text-shimmer`, and `./submit-button-morph` from `packages/ui/package.json`.
- Adapted only Midday's `Icons.ChevronDown` / `Icons.Check` usage to PlotKeys' local `Icon.ChevronDown` / `Icon.Check` namespace while preserving behavior and layout.
- Validation: focused scans confirmed the Midday component and hook markers, package exports, no stale `@midday` imports in the new surfaces, no trailing whitespace, and clean `git diff --check`.

## 2026-07-16 — Midday EmailTagInput Infrastructure Parity

- Continued the shared dashboard form primitive audit by comparing Midday's `packages/ui/src/components/email-tag-input.tsx` and `packages/utils/src/email.ts` against PlotKeys' missing email tag-input surface.
- Added Midday's shared email-list helpers to `packages/utils/src/email.ts`: `isValidEmail`, `parseEmailList`, and `isValidEmailList`, while preserving PlotKeys' existing delivery-recipient resolution helpers in the same module.
- Added `packages/ui/src/components/email-tag-input.tsx` with Midday's `EmailTagInputProps`, comma-separated value parsing, duplicate prevention, enter/comma add behavior, backspace removal, blur commit, paste parsing/deduplication, tag badge rendering, and disabled state.
- Adapted only the utility package import from `@midday/utils` to `@plotkeys/utils`; the component behavior, layout classes, badge variant, and lucide close icon usage match the Midday reference.
- Exposed `./email-tag-input` from `packages/ui/package.json` so future customer/contact form migrations can use the Midday import path.
- Validation: focused scans confirmed the shared utility exports, email-tag-input markers, package export, no stale `@midday` imports, no active dashboard callers requiring migration, and no trailing whitespace.

## 2026-07-16 — Midday MultipleSelector Infrastructure Parity

- Continued the shared dashboard selector primitive audit by comparing Midday's `packages/ui/src/components/multiple-selector.tsx` against PlotKeys' missing UI package surface.
- Added `packages/ui/src/components/multiple-selector.tsx` with Midday's default `MultipleSelector` export, `Option` and `MultipleSelectorRef` contracts, debounce helper, grouped option transformation, picked-option removal, fixed-option behavior, and imperative focus/reset API.
- Preserved Midday's async/sync search behavior, trigger-search-on-focus support, creatable options, max-selected guard, custom option rendering, empty/loading indicators, outside-click close behavior, and cmdk empty-state workaround.
- Composed the selector from the already migrated shared `Badge` and `Command` primitives and verified the required `tag-rounded` badge variant exists.
- Exposed `./multiple-selector` from `packages/ui/package.json` so future tag, vault, and multi-select dashboard migrations can use the Midday import path.
- Validation: focused scans confirmed the Midday multiple-selector markers, package export, required badge variant, no stale Midday-only imports, no trailing whitespace, and no active dashboard callers requiring migration in this slice.

## 2026-07-16 — Midday ComboboxDropdown Infrastructure Parity

- Continued the shared dashboard selector primitive audit by comparing Midday's `packages/ui/src/components/combobox-dropdown.tsx` against PlotKeys' missing UI package surface.
- Added `packages/ui/src/components/combobox-dropdown.tsx` with Midday's generic `ComboboxDropdown<T extends ComboboxItem>` contract, selected-item fallback state, search filtering, create-on-empty support, headless mode, custom selected/list/create renderers, disabled item support, and modal popover behavior.
- Composed the new selector from the already migrated shared `Button`, `Command`, and `Popover` primitives and kept Midday's cmdk `CommandList` plus lucide check/chevrons icons.
- Exposed `./combobox-dropdown` from `packages/ui/package.json` so future dashboard settings/account/category/customer selector migrations can use the Midday import path.
- Validation: focused scans confirmed the Midday combobox-dropdown markers, package export, no stale Midday-only imports, no trailing whitespace, and no active dashboard callers requiring migration in this slice.

## 2026-07-16 — Midday Quantity And Time Range Input Infrastructure Parity

- Continued the shared dashboard form primitive audit by comparing Midday's `quantity-input.tsx` and `time-range-input.tsx` against PlotKeys' missing UI package surface.
- Added `packages/ui/src/components/quantity-input.tsx` with Midday's numeric input contract, min/max bounds, raw value state, pointer-step controls, lucide plus/minus buttons, mono typography, and decimal input styling.
- Added `packages/ui/src/components/time-range-input.tsx` with Midday's controlled start/stop time state, overnight duration handling, `date-fns` parsing/difference calculation, native time inputs, and duration display.
- Exposed `./quantity-input` and `./time-range-input` from `packages/ui/package.json` so future dashboard form, invoice, and tracker-style migrations can use Midday-style import paths.
- Adapted only the missing Midday icon aliases in `TimeRangeInput` to PlotKeys' available `Icon.Calendar` and `Icon.ArrowRight` glyphs while preserving the component behavior and layout.
- Validation: focused scans confirmed the Midday quantity/time-range markers, package exports, no stale Midday-only icon aliases, no active dashboard callers requiring migration, and no trailing whitespace.

## 2026-07-16 — Midday Toast Infrastructure Contract Parity

- Continued the shared dashboard notification primitive audit by comparing PlotKeys `packages/ui/src/components/sonner.tsx` against Midday's `toast.tsx`, `use-toast.tsx`, and `toaster.tsx` UI infrastructure.
- Added Midday-style Radix toast primitives in `packages/ui/src/components/toast.tsx`, including provider, viewport, variants, action, close, title, description, and exported toast prop/action types.
- Added Midday's in-memory toast store and hook contract in `packages/ui/src/components/use-toast.tsx`, including add, update, dismiss, remove, progress, footer, and duplicate-id update behavior.
- Added a Midday-style `Toaster` renderer in `packages/ui/src/components/toaster.tsx`, preserving PlotKeys' local `Icon` namespace while matching Midday's provider, progress, spinner, footer, close, title, and description layout.
- Exposed `./toast`, `./toaster`, and `./use-toast` from `packages/ui/package.json` so future dashboard slices can migrate to Midday's toast import paths.
- Left the old `./sonner` export untouched as a compatibility shim because focused scans found no active dashboard toast call sites to migrate in this slice.
- Validation: focused scans confirmed the Midday toast/store/toaster markers, removed Sonner assumptions from the new files, exported the new package paths, and found no active dashboard usage requiring caller migration.

## 2026-07-16 — Midday Chart Primitive Contract Parity

- Continued the shared dashboard visualization primitive audit by comparing PlotKeys `packages/ui/src/components/chart.tsx` against Midday's UI chart primitive.
- Reworked `ChartContainer`, `ChartTooltipContent`, and `ChartLegendContent` into Midday's `React.forwardRef` contracts with display names.
- Switched the shared utility import to the UI `../utils` path and added Midday's client-component boundary.
- Aligned chart container attributes, Recharts outline classes, tooltip indicator CSS-variable classes, tooltip value typography, payload item typing, legend payload typing, and ref forwarding to the Midday reference.
- Removed the old shadcn `data-slot` output, old `../lib/utils` import, `outline-hidden` selectors, tooltip/legend `type !== "none"` payload filtering, function-component tooltip/legend contracts, and font-mono tooltip value styling.
- Validation: focused scans confirmed the Midday forwardRef/display-name contracts, typed tooltip/legend payload props, `../utils` import, reference CSS-variable classes, removed stale shadcn/chart tokens, and no active dashboard usage of the shared chart primitive.

## 2026-07-16 — Midday Combobox Primitive Contract Parity

- Continued the shared dashboard form/filter primitive audit by comparing PlotKeys `packages/ui/src/components/combobox.tsx` against Midday's UI combobox component.
- Replaced the old Base UI primitive suite with Midday's focused cmdk-backed `Combobox` component and `Option` type.
- Added Midday's controlled/uncontrolled open handling, selected/input state management, create-option support, remove support, loading spinner placement, optional search icon, custom option component rendering, and command-list popover behavior.
- Switched the shared utility import to the UI `../utils` path and composed the combobox from the shared `Command*` primitives and `Spinner`.
- Removed the old Base UI exports and helper surface, including value, trigger, clear, content, list, item, group, label, collection, empty, separator, chips/chip/chip-input, and `useComboboxAnchor`.
- Preserved PlotKeys' local `Icon` namespace through an `Icons` alias while matching Midday's search and close icon placement.
- Validation: focused scans confirmed the cmdk-backed Midday component markers, removed Base UI/data-slot/subcomponent tokens, and no active dashboard usage of the shared combobox primitive.

## 2026-07-16 — Midday Carousel Primitive Contract Parity

- Continued the shared dashboard media/navigation primitive audit by comparing PlotKeys `packages/ui/src/components/carousel.tsx` against Midday's UI carousel primitive.
- Reworked `Carousel`, content, item, previous, and next into Midday's `React.forwardRef` contracts with display names.
- Added Midday's `scrollTo(index)` context helper, exported `useCarousel`, and added carousel/slide ARIA roledescription metadata.
- Switched the shared utility import to the UI `../utils` path and aligned previous/next button sizing and positioning class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` output and local arrow-key capture handler from the primitive.
- Preserved PlotKeys' local `Icon` namespace for chevrons while matching Midday's chevron direction, sizing, and previous/next button shape.
- Validation: focused scans confirmed the Midday forwardRef/display-name contracts, `scrollTo`, `useCarousel` export, carousel/slide ARIA metadata, reference button classes, removed data-slot/key-handler/old-arrow tokens, and no active dashboard usage of the shared carousel primitive.

## 2026-07-16 — Midday InputOTP Primitive Contract Parity

- Continued the shared auth/input primitive audit by comparing PlotKeys `packages/ui/src/components/input-otp.tsx` against Midday's UI input-otp primitive.
- Reworked `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, and `InputOTPSeparator` into Midday's `React.forwardRef` contracts with display names.
- Replaced the old context/index-based slot implementation with Midday's `SlotProps` slot contract from `input-otp`.
- Swapped the local `Icon.Minus` separator for Midday's Radix `DashIcon`, backed by the existing UI package `@radix-ui/react-icons` dependency.
- Switched the shared utility import to the UI `../utils` path and aligned container, slot, active ring, separator, caret, size, and typography class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` / `data-active` output, `containerClassName` prop extension, disabled cursor/container opacity styling, context slot lookup, smaller slot sizing, shadow/ring-heavy active styling, and local icon abstraction from the primitive.
- Validation: focused scans confirmed the Midday forwardRef/display-name contracts, `SlotProps`, Radix `DashIcon`, `../utils` import, reference OTP slot classes, removed data/context/local-icon/old-style tokens, and no active dashboard usage of the shared input-otp primitive.

## 2026-07-16 — Midday CurrencyInput Primitive Contract Parity

- Continued the shared dashboard money-input audit by comparing PlotKeys `packages/ui/src/components/currency-input.tsx` against Midday's UI currency-input primitive.
- Reworked `CurrencyInput` to Midday's thin `NumericFormatProps` contract that only defaults `thousandSeparator` and passes through all other numeric-format behavior to callers.
- Removed the PlotKeys-only primitive defaults for `allowNegative = false`, `decimalScale = 0`, `prefix = "₦"`, the `Omit<NumericFormatProps, "customInput">` helper type, and the separate named export block.
- Moved PlotKeys' naira/no-decimal/non-negative behavior into the three active dashboard money input callers: quick fill base amount, property price, and property pricing plan amount.
- Validation: focused scans confirmed the Midday thin primitive contract, removed implicit primitive defaults, exactly three active dashboard `CurrencyInput` callers, and explicit `prefix="₦"`, `decimalScale={0}`, and `allowNegative={false}` at each caller.

## 2026-07-16 — Midday Calendar Primitive Contract Parity

- Continued the shared dashboard date/filter audit by comparing PlotKeys `packages/ui/src/components/calendar.tsx` against Midday's UI calendar primitive.
- Switched calendar chevron rendering from local `Icon.*` indicators to Midday's lucide `ChevronLeftIcon`, `ChevronRightIcon`, and `ChevronDownIcon` imports.
- Switched the shared utility import to the exact UI `../utils/cn` path and aligned calendar root, nav buttons, captions, dropdowns, weekdays, week numbers, range states, today state, and day-button class surfaces to the Midday reference.
- Replaced PlotKeys' `--spacing(8)` / `size-(--cell-size)` token usage with Midday's `2rem` and bracketed `--cell-size` class tokens.
- Removed the old focused ring-heavy day button styling, square/rounded-md selected range classes, popover dropdown background, local icon abstraction, and selected-day rounding rules from the primitive.
- Validation: focused scans confirmed lucide chevrons, `../utils/cn`, `2rem` cell sizing, rounded-full range/day states, bracketed cell-size tokens, removed local-icon/old-token styling, and no active dashboard usage of the shared calendar primitive.

## 2026-07-16 — Midday Drawer Primitive Contract Parity

- Continued the shared dashboard drawer/mobile-sheet audit by comparing PlotKeys `packages/ui/src/components/drawer.tsx` against Midday's UI drawer primitive.
- Reworked `Drawer` to Midday's `shouldScaleBackground = true` root contract and reworked trigger, portal, and close exports to direct Vaul primitive aliases.
- Reworked overlay, content, title, and description into Midday's `React.forwardRef` contracts with display names, and added display names for drawer header/footer helpers.
- Switched the shared utility import to the UI `../utils` path and aligned overlay, bottom content, drag handle, header, footer, title, and description class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` output, local trigger/portal/close wrapper functions, state animation overlay classes, multi-direction drawer class branches, group-data header/handle styling, muted drag handle surface, and old title typography from the primitive.
- Validation: focused scans confirmed the Midday `shouldScaleBackground` root contract, direct primitive aliases, forwardRef/display-name contracts, `../utils` import, `bg-black/80`, `rounded-t-[10px]`, and `bg-accent` reference classes, removed data-slot/direction/old-style tokens, and no active dashboard usage of the shared drawer primitive.

## 2026-07-16 — Midday Alert Primitive Contract Parity

- Continued the shared dashboard notice/error audit by comparing PlotKeys `packages/ui/src/components/alert.tsx` against Midday's UI alert primitive.
- Reworked `Alert`, `AlertTitle`, and `AlertDescription` into Midday's `React.forwardRef` contracts with display names.
- Switched the shared utility import to the UI `../utils` path and aligned alert root, destructive, warning, title, and description class surfaces to the Midday reference.
- Added Midday's `warning` variant while retaining existing `default` and `destructive` usage across auth, forms, onboarding, join, and builder notices.
- Removed the old shadcn `data-slot` output, local wrapper functions, grid/column alert layout, card background surface, data-slot-dependent destructive description selector, and muted description styling from the primitive.
- Validation: focused scans confirmed the Midday forwardRef/display-name contracts, `warning` variant, `../utils` import, reference alert classes, removed data-slot/old-wrapper/old-style tokens, and current dashboard alert callers use retained default/className or destructive variants.

## 2026-07-16 — Midday Form Primitive Contract Parity

- Continued the shared dashboard form/sheet audit by comparing PlotKeys `packages/ui/src/components/form.tsx` against Midday's UI form primitive.
- Reworked `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, and `FormMessage` into Midday's `React.forwardRef` contracts with display names.
- Switched `useFormField` to read `formState` from `useFormContext()` like the reference instead of subscribing through `useFormState`.
- Switched the shared utility import to the UI `../utils` path and aligned form item spacing, label error styling, description text sizing, and message font/size classes to the Midday reference.
- Removed the old shadcn `data-slot` / `data-error` output, local wrapper functions, `grid gap-2` item surface, data-attribute label error styling, and larger form description/message text classes from the primitive.
- Validation: focused scans confirmed the Midday forwardRef/display-name contracts, `formState` use through `useFormContext`, `../utils` import, reference form classes, removed data-slot/useFormState/old-style tokens, and current dashboard form callers only rely on retained standard form exports.

## 2026-07-16 — Midday Command Primitive Contract Parity

- Continued the shared dashboard command/search audit by comparing PlotKeys `packages/ui/src/components/command.tsx` against Midday's UI command primitive.
- Reworked `Command`, input, list, empty, group, separator, and item into Midday's `React.forwardRef` contracts with display names sourced from cmdk primitives.
- Reworked `CommandDialog` to Midday's compact hidden-close dialog content shape with `max-w-[740px]`, `h-[480px]`, and the reference command palette class surface, while keeping the local `Dialog` prop type to avoid adding an undeclared Radix dialog package edge for a type-only import.
- Switched the shared utility import to the UI `../utils` path, removed the local search icon wrapper, and aligned list, group heading, item, input, and shortcut class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` output, local wrapper functions, default command dialog title/description/header metadata, local `Icon.Search` usage, rounded/bg-popover command root styling, `scroll-py-1` list styling, and `data-[selected=true]` item styling from the primitive.
- Validation: focused scans confirmed the Midday forwardRef/display-name contracts, cmdk input wrapper, `h-[480px]`/`max-w-[740px]` dialog classes, `font-mono` group headings, `aria-selected` item styling, removed data-slot/search-icon/dialog-header/old-style tokens, and current dashboard sign-in usage only relies on retained standard command pieces.

## 2026-07-16 — Midday NavigationMenu Primitive Contract Parity

- Continued the shared dashboard navigation/header audit by comparing PlotKeys `packages/ui/src/components/navigation-menu.tsx` against Midday's UI navigation-menu primitive.
- Reworked root, list, trigger, content, viewport, and indicator into Midday's `React.forwardRef` contracts with display names sourced from Radix primitives.
- Reworked item and link exports to Midday's direct Radix primitive aliases, removed the PlotKeys-only `viewport` root option, and made viewport rendering unconditional like the reference.
- Swapped the local `Icon.ChevronDown` trigger indicator for Midday's Radix `ChevronDownIcon`, backed by the existing UI package `@radix-ui/react-icons` dependency.
- Switched the shared utility import to the UI `../utils` path and aligned trigger, list, content, viewport, and indicator class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` / `data-viewport` output, local wrapper functions, group-data viewport styling, local navigation link wrapper styling, rounded trigger/background styling, and local icon indicator from the primitive.
- Validation: focused scans confirmed the Midday forwardRef/display-name contracts, Radix item/link aliases, Radix icon indicator, `../utils` import, `space-x-1`/`shadow-none` reference classes, removed data/viewport/local-icon/old-style tokens, and no active dashboard usage of the shared navigation-menu primitive.

## 2026-07-16 — Midday ContextMenu Primitive Contract Parity

- Continued the shared dashboard menu/action audit by comparing PlotKeys `packages/ui/src/components/context-menu.tsx` against Midday's UI context-menu primitive.
- Reworked root, trigger, group, portal, sub, and radio-group exports to Midday's direct Radix primitive aliases instead of local wrappers that injected shadcn data attributes.
- Reworked sub-trigger, sub-content, content, item, checkbox item, radio item, label, and separator into Midday's `React.forwardRef` contracts with display names.
- Swapped local `Icon.Check`, `Icon.Circle`, and `Icon.ChevronRight` indicators for Midday's lucide `Check`, `Circle`, and `ChevronRight` imports, backed by the existing UI package `lucide-react` dependency.
- Switched the shared utility import to the UI `../utils` path and aligned content, item, label, indicator, and separator class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` / `data-inset` / `data-variant` output, PlotKeys-only `variant="destructive"` item API, local wrapper functions, bg-popover/origin/rounded styling, and local icon indicators from the primitive.
- Validation: focused scans confirmed the Midday direct alias/forwardRef/display-name contracts, lucide indicators, `../utils` import, `bg-background`/`fade-in-80` content classes, removed data/variant/local-icon/old-style tokens, and no active dashboard usage of the shared context-menu primitive.

## 2026-07-16 — Midday ScrollArea Primitive Contract Parity

- Continued the shared dashboard scroll/container audit by comparing PlotKeys `packages/ui/src/components/scroll-area.tsx` against Midday's UI scroll-area primitive.
- Reworked `ScrollArea` and `ScrollBar` into Midday's `React.forwardRef` contracts with display names sourced from the Radix primitives.
- Added Midday's `hideScrollbar` option and switched the shared utility import to the UI `../utils` path.
- Aligned root, viewport, scrollbar, and thumb class surfaces to the Midday reference, including `relative overflow-hidden`, viewport `h-full w-full`, scrollbar `p-[1px]`, and vertical-only thumb flex behavior.
- Removed the old shadcn `data-slot` output, local wrapper functions, viewport focus-ring styling, `size-full` viewport token, scrollbar `p-px`, and always-rounded thumb styling from the primitive.
- Validation: focused scans confirmed the Midday forwardRef/display-name contract, `hideScrollbar` support, `../utils` import, reference scroll-area classes, removed data-slot/old-wrapper/old-style tokens, and no active dashboard usage of the shared scroll-area primitive.

## 2026-07-16 — Midday Slider Primitive Contract Parity

- Continued the shared dashboard control audit by comparing PlotKeys `packages/ui/src/components/slider.tsx` against Midday's UI slider primitive.
- Reworked `Slider` into Midday's `React.forwardRef` contract with `Slider.displayName` sourced from the Radix root primitive.
- Switched the shared utility import to the UI `../utils` path and aligned root, track, range, and thumb class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` output, value/defaultValue-derived dynamic thumb generation, vertical-orientation styling branch, muted track surface, and heavier hover/focus thumb styling from the primitive.
- Validation: focused scans confirmed the Midday forwardRef/display-name contract, `../utils` import, reference slider classes, removed data-slot/value-memo/old-style tokens, and no active dashboard usage of the shared slider primitive.

## 2026-07-16 — Midday HoverCard Primitive Contract Parity

- Continued the shared dashboard overlay/control audit by comparing PlotKeys `packages/ui/src/components/hover-card.tsx` against Midday's UI hover-card primitive.
- Reworked `HoverCard` and `HoverCardTrigger` to Midday's direct Radix primitive aliases instead of local wrappers that injected shadcn data attributes.
- Reworked `HoverCardContent` into Midday's `React.forwardRef` contract with display name, matching default `align` / `sideOffset`, portal ownership, and reference content classes.
- Switched the shared utility import to the UI `../utils` path and aligned the content surface to Midday's `bg-background`, border, shadow, animation, and `outline-none` styling.
- Removed the old shadcn `data-slot` output, local wrapper functions, transform-origin class, rounded popover background styling, and `outline-hidden` token from the primitive.
- Validation: focused scans confirmed the Midday direct alias/forwardRef/display-name contract, `../utils` import, reference content classes, removed data-slot/old-wrapper/old-style tokens, and no active dashboard usage of the hover-card primitive beyond the shared component itself.

## 2026-07-16 — Midday Accordion Primitive Contract Parity

- Continued the shared dashboard disclosure/control audit by comparing PlotKeys `packages/ui/src/components/accordion.tsx` against Midday's UI accordion primitive.
- Reworked `Accordion` to Midday's direct Radix primitive root alias and reworked item, trigger, and content into Midday's `React.forwardRef` contracts with display names.
- Switched the shared utility import to the UI `../utils` path, added Midday's `chevronBefore` trigger option, and aligned item, trigger, icon, and content class surfaces to the reference.
- Added `lucide-react` to the UI package manifest so the accordion can use Midday's `ChevronDown` import instead of the old local icon abstraction.
- Removed the old shadcn `data-slot` output, local wrapper functions, local `Icon.ChevronDown` usage, and heavier PlotKeys-specific trigger focus/underline/text styling from the primitive.
- Validation: focused scans confirmed the Midday direct root/forwardRef/display-name contract, `chevronBefore` support, `../utils` import, `lucide-react` dependency alignment, removed data-slot/local-icon/old-wrapper tokens, and no active dashboard usage of the accordion primitive beyond the shared component itself.

## 2026-07-16 — Midday Collapsible Primitive Contract Parity

- Continued the shared dashboard disclosure/control audit by comparing PlotKeys `packages/ui/src/components/collapsible.tsx` against Midday's UI collapsible primitive.
- Reworked `Collapsible`, `CollapsibleTrigger`, and `CollapsibleContent` to Midday's direct Radix primitive aliases instead of local wrappers that injected shadcn data attributes.
- Added the Midday client boundary and removed the old wrapper functions, `React.ComponentProps` signatures, and shadcn `data-slot` output from the primitive.
- Validation: focused scans confirmed the direct alias contract and no remaining collapsible data-slot or local wrapper tokens in the primitive.

## 2026-07-16 — Midday Select Primitive Contract Parity

- Continued the shared dashboard form/control audit by comparing PlotKeys `packages/ui/src/components/select.tsx` against Midday's UI select primitive.
- Reworked `Select`, `SelectGroup`, and `SelectValue` to Midday's direct Radix primitive aliases instead of local wrappers that injected shadcn data attributes.
- Reworked trigger, content, item, label, separator, and scroll buttons into Midday's `React.forwardRef` contracts with display names.
- Added Midday's `hideIcon` trigger option and aligned trigger/content/viewport/item/label/separator classes to the reference.
- Swapped local `Icon.Check`, `Icon.ChevronDown`, and `Icon.ChevronUp` indicators for Radix `CheckIcon`, `ChevronDownIcon`, and `ChevronUpIcon`.
- Removed the old shadcn `data-slot` / `data-size` output, PlotKeys-only trigger `size` API, bg-popover origin/rounded styling, select item indicator slot, and scroll-my viewport styling from the primitive.
- Validation: focused scans confirmed the Midday direct alias/forwardRef/display-name contracts, `hideIcon` support, Radix icon indicators, `../utils` import, removed data/size/local-icon tokens, and no active dashboard `SelectTrigger size=...` or `SelectContent align/sideOffset=...` usage.

## 2026-07-16 — Midday Tooltip Primitive Contract Parity

- Continued the shared dashboard overlay/control audit by comparing PlotKeys `packages/ui/src/components/tooltip.tsx` against Midday's UI tooltip primitive.
- Reworked `TooltipProvider`, `Tooltip`, and `TooltipTrigger` to Midday's direct Radix primitive aliases instead of local wrappers that injected shadcn data attributes and a default provider delay.
- Reworked `TooltipContent` into Midday's `React.forwardRef` contract with `TooltipContent.displayName` and the reference `sideOffset = 4` default.
- Switched the shared utility import to the UI `../utils` path and aligned the tooltip content class surface to Midday's bordered, blurred background reference.
- Removed the old shadcn `data-slot` output, foreground bubble styling, transform-origin styling, `text-balance`, and embedded tooltip arrow from the primitive.
- Validation: focused scans confirmed the Midday direct alias/forwardRef/display-name contract, `../utils` import, reference tooltip classes, removed arrow/data-slot/old foreground tokens, and current dashboard/provider callers either rely on the content default or pass explicit provider delays.

## 2026-07-16 — Midday Dropdown Menu Primitive Contract Parity

- Continued the shared dashboard action-menu/filter audit by comparing PlotKeys `packages/ui/src/components/dropdown-menu.tsx` against Midday's UI dropdown-menu primitive.
- Reworked root, trigger, group, portal, sub, and radio-group exports to Midday's direct Radix primitive aliases instead of local wrappers that injected shadcn data attributes.
- Reworked dropdown content, sub-content, item, checkbox item, radio item, label, separator, and sub-trigger into Midday's `React.forwardRef` contracts with display names.
- Added Midday's content `portal` / `container` support and item `asDialogTrigger` support while preserving current dashboard call sites.
- Swapped local `Icon.Check`, `Icon.Circle`, and `Icon.ChevronRight` indicators for Radix `CheckIcon` / `ChevronRightIcon` and aligned content/item/indicator classes to the Midday reference.
- Removed the old shadcn `data-slot` / `data-inset` / `data-variant` output, PlotKeys-only `variant="destructive"` API surface, bg-popover/origin/rounded styling, and left-side local icon indicators from the primitive.
- Validation: focused scans confirmed the Midday direct alias/forwardRef/display-name contracts, portal/container/asDialogTrigger support, Radix icon indicators, `../utils` import, removed data/variant/local-icon tokens, and no active dashboard `DropdownMenuItem variant=...` usage.

## 2026-07-16 — Midday Popover Primitive Contract Parity

- Continued the shared dashboard overlay/control audit by comparing PlotKeys `packages/ui/src/components/popover.tsx` against Midday's UI popover primitive.
- Reworked `Popover` and `PopoverTrigger` to Midday's direct Radix primitive aliases instead of local wrappers that injected shadcn data attributes.
- Reworked `PopoverContent` into Midday's `React.forwardRef` contract with `PopoverContent.displayName`, the `portal` option, and the same default `align` / `sideOffset` behavior.
- Switched the shared utility import to the UI `../utils` path and aligned the content class surface to Midday's border/background/animation reference.
- Removed the old `PopoverAnchor`, `PopoverHeader`, `PopoverTitle`, and `PopoverDescription` helper exports plus shadcn data attributes and old bg-popover/rounded/origin styling from the primitive.
- Validation: focused scans confirmed the Midday direct alias/forwardRef/display-name contract, `portal` option, `../utils` import, reference popover classes, removed helper/data-slot tokens, and no active dashboard usage of the removed popover helper exports.

## 2026-07-16 — Midday Card Primitive Contract Parity

- Continued the shared dashboard panel/settings audit by comparing PlotKeys `packages/ui/src/components/card.tsx` against Midday's UI card primitive.
- Reworked `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` into Midday's `React.forwardRef` contracts with explicit display names.
- Switched the shared utility import to the UI `../utils` path and aligned card root, header, title, description, content, and footer class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` output, PlotKeys-only rounded/shadow/gap card shell classes, and the unused `CardAction` export/API from the primitive.
- Validation: focused scans confirmed the Midday forwardRef/display-name contract, `../utils` import, reference card classes, removed card data-slot/action tokens, and no active dashboard usage of `CardAction`.

## 2026-07-16 — Midday Table Primitive Contract Parity

- Continued the shared dashboard table/page audit by comparing PlotKeys `packages/ui/src/components/table.tsx` against Midday's UI table primitive.
- Reworked `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption` into Midday's `React.forwardRef` contracts with explicit display names.
- Switched the shared utility import to the UI `../utils` path and aligned the table header/body/footer/row/head/cell/caption class surfaces to the Midday reference.
- Removed the old shadcn `data-slot` output and the PlotKeys-owned wrapper div/overflow container from the primitive so scroll-container ownership stays with feature/table shells like Midday.
- Validation: focused scans confirmed the Midday forwardRef/display-name contract, `../utils` import, reference table classes, removed wrapper/data-slot tokens, and no active dashboard code styling against removed table data-slot attributes.

## 2026-07-16 — Midday Avatar Primitive Contract Parity

- Continued the shared dashboard identity/avatar audit by comparing PlotKeys `packages/ui/src/components/avatar.tsx` against Midday's UI avatar primitive.
- Added the Midday client boundary and reworked `Avatar`, `AvatarImage`, and `AvatarFallback` into `React.forwardRef` contracts with display names sourced from the Radix primitives.
- Added Midday's `AvatarImageNext` helper with local image-error state and `next/image` rendering parity.
- Switched the shared utility import to the UI `../utils` path and aligned root, image, and fallback class surfaces to the Midday reference.
- Removed the old PlotKeys-only `size` API, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`, shadcn data attributes, and group-data size styling from the primitive.
- Migrated the only active dashboard `size="sm"` avatar call site to explicit `size-6` className sizing in the builder template picker.
- Validation: focused scans confirmed the Midday client/forwardRef/display-name contract, `AvatarImageNext`, `../utils` import, reference classes, removed avatar data/size tokens, no active usage of removed avatar exports, and no remaining `<Avatar size=...>` call sites.

## 2026-07-16 — Midday Tabs Primitive Contract Parity

- Continued the shared dashboard navigation/control audit by comparing PlotKeys `packages/ui/src/components/tabs.tsx` against Midday's UI tabs primitive.
- Reworked the shared `Tabs` export to Midday's direct Radix root alias instead of a local wrapper that injected orientation and group classes.
- Reworked `TabsList`, `TabsTrigger`, and `TabsContent` into Midday's `React.forwardRef` contracts with display names sourced from the Radix primitives.
- Switched the shared utility import to the UI `../utils` path and aligned list, trigger, and content class surfaces to the Midday reference.
- Removed the local `tabsListVariants` / `variant="line"` API, shadcn `data-slot` / data-variant output, and PlotKeys-only orientation/group-data styling from the primitive; active dashboard tab call sites use only the standard root/list/trigger/content API.
- Validation: focused scans confirmed the Midday direct root, forwardRef contracts, display names, `../utils` import, reference tab classes, removed variant/data-slot/orientation tokens, and no active call sites rely on the removed tab variant API.

## 2026-07-16 — Midday Progress Primitive Contract Parity

- Continued the shared dashboard status/loading audit by comparing PlotKeys `packages/ui/src/components/progress.tsx` against Midday's UI progress primitive.
- Reworked the shared `Progress` into Midday's `React.forwardRef` component contract with `Progress.displayName` sourced from the Radix primitive.
- Switched the shared utility import to the UI `../utils` path and aligned the track class surface to Midday's `relative h-4 w-full overflow-hidden bg-secondary` shape.
- Removed the shadcn-specific `data-slot` / `data-slot="progress-indicator"` output and PlotKeys-only `h-2`, `rounded-full`, and `bg-primary/20` track styling from the primitive.
- Validation: focused scans confirmed the Midday `forwardRef` contract, display name, `../utils` import, reference progress classes, removed `data-slot` / old track tokens, and no active dashboard `Progress` call sites needed migration; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Submit Button Primitive Contract Parity

- Continued the shared dashboard loading/form audit by comparing PlotKeys `packages/ui/src/components/submit-button.tsx` against Midday's UI submit-button primitive.
- Reworked the shared `SubmitButton` from a `useFormStatus` server-action helper into Midday's explicit `isSubmitting` button contract.
- Aligned the loading presentation with Midday's overlay pattern: the child label becomes invisible while an absolutely centered `Spinner` renders over the button.
- Switched the primitive to `ButtonProps` from the shared button package and the UI `../utils` `cn` import.
- Removed the old `loadingLabel`, implicit submit `type`, `useFormStatus`, exported `SubmitButtonProps` alias, and inline left-spinner layout from the primitive.
- Validation: focused scans confirmed the Midday `isSubmitting` / `ButtonProps` contract, invisible-label overlay, centered `Spinner`, removed `useFormStatus` / `loadingLabel` / old exported prop alias, and no external active `SubmitButton` call sites needed migration; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Spinner Primitive Contract Parity

- Continued the shared dashboard loading-state audit by comparing PlotKeys `packages/ui/src/components/spinner.tsx` against Midday's UI spinner primitive.
- Reworked the shared `Spinner` from a local `Icon.Loader` wrapper into Midday's inline SVG spinner contract.
- Added Midday's `SpinnerProps` interface with numeric `size` support, default `size = 20`, and style-based width/height merging.
- Aligned the spinner stroke and animation class surface with Midday's `animate-spin stroke-[#878787]` default while preserving caller-provided `className` and SVG props.
- Removed the local icon dependency, fixed `size-4` default, and built-in `role="status"` / `aria-label="Loading"` attributes from the primitive.
- Validation: focused scans confirmed the Midday inline SVG path, `SpinnerProps`, numeric size/style contract, removed `Icon.Loader` / old fixed-size tokens, and existing call sites remain className-compatible; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Skeleton Primitive And Shimmer Parity

- Continued the shared dashboard loading-state audit by comparing PlotKeys `packages/ui/src/components/skeleton.tsx` against Midday's UI skeleton primitive.
- Reworked the shared `Skeleton` to Midday's shimmer-gradient contract with an `animate` toggle, `React.HTMLAttributes<HTMLDivElement>` props, `rounded-none`, `bg-[length:200%_100%]`, and the primary/transparent gradient surface.
- Removed the shadcn-specific `data-slot="skeleton"` output and old `animate-pulse rounded-md bg-accent` surface from the primitive.
- Added the missing `shimmer` keyframes and `.animate-shimmer` utility to `packages/ui/src/globals.css`, matching Midday's `backgroundPosition: 200% 0` to `-200% 0` animation at `2.5s linear infinite`.
- Validation: focused scans confirmed the Midday skeleton class contract, `animate` toggle, shimmer keyframes/class, removed `data-slot` / old pulse tokens, no active `Skeleton animate=` call sites needed migration; trailing-whitespace scans passed, Prettier accepted the touched primitive/CSS, one-file Bun builds succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Separator Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/separator.tsx` against Midday's UI separator primitive.
- Reworked the shared `Separator` into Midday's `React.forwardRef` component contract with `Separator.displayName` sourced from the Radix primitive.
- Added the Midday `"use client"` boundary and switched the shared utility import to the UI `../utils` path.
- Aligned the class contract with Midday's explicit orientation branch: base `shrink-0 bg-border`, horizontal `h-[1px] w-full`, and vertical `h-full w-[1px]`.
- Removed the shadcn-specific `data-slot="separator"` output and Tailwind data-orientation sizing classes from the primitive.
- Validation: focused scans confirmed the Midday `forwardRef` contract, display name, client boundary, orientation branch classes, `../utils` import, and removed `data-slot` / data-orientation class tokens; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Radio Group Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/radio-group.tsx` against Midday's UI radio-group primitive.
- Reworked `RadioGroup` and `RadioGroupItem` into Midday's `React.forwardRef` component contracts with display names sourced from the Radix primitives.
- Added the Midday `"use client"` boundary and switched the shared utility import to the UI `../utils` path.
- Aligned the root gap, item class contract, indicator wrapper, and selected dot markup with Midday's reference shape.
- Removed the local `Icon.Circle` indicator, shadcn `data-slot` output, and PlotKeys-only shadow, invalid-state, border-input, dark-background, and `focus-visible:ring-[3px]` styling from the primitive.
- Validation: focused scans confirmed the Midday `forwardRef` contracts, display names, client boundary, reference root/item/indicator classes, removed `Icon.Circle` / `data-slot` / old class tokens; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Switch Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/switch.tsx` against Midday's UI switch primitive.
- Reworked the shared `Switch` into Midday's `React.forwardRef` component contract with `Switch.displayName` sourced from the Radix primitive.
- Aligned the switch root and thumb class contracts with Midday's reference shape, including the fixed `h-6 w-11` root, `h-5 w-5` thumb, `translate-x-5`, and light/dark unchecked background tokens.
- Added the Midday `"use client"` boundary and switched the shared utility import to the UI `../utils` path.
- Removed the PlotKeys-only `size` API, shadcn `data-slot` / `data-size` / `data-slot="switch-thumb"` output, and custom group-data thumb sizing from the primitive.
- Validation: focused scans confirmed the Midday `forwardRef` contract, reference switch/thumb classes, client boundary, `../utils` import, removed `data-slot` / `data-size` / old size tokens; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Checkbox Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/checkbox.tsx` against Midday's UI checkbox primitive.
- Reworked the shared `Checkbox` into Midday's `React.forwardRef` component contract with `Checkbox.displayName` sourced from the Radix primitive.
- Aligned the checkbox root and indicator class contracts with Midday's reference shape, including the light/dark checked background tokens and `focus-visible:ring-1`.
- Swapped the local `Icon.Check` usage for Midday's Radix `CheckIcon` indicator and declared `@radix-ui/react-icons` in `@plotkeys/ui`.
- Removed the shadcn-specific `data-slot` / `data-slot="checkbox-indicator"` output and PlotKeys-only rounded, shadow, invalid-state, border-input, primary checked, and dark input styling from the primitive.
- Validation: focused scans confirmed the Midday `forwardRef` contract, Radix `CheckIcon`, reference checkbox classes, and removed `data-slot` / old class tokens; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Label Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/label.tsx` against Midday's UI label primitive.
- Reworked the shared `Label` into Midday's `React.forwardRef` component contract with `Label.displayName` sourced from the Radix primitive.
- Added Midday's `labelVariants` cva boundary and aligned the default label class contract to the reference `text-sm font-medium leading-none peer-disabled:...` surface.
- Added the Midday `"use client"` boundary and switched the shared utility import to the UI `../utils` path.
- Removed the shadcn-specific `data-slot="label"` output and PlotKeys-only flex/gap/select-none/group-disabled class surface from the primitive.
- Validation: focused scans confirmed the Midday `labelVariants` / `forwardRef` contract, client boundary, `../utils` import, removed `data-slot` / old class tokens; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Textarea Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/textarea.tsx` against Midday's UI textarea primitive.
- Reworked the shared `Textarea` into Midday's `React.forwardRef` component contract with an exported `TextareaProps` interface and `Textarea.displayName`.
- Aligned the textarea base class contract with Midday's lean `flex min-h-[60px] w-full border bg-transparent ...` field surface.
- Removed the shadcn-specific `data-slot="textarea"` output and PlotKeys-only field-sizing, rounded, focus-ring, invalid-state, shadow, dark-background, and responsive text styling from the primitive.
- Validation: focused scans confirmed the Midday `TextareaProps` / `forwardRef` contract, reference textarea classes, and removed `data-slot` / old class tokens; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Input Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/input.tsx` against Midday's UI input primitive.
- Reworked the shared `Input` into Midday's `React.forwardRef` component contract with an exported `InputProps` interface and `Input.displayName`.
- Aligned the input base class contract with Midday's lean `flex h-9 w-full border bg-transparent ...` field surface, including the reference autofill reset selectors.
- Removed the shadcn-specific `data-slot="input"` output and PlotKeys-only focus ring, invalid-state, shadow, rounded, file-height, dark-background, and selection styling from the primitive.
- Validation: focused scans confirmed the Midday `InputProps` / `forwardRef` contract, reference input/autofill classes, and removed `data-slot` / old class tokens; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Badge Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/badge.tsx` against Midday's UI badge primitive.
- Reworked the shared `Badge` into Midday's simple `BadgeProps` / `HTMLDivElement` component contract instead of the previous shadcn-style `span` + `asChild` surface.
- Aligned the badge base classes, `default`, `secondary`, `destructive`, and `outline` variants with Midday's primitive defaults.
- Added Midday's `tag`, `tag-rounded`, and `tag-outline` variants so dashboard/table/settings status chips can use the same badge variant vocabulary as the reference.
- Removed the badge `data-slot` / `data-variant` output and the Radix `Slot` dependency from the primitive.
- Validation: focused scans confirmed the Midday `BadgeProps` contract, tag variants, removed `asChild`/data attributes, and no active dashboard `Badge asChild` usage; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Button Primitive Contract Parity

- Continued the shared dashboard primitive audit by comparing PlotKeys `packages/ui/src/components/button.tsx` against Midday's UI button primitive.
- Reworked the shared `Button` into Midday's `React.forwardRef` component contract with an exported `ButtonProps` interface and `Button.displayName`.
- Aligned the default `buttonVariants` base class, `outline` variant, `sm` size, and `icon` size with Midday's primitive defaults.
- Removed shadcn-specific `data-slot`, `data-variant`, and `data-size` output from the button primitive so dashboard headers, filters, tables, sheets, modals, and settings actions inherit the cleaner Midday button surface.
- Kept PlotKeys-only size variants (`xs`, `icon-xs`, `icon-sm`, `icon-lg`) as temporary compatibility entries because active dashboard/UI call sites still use them during the broader migration.
- Validation: focused scans confirmed the forwardRef/displayName contract, exported `ButtonProps`, removed data attributes, and Midday default variant tokens; trailing-whitespace scans passed, Prettier accepted the touched primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday UI `cn` Utility Path Parity

- Continued the dashboard primitive audit by comparing PlotKeys UI utility exports against Midday's UI package utility layout.
- Confirmed `joinClasses` is not a Midday or PlotKeys helper; the Midday source-of-truth helper is `cn` under the UI package's `src/utils/cn.ts`.
- Added the Midday-shaped `packages/ui/src/utils/cn.ts` and `packages/ui/src/utils/index.ts` utility path, and moved the public `@plotkeys/ui/cn` package export to that source path.
- Kept existing `packages/ui/src/cn.ts` and `packages/ui/src/lib/utils.ts` as compatibility shims pointing at the new UI-owned utility path so the ongoing migration does not break existing dashboard/UI imports mid-stream.
- Validation: focused scans confirmed the new `./cn` export target, compatibility shims, and absence of any `joinClasses` helper; trailing-whitespace scans passed, Prettier accepted the touched utility/package files, one-file Bun builds succeeded for the new utility entry points, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Alert Dialog Primitive Implementation Parity

- Continued the shared destructive-modal audit by comparing PlotKeys `packages/ui/src/components/alert-dialog.tsx` and active dashboard delete confirmations against Midday's alert-dialog primitive.
- Reworked the shared alert-dialog primitive toward Midday's shape: root/trigger/portal aliases, `AlertDialogOverlay` / `AlertDialogContent` / title / description / action / cancel as `forwardRef`, soft overlay tokens, Midday content animation classes, and `buttonVariants`-based action/cancel styling.
- Removed the PlotKeys-only `size` / `AlertDialogMedia` API from the primitive after scans found no active dashboard usage.
- Updated the three active dashboard delete confirmations to stop passing the old `variant="destructive"` prop to `AlertDialogAction`, matching Midday's default action contract.
- Validation: focused scans confirmed the Midday alert-dialog primitive markers, no stale `AlertDialogMedia`, `data-size`, or `variant="destructive"` alert-dialog usages remain, trailing-whitespace scans passed, Prettier accepted the edited files, one-file Bun builds succeeded, and scoped tracked `git diff --check` passed for tracked touched files.

## 2026-07-16 — Midday Dialog Primitive Implementation Parity

- Continued the shared modals audit by comparing PlotKeys `packages/ui/src/components/dialog.tsx` and `CommandDialog` against Midday's UI dialog and command primitives.
- Reworked the shared dialog primitive toward Midday's shape: root/trigger/portal aliases, `DialogOverlay` / `DialogContent` / `DialogContentFrameless` as `forwardRef`, soft overlay tokens, Midday content animation classes, `hideClose`, and Midday header/footer/title/description defaults.
- Updated `CommandDialog` to use the Midday `hideClose` content API instead of the old `showCloseButton` dialog prop.
- Migrated the two dashboard modal action footers off the transitional `DialogClose` export; cancel actions now close through their modal owners' controlled `setOpen(false)` callbacks.
- Removed `DialogClose` from the shared dialog primitive export surface to match Midday's dialog package.
- Validation: focused scans confirmed the Midday dialog primitive markers, no old `showCloseButton` dialog API or `DialogClose` usage remains, `CommandDialog` uses `hideClose`, trailing-whitespace scans passed, Prettier accepted the edited files, one-file Bun builds succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Property Details Sheet Width Parity

- Continued the details-sheet audit by comparing PlotKeys `PropertyDetailsContent` against the migrated `CustomerDetailsSheet` and Midday's customer details sheet reference.
- Removed the extra `w-full sm:max-w-[620px]` responsive width classes from the Property Details sheet content.
- Aligned Property Details with Midday's details sheet shape: `SheetContent style={{ maxWidth: 620 }} className="pb-4"`.
- Validation: focused scans confirmed both Customer and Property details sheets now use the Midday `maxWidth: 620` plus `pb-4` shape, no stale Property Details `sm:max-w-[620px]` class remains, trailing-whitespace scans passed, and Prettier accepted the edited Property Details file.

## 2026-07-16 — Midday Sheet Primitive Implementation Parity

- Continued the shared sheets/modals audit by comparing PlotKeys `packages/ui/src/components/sheet.tsx` against Midday's UI sheet primitive.
- Aligned shared `SheetHeader`, `SheetFooter`, and `SheetTitle` default class contracts with Midday's primitive defaults while preserving explicit PlotKeys sheet header overrides.
- Reworked the shared sheet implementation toward Midday's primitive shape: root/trigger/close/portal aliases, `SheetOverlay` / `SheetContent` as `forwardRef`, `sheetVariants` for side placement and animation duration, and the bordered inner content panel as the default content shell.
- Removed the unused non-Midday `showCloseButton` escape hatch and icon import from the shared sheet primitive after confirming no dashboard sheet caller uses it.
- Kept `stack` accepted as a compatibility prop for existing migrated sheet call sites but no longer lets it fork the shared primitive away from Midday's default content architecture.
- Validation: focused scans confirmed the Midday `forwardRef`, `sheetVariants`, header/footer/title classes, exported primitive names, no dashboard caller uses `showCloseButton` or relies on implicit sheet header spacing, trailing-whitespace scans passed, Prettier accepted the edited primitive, a one-file Bun build succeeded, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Sheet Overlay Chrome Parity

- Continued the sheet/modals audit by comparing PlotKeys shared `SheetOverlay` / `SheetContent` and customer create/edit/detail sheet wrappers against Midday UI sheet and customer sheet references.
- Confirmed stacked `SheetContent title` usage is accessibility metadata matching Midday's package behavior, so the customer create/edit sheet titles did not need a composition rewrite.
- Aligned shared sheet overlay chrome with Midday's soft `#f6f6f3]/60` light overlay, `dark:bg-black/60`, and `desktop:rounded-[10px]` treatment instead of the previous plain black overlay.
- Validation: focused scans confirmed the Midday overlay tokens, customer stacked sheet title usage, no stale shared `bg-black/50` overlay token, trailing-whitespace scans passed, and scoped tracked `git diff --check` passed.

## 2026-07-16 — Midday Global Sheets Provider And Details Width Parity

- Continued the sheet/modals audit by comparing PlotKeys `GlobalSheetsProvider`, `GlobalSheets`, and `CustomerDetailsSheet` against Midday's global sheets provider and customer sheet references.
- Confirmed PlotKeys already uses Midday's dynamic `GlobalSheetsProvider` pattern and mounts it from the dashboard app layout after the dashboard chrome.
- Aligned `CustomerDetailsSheet` content sizing with Midday by removing the extra responsive width classes and keeping `SheetContent style={{ maxWidth: 620 }} className="pb-4"`.
- Validation: focused scans confirmed the dynamic provider mount, exact customer details `SheetContent` shape, no stale `sm:max-w-[620px]` details sheet class, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Dashboard User Menu Chrome Parity

- Continued the dashboard shell audit by comparing PlotKeys `DashboardUserMenuTrigger` and `DashboardUserMenuContent` against Midday's global `UserMenu`.
- Replaced the extra ghost button wrapper around the user avatar trigger with a direct 32px rounded avatar trigger, matching Midday's `DropdownMenuTrigger asChild` avatar pattern.
- Aligned the dropdown content width and compact profile/menu typography with Midday's `w-[240px]`, `max-w-[155px]`, `line-clamp-1`, and `text-xs` menu-item shape while preserving PlotKeys' settings link and sign-out behavior.
- Validation: focused scans confirmed the avatar trigger no longer imports or renders `Button`, the dropdown uses `w-[240px]`, compact profile/menu classes are present, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Dashboard Header Collapse Parity

- Continued the dashboard shell audit by comparing PlotKeys `DashboardTopbar` and the shared `SiteNav.Header` implementation against Midday's dashboard `Header`.
- Removed the extra sticky wrapper around `SiteNav.Header` so the dashboard header follows Midday's direct layout placement with transform-driven collapse behavior.
- Aligned the shared header class shape with Midday's `md:m-0`, explicit backdrop-filter utilities, `bg-opacity-70`, desktop top rounding, border, height, and transition tokens while preserving PlotKeys' left/right slot API.
- Validation: focused scans confirmed the sticky topbar wrapper is gone, the Midday header class tokens and header-offset transform remain in `SiteNav.Header`, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Dashboard Sidebar Rail Action Parity

- Continued the dashboard shell audit by comparing PlotKeys `DashboardChrome`, `DashboardTopbar`, `DashboardSidebar`, and dashboard user menu components against Midday's sidebar layout, header, sidebar, and user menu references.
- Removed the duplicate bottom sign-out action from the dashboard sidebar because Midday keeps sign-out ownership in the avatar user menu, which PlotKeys already provides.
- Removed the expanded sidebar brand/app-count text and aligned the logo strip with Midday's rail shape: a top logo home link with width tied to sidebar expansion and plain background/border tokens.
- Validation: focused scans confirmed `DashboardSidebar` no longer imports or renders `SignOutButton` / `LogOut`, `DashboardChrome` renders `<DashboardSidebar />`, the user menu still owns sign-out, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Infinite Scroll Threshold Parity

- Continued the shared table runtime audit by comparing PlotKeys `useDashboardTableRuntime` / `useTableInfiniteScroll` against Midday invoices and customers data-table references.
- Restored the shared infinite-scroll wrapper default threshold to Midday's hook default of `20`, so generic migrated tables follow the invoices-style behavior unless a domain opts out.
- Added an explicit `infiniteScrollThreshold` runtime option and set Customers to `50`, matching Midday's customers table where that threshold is intentionally passed at the call site.
- Validation: focused scans confirmed the shared default is `20`, Customers passes `infiniteScrollThreshold: 50`, and no stale wrapper default of `50` remains; direct trailing-whitespace scan and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Draggable Header Shape Parity

- Continued the shared header audit by comparing PlotKeys `CoreDataTableHeader` against the Midday invoices table-header draggable and non-reorderable branches.
- Restored the Midday draggable-header call-site shape: `DraggableHeader` receives `key`, `id`, and `style`, wraps rendered header content in the inner `flex items-center flex-1 min-w-0 overflow-hidden` container, and renders the resize handle with the Midday `&&` guard.
- Reordered the non-reorderable header base class string, sticky background/z-index suffix, `TableHead` props, and resize-handle guard style to match the Midday invoices reference.
- Validation: focused scans confirmed the Midday draggable wrapper, prop order, header class shape, and resize-handle guard style are present; direct trailing-whitespace scan and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Shell Class Shape Parity

- Continued the shared table content/shell audit by comparing PlotKeys `CoreDataTableContent` and `CoreDataTableShell` against Midday invoices/customers data-table markup.
- Updated the shared table body class order to `border-l-0 border-r-0 block`, matching Midday's table body shape.
- Updated the shared scroll shell border utilities and spacer prop/style ordering to match Midday's `border-l border-r border-b border-border` scroll container and header-offset spacer.
- Validation: focused scans confirmed the shared shell/content now expose the Midday class strings; direct trailing-whitespace scan and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Resize Handle Guard Parity

- Continued the table header parity audit by comparing PlotKeys shared `CoreDataTableHeader` with Midday invoices/customers table headers and the shared Midday `ResizeHandle`.
- Confirmed PlotKeys and Midday `ResizeHandle` both internally return `null` for non-resizable columns, so the change is call-site parity rather than a behavior fix.
- Updated the non-reorderable shared header branch to guard resize-handle rendering with `header.column.getCanResize()`, matching the Midday invoices table header shape already used by the draggable branch.
- Validation: focused scans confirmed both shared header resize-handle call sites are guarded, direct trailing-whitespace scan passed, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Header Label Fallback Parity

- Continued the table interaction-layer audit by comparing Midday invoices/customers table headers with the shared PlotKeys `CoreDataTableHeader`.
- Confirmed `DraggableHeader` itself already matches Midday's wrapper/drag-handle structure, so no draggable wrapper change was needed.
- Updated shared sortable and non-sortable header label fallback to use `getHeaderLabel(columnId)`, matching Midday, instead of falling back to raw column ids or a cast TanStack header value.
- Reordered the shared `SortButton` class string to match Midday's button class order while preserving the same styling.
- Validation: focused scans found no raw `columnId` sortable label fallback, no `columnDef.header as string` fallback, and the expected `getHeaderLabel(columnId)` usage; direct trailing-whitespace scan and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Core Import Parity

- Continued the one-to-one table-core parity audit after hook behavior checks.
- Compared the existing Midday table-core files (`bottom-bar`, `skeleton-cell`, `empty-states`, `types`, `table-skeleton`, and `virtual-row`) with the PlotKeys table-core counterparts before editing.
- Confirmed `bottom-bar`, `types`, and the main skeleton/virtual-row behavior are aligned aside from PlotKeys package names and intentional PlotKeys abstractions such as `createTableSkeleton` and shared non-clickable column constants.
- Reordered `cn` imports ahead of UI primitive imports in `skeleton-cell`, `table-skeleton`, and `virtual-row`, matching the Midday core import shape.
- Validation: direct diffs now show only package-name differences plus intentional PlotKeys extensions in the touched files; direct trailing-whitespace scan and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Hook Behavior Parity

- Continued the table hook audit after restoring hook placement to the Midday reference shape.
- Compared PlotKeys `use-table-dnd`, `use-sticky-columns`, `use-sort-query`, and `use-table-scroll` against the Midday reference implementations before editing behavior.
- Re-aligned `useTableDnd` with Midday's simple `useTableDnd(table)` signature and drag-end handler, removing the PlotKeys-only options/guard branch; non-reorderable behavior remains enforced by the table header's sortable item filtering and the shared table config field that also exists in Midday.
- Fixed the restored `use-sticky-columns` top-level hook import so its `StickyColumnConfig` type resolves from table core instead of the old local core path.
- Validation: focused scans confirmed no `useTableDnd(table, options)` calls or local `UseTableDndOptions` remain; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Table Runtime Hook Placement Correction

- Re-checked the table runtime hook placement against the Midday reference after restoring table settings to the top-level hooks/actions boundary.
- Confirmed Midday keeps `use-sticky-columns`, `use-table-dnd`, `use-table-scroll`, `use-infinite-scroll`, `use-sort-query`, and `use-scroll-header` under top-level dashboard hooks.
- Restored those PlotKeys table runtime hooks to `apps/dashboard/src/hooks` and updated table-core wrappers/header/skeleton modules to import them from `@/hooks`, matching the Midday placement.
- Updated migrated data tables to import `useScrollHeader` directly from `@/hooks/use-scroll-header` instead of the table-core barrel, while keeping table-core wrappers for PlotKeys' shared migrated table composition.
- Validation: focused scans confirmed no local `./use-*` table runtime hook imports remain in table core for the restored Midday hooks, and no table-core barrel exports remain for `useStickyColumns` or `useScrollHeader`; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Table Settings Hook Placement Correction

- Re-checked the table settings persistence boundary against the Midday reference before continuing the table-core ownership cleanup.
- Confirmed Midday keeps `use-table-settings.ts` under top-level dashboard hooks and `update-table-settings-action.ts` under top-level dashboard actions.
- Restored PlotKeys `useTableSettings` to `apps/dashboard/src/hooks/use-table-settings.ts` and kept `updateTableSettingsAction` in `apps/dashboard/src/actions/update-table-settings-action.ts`, matching the Midday placement.
- Updated `useDashboardTableSettings` to wrap the restored global hook while still centralizing migrated table column-id bootstrapping in table core.
- Validation: focused scans confirmed the expected Midday-shaped references: global `useTableSettings`, global table settings action, and one table-core wrapper import; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Table Settings Hook Ownership Cleanup

- Continued the table-core ownership audit after moving sort and scroll-header behavior into `components/tables/core`.
- Moved the core-only `useTableSettings` column visibility/sizing/order persistence hook from global dashboard hooks into table core.
- Updated `useDashboardTableSettings` to import the table settings primitive locally while keeping the dedicated `updateTableSettingsAction` server action in `apps/dashboard/src/actions`, matching the current repo's server-action placement.
- Left shared URL hooks such as `useSortParams` in global hooks because routes, filter helpers, and domain data-table modules still consume that URL contract directly.
- Validation: focused scans found no remaining `@/hooks/use-table-settings` imports and only table-core-local `useTableSettings` references; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Table Scroll Header Ownership Cleanup

- Continued the table-core ownership audit after moving the table sort helper into core.
- Moved table-only `useScrollHeader` from global dashboard hooks into table core, because all active callers are migrated table data-table modules.
- Exported `useScrollHeader` from the table-core barrel and folded the hook into each migrated data table's existing `@/components/tables/core` import.
- Removed the old `@/hooks/use-scroll-header` import path from Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables.
- Validation: focused scans found no remaining `@/hooks/use-scroll-header` imports; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Table Sort Header Ownership Cleanup

- Continued the table-core ownership audit after moving table interaction runtime helpers into `components/tables/core`.
- Moved the table-header-only `useSortQuery` helper from global dashboard hooks into table core beside `CoreDataTableHeader`.
- Updated `CoreDataTableHeader` to import `useSortQuery` locally, while leaving the shared `useSortParams` URL contract in global hooks because routes and domain table data modules still consume it directly.
- Validation: focused scans found no remaining `@/hooks/use-sort-query` imports and only table-core-local `useSortQuery` references; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Table Interaction Runtime Ownership Cleanup

- Continued the table-core parity audit after moving sticky-column ownership into `components/tables/core`.
- Moved table-only runtime helpers `useTableDnd`, `useTableScroll`, and `useInfiniteScroll` out of global dashboard hooks and into table core alongside the table runtime wrappers that consume them.
- Updated `useTableColumnRuntime` to import DnD and horizontal table-scroll helpers from local table-core modules.
- Updated `useTableInfiniteScroll` to import the raw infinite-scroll helper from local table core instead of `@/hooks`.
- Validation: focused scans found no remaining `@/hooks/use-table-dnd`, `@/hooks/use-table-scroll`, or `@/hooks/use-infinite-scroll` imports; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Table Sticky Runtime Ownership Cleanup

- Continued the remaining table-core parity audit after class-composition scans found the sticky-column helper still living under global dashboard hooks and importing `cn` from `@plotkeys/utils`.
- Moved `useStickyColumns` into `components/tables/core`, because all active callers are shared table-core modules: `TableSkeleton`, `CoreDataTableHeader`, and `useTableColumnRuntime`.
- Switched the sticky-column helper to the Midday-shaped `@plotkeys/ui/cn` import path and changed its sticky-column type import to the local table-core `./types` module.
- Updated table-core callers and the table-core barrel export to use the local `./use-sticky-columns` owner instead of the old global `@/hooks/use-sticky-columns` path.
- Validation: focused scans found no remaining `@/hooks/use-sticky-columns` imports and no dashboard `cn` imports from `@plotkeys/utils`; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Builder Preview Error Boundary Cleanup

- Continued the builder route-query/error-boundary cleanup after template draft failures moved into local picker state.
- Changed preview field update and smart-fill failures to render inside the builder preview shell via `useBuilderPreviewActions` local state instead of redirecting the builder route through `?error=`.
- Removed `useSearchParams`, `URLSearchParams`, and route error replacement from `useBuilderPreviewActions`, while preserving successful mutation refresh behavior.
- Rendered preview edit/smart-fill errors as a compact destructive notice above the preview runtime body so both framed and canvas previews surface failures without changing navigation state.
- Validation: focused scans confirmed builder preview actions no longer import `useSearchParams` or call `nextParams.set("error", ...)`; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Builder Template Draft Error Boundary Cleanup

- Continued the builder route-query/error-boundary cleanup after sidebar theme updates stopped writing route-level error state.
- Changed builder template draft creation failures to render inside the template picker via local hook state instead of redirecting the builder route through `?error=`.
- Preserved successful draft navigation behavior: the picker still writes the new `configId`, resets the selected page to `home`, clears stale route error state, replaces the builder URL, and refreshes route data.
- Returned template draft error state from `useBuilderTemplateSelection` and rendered it as small destructive text inside the template dropdown beside the template choices.
- Validation: focused scans confirmed template draft creation no longer calls `nextParams.set("error", ...)`; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Builder Sidebar Theme Error Boundary Cleanup

- Continued the builder route-query/error-boundary cleanup after the publish modal stopped writing builder route notice flags.
- Changed builder sidebar theme update failures to render inside the sidebar controls via local hook state instead of redirecting the builder route through `?error=`.
- Removed `useSearchParams`, `URLSearchParams`, and `router.replace` error-writing from `useBuilderSidebarThemeActions`, while preserving successful `router.refresh()` behavior and silent background-save failures.
- Rendered the local sidebar theme error as small destructive text inside `BuilderSidebarControls`, near the controls that trigger the save.
- Validation: focused scans confirmed `useBuilderSidebarThemeActions` no longer imports `useSearchParams` or writes route `error` state; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Builder Publish Notice Boundary Cleanup

- Continued the remaining builder/modal parity audit after stale route-query scans found the publish confirmation modal still writing builder `error` / `published` notice flags into the URL.
- Changed publish failures to render inside the publish confirmation dialog via local mutation error state instead of redirecting the whole builder route through `?error=`.
- Stopped writing `published=1` on publish success while preserving the existing `configId` handoff, route refresh, and dialog close behavior.
- Removed the now-dead `published` notice field from the builder route search-param contract and `BuilderWorkspaceNotices`.
- Validation: focused scans found no remaining `published` route notice support and no publish-modal `set("error")` / `set("published")` calls; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Modal Close Primitive Parity

- Continued the remaining modals/dialogs parity audit after confirming local modal headers already use `DialogHeader`, `DialogTitle`, and `DialogDescription` primitives.
- Updated the recommendation template modal footer action to use `DialogClose` for the cancel button, matching the publish confirmation modal's primitive-based cancel behavior.
- Removed the recommendation modal's unnecessary `onCancel` prop plumbing from its extracted action component while preserving controlled open-state behavior through the dialog primitive.
- Validation: focused scans confirmed both active dashboard modal action footers now use `DialogClose` for cancel actions; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched modal files.
- Superseded later on 2026-07-16 by the Midday dialog primitive implementation pass: `DialogClose` was removed from the shared dialog export and both modal footers now close through modal-owned controlled state.

## 2026-07-16 — Midday Stacked Sheet Header Primitive Parity

- Continued the remaining sheets/modals parity audit after confirming all dashboard `cn` class-composition imports now use the Midday-shaped `@plotkeys/ui/cn` path.
- Updated the shared `StackedSheetHeader` chrome to render `SheetTitle` and `SheetDescription` from the UI sheet primitive instead of plain `h2` / `p` elements.
- Preserved existing stack sheet titles, descriptions, close buttons, and domain sheet behavior while aligning the shared header with the same sheet primitive semantics used by customer/property detail headers.
- Validation: focused scans confirmed `StackedSheetHeader` still owns shared create/edit/invite sheet header chrome and now imports `SheetTitle` / `SheetDescription`; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Builder/Template Sandbox `cn` Import Parity

- Continued the remaining dashboard/page parity audit across builder, template sandbox, and dev chrome surfaces.
- Switched UI-only class composition imports from `@plotkeys/utils` to the Midday-shaped `@plotkeys/ui/cn` path across builder preview frame/register/sidebar/layout helpers, template sandbox floating config controls, and the dev FAB shell.
- Split the mixed Builder workspace sidebar import so `cn` comes from `@plotkeys/ui/cn` while the domain `SubscriptionTier` type remains on `@plotkeys/utils`.
- Validation: focused scans found no remaining builder/template-sandbox/dev `cn` imports from `@plotkeys/utils` / `@plotkeys/utils/cn`; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Shared Chrome `cn` Import Parity

- Continued the remaining dashboard/page parity audit across shared chrome and page-adjacent UI helpers.
- Switched UI-only class composition imports from `@plotkeys/utils` to the Midday-shaped `@plotkeys/ui/cn` path in shared auth sign-out, secondary menu, header link tabs, horizontal pagination, payroll period tabs, onboarding brand avatar, and project budget/workforce row helpers.
- Left `@plotkeys/utils` imports in place where the file consumes domain constants or URL/build helpers rather than only `cn`.
- Validation: focused scans found no remaining `@plotkeys/utils` / `@plotkeys/utils/cn` imports in the touched shared-chrome files; direct trailing-whitespace scan and scoped `git diff --check` passed for the touched files.

## 2026-07-16 — Midday Form Layout Surface Rename

- Continued the dashboard/sheets/forms parity audit after stale shared-surface scans found the form layout helper still exported dashboard-prefixed component names.
- Renamed shared form layout exports from `DashboardFormBody` / `DashboardFormFooter` to neutral `FormBody` / `FormFooter`, keeping the same sheet/form chrome while removing dashboard-specific public naming from form modules.
- Updated Agent, Appointment, Customer, Department, Estate, Estate Launch Details, Leave Request, Payroll Entry, Project, Property, Invite Agent, Invite Employee, and Invite Member forms to consume the neutral form layout exports.
- Switched the form layout class composition import to the Midday-shaped `@plotkeys/ui/cn` path.
- Validation: focused scans found no remaining `DashboardFormBody` or `DashboardFormFooter` references in forms/sheets; direct trailing-whitespace scan passed for current touched files, and scoped `git diff --check` passed for the tracked diff.

## 2026-07-16 — Midday Search Filter Surface Rename

- Continued the remaining dashboard/page parity audit across shared filter surfaces after stale dashboard wrapper scans found the old page/header/section primitives removed from active app/component paths.
- Renamed the shared `DashboardSearchFilter` module to plain `SearchFilter` at `components/search-filter/search-filter.tsx`, removing the dashboard-specific public surface name from domain filter composition.
- Updated Projects, Blog, Properties, Employees, Leave Requests, Appointments, and Leads search filter adapters to import and render `SearchFilter`.
- Switched the shared search filter class composition import to the Midday-shaped `@plotkeys/ui/cn` path.
- Validation: focused scans found no remaining `DashboardSearchFilter` or `dashboard-search-filter` references under dashboard app/components/hooks; direct trailing-whitespace scan passed for the current touched filter files, and scoped `git diff --check` passed for the tracked diff.

## 2026-07-16 — Midday Table `cn` Export Parity

- Continued the remaining dashboard parity audit across table-adjacent action/menu and helper surfaces.
- Confirmed dashboard-owned `joinClasses` usage has already been removed from the dashboard migration path; remaining `joinClasses` references live outside `apps/dashboard/src` in template/tenant-site code.
- Added the Midday-shaped `@plotkeys/ui/cn` export path as the local analogue of `@midday/ui/cn`, backed by the shared `@plotkeys/utils/cn` helper.
- Migrated table core/table-adjacent class composition imports in the skeleton, virtual row, draggable header, and resize handle modules from `@plotkeys/utils` to `@plotkeys/ui/cn`.
- Audited migrated row action menus and left their mutation/dropdown bodies domain-owned because Midday keeps those menus feature-specific and the shared virtual-row layer already treats `actions` as a non-clickable column.
- Validation: focused scans found table class composition imports now using `@plotkeys/ui/cn` while domain constants remain on `@plotkeys/utils`; direct trailing-whitespace scan and scoped `git diff --check` passed. Raw `bun -e` package import probing remains blocked in this checkout because even existing `@plotkeys/ui/button` imports cannot resolve without workspace package symlinks.

## 2026-07-16 — Midday Table Empty-State Adapter Completion

- Continued the remaining dashboard parity audit across migrated table empty/no-results modules.
- Migrated Employees empty/no-results adapter to shared `CoreEmptyState` / `CoreNoResults` chrome, completing the shared empty-state chrome migration across the 13 migrated table adapters.
- Preserved employee status-specific copy, department-specific copy, and `setFilters(null)` no-results behavior.
- Confirmed repeated empty/no-results wrapper markup now lives only in table core; domain empty-state adapters keep copy, create actions, permission gates, URL param actions, and filter-reset behavior.
- Validation: focused scans found no migrated domain empty-state adapter still owning the repeated layout/text/button chrome; remaining direct buttons are only domain create actions in Customers, Projects, and Properties.

## 2026-07-16 — Midday Table Empty-State Action Cleanup

- Continued the remaining dashboard parity audit across migrated table empty/no-results modules with create actions.
- Migrated Blog, Projects, Customers, and Properties empty/no-results adapters to use shared `CoreEmptyState` / `CoreNoResults` chrome instead of hand-rolled wrapper and no-results button markup.
- Preserved Blog's `CreateBlogPostButton`, Projects' create-project URL param, Customers' `canManage` permission gate and multi-param clear reset, and Properties' create-listing URL param.
- Kept direct `Button` imports only where they are domain create actions, not generic no-results chrome.
- Validation: focused scans found repeated empty/no-results layout removed from Blog, Projects, Customers, and Properties while domain create actions and filter reset behavior remain explicit in their adapters.

## 2026-07-16 — Midday Table Empty-State Status Copy Cleanup

- Continued the remaining dashboard parity audit across migrated table empty/no-results modules.
- Migrated Leads, Leave Requests, Notifications, and Payroll empty-state adapters to use shared `CoreEmptyState` / `CoreNoResults` chrome instead of hand-rolled wrapper, text, and button markup.
- Preserved status-specific empty copy for Leads and Leave Requests, unread-specific copy for Notifications, and period-specific copy for Payroll.
- Preserved each domain's filter-clear behavior, including Notifications' q-only reset with `setFilter({ q: null })`.
- Kept create-action and permission-gated empty states for Customers, Properties, Blog, Projects, and other richer modules out of this slice for a separate careful pass.
- Validation: focused scans found direct button imports and repeated empty/no-results wrapper markup removed from Leads, Leave Requests, Notifications, and Payroll empty-state adapters; shared layout/button chrome remains owned by table core.

## 2026-07-16 — Midday Table Empty-State Chrome Cleanup

- Continued the remaining dashboard parity audit across migrated table empty/no-results modules.
- Made shared table `EmptyState` chrome support optional built-in actions and custom action elements, while keeping `NoResults` as the shared clear-filter chrome.
- Migrated Agents, Appointments, Departments, and Team empty-state adapters to use shared `CoreEmptyState` / `CoreNoResults` chrome instead of hand-rolled wrapper, text, and button markup.
- Preserved each domain's empty-state copy and filter-clear hook behavior.
- Left more domain-specific empty states, such as Customers, Properties, Blog, Projects, Employees, Leads, Leave Requests, Notifications, and Payroll, for a careful follow-up because they include create actions, permission gates, status-specific copy, multi-param resets, or non-`setFilter(null)` behavior.
- Validation: focused scans found the repeated empty/no-results layout and direct button imports removed from Agents, Appointments, Departments, and Team empty-state adapters; shared layout/button chrome remains owned by table core.

## 2026-07-16 — Midday Table Skeleton Adapter Factory

- Continued the remaining dashboard parity audit across migrated table loading-state adapters.
- Added `createTableSkeleton` to table core so feature-owned skeleton files can declare only their columns resolver and sticky-column ids while table-state defaults and `TableSkeleton` prop plumbing stay in core.
- Exported shared table skeleton props/state types from table core for the factory boundary.
- Collapsed Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team skeleton adapters into config-only exports using `createTableSkeleton`.
- Preserved static skeleton columns for standard tables and preserved the existing resolved-column behavior for Customers, Properties, and Team.
- Validation: focused scans found no repeated table-state prop types or `TableSkeleton` wrapper components left in migrated skeleton adapters; all 13 migrated skeleton adapters now use `createTableSkeleton` and retain their sticky-column ids.

## 2026-07-16 — Midday Table Header Component Handoff

- Continued the remaining dashboard parity audit across migrated data-table/header composition.
- Updated `CoreDataTableContent` to accept a table header component and render it with the TanStack table instance plus table-scroll state.
- Moved `tableScroll` into the typed `contentRuntime` bundle returned by `useDashboardTableRuntime`, removing the separate `tableScroll` return from migrated data-table callers.
- Migrated Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables to pass `header={DataTableHeader}` instead of repeating `<DataTableHeader table={table} tableScroll={tableScroll} />`.
- Preserved each domain's header config, horizontal pagination, sticky header behavior, row-click behavior, bulk actions, shell runtime handoff, and content runtime handoff.
- Validation: focused scans found no migrated data table still destructuring `tableScroll` or passing a pre-rendered `DataTableHeader` element; all 13 migrated data tables now pass the header component directly.

## 2026-07-16 — Midday Table Header Adapter Factory

- Continued the remaining dashboard parity audit across migrated table header adapters.
- Added `createCoreDataTableHeader` to table core so feature-owned table-header files can declare only their table id and primary sortable column config.
- Exported the shared core header props and primary-column types for the factory boundary.
- Collapsed Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team table-header adapters from repeated generic prop/type wrapper components into config-only `DataTableHeader` exports.
- Preserved every table's existing primary column id, label, sort field, table id, header imports from data-table files, horizontal pagination behavior, sticky header behavior, sort behavior, DnD header behavior, and resize handles.
- Validation: focused scans found no repeated `DataTableHeaderProps` / `export function DataTableHeader` wrapper definitions left in migrated table-header files; all 13 adapters now use `createCoreDataTableHeader`.

## 2026-07-16 — Midday Table Selection Value Cleanup

- Continued the remaining dashboard parity audit across migrated table runtime return usage.
- Removed direct `selectedCount` destructuring from Leads, Leave Requests, Notifications, and Payroll data tables because their bottom-bar actions do not need selected-count labels after the shell runtime bundle.
- Preserved selected-count display in `CoreDataTableShell` through `shellRuntime`, and preserved direct `selectedCount` usage in delete-confirmation tables that pass the count into `BulkClientDeleteAction`.
- Kept selected-id mutation payloads, clear-selection callbacks, status/bulk action behavior, table headers, and content runtime handoff unchanged.
- Validation: focused scans found no `selectedCount` usage in the non-delete bulk-action data tables; remaining direct `selectedCount` usage appears only in migrated tables that pass it to `BulkClientDeleteAction`.

## 2026-07-16 — Midday Table Shell Runtime Bundle

- Continued the remaining dashboard parity audit across migrated table shell/runtime boundaries.
- Added a typed `CoreDataTableShellRuntime` bundle for deselect behavior, scroll-container ref bridging, and selected-row count.
- Updated `useDashboardTableRuntime` to return `shellRuntime` beside `contentRuntime`, selected ids, selected count, and table scroll state.
- Migrated Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables to pass `runtime={shellRuntime}` into `CoreDataTableShell` instead of repeating `onDeselect`, `scrollRef`, and `selectedCount` shell props.
- Preserved domain-owned bulk-action labels, selected-count usage in delete confirmations, mutation callbacks, row-click handlers, table headers, empty states, and table content runtime handoff.
- Validation: focused scans found no migrated data table still passing `onDeselect`, `scrollRef`, or `selectedCount` into `CoreDataTableShell`; all 13 migrated data tables now pass `runtime={shellRuntime}`.

## 2026-07-16 — Midday Table Content Identity Runtime

- Continued the remaining dashboard parity audit across migrated table render identity ownership.
- Moved the `tableId` used by `CoreDataTableContent` for DnD context identity into the typed `contentRuntime` bundle returned by `useDashboardTableRuntime`.
- Removed repeated `tableId` props from Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team `CoreDataTableContent` calls.
- Preserved each table's existing DnD context id value by continuing to source the id from the same table id passed into `useDashboardTableRuntime`.
- Kept domain-owned table settings, table headers, row-click handlers, bulk actions, empty states, and shell selection handoff unchanged.
- Validation: focused scans found all 13 migrated data tables still render `CoreDataTableContent`, with no content-level `tableId` prop fanout left; table identity now flows through table core runtime.

## 2026-07-16 — Midday Table Content State Derivation

- Continued the remaining dashboard parity audit across migrated table render-state ownership.
- Updated `CoreDataTableContent` to accept the TanStack table instance and derive `columnOrder`, `columnSizing`, `columnVisibility`, and fallback `columnsLength` internally.
- Migrated Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables to pass `table={table}` instead of repeating column state and column-count props.
- Preserved dynamic column behavior for Customers, Properties, and Team by deriving the fallback colspan from the resolved table leaf columns instead of the static module column array.
- Kept domain-owned table settings, table headers, row-click handlers, bulk actions, empty states, and runtime bundle handoff unchanged.
- Validation: focused scans found no migrated data table still passing `columnOrder`, `columnSizing`, `columnVisibility`, or `columnsLength` into `CoreDataTableContent`; all 13 migrated data tables now pass the table instance directly.

## 2026-07-16 — Midday Table Content Runtime Bundle

- Continued the remaining dashboard parity audit across migrated table render/runtime boundaries.
- Added a typed `CoreDataTableContentRuntime` bundle for sticky-column helpers, DnD handlers, row model data, row height, row selection state, virtualizer state, and DnD sensors.
- Updated `useDashboardTableRuntime` to return `contentRuntime` beside shell/selection values, so render-only table runtime details stay grouped in table core.
- Migrated Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables to pass `runtime={contentRuntime}` into `CoreDataTableContent` instead of exploding sticky/DnD/virtualizer props in every domain table.
- Preserved domain-owned table settings, headers, row-click handlers, bulk actions, selection callbacks, empty/no-results states, and query/mutation ownership.
- Validation: focused scans found no migrated domain data table still passing `getStickyClassName`, `getStickyStyle`, `handleDragEnd`, `rows`, `rowHeight`, `rowSelection`, `rowVirtualizer`, or `sensors` directly to `CoreDataTableContent`; all 13 migrated data tables now pass `runtime={contentRuntime}`.

## 2026-07-16 — Midday Table Bottom-Bar Child Simplification

- Continued the remaining dashboard parity audit across migrated table bottom-bar composition.
- Removed unnecessary single-child fragments from Agents, Appointments, Blog, Customers, Departments, Employees, Notifications, Payroll, Projects, Properties, and Team bottom-bar props.
- Preserved fragment wrappers only where the bottom bar actually renders multiple actions: Leads and Leave Requests.
- Kept domain-owned mutation callbacks, selected-count labels, pending states, and clear-selection behavior unchanged while tightening the shared table shell handoff.
- Validation: focused multiline scans found fragment-wrapped `bottomBar` props only in the two multi-action data tables; all single-action migrated tables now pass their bulk action directly to `CoreDataTableShell`.

## 2026-07-16 — Midday Dashboard Table Selection Runtime Fold-In

- Continued the remaining dashboard parity audit across migrated table runtime and selection ownership.
- Folded `useTableRowSelection` into `useDashboardTableRuntime`, so table core now returns `clearSelection`, `selectedCount`, and `selectedIds` beside sticky/DnD, rows, row height, virtualizer, scroll ref, and table scroll state.
- Migrated Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables to pass `rowSelection` and `setRowSelection` into the shared runtime helper instead of calling `useTableRowSelection` directly.
- Preserved domain-owned bulk mutation callbacks, action labels, row-click params, table meta, and bottom-bar children while keeping selection derivation in the table runtime boundary.
- Validation: focused scans found no domain-level `useTableRowSelection` calls left in migrated data tables; every migrated data table passes row-selection state into `useDashboardTableRuntime` and receives the selection helpers from table core.

## 2026-07-16 — Midday Table Bottom-Bar Visibility Cleanup

- Continued the remaining dashboard parity audit across migrated table bottom-bar ownership.
- Moved selected-row bottom-bar visibility into `CoreDataTableShell`, deriving it from `selectedCount > 0`.
- Removed `showBottomBar` from `useTableRowSelection` and from Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data table shell props.
- Preserved selected-id derivation, selected count, deselect behavior, domain bulk actions, and bottom-bar rendering behavior while removing one more repeated domain-owned table-shell concern.
- Validation: focused scans found `showBottomBar` only inside `CoreDataTableShell`; migrated data tables still pass `selectedCount` and no longer pass visibility flags.

## 2026-07-16 — Midday Dashboard Table Runtime Hook Split

- Continued the remaining dashboard parity audit across migrated table runtime choreography.
- Added `useDashboardTableRuntime` under shared table core to compose column sync, sticky/DnD runtime, row model derivation, row-height lookup, virtualizer setup, scroll-container ref bridging, and infinite-scroll wiring.
- Migrated Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables to call the shared runtime helper with their table id, table instance, query paging state, scroll ref, store column setter, and column visibility state.
- Preserved domain-owned query construction, mutation/bulk-action handling, row-click params, summary-header offsets, empty/no-results rendering, table headers, and bottom-bar action content.
- Validation: focused scans found no domain-level `useTableColumnSync`, `useTableColumnRuntime`, `useTableVirtualizer`, `useTableScrollContainerRef`, `useTableInfiniteScroll`, or `ROW_HEIGHTS` usage left in migrated data tables; those runtime concerns now live in table core.

## 2026-07-16 — Midday Table DnD Id Ownership Cleanup

- Continued the remaining dashboard parity audit across migrated table render props.
- Moved the predictable DnD context id derivation into `CoreDataTableContent`, using each table's `TableId` to produce the existing `<tableId>-table-dnd` id.
- Replaced explicit `dndId` string props in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with `tableId`.
- Preserved every table's existing DnD id value while removing another repeated render-detail prop from domain data tables.
- Validation: focused scans found no `dndId` props or symbols left in migrated data tables; all 13 migrated data tables pass `tableId` to `CoreDataTableContent`, and core derives the DnD id.

## 2026-07-16 — Midday Dashboard Table Settings Hook Split

- Continued the remaining dashboard parity audit across migrated table settings bootstrap.
- Added `useDashboardTableSettings` under shared table core to own repeated column-id derivation and `useTableSettings` wiring for column visibility, sizing, and order state.
- Migrated Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables to call the shared settings helper with their table id, initial settings, and resolved column list.
- Preserved dynamic column ownership for Customers, Properties, and Team by passing their memoized `tableColumns` into the core helper.
- Validation: focused scans found no domain-level `getColumnIds`, `const columnIds`, or `useTableSettings` imports/calls left in migrated data tables; settings bootstrap now lives in table core.

## 2026-07-16 — Midday Table Bulk Action Button Chrome Split

- Continued the remaining dashboard parity audit across migrated table bottom-bar action chrome.
- Added `BulkClientAction` under shared table core to own the repeated client bulk-action button defaults: `size="sm"`, `type="button"`, disabled wiring, click wiring, and ghost fallback variant.
- Replaced hand-rolled bottom-bar action buttons in Leads, Leave Requests, Notifications, and Payroll data tables with the shared core action component.
- Preserved each domain table's mutation ownership, status payloads, pending disabling, and selected-row clearing while keeping bottom-bar action chrome centralized beside `BulkClientDeleteAction`.
- Validation: focused scans found no direct `@plotkeys/ui/button` imports, raw `<Button>` elements, or repeated `size="sm"` / `type="button"` bulk-action button props left in the migrated status-action table files.

## 2026-07-16 — Midday Table Bulk Hook Ordering Cleanup

- Continued the remaining dashboard parity audit across migrated table bottom-bar actions.
- Moved bulk-action `useCallback` declarations above empty/no-results returns in Agents, Appointments, Departments, Employees, Notifications, Payroll, and Team data tables.
- Preserved each domain's existing mutation payload, pending state, selected-row clearing, and bottom-bar action wiring while restoring stable React hook order for empty and populated table states.
- Validation: focused multiline scan found no remaining bulk-action callback declarations below migrated table empty-state return blocks; direct line scan confirmed the affected callbacks now appear before their empty/no-results branches.

## 2026-07-16 — Midday Table Non-Clickable Column Policy Cleanup

- Continued the remaining dashboard parity audit across migrated table row-click policy.
- Moved the default non-clickable row columns (`select` and `actions`) into the shared table core via `DEFAULT_NON_CLICKABLE_COLUMNS`.
- Let `CoreDataTableContent` and `VirtualRow` own the default row-click guard instead of requiring every migrated data table to declare and pass the same set.
- Removed duplicated `NON_CLICKABLE_COLUMNS` constants and `nonClickableColumns` props from Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables.
- Validation: focused scans found no domain-level `NON_CLICKABLE_COLUMNS`, `nonClickableColumns`, or duplicate `new Set(["select", "actions"])` usage left in migrated data tables; the default policy now exists only in table core.

## 2026-07-16 — Midday Core Table Shell Split

- Continued the remaining dashboard parity audit across migrated table outer shell chrome.
- Added `CoreDataTableShell` under shared table core to own the repeated relative table wrapper, scroll container class/height, header-offset spacer, `AnimatePresence`, and `BottomBar` composition.
- Replaced duplicated outer scroll-shell and conditional bottom-bar wrapper markup in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared shell component.
- Preserved domain-owned table content, page empty states, selected-count state, deselect callback, and bottom-bar action children.
- Validation: focused scans found no raw table outer wrapper, scroll container height/class, header-offset spacer, direct `AnimatePresence`, or direct `BottomBar` usage left in domain data tables; all 13 migrated data tables render `CoreDataTableShell`.

## 2026-07-16 — Midday Core Table Render Content Split

- Continued the remaining dashboard parity audit across migrated table render shells.
- Added `CoreDataTableContent` under shared table core to own the repeated DnD context, table shell, table body sizing, virtual-row mapping, empty in-body fallback row, and default `w-full min-w-full` table class.
- Replaced duplicated `DndContext` / `Table` / `TableBody` / `VirtualRow` render blocks in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared content component.
- Preserved domain-owned page/table container height, page empty states, bottom-bar action children, table header adapter, row-click behavior, and column count.
- Validation: focused scans found no raw `DndContext`, `closestCenter`, table body/cell/row primitives, `VirtualItem`, `VirtualRow`, local `virtualItems`, or `getVirtualItems()` usage left in domain data tables; all 13 migrated data tables render `CoreDataTableContent`.

## 2026-07-16 — Midday Dashboard Table Instance Hook Split

- Continued the remaining dashboard parity audit across migrated table instance setup.
- Added `useDashboardTable` under shared table core to own the repeated TanStack table construction defaults: column resize mode, core row model, id-based row keys, column sizing/order/visibility handlers, row selection handler, and table state wiring.
- Replaced duplicated `useReactTable` setup in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared hook.
- Preserved domain-owned columns, rows, row-selection store state, table settings state, and optional table meta; Customers continues to pass its row action meta through the shared hook.
- Validation: focused scans found no raw `useReactTable`, `getCoreRowModel`, table resize defaults, id row-key callback, or table state handler boilerplate left in domain data tables; all 13 migrated data tables call `useDashboardTable`.

## 2026-07-16 — Midday Table Column Runtime Hook Split

- Continued the remaining dashboard parity audit across migrated table column runtime wiring.
- Added `useTableColumnRuntime` under shared table core to own the repeated table DnD sensors/drag handler, sticky-column style/class helpers, and horizontal scroll state setup.
- Moved the `STICKY_COLUMNS[tableId]` lookup into the core runtime hook so migrated data tables declare only their table id for column runtime behavior.
- Replaced duplicated `useTableDnd`, `useStickyColumns`, and `useTableScroll` wiring in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared hook.
- Updated table config/sticky-column type imports to use `components/tables/core/types` directly, avoiding a barrel dependency cycle while keeping table core as the shared owner.
- Validation: focused scans found no raw `useTableDnd`, `useStickyColumns`, `useTableScroll`, or `STICKY_COLUMNS` usage left in domain data tables; all 13 migrated data tables call `useTableColumnRuntime`.

## 2026-07-16 — Midday Table Row Selection State Hook Split

- Continued the remaining dashboard parity audit across migrated table selection and bottom-bar wiring.
- Added `useTableRowSelection` under shared table core to own selected-row id derivation, selected count, bottom-bar visibility, and shared clear-selection behavior.
- Replaced duplicated `Object.keys(rowSelection)`, `showBottomBar`, selected-count, and inline deselect wiring in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared hook.
- Left each data table responsible for its domain-specific bulk mutation and bottom-bar action children while moving common row-selection state derivation into table core.
- Validation: focused scans found no direct `Object.keys(rowSelection)`, inline `setRowSelection({})`, `selectedIds.length`, or local `showBottomBar = selectedIds.length > 0` patterns left in domain data tables; all 13 migrated data tables call `useTableRowSelection`.

## 2026-07-16 — Midday Table Virtualizer Hook Split

- Continued the remaining dashboard parity audit across migrated table runtime wiring.
- Added `useTableVirtualizer` under shared table core to own the repeated TanStack virtualizer setup: row count, row-height estimate, scroll-element lookup, and default overscan.
- Replaced the duplicated virtualizer setup in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared hook.
- Left each data table responsible for its domain row height, row model, table state, row actions, and rendering while moving the common virtualizer construction into table core.
- Validation: focused scans found no raw `useVirtualizer` calls, inline `count: rows.length`, inline `getScrollElement: () => parentRef.current`, or inline `overscan: 10` blocks left in domain data tables; all 13 migrated data tables call `useTableVirtualizer`.

## 2026-07-16 — Midday Table Infinite Scroll Hook Split

- Continued the remaining dashboard parity audit across migrated table runtime wiring.
- Added `useTableInfiniteScroll` under shared table core to own the repeated `fetchNextPage` callback adapter, `useInfiniteScroll` call, row-count wiring, and Midday-style threshold used by virtualized table pages.
- Replaced the duplicated infinite-scroll wiring in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared hook.
- Left each data table responsible for its domain query, virtualizer, rows, empty states, and selection behavior while moving the common page-fetch trigger into table core.
- Validation: focused scans found no raw `useInfiniteScroll` imports/calls, local `loadMore` callbacks, or `fetchNextPage: loadMore` blocks left in domain data tables; all 13 migrated data tables call `useTableInfiniteScroll`.

## 2026-07-16 — Midday Agents Row-To-Sheet Interaction Alignment

- Continued the remaining dashboard parity audit across migrated table row-click and sheet behavior.
- Confirmed Customers and Properties already use `VirtualRow.onCellClick` with URL-owned detail sheets, while most other migrated tables only expose create/invite URL state and do not yet have mounted detail/edit sheet surfaces.
- Aligned Agents with the supported sheet-backed pattern: `AgentsDataTable` now uses `useAgentParams()` and opens the globally mounted `AgentEditSheet` by setting `agentId` from non-action table cells.
- Kept Departments, Appointments, Employees, Leave Requests, Payroll, Projects, Team, Blog, Leads, and Notifications without row-click navigation because the current app state does not provide corresponding detail/edit sheets to open.
- Validation: focused scans confirmed row-click handlers now exist only for supported sheet-backed Customers, Properties, and Agents table flows; scoped `git diff --check` passed for the touched Agents data table.

## 2026-07-16 — Midday Table Scroll Container Ref Hook Split

- Continued the remaining dashboard parity audit across migrated table scroll/virtualizer runtime wiring.
- Added `useTableScrollContainerRef` under the shared table core to own the ref bridge between each table's virtualizer parent ref and `useTableScroll().containerRef`.
- Replaced the repeated `setScrollContainerRef` callback and `MutableRefObject` cast in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared hook.
- Left each data table responsible for its own scroll container element and domain behavior while moving the common ref-bridge implementation into table core.
- Validation: focused scans found no `MutableRefObject`, `tableScroll.containerRef as`, or `[tableScroll.containerRef]` callback dependency left in domain data tables; all 13 migrated tables call `useTableScrollContainerRef`; no non-ASCII/trailing whitespace in touched code files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Scroll Header Runtime Alignment

- Continued the remaining dashboard parity audit across migrated table runtime behavior.
- Compared Plot Keys table data tables against Midday invoices/customers/vault/transactions references and found the shared `useScrollHeader` behavior was only wired on Customers.
- Wired `useScrollHeader(parentRef)` into Agents, Appointments, Blog, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, and Team data tables so table scroll containers now drive the Midday-style header offset.
- Wired Properties with `SUMMARY_GRID_HEIGHTS.properties`, matching Customers' summary-aware `useScrollHeader` offset for pages with collapsible summary grids. Superseded on 2026-07-18 after parity inspection confirmed Properties has no collapsible summary section.
- Validation at the time: focused scans found all 13 migrated table data tables import and call `useScrollHeader`; only Customers and Properties referenced `SUMMARY_GRID_HEIGHTS`; no non-ASCII/trailing whitespace in touched code files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Column Sync Hook Split

- Continued the remaining dashboard parity audit across migrated table runtime wiring.
- Added `useTableColumnSync` under the shared table core to own syncing TanStack leaf columns into the table store when column visibility changes.
- Replaced the repeated `useEffect` column-sync block in Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team data tables with the shared hook.
- Left each data table responsible for its domain query, empty state, bottom-bar action, and row behavior while moving the duplicated table-runtime synchronization into core.
- Validation: focused scans found no `useEffect` imports or repeated `setColumns(table.getAllLeafColumns())` blocks left in domain data tables; all 13 migrated data tables call `useTableColumnSync({ columnVisibility, setColumns, table })`, the old sync body exists only in the core hook, no non-ASCII/trailing whitespace in touched code files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Core Column Visibility Ownership Split

- Continued the remaining dashboard parity audit across table page header action controls.
- Added `CoreColumnVisibility` under the shared table core to own the Midday-style tune button, popover shell, hideable-column filtering, checkbox toggles, and column label resolution.
- Replaced Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team Members column visibility components with thin adapters that only read their table store columns and pass them into the core control.
- Preserved the existing domain component names so page headers keep their current composition boundary while shared table chrome now lives in table core.
- Validation: focused scans found popover/checkbox/toggle visibility logic only in `CoreColumnVisibility`; domain column visibility files now only import the core control plus their store hook, no non-ASCII/trailing whitespace in touched code files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Core Table Header Ownership Split

- Continued the remaining dashboard parity audit across table pages that still carried duplicated Midday header machinery per domain.
- Added `CoreDataTableHeader` under the shared table core to own sticky header layout, sortable DnD header context, resize handles, select-all header, action header text, URL sort buttons, and primary-column horizontal pagination.
- Replaced each domain table header for Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team with a thin adapter that only declares its table id and primary sticky column sort config.
- Reused column `meta.headerLabel` for non-primary sortable/static labels so table header labels stay owned by column definitions instead of local header label maps.
- Validation: focused scans found the old `SortableContext`, sort button, sticky hook, and local `getHeaderLabel` implementation no longer duplicated in domain table-header files; the shared core owns the remaining header machinery, no barrel self-import remains, no non-ASCII/trailing whitespace in touched code files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Notifications Header Actions And Tabs Split

- Continued the remaining dashboard parity audit across table headers that still owned client action/tab behavior.
- Split notification unread-count querying, mark-all-read mutation, and column-visibility action cluster into `NotificationsActions`, a focused client child.
- Split unread filter active-state derivation and tab rendering into `NotificationsFilterTabs`.
- Replaced the redundant notifications search/filter wrapper with the shared q-only `SearchField`, leaving unread status control to the tabs.
- Left `NotificationsHeader` as a Midday-style server-composition header that arranges search, actions, and tabs without owning client query, mutation, or filter-tab boundaries.
- Validation: focused scans found `NotificationsHeader` no longer owns a client directive, tRPC hooks, unread-count query, mark-all-read mutation, unread-tab active derivation, or redundant search/filter wrapper; focused child components own the expected client behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Appointments Header Status Tabs Split

- Continued the remaining dashboard parity audit across table headers that still owned client stats/tab behavior.
- Split Appointments status/upcoming tab querying, stats normalization, and active-state derivation into `AppointmentsStatusTabs`, a focused client child that consumes the prefetched appointment stats query.
- Left `AppointmentsHeader` as a Midday-style server-composition header that arranges search, column visibility, create action, and status tabs without owning the client query boundary.
- Validation: focused scans found `AppointmentsHeader` no longer owns a client directive, tRPC hook, appointment stats query, stats normalization, or active-tab derivation; `AppointmentsStatusTabs` owns the expected client stats/tab behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Leave Requests Header Status Tabs Split

- Continued the remaining dashboard parity audit across table headers that still owned client stats/tab behavior.
- Split Leave Requests status tab querying and active-state derivation into `LeaveRequestsStatusTabs`, a focused client child that consumes the prefetched leave request stats query.
- Left `LeaveRequestsHeader` as a Midday-style server-composition header that arranges search, column visibility, create action, and status tabs without owning the client query boundary.
- Validation: focused scans found `LeaveRequestsHeader` no longer owns a client directive, tRPC hook, leave request stats query, or active-status derivation; `LeaveRequestsStatusTabs` owns the expected client stats/tab behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Employees Header Status Tabs Split

- Continued the remaining dashboard parity audit across table headers that still owned client stats/tab behavior.
- Split Employees status tab querying, active-state derivation, and department-aware tab href construction into `EmployeesStatusTabs`, a focused client child that consumes the prefetched employee stats query.
- Left `EmployeesHeader` as a Midday-style server-composition header that arranges search, column visibility, invite action, and status tabs without owning the client query boundary.
- Validation: focused scans found `EmployeesHeader` no longer owns a client directive, tRPC hook, employee stats query, active-status derivation, or department-aware tab href logic; `EmployeesStatusTabs` owns the expected client stats/tab behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Leads Header Status Tabs Split

- Continued the remaining dashboard parity audit across table headers that still owned client stats/tab behavior.
- Split Leads status tab querying and active-state derivation into `LeadsStatusTabs`, a focused client child that consumes the prefetched lead stats query and renders status tabs.
- Left `LeadsHeader` as a Midday-style server-composition header that arranges search, column visibility, and status tabs without owning the client query boundary.
- Validation: focused scans found `LeadsHeader` no longer owns a client directive, tRPC hook, lead stats query, or active-status derivation; `LeadsStatusTabs` owns the expected client stats/tab behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Projects Header Status Tabs Split

- Continued the remaining dashboard parity audit across table headers that still owned client stats/tab behavior.
- Split Projects status tab querying and active-state derivation into `ProjectsStatusTabs`, a focused client child that consumes the prefetched project stats query and renders status tabs.
- Left `ProjectsHeader` as a Midday-style server-composition header that arranges search, column visibility, create action, and status tabs without owning the client query boundary.
- Validation: focused scans found `ProjectsHeader` no longer owns a client directive, tRPC hook, project stats query, or active-status derivation; `ProjectsStatusTabs` owns the expected client stats/tab behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Blog Header Status Tabs Split

- Continued the remaining dashboard parity audit across table headers that still owned client stats/tab behavior.
- Split Blog status tab querying and active-state derivation into `BlogStatusTabs`, a focused client child that consumes the prefetched blog stats query and renders status tabs.
- Left `BlogHeader` as a Midday-style server-composition header that arranges search, column visibility, create action, and status tabs without owning the client query boundary.
- Validation: focused scans found `BlogHeader` no longer owns a client directive, tRPC hook, blog stats query, or active-status derivation; `BlogStatusTabs` owns the expected client stats/tab behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Payroll Header Period Tabs Split

- Continued the remaining dashboard parity audit across table headers that still owned client query behavior.
- Split payroll period tab querying/rendering into `PayrollPeriodTabs`, a focused client child that consumes the prefetched payroll periods and renders active month/year links.
- Left `PayrollHeader` as a Midday-style server-composition header that arranges search, column visibility, create action, and period tabs without owning the client query boundary.
- Validation: focused scans found `PayrollHeader` no longer owns a client directive, tRPC hook, payroll-period query, or month-label rendering; `PayrollPeriodTabs` owns the expected client query/tab behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Team Header Invite Action Split

- Continued the remaining dashboard parity audit across table header boundaries that still owned client query behavior.
- Split Team invite cap checking into `TeamInviteAction`, a focused client child that consumes the prefetched team overview and renders `OpenInviteMemberSheet` only when inviting is allowed and the workspace is below cap.
- Left `TeamHeader` as a Midday-style server-composition header that arranges search, column visibility, and invite action children without owning the client query boundary.
- Validation: focused scans found `TeamHeader` no longer owns a client directive, tRPC hook, or invite cap logic; `TeamInviteAction` owns the expected client query/cap behavior, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Customers Header Plain Server Boundary

- Continued the remaining dashboard parity audit across migrated table header component boundaries.
- Removed the unnecessary `async` boundary from `CustomersHeader`, matching Midday's plain server-composition header pattern when a header only arranges child controls.
- Left `SearchField`, `CustomersColumnVisibility`, and `OpenCustomerSheet` as focused child controls that own their own URL/store/sheet behavior.
- Validation: focused scans found no remaining async header exports, no local data/hook usage in `customers-header.tsx`, no non-ASCII/trailing whitespace, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Departments Header Server Boundary

- Continued the remaining dashboard parity audit across migrated table headers after q-only search simplification.
- Removed the leftover client boundary from `DepartmentsHeader`, matching Midday's server-composition header pattern where the header only arranges client child controls.
- Left `SearchField`, `DepartmentsColumnVisibility`, and `OpenDepartmentSheet` as focused client components that own their own URL/store/sheet behavior.
- Validation: focused scans found no `use client` directive or local hook usage in `departments-header.tsx`; no non-ASCII/trailing whitespace in the touched header, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Q-Only Header Search Simplification

- Continued the remaining dashboard parity audit across top-level table headers and search controls.
- Replaced q-only `DashboardSearchFilter` wrapper usage in Agents, Departments, Team, and Payroll headers with the shared Midday-style `SearchField`.
- Removed the now-dead q-only search wrapper files for agents, departments, team members, and payroll; retained `DashboardSearchFilter` for domains that still expose real filter menus beyond plain search.
- Validation: focused scans found no dangling imports/usages of the removed q-only wrappers; no non-ASCII/trailing whitespace in touched header files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Table Query Input Contract Sweep

- Continued the remaining dashboard parity audit across client table query execution paths after route prefetch input ownership was normalized.
- Extended feature-owned `resolve*ListInput()` helpers to accept deferred client search overrides, then reused them from Blog, Appointments, Leads, Projects, Employees, Leave Requests, Notifications, Payroll, Agents, Departments, Team, Customers, and Properties table query paths.
- Moved Customers route prefetch onto `resolveCustomerListInput()` so its server prefetch and client table query share the same filter/sort contract.
- Left table files focused on client table state, selection, mutation invalidation, virtualization, and rendering while filter modules own query-input normalization.
- Validation: focused scans found no direct `infiniteQueryOptions({ ... })` object construction in active dashboard table/app list query paths; duplicated table-local status/filter normalization moved to filter resolvers, no non-ASCII/trailing whitespace in touched files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Properties List Input Ownership Split

- Continued the remaining dashboard parity audit across the Properties route/table query boundary.
- Moved Properties list input construction into `resolvePropertyListInput()` in `use-property-filter-params.ts`, including the client table's deferred search override path.
- Left the Properties route focused on session enforcement, loading filters/sort, prefetch composition, initial table settings, and feature module composition; left the table focused on client query execution and table state.
- Validation: focused scans found active Properties `listProperties` server/client callers using `resolvePropertyListInput()`, with filter spreading isolated inside the resolver; no non-ASCII/trailing whitespace in touched Properties route/table/filter files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Route List Input Ownership Sweep

- Continued the remaining dashboard parity audit across table/list routes that still assembled query list input inside route files.
- Moved list input construction into feature-owned filter modules for Blog, Appointments, Leave Requests, Projects, Notifications, Payroll, Team, Agents, and Departments.
- Left the affected routes focused on session enforcement, loading URL params, prefetch composition, initial table settings, and feature module composition.
- Validation: focused scans found no remaining route-level `statusParam`, `filters.status`, `filters.filter`, `filters.view`, `showUpcoming`, `onlyUnread`, or inline `listInput = { ... }` construction in `(app)` routes; no non-ASCII/trailing whitespace in touched route/filter files, and scoped `git diff --check` passed.

## 2026-07-16 — Midday Leads Filter List Input Ownership Split

- Continued the remaining dashboard parity audit across the Leads route and filter boundary.
- Moved lead status validation and list input construction into `resolveLeadListInput()` in `use-lead-filter-params.ts`.
- Left the Leads route focused on session enforcement, loading filters/sort, prefetch composition, and feature module composition.
- Validation: focused scans found no local `isLeadStatus`, `statusParam`, `filters.status`, or status-bearing list input assembly left in the Leads route; no non-ASCII/trailing whitespace in touched route/filter files, and retired action/form/query-flag patterns did not reappear.

## 2026-07-16 — Midday Employees Filter List Input Ownership Split

- Continued the remaining dashboard parity audit across the Employees route and filter boundary.
- Moved employee status validation, department filter trimming, and list input construction into `resolveEmployeesListInput()` in `use-employees-filter-params.ts`.
- Left the Employees route focused on session lookup, loading filters/sort, invite access/context handoff, prefetch composition, and feature module composition.
- Validation: focused scans found no local `isEmployeeStatus`, `statusParam`, `departmentId`, or `filters.department` normalization left in the Employees route; no non-ASCII/trailing whitespace in touched route/filter files, and retired action/form/query-flag patterns did not reappear.

## 2026-07-16 — Midday Team Invite Context Ownership Split

- Continued the remaining dashboard parity audit across Team, Agents, and Employees invite-capable routes.
- Moved invite URL base derivation and invite development-preview detection into `getWorkspaceInviteContext()` in `components/team/team-access.ts`.
- Left the Agents, Employees, and Team routes focused on session lookup, filter/sort loading, prefetch composition, and feature module composition.
- Validation: focused scans found no direct `buildDashboardUrl`, direct invite dev-preview helper calls, manual `appBaseUrl` / `isDevMode` invite prop pairs, or retired action/form/query-flag patterns left in those routes; no non-ASCII/trailing whitespace in touched route/helper files.

## 2026-07-16 — Midday Workspace Access Helper Ownership Split

- Continued the remaining dashboard parity audit across Customers and Settings route composition.
- Moved customer-record management and workspace-settings edit role policy into `components/workspace/workspace-access.ts`.
- Left the Customers and Settings routes focused on session lookup, filter/sort or settings prefetch handoff, and feature module composition.
- Validation: focused scans found no inline owner/admin/agent role comparisons left in the Customers and Settings routes; no non-ASCII/trailing whitespace in touched route/helper files, and retired action/form/query-flag patterns did not reappear.

## 2026-07-16 — Midday Team Invite Access Helper Ownership Split

- Continued the remaining dashboard parity audit across Team, Agents, and Employees route composition.
- Moved repeated workspace-member management role checks and invite development-preview detection into `components/team/team-access.ts`.
- Left the Agents, Employees, and Team routes focused on session lookup, filter/sort loading, prefetch composition, and feature module composition.
- Validation: focused scans found no repeated `owner` / `admin` / `platform_admin` route comparisons or direct invite dev-mode checks left in those routes; no non-ASCII/trailing whitespace in touched route/helper files, and retired action/form/query-flag patterns did not reappear.

## 2026-07-16 — Midday Billing Callback Tier Guard Ownership Split

- Continued the remaining dashboard parity audit across the Billing callback route.
- Moved subscription-tier metadata validation into the billing-owned `isBillingSubscriptionTier` helper in `billing-utils.ts`.
- Left the Billing callback route focused on Paystack transaction verification, payment activation, cache revalidation, and final redirect flow.
- Validation: focused scans found no local `SubscriptionTier` import, `subscriptionTiers` import, or `isSubscriptionTier` helper left in the callback route; no non-ASCII/trailing whitespace in touched callback/helper files, and retired action/form/query-flag patterns did not reappear.

## 2026-07-16 — Midday Billing State Helper Ownership Split

- Continued the remaining dashboard parity audit across the Billing route and content boundary.
- Moved billing interval URL normalization, plan-tier normalization, plan-status normalization, and shared billing plan/status types into `billing-utils.ts`.
- Left the Billing route focused on session, search-param handoff, billing prefetch, and composition, while `BillingContent` now focuses on query consumption and composing billing sections.
- Reused the shared billing plan/status types from `billing-sections.tsx` so Billing no longer defines those shapes in multiple local modules.
- Validation: focused scans found no local interval parser, router-output helper types, plan/status resolver helpers, or duplicate plan/status type definitions left in the route/content/section modules; no non-ASCII/trailing whitespace in touched Billing files, and retired action/form/query-flag patterns did not reappear.

## 2026-07-16 — Midday Dashboard Home Route Bootstrap Ownership Split

- Continued the remaining dashboard parity audit across the Dashboard Home route boundary.
- Moved dashboard-home builder configuration bootstrap, request-header/cookie caller construction, and active-draft redirect decisions into `builder-configuration.ts`.
- Left the route focused on session lookup, live-site URL derivation, dashboard overview prefetch, and `HydrateClient` / `ScrollableContent` / boundary composition.
- Fixed the bootstrap redirect decision so `redirect()` is no longer placed inside the broad mutation-failure catch that could swallow the intended redirect.
- Validation: focused scans found no raw API context, app router caller, cookie/header, draft-query, local bootstrap helper, or redirect ownership left in the route; no non-ASCII/trailing whitespace in touched route/bootstrap files, and scoped diff validation passed.

## 2026-07-16 — Midday Dashboard Home Skeleton Ownership Split

- Continued the remaining dashboard parity audit across Dashboard Home loading states.
- Moved home header, stat-card, and section-panel skeleton chrome into focused dashboard home skeleton modules.
- Left `DashboardHomeSkeleton` focused on fallback composition and the small list inventories that determine repeated skeleton counts.
- Validation: focused scans found no inline `Skeleton` primitive/card/section chrome ownership left in `DashboardHomeSkeleton`, no non-ASCII/trailing whitespace in touched skeleton files, and retired action/form/query-flag patterns did not reappear.

## 2026-07-16 — Midday Dashboard Home Section Ownership Split

- Continued the remaining dashboard parity audit across Dashboard Home.
- Moved publishing control, quick actions, connected-domain rendering, stat-card rendering, and home overview types into focused dashboard home modules.
- Left `DashboardHome` focused on dashboard overview query, stat data mapping, and composing header/summary/section modules.
- Validation: focused scans found no stale local Card/Button/Badge/home section helper/type ownership in `DashboardHome`, no non-ASCII/trailing whitespace in touched home files, and retired action/form/query-flag patterns did not reappear.

## 2026-07-16 — Midday Builder Workspace State Ownership Split

- Continued the remaining dashboard parity audit across the builder workspace shell.
- Moved changed-field counting and template access/lock/read-only state derivation into `builder-workspace-state.ts`.
- Left `BuilderWorkspace` focused on async workspace data loading, unavailable-state branching, preview data resolution, and composing layout/sidebar/toolbar/preview modules.
- Validation: focused scans found no stale direct `describeTemplateAccess`, `templateCatalog`, tier-label, live/draft content diff, or template-lock formula ownership in `BuilderWorkspace`; no non-ASCII or trailing whitespace in touched workspace state files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Theme Action Hook Split

- Continued the remaining dashboard parity audit across builder sidebar control composition.
- Moved theme update mutation, router refresh, URL error routing, `FormData` parsing, and silent-save fallback into `use-builder-sidebar-theme-actions.ts`.
- Left `BuilderSidebarControls` focused on deriving the active template image slots and composing picker, read-only, image, section visibility, and SEO control modules.
- Validation: focused scans found no stale local router/search-param/tRPC mutation, `useCallback`, URLSearchParams, mutation, or save-helper ownership in `BuilderSidebarControls`; no non-ASCII or trailing whitespace in touched sidebar control files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Section Field Hook Split

- Continued the remaining dashboard parity audit across builder sidebar image, section visibility, and SEO controls.
- Moved named-image values, section visibility state, SEO values, debounce timers, transition handling, and theme `FormData` construction into `use-builder-sidebar-section-fields.ts`.
- Moved builder section label metadata into `builder-section-labels.ts` and reused it from preview section field lookup.
- Left `builder-sidebar-sections.tsx` focused on image input, section toggle, and SEO field presentation inside the shared sidebar section chrome.
- Validation: focused scans found no stale local `useState`, `useTransition`, `useRef`, `FormData`, debounce, or section-label ownership in `builder-sidebar-sections.tsx`; no non-ASCII or trailing whitespace in touched sidebar section files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Template/Page Selection Hook Split

- Continued the remaining dashboard parity audit across builder sidebar template and page pickers.
- Moved template catalog query, template draft creation, URL param updates, error routing, page inventory lookup, and page navigation into `use-builder-template-page-selection.ts`.
- Left `TemplatePicker` and `PagePicker` focused on picker trigger, tab/menu layout, option rendering, access badges, and selected-value display.
- Validation: focused scans found no stale local router/search-param/TRPC mutation, page inventory, draft creation, transition-state, or URLSearchParams ownership in `builder-sidebar-template-page-pickers.tsx`; no non-ASCII or trailing whitespace in touched template/page picker files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Preview Register Shell Ownership Split

- Continued the remaining dashboard parity audit across the builder preview register shell.
- Moved register shell radius/header/nav/CTA class resolution into `builder-preview-register-shell-styles.ts`.
- Moved preview register header navigation, CTA, and mobile menu chrome into `builder-preview-register-header.tsx`.
- Moved preview register footer groups, links, tagline, and copyright chrome into `builder-preview-register-footer.tsx`.
- Left `PreviewRegisterShell` focused on fetching register nav/footer config, deriving the render year, and composing header/content/footer around the existing link interception contract.
- Validation: focused scans found no stale local class resolver, header, footer, mobile menu, icon, or `cn` ownership in `builder-preview-register-shell.tsx`; no non-ASCII or trailing whitespace in touched register-shell files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Theme Selection Hook Split

- Continued the remaining dashboard parity audit across builder sidebar theme controls.
- Moved optimistic theme selection state, transition handling, silent-save fallback, and theme `FormData` construction into `use-builder-theme-selection.ts`.
- Left style preset, color system, and font picker components focused on dropdown trigger/menu presentation and option rendering.
- Validation: focused scans found no stale local `useState`, `useTransition`, `FormData`, or save-helper ownership in `builder-sidebar-theme-pickers.tsx`; no non-ASCII or trailing whitespace in touched theme-picker files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Preview Section Editor Field Ownership Split

- Continued the remaining dashboard parity audit across the builder preview section surface.
- Moved inline field editor form state, save/smart-fill `FormData` construction, and field input chrome into `builder-preview-field-editor.tsx`.
- Moved preview section labels and editable-field prefix mapping into `builder-preview-section-fields.ts`.
- Left `PreviewSection` focused on section focus/keyboard behavior, hover/edit-state chrome, section component rendering, and composing focused field editors.
- Validation: focused scans found no stale local field-editor function, section-label helper, section-field helper, non-ASCII status labels, or direct input/button ownership in `PreviewSection`; no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Workspace Preview Data Ownership Split

- Continued the remaining dashboard parity audit across the builder workspace shell.
- Moved page inventory resolution, selected-page fallback, current/live site URL derivation, website presentation resolution, template config deserialization, and section-type extraction into `builder-workspace-preview-data.ts`.
- Left `BuilderWorkspace` focused on async workspace data loading, unavailable-state branching, changed-field counting, template access derivation, and composing focused sidebar/toolbar/preview modules.
- Validation: focused scans found no stale direct `deserializeTemplateConfig`, `getTemplatePageInventoryStrict`, `resolveWebsitePresentation`, `buildTenantSiteUrl`, page-inventory, or live-data mapping ownership in `BuilderWorkspace`; no non-ASCII or trailing whitespace in touched workspace files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Preview Runtime Branch Ownership Split

- Continued the remaining dashboard parity audit across the builder preview runtime surface.
- Moved Registry-backed template-page runtime composition into `builder-preview-template-runtime.tsx`.
- Moved WebsiteRuntime-backed section-list runtime composition into `builder-preview-website-runtime.tsx`.
- Left `BuilderPreviewRuntimeBody` focused on preview scroll container layout, frame class/style derivation, and choosing the template-page vs website section runtime branch.
- Validation: focused scans found no stale direct runtime provider, guarded-frame, section-list, raw section mapping, non-ASCII, or trailing-whitespace ownership in `BuilderPreviewRuntimeBody`; no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Preview Section List Ownership Split

- Continued the remaining dashboard parity audit across the builder preview runtime surface.
- Moved section-list mapping and `PreviewSection` prop wiring into `builder-preview-section-list.tsx`.
- Left `BuilderPreviewRuntimeBody` focused on scroll container layout, Registry/Website runtime provider selection, template-page vs section-list branching, and guarded frame composition.
- Validation: focused scans found no stale direct `PreviewSection` rendering or `filteredSections.map` ownership in `BuilderPreviewRuntimeBody`, no non-ASCII in touched preview section-list files, no trailing whitespace in touched preview/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Preview Guarded Frame Ownership Split

- Continued the remaining dashboard parity audit across the builder preview runtime surface.
- Moved repeated `ClickGuardProvider`, `SmartFillProvider`, `InlineOverview`, and preview frame wrapper composition into `builder-preview-guarded-frame.tsx`.
- Left `BuilderPreviewRuntimeBody` focused on scroll container layout, Registry/Website runtime provider selection, template-page vs section-list branching, and section rendering data wiring.
- Validation: focused scans found no stale direct ClickGuard/SmartFill/InlineOverview wrapper ownership in `BuilderPreviewRuntimeBody`, no non-ASCII in touched preview guarded-frame files, no trailing whitespace in touched preview/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Preview Shell Ownership Split

- Continued the remaining dashboard parity audit across the builder preview surface.
- Moved canvas/framed container classes and frame-header/read-only/body ordering into `builder-preview-shell.tsx`.
- Left `BuilderPreviewPanel` focused on action/routing/presentation hook composition, section focus state, preview chrome data inputs, and runtime body wiring.
- Validation: focused scans found no stale direct canvas/framed wrapper class ownership in `BuilderPreviewPanel`, no non-ASCII in touched preview shell files, no trailing whitespace in touched preview/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Preview Presentation Hook Ownership Split

- Continued the remaining dashboard parity audit across the builder preview surface.
- Moved register-template lookup, template-page handle resolution, family override resolution, visible-section filtering, content mapping, and register shell wrapping into `use-builder-preview-presentation.tsx`.
- Left `BuilderPreviewPanel` focused on action/routing hook composition, section focus state, preview chrome branching, and runtime body wiring.
- Validation: focused scans found no stale direct register-template/page-handle/content-mapping ownership in `BuilderPreviewPanel`, no non-ASCII in touched preview presentation files, no trailing whitespace in touched preview/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Preview Action Hook Ownership Split

- Continued the remaining dashboard parity audit across the builder preview surface.
- Moved preview field update mutation, smart-fill mutation, URL error handling, and inline editable-text action adapters into `use-builder-preview-actions.tsx`.
- Left `BuilderPreviewPanel` focused on preview routing, section focus state, register-template/page resolution, content/section derivation, shell chrome composition, and runtime body wiring.
- Validation: focused scans found no stale direct mutation/router/search-param/tRPC action ownership in `BuilderPreviewPanel`, no non-ASCII in touched preview action files, no trailing whitespace in touched preview/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Workspace Notice Alert Ownership Split

- Continued the remaining dashboard parity audit across builder workspace notice surfaces.
- Moved error, locked-template, and status alert chrome, including the billing upgrade action, into `builder-workspace-notice-alerts.tsx`.
- Left `BuilderWorkspaceNotices` focused on notice state composition and status-message derivation.
- Validation: focused scans found no stale direct Alert/Button/Link chrome ownership in `BuilderWorkspaceNotices`, no non-ASCII in touched notice files, no trailing whitespace in touched notice/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Workspace Layout Ownership Split

- Continued the remaining dashboard parity audit across the builder workspace shell.
- Moved the root embedded/page spacing, responsive sidebar/content grid, and preview-column wrapper into `builder-workspace-layout.tsx`.
- Left `BuilderWorkspace` focused on server data loading, unavailable-state branching, template/page/live URL derivation, lock/read-only derivation, presentation resolution, and passing data into focused notices/sidebar/toolbar/preview modules.
- Validation: focused scans found no stale root/grid/preview-column class ownership or local `cn` usage in `BuilderWorkspace`, no non-ASCII in touched workspace files, no trailing whitespace in touched workspace/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Workspace Toolbar Context Ownership Split

- Continued the remaining dashboard parity audit across builder workspace toolbar composition.
- Moved mobile drawer placement, selected-page label, and embedded builder context label into `builder-workspace-toolbar-context.tsx`.
- Left `BuilderWorkspaceToolbar` focused on the outer toolbar shell and composing the focused context/actions modules.
- Validation: focused scans found no stale direct drawer/context-label ownership in `BuilderWorkspaceToolbar`, no non-ASCII in touched toolbar files, no trailing whitespace in touched toolbar/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Workspace Toolbar Actions Ownership Split

- Continued the remaining dashboard parity audit across builder workspace toolbar composition.
- Moved theme toggle, publish dialog, onboarding badge, embedded/full-builder navigation, and live-site link action chrome into `builder-workspace-toolbar-actions.tsx`.
- Left `BuilderWorkspaceToolbar` focused on outer toolbar layout, mobile drawer placement, current page/embedded context labels, and passing action state into the focused action module.
- Validation: focused scans found no stale direct Badge/Button/ThemeToggle/Publish/Link action ownership in `BuilderWorkspaceToolbar`, no non-ASCII in touched toolbar files, no trailing whitespace in touched toolbar/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Drawer Content Ownership Split

- Continued the remaining dashboard parity audit across the mobile builder sidebar sheet.
- Moved drawer body composition, summary/control grouping, separator chrome, and editable-fields note placement into `builder-sidebar-drawer-content.tsx`.
- Left `BuilderSidebarDrawer` focused on URL-backed open state, trigger/header/content composition, `SheetContent` shell configuration, and close behavior.
- Validation: focused scans found no stale drawer body primitive imports or summary/control/editable-fields composition ownership in `BuilderSidebarDrawer`, no non-ASCII in touched drawer files, no trailing whitespace in touched drawer/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Drawer Trigger Ownership Split

- Continued the remaining dashboard parity audit across the mobile builder sidebar sheet.
- Moved the mobile builder settings trigger button and settings icon chrome into `builder-sidebar-drawer-trigger.tsx`.
- Left `BuilderSidebarDrawer` focused on URL-backed open state, sheet composition, summary/control/editable-fields wiring, and close behavior.
- Validation: focused scans found no stale direct `Button`/settings-icon ownership in `BuilderSidebarDrawer`, no non-ASCII in touched drawer files, no trailing whitespace in touched drawer/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Workspace Sidebar Section Chrome Reuse

- Continued the remaining dashboard parity audit across builder workspace sidebar composition.
- Reused `BuilderSidebarSectionGroup` for the desktop sidebar's AI content and onboarding tool groups instead of keeping local repeated title/section chrome in `BuilderWorkspaceSidebar`.
- Left `BuilderWorkspaceSidebar` focused on desktop shell composition, sticky/embedded layout class resolution, active configuration summary/control wiring, separators, and tool module placement.
- Validation: focused scans found no stale local AI/onboarding section-title wrappers in `BuilderWorkspaceSidebar`, no non-ASCII in the touched sidebar file, no trailing whitespace in touched sidebar/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Control Stack Ownership Split

- Continued the remaining dashboard parity audit across builder sidebar control composition.
- Moved sidebar `FieldGroup` stack and `Field` item wrapper ownership into `builder-sidebar-control-stack.tsx`.
- Updated `BuilderSidebarControls` to compose `BuilderSidebarControlStack` / `BuilderSidebarControlItem`, leaving the parent focused on theme mutation ownership, URL error handling, template lookup, read-only branching, and wiring focused picker/section modules.
- Validation: focused scans found no stale direct `FieldGroup`/`Field` imports or JSX ownership in `BuilderSidebarControls`, no non-ASCII in touched control-stack files, no trailing whitespace in touched control/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Section Group Ownership Split

- Continued the remaining dashboard parity audit across builder sidebar configuration sections.
- Moved repeated sidebar section title chrome and field-label wrapper chrome into `builder-sidebar-section-group.tsx`.
- Updated image-slot, section-visibility, and SEO controls to use `BuilderSidebarSectionGroup` / `BuilderSidebarField`, leaving `builder-sidebar-sections.tsx` focused on local optimistic values, debounced saves, visibility toggles, and theme-key payload construction.
- Replaced touched image/SEO placeholder ellipses with ASCII `...` copy.
- Validation: focused scans found no stale `FieldLabel` ownership, repeated section-title wrappers, non-ASCII placeholders, or trailing whitespace in touched sidebar section files; no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Picker Button Ownership Split

- Continued the remaining dashboard parity audit across builder sidebar picker surfaces.
- Moved the shared picker trigger button, chevron icon chrome, and `cn`-backed class composition out of the theme-picker module into `builder-sidebar-picker-button.tsx`.
- Updated style preset, color system, font, template, and page pickers to consume `BuilderSidebarPickerButton`, leaving theme pickers focused on theme selection and template/page pickers focused on template draft/page routing behavior.
- Replaced the style-preset menu's non-ASCII density/radius separator with ASCII copy while the theme picker surface was already being touched.
- Validation: focused scans found no stale `PickerButton` export/import, no duplicated local sidebar chevron helper in the theme/template picker modules, no non-ASCII in touched picker files, no trailing whitespace in touched picker/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder Sidebar Template Trigger Consolidation

- Continued the remaining dashboard parity audit across builder sidebar picker surfaces.
- Reused the shared builder sidebar picker trigger for template selection and removed the duplicated local chevron helper/import from `builder-sidebar-template-page-pickers.tsx`.
- Kept template-picker behavior, tier badge display, catalog grouping, draft creation, URL replacement, and page picker behavior unchanged while centralizing trigger chrome with the existing theme/page picker primitive.
- Validation: focused scans found no stale local `ChevronIcon` usage/imports in the template/page picker, no non-ASCII in the touched picker file, no trailing whitespace in touched picker/Brain files, and no retired action/form/query-flag patterns reappeared.

## 2026-07-16 — Midday Builder AI Tool Control Ownership Split

- Continued the remaining dashboard parity audit across builder AI/sidebar tools.
- Moved shared AI action button, pending icon, error text, description text, and result-message chrome into `builder-ai-tool-control.tsx`.
- Reworked `onboarding-tools.tsx` so AI bootstrap/page-content components own mutation state, router refresh, page-label derivation, and result-message derivation while delegating display chrome to the shared builder AI tool control.
- Replaced emoji/Unicode button and result status text with icon-backed ASCII labels.
- Validation: focused scans found no stale `Button`/status text ownership, emoji, non-ASCII, or explanatory section comments in `onboarding-tools.tsx`, no retired action/form/query-flag patterns reappeared, no trailing whitespace in touched builder/Brain files, and scoped `git diff --check` validation passed for tracked touched files.

## 2026-07-16 — Midday Builder Sidebar Read-Only Notice Ownership Split

- Continued the remaining dashboard parity audit across builder sidebar control surfaces.
- Moved read-only upgrade alert chrome and plan-label fallback copy out of `BuilderSidebarControls` into `builder-sidebar-read-only-notice.tsx`.
- Left `BuilderSidebarControls` focused on control composition, template lookup, workspace theme mutation ownership, URL error handling, named image-slot derivation, and passing save callbacks into focused sidebar modules.
- Validation: focused scans found no stale alert/tier-label/read-only notice chrome ownership in `BuilderSidebarControls`, no retired action/form/query-flag patterns reappeared, no trailing whitespace in touched builder/Brain files, and scoped `git diff --check` validation passed for tracked touched files.

## 2026-07-16 — Midday Builder Floating Config Panel Dead Path Cleanup

- Continued the remaining dashboard parity audit across builder chrome surfaces.
- Removed the unreferenced `floating-config-panel.tsx` module after scans found no active imports or usages outside historical Brain notes.
- Retired the old floating rail / FAB configuration chrome instead of splitting a dead surface, keeping active builder configuration ownership centered on `BuilderWorkspaceSidebar`, `BuilderSidebarDrawer`, and the focused builder template preview modules.
- Validation: focused scans found no active `FloatingConfigPanel` / `floating-config-panel` code references, no retired action/form/query-flag patterns reappeared, no trailing whitespace in touched builder/Brain files, and scoped `git diff --check` validation passed for tracked touched files.

## 2026-07-16 — Midday Builder Template Preview Header And Status Ownership Split

- Continued the remaining dashboard parity audit across the builder template preview surface.
- Moved the mobile template picker/header action bar, back-to-builder control, theme toggle, previous/next template buttons, and current page label into `builder-template-preview-header.tsx`.
- Moved the template tier/name published-toggle row into `builder-template-publish-status.tsx`.
- Left `BuilderTemplatePreview` focused on local preview state, template/page selection, publish-toggle demo state, preview presentation resolution, and high-level sidebar/header/status/frame composition.
- Validation: focused scans found no stale header button, theme toggle, mobile picker, or published-row chrome ownership in `BuilderTemplatePreview` beyond legitimate state/callback inputs, no non-ASCII or trailing whitespace in touched template preview files, no retired action/form/query-flag patterns reappeared, and scoped `git diff --check` validation passed for tracked touched files.

## 2026-07-16 — Midday Builder Template Preview Sidebar Ownership Split

- Continued the remaining dashboard parity audit across the builder template preview surface.
- Moved the desktop template preview sidebar shell, style preset grid, color-system swatches, and preview info rows into `builder-template-preview-sidebar.tsx`.
- Left `BuilderTemplatePreview` focused on local preview state, template/page selection, publish-toggle demo state, preview presentation resolution, mobile picker/header actions, and high-level sidebar/frame composition.
- Validation: focused scans found no stale sidebar shell, style preset, color-system, separator, or preview-info ownership in `BuilderTemplatePreview` beyond legitimate data inputs, no non-ASCII or trailing whitespace in touched template preview files, no retired action/form/query-flag patterns reappeared, and scoped `git diff --check` validation passed for tracked touched files.

## 2026-07-16 — Midday Builder Template Preview Picker And Frame Ownership Split

- Continued the remaining dashboard parity audit across the builder template preview surface.
- Moved duplicated desktop/mobile template picker dropdown trigger, tier tabs, catalog grouping, and selected-template menu chrome into `builder-template-picker.tsx`.
- Moved browser-bar preview chrome, preview section count, frame styling, and section-component rendering into `builder-template-preview-frame.tsx`.
- Left `BuilderTemplatePreview` focused on local preview state, template/page selection, publish-toggle demo state, preview presentation resolution, and high-level sidebar/header/frame composition.
- Validation: focused scans found no stale dropdown/tabs/catalog-list/frame-rendering ownership in `BuilderTemplatePreview`, no non-ASCII or trailing whitespace in touched template preview files, no retired action/form/query-flag patterns reappeared, and scoped `git diff --check` validation passed for tracked touched files.

## 2026-07-16 — Midday Builder Workspace Notice And Empty-State Ownership Split

- Continued the remaining dashboard parity audit across the builder workspace shell.
- Moved builder error/success/onboarding notices and locked-template upgrade alert chrome into `builder-workspace-notices.tsx`.
- Moved repeated builder unavailable/empty-state card rendering into `builder-workspace-unavailable.tsx`.
- Left `BuilderWorkspace` focused on data/status branching, template/page/live URL derivation, lock-message derivation, preview presentation resolution, and composing focused builder modules.
- Validation: focused scans found no stale alert/card/empty primitive imports or retired notice copy ownership in `BuilderWorkspace`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder workspace files.

## 2026-07-16 — Midday Builder Workspace Sidebar And Toolbar Ownership Split

- Continued the remaining dashboard parity audit across the builder workspace shell.
- Moved desktop website-configuration sidebar composition, editable-field guidance, AI/onboarding tool grouping, mobile drawer toolbar trigger composition, publish/theme/live-site actions, and onboarding badge chrome into `builder-workspace-sidebar.tsx` and `builder-workspace-toolbar.tsx`.
- Extended the existing builder sidebar summary and editable-fields note modules with small presentation variants so desktop and drawer surfaces share ownership instead of duplicating configuration/status/count chrome in `BuilderWorkspace`.
- Left `BuilderWorkspace` focused on server data loading, template/page resolution, live-site URL derivation, lock/notice state derivation, preview presentation resolution, and composing focused builder modules.
- Validation: focused scans found no stale sidebar/control/modal/tool ownership in `BuilderWorkspace`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder workspace files.

## 2026-07-16 — Midday Builder Preview Runtime Body Ownership Split

- Continued the remaining dashboard parity audit across the builder preview surface.
- Moved preview scroll/body layout, Registry/Website runtime provider branching, ClickGuard/SmartFill/InlineOverview composition, template-page rendering container, and section-list rendering into `builder-preview-runtime-body.tsx`.
- Left `BuilderPreviewPanel` focused on mutation error handling, preview routing hook composition, template/page handle derivation, section/content derivation, shell chrome composition, and focused-section state.
- Validation: focused scans found no stale local runtime provider imports, preview body class/style ownership, scroll container ownership, or raw `PreviewSection` rendering in `BuilderPreviewPanel`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder preview runtime files.

## 2026-07-16 — Midday Builder Preview Routing Ownership Split

- Continued the remaining dashboard parity audit across the builder preview surface.
- Moved internal href normalization, preview page resolution, page-query href building, preview page navigation, register link click interception, and the registry link bridge component into `use-builder-preview-routing.tsx`.
- Left `BuilderPreviewPanel` focused on mutation error handling, registry/runtime providers, preview shell/body composition, and focused-section state while consuming routing callbacks from the hook.
- Validation: focused scans found no stale local preview routing helpers, registry link bridge, raw `window.location.search`, or registry-local URL normalization in `BuilderPreviewPanel`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder preview routing files.

## 2026-07-16 — Midday Builder Preview Frame Chrome Ownership Split

- Continued the remaining dashboard parity audit across the builder preview surface.
- Moved framed-preview browser dots, page navigation tabs, preview URL/status text, and read-only upgrade banner chrome into `builder-preview-frame-chrome.tsx`.
- Left `BuilderPreviewPanel` focused on preview routing/link behavior, registry/runtime providers, field and smart-fill mutation ownership, preview body composition, and focused-section state.
- Validation: focused scans found no stale raw preview frame URL/status text, browser dot chrome, page-tab class ownership, upgrade banner imports, or read-only notice chrome in `BuilderPreviewPanel`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder preview frame files.

## 2026-07-16 — Midday Builder Preview Register Shell Ownership Split

- Continued the remaining dashboard parity audit across the builder preview surface.
- Moved register preview header/nav/footer rendering, menu radius/header/nav/CTA class resolution, register nav/footer config lookup, and mobile menu icon chrome into `builder-preview-register-shell.tsx`.
- Left `BuilderPreviewPanel` focused on preview routing/link resolution, registry/runtime providers, field and smart-fill mutation ownership, URL error handling, preview body composition, and focused-section state.
- Validation: focused scans found no stale local register shell, nav/footer config lookup, menu icon import, template-tier shell type, or preview nav class resolver ownership in `BuilderPreviewPanel`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder preview shell files.

## 2026-07-16 — Midday Builder Preview Section Editor Ownership Split

- Continued the remaining dashboard parity audit across the builder preview surface.
- Moved section label mapping, editable-field filtering, inline field editor UI/state, section hover/focus chrome, and section component fallback rendering into `builder-preview-section.tsx`.
- Left `BuilderPreviewPanel` focused on preview routing, registry/runtime providers, field and smart-fill mutation ownership, URL error handling, preview shell composition, and focused-section state.
- Validation: focused scans found no stale local section label, field filtering, field editor, low-level field input, or preview section component ownership in `BuilderPreviewPanel`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder preview files.

## 2026-07-15 — Midday Builder Sidebar Template/Page Picker Ownership Split

- Continued the remaining dashboard parity audit across builder sidebar control surfaces.
- Moved template selection, template draft creation/navigation, template usage/tier display, page selection, page inventory lookup, and picker dropdown chrome into `builder-sidebar-template-page-pickers.tsx`.
- Left `BuilderSidebarControls` focused on control stack composition, read-only messaging, workspace theme mutation ownership, URL error handling, named image-slot derivation, and save callback wiring.
- Validation: focused scans found no stale local template/page picker definitions, catalog routing helpers, template picker chrome imports, or picker trigger helpers in `BuilderSidebarControls`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder sidebar picker files.

## 2026-07-15 — Midday Builder Sidebar Theme Picker Ownership Split

- Continued the remaining dashboard parity audit across builder sidebar control surfaces.
- Moved style preset, color system, font picker dropdown chrome, shared picker trigger, theme option constants, and optimistic theme-selection save helper into `builder-sidebar-theme-pickers.tsx`.
- Left `BuilderSidebarControls` focused on template/page picker routing, read-only messaging, workspace theme mutation ownership, URL error handling, and composing theme picker modules with save callbacks.
- Validation: focused scans found no stale local theme picker constants, shared picker trigger, dropdown label/separator imports, or theme picker component definitions in `BuilderSidebarControls`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder sidebar theme picker files.

## 2026-07-15 — Midday Builder Sidebar Control Section Ownership Split

- Continued the remaining dashboard parity audit across builder sidebar control surfaces.
- Moved image-slot inputs, section visibility toggles, SEO fields, section label mapping, and their local optimistic/debounced save state into `builder-sidebar-sections.tsx`.
- Left `BuilderSidebarControls` focused on template/page/style/font picker composition, read-only messaging, workspace theme mutation ownership, URL error handling, and passing save callbacks into section modules.
- Validation: focused scans found no stale local image-slot, section-visibility, SEO section definitions, low-level field inputs, or section label mapping in `BuilderSidebarControls`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder sidebar control files.

## 2026-07-15 — Midday Builder Sidebar Drawer Display Ownership Split

- Continued the remaining dashboard parity audit across the builder mobile/sidebar sheet surface.
- Split `BuilderSidebarDrawer` so the sheet title header, active-configuration summary, and editable-fields guidance now live in builder-owned display modules.
- Left `BuilderSidebarDrawer` focused on URL-backed drawer open state, mobile settings trigger behavior, sheet composition, and passing builder context into `BuilderSidebarControls`.
- Validation: focused scans found no stale sheet header, active-configuration summary, or editable-fields guidance ownership in `BuilderSidebarDrawer`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched builder drawer files.

## 2026-07-15 — Midday Publish Modal Action Footer Ownership Split

- Continued the remaining dashboard parity audit across active builder modal surfaces.
- Moved publish quick-fill, cancel, pending-submit, and footer layout chrome into `PublishConfirmationActions`.
- Left `PublishConfirmationDialog` focused on open state, publish mutation, URL notice updates, form validation/submission, disabled trigger branching, and ready-state composition.
- Validation: focused scans found no stale footer/action ownership in `PublishConfirmationDialog`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched publish modal action files.

## 2026-07-15 — Midday Recommend Template Modal Chrome Ownership Split

- Continued the remaining dashboard parity audit across active builder modal surfaces.
- Split `RecommendTemplatePanel` so dialog header copy, onboarding-input select fields, updated-profile summary, mutation error text, and footer action chrome now live in recommendation modal modules.
- Left `RecommendTemplatePanel` focused on open state, local recommendation inputs, `workspace.updateOnboardingInputs` mutation, builder refresh/close behavior, disabled trigger state, and submit composition.
- Validation: focused scans found no stale dialog header, select field, profile summary, mutation error, or footer action ownership in `RecommendTemplatePanel`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched recommendation modal files.

## 2026-07-15 — Midday Publish Modal Chrome Ownership Split

- Continued the remaining dashboard parity audit across active builder modal surfaces.
- Split `PublishConfirmationDialog` so disabled upgrade chrome, dialog header copy, publish summary formatting, and current-live note rendering now live in publish-confirmation modal modules.
- Left `PublishConfirmationDialog` focused on open state, publish mutation, builder URL notice updates, form validation/submission, quick-fill wiring, and submit/cancel actions.
- Validation: focused scans found no stale disabled upgrade, dialog header, summary formatter, or current-live note ownership in `PublishConfirmationDialog`, and scoped whitespace / `git diff --check` validation passed for the touched publish modal files.

## 2026-07-15 — Midday Dashboard User Menu Topbar Ownership Split

- Continued the remaining dashboard parity audit across active topbar account chrome.
- Split `DashboardUserMenu` into a behavior/composition owner plus `DashboardUserMenuTrigger` and `DashboardUserMenuContent` display modules.
- Preserved initials generation, avatar trigger behavior, account/work-role label display, settings navigation, pending sign-out label, session clearing, sign-in redirect, and router refresh behavior.
- Validation: focused scans found no stale avatar/button/link/icon/dropdown-content ownership in `DashboardUserMenu`, and scoped whitespace / `git diff --check` validation passed for the touched user menu files.

## 2026-07-15 — Midday Notification Bell Topbar Ownership Split

- Continued the remaining dashboard parity audit across active topbar notification chrome.
- Split `NotificationBell` into a composition-only popover owner plus `NotificationBellTrigger`, `NotificationBellContent`, `NotificationBellItem`, and shared `NotificationItem` type modules.
- Preserved unread-count badge behavior, recent notification rendering, empty state, relative time labels, notification links, and the view-all notifications link while moving display concerns into nav-owned modules.
- Validation: focused scans found no stale trigger/content/item/time-format ownership in `NotificationBell`, confirmed the notification item type is defined once for nav chrome props, and scoped whitespace / `git diff --check` validation passed for the touched notification topbar files.

## 2026-07-15 — Midday Dashboard Nav Dead Path Cleanup

- Continued the remaining dashboard parity audit across sidebar/header navigation ownership.
- Removed unused `AppRail` and `CurrentAppIndicator` nav modules and the unused `DashboardSidebarSkeleton` export so active chrome ownership stays centered on `DashboardChrome`, `DashboardSidebar`, and `DashboardTopbar`.
- Trimmed dead navigation helper exports from `features/navigation/lib.ts`, leaving only the visible dashboard nav builder used by `DashboardChrome`.
- Validation: focused scans found no remaining active references to the removed nav modules, sidebar skeleton, or dead navigation helper exports, and scoped `git diff --check` validation passed for the touched nav files.

## 2026-07-15 — Midday Customer Details Sheet Display Ownership Split

- Continued the remaining dashboard parity audit across customer sheet/detail surfaces.
- Moved Customer details title/status chrome into `CustomerDetailsHeader`, not-found chrome into `CustomerDetailsUnavailable`, and profile field rows/date formatting into `CustomerDetailsRows`.
- Left `CustomerDetails` focused on URL-backed sheet state, customer query placeholder data, loading/not-found branching, and ready-state composition.
- Validation: focused scans found no stale local `Badge`, `SheetHeader`, `SheetTitle`, `SheetDescription`, date formatting, or detail-row ownership in `CustomerDetails`, and scoped whitespace / `git diff --check` validation passed for the touched Customer details files.

## 2026-07-15 — Midday Customer Edit Sheet Header Ownership Split

- Continued the remaining dashboard parity audit across active sheet/modal surfaces.
- Moved Customer edit sheet title, action menu, and delete confirmation dialog into `CustomerEditSheetHeader`, leaving `CustomerEditSheet` focused on URL sheet state, customer query placeholder data, delete mutation/invalidation, and form composition.
- Preserved existing delete confirmation copy, destructive action behavior, customer list/detail/stat/filter invalidation, sheet close on delete success, loading skeleton, and edit form behavior.
- Validation: focused scans found no stale local `SheetHeader`, dropdown, icon, or alert-dialog primitive ownership in `CustomerEditSheet`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched Customer edit sheet files.

## 2026-07-15 — Midday Header Link Tab Chrome Consolidation

- Continued the remaining dashboard parity audit across top-level list and billing headers.
- Added `HeaderLinkTab` as the dashboard-owned rectangular header tab primitive and replaced duplicate local `HeaderTab`, `StatusTab`, and `IntervalTab` helpers in Blog, Leads, Appointments, Notifications, Leave Requests, Employees, Projects, and Billing.
- Preserved existing status/filter URLs, employee department filter carry-forward, appointment upcoming/status links, and Billing monthly/annual interval links while centralizing repeated tab chrome.
- Validation: focused scans found no remaining local top-level header tab helper functions/usages in active header files, no stale local tab imports remained in the touched headers, and scoped whitespace / `git diff --check` validation passed for the touched files.

## 2026-07-15 — Midday Live Preview Header And Frame Ownership Split

- Continued the remaining dashboard parity audit across the Live Preview special surface.
- Moved published-site title/status/action chrome into `LivePreviewHeader`, the rendered website frame and section renderer into `LivePreviewFrame`, and unavailable-state chrome into `LivePreviewUnavailable`.
- Left `LivePreview` focused on preview status switching, presentation resolution, and passing ready-state data into feature-owned Live modules.
- Validation: focused scans found no stale local Live Preview header/frame/unavailable helpers or chrome-only imports in `LivePreview`, and scoped whitespace / `git diff --check` validation passed for the touched Live Preview files.

## 2026-07-15 — Midday Blog Detail Header And Section Ownership Split

- Continued the remaining dashboard parity audit across the Blog detail editing surface.
- Moved blog detail title/status/actions into `BlogDetailHeader`, mutation error chrome into `BlogDetailNotice`, and the edit-article wrapper into `BlogDetailSection`, leaving `BlogDetailContent` focused on query orchestration, mutations, invalidation, not-found handling, and form composition.
- Preserved existing publish/draft/archive/delete mutation behavior, list/stat invalidation, delete navigation, blog detail notices, and article form rendering while moving page chrome into blog-owned modules.
- Validation: focused scans found no stale local Blog detail header/notice/section functions or chrome-only imports in `BlogDetailContent`, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched Blog detail files.

## 2026-07-15 — Midday Dashboard Home Header And Section Ownership Split

- Continued the remaining dashboard parity audit across the Dashboard Home surface.
- Moved the workspace overview header into `DashboardHomeHeader` and the repeated home section chrome into `DashboardHomeSection`, leaving the main home data module focused on query orchestration, stats, publishing control, quick actions, and connected-domain composition.
- Preserved existing live preview/builder links, publishing actions, domain cards, quick actions, and stat-card behavior while moving page chrome into dashboard-home-owned modules.
- Validation: focused scans found no stale local Dashboard Home header/section functions, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched Dashboard Home files.

## 2026-07-15 — Midday Billing Section Ownership Split

- Continued the remaining dashboard parity audit across Billing plan, checkout, repair-payment, and history sections.
- Added a shared `BillingSection` primitive so Current Plan, Available Plans, Repair Payment, and Billing History no longer keep section chrome inside the billing action/table module.
- Preserved existing checkout mutation behavior, repair-payment callback navigation, plan comparison cards, and billing-history table behavior while moving section ownership into a billing-owned module.
- Validation: focused scans found no stale local Billing section function or ReactNode import, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched Billing files.

## 2026-07-15 — Midday Analytics Section Ownership Split

- Continued the remaining dashboard parity audit across the Analytics content sections.
- Added a shared `AnalyticsSection` primitive so Events, Page Views, Page/Traffic Mix, Demand Signals, Agent Performance, and Recent Events no longer keep section chrome inside the analytics data-rendering module.
- Preserved existing analytics cards, ranked lists, share bars, property links, and recent-event rendering while moving section ownership into an analytics-owned module.
- Validation: focused scans found no stale local Analytics section function, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched Analytics files.

## 2026-07-15 — Midday Reports Section Ownership Split

- Continued the remaining dashboard parity audit across the Reports content sections.
- Added a shared `ReportSection` primitive so Business Summary, Agent Performance, and Listings Performance no longer keep section chrome inside the report data/export module.
- Preserved existing CSV export generation, summary card rendering, report tables, and empty-state behavior while moving section ownership into a report-owned module.
- Validation: focused scans found no stale local Reports section symbols, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched Reports files.

## 2026-07-15 — Midday Integrations Section Ownership Split

- Continued the remaining dashboard parity audit across the Integrations overview surface.
- Added a shared `IntegrationsSection` primitive so the available-integrations grid no longer keeps section chrome inside the overview grid client module.
- Preserved existing integration catalog rendering, connected-state card behavior, and empty-state behavior while moving section ownership into a feature-owned module.
- Validation: focused scans found no stale local Integrations section symbols, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched Integrations files.

## 2026-07-15 — Midday AI Credits Section Ownership Split

- Continued the remaining dashboard parity audit across the AI Credits page sections.
- Added a shared `AiCreditsSection` primitive so top-up and usage-by-feature sections no longer keep a local section wrapper inside the mutation/table module.
- Preserved existing credit purchase mutation behavior, credit-info invalidation, usage table rendering, and empty-state behavior while moving section chrome into a feature-owned module.
- Validation: focused scans found no stale local AI Credits section symbols, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched AI Credits files.

## 2026-07-15 — Midday Domains Section Ownership Split

- Continued the remaining dashboard parity audit across the Domains status page and custom-domain connect flow.
- Added a shared `DomainSection` primitive so domain control, DNS instructions, provisioned domains, hostname intake, and setup guidance sections no longer keep duplicate local section wrappers inside separate client modules.
- Replaced the local `DomainSection` and `ConnectDomainSection` implementations while preserving existing domain sync, DNS instruction, provisioned-domain table, and connect-domain form behavior.
- Validation: focused scans found no stale local domain section symbols, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched domain files.

## 2026-07-15 — Midday Estate Section Ownership Split

- Continued the remaining dashboard parity audit across Estate list and Estate detail surfaces.
- Added a shared `EstateSection` primitive with optional action-slot support so the Estate launch list and Estate detail sections no longer keep duplicate local section wrappers inside their client modules.
- Replaced the local `EstatesSection` and `EstateDetailSection` implementations with the shared estate-owned section module while preserving existing list, launch brief, features, plan import, offer cards, inventory, and purchase pipeline behavior.
- Validation: focused scans found no stale local estate section symbols, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched estate files.

## 2026-07-15 — Midday Project Subpage Ownership Split

- Continued the remaining dashboard parity audit across the Project detail, Budget, and Workforce subpage surfaces.
- Added a shared `ProjectSection` wrapper so Project detail, Budget, and Workforce no longer keep duplicate local section primitives inside their client query modules.
- Added `ProjectSubpageHeader` for Project Budget and Project Workforce so their title, description, and back-navigation chrome live in a project-owned header module instead of inline in each page content component.
- Validation: focused scans found no stale local project section symbols, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched project files.

## 2026-07-15 — Midday Detail Header And Stats Ownership Split

- Continued the remaining dashboard parity audit across Project and Estate detail routes.
- Moved Project detail title/status/actions into `ProjectDetailHeader` and project count cards into `ProjectDetailStats`, leaving `ProjectDetailContent` to own query orchestration, not-found state, and detail sections.
- Moved Estate launch title/status/actions into `EstateDetailHeader` and listing/purchase count cards into `EstateDetailStats`, leaving `EstateDetailContent` to own query orchestration, not-found state, and launch/detail sections.
- Validation: focused scans confirmed no stale inline detail header/stat ownership remained in the content modules, no retired action/form/query-flag patterns reappeared, and scoped whitespace / `git diff --check` validation passed for the touched files.

## 2026-07-15 — Midday Settings Wrapper Ownership Cleanup

- Continued the remaining dashboard parity audit in the nested settings routes.
- Removed redundant route-level `Suspense` wrappers from Integration Settings and Notification Preferences now that each settings-list wrapper owns its Card, ErrorBoundary, Suspense, and skeleton fallback.
- Kept the routes thin: each route now authenticates, prefetches, hydrates, and renders the feature-owned settings wrapper directly.
- Validation: focused scans confirmed Suspense ownership remains inside `IntegrationSettingsList` and `NotificationPreferencesSettingsList`, not duplicated at the route level; scoped `git diff --check` passed for the touched settings routes.

## 2026-07-15 — Midday Route-Owned Analytics And Reports Headers

- Continued the remaining dashboard parity audit by moving non-table feature headers out of client query components and into route composition.
- Added top-level `AnalyticsHeader` and `ReportsHeader` components so Analytics and Reports now render header controls before the Suspense/data boundary, matching the Midday route-owned header pattern used by migrated table pages.
- Renamed `AnalyticsDashboard` to `AnalyticsContent` after the header split, leaving the client query component responsible only for metric cards, sections, and empty state.
- Simplified `ReportsView` so report period controls stay route-owned while the client query component owns only report data sections and empty state.
- Validation: focused scans found no stale `AnalyticsDashboard` references and no `AnalyticsHeader` / `ReportsHeader` exports inside client section modules; scoped `git diff --check` passed for the touched files.

## 2026-07-15 — Midday Form Action And Query Flag Parity Sweep

- Continued the remaining dashboard parity audit after removing the broad `app/actions.ts` boundary.
- Converted the Template Sandbox create form from a React form `action` callback to an explicit client `onSubmit` handler, matching the client-mutation ownership used elsewhere in the migrated dashboard.
- Removed the write-only Template Sandbox `?created=1` and `?cloned=1` success query flags from create/clone navigation.
- Validation: focused dashboard source scan found no remaining `<form action=`, `formAction=`, `?created=1`, `?cloned=1`, or `?archived=1` hits; focused action-boundary scan still found no `@/app/actions` imports or retired join/onboarding action symbols; scoped `git diff --check` passed for the touched files.

## 2026-07-15 — Midday Onboarding Completion Action Cleanup

- Finished the remaining dashboard dependency on the broad `@/app/actions` boundary.
- Replaced final onboarding completion with client-owned `workspace.saveOnboardingProgress` plus `workspace.completeOnboarding` mutations, preserving final content-readiness flags, logo handoff, tenant sign-in redirect, and builder redirect target.
- Added a narrow `/api/session/onboarding` cleanup endpoint and client helper so completion clears only the pending-onboarding cookie without signing the user out.
- Deleted the retired `apps/dashboard/src/app/actions.ts` file after source scans confirmed no active imports remained.
- Validation: focused source scan found no remaining `@/app/actions` imports or retired join/onboarding action symbols in dashboard/API source; broader server-action scan found only client callback/component-name false positives; scoped `git diff --check` passed for tracked touched files.

## 2026-07-15 — Midday Join Signup Action Cleanup

- Continued narrowing the dashboard `app/actions.ts` surface around the invite join flow.
- Added `auth.signUpForInvite` so invite account creation, invite validation, invite acceptance, and session-token creation now live behind the API router instead of a dashboard server action.
- Replaced `InviteSignUpForm`'s `signUpForInviteAction` submission with a client mutation plus the existing `/api/session` session bridge, preserving role-aware navigation to profile completion for agent/staff invites and dashboard navigation for admin invites.
- Removed the now-unused `signUpForInviteAction` wrapper and stale invite signup imports from `app/actions.ts`.
- Validation: focused source scan found no remaining active `signUpForInviteAction` references; the dashboard no longer imports `@/app/actions`; scoped `git diff --check` passed for tracked touched files.

## 2026-07-15 — Midday Join Profile Completion Action Cleanup

- Continued narrowing the dashboard `app/actions.ts` surface around the invite join flow.
- Added `team.completeInviteProfile` so accepted agent/staff invite profile completion now runs through a public tRPC mutation with session/email/token validation before writing the invite profile.
- Replaced the invite profile completion form's `completeInviteProfileAction` server-action submission with a route-local client mutation, preserving role-aware profile fields and redirect/error behavior.
- Removed the now-unused `completeInviteProfileAction` wrapper and stale invite-profile imports from `app/actions.ts`.
- Validation: focused source scan found no remaining `completeInviteProfileAction` references; the dashboard no longer imports `@/app/actions`; scoped `git diff --check` passed for tracked touched files.

## 2026-07-15 — Midday Join Accept Action Cleanup

- Continued narrowing the dashboard `app/actions.ts` surface around the invite join flow.
- Replaced the signed-in Join page accept-invite server-action form with a route-local `AcceptInviteButton` client component that calls the existing `team.acceptInvite` mutation.
- Preserved role-aware navigation after acceptance: agent/staff invites continue to profile completion, while admin invites return to the dashboard; mutation failures still surface through the existing join `?error=` notice.
- Removed the now-unused `acceptInviteAction` server-action wrapper from `app/actions.ts`.
- Validation: focused source scan found no remaining `acceptInviteAction` references in active source; the dashboard no longer imports `@/app/actions`; scoped `git diff --check` passed for tracked touched files. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Onboarding Logo Action Cleanup

- Continued narrowing the dashboard `app/actions.ts` surface around onboarding.
- Moved pending-onboarding logo cookie persistence into the authenticated `/api/upload` route for pre-workspace logo uploads, preserving the existing fallback to the pending cookie or saved onboarding record for company/subdomain identity.
- Removed the `setPendingOnboardingLogoAction` call from `OnboardingBrandAvatar`; the avatar now uploads once, receives the public URL, and refreshes after the API route has persisted the pending logo cookie.
- Removed the now-unused `setPendingOnboardingLogoAction` server-action wrapper from `app/actions.ts`.
- Validation: focused stale scans found no remaining `setPendingOnboardingLogoAction` references; the dashboard no longer imports `@/app/actions`; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Template Sandbox Action Cleanup

- Continued removing dashboard dependencies on broad `app/actions.ts` wrappers.
- Replaced Template Sandbox index create, clone, and archive forms with direct `templateSandbox` client mutations plus local list invalidation and navigation.
- Replaced Template Sandbox workbench content save, smart fill, shuffle style, and live website generation actions with direct `templateSandbox` mutations.
- Extended `BuilderPreviewPanel` with optional field-save/smart-fill overrides so the normal Builder path keeps workspace mutations while the Sandbox path can own sandbox-specific mutations.
- Removed the now-unused Template Sandbox server-action wrappers and stale action-only helpers from `app/actions.ts`.
- Validation: focused stale scans found no remaining Template Sandbox action wrapper symbols or Template Sandbox `@/app/actions` imports; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Onboarding Step Save Action Cleanup

- Continued removing dashboard client form dependencies on broad `app/actions.ts` wrappers.
- Replaced the first four onboarding step submissions with direct `workspace.saveOnboardingProgress` client mutations from `components/onboarding/onboarding-step-forms.tsx`.
- Preserved onboarding URL state behavior by moving successful submissions to the next `?step=` value and surfacing mutation failures through the existing onboarding `?error=` route notice.
- Removed the now-unused `saveOnboardingStepAction` server-action wrapper from `app/actions.ts`.
- Left final onboarding completion and logo upload actions in place for a separate pass because they still own pending-onboarding cookie and subdomain redirect behavior.
- Validation: focused stale scan found no remaining `saveOnboardingStepAction` references; the dashboard no longer imports `@/app/actions`; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Builder Workspace Action Cleanup

- Continued removing dashboard dependencies on broad `app/actions.ts` wrappers in favor of feature-owned client mutation boundaries.
- Moved Builder preview field saves and smart-fill requests into `BuilderPreviewPanel` with direct `workspace.updateSiteField` and `workspace.smartFillField` mutations.
- Moved Builder template draft creation and theme updates into `BuilderSidebarControls` with direct `workspace.createTemplateDraft` and `workspace.updateSiteThemeField` mutations.
- Moved Builder publishing into `PublishConfirmationDialog` with a direct `workspace.publishSiteConfiguration` mutation and local builder URL notice handling.
- Removed the now-unused Builder server-action wrappers from `app/actions.ts`, leaving active Builder workspace components free of `@/app/actions` imports.
- Validation: focused stale scans found no remaining Builder action wrapper symbols or Builder `@/app/actions` imports; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Dashboard Home Bootstrap Action Cleanup

- Continued removing dashboard route dependencies on `app/actions.ts` where the route can own server composition directly.
- Replaced the Dashboard Home import of `ensureBuilderConfigurationExists` from `@/app/actions` with a route-local server bootstrap helper.
- The route now calls `workspace.ensureBuilderConfigurationExists` through a server caller, preserves the active-draft/database guard, and continues prefetching `workspace.getDashboardOverview` inside the thin `HydrateClient` / `ScrollableContent` route composition.
- Removed the now-unused `ensureBuilderConfigurationExists` server action and `getActiveDraftForCompany` import from `app/actions.ts`.
- Validation: focused stale scans found no remaining Dashboard Home `@/app/actions` import or `ensureBuilderConfigurationExists` export in `app/actions.ts`; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Dead CSV Action Cleanup

- Continued removing dashboard-owned server-action surface that no longer participates in migrated Midday-style page flows.
- Removed the stale Leads, Properties, Customers, Appointments, and Employees CSV export server actions from `app/actions.ts`.
- Removed the now-unused dashboard imports for the matching DB export-row helpers.
- Confirmed the active Reports export controls already generate CSV client-side from hydrated `workspace.getReports` data and do not reference the retired actions.
- Validation: focused stale scans found no remaining dashboard references to `exportLeadsCsvAction`, `exportPropertiesCsvAction`, `exportCustomersCsvAction`, `exportAppointmentsCsvAction`, `exportEmployeesCsvAction`, or their DB export helper imports in `app/actions.ts`; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Invite Form Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Moved workspace invitation email dispatch into the API-owned `team.inviteMember` mutation so invite creation and notification sending remain one behavior-preserving boundary.
- Replaced Team, Agent, and Employee invite form server-action submissions with direct `team.inviteMember` client mutations.
- Added local mutation error rendering, pending invite invalidation, form reset, and sheet close on successful invite submission.
- Removed the now-unused `inviteMemberAction`, `inviteAgentAction`, `inviteEmployeeAction`, dashboard invite helper, and dashboard-local invite notification dispatcher.
- Validation: focused stale scans found no remaining invite form `@/app/actions` imports, `FormData` conversion, local `pending` state, or retired invite action names in the touched invite path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Estate Create Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Moved unique estate slug resolution into `workspace.createEstate`, making slug optional in the API input while preserving company-scoped uniqueness before creation.
- Replaced `CreateEstateForm`'s `createEstateAction` submission with the `workspace.createEstate` client mutation.
- Added local mutation error rendering, estate list invalidation, form reset, and sheet close on successful estate creation.
- Removed the now-unused `createEstateAction` server action and standalone unique-slug helper import from `app/actions.ts`.
- Validation: focused stale scans found no remaining `createEstateAction`, `getUniqueEstateSlugForCompany`, estate form `@/app/actions` import, `FormData` conversion, or local `pending` state in the touched Estate path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Property Form Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Replaced `PropertyForm`'s create/edit server-action submissions with direct `workspace.createProperty` and `workspace.updateProperty` client mutations.
- Preserved listing details, land-specific bedroom/bathroom nulling, pricing-plan normalization, featured/status fields, and estate linkage while removing `FormData` conversion.
- Added local mutation error rendering, property list/detail invalidation, form reset for create, and sheet close on successful create/edit.
- Removed the now-unused `createPropertyAction`, `updatePropertyAction`, and server-action-only pricing-plan parser from `app/actions.ts`; removed the dead property create `returnTo` handoff from the active create-sheet path.
- Validation: focused stale scans found no remaining `createPropertyAction`, `updatePropertyAction`, `parsePropertyPricingPlans`, property form `@/app/actions` import, `FormData` conversion, local `pending` state, or active property create `returnTo` handoff in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Agent Form Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Replaced `AgentForm`'s create/edit server-action submissions with direct `workspace.createAgent` and `workspace.updateAgent` client mutations.
- Added local mutation error rendering, agent list/detail invalidation, form reset for create, and sheet close on successful create/edit.
- Removed the now-unused `createAgentAction` and `updateAgentAction` server actions from `app/actions.ts`.
- Validation: focused stale scans found no remaining `createAgentAction`, `updateAgentAction`, agent form `@/app/actions` import, `FormData` conversion, or local `pending` state in the touched Agent path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Payroll Entry Create Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Added `workspace.createPayrollEntry` with active-company employee validation before creating the payroll entry.
- Replaced `PayrollEntryForm`'s `createPayrollEntryAction` submission with the new client mutation.
- Added local mutation error rendering, payroll entry/summary/period invalidation, form reset, and sheet close on successful submission.
- Removed the now-unused `createPayrollEntryAction` server action and standalone payroll-create helper import from `app/actions.ts`.
- Validation: focused stale scans found no remaining `createPayrollEntryAction`, `createCompanyPayrollEntry`, payroll entry form `@/app/actions` import, `FormData` conversion, or local `pending` state in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Leave Request Create Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Added `workspace.createLeaveRequest` with company-owned employee validation before creating the leave request.
- Replaced `LeaveRequestForm`'s `createLeaveRequestAction` submission with the new client mutation.
- Added local mutation error rendering, leave request list/stat invalidation, form reset, and sheet close on successful submission.
- Removed the now-unused `createLeaveRequestAction` server action and standalone leave-request helper import from `app/actions.ts`.
- Validation: focused stale scans found no remaining `createLeaveRequestAction`, `createCompanyLeaveRequest`, leave request form `@/app/actions` import, `FormData` conversion, or local `pending` state in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Department Create Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Added `workspace.createDepartment` backed by the request-scoped department create helper.
- Replaced `DepartmentForm`'s `createDepartmentAction` submission with the new client mutation.
- Added local mutation error rendering, department list invalidation, form reset, and sheet close on successful department creation.
- Removed the now-unused `createDepartmentAction` server action and standalone department-create helper import from `app/actions.ts`.
- Validation: focused stale scans found no remaining `createDepartmentAction`, `createCompanyDepartment`, department form `@/app/actions` import, `FormData` conversion, or local `pending` state in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Project Create Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Replaced `ProjectForm`'s `createProjectAction` submission with the existing `projects.create` client mutation.
- Added local mutation error rendering, project list/stat invalidation, form reset, and sheet close on successful project creation.
- Removed the now-unused `createProjectAction` server action from `app/actions.ts`.
- Validation: focused stale scans found no remaining `createProjectAction`, project form `@/app/actions` import, `FormData` conversion, or local `pending` state in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday Appointment Create Action Cleanup

- Continued replacing sheet-owned server-action submissions with Midday-style client mutation boundaries.
- Replaced `AppointmentForm`'s `createAppointmentAction` submission with the existing `workspace.createAppointment` client mutation.
- Added local mutation error rendering, appointment list/stat invalidation, form reset, and sheet close on successful scheduling.
- Removed the now-unused `createAppointmentAction` server action from `app/actions.ts`, and removed the unreferenced `syncTenantDomainsAction` shim left after the Domains mutation cleanup.
- Validation: focused stale scans found no remaining `createAppointmentAction`, appointment form `@/app/actions` import, `FormData` conversion, local `pending` state, or `syncTenantDomainsAction` in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used because this checkout has no installed workspace package links, so direct root imports of `@plotkeys/*` packages fail generally.

## 2026-07-15 — Midday App Store Action Cleanup

- Continued replacing dashboard-owned server actions with shared API mutation boundaries.
- Added `workspace.setAppEnabled` for admin-gated app enable/disable changes, preserving registry validation and plan-gate enforcement before updating the company's enabled app ids.
- Replaced the active App Store toggle's route-local `setAppEnabled` server action call with a client tRPC mutation, inline error rendering, and `router.refresh()` so server-rendered app-store/sidebar state refreshes after mutation success.
- Removed the retired route-local App Store action file, obsolete `InstallButton`, and unused global install/uninstall app server actions from `app/actions.ts`.
- Validation: focused stale scans found no remaining active `setAppEnabled` server-action imports, `installAppAction`, `uninstallAppAction`, `InstallButton`, or App Store install-button references in dashboard/API source; direct trailing-whitespace scan passed; scoped `git diff --check` passed. A targeted Bun import probe was not used for this slice because this checkout has no installed workspace package links, so direct root imports of any `@plotkeys/*` package fail even after lock metadata is updated.

## 2026-07-15 — Midday Reports Export Action Cleanup

- Continued removing dashboard-owned server-action dependencies from migrated page components.
- Replaced Reports CSV export server actions with client-side CSV generation from the already-hydrated `workspace.getReports` query data.
- Kept the exported CSV column order and escaping behavior aligned with the existing report export format while avoiding extra round-trips for data the page already owns.
- Removed the now-unused report export server actions and DB CSV helper imports from `app/actions.ts`.
- Validation: focused stale scans found no remaining `exportBusinessSummaryCsvAction`, `exportAgentReportCsvAction`, `exportListingsReportCsvAction`, Reports `@/app/actions` import, or report CSV DB helper imports in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the shared export button, Reports sections, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Billing Action Cleanup

- Continued replacing dashboard-owned server-action forms with Midday-style client mutation/navigation boundaries.
- Replaced paid-plan checkout forms with the existing `workspace.initializeCheckout` client mutation and browser navigation to the returned provider authorization URL.
- Replaced repair-payment forms with client-side navigation to the existing `/billing/callback?reference=...` verification route, preserving the server-side callback verifier.
- Removed the now-unused Billing checkout and repair server actions from `app/actions.ts`.
- Validation: focused stale scans found no remaining `initializeCheckoutAction`, `repairBillingPaymentAction`, Billing `@/app/actions` imports, or Billing checkout/repair form action bindings in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for Billing sections/table cells and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday AI Credits Action Cleanup

- Continued replacing dashboard-owned server-action forms with Midday-style client mutation boundaries.
- Replaced the AI Credits top-up form with the existing `workspace.purchaseAiCredits` client mutation.
- Added pending/error rendering and `workspace.getAiCreditInfo` invalidation so the credit summary and usage table refresh from the shared query after purchase.
- Removed the now-unused `purchaseAiCreditsAction` server action from `app/actions.ts`.
- Validation: focused stale scans found no remaining `purchaseAiCreditsAction`, AI Credits `@/app/actions` import, `SubmitButton` dependency, or AI Credits purchase form binding in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for AI Credits sections and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Domains Action Cleanup

- Continued replacing dashboard-owned server-action forms with Midday-style client mutation boundaries.
- Replaced Domains sync, custom-domain connect, and custom-domain remove flows with `workspace.syncTenantDomains`, `workspace.connectCustomDomain`, and `workspace.removeCustomDomain` client mutations.
- Added local pending/error handling plus targeted invalidation for `workspace.getTenantDomainStatus` and `workspace.getCustomDomainDnsInstructions`.
- Removed the now-unused Domains server actions from `app/actions.ts`.
- Validation: focused stale scans found no remaining `syncDomainsAction`, `connectCustomDomainAction`, `removeCustomDomainAction`, Domains `@/app/actions` imports, or Domains form action bindings in the touched path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for Domains sections/table cells/connect form and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Settings Logo Action Cleanup

- Continued replacing migrated settings server-action forms with Midday-style client mutation boundaries.
- Replaced Settings logo save/remove persistence with the existing `workspace.setCompanyLogo` client mutation while preserving the local `/api/upload` file upload flow.
- Added mutation pending/error handling and `workspace.getCompanySettings` invalidation so Settings refreshes from the shared company settings query.
- Removed the now-unused `setCompanyLogoAction` server action from `app/actions.ts`.
- Validation: focused stale scans found no remaining `setCompanyLogoAction`, logo form `@/app/actions` import, `startSave`, or `saving` state in the touched Settings logo/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `LogoUploadForm` and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday General Settings Action Cleanup

- Continued replacing migrated settings server-action forms with Midday-style client mutation boundaries.
- Replaced General Settings' company profile `updateCompanyProfileAction` form with a controlled client form backed by `workspace.updateCompanyProfile`.
- Added pending submit disabling and `workspace.getCompanySettings` invalidation so the settings cards refresh from the shared company settings query.
- Removed the now-unused `updateCompanyProfileAction` server action from `app/actions.ts`.
- Validation: focused stale scans found no remaining `updateCompanyProfileAction`, General Settings profile form action binding, or `SubmitButton` dependency; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for Settings sections and `app/actions.ts` with only the known Better Auth base-url warning. A broader settings page import probe still hits the existing `server-only` resolution boundary from `trpc/server.tsx`, so it was not used as slice evidence.

## 2026-07-15 — Midday Integration Settings Action Cleanup

- Continued replacing migrated settings server-action forms with Midday-style client mutation boundaries.
- Replaced Integration Settings' `updateIntegrationsAction` form with a controlled client form backed by `workspace.updateCompanyIntegration`.
- Added pending submit disabling and `workspace.getCompanyIntegration` invalidation so both Settings and Integrations overview share the refreshed integration state.
- Removed the now-unused `updateIntegrationsAction` server action from `app/actions.ts`.
- Validation: focused stale scans found no remaining `updateIntegrationsAction`, Integration Settings form action binding, Integration Settings `@/app/actions` import, or `SubmitButton` dependency; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for Integration Settings/list and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Notification Preferences Action Cleanup

- Continued replacing migrated settings server-action forms with Midday-style client mutation boundaries.
- Replaced Notification Preferences channel-toggle forms with direct `notifications.updatePreference` client mutations, pending disabling, and `notifications.listPreferences` invalidation.
- Removed the now-unused `updateNotificationPreferenceAction` server action from `app/actions.ts`.
- Validation: focused stale scans found no remaining `updateNotificationPreferenceAction`, notification preference form bindings, or notification preference `@/app/actions` imports; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for Notification Preferences cells/settings and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Table Core Server-Action Helper Cleanup

- Completed the migrated table action-boundary sweep by removing the unused `BulkFormAction` and `BulkDeleteAction` exports from the shared table core.
- Deleted the retired table-core server-action form helper files now that active table/header paths use client mutation buttons or `BulkClientDeleteAction`.
- Validation: focused scans found no remaining `BulkFormAction`, `BulkDeleteAction`, `bulk-form-action`, `bulk-delete-action`, table/header `@/app/actions` imports, or table/header form action bindings; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the table core plus representative Properties, Leave Requests, and Leads data tables.

## 2026-07-15 — Midday Leave Requests Table Action Cleanup

- Continued replacing migrated table server-action forms with Midday-style client mutation boundaries.
- Added `workspace.updateLeaveRequestStatus` and `workspace.updateLeaveRequestsStatus` tRPC mutations for request-scoped, company-guarded Leave Request status changes.
- Replaced Leave Request row approve/reject/cancel forms with client mutations, pending disabling, and invalidation for `workspace.listLeaveRequests` plus `workspace.getLeaveRequestStats`.
- Replaced the Leave Requests bottom bar's approve/reject/cancel `BulkFormAction` forms with direct client mutation buttons, row-selection clearing, and list/stat invalidation.
- Removed the now-unused Leave Request status server actions from `app/actions.ts`, while keeping Leave Request create action for the active sheet form.
- Validation: focused stale scans found no remaining `approveLeaveRequestAction`, `approveLeaveRequestsAction`, `rejectLeaveRequestAction`, `rejectLeaveRequestsAction`, `cancelLeaveRequestAction`, `cancelLeaveRequestsAction`, `setCompanyLeaveRequestStatus`, `BulkFormAction`, or Leave Request row form bindings in the touched Leave Requests table/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the workspace router, Leave Requests action menu, Leave Requests data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Leads Table Action Cleanup

- Continued replacing migrated table server-action forms with Midday-style client mutation boundaries.
- Added `workspace.updateLeadsStatus` for bulk lead status updates and `workspace.convertLeadToCustomer` for row conversion without dashboard hidden-field forms.
- Tightened `workspace.updateLeadStatus` so lead status changes are checked against the active company before updating by id.
- Replaced Lead row status and convert-to-customer forms with client mutations, pending disabling, and invalidation for `workspace.listLeads`, `workspace.getLeadStats`, and customer list/stats after conversion.
- Replaced the Leads bottom bar's `updateLeadsStatusAction` forms with direct client mutation buttons for Mark contacted and Qualify.
- Removed the now-unused Lead status and convert-to-customer server actions from `app/actions.ts`.
- Validation: focused stale scans found no remaining `updateLeadStatusAction`, `updateLeadsStatusAction`, `convertLeadToCustomerAction`, `BulkFormAction`, or Lead row form bindings in the touched Leads table/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the workspace router, Leads action menu, Leads data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Properties Table Action Cleanup

- Continued replacing migrated table server-action forms with Midday-style client mutation boundaries.
- Added a `workspace.deleteProperties` tRPC mutation for bulk Property removal, using the same company-scoped delete helper as the existing single-row delete mutation.
- Replaced Property row feature toggling with the existing `workspace.togglePropertyFeatured` client mutation, pending disabling, and `workspace.listProperties` invalidation.
- Replaced the Properties bottom bar's `deletePropertiesAction` form with `BulkClientDeleteAction`, pending disabling, row-selection clearing, and property-list invalidation.
- Removed the now-unused Property bulk-delete and feature-toggle server actions from `app/actions.ts`, while keeping Property create/update actions for the active sheet forms.
- Validation: focused stale scans found no remaining `deletePropertiesAction`, `togglePropertyFeaturedAction`, `BulkDeleteAction`, or feature-toggle form bindings in the touched Properties table/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the workspace router, Properties action menu, Properties data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Payroll Table Action Cleanup

- Continued replacing migrated table server-action forms with Midday-style client mutation boundaries.
- Added `workspace.markPayrollPaid` and `workspace.markPayrollEntriesPaid` tRPC mutations backed by the request-scoped database helper.
- Replaced Payroll row mark-paid forms with client mutations, pending disabling, and invalidation for `workspace.listPayrollEntries` plus `workspace.getPayrollSummary`.
- Replaced the Payroll bottom bar `markPayrollEntriesPaidAction` form with a direct client mutation button, row-selection clearing, and list/summary invalidation.
- Removed the now-unused Payroll mark-paid server actions from `app/actions.ts`, while keeping Payroll create action for the active sheet form.
- Validation: focused stale scans found no remaining `markPayrollPaidAction`, `markPayrollEntriesPaidAction`, `markCompanyPayrollPaid`, `BulkFormAction`, or Payroll mark-paid form bindings in the touched Payroll table/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the workspace router, Payroll action menu, Payroll data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Notifications Action Cleanup

- Continued replacing migrated page/table server-action forms with Midday-style client mutation boundaries.
- Added a `notifications.markManyRead` tRPC mutation for selected notification read-state updates.
- Replaced the Notifications header `markAllNotificationsReadAction` form with a client `notifications.markAllRead` mutation, pending disabling, and list/unread-count invalidation.
- Replaced Notification row mark-read forms with client `notifications.markRead` mutations, pending disabling, and list/unread-count invalidation.
- Replaced the Notifications bottom bar `markNotificationsReadAction` form with a direct client `notifications.markManyRead` button, row-selection clearing, and list/unread-count invalidation.
- Removed the now-unused notification read server actions from `app/actions.ts`.
- Validation: focused stale scans found no remaining `markAllNotificationsReadAction`, `markNotificationReadAction`, `markNotificationsReadAction`, `BulkFormAction`, or notification mark-read form bindings in the touched Notifications path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the notifications router, Notifications header, Notification action menu, Notification data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Appointments Table Action Cleanup

- Continued replacing migrated table server-action forms with Midday-style client mutation boundaries.
- Added a `workspace.deleteAppointments` tRPC mutation for bulk Appointment removal.
- Replaced Appointment row status/cancel/delete forms with client mutations, pending disabling, and invalidation for `workspace.listAppointments` plus `workspace.getAppointmentStats`.
- Replaced the Appointment bottom bar's `deleteAppointmentsAction` form with `BulkClientDeleteAction`, pending disabling, row-selection clearing, and list/stat invalidation.
- Removed the now-unused Appointment status/delete server actions from `app/actions.ts`, while keeping Appointment create action for the active sheet form.
- Validation: focused stale scans found no remaining `updateAppointmentStatusAction`, `deleteAppointmentAction`, `deleteAppointmentsAction`, `BulkDeleteAction`, or appointment row form bindings in the touched Appointment table/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the workspace router, Appointment action menu, Appointment data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Agents Table Action Cleanup

- Continued replacing migrated table server-action forms with Midday-style client mutation boundaries.
- Added a `workspace.deleteAgents` tRPC mutation for bulk Agent removal.
- Replaced Agent row feature toggling with the existing `workspace.toggleAgentFeatured` client mutation, pending disabling, and `workspace.listAgents` invalidation.
- Replaced the Agent bottom bar's `deleteAgentsAction` form with `BulkClientDeleteAction`, pending disabling, row-selection clearing, and Agent-list invalidation.
- Removed the now-unused Agent bulk-delete and feature-toggle server actions from `app/actions.ts`, while keeping Agent create/update actions for the active sheet form.
- Validation: focused stale scans found no remaining `deleteAgentsAction`, `toggleAgentFeaturedAction`, `BulkDeleteAction`, or feature-toggle form bindings in the touched Agent table/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the workspace router, Agent action menu, Agent data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Departments Table Action Cleanup

- Continued replacing migrated table server-action forms with Midday-style client mutation boundaries.
- Added `workspace.deleteDepartment` and `workspace.deleteDepartments` tRPC mutations backed by the request-scoped database helper.
- Replaced Department row delete forms with action-menu client mutations, pending disabling, and `workspace.listDepartments` invalidation.
- Replaced the Department bottom bar's `deleteDepartmentsAction` form with `BulkClientDeleteAction`, pending disabling, row-selection clearing, and department-list invalidation.
- Removed the now-unused Department update/delete server actions from `app/actions.ts`, while keeping `createDepartmentAction` for the active sheet form.
- Validation: focused stale scans found no remaining `updateDepartmentAction`, `deleteDepartmentAction`, `deleteDepartmentsAction`, `BulkDeleteAction`, or department delete helper references in the touched Department table/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the workspace router, Department action menu, Department data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Employees Table Action Cleanup

- Continued replacing migrated table server-action forms with Midday-style client mutation boundaries.
- Added `workspace.updateEmployeeStatus`, `workspace.deleteEmployee`, and `workspace.deleteEmployees` tRPC mutations backed by DB helpers that accept the request-scoped database instance.
- Replaced Employee row status/delete forms with action-menu client mutations, pending disabling, and invalidation for `workspace.listEmployees` plus `workspace.getEmployeeStats`.
- Replaced the Employee bottom bar's `deleteEmployeesAction` form with `BulkClientDeleteAction`, pending disabling, row-selection clearing, and list/stat invalidation.
- Removed the now-unused Employee create/update/delete server actions from `app/actions.ts`, eliminating the stale `/hr/employees` route-error action path from the active Employees table migration.
- Validation: focused stale scans found no remaining `createEmployeeAction`, `updateEmployeeAction`, `deleteEmployeeAction`, `deleteEmployeesAction`, `BulkDeleteAction`, or `/hr/employees` route-error redirect references in the touched Employee table/action path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the workspace router, Employee action menu, Employee data table, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Agent + Employee Invite Revoke Cleanup

- Continued the invite action-boundary cleanup after retiring the shared `revokeInviteAction` server action.
- Replaced Agent pending-invite revoke forms with a client `team.revokeInvite` mutation, local inline revoke error display, pending invite disabling, and `team.listInvites` invalidation.
- Replaced Employee pending-invite revoke forms with the same client mutation and local invalidation/error behavior.
- Validation: focused stale scans found no remaining `revokeInviteAction` imports or form bindings in Team, Agent, Employee invite lists, or `app/actions.ts`; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for all three invite lists and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Team Bulk + Invite Action Cleanup

- Continued removing route-owned Team action errors after the row action-menu cleanup.
- Added a `team.removeMembers` tRPC mutation that applies the same owner/self-removal protections as single-member removal while allowing the Team bottom bar to use a client mutation boundary.
- Replaced the Team bottom bar's `removeMembersAction` form with `BulkClientDeleteAction`, pending disabling, row-selection clearing, and `team.listMembers` invalidation.
- Replaced pending-invite revoke forms with a client `team.revokeInvite` mutation, local inline revoke error display, pending invite disabling, and `team.listInvites` invalidation.
- Removed the retired `removeMembersAction` and `revokeInviteAction` server actions from `app/actions.ts`, eliminating the remaining `/team?error=...` action redirect producers in the active Team path.
- Validation: focused stale scans found no remaining `removeMembersAction`, `revokeInviteAction`, `BulkDeleteAction`, or `createRedirectUrl("/team", ...)` references in the touched Team path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the Team router, Team data table, pending invites, and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Team Row Action Menu Cleanup

- Continued moving Team table actions away from route-owned error redirects.
- Replaced Team row role/status/remove form actions with action-menu client mutations for `team.updateMemberRole`, `team.suspendMember`, `team.reactivateMember`, and `team.removeMember`.
- Removed the now-unused single-member server actions from `app/actions.ts`, leaving bulk member removal and invite revocation as separate remaining action-boundary passes.
- Validation: focused stale scans found no remaining `updateMemberRoleAction`, `suspendMemberAction`, `reactivateMemberAction`, or single `removeMemberAction` references in the active Team row menu path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the Team action menu and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Workspace Invite Sheet Form Error Cleanup

- Continued replacing route-owned invite failures with feature-owned sheet form behavior.
- Updated the shared `inviteWorkspaceUser` helper so Team, Agent, and Employee invite failures return `{ error }` instead of redirecting through the invite route's `?error` state, while preserving plain success redirects to `/team`, `/agents`, and `/hr/employees`.
- Updated `InviteMemberForm`, `InviteAgentForm`, and `InviteEmployeeForm` to clear and render invite failures inside the sheet forms.
- Validation: focused stale scans confirmed the shared invite helper no longer builds route-error redirects for invite failures; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for all three invite forms and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Payroll Entry Sheet Form Error Cleanup

- Continued replacing HR route-owned error redirects with feature-owned sheet form behavior.
- Updated `createPayrollEntryAction` to return form-local errors for missing required fields, database-unavailable failures, and employee-not-found failures, while preserving the intentional payroll period success redirect with `year` / `month`.
- Updated `PayrollEntryForm` to clear and render create failures inside the sheet form instead of relying on `/hr/payroll?error` route chrome.
- Validation: focused stale scans found no remaining `/hr/payroll?error` or `createRedirectUrl("/hr/payroll", ...)` paths; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `PayrollEntryForm` and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Leave Request Sheet Form Error Cleanup

- Continued replacing HR route-owned error redirects with feature-owned sheet form behavior.
- Updated `createLeaveRequestAction` to return form-local errors for missing required fields, database-unavailable failures, and employee-not-found failures, while preserving the plain `/hr/leave` success redirect.
- Updated `LeaveRequestForm` to clear and render create failures inside the sheet form instead of relying on `/hr/leave?error` route chrome.
- Validation: focused stale scans found no remaining `/hr/leave?error` or `createRedirectUrl("/hr/leave", ...)` paths; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `LeaveRequestForm` and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Department Sheet Form Error Cleanup

- Continued replacing HR route-owned error redirects with feature-owned sheet form behavior.
- Updated `createDepartmentAction` to return form-local errors for missing department name and database-unavailable failures, while preserving the plain `/hr/departments` success redirect.
- Updated `DepartmentForm` to clear and render create failures inside the sheet form instead of relying on `/hr/departments?error` route chrome.
- Validation: focused stale scans found no remaining `/hr/departments?error` or `createRedirectUrl("/hr/departments", ...)` paths; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `DepartmentForm` and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Project Sheet Form Error Cleanup

- Continued replacing route-owned error redirects with feature-owned sheet form behavior.
- Updated `createProjectAction` to return `{ error }` on mutation failure and redirect to plain `/projects` only after successful revalidation.
- Updated `ProjectForm` to clear and render create failures inside the sheet form, matching the form-local error pattern used by migrated Agent and Property sheets.
- Validation: focused scans found no remaining `/projects?error` redirect path; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `ProjectForm` and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Property Row Action Delete Cleanup

- Continued the table action-menu cleanup after the Agents row delete pass.
- Replaced the Properties row delete form action with a table action-menu client mutation using `trpc.workspace.deleteProperty`, pending-item disabling, and `listProperties` invalidation.
- Removed the now-unused single `deletePropertyAction` server action, eliminating the `/properties?error=...` redirect producer from the active Properties row action path.
- Validation: focused scans found no remaining `deletePropertyAction`, `/properties?error`, or Property row-delete redirect references; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the Properties action menu and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Agent Row Action Delete Cleanup

- Continued the Agents migration from route-owned action errors into feature/table-owned mutations.
- Replaced the Agents row delete form action with a table action-menu client mutation using `trpc.workspace.deleteAgent`, pending-item disabling, and list invalidation.
- Removed the now-unused `deleteAgentAction` server action, eliminating the last `/agents?error=...` redirect producer from the active Agents path.
- Validation: focused scans found no remaining `deleteAgentAction`, `/agents?error`, or Agent row-delete redirect references; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the Agents action menu and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Agent Sheet Form Error Cleanup

- Continued replacing route-owned error redirects with feature-owned form behavior.
- Updated Agent create/edit server actions to return `{ error }` on mutation failure and redirect to plain `/agents` only after successful revalidation.
- Updated `AgentForm` to clear and render create/edit failures inside the sheet form, matching the form-local error pattern used by the migrated Property sheet.
- Validation: focused source checks confirmed Agent create/edit no longer construct `/agents?error=...`; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `AgentForm` and `app/actions.ts` with only the known Better Auth base-url warning. Row delete was moved into the table action-menu mutation path in the follow-up Agent row action cleanup.

## 2026-07-15 — Midday App Store Route State Cleanup

- Continued the remaining non-filter route-state cleanup after table action redirects.
- Removed the App Store route's unused `locked` search-param ownership and deleted the corresponding route-level locked-app banner from `AppStoreView`.
- Left legitimate object-shaped `(app)` route params in place for Reports period selection and Billing callback reference handling.
- Validation: fixed-string stale scans found no remaining App Store `locked` param, `lockedApp`, or locked-prop references; the remaining simple object `searchParams` scan only reports Reports month/year and Billing callback reference/trxref; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `AppStoreView` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Table Action Success Redirect Cleanup

- Continued the route-query cleanup on migrated table pages after confirming active list routes no longer consume `created` / `invited` notice params.
- Removed dead success-query redirects from team member invites, employee invites, lead-to-customer conversion, employee creation, department creation, leave request creation, and payroll entry creation.
- Preserved legitimate payroll period URL state by keeping `year` / `month` in the payroll redirect while removing the unused `created=1` flag.
- Validation: focused scans found no remaining table-page `created=1` / `invited=1` redirects for Customers, Team, Employees, Departments, Leave Requests, or Payroll; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `app/actions.ts` with only the known Better Auth base-url warning. The remaining `created=1` hit belongs to the separate `/template-sandbox` area outside the authenticated `(app)` dashboard route tree.

## 2026-07-15 — Midday Estate + Property Detail Route Notice Cleanup

- Continued the remaining detail-route query cleanup after the Blog and Domain Connect pass.
- Removed route-level `error` search-param ownership from the Estate detail route, leaving the page as direct `HydrateClient` > `ScrollableContent` > `ErrorBoundary` / `Suspense` > `EstateDetailContent` composition.
- Stopped the retired Property detail redirect route from forwarding obsolete `error` query state into the active Properties list/sheet URL, while preserving existing image provider/query sheet params.
- Updated property create/update server actions to return form-local error results on failure instead of redirecting to `?error=...`, and surfaced those errors inside `PropertyForm`.
- Validation: focused stale-pattern scans found no remaining Estate detail error-query props, Property detail error forwarding, or property create/update `?error` redirect construction; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `PropertyForm` and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Blog + Domain Connect Route Notice Cleanup

- Continued the route-query chrome cleanup across remaining non-table dashboard pages.
- Removed `created` / `saved` query notice handling from the Blog detail route and content component; creating a post now navigates to plain `/blog/[id]`, while edit success stays owned by the existing form-local state.
- Removed `error` search-param ownership from the custom-domain connect route and view; `connectCustomDomainAction` now returns a form-local error result on failure and redirects to plain `/domains` on success.
- Validation: focused stale-notice scans found no remaining edited-route notice props or domain-connect error-query redirects; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probes passed for the touched client modules and `app/actions.ts` with only the known Better Auth base-url warning. A broader action scan still shows unrelated older `created` / `saved` redirects outside this slice.

## 2026-07-15 — Midday Dashboard Home Route Cleanup

- Compared PlotKeys dashboard home with Midday's overview route composition.
- Removed the dashboard home route's unused `searchParams` / error banner wrapper so it now returns `HydrateClient` > `ScrollableContent` > `ErrorBoundary` / `Suspense` > `DashboardHome` directly, with the dev tenant FAB left as the existing sibling utility.
- Updated `syncTenantDomainsAction` to redirect back to plain `/` instead of `/?domains=1`, removing dead home-route URL state.
- Validation: focused scans found no remaining dashboard home `searchParams`, `DashboardHomePageProps`, `domains` / `error` query prop handling, or `/?domains=1` redirects; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for dashboard home and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Billing Route Notice Cleanup

- Compared PlotKeys billing with Midday's billing settings route, which composes billing modules directly without a page-header suffix or route-level success/failure banners.
- Renamed `BillingPageHeader` to `BillingHeader` and removed the billing route's `success` / `payment` banner wrapper so the page now returns `HydrateClient` > `ScrollableContent` > `ErrorBoundary` / `Suspense` > `BillingContent` directly.
- Updated billing callback and repair-payment redirects to return to plain `/billing` instead of `?success=1` / `?payment=...`; the `interval` query remains because it is still the active monthly/annual plan-toggle state.
- Validation: focused stale billing scan found no remaining `BillingPageHeader`, `BillingPageHeaderProps`, `success` / `payment` search-param props, billing success/failure banner copy, or `billing?success` / `billing?payment` redirects; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for billing content/header and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Estates Route Notice Cleanup

- Continued the non-table page cleanup by aligning the Estates index route with the direct composition used by migrated dashboard pages.
- Removed the `/estates` route-level `searchParams` error banner wrapper so the page now returns `HydrateClient` > `ScrollableContent` > `ErrorBoundary` / `Suspense` > `EstatesContent` directly.
- Renamed `EstatesPageHeader` to `EstatesHeader`, and updated estate creation failure handling so the action no longer redirects the index route through `?error=...` query state.
- Validation: focused scans found no remaining Estates index `searchParams`, `EstatesPageHeader`, `EstatesPageProps`, `/estates?error`, or estates error redirect references; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for Estates content/header and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Feature Header Naming Sweep

- Continued the non-table page cleanup by aligning Integrations and AI Credits feature headers with the migrated dashboard naming convention.
- Renamed `IntegrationsPageHeader` to `IntegrationsHeader` and `AiCreditsPageHeader` to `AiCreditsHeader`, removing another set of old page-header suffixes from active dashboard modules.
- Removed the redundant route-level flex wrapper around the AI Credits suspense boundary so the route now mirrors the direct `HydrateClient` > `ScrollableContent` > boundary/suspense > content composition used by migrated pages.
- Validation: focused stale header scan found no remaining `IntegrationsPageHeader`, `IntegrationsPageHeaderProps`, or `AiCreditsPageHeader` references; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the touched Integrations and AI Credits modules with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Domains Route Notice Cleanup

- Started the next non-settings page cleanup by comparing the Domains index route against the Midday route composition pattern already applied to migrated pages.
- Removed route-level query-string notice/banner handling from `/domains`, so the page now returns `HydrateClient` > `ScrollableContent` > `ErrorBoundary` / `Suspense` > `DomainsContent` directly.
- Updated domain sync/connect/remove success redirects to return to plain `/domains` instead of `?synced=1`, `?connected=1`, or `?removed=1`, and renamed `DomainsPageHeader` to `DomainsHeader` to match feature-header naming used by migrated dashboard pages.
- Validation: focused scans found no remaining domains index `searchParams`, query notice copy, `DomainsPageHeader`, or domain success-query redirects; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for domains content/header and `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Integration Settings List Split

- Compared PlotKeys integration settings with the Midday settings-list ownership pattern used by notification settings.
- Replaced the route-level error/suspense ownership and old `IntegrationSettingsContent` aggregate with an `IntegrationSettingsList` wrapper that owns the Card, Card header/content, ErrorBoundary, and Suspense.
- Moved the client integration query, form fields, submit action, and skeleton into `integration-settings.tsx`, and retired the old `integration-settings-content` / `integration-settings-skeleton` files from the active settings route.
- Validation: focused stale aggregate scan found no remaining `IntegrationSettingsContent`, `integration-settings-content`, or `integration-settings-skeleton` references under `apps/dashboard/src`; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the new integration settings list/settings modules with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Notification Settings List Split

- Compared PlotKeys notification preferences with Midday's `NotificationsSettingsList` / `NotificationSettings` split.
- Replaced the route-level error/suspense ownership and old notification table-card aggregate with a `NotificationPreferencesSettingsList` wrapper that owns the Card, Card header/content, ErrorBoundary, and Suspense like Midday.
- Moved the client query, row rendering, and skeleton into `notification-preferences-settings.tsx`, and retired the older `notification-preferences-content`, `notification-preferences-table-card`, and standalone skeleton modules from the active notifications settings route.
- Validation: focused stale aggregate scan found no remaining `NotificationPreferencesContent`, `NotificationPreferencesTableCard`, `NotificationPreferencesSkeleton`, or old file-path references under `apps/dashboard/src`; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for the new notification settings list/settings modules with only the known Better Auth base-url warning.

## 2026-07-15 — Midday General Settings Direct Modules

- Compared PlotKeys general settings with Midday's route-level settings composition.
- Removed the general settings `SettingsContent` client aggregator, unavailable-state wrapper, and settings skeleton module so `/settings` now composes the settings cards directly inside `HydrateClient` with the Midday `space-y-12` module stack.
- Moved the prefetched company settings query ownership into the individual settings card components, matching Midday's independent settings-module pattern where each card reads the shared cached team/settings query.
- Validation: exact stale aggregate scan found no remaining `SettingsContent`, `settings-content`, `SettingsUnavailableState`, `settings-empty-states`, `SettingsSkeleton`, or `settings-skeleton` references in the general settings route/components; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `settings-sections.tsx` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Secondary Menu Shell Parity

- Compared PlotKeys `SecondaryMenu` and settings layout against Midday's settings layout and shared `components/secondary-menu.tsx`.
- Aligned the shared secondary menu component with Midday's item/props naming, hidden-scrollbar menu row, literal inactive link color, and class ordering while preserving PlotKeys' existing `@plotkeys/utils` `cn` source.
- Left `ScrollableContent` ownership in the PlotKeys settings layout intact because the PlotKeys dashboard shell uses page-level `ScrollableContent` for header-offset behavior, unlike Midday's parent layout.
- Validation: focused source scan confirmed the menu uses `scrollbar-hide` and `text-[#606060]` and no longer uses the muted-token inactive style; shared UI globals define `scrollbar-hide`; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `SecondaryMenu`.

## 2026-07-15 — Midday Settings Route Notice Cleanup

- Compared PlotKeys settings routes against Midday's general and notifications settings routes.
- Removed the remaining settings route-level `searchParams` banner wrappers from General Settings and Integration Settings so all settings child routes now return `HydrateClient` with their error boundary/suspense content directly.
- Updated the settings profile and integrations server actions to redirect back to plain `/settings` and `/settings/integrations` instead of appending `saved=1`, keeping success state out of the route shell like Midday's settings pages.
- Validation: focused source scan found no remaining settings-specific `saved` query redirects, settings saved banners, integration saved banners, or settings page `searchParams` handling; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for `app/actions.ts` with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Settings Card-First Module Cleanup

- Compared PlotKeys settings modules against Midday's general settings and notifications settings references.
- Removed the redundant `SettingsSection`, settings shortcut cards, notification summary grid, notification info footer, and integration/notification child section wrappers so settings modules now render as direct card-first modules inside the shared settings layout.
- Simplified settings, notification preferences, and integration settings skeletons to match the card-first loading structure rather than rendering page/header/section placeholder chrome.
- Validation: focused source scan found no remaining settings-section/shortcut/notification-summary/integration-section symbols in the settings slices; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed for client settings modules with only the known Better Auth base-url warning. A server page import probe was intentionally not used after confirming it trips the known `server-only` import boundary.

## 2026-07-15 — Midday Settings Child Header Cleanup

- Revisited settings child content after adding the Midday-style secondary settings layout.
- Removed redundant child page-header/back-navigation chrome from Notification Preferences and Integration Settings, letting the settings layout's secondary menu own section navigation.
- Deleted the now-unused notification preferences header module.
- Validation: focused source scan found no remaining `NotificationPreferencesPageHeader`, `notification-preferences-header`, `Settings module`, or `Back to settings` references in the settings child slices; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Settings Secondary Menu Layout Pass

- Compared PlotKeys settings routes with Midday's `settings/layout.tsx` and general settings page structure.
- Added a dashboard-local `SecondaryMenu` and `app/(app)/settings/layout.tsx` so the settings section owns the shared `ScrollableContent`, constrained width, and General / Notifications / Integrations tab row like Midday's settings area.
- Removed page-local `ScrollableContent` / max-width wrappers from Settings, Notification Preferences, and Integration Settings pages, and retired the redundant general `SettingsPageHeader`.
- Validation: focused source scan confirms only the settings layout owns `ScrollableContent` in the settings route tree, no `SettingsPageHeader` / `settings-header` references remain, direct trailing-whitespace scan passed, scoped `git diff --check` passed, and targeted Bun import probe passed for the new layout/menu and settings content with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Builder Template Class Composition Sweep

- Continued the Builder preview `cn` helper alignment by replacing remaining dashboard-owned `className={[...].join(" ")}` composition in Builder workspace/sidebar controls, Template Sandbox floating controls, and the dev FAB shell with the shared `cn` helper.
- Left non-class text joins, such as page-label generation, unchanged.
- Validation: focused builder/template/dev class-join scan now leaves only a non-class page-label text join; direct trailing-whitespace scan passed on touched modules; scoped `git diff --check` passed; targeted Bun import probe passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Builder Preview Class Helper Alignment

- Revisited the Builder preview panel after identifying its local `joinClasses` helper as dashboard-owned drift from Midday's `cn` helper pattern.
- Replaced `joinClasses` usage in `components/builder/builder-preview-panel.tsx` with the shared `cn` helper from `@plotkeys/utils` and removed the local helper.
- Validation: source scan found no remaining `joinClasses` usage under `apps/dashboard/src`; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed.

## 2026-07-15 — Midday Builder Preview Mobile Menu Chrome Cleanup

- Revisited the remaining high-signal dashboard style scan after the project boundary cleanup.
- Removed the custom `shadow-lg` treatment from the Builder preview mobile menu wrapper, leaving the template-driven border/background/radius behavior intact.
- Validation: focused stale-style scan now leaves only the selected-row `BottomBar` blur layer, which matches Midday's table bottom-bar reference; direct `shadow-lg` scan on `builder-preview-panel.tsx` is clean; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import probe passed.

## 2026-07-15 — Midday Project Create Form Boundary Cleanup

- Revisited project creation boundaries after the alias sweep found both the active sheet form and an old project-local create form.
- Deleted unused `components/projects/create-project-form.tsx`, leaving project creation owned by `components/forms/project-form.tsx` and `components/sheets/project-create-sheet.tsx`.
- Validation: exact stale symbol scan found no remaining `CreateProjectForm`, `create-project-form`, or local create-project schema references; active project form/sheet import scan confirmed `ProjectForm` remains wired through `ProjectCreateSheet`; direct trailing-whitespace scan passed on active project form/sheet files; scoped `git diff --check` passed; targeted Bun import probe passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Dashboard Alias Boundary Sweep

- Revisited remaining dashboard-local route-relative imports after the shell cleanup.
- Repointed auth, onboarding, settings logo upload, builder, template sandbox, project helper, and dev tenant FAB dependencies from `../` / `../../` paths to `@/` aliases for app actions, tRPC, hooks, stores, shared components, and cross-feature builder preview imports.
- Validation: full focused scan across `apps/dashboard/src/components`, `app`, `hooks`, and `store` found no remaining route-relative imports; direct trailing-whitespace scan passed on the touched modules; scoped `git diff --check` passed; targeted Bun import probe across the touched modules passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Dashboard Shell Boundary Cleanup

- Revisited dashboard shell ownership after the architecture-boundary scan found an unused `DashboardShell` compatibility wrapper.
- Deleted `components/nav/dashboard-shell.tsx`, leaving authenticated dashboard shell ownership with the active `(app)/layout.tsx` and `DashboardChrome` path.
- Repointed active nav chrome imports for dashboard navigation, sign-out, and session clearing to `@/` aliases instead of route-relative paths.
- Validation: exact source scan found no remaining `DashboardShell`, `dashboard-shell`, compatibility-wrapper, or route-relative import residue in the dashboard shell slice; direct trailing-whitespace scan passed on active layout/chrome files; scoped `git diff --check` passed; targeted Bun import check passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Project Detail Shim Retirement Pass

- Revisited Project detail feature boundaries after the table-folder import scan.
- Repointed `ProjectDetailContent` away from legacy project compatibility shims and onto the real form/content modules for budget lines, workers, payroll runs, and workforce lists.
- Deleted retired shim files: `project-budget.tsx`, `project-workers.tsx`, `project-payroll.tsx`, and `project-workforce.tsx`.
- Validation: exact shim import scan found no remaining imports of the retired project shim paths; exact file inventory found no remaining shim files; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import check passed.

## 2026-07-15 — Midday Dev FAB Shell Surface Cleanup

- Revisited the dashboard dev tools FAB after the static empty-state cleanup.
- Replaced the dev-only amber circular/shadow FAB trigger and shadowed translucent panel with plain `border-border` / `bg-background` token surfaces and a standard `rounded-lg` trigger.
- Replaced emoji marker/close glyph usage with a lucide tool icon and plain text close control while preserving the dev-only production guard, outside-click close, escape close, panel content, and trigger label behavior.
- Validation: focused stale-style scan found no remaining `rounded-full`, amber chrome, custom shadows, `bg-card`, blur, uppercase/tracking, or emoji/glyph residue in `dev-fab-shell.tsx`; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import check passed. A broader high-signal dashboard scan now leaves only tenant-preview mobile menu shadow and the intentionally retained Midday bottom-bar blur.

## 2026-07-15 — Midday Static Empty-State Icon Capsule Cleanup

- Revisited remaining static and detail empty states after the active table empty-state migration.
- Removed decorative circular icon capsules from Analytics, Billing history, AI Credits usage, Domains, Integrations, Settings, Reports, Estates, Live Preview, Blog detail, Estate detail, Project detail, Project Budget, and Project Workforce empty/not-found states.
- Preserved empty-state copy, action buttons, sheet openers, and navigation links while matching Midday's plain centered text/action empty-state pattern more closely.
- Validation: targeted decorative capsule scan found no remaining static/detail `size-10 rounded-full bg-muted` empty-state wrappers in dashboard components; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import check passed.

## 2026-07-15 — Midday Billing Reports Period Tab Surface Pass

- Revisited the remaining Billing and Reports period selectors after the auth surface cleanup.
- Flattened Billing interval tabs and Reports period tabs away from pill-shaped primary/outlined chrome to rectangular bordered link tabs with muted active/hover treatment.
- Updated the Reports loading skeleton period placeholders to match the rectangular tab shape.
- Validation: targeted stale-style scan found no remaining pill primary/outlined period tab chrome or `hover:bg-accent` residue in the touched Billing/Reports files; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import check passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday FlowShell Auth Surface Default Pass

- Revisited signup and verify-email flow surfaces after the standalone sign-in pass.
- Removed the remaining pill/card treatment from the shared `FlowShell` brand link and flattened signup/verify side-panel benefit rows from tinted mini cards into plain divider-list rows.
- Preserved tenant redirects, theme toggle placement, signup and verify forms, dev verification shortcut, and side-panel copy while moving auth flow chrome toward simpler Midday-style token surfaces.
- Validation: targeted stale-style scan found no remaining FlowShell/signup/verify arbitrary radius, pill wrapper, `shadow-card`, `shadow-sm`, `bg-card`, softened border, uppercase/tracking, or `primary-foreground/10` tinted-card residue; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import check passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Sign-In Surface Default Pass

- Revisited the standalone sign-in route against Midday's public login reference, which keeps the login form unframed instead of wrapping it in a custom card shell.
- Removed the remaining sign-in `Badge`/`Card` surface dependencies, the pill/shadow logo link chrome, card-colored helper rows, and the custom `shadow-card` oversized login frame.
- Kept tenant-aware redirects, create-workspace link behavior, theme toggle, helper copy, and `SignInForm` submission behavior intact while moving the page toward a plain text/form column composition.
- Validation: targeted stale-style scan found no remaining `Badge`, `Card`, pill logo, arbitrary radius, `shadow-card`, `shadow-sm`, `bg-card`, or softened border residue in `sign-in/page.tsx`; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import check passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Template Sandbox Floating Rail Surface Default Pass

- Revisited Template Sandbox floating configuration after the Builder chrome cleanup and removed the remaining dark custom rail surface.
- Replaced the rail shell, menu button, shared rail field rows, section labels, dividers, swatches, select popovers, toggle text, and secondary rail actions with plain token-driven border/background/text treatment.
- Preserved the fixed collapsible rail behavior, template/style/section controls, optimistic save behavior, live-site action, shuffle action, and config export action while letting shared select/switch/button primitives own default interaction chrome.
- Validation: targeted stale-style scan found no remaining `border-white`, dark `bg-white[...]`, `text-zinc`, `bg-zinc`, custom rail shadows, white focus rings, or swatch shadows in the Template Sandbox slice; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import check passed with only the known Better Auth base-url warning.

## 2026-07-15 — Midday Builder Preview Editor Chrome Pass

- Revisited `builder-preview-panel.tsx` after the dropdown and floating panel surface passes.
- Removed the custom `shadow-card` treatment from the focused section field editor popover so the editor surface relies on the plain border/background tokens.
- Flattened the Builder preview page switcher away from pill-shaped soft-primary chrome to rectangular bordered tabs with default muted active/hover treatment.
- Validation: targeted stale-style scan found no remaining field-editor `shadow-card`, preview switcher `rounded-full` pill, soft-primary active tab, or `hover:bg-background` switcher residue; direct trailing-whitespace scan passed; scoped `git diff --check` passed; targeted Bun import check passed.

## 2026-07-15 — Midday Builder Dropdown Surface Default Pass

- Revisited builder dropdown chrome after the floating config panel cleanup.
- Removed redundant border/background/radius/shadow classes from builder sidebar control and standalone template preview `DropdownMenuContent` wrappers.
- Kept only size, overflow, and padding overrides while letting the shared dropdown primitive own the default popover surface.
- Validation: targeted stale-style scan found no remaining `shadow-xl`, `shadow-card`, `bg-popover`, or dropdown-content border restatement residue in the touched builder dropdown files; targeted Bun import check passed; direct trailing-whitespace scan passed; scoped `git diff --check` passed. Broader builder scan now leaves only preview-panel-specific chrome for a separate pass.

## 2026-07-15 — Midday Builder Floating Config Panel Chrome Pass

- Revisited builder chrome after the modal pass and separated tenant-preview styling from dashboard-owned builder controls.
- Removed custom `shadow-[var(--shadow-soft)]` treatment from `FloatingConfigPanel`'s fixed rail and corner restore control.
- Changed the restore control from circular FAB styling to the standard `rounded-lg` token while preserving the collapsed/fab state behavior.
- Validation: focused stale-style scan found no remaining `shadow-soft`, `rounded-full`, `bg-card`, softened border, tracking, uppercase, or blur residue in `floating-config-panel.tsx`; targeted Bun import check passed; direct trailing-whitespace scan passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Modal Dialog Surface Default Pass

- Revisited dashboard modal surfaces after the stacked sheet passes.
- Removed redundant `border-border bg-background` overrides from `PublishConfirmationDialog` and `RecommendTemplatePanel`, letting the shared `DialogContent` primitive own the default border/background surface.
- Preserved the existing modal width, form controls, quick-fill action, profile summary, and publish/recommend flows.
- Validation: targeted stale-style scan found no remaining explicit modal `DialogContent` border/background overrides or card/badge/decorative residue in the touched modal files; targeted Bun import check passed; direct trailing-whitespace scan passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Customer Edit Sheet Action Header Parity Pass

- Revisited the remaining action-bearing Customer edit sheet header against Midday's customer edit sheet reference.
- Replaced the styled shared `Button` dropdown trigger with a plain `button` trigger while preserving the action menu, delete confirmation flow, and accessible label.
- Validation: targeted symbol scan confirmed the shared `Button` import/usage is gone from `customer-edit-sheet.tsx`; targeted Bun import check passed; direct trailing-whitespace scan passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Remaining Stacked Sheet Header Consistency Pass

- Revisited stack-mode create/invite/edit sheets after introducing `StackedSheetHeader`.
- Repointed Department create, Employee invite, Estate create, Estate launch edit, Leave Request create, Payroll Entry create, Project create, and Team invite sheets from inline `SheetHeader` title/description blocks to the shared `StackedSheetHeader`.
- Preserved the existing title and description copy while adding the same close affordance used by the earlier Agent, Appointment, Customer, and Property stacked sheet pass.
- Validation: targeted sheet scan confirmed those ordinary stack sheets now use `StackedSheetHeader`; the remaining `SheetHeader` hits are Customer edit's action-menu header and the Builder mobile drawer header; targeted Bun import check passed with only the known Better Auth base-url warning; direct trailing-whitespace scan passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Stacked Sheet Header Parity Pass

- Revisited stacked sheet headers after the page/header cleanup and compared against Midday's plain sheet-header/content composition.
- Added shared `components/stacked-sheet-header.tsx` for stack-mode sheet title, optional description, and close action.
- Repointed Customer create content plus Agent create/edit/invite, Appointment create, and Property create/edit sheets to the shared stacked sheet header.
- Removed duplicate domain-specific header modules: `agent-sheet-header.tsx`, `appointment-sheet-header.tsx`, `customer-sheet-header.tsx`, and `property-sheet-header.tsx`.
- Validation: targeted stale-symbol scan found no remaining imports or references to the retired sheet-header modules; targeted Bun import check passed with only the known Better Auth base-url warning; direct trailing-whitespace scan passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Notifications Team Header Parity Pass

- Revisited the remaining active header scan after the list header action cleanup.
- Converted Notifications unread/all tabs from Button tab chrome to the bordered link-tab treatment used by the migrated active list headers while preserving the mark-all-read domain action.
- Removed inline member/plan stats and the Billing upgrade navigation action from the Team header, keeping the header control group focused on search, column visibility, and invite-sheet controls.
- Validation: targeted Notifications/Team header import check passed with only the known Better Auth base-url warning; direct trailing-whitespace scan passed; scoped `git diff --check` passed; broad active-header scan found only a property detail status badge as remaining header `variant={...}` usage, which is domain state rather than list-header chrome.

## 2026-07-15 — Midday Active List Header Action Parity Pass

- Revisited active list headers after removing export controls and compared them against Midday's invoice header action group.
- Removed cross-page navigation buttons from Departments, Employees, Leave Requests, Payroll, and Projects headers so those control rows stay focused on search, column visibility, and open/create actions.
- Converted Blog, Leave Requests, and Payroll tab strips from `Button` tab chrome to the same bordered link-tab treatment used by the migrated Leads/Appointments/Employees/Projects headers.
- Validation: targeted active-header scan found no remaining `href="/reports"`, `href="/hr/employees"`, `href="/hr/departments"`, `ExportCsvButton`, `export*CsvAction`, or `rounded-full` residue in active `*header.tsx` files; targeted Bun import check passed for the touched headers; direct trailing-whitespace scan passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Active List Header Export Cleanup Pass

- Revisited active list headers against Midday's invoice header reference, where the header control row stays focused on search, column visibility, and open/create actions instead of export/download actions.
- Removed remaining CSV export controls from `components/leads-header.tsx`, `components/appointments-header.tsx`, and `components/employees-header.tsx`.
- Flattened Employees and Projects status tabs away from pill-shaped `Button` tabs and extra stats copy to the same bordered link-tab treatment used by the migrated Leads/Appointments headers.
- Validation: targeted header scan found no remaining `ExportCsvButton`, `export*CsvAction`, or `rounded-full` residue in active `*header.tsx` files; targeted Bun import check passed for the touched headers; direct trailing-whitespace scan passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Customer Type Boundary Pass

- Revisited Customers after the table-folder boundary scan found `CustomerEditSheet` importing a row type from `components/tables/customers/columns.tsx`.
- Moved the shared customer list row and status types into feature-owned `components/customer/types.ts`.
- Repointed the Customers table columns, Customers data table, and Customer edit sheet to the feature-owned type module so sheet/form behavior no longer depends on table column ownership.
- Validation: targeted symbol scan confirmed the old sheet-to-columns import is gone; focused non-table import scan found no remaining non-table component imports from `@/components/tables/*`; targeted Bun import check passed; direct trailing-whitespace scan passed for the touched files; scoped `git diff --check` passed for tracked touched files.

## 2026-07-15 — Midday Project Budget Workforce Feature Boundary Pass

- Revisited Project Budget and Project Workforce after the route-shell and table-folder boundary scans.
- Moved budget line-item rows/table header and budget empty states from `components/tables/projects/budget/*` into feature-owned `components/projects/project-budget-line-items.tsx` and `components/projects/project-budget-empty-states.tsx`.
- Moved workforce/payroll rows/table headers and workforce empty states from `components/tables/projects/workforce/*` into feature-owned `components/projects/project-workforce-rows.tsx` and `components/projects/project-workforce-empty-states.tsx`.
- Repointed `ProjectBudgetContent` and `ProjectWorkforceContent` to the new feature-owned helpers, leaving `components/tables/projects` focused on the Projects overview data table modules.
- Validation: targeted import scan found no remaining `components/tables/projects/budget` or `components/tables/projects/workforce` references; `components/tables/projects` now contains only overview table modules; targeted Bun import check passed; direct trailing-whitespace scan passed for the moved feature files and consumers; scoped `git diff --check` passed for the tracked deletes/import updates.

## 2026-07-15 — Midday Live Preview Route Shell Ownership Pass

- Revisited Live Preview route composition after the route-shell audit.
- Moved `ScrollableContent` ownership from `components/live/live-preview.tsx` into `apps/dashboard/src/app/(app)/live/page.tsx` so Live Preview now matches the dashboard-wide Midday route-owned shell pattern.
- Kept `LivePreview` responsible only for unavailable/ready content surfaces, preserving the published-site preview frame, header actions, and empty-state behavior.
- Validation: focused scan confirmed `ScrollableContent` now appears in the Live route and no longer in the Live Preview component; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Final Isolated App Surface Token Pass

- Revisited the final isolated app-owned surface hits after the shared shell/form cleanup.
- Normalized the sign-in helper notice from softened `border-border/70 bg-muted/20` and oversized radius to plain `border-border bg-background rounded-lg`.
- Normalized onboarding brand avatar chrome from softened border/shadow treatment to plain `border-border` while preserving upload/edit behavior and the editable pencil affordance.
- Replaced the Agents pending-invites wrapper and dev FAB panel `bg-card` surfaces with `bg-background`, preserving dashed invite framing and dev warning styling.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, blur, or shadow residue in the touched app-owned files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed. The only remaining global residue-scan hit is the selected-row `BottomBar` blur layer, which matches Midday's invoices/vault/core bottom-bar implementation exactly and is intentionally retained.

## 2026-07-15 — Midday Shared Shell Form Token Pass

- Revisited shared dashboard shell/form utility surfaces after the Builder and static row token cleanup.
- Normalized the dashboard sidebar skeleton divider and shared dashboard form footer divider from softened `border-border/60` to plain `border-border`.
- Replaced the FlowShell brand pill's `bg-card` treatment with `bg-background`, preserving the tenant signup/onboarding/verify-email shell layout, brand avatar, and header action behavior.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched shared shell/form files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Static Billing Domain Credits Row Token Pass

- Revisited the remaining static table row surfaces in Domains, Billing, and AI Credits after the broader card/table cleanup.
- Normalized DNS instruction rows, provisioned-domain rows, billing-history rows, and AI Credits usage rows from softened `border-border/50` row borders to plain `border-border`.
- Preserved the existing `hover:bg-muted` treatment, domain/DNS badges, billing status cells, credit usage values, and table layout behavior.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched Domains/Billing/AI Credits section files; targeted Bun import check passed with only the known Better Auth base-url warning; direct trailing-whitespace scan passed because the touched section files are currently untracked.

## 2026-07-15 — Midday Builder Residual Chrome Token Pass

- Revisited the remaining Builder chrome after the broader builder workspace, preview panel, and drawer cleanup.
- Normalized builder color swatch borders in the standalone template preview and sidebar controls from softened `border-border/50` to plain `border-border`.
- Normalized inline preview hover labels and preview chrome dividers from softened `border-border/80` / `border-border/60` plus shadowed pill treatment to plain `border-border` token surfaces while preserving the section focus/edit affordance and preview page chrome behavior.
- Validation: focused Builder stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, blur, or shadow-pill residue in the touched builder files; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Template Sandbox Rail Label Parity Pass

- Revisited Template Sandbox after the overview/index surface cleanup and focused on the remaining workbench rail chrome.
- Removed uppercase label treatment from the expanded floating rail section labels for Template, Style, and Sections.
- Replaced the floating configuration rail's arbitrary `rounded-[0.95rem]` radius with the standard `rounded-lg` token while preserving its fixed rail behavior, hover/focus expansion, and configuration controls.
- Validation: focused Template Sandbox stale-pattern scan found no remaining uppercase, arbitrary radius, softened border, `bg-card`, opacity background, tracking, or blur residue in the touched sandbox files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Notification Preferences Table Surface Parity Pass

- Revisited Notification Preferences after the earlier info-card cleanup and focused on the remaining event-routing table card, channel cells, and loading skeletons.
- Removed explicit softened border/card background overrides from the event notifications card, event routing rows, and notification preferences skeleton frames.
- Converted the decorative event-type badge chip in each notification row to plain muted text, keeping badges reserved for real domain state while preserving channel toggle behavior and immediate update forms.
- Normalized disabled channel toggle borders and hover treatment from softened opacity variants to plain `border-border`, `bg-background`, and `hover:bg-muted`.
- Validation: focused Notification Preferences stale-pattern scan found no remaining softened border, `bg-card`, muted-hover opacity, badge import/usage, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched feature files; targeted Bun import check passed with only the known Better Auth base-url warning; direct trailing-whitespace scan passed because these touched feature files are currently untracked.

## 2026-07-15 — Midday Project Detail Budget Workforce Surface Parity Pass

- Revisited the Project detail, budget, workforce, skeleton, and AI insight surfaces after the earlier project folder migration.
- Removed explicit softened border/card background overrides from Project detail section cards, project stat cards, budget summary/add-line cards, workforce add/run cards, budget/workforce table section frames, and project detail/budget/workforce skeleton frames.
- Normalized budget summary metric cells, workforce subsection dividers, and budget/workforce skeleton row dividers from softened `border-border/*` to plain `border-border`, while preserving project status badges, budget item counts, worker/payroll status badges, forms, and table row behavior.
- Repointed stale Project budget/worker/payroll shim exports from retired `components/tables/projects/*` modules to the new feature-owned project content modules so Project detail imports resolve through the current Midday-aligned feature boundary.
- Validation: focused project-folder stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, blur, or retired budget/workforce table re-export residue in the project page-family slice; targeted Bun import check passed; direct trailing-whitespace scan passed for the touched project files; scoped `git diff --check` passed.

## 2026-07-15 — Midday Estate Detail Body Surface Parity Pass

- Revisited the heavier Estate detail body after the Estates launch and skeleton surface cleanup.
- Removed explicit softened border/card background overrides from Estate detail metric cards, launch brief assets, feature cards, plan upload/layout cards, offer cards, inventory table frame, empty offer state, and purchase pipeline cards.
- Normalized nested payment-plan and detail panels from softened `border-border/60` dividers to plain `border-border`, while preserving estate publish-state badges, phase/title badges, layout status badges, listing status badges, dashed upload affordance, table behavior, and sheet actions.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the Estate detail body file; targeted Bun import check passed; direct trailing-whitespace scan passed because the touched Estate detail file is currently untracked.

## 2026-07-15 — Midday Estates Launch Skeleton Surface Parity Pass

- Revisited the lighter Estates list/launch surfaces before the heavier Estate detail body cleanup.
- Removed explicit softened border/card background overrides from Estate launch cards, Estate list skeleton cards, and Estate detail skeleton frames.
- Normalized Estate launch footer and metric cells from softened `border-border/60` to plain `border-border`, while preserving estate publish-state badges and navigation actions.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched Estates launch/skeleton files; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Live Preview Blog Detail Surface Parity Pass

- Revisited Live Preview and Blog detail after the overview card cleanup.
- Normalized the Live Preview published-site frame away from `bg-card` and custom shadow treatment to a plain `border-border bg-background` preview frame.
- Removed explicit softened border/card background overrides from the Blog detail edit card and skeleton frame, and normalized the Blog detail metadata divider from softened `border-border/60` to plain `border-border`.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, custom shadow, or blur residue in the touched Live Preview/Blog detail files; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday App Store Template Sandbox Overview Surface Parity Pass

- Revisited App Store and Template Sandbox overview/index surfaces after the Settings/Billing/Domain surface cleanup.
- Removed explicit softened border/card background overrides from App Store app cards, Template Sandbox configure/profile cards, and Template Sandbox skeleton frames.
- Normalized the App Store enabled-count divider from softened `border-border/60` to plain `border-border`, while preserving meaningful app status, plan, and sandbox profile badges.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched App Store/Template Sandbox overview files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Settings Card Surface Parity Pass

- Revisited Settings after the Billing/AI Credits default-card cleanup.
- Removed explicit softened border/card background overrides from Settings profile, workspace, branding, shortcut, and skeleton surfaces.
- Kept the Danger Zone's destructive border as the meaningful risk cue while removing its redundant card background override.
- Validation: focused stale-pattern scan found no remaining Settings softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched Settings files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Billing AI Credits Surface Parity Pass

- Revisited Billing and AI Credits after the adjacent overview/setup surface cleanup.
- Removed explicit softened border/card background overrides from the Billing current-plan card, non-current plan cards, repair-payment card, billing-history table frame, AI Credits top-up card, AI Credits usage table frame, and their skeleton frames.
- Normalized Billing and AI Credits table header rows from softened `border-border/60` to plain `border-border`, while preserving meaningful billing status, plan, feature, and amount cells.
- Kept the current Billing plan's selected-state emphasis through the existing primary border, but removed its redundant card background override.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched Billing/AI Credits files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Connect Domain Integration Settings Surface Parity Pass

- Revisited the Connect Domain and Integration Settings setup surfaces after the Domains/Integrations overview cleanup.
- Removed explicit softened border/card background overrides from the Connect Domain intake card, setup-step cards, DNS guidance card, Integration Settings cards, and Integration Settings skeleton frames.
- Removed decorative rounded icon-bubble wrappers from Connect Domain setup/guidance content and Integration Settings service cards, while preserving meaningful inline DNS record badges and form behavior.
- Converted the Connect Domain header provisioning status from badge chrome to plain muted text.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, rounded icon bubble, arbitrary radius, tracking, uppercase, or blur residue in the touched setup/settings files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Domains Integrations Overview Surface Parity Pass

- Revisited the Domains and Integrations overview surfaces after the Dashboard Home/Reports/Analytics default-card cleanup.
- Removed explicit softened border/card background overrides from the Domains control card, provisioned-domains table frame, Integration cards, and their overview skeleton frames.
- Normalized Domains overview table header rows from softened `border-border/60` to plain `border-border`, while preserving domain status badges, DNS instruction warning cards, integration status badges, actions, and table behavior.
- Validation: focused stale-pattern scan found no remaining softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched Domains/Integrations overview files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Dashboard Home Card Surface Parity Pass

- Revisited Dashboard Home after the Reports/Analytics card cleanup and compared its remaining overview surfaces with Midday's default card/token treatment.
- Removed explicit softened `border-border/* bg-card` overrides from Publishing Control, Quick Actions, Connected Domains, empty connected-domain card, and dashboard stat-link surfaces.
- Normalized the primary URL panel and Dashboard Home skeleton frames to plain `border-border bg-background` surfaces while preserving status badges, icon accents, quick actions, and navigation links.
- Validation: focused stale-pattern scan found no remaining Dashboard Home softened borders, `bg-card`, opacity backgrounds, arbitrary radius, tracking, uppercase, or blur residue in the touched Home files; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Reports Card Surface Parity Pass

- Revisited Reports after the static report table row normalization and compared the remaining report cards/skeletons with Midday's default `Card` surface pattern.
- Removed explicit `border-border/65 bg-card` overrides from Business Summary, Agent Performance, and Listings Performance report cards.
- Normalized summary metric cells from softened `border-border/70` to plain `border-border`, and aligned Reports skeleton placeholder frames to plain `border-border bg-background` surfaces.
- Validation: focused stale-pattern scan found no remaining Reports card/skeleton softened border, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched report files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Analytics Card Surface Parity Pass

- Revisited Analytics after the broader section/header migration and compared its cards with Midday's default `Card` surface pattern.
- Removed explicit `border-border/65 bg-card` card overrides from Analytics metric, chart, ranked-list, share, agent-performance, event-type, and recent-events cards so default `Card` styling owns those surfaces.
- Normalized Analytics inner list rows away from softened `border-border/55` panel borders to plain `border-border`, and aligned Analytics skeleton placeholders to plain `border-border bg-background` surfaces.
- Validation: focused stale-pattern scan found no remaining Analytics `border-border/65`, `border-border/55`, `bg-card`, opacity background, arbitrary radius, tracking, uppercase, or blur residue in the touched Analytics files; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Notification Preferences Info Surface Parity Pass

- Revisited the Notification Preferences info surface after the broader header, summary, and modal badge cleanup.
- Removed the card wrapper, decorative icon bubble, `Sparkles` icon import, and migration-facing "Midday direction" copy from `notification-preferences-empty-states.tsx`.
- Renamed the component from `NotificationPreferencesInfoCard` to `NotificationPreferencesInfo` and updated its content owner import/use so the module name matches its plain informational role.
- Validation: focused stale-pattern scan found no remaining card/icon/migration-copy residue in the info module; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed for tracked docs, while the touched notification-preferences files are currently untracked so direct trailing-whitespace and stale-pattern scans were used for them.

## 2026-07-15 — Midday Static Table Row Surface Parity Pass

- Compared remaining static report/project subtable row surfaces with Midday's flatter table token treatment.
- Normalized Reports static tables and Project Budget/Workforce subtables away from softened `border-border/70` borders and low-opacity `hover:bg-muted/35` row hovers to plain `border-border` and `hover:bg-muted`.
- Preserved meaningful domain badges inside row cells, including budget categories, worker status/pay basis, and payroll run status.
- Validation: focused stale-pattern scan found no remaining softened border or muted-hover table row residue in the touched static table files; targeted Bun import check passed; direct trailing-whitespace scan passed for the untracked Reports table file and touched Project subtable files; scoped `git diff --check` passed for the tracked Project subtable files.

## 2026-07-15 — Midday Recommendation Modal Result Parity Pass

- Compared the remaining recommendation modal result state with Midday's plain dialog content treatment.
- Removed `Badge` and `Card` dependencies from `components/modals/recommend-template-panel-modal.tsx`.
- Replaced the tinted updated-profile card and badge list with a plain bordered definition-list summary that preserves the segment, design intent, and conversion focus values without decorative modal chrome.
- Validation: focused stale-pattern scan found no remaining badge/card imports, profile result badges/cards, tinted primary result surfaces, softened border opacity, decorative blur, arbitrary radius, tracking, or uppercase residue in the recommendation modal; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Builder Drawer Sheet Badge Parity Pass

- Compared the builder mobile settings drawer with Midday's plain sheet header/content pattern after the adjacent builder chrome cleanup.
- Removed the remaining `Badge` dependency from `components/sheets/builder-sidebar-drawer.tsx`.
- Converted builder drawer configuration status, editable-field count, and section count from badge chrome to plain muted text while preserving the URL-owned drawer state, builder controls, and active configuration summary.
- Validation: focused stale-pattern scan found no remaining `Badge` usage, card/translucent surface residue, softened border-opacity, decorative blur, or oversized arbitrary radius in the builder drawer; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Non-List Page Header Badge Parity Pass

- Compared adjacent non-list feature headers with the same Midday header-control principle: page chrome should stay plain and reserve badges for real row, table, card, or content state.
- Replaced top-level header badge chrome with plain text in Domains, Billing, Integrations, and Live Preview while preserving their status/count copy, interval links, configuration action, and builder navigation.
- Removed now-unused `Badge` imports from those non-list feature headers.
- Validation: focused stale-symbol scan found no remaining `Badge` imports/usages in the touched non-list headers; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Active List Header Control Parity Pass

- Compared active list headers against Midday's invoices/customers header pattern, where the first row stays focused on search plus column/open/action controls instead of extra count/date badge chrome.
- Removed remaining decorative header count/date badges from Blog, Leave Requests, Payroll, and Notifications list headers while preserving their domain filter tabs, period tabs, column visibility controls, create/open actions, and mark-all-read action.
- Removed now-unused `Badge` imports from those active list headers and dropped the unused Payroll period formatter import after the period label moved out of the control row.
- Validation: focused stale-symbol scan found no remaining `Badge` or `formatPayrollPeriod` usage in the touched headers; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Builder Chrome Residue Parity Pass

- Re-scanned the active builder chrome for leftover non-Midday dashboard surface treatments after the earlier builder passes.
- Removed remaining decorative `Studio` badge chrome from the builder workspace sidebar, standalone template preview sidebar, and floating config rail.
- Flattened the builder workspace control strip, standalone template preview frame, preview panel frame, field editor popover, floating config rail, and builder dropdown surfaces away from translucent/card-colored backgrounds, oversized rounded shells, decorative blur, and softened border-opacity treatments.
- Converted remaining builder chrome-only pill labels for current page, builder mode, and preview section count into plain text so status badges remain reserved for real domain state.
- Validation: focused stale-pattern scan found no remaining targeted `Studio`, oversized builder radius, translucent builder panel backgrounds, muted preview body, softened border-opacity, or muted-opacity hover residue in the touched builder files; targeted Bun import check passed with only the known Better Auth base-url warning; scoped `git diff --check` passed.

## 2026-07-15 — Midday Summary Card Surface Parity Pass

- Compared active summary modules with Midday's `InvoiceSummary` / `CustomerSummary` card pattern, where `Card` defaults own the surface instead of feature modules restyling cards with explicit `bg-card` and softened border opacity.
- Removed explicit `bg-card` / `border-border/65` / `border-border/70` summary-card overrides from Payroll, Blog, Estates, AI Credits, and Notification Preferences summary modules.
- Removed decorative icon capsules from AI Credits and Notification Preferences summary cards so their metric cards match the simpler label/value/suffix structure used by the other Midday-style summaries.
- Validation: focused stale-pattern scan found no remaining explicit `bg-card`, softened border opacity, rounded icon capsules, lucide icon imports, or `icon:` metadata in the touched summary modules; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Sheet And Modal Surface Parity Pass

- Compared the remaining builder sheet/modal surfaces with Midday's plain `SheetContent`/`DialogContent` token treatment.
- Flattened `components/sheets/builder-sidebar-drawer.tsx` away from card-colored sheet chrome, decorative header badge, `border-border/70`, and emphasized muted panel surfaces while preserving URL-owned `builderSettings` sheet state and existing builder controls.
- Flattened `components/modals/publish-confirmation-dialog.tsx` and `components/modals/recommend-template-panel-modal.tsx` from card-colored dialog chrome to plain `bg-background` / `border-border` surfaces.
- Removed the decorative emoji from the re-recommend templates dialog trigger so the modal control matches the calmer dashboard action style.
- Validation: focused stale-style scan found no `bg-card`, `border-border/70`, decorative `Studio` header badge, modal emoji, `backdrop-blur`, linear-gradient, or tracking utilities in the touched sheet/modal files; targeted Bun import check passed; scoped `git diff --check` passed.

## 2026-07-15 — Midday Table Empty-State Parity Pass

- Compared active PlotKeys table empty states with Midday's invoices/customers empty-state pattern: local table module ownership, centered `mt-40` text block, simple `h2` heading, muted `text-[#606060]` description, and outline actions without decorative icon bubbles.
- Removed remaining lucide icon imports and rounded icon capsules from active true list-table empty/no-results states for Agents, Appointments, Blog, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, and Team.
- Normalized active no-results copy/actions from compact "Clear search" states to Midday-style "No results" / "Try another search, or adjusting the filters" / "Clear filters" buttons.
- Replaced Projects' icon-only empty-state create trigger with a text outline `Create project` action backed by the existing URL-owned project sheet params.
- Updated Blog's table empty state to import the feature-level `CreateBlogPostButton` from `components/blog-create-button` instead of the retired table-local create-button path, and allowed the shared create button to render as an outline action for Midday-style empty states.
- Validation: focused stale-pattern scans found no active table empty-state lucide imports, icon capsules, compact `min-h-72` wrappers, `h3` headings, "Clear search" copy, or retired Blog table-local create-button imports; targeted Bun import check passed for touched empty-state modules; scoped `git diff --check` passed.

## 2026-07-15 — Midday Header Utility Surface Parity Pass

- Compared PlotKeys `DashboardTopbar` with Midday's global `Header`, which keeps the app header as a 70px utility surface with mobile navigation on the left and notification/user utilities on the right.
- Removed the remaining topbar page-title, quick-link, company, role, and user badge chrome from `components/nav/dashboard-topbar.tsx` so page identity stays owned by page-level feature headers instead of the global shell.
- Added `components/nav/dashboard-user-menu.tsx` as a compact avatar-triggered user menu for account context, settings navigation, and sign-out, matching Midday's user-menu placement instead of exposing account labels as header pills.
- Preserved the existing `SiteNav.Header` primitive so the shell keeps its Midday-style 70px height, translucent background, mobile sidebar trigger, and scroll-transform behavior.
- Validation: focused stale-pattern scans found no remaining badge/quick-link/page-title chrome in the topbar, ASCII scan passed for the touched nav files, targeted Bun import check passed for `dashboard-user-menu.tsx` and `dashboard-topbar.tsx`, and scoped `git diff --check` passed.

## 2026-07-15 — Midday Table Selection And Bottom Bar Parity Pass

- Compared PlotKeys active list tables with Midday's invoices/vault table-selection pattern and kept selection state store-backed instead of local-only.
- Added a shared Midday-style select column/header helper under `components/tables/core` and wired selectable rows across Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team.
- Updated active table stores with row-selection state, table configs with a leftmost sticky `select` column, and column-order normalization so saved table settings keep `select` pinned first and `actions` pinned last.
- Mounted the existing Midday-style animated bottom bar for selected rows across active list tables with selected count and deselect-all behavior.
- Added shared selected-row bulk delete actions and wired them into Agents, Appointments, Departments, Employees, Properties, and Team using the domains' existing delete/remove server-action paths; Customers, Blog, and Projects use their existing client-side delete mutations.
- Added shared selected-row form actions for remaining non-delete bulk workflows: Leads can mark selected rows contacted/qualified, Leave Requests can approve/reject/cancel selected rows, Notifications can mark selected rows read, and Payroll can mark selected rows paid.
- Form-backed selected-row actions now clear row selection on submit so the animated bottom bar does not remain open with stale selected IDs after bulk operations.
- First data-column sticky metadata now uses Midday's `md:left-[50px]` offset behind the sticky select column while the select column remains `md:left-0`.
- Active table Suspense skeletons now use the shared Midday-style `TableSkeleton` instead of hand-rolled row placeholder blocks, and every true list-table skeleton declares the sticky `select` column plus its first domain column.
- Agents, Customers, and Properties skeletons now include the sticky select column in their existing `TableSkeleton` configuration; Properties also uses the Midday table skeleton row count of 25 rows.
- Validation: focused scans found no remaining active table with the old actions-only non-clickable set, no remaining empty selected-row action slots, confirmed form-backed bulk actions clear selection on submit, confirmed first data columns use `md:left-[50px]`, confirmed active table skeletons use `TableSkeleton` with `select` as the first sticky skeleton column, and scoped `git diff --check` passed.

## 2026-07-15 — Column Visibility Interaction Parity Pass

- Compared PlotKeys active column visibility controls with Midday's `invoice-column-visibility.tsx` pattern.
- Kept the feature-level, store-backed column visibility ownership because it matches Midday's per-feature header control pattern.
- Normalized active column visibility popover bodies from `max-h-[400px]` to Midday's `max-h-[450px]` across Agents, Appointments, Blog, Customers, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team.
- Validation: focused scan found no remaining `max-h-[400px]` column visibility popovers and scoped `git diff --check` passed.

## 2026-07-15 — Retired Table Settings Domain Cleanup

- Removed the stale `estates` table id from table settings and table configuration maps after the Estates launch page was moved to feature-owned card/list composition instead of a Midday data-table folder.
- Verified that retired non-data-table domains no longer appear in `components/tables`, `table-settings.ts`, or `table-configs.ts`; only true list-table domains and core table utilities remain wired to table settings.
- Validation: targeted table-settings/table-config scans found no stale retired domain entries, `components/tables` inventory contains only active data-table domains plus core utilities, and scoped `git diff --check` passed.

## 2026-07-15 — Feature State And Helper Cell Boundary Pass

- Moved feature-level skeletons and empty/info states for AI Credits, Billing, Domains, Estates, Integrations, Notification Preferences, and Settings out of `components/tables/*` into their feature folders.
- Moved remaining helper-cell/card modules for AI Credits, Billing, Domains, Estates, Integrations, Notification Preferences, and Settings out of table folders after those folders no longer contained real Midday data-table modules.
- Notification Preference event metadata now lives in the Notification Preferences feature folder instead of a table-folder constants module.
- Validation: stale import scans found no active imports from the retired non-data-table table folders, `components/tables` now lists only true list-table domains plus core table utilities, and scoped `git diff --check` passed.

## 2026-07-15 — Feature Sections And Summary Boundary Pass

- Moved feature-level summary cards, invite strips, static report tables, and section/card modules out of `components/tables/*` into feature-owned component files.
- Agents, Employees, and Team pending invite sections now live at top-level feature modules instead of table folders.
- AI Credits, Billing, Domains, Estates, Integrations, Notification Preferences, Settings, Payroll, Blog, and Reports now own their summary/card/static-table composition in feature folders; table folders keep only table-specific cells, columns, skeletons, empty states, data-table modules, table headers, and actions.
- Removed the obsolete `components/tables/reports` barrel after moving report cells, static report tables, and report empty states into `components/reports`.
- Validation: no `summary.tsx`, `invites.tsx`, non-data `table.tsx`, or report barrel files remain under `components/tables`; stale import scans found no moved feature modules imported from table paths; scoped `git diff --check` passed.

## 2026-07-15 — Header And Search Filter Feature Boundary Pass

- Moved remaining page-level headers for AI Credits, Billing, Domains, Estates, Integrations, Notification Preferences, and Settings out of `components/tables/*/table-header.tsx` into feature-level header modules.
- Moved active header-owned search filters for Agents, Appointments, Blog, Departments, Employees, Leads, Leave Requests, Notifications, Payroll, Projects, Properties, and Team out of table folders into top-level feature search-filter modules.
- Moved the Blog create button out of `components/tables/blog/create-button.tsx` into `components/blog-create-button.tsx`, matching the Midday pattern where feature headers import search filters and open/create controls from feature-level components.
- Validation: no `search-filter.tsx` or Blog `create-button.tsx` files remain under `components/tables`, stale import scans found no table-folder search/create imports, remaining table-folder `table-header.tsx` files export only `DataTableHeader`, and scoped `git diff --check` passed.

## 2026-07-15 — Table Folder Content Wrapper Retirement Pass

- Moved the remaining page-level `content.tsx` wrappers for AI Credits, Billing, Domains, Estates, Integrations, Notification Preferences, and Settings out of `components/tables/*` into feature-level component folders.
- Updated the affected dashboard routes to import feature-level content modules such as `components/billing/billing-content` and `components/settings/settings-content`.
- Converted the moved wrappers' relative imports back to explicit table-module imports, leaving `components/tables/*` focused on table headers, summaries, table bodies, skeletons, empty states, columns, and actions.
- Validation: `find apps/dashboard/src/components/tables -maxdepth 2 -name content.tsx` returns no files, stale route/import scans found no remaining imports from the retired table-folder content paths, and scoped `git diff --check` passed.

## 2026-07-15 — Detail And Settings Feature Folder Boundary Pass

- Moved Blog detail content/skeleton, Estate detail content/skeleton, and Integration Settings content/skeleton out of their table folders into feature-level `components/blog`, `components/estates`, and `components/integrations` modules.
- Moved the shared integration catalog from `components/tables/integrations/catalog.ts` to `components/integrations/integration-catalog.ts`, then updated integration table/header/card modules to import the feature catalog explicitly.
- Kept table-internal imports such as integration cards and estate table columns inside `components/tables/*`, while routes now import page-level owners from feature folders.
- Validation: stale-path scans found no imports from the retired Blog/Estate/Integration detail/settings owner paths or old integrations catalog path, the affected table folders no longer contain those owner files, and scoped `git diff --check` passed.

## 2026-07-15 — Project Page Content Folder Boundary Pass

- Moved Project detail, Project Budget, and Project Workforce page-level content owners from `components/tables/projects` into `components/projects`.
- Moved their matching route skeleton owners into `components/projects` so Suspense fallbacks live beside the page-level Project feature composition.
- Kept real Project table mechanics in `components/tables/projects`, including the overview table files and the budget/workforce row/empty-state submodules used by the moved content owners.
- Validation: route imports now point at `@/components/projects/project-*-content` and `project-*-skeleton`, a stale-import scan found no direct imports from the retired `components/tables/projects/{detail,budget,workforce}` owner files, the table folder root now contains only overview table files, and scoped `git diff --check` passed.

## 2026-07-15 — Page Content Naming Boundary Pass

- Renamed Blog detail, Estate detail, Integration Settings, Project detail, Project Budget, and Project Workforce page-level composition exports from `*Table` to `*Content`.
- Updated the corresponding dashboard routes to import and render the new `*Content` names.
- Preserved real table semantics: actual virtualized/list table modules still use `DataTable`, while report/list card components with table-specific behavior keep table-specific names.
- Validation: focused stale-symbol scan returned no old page-content `*Table` names or props, the new `*Content` imports/usages are present in routes and modules, and scoped `git diff --check` passed.

## 2026-07-15 — Explicit Content Module Architecture Pass

- Moved AI Credits, Billing, Domains, Estates, Integrations, Notification Preferences, and Settings table-folder `index.tsx` wrappers to explicit `content.tsx` modules.
- Renamed the wrapper exports from ambiguous `*Table` names to domain-specific `*Content` components where they own page-level feature composition rather than a data table.
- Updated the corresponding dashboard routes to import those explicit content modules instead of relying on table-folder directory entrypoints.
- Validation: `find apps/dashboard/src/components/tables -maxdepth 2 -name index.tsx` returns no files, route scans show no imports from the retired table-folder directory entrypoints, explicit `*Content` imports/usages are present, and scoped `git diff --check` passed.

## 2026-07-15 — Final Muted Residue Surface Flattening Pass

- Flattened Builder Template Preview style/color controls and browser bar away from muted translucent hover/header treatments.
- Flattened Subdomain preview and Settings logo upload placeholders away from muted translucent card backgrounds.
- Flattened the dev FAB shell away from translucent `bg-card/95`, decorative blur, and uppercase/tracking header typography.
- Validation: broad app/component scan for `tracking-[...]`, `tracking-wide`, `tracking-widest`, `bg-muted/30`, `bg-muted/40`, `backdrop-blur`, uppercase-tracking, and `bg-card/95` now returns only the shared table bottom bar blur, which intentionally matches Midday's invoices/vault/core bottom-bar reference; scoped `git diff --check` passed.

## 2026-07-15 — Auth Onboarding Flow Surface Flattening Pass

- Flattened sign-in shell logo link and login card label away from translucent `bg-background/80`, decorative blur, and uppercase tracking typography.
- Flattened tenant signup, verify-email, onboarding redirect, onboarding checklist, FlowShell, and onboarding brand avatar labels away from uppercase/tracking typography.
- Flattened onboarding side-panel checklist/company panels and notification demo panel away from muted translucent backgrounds.
- Validation: focused Auth/Onboarding/Flow scan returned no `tracking-[...]`, `tracking-wide`, `bg-background/80`, `bg-muted/30`, `bg-muted/40`, `backdrop-blur`, or uppercase-tracking hits in the touched auth/onboarding/demo files, and scoped `git diff --check` passed.

## 2026-07-15 — Residual Dashboard Token Opacity Flattening Pass

- Flattened Dashboard topbar and shared form footer away from translucent `bg-background/*` surfaces and decorative form-footer blur.
- Flattened Dashboard Home icon containers and skeleton icon placeholders away from oversized `rounded-[1rem]` radii.
- Flattened Connect Domain setup icons, Integration Settings icons, AI Credits summary icons, Notification Preferences summary/empty/status capsules, and Builder preview nav hover states away from translucent `bg-background/70` or `bg-background/80` treatments.
- Validation: focused residual token-opacity scan returned no `bg-background/70`, `bg-background/80`, `rounded-[1rem]`, or `backdrop-blur` hits in the touched dashboard/form/feature/builder paths, and scoped `git diff --check` passed.
- Note: the shared table bottom bar keeps Midday's intentional blur layer from the Midday invoices/vault/core bottom-bar reference.

## 2026-07-15 — Builder Preview Panel Surface Flattening Pass

- Flattened Builder Preview Panel framed shell and preview chrome away from translucent `bg-card/86`, `bg-background/88`, oversized rounded shells, and decorative blur.
- Flattened inline section hover badges and field editor popover away from translucent backgrounds, `bg-card/96`, oversized popover rounding, decorative blur, and uppercase tracking labels.
- Flattened the preview shell default nav and footer group label treatment away from blur/translucency and uppercase tracking typography.
- Validation: focused Builder Preview Panel scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `bg-card/86`, `bg-card/96`, `rounded-[1.35rem]`, `rounded-[1.1rem]`, `rounded-[1rem]`, `bg-background/70`, `bg-background/88`, `bg-muted/30`, `backdrop-blur`, uppercase-tracking, or `bg-popover/9*` hits, scoped `git diff --check` passed, and the same builder pattern scan returned no hits under `apps/dashboard/src/components/builder`.

## 2026-07-15 — Builder Chrome Surface Flattening Pass

- Flattened Builder workspace sidebar chrome away from translucent `bg-card/86`, oversized rounded shells, decorative blur, translucent active-configuration panels, and uppercase tracking labels.
- Flattened Template Preview outer shell, sidebar labels, dropdown popovers, publish row, and browser-bar label away from translucent backgrounds, decorative blur, muted translucent panels, and uppercase tracking labels.
- Flattened Builder sidebar control dropdown popovers and section labels away from translucent popover backgrounds, oversized rounded dropdowns, decorative blur, and uppercase tracking labels.
- Flattened Floating Config Panel header label away from uppercase tracking typography.
- Validation: focused Builder chrome scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `bg-card/86`, `bg-card/96`, `rounded-[1.35rem]`, `rounded-[1.1rem]`, `rounded-[1rem]`, `bg-background/70`, `bg-background/88`, `bg-muted/30`, `backdrop-blur`, uppercase-tracking, or `bg-popover/9*` hits in the touched builder shell files, and scoped `git diff --check` passed.

## 2026-07-15 — Live Preview Modals Budget Surface Flattening Pass

- Flattened Live Preview header labels and preview frame away from uppercase tracking labels, oversized rounded framing, and decorative blur.
- Flattened publish confirmation and template recommendation modals away from translucent `bg-card/96` dialog surfaces and muted translucent inner panels.
- Flattened Project Budget metric cells away from translucent `bg-background/50` panels.
- Validation: focused Live Preview/Modals/Project Budget scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `rounded-[2rem]`, `bg-background/50`, `bg-muted/30`, `backdrop-blur`, `bg-card/96`, or uppercase-tracking hits, and scoped `git diff --check` passed.

## 2026-07-15 — App Store Template Sandbox Connect Domain Surface Flattening Pass

- Flattened App Store header and app cards away from uppercase tracking labels and translucent card backgrounds.
- Flattened Template Sandbox index header, configuration card, generated-profile cards, loading skeletons, and floating config rail away from uppercase tracking labels, translucent card backgrounds, oversized rounded skeleton shells, and decorative rail blur.
- Flattened Connect Domain header, hostname intake card, setup-step cards, and DNS guidance card away from uppercase tracking labels and translucent card backgrounds.
- Validation: focused App Store/Template Sandbox/Connect Domain scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `rounded-[1.25rem]`, `bg-muted/30`, `backdrop-blur`, `bg-card/96`, uppercase-tracking, or `bg-background/55` hits, and scoped `git diff --check` passed.

## 2026-07-15 — Payroll Blog Estates Surface Flattening Pass

- Flattened Payroll summary cards away from translucent card backgrounds and uppercase tracking labels.
- Flattened Blog summary cards, Blog detail header, Blog detail form card, and Blog detail skeleton away from translucent card backgrounds, oversized rounded skeleton shells, and uppercase tracking labels.
- Flattened Estates summary cards, estate launch cards, estate metric cells, Estate detail local panels, and list/detail skeletons away from translucent card/background treatments, oversized rounded skeleton shells, and uppercase tracking labels.
- Validation: focused Payroll/Blog/Estates scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `rounded-[1.25rem]`, `rounded-[1rem]`, `bg-background/45`, `bg-background/50`, `bg-background/60`, `bg-muted/30`, `backdrop-blur`, `bg-card/96`, `hover:bg-muted/30`, uppercase-tracking, or `bg-background/55` hits, and scoped `git diff --check` passed.

## 2026-07-15 — Analytics Reports Surface Flattening Pass

- Flattened Analytics header, metric cards, chart cards, ranked/share cards, agent performance cards, recent-event cards, row panels, and loading skeletons away from uppercase tracking labels, translucent card/background treatments, and oversized rounded shells.
- Flattened Reports header, business summary card, report table cards, summary statistic panels, and loading skeletons away from uppercase tracking labels, translucent card/background treatments, and oversized rounded shells.
- Validation: focused Analytics/Reports scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `rounded-[1.25rem]`, `rounded-[1rem]`, `bg-background/45`, `bg-background/60`, `bg-muted/30`, `backdrop-blur`, `bg-card/96`, `hover:bg-muted/30`, uppercase-tracking, or `bg-background/55` hits, and scoped `git diff --check` passed.

## 2026-07-15 — Domains Integrations Home Surface Flattening Pass

- Flattened Domains header, control card, DNS record rows, provisioned-domain table shell, and skeleton surfaces away from uppercase tracking labels, translucent card backgrounds, oversized rounded shells, and muted translucent row hover states.
- Flattened Integrations overview cards, overview/settings headers, integration settings cards, and skeleton surfaces away from uppercase tracking labels, translucent card backgrounds, and oversized rounded shells.
- Flattened Dashboard Home header, publishing cards, quick-action cards, connected-domain cards, stat links, primary URL block, and loading skeletons away from uppercase tracking labels, translucent card/background treatments, and oversized rounded shells.
- Validation: focused Domains/Integrations/Home scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `rounded-[1.25rem]`, `bg-muted/30`, `backdrop-blur`, `bg-card/96`, `hover:bg-muted/30`, uppercase-tracking, or `bg-background/55` hits, and scoped `git diff --check` passed.

## 2026-07-15 — AI Credits Billing Surface Flattening Pass

- Flattened AI Credits header, summary cards, top-up card, usage table shell, and skeleton surfaces away from uppercase tracking labels, translucent card backgrounds, and oversized rounded shells.
- Flattened Billing header, current-plan cards, plan comparison cards, repair card, billing history table shell, and skeleton surfaces away from uppercase tracking labels, translucent card backgrounds, oversized rounded shells, and muted translucent row hover states.
- Validation: focused AI Credits/Billing scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `rounded-[1.25rem]`, `bg-muted/30`, `backdrop-blur`, `bg-card/96`, or `hover:bg-muted/30` hits, and scoped `git diff --check` passed.

## 2026-07-15 — Settings Notification Surface Flattening Pass

- Flattened Settings profile, workspace, branding, shortcut, and danger cards from translucent `bg-card/82` to tokenized `bg-card`.
- Removed exaggerated uppercase/tracking labels from Settings and Notification Preferences page headers, read-only fields, and summary metrics.
- Flattened Settings and Notification Preferences skeleton containers from oversized `rounded-[1.25rem]` translucent surfaces to simpler rounded-lg token cards.
- Flattened Notification Preferences info, summary, and event-routing cards to tokenized `bg-card`, and changed event rows from calculated rounded translucent backgrounds to simpler rounded-lg `bg-background` rows.
- Validation: focused Settings/Notification scan returned no `tracking-[...]`, `bg-card/82`, `bg-card/78`, `rounded-[1.25rem]`, calculated rounded row, `bg-background/55`, `bg-muted/30`, or `backdrop-blur` hits, and scoped `git diff --check` passed.

## 2026-07-15 — Project Subpage Surface Flattening Pass

- Flattened Project detail overview cards and metric cards from translucent `bg-card/82` surfaces to tokenized `bg-card`.
- Removed exaggerated uppercase/tracking utility labels from Project detail, Project Budget, and Project Workforce headers and metrics.
- Flattened Project Budget and Project Workforce table/form sections from oversized `rounded-[1.25rem] bg-card/82` containers to simpler rounded-lg token card surfaces.
- Aligned Project detail, budget, and workforce skeleton containers with the same flatter card treatment so loading states match the migrated surfaces.
- Flattened Project AI empty/result panels from muted translucent panels to tokenized `bg-card`.
- Validation: focused Project scan returned no `tracking-[...]`, `bg-card/82`, `rounded-[1.25rem]`, `bg-muted/30`, or `backdrop-blur` hits under the touched Project detail/budget/workforce/AI files, and scoped `git diff --check` passed.

## 2026-07-15 — Estate Property Builder Sheet Trigger Cleanup

- Added `hooks/use-estate-params.ts` support for `createEstate`, `editEstateLaunch`, and `estateSlug` URL state.
- Added `components/open-estate-create-sheet.tsx` and moved `components/sheets/estate-create-sheet.tsx` to URL-owned global sheet ownership through `GlobalSheets`.
- Added `components/open-estate-launch-details-sheet.tsx` and moved estate launch editing into the global `EstateLaunchDetailsSheet`, which now loads `workspace.getEstateDetail` by `estateSlug` only while open.
- Extended `hooks/use-property-params.ts` with URL-backed create defaults for `estateId`, `propertyLocation`, `propertyType`, and `returnTo`, then reused the global `PropertyCreateSheet` for estate detail add-listing actions.
- Updated Estate detail header, offer-card section, and inventory section to render `OpenPropertySheet` instead of mounting the old local `PropertySheet`.
- Removed the old local `components/sheets/property-sheet.tsx` module.
- Added `hooks/use-builder-params.ts` and converted the builder mobile sidebar drawer from `SheetTrigger` to URL-owned `builderSettings` state.
- Flattened the touched estate detail/table-header and builder drawer surfaces away from translucent `bg-card/*` classes, exaggerated tracking utilities, and card-like muted header blocks.
- Validation: focused scan returned no `SheetTrigger` references under `apps/dashboard/src/components/sheets`, no old estate/builder translucent-card or letter-spaced utility classes in the touched surfaces, and scoped `git diff --check` passed for the touched estate/property/builder sheet workflow files.

## 2026-07-15 — Projects Payroll URL-Owned Sheet Pass

- Added `hooks/use-project-params.ts`, `components/open-project-sheet.tsx`, and `components/sheets/project-create-sheet.tsx` so Project creation is URL-owned and mounted through `GlobalSheets`.
- Updated `ProjectsHeader` and the Projects empty state to render `OpenProjectSheet` instead of mounting the old local `ProjectSheet`.
- Added `hooks/use-payroll-params.ts`, `components/open-payroll-entry-sheet.tsx`, and `components/sheets/payroll-entry-create-sheet.tsx` so Payroll entry creation is URL-owned and mounted through `GlobalSheets`.
- Updated `PayrollHeader` to render `OpenPayrollEntrySheet` instead of passing period props into a local sheet trigger.
- Moved the active payroll period lookup into the global payroll-entry sheet through the current URL params, and changed active employee loading to run only while that sheet is open.
- Added `onSuccess` callbacks to `ProjectForm` and `PayrollEntryForm` for URL-param cleanup when submissions return without redirecting.
- Removed the old local trigger/sheet modules `components/sheets/project-sheet.tsx` and `components/sheets/payroll-entry-sheet.tsx`.
- Validation: focused stale local sheet scans returned no exact old `ProjectSheet` or `PayrollEntrySheet` references; remaining local-trigger sheets at that checkpoint were legacy property, estate create, estate launch details, and the builder drawer; scoped `git diff --check` passed for the touched Project and Payroll sheet workflow files.

## 2026-07-15 — Team Employee Leave URL-Owned Sheet Pass

- Added `hooks/use-team-params.ts`, `components/open-invite-member-sheet.tsx`, and `components/sheets/team-invite-sheet.tsx` so Team invite state is URL-owned and mounted through `GlobalSheets`.
- Added `hooks/use-employee-params.ts`, `components/open-invite-employee-sheet.tsx`, and `components/sheets/employee-invite-sheet.tsx` so Employee invite state is URL-owned and mounted through `GlobalSheets`.
- Added `hooks/use-leave-request-params.ts`, `components/open-leave-request-sheet.tsx`, and `components/sheets/leave-request-create-sheet.tsx` so Leave request creation is URL-owned and mounted through `GlobalSheets`.
- Updated `TeamHeader`, `EmployeesHeader`, and `LeaveRequestsHeader` to render dedicated open buttons instead of local sheet trigger components.
- Added `onSuccess` callbacks to the invite member, invite employee, and leave request forms so global sheets can clear URL params after successful non-redirecting submissions.
- Removed the old local trigger/sheet modules `components/sheets/invite-member-sheet.tsx`, `components/sheets/invite-employee-sheet.tsx`, and `components/sheets/leave-request-sheet.tsx`.
- Validation: focused stale local sheet scans returned no old `InviteMemberSheet`, `InviteEmployeeSheet`, or `LeaveRequestSheet` references; remaining local-trigger sheets are legacy property, estate create, estate launch details, payroll entry, project, and the builder drawer; scoped `git diff --check` passed for the touched sheet workflow files.

## 2026-07-15 — Dashboard Surface Typography And Decorative Cleanup

- Removed remaining negative tracking utility classes from dashboard metric values in analytics, AI credits, notification preferences, project detail, and estates summary surfaces.
- Flattened the onboarding brand avatar from a decorative gradient background to tokenized `bg-primary`.
- Flattened the sign-in page background from a radial gradient to plain `bg-background` and removed negative heading/card-title tracking.
- Validation: broad scan across `apps/dashboard/src/app` and `apps/dashboard/src/components` returned no old dashboard/sheet helper symbols, no decorative linear/radial background utility classes, and no negative tracking utility classes; scoped `git diff --check` passed for the touched files.

## 2026-07-15 — Sheets And Builder Drawer Midday Header Pass

- Replaced the remaining `DashboardSheetHeader` usage in employee invite, department, property, leave request, member invite, estate create, estate launch details, project, and payroll entry sheets with local Midday-style `SheetHeader` blocks.
- Removed `apps/dashboard/src/components/sheets/dashboard-sheet-layout.tsx` after verifying no dashboard source imports remained.
- Flattened builder side-panel and drawer headers by removing decorative linear/radial gradient backgrounds from `builder-template-preview.tsx`, `floating-config-panel.tsx`, `builder-workspace.tsx`, and `builder-sidebar-drawer.tsx`.
- Preserved existing forms, triggers, open/close behavior, and data queries while moving the visual/header ownership into each sheet surface.
- Validation: focused scans returned no `DashboardSheetHeader`, no `dashboard-sheet-layout`, no builder/sheet linear/radial gradient hits, and `git diff --check` passed for the touched sheet/builder files.

## 2026-07-15 — Dashboard Shell And Sidebar Midday Baseline Pass

- Updated `components/nav/dashboard-chrome.tsx` so the dashboard content column uses Midday's 70px sidebar offset and no longer renders the decorative radial background layer behind every page.
- Simplified `components/nav/dashboard-topbar.tsx` into a utility/action header, removing the page-title and secondary quick-link strip that diverged from Midday's `Header` shell.
- Updated `components/nav/dashboard-sidebar.tsx` to use a logo-first Midday-style rail header and simpler sign-out footer aligned to the 70px collapsed sidebar.
- Updated shared `packages/site-nav` shell dimensions from the previous 84px/272px rail to the Midday-style 70px/240px sidebar baseline.
- Reworked shared `site-nav` nav item and child-item surfaces toward Midday's flatter 40px main-menu rhythm, removing the rounded card-like active state and decorative active gradient.
- Validation: focused scans returned no old shell decorative radial/gradient classes, no old 84px/272px sidebar widths, no `DashboardPage`/`DashboardSection` primitive references, and `git diff --check` passed for the touched shell files.

## 2026-07-15 — Retired Old Dashboard Primitive Modules

- Removed `apps/dashboard/src/components/dashboard/dashboard-page.tsx` after all route, section, table, toolbar, and stat-grid consumers had been migrated to feature-owned Midday-style surfaces.
- Removed `apps/dashboard/src/components/dashboard/dashboard-empty-state.tsx` after all empty-state consumers had been migrated to local centered states.
- Validation: source-wide scan across dashboard app source areas returned no `dashboard-page`, `dashboard-empty-state`, `DashboardPage`, `DashboardSection`, `DashboardEmptyState`, `DashboardStatGrid`, or `DashboardTablePage` references, and scoped `git diff --check` passed for the touched files.

## 2026-07-15 — Template Sandbox Profiles Midday Header/Section Ownership Pass

- Migrated the Template Sandbox Profiles route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/template-sandbox/profiles/page.tsx`.
- Replaced the old `DashboardPageHeader`-based Template Sandbox Profiles header with a local header in `components/template-sandbox/template-sandbox-index.tsx`.
- Replaced Template Sandbox `DashboardSection` usage with a local generated-profile section while preserving profile creation, preview, clone, archive, and catalog/profile query behavior.
- Simplified `components/template-sandbox/skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Template Sandbox Profiles files, and `git diff --check` passed for the touched Template Sandbox Profiles files.

## 2026-07-15 — App Store Midday Header/Section Ownership Pass

- Migrated the App Store route shell to `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/app-store/page.tsx`.
- Replaced the old `DashboardPageHeader` / `DashboardPageToolbar`-based App Store header with a feature-owned local header and enabled-count toolbar row in `components/app-store/app-store-view.tsx`.
- Replaced App Store `DashboardSection` usage with local category sections while preserving app cards, plan gating, locked-app messaging, and `AppToggle` controls.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched App Store files, and `git diff --check` passed for the touched App Store files.

## 2026-07-15 — Blog Detail Midday Section Ownership Pass

- Migrated the Blog Detail route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/blog/[id]/page.tsx`.
- Replaced the old `DashboardPageHeader`-based Blog Detail header with a feature-owned local header in `components/tables/blog/detail.tsx`.
- Replaced shared alert usage for Blog Detail saved/created/status errors with local notice bands.
- Replaced the Blog Detail `DashboardEmptyState` dependency with a local centered not-found state.
- Replaced Blog Detail `DashboardSection` usage with a local edit-article section surface.
- Simplified `components/tables/blog/detail-skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses local skeleton surfaces.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Blog Detail files, and `git diff --check` passed for the touched Blog Detail files.

## 2026-07-15 — Payroll And Blog Summary Grid Ownership Cleanup

- Removed the remaining shared `DashboardStatGrid` dependency from `components/tables/payroll/summary.tsx`.
- Removed the remaining shared `DashboardStatGrid` dependency from `components/tables/blog/summary.tsx`.
- Replaced both summaries with feature-owned responsive metric grids that preserve the existing cards and query ownership.
- Removed negative letter-spacing from the touched summary metric values while keeping the same visual hierarchy.
- Validation: exact `DashboardStatGrid` / negative-tracking scan returned no results for the touched summary files, and `git diff --check` passed for the touched summary files.

## 2026-07-15 — Project Workforce Midday Section/Table Ownership Pass

- Migrated the Project Workforce route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/projects/[id]/workforce/page.tsx`.
- Replaced old `DashboardPageHeader`-based Project Workforce header with a feature-owned local header in `components/tables/projects/workforce.tsx`.
- Replaced Project Workforce `DashboardTablePage` usage with local table shells for site workers and payroll runs.
- Replaced Project Workforce `DashboardSection` usage with local `ProjectWorkforceSection` blocks for add-worker and create-payroll-run forms.
- Replaced shared alert usage for worker and payroll mutation errors with local destructive notice bands.
- Replaced the Project Workforce `DashboardEmptyState` dependency with a local centered not-found state.
- Simplified `components/tables/projects/workforce-skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Project Workforce files, and `git diff --check` passed for the touched Project Workforce files.

## 2026-07-15 — Project Budget Midday Section/Table Ownership Pass

- Migrated the Project Budget route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/projects/[id]/budget/page.tsx`.
- Replaced old `DashboardPageHeader`-based Project Budget header with a feature-owned local header in `components/tables/projects/budget.tsx`.
- Replaced Project Budget `DashboardSection` usage with local `ProjectBudgetSection` blocks for budget summary and add-line-item surfaces.
- Replaced `DashboardTablePage` / `DashboardTablePageHeader` / `DashboardTablePageBody` usage with a local table shell for BOQ line items.
- Replaced `DashboardStatGrid` usage in `BudgetSummary` with a local responsive metric grid.
- Replaced shared alert usage for budget line delete errors with a local destructive notice band.
- Replaced the Project Budget `DashboardEmptyState` dependency with a local centered not-found state.
- Simplified `components/tables/projects/budget-skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Project Budget files, and `git diff --check` passed for the touched Project Budget files.

## 2026-07-15 — Leads Actions Menu Parity

**What changed:**
- Continued Leads migration toward Midday's compact table row-action architecture.
- Added `components/tables/leads/actions-menu.tsx` for lead status advancement and qualified-lead conversion actions.
- Updated Leads columns so the sticky actions column renders a centered icon-only dropdown menu instead of wide inline form buttons.
- Shrunk the Leads actions column from the old wide inline-button area to the compact 80px sticky menu-column shape used by migrated table pages.
- Preserved current domain actions: mark contacted, mark qualified, mark closed, and convert qualified leads to customers.
- Focused validation passed for Leads actions-menu/columns/table imports, old inline-action cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Leads Route Header And DataTable Ownership Parity

**What changed:**
- Started the next dashboard table migration surface after Appointments: Leads.
- Removed the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/leads/page.tsx` and moved the route shell to `HydrateClient` > `ScrollableContent`.
- Added top-level `components/leads-header.tsx` with the Midday-style search-left/actions-right control row while preserving lead status tabs, column visibility, and CSV export controls.
- Updated the Leads route to compose `LeadsHeader` directly above `DataTable`, and removed the obsolete `components/tables/leads/index.tsx` wrapper module.
- Moved Leads infinite-query ownership, filter/sort interpretation, empty/no-results decisions, table settings, DnD, sticky columns, virtualization, and infinite scroll into `components/tables/leads/data-table.tsx`.
- Renamed the actual Leads data-table header module to the Midday reference path `components/tables/leads/table-header.tsx`, retiring the old table-folder page/table header module and interim `data-table-header.tsx` name.
- Replaced the split `hooks/use-leads-filter-params.ts` plus `lib/leads-filter-params.ts` pair with singular `hooks/use-lead-filter-params.ts`, which owns both the client hook and route loader.
- Replaced the old Leads loading fallback with a table-only skeleton using 25 rows and local table dimensions.
- Renamed Leads empty-state exports to local `EmptyState` / `NoResults`, with `NoResults` owning filter clearing instead of receiving an `onClear` prop from the wrapper.
- Focused validation passed for Leads filter/header/table/search/empty/skeleton imports, old wrapper/filter-name cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Appointments Global Create Sheet And Actions Menu Parity

**What changed:**
- Continued Appointments migration toward Midday's URL-owned global sheet and compact row-action patterns.
- Added `use-appointment-params.ts` for URL-owned `createAppointment` state.
- Added `OpenAppointmentSheet` as the Appointments header create trigger and replaced the old local `AppointmentSheet` usage in `AppointmentsHeader`.
- Added `AppointmentCreateSheet`, mounted it in `GlobalSheets`, and moved scheduling onto the shared `SheetContent stack` surface with `AppointmentSheetHeader`.
- Removed the old local `components/sheets/appointment-sheet.tsx` component from the active Appointments path.
- Added `components/tables/appointments/actions-menu.tsx` and changed the Appointments actions column from wide inline status/cancel buttons to a compact icon dropdown with confirm/complete, cancel, and delete actions.
- Shrunk the Appointments sticky actions column to the compact 80px menu-column shape used by the migrated table pages.
- Focused validation passed for Appointments params/open-sheet/global-sheet/actions/columns imports, old local sheet cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Appointments DataTable Query Ownership Parity

**What changed:**
- Continued Appointments migration toward Midday's route/header/table ownership model.
- Updated the Appointments route to compose `AppointmentsHeader` directly above `DataTable` inside `ScrollableContent`, matching the migrated Properties and Midday invoice route shape.
- Removed the obsolete `components/tables/appointments/index.tsx` wrapper module.
- Moved Appointments infinite-query ownership, filter/sort interpretation, empty/no-results decisions, table settings, DnD, sticky columns, virtualization, and infinite scroll into `components/tables/appointments/data-table.tsx`.
- Moved appointment stats query and status/upcoming tab state into `components/appointments-header.tsx`, keeping the route thin and preserving the appointment control row.
- Replaced the split `hooks/use-appointments-filter-params.ts` plus `lib/appointments-filter-params.ts` pair with singular `hooks/use-appointment-filter-params.ts`, which owns both the client hook and route loader.
- Renamed Appointments empty-state exports to local `EmptyState` / `NoResults`, with `NoResults` owning filter clearing instead of receiving an `onClear` prop from the table wrapper.
- Focused validation passed for Appointments filter/header/table/search/empty/skeleton imports, old wrapper/filter-name cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Appointments Route Shell And Header Ownership Start

**What changed:**
- Started the next dashboard table migration surface after Agents: Appointments.
- Removed the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/appointments/page.tsx` and moved the route shell to `HydrateClient` > `ScrollableContent`.
- Added top-level `components/appointments-header.tsx` with the Midday-style search-left/actions-right control row while preserving appointment status/upcoming filter tabs, column visibility, create sheet, and CSV export controls.
- Removed the old table-folder page/table header module from the active Appointments path.
- Removed `DashboardTablePage` and `DashboardTablePageBody` from the Appointments table path so the virtualized table renders directly.
- Renamed the actual Appointments data-table header module to the Midday reference path `components/tables/appointments/table-header.tsx`.
- Replaced the old Appointments loading fallback with a table-only skeleton using 25 rows instead of duplicating page and table shell skeletons.
- Focused validation passed for Appointments header/table/skeleton imports, old wrapper/header cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Agents Sheet Header And Invite Section Cleanup

**What changed:**
- Tightened the active Agents migration after the global sheet pass.
- Fixed the new `AgentSheetHeader` close button to use the actual shared icon namespace entry, `Icon.Close`, instead of a non-existent `Icon.X`.
- Removed the remaining old `DashboardSection` / `DashboardSectionHeader` / `DashboardSectionTitle` / `DashboardSectionDescription` usage from the Agents pending-invites surface.
- Reworked pending invites into a plain Midday-style local section with compact title/copy and a simple bordered list, keeping the existing revoke action and dev invite link behavior.
- Focused validation passed for Agents sheet/header/invite/table imports and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Agents URL-Owned Global Sheet Parity

**What changed:**
- Continued Agents migration toward Midday's global sheet and URL-param ownership pattern.
- Added `use-agent-params.ts` for `createAgent`, `agentId`, and `inviteAgent` state so Agents create/edit/invite flows are URL-owned instead of local component state.
- Added `OpenAgentSheet` and `OpenInviteAgentSheet` as dedicated header controls that open global sheets through URL params.
- Added `AgentCreateSheet`, `AgentEditSheet`, and `AgentInviteSheet`, mounted them in `GlobalSheets`, and moved them onto the shared `SheetContent stack` surface with `AgentSheetHeader`.
- Added `getAgentForCompany` in `packages/db/src/queries/agent.ts` and `workspace.getAgent` so the edit sheet can load by URL and use cached list rows as placeholder data.
- Updated the Agents row actions menu so "Edit agent" opens the URL-owned edit sheet instead of mounting a local row sheet.
- Removed the old local `AgentSheet` and `InviteAgentSheet` components from the active Agents path, and changed successful agent invites to return to `/agents` now that route-level invite alerts are retired.
- Focused validation passed for API/router, DB query, Agents global sheet modules, header/menu modules, old local-sheet cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Agents DataTable Ownership And Actions Menu Parity

**What changed:**
- Continued Agents migration toward the Midday route/header/table ownership pattern already used by migrated Properties.
- Updated the Agents route to compose `AgentsHeader`, pending invites, and `DataTable` directly inside `HydrateClient` > `ScrollableContent`, removing the obsolete table-folder wrapper module.
- Renamed the Agents table implementation to `components/tables/agents/data-table.tsx` and moved filter/sort/infinite-query ownership, empty/no-results decisions, table settings, DnD, sticky columns, virtualization, and infinite scroll into that module.
- Renamed the actual table header module to `components/tables/agents/table-header.tsx`, matching Midday's table folder naming.
- Replaced the split Agents filter hook/lib pair with singular `hooks/use-agent-filter-params.ts`, which owns both the client hook and route loader.
- Replaced shared dashboard empty-state usage with local Agents `EmptyState` / `NoResults`, with `NoResults` owning filter clearing.
- Added `components/tables/agents/actions-menu.tsx` and changed the Agents actions column from wide inline buttons to a compact icon dropdown; `AgentSheet` now accepts a custom trigger so the edit flow can live inside row menus without duplicating sheet internals.
- Focused validation passed for Agents hook/header/sheet/actions/table imports, old symbol cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Agents Header Control Row And Skeleton Parity

**What changed:**
- Continued Agents migration toward Midday's lean table header/control pattern.
- Added `components/agents-header.tsx` with search on the left and column visibility plus create/invite controls on the right.
- Removed the old table-folder `AgentsPageHeader` / `AgentsTableHeader` module and its dashboard header/table header primitives from the active Agents path.
- Updated the Agents table wrapper to render the new top-level `AgentsHeader` and removed the table-local title/count header from `AgentsDataTable`.
- Replaced the old dashboard-shell Agents loading fallback with a table-only `TableSkeleton` using 25 rows and sticky `agent` column configuration.
- Focused validation passed for Agents header/table/skeleton imports, old header wrapper cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Agents Route Shell And Table Wrapper Start

**What changed:**
- Started the next dashboard table migration surface after Properties: Agents.
- Removed the old route-level `DashboardPage` wrapper and route-level invite/error alert rendering from `apps/dashboard/src/app/(app)/agents/page.tsx`.
- Moved the Agents route shell to the Midday-style `HydrateClient` > `ScrollableContent` wrapper order, with `ErrorBoundary` and `Suspense` around the table content.
- Removed the old `DashboardTablePage` / `DashboardTablePageBody` wrappers from the Agents table path so the page stack can be decomposed into Midday-style header/table ownership in the next passes.
- Focused validation passed for Agents table imports, old wrapper symbol cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Filter Params Module Parity

**What changed:**
- Continued Properties/Listings migration toward Midday's combined filter hook/loader ownership pattern.
- Replaced the split `hooks/use-properties-filter-params.ts` plus `lib/properties-filter-params.ts` pair with a singular `hooks/use-property-filter-params.ts` module.
- Moved both `usePropertyFilterParams` and `loadPropertyFilterParams` into the hook module, matching the Midday invoice/customer URL-state pattern.
- Updated the Properties route, data table, search filter, and no-results empty state to use the new `filter` / `setFilter` naming.
- Removed the old plural hook and lib loader files from the active Properties path.
- Focused validation passed for the new filter module and Properties table/search/empty-state imports, old symbol cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Sheet Content Header Split

**What changed:**
- Continued Properties/Listings migration toward Midday's sheet wrapper/content/header ownership pattern.
- Added `PropertyDetailsContent` so `PropertyDetailsSheet` now owns only sheet open/close state while the content component owns `SheetContent`.
- Added `PropertyDetailsHeader` and moved listing title, subtitle, featured badge, and publish-state badge rendering out of the details body.
- Added reusable `PropertySheetHeader` and applied it to `PropertyCreateSheet` and `PropertyEditSheet`, removing duplicated close-button/header layout from those sheet modules.
- Focused validation passed for property sheet header/content modules, details sheet, create/edit sheets, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Sheet Media Management Start

**What changed:**
- Continued Properties/Listings migration by moving media management into the active Midday-style details sheet path.
- Extended `PropertyDetails` with `propertyMedia.listMedia` data, an add-media-by-URL form, and row actions for set cover and delete.
- Reused the existing `propertyMedia.addMedia`, `setCover`, and `deleteMedia` tRPC mutations, with focused invalidation for property detail, property media, and the properties infinite list.
- Kept the retired full-page upload server action removed; media management now lives in the sheet workflow instead of the old `/properties/[id]` page.
- Focused validation passed for `PropertyDetails` / `PropertyDetailsSheet` imports, retired upload/detail symbol cleanup, and scoped `git diff --check`.

## 2026-07-15 — Properties Full Page Detail Route Retired

**What changed:**
- Continued Properties/Listings migration away from PlotKeys full-page detail architecture and toward Midday's sheet-param workflow.
- Replaced `apps/dashboard/src/app/(app)/properties/[id]/page.tsx` with a protected redirect shim to `/properties?propertyId=<id>&details=true`.
- Updated analytics and estate-detail property links so normal dashboard navigation opens the Properties details sheet instead of the old full-page detail route.
- Removed the retired `components/tables/properties/detail.tsx` and `detail-skeleton.tsx` modules that depended on `DashboardPage` / `DashboardSection` primitives.
- Removed the now-unused `uploadPropertyMediaAction` server action and its asset upload import after retiring the old full-page media-management form.
- Focused validation passed for the redirect route, analytics/estate callers, server actions import, old symbol cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Create Edit Sheet Split

**What changed:**
- Continued Properties/Listings migration toward Midday's URL-owned global sheet architecture.
- Extended `use-property-params.ts` with `createProperty` so create/edit/details sheet state is controlled by URL params instead of local trigger state.
- Added `PropertyCreateSheet` and `PropertyEditSheet`, mounted them globally, and moved both onto the shared Midday-style `SheetContent stack` surface.
- Updated `OpenPropertySheet`, the Properties empty state, and the Properties row action menu to open create/edit sheets through URL params.
- Added `onSuccess` support to `PropertyForm` so create/edit sheets can close after successful server-action submission.
- Kept the legacy `PropertySheet` available for untouched Estate detail surfaces while removing it from the migrated Properties list path.
- Focused validation passed for the new property sheet modules, param hook, global sheet mount, action menu, empty state, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Row Click Details Sheet Parity

**What changed:**
- Continued Properties/Listings migration toward Midday's row-click detail workflow.
- Added `use-property-params.ts` for URL-owned `propertyId` / `details` sheet state.
- Added `PropertyDetails` and `PropertyDetailsSheet`, backed by the existing `workspace.getPropertyDetail` query and mounted through `GlobalSheets`.
- Updated the Properties table so non-action row clicks open the details sheet through `VirtualRow.onCellClick`, matching the Midday table interaction model.
- Reworked the Properties row action menu so "View listing" opens the same details sheet instead of navigating to the old full-page details route.
- Removed the nested title link from the primary listing cell so row click is the single detail-opening interaction.
- Focused validation passed for the new hook/details/sheet/table/action imports, old list-route link cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Row Actions Menu Parity

**What changed:**
- Continued Properties/Listings migration toward Midday's compact table row-action architecture.
- Added `components/tables/properties/actions-menu.tsx` for listing row controls, replacing the previous wide inline button strip in the actions column.
- Updated Properties columns so the sticky actions column renders a centered icon-only dropdown menu and shrinks from a wide action-button area to a compact 80px menu column.
- Preserved current listing domain actions: view listing, edit listing, feature/unfeature listing, and delete listing.
- Focused validation passed for Properties actions-menu/columns/data-table/skeleton imports, old inline-action cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties DataTable Query Ownership Parity

**What changed:**
- Continued Properties/Listings migration toward Midday's route/header/table ownership model.
- Moved Properties filter/sort/infinite-query ownership from the table-folder wrapper into `components/tables/properties/data-table.tsx`, matching Midday's table-owned query and empty-state decision pattern.
- Updated the Properties route to compose `PropertiesHeader` directly above `DataTable` inside the `ScrollableContent` stack, with the table remaining inside `ErrorBoundary` and `Suspense`.
- Removed the now-obsolete `components/tables/properties/index.tsx` wrapper module.
- Aligned `PropertiesSkeleton` with the Midday table fallback row count of 25 rows.
- Focused validation passed for Properties data-table/header/skeleton imports, old wrapper symbol cleanup, and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Empty State Ownership Parity

**What changed:**
- Continued Properties/Listings migration toward Midday table-folder component ownership.
- Renamed list empty-state exports from `PropertiesEmptyState` / `PropertiesNoResults` to Midday's local `EmptyState` / `NoResults` shape.
- Replaced the shared `DashboardEmptyState` wrapper in the Properties list table with the Midday-style centered empty/no-results layout.
- Moved clear-filter behavior into `NoResults` via `usePropertiesFilterParams`, so the table composition no longer owns reset behavior.
- Focused validation passed for Properties empty-state/table imports and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Header Control Row Parity

**What changed:**
- Continued Properties/Listings migration toward Midday's table-control header pattern.
- Replaced the old listings intro/header block with a lean `PropertiesSearchFilter` plus right-aligned column visibility and create controls, matching the Midday invoice/customer header shape.
- Added `OpenPropertySheet` as a dedicated icon-only create trigger and allowed `PropertySheet` to receive a custom trigger while keeping the existing sheet/form behavior intact.
- Removed now-unused `siteUrl` plumbing from the Properties route/table path because the Midday-style table header no longer owns CSV export or view-site actions.
- Focused validation passed for Properties header/open-sheet/sheet/table imports and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Table Wrapper Removal

**What changed:**
- Continued Properties/Listings migration toward Midday route/table composition.
- Removed the old `DashboardTablePage` / `DashboardTablePageBody` wrapper from `components/tables/properties/index.tsx`.
- `PropertiesTable` now returns the page-level `PropertiesHeader` and table/empty state directly, matching the thinner Midday page stack already used by the migrated Customers route.
- Focused validation passed for Properties table/header imports and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Header Ownership Parity

**What changed:**
- Continued Properties/Listings migration toward the Midday page/header/table file ownership model.
- Moved the page-level listings header from `components/tables/properties/table-header.tsx` to top-level `components/properties-header.tsx`.
- Renamed the actual table header module from `components/tables/properties/data-table-header.tsx` to `components/tables/properties/table-header.tsx`.
- Updated Properties table imports so page controls and table header controls now live in the same ownership locations used by the Midday table pattern.
- Focused validation passed for Properties header/table imports and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Properties Midday Route Shell Start

**What changed:**
- Began the next dashboard table migration surface after Customers: Properties/Listings.
- Removed the PlotKeys-specific `DashboardPage` wrapper and route-level URL error alert from `apps/dashboard/src/app/(app)/properties/page.tsx`.
- Moved the Properties route shell to Midday's `HydrateClient` > `ScrollableContent` wrapper order while keeping the existing `PropertiesTable` implementation for the next deeper table pass.
- Focused validation passed for Properties table/skeleton imports and scoped `git diff --check`; Better Auth emitted the existing missing base URL warning during import validation.

## 2026-07-15 — Customers Table-Only Skeleton Parity

**What changed:**
- Continued Customers migration toward Midday's customer table fallback architecture.
- Removed summary-card and header skeleton rendering from `components/tables/customers/skeleton.tsx` now that the route composes summary/header outside the table Suspense boundary.
- Reworked `CustomersSkeleton` to match Midday's table-only skeleton API shape with `columnVisibility`, `columnSizing`, `columnOrder`, `isEmpty`, `rowCount={25}`, sticky `name`, and actions column configuration.
- Focused client validation passed for Customers skeleton/data-table imports and scoped `git diff --check`; direct server page import remains blocked by the existing `server-only` package resolution issue.

## 2026-07-15 — Customers NoResults Clear Ownership Parity

**What changed:**
- Continued Customers migration toward Midday's local customer empty-state behavior.
- Moved no-results clearing behavior into `components/tables/customers/empty-states.tsx` so `NoResults` no longer receives an `onClear` prop from `DataTable`, matching Midday's component ownership.
- Kept PlotKeys' broader filter schema safe by clearing both customer URL params and customer filter params inside `NoResults`.
- Updated `DataTable` to render `<NoResults />` directly.
- Focused validation passed for customer empty-state/data-table imports and scoped `git diff --check`.

## 2026-07-15 — Customers Empty State Export And Layout Parity

**What changed:**
- Continued Customers migration toward Midday's customer table folder component shape.
- Renamed customer empty-state exports from `CustomersEmptyState` / `CustomersNoResults` to Midday's generic `EmptyState` / `NoResults` within `components/tables/customers/empty-states.tsx`.
- Replaced the PlotKeys shared `DashboardEmptyState` wrapper with Midday's local centered customer empty/no-results layout while preserving the PlotKeys `canManage` guard for the create-customer button.
- Updated the Customers `DataTable` imports/usages to the new Midday export names.
- Focused validation passed for customer empty-state/data-table imports, old-name cleanup, and scoped `git diff --check`.

## 2026-07-15 — Customers Summary Card Visual Parity

**What changed:**
- Continued Customers migration toward Midday's customer summary card presentation.
- Aligned Customer summary card title class ordering with the Midday reference.
- Updated `CustomerSummarySkeleton` dimensions to Midday's explicit `h-[32px]`, `h-[26px]`, and `h-[22px]` skeleton heights.
- Focused validation passed for Customer summary imports, old-pattern cleanup, and scoped `git diff --check`.

## 2026-07-15 — Customers Header Async And Icon Parity

**What changed:**
- Continued Customers migration toward Midday's header/open-button component details.
- Updated `CustomersHeader` to be an async server component like Midday's customer header while preserving PlotKeys' `canManage` create-action gate.
- Swapped `OpenCustomerSheet` from a direct lucide import to the shared `@plotkeys/ui/icons` namespace so the customer create trigger follows the same icon ownership pattern as Midday.
- Focused validation passed for Customers header/open-sheet imports and scoped `git diff --check`.

## 2026-07-15 — Customers Midday Filter Schema Parity

**What changed:**
- Continued Customers migration toward Midday's customer URL-state schema.
- Expanded `customerFilterParamsSchema` to include Midday's customer filter keys `sort`, `start`, and `end` alongside PlotKeys' domain-specific status `filter` and search `q`.
- Updated the Customers no-results clear action to reset every customer filter key now owned by `useCustomerFilterParams`.
- Preserved the existing shared `useSortParams` flow and backend status-filter semantics while matching Midday's broader customer filter helper shape.
- Focused validation passed for customer filter/table imports and scoped `git diff --check`.

## 2026-07-15 — Customers Midday Filter Params Parity

**What changed:**
- Continued Customers migration toward Midday's customer filter/search URL-state architecture.
- Renamed the Customers filter hook from `use-customers-filter-params.ts` / `useCustomersFilterParams` to `use-customer-filter-params.ts` / `useCustomerFilterParams`, matching Midday's singular customer helper naming.
- Collapsed the split route loader from `lib/customers-filter-params.ts` into the hook file as `loadCustomerFilterParams`, matching Midday's combined hook/loader module shape.
- Updated the Customers route and data table to use Midday's `filter` naming while preserving PlotKeys' supported `filter` and `q` URL keys.
- Removed the old plural hook and loader files from the active Customers path.
- Focused validation passed for filter hook/table/header imports, plural-reference cleanup, and scoped `git diff --check`.

## 2026-07-15 — Customers Midday Route Shell Parity

**What changed:**
- Continued Customers migration toward Midday's exact customer route shell.
- Removed the PlotKeys-specific `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/customers/page.tsx` so the route now returns `HydrateClient` > `ScrollableContent`, matching Midday's customer route wrapper order.
- Removed route-level success/error alert rendering and custom customer search-param wrapper fields from the Customers route; customer form mutation errors remain handled inside the form surface.
- Renamed the default page function to `Page` and simplified the route props shape to the Midday-style `searchParams: Promise<SearchParams>`.
- Focused validation passed for Customers client imports, route symbol cleanup, and scoped `git diff --check`.

## 2026-07-15 — Customers Midday Header Module Parity

**What changed:**
- Continued Customers migration toward Midday's customer route/header architecture.
- Renamed the page-level customer header module from `customer-header.tsx` / `CustomerHeader` to `customers-header.tsx` / `CustomersHeader`, matching the Midday customer reference.
- Removed the extra Customers CSV export button from the page header so the header control set matches Midday's search, column visibility, and create-sheet controls.
- Adjusted `OpenCustomerSheet` to use the same wrapper shape as Midday's open-customer sheet trigger while preserving PlotKeys' local icon export and permission-gated header usage.
- Focused validation passed for Customers header/open-sheet/table imports and scoped `git diff --check`.

## 2026-07-15 — Customers Midday Route Composition Parity

**What changed:**
- Continued Customers migration toward Midday's customer page route composition.
- Moved Customers summary cards, page header, error boundary, suspense fallback, and table composition directly into `apps/dashboard/src/app/(app)/customers/page.tsx`, matching Midday's customer route structure.
- Renamed the customer table export from `CustomersDataTable` to `DataTable`, matching Midday's `components/tables/customers/data-table.tsx` export name.
- Removed the extra `components/tables/customers/index.tsx` wrapper module because Midday's customer table folder does not use that intermediate composition layer.
- Focused client-table import validation passed; direct server page import remains blocked by the existing `server-only` package resolution issue in the server tRPC layer.

## 2026-07-15 — Customers Midday Columns Action Cell Parity

**What changed:**
- Continued re-anchoring Customers to Midday's actual customer table instead of the earlier invoice-table scaffold.
- Moved Customer row action rendering back into `components/tables/customers/columns.tsx` as an `ActionsCell`, matching Midday's customer columns file shape.
- Removed the extra `components/tables/customers/actions-menu.tsx` module that came from the interim invoice-style extraction.
- Preserved PlotKeys domain actions for edit, details, status changes, and delete confirmation while keeping mutation ownership in `CustomersDataTable`.
- Focused validation passed for Customers columns/data-table imports and scoped `git diff --check`.

## 2026-07-15 — Customers Midday Table Header File Parity

**What changed:**
- Continued Customers migration toward Midday's exact customer table filesystem shape.
- Restored the Customers table header module to the Midday path `components/tables/customers/table-header.tsx` and updated the Customers data table import away from the interim `data-table-header.tsx` name.
- Aligned the Customers infinite-scroll threshold and table width classes with the Midday customer table reference.
- Focused validation passed for Customers data-table/table-header imports and scoped `git diff --check`.

## 2026-07-15 — Customers Midday Sheet Stack And Cached Placeholders

**What changed:**
- Continued Customers migration toward Midday's customer sheet architecture.
- Added `stack` support to the shared `@plotkeys/ui/sheet` primitive so migrated sheets can use the same inset, bordered Midday sheet surface without rewriting every existing sheet at once.
- Moved Customer create and edit sheets onto `SheetContent stack`, including the Midday-style create-sheet header close action and edit-sheet action header layout.
- Added a shared dashboard list cache helper for looking up rows from cached infinite-query pages, then reused it for Customer detail and edit sheet placeholder data so reopening sheets can render from the list cache while `customers.getById` refreshes.
- Focused validation passed for customer sheet/detail imports, dashboard list/table-config tests, and scoped `git diff --check`.

## 2026-07-15 — Customers Midday Edit Sheet Split

**What changed:**
- Continued Customers migration toward Midday's customer-specific sheet architecture.
- Added a dedicated `CustomerEditSheet` that opens from `customerId` without `details`, matching Midday's create/details/edit URL-param split.
- Extended `CustomerFormContext` and `CustomerForm` so the same form can create new customers or update an existing customer through `customers.update`.
- Added edit and delete actions to the edit sheet header, while keeping create, details, and edit sheets mounted separately from global sheets.
- Focused validation passed for customer create/details/edit sheet imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Table Mutation Ownership Alignment

**What changed:**
- Continued re-anchoring Customers against Midday's actual Customers table architecture.
- Moved customer update/delete mutations and cache invalidation out of the row action menu and into `CustomersDataTable`.
- Passed row action handlers through TanStack table meta so columns/actions call table-owned behavior, matching Midday's customer table ownership pattern.
- Kept `ActionsMenu` as a presentational row-control component that opens details, dispatches status changes, and confirms deletion without owning tRPC/query hooks.
- Focused validation passed for customer action/table imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Actual Midday Table Correction

**What changed:**
- Re-anchored Customers against Midday's actual Customers table after using invoice-table behavior for earlier scaffolding.
- Removed the invoice-style select column, row-selection store state, selected-customer bottom bar, and selected CSV export from the Customers table.
- Updated Customers table config to match the customer-specific Midday shape: one sticky `name` column, actions as the only non-clickable action column, and 45px rows.
- Updated the Customers skeleton sticky configuration to follow the same single sticky `name` column.
- Focused validation passed for customer table imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Midday Summary Card Split

**What changed:**
- Continued Customers migration toward Midday's customer page summary architecture.
- Replaced the aggregate dashboard stat-grid summary with independent top-level summary card components that each own the shared `customers.stats` query through `useSuspenseQuery`.
- Added `CustomerSummarySkeleton` and reused it in the Customers loading shell, matching Midday's summary-card skeleton pattern.
- Removed the old Customers table-folder summary component so the page stack now composes summary cards, page header, and data table in the Midday style.
- Focused validation passed for customer summary/table imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Midday Header Search Alignment

**What changed:**
- Continued Customers migration toward Midday's customer page header/control architecture.
- Ported a local `SearchField` component using the Midday query-state search pattern for `q`, including Escape-to-clear behavior.
- Replaced the Customers page header's generic dashboard filter dropdown with the Midday-style search field plus compact right-side column/export/create controls.
- Removed the Customers-specific generic search-filter components and the now-unused `filters.customers` route prefetch from the Customers page.
- Reworked the Customers loading skeleton away from the old framed dashboard table shell and onto the shared table skeleton used by Midday-like table pages.
- Focused validation passed for customer header/skeleton/table imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Midday Page Shell Alignment

**What changed:**
- Continued Customers migration from the generic dashboard table shell toward Midday's customer page architecture.
- Added local `ScrollableContent` and `CollapsibleSummary` components that use the same `--header-offset` and `--header-transition` contract as Midday.
- Wrapped the Customers route content in `ScrollableContent` so the page stack moves with the scroll-collapsing header behavior.
- Removed the generic `DashboardTablePage` wrapper and table-local "All customers" header from Customers, leaving the Midday-style sequence: collapsible summary, page-level customer header, and data table.
- Focused validation passed for customer shell/table imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Midday Row Interaction Parity

**What changed:**
- Continued Customers migration toward Midday's invoice/customer table interaction model.
- Wired customer table row clicks through `VirtualRow.onCellClick` so non-action cells open the customer detail sheet from URL params, matching Midday's invoice detail routing.
- Kept the actions column non-clickable so action menus do not accidentally open the detail sheet.
- Ported the Midday `useScrollHeader` hook and enabled it for the Customers table with the summary-grid offset, so the page header/summary collapse behavior is driven by the same `--header-offset` contract as Midday.
- Focused validation passed for customer table/sheet imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Midday Detail Sheet Routing

**What changed:**
- Continued Customers migration toward Midday's URL-param-driven sheet architecture.
- Added `customers.getById` as a membership-scoped tRPC query backed by the existing company-scoped `getCustomerById` database helper.
- Mounted separate `CustomerCreateSheet` and `CustomerDetailsSheet` components from global sheets, matching Midday's customer-specific sheet split.
- Added `CustomerDetails` and `CustomerDetailsSkeleton` so the action menu and row-click view-details routes open a real customer profile sheet instead of only mutating URL state.
- Updated Brain API endpoint and contract notes for the new customer detail query.

## 2026-07-15 — Customers Midday Actions Menu Extraction

**What changed:**
- Continued Customers migration toward the Midday invoices table architecture.
- Extracted customer row actions out of `columns.tsx` into a dedicated `actions-menu.tsx`, matching Midday's table-owned action menu split.
- Replaced inline status select/save/remove controls with a compact icon trigger, dropdown status submenu, view-details action, and destructive delete confirmation dialog.
- Kept customer mutation invalidation centralized in the action menu while slimming columns back toward declarative table configuration.
- Focused validation passed for customer table imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Midday Table Architecture Step

**What changed:**
- Continued the dashboard Midday migration on the Customers page, using Midday invoices as the structural reference.
- Split Customers controls into a page-level `CustomerHeader`, matching the Midday `InvoiceHeader` placement for search/filter, column visibility, export, and create-sheet entry.
- Added Midday-style customer row selection with a sticky select column, select-all header checkbox, row-selection store state, and a bottom action bar.
- Added selected-customer CSV export from the bottom bar so the bulk action surface is functional rather than decorative.
- Updated customer table sticky/non-reorderable config so the select and identity columns follow the shared table contract.
- Focused validation passed for Customers imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-15 — Customers Midday Sheet/Form Split

**What changed:**
- Continued the Customers page migration by splitting the create-customer sheet toward the Midday invoice sheet architecture.
- Added `CustomerFormContext` so form state is owned by a dedicated context layer instead of the sheet shell.
- Added `CustomerContent` and `CustomerSheetHeader` so sheet content, header copy, and form rendering have the same ownership split as Midday's invoice sheet/content/header pattern.
- Simplified the customer sheet wrapper to own open/close state and cache invalidation, while form/content files own the rendered workflow.
- Changed `OpenCustomerSheet` to a compact outlined icon trigger matching Midday's create-sheet button pattern.
- Focused validation passed for customer sheet/form imports, customer table imports, dashboard list/table-config tests, and `git diff --check`.

## 2026-07-12 — Project Brain Canonicalization

**What changed:**
- Migrated legacy `brain/` to canonical `.brain/`.
- Initialized the repository Brain contract by adding `AGENTS.md` with `.brain/` protocol instructions.
- Refreshed standard Brain docs for global personal coding-rule pointers, Prisma migration workflow, Midday structure conventions, and legacy Brain path references.

## 2026-07-12 — Local Ticket Mirror For Inline Editable Template Content

**What changed:**
- Mirrored GitHub issues #28-#34 into local ticket files under `.scratch/inline-editable-template-content/issues/`, preserving dependency order and blocker text.

## 2026-07-11 — Inline Editable Template Content Spec

**What changed:**
- Published GitHub issue #27 for governed inline text editing across the template registry, including editable/static copy boundaries, field-level AI generation metadata, tenant-context prompt enrichment, sandbox/template-mode template selection, and staged-versus-published configuration preservation across template switches.
- Anchored the spec to the existing template register direction: declared editable content keys are editable, dynamic data-source item text remains display-only, and Website/WebsiteVersion remains the staged/published configuration boundary.
- Broke #27 into ready-for-agent tracer-bullet tickets #28-#34. The current frontier is #28, followed by #29 and #30 once the canonical editable field contract lands.

## Current State (as of 2026-03-23)

### What's Built & Working
| Area | Status |
|------|--------|
| Onboarding (6 steps, resumable) | ✅ Done |
| Template catalog (45 templates) | ✅ Done |
| Billing/pricing (Paystack, 3 tiers) | ✅ Done |
| Auth (Better Auth, signup/signin) | ✅ Done |
| Builder (inline edit, publish, preview) | ✅ Done |
| Dark mode (ThemeProvider) | ✅ Done |
| Lead capture + dashboard | ✅ Done |
| Appointment scheduling + dashboard | ✅ Done |
| AI credits (ledger, smart-fill wired) | ✅ Done |
| Analytics (events, tracking, dashboard) | ✅ Done |
| Analytics expansion (top pages, traffic sources, property views, lead sources) | ✅ Done |
| Stock image marketplace | ✅ Done |
| Website/WebsiteVersion Phase 1-4 (reads) | ✅ Done |
| Section visibility toggles | ✅ Done |
| Domain auto-sync on onboarding | ✅ Done |
| **Dashboard sidebar navigation** | ✅ Done |
| Tenant domain management UI (`/domains`) | ✅ Done |
| Logo upload (`/settings`) | ✅ Done |
| Property/agent data binding | ✅ Done |
| Domain status surfaces (dashboard home) | ✅ Done |
| Email (Welcome + Verification + New Lead + Site Published) | ✅ Done |
| Notifications (event system, 10 types) | ✅ Done |
| Notification bell in header + preferences page | ✅ Done |
| SubmitButton adoption (6 forms) | ✅ Done |
| Jobs (custom queue, 4 handlers) | ✅ Done (Trigger.dev) |
| Listing categories & types | ✅ Done |
| Settings expansion | ✅ Done |
| Customer model + lead promotion | ✅ Done — current company-scoped customer records |
| Team invite accept flow | ✅ Done |
| HR module (Employee + Department models, pages) | ✅ Done |
| Invite-driven agent/employee onboarding | ✅ Done |
| CSV export actions + UI download buttons | ✅ Done |
| Leave management (submission + approval flow) | ✅ Done |
| Payroll page (monthly records + mark paid) | ✅ Done |
| Listing analytics card (property detail) | ✅ Done |
| Agent performance analytics | ✅ Done |
| Chat-bot | ✅ Done (LLM + Widget) |
| App Store (GA, FB Pixel, WhatsApp, Calendly) | ✅ Done |
| Custom domain purchase | ✅ Phase 1 Done — connection + search + DNS instructions |
| WebsiteVersion Phase 4 (writes) | ✅ Done |
| Template usage analytics (TemplatePicker) | ✅ Done |
| SEO & Meta Tags (per-page title/description/OG) | ✅ Done |
| Blog/CMS Module | ✅ Done — model, editor, sections, rendering |
| **Plan-based template register** | ✅ Done — plan-owned register with active `riwaq-starter` template |
| **Template-owned UI system** | ✅ Done — Riwaq-owned pages, UI, hooks, and roadmap section wired by template key |
| **Template Registry M3 — Runtime Wiring** | ✅ Done — page inventory bridge, `resolvePage()`, builder wiring, ClickGuard + InlineOverview |
| **Template Registry M4 — Tenant-Site Integration** | ✅ Done — nav/footer shell, CSS var injection, inner-page routing, home-page simplification |
| Multi-page Website Support | ✅ Done — builder page selector + URL-backed page state |
| Customer Portal Foundation Planning | ✅ Done — central branded `/portal/*` route group implemented in tenant-site |
| AI-Powered Page Content Generation | ✅ Done — per-page AI content generation in builder sidebar (10 credits) |
| Template Differentiation | ✅ Done — current register direction uses concrete plan-owned templates instead of shared family variants |
| Preview-Safe Action Interception | ✅ Done — forms, buttons, and links safely intercepted in non-live modes |
| Builder UI Shadcn Standardization | ✅ Done — PickerButton, ChevronIcon, textarea, alert all use shadcn/ui primitives |
| Listing Overview Standardization | ✅ Done — shared route + query contract for public overview pages |
| Customer portal page-boundary planning | ✅ Done |
| Customer Portal Phase 1A (Auth + Route Guards) | ✅ Done — tenant-site portal signup/login, session cookies, and protected routes |
| Customer Portal Phase 1B (Saved Listings + Live Portal Data) | ✅ Done — public property save flow plus live `/portal/dashboard` and `/portal/saved` data |
| Construction Phase 2 (Budget, Workers, Payroll) | ✅ Done |
| Construction Phase 3 (Customer Visibility) | 🟡 Partial — staff-side controls and query layer exist; customer portal project routes still pending |
| Construction Phase 4 (AI & Integrations) | 🟡 Partial — AI summary/risk/customer draft live; BOQ/QS/design integrations pending |
| Tenant Onboarding Improvements | ✅ Done |
| Trigger.dev Job Integration | ✅ Done |
| Builder locked-template upgrade flow | ✅ Done |
| Pricing strategy refresh | ✅ Done |

## 2026-07-04 — Riwaaq Landing + shadcn Create-Style Sandbox Direction

**What changed:**
- Adopted the Dribbble `Rubbait - Discover Your Ideal Property` shot as the primary visual reference for Riwaq's starter landing page direction.
- Reworked the Riwaq landing page toward an image-led real-estate hero with editorial copy, property visual, floating detail card, metrics strip, and project-history teaser.
- Added a Rubbait-inspired discovery/search card to the Riwaq hero image with editable location, property type, budget, and CTA copy.
- Added lightweight visual markers to the Riwaq hero discovery rows so the card reads more like a polished property search surface without adding a new icon dependency.
- Increased the Riwaq hero media height and narrowed the discovery card at medium sizes to preserve the airy Rubbait-style composition and reduce overlap risk with the bottom detail card.
- Added registry content exposure through `RegistryProvider` so template-owned page components can read configured sandbox content instead of hardcoded copy.
- Updated template UI helpers to resolve through tenant `--pk-*` CSS variables, keeping public template UI shadcn-style while avoiding dashboard token leakage.
- Reworked the template sandbox workbench toward a full-screen viewer with a compact shadcn Create-style side config panel using standard `@plotkeys/ui` primitives.
- Expanded style preset support toward the shadcn Create-style set: Vega, Nova, Maia, Lyra, Mira, Luma, Sera, and Rhea, while retaining legacy `myra` resolution.

## 2026-07-05 — Floating Sandbox Config Rail + Inline Editable Riwaq Copy

**What changed:**
- Replaced the sandbox's right metadata drawer with a floating left config rail inspired by shadcn Create.
- The rail is expanded at rest, shrinks to icon-only after website preview scrolling, expands on hover/focus, and ignores its own scroll/dropdown interactions when deciding whether to collapse.
- Tightened the rail header toward the shadcn Create reference: a single rounded Menu control that collapses to the menu icon and expands to the full label.
- Made the floating rail Menu header a semantic focusable button with an accessible label and visible focus state, while preserving the same shadcn Create-style collapsed/expanded layout.
- Wired the floating rail Menu button into real panel state so it can pin the rail expanded or manually collapse it while preserving the auto scroll, hover/focus, and open-select expansion behavior.
- Updated the floating rail Menu control to cycle through automatic, pinned-expanded, and manually-collapsed states, with action-specific labels so users can return to the original scroll-responsive behavior.
- Tightened the rail footer commands so preset/action controls collapse to centered icons and expand to full rounded command buttons without hidden text taking space.
- Added a collapsed preset badge to the floating rail footer so icon-only mode still shows a compact `--` preset/code signal, with the full `--preset ...` value shown on hover/focus/expanded state and tooltip.
- Made the floating rail preset badge focusable and screen-reader labeled so keyboard users can reveal the full preset tooltip without treating the badge as a command.
- Tightened the rail body collapse so group headings and dividers are removed from layout in icon-only mode, with uniform icon spacing restored until hover/focus expansion.
- Added aria labels plus shadcn tooltip primitives to collapsed rail select triggers and footer icon commands so the icon-only state remains understandable to assistive tech and hover/focus users without duplicate native tooltips.
- Added semantic labeling and expanded/collapsed state to the floating template configuration rail itself.
- Removed template name, company, market, subdomain, and plan tier from the visual configuration surface.
- Kept style controls focused on Style, Base Color, Theme, Chart Color, Heading, Font, Radius, Menu, and Menu Accent.
- Changed the floating rail controls to direct autosave selects, removing the extra per-row save/check button for a cleaner shadcn Create-like feel.
- Synced floating rail select state back to the server-refreshed theme value after autosave so the controls stay aligned with persisted configuration.
- Kept the floating rail expanded while portaled shadcn/Radix select menus are open, so choosing style options does not collapse the config panel after preview scrolling.
- Tightened the floating rail select-open marker so only the select field that actually opens a portaled menu sets and clears the global rail expansion attribute.
- Added per-select ownership to the floating rail open-marker attribute so a closing dropdown cannot accidentally clear a newer open dropdown's rail expansion state.
- Styled floating rail select menus with the same dark panel surface, subtle white border, and focused row state as the shadcn Create-inspired rail.
- Added checked-state styling to floating rail select menu rows so the current style/theme option remains visible in the dark dropdown even when it is not keyboard-focused.
- Split the floating rail style controls into shadcn Create-like groups: style/color controls, typography controls, then system/menu controls before the section visibility list.
- Reworked floating rail rows toward the shadcn Create layout: label/value text on the left, swatch/icon on the right, and icon-only cards when the rail is collapsed.
- Added swatch coverage for all registry base color systems in the floating rail so collapsed Base Color controls visually reflect neutral, stone, zinc, mauve, olive, mist, taupe, and slate.
- Made floating rail color swatches resolve named theme tokens, CSS color strings, and raw HSL token triples instead of falling back to gray when stored configs are not named options.
- Replaced the floating rail's hardcoded preset chip with a deterministic sandbox preset signature derived from the current template/style config, and wired Open Preset to the current draft sandbox URL.
- Wired the floating rail Shuffle command to a sandbox server action that uses existing `templateSandbox.updateThemeField` tRPC calls to randomize style, base color, theme/chart color, fonts, radius, and menu treatment.
- Wired the floating rail Get Code command to download a sandbox preset JSON export containing the current preset signature, template key, page, theme config, and rendered section types.
- Added stateful show/hide icons to floating rail section visibility controls so the collapsed rail distinguishes visible and hidden sections without requiring expanded labels.
- Replaced section visibility dropdowns with autosaving shadcn-style switch rows, keeping collapsed eye/hidden icons while giving expanded rail users a direct binary toggle.
- Expanded collapsed section-toggle hit targets by overlaying the hidden switch on the eye icon, so icon-only rail rows remain directly clickable before the panel fully expands.
- Kept section visibility switches keyboard-focusable while the rail is collapsed so tabbing into a section row expands the floating rail and reveals the shadcn-style toggle instead of requiring hover.
- Made the floating rail Heading and Font collapsed `Aa` previews render using the selected font family instead of a fixed generic serif face.
- Removed non-zero letter-spacing utility classes from the Riwaq template pages and sandbox rail headings so the template follows the current frontend typography rule while preserving hierarchy through size, weight, and spacing.
- Added section visibility controls to the rail through `sectionVisible.<sectionType>` theme updates and wired Riwaq page components to consume the saved visibility map.
- Established the page-config rule: route/shell/backend/tRPC resolves draft, sandbox live, tenant live, or dummy/dev data; template pages render normalized registry context.
- Added registry content commit plumbing so template-owned page components can save inline text edits through the sandbox/builder action path.
- Updated Riwaq page static copy to use `EditableText` for direct inline editing on the website surface across landing, blog, contact, roadmap, and the roadmap timeline section.
- Tuned editable text affordances so draft text reliably shows an edit cursor, strong hover border/ring, and stronger active editing focus state.
- Made the editable text hover border state explicit in the shared primitive so inline-editable copy shows a visible border and text cursor consistently across template pages.
- Strengthened the draft-mode editable text chrome with a clearer contrast stroke, hover ring, active edit ring, cloned line-box decoration, and forced text cursor so page copy visibly advertises inline editing.
- Added focusable draft-mode editable text with Enter/Space-to-edit behavior so the same border and edit cursor affordance works for keyboard users.
- Replaced the Riwaq hero discovery card's currency-specific budget glyph with a neutral stacked-bar marker so the template remains tenant- and market-agnostic.
- Extended Riwaq defaults toward the shadcn Create reference: Lyra, Taupe, Orange, Raleway, Lucide, and Radius None.
- Tuned the Riwaq landing defaults toward the Rubbait real-estate reference: search-led hero copy, warm near-black/off-white fallback palette, brown-tinted hero image overlay, and CTA routing that sends search to contact while keeping project history on the roadmap page.
- Aligned Riwaq's manifest default background and landing fallback to the Rubbait reference off-white `#ececec` while keeping near-black `#08090a` text and the brown-tinted hero image overlay.
- Added an editable Rent/Buy/Short-let mode selector to the Riwaq hero search card and declared all search-card content keys on the hero slot inventory so the registry metadata matches the rendered page.
- Tightened the Riwaq hero search filter rows with crisper white cards, larger icon pills, stacked uppercase labels/values, and CSS chevron markers so the card reads more like a real property discovery control.
- Replaced the Riwaq hero search card's handcrafted marker shapes with lucide `MapPin`, `Building2`, and `BarChart3` icons so the property discovery controls use standard icon primitives.
- Replaced the Riwaq hero search row's CSS-drawn chevron marker with lucide `ChevronRight` so the full search-card control surface uses the standard icon system.
- Added an editable floating hero status badge to the Riwaq image composition, with registered content fields and hero slot metadata so the Rubbait-inspired property surface has a stronger layered product feel.
- Added a compact bottom-right numbered page switcher to the template sandbox viewer, matching the shadcn Create preview pager pattern while keeping the floating rail focused on style and section controls.
- Added visual previews to the floating rail dropdown options so color, typography, radius, menu, and section choices carry the same shadcn Create-style swatch/icon language inside the open select menu.
- Fixed the floating rail style-control save loop by moving Style, Base Color, Theme, Chart Color, Heading, Font, Radius, Menu, Menu Accent, and section visibility updates onto the client tRPC `templateSandbox.updateThemeField` mutation with route refresh on success.
- Fixed the floating rail style-select interaction by raising the rail/dropdown stack above preview chrome and letting unsaved default options remain selectable while still showing the fallback shadcn Create-style label/icon.
- Removed the tooltip wrapper around floating rail select triggers so Radix Select owns pointer/focus behavior directly, while retaining accessible labels/titles for collapsed style controls.
- Added visible error feedback to floating rail style controls so rejected theme updates show a red rail row state and expanded error text instead of failing silently.
- Marked the public template sandbox entry and profile routes as dynamic with `revalidate = 0` so route refreshes after style/config mutations always re-read the latest sandbox profile data.
- Moved floating rail select dropdowns to Radix popper positioning beside the rail and simplified option text rendering so style/config rows are easier to select reliably while the rail floats over the preview.
- Added runtime CSS variables and data attributes for chart color, radius, menu style, menu accent, and style preset so registry templates can consume the sandbox style configuration directly.
- Expanded the Riwaq landing page's style-config consumption: preset spacing drives section/grid rhythm, radius controls hero/search/card rounding, menu style/accent controls hero pills, and chart color drives stat/timeline emphasis.
- Extracted Riwaq-local style helpers so plan-owned template pages share the same preset spacing, radius, and menu treatment logic instead of duplicating hardcoded classes.
- Updated Riwaq blog, contact, roadmap, and roadmap timeline rendering to consume the template UI resolver, so Style, Radius, Base Color, Theme, Chart Color, Heading, and Font changes carry beyond the landing page.
- Wired tenant-site `RegisterNav` to the resolved template config so Menu, Menu Accent, and Radius affect the actual public/sandbox navigation shell, not only decorative hero pills.
- Restored rich floating rail dropdown option rows with Radix `textValue` and added missing registered base color swatches for Ocean and Forest.
- Kept floating rail style selects interactive while autosave is pending and guarded optimistic state against stale mutation responses, so quick Style/Base Color/Theme/Font changes do not feel locked or get reset by an older save.
- Added a dashboard-local register preview shell to the builder/sandbox preview panel so template-owned nav/footer render around page components in the workbench, making Menu, Menu Accent, Radius, Base Color, and Theme changes visible before opening the public sandbox URL.
- Mirrored the register preview shell's desktop and native mobile nav behavior from tenant-site, including config-aware active links, CTA treatment, footer groups, and internal workbench page navigation.
- Normalized dashboard workbench preview config through the registry presentation resolver so Riwaq's default Lyra, Taupe, Orange, Raleway, menu, radius, and chart settings appear in the rail/preview before any sandbox overrides are saved.
- Normalized tenant-site shell config through template defaults before deserializing published theme JSON, keeping live register nav/provider style defaults aligned with sandbox and public sandbox rendering.
- Aligned Riwaq's default Theme and Chart Color with the Dribbble Rubbait palette by using `#522C1F` and `#907762`, and exposed both as named floating-rail options so sandbox users can select the reference colors directly.
- Added a first-class `rubbait` base color system from the Dribbble palette and made Riwaq default to it, with the explicit background override removed so the Base Color rail control can visibly change the page foundation.
- Added a safe read-time upgrade for untouched legacy default Riwaq sandbox profiles still on `taupe`/`orange`, so existing default sandbox URLs can pick up the new Rubbait palette without overwriting customized profiles.
- Normalized exact legacy Riwaq sandbox theme snapshots in tenant-site rendering, keeping draft and live `/sandbox/[shareId]` URLs aligned with the new Rubbait Base Color/Theme/Chart defaults even when older snapshots stored `taupe`/`orange`.
- Broadened the legacy Riwaq sandbox cleanup to clear only the stale `#ececec` background override on default profiles/snapshots, so Base Color changes are not masked after a profile has already moved away from the old Taupe/Orange defaults.
- Updated the section-registry manifest tests so Riwaq's contract now asserts the Rubbait base color system, brown/taupe accent defaults, and unmasked background behavior instead of the old Slate expectation.
- Hid the builder/browser chrome only in canvas-mode sandbox previews so `/template-sandbox/[profileId]` opens directly into the website surface with the floating config rail, while framed builder previews keep their existing header.
- Promoted `/template-sandbox/[profileId]` and its workbench root to a full `100svh` viewer so the sandbox matches the shadcn Create-style full-screen canvas instead of reserving old dashboard chrome space.
- Removed the one-option Icon Library row from the floating config rail so the visible shadcn Create-style controls stay focused on actionable style, typography, menu, radius, color, and section visibility settings.
- Tightened the floating rail select controls so Style/Base Color/Theme/Chart/Heading/Font keep a canonical fallback value, hold the rail open synchronously while a dropdown is open, use Radix highlighted option states, and derive Style options from the registry `stylePresets` source of truth.
- Updated the floating rail Base Color selector to render registry color-system swatches from each system's actual light background plus primary accent dot, making Rubbait Base Color visually distinct from Theme and Chart Color selections.
- Added a registry-level commit fallback to `EditableText`, so future template-owned pages can save inline text edits through the active `RegistryProvider` even when the template component does not pass an explicit `onCommit` prop.
- Strengthened the registry-local template UI primitives with shadcn-style button/input interaction states: cursor/select behavior, icon pointer guards, focus ring offsets, disabled cursor handling, and a focused contract test to keep those primitives aligned without adding a cross-package UI dependency.
- Hardened `WebsiteRuntimeProvider` so stale or unknown `colorSystem` keys fall back to Slate instead of producing an empty CSS variable set, preserving font/color/radius rendering even when a saved sandbox profile contains an invalid base color key.
- Confirmed Style, Base Color, Theme, Chart Color, Heading, Font, Radius, Menu, Menu Accent, and section visibility remain first-class sandbox controls, and wired them into an optimistic draft-theme bridge so selecting a value updates the registry preview immediately while still persisting through `templateSandbox.updateThemeField`.
- Replaced leftover inline editing glyph buttons with lucide `Pencil`, `Sparkles`, and `X` icons across the editable text/image affordances and runtime overview, keeping the sandbox personalization UI aligned with the standard shadcn/lucide control language.
- Hardened floating rail optimistic rollback semantics so style selects and section visibility toggles ignore stale mutation results and restore the last persisted value if the latest `templateSandbox.updateThemeField` save fails.
- Tightened floating rail select display so triggers render a clean current-value label beside the row icon instead of delegating display to Radix `SelectValue`, and added a checked-option left accent in dropdown menus to better match the shadcn Create rail.
- Kept floating rail style selects Radix-safe by letting dropdown pointer/keyboard events reach option rows while stopping trigger click bubbling and raising the dropdown layer above the website viewer.
- Completed the Riwaq contact page interaction surface by adding a template-UI submit button with editable copy, draft/live feedback messaging, matching content schema defaults, and contact-slot metadata for every rendered editable contact field.
- Hardened draft-mode inline editing so `EditableText` captures click events before they bubble into parent links or submit buttons, preventing accidental navigation/submission while personalizing template text.
- Aligned the Riwaq landing page with its manifest-declared home sections by rendering a compact template-UI contact/CTA band with editable copy, email/phone actions, and a contact CTA; the home sandbox rail now exposes `contact_section` and `cta_band` toggles for the page-component preview.
- Added a reusable Riwaq CTA band and rendered it on Blog, Contact, and Roadmap when `cta_band` is enabled, then exposed `cta_band` in each inner-page sandbox section list so the floating rail matches the manifest-declared page sections.
- Corrected the Riwaq landing story block to save inline edits into `story.heading`, `story.body`, and `story.ctaLabel` instead of reusing roadmap content keys, keeping rendered fields aligned with the manifest.
- Split Riwaq inner-page manifest header slots so Blog, Contact, and Roadmap declare the exact `blog.*`, `contact.*`, and `roadmap.*` copy fields their page components render, with a focused manifest contract test.
- Added a shadcn Select viewport slot and used it in the floating sandbox rail so popper dropdowns are no longer constrained to the trigger height, making Style, Base Color, Theme, Chart Color, Heading, Font, Radius, Menu, and Menu Accent choices easier to open and select.
- Added concise descriptions to floating rail style/base-color/color/font/radius/menu option rows so the expanded dropdown reads like the shadcn Create side config rather than a plain raw-value picker.
- Tokenized the Riwaq landing hero image overlay through `--pk-primary` with the Rubbait brown fallback, making Theme changes visible in the first-viewport image treatment while preserving the Dribbble reference palette by default.
- Replaced the floating rail Menu Accent generic sliders icon with a compact accent-pills preview so collapsed and dropdown rows distinguish `none`, `subtle`, and `strong` treatments visually.
- Fixed the sandbox blank-page root cause by declaring `lucide-react` as a direct `@plotkeys/section-registry` dependency, matching the registry-owned Riwaq pages and inline editing primitives that import lucide icons.
- Expanded the legacy Riwaq default sandbox migration so older default Slate/Blue/Inter profiles are upgraded to the current Rubbait base color, Rubbait Brown theme, Rubbait Taupe chart color, Raleway typography, and current Riwaq content defaults.
- Hardened the floating sandbox config rail scroll-state sync with direct preview-scroller attachment, mutation recovery, wheel/scroll sampling, and explicit state data attributes so collapse behavior can be verified against actual preview scroll position.
- Restored the floating rail to the requested expanded-at-rest behavior, then collapse-after-scroll behavior, with hover/focus expansion still available for icon-only mode.
- Removed the temporary canvas safe-inset behavior after review because it made the config panel read as docked; the sandbox rail remains a true floating overlay on the website surface.
- Changed the sandbox config rail from container-absolute positioning to viewport-fixed positioning so it remains visually floating over the website rather than reading as part of the workbench layout.
- Consolidated the floating rail's expanded-width and expanded-content class contracts so future rail edits preserve the shadcn Create-style overlay behavior without reintroducing layout docking.
- Tightened the floating rail's auto-collapse threshold so the panel shrinks almost immediately once the website preview starts scrolling, while keeping hover/focus expansion for configuration.
- Added a shared floating-rail row class contract for select and section-toggle controls so collapsed icon targets and expanded label/value rows keep the same shadcn Create-style geometry.
- Switched Riwaq blog-post cards to the registry link component so inner template links stay routed through the sandbox/tenant preview shell instead of bypassing template-aware navigation.
- Removed CSS-only hover/focus expansion paths from the floating config rail and added scroll-time hover suppression so website preview scrolling collapses the rail authoritatively; it now re-expands through rail state after pointer re-entry, focus, a pinned-open preference, or an open dropdown.
- Restored scrolling for the sandbox config controls by giving the floating rail body an explicit scrollable viewport and making the portaled config select viewport own option-list overflow.
- Removed the floating rail `--preset` badge and Open Preset action, leaving the footer focused on Shuffle style, Live Website, and Get Code; the sandbox detail route no longer resolves a base URL for the removed preset action.
- Compacted the floating config rail from a wide 17rem panel to a tighter 14.5rem panel with 56px collapsed width, 48px control rows, smaller icon frames, tighter spacing, and 36px footer actions.
- Replaced the floating rail body Radix ScrollArea with a native `overflow-y-auto` container and wheel propagation guard so the Style and Sections control list scrolls reliably inside the fixed overlay.
- Added a registry-owned template `Link` primitive with optional page metadata, routed sandbox/config links through `?page=...&path=...`, removed the floating page-number nav, and updated Riwaq links to reuse the shared registry component.
- Routed the dashboard preview shell nav/footer links through the same sandbox page-query href resolver, so Home, Roadmap, Blog, Contact, CTA, and footer links expose `?page=...&path=...` in template configuration mode.

**Verification note:**
- Scoped stale-reference search passed for the sandbox workbench.
- Scoped `git diff --check` passed for touched source and Brain files.

## 2026-07-03 — Midday Table Structure + Notification Dispatch Alignment

**What changed:**
- Replaced tenant public catch-all template routing with explicit App Router files for core, blog, listing-style, template-plan, roadmap, and utility/legal routes; shared behavior now lives in `apps/tenant-site/src/lib/tenant-page.tsx`.
- Added `apps/tenant-site/src/lib/tenant-route-map.ts` for route aliases, dynamic slug mapping, and active-template page support checks.
- Added `RegistryProvider` / `useRegistry()` in `packages/section-registry` and wired tenant layout initialization with tenant identity, template key, render mode, template config, and page capability info.
- Added `templatePages` / `templates` in `packages/section-registry` so future template-owned pages can resolve handles such as `templates.aboutPage.resolve(ctx)` with manifest-backed `{ Page, info }` metadata.
- Added registry-scoped query and mutation option builders that inject tenant/template/page/runtime scope, use dev mock resolvers outside live mode, and block live mutations in dev/preview unless explicitly mocked.
- Added template UI variant primitives for style-preset-driven button, input, and surface classes.
- Replaced the shared register family model with a plan-owned register model. The active register now contains only `starter/riwaq` (`riwaq-starter`); `plus` and `pro` are empty until their own concrete templates are added.
- Added Riwaq-owned landing, blog, contact, and roadmap page components plus nav, footer, content schema, placeholder data, local UI, local hook, and roadmap timeline section.
- Added explicit tenant `/roadmap` routing and template route support for Riwaq's project-history page.
- Added the Midday-standard dashboard table foundation under `apps/dashboard/src/components/tables/core`, plus app-local table settings, sticky-column, and scroll helpers.
- Moved active customer and property table/search modules into `apps/dashboard/src/components/tables/<domain>/*`, removing route-local table folders from those pages.
- Standardized the properties search filter onto the same provider/search-filter pattern used by customer tables.
- Refactored the properties table to column-definition driven table composition with domain empty/no-results/skeleton states under `components/tables/properties`.
- Refactored the team page into a Midday-style thin route with hydrated `team.listMembers` / `team.listInvites` prefetching, a `components/tables/teams` table slice, and extracted invite member form/sheet components.
- Refactored invite account signup so invite validation, duplicate-user checks, and invite acceptance DB setup live in `packages/db/src/queries/team.ts`, leaving the dashboard action to validate form fields, create the user through auth, set the session, revalidate, and redirect.
- Added a Midday-style `@plotkeys/db/queries` barrel export and moved dashboard query consumers off the db root barrel so dashboard app code imports query APIs through the dedicated package surface.
- Tightened the Midday-style table core by adding the dashboard `Portal`, the `components/tables/resize-handle.tsx` helper, global `scrollbar-hide`, and matching table skeleton / virtual-row hover and action-cell styling more closely to the Midday reference.
- Added Midday's draggable table header support by installing the `@dnd-kit` dashboard dependencies and adding `components/tables/draggable-header.tsx` plus `hooks/use-table-dnd.ts` for TanStack column-order updates.
- Added Midday's virtualized infinite-scroll table runtime by installing `@tanstack/react-virtual` for the dashboard and adding `hooks/use-infinite-scroll.ts` for virtualizer-backed next-page loading.
- Re-aligned the shared dashboard table core files with the Midday source shape, restoring Midday comments/interfaces/class ordering and removing the notification-specific `VirtualRow` row-class extension from the shared primitive.
- Added Midday's `nuqs` URL-sort foundation by wrapping the dashboard root layout in `NuqsAdapter` and adding `hooks/use-sort-params.ts` / `hooks/use-sort-query.ts` for table route loaders and sortable headers.
- Migrated the active customers and properties table filter params from the custom query shim to Midday-style `nuqs` schemas/loaders while preserving the existing `use*FilterParams` hook names and `setFilters(null)` clearing behavior.
- Re-aligned the shared dashboard search-filter surface with Midday's search-filter behavior by moving hotkeys to `react-hotkeys-hook`, switching search updates to submit/clear handling instead of debounce-on-type, and declaring the dashboard app dependency already present in the lockfile.
- Re-aligned the shared dashboard filter-chip helper with Midday's `FilterList` presentation by excluding the search query from active filter chips, removing the extra clear-all chip, and switching chips to the Midday square secondary button styling.
- Migrated the customer sheet/detail URL params to Midday-style `nuqs` via `hooks/use-customer-params.ts` and removed the old custom filter-query loader/state shim.
- Refactored the agents page into a hydrated Midday-style route using `workspace.listAgents`, with `components/tables/agents`, extracted agent/invite forms, and agent/invite sheets.
- Refactored the leads page into a hydrated Midday-style route using `workspace.getLeadStats` / `workspace.listLeads`, with `components/tables/leads` owning status tabs, search, columns, empty states, skeleton, and row actions.
- Refactored the appointments page into a hydrated Midday-style route using `workspace.getAppointmentStats` / `workspace.listAppointments`, with `components/tables/appointments` and an extracted appointment form/sheet.
- Refactored the HR employees page into a hydrated Midday-style route using `workspace.getEmployeeStats` / `workspace.listEmployees`, with `components/tables/employees` and an extracted employee invite form/sheet.
- Refactored the HR departments page into a hydrated Midday-style route using `workspace.listDepartments`, with `components/tables/departments` and an extracted department form/sheet; restored employee `department` filtering for department-to-roster links.
- Refactored the HR leave requests page into a hydrated Midday-style route using `workspace.getLeaveRequestStats` / `workspace.listLeaveRequests`, with `components/tables/leave-requests` and an extracted leave request form/sheet.
- Refactored the HR payroll page into a hydrated Midday-style route using `workspace.listPayrollPeriods` / `workspace.getPayrollSummary` / `workspace.listPayrollEntries`, with `components/tables/payroll` and an extracted payroll entry form/sheet.
- Refactored the notifications page into a hydrated Midday-style route using `notifications.list` / `notifications.unreadCount`, with `components/tables/notifications`, search, unread filters, and row-level mark-read actions.
- Refactored the blog editorial queue into a hydrated Midday-style route using `workspace.getBlogPostStats` / `workspace.listBlogPosts`, with `components/tables/blog` owning status filters, search, summary cards, empty states, skeleton, and row actions.
- Refactored the projects pipeline page into a hydrated Midday-style route using `projects.stats` / `projects.list`, with `components/tables/projects` and extracted project form/sheet components.
- Refactored the analytics page into a hydrated Midday-style route using an expanded `workspace.getAnalytics` bundle, with `components/analytics` owning metrics, chart/list sections, empty state, and skeleton.
- Refactored the dashboard overview page into a hydrated Midday-style route using `workspace.getDashboardOverview`, with `components/dashboard/home` owning the overview header, stats, publishing controls, domain cards, and skeleton.
- Refactored the reports page into a hydrated Midday-style route using `workspace.getReports`, with `components/reports` owning period tabs, report sections, exports, empty state, and skeleton while `components/tables/reports` owns the report table renderers.
- Rewrapped the template sandbox index route in the Midday page shell with `HydrateClient`, `ErrorBoundary`, `Suspense`, metadata, and a feature-local skeleton around the client data view.
- Slimmed the app-store route into a Midday-style server composer with metadata and moved the app-store header/grid/toggle surface into `components/app-store`, keeping company-app reads in the route/lib boundary.
- Completed the customers page migration to a Midday-style hydrated route using `customers.stats`, `filters.customers`, and `customers.get`; moved customer header/summary into `components/tables/customers`, extracted the create flow into `components/forms/customer-form` and `components/sheets/customer-sheet`, and switched customer create/update/delete UI to tRPC mutations with query invalidation.
- Refactored the listings page into a hydrated Midday-style route using filtered `workspace.listProperties` plus `filters.properties`, moved the listings header/table composition into `components/tables/properties`, and relocated the route-local property form to `components/forms/property-form`.
- Refactored the domains page into a hydrated Midday-style route using `workspace.getTenantDomainStatus` and `workspace.getCustomDomainDnsInstructions`, with `components/tables/domains` owning the page header, domain control card, DNS record table, provisioned domain list, and skeleton.
- Removed the remaining direct company-plan Prisma read from the team route by adding `team.getOverview` and hydrating plan cap metadata alongside `team.listMembers` / `team.listInvites`.
- Refactored the billing page into a hydrated Midday-style route using `workspace.getBillingInfo`, with `components/tables/billing` owning the page header, plan comparison, payment repair form, billing history table, and skeleton while billing history reads now go through `packages/db/src/queries/billing.ts`.
- Added Midday-style customer column visibility plumbing by introducing `apps/dashboard/src/store/customers.ts`, wiring `CustomersDataTable` to publish leaf columns, and adding the Tune popover control to the customer table header actions.
- Refactored the estate launches page into a hydrated Midday-style route using `workspace.listEstates`, with `components/tables/estates` owning the page header, summary cards, launch grid, empty state, and skeleton, and moved the create estate sheet form into `components/forms/estate-form`.
- Split the estate launches grid into Midday-style table-owned `columns.tsx` and `empty-states.tsx`, keeping `table.tsx` focused on section/list composition and sharing publish-state badge logic with the estate detail surface.
- Refactored the AI credits page into a hydrated Midday-style route using `workspace.getAiCreditInfo`, with `components/tables/ai-credits` owning the page header, summary cards, top-up card, usage table, empty state, and skeleton while AI credit purchases now create billing line items through `packages/db/src/queries/billing.ts`.
- Refactored notification preferences into a hydrated Midday-style settings route using `notifications.listPreferences` and `notifications.updatePreference`, with `components/tables/notification-preferences` owning the page header, summary cards, event routing table, info card, and skeleton.
- Refactored the integrations overview and settings pages into hydrated Midday-style routes using `workspace.getCompanyIntegration` / `workspace.updateCompanyIntegration`, with `components/tables/integrations` owning the overview cards, credential form, shared catalog, and skeletons while integration persistence now goes through `packages/db/src/queries/company-integration.ts`.
- Split the integrations overview card rendering into Midday-style table-owned `columns.tsx` and `empty-states.tsx`, keeping `table.tsx` focused on section/grid composition and sharing connection-count logic with the page wrapper.
- Refactored the main settings page into a hydrated Midday-style route using `workspace.getCompanySettings`, with `components/tables/settings` owning the page header, profile form, workspace plan card, branding/logo controls, workspace shortcuts, danger zone, and skeleton.
- Split the settings table slice into Midday-style `columns.tsx` and `empty-states.tsx`, moving reusable read-only fields, plan/status badges, shortcut cards, danger action UI, and unavailable state out of the table wrapper.
- Refactored the blog editor detail page into a hydrated Midday-style route using `workspace.getBlogPost` plus blog create/update/status/delete mutations, moved the editor into `components/forms/blog-post-form`, moved detail UI into `components/tables/blog`, and shifted blog slug uniqueness into `packages/db/src/queries/blog.ts`.
- Refactored the property detail page into a hydrated Midday-style route using `workspace.getPropertyDetail`, `propertyMedia.listMedia`, and public image tRPC calls, with `components/tables/properties` owning the detail header, analytics cards, media gallery controls, and skeleton while property reads now go through `packages/db/src/queries/property.ts`.
- Refactored the estate detail page into a hydrated Midday-style route using `workspace.getEstateDetail` and `workspace.createEstateLayout`, moved launch detail/plan upload forms into `components/forms`, moved the detail surface into `components/tables/estates`, and shifted estate detail/layout reads and writes into `packages/db/src/queries/estate.ts`.
- Refactored the project budget page into a hydrated Midday-style route using `projects.getBudgetDetail`, moved budget forms into `components/forms`, moved the budget detail surface into `components/tables/projects`, and shifted the page payload read into `packages/db/src/queries/project-finance.ts`.
- Refactored the project workforce page into a hydrated Midday-style route using `projects.getWorkforceDetail`, moved worker/payroll-run forms into `components/forms`, moved workforce/payroll tables into `components/tables/projects`, and shifted the page payload read into `packages/db/src/queries/project-finance.ts`.
- Refactored the project overview page into a hydrated Midday-style route using `projects.getOverviewDetail`, moved the overview detail surface into `components/tables/projects`, shifted the page payload read into `packages/db/src/queries/project.ts`, and added shared project cache invalidation for nested project mutations.
- Refactored the billing callback route so payment activation persistence lives in `packages/db/src/queries/billing.ts` via `activateSubscriptionPayment`, leaving the dashboard route to verify Paystack metadata, derive plan template access, revalidate affected paths, and redirect.
- Refactored the live preview page so tenant/company/published-site/listing/agent reads live in `packages/db/src/queries/website.ts` via `getLivePreviewData`, leaving the dashboard route to render empty states and published site sections.
- Refactored the builder workspace so company/draft/published/listing/agent/blog/license/onboarding reads and draft fallback creation live in `packages/db/src/queries/website.ts` via `getBuilderWorkspaceData`, leaving the dashboard component to render status states and builder presentation.
- Refactored the Paystack webhook route so subscription activation, subscription-created status updates, cancellation/license sync, past-due marking, and subscription billing rows live in `packages/db/src/queries/billing.ts`, leaving the dashboard route to verify signatures and dispatch event payloads.
- Refactored dashboard company-app state helpers so enabled-app/plan reads and enabled-app writes live in `packages/db/src/queries/company-apps.ts`, leaving `apps/dashboard/src/lib/company-apps.ts` to resolve app registry context and request caching.
- Refactored dashboard notification bell data so unread-count and recent-notification reads live in `packages/db/src/queries/notifications.ts` via `getNotificationBellDataForUser`, leaving the dashboard lib to resolve session state and serialize dates for navigation props.
- Refactored the dashboard asset upload route so DB setup, property ownership validation, and upload persistence live behind `@plotkeys/api/asset-service` via `createTenantAssetFromUpload`, leaving the route to validate form input and map upload results to HTTP responses.
- Aligned the dashboard table scroll hook with Midday's column-width scroll behavior and moved the customers table off the UI-package scroll shim onto the dashboard-local hook.
- Moved the active customers table off the shared UI data-table provider and onto Midday-style feature-owned TanStack table rendering with persisted table settings, draggable/resizable headers, sticky columns, virtual rows, infinite loading, horizontal pagination controls, and server-loaded sort/table settings.
- Moved the active listings/properties table off the shared UI data-table provider and onto Midday-style feature-owned TanStack table rendering with persisted table settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed sort for `workspace.listProperties`.
- Moved the active leads table onto Midday-style feature-owned TanStack table rendering with persisted table settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `workspace.listLeads`.
- Moved the active employees roster onto the same Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `workspace.listEmployees`.
- Moved the active departments table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/sort for `workspace.listDepartments`.
- Moved the active appointments table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/upcoming/sort for `workspace.listAppointments`.
- Moved the active payroll table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/sort while preserving period-scoped `workspace.listPayrollEntries` fetching.
- Moved the active projects table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `projects.list`.
- Moved the active leave requests table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `workspace.listLeaveRequests`.
- Moved the active notifications table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, unread-row styling through the shared virtual row primitive, and URL/server-backed search/unread/sort for `notifications.list`.
- Moved the active team members table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/sort for `team.listMembers`.
- Moved the active agents table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/sort for `workspace.listAgents`.
- Moved the active blog table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `workspace.listBlogPosts`.
- Normalized the reports analytics tables to the shared dashboard table presentation shell with overflow containment, bordered headers/rows/cells, and no legacy `border-separate` table styling.
- Normalized the project budget/workforce detail subtables to the shared dashboard table presentation shell and removed the remaining legacy `border-separate` table styling from project detail tables.
- Added a Midday-style dashboard `ErrorFallback` and wrapped the dashboard home and analytics hydrated data views in `ErrorBoundary` around their Suspense boundaries.
- Refactored the public team-invite join and profile-completion pages so invite lookup, invite validation, and existing agent/employee profile reads live in `packages/db/src/queries/team.ts`, leaving the dashboard pages to render invite states and redirects.
- Aligned the PlotKeys notification job task layout toward after-service by grouping the Trigger `notification` task and `email-smoke-test` task in `packages/jobs/src/tasks/notifications.ts` while preserving the existing package-owned handlers and task exports.
- Tightened PlotKeys email provider configuration toward after-service by requiring `EMAIL_FROM_ADDRESS` for notification email sends instead of falling back to a hardcoded sender address.
- Aligned the PlotKeys notifications package boundary toward after-service by moving the remaining payload-utils consumer to the root `@plotkeys/notifications` export and collapsing the package export map to the single root entrypoint.
- Made the PlotKeys notifications root barrel explicit by replacing broad wildcard re-exports with the intentional public notification classes, schemas, delivery helpers, services, contact helpers, and types currently consumed by apps/packages.
- Split the WhatsApp provider out of `@plotkeys/app-store` into a dedicated `@plotkeys/whatsapp` package with the after-service-style Twilio client contract, so notification delivery depends on a provider package instead of an app-store integration package.
- Added Midday-style properties/listings column visibility plumbing by introducing a properties table column store, wiring `PropertiesDataTable` to publish leaf columns, and adding the Tune popover control to the listings table header actions.
- Added Midday-style leads column visibility plumbing by introducing a leads table column store, wiring `LeadsDataTable` to publish leaf columns, and adding the Tune popover control to the lead queue header actions.
- Added Midday-style column visibility plumbing across the remaining active table-settings tables: agents, appointments, blog, departments, employees, leave requests, notifications, payroll, projects, and team members now publish TanStack leaf columns to domain stores and expose the Tune popover control in their table headers.
- Tightened the shared dashboard search-filter dropdown toward Midday's semantic filter presentation by expanding the filter icon registry for status, customer-status, listing type, department, role, period, featured, and view filter keys.
- Refactored invite profile completion so accepted-invite validation plus agent/employee profile upsert writes live in `packages/db/src/queries/team.ts` via `completeTeamInviteProfile`, leaving the server action to parse form values, choose display labels, revalidate paths, and redirect.
- Refactored dashboard CSV exports so lead/property/customer/appointment/employee export rows and report CSV assembly live in `packages/db/src/queries/*`, leaving server actions to authorize the tenant, preserve current CSV formatting, and surface database-unavailable errors.
- Refactored HR leave and payroll server actions so company-scoped employee validation, leave status transitions, payroll entry creation, and paid marking live in `packages/db/src/queries/leave-request.ts` and `packages/db/src/queries/payroll.ts`, leaving dashboard actions to parse form data, revalidate paths, and redirect.
- Refactored HR employee and department server actions so company-scoped employee CRUD, work-role persistence, and department CRUD live in `packages/db/src/queries/employee.ts` and `packages/db/src/queries/department.ts`, leaving dashboard actions to parse forms, revalidate paths, and redirect.
- Refactored property media upload plumbing so property-scoped asset upload uses `createTenantAssetFromUpload`, cover-image sync lives in `packages/db/src/queries/property-media.ts`, and the property-media router reuses package queries for property ownership checks.
- Refactored workspace app-store install/uninstall actions so company-app DB setup and mutations live in `packages/db/src/queries/company-apps.ts`, leaving dashboard actions to authorize the session and revalidate the app-store page.
- Refactored signup/onboarding server actions so subdomain availability checks, persisted onboarding reads, and final onboarding progress updates live behind `packages/db/src/queries/onboarding.ts`, while dashboard actions retain cookie fallback, redirects, and workspace procedure orchestration.
- Refactored workspace invite notification context so company display-name lookup lives in `packages/db/src/queries/company.ts`, leaving the shared invite action to create invites, send notifications, revalidate paths, and redirect.
- Refactored builder configuration existence checks so active draft lookup lives behind `packages/db/src/queries/website.ts` via `getActiveDraftForCompany`, leaving the dashboard action to call workspace orchestration and redirect when a draft must be selected.
- Refactored estate creation slug collision handling so slug normalization and uniqueness checks live in `packages/db/src/queries/estate.ts`, leaving the dashboard action to parse the form, call workspace creation, revalidate, and redirect.
- Refactored the onboarding route so durable saved onboarding-state reads live in `packages/db/src/queries/onboarding.ts` via `getTenantOnboardingForUser`, leaving the page to handle host/cookie fallbacks and step rendering.
- Tightened the shared dashboard sticky-column runtime by removing the domain-specific fallback from `useStickyColumns` and making `TableSkeleton` derive explicit sticky widths from its own column IDs, so loading tables align with each table's Midday-style sticky configuration.
- Moved the active listings/properties data flow from a finite table query to the Midday-style infinite table contract: `workspace.listProperties` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized properties table triggers `useInfiniteScroll` for next-page loading.
- Moved the active leads queue from a capped finite list to the Midday-style infinite table contract: `workspace.listLeads` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized leads table triggers `useInfiniteScroll` while preserving URL-backed search/status/sort.
- Moved the active appointments table from a capped finite list to the Midday-style infinite table contract: `workspace.listAppointments` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized appointments table triggers `useInfiniteScroll` while preserving URL-backed search/status/view/sort.
- Moved the active employees roster from a capped finite list to the Midday-style infinite table contract: `workspace.listEmployees` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized employees table triggers `useInfiniteScroll` while leave/payroll employee option sheets read the paginated `data` payload.
- Refactored dashboard session/proxy tenant host checks so custom-host slug resolution and tenant-onboarded checks live in `packages/db/src/queries/tenant-domain.ts`, leaving dashboard plumbing to manage headers, cookies, and redirects.
- Replaced placeholder notification job logging with real dispatch through `@plotkeys/notifications` email, WhatsApp, and in-app delivery planning.
- Added after-service-style email recipient override support through `resolveEmailRecipients()` and structured email send results.
- Added an after-service-style `email-smoke-test` Trigger task and exported job handler so production email delivery can be verified through the same `EmailService` path used by notification jobs.
- Added the after-service-style direct `email:test` script and `scripts/send-test-email.mjs` path so local Resend configuration can be verified with `TEST_EMAIL` through the workspace env loader without running the full app.

**Verification note:**
- Dashboard `tsc --noEmit` passed before the later fast-command discipline switch.
- After the fast-command switch, validation stayed limited to scoped source inspection, exact-symbol searches, and scoped `git diff --check`.

## 2026-04-06 — Customer Portal Phase 1C — Offers Workflow

**What was built:**
- `CustomerOffer` Prisma model with `OfferStatus` enum (pending/accepted/rejected/withdrawn); migration SQL written, awaiting apply
- Five new query functions: `hasPendingOfferForCustomer`, `submitOfferForCustomer`, `withdrawOfferForCustomer`, `countOffersForCustomer`, `listOffersForCustomer`
- Two server actions: `submitOfferAction` (submit with optional amount + message), `withdrawOfferAction` (pending offers only)
- `portal-offer-card.tsx` — card component with status badge and inline withdraw form
- `/portal/offers` page — live offer grid, four status banners, empty state
- `/portal/dashboard` — "Coming online next" placeholder replaced with "Active offers" widget showing count + recent 3
- Property detail page — "Enquire" div replaced with auth-aware offer form; unauthenticated visitors get "Sign in to make an offer" link

**Design decisions:**
- Multiple offers allowed per customer+property (history preserved); one-PENDING-at-a-time enforced at the app layer in `submitOfferForCustomer`
- `offerAmount` stored as `String?` matching `Property.price` (no currency parsing at DB layer)
- Staff review workflow (accepting/rejecting offers from dashboard) deferred — status can only move to `withdrawn` by the customer in this phase; staff-side transitions are next

**Deferred:**
- Staff dashboard surfaces for reviewing and actioning offers
- Counter-offer flow

## 2026-03-31 — Customer and Construction Status Correction

### What changed
- Corrected the Brain to match the real implementation state for customer-tenant and construction-adjacent features.
- Confirmed that the current customer portal is a route-and-UI foundation, not a completed customer account system.
- Confirmed that the current construction module is strong on internal project operations, but still incomplete for customer-facing project routes, document workflows, and advanced QS/design intelligence.

### Code-backed status
- **Customer portal:** `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/saved`, `/portal/offers`, `/portal/payments`, and `/portal/account` exist, but they are placeholder shells and not wired to real customer auth or live customer data.
- **Customer browse:** public listing browsing and inquiry are live on the tenant site.
- **Customer transactions:** saved listings, offers, payments, owned-property management, transfer, sell-back, and customer 2FA are still pending.
- **Customer model:** the current schema uses company-scoped `Customer` records for staff workflows. The planned global-customer identity plus tenant-customer bridge is not implemented yet.
- **Construction operations:** internal project CRUD, phases, milestones, updates, issues, team assignment, budgets, workers, payroll, and AI summary/risk/customer-draft tools are live.
- **Construction customer visibility:** staff can grant customer access and mark milestones/updates customer-visible, but there is no live tenant-site `/portal/projects/*` customer experience yet.
- **Construction AI/QS/design:** AI summary/risk/draft exists; smart BOQ generation, historical price suggestions, document extraction, and architectural design evaluation are still pending.

## 2026-03-31 — Customer Portal Auth Foundation

### What was built
- Tenant-site portal signup and login now use real Better Auth-backed sessions instead of placeholder buttons.
- Non-auth portal routes are now guarded and redirect unauthenticated visitors to `/portal/login`.
- Portal signup creates a Better Auth user and creates a company-scoped `Customer` record when one does not already exist for the current tenant/email.
- Portal sign-in only succeeds when the authenticated user also matches a customer record for the current tenant.
- Portal dashboard and account pages now read the signed-in customer session and show real customer identity details.
- Portal shell navigation now adapts between signed-out auth routes and signed-in customer routes, and includes sign-out.

### Design
- Reused the existing Better Auth user/session stack rather than introducing a second auth provider for the first customer-portal slice.
- Customer access is tenant-scoped by matching authenticated user email to the current tenant's `Customer` record.
- Tenant-site uses a tenant-scoped Better Auth session cookie keyed by tenant slug so the existing auth resolver can read public-site customer sessions cleanly.
- Temporary assumption: customer signup auto-verifies email in this first slice until a dedicated customer verification flow is added.

### What remains next
- Saved listings and auth-aware save actions
- Offer submission and tracking
- Payments, receipts, and ownership records
- Transfer, sell-back, and stronger account security

## 2026-03-31 — Customer Portal Saved Listings

### What was built
- Added a `SavedListing` company/customer/property relation plus Prisma migration for portal saved listings.
- Public property detail pages now show auth-aware save/remove actions and redirect signed-out customers into portal login with return-path preservation.
- `/portal/dashboard` now shows live saved-listing counts and recent saved properties.
- `/portal/saved` now renders the customer’s real saved inventory with remove actions.

### Design
- Saved listings stay tenant-scoped by attaching each record to `companyId`, `customerId`, and `propertyId`.
- Save/remove behavior is centralized in one portal server action so property pages and portal pages share the same guard and revalidation rules.
- The current customer identity assumption did not change: portal access still resolves through Better Auth plus company-scoped customer email matching.

### What remains next
- Offer submission and staff review flow
- Payments, receipts, and ownership/reservation records
- Transfer, sell-back, verification, and 2FA

## 2026-03-31 — Custom Domain Purchase Phase Clarification

### What changed
- Confirmed that **Custom Domain Purchase Flow** is the highest-priority remaining non-mobile backlog item.
- Clarified the domain-planning docs so the future implementation must support:
  - **Vercel domain attachment and verification** for deployment/runtime routing
  - **Registrar-based search/purchase/renewal**
  - **`.com.ng` coverage** through a registrar/provider that supports Nigerian ccTLDs

### Planning direction
- Treat domain management as a split-provider system rather than assuming one vendor handles everything:
  - **Vercel** for deployment-facing domain attach/sync
  - **Registrar adapter(s)** for commercial domain search, purchase, renewal, and DNS/nameserver workflows
- If the main registrar does not support `.com.ng`, the abstraction should allow a second provider dedicated to Nigerian-domain commerce.

## 2026-03-31 — Custom Domain Purchase Flow (Phase 1)

### What was built
- **`packages/utils/src/domain-service.ts`** (new) — Domain service abstraction with:
  - `isValidDomainName()` — syntactic domain validation
  - `extractApexDomain()` — apex extraction with two-part ccTLD support (`.com.ng`, `.co.uk`, etc.)
  - `buildDnsInstructions()` — generates DNS records (A for apex, CNAME for subdomains) + Vercel TXT verification records
  - `checkDomainAvailability()` — DNS-over-HTTPS availability check via Cloudflare (works for all TLDs including `.com.ng`)
  - `searchDomainAvailability()` — parallel availability check across all supported TLD variants
  - `SUPPORTED_TLDS` / `ALL_SUPPORTED_TLDS` constants covering global (`.com`, `.net`, `.org`, `.info`, `.biz`) and Nigerian (`.com.ng`, `.ng`, `.org.ng`, `.net.ng`) TLDs
- **`packages/utils/src/domain-service.test.ts`** (new) — 16 tests covering validation, apex extraction (including `.com.ng`), DNS instruction building, and TLD constants
- **`packages/db/src/queries/tenant-domain.ts`** — 4 new query functions:
  - `createCustomDomainPair()` — creates sitefront + dashboard domain pair in a transaction
  - `findTenantDomainByHostname()` — hostname conflict check
  - `listCustomDomainsWithVerification()` — custom domains with verificationJson for DNS instruction rendering
  - `removeCustomDomain()` — soft-delete a custom domain pair
- **`apps/api/src/routers/workspace.route.ts`** — 4 new tRPC procedures:
  - `searchDomains` — parallel domain availability search across all supported TLDs
  - `connectCustomDomain` — validates hostname, checks conflicts, creates domain pair, triggers Vercel sync, returns DNS instructions
  - `removeCustomDomain` — soft-deletes custom domain pair
  - `getCustomDomainDnsInstructions` — returns DNS instruction cards for all pending custom domains
- **`apps/api/src/schemas/workspace.schema.ts`** — 3 new Zod schemas: `searchDomainInputSchema`, `connectCustomDomainInputSchema`, `removeCustomDomainInputSchema`
- **`apps/dashboard/src/app/(app)/domains/connect/page.tsx`** (new) — Connect Custom Domain page with:
  - Hostname input form
  - Vercel readiness gate
  - Step-by-step DNS configuration guide
  - Explicit `.com.ng` registrar instructions (NiRA, QServers, Whogohost, Web4Africa)
- **`apps/dashboard/src/app/(app)/domains/page.tsx`** — Updated with:
  - "Connect Custom Domain" button
  - DNS instruction cards for pending/provisioning custom domains (table with Type/Name/Value)
  - "Remove" button for custom domains
  - Success alerts for connected/removed domains
- **`apps/dashboard/src/app/actions.ts`** — 2 new server actions: `connectCustomDomainAction`, `removeCustomDomainAction`

### Design
- **Split-provider architecture:** Vercel handles deployment-facing domain attachment/verification; the registrar layer (DNS-based availability check for now, upgradeable to WHOIS/RDAP/registrar API) handles search. Both layers support `.com.ng` and all Nigerian ccTLDs.
- **DNS instructions are generated server-side** using `buildDnsInstructions()` which correctly handles two-part ccTLDs like `.com.ng` (apex detection, A vs CNAME record selection).
- **Vercel TXT verification records** are persisted in `verificationJson` and rendered in the DNS instruction table when present.
- **Zero regression risk:** All existing domain sync, onboarding domain creation, and hostname resolution paths are untouched.

### Phase 2 (deferred)
- Registrar purchase API integration (Namecheap, GoDaddy, or `.com.ng`-specific provider)
- Domain renewal tracking and auto-renewal
- WHOIS privacy management
- Domain transfer support

## 2026-03-31 — Preview-Safe Action Interception

### What was built
- **`packages/section-registry/src/runtime/click-guard.tsx`** — ClickGuard now intercepts **all** `<button>` clicks in non-live modes (previously only `button[type='submit']`). Added `PreviewToast` component that briefly shows "Action disabled in preview" when a button is swallowed. Uses `useEffect` auto-hide timer (1500ms).
- **`packages/section-registry/src/sections/extended-sections.tsx`** — `ContactForm` now checks `useRenderMode()` before executing the `fetch()` call. In non-live modes (`draft`, `preview`, `template`), the form shows immediate "Message received" success without making any real API calls.
- **`packages/section-registry/src/runtime/preview-banner.tsx`** (new) — Slim sticky banner at the top of the page in non-live modes. Shows render mode label ("Draft preview", "Preview mode", "Template preview") and the message "links, forms and actions are disabled".
- **`packages/section-registry/src/index.ts`** — Exported `PreviewBanner` from the main barrel.
- **`apps/tenant-site/src/components/tenant-interaction-shell.tsx`** — Wired `PreviewBanner` inside `ClickGuardProvider`, above `{children}`.

### Design
- **Three-layer interception:** (1) ClickGuard DOM-level click capture for links, buttons, and forms; (2) React-level render-mode guard in ContactSection's `handleSubmit` to prevent `fetch()` even if ClickGuard is bypassed; (3) Visual feedback via PreviewBanner (persistent) and PreviewToast (ephemeral).
- **Zero regression risk in live mode:** All guards check `renderMode === "live"` and pass through transparently. No changes to live-mode behavior.
- **NewsletterSection already safe:** Only calls local `setSubmitted(true)` — no API endpoint, no fetch.

## 2026-03-31 — AI-Powered Page Content Generation

### What was built
- **`apps/api/src/lib.ai.ts`** — New `generatePageContent()` function and `PageContentContext` type. Takes a page key, company context, and list of editable fields; generates all field values in a single Claude Haiku 4.5 call. Returns a `Record<string, string>` mapping content keys to generated copy. Handles page-prefixed keys for non-home pages.
- **`packages/db/src/queries/ai-credits.ts`** — Added `page_content: 10` to `AI_CREDIT_COSTS` map.
- **`apps/api/src/schemas/workspace.schema.ts`** — New `generatePageContentInputSchema` with `pageKey` field.
- **`apps/api/src/routers/workspace.route.ts`** — New `generatePageContent` tRPC mutation. Resolves active draft via `resolveActiveDraftForCompany()`, gets AI-enabled editable fields from template definition, prefixes content keys for non-home pages, calls `generatePageContent()`, merges results into draft, deducts 10 credits.
- **`apps/dashboard/src/components/builder/onboarding-tools.tsx`** — New `GeneratePageContentButton` component. Shows page-specific label (e.g. "Generate About page content"), credit cost hint (10 credits), loading/error/success states with field count.
- **`apps/dashboard/src/components/builder/builder-workspace.tsx`** — Wired `GeneratePageContentButton` into builder sidebar as new "AI content" section between "Editable fields" and "Onboarding tools". Button receives `pageKey` from builder's resolved page state.

### Design
- Single LLM call generates all AI-enabled fields for a page (more efficient than field-by-field smart-fill)
- Non-home pages use page-prefixed content keys (e.g. `about.hero.title`) matching the inner-page-defaults convention
- Credit cost: 10 credits per page generation (between smart-fill's 2/field and onboarding bootstrap's 15)
- Follows existing patterns: same draft resolution as `bootstrapAiContent`, same credit check/deduct/log flow

## 2026-03-31 — Template Family Differentiation

### What was built
- Updated the home-page inventories for the 6 register families (`Noor`, `Bana`, `Wafi`, `Faris`, `Thuraya`, `Sakan`) across Starter / Plus / Pro tiers in `packages/section-registry/src/register/*/*/pages.ts`.
- The changes are data-only and limited to page inventory composition: reordering section slots, swapping a few home sections, and introducing family-specific proof/conversion sections where those slot types already existed.
- Resulting family identities:
  - **Noor** — listings-first agency with market proof first, then agents/testimonials, then brand story
  - **Bana** — project-first developer with project grid and market proof early
  - **Wafi** — property-management/owner-acquisition home flow with services + contact before listings depth
  - **Faris** — solo-agent identity with agent showcase moved onto home for Plus / Pro
  - **Thuraya** — luxury/editorial portfolio flow with listings and testimonials ahead of story
  - **Sakan** — search-first renter conversion flow with FAQ/contact emphasis on Plus / Pro

### Validation
- Ran targeted Biome checks on the changed register page files — clean after formatting.
- Ran the package typecheck and confirmed it still fails only on the same pre-existing unrelated errors in `src/register/index.ts` and `src/template-config.ts`; none of the changed family page files introduced type errors.
- Manually verified the resulting family/tier home section orders by generating a visual summary table from the register files.

## 2026-03-31 — Multi-page Template Depth

### What was built
- **`packages/section-registry/src/register/inner-page-defaults.ts`** (new) — Shared per-page hero defaults for 16 inner page types (about, listings, projects, portfolio, rentals, contact, agents, services, how-it-works, landlords, tenants, areas, private-sales, faq, insights, blog, resources). Each entry stores page-prefixed keys (e.g. `about.hero.title = "About Our Agency"`) so they don't collide with home-page keys.
- **`packages/section-registry/src/index.ts`** — Three changes:
  1. `resolvePageContent()` helper: aliases `{pageKey}.hero.*` to base `hero.*` keys before handing content to section builders. Builders remain unchanged; they always read `hero.title`, but on the about page they receive the about-specific value.
  2. `buildPageSections()`: calls `resolvePageContent` for non-home pages.
  3. `resolveWebsitePresentation()` and `resolvePage()`: both now merge `innerPageDefaults[pageKey]` between `template.defaultContent` and tenant-saved content, so per-page defaults are overridable by tenant customisation.

### Design
- Storage: per-page content is stored as `about.hero.title` etc. in `contentJson`/`themeJson` — no key collision with home page
- Builder builders and section components remain unchanged (zero regression risk)
- Tenant overrides: if a tenant saves `about.hero.title` to their contentJson (currently only possible via direct API; future builder UI TBD), it takes priority over the shared defaults
- Known limitation: inline EditableText contentKey is still hardcoded to `hero.title` in section components — inline editing on inner pages writes to the home page key. Full page-scoped editing is a Phase 2 improvement requiring section component changes.

## 2026-03-31 — Path-Aware Builder Preview

### What was built
- **`apps/dashboard/src/app/(app)/builder/page.tsx`** — Added `path` to `searchParams`; passed as `previewPath` to `BuilderWorkspace`.
- **`apps/dashboard/src/components/builder/builder-workspace.tsx`** — Imports `getTemplatePageInventory`. Resolves `activePageKey` from `previewPath` by matching against the template's page inventory slugs (defaults to `"home"`). Builds `availablePages: PageNavItem[]` list. Passes `pageKey` to `resolveWebsitePresentation` so the correct page's sections are fetched. Threads `availablePages` + `activePageKey` into `BuilderPreviewPanel`, `BuilderSidebarControls`, and `BuilderSidebarDrawer`.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Accepts `availablePages` and `activePageKey`. When the template has more than one page, renders a tab strip in the preview chrome bar replacing the URL label. Clicking a tab calls `router.push('?path=...')` preserving all other query params (configId, etc.). Home tab clears the `path` param.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — Accepts `activePageKey` (default `"home"`). `SeoSection` now uses `activePageKey` instead of the hardcoded `"home"` — SEO fields update per-page as you navigate.
- **`apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`** — Accepts and threads `activePageKey` to `BuilderSidebarControls`.

### Design
- URL-based navigation: `?path=/about` triggers server re-render of `BuilderWorkspace` with the correct page. Full re-render is acceptable since the builder already re-renders on template/theme changes.
- No new DB queries: `getTemplatePageInventory` is a pure in-memory lookup against the registry.
- SEO section is now page-aware: switching to `/about` and entering a title writes `seo.about.title` to themeJson.

## 2026-03-31 — SEO & Meta Tags

### What was built
- **`packages/section-registry/src/template-config.ts`** — Added `seo?: Record<string, { title?, description?, ogImage? }>` to `TemplateConfig`. Updated `deserializeTemplateConfig` to parse `seo.{pageKey}.{field}` dot-notation keys from `themeJson` into the nested structure.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — New `SeoSection` component with title input, description textarea (3 rows, debounced), and OG image URL input. Saves via `onUpdateTheme` with key `seo.home.{field}`. Wired into `BuilderSidebarControls` below section visibility toggles.
- **`apps/tenant-site/src/lib/resolve-tenant.ts`** — Added `market` to `TenantShell` company select so the description fallback can reference the market.
- **`apps/tenant-site/src/app/page.tsx`** — Exported `generateMetadata()` that calls `resolveTenantShell()` (lightweight), reads `templateConfig.seo?.home`, and returns `title` + `description` + `openGraph` + `twitter` metadata. Falls back to company name and market when no SEO override is set.
- **`apps/tenant-site/src/app/[...slug]/page.tsx`** — Exported `generateMetadata({ params })` that resolves `pageKey` from path segments via the existing `resolvePageKeyForPath()` helper, then reads `templateConfig.seo?.[pageKey]` for overrides. Same fallback pattern.

### Design
- Storage: `themeJson` dot-notation keys (`seo.home.title`, `seo.listings.description`, etc.) — follows the existing `sectionVisible.*` and `namedImage.*` patterns; no schema changes
- Per-page `generateMetadata()` in route files takes priority over the root layout's company-level metadata in Next.js
- Builder scoped to `pageKey="home"` for now; inner pages can be added later via path-aware builder preview

## 2026-03-31 — Template Usage Analytics

### What was built
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — `TemplatePicker` now fetches `getTemplateCatalog` via tRPC (`useQuery`). Builds a `usageMap` (key → usageCount) from the API response. Each template card shows `"{N} using"` in muted text below the tagline when count > 0. Falls back to 0 silently while the query loads.

### Design
- Read-only analytics display only — no new mutations or schema changes
- `getTemplateCatalog` already returned `usageCount` per template (backed by `countCompaniesByTemplateKey`); this surfaces it in the picker UI

## 2026-03-30 — WebsiteVersion Phase 4 — Write Path

### What was built
- **`packages/db/src/queries/website.ts`** — Added `findDraftVersionById(db, { companyId, versionId })` helper. Returns a draft WebsiteVersion with its parent Website (`id`, `templateKey`), validating company ownership. Used by mutation fallbacks when `configId` is a WebsiteVersion ID.
- **`apps/api/src/routers/workspace.route.ts`** — Five mutations upgraded with a silent WebsiteVersion fallback:
  - **`updateSiteField`**: If SiteConfiguration not found, merges `contentKey` into `version.contentJson` and calls `updateDraftVersion`.
  - **`updateSiteThemeField`**: If SiteConfiguration not found, merges `themeKey` into `version.themeJson` and calls `updateDraftVersion`.
  - **`publishSiteConfiguration`**: If SiteConfiguration not found, calls `publishWebsiteVersion` directly (archives old published, promotes draft, updates `website.publishedVersionId`).
  - **`smartFillField`**: Resolves either SiteConfiguration or WebsiteVersion; derives `templateKey` from whichever is found; AI generation logic shared; writes through `updateSiteConfigurationContentField` (legacy) or `updateDraftVersion` (Phase 4).
  - **`ensureBuilderConfigurationExists`**: Now checks `resolveActiveDraftForCompany` first; returns `legacyConfigId ?? version.id`; falls back to SiteConfiguration for existing companies; for new companies creates Website + draft via `upsertWebsite` + `getOrCreateDraftVersion` (no SiteConfiguration created).
- **Imports added**: `findDraftVersionById`, `getOrCreateDraftVersion`, `publishWebsiteVersion`, `upsertWebsite` added to router import block.

### Design
- No API surface changes — `configId` remains a plain string across all mutations
- Auto-detection: try SiteConfiguration lookup first; silence NOT_FOUND and try WebsiteVersion on miss
- Legacy dual-write path preserved for all existing companies
- New companies get a clean WebsiteVersion-only write path

## 2026-03-30 — EditableText AI Icon + Action Bar Upgrade

### What was built
- **`packages/section-registry/src/runtime/smart-fill-context.tsx`** (new) — `SmartFillContext` following the same pattern as ClickGuardContext. `SmartFillProvider` accepts an `onSmartFill(contentKey)` async function and injects it via context. `useSmartFill()` hook returns the function or null when no provider is present.
- **`packages/section-registry/src/sections/editing-primitives.tsx`** — `EditableText` upgraded with hover action bar. In draft mode, hovering text reveals a small floating pill (`absolute -top-7 right-0`) with ✏ Edit and ✦ AI buttons. The AI button only renders when `useSmartFill()` is non-null. Clicking AI calls `triggerSmartFill(contentKey)` and shows a `animate-pulse ring-primary/40` loading state while the mutation runs. Clicking Edit enters contentEditable as before.
- **`packages/section-registry/src/index.ts`** — Exports `SmartFillProvider`, `useSmartFill`, `SmartFillFn`.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Added `handleInlineSmartFill` adapter (derives `shortDetail` from `contentKey` dot-notation). Wraps sections with `SmartFillProvider` when `readOnly={false}`; locked-template preview skips the provider so the AI button is not shown.

### What's still deferred
- WebsiteVersion Phase 4 writes

## 2026-03-30 — ClickGuard + InlineOverview Wiring (M3 Deferred)

### What was built
- **`runtime/click-guard.tsx`** — Enhanced `handleClick` to auto-detect item data from `data-click-guard-type` + `data-click-guard-data` attributes on intercepted anchors. Parses JSON payload and calls `openItem()` automatically, so section components need no direct dependency on `useClickGuard`.
- **`sections/extended-sections.tsx`** — Added `data-click-guard-type` and `data-click-guard-data` attributes to `PropertyGridSection` listing card anchors (type: `"listing"`, data: id/title/location/price/specs/slug) and `AgentShowcaseSection` agent card anchors (type: `"agent"`, data: id/name/role/bio/slug).
- **`apps/tenant-site/src/components/website-shell.tsx`** — New `"use client"` wrapper component. Provides `ClickGuardProvider` + `InlineOverview` boundary inside `WebsiteRuntimeProvider`'s client tree. In `renderMode="live"`, ClickGuard is transparent and InlineOverview returns null — zero behaviour change for live visitors.
- **`apps/tenant-site/src/app/layout.tsx`** — `<main>{children}</main>` wrapped with `<WebsiteShell>` to enable ClickGuard + InlineOverview for all tenant-site pages.
- **`apps/dashboard/.../builder-preview-panel.tsx`** — `ClickGuardProvider` + `InlineOverview` nested inside `WebsiteRuntimeProvider renderMode="draft"`. Clicking a listing/agent card in the builder preview now slides up the InlineOverview panel instead of triggering broken navigation.

### What's still deferred
- EditableText AI icon + action bar upgrade
- WebsiteVersion Phase 4 writes

## 2026-03-30 — Template Registry M4 — Tenant-Site Integration

### What was built
- **`register/index.ts` nav/footer helpers** — `getFamilyNavConfig(familyKey, tier)` returns `NavConfig` with links filtered by `minTier` vs active tier. `getFamilyFooterConfig(familyKey)` returns `FooterConfig`. Both backed by `familyNavConfigMap` and `familyFooterConfigMap` lookup tables across all 6 families.
- **`lib/resolve-tenant.ts`** — Two-tier resolver. `resolveTenantContext(searchParams?)` resolves full tenant context including live listings and agents — used by page routes. `resolveTenantShell()` is lightweight (company + published theme only, no live data) — used by the root layout so the shell never waits on DB-heavy data fetches.
- **`components/register-nav.tsx`** — `RegisterNav` server component. Desktop: inline links filtered by plan tier + CTA button. Mobile: native `<details>/<summary>` hamburger (zero JS). Uses `var(--pk-*)` CSS vars throughout for theme consistency.
- **`components/register-footer.tsx`** — `RegisterFooter` server component. Renders link groups in a responsive grid + tagline + `© {year} {company}` copyright line.
- **`app/[...slug]/page.tsx`** — Catch-all inner page route. `resolvePageKeyForPath(templateKey, path)` supports exact slug match then dynamic `[slug]` wildcard pattern match. Calls `resolveTenantContext()` → `resolvePage()` → renders sections with `visibleSections` filter. Empty section list → "coming soon" placeholder; unknown path → `notFound()`.
- **`app/layout.tsx`** — `WebsiteRuntimeProvider` now wraps all body content, injecting `--pk-*` CSS custom properties for the active template's color system, font, and style preset. `resolveTenantShell()` called in parallel with subdomain + integrations. `RegisterNav` and `RegisterFooter` rendered conditionally when `familyKey` + `tier` are defined.
- **`app/page.tsx` simplification** — Removed ~80 lines of inline tenant resolution. Now calls `resolveTenantContext(sp)` and `resolvePage(templateKey, "home", tenant, "live")`. Fallback (no published site) still shows sample home in dashed border card.

### What's still deferred

## 2026-03-30 — Multi-page Website Support

### What was built
- **`apps/dashboard/src/app/(app)/builder/page.tsx`** — Builder now accepts a `?page=` query param and passes it into the workspace.
- **`apps/dashboard/src/components/builder/builder-workspace.tsx`** — The workspace now validates the selected page against `getTemplatePageInventory(templateKey)`, falls back to the first available page, resolves the draft preview with `pageKey`, and builds a page-aware live-site URL.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — Added a new Page picker sourced from the active template inventory. Selection updates the main builder URL via `router.replace('/builder?page=...')`, so page state is shareable and survives refreshes.
- **`apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`** — Mobile builder drawer now receives the current page key so page selection is available outside desktop as well.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Preview chrome now shows the selected public page path and label instead of only a generic builder-preview label.

### Validation notes
- Focused Biome checks passed on the touched builder files after adding the new page-selection wiring.
- `apps/dashboard` workspace typecheck remains blocked in this sandbox by a pre-existing environment issue: `@plotkeys/tsconfig/nextjs.json` is not resolvable from the package.
- Attempted live manual verification by starting the dashboard app, but the sandbox currently lacks the required `turbo`, `portless`, and `next` binaries in the runtime path, preventing a full app boot here.

## 2026-03-30 — Listing Overview Standardization

### What was built
- **`apps/tenant-site/src/lib/listing-overview.ts`** — Added a shared public listing overview query contract: `location`, `priceRange`, `sort`, and `page`. The helper normalizes those search params, applies filtering/sorting/pagination to tenant listing snapshots, and identifies which page keys count as listing overview pages.
- **`apps/tenant-site/src/app/[...slug]/page.tsx`** — Catch-all tenant pages now detect listing overview pages (`listings`, `rentals`, `projects`, etc.) and apply the shared listing query contract before passing listings into `resolvePage()`. Templates still control the section tree; the runtime now standardizes the data behavior.
- **`packages/section-registry/src/index.ts`** — Added a shared route contract resolver that derives the canonical overview/detail base path from the active template inventory. Shared section builders now use that contract so CTA links and detail links follow `/rentals/*`, `/projects/*`, `/portfolio/*`, etc. instead of assuming `/listings/*`.
- **`packages/section-registry/src/sections/extended-sections.tsx`** and **`packages/section-registry/src/sections/home-page.tsx`** — Shared property-grid and listing-spotlight configs now accept `detailHrefBase`, so shared listing cards can build template-correct detail URLs.

### Validation notes
- Focused Biome checks passed on the touched tenant-site and section-registry files; only pre-existing `<img>` performance warnings remain in shared section files.
- Verified the tenant-site listing query helper with `npx -y tsx` by filtering/sorting a small in-memory listing set; confirmed the helper returns the expected ordered subset.
- Verified template inventories with `npx -y tsx` to confirm `sakan-starter` resolves `/rentals` + `/rentals/[slug]` and `bana-starter` resolves `/projects` + `/projects/[slug]`, matching the new route contract.
- Full `apps/tenant-site` and `packages/section-registry` typechecks remain blocked in this sandbox by pre-existing workspace environment issues (`@plotkeys/tsconfig/nextjs.json` missing in app packages, JSX/react resolution missing in section-registry standalone runs).
- Manual UI verification used a local mock because the sandbox still cannot boot the full Next/Turbo runtime here. Screenshot: https://github.com/user-attachments/assets/de73bc0f-290f-4909-9e30-c58294103d47

## 2026-03-30 — Customer Portal Foundation Planning

### What was built
- **Central `/portal/*` route group in tenant-site** — Added `apps/tenant-site/src/app/portal/` pages for `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/saved`, `/portal/offers`, `/portal/payments`, and `/portal/account`, plus `/portal` redirecting to `/portal/login`.
- **Branded shared portal shell** — Added `apps/tenant-site/src/components/portal-shell.tsx` and `portal-page.tsx` so customer-facing account pages now render in a central application shell that uses tenant branding tokens from the existing `WebsiteRuntimeProvider`, rather than template section trees.
- **Template shell suppression on portal routes** — Updated `apps/tenant-site/src/proxy.ts` to inject `x-tenant-pathname`, and updated `apps/tenant-site/src/app/layout.tsx` so register-family nav/footer and chat widget do not render on `/portal/*` routes.
- **Legacy entry-point redirects** — Added explicit `/login`, `/signup`, and `/saved` tenant-site routes that redirect into `/portal/login`, `/portal/signup`, and `/portal/saved`, so older inventory-driven entry points land in the new central portal.
- **Public saved-listing links repointed** — Updated register-family nav/footer configs that exposed “Saved Listings” so they now link to `/portal/saved`.

### Validation notes
- Focused Biome checks passed on all touched tenant-site and section-registry files for this task.
- `apps/tenant-site` standalone typecheck remains blocked in this sandbox by the pre-existing workspace issue where `@plotkeys/tsconfig/nextjs.json` cannot be resolved from the package.
- Manual UI verification used a local mock because the sandbox still cannot reliably boot the full tenant-site runtime here. Screenshot: https://github.com/user-attachments/assets/8acea668-c66c-40ef-82eb-71e55671a80b

## 2026-03-30 — Customer Portal + Listing Page Boundary Planning

### Planning decisions
- **Central customer account pages** — Customer login, signup, dashboard, saved listings, offers, payments, and account settings should live under a central tenant-site route group such as `/portal/*`. These pages should inherit tenant branding but should not be template-composed pages.
- **Template-based public discovery pages** — Public listing overview pages (`/listings`, `/properties`, `/rentals`, `/portfolio`, `/projects`) remain template-driven because they are part of the tenant's branded marketing surface.
- **Shared functional contract for listing pages** — Even though listing overview pages remain template-based, filtering, sorting, pagination, and auth-aware actions should be implemented through shared central code so behavior stays consistent across families.

### Brain updates
- Updated `brain/features/customer-portal.md` with explicit page-boundary decisions and a route plan for `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/saved`, `/portal/offers`, and `/portal/account`.
- Updated `brain/modules/template-register-plan.md` so customer auth/account pages are no longer treated as template inventory pages.
- Updated `brain/modules/pages-inventory.md` to separate template pages from central customer portal pages.
- Updated `brain/system/architecture.md` and `brain/tasks/backlog.md` so future implementation follows the new central-vs-template boundary.

## 2026-03-30 — Tenant-Site ClickGuard + InlineOverview Wiring

### What was built
- **`apps/tenant-site/src/components/tenant-interaction-shell.tsx`** — Added a client-side interaction shell that reads `?renderMode=` from the URL, wraps tenant-site content in `WebsiteRuntimeProvider`, mounts `ClickGuardProvider`, and places a single `InlineOverview` panel around the real nav/footer/page render tree.
- **Tenant-site render mode parsing** — Added `parseTenantRenderMode()` and updated both `app/page.tsx` and `app/[...slug]/page.tsx` to pass the selected render mode into `resolvePage()`, so `"template"` mode now resolves placeholder content/data while `"preview"` / `"draft"` keep real tenant data.
- **Overview trigger wiring for cards** — Added `useItemOverviewTrigger()` in `packages/section-registry/src/sections/interaction-utils.tsx` and used it across shared section components plus the Noor/Bana/Wafi/Faris/Sakan/Thuraya family overrides so listing and agent cards open `InlineOverview` in non-live modes while remaining inert or navigable in live mode.
- **Item slug propagation** — Extended live/placeholder listing + agent shapes with optional `slug` support so `InlineOverview` action links can resolve detail URLs correctly in preview/template contexts.

### Validation notes
- Manual UI verification completed with a temporary local preview-mode demo that exercised `ClickGuardProvider` + `InlineOverview` around real section components. Verified that clicking a property card opens the slide-up overview panel. Screenshot: https://github.com/user-attachments/assets/f526c025-ceed-44c4-85f4-c607d6bbbfe2
- `apps/tenant-site` typecheck remains blocked in this sandbox because `@plotkeys/tsconfig/nextjs.json` is not resolvable from the app package here, and `packages/section-registry` standalone typecheck is also blocked by the environment not loading the expected React/JSX tsconfig setup.
- Focused Biome checks on touched files still surface pre-existing section-registry issues in files touched for this task, especially existing `<img>` warnings and historical `noArrayIndexKey` findings in family section files. No new security findings were identified during manual review.

## 2026-03-30 — EditableText AI Icon + Action Bar Upgrade

### What was built
- **`sections/editing-primitives.tsx`** — Draft-mode `EditableText` now keeps the existing amber hover affordance but upgrades into an explicit editing surface: hover can reveal a `✦ AI` trigger, click enters edit mode, and an action bar with `✓ Save` / `✕ Discard` replaces the previous implicit blur-save behavior.
- **Inline AI suggestion panel** — When AI is enabled for the current `contentKey`, the inline editor can open an in-place suggestion panel with generated copy plus `Use this` / `Try again` actions, so the builder preview now matches the planned upgrade path instead of only exposing AI from the sidebar field editor.
- **`register/content-field-lookup.ts`** — Added a shared content-field metadata lookup compiled from the register family content schemas plus the legacy shared builder keys. `EditableText` can now infer whether a field should expose AI affordances without requiring every section call site to pass a new prop.

### Validation notes
- Manual UI verification completed with a temporary local demo page rendering `EditableText` in draft mode. Verified hover AI affordance, edit-state action bar, and suggestion panel interaction.
- Repository tooling required `npx bun@1.3.9 ...` because the sandbox lacked a global `bun` binary.
- Full package typecheck remains blocked by pre-existing `packages/section-registry/src/register/index.ts` errors around unresolved `NavConfig` / `FooterConfig` types, unrelated to this task.
- Focused Biome checks on touched files only surfaced pre-existing warnings/errors elsewhere in `editing-primitives.tsx` (`<img>`, `aria-label` on placeholder `<div>`, `autoFocus`, and array-index key), none introduced by this change.

## 2026-03-29 — Template Registry M3 Runtime Wiring

### What was built
- **`page-inventory.ts` bridge** — `registerPagesToInventory()` converts `RegisterPageDefinition[]` to `TemplatePageInventory`. `getTemplatePageInventory()` now checks register templates first, so `buildPageSections` and `getEnabledSections` route correctly for all 18 `noor-starter` / `bana-plus` / etc. keys instead of falling back to template-1.
- **`register/index.ts` placeholder helpers** — `getPlaceholderContent(familyKey)` returns a flat `TenantContentRecord` populated from `placeholderValue` fields in each family's content-schema. `getFamilyPlaceholderData(familyKey)` returns placeholder listings/agents/projects.
- **`src/index.ts` — `resolvePage()`** — New public API. Takes `templateKey`, `pageKey`, `TenantSnapshot`, and `RenderMode`. In `"template"` mode, automatically substitutes family placeholder content and data. Applies family component overrides. Returns `ResolvedPageConfig` (sections + theme + renderMode).
- **Builder wiring** — `BuilderPreviewPanel` now accepts `templateKey` prop. `resolveFamilySectionComponents()` is resolved at the panel level and merged into the section component lookup per section, so family-branded components (Noor, Bana, Wafi, Faris, Thuraya, Sakan) render correctly in the builder instead of generic fallbacks.
- **`runtime/click-guard.tsx`** — `ClickGuardProvider` context wraps page content in non-live modes. Intercepts anchor clicks (no navigation) and form/submit clicks (no real submission). `useClickGuard()` hook exposes `openItem()` / `closeItem()` / `activeItem` for section components to trigger the overview panel.
- **`runtime/inline-overview.tsx`** — `InlineOverview` slide-up panel. Shows placeholder item data + "Install template" CTA in `"template"` mode; shows real item data + action links in `"draft"`/`"preview"` mode. Handles listing, agent, project, and generic item types.

### What's still deferred
- Tenant-site page routing for inner pages (Phase 4 — multi-page website support)
- ClickGuard integration into actual tenant-site page renders
- EditableText AI icon + action bar upgrade
- WebsiteVersion Phase 4 writes

## 2026-03-25 — Pricing Strategy Refresh

### Commercial Model
- PlotKeys no longer positions the entry tier as free forever.
- Current commercial positioning is:
  - Launch (`starter`) — ₦20,000/mo or ₦192,000/yr
  - Growth (`plus`) — ₦45,000/mo or ₦432,000/yr
  - Scale (`pro`) — ₦90,000/mo or ₦864,000/yr
- All plans now advertise a 14-day free trial.
- Annual billing is positioned with a 20% discount.

### Implementation Notes
- Internal entitlement keys remain `starter`, `plus`, and `pro` so template gating and existing plan logic do not break.
- User-facing labels now present those tiers as Launch, Growth, and Scale.
- Dashboard billing and the marketing-site pricing section now both read prices from the shared pricing config to avoid drift.

## 2026-03-25 — Builder Locked Template Guard

### Builder Access UX
- Builder now detects when the active template requires a higher subscription tier than the tenant currently holds and the company does not have a separate template license.
- In that state, the builder stays viewable but becomes read-only: publish, sidebar theme controls, inline field editing, and AI content bootstrap are disabled.
- Upgrade CTAs now point tenants to `/billing` instead of letting them hit a `FORBIDDEN` error at publish time.

### Server Enforcement
- Added shared license-aware template access checks before publish, inline content updates, theme updates, smart fill, and AI bootstrap mutations.
- This keeps the UI lock state and API enforcement aligned so direct mutation attempts are blocked consistently.

---

## 2026-03-22 — App Store Expansion

## 2026-03-24 — Invite-Driven Agent and Employee Onboarding

### Admin Flows
- Replaced direct-create agent and employee entry points with invite forms that only require an email address.
- Agents page and Employees page now show pending role-specific invites and let admins revoke them.
- Team/member invites now send real invitation emails through the shared notifications + email pipeline.

### Invite Acceptance + Profile Completion
- Updated `/join/[token]` so invitees can sign in or create an account with redirect preservation back to the invite link.
- Accepting an `agent` invite now routes into a profile-completion form that creates or updates the agent record.
- Accepting a `staff` invite now routes into a profile-completion form that creates or updates the employee record.
- Invite acceptance now validates that the signed-in account email matches the invited email before membership is created.

### Notifications + Email
- Added `workspace_invitation_sent` notification type for invite delivery.
- Added a dedicated workspace invitation email template and subject/default copy helpers.
- Added dashboard-side invite notification orchestration to send invitation emails after the team invite record is created.

### Dashboard App Store Page (`/app-store`)
- Integration cards for Google Analytics, Facebook Pixel, WhatsApp Business, Calendly
- Connected cards show the Midday-style positive installed status pill; disconnected cards do not render a title status pill.
- Links to `/settings/integrations` for credential configuration
- External docs links for each integration

### Tenant-Site Integration Script Injection
- `IntegrationScripts` client component at `apps/tenant-site/src/components/integration-scripts.tsx`
- Injects GA4 `<Script>` tag (gtag.js + config) when `googleAnalyticsId` is configured
- Injects Facebook Pixel `<Script>` tag (fbevents.js + PageView tracking) when `facebookPixelId` is configured
- Uses Next.js `<Script>` with `strategy="afterInteractive"` for non-blocking load
- Integration data fetched in tenant-site `layout.tsx` via `resolveIntegrations()` helper

### Sidebar Navigation
- App Store sidebar item changed from disabled `#` link to active `/app-store` route
- Removed "Coming" badge

---

## 2026-03-22 — Chat-bot LLM Integration

### Chat-bot Package (`packages/chat-bot`)
- Expanded with Anthropic Claude Haiku 4.5 integration
- `getChatCompletion()` — sends conversation with company-context system prompt, returns AI reply
- `buildChatBotSystemPrompt()` — builds context from company name, market, properties (up to 10), agents (up to 10), business summary
- Types: `ChatBotMessage`, `ChatBotContext`, `ChatBotResponse`
- Added `@anthropic-ai/sdk` dependency

### API Chat Router (`apps/api/src/routers/chat.route.ts`)
- `chat.sendMessage` public mutation — resolves company from subdomain, builds context from properties/agents/onboarding, calls `getChatCompletion()`
- Validates messages (min 1, max 50, 2000 chars per message)
- Returns `{ reply: string }`

### Tenant-Site Chat (`apps/tenant-site`)
- `/api/chat` route — standalone API endpoint for chat (follows existing contact/track pattern)
- `ChatWidget` client component — floating button (bottom-right), slide-up chat panel, message thread, typing indicator, auto-scroll
- Widget added to root layout — only renders when subdomain is resolved via server-side header check

---

## 2026-03-22 — Trigger.dev Job Integration

### Task Definitions
- Created 4 Trigger.dev task definitions in `packages/jobs/src/tasks/`:
  - `domainSyncTask` (id: `domains.connection.sync`) — 4 retries, 2s base delay
  - `planSyncTask` (id: `plans.sync`) — 4 retries, 2s base delay
  - `notificationDispatchTask` (id: `notifications.dispatch`) — 3 retries, 1s base delay
  - `siteContentGenerationTask` (id: `website.content.generate`) — 3 retries, 3s base delay

### Dispatch Utility
- Added `triggerJob()` in `packages/jobs/src/trigger.ts` — dual-mode dispatch
- Uses Trigger.dev `tasks.trigger()` when `TRIGGER_SECRET_KEY` is set
- Falls back to in-memory `runInBackground()` for local dev / environments without Trigger.dev
- Added `isTriggerConfigured()` helper

### Configuration
- Created `trigger.config.ts` at monorepo root with project config and default retry settings
- Added `@trigger.dev/sdk` dependency to `packages/jobs`
- Added `./tasks` subpath export in `packages/jobs/package.json`

### Workspace Route Updates
- Replaced `runInBackground(domainSyncHandler, ...)` with `triggerJob(domainSyncTask, domainSyncHandler, ...)`
- Both call sites (onboarding completion + manual domain sync) now use `triggerJob()`

### Form Notification Wiring
- `submitContact` now dispatches `contact_form` notification job
- `submitInquiry` now dispatches `property_inquiry` notification job
- `submitNewsletterSignup` now dispatches `newsletter_signup` notification job
- All use `triggerJob()` with fire-and-forget pattern (non-blocking)

---

## 2026-03-22 — Tenant Onboarding Improvements

### Re-run Template Recommendations
- Added `updateOnboardingInputs` tRPC mutation in workspace.route.ts
- Accepts optional businessType, primaryGoal, stylePreference, tone updates
- Re-derives profile (segment, designIntent, conversionFocus, complexity) and returns updated recommendations
- `RecommendTemplatePanel` dialog component on builder sidebar with dropdowns for all 4 inputs

### AI Content Bootstrap
- Added `generateOnboardingContent()` to `lib.ai.ts` using Claude Haiku 4.5
- Generates 8 content fields: hero.eyebrow, hero.title, hero.subtitle, cta.headline, cta.description, cta.buttonLabel, story.title, story.description
- Returns JSON object, merged into active draft WebsiteVersion + dual-write to legacy SiteConfiguration
- Added `bootstrapAiContent` tRPC mutation (15 credits, deduction + usage logging)
- `AiContentBootstrapButton` component on builder sidebar
- Added `onboarding_content: 15` to AI_CREDIT_COSTS

### Builder Page Updates
- Added "Onboarding tools" section to builder sidebar with both buttons
- Fetches onboarding record server-side to pre-populate the RecommendTemplatePanel dropdowns

---

## 2026-03-22 — Construction Phase 4: AI and Integrations

### AI Project Summary
- Added `generateProjectSummary()` to `lib.ai.ts` using Claude Haiku 4.5
- Generates 3-5 paragraph executive summary covering status, milestones, issues, budget, and recommendations
- Deducts 10 AI credits per generation (`project_summary` feature)

### AI Risk Flags
- Added `generateProjectRiskFlags()` to `lib.ai.ts`
- Detects overdue milestones, budget overruns (actual > approved), high-severity unresolved issues, stale projects
- Returns structured JSON array with severity, title, and detail per risk
- Deducts 5 AI credits per analysis (`project_risk_flags` feature)

### AI Customer Update Draft
- Added `generateCustomerUpdateDraft()` to `lib.ai.ts`
- Generates customer-safe progress update from internal project data
- Strips internal issues, delays, budget, payroll details — focuses on milestones and progress
- Deducts 5 AI credits per generation (`project_customer_draft` feature)

### Technical
- Added `ProjectAiContext` type to `lib.ai.ts` for structured project data input to AI
- Added `buildProjectAiContext()` helper in projects router for data assembly
- Added 3 tRPC mutation procedures: `generateSummary`, `getRiskFlags`, `generateCustomerDraft`
- Created `project-ai.tsx` client component with `ProjectAiInsights` card, `GenerateSummaryButton`, `RiskFlagsButton`, `GenerateCustomerDraftButton`
- Updated `/projects/[id]` detail page with AI Insights section (between Payroll and Customer Access)
- Credit deduction and usage logging on each successful AI generation

---

## 2026-03-22 — Construction Phase 3: Customer Project Visibility

### Customer Access Management
- Added `ProjectCustomerAccess` model linking customers to projects with access levels (overview, detailed)
- Added `ProjectCustomerAccessLevel` enum (overview, detailed)
- Grant/revoke access per customer per project with upsert pattern
- Staff can list customers with access and manage access levels

### Customer-Visible Content Controls
- Added `customerVisible` boolean to `ProjectUpdate` model (default false)
- Added `customerVisible` boolean to `ProjectMilestone` model (default false)
- Share/Hide toggle buttons on milestones and updates in staff dashboard
- Documents already support `visibility: shared` for customer access

### Customer Notices
- Added `ProjectCustomerNotice` model for staff-to-customer project notices
- Staff can send titled notices to specific customers with project access
- Notice creation form integrated into project detail page

### Technical
- Created `project-customer.ts` query module with 10 functions (access CRUD, customer-safe reads, visibility toggles)
- Added 7 tRPC procedures to projects router (listCustomerAccess, grantCustomerAccess, revokeCustomerAccess, createCustomerNotice, deleteCustomerNotice, toggleMilestoneVisibility, toggleUpdateVisibility)
- Created `project-customer-access.tsx` component (CustomerAccessList, GrantCustomerAccessForm, SendNoticeForm)
- Updated MilestoneList and UpdatesList with "Share"/"Hide" buttons and "Customer Visible" badges
- Updated `/projects/[id]` detail page with Customer Access card section

---

## 2026-03-22 — Construction Phase 2: Budget, Workers, Payroll

### Budget Tracking
- Added `ProjectBudget` model with approved/forecast/actual amounts
- Added `ProjectBudgetLineItem` model with category, quantity, rates, estimated/actual
- Added `ProjectBudgetLineCategory` enum (preliminaries, substructure, superstructure, mep, finishing, external_works, contingency, professional_fees, other)
- Budget upsert pattern: one budget per project with line items
- Budget summary shows approved, forecast, actual, and variance
- Line item management with category badges, estimated/actual amounts

### Site Workers
- Added `ProjectWorker` model linked to Project and optionally to Employee
- Added `ProjectWorkerPayBasis` enum (daily, weekly, monthly, fixed_contract, milestone_based)
- Added `ProjectWorkerStatus` enum (active, inactive, terminated)
- Worker list with status management and pay info display
- Create worker form with name, role, pay basis, and pay rate

### Project Payroll
- Added `ProjectPayrollRun` model with period dates and status tracking
- Added `ProjectPayrollEntry` model linked to payroll run and worker
- Added `ProjectPayrollRunStatus` enum (draft, finalized, paid)
- Added `ProjectPayrollEntryPaymentStatus` enum (pending, paid, on_hold)
- Payroll run list with finalize/mark-paid workflow
- Create payroll run form with period date selection

### Technical
- Created `project-finance.ts` query module in packages/db with full CRUD
- Added 15 tRPC procedures to the projects router
- Created 3 client components: project-budget.tsx, project-workers.tsx, project-payroll.tsx
- Updated `/projects/[id]` detail page with Budget, Site Workers, and Project Payroll card sections

---

## 2026-03-21 — Phase 2 Continued: Notification Bell, Preferences, SubmitButton

### Notification Bell in Header
- Created `NotificationBell` client component with Popover dropdown
- Shows unread count badge (red dot with number, "9+" for 10+)
- Popover shows 5 most recent notifications with relative timestamps, unread highlighting, optional links
- "View all notifications" link at bottom
- Wired into `(app)/layout.tsx` with server-side data fetch via `getNotificationBellData()`

### Notification Preferences Page
- Created `NotificationPreference` Prisma model with unique constraint on (companyId, userId, type)
- Added relations to `User` and `Company` models
- Created `notification-preference.ts` query module (list, upsert, get)
- Built `/settings/notifications` page with 6 configurable notification types
- Each type has in-app and email toggle buttons (pill-style) with server action toggle
- Added `updateNotificationPreferenceAction` server action using upsert pattern
- Added "Notification preferences" link card to `/settings` page

### SubmitButton Adoption
- Added `"use client"` directive to `packages/ui/src/components/submit-button.tsx`
- Fixed `ButtonProps` import to use `React.ComponentProps<typeof Button>` instead of non-existent `ButtonProps`
- Replaced `<Button type="submit">` with `<SubmitButton>` in 6 pages:
  - `/hr/leave` — Submit Request
  - `/hr/employees` — Add Employee
  - `/hr/departments` — Add Department
  - `/hr/payroll` — Add Entry
  - `/settings` — Save profile
  - `/ai-credits` — Buy 100 Credits
- All forms now show loading spinner and disable button during server action execution

---

## 2026-03-21 — Phase 2 Continued: Leave, Payroll, CSV UI, Listing Analytics, Agent Performance

### Leave Management
- Created `leave-request.ts` DB query module: CRUD, status counts, approval/rejection
- Built `/hr/leave` page: submission form (employee select, type, dates, reason), status filters (pending/approved/rejected/cancelled), approve/reject/cancel workflow
- Added 4 server actions: `createLeaveRequestAction`, `approveLeaveRequestAction`, `rejectLeaveRequestAction`, `cancelLeaveRequestAction`
- All actions verify employee belongs to company before operating

### Payroll
- Created `payroll.ts` DB query module: CRUD, period summary, available periods, mark paid
- Built `/hr/payroll` page: monthly records, period selector tabs, summary cards (entries/gross/net/status), add entry form, mark paid flow
- Added 2 server actions: `createPayrollEntryAction`, `markPayrollPaidAction`
- Currency formatting with Intl.NumberFormat for NGN

### CSV Export UI
- Created `ExportCsvButton` client component: uses `useTransition`, creates Blob download, uses `URL.createObjectURL`
- Added export buttons to: Leads, Properties, Customers, Appointments, Employees list pages
- Each button calls its corresponding export server action and triggers download

### Listing Analytics Card
- Added per-property analytics card to `/properties/[id]` detail page
- Shows 3 metrics: Views (30 days), Views (7 days), Appointments
- Uses `prisma.analyticsEvent.count` and `prisma.appointment.count` for data

### Agent Performance Analytics
- Added `getAgentPerformanceStats()` query in payroll.ts
- Added agent performance section to analytics page: total appointments, completed appointments per agent
- Query joins agents with appointment groupBy counts

### Sidebar
- Added Leave (CalendarOff icon) and Payroll (Receipt icon) to HR & Team nav group with Plus badges

---

## 2026-03-21 — Phase 2: Analytics Expansion + HR Module

### Analytics Expansion
- Added `getTopPages()` query — groups page views by path, returns top 10
- Added `getTrafficSources()` query — buckets referrer into Direct/Google/Social/Other
- Added `getPropertyAnalytics()` query — property-level view counts
- Added `getLeadSourceBreakdown()` query — lead counts grouped by source
- Updated analytics page: 4-card stats strip (events, visitors, page views, leads), top pages table, traffic sources bars, property views list, lead source bars

### HR Module
- Created Prisma enums: `EmploymentType`, `EmployeeStatus`, `LeaveType`, `LeaveRequestStatus`, `PayrollStatus`
- Created Prisma models: `Department`, `Employee`, `LeaveRequest`, `PayrollEntry`
- Updated `Company` model with relations to departments, employees, payroll entries
- Created query modules: `department.ts` (CRUD + employee counts), `employee.ts` (CRUD + status/department counts)
- Built `/hr/employees` page: add form, status filter tabs, department filter, status badges, employment type badges
- Built `/hr/departments` page: add form, employee counts, link to filtered employee list
- Added server actions: `createEmployeeAction`, `updateEmployeeAction`, `deleteEmployeeAction`, `createDepartmentAction`, `updateDepartmentAction`, `deleteDepartmentAction`

### CSV Export
- Added `toCsvRow()` helper with proper CSV escaping
- Added export actions: `exportLeadsCsvAction`, `exportPropertiesCsvAction`, `exportCustomersCsvAction`, `exportAppointmentsCsvAction`, `exportEmployeesCsvAction`

### Sidebar Navigation
- Added HR & Team nav group with Employees (Briefcase icon), Departments (Network icon), Team links
- Moved Team from Platform to HR & Team group
- Removed Notifications and Settings from Platform group separation

---

## 2026-03-20 (Brain Template Catalog Update)

### Template Catalog Brain Documentation
- Updated `brain/modules/templates-catalog.md`: full per-template record for all 45 templates — description, plan/tier, purchasable flag, default market, accent colour, font pairing, pages, ordered home-page section composition, forms, and primary CTA links.
- Updated `brain/modules/sections-inventory.md`: split into implemented (14 live components) and planned sections. Added type keys, descriptions, form endpoints, and content key references for all implemented sections.
- Updated `brain/modules/pages-inventory.md`: clarified which pages are currently implemented (Home only for all templates), added per-template note about page inventory registry coverage, and retained planned page list.
- Updated `brain/modules/page-to-section-matrix.md`: added full per-template home page section matrix for all 45 templates in render order.

## 2026-03-20 — Tenant Dashboard Phase

### Dashboard Sidebar Navigation
- Created `(app)` route group in `apps/dashboard/src/app/` for all authenticated pages
- Built `DashboardSidebar` component at `src/components/nav/dashboard-sidebar.tsx` using shadcn sidebar primitives
- Nav groups: Overview (Home, Builder, Live Preview), Manage (Properties, Agents, Leads, Appointments), Insights (Analytics, AI Credits, Billing)
- Added `(app)/layout.tsx` wrapping all authenticated pages with `SidebarProvider` + `DashboardSidebar` + `SidebarInset`
- Added header bar with `SidebarTrigger` (mobile hamburger) and `ThemeToggle`
- Moved 11 page directories into `(app)/` route group, updated all relative imports
- Removed "← Dashboard" back links from sub-pages (sidebar handles navigation)
- Redesigned dashboard home page: metrics strip (properties/agents/leads/appointments), quick action cards, site status card
- Fixed missing `"use client"` directive on `packages/ui/src/components/sidebar.tsx`

---

## 2026-03-20 (Session 4 — Next Phase)

### Property/Agent Data Binding
- Wired `listFeaturedProperties()` and `listAgentsForCompany()` into builder page `resolveWebsitePresentation()` call
- Wired same into live page `resolveWebsitePresentation()` call
- PropertyGridSection and AgentShowcaseSection now render real DB data from properties and agents tables
- Pattern matches tenant-site approach already working in `apps/tenant-site/src/app/page.tsx`

### Tenant Domain Status Surfaces
- Added inline alerts on dashboard home page for failed and pending domains
- Failed domains show destructive alert with "View domains" link
- Pending domains show amber alert with "Provision now" form button
- Alerts dynamically computed from existing `domainStatuses` query data

### Email Template Expansion
- Created `packages/email/emails/new-lead.tsx` — React Email template for new lead notifications with lead details section
- Created `packages/email/emails/site-published.tsx` — React Email template for site publish confirmation
- Added `defaultNewLeadSubject()` and `defaultSitePublishedSubject()` to `packages/email/defaults.ts`
- Created `new_lead_captured` notification type definition with email + in_app channels
- Created `site_published` notification type definition with email + in_app channels
- Registered both in `plotKeysNotificationTypes` registry (now 10 types total)
- Added `new_lead_captured` and `site_published` email dispatch handlers in `EmailService.buildEmailPayload()`

---

## 2026-03-20 (Session 3 — High-Priority Phase 1)

### Tenant Domain Management UI
- Created `/domains` dashboard page with full domain listing, status badges (active/pending/provisioning/failed/detached), error display
- Added status filter tabs and summary stats strip (total/active/failed)
- Added re-sync button with `syncTenantDomainsAction` (revalidates `/domains`)
- Added Domains metric card + quick-nav card to dashboard home

### Logo Upload Flow
- Added `@plotkeys/platform-integrations` dependency to dashboard
- Created `LogoUpload` client component with dual mode: file upload (Supabase storage) and URL paste fallback
- Created `setCompanyLogoAction` server action calling `workspace.setCompanyLogo` tRPC procedure
- Created `/settings` page with company info display and logo upload section
- Updated HeroBannerSection to render logo as `<img>` when value is an HTTP URL, text otherwise
- Added Settings quick-nav card to dashboard home

### WebsiteVersion Phase 4 Cleanup (reads)
- Removed SiteConfiguration fallback from `resolveActiveDraftForCompany()` in `packages/db/src/queries/website.ts`
- Removed SiteConfiguration fallback from `resolvePublishedForCompany()` in `packages/db/src/queries/website.ts`
- Added `legacyConfigId` to draft return shape for builder action compatibility
- Updated builder page to read from WebsiteVersion via `resolveActiveDraftForCompany()` (configId for actions still comes from SiteConfiguration via legacyConfigId link)
- Updated dashboard home page to use `resolvePublishedForCompany()` instead of direct SiteConfiguration query
- Updated live page to use `resolvePublishedForCompany()` instead of direct SiteConfiguration query
- Updated `ensureBuilderConfigurationExists()` to check WebsiteVersion existence
- Added `./queries/website` export to `@plotkeys/db` package
- Note: Write paths still go through SiteConfiguration with Phase 2 dual-write (WebsiteVersion stays in sync)

## Roadmap Steps 10-21 Completion

### Step 10: Auto domain sync on onboarding
- Added `grantTemplateLicense()` and `runInBackground(domainSyncHandler)` calls after `createCompanyOnboardingBundle` in `completeOnboarding` mutation
- Both non-blocking — domain sync failures are caught silently

### Step 13: Hostname middleware
- Verified already complete via `proxy.ts` pattern in both dashboard and tenant-site
- `resolveTenantByHostname()` handles DB lookup with slug fallback

### Step 16: Auto-grant free template license
- Added `grantTemplateLicense()` call in `completeOnboarding` mutation
- Grants the selected template as a free pick during onboarding

### Step 17: Section visibility toggles
- Added `visibleSections?: Record<string, boolean>` to `TemplateConfig` type
- Updated serialize/deserialize/applyConfigUpdate helpers
- Added `SectionVisibilityToggles` component with Switch toggles in builder sidebar
- Updated `BuilderPreviewPanel` to filter sections by visibility
- Wired `sectionTypes` and `visibleSections` through builder page.tsx and drawer
- Added visibility filtering to tenant-site public rendering

### Step 18: Website/WebsiteVersion dual-write (Phase 2)
- Updated `createCompanyOnboardingBundle` to create Website + WebsiteVersion in transaction
- Updated all SiteConfiguration CRUD to mirror changes to draft WebsiteVersion
- Converted `publishSiteConfiguration` from batch to interactive transaction for dual-write publish

### Step 20: Lead capture
- Created Prisma model: `lead.prisma` (enum + model with status tracking)
- Created query functions: createLead, listLeadsForCompany, countLeadsByStatus, updateLeadStatus, findLeadById
- Updated tenant-site contact endpoint to persist leads to database
- Added tRPC procedures: listLeads, getLeadStats, updateLeadStatus
- Added server action: updateLeadStatusAction
- Created dashboard page: `/leads` with status filtering, stats bar, status progression buttons

### Step 21: Unified billing (Paystack)
- Created Paystack API client wrapper (`packages/utils/src/paystack.ts`): transaction init, verify, plan CRUD, subscription management, webhook signature verification (HMAC-SHA512)
- Created webhook endpoint (`apps/dashboard/src/app/api/webhooks/paystack/route.ts`): handles charge.success, subscription.create, subscription.disable, invoice.payment_failed events; verifies signature; updates plans and template licenses
- Added tRPC procedures: `getBillingInfo` (plan status + billing history), `initializeCheckout` (create Paystack transaction + pending billing line item)
- Created billing dashboard page (`/billing`): current plan display, monthly/annual toggle, plan comparison cards with upgrade buttons, billing history
- Created checkout callback page (`/billing/callback`): handles Paystack redirect after payment
- Added `initializeCheckoutAction` server action: calls tRPC initializeCheckout and redirects to Paystack authorization URL

## 2026-03-19 (Session 3 — Todos)

### Tenant Domain Management UI
- Created `/domains` dashboard page with domain list, status badges, error details, and re-sync button
- Added `syncDomainsAction` server action (redirects to `/domains?synced=1` on success)
- Updated dashboard home quick-nav from 2 to 4 cards (added Domains + Settings)

### Logo Upload Flow
- Added `@plotkeys/platform-integrations` dependency to `apps/dashboard`
- Created `POST /api/upload` API route that validates file type/size and uploads to Supabase logos bucket
- Created `LogoUploadForm` client component with file picker and URL paste fallback
- Created `/settings` dashboard page with workspace info and logo upload section
- Added `setCompanyLogoAction` server action calling existing `setCompanyLogo` tRPC procedure

### Logo rendering in tenant site
- Added `logoUrl?: string` field to `ThemeConfig` and `TenantThemeRecord`
- Added `companyLogoUrl` option to `ResolveTemplateOptions`
- Updated `resolveWebsitePresentation` to propagate `companyLogoUrl` through theme
- Updated `HeroBannerSection` in `home-page.tsx` to render `<img>` when `theme.logoUrl` is set
- Wired `company.logoUrl` from `tenant-site/page.tsx`

### Better Auth Migration
- Refactored `signUpUser()` to use `auth.api.signUpEmail()` instead of manual Prisma user creation
- Refactored `signInUser()` to use `auth.api.signInEmail()` instead of manual bcrypt comparison
- Removed unused `verifyPasswordHash()` and `compare` import

### Appointment Scheduling
- Created `appointment.prisma` model with AppointmentStatus enum (scheduled/completed/cancelled/no_show)
- Built CRUD queries in `packages/db/src/queries/appointments.ts`
- Added 5 tRPC procedures: listAppointments, getAppointmentStats, createAppointment, updateAppointmentStatus, deleteAppointment
- Created `/appointments` dashboard page with create form, status filtering, management actions
- Added server actions: createAppointmentAction, updateAppointmentStatusAction, deleteAppointmentAction

### Website/WebsiteVersion Phase 3 Read Cutover
- Added `resolveActiveDraftForCompany()` and `resolvePublishedForCompany()` read helpers
- Both prefer WebsiteVersion, fall back to SiteConfiguration for pre-migration companies
- Updated tenant-site page.tsx to use `resolvePublishedForCompany()`

### Stock Image Marketplace
- Created `stock-image-license.prisma` model with unique constraint on companyId+imageId
- Built grant/check/list query functions
- Added listStockImageLicenses + purchaseStockImage tRPC procedures with billing line item creation

### AI Credit Tracking
- Created `ai-credits.prisma` with AiUsageLog and AiCreditLedger models (ledger pattern)
- Built query functions: getAiCreditBalance, hasEnoughCredits, grantAiCredits, deductAiCredits, logAiUsage, getAiUsageStats
- Wired credit deduction + usage logging into smartFillField tRPC mutation
- Added getAiCreditInfo + purchaseAiCredits tRPC procedures
- Created `/ai-credits` dashboard page with balance display, usage breakdown, top-up button

### Analytics Foundations
- Created `analytics.prisma` AnalyticsEvent model with company/type/date indexes
- Built recordAnalyticsEvent, getAnalyticsSummary, getPageViewsByDay query functions
- Created tenant-site `/api/track` endpoint with privacy-safe visitor fingerprinting (SHA-256 of IP+UA)
- Added getAnalytics tRPC procedure
- Created `/analytics` dashboard page with stat cards, event type breakdown, page view bar chart, recent events

- Enhanced Builder Preview page (`/builder/preview`) with:
  - **Sidebar layout**: Added persistent builder config sidebar (hidden below xl breakpoint) with template selector, style presets, color systems, and preview info
  - **Dark mode toggle**: Integrated `ThemeToggle` component in preview header for light/dark mode switching
  - **Compact template picker**: Simplified template selection UI with tier tabs and smooth transitions (compact inline display in header, full sidebar picker on desktop)
  - **Responsive design**: Mobile-friendly template picker dropdown in header, desktop sidebar with comprehensive preview controls
  - **Design tokens**: Used shadcn design tokens throughout (semantic colors, spacing, rounded corners) for consistent visual hierarchy
  - Grid layout matches main builder page structure (2-column on xl: sidebar + content)
  - Style presets and color systems displayed as interactive grid previews in sidebar

## 2026-03-18
- Added `/builder/preview` client-side testing page for previewing all templates without DB.
  - Template cycling via back/next buttons and dropdown with tabbed tier selector.
  - Local publish checkbox state per template.
  - Renders sections using `sectionComponents` registry and `resolveWebsitePresentation`.
- Compacted `BuilderSidebarControls` spacing (py-3→py-2, gap-5→gap-3).
- Further compacted builder setup across desktop sidebar and mobile drawer.
  - Reduced builder shell width, outer padding, section gaps, and metadata card padding in `apps/dashboard/src/app/builder/page.tsx` and `apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`.
  - Tightened picker button padding, template rows, tab spacing, and image slot input spacing in `apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`.
  - Restored optional `namedImageSlots` on `TemplateDefinition` in `packages/section-registry/src/index.ts` so builder image controls remain correctly typed.
- Made builder page sidebar responsive: hidden below `xl`, replaced with Sheet-based drawer (`BuilderSidebarDrawer`) triggered by Settings2 icon.
- Updated auth password hashing in `packages/auth/src/index.ts` to use `bcrypt-ts` (`hash`/`compare`) instead of local scrypt-based helpers.
- Added `bcrypt-ts` dependency in `packages/auth/package.json`.
- Verified no file-level TypeScript errors in `packages/auth/src/index.ts`.
- Note: workspace `packages/auth` typecheck still reports pre-existing DB query typing errors in `packages/db/src/queries/agent.ts` and `packages/db/src/queries/property.ts`.
- Fixed sign-in redirect loop where authenticated users were bounced from onboarding back to sign-in by aligning all session cookie reads/writes to `plotkeys.session_token` (`authSessionCookieName`) across dashboard middleware/session utilities, dashboard server actions, and API auth redirect resolution.
- Fixed NEXT_REDIRECT error in all dashboard server actions: moved `redirect()` calls outside `try/catch` blocks so Next.js redirect throws are no longer caught and re-thrown as error redirects.

## Section Registry Expansion
- Added 3 new section components to `extended-sections.tsx`: HeroSearchSection, WhyChooseUsSection, ServiceHighlightsSection.
- Registered all 5 new section types (FAQ, Newsletter, HeroSearch, WhyChooseUs, ServiceHighlights) in section builders, component registry, and union types in `index.ts`.
- Added 15 new template definitions (template-31 through template-45) with unique themes, content, and tier assignments.
- Created page inventory compositions for templates 31-45 in `page-inventory.ts` with reusable slot definitions.

## Dark Mode Support
- Added `dark:` variant Tailwind classes to all hardcoded color references in `home-page.tsx` section components: Eyebrow, Surface, ActionButton, HeroBannerSection, MarketStatsSection, StoryGridSection, ListingSpotlightSection, TestimonialStripSection.
- CtaBandSection left unchanged (already dark-on-dark gradient).
- Added dark variants for ContactForm error state in `extended-sections.tsx`.
- Other extended sections already use CSS variables (`--foreground`, `--muted-foreground`, etc.) that auto-adapt via `@custom-variant dark` in globals.css.
- TypeScript compilation verified clean.

## Inline Edit Fix
- Root cause: `BuilderPreviewPanel` rendered sections without `WebsiteRuntimeProvider`, so `EditableText` components could not detect draft mode via `useIsDraftMode()` hook.
- Fix: Wrapped the section rendering container with `<WebsiteRuntimeProvider renderMode="draft">` in `builder-preview-panel.tsx`.
- This enables the amber ring editing affordances and contentEditable behavior on text fields within sections when viewed in the builder.

## 2026-03-19 (Session 4 — Tenant Dashboard System)

### Dashboard route group and sidebar navigation
- Created `(app)` Next.js route group for all authenticated pages (no URL changes)
- Moved 11 page directories (agents, ai-credits, analytics, appointments, billing, builder, domains, leads, live, properties, settings) + their sub-pages into `(app)/`
- Fixed all relative imports across moved files (one extra `../` depth added)
- Created `DashboardSidebar` client component: 4-group nav (Workspace, Operations, Growth, Platform) with active state via `usePathname`, plan badges for Pro/Plus/Coming features, company info header, sign-out in footer
- Created `DashboardShell` client component wrapping SidebarProvider + DashboardSidebar + SidebarInset so `(app)/layout.tsx` stays a server component
- `(app)/layout.tsx` reads planTier from DB and passes to DashboardShell

### Dashboard home page rebuild
- Replaced dev-focused prototype home page with proper tenant-facing dashboard
- Header: company name + plan badge + "View site" + "Open builder" CTAs
- 4-metric stat strip: Properties, Agents, New leads, Appointments (all clickable)
- 4 quick-action cards: Builder, Analytics, Leads, Billing
- Plan upgrade prompt for starter users
- Platform feature roadmap grid (4 sections × features) showing Live/Partial/Plus/Pro/Coming status with icons and descriptions

### Bug fixes
- Fixed CSS custom property syntax in builder/page.tsx: `shadow-(--shadow-soft)` → `shadow-[var(--shadow-soft)]`
- Removed duplicate "Tenant domain management UI" entry from brain/progress.md
- Fixed `domains/page.tsx` locale from `en-US` back to `en-NG` (codebase convention)

## 2026-03-20 (Session 5 — Feature Completion)

### Team Management (Phase 1B)
- Added `/join/[token]` page for accepting team invites (handles expired/revoked/already-accepted states)
- Added `acceptInviteAction` server action calling `team.acceptInvite` tRPC procedure
- Added `/team` link (Users2Icon) and `/notifications` link (BellIcon) to `DashboardSidebar` Platform group

### Notifications Page
- Created `/notifications` dashboard page with list, unread badge, unread/all filter toggle, and "Mark all read" form button
- Direct DB query for notifications (no extra tRPC call needed for server page)

### Property Detail Page + Media Gallery
- Created `/properties/[id]` detail page with:
  - Property info header with publish state badge
  - Publish state controls: Publish, Unpublish, Archive, Restore to draft
  - Media gallery grid: photos, floor plans, virtual tour links
  - Add media form (URL + type + cover checkbox)
  - Set cover star button + delete button per media item
- Updated properties list page to show `publishState` badge on each property card
- Updated properties list to link property title to `/properties/[id]`
- Updated `addPropertyMediaAction`, `deletePropertyMediaAction`, `setPropertyCoverAction` to revalidate both `/properties` and `/properties/[propertyId]` paths
- Updated `updatePropertyPublishStateAction` to revalidate both paths

## 2026-03-20 (Session 6 — Core Product Gaps + Dashboard Expansion)

### Property/Agent Data Binding Fix
- Updated `listFeaturedProperties` to filter by `publishState: "published"` (only published listings appear on live tenant sites)
- Updated `listFeaturedProperties` to include cover media from `PropertyMedia` when `imageUrl` is null (includes `media` relation with cover filter, maps `imageUrl` to cover media URL as fallback)

### Listing Categories & Types
- Added `PropertyType` enum: residential, commercial, land, industrial, mixed_use
- Added `type` and `subType` fields to `Property` model
- Created migration: `20260320093931/migration.sql`
- Updated `createProperty`/`updateProperty` DB queries to accept `type`/`subType`
- Updated `createProperty`/`updateProperty` tRPC procedures (workspace.route.ts) with new fields
- Updated `createPropertyAction`/`updatePropertyAction` server actions to pass type/subType from form
- Updated `PropertyForm` component to include type selector and subType input
- Updated properties list page with type filter tabs and type badge per card
- Added `PropertyTypeValue` type export from `@plotkeys/db`

### Settings Expansion
- Expanded `/settings` page with:
  - Company Profile section with editable name and market (owners/admins only)
  - Workspace read-only section (subdomain, plan with Upgrade button)
  - Logo upload section (unchanged)
  - Danger zone with disabled Delete button (owners/admins only)
- Added `updateCompanyProfile` DB query function
- Added `updateCompanyProfile` tRPC procedure (admin+ role required)
- Added `updateCompanyProfileAction` server action

### Customer Model + Lead Promotion
- Added `CustomerStatus` enum: active, inactive, vip
- Added `Customer` Prisma model (company, name, email, phone, notes, status, sourceLeadId)
- Created migration in `20260320093931/migration.sql`
- Added `Customer` relation to `Company` model
- Created customer DB queries: createCustomer, listCustomersForCompany, getCustomerById, updateCustomer, softDeleteCustomer, countCustomersByStatus
- Created `customers.route.ts` tRPC router: list, stats, create, update, delete
- Registered `customersRouter` in `_app.ts`
- Added server actions: createCustomerAction, updateCustomerStatusAction, deleteCustomerAction, convertLeadToCustomerAction. Superseded on 2026-07-03: customer create/update/delete dashboard UI now uses tRPC mutations; lead conversion still uses `convertLeadToCustomerAction`.
- Created `/customers` dashboard page with stats strip, status filter tabs, customer cards with status management
- Added "→ Customer" convert button on qualified leads in `/leads` page
- Updated `DashboardSidebar` Customers link from `#` to `/customers`

### Construction Project Management — Phase 1
- Created Prisma enums file (`packages/db/prisma/enums/project.prisma`) with 11 enums: ProjectStatus, ProjectType, ProjectPhaseStatus, ProjectMilestoneStatus, ProjectDocumentKind, ProjectDocumentVisibility, ProjectUpdateKind, ProjectIssueSeverity, ProjectIssueStatus, ProjectRole, ProjectAssignmentStatus
- Created 7 Prisma model files: Project, ProjectPhase, ProjectMilestone, ProjectDocument, ProjectUpdate, ProjectIssue, ProjectAssignment
- Added `projects` relation to Company model, `projectAssignments` to Membership model
- Created project query module (`packages/db/src/queries/project.ts`) with full CRUD for projects, phases, milestones, updates, issues, assignments, and documents
- Exported project queries from `@plotkeys/db` index and package.json exports map
- Created `projects.route.ts` tRPC router with all mutations and queries (list, get, stats, create, update, delete + phases, milestones, updates, issues, team assignments)
- Registered `projectsRouter` in `_app.ts`
- Created 6 client components using `useMutation` in `apps/dashboard/src/components/projects/` (create-project-form, project-actions, project-phases, project-milestones, project-updates, project-issues, project-team)
- Refactored `/projects` list page to use client components for mutations
- Refactored `/projects/[id]` detail page to use client components for mutations
- Added "Construction" nav group with HardHat icon to dashboard sidebar

### Construction Project Management — Phase 2 (Finance and Workforce)
- Added 4 new Prisma enums to `project.prisma`: ProjectWorkerPayBasis, ProjectWorkerStatus, ProjectPayrollRunStatus, ProjectWorkerPaymentStatus
- Created `project-budget.prisma` model file with ProjectBudget and ProjectBudgetLineItem models
- Created `project-workforce.prisma` model file with ProjectWorker, ProjectPayrollRun, and ProjectPayrollEntry models
- Updated Project model with relations to budget, workers, and payrollRuns
- Extended `packages/db/src/queries/project.ts` with budget, worker, and payroll queries (getOrCreateProjectBudget, updateProjectBudget, getProjectBudgetWithLineItems, createProjectBudgetLineItem, updateProjectBudgetLineItem, deleteProjectBudgetLineItem, listProjectWorkers, createProjectWorker, updateProjectWorker, deleteProjectWorker, listProjectPayrollRuns, getProjectPayrollRunWithEntries, createProjectPayrollRun, updateProjectPayrollRun, deleteProjectPayrollRun, upsertProjectPayrollEntry, deleteProjectPayrollEntry)
- Extended `projects.route.ts` tRPC router with 16 new Phase 2 procedures for budget, workers, and payroll runs
- Created `project-budget.tsx` client component with BudgetSummaryCard (totals + update form), BudgetLineItemList (with delete), AddBudgetLineItemForm
- Created `project-workforce.tsx` client component with WorkerList (with status toggle + remove), AddWorkerForm, PayrollRunList (with confirm/mark paid/delete), CreatePayrollRunForm
- Created `/projects/[id]/budget` page showing budget summary and line items
- Created `/projects/[id]/workforce` page showing workers and payroll runs
- Updated `/projects/[id]` detail page header with Budget and Workforce navigation buttons
# Progress Log

- 2026-03-25: Fixed the dashboard projects page so failed project-creation attempts now surface the redirected `error` query string in a destructive alert, matching the error-handling pattern already used on properties, agents, team, and other dashboard pages. Also normalized the client-side redirecting forms for project creation, property create/edit, agent create/edit, team invites, employee invites, and final onboarding completion to await server actions directly instead of wrapping them in `startTransition(async () => ...)`, which had been causing submissions to behave like plain page refreshes instead of following the intended redirect flow.
## 2026-03-30 — WebsiteVersion Phase 4 Writes

### What was built
- **WebsiteVersion-first builder writes** — Added `findDraftWebsiteVersionByIdForCompany()` and `upsertDraftWebsiteVersion()` in `packages/db/src/queries/website.ts` so the active draft can be looked up and updated directly by `WebsiteVersion.id` instead of routing writes through legacy `SiteConfiguration`.
- **Workspace mutation cutover** — Updated `createTemplateDraft`, `ensureBuilderConfigurationExists`, `publishSiteConfiguration`, `smartFillField`, `updateSiteField`, and `updateSiteThemeField` in `apps/api/src/routers/workspace.route.ts` to use WebsiteVersion draft records as the primary write target.
- **Builder config ID cutover** — `apps/dashboard/src/components/builder/builder-workspace.tsx` now always passes the resolved active draft WebsiteVersion ID to all builder actions. The previous fallback to `legacyConfigId` / latest `SiteConfiguration.id` was removed.
- **Removed onboarding dual-write in active draft path** — `updateOnboardingInputs` / onboarding AI content updates now write only to the active WebsiteVersion draft instead of mirroring field-by-field back into SiteConfiguration.

### Validation notes
- Focused Biome checks passed on the touched files with only pre-existing warnings in unrelated `workspace.route.ts` mutations (`ctx` unused in lead/appointment handlers).
- `packages/db` typecheck remains blocked in this sandbox because `@plotkeys/tsconfig/base.json` is not resolvable here.
- `apps/api` typecheck remains blocked in this sandbox because installed package resolution for the workspace dependencies is incomplete (`drizzle-orm/node-postgres` and related modules unavailable to `tsc` here).
- Manual code-path verification confirmed the builder now uses `resolvedActiveDraft.id` as `configId`, and the targeted website builder mutations no longer call `createSiteConfiguration`, `updateSiteConfigurationContentField`, `updateSiteConfigurationThemeField`, or `publishSiteConfiguration`.

## 2026-05-22 — Customers Dashboard Midday-Style Migration

### What was built
- Started the page-by-page dashboard UI + structure migration task in `brain/tasks/in-progress.md`, using Midday's invoice page and invoice table modules as the reference structure.
- Refactored `apps/dashboard/src/app/(app)/customers/page.tsx` into a thinner route with `metadata`, loaded URL filter params, success/error alerts, and a Suspense-wrapped content component.
- Split customers UI into feature-owned modules:
  - `customers-header.tsx` for the page/table header, search filters, export action, and create-customer action.
  - `customers-summary.tsx` for status summary cards above the table.
  - `tables/customers/columns.tsx` for table column metadata and row typing.
  - `tables/customers/data-table.tsx` for the customer table and row actions.
  - `tables/customers/empty-states.tsx` for no-data/no-filtered-data presentation.
  - `tables/customers/skeleton.tsx` for the Suspense loading state.
- Superseded on 2026-07-03: this pass initially preserved the server-action and Prisma query flow; the current customers page now uses the Midday-style hydrated tRPC table route and client mutation flow.

### Validation notes
- `bun run --cwd apps/dashboard typecheck` passed.
- Scoped Biome check passed for all migrated customers files.
- Full `bun run --cwd apps/dashboard lint` still fails on pre-existing diagnostics outside the customers migration, including import ordering/formatting in estates, properties, tRPC, and proxy files plus existing array-index key warnings.

### Customer form slice
- Extracted the inline customer creation dropdown from `customers-header.tsx` into `customer-form.tsx`.
- Implemented the create flow as a dashboard sheet using the same `DashboardSheetHeader`, `DashboardSheetBody`, and `DashboardSheetFooter` pattern used by listing forms.
- Superseded on 2026-07-03: client-side Zod validation remains, but the create flow now uses `trpc.customers.create` with query invalidation instead of `createCustomerAction`.
- Validation: scoped Biome check passed for `customer-form.tsx` and `customers-header.tsx`; `bun run --cwd apps/dashboard typecheck` passed.

### Search filter slice
- Moved the customer-specific search/filter wrapper from the customers page root into `tables/customers/search-filter.tsx` so the customers table folder owns filtering alongside columns, table, empty state, and skeleton modules.
- Added `tables/customers/search-filter-skeleton.tsx` and wired it into the customers table skeleton for a more complete Midday-style loading state.
- Updated `customers-header.tsx` to import the table-owned search filter and deleted the old root-level `customers-search-filter.tsx`.
- Validation: scoped Biome check passed for the touched search/filter files; `bun run --cwd apps/dashboard typecheck` passed.

## 2026-05-22 — Customers GND Sales-Book Table Migration

### What was built
- Ported the reusable GND-style table shell into `@plotkeys/ui/data-table`, including `Table.Provider`, `useTableData`, table header/body/row/load-more/summary primitives, skeletons, sticky-column support, table-scroll hook, and `cells.selectColumn`.
- Ported the GND-style search/filter shell into `@plotkeys/ui/search-filter`, including provider context, search input, generated filter menu, chips, clear behavior, debounced URL submission, and keyboard shortcut focus handling.
- Added the reusable list-query helper in `@plotkeys/utils/query-response` with `composeQuery`, `queryMeta`, `queryResponse`, and `composeQueryData`, preserving the offset cursor contract (`cursor = currentOffset + size`, `null` at the end).
- Rebuilt customers data loading around `customers.get` tRPC infinite query, `getCustomersSchema`, `whereCustomers`, and `getCustomers`; superseded on 2026-07-03 to use tRPC mutations for create/update/delete UI as well.
- Reworked `/customers` to server-fetch the generated filter list, prefetch the infinite customer list, hydrate the client, and render the shared table system with GND-style columns, row selection, load-more, search, status filter chips, export, summary cards, and create-customer sheet.

### Validation notes
- `bun run --cwd packages/ui typecheck` passed.
- `bun run --cwd packages/utils typecheck` passed.
- `bun run --cwd apps/api typecheck` passed.
- `bun run --cwd apps/dashboard typecheck` passed.
- Scoped `bunx biome check --write` passed for the new UI table/search-filter files, list-query helper, customer API/query/filter files, customers dashboard route/components, customer URL hook, and dashboard tRPC server.

## 2026-07-03 — Dashboard Route Error Boundaries

- Added Midday-style `ErrorBoundary` + shared `ErrorFallback` composition around hydrated Suspense table/detail surfaces across dashboard home, analytics, reports, billing, notifications, team, agents, customers, properties, leads, appointments, projects, estates, blog, settings, integrations, domains, AI credits, HR employees/departments/leave/payroll, and project detail budget/workforce pages.
- Left the template sandbox route unchanged because it hydrates a sandbox index without the Suspense table/detail boundary shape covered by this pass.
- Added the Midday `batchPrefetch` helper to the dashboard tRPC server helper and converted multi-query dashboard pages to batch their prefetch orchestration, leaving single-query routes on `prefetch`.
- Moved customer and property table search filters off the shared `@plotkeys/ui/search-filter` package and onto the dashboard-local `DashboardSearchFilter`, then removed the unused shared UI search-filter export/files so filter UI ownership matches Midday's dashboard component boundary.
- Added dashboard-local `DashboardSearchFilter` wrappers for leads, projects, and blog, replacing their ad hoc table-header search inputs while preserving URL-backed `q/status` filter params and existing status summary tabs.
- Added dashboard-local q-only search-filter wrappers for agents, team members, and departments, and updated `DashboardSearchFilter` so q-only tables do not render an empty filter dropdown while still using the shared search/chip behavior.
- Added dashboard-local search-filter wrappers for employees, notifications, leave requests, appointments, and payroll, replacing the remaining raw `Input` table-header searches with URL-backed Midday-style filter components.
- Aligned PlotKeys notification Trigger tasks with the after-service job pattern by adding `logger.info` dispatch summaries, notification task max duration, and notification queue concurrency metadata.
- Added an after-service-style generic `notification` Trigger task for PlotKeys that accepts typed notification registry payloads, supports channel overrides and the production-safe `sendEmail` gate, falls back to the company owner recipient, and preserves the existing `notifications.dispatch` tenant-site adapter path.
- Moved generic notification delivery orchestration into `@plotkeys/notifications` via a package-owned `Notifications.send(...)` service, matching the after-service package boundary while keeping Trigger tasks as thin adapters.
- Added a PlotKeys notification message log table/query and wired `Notifications.send(...)` email dispatches to persist after-service-style provider/status audit rows while preserving the `sendEmail` dry-run gate.
- Extended notification message-log persistence to WhatsApp dispatches by exposing per-recipient WhatsApp send outcomes and recording provider/status/error rows from the package-owned notification service.
- Aligned the PlotKeys `email-smoke-test` handler with after-service by creating smoke-test company/lead records, sending through `Notifications.send(...)`, reading the persisted notification message log, and logging dispatch/message-log status from the Trigger task.
- Extended notification message-log persistence to in-app dispatches so package-owned notification delivery now records sent, skipped, and failed audit rows for email, WhatsApp, and in-app channels.
- Added after-service-style `sms` channel support to the PlotKeys notification contract, including phone-number delivery planning, `NotificationResult.dispatches.sms`, and package-owned SMS message-log rows.
- Added the after-service `phone` channel to the PlotKeys notification contract, including phone-number delivery planning, package-owned phone message-log rows, and `NotificationResult.dispatches.phone`.
- Added an after-service-style `NotificationTypes` schema map export for PlotKeys notifications and switched `NotificationTaskPayload` / `Notifications.send(...)` payload typing to use that shared contract.
- Added message-log persistence for the remaining legacy tenant-site property inquiry receipt and newsletter welcome email sends so `notifications.dispatch` now records provider/status audit rows for those customer-facing emails too.
- Added an after-service-style schema-backed notification job payload contract and switched the generic PlotKeys notification Trigger task to `schemaTask` with `machine: "micro"`, max duration, and queue concurrency metadata.
- Extended PlotKeys `NotificationService` with an after-service-style tasks-client transport that triggers the generic `notification` job, preserved its in-memory function transport for React/local planners, and moved dashboard workspace invite emails onto the queued notification job path with message-log persistence.
- Split the domains provisioned-hostname surface into Midday-style table files by adding `components/tables/domains/columns.tsx` and `empty-states.tsx`, then replacing the provisioned-domain card grid with a structured table that keeps cell rendering/actions in the table slice.
- Split billing history into Midday-style table files by moving billing row type, amount/date/reference/status/action cell helpers into `components/tables/billing/columns.tsx` and the no-history state into `empty-states.tsx`, leaving `table.tsx` as the section/table composition layer.
- Split AI credits usage into Midday-style table files by moving feature usage row typing and feature/count cell helpers into `components/tables/ai-credits/columns.tsx` and the no-usage state into `empty-states.tsx`, leaving `table.tsx` focused on section/table composition.
- Split notification preferences into Midday-style table files by moving preference row typing, event label/status cells, and channel toggle actions into `components/tables/notification-preferences/columns.tsx`, and moving the info card into `empty-states.tsx`.
- Split reports tables into Midday-style table files by moving agent/listing row types, badge cells, and report number cells into `components/tables/reports/columns.tsx`, then moving report empty states into `empty-states.tsx` and wiring the reports view through the table folder exports.
- Slimmed the custom-domain connection route into a Midday-style server composer with metadata, moved the page surface into `components/domains/connect-domain-view.tsx`, and moved hostname validation/submission into `components/forms/connect-domain-form.tsx`.
- Slimmed the live preview route into a Midday-style server composer with metadata and moved empty states, published-site header, presentation resolution, and section rendering into `components/live/live-preview.tsx`.
- Slimmed the builder template preview route into a Midday-style metadata composer and moved the client-only template preview studio into `components/builder/builder-template-preview.tsx`.
- Re-aligned `hooks/use-table-scroll.ts` exactly to Midday's table-scroll hook, restoring ArrowLeft/ArrowRight hotkey scrolling and the original column-width scroll/index synchronization behavior.
- Re-aligned `hooks/use-table-settings.ts` exactly to Midday's table settings hook, preserving the unified cookie persistence shape for column visibility, sizing, and ordering.
- Re-aligned `hooks/use-sticky-columns.ts` to Midday's sticky column calculation shape, preserving only the PlotKeys-local default sticky config because this dashboard does not have Midday's `transactions` table id.
- Re-shaped `utils/table-configs.ts` to Midday's documented table config layout and object ordering while preserving PlotKeys-specific table ids, sticky columns, sort field maps, and row heights.

## 2026-07-04 — Dashboard Sheet Registry

- Added a Midday-style `GlobalSheetsProvider`/`GlobalSheets` registry for dashboard sheets, moved the customer create sheet into an always-mounted URL-param sheet, and changed customer header/empty-state actions into lightweight `createCustomer=true` triggers.
- Split property listing and estate launch creation sheets out of their form files into `components/sheets/property-sheet.tsx` and `components/sheets/estate-create-sheet.tsx`, leaving the forms focused on validation, fields, and submit behavior while table/header/empty-state callers import sheet wrappers.
- Split estate launch editing into `components/sheets/estate-launch-details-sheet.tsx` plus a pure `components/forms/estate-launch-details-form.tsx`, removing the last sheet primitive usage from the dashboard forms folder.
- Added a Midday-style `components/modals` folder for dashboard dialogs by moving builder publish confirmation and template re-recommendation dialogs out of the builder feature folder, leaving `components/builder/onboarding-tools.tsx` focused on non-modal AI actions.
- Split analytics display cards, chart, and sections into `components/analytics/sections.tsx` so `components/analytics/index.tsx` is the query/composition layer, and aligned dashboard home plus analytics routes to the Midday `batchPrefetch([...])` server prefetch pattern.
- Split reports header, summary, and performance sections into `components/reports/sections.tsx` so `components/reports/index.tsx` is the query/composition layer, and aligned the reports route to the Midday `batchPrefetch([...])` server prefetch pattern.
- Replaced the remaining dashboard route-level single-query `prefetch(...)` calls with Midday-style `batchPrefetch([...])` across billing, integrations, settings, estates, project detail, blog detail, AI credits, and HR department routes.
- Split the project budget and workforce/payroll detail tables into Midday-style table slices by moving row/header cell rendering into `projects/budget/columns.tsx` and `projects/workforce/columns.tsx`, moving no-data/project-missing states into matching `empty-states.tsx` files, and leaving the public `budget.tsx` / `workforce.tsx` modules as query and section composition layers.
- Split the property form pricing-plan field array out of `property-form.tsx` into `property-pricing-plan-fields.tsx`, keeping the main form focused on defaults/submission while the dedicated field component owns the payment-plan table rendering, add/remove controls, and normalization helpers.
- Added the after-service-compatible `emailSmokeTest` Trigger task export while preserving PlotKeys' existing `emailSmokeTestTask` alias, aligning the jobs task surface without breaking current imports.
- Aligned the dashboard-local search filter with Midday checkbox behavior by keeping dropdown submenus open on checkbox selection and adding array-toggle handling for `checkbox` filters while preserving single-select filter semantics.
- Aligned the dashboard tRPC query client with Midday's data-fetching defaults by adding request-aware server/browser retry behavior, two-minute stale time, ten-minute cache retention, pending-query dehydration, superjson hydrate/dehydrate transforms, and a browser redirect to `/sign-in` on unauthorized query errors.
- Re-aligned the repeated table `data-table-header.tsx` implementations with Midday's draggable-header shape by passing sticky header classes into `DraggableHeader`, removing the extra inner wrapper around header content, and guarding draggable-column resize handles with `header.column.getCanResize()`.
- Moved the builder mobile sidebar drawer into `components/sheets/builder-sidebar-drawer.tsx`, keeping Sheet primitives inside the sheet boundary while the builder workspace imports the drawer through the dashboard-local sheets alias.
- Tightened analytics and reports composition empty-state handling so genuinely empty payloads render a single page-level empty state while populated report pages can still show section-level inline fallbacks.
- Re-aligned the dashboard-local shared search filter trigger with Midday's compact icon-only dropdown control and added a `Filter` icon alias to the PlotKeys UI icon namespace for table filter controls.
- Tightened the dashboard-local filter chip list to render from known filter definitions in definition order, matching Midday's processed active-filter list semantics instead of raw filter-object iteration.
- Aligned the notification registry fallback with after-service by defaulting unspecified notification channels to email while preserving PlotKeys' explicit per-type channel defaults.
- Moved the dashboard sheet layout helpers into `components/sheets/dashboard-sheet-layout.tsx` and rewired form/sheet callers so Sheet primitive wrappers live inside the Midday-style sheet boundary.
- Split form body/footer layout out of the sheet helper into `components/forms/form-layout.tsx`, removing the remaining form imports from the sheet boundary while preserving the previous sheet footer flex/spacing behavior.
- Moved project budget/workforce shared formatting and option helpers out of the table folder into `components/projects`, removing form dependencies on table-owned internals while keeping table slices focused on rendering.
- Normalized repeated dashboard table header rows to Midday's dense `h-[45px]` table-header height across customer, CRM, HR, project, notification, payroll, and blog table slices.
- Moved the remaining table-local domain utility modules for employees, appointments, leads, leave requests, notifications, payroll, blog, and projects into feature component folders, removing form/sheet dependencies on table-owned utility paths.
- Switched the `emailSmokeTest` Trigger job to the same schema-backed `schemaTask` pattern as the generic notification job, exporting its Zod payload schema from `@plotkeys/jobs` and declaring the jobs package's `zod` dependency.
- Switched the legacy `notifications.dispatch` Trigger task to a schema-backed `schemaTask`, composing the generic notification payload schema with contact-form, property-inquiry, and newsletter-signup schemas while exporting the dispatch schemas from `@plotkeys/jobs`.
- Wired the tenant-site contact API route into the shared `notifications.dispatch` job path after lead creation, carrying the created lead id through the dispatch payload so tenant contact submissions use the same after-service-style notification job pipeline.
- Added Zod validation to the tenant-site contact API boundary before lead creation and notification dispatch, keeping public contact submissions compatible with the schema-backed notification job payload contract.
- Rewired dashboard route pages for appointments, blog, employees, leave requests, payroll, leads, and projects to import domain guards/helpers from feature utility modules instead of table-local utility paths.
- Tightened the shared dashboard search filter active-state logic so only configured menu filters can light up the filter trigger or render chips, matching the Midday known-filter surface instead of unrelated URL params.
- Corrected the generic notification Trigger task to import its schema and payload type from `@plotkeys/notifications`, keeping the after-service-style job contract owned by the notification package instead of the handler module.
- Aligned the shared horizontal table pagination control with Midday's back/forward icon contract by adding `ArrowBack`/`ArrowForward` aliases to the PlotKeys icon namespace and using them in the table pager.
- Rewrote the primary CRM, HR, blog, customer, lead, appointment, payroll, and project table route composers to use Midday-style `@/` dashboard imports instead of route-relative component, hook, lib, tRPC, and utility paths.
- Rewrote the analytics, reports, notifications, and notification-preferences route composers to use Midday-style `@/` dashboard imports for page components, skeletons, filters, session helpers, and tRPC prefetch wiring.
- Rewrote the agents, team, properties, domains, billing, integrations, AI credits, estates, and HR departments route composers to use Midday-style `@/` dashboard imports for table components, filters, session helpers, tRPC prefetching, and table settings.
- Rewrote the blog detail, estate detail, project detail/budget/workforce, property detail, settings, and integration-settings route composers to use Midday-style `@/` dashboard imports for table components, skeletons, session helpers, and tRPC prefetch wiring.
- Rewrote the dashboard home, live preview, and app-store route composers to use Midday-style `@/` dashboard imports, leaving no remaining route-relative dashboard-local imports in `(app)` `page.tsx` files.
- Rewrote the central dashboard server actions and app-store server action imports to use Midday-style `@/lib` aliases for session, session-cookie, invite notification, tenant URL, and company-app helpers.
- Rewrote the dashboard shell and app-gate layouts to use Midday-style `@/` imports for chrome, global sheets, app gating, notification bell data, company-app context, and session helpers, leaving no remaining route-relative dashboard-local imports in `(app)` `layout.tsx` files.
- Rewrote the dashboard root layout plus sign-in, tenant sign-up, onboarding, and verify-email route composers to use Midday-style `@/` imports for auth forms, flow shell, onboarding forms, session helpers, tenant URLs, dev loaders, and tRPC provider wiring.
- Rewrote the remaining dashboard app route shells and invite flow helpers to use Midday-style `@/` imports for session helpers, session cookies, app actions, builder workspace, upload routes, dev quick-fill tools, and app-store install actions.
- Aligned the dashboard table-settings server action with Midday's exact cookie persistence contract by using `date-fns/addYears` for the ten-year expiry and declaring `date-fns` directly in the dashboard package manifest.
- Re-aligned the shared dashboard search-filter dropdown internals with Midday by extracting menu/checkbox item helpers, adding an empty-options disabled row, and making single-select filter clicks preserve the selected value until the active chip removes it.
- Aligned the PlotKeys notification package closer to after-service channel semantics by adding provider-channel support guards for email and WhatsApp templates, then skipping unsupported forced provider channels before delivery planning instead of letting jobs fail on unsupported rendered dispatches.
- Aligned WhatsApp notification logging closer to after-service by treating an unavailable WhatsApp provider as a log-only sent dispatch with no provider/error details instead of marking configured WhatsApp dispatches as skipped before logging.
- Moved the active agents roster from a capped finite list to the Midday-style infinite table contract: `workspace.listAgents` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized agents table triggers `useInfiniteScroll` while appointment pickers and public-site agent consumers unwrap the paginated `data` payload.
- Moved the HR leave requests table from a capped finite list to the Midday-style infinite table contract: `workspace.listLeaveRequests` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized leave requests table triggers `useInfiniteScroll` while preserving URL-backed search/status/sort.
- Moved the HR payroll entries table from a finite period list to the Midday-style infinite table contract: `workspace.listPayrollEntries` now accepts cursor/size pagination, returns `{ data, meta }`, the payroll route prefetches with `infiniteQueryOptions`, and the virtualized payroll table triggers `useInfiniteScroll` while summary and period selectors stay on finite queries.
- Moved the projects overview table from a capped finite list to the Midday-style infinite table contract: `projects.list` now accepts cursor/size pagination, returns `{ data, meta }`, the projects route prefetches with `infiniteQueryOptions`, and the virtualized projects table triggers `useInfiniteScroll` while preserving URL-backed search/status/sort.
- Moved the notifications table from a capped finite list to the Midday-style infinite table contract: `notifications.list` now accepts cursor/size pagination, returns `{ data, meta }`, the notifications route prefetches with `infiniteQueryOptions`, and the virtualized notifications table triggers `useInfiniteScroll` while the topbar bell unwraps the paginated recent-notification `data` payload.
- Moved the blog posts table from a capped finite list to the Midday-style infinite table contract: `workspace.listBlogPosts` now accepts cursor/size pagination, returns `{ data, meta }`, the blog route prefetches with `infiniteQueryOptions`, and the virtualized blog table triggers `useInfiniteScroll` while the builder workspace unwraps the paginated `data` payload.
- Moved the HR departments table from a finite list to the Midday-style infinite table contract: `workspace.listDepartments` now accepts cursor/size pagination, returns `{ data, meta }`, the departments route prefetches with `infiniteQueryOptions`, and the virtualized departments table triggers `useInfiniteScroll` while preserving URL-backed search/sort.
- Moved the team members table from a finite membership list to the Midday-style infinite table contract: `team.listMembers` now accepts cursor/size pagination, returns `{ data, meta }`, the team route prefetches with `infiniteQueryOptions`, and the virtualized team table triggers `useInfiniteScroll` while invite-cap checks use the authoritative `team.getOverview.activeCount`.

## 2026-07-15 — Team Midday Route/Table Ownership Pass

- Migrated the Team route shell to `HydrateClient` > `ScrollableContent`, with direct composition of `TeamHeader`, pending invites, and `components/tables/teams/data-table.tsx`.
- Removed the obsolete `components/tables/teams/index.tsx` wrapper and split `lib/team-filter-params.ts` loader; `hooks/use-team-filter-params.ts` now owns both the client hook and server loader.
- Moved Team query/table ownership into `components/tables/teams/data-table.tsx`, including filter/sort interpretation, infinite query state, empty/no-results selection, virtualization, DnD, sticky columns, and table settings.
- Retired the Team `data-table-header.tsx` filename in favor of the Midday-standard `components/tables/teams/table-header.tsx`.
- Added `components/team-header.tsx` for page-level search, column visibility, invite, and cap/upgrade controls.
- Replaced wide inline Team member row controls with `components/tables/teams/actions-menu.tsx`, using an icon dropdown in the sticky actions column for role/status/removal actions.
- Simplified Team loading and empty states to table-local, Midday-style surfaces with a 25-row table skeleton and local `EmptyState` / `NoResults` components.
- Validation: focused Team module import passed for the hook, header, table, columns, action menu, empty states, skeleton, and table header. `git diff --check` passed for the touched Team files. Direct route import remains blocked by the known local `server-only` package resolution behavior for server pages.

## 2026-07-15 — Departments Midday Route/Table Ownership Pass

- Migrated the Departments route shell to `HydrateClient` > `ScrollableContent`, with direct composition of `DepartmentsHeader` and `components/tables/departments/data-table.tsx`.
- Removed the obsolete `components/tables/departments/index.tsx` wrapper and split `lib/departments-filter-params.ts` loader; `hooks/use-departments-filter-params.ts` now owns both the client hook and server loader.
- Moved Departments query/table ownership into `components/tables/departments/data-table.tsx`, including filter/sort interpretation, infinite query state, empty/no-results selection, virtualization, DnD, sticky columns, and table settings.
- Retired the Departments `data-table-header.tsx` filename in favor of the Midday-standard `components/tables/departments/table-header.tsx`.
- Added `components/departments-header.tsx` for page-level search, column visibility, create department, and employees-navigation controls.
- Replaced wide inline Department row controls with `components/tables/departments/actions-menu.tsx`, using an icon dropdown in the sticky actions column for employee navigation and deletion.
- Simplified Departments loading and empty states to table-local, Midday-style surfaces with a 25-row table skeleton and local `EmptyState` / `NoResults` components.
- Validation: scoped Biome check/write passed for the touched Departments files, focused Departments module imports passed, stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files.

## 2026-07-15 — Notifications Midday Route/Table Ownership Pass

- Migrated the Notifications route shell to `HydrateClient` > `ScrollableContent`, with direct composition of `NotificationsHeader` and `components/tables/notifications/data-table.tsx`.
- Removed the obsolete `components/tables/notifications/index.tsx` wrapper and split `lib/notifications-filter-params.ts` loader; `hooks/use-notifications-filter-params.ts` now owns both the client hook and server loader.
- Moved Notifications query/table ownership into `components/tables/notifications/data-table.tsx`, including unread/search/sort interpretation, infinite query state, empty/no-results selection, virtualization, DnD, sticky columns, and table settings.
- Retired the Notifications `data-table-header.tsx` filename in favor of the Midday-standard `components/tables/notifications/table-header.tsx`.
- Added `components/notifications-header.tsx` for page-level search, unread/all tabs, unread badge, column visibility, and mark-all-read controls.
- Replaced wide inline Notification row controls with `components/tables/notifications/actions-menu.tsx`, using an icon dropdown in the sticky actions column for linked-item navigation and mark-read actions.
- Simplified Notifications loading and empty states to table-local, Midday-style surfaces with a 25-row table skeleton and local `EmptyState` / `NoResults` components.
- Validation: scoped Biome check/write passed for the touched Notifications files, focused Notifications module imports passed, stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files.

## 2026-07-15 — Leave Requests Midday Route/Table Ownership Pass

- Migrated the Leave Requests route shell to `HydrateClient` > `ScrollableContent`, with direct composition of `LeaveRequestsHeader` and `components/tables/leave-requests/data-table.tsx`.
- Removed the obsolete `components/tables/leave-requests/index.tsx` wrapper and split `lib/leave-requests-filter-params.ts` loader; `hooks/use-leave-requests-filter-params.ts` now owns both the client hook and server loader.
- Moved Leave Requests query/table ownership into `components/tables/leave-requests/data-table.tsx`, including status/search/sort interpretation, infinite query state, empty/no-results selection, virtualization, DnD, sticky columns, and table settings.
- Retired the Leave Requests `data-table-header.tsx` filename in favor of the Midday-standard `components/tables/leave-requests/table-header.tsx`.
- Added `components/leave-requests-header.tsx` for page-level search, status tabs, request stats, column visibility, create-sheet trigger, and employees-navigation controls.
- Replaced wide inline Leave Request row controls with `components/tables/leave-requests/actions-menu.tsx`, using an icon dropdown in the sticky actions column for approve/reject/cancel actions.
- Simplified Leave Requests loading and empty states to table-local, Midday-style surfaces with a 25-row table skeleton and local `EmptyState` / `NoResults` components.
- Validation: scoped Biome check/write passed for the touched Leave Requests files, focused Leave Requests module imports passed, stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files.

## 2026-07-15 — Payroll Midday Route/Table Ownership Pass

- Migrated the Payroll route shell to `HydrateClient` > `ScrollableContent`, with direct composition of `PayrollHeader`, `PayrollSummary`, and `components/tables/payroll/data-table.tsx`.
- Removed the obsolete `components/tables/payroll/index.tsx` wrapper and split `lib/payroll-filter-params.ts` loader; `hooks/use-payroll-filter-params.ts` now owns both the client hook and server loader.
- Moved Payroll query/table ownership into `components/tables/payroll/data-table.tsx`, including period/search/sort interpretation, infinite query state, empty/no-results selection, virtualization, DnD, sticky columns, and table settings.
- Retired the Payroll `data-table-header.tsx` filename in favor of the Midday-standard `components/tables/payroll/table-header.tsx`.
- Added `components/payroll-header.tsx` for page-level search, period tabs, active-period badge, column visibility, create-sheet trigger, and employees-navigation controls.
- Replaced wide inline Payroll row controls with `components/tables/payroll/actions-menu.tsx`, using an icon dropdown in the sticky actions column for mark-paid actions.
- Moved Payroll summary query ownership into `components/tables/payroll/summary.tsx`, keeping the route as a thin server prefetch/composition layer.
- Simplified Payroll loading and empty states to table-local, Midday-style surfaces with a 25-row table skeleton and local `EmptyState` / `NoResults` components.
- Validation: scoped Biome check/write passed for the touched Payroll files, focused Payroll module imports passed, stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files.

## 2026-07-15 — Blog Midday Route/Table Ownership Pass

- Migrated the Blog list route shell to `HydrateClient` > `ScrollableContent`, with direct composition of `BlogHeader`, `BlogSummary`, and `components/tables/blog/data-table.tsx`.
- Removed the obsolete `components/tables/blog/index.tsx` wrapper and split `lib/blog-filter-params.ts` loader; `hooks/use-blog-filter-params.ts` now owns both the client hook and server loader.
- Moved Blog query/table ownership into `components/tables/blog/data-table.tsx`, including status/search/sort interpretation, infinite query state, empty/no-results selection, virtualization, DnD, sticky columns, and table settings.
- Retired the Blog `data-table-header.tsx` filename in favor of the Midday-standard `components/tables/blog/table-header.tsx`.
- Added `components/blog-header.tsx` for page-level search, status tabs, post stats, column visibility, and create-post controls.
- Replaced wide inline Blog row controls with `components/tables/blog/actions-menu.tsx`, using an icon dropdown in the sticky actions column for edit navigation.
- Moved Blog summary query ownership into `components/tables/blog/summary.tsx`, keeping the list route as a thin server prefetch/composition layer.
- Simplified Blog loading and empty states to table-local, Midday-style surfaces with a 25-row table skeleton and local `EmptyState` / `NoResults` components.
- Validation: scoped Biome check/write passed for the touched Blog list files, focused Blog module imports passed, exact list-page stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files. The separate blog detail page still has old `DashboardPage`/`DashboardPageHeader` usage and remains a future migration target.

## 2026-07-15 — Employees Midday Route/Table Ownership Pass

- Migrated the Employees route shell to `HydrateClient` > `ScrollableContent`, with direct composition of `EmployeesHeader`, pending employee invites, and `components/tables/employees/data-table.tsx`.
- Removed the obsolete `components/tables/employees/index.tsx` wrapper and split `lib/employees-filter-params.ts` loader; `hooks/use-employees-filter-params.ts` now owns both the client hook and server loader.
- Moved Employees query/table ownership into `components/tables/employees/data-table.tsx`, including department/status/search/sort interpretation, infinite query state, empty/no-results selection, virtualization, DnD, sticky columns, and table settings.
- Retired the Employees `data-table-header.tsx` filename in favor of the Midday-standard `components/tables/employees/table-header.tsx`.
- Added `components/employees-header.tsx` for page-level search, status tabs, employee stats, column visibility, invite-sheet trigger, departments navigation, and CSV export controls.
- Replaced wide inline Employee row controls with `components/tables/employees/actions-menu.tsx`, using an icon dropdown in the sticky actions column for leave/reactivate/remove actions.
- Simplified Employees loading and empty states to table-local, Midday-style surfaces with a 25-row table skeleton and local `EmptyState` / `NoResults` components.
- Kept pending employee invites as a direct page-level sibling below the header while removing the old `DashboardSection` wrapper.
- Validation: scoped Biome check/write passed for the touched Employees files, focused Employees module imports passed, exact stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files. Direct route import remains blocked by the known local `server-only` package resolution behavior for server pages.

## 2026-07-15 — Projects Midday Route/Table Ownership Pass

- Migrated the Projects overview route shell to `HydrateClient` > `ScrollableContent`, with direct composition of `ProjectsHeader` and `components/tables/projects/data-table.tsx`.
- Removed the obsolete `components/tables/projects/index.tsx` wrapper and split `lib/projects-filter-params.ts` loader; `hooks/use-projects-filter-params.ts` now owns both the client hook and server loader.
- Moved Projects overview query/table ownership into `components/tables/projects/data-table.tsx`, including status/search/sort interpretation, infinite query state, empty/no-results selection, virtualization, DnD, sticky columns, and table settings.
- Retired the Projects `data-table-header.tsx` filename in favor of the Midday-standard `components/tables/projects/table-header.tsx`.
- Added `components/projects-header.tsx` for page-level search, status tabs, project stats, column visibility, report navigation, and create-project sheet controls.
- Replaced wide inline Project row controls with `components/tables/projects/actions-menu.tsx`, using an icon dropdown in the sticky actions column for view/activate/delete actions.
- Simplified Projects overview loading and empty states to table-local, Midday-style surfaces with a 25-row table skeleton and local `EmptyState` / `NoResults` components.
- Validation: scoped Biome check/write passed for the touched Projects overview files, focused Projects module imports passed, exact stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files. Direct route import remains blocked by the known local `server-only` package resolution behavior for server pages.

## 2026-07-15 — Analytics Midday Route/Section Ownership Pass

- Migrated the Analytics route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/analytics/page.tsx`.
- Replaced the old `DashboardPageHeader`-based analytics header with a feature-owned local header in `components/analytics/sections.tsx`.
- Replaced analytics `DashboardSection` usage with a local `AnalyticsSection` block so section ownership lives inside the analytics feature module.
- Replaced `DashboardStatGrid` and `DashboardEmptyState` usage in `components/analytics/index.tsx` with local Midday-style grid and centered empty-state surfaces.
- Simplified `components/analytics/skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: scoped Biome check/write passed for the touched Analytics files, focused Analytics module imports passed, exact stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files. Direct route import remains blocked by the known local `server-only` package resolution behavior for server pages.

## 2026-07-15 — Reports Midday Route/Section Ownership Pass

- Migrated the Reports route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/reports/page.tsx`.
- Replaced the old `DashboardPageHeader`-based reports header with a feature-owned local header and period-tab row in `components/reports/sections.tsx`.
- Replaced reports `DashboardSection` usage with a local `ReportSection` block so section ownership lives inside the reports feature module.
- Replaced the reports `DashboardEmptyState` dependency with a local centered empty-state surface in `components/tables/reports/empty-states.tsx`.
- Simplified `components/reports/skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: scoped Biome check/write passed for the touched Reports files, focused Reports module imports passed with the known Better Auth base-url warning, exact stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files. Direct route import remains blocked by the known local `server-only` package resolution behavior for server pages.

## 2026-07-15 — Billing Midday Route/Section Ownership Pass

- Migrated the Billing route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/billing/page.tsx`.
- Replaced route-level shared alert banners with local Midday-style notice bands for payment success and repair-needed states.
- Replaced the old `DashboardPageHeader` / `DashboardFilterTabs`-based billing header with a feature-owned local header and interval-tab row in `components/tables/billing/table-header.tsx`.
- Replaced billing `DashboardSection` usage with a local `BillingSection` block so section ownership lives inside the billing feature module.
- Replaced the billing history `DashboardEmptyState` dependency with a local centered empty-state surface in `components/tables/billing/empty-states.tsx`.
- Simplified `components/tables/billing/skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: scoped Biome check/write passed for the touched Billing files, focused Billing module imports passed with the known Better Auth base-url warning, exact stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files. Direct route import remains blocked by the known local `server-only` package resolution behavior for server pages.

## 2026-07-15 — AI Credits Midday Route/Section Ownership Pass

- Migrated the AI Credits route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/ai-credits/page.tsx`.
- Replaced the old `DashboardPageHeader`-based AI Credits header with a feature-owned local header in `components/tables/ai-credits/table-header.tsx`.
- Replaced `DashboardStatGrid` usage in `components/tables/ai-credits/summary.tsx` with a local responsive metric grid.
- Replaced AI Credits `DashboardSection` usage with a local `AiCreditsSection` block so section ownership lives inside the AI Credits feature module.
- Replaced the AI Credits usage `DashboardEmptyState` dependency with a local centered empty-state surface in `components/tables/ai-credits/empty-states.tsx`.
- Simplified `components/tables/ai-credits/skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: scoped Biome check/write passed for the touched AI Credits files, focused AI Credits module imports passed with the known Better Auth base-url warning, exact stale old-wrapper symbol scan returned no results, and `git diff --check` passed for the touched tracked files. Direct route import remains blocked by the known local `server-only` package resolution behavior for server pages.

## 2026-07-15 — Domains Midday Route/Section Ownership Pass

- Migrated the Domains route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/domains/page.tsx`.
- Replaced route-level shared alert banners with local Midday-style notice bands for domain error, sync, connect, and removal states.
- Migrated the Connect Domain route to `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/domains/connect/page.tsx`.
- Replaced the old `DashboardPageHeader`-based Domains header with a feature-owned local header in `components/tables/domains/table-header.tsx`.
- Replaced Domains `DashboardSection` usage with a local `DomainSection` block so section ownership lives inside the Domains table module.
- Replaced the Connect Domain view's shared `DashboardPageHeader`, `DashboardSection`, and `Alert` dependencies with local header, notice-band, and section surfaces in `components/domains/connect-domain-view.tsx`.
- Replaced the Domains `DashboardEmptyState` dependency with a local centered empty-state surface in `components/tables/domains/empty-states.tsx`.
- Simplified `components/tables/domains/skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: scoped Biome check/write passed for the touched Domains files, focused Domains component imports passed with the known Better Auth base-url warning, exact stale old-wrapper symbol scan returned no results, and the Connect Domain route import passed with the same Better Auth warning. Direct Domains route import remains blocked by the known local `server-only` package resolution behavior for server pages.

## 2026-07-15 — Integrations Midday Route/Section Ownership Pass

- Migrated the Integrations overview route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/integrations/page.tsx`.
- Migrated the Integration Settings route shell to `HydrateClient` > `ScrollableContent`, replacing route-level shared alert banners with local Midday-style notice bands.
- Replaced the old `DashboardPageHeader` / toolbar-based Integrations overview header with a feature-owned local header in `components/tables/integrations/table-header.tsx`.
- Replaced Integrations overview `DashboardSection` usage with a local `IntegrationsSection` block in `components/tables/integrations/table.tsx`.
- Replaced Integration Settings `DashboardPageHeader` and `DashboardSection` usage with local header and `IntegrationSettingsSection` surfaces in `components/tables/integrations/settings.tsx`.
- Replaced the Integrations `DashboardEmptyState` dependency with a local centered empty-state surface in `components/tables/integrations/empty-states.tsx`.
- Simplified `components/tables/integrations/skeleton.tsx` and `settings-skeleton.tsx` so loading fallbacks no longer import `dashboard-page.tsx` primitives and use stable skeleton keys.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Integrations files, and `git diff --check` passed for the touched Integrations files.

## 2026-07-15 — Settings Midday Route/Section Ownership Pass

- Migrated the parent Settings route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/settings/page.tsx`.
- Replaced parent Settings route-level shared alert banners with local Midday-style notice bands for saved/error states.
- Migrated the Notification Preferences route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper and shared saved alert from `apps/dashboard/src/app/(app)/settings/notifications/page.tsx`.
- Replaced the old `DashboardPageHeader`-based Settings and Notification Preferences headers with feature-owned local headers in their table-header modules.
- Replaced Settings `DashboardSection` usage with a local `SettingsSection` block in `components/tables/settings/table.tsx`.
- Replaced Notification Preferences `DashboardSection` usage with a local `NotificationPreferencesSection` block in `components/tables/notification-preferences/table.tsx`.
- Replaced Notification Preferences `DashboardStatGrid` usage with a local responsive metric grid in `components/tables/notification-preferences/summary.tsx`.
- Replaced the Settings `DashboardEmptyState` dependency with a local centered empty-state surface in `components/tables/settings/empty-states.tsx`.
- Simplified Settings and Notification Preferences skeletons so loading fallbacks no longer import `dashboard-page.tsx` primitives and use stable skeleton keys.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Settings files, and `git diff --check` passed for the touched Settings files.

## 2026-07-15 — Dashboard Home Midday Route/Section Ownership Pass

- Migrated the dashboard home route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/page.tsx`.
- Replaced the route-level shared error alert with a local Midday-style notice band.
- Replaced the old `DashboardPageHeader`-based home header with a feature-owned local header in `components/dashboard/home/index.tsx`.
- Replaced Dashboard Home `DashboardSection` usage with a local `DashboardHomeSection` block for publishing controls, quick actions, and connected domains.
- Replaced `DashboardStatGrid` and `DashboardStatCard` usage with a local responsive metric grid and `DashboardHomeStatCard` link surface.
- Simplified `components/dashboard/home/skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Dashboard Home files, and `git diff --check` passed for the touched Dashboard Home files.

## 2026-07-15 — Estates List Midday Route/Section Ownership Pass

- Migrated the Estates list route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/estates/page.tsx`.
- Migrated the Estate Detail route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/estates/[slug]/page.tsx`.
- Replaced route-level shared error alerts with local Midday-style notice bands on both Estates routes.
- Replaced the old `DashboardPageHeader`-based Estates list header with a feature-owned local header in `components/tables/estates/table-header.tsx`.
- Replaced Estates list `DashboardSection` usage with a local `EstatesSection` block in `components/tables/estates/table.tsx`.
- Replaced Estates list `DashboardStatGrid` usage with a local responsive metric grid in `components/tables/estates/summary.tsx`.
- Replaced the Estates `DashboardEmptyState` dependency with a local centered empty-state surface in `components/tables/estates/empty-states.tsx`.
- Simplified Estates list and Estate Detail skeletons so loading fallbacks no longer import `dashboard-page.tsx` primitives and use stable skeleton keys.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Estates route/list/skeleton files, and `git diff --check` passed for the touched Estates files.

## 2026-07-15 — Estate Detail Midday Section Ownership Pass

- Replaced the old `DashboardPageHeader`-based Estate Detail header with a feature-owned local header in `components/tables/estates/detail.tsx`.
- Replaced Estate Detail `DashboardStatGrid` usage with a local responsive metric grid.
- Replaced Estate Detail `DashboardSection` usage with a local `EstateDetailSection` block across launch brief, estate features, plan import, offer cards, grouped inventory, and purchase pipeline.
- Replaced the Estate Detail `DashboardEmptyState` dependency with a local centered not-found state.
- Preserved existing Estate detail forms, sheets, links, table rows, plan upload flow, property creation defaults, and payment-plan rendering while moving layout ownership into the feature module.
- Validation: exact stale old-wrapper symbol scan returned no results for the full Estates route/list/detail/skeleton slice, and `git diff --check` passed for the touched Estates files.

## 2026-07-15 — Live Preview Midday Route/Section Ownership Pass

- Replaced Live Preview `DashboardPage` usage with direct `ScrollableContent` ownership in `components/live/live-preview.tsx`.
- Replaced the Live Preview unavailable `DashboardEmptyState` dependency with a local centered empty-state surface.
- Replaced the old `DashboardPageHeader`-based published preview header with a feature-owned local header and action row.
- Replaced Live Preview `DashboardSection` usage with a direct constrained preview shell around the rendered published website sections.
- Preserved published-site presentation resolution and live section rendering while moving layout ownership into the live-preview feature module.
- Validation: exact stale old-wrapper symbol scan returned no results for `components/live/live-preview.tsx` and the live route, and `git diff --check` passed for the touched Live Preview file.

## 2026-07-15 — Project Detail Midday Section Ownership Pass

- Migrated the Project Detail route shell to `HydrateClient` > `ScrollableContent`, removing the old route-level `DashboardPage` wrapper from `apps/dashboard/src/app/(app)/projects/[id]/page.tsx`.
- Replaced the old `DashboardPageHeader`-based Project Detail header with a feature-owned local header in `components/tables/projects/detail.tsx`.
- Replaced Project Detail `DashboardStatGrid` usage with a local responsive metric grid.
- Replaced Project Detail `DashboardSection` usage with a local `ProjectDetailSection` block across project overview sections and AI insights.
- Replaced the Project Detail `DashboardEmptyState` dependency with a local centered not-found state.
- Simplified `components/tables/projects/detail-skeleton.tsx` so the loading fallback no longer imports `dashboard-page.tsx` primitives and uses stable skeleton keys.
- Preserved existing project forms, lists, status actions, AI insights, and detail links while moving layout ownership into the project detail module.
- Validation: exact stale old-wrapper symbol scan returned no results for the touched Project Detail files, and `git diff --check` passed for the touched Project Detail files.

## 2026-07-18 — Billing Callback Route Metadata Parity

- Added typed Next metadata to the authenticated Billing callback route so the remaining dashboard route-entrypoint audit matches Midday's metadata-bearing page contract.
- Preserved the Paystack callback verification flow, subscription activation query call, billing/app-store/layout revalidation, and redirect-only behavior.
- Validation: focused metadata scans confirmed all authenticated dashboard `page.tsx` routes now expose a metadata export, and scoped whitespace/diff checks passed for the touched route and Brain files.

## 2026-07-18 — Reports Route SearchParams Parity

- Updated the Reports dashboard route to accept `Promise<SearchParams>` from `nuqs`, matching Midday's URL-driven route-entrypoint contract for pages that prefetch from query params.
- Updated the report-period resolver to normalize string-array query values before parsing, preserving existing month/year defaults, period tabs, report prefetching, and client query behavior.
- Validation: focused scans confirmed the remaining filter/sort list pages and Reports now use the shared `SearchParams` route shape, while scoped whitespace and diff checks passed for the touched route, report utility, and Brain files.

## 2026-07-18 — Remaining Dashboard Query Route SearchParams Parity

- Updated App Store, Live Preview, Billing callback, and legacy Property detail redirect dashboard routes to accept `Promise<SearchParams>` from `nuqs`, aligning the remaining URL-driven route boundaries with the Midday page/state contract.
- Added route-local query value normalization so repeated query keys are collapsed to the first string before existing feature/control-flow code receives `q`, `tab`, `hostname`, `subdomain`, `reference`, `trxref`, `imageProvider`, or `imageQuery`.
- Preserved App Store search/tab state, Live Preview tenant hostname/subdomain resolution, Paystack reference preference, property media redirect query preservation, existing error boundaries, suspense fallbacks, and page-shell/control-flow composition.

## 2026-07-18 — Shared SearchField Source Shape Parity

- Aligned the shared dashboard `SearchField` component's local props type name with Midday's app search-field reference (`Props`), preserving the existing `shallow` prop surface, `q` query-state behavior, Escape clearing, input attributes, and App Store header usage.
- Validation: focused source scans confirmed the `Props` boundary and no stale `SearchFieldProps` residue, while scoped whitespace and diff checks passed for the touched search component and Brain files.

## 2026-07-20 — Additional Mutation Form Props Boundary Parity

- Aligned five additional dashboard mutation forms with Midday's local form prop boundary by renaming feature-specific prop aliases to local `Props` in Create Budget Line, Create Worker, Create Payroll Run, Project Budget Summary, and Connect Domain forms.
- Preserved all existing schemas, field defaults, mutation payloads, query invalidations, router refresh/push behavior, disabled/error handling, quick-fill placement, and success callbacks.
- Validation: `bunx biome check --write` and `bunx biome check` passed for the five touched form files, and a focused residue scan found no old prop type names in those files.

## 2026-07-20 — Remaining Local Mutation Form Props Boundary Parity

- Aligned six more non-invite dashboard mutation forms with Midday's local `Props` form boundary: Create Estate, Agent, Blog Post, Project, Estate Plan Upload, and Estate Launch Details.
- Preserved exported form record types, all schemas, field defaults, mutation payloads, query invalidations, upload handling, quick-fill placement, cancel/success callbacks, and submit-state behavior.
- Validation: `bunx biome check --write` and `bunx biome check` passed for the six touched form files, focused residue scans found no old local prop type names in those files, and the remaining dashboard form-prop scan is limited to the exported Property form contract plus invite forms that match Midday's descriptive invite-form exception.

## 2026-07-20 — Property Form Local Props Boundary Parity

- Collapsed the remaining exported `PropertyFormProps` type surface into a file-local `Props` type, matching Midday's standard form prop boundary for non-invite mutation forms.
- Preserved the `PropertyForm` runtime prop shape, create/edit modes, defaults, exported form record behavior, field schema, pricing-plan state, mutation payloads, invalidations, quick-fill behavior, and success/cancel callbacks.
- Validation: `bunx biome check --write` and `bunx biome check` passed for `property-form.tsx`; focused scans found no `PropertyFormProps` or `PropertyFormBaseProps` residue, and the dashboard form-prop scan is now limited to invite forms that match Midday's descriptive invite-form exception.

## 2026-07-20 — Open-Sheet Trigger Props Boundary Parity

- Aligned the remaining prop-bearing dashboard open-sheet triggers with Midday's local trigger prop boundary by renaming Open Project Sheet, Open Property Sheet, and Open Estate Launch Details Sheet prop aliases to local `Props`.
- Preserved URL-param payloads, default property create values, optional project trigger className handling, button variant/size ordering, and create/settings icon behavior.
- Validation: `bunx biome check --write` and `bunx biome check` passed for the three touched trigger files; a focused residue scan found no `OpenProjectSheetProps`, `OpenPropertySheetProps`, or `OpenEstateLaunchDetailsSheetProps` names. These trigger files are currently untracked in git, so `git diff` does not show their content.

## 2026-07-20 — Dashboard User Menu Props Boundary Parity

- Aligned the dashboard user menu with Midday's `UserMenu` source shape by renaming the local prop alias from `DashboardUserMenuProps` to `Props`.
- Preserved avatar trigger anatomy, initials fallback, company/work-role metadata, settings link, sign-out ownership, dropdown width/placement, and menu item styling.
- Validation: `bunx biome check --write` and `bunx biome check` passed for `dashboard-user-menu.tsx`; focused scans found no `DashboardUserMenuProps` residue and confirmed the local `Props` boundary. This file is currently untracked in git, so `git diff` does not show its content.
