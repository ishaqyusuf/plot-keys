# QA purge contract

- Start requires an unexpired signed preview snapshot plus exact
  `PURGE ALL QA DATA` confirmation.
- Live resource and credential blockers reject the whole run; retained run
  output contains aggregate counts only.

# Billing and tenant boundary contracts

- Billing tRPC procedures derive company scope from `membershipProcedure`;
  clients never submit the company id used for reads, checkout, or payment
  activation.
- Payment confirmation accepts only a provider reference and rejects
  unsuccessful transactions, invalid plan metadata, or a company id that does
  not match the active membership.
- Paystack webhook handlers verify the HMAC signature before parsing or
  mutating state. The standalone API and dashboard compatibility route execute
  the same API-owned handler with an injected database client.
- Dashboard tenant-state responses contain only `{ onboarded, tenantSlug }`.
  API or database failures degrade to `null` in dashboard proxy/session
  callers, preserving unauthenticated fallback behavior.
- Subscription changes are provider verified through Billing/webhook contracts
  or the plan-sync job. There is no client-callable manual plan-change
  mutation.

# Overview contracts

- `overview.summary` derives company scope from `membershipProcedure`; clients
  never submit the company id used by dashboard-home aggregates.
- Property, customer, lead, appointment, employee, and project counts are
  company scoped. Domain records and the published website version use the
  same company predicate.
- Domain provisioning capability is derived by the API from server
  configuration and is never accepted from the client.

# Property contracts

- `properties.*` procedures derive company scope from `membershipProcedure`;
  clients submit property or estate identifiers but never the company id.
- `properties.list` returns the shared cursor-based dashboard list contract.
  `properties.get` returns the company-scoped property plus its tenant-scoped
  view, lead, and appointment analytics, or `null` when the property is absent.
- Create and update validate any linked estate against the active company.
  Update, featured-toggle, single-delete, and bulk-delete writes include both
  property id and company id and return explicit not-found outcomes.
- Property media remains a separate `propertyMedia.*` contract.

# HR contracts

- `employees.*`, `departments.*`, `leaveRequests.*`, and `payroll.*`
  procedures derive company scope from `membershipProcedure`; clients never
  submit the company id used for reads or writes.
- Employee and department lists use the shared cursor-based dashboard list
  contract. Employee status, employee deletion, and department deletion use
  company-qualified, active-record predicates with explicit not-found results.
- Leave-request reads and status totals scope through the request's active
  employee company. Creates validate the selected employee against the active
  company; approvals record the authenticated user; bulk status inputs are
  deduplicated before their company-scoped write.
- Payroll lists, summaries, and available periods require the active company
  and explicit period inputs where applicable. Creates validate the employee
  against that company, while single and bulk paid transitions use
  company-qualified payroll-entry writes.

# Blog contracts

- `blog.*` procedures derive company scope from `membershipProcedure`; clients
  never submit the company id used for reads or writes.
- `blog.list`, `blog.stats`, and `blog.get` return only active-company posts.
  Creation records the authenticated user as author and resolves a unique slug
  within the active company.
- Update, status, single-delete, and bulk-delete writes include the active
  company predicate and return explicit not-found outcomes. Bulk deletion
  deduplicates post ids before applying one company-scoped operation.

# Estate contracts

- `estates.*` procedures derive company scope from `membershipProcedure`;
  clients never submit the company id used for launch, layout, or plot reads
  and writes.
- Estate list/detail reads use active-company predicates. Create resolves a
  company-unique slug, while update slug resolution excludes the current
  estate before applying a company-qualified write.
- Estate and plot updates/deletes return explicit not-found outcomes. Layout
  creation and plot creation validate that the estate belongs to the active
  company; plot list/update/delete operations include the company predicate.

# Onboarding contracts

- `onboarding.get`, `saveProgress`, `recommendations`, `refreshProfile`, and
  `complete` require an authenticated user and derive onboarding ownership
  from the session user id.
- `onboarding.updateInputs` additionally requires an active membership because
  it edits onboarding-derived recommendations after tenant creation.
- Progress saves and input edits re-derive and persist the internal tenant
  profile. Completion rejects existing memberships, validates subdomain and
  starter-template access, then creates the company, owner membership, paired
  domains, initial site configuration, website/version mirror, and free
  template license.

# Website and template contracts

- `website.*` protected procedures derive company scope from
  `membershipProcedure`; clients never submit the company id used for draft,
  preview, content/theme update, AI generation, or publish operations.
- `website.activeDraft`, `builder`, `preview`, `createDraft`,
  `ensureConfiguration`, `publish`, `smartFillField`, `updateContentField`,
  and `updateThemeField` operate on active-company website/configuration
  predicates. `website.renderData` is the public subdomain render contract.
- `templates.catalog` requires authentication and uses the shared API database
  context. `templates.licenses`, `claimFree`, and `syncPlan` derive tenant
  scope from active membership.
- `stockImages.licenses` and `purchase` derive company scope from membership.
  Standard-image purchase records the billing line before granting the tenant
  license; free images grant without billing.

# Sandbox contracts

- Sandbox profile authoring procedures derive their database handle from
  `ctx.db` and operate only on the shared
  `template-sandbox-public` service-owner records.
- Authoring inputs never accept a tenant/company owner and never create a
  tenant, domain, `Website`, `WebsiteVersion`, or production configuration.
- The public preview input is `{ shareId, pathname, mode }`. Output is the
  normalized company/content/theme/sample listing/agent/blog data, resolved
  manifest page identity, selected blog post when applicable, and selected
  draft/live state.
- Draft output reads current profile JSON. Live output reads only the last
  generated live snapshot, with existing compatibility normalization applied.
- URL state uses `/profiles/[profileId]?page=...&path=...` for authoring and
  `/preview/[shareId]/...?...mode=draft|live` for public previews.
