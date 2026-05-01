# Public Website Launch

## Purpose
Track the public PlotKeys website positioning and launch gating rules.

## Product Positioning
- PlotKeys does not offer a freeform website builder today.
- The accurate public promise is template-led website launch: customers choose curated real-estate templates, edit the copy, and publish.
- Preferred short line: "Choose a template. Launch your site."

## Public Site Modes
- The website app uses a server-only `PLOTKEYS_PUBLIC_SITE_MODE` setting.
- Supported values are `early-access` and `landing`.
- Production defaults to `early-access` when the setting is missing.
- Development defaults to `landing` and exposes preview routes for both experiences.

## Routes
- `/` renders the public mode selected by `PLOTKEYS_PUBLIC_SITE_MODE`.
- `/landing` previews the full landing page in development.
- `/early-access` previews the early access page in development.
- Preview routes should not be publicly available in production unless that decision changes intentionally.
