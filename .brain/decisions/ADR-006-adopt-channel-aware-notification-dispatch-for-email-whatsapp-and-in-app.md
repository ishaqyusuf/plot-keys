# ADR-006: Adopt Channel-Aware Notification Dispatch for Email, WhatsApp, and In-App

## Status
Accepted

## Context

PlotKeys already had a shared notifications core with typed `notificationType` definitions, recipient contacts, and a React in-app store. That was enough for toast-style in-app messaging, but it did not yet model delivery channels the way GND does.

The signup flow now needs real lifecycle messaging beginning with verification email, and the product direction also expects future delivery through WhatsApp and in-app surfaces. Building email delivery as a one-off auth concern would duplicate notification logic and make later transport expansion harder.

## Decision

PlotKeys will treat `notificationType` as the durable event and add channel-aware dispatch planning on top of it.

The chosen pattern is:

- `packages/notifications` remains the framework-agnostic core
- the package now follows the GND-style anatomy of `index.ts`, `payload-utils`, and `services/`
- notification definitions can now declare default channels such as `email`, `whatsapp`, and `in_app`
- notification creation can produce either:
  - an in-app notification input for the React store, or
  - a channel-aware dispatch object for delivery planning and service execution
- delivery planning filters recipients per channel based on available contact data such as email address, phone number, or user identity
- `packages/email` remains the template/rendering layer for email channel payloads rather than moving transport-specific rendering into the notifications core
- concrete WhatsApp provider calls flow through the shared `packages/app-store` client layer instead of being embedded directly into app code

## Alternatives Considered

- Keep notifications as in-app only and build email/WhatsApp separately in auth
- Replace `notificationType` with channel-first naming
- Move React Email template concerns directly into `packages/notifications`

## Consequences

Positive impact:
- keeps a single shared event model across in-app, email, and WhatsApp flows
- preserves framework independence in the notifications core
- makes auth/signup lifecycle messaging extensible without coupling it to a single transport
- aligns PlotKeys more closely with the GND notification model

Tradeoffs:
- introduces an extra dispatch-planning abstraction before real provider delivery exists
- channel transports still need concrete provider adapters later
- some notification types will initially target channels that current recipients cannot yet satisfy, such as WhatsApp without phone numbers
