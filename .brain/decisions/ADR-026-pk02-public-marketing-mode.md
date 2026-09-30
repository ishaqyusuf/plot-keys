# ADR-026: Use PK02 for both public marketing modes

- Status: Accepted
- Date: 2026-09-30

## Context

The marketing app has an early-access mode and a full landing mode. Production
falls back to early access when no mode is configured. The selected PK02 design
must be the public entry point while early-access requests remain the available
conversion path.

## Decision

Render the same PK02 platform story in both modes at `/`, with Request early
access as the primary action and the existing database-backed form at the
closing conversion section. Keep the mode resolver and development-only preview
routes for compatibility. Do not query tenant records to render the platform
marketing entry point or include development tenant controls in its production
bundle.

The estate, plot, and website scenes are explicitly fictional examples. Their
controls only change local presentation state. Real tenant sites and operations
remain owned by `apps/tenant-site` and `apps/dashboard`.

## Consequences

A production deployment shows the complete PK02 page regardless of whether its
existing mode flag selects early access or landing. Launching self-serve signup
as the primary marketing conversion later requires a separate explicit decision.
