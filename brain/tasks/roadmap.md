# Task Roadmap

## Purpose
This file maps near-term engineering execution in a practical order.

## How To Use
- Keep this more execution-oriented than the product roadmap.
- Update when task sequencing changes.

## Near Term
1. Scaffold workspace and monorepo config
2. Create shared UI foundation based on Midday-style package layout
3. Establish dashboard and website app shells
4. Define database and auth stack
5. Ship signup and verified-account flow with Better Auth
6. Ship guided tenant onboarding with company setup, subdomain selection, and generation-ready business inputs
7. Add resumable onboarding persistence plus tenant-profile derivation
8. Add onboarding-driven template recommendation, fallback ranking, and premium-upgrade suggestion logic
9. Ship code-backed platform templates plus Prisma-backed tenant `SiteConfiguration` records
10. Bootstrap a personalized default tenant website draft on onboarding completion
11. Build the tenant dashboard website entrypoint and recommended-template handoff
12. Add tenant domain records plus subdomain-first signup and onboarding host previews
13. Build Vercel subdomain provisioning and host-based runtime resolution
14. Build inline editing, sidebar controls, and AI field generation metadata
15. Build publish confirmation and live site replacement flow
16. Add template entitlement, free-pick, and paid-unlock records
17. Add controlled template config mode for fonts, color systems, style presets, named image slots, and page composition defaults
18. Decide whether to keep `SiteConfiguration` as the long-term aggregate or introduce `Website` plus `WebsiteVersion`
19. Build company and property management foundations that feed derived website content
20. Add lead capture and appointments
21. Add unified billing across subscriptions, templates, stock images, domains, and AI credits
22. Define construction project management domain model and feature boundaries
23. Build internal construction project core for Plus and Pro tenants
24. Add project budgets, site workforce, and project payroll workflows
25. Add customer-facing project interface for approved progress visibility
26. Add AI-powered project reporting and integrations (Phase 4)
