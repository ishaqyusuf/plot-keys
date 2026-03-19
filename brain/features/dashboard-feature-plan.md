# Dashboard Feature Plan

## Purpose
This document is the authoritative expansion plan for the tenant dashboard system.
It covers all requested feature areas — team management, site statistics, customers,
human resources, listings analytics, and more — broken down by plan tier.

Generated: 2026-03-19  
Status: Planning only. No code changes accompany this document.

---

## 1. Platform Tiers (Recap)

| Tier    | Monthly Price | Annual Price | Target User                          |
|---------|--------------|--------------|--------------------------------------|
| Starter | Free         | Free         | Solo operators, spin-off brands      |
| Plus    | ₦15,000/mo   | ₦144,000/yr  | Growing agencies, estate companies   |
| Pro     | ₦35,000/mo   | ₦336,000/yr  | Full-service real-estate companies   |

These three tiers gate every feature described below.  
Symbols used in tables: ✅ Included · 🔒 Plan-gated · ❌ Not available · 🔢 Usage-capped

---

## 2. Feature Areas

### 2.1  Team Management (Invite User, Set Role)

**What it is:**  
Let the company owner invite colleagues into the same dashboard workspace.
Each invited user gets a role that controls what they can see and do.

**Existing foundation:**  
- `User`, `Membership`, `MembershipRole` (owner / admin / agent / staff), and  
  `MembershipStatus` (invited / active / suspended) already exist in the Prisma schema.  
- Auth (Better Auth) already creates sessions and associates them with a Membership.  
- No invite UI or role-enforcement layer has been built yet.

**Role definitions:**

| Role           | Description                                                            |
|----------------|------------------------------------------------------------------------|
| `owner`        | Full access. Can transfer ownership, change plan, delete company.      |
| `admin`        | Full access except billing and ownership transfer.                     |
| `agent`        | Can manage assigned properties, leads, appointments, own profile.      |
| `staff`        | Read-only across the dashboard. Cannot publish or edit settings.       |
| `platform_admin` | Internal PlotKeys super-user. Not a customer-facing role.           |

**Features to build:**

1. **Team page** (`/team`)  
   - List all memberships (name, email, role, status, joined date).  
   - Filter by role or status.  
   - Action: suspend or reactivate a member.

2. **Invite flow**  
   - Owner or admin enters an email address and selects a role.  
   - System creates a `Membership` with `status: invited` and sends an invitation email.  
   - Invitee clicks the link, is taken to a "join workspace" page, and activates their account.  
   - If the invitee already has a PlotKeys account, they are added to the membership immediately.

3. **Role management**  
   - Owner or admin can change a member's role from the team page.  
   - Role change is immediate and recorded with an audit timestamp.

4. **Permission enforcement**  
   - All dashboard server actions check the caller's role before executing.  
   - A shared `requireRole(session, minRole)` helper enforces role hierarchy.  
   - Role hierarchy (ascending): staff → agent → admin → owner.

**Plan gates:**

| Feature                    | Starter | Plus | Pro |
|----------------------------|---------|------|-----|
| Owner account only         | ✅      | —    | —   |
| Invite up to 3 team members| ❌      | ✅   | ✅  |
| Unlimited team members     | ❌      | ❌   | ✅  |
| Agent role                 | ❌      | ✅   | ✅  |
| Admin role                 | ❌      | ✅   | ✅  |
| Custom role names (future) | ❌      | ❌   | 🔒  |

---

### 2.2  Site Statistics (Website Analytics)

**What it is:**  
A dashboard page showing how the tenant's public website is performing:
visitors, page views, top pages, lead sources, and property view counts.

**Existing foundation:**  
- `AnalyticsEvent` model already exists and is being written to on each page view  
  and contact form submission.  
- `/analytics` page exists with a basic chart.  
- Event types tracked: `page_view`, `contact_form`, `property_view`, `cta_click`.

**Features to build / expand:**

1. **Overview metrics strip**  
   - Total visitors (unique `visitorId`) — last 30 days.  
   - Total page views — last 30 days.  
   - New leads from contact form — last 30 days.  
   - Most viewed property.

2. **Visitors chart**  
   - Daily unique visitor count over the last 30 / 90 days.  
   - Line chart with period selector.

3. **Top pages table**  
   - Group by `path`, count page views per path.  
   - Show top 10 pages by view count.

4. **Traffic sources**  
   - Parse `referrer` field to bucket traffic into: Direct, Google, Social, Other.  
   - Pie / donut chart.

5. **Property analytics sub-section**  
   - Views per property (linked from property list).  
   - Most viewed, most contacted, most appointed properties.  
   - Conversion rate: property view → appointment.

6. **Lead source breakdown**  
   - Count leads by `source` field (contact_form, WhatsApp, phone, etc.)  
   - Bar chart.

7. **Real-time widget (Pro only)**  
   - Shows visitors active on the site in the last 5 minutes.  
   - Powered by Supabase Realtime or a lightweight polling API.

**Plan gates:**

| Feature                         | Starter | Plus | Pro |
|---------------------------------|---------|------|-----|
| 30-day page views + leads       | ✅      | ✅   | ✅  |
| 90-day history                  | ❌      | ✅   | ✅  |
| Full history (all time)         | ❌      | ❌   | ✅  |
| Property-level analytics        | ❌      | ✅   | ✅  |
| Traffic source breakdown        | ❌      | ✅   | ✅  |
| Lead source chart               | ✅      | ✅   | ✅  |
| Real-time active visitors       | ❌      | ❌   | ✅  |
| CSV export                      | ❌      | ✅   | ✅  |

---

### 2.3  Customers (CRM)

**What it is:**  
A staff-facing view of the company's buying / renting customers.  
Customers are people who have moved beyond "lead" — they have made or are making a
purchase, reservation, or rental transaction.

**Existing foundation:**  
- `Lead` model (name, email, phone, message, source, status) already exists.  
- `Lead.status` enum: `new → contacted → qualified → closed`.  
- No `Customer` or `TenantCustomer` model exists yet.  
- `customer-portal.md` in the brain already documents the full customer data model.

**Features to build:**

1. **Customer list** (`/customers`)  
   - Table of TenantCustomer records with name, email, status, assigned agent, joined date.  
   - Filter by status, assigned agent.  
   - Search by name or email.

2. **Customer detail** (`/customers/[id]`)  
   - Profile: name, email, phone, address, ID documents.  
   - Owned / reserved properties with payment status.  
   - Activity timeline: offers, payments, messages, appointments.  
   - Notes field for agent/staff to log observations.

3. **Lead → Customer promotion**  
   - "Convert to customer" action on a lead.  
   - Creates a `Customer` record (or links to existing by email) and a `TenantCustomer`.  
   - Preserves lead history for attribution.

4. **Customer segmentation tags**  
   - Tag customers as: Buyer, Renter, Investor, VIP, etc.  
   - Filter by tag on the list.

5. **Customer communications**  
   - Send a direct email or WhatsApp message from the customer detail page.  
   - Logged to the activity timeline.

6. **Offers & expressions of interest** (staff side)  
   - View all offers submitted by a customer.  
   - Accept, reject, or counter-offer.

**Data model additions needed:**  
```
Customer        — global identity (email, phone, name, authId?)
TenantCustomer  — (companyId, customerId, status, assignedAgentId, loyaltyTier, notes)
CustomerTag     — many-to-many TenantCustomer ↔ tag label
Offer           — (tenantCustomerId, propertyId, amount, status, expiresAt)
```

**Plan gates:**

| Feature                          | Starter | Plus | Pro |
|----------------------------------|---------|------|-----|
| Customer list (read-only)        | ❌      | ✅   | ✅  |
| Customer detail + timeline       | ❌      | ✅   | ✅  |
| Lead → Customer promotion        | ❌      | ✅   | ✅  |
| Segmentation tags                | ❌      | ✅   | ✅  |
| Customer portal (tenant site)    | ❌      | ✅   | ✅  |
| Offers management                | ❌      | ✅   | ✅  |
| Bulk email to customer segment   | ❌      | ❌   | ✅  |
| AI-written customer summary      | ❌      | ❌   | ✅  |

---

### 2.4  Human Resources & Employee Management

**What it is:**  
Internal management of all people who work for the company.  
This is broader than `Agent` (which is specifically for public-site showcase).  
HR covers employment records, contracts, leave, payroll basics, and performance.

**Relationship to existing `Agent` model:**  
- `Agent` = a person shown on the public website (may or may not be an employee).  
- `Employee` = an internal employment record (may or may not have a website profile).  
- An employee _can_ be linked to an agent profile but these are separate concepts.

**Features to build:**

1. **Employee list** (`/hr/employees`)  
   - Name, job title, department, employment type (full-time / part-time / contract), status.  
   - Add, edit, archive employees.

2. **Employee detail** (`/hr/employees/[id]`)  
   - Personal info: name, email, phone, date of birth, address.  
   - Employment: start date, probation end, department, line manager, contract type.  
   - Documents: upload employment contract, ID, certifications (stored in Supabase).  
   - Linked agent profile (optional — "link to website agent card").  
   - Dashboard access: optionally invite this employee to the dashboard (creates Membership).

3. **Departments**  
   - Manage department list (e.g., Sales, Marketing, Operations, Finance).  
   - Assign employees to departments.  
   - Used for filtering and org-chart views.

4. **Leave management**  
   - Employees (or staff with access) submit leave requests.  
   - Leave types: Annual, Sick, Maternity/Paternity, Unpaid.  
   - Approval workflow: line manager or admin approves/rejects.  
   - Leave balance tracker.

5. **Payroll basics (record-keeping only, not payment processing)**  
   - Record monthly salary for each employee.  
   - Log payment confirmations each month.  
   - Generate a simple payroll summary per period.  
   - This is NOT a payroll processing system — it records that payment was made.

6. **Performance notes**  
   - Manager can add periodic performance notes per employee.  
   - Not a full appraisal system — just a structured notes log.

7. **Org chart view**  
   - Visual tree of employees by department and reporting line.  
   - Read-only, generated from department + line-manager data.

**Data model additions needed:**  
```
Department      — (companyId, name, parentDepartmentId?)
Employee        — (companyId, userId?, agentId?, name, title, departmentId,
                    managerId, employmentType, status, startDate, probationEndDate,
                    salaryMinorUnits, currency)
EmployeeDocument — (employeeId, kind, fileUrl, uploadedAt)
LeaveRequest    — (employeeId, type, startDate, endDate, status, approvedById, notes)
PayrollEntry    — (companyId, period [year+month], employeeId, grossSalary,
                    netSalary, status [pending/paid], paidAt)
PerformanceNote — (employeeId, authorId, date, note)
```

**Plan gates:**

| Feature                           | Starter | Plus | Pro |
|-----------------------------------|---------|------|-----|
| Employee list (up to 5)           | ✅      | ✅   | ✅  |
| Unlimited employees               | ❌      | ✅   | ✅  |
| Department management             | ❌      | ✅   | ✅  |
| Leave management                  | ❌      | ✅   | ✅  |
| Payroll record-keeping            | ❌      | ✅   | ✅  |
| Document upload per employee      | ❌      | ✅   | ✅  |
| Org chart view                    | ❌      | ✅   | ✅  |
| Performance notes                 | ❌      | ❌   | ✅  |
| AI-generated appraisal summary    | ❌      | ❌   | ✅  |

---

### 2.5  Listings Management & Analytics

**What it is:**  
A more complete property listings experience than the current `/properties` page,
with richer listing data, media management, analytics per listing, and inquiry tracking.

**Existing foundation:**  
- `Property` model: title, description, price, location, bedrooms, bathrooms, specs,
  imageUrl, status, featured.  
- `PropertyStatus`: active / sold / rented / off_market.  
- `Appointment` links to `propertyId`.  
- `AnalyticsEvent` records `property_view` events.  
- No media gallery, no listing categories, no views-per-listing dashboard exists yet.

**Features to build:**

1. **Listing list** (enhanced `/properties`)  
   - Add: category filter (residential, commercial, land), status filter, price range.  
   - Sort by: date added, price, views, lead count.  
   - Quick-stats per listing: view count, lead count, appointment count.  
   - Bulk actions: feature/unfeature, change status, delete.

2. **Listing detail & editor** (`/properties/[id]`)  
   - Full edit form for all property fields.  
   - Media gallery: upload multiple images (stored in Supabase), reorder via drag-and-drop,
     set cover image.  
   - Floor plan upload.  
   - 360° / virtual tour URL embed.  
   - Features checklist (parking, pool, gym, generator, security, etc.).  
   - Location map embed (Google Maps or Mapbox coordinates input).

3. **Listing categories & types**  
   - Type: Residential / Commercial / Land / Industrial.  
   - Sub-type: Apartment, Duplex, Detached, Bungalow, Shop, Office, Warehouse, etc.  
   - Category affects which public-site template sections render.

4. **Listing analytics card**  
   - Views last 7 / 30 days (from AnalyticsEvent).  
   - Leads generated by this listing.  
   - Appointments booked.  
   - Conversion funnel: views → leads → appointments → closed.

5. **Property availability calendar**  
   - For rentals: mark available / booked date ranges.  
   - Agents can see which dates are blocked when scheduling appointments.

6. **Property document management**  
   - Attach documents per listing: title deed, survey plan, C of O, building approval.  
   - Documents visible only to staff (not public-facing).

7. **Listing publish controls**  
   - Draft / published / archived states per listing (separate from Property.status).  
   - Unpublished listings are excluded from the public site.

8. **Listing performance report**  
   - Monthly report per property: total views, lead conversion rate, time-on-market.  
   - Exportable as PDF or CSV (Pro only).

**Data model additions needed:**  
```
PropertyMedia   — (propertyId, kind [image/floorplan/tour], url, order, isCover)
PropertyFeature — (propertyId, featureKey) — checklist items
PropertyCategory — (companyId, name, type, icon)
Property additions:
  - categoryId, type (enum), subType, latitude, longitude,
    publishState (draft/published/archived), virtualTourUrl
```

**Plan gates:**

| Feature                              | Starter | Plus | Pro |
|--------------------------------------|---------|------|-----|
| Basic listing CRUD (up to 10)        | ✅      | ✅   | ✅  |
| Up to 50 listings                    | ❌      | ✅   | ✅  |
| Unlimited listings                   | ❌      | ❌   | ✅  |
| Multi-image gallery per listing      | 🔢 3   | 🔢 10| ✅  |
| Listing categories & types           | ✅      | ✅   | ✅  |
| Analytics card per listing           | ❌      | ✅   | ✅  |
| Availability calendar                | ❌      | ✅   | ✅  |
| Document management per listing      | ❌      | ✅   | ✅  |
| Draft/published/archived states      | ✅      | ✅   | ✅  |
| Listing performance report           | ❌      | ❌   | ✅  |
| AI property description generation   | ❌      | ❌   | ✅  |
| Virtual tour / 360° embed            | ❌      | ✅   | ✅  |

---

### 2.6  Notifications & Inbox

**What it is:**  
A notification centre inside the dashboard showing all system-generated alerts:
new lead, new appointment, payment received, site published, invite accepted, etc.

**Existing foundation:**  
- `packages/notifications` and `packages/notifications-react` exist.  
- `NotificationsProvider` is wired into the root layout.  
- Currently only in-memory / demo notifications; no persistent `Notification` model.

**Features to build:**

1. **Notification model**  
   - `Notification` (companyId, userId, type, title, body, isRead, link, createdAt).

2. **Notification bell** (header bar)  
   - Badge showing unread count.  
   - Dropdown with last 5 notifications.

3. **Notifications page** (`/notifications`)  
   - Full list of all notifications with read/unread state.  
   - Mark all as read.  
   - Filter by type.

4. **Notification preferences** (`/settings/notifications`)  
   - Toggle which events send in-app vs email vs WhatsApp notifications.

**Plan gates:**

| Feature                             | Starter | Plus | Pro |
|-------------------------------------|---------|------|-----|
| In-app notifications                | ✅      | ✅   | ✅  |
| Email notifications                 | ✅      | ✅   | ✅  |
| WhatsApp notifications              | ❌      | ✅   | ✅  |
| Notification preferences per user   | ❌      | ✅   | ✅  |
| 30-day notification history         | ✅      | ✅   | ✅  |
| Unlimited history                   | ❌      | ❌   | ✅  |

---

### 2.7  Settings Expansion

**What it is:**  
The current `/settings` page only has logo upload. It needs to grow into a proper
workspace settings hub.

**Settings sections:**

1. **Company profile** (`/settings/company`)  
   - Company name, slug, market focus, description.  
   - Logo upload (already built).  
   - Business registration number, RC number.  
   - Office address, phone, support email.

2. **Branding** (`/settings/branding`)  
   - Brand colours (primary, secondary, accent).  
   - Default fonts.  
   - These feed into template config defaults.

3. **Team** (`/settings/team` → redirect to `/team`)

4. **Notification preferences** (`/settings/notifications`)  
   - Per-user + per-company notification toggles.

5. **Integrations** (`/settings/integrations`)  
   - WhatsApp: connect phone number.  
   - Google Analytics: paste UA/GA4 measurement ID.  
   - Facebook Pixel: paste pixel ID.  
   - Calendly: connect for appointment sync.

6. **Danger zone** (`/settings/danger`)  
   - Transfer ownership.  
   - Delete company account (with 30-day grace period).

**Plan gates:**

| Feature                     | Starter | Plus | Pro |
|-----------------------------|---------|------|-----|
| Company profile             | ✅      | ✅   | ✅  |
| Logo upload                 | ✅      | ✅   | ✅  |
| Branding colours/fonts      | ❌      | ✅   | ✅  |
| Integrations                | ❌      | ✅   | ✅  |
| Notification preferences    | ❌      | ✅   | ✅  |

---

### 2.8  Billing & Plan Management (Expansion)

**What it is:**  
The current `/billing` page shows the current plan and a checkout button.
It needs to be expanded to a full billing centre.

**Features to add:**

1. **Invoice history** — line-item list with download links (PDF).  
2. **Payment method** — show card on file via Paystack; option to update.  
3. **Plan comparison** — side-by-side feature table on upgrade prompts.  
4. **Add-ons management** — toggle AI credit auto-refill, manage domain add-ons.  
5. **Usage summary** — AI credits used vs balance, listing count vs plan limit.

**Plan gates:** All tiers have access to their own billing details.

---

### 2.9  Reports & Exports

**What it is:**  
Company-wide reports that summarise operational performance over a period.

**Report types:**

1. **Monthly business summary** — leads, appointments, properties sold/rented, revenue closed.  
2. **Agent performance** — leads per agent, appointments per agent, closed deals per agent.  
3. **Listings report** — views, lead rate, time-on-market per listing.  
4. **Customer acquisition** — lead source breakdown, conversion funnel.

**Plan gates:**

| Feature                  | Starter | Plus | Pro |
|--------------------------|---------|------|-----|
| Summary stats (30-day)   | ✅      | ✅   | ✅  |
| Downloadable CSV reports | ❌      | ✅   | ✅  |
| PDF report generation    | ❌      | ❌   | ✅  |
| AI narrative summary     | ❌      | ❌   | ✅  |

---

## 3. Full Dashboard Navigation — Target State

This is the intended sidebar navigation after all features above are built.

```
Workspace
  ├── Dashboard (home)
  ├── Site builder
  └── Analytics

Listings
  ├── Properties
  ├── Categories
  └── Media library

CRM
  ├── Leads
  ├── Customers         [Plus+]
  └── Appointments

HR & Team
  ├── Employees
  ├── Departments
  └── Leave requests

Website
  ├── Site builder
  ├── Domains
  └── App store

Finance & Billing
  ├── Billing
  └── Reports           [Plus+]

Platform
  ├── Team              [Plus+]
  ├── Notifications
  └── Settings
```

---

## 4. Plan-Feature Matrix — Full Picture

| Feature Area                    | Starter      | Plus         | Pro          |
|---------------------------------|--------------|--------------|--------------|
| **Dashboard home**              | ✅           | ✅           | ✅           |
| **Site builder** (45 templates) | Starter only | + Plus       | All 45       |
| **Analytics** — 30-day          | ✅           | ✅           | ✅           |
| **Analytics** — 90-day          | ❌           | ✅           | ✅           |
| **Analytics** — full history    | ❌           | ❌           | ✅           |
| **Real-time visitors**          | ❌           | ❌           | ✅           |
| **Properties** — up to 10       | ✅           | ✅           | ✅           |
| **Properties** — up to 50       | ❌           | ✅           | ✅           |
| **Properties** — unlimited      | ❌           | ❌           | ✅           |
| **Media gallery** per listing   | 3 images     | 10 images    | Unlimited    |
| **Listing analytics**           | ❌           | ✅           | ✅           |
| **Listing documents**           | ❌           | ✅           | ✅           |
| **Availability calendar**       | ❌           | ✅           | ✅           |
| **Agents** — team members       | 1 (owner)    | Up to 10     | Unlimited    |
| **Leads** management            | ✅           | ✅           | ✅           |
| **Appointments**                | ✅           | ✅           | ✅           |
| **Customers (CRM)**             | ❌           | ✅           | ✅           |
| **Customer portal** (site)      | ❌           | ✅           | ✅           |
| **Customer bulk email**         | ❌           | ❌           | ✅           |
| **Team invites** — up to 3      | ❌           | ✅           | ✅           |
| **Team invites** — unlimited    | ❌           | ❌           | ✅           |
| **Role management**             | ❌           | ✅           | ✅           |
| **HR / Employees** — up to 5    | ✅           | ✅           | ✅           |
| **HR / Employees** — unlimited  | ❌           | ✅           | ✅           |
| **Leave management**            | ❌           | ✅           | ✅           |
| **Payroll record-keeping**      | ❌           | ✅           | ✅           |
| **Org chart view**              | ❌           | ✅           | ✅           |
| **Performance notes**           | ❌           | ❌           | ✅           |
| **In-app notifications**        | ✅           | ✅           | ✅           |
| **Email notifications**         | ✅           | ✅           | ✅           |
| **WhatsApp notifications**      | ❌           | ✅           | ✅           |
| **CSV export**                  | ❌           | ✅           | ✅           |
| **PDF reports**                 | ❌           | ❌           | ✅           |
| **AI credits**                  | ❌           | ❌           | ✅ (+ topup) |
| **AI content generation**       | ❌           | ❌           | ✅           |
| **AI-written summaries**        | ❌           | ❌           | ✅           |
| **Custom domain**               | ❌           | ✅           | ✅           |
| **App store integrations**      | ❌           | ✅           | ✅           |
| **Branding tokens**             | ❌           | ✅           | ✅           |
| **Mobile app request**          | ❌           | ❌           | ✅           |

---

## 5. Implementation Priority Order

The features below are ordered by impact vs effort for an engineering team.
Lower number = higher priority.

| #  | Feature                                      | Plan gate | Effort  |
|----|----------------------------------------------|-----------|---------|
| 1  | Team invites + role enforcement              | Plus      | Medium  |
| 2  | Listing media gallery (multi-image upload)   | All       | Medium  |
| 3  | Listing publish states (draft/archive)       | All       | Small   |
| 4  | Analytics expansion (90-day, property-level) | Plus      | Small   |
| 5  | Notification model + bell + page             | All       | Medium  |
| 6  | Settings expansion (company profile)         | All       | Small   |
| 7  | Customer model + list + lead promotion       | Plus      | Medium  |
| 8  | Listing categories & types                   | All       | Small   |
| 9  | Employee list + detail                       | All       | Medium  |
| 10 | Department management                        | Plus      | Small   |
| 11 | Leave management                             | Plus      | Medium  |
| 12 | Customer portal (tenant site auth)           | Plus      | Large   |
| 13 | Payroll record-keeping                       | Plus      | Small   |
| 14 | Reports + CSV export                         | Plus      | Medium  |
| 15 | Agent performance analytics                  | Plus      | Small   |
| 16 | Listing analytics card per property          | Plus      | Small   |
| 17 | Org chart view                               | Plus      | Medium  |
| 18 | Availability calendar                        | Plus      | Medium  |
| 19 | PDF report generation                        | Pro       | Large   |
| 20 | Real-time visitors widget                    | Pro       | Medium  |
| 21 | AI narrative summary / appraisal             | Pro       | Medium  |

---

## 6. Data Model Additions Summary

### New Prisma models needed:

| Model              | Purpose                                               |
|--------------------|-------------------------------------------------------|
| `PropertyMedia`    | Images, floor plans, virtual tours per property       |
| `PropertyFeature`  | Checklist features per property                       |
| `PropertyDocument` | Title deed, C of O, survey per property               |
| `Customer`         | Global customer identity                              |
| `TenantCustomer`   | Company-scoped customer relationship                  |
| `CustomerTag`      | Segmentation labels                                   |
| `Offer`            | Expression of interest / formal offer on a listing    |
| `Employee`         | Internal employment record                            |
| `Department`       | Organisational unit                                   |
| `LeaveRequest`     | Leave application and approval                        |
| `PayrollEntry`     | Monthly payroll record per employee                   |
| `EmployeeDocument` | Contracts, ID docs per employee                       |
| `PerformanceNote`  | Manager notes on employee performance                 |
| `Notification`     | Persistent in-app notification                        |
| `TeamInvite`       | Pending email invitation to join workspace            |

### `Property` model additions:
- `type` (enum: residential / commercial / land / industrial)
- `subType` (string: apartment, duplex, etc.)
- `publishState` (enum: draft / published / archived)
- `latitude`, `longitude` (Float)
- `virtualTourUrl` (String?)
- `availableFrom` (DateTime?)

### `Membership` additions:
- No schema change needed — role enforcement is a code-layer concern.

---

## 7. Open Questions

1. **Team invite email** — does the invite expire? Default: 72 hours.  
2. **Customer auth on tenant site** — share Better Auth instance with a role flag,  
   or run a second auth stack on `apps/tenant-site`?  
3. **Employee ↔ Agent link** — should an employee record automatically create an  
   agent profile when activated, or should it remain optional?  
4. **HR plan gate specifics** — is HR a Plus feature or should a basic employee  
   list (up to 5) be available on Starter?  
5. **Payroll processing** — is record-keeping enough, or should we integrate with  
   a payroll API (Paystack Salaries, Partnerstack) at Pro tier?  
6. **Listing media storage limit** — should there be a storage quota per plan  
   (e.g., Starter 1 GB, Plus 5 GB, Pro unlimited) or is it per-listing image count?  
7. **Offline availability calendar** — should booking from the tenant site also  
   block calendar slots automatically?

---

## 8. Sidebar Navigation Update Required

When the above features are built, `dashboard-sidebar.tsx` will need updating to
reflect the new navigation groups (Listings, CRM, HR & Team) and remove placeholder
`#` hrefs for Customers and Chat-bot.

See section 3 above for the full target navigation structure.
