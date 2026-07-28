# Reference Projects

## Purpose
This file records local reference repositories that define architecture, implementation, and integration standards for Plot Keys.

## How To Use
- Use these paths when comparing project structure, UI architecture, package patterns, and local development behavior.
- Prefer the documented responsibility of each reference project over copying unrelated domain code.
- Update this file when a reference path or responsibility changes.

## Local Reference Paths
- `midday`: `/Users/M1PRO/Documents/code/_kitchen_sink/midday`
- `caltext`: `/Users/M1PRO/Documents/code/_kitchen_sink/caltext`
- `gnd`: `/Users/M1PRO/Documents/code/_turbo/gnd`
- `school-clerk`: `/Users/M1PRO/Documents/code/school-clerk`
- `halaal-coperative`: `/Users/M1PRO/Documents/code/halaal-coperative`
- `plot-keys`: `/Users/M1PRO/Documents/code/plot-keys`
- `after-service`: `/Users/M1PRO/Documents/code/micro-startups/after-service`

## Reference Responsibilities
- `midday` is the primary standard for pages, tables, modals, sheets, sidebar, forms, onboarding, layouts, tRPC calls, loading states, error states, caching patterns, file naming, and dashboard component architecture.
- `caltext`: Reference for AI assistant workflows, Hono/Nitro API routes, webhook handling, messaging adapters, AI SDK tools, and durable Vercel Workflow patterns.
- `gnd` is the reference for the standard notification package system.
- `after-service` is the primary reference for root env mode loading, local/production app URL helpers, Portless host conventions, dynamic dev-port cleanup, and production-safe app-domain generation.
- `plot-keys` should align local URL handling, portless/proxy support, and generated links with `after-service` unless a Plot Keys-specific tenant requirement is documented here.
- `school-clerk` and `halaal-coperative` are available local references for comparable SaaS product patterns when Brain docs call for them.
