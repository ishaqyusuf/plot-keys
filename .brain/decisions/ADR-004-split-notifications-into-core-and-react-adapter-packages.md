# ADR-004: Split Notifications into Core and React Adapter Packages

## Status
Accepted

## Context

PlotKeys needs a reusable notification system that works across all three Next.js apps in the monorepo. The first implementation needs hook-based ergonomics in app code, but the underlying notification model should not be tightly coupled to React or Next.js.

The repository also needs notification recipients to support both internal users and external subscribers, and the product language should use `notificationType` instead of `channel` for event naming.

## Decision

Notifications are split into two packages:

- `packages/notifications`: framework-agnostic notification types, recipient contacts, notification-type definitions, and store contracts
- `packages/notifications-react`: React-specific provider, hooks, and toast-style viewport built on top of the core package

The React package is the import surface for app layouts and client components. The core package owns durable notification concepts such as:

- `notificationType`
- recipient contacts for `user` and `subscriber`
- notification records and store interfaces

Next.js-specific behavior remains in the consuming apps unless a future adapter is justified.

## Alternatives Considered

- Put the entire notification system in a single React package
- Create a Next.js-specific notification package from the start
- Keep notifications app-local until more delivery channels are implemented

## Consequences

Positive impact:
- keeps durable notification concepts reusable outside React
- gives the three web apps a shared hook-based integration layer
- avoids coupling the core notification model to Next.js
- standardizes recipient support for both users and subscribers early

Tradeoffs:
- introduces an extra package boundary to maintain
- app code that only needs hooks must depend on the React adapter package
- future delivery transports will still need separate service integrations
