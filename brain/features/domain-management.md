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

## Provider Requirements
- **Vercel must remain the deployment-side domain provider** for attaching tenant hostnames to the correct projects, verifying ownership, and surfacing platform-side status for both public and dashboard hostnames.
- **Registrar support must cover `.com.ng`** in addition to mainstream gTLDs such as `.com`, so the purchase/search abstraction cannot assume a provider with US-only or gTLD-only coverage.
- The domain service should therefore support **split responsibilities**:
  - **Vercel adapter** for domain attach, verification, and deployment-facing sync
  - **Registrar adapter** for availability search, purchase, renewal, and nameserver/DNS management
- If one provider cannot satisfy both standard TLDs and `.com.ng`, use a primary registrar plus a dedicated Nigerian-domain provider behind the same service abstraction.

## Architectural Rule
- Domain operations must be handled by a dedicated service abstraction.
- Example service methods:
  - `domainService.search()`
  - `domainService.purchase()`
  - `domainService.connect()`
  - `domainService.syncDeploymentStatus()`

## Planned Providers
- **Deployment provider:** Vercel
- **Registrar layer:** choose a provider set that covers both mainstream TLDs and `.com.ng`
- Candidates for mainstream TLDs: Namecheap, GoDaddy, Resend Domains / Vercel Domains if sufficient purchase coverage exists
- Candidates for `.com.ng`: a registrar/provider with explicit Nigerian ccTLD support
- Final implementation may require more than one registrar adapter behind a shared domain service interface

## Security Rules
- Verify ownership for externally connected domains
- Enforce HTTPS
- Auto-renew or warn before expiration where supported

## Open Items
- TODO: Confirm exact registrar(s) that cover `.com.ng` purchase and renewal APIs
- TODO: DNS automation model
- TODO: Decide whether Vercel DNS, registrar DNS, or nameserver delegation is the default for purchased domains
- TODO: Hosting/runtime assumptions for custom-domain routing
