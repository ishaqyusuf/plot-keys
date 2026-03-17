# System Overview

## Purpose
This file tracks the evolving platform boundary, major subsystems, and core responsibilities.

## How To Use
- Update when adding or removing major subsystems.
- Keep descriptions at the service or app boundary level.

## Current Summary
- Multi-tenant SaaS for real-estate operations and website generation.
- Shared platform supports internal dashboards and public tenant websites.
- AI, billing, domains, and rendering should remain centralized and reusable.
- The website layer is evolving toward a template-management system with marketplace licensing, draft/live versioning, controlled template configuration, editable content nodes, and tenant-aware runtime hooks.
- Onboarding is evolving from simple company setup into the guided input layer for template recommendation, draft creation, and AI-assisted website bootstrapping.

## Major Subsystems
- Tenant administration
- Guided onboarding and tenant profiling
- Operational dashboard
- Public website rendering
- Content and template management
- Template marketplace and licensing
- Draft/live website versioning
- Template configuration and design presets
- Brand assets and stock media assignment
- Listings and media
- CRM, leads, and appointments
- Payments and subscriptions
- AI generation and usage billing
- Domain and SSL management

## Open Items
- TODO: Final hosting and edge strategy
- TODO: Decide when the code-backed template catalog should become database-backed
- TODO: Finalize how template purchases, stock-image purchases, and AI credit purchases converge inside one billing center
