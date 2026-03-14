# Domain Management

## Purpose
This file documents custom-domain connection and domain purchase capabilities.

## Goal
Allow companies to search, buy, connect, renew, and manage domains directly from the platform with minimal technical friction.

## Scope
- Domain search
- Domain purchase
- Custom domain connection
- DNS guidance or automation
- Renewal workflows
- SSL issuance and renewal

## Core User Flows
1. Search domain availability
2. Purchase available domain
3. Auto-configure DNS where possible
4. Issue SSL and activate domain
5. Show ongoing management and renewal status

## Architectural Rule
- Domain operations must be handled by a dedicated service abstraction.
- Example service methods:
  - `domainService.search()`
  - `domainService.purchase()`
  - `domainService.connect()`

## Planned Providers
- One primary domain provider first
- Candidates: Namecheap, Cloudflare, GoDaddy

## Security Rules
- Verify ownership for externally connected domains
- Enforce HTTPS
- Auto-renew or warn before expiration where supported

## Open Items
- TODO: Primary provider choice
- TODO: DNS automation model
- TODO: Hosting/runtime assumptions for custom-domain routing
