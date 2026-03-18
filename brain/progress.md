# Progress

## 2026-03-18 (latest)
- Implemented complete page flow for all templates.
  - Each template now has 4 pages: Home, About, Listings, Contact.
  - Added `baseAboutSections`, `baseListingsSections`, `baseContactSections` in `page-inventory.ts`.
  - Added `withBasePages()` helper to compose a full page inventory from a home page definition.
  - Updated all 21 template inventories (templates 1–6 and 31–45) to use `withBasePages()`.
  - Generalized `buildHomePage` → `buildPageSections(content, pageKey, templateKey, ...)` in `index.ts`.
  - Updated `ResolvedWebsitePresentation.page` from `{ page: "home" }` to `{ pageKey: string }`.
  - Added optional `pageKey` (defaults `"home"`) to `ResolveTemplateOptions` and `resolveWebsitePresentation`.
  - Updated `preview.page.page` → `preview.page.pageKey` in `apps/dashboard/src/app/builder/page.tsx`.
  - Added page navigation tab bar to `/builder/preview` showing all pages in the active template.
  - Browser URL bar in mock browser now shows the actual page slug.

- Added `/builder/preview` client-side testing page for previewing all templates without DB.
  - Template cycling via back/next buttons and dropdown with tabbed tier selector.
  - Local publish checkbox state per template.
  - Renders sections using `sectionComponents` registry and `resolveWebsitePresentation`.
- Compacted `BuilderSidebarControls` spacing (py-3→py-2, gap-5→gap-3).
- Further compacted builder setup across desktop sidebar and mobile drawer.
  - Reduced builder shell width, outer padding, section gaps, and metadata card padding in `apps/dashboard/src/app/builder/page.tsx` and `apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`.
  - Tightened picker button padding, template rows, tab spacing, and image slot input spacing in `apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`.
  - Restored optional `namedImageSlots` on `TemplateDefinition` in `packages/section-registry/src/index.ts` so builder image controls remain correctly typed.
- Made builder page sidebar responsive: hidden below `xl`, replaced with Sheet-based drawer (`BuilderSidebarDrawer`) triggered by Settings2 icon.
- Updated auth password hashing in `packages/auth/src/index.ts` to use `bcrypt-ts` (`hash`/`compare`) instead of local scrypt-based helpers.
- Added `bcrypt-ts` dependency in `packages/auth/package.json`.
- Verified no file-level TypeScript errors in `packages/auth/src/index.ts`.
- Note: workspace `packages/auth` typecheck still reports pre-existing DB query typing errors in `packages/db/src/queries/agent.ts` and `packages/db/src/queries/property.ts`.
- Fixed sign-in redirect loop where authenticated users were bounced from onboarding back to sign-in by aligning all session cookie reads/writes to `plotkeys.session_token` (`authSessionCookieName`) across dashboard middleware/session utilities, dashboard server actions, and API auth redirect resolution.
- Fixed NEXT_REDIRECT error in all dashboard server actions: moved `redirect()` calls outside `try/catch` blocks so Next.js redirect throws are no longer caught and re-thrown as error redirects.

## Section Registry Expansion
- Added 3 new section components to `extended-sections.tsx`: HeroSearchSection, WhyChooseUsSection, ServiceHighlightsSection.
- Registered all 5 new section types (FAQ, Newsletter, HeroSearch, WhyChooseUs, ServiceHighlights) in section builders, component registry, and union types in `index.ts`.
- Added 15 new template definitions (template-31 through template-45) with unique themes, content, and tier assignments.
- Created page inventory compositions for templates 31-45 in `page-inventory.ts` with reusable slot definitions.

## Dark Mode Support
- Added `dark:` variant Tailwind classes to all hardcoded color references in `home-page.tsx` section components: Eyebrow, Surface, ActionButton, HeroBannerSection, MarketStatsSection, StoryGridSection, ListingSpotlightSection, TestimonialStripSection.
- CtaBandSection left unchanged (already dark-on-dark gradient).
- Added dark variants for ContactForm error state in `extended-sections.tsx`.
- Other extended sections already use CSS variables (`--foreground`, `--muted-foreground`, etc.) that auto-adapt via `@custom-variant dark` in globals.css.
- TypeScript compilation verified clean.

## Inline Edit Fix
- Root cause: `BuilderPreviewPanel` rendered sections without `WebsiteRuntimeProvider`, so `EditableText` components could not detect draft mode via `useIsDraftMode()` hook.
- Fix: Wrapped the section rendering container with `<WebsiteRuntimeProvider renderMode="draft">` in `builder-preview-panel.tsx`.
- This enables the amber ring editing affordances and contentEditable behavior on text fields within sections when viewed in the builder.
