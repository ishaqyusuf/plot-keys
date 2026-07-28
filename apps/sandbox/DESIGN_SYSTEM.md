# Sandbox Design System

The Sandbox app uses the shared PlotKeys UI primitives and design tokens from
`@plotkeys/ui`. Authoring chrome stays neutral and compact so the selected
website template remains the visual focus. Preview pages use template-owned
tokens and presentation rules from `@plotkeys/section-registry`.

The app intentionally has no independent component library. Reusable preview
behavior belongs in `@plotkeys/website-builder`; host-specific authentication,
routing, mutations, and testing controls stay in this app.
