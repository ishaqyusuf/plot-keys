# Database Relationships

## Purpose
This file captures the major entity relationships as they become defined.

## How To Use
- Update when relationship direction, cardinality, or ownership changes.
- Keep this focused on data relationships rather than API flow.

## Planned Relationships
- `Company` has many `Users`
- `Company` has many `Agents`
- `Company` has many `Properties`
- `Company` has many `Clients`
- `Company` has many `Leads`
- `Company` has many `Appointments`
- `Company` has many `WebsitePages`
- `Company` has many `BlogPosts`
- `Company` has many `Payments`
- `Company` has many `Domains`
- `Company` has one or more `AiCreditBalance` records over time or by ledger model

- `Agent` belongs to `Company`
- `Agent` may have many assigned `Properties`
- `Agent` may have many assigned `Leads`
- `Agent` may have many `Appointments`

- `Property` belongs to `Company`
- `Property` has many `PropertyMedia`
- `Property` may have many `Leads`
- `Property` may have many `Appointments`

- `Lead` belongs to `Company`
- `Lead` may belong to `Property`
- `Lead` may be assigned to `Agent`
- `Lead` may be promoted into `Client`

- `Client` belongs to `Company`
- `Client` may reference multiple properties of interest

- `WebsitePage` belongs to `Company`
- `WebsitePage` has many `SectionInstance` records
- `WebsitePage` may reference a `Template`

- `Theme` belongs to `Company`
- `Template` may be platform-owned and reusable across companies

## Open Items
- TODO: Decide whether `Agent` is a role on `User` or a separate table plus profile
- TODO: Decide whether `AiCreditBalance` is ledger-based or snapshot-based
- TODO: Decide how property-to-client interest tracking is normalized
