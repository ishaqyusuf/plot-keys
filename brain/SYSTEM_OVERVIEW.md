# System Overview

## Purpose
This file summarizes the platform, intended users, core modules, and the initial system direction.

## How To Use
- Read this after `brain/BRAIN.md`.
- Update when the product model, tenant model, major modules, or platform boundaries change.
- Keep it high level and implementation-neutral.

## Product Summary
The platform is a multi-tenant SaaS for real-estate companies to run operations and generate professional websites from the same system.

## Target Users
- Real-estate companies
- Property developers
- Estate managers
- Property agents

## Core Value Proposition
- Manage listings, agents, clients, leads, appointments, and websites in one operating system.
- Launch branded tenant websites quickly on subdomains or custom domains.
- Add AI-assisted content and workflow automation without building bespoke tooling per tenant.

## Tenant Model
- Each company is a tenant.
- Public tenant site example: `companyname.plotkeys.com`
- Dashboard tenant example: `dashboard.companyname.plotkeys.com`
- Tenants may connect custom domains such as `companyname.com`, with the internal dashboard living at `dashboard.companyname.com`

## Initial Core Modules
- Company management
- Property listings
- Agent management
- Client CRM
- Website generator
- Property media
- Lead management
- Appointments
- Payments
- Analytics
- AI credits and usage billing
- Domain purchase and management

## Architectural Direction
- Monorepo structure modeled after the approved `midday` project.
- Shared packages for UI, utilities, and domain services.
- Next.js web applications for dashboard and generated/public websites.
- Centralized services for AI usage billing and domain operations.
- Section-based website builder with predictable rendering and schema validation.

## Current Non-Goals
- Do not finalize every business workflow upfront.
- Do not overdesign internal services before feature implementation requires them.
- Do not introduce freeform drag-and-drop website editing in the initial architecture.
