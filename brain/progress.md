# Progress

## Current State (as of 2026-03-23)

### What's Built & Working
| Area | Status |
|------|--------|
| Onboarding (6 steps, resumable) | ✅ Done |
| Template catalog (45 templates) | ✅ Done |
| Billing/pricing (Paystack, 3 tiers) | ✅ Done |
| Auth (Better Auth, signup/signin) | ✅ Done |
| Builder (inline edit, publish, preview) | ✅ Done |
| Dark mode (ThemeProvider) | ✅ Done |
| Lead capture + dashboard | ✅ Done |
| Appointment scheduling + dashboard | ✅ Done |
| AI credits (ledger, smart-fill wired) | ✅ Done |
| Analytics (events, tracking, dashboard) | ✅ Done |
| Analytics expansion (top pages, traffic sources, property views, lead sources) | ✅ Done |
| Stock image marketplace | ✅ Done |
| Website/WebsiteVersion Phase 1-4 (reads) | ✅ Done |
| Section visibility toggles | ✅ Done |
| Domain auto-sync on onboarding | ✅ Done |
| **Dashboard sidebar navigation** | ✅ Done |
| Tenant domain management UI (`/domains`) | ✅ Done |
| Logo upload (`/settings`) | ✅ Done |
| Property/agent data binding | ✅ Done |
| Domain status surfaces (dashboard home) | ✅ Done |
| Email (Welcome + Verification + New Lead + Site Published) | ✅ Done |
| Notifications (event system, 10 types) | ✅ Done |
| Notification bell in header + preferences page | ✅ Done |
| SubmitButton adoption (6 forms) | ✅ Done |
| Jobs (custom queue, 4 handlers) | ✅ Done (Trigger.dev) |
| Listing categories & types | ✅ Done |
| Settings expansion | ✅ Done |
| Customer model + lead promotion | ✅ Done — current company-scoped customer records |
| Team invite accept flow | ✅ Done |
| HR module (Employee + Department models, pages) | ✅ Done |
| Invite-driven agent/employee onboarding | ✅ Done |
| CSV export actions + UI download buttons | ✅ Done |
| Leave management (submission + approval flow) | ✅ Done |
| Payroll page (monthly records + mark paid) | ✅ Done |
| Listing analytics card (property detail) | ✅ Done |
| Agent performance analytics | ✅ Done |
| Chat-bot | ✅ Done (LLM + Widget) |
| App Store (GA, FB Pixel, WhatsApp, Calendly) | ✅ Done |
| Custom domain purchase | ✅ Phase 1 Done — connection + search + DNS instructions |
| WebsiteVersion Phase 4 (writes) | ✅ Done |
| Template usage analytics (TemplatePicker) | ✅ Done |
| SEO & Meta Tags (per-page title/description/OG) | ✅ Done |
| Blog/CMS Module | ✅ Done — model, editor, sections, rendering |
| **Plan-based template register** | ✅ Done — plan-owned register with active `riwaq-starter` template |
| **Template-owned UI system** | ✅ Done — Riwaq-owned pages, UI, hooks, and roadmap section wired by template key |
| **Template Registry M3 — Runtime Wiring** | ✅ Done — page inventory bridge, `resolvePage()`, builder wiring, ClickGuard + InlineOverview |
| **Template Registry M4 — Tenant-Site Integration** | ✅ Done — nav/footer shell, CSS var injection, inner-page routing, home-page simplification |
| Multi-page Website Support | ✅ Done — builder page selector + URL-backed page state |
| Customer Portal Foundation Planning | ✅ Done — central branded `/portal/*` route group implemented in tenant-site |
| AI-Powered Page Content Generation | ✅ Done — per-page AI content generation in builder sidebar (10 credits) |
| Template Differentiation | ✅ Done — current register direction uses concrete plan-owned templates instead of shared family variants |
| Preview-Safe Action Interception | ✅ Done — forms, buttons, and links safely intercepted in non-live modes |
| Builder UI Shadcn Standardization | ✅ Done — PickerButton, ChevronIcon, textarea, alert all use shadcn/ui primitives |
| Listing Overview Standardization | ✅ Done — shared route + query contract for public overview pages |
| Customer portal page-boundary planning | ✅ Done |
| Customer Portal Phase 1A (Auth + Route Guards) | ✅ Done — tenant-site portal signup/login, session cookies, and protected routes |
| Customer Portal Phase 1B (Saved Listings + Live Portal Data) | ✅ Done — public property save flow plus live `/portal/dashboard` and `/portal/saved` data |
| Construction Phase 2 (Budget, Workers, Payroll) | ✅ Done |
| Construction Phase 3 (Customer Visibility) | 🟡 Partial — staff-side controls and query layer exist; customer portal project routes still pending |
| Construction Phase 4 (AI & Integrations) | 🟡 Partial — AI summary/risk/customer draft live; BOQ/QS/design integrations pending |
| Tenant Onboarding Improvements | ✅ Done |
| Trigger.dev Job Integration | ✅ Done |
| Builder locked-template upgrade flow | ✅ Done |
| Pricing strategy refresh | ✅ Done |

## 2026-07-04 — Riwaaq Landing + shadcn Create-Style Sandbox Direction

**What changed:**
- Adopted the Dribbble `Rubbait - Discover Your Ideal Property` shot as the primary visual reference for Riwaq's starter landing page direction.
- Reworked the Riwaq landing page toward an image-led real-estate hero with editorial copy, property visual, floating detail card, metrics strip, and project-history teaser.
- Added a Rubbait-inspired discovery/search card to the Riwaq hero image with editable location, property type, budget, and CTA copy.
- Added lightweight visual markers to the Riwaq hero discovery rows so the card reads more like a polished property search surface without adding a new icon dependency.
- Increased the Riwaq hero media height and narrowed the discovery card at medium sizes to preserve the airy Rubbait-style composition and reduce overlap risk with the bottom detail card.
- Added registry content exposure through `RegistryProvider` so template-owned page components can read configured sandbox content instead of hardcoded copy.
- Updated template UI helpers to resolve through tenant `--pk-*` CSS variables, keeping public template UI shadcn-style while avoiding dashboard token leakage.
- Reworked the template sandbox workbench toward a full-screen viewer with a compact shadcn Create-style side config panel using standard `@plotkeys/ui` primitives.
- Expanded style preset support toward the shadcn Create-style set: Vega, Nova, Maia, Lyra, Mira, Luma, Sera, and Rhea, while retaining legacy `myra` resolution.

## 2026-07-05 — Floating Sandbox Config Rail + Inline Editable Riwaq Copy

**What changed:**
- Replaced the sandbox's right metadata drawer with a floating left config rail inspired by shadcn Create.
- The rail is expanded at rest, shrinks to icon-only after website preview scrolling, expands on hover/focus, and ignores its own scroll/dropdown interactions when deciding whether to collapse.
- Tightened the rail header toward the shadcn Create reference: a single rounded Menu control that collapses to the menu icon and expands to the full label.
- Made the floating rail Menu header a semantic focusable button with an accessible label and visible focus state, while preserving the same shadcn Create-style collapsed/expanded layout.
- Wired the floating rail Menu button into real panel state so it can pin the rail expanded or manually collapse it while preserving the auto scroll, hover/focus, and open-select expansion behavior.
- Updated the floating rail Menu control to cycle through automatic, pinned-expanded, and manually-collapsed states, with action-specific labels so users can return to the original scroll-responsive behavior.
- Tightened the rail footer commands so preset/action controls collapse to centered icons and expand to full rounded command buttons without hidden text taking space.
- Added a collapsed preset badge to the floating rail footer so icon-only mode still shows a compact `--` preset/code signal, with the full `--preset ...` value shown on hover/focus/expanded state and tooltip.
- Made the floating rail preset badge focusable and screen-reader labeled so keyboard users can reveal the full preset tooltip without treating the badge as a command.
- Tightened the rail body collapse so group headings and dividers are removed from layout in icon-only mode, with uniform icon spacing restored until hover/focus expansion.
- Added aria labels plus shadcn tooltip primitives to collapsed rail select triggers and footer icon commands so the icon-only state remains understandable to assistive tech and hover/focus users without duplicate native tooltips.
- Added semantic labeling and expanded/collapsed state to the floating template configuration rail itself.
- Removed template name, company, market, subdomain, and plan tier from the visual configuration surface.
- Kept style controls focused on Style, Base Color, Theme, Chart Color, Heading, Font, Radius, Menu, and Menu Accent.
- Changed the floating rail controls to direct autosave selects, removing the extra per-row save/check button for a cleaner shadcn Create-like feel.
- Synced floating rail select state back to the server-refreshed theme value after autosave so the controls stay aligned with persisted configuration.
- Kept the floating rail expanded while portaled shadcn/Radix select menus are open, so choosing style options does not collapse the config panel after preview scrolling.
- Tightened the floating rail select-open marker so only the select field that actually opens a portaled menu sets and clears the global rail expansion attribute.
- Added per-select ownership to the floating rail open-marker attribute so a closing dropdown cannot accidentally clear a newer open dropdown's rail expansion state.
- Styled floating rail select menus with the same dark panel surface, subtle white border, and focused row state as the shadcn Create-inspired rail.
- Added checked-state styling to floating rail select menu rows so the current style/theme option remains visible in the dark dropdown even when it is not keyboard-focused.
- Split the floating rail style controls into shadcn Create-like groups: style/color controls, typography controls, then system/menu controls before the section visibility list.
- Reworked floating rail rows toward the shadcn Create layout: label/value text on the left, swatch/icon on the right, and icon-only cards when the rail is collapsed.
- Added swatch coverage for all registry base color systems in the floating rail so collapsed Base Color controls visually reflect neutral, stone, zinc, mauve, olive, mist, taupe, and slate.
- Made floating rail color swatches resolve named theme tokens, CSS color strings, and raw HSL token triples instead of falling back to gray when stored configs are not named options.
- Replaced the floating rail's hardcoded preset chip with a deterministic sandbox preset signature derived from the current template/style config, and wired Open Preset to the current draft sandbox URL.
- Wired the floating rail Shuffle command to a sandbox server action that uses existing `templateSandbox.updateThemeField` tRPC calls to randomize style, base color, theme/chart color, fonts, radius, and menu treatment.
- Wired the floating rail Get Code command to download a sandbox preset JSON export containing the current preset signature, template key, page, theme config, and rendered section types.
- Added stateful show/hide icons to floating rail section visibility controls so the collapsed rail distinguishes visible and hidden sections without requiring expanded labels.
- Replaced section visibility dropdowns with autosaving shadcn-style switch rows, keeping collapsed eye/hidden icons while giving expanded rail users a direct binary toggle.
- Expanded collapsed section-toggle hit targets by overlaying the hidden switch on the eye icon, so icon-only rail rows remain directly clickable before the panel fully expands.
- Kept section visibility switches keyboard-focusable while the rail is collapsed so tabbing into a section row expands the floating rail and reveals the shadcn-style toggle instead of requiring hover.
- Made the floating rail Heading and Font collapsed `Aa` previews render using the selected font family instead of a fixed generic serif face.
- Removed non-zero letter-spacing utility classes from the Riwaq template pages and sandbox rail headings so the template follows the current frontend typography rule while preserving hierarchy through size, weight, and spacing.
- Added section visibility controls to the rail through `sectionVisible.<sectionType>` theme updates and wired Riwaq page components to consume the saved visibility map.
- Established the page-config rule: route/shell/backend/tRPC resolves draft, sandbox live, tenant live, or dummy/dev data; template pages render normalized registry context.
- Added registry content commit plumbing so template-owned page components can save inline text edits through the sandbox/builder action path.
- Updated Riwaq page static copy to use `EditableText` for direct inline editing on the website surface across landing, blog, contact, roadmap, and the roadmap timeline section.
- Tuned editable text affordances so draft text reliably shows an edit cursor, strong hover border/ring, and stronger active editing focus state.
- Made the editable text hover border state explicit in the shared primitive so inline-editable copy shows a visible border and text cursor consistently across template pages.
- Strengthened the draft-mode editable text chrome with a clearer contrast stroke, hover ring, active edit ring, cloned line-box decoration, and forced text cursor so page copy visibly advertises inline editing.
- Added focusable draft-mode editable text with Enter/Space-to-edit behavior so the same border and edit cursor affordance works for keyboard users.
- Replaced the Riwaq hero discovery card's currency-specific budget glyph with a neutral stacked-bar marker so the template remains tenant- and market-agnostic.
- Extended Riwaq defaults toward the shadcn Create reference: Lyra, Taupe, Orange, Raleway, Lucide, and Radius None.
- Tuned the Riwaq landing defaults toward the Rubbait real-estate reference: search-led hero copy, warm near-black/off-white fallback palette, brown-tinted hero image overlay, and CTA routing that sends search to contact while keeping project history on the roadmap page.
- Aligned Riwaq's manifest default background and landing fallback to the Rubbait reference off-white `#ececec` while keeping near-black `#08090a` text and the brown-tinted hero image overlay.
- Added an editable Rent/Buy/Short-let mode selector to the Riwaq hero search card and declared all search-card content keys on the hero slot inventory so the registry metadata matches the rendered page.
- Tightened the Riwaq hero search filter rows with crisper white cards, larger icon pills, stacked uppercase labels/values, and CSS chevron markers so the card reads more like a real property discovery control.
- Replaced the Riwaq hero search card's handcrafted marker shapes with lucide `MapPin`, `Building2`, and `BarChart3` icons so the property discovery controls use standard icon primitives.
- Replaced the Riwaq hero search row's CSS-drawn chevron marker with lucide `ChevronRight` so the full search-card control surface uses the standard icon system.
- Added an editable floating hero status badge to the Riwaq image composition, with registered content fields and hero slot metadata so the Rubbait-inspired property surface has a stronger layered product feel.
- Added a compact bottom-right numbered page switcher to the template sandbox viewer, matching the shadcn Create preview pager pattern while keeping the floating rail focused on style and section controls.
- Added visual previews to the floating rail dropdown options so color, typography, radius, menu, and section choices carry the same shadcn Create-style swatch/icon language inside the open select menu.
- Fixed the floating rail style-control save loop by moving Style, Base Color, Theme, Chart Color, Heading, Font, Radius, Menu, Menu Accent, and section visibility updates onto the client tRPC `templateSandbox.updateThemeField` mutation with route refresh on success.
- Fixed the floating rail style-select interaction by raising the rail/dropdown stack above preview chrome and letting unsaved default options remain selectable while still showing the fallback shadcn Create-style label/icon.
- Removed the tooltip wrapper around floating rail select triggers so Radix Select owns pointer/focus behavior directly, while retaining accessible labels/titles for collapsed style controls.
- Added visible error feedback to floating rail style controls so rejected theme updates show a red rail row state and expanded error text instead of failing silently.
- Marked the public template sandbox entry and profile routes as dynamic with `revalidate = 0` so route refreshes after style/config mutations always re-read the latest sandbox profile data.
- Moved floating rail select dropdowns to Radix popper positioning beside the rail and simplified option text rendering so style/config rows are easier to select reliably while the rail floats over the preview.
- Added runtime CSS variables and data attributes for chart color, radius, menu style, menu accent, and style preset so registry templates can consume the sandbox style configuration directly.
- Expanded the Riwaq landing page's style-config consumption: preset spacing drives section/grid rhythm, radius controls hero/search/card rounding, menu style/accent controls hero pills, and chart color drives stat/timeline emphasis.
- Extracted Riwaq-local style helpers so plan-owned template pages share the same preset spacing, radius, and menu treatment logic instead of duplicating hardcoded classes.
- Updated Riwaq blog, contact, roadmap, and roadmap timeline rendering to consume the template UI resolver, so Style, Radius, Base Color, Theme, Chart Color, Heading, and Font changes carry beyond the landing page.
- Wired tenant-site `RegisterNav` to the resolved template config so Menu, Menu Accent, and Radius affect the actual public/sandbox navigation shell, not only decorative hero pills.
- Restored rich floating rail dropdown option rows with Radix `textValue` and added missing registered base color swatches for Ocean and Forest.
- Kept floating rail style selects interactive while autosave is pending and guarded optimistic state against stale mutation responses, so quick Style/Base Color/Theme/Font changes do not feel locked or get reset by an older save.
- Added a dashboard-local register preview shell to the builder/sandbox preview panel so template-owned nav/footer render around page components in the workbench, making Menu, Menu Accent, Radius, Base Color, and Theme changes visible before opening the public sandbox URL.
- Mirrored the register preview shell's desktop and native mobile nav behavior from tenant-site, including config-aware active links, CTA treatment, footer groups, and internal workbench page navigation.
- Normalized dashboard workbench preview config through the registry presentation resolver so Riwaq's default Lyra, Taupe, Orange, Raleway, menu, radius, and chart settings appear in the rail/preview before any sandbox overrides are saved.
- Normalized tenant-site shell config through template defaults before deserializing published theme JSON, keeping live register nav/provider style defaults aligned with sandbox and public sandbox rendering.
- Aligned Riwaq's default Theme and Chart Color with the Dribbble Rubbait palette by using `#522C1F` and `#907762`, and exposed both as named floating-rail options so sandbox users can select the reference colors directly.
- Added a first-class `rubbait` base color system from the Dribbble palette and made Riwaq default to it, with the explicit background override removed so the Base Color rail control can visibly change the page foundation.
- Added a safe read-time upgrade for untouched legacy default Riwaq sandbox profiles still on `taupe`/`orange`, so existing default sandbox URLs can pick up the new Rubbait palette without overwriting customized profiles.
- Normalized exact legacy Riwaq sandbox theme snapshots in tenant-site rendering, keeping draft and live `/sandbox/[shareId]` URLs aligned with the new Rubbait Base Color/Theme/Chart defaults even when older snapshots stored `taupe`/`orange`.
- Broadened the legacy Riwaq sandbox cleanup to clear only the stale `#ececec` background override on default profiles/snapshots, so Base Color changes are not masked after a profile has already moved away from the old Taupe/Orange defaults.
- Updated the section-registry manifest tests so Riwaq's contract now asserts the Rubbait base color system, brown/taupe accent defaults, and unmasked background behavior instead of the old Slate expectation.
- Hid the builder/browser chrome only in canvas-mode sandbox previews so `/template-sandbox/[profileId]` opens directly into the website surface with the floating config rail, while framed builder previews keep their existing header.
- Promoted `/template-sandbox/[profileId]` and its workbench root to a full `100svh` viewer so the sandbox matches the shadcn Create-style full-screen canvas instead of reserving old dashboard chrome space.
- Removed the one-option Icon Library row from the floating config rail so the visible shadcn Create-style controls stay focused on actionable style, typography, menu, radius, color, and section visibility settings.
- Tightened the floating rail select controls so Style/Base Color/Theme/Chart/Heading/Font keep a canonical fallback value, hold the rail open synchronously while a dropdown is open, use Radix highlighted option states, and derive Style options from the registry `stylePresets` source of truth.
- Updated the floating rail Base Color selector to render registry color-system swatches from each system's actual light background plus primary accent dot, making Rubbait Base Color visually distinct from Theme and Chart Color selections.
- Added a registry-level commit fallback to `EditableText`, so future template-owned pages can save inline text edits through the active `RegistryProvider` even when the template component does not pass an explicit `onCommit` prop.
- Strengthened the registry-local template UI primitives with shadcn-style button/input interaction states: cursor/select behavior, icon pointer guards, focus ring offsets, disabled cursor handling, and a focused contract test to keep those primitives aligned without adding a cross-package UI dependency.
- Hardened `WebsiteRuntimeProvider` so stale or unknown `colorSystem` keys fall back to Slate instead of producing an empty CSS variable set, preserving font/color/radius rendering even when a saved sandbox profile contains an invalid base color key.
- Confirmed Style, Base Color, Theme, Chart Color, Heading, Font, Radius, Menu, Menu Accent, and section visibility remain first-class sandbox controls, and wired them into an optimistic draft-theme bridge so selecting a value updates the registry preview immediately while still persisting through `templateSandbox.updateThemeField`.
- Replaced leftover inline editing glyph buttons with lucide `Pencil`, `Sparkles`, and `X` icons across the editable text/image affordances and runtime overview, keeping the sandbox personalization UI aligned with the standard shadcn/lucide control language.
- Hardened floating rail optimistic rollback semantics so style selects and section visibility toggles ignore stale mutation results and restore the last persisted value if the latest `templateSandbox.updateThemeField` save fails.
- Tightened floating rail select display so triggers render a clean current-value label beside the row icon instead of delegating display to Radix `SelectValue`, and added a checked-option left accent in dropdown menus to better match the shadcn Create rail.
- Kept floating rail style selects Radix-safe by letting dropdown pointer/keyboard events reach option rows while stopping trigger click bubbling and raising the dropdown layer above the website viewer.
- Completed the Riwaq contact page interaction surface by adding a template-UI submit button with editable copy, draft/live feedback messaging, matching content schema defaults, and contact-slot metadata for every rendered editable contact field.
- Hardened draft-mode inline editing so `EditableText` captures click events before they bubble into parent links or submit buttons, preventing accidental navigation/submission while personalizing template text.
- Aligned the Riwaq landing page with its manifest-declared home sections by rendering a compact template-UI contact/CTA band with editable copy, email/phone actions, and a contact CTA; the home sandbox rail now exposes `contact_section` and `cta_band` toggles for the page-component preview.
- Added a reusable Riwaq CTA band and rendered it on Blog, Contact, and Roadmap when `cta_band` is enabled, then exposed `cta_band` in each inner-page sandbox section list so the floating rail matches the manifest-declared page sections.
- Corrected the Riwaq landing story block to save inline edits into `story.heading`, `story.body`, and `story.ctaLabel` instead of reusing roadmap content keys, keeping rendered fields aligned with the manifest.
- Split Riwaq inner-page manifest header slots so Blog, Contact, and Roadmap declare the exact `blog.*`, `contact.*`, and `roadmap.*` copy fields their page components render, with a focused manifest contract test.
- Added a shadcn Select viewport slot and used it in the floating sandbox rail so popper dropdowns are no longer constrained to the trigger height, making Style, Base Color, Theme, Chart Color, Heading, Font, Radius, Menu, and Menu Accent choices easier to open and select.
- Added concise descriptions to floating rail style/base-color/color/font/radius/menu option rows so the expanded dropdown reads like the shadcn Create side config rather than a plain raw-value picker.
- Tokenized the Riwaq landing hero image overlay through `--pk-primary` with the Rubbait brown fallback, making Theme changes visible in the first-viewport image treatment while preserving the Dribbble reference palette by default.
- Replaced the floating rail Menu Accent generic sliders icon with a compact accent-pills preview so collapsed and dropdown rows distinguish `none`, `subtle`, and `strong` treatments visually.
- Fixed the sandbox blank-page root cause by declaring `lucide-react` as a direct `@plotkeys/section-registry` dependency, matching the registry-owned Riwaq pages and inline editing primitives that import lucide icons.
- Expanded the legacy Riwaq default sandbox migration so older default Slate/Blue/Inter profiles are upgraded to the current Rubbait base color, Rubbait Brown theme, Rubbait Taupe chart color, Raleway typography, and current Riwaq content defaults.
- Hardened the floating sandbox config rail scroll-state sync with direct preview-scroller attachment, mutation recovery, wheel/scroll sampling, and explicit state data attributes so collapse behavior can be verified against actual preview scroll position.
- Restored the floating rail to the requested expanded-at-rest behavior, then collapse-after-scroll behavior, with hover/focus expansion still available for icon-only mode.
- Removed the temporary canvas safe-inset behavior after review because it made the config panel read as docked; the sandbox rail remains a true floating overlay on the website surface.
- Changed the sandbox config rail from container-absolute positioning to viewport-fixed positioning so it remains visually floating over the website rather than reading as part of the workbench layout.
- Consolidated the floating rail's expanded-width and expanded-content class contracts so future rail edits preserve the shadcn Create-style overlay behavior without reintroducing layout docking.
- Tightened the floating rail's auto-collapse threshold so the panel shrinks almost immediately once the website preview starts scrolling, while keeping hover/focus expansion for configuration.
- Added a shared floating-rail row class contract for select and section-toggle controls so collapsed icon targets and expanded label/value rows keep the same shadcn Create-style geometry.
- Switched Riwaq blog-post cards to the registry link component so inner template links stay routed through the sandbox/tenant preview shell instead of bypassing template-aware navigation.
- Removed CSS-only hover/focus expansion paths from the floating config rail and added scroll-time hover suppression so website preview scrolling collapses the rail authoritatively; it now re-expands through rail state after pointer re-entry, focus, a pinned-open preference, or an open dropdown.
- Restored scrolling for the sandbox config controls by giving the floating rail body an explicit scrollable viewport and making the portaled config select viewport own option-list overflow.
- Removed the floating rail `--preset` badge and Open Preset action, leaving the footer focused on Shuffle style, Live Website, and Get Code; the sandbox detail route no longer resolves a base URL for the removed preset action.
- Compacted the floating config rail from a wide 17rem panel to a tighter 14.5rem panel with 56px collapsed width, 48px control rows, smaller icon frames, tighter spacing, and 36px footer actions.
- Replaced the floating rail body Radix ScrollArea with a native `overflow-y-auto` container and wheel propagation guard so the Style and Sections control list scrolls reliably inside the fixed overlay.
- Added a registry-owned template `Link` primitive with optional page metadata, routed sandbox/config links through `?page=...&path=...`, removed the floating page-number nav, and updated Riwaq links to reuse the shared registry component.
- Routed the dashboard preview shell nav/footer links through the same sandbox page-query href resolver, so Home, Roadmap, Blog, Contact, CTA, and footer links expose `?page=...&path=...` in template configuration mode.

**Verification note:**
- Scoped stale-reference search passed for the sandbox workbench.
- Scoped `git diff --check` passed for touched source and Brain files.

## 2026-07-03 — Midday Table Structure + Notification Dispatch Alignment

**What changed:**
- Replaced tenant public catch-all template routing with explicit App Router files for core, blog, listing-style, template-plan, roadmap, and utility/legal routes; shared behavior now lives in `apps/tenant-site/src/lib/tenant-page.tsx`.
- Added `apps/tenant-site/src/lib/tenant-route-map.ts` for route aliases, dynamic slug mapping, and active-template page support checks.
- Added `RegistryProvider` / `useRegistry()` in `packages/section-registry` and wired tenant layout initialization with tenant identity, template key, render mode, template config, and page capability info.
- Added `templatePages` / `templates` in `packages/section-registry` so future template-owned pages can resolve handles such as `templates.aboutPage.resolve(ctx)` with manifest-backed `{ Page, info }` metadata.
- Added registry-scoped query and mutation option builders that inject tenant/template/page/runtime scope, use dev mock resolvers outside live mode, and block live mutations in dev/preview unless explicitly mocked.
- Added template UI variant primitives for style-preset-driven button, input, and surface classes.
- Replaced the shared register family model with a plan-owned register model. The active register now contains only `starter/riwaq` (`riwaq-starter`); `plus` and `pro` are empty until their own concrete templates are added.
- Added Riwaq-owned landing, blog, contact, and roadmap page components plus nav, footer, content schema, placeholder data, local UI, local hook, and roadmap timeline section.
- Added explicit tenant `/roadmap` routing and template route support for Riwaq's project-history page.
- Added the Midday-standard dashboard table foundation under `apps/dashboard/src/components/tables/core`, plus app-local table settings, sticky-column, and scroll helpers.
- Moved active customer and property table/search modules into `apps/dashboard/src/components/tables/<domain>/*`, removing route-local table folders from those pages.
- Standardized the properties search filter onto the same provider/search-filter pattern used by customer tables.
- Refactored the properties table to column-definition driven table composition with domain empty/no-results/skeleton states under `components/tables/properties`.
- Refactored the team page into a Midday-style thin route with hydrated `team.listMembers` / `team.listInvites` prefetching, a `components/tables/teams` table slice, and extracted invite member form/sheet components.
- Refactored invite account signup so invite validation, duplicate-user checks, and invite acceptance DB setup live in `packages/db/src/queries/team.ts`, leaving the dashboard action to validate form fields, create the user through auth, set the session, revalidate, and redirect.
- Added a Midday-style `@plotkeys/db/queries` barrel export and moved dashboard query consumers off the db root barrel so dashboard app code imports query APIs through the dedicated package surface.
- Tightened the Midday-style table core by adding the dashboard `Portal`, the `components/tables/resize-handle.tsx` helper, global `scrollbar-hide`, and matching table skeleton / virtual-row hover and action-cell styling more closely to the Midday reference.
- Added Midday's draggable table header support by installing the `@dnd-kit` dashboard dependencies and adding `components/tables/draggable-header.tsx` plus `hooks/use-table-dnd.ts` for TanStack column-order updates.
- Added Midday's virtualized infinite-scroll table runtime by installing `@tanstack/react-virtual` for the dashboard and adding `hooks/use-infinite-scroll.ts` for virtualizer-backed next-page loading.
- Re-aligned the shared dashboard table core files with the Midday source shape, restoring Midday comments/interfaces/class ordering and removing the notification-specific `VirtualRow` row-class extension from the shared primitive.
- Added Midday's `nuqs` URL-sort foundation by wrapping the dashboard root layout in `NuqsAdapter` and adding `hooks/use-sort-params.ts` / `hooks/use-sort-query.ts` for table route loaders and sortable headers.
- Migrated the active customers and properties table filter params from the custom query shim to Midday-style `nuqs` schemas/loaders while preserving the existing `use*FilterParams` hook names and `setFilters(null)` clearing behavior.
- Re-aligned the shared dashboard search-filter surface with Midday's search-filter behavior by moving hotkeys to `react-hotkeys-hook`, switching search updates to submit/clear handling instead of debounce-on-type, and declaring the dashboard app dependency already present in the lockfile.
- Re-aligned the shared dashboard filter-chip helper with Midday's `FilterList` presentation by excluding the search query from active filter chips, removing the extra clear-all chip, and switching chips to the Midday square secondary button styling.
- Migrated the customer sheet/detail URL params to Midday-style `nuqs` via `hooks/use-customer-params.ts` and removed the old custom filter-query loader/state shim.
- Refactored the agents page into a hydrated Midday-style route using `workspace.listAgents`, with `components/tables/agents`, extracted agent/invite forms, and agent/invite sheets.
- Refactored the leads page into a hydrated Midday-style route using `workspace.getLeadStats` / `workspace.listLeads`, with `components/tables/leads` owning status tabs, search, columns, empty states, skeleton, and row actions.
- Refactored the appointments page into a hydrated Midday-style route using `workspace.getAppointmentStats` / `workspace.listAppointments`, with `components/tables/appointments` and an extracted appointment form/sheet.
- Refactored the HR employees page into a hydrated Midday-style route using `workspace.getEmployeeStats` / `workspace.listEmployees`, with `components/tables/employees` and an extracted employee invite form/sheet.
- Refactored the HR departments page into a hydrated Midday-style route using `workspace.listDepartments`, with `components/tables/departments` and an extracted department form/sheet; restored employee `department` filtering for department-to-roster links.
- Refactored the HR leave requests page into a hydrated Midday-style route using `workspace.getLeaveRequestStats` / `workspace.listLeaveRequests`, with `components/tables/leave-requests` and an extracted leave request form/sheet.
- Refactored the HR payroll page into a hydrated Midday-style route using `workspace.listPayrollPeriods` / `workspace.getPayrollSummary` / `workspace.listPayrollEntries`, with `components/tables/payroll` and an extracted payroll entry form/sheet.
- Refactored the notifications page into a hydrated Midday-style route using `notifications.list` / `notifications.unreadCount`, with `components/tables/notifications`, search, unread filters, and row-level mark-read actions.
- Refactored the blog editorial queue into a hydrated Midday-style route using `workspace.getBlogPostStats` / `workspace.listBlogPosts`, with `components/tables/blog` owning status filters, search, summary cards, empty states, skeleton, and row actions.
- Refactored the projects pipeline page into a hydrated Midday-style route using `projects.stats` / `projects.list`, with `components/tables/projects` and extracted project form/sheet components.
- Refactored the analytics page into a hydrated Midday-style route using an expanded `workspace.getAnalytics` bundle, with `components/analytics` owning metrics, chart/list sections, empty state, and skeleton.
- Refactored the dashboard overview page into a hydrated Midday-style route using `workspace.getDashboardOverview`, with `components/dashboard/home` owning the overview header, stats, publishing controls, domain cards, and skeleton.
- Refactored the reports page into a hydrated Midday-style route using `workspace.getReports`, with `components/reports` owning period tabs, report sections, exports, empty state, and skeleton while `components/tables/reports` owns the report table renderers.
- Rewrapped the template sandbox index route in the Midday page shell with `HydrateClient`, `ErrorBoundary`, `Suspense`, metadata, and a feature-local skeleton around the client data view.
- Slimmed the app-store route into a Midday-style server composer with metadata and moved the app-store header/grid/toggle surface into `components/app-store`, keeping company-app reads in the route/lib boundary.
- Completed the customers page migration to a Midday-style hydrated route using `customers.stats`, `filters.customers`, and `customers.get`; moved customer header/summary into `components/tables/customers`, extracted the create flow into `components/forms/customer-form` and `components/sheets/customer-sheet`, and switched customer create/update/delete UI to tRPC mutations with query invalidation.
- Refactored the listings page into a hydrated Midday-style route using filtered `workspace.listProperties` plus `filters.properties`, moved the listings header/table composition into `components/tables/properties`, and relocated the route-local property form to `components/forms/property-form`.
- Refactored the domains page into a hydrated Midday-style route using `workspace.getTenantDomainStatus` and `workspace.getCustomDomainDnsInstructions`, with `components/tables/domains` owning the page header, domain control card, DNS record table, provisioned domain list, and skeleton.
- Removed the remaining direct company-plan Prisma read from the team route by adding `team.getOverview` and hydrating plan cap metadata alongside `team.listMembers` / `team.listInvites`.
- Refactored the billing page into a hydrated Midday-style route using `workspace.getBillingInfo`, with `components/tables/billing` owning the page header, plan comparison, payment repair form, billing history table, and skeleton while billing history reads now go through `packages/db/src/queries/billing.ts`.
- Added Midday-style customer column visibility plumbing by introducing `apps/dashboard/src/store/customers.ts`, wiring `CustomersDataTable` to publish leaf columns, and adding the Tune popover control to the customer table header actions.
- Refactored the estate launches page into a hydrated Midday-style route using `workspace.listEstates`, with `components/tables/estates` owning the page header, summary cards, launch grid, empty state, and skeleton, and moved the create estate sheet form into `components/forms/estate-form`.
- Split the estate launches grid into Midday-style table-owned `columns.tsx` and `empty-states.tsx`, keeping `table.tsx` focused on section/list composition and sharing publish-state badge logic with the estate detail surface.
- Refactored the AI credits page into a hydrated Midday-style route using `workspace.getAiCreditInfo`, with `components/tables/ai-credits` owning the page header, summary cards, top-up card, usage table, empty state, and skeleton while AI credit purchases now create billing line items through `packages/db/src/queries/billing.ts`.
- Refactored notification preferences into a hydrated Midday-style settings route using `notifications.listPreferences` and `notifications.updatePreference`, with `components/tables/notification-preferences` owning the page header, summary cards, event routing table, info card, and skeleton.
- Refactored the integrations overview and settings pages into hydrated Midday-style routes using `workspace.getCompanyIntegration` / `workspace.updateCompanyIntegration`, with `components/tables/integrations` owning the overview cards, credential form, shared catalog, and skeletons while integration persistence now goes through `packages/db/src/queries/company-integration.ts`.
- Split the integrations overview card rendering into Midday-style table-owned `columns.tsx` and `empty-states.tsx`, keeping `table.tsx` focused on section/grid composition and sharing connection-count logic with the page wrapper.
- Refactored the main settings page into a hydrated Midday-style route using `workspace.getCompanySettings`, with `components/tables/settings` owning the page header, profile form, workspace plan card, branding/logo controls, workspace shortcuts, danger zone, and skeleton.
- Split the settings table slice into Midday-style `columns.tsx` and `empty-states.tsx`, moving reusable read-only fields, plan/status badges, shortcut cards, danger action UI, and unavailable state out of the table wrapper.
- Refactored the blog editor detail page into a hydrated Midday-style route using `workspace.getBlogPost` plus blog create/update/status/delete mutations, moved the editor into `components/forms/blog-post-form`, moved detail UI into `components/tables/blog`, and shifted blog slug uniqueness into `packages/db/src/queries/blog.ts`.
- Refactored the property detail page into a hydrated Midday-style route using `workspace.getPropertyDetail`, `propertyMedia.listMedia`, and public image tRPC calls, with `components/tables/properties` owning the detail header, analytics cards, media gallery controls, and skeleton while property reads now go through `packages/db/src/queries/property.ts`.
- Refactored the estate detail page into a hydrated Midday-style route using `workspace.getEstateDetail` and `workspace.createEstateLayout`, moved launch detail/plan upload forms into `components/forms`, moved the detail surface into `components/tables/estates`, and shifted estate detail/layout reads and writes into `packages/db/src/queries/estate.ts`.
- Refactored the project budget page into a hydrated Midday-style route using `projects.getBudgetDetail`, moved budget forms into `components/forms`, moved the budget detail surface into `components/tables/projects`, and shifted the page payload read into `packages/db/src/queries/project-finance.ts`.
- Refactored the project workforce page into a hydrated Midday-style route using `projects.getWorkforceDetail`, moved worker/payroll-run forms into `components/forms`, moved workforce/payroll tables into `components/tables/projects`, and shifted the page payload read into `packages/db/src/queries/project-finance.ts`.
- Refactored the project overview page into a hydrated Midday-style route using `projects.getOverviewDetail`, moved the overview detail surface into `components/tables/projects`, shifted the page payload read into `packages/db/src/queries/project.ts`, and added shared project cache invalidation for nested project mutations.
- Refactored the billing callback route so payment activation persistence lives in `packages/db/src/queries/billing.ts` via `activateSubscriptionPayment`, leaving the dashboard route to verify Paystack metadata, derive plan template access, revalidate affected paths, and redirect.
- Refactored the live preview page so tenant/company/published-site/listing/agent reads live in `packages/db/src/queries/website.ts` via `getLivePreviewData`, leaving the dashboard route to render empty states and published site sections.
- Refactored the builder workspace so company/draft/published/listing/agent/blog/license/onboarding reads and draft fallback creation live in `packages/db/src/queries/website.ts` via `getBuilderWorkspaceData`, leaving the dashboard component to render status states and builder presentation.
- Refactored the Paystack webhook route so subscription activation, subscription-created status updates, cancellation/license sync, past-due marking, and subscription billing rows live in `packages/db/src/queries/billing.ts`, leaving the dashboard route to verify signatures and dispatch event payloads.
- Refactored dashboard company-app state helpers so enabled-app/plan reads and enabled-app writes live in `packages/db/src/queries/company-apps.ts`, leaving `apps/dashboard/src/lib/company-apps.ts` to resolve app registry context and request caching.
- Refactored dashboard notification bell data so unread-count and recent-notification reads live in `packages/db/src/queries/notifications.ts` via `getNotificationBellDataForUser`, leaving the dashboard lib to resolve session state and serialize dates for navigation props.
- Refactored the dashboard asset upload route so DB setup, property ownership validation, and upload persistence live behind `@plotkeys/api/asset-service` via `createTenantAssetFromUpload`, leaving the route to validate form input and map upload results to HTTP responses.
- Aligned the dashboard table scroll hook with Midday's column-width scroll behavior and moved the customers table off the UI-package scroll shim onto the dashboard-local hook.
- Moved the active customers table off the shared UI data-table provider and onto Midday-style feature-owned TanStack table rendering with persisted table settings, draggable/resizable headers, sticky columns, virtual rows, infinite loading, horizontal pagination controls, and server-loaded sort/table settings.
- Moved the active listings/properties table off the shared UI data-table provider and onto Midday-style feature-owned TanStack table rendering with persisted table settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed sort for `workspace.listProperties`.
- Moved the active leads table onto Midday-style feature-owned TanStack table rendering with persisted table settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `workspace.listLeads`.
- Moved the active employees roster onto the same Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `workspace.listEmployees`.
- Moved the active departments table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/sort for `workspace.listDepartments`.
- Moved the active appointments table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/upcoming/sort for `workspace.listAppointments`.
- Moved the active payroll table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/sort while preserving period-scoped `workspace.listPayrollEntries` fetching.
- Moved the active projects table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `projects.list`.
- Moved the active leave requests table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `workspace.listLeaveRequests`.
- Moved the active notifications table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, unread-row styling through the shared virtual row primitive, and URL/server-backed search/unread/sort for `notifications.list`.
- Moved the active team members table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/sort for `team.listMembers`.
- Moved the active agents table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/sort for `workspace.listAgents`.
- Moved the active blog table onto the Midday-style table architecture with persisted settings, draggable/resizable headers, sticky/action columns, virtual rows, horizontal pagination controls, and URL/server-backed search/status/sort for `workspace.listBlogPosts`.
- Normalized the reports analytics tables to the shared dashboard table presentation shell with overflow containment, bordered headers/rows/cells, and no legacy `border-separate` table styling.
- Normalized the project budget/workforce detail subtables to the shared dashboard table presentation shell and removed the remaining legacy `border-separate` table styling from project detail tables.
- Added a Midday-style dashboard `ErrorFallback` and wrapped the dashboard home and analytics hydrated data views in `ErrorBoundary` around their Suspense boundaries.
- Refactored the public team-invite join and profile-completion pages so invite lookup, invite validation, and existing agent/employee profile reads live in `packages/db/src/queries/team.ts`, leaving the dashboard pages to render invite states and redirects.
- Aligned the PlotKeys notification job task layout toward after-service by grouping the Trigger `notification` task and `email-smoke-test` task in `packages/jobs/src/tasks/notifications.ts` while preserving the existing package-owned handlers and task exports.
- Tightened PlotKeys email provider configuration toward after-service by requiring `EMAIL_FROM_ADDRESS` for notification email sends instead of falling back to a hardcoded sender address.
- Aligned the PlotKeys notifications package boundary toward after-service by moving the remaining payload-utils consumer to the root `@plotkeys/notifications` export and collapsing the package export map to the single root entrypoint.
- Made the PlotKeys notifications root barrel explicit by replacing broad wildcard re-exports with the intentional public notification classes, schemas, delivery helpers, services, contact helpers, and types currently consumed by apps/packages.
- Split the WhatsApp provider out of `@plotkeys/app-store` into a dedicated `@plotkeys/whatsapp` package with the after-service-style Twilio client contract, so notification delivery depends on a provider package instead of an app-store integration package.
- Added Midday-style properties/listings column visibility plumbing by introducing a properties table column store, wiring `PropertiesDataTable` to publish leaf columns, and adding the Tune popover control to the listings table header actions.
- Added Midday-style leads column visibility plumbing by introducing a leads table column store, wiring `LeadsDataTable` to publish leaf columns, and adding the Tune popover control to the lead queue header actions.
- Added Midday-style column visibility plumbing across the remaining active table-settings tables: agents, appointments, blog, departments, employees, leave requests, notifications, payroll, projects, and team members now publish TanStack leaf columns to domain stores and expose the Tune popover control in their table headers.
- Tightened the shared dashboard search-filter dropdown toward Midday's semantic filter presentation by expanding the filter icon registry for status, customer-status, listing type, department, role, period, featured, and view filter keys.
- Refactored invite profile completion so accepted-invite validation plus agent/employee profile upsert writes live in `packages/db/src/queries/team.ts` via `completeTeamInviteProfile`, leaving the server action to parse form values, choose display labels, revalidate paths, and redirect.
- Refactored dashboard CSV exports so lead/property/customer/appointment/employee export rows and report CSV assembly live in `packages/db/src/queries/*`, leaving server actions to authorize the tenant, preserve current CSV formatting, and surface database-unavailable errors.
- Refactored HR leave and payroll server actions so company-scoped employee validation, leave status transitions, payroll entry creation, and paid marking live in `packages/db/src/queries/leave-request.ts` and `packages/db/src/queries/payroll.ts`, leaving dashboard actions to parse form data, revalidate paths, and redirect.
- Refactored HR employee and department server actions so company-scoped employee CRUD, work-role persistence, and department CRUD live in `packages/db/src/queries/employee.ts` and `packages/db/src/queries/department.ts`, leaving dashboard actions to parse forms, revalidate paths, and redirect.
- Refactored property media upload plumbing so property-scoped asset upload uses `createTenantAssetFromUpload`, cover-image sync lives in `packages/db/src/queries/property-media.ts`, and the property-media router reuses package queries for property ownership checks.
- Refactored workspace app-store install/uninstall actions so company-app DB setup and mutations live in `packages/db/src/queries/company-apps.ts`, leaving dashboard actions to authorize the session and revalidate the app-store page.
- Refactored signup/onboarding server actions so subdomain availability checks, persisted onboarding reads, and final onboarding progress updates live behind `packages/db/src/queries/onboarding.ts`, while dashboard actions retain cookie fallback, redirects, and workspace procedure orchestration.
- Refactored workspace invite notification context so company display-name lookup lives in `packages/db/src/queries/company.ts`, leaving the shared invite action to create invites, send notifications, revalidate paths, and redirect.
- Refactored builder configuration existence checks so active draft lookup lives behind `packages/db/src/queries/website.ts` via `getActiveDraftForCompany`, leaving the dashboard action to call workspace orchestration and redirect when a draft must be selected.
- Refactored estate creation slug collision handling so slug normalization and uniqueness checks live in `packages/db/src/queries/estate.ts`, leaving the dashboard action to parse the form, call workspace creation, revalidate, and redirect.
- Refactored the onboarding route so durable saved onboarding-state reads live in `packages/db/src/queries/onboarding.ts` via `getTenantOnboardingForUser`, leaving the page to handle host/cookie fallbacks and step rendering.
- Tightened the shared dashboard sticky-column runtime by removing the domain-specific fallback from `useStickyColumns` and making `TableSkeleton` derive explicit sticky widths from its own column IDs, so loading tables align with each table's Midday-style sticky configuration.
- Moved the active listings/properties data flow from a finite table query to the Midday-style infinite table contract: `workspace.listProperties` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized properties table triggers `useInfiniteScroll` for next-page loading.
- Moved the active leads queue from a capped finite list to the Midday-style infinite table contract: `workspace.listLeads` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized leads table triggers `useInfiniteScroll` while preserving URL-backed search/status/sort.
- Moved the active appointments table from a capped finite list to the Midday-style infinite table contract: `workspace.listAppointments` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized appointments table triggers `useInfiniteScroll` while preserving URL-backed search/status/view/sort.
- Moved the active employees roster from a capped finite list to the Midday-style infinite table contract: `workspace.listEmployees` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized employees table triggers `useInfiniteScroll` while leave/payroll employee option sheets read the paginated `data` payload.
- Refactored dashboard session/proxy tenant host checks so custom-host slug resolution and tenant-onboarded checks live in `packages/db/src/queries/tenant-domain.ts`, leaving dashboard plumbing to manage headers, cookies, and redirects.
- Replaced placeholder notification job logging with real dispatch through `@plotkeys/notifications` email, WhatsApp, and in-app delivery planning.
- Added after-service-style email recipient override support through `resolveEmailRecipients()` and structured email send results.
- Added an after-service-style `email-smoke-test` Trigger task and exported job handler so production email delivery can be verified through the same `EmailService` path used by notification jobs.
- Added the after-service-style direct `email:test` script and `scripts/send-test-email.mjs` path so local Resend configuration can be verified with `TEST_EMAIL` through the workspace env loader without running the full app.

**Verification note:**
- Dashboard `tsc --noEmit` passed before the later fast-command discipline switch.
- After the fast-command switch, validation stayed limited to scoped source inspection, exact-symbol searches, and scoped `git diff --check`.

## 2026-04-06 — Customer Portal Phase 1C — Offers Workflow

**What was built:**
- `CustomerOffer` Prisma model with `OfferStatus` enum (pending/accepted/rejected/withdrawn); migration SQL written, awaiting apply
- Five new query functions: `hasPendingOfferForCustomer`, `submitOfferForCustomer`, `withdrawOfferForCustomer`, `countOffersForCustomer`, `listOffersForCustomer`
- Two server actions: `submitOfferAction` (submit with optional amount + message), `withdrawOfferAction` (pending offers only)
- `portal-offer-card.tsx` — card component with status badge and inline withdraw form
- `/portal/offers` page — live offer grid, four status banners, empty state
- `/portal/dashboard` — "Coming online next" placeholder replaced with "Active offers" widget showing count + recent 3
- Property detail page — "Enquire" div replaced with auth-aware offer form; unauthenticated visitors get "Sign in to make an offer" link

**Design decisions:**
- Multiple offers allowed per customer+property (history preserved); one-PENDING-at-a-time enforced at the app layer in `submitOfferForCustomer`
- `offerAmount` stored as `String?` matching `Property.price` (no currency parsing at DB layer)
- Staff review workflow (accepting/rejecting offers from dashboard) deferred — status can only move to `withdrawn` by the customer in this phase; staff-side transitions are next

**Deferred:**
- Staff dashboard surfaces for reviewing and actioning offers
- Counter-offer flow

## 2026-03-31 — Customer and Construction Status Correction

### What changed
- Corrected the Brain to match the real implementation state for customer-tenant and construction-adjacent features.
- Confirmed that the current customer portal is a route-and-UI foundation, not a completed customer account system.
- Confirmed that the current construction module is strong on internal project operations, but still incomplete for customer-facing project routes, document workflows, and advanced QS/design intelligence.

### Code-backed status
- **Customer portal:** `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/saved`, `/portal/offers`, `/portal/payments`, and `/portal/account` exist, but they are placeholder shells and not wired to real customer auth or live customer data.
- **Customer browse:** public listing browsing and inquiry are live on the tenant site.
- **Customer transactions:** saved listings, offers, payments, owned-property management, transfer, sell-back, and customer 2FA are still pending.
- **Customer model:** the current schema uses company-scoped `Customer` records for staff workflows. The planned global-customer identity plus tenant-customer bridge is not implemented yet.
- **Construction operations:** internal project CRUD, phases, milestones, updates, issues, team assignment, budgets, workers, payroll, and AI summary/risk/customer-draft tools are live.
- **Construction customer visibility:** staff can grant customer access and mark milestones/updates customer-visible, but there is no live tenant-site `/portal/projects/*` customer experience yet.
- **Construction AI/QS/design:** AI summary/risk/draft exists; smart BOQ generation, historical price suggestions, document extraction, and architectural design evaluation are still pending.

## 2026-03-31 — Customer Portal Auth Foundation

### What was built
- Tenant-site portal signup and login now use real Better Auth-backed sessions instead of placeholder buttons.
- Non-auth portal routes are now guarded and redirect unauthenticated visitors to `/portal/login`.
- Portal signup creates a Better Auth user and creates a company-scoped `Customer` record when one does not already exist for the current tenant/email.
- Portal sign-in only succeeds when the authenticated user also matches a customer record for the current tenant.
- Portal dashboard and account pages now read the signed-in customer session and show real customer identity details.
- Portal shell navigation now adapts between signed-out auth routes and signed-in customer routes, and includes sign-out.

### Design
- Reused the existing Better Auth user/session stack rather than introducing a second auth provider for the first customer-portal slice.
- Customer access is tenant-scoped by matching authenticated user email to the current tenant's `Customer` record.
- Tenant-site uses a tenant-scoped Better Auth session cookie keyed by tenant slug so the existing auth resolver can read public-site customer sessions cleanly.
- Temporary assumption: customer signup auto-verifies email in this first slice until a dedicated customer verification flow is added.

### What remains next
- Saved listings and auth-aware save actions
- Offer submission and tracking
- Payments, receipts, and ownership records
- Transfer, sell-back, and stronger account security

## 2026-03-31 — Customer Portal Saved Listings

### What was built
- Added a `SavedListing` company/customer/property relation plus Prisma migration for portal saved listings.
- Public property detail pages now show auth-aware save/remove actions and redirect signed-out customers into portal login with return-path preservation.
- `/portal/dashboard` now shows live saved-listing counts and recent saved properties.
- `/portal/saved` now renders the customer’s real saved inventory with remove actions.

### Design
- Saved listings stay tenant-scoped by attaching each record to `companyId`, `customerId`, and `propertyId`.
- Save/remove behavior is centralized in one portal server action so property pages and portal pages share the same guard and revalidation rules.
- The current customer identity assumption did not change: portal access still resolves through Better Auth plus company-scoped customer email matching.

### What remains next
- Offer submission and staff review flow
- Payments, receipts, and ownership/reservation records
- Transfer, sell-back, verification, and 2FA

## 2026-03-31 — Custom Domain Purchase Phase Clarification

### What changed
- Confirmed that **Custom Domain Purchase Flow** is the highest-priority remaining non-mobile backlog item.
- Clarified the domain-planning docs so the future implementation must support:
  - **Vercel domain attachment and verification** for deployment/runtime routing
  - **Registrar-based search/purchase/renewal**
  - **`.com.ng` coverage** through a registrar/provider that supports Nigerian ccTLDs

### Planning direction
- Treat domain management as a split-provider system rather than assuming one vendor handles everything:
  - **Vercel** for deployment-facing domain attach/sync
  - **Registrar adapter(s)** for commercial domain search, purchase, renewal, and DNS/nameserver workflows
- If the main registrar does not support `.com.ng`, the abstraction should allow a second provider dedicated to Nigerian-domain commerce.

## 2026-03-31 — Custom Domain Purchase Flow (Phase 1)

### What was built
- **`packages/utils/src/domain-service.ts`** (new) — Domain service abstraction with:
  - `isValidDomainName()` — syntactic domain validation
  - `extractApexDomain()` — apex extraction with two-part ccTLD support (`.com.ng`, `.co.uk`, etc.)
  - `buildDnsInstructions()` — generates DNS records (A for apex, CNAME for subdomains) + Vercel TXT verification records
  - `checkDomainAvailability()` — DNS-over-HTTPS availability check via Cloudflare (works for all TLDs including `.com.ng`)
  - `searchDomainAvailability()` — parallel availability check across all supported TLD variants
  - `SUPPORTED_TLDS` / `ALL_SUPPORTED_TLDS` constants covering global (`.com`, `.net`, `.org`, `.info`, `.biz`) and Nigerian (`.com.ng`, `.ng`, `.org.ng`, `.net.ng`) TLDs
- **`packages/utils/src/domain-service.test.ts`** (new) — 16 tests covering validation, apex extraction (including `.com.ng`), DNS instruction building, and TLD constants
- **`packages/db/src/queries/tenant-domain.ts`** — 4 new query functions:
  - `createCustomDomainPair()` — creates sitefront + dashboard domain pair in a transaction
  - `findTenantDomainByHostname()` — hostname conflict check
  - `listCustomDomainsWithVerification()` — custom domains with verificationJson for DNS instruction rendering
  - `removeCustomDomain()` — soft-delete a custom domain pair
- **`apps/api/src/routers/workspace.route.ts`** — 4 new tRPC procedures:
  - `searchDomains` — parallel domain availability search across all supported TLDs
  - `connectCustomDomain` — validates hostname, checks conflicts, creates domain pair, triggers Vercel sync, returns DNS instructions
  - `removeCustomDomain` — soft-deletes custom domain pair
  - `getCustomDomainDnsInstructions` — returns DNS instruction cards for all pending custom domains
- **`apps/api/src/schemas/workspace.schema.ts`** — 3 new Zod schemas: `searchDomainInputSchema`, `connectCustomDomainInputSchema`, `removeCustomDomainInputSchema`
- **`apps/dashboard/src/app/(app)/domains/connect/page.tsx`** (new) — Connect Custom Domain page with:
  - Hostname input form
  - Vercel readiness gate
  - Step-by-step DNS configuration guide
  - Explicit `.com.ng` registrar instructions (NiRA, QServers, Whogohost, Web4Africa)
- **`apps/dashboard/src/app/(app)/domains/page.tsx`** — Updated with:
  - "Connect Custom Domain" button
  - DNS instruction cards for pending/provisioning custom domains (table with Type/Name/Value)
  - "Remove" button for custom domains
  - Success alerts for connected/removed domains
- **`apps/dashboard/src/app/actions.ts`** — 2 new server actions: `connectCustomDomainAction`, `removeCustomDomainAction`

### Design
- **Split-provider architecture:** Vercel handles deployment-facing domain attachment/verification; the registrar layer (DNS-based availability check for now, upgradeable to WHOIS/RDAP/registrar API) handles search. Both layers support `.com.ng` and all Nigerian ccTLDs.
- **DNS instructions are generated server-side** using `buildDnsInstructions()` which correctly handles two-part ccTLDs like `.com.ng` (apex detection, A vs CNAME record selection).
- **Vercel TXT verification records** are persisted in `verificationJson` and rendered in the DNS instruction table when present.
- **Zero regression risk:** All existing domain sync, onboarding domain creation, and hostname resolution paths are untouched.

### Phase 2 (deferred)
- Registrar purchase API integration (Namecheap, GoDaddy, or `.com.ng`-specific provider)
- Domain renewal tracking and auto-renewal
- WHOIS privacy management
- Domain transfer support

## 2026-03-31 — Preview-Safe Action Interception

### What was built
- **`packages/section-registry/src/runtime/click-guard.tsx`** — ClickGuard now intercepts **all** `<button>` clicks in non-live modes (previously only `button[type='submit']`). Added `PreviewToast` component that briefly shows "Action disabled in preview" when a button is swallowed. Uses `useEffect` auto-hide timer (1500ms).
- **`packages/section-registry/src/sections/extended-sections.tsx`** — `ContactForm` now checks `useRenderMode()` before executing the `fetch()` call. In non-live modes (`draft`, `preview`, `template`), the form shows immediate "Message received" success without making any real API calls.
- **`packages/section-registry/src/runtime/preview-banner.tsx`** (new) — Slim sticky banner at the top of the page in non-live modes. Shows render mode label ("Draft preview", "Preview mode", "Template preview") and the message "links, forms and actions are disabled".
- **`packages/section-registry/src/index.ts`** — Exported `PreviewBanner` from the main barrel.
- **`apps/tenant-site/src/components/tenant-interaction-shell.tsx`** — Wired `PreviewBanner` inside `ClickGuardProvider`, above `{children}`.

### Design
- **Three-layer interception:** (1) ClickGuard DOM-level click capture for links, buttons, and forms; (2) React-level render-mode guard in ContactSection's `handleSubmit` to prevent `fetch()` even if ClickGuard is bypassed; (3) Visual feedback via PreviewBanner (persistent) and PreviewToast (ephemeral).
- **Zero regression risk in live mode:** All guards check `renderMode === "live"` and pass through transparently. No changes to live-mode behavior.
- **NewsletterSection already safe:** Only calls local `setSubmitted(true)` — no API endpoint, no fetch.

## 2026-03-31 — AI-Powered Page Content Generation

### What was built
- **`apps/api/src/lib.ai.ts`** — New `generatePageContent()` function and `PageContentContext` type. Takes a page key, company context, and list of editable fields; generates all field values in a single Claude Haiku 4.5 call. Returns a `Record<string, string>` mapping content keys to generated copy. Handles page-prefixed keys for non-home pages.
- **`packages/db/src/queries/ai-credits.ts`** — Added `page_content: 10` to `AI_CREDIT_COSTS` map.
- **`apps/api/src/schemas/workspace.schema.ts`** — New `generatePageContentInputSchema` with `pageKey` field.
- **`apps/api/src/routers/workspace.route.ts`** — New `generatePageContent` tRPC mutation. Resolves active draft via `resolveActiveDraftForCompany()`, gets AI-enabled editable fields from template definition, prefixes content keys for non-home pages, calls `generatePageContent()`, merges results into draft, deducts 10 credits.
- **`apps/dashboard/src/components/builder/onboarding-tools.tsx`** — New `GeneratePageContentButton` component. Shows page-specific label (e.g. "Generate About page content"), credit cost hint (10 credits), loading/error/success states with field count.
- **`apps/dashboard/src/components/builder/builder-workspace.tsx`** — Wired `GeneratePageContentButton` into builder sidebar as new "AI content" section between "Editable fields" and "Onboarding tools". Button receives `pageKey` from builder's resolved page state.

### Design
- Single LLM call generates all AI-enabled fields for a page (more efficient than field-by-field smart-fill)
- Non-home pages use page-prefixed content keys (e.g. `about.hero.title`) matching the inner-page-defaults convention
- Credit cost: 10 credits per page generation (between smart-fill's 2/field and onboarding bootstrap's 15)
- Follows existing patterns: same draft resolution as `bootstrapAiContent`, same credit check/deduct/log flow

## 2026-03-31 — Template Family Differentiation

### What was built
- Updated the home-page inventories for the 6 register families (`Noor`, `Bana`, `Wafi`, `Faris`, `Thuraya`, `Sakan`) across Starter / Plus / Pro tiers in `packages/section-registry/src/register/*/*/pages.ts`.
- The changes are data-only and limited to page inventory composition: reordering section slots, swapping a few home sections, and introducing family-specific proof/conversion sections where those slot types already existed.
- Resulting family identities:
  - **Noor** — listings-first agency with market proof first, then agents/testimonials, then brand story
  - **Bana** — project-first developer with project grid and market proof early
  - **Wafi** — property-management/owner-acquisition home flow with services + contact before listings depth
  - **Faris** — solo-agent identity with agent showcase moved onto home for Plus / Pro
  - **Thuraya** — luxury/editorial portfolio flow with listings and testimonials ahead of story
  - **Sakan** — search-first renter conversion flow with FAQ/contact emphasis on Plus / Pro

### Validation
- Ran targeted Biome checks on the changed register page files — clean after formatting.
- Ran the package typecheck and confirmed it still fails only on the same pre-existing unrelated errors in `src/register/index.ts` and `src/template-config.ts`; none of the changed family page files introduced type errors.
- Manually verified the resulting family/tier home section orders by generating a visual summary table from the register files.

## 2026-03-31 — Multi-page Template Depth

### What was built
- **`packages/section-registry/src/register/inner-page-defaults.ts`** (new) — Shared per-page hero defaults for 16 inner page types (about, listings, projects, portfolio, rentals, contact, agents, services, how-it-works, landlords, tenants, areas, private-sales, faq, insights, blog, resources). Each entry stores page-prefixed keys (e.g. `about.hero.title = "About Our Agency"`) so they don't collide with home-page keys.
- **`packages/section-registry/src/index.ts`** — Three changes:
  1. `resolvePageContent()` helper: aliases `{pageKey}.hero.*` to base `hero.*` keys before handing content to section builders. Builders remain unchanged; they always read `hero.title`, but on the about page they receive the about-specific value.
  2. `buildPageSections()`: calls `resolvePageContent` for non-home pages.
  3. `resolveWebsitePresentation()` and `resolvePage()`: both now merge `innerPageDefaults[pageKey]` between `template.defaultContent` and tenant-saved content, so per-page defaults are overridable by tenant customisation.

### Design
- Storage: per-page content is stored as `about.hero.title` etc. in `contentJson`/`themeJson` — no key collision with home page
- Builder builders and section components remain unchanged (zero regression risk)
- Tenant overrides: if a tenant saves `about.hero.title` to their contentJson (currently only possible via direct API; future builder UI TBD), it takes priority over the shared defaults
- Known limitation: inline EditableText contentKey is still hardcoded to `hero.title` in section components — inline editing on inner pages writes to the home page key. Full page-scoped editing is a Phase 2 improvement requiring section component changes.

## 2026-03-31 — Path-Aware Builder Preview

### What was built
- **`apps/dashboard/src/app/(app)/builder/page.tsx`** — Added `path` to `searchParams`; passed as `previewPath` to `BuilderWorkspace`.
- **`apps/dashboard/src/components/builder/builder-workspace.tsx`** — Imports `getTemplatePageInventory`. Resolves `activePageKey` from `previewPath` by matching against the template's page inventory slugs (defaults to `"home"`). Builds `availablePages: PageNavItem[]` list. Passes `pageKey` to `resolveWebsitePresentation` so the correct page's sections are fetched. Threads `availablePages` + `activePageKey` into `BuilderPreviewPanel`, `BuilderSidebarControls`, and `BuilderSidebarDrawer`.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Accepts `availablePages` and `activePageKey`. When the template has more than one page, renders a tab strip in the preview chrome bar replacing the URL label. Clicking a tab calls `router.push('?path=...')` preserving all other query params (configId, etc.). Home tab clears the `path` param.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — Accepts `activePageKey` (default `"home"`). `SeoSection` now uses `activePageKey` instead of the hardcoded `"home"` — SEO fields update per-page as you navigate.
- **`apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`** — Accepts and threads `activePageKey` to `BuilderSidebarControls`.

### Design
- URL-based navigation: `?path=/about` triggers server re-render of `BuilderWorkspace` with the correct page. Full re-render is acceptable since the builder already re-renders on template/theme changes.
- No new DB queries: `getTemplatePageInventory` is a pure in-memory lookup against the registry.
- SEO section is now page-aware: switching to `/about` and entering a title writes `seo.about.title` to themeJson.

## 2026-03-31 — SEO & Meta Tags

### What was built
- **`packages/section-registry/src/template-config.ts`** — Added `seo?: Record<string, { title?, description?, ogImage? }>` to `TemplateConfig`. Updated `deserializeTemplateConfig` to parse `seo.{pageKey}.{field}` dot-notation keys from `themeJson` into the nested structure.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — New `SeoSection` component with title input, description textarea (3 rows, debounced), and OG image URL input. Saves via `onUpdateTheme` with key `seo.home.{field}`. Wired into `BuilderSidebarControls` below section visibility toggles.
- **`apps/tenant-site/src/lib/resolve-tenant.ts`** — Added `market` to `TenantShell` company select so the description fallback can reference the market.
- **`apps/tenant-site/src/app/page.tsx`** — Exported `generateMetadata()` that calls `resolveTenantShell()` (lightweight), reads `templateConfig.seo?.home`, and returns `title` + `description` + `openGraph` + `twitter` metadata. Falls back to company name and market when no SEO override is set.
- **`apps/tenant-site/src/app/[...slug]/page.tsx`** — Exported `generateMetadata({ params })` that resolves `pageKey` from path segments via the existing `resolvePageKeyForPath()` helper, then reads `templateConfig.seo?.[pageKey]` for overrides. Same fallback pattern.

### Design
- Storage: `themeJson` dot-notation keys (`seo.home.title`, `seo.listings.description`, etc.) — follows the existing `sectionVisible.*` and `namedImage.*` patterns; no schema changes
- Per-page `generateMetadata()` in route files takes priority over the root layout's company-level metadata in Next.js
- Builder scoped to `pageKey="home"` for now; inner pages can be added later via path-aware builder preview

## 2026-03-31 — Template Usage Analytics

### What was built
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — `TemplatePicker` now fetches `getTemplateCatalog` via tRPC (`useQuery`). Builds a `usageMap` (key → usageCount) from the API response. Each template card shows `"{N} using"` in muted text below the tagline when count > 0. Falls back to 0 silently while the query loads.

### Design
- Read-only analytics display only — no new mutations or schema changes
- `getTemplateCatalog` already returned `usageCount` per template (backed by `countCompaniesByTemplateKey`); this surfaces it in the picker UI

## 2026-03-30 — WebsiteVersion Phase 4 — Write Path

### What was built
- **`packages/db/src/queries/website.ts`** — Added `findDraftVersionById(db, { companyId, versionId })` helper. Returns a draft WebsiteVersion with its parent Website (`id`, `templateKey`), validating company ownership. Used by mutation fallbacks when `configId` is a WebsiteVersion ID.
- **`apps/api/src/routers/workspace.route.ts`** — Five mutations upgraded with a silent WebsiteVersion fallback:
  - **`updateSiteField`**: If SiteConfiguration not found, merges `contentKey` into `version.contentJson` and calls `updateDraftVersion`.
  - **`updateSiteThemeField`**: If SiteConfiguration not found, merges `themeKey` into `version.themeJson` and calls `updateDraftVersion`.
  - **`publishSiteConfiguration`**: If SiteConfiguration not found, calls `publishWebsiteVersion` directly (archives old published, promotes draft, updates `website.publishedVersionId`).
  - **`smartFillField`**: Resolves either SiteConfiguration or WebsiteVersion; derives `templateKey` from whichever is found; AI generation logic shared; writes through `updateSiteConfigurationContentField` (legacy) or `updateDraftVersion` (Phase 4).
  - **`ensureBuilderConfigurationExists`**: Now checks `resolveActiveDraftForCompany` first; returns `legacyConfigId ?? version.id`; falls back to SiteConfiguration for existing companies; for new companies creates Website + draft via `upsertWebsite` + `getOrCreateDraftVersion` (no SiteConfiguration created).
- **Imports added**: `findDraftVersionById`, `getOrCreateDraftVersion`, `publishWebsiteVersion`, `upsertWebsite` added to router import block.

### Design
- No API surface changes — `configId` remains a plain string across all mutations
- Auto-detection: try SiteConfiguration lookup first; silence NOT_FOUND and try WebsiteVersion on miss
- Legacy dual-write path preserved for all existing companies
- New companies get a clean WebsiteVersion-only write path

## 2026-03-30 — EditableText AI Icon + Action Bar Upgrade

### What was built
- **`packages/section-registry/src/runtime/smart-fill-context.tsx`** (new) — `SmartFillContext` following the same pattern as ClickGuardContext. `SmartFillProvider` accepts an `onSmartFill(contentKey)` async function and injects it via context. `useSmartFill()` hook returns the function or null when no provider is present.
- **`packages/section-registry/src/sections/editing-primitives.tsx`** — `EditableText` upgraded with hover action bar. In draft mode, hovering text reveals a small floating pill (`absolute -top-7 right-0`) with ✏ Edit and ✦ AI buttons. The AI button only renders when `useSmartFill()` is non-null. Clicking AI calls `triggerSmartFill(contentKey)` and shows a `animate-pulse ring-primary/40` loading state while the mutation runs. Clicking Edit enters contentEditable as before.
- **`packages/section-registry/src/index.ts`** — Exports `SmartFillProvider`, `useSmartFill`, `SmartFillFn`.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Added `handleInlineSmartFill` adapter (derives `shortDetail` from `contentKey` dot-notation). Wraps sections with `SmartFillProvider` when `readOnly={false}`; locked-template preview skips the provider so the AI button is not shown.

### What's still deferred
- WebsiteVersion Phase 4 writes

## 2026-03-30 — ClickGuard + InlineOverview Wiring (M3 Deferred)

### What was built
- **`runtime/click-guard.tsx`** — Enhanced `handleClick` to auto-detect item data from `data-click-guard-type` + `data-click-guard-data` attributes on intercepted anchors. Parses JSON payload and calls `openItem()` automatically, so section components need no direct dependency on `useClickGuard`.
- **`sections/extended-sections.tsx`** — Added `data-click-guard-type` and `data-click-guard-data` attributes to `PropertyGridSection` listing card anchors (type: `"listing"`, data: id/title/location/price/specs/slug) and `AgentShowcaseSection` agent card anchors (type: `"agent"`, data: id/name/role/bio/slug).
- **`apps/tenant-site/src/components/website-shell.tsx`** — New `"use client"` wrapper component. Provides `ClickGuardProvider` + `InlineOverview` boundary inside `WebsiteRuntimeProvider`'s client tree. In `renderMode="live"`, ClickGuard is transparent and InlineOverview returns null — zero behaviour change for live visitors.
- **`apps/tenant-site/src/app/layout.tsx`** — `<main>{children}</main>` wrapped with `<WebsiteShell>` to enable ClickGuard + InlineOverview for all tenant-site pages.
- **`apps/dashboard/.../builder-preview-panel.tsx`** — `ClickGuardProvider` + `InlineOverview` nested inside `WebsiteRuntimeProvider renderMode="draft"`. Clicking a listing/agent card in the builder preview now slides up the InlineOverview panel instead of triggering broken navigation.

### What's still deferred
- EditableText AI icon + action bar upgrade
- WebsiteVersion Phase 4 writes

## 2026-03-30 — Template Registry M4 — Tenant-Site Integration

### What was built
- **`register/index.ts` nav/footer helpers** — `getFamilyNavConfig(familyKey, tier)` returns `NavConfig` with links filtered by `minTier` vs active tier. `getFamilyFooterConfig(familyKey)` returns `FooterConfig`. Both backed by `familyNavConfigMap` and `familyFooterConfigMap` lookup tables across all 6 families.
- **`lib/resolve-tenant.ts`** — Two-tier resolver. `resolveTenantContext(searchParams?)` resolves full tenant context including live listings and agents — used by page routes. `resolveTenantShell()` is lightweight (company + published theme only, no live data) — used by the root layout so the shell never waits on DB-heavy data fetches.
- **`components/register-nav.tsx`** — `RegisterNav` server component. Desktop: inline links filtered by plan tier + CTA button. Mobile: native `<details>/<summary>` hamburger (zero JS). Uses `var(--pk-*)` CSS vars throughout for theme consistency.
- **`components/register-footer.tsx`** — `RegisterFooter` server component. Renders link groups in a responsive grid + tagline + `© {year} {company}` copyright line.
- **`app/[...slug]/page.tsx`** — Catch-all inner page route. `resolvePageKeyForPath(templateKey, path)` supports exact slug match then dynamic `[slug]` wildcard pattern match. Calls `resolveTenantContext()` → `resolvePage()` → renders sections with `visibleSections` filter. Empty section list → "coming soon" placeholder; unknown path → `notFound()`.
- **`app/layout.tsx`** — `WebsiteRuntimeProvider` now wraps all body content, injecting `--pk-*` CSS custom properties for the active template's color system, font, and style preset. `resolveTenantShell()` called in parallel with subdomain + integrations. `RegisterNav` and `RegisterFooter` rendered conditionally when `familyKey` + `tier` are defined.
- **`app/page.tsx` simplification** — Removed ~80 lines of inline tenant resolution. Now calls `resolveTenantContext(sp)` and `resolvePage(templateKey, "home", tenant, "live")`. Fallback (no published site) still shows sample home in dashed border card.

### What's still deferred

## 2026-03-30 — Multi-page Website Support

### What was built
- **`apps/dashboard/src/app/(app)/builder/page.tsx`** — Builder now accepts a `?page=` query param and passes it into the workspace.
- **`apps/dashboard/src/components/builder/builder-workspace.tsx`** — The workspace now validates the selected page against `getTemplatePageInventory(templateKey)`, falls back to the first available page, resolves the draft preview with `pageKey`, and builds a page-aware live-site URL.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — Added a new Page picker sourced from the active template inventory. Selection updates the main builder URL via `router.replace('/builder?page=...')`, so page state is shareable and survives refreshes.
- **`apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`** — Mobile builder drawer now receives the current page key so page selection is available outside desktop as well.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Preview chrome now shows the selected public page path and label instead of only a generic builder-preview label.

### Validation notes
- Focused Biome checks passed on the touched builder files after adding the new page-selection wiring.
- `apps/dashboard` workspace typecheck remains blocked in this sandbox by a pre-existing environment issue: `@plotkeys/tsconfig/nextjs.json` is not resolvable from the package.
- Attempted live manual verification by starting the dashboard app, but the sandbox currently lacks the required `turbo`, `portless`, and `next` binaries in the runtime path, preventing a full app boot here.

## 2026-03-30 — Listing Overview Standardization

### What was built
- **`apps/tenant-site/src/lib/listing-overview.ts`** — Added a shared public listing overview query contract: `location`, `priceRange`, `sort`, and `page`. The helper normalizes those search params, applies filtering/sorting/pagination to tenant listing snapshots, and identifies which page keys count as listing overview pages.
- **`apps/tenant-site/src/app/[...slug]/page.tsx`** — Catch-all tenant pages now detect listing overview pages (`listings`, `rentals`, `projects`, etc.) and apply the shared listing query contract before passing listings into `resolvePage()`. Templates still control the section tree; the runtime now standardizes the data behavior.
- **`packages/section-registry/src/index.ts`** — Added a shared route contract resolver that derives the canonical overview/detail base path from the active template inventory. Shared section builders now use that contract so CTA links and detail links follow `/rentals/*`, `/projects/*`, `/portfolio/*`, etc. instead of assuming `/listings/*`.
- **`packages/section-registry/src/sections/extended-sections.tsx`** and **`packages/section-registry/src/sections/home-page.tsx`** — Shared property-grid and listing-spotlight configs now accept `detailHrefBase`, so shared listing cards can build template-correct detail URLs.

### Validation notes
- Focused Biome checks passed on the touched tenant-site and section-registry files; only pre-existing `<img>` performance warnings remain in shared section files.
- Verified the tenant-site listing query helper with `npx -y tsx` by filtering/sorting a small in-memory listing set; confirmed the helper returns the expected ordered subset.
- Verified template inventories with `npx -y tsx` to confirm `sakan-starter` resolves `/rentals` + `/rentals/[slug]` and `bana-starter` resolves `/projects` + `/projects/[slug]`, matching the new route contract.
- Full `apps/tenant-site` and `packages/section-registry` typechecks remain blocked in this sandbox by pre-existing workspace environment issues (`@plotkeys/tsconfig/nextjs.json` missing in app packages, JSX/react resolution missing in section-registry standalone runs).
- Manual UI verification used a local mock because the sandbox still cannot boot the full Next/Turbo runtime here. Screenshot: https://github.com/user-attachments/assets/de73bc0f-290f-4909-9e30-c58294103d47

## 2026-03-30 — Customer Portal Foundation Planning

### What was built
- **Central `/portal/*` route group in tenant-site** — Added `apps/tenant-site/src/app/portal/` pages for `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/saved`, `/portal/offers`, `/portal/payments`, and `/portal/account`, plus `/portal` redirecting to `/portal/login`.
- **Branded shared portal shell** — Added `apps/tenant-site/src/components/portal-shell.tsx` and `portal-page.tsx` so customer-facing account pages now render in a central application shell that uses tenant branding tokens from the existing `WebsiteRuntimeProvider`, rather than template section trees.
- **Template shell suppression on portal routes** — Updated `apps/tenant-site/src/proxy.ts` to inject `x-tenant-pathname`, and updated `apps/tenant-site/src/app/layout.tsx` so register-family nav/footer and chat widget do not render on `/portal/*` routes.
- **Legacy entry-point redirects** — Added explicit `/login`, `/signup`, and `/saved` tenant-site routes that redirect into `/portal/login`, `/portal/signup`, and `/portal/saved`, so older inventory-driven entry points land in the new central portal.
- **Public saved-listing links repointed** — Updated register-family nav/footer configs that exposed “Saved Listings” so they now link to `/portal/saved`.

### Validation notes
- Focused Biome checks passed on all touched tenant-site and section-registry files for this task.
- `apps/tenant-site` standalone typecheck remains blocked in this sandbox by the pre-existing workspace issue where `@plotkeys/tsconfig/nextjs.json` cannot be resolved from the package.
- Manual UI verification used a local mock because the sandbox still cannot reliably boot the full tenant-site runtime here. Screenshot: https://github.com/user-attachments/assets/8acea668-c66c-40ef-82eb-71e55671a80b

## 2026-03-30 — Customer Portal + Listing Page Boundary Planning

### Planning decisions
- **Central customer account pages** — Customer login, signup, dashboard, saved listings, offers, payments, and account settings should live under a central tenant-site route group such as `/portal/*`. These pages should inherit tenant branding but should not be template-composed pages.
- **Template-based public discovery pages** — Public listing overview pages (`/listings`, `/properties`, `/rentals`, `/portfolio`, `/projects`) remain template-driven because they are part of the tenant's branded marketing surface.
- **Shared functional contract for listing pages** — Even though listing overview pages remain template-based, filtering, sorting, pagination, and auth-aware actions should be implemented through shared central code so behavior stays consistent across families.

### Brain updates
- Updated `brain/features/customer-portal.md` with explicit page-boundary decisions and a route plan for `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/saved`, `/portal/offers`, and `/portal/account`.
- Updated `brain/modules/template-register-plan.md` so customer auth/account pages are no longer treated as template inventory pages.
- Updated `brain/modules/pages-inventory.md` to separate template pages from central customer portal pages.
- Updated `brain/system/architecture.md` and `brain/tasks/backlog.md` so future implementation follows the new central-vs-template boundary.

## 2026-03-30 — Tenant-Site ClickGuard + InlineOverview Wiring

### What was built
- **`apps/tenant-site/src/components/tenant-interaction-shell.tsx`** — Added a client-side interaction shell that reads `?renderMode=` from the URL, wraps tenant-site content in `WebsiteRuntimeProvider`, mounts `ClickGuardProvider`, and places a single `InlineOverview` panel around the real nav/footer/page render tree.
- **Tenant-site render mode parsing** — Added `parseTenantRenderMode()` and updated both `app/page.tsx` and `app/[...slug]/page.tsx` to pass the selected render mode into `resolvePage()`, so `"template"` mode now resolves placeholder content/data while `"preview"` / `"draft"` keep real tenant data.
- **Overview trigger wiring for cards** — Added `useItemOverviewTrigger()` in `packages/section-registry/src/sections/interaction-utils.tsx` and used it across shared section components plus the Noor/Bana/Wafi/Faris/Sakan/Thuraya family overrides so listing and agent cards open `InlineOverview` in non-live modes while remaining inert or navigable in live mode.
- **Item slug propagation** — Extended live/placeholder listing + agent shapes with optional `slug` support so `InlineOverview` action links can resolve detail URLs correctly in preview/template contexts.

### Validation notes
- Manual UI verification completed with a temporary local preview-mode demo that exercised `ClickGuardProvider` + `InlineOverview` around real section components. Verified that clicking a property card opens the slide-up overview panel. Screenshot: https://github.com/user-attachments/assets/f526c025-ceed-44c4-85f4-c607d6bbbfe2
- `apps/tenant-site` typecheck remains blocked in this sandbox because `@plotkeys/tsconfig/nextjs.json` is not resolvable from the app package here, and `packages/section-registry` standalone typecheck is also blocked by the environment not loading the expected React/JSX tsconfig setup.
- Focused Biome checks on touched files still surface pre-existing section-registry issues in files touched for this task, especially existing `<img>` warnings and historical `noArrayIndexKey` findings in family section files. No new security findings were identified during manual review.

## 2026-03-30 — EditableText AI Icon + Action Bar Upgrade

### What was built
- **`sections/editing-primitives.tsx`** — Draft-mode `EditableText` now keeps the existing amber hover affordance but upgrades into an explicit editing surface: hover can reveal a `✦ AI` trigger, click enters edit mode, and an action bar with `✓ Save` / `✕ Discard` replaces the previous implicit blur-save behavior.
- **Inline AI suggestion panel** — When AI is enabled for the current `contentKey`, the inline editor can open an in-place suggestion panel with generated copy plus `Use this` / `Try again` actions, so the builder preview now matches the planned upgrade path instead of only exposing AI from the sidebar field editor.
- **`register/content-field-lookup.ts`** — Added a shared content-field metadata lookup compiled from the register family content schemas plus the legacy shared builder keys. `EditableText` can now infer whether a field should expose AI affordances without requiring every section call site to pass a new prop.

### Validation notes
- Manual UI verification completed with a temporary local demo page rendering `EditableText` in draft mode. Verified hover AI affordance, edit-state action bar, and suggestion panel interaction.
- Repository tooling required `npx bun@1.3.9 ...` because the sandbox lacked a global `bun` binary.
- Full package typecheck remains blocked by pre-existing `packages/section-registry/src/register/index.ts` errors around unresolved `NavConfig` / `FooterConfig` types, unrelated to this task.
- Focused Biome checks on touched files only surfaced pre-existing warnings/errors elsewhere in `editing-primitives.tsx` (`<img>`, `aria-label` on placeholder `<div>`, `autoFocus`, and array-index key), none introduced by this change.

## 2026-03-29 — Template Registry M3 Runtime Wiring

### What was built
- **`page-inventory.ts` bridge** — `registerPagesToInventory()` converts `RegisterPageDefinition[]` to `TemplatePageInventory`. `getTemplatePageInventory()` now checks register templates first, so `buildPageSections` and `getEnabledSections` route correctly for all 18 `noor-starter` / `bana-plus` / etc. keys instead of falling back to template-1.
- **`register/index.ts` placeholder helpers** — `getPlaceholderContent(familyKey)` returns a flat `TenantContentRecord` populated from `placeholderValue` fields in each family's content-schema. `getFamilyPlaceholderData(familyKey)` returns placeholder listings/agents/projects.
- **`src/index.ts` — `resolvePage()`** — New public API. Takes `templateKey`, `pageKey`, `TenantSnapshot`, and `RenderMode`. In `"template"` mode, automatically substitutes family placeholder content and data. Applies family component overrides. Returns `ResolvedPageConfig` (sections + theme + renderMode).
- **Builder wiring** — `BuilderPreviewPanel` now accepts `templateKey` prop. `resolveFamilySectionComponents()` is resolved at the panel level and merged into the section component lookup per section, so family-branded components (Noor, Bana, Wafi, Faris, Thuraya, Sakan) render correctly in the builder instead of generic fallbacks.
- **`runtime/click-guard.tsx`** — `ClickGuardProvider` context wraps page content in non-live modes. Intercepts anchor clicks (no navigation) and form/submit clicks (no real submission). `useClickGuard()` hook exposes `openItem()` / `closeItem()` / `activeItem` for section components to trigger the overview panel.
- **`runtime/inline-overview.tsx`** — `InlineOverview` slide-up panel. Shows placeholder item data + "Install template" CTA in `"template"` mode; shows real item data + action links in `"draft"`/`"preview"` mode. Handles listing, agent, project, and generic item types.

### What's still deferred
- Tenant-site page routing for inner pages (Phase 4 — multi-page website support)
- ClickGuard integration into actual tenant-site page renders
- EditableText AI icon + action bar upgrade
- WebsiteVersion Phase 4 writes

## 2026-03-25 — Pricing Strategy Refresh

### Commercial Model
- PlotKeys no longer positions the entry tier as free forever.
- Current commercial positioning is:
  - Launch (`starter`) — ₦20,000/mo or ₦192,000/yr
  - Growth (`plus`) — ₦45,000/mo or ₦432,000/yr
  - Scale (`pro`) — ₦90,000/mo or ₦864,000/yr
- All plans now advertise a 14-day free trial.
- Annual billing is positioned with a 20% discount.

### Implementation Notes
- Internal entitlement keys remain `starter`, `plus`, and `pro` so template gating and existing plan logic do not break.
- User-facing labels now present those tiers as Launch, Growth, and Scale.
- Dashboard billing and the marketing-site pricing section now both read prices from the shared pricing config to avoid drift.

## 2026-03-25 — Builder Locked Template Guard

### Builder Access UX
- Builder now detects when the active template requires a higher subscription tier than the tenant currently holds and the company does not have a separate template license.
- In that state, the builder stays viewable but becomes read-only: publish, sidebar theme controls, inline field editing, and AI content bootstrap are disabled.
- Upgrade CTAs now point tenants to `/billing` instead of letting them hit a `FORBIDDEN` error at publish time.

### Server Enforcement
- Added shared license-aware template access checks before publish, inline content updates, theme updates, smart fill, and AI bootstrap mutations.
- This keeps the UI lock state and API enforcement aligned so direct mutation attempts are blocked consistently.

---

## 2026-03-22 — App Store Expansion

## 2026-03-24 — Invite-Driven Agent and Employee Onboarding

### Admin Flows
- Replaced direct-create agent and employee entry points with invite forms that only require an email address.
- Agents page and Employees page now show pending role-specific invites and let admins revoke them.
- Team/member invites now send real invitation emails through the shared notifications + email pipeline.

### Invite Acceptance + Profile Completion
- Updated `/join/[token]` so invitees can sign in or create an account with redirect preservation back to the invite link.
- Accepting an `agent` invite now routes into a profile-completion form that creates or updates the agent record.
- Accepting a `staff` invite now routes into a profile-completion form that creates or updates the employee record.
- Invite acceptance now validates that the signed-in account email matches the invited email before membership is created.

### Notifications + Email
- Added `workspace_invitation_sent` notification type for invite delivery.
- Added a dedicated workspace invitation email template and subject/default copy helpers.
- Added dashboard-side invite notification orchestration to send invitation emails after the team invite record is created.

### Dashboard App Store Page (`/app-store`)
- Integration cards for Google Analytics, Facebook Pixel, WhatsApp Business, Calendly
- Each card shows connection status (Connected/Not connected badge)
- Links to `/settings/integrations` for credential configuration
- External docs links for each integration

### Tenant-Site Integration Script Injection
- `IntegrationScripts` client component at `apps/tenant-site/src/components/integration-scripts.tsx`
- Injects GA4 `<Script>` tag (gtag.js + config) when `googleAnalyticsId` is configured
- Injects Facebook Pixel `<Script>` tag (fbevents.js + PageView tracking) when `facebookPixelId` is configured
- Uses Next.js `<Script>` with `strategy="afterInteractive"` for non-blocking load
- Integration data fetched in tenant-site `layout.tsx` via `resolveIntegrations()` helper

### Sidebar Navigation
- App Store sidebar item changed from disabled `#` link to active `/app-store` route
- Removed "Coming" badge

---

## 2026-03-22 — Chat-bot LLM Integration

### Chat-bot Package (`packages/chat-bot`)
- Expanded with Anthropic Claude Haiku 4.5 integration
- `getChatCompletion()` — sends conversation with company-context system prompt, returns AI reply
- `buildChatBotSystemPrompt()` — builds context from company name, market, properties (up to 10), agents (up to 10), business summary
- Types: `ChatBotMessage`, `ChatBotContext`, `ChatBotResponse`
- Added `@anthropic-ai/sdk` dependency

### API Chat Router (`apps/api/src/routers/chat.route.ts`)
- `chat.sendMessage` public mutation — resolves company from subdomain, builds context from properties/agents/onboarding, calls `getChatCompletion()`
- Validates messages (min 1, max 50, 2000 chars per message)
- Returns `{ reply: string }`

### Tenant-Site Chat (`apps/tenant-site`)
- `/api/chat` route — standalone API endpoint for chat (follows existing contact/track pattern)
- `ChatWidget` client component — floating button (bottom-right), slide-up chat panel, message thread, typing indicator, auto-scroll
- Widget added to root layout — only renders when subdomain is resolved via server-side header check

---

## 2026-03-22 — Trigger.dev Job Integration

### Task Definitions
- Created 4 Trigger.dev task definitions in `packages/jobs/src/tasks/`:
  - `domainSyncTask` (id: `domains.connection.sync`) — 4 retries, 2s base delay
  - `planSyncTask` (id: `plans.sync`) — 4 retries, 2s base delay
  - `notificationDispatchTask` (id: `notifications.dispatch`) — 3 retries, 1s base delay
  - `siteContentGenerationTask` (id: `website.content.generate`) — 3 retries, 3s base delay

### Dispatch Utility
- Added `triggerJob()` in `packages/jobs/src/trigger.ts` — dual-mode dispatch
- Uses Trigger.dev `tasks.trigger()` when `TRIGGER_SECRET_KEY` is set
- Falls back to in-memory `runInBackground()` for local dev / environments without Trigger.dev
- Added `isTriggerConfigured()` helper

### Configuration
- Created `trigger.config.ts` at monorepo root with project config and default retry settings
- Added `@trigger.dev/sdk` dependency to `packages/jobs`
- Added `./tasks` subpath export in `packages/jobs/package.json`

### Workspace Route Updates
- Replaced `runInBackground(domainSyncHandler, ...)` with `triggerJob(domainSyncTask, domainSyncHandler, ...)`
- Both call sites (onboarding completion + manual domain sync) now use `triggerJob()`

### Form Notification Wiring
- `submitContact` now dispatches `contact_form` notification job
- `submitInquiry` now dispatches `property_inquiry` notification job
- `submitNewsletterSignup` now dispatches `newsletter_signup` notification job
- All use `triggerJob()` with fire-and-forget pattern (non-blocking)

---

## 2026-03-22 — Tenant Onboarding Improvements

### Re-run Template Recommendations
- Added `updateOnboardingInputs` tRPC mutation in workspace.route.ts
- Accepts optional businessType, primaryGoal, stylePreference, tone updates
- Re-derives profile (segment, designIntent, conversionFocus, complexity) and returns updated recommendations
- `RecommendTemplatePanel` dialog component on builder sidebar with dropdowns for all 4 inputs

### AI Content Bootstrap
- Added `generateOnboardingContent()` to `lib.ai.ts` using Claude Haiku 4.5
- Generates 8 content fields: hero.eyebrow, hero.title, hero.subtitle, cta.headline, cta.description, cta.buttonLabel, story.title, story.description
- Returns JSON object, merged into active draft WebsiteVersion + dual-write to legacy SiteConfiguration
- Added `bootstrapAiContent` tRPC mutation (15 credits, deduction + usage logging)
- `AiContentBootstrapButton` component on builder sidebar
- Added `onboarding_content: 15` to AI_CREDIT_COSTS

### Builder Page Updates
- Added "Onboarding tools" section to builder sidebar with both buttons
- Fetches onboarding record server-side to pre-populate the RecommendTemplatePanel dropdowns

---

## 2026-03-22 — Construction Phase 4: AI and Integrations

### AI Project Summary
- Added `generateProjectSummary()` to `lib.ai.ts` using Claude Haiku 4.5
- Generates 3-5 paragraph executive summary covering status, milestones, issues, budget, and recommendations
- Deducts 10 AI credits per generation (`project_summary` feature)

### AI Risk Flags
- Added `generateProjectRiskFlags()` to `lib.ai.ts`
- Detects overdue milestones, budget overruns (actual > approved), high-severity unresolved issues, stale projects
- Returns structured JSON array with severity, title, and detail per risk
- Deducts 5 AI credits per analysis (`project_risk_flags` feature)

### AI Customer Update Draft
- Added `generateCustomerUpdateDraft()` to `lib.ai.ts`
- Generates customer-safe progress update from internal project data
- Strips internal issues, delays, budget, payroll details — focuses on milestones and progress
- Deducts 5 AI credits per generation (`project_customer_draft` feature)

### Technical
- Added `ProjectAiContext` type to `lib.ai.ts` for structured project data input to AI
- Added `buildProjectAiContext()` helper in projects router for data assembly
- Added 3 tRPC mutation procedures: `generateSummary`, `getRiskFlags`, `generateCustomerDraft`
- Created `project-ai.tsx` client component with `ProjectAiInsights` card, `GenerateSummaryButton`, `RiskFlagsButton`, `GenerateCustomerDraftButton`
- Updated `/projects/[id]` detail page with AI Insights section (between Payroll and Customer Access)
- Credit deduction and usage logging on each successful AI generation

---

## 2026-03-22 — Construction Phase 3: Customer Project Visibility

### Customer Access Management
- Added `ProjectCustomerAccess` model linking customers to projects with access levels (overview, detailed)
- Added `ProjectCustomerAccessLevel` enum (overview, detailed)
- Grant/revoke access per customer per project with upsert pattern
- Staff can list customers with access and manage access levels

### Customer-Visible Content Controls
- Added `customerVisible` boolean to `ProjectUpdate` model (default false)
- Added `customerVisible` boolean to `ProjectMilestone` model (default false)
- Share/Hide toggle buttons on milestones and updates in staff dashboard
- Documents already support `visibility: shared` for customer access

### Customer Notices
- Added `ProjectCustomerNotice` model for staff-to-customer project notices
- Staff can send titled notices to specific customers with project access
- Notice creation form integrated into project detail page

### Technical
- Created `project-customer.ts` query module with 10 functions (access CRUD, customer-safe reads, visibility toggles)
- Added 7 tRPC procedures to projects router (listCustomerAccess, grantCustomerAccess, revokeCustomerAccess, createCustomerNotice, deleteCustomerNotice, toggleMilestoneVisibility, toggleUpdateVisibility)
- Created `project-customer-access.tsx` component (CustomerAccessList, GrantCustomerAccessForm, SendNoticeForm)
- Updated MilestoneList and UpdatesList with "Share"/"Hide" buttons and "Customer Visible" badges
- Updated `/projects/[id]` detail page with Customer Access card section

---

## 2026-03-22 — Construction Phase 2: Budget, Workers, Payroll

### Budget Tracking
- Added `ProjectBudget` model with approved/forecast/actual amounts
- Added `ProjectBudgetLineItem` model with category, quantity, rates, estimated/actual
- Added `ProjectBudgetLineCategory` enum (preliminaries, substructure, superstructure, mep, finishing, external_works, contingency, professional_fees, other)
- Budget upsert pattern: one budget per project with line items
- Budget summary shows approved, forecast, actual, and variance
- Line item management with category badges, estimated/actual amounts

### Site Workers
- Added `ProjectWorker` model linked to Project and optionally to Employee
- Added `ProjectWorkerPayBasis` enum (daily, weekly, monthly, fixed_contract, milestone_based)
- Added `ProjectWorkerStatus` enum (active, inactive, terminated)
- Worker list with status management and pay info display
- Create worker form with name, role, pay basis, and pay rate

### Project Payroll
- Added `ProjectPayrollRun` model with period dates and status tracking
- Added `ProjectPayrollEntry` model linked to payroll run and worker
- Added `ProjectPayrollRunStatus` enum (draft, finalized, paid)
- Added `ProjectPayrollEntryPaymentStatus` enum (pending, paid, on_hold)
- Payroll run list with finalize/mark-paid workflow
- Create payroll run form with period date selection

### Technical
- Created `project-finance.ts` query module in packages/db with full CRUD
- Added 15 tRPC procedures to the projects router
- Created 3 client components: project-budget.tsx, project-workers.tsx, project-payroll.tsx
- Updated `/projects/[id]` detail page with Budget, Site Workers, and Project Payroll card sections

---

## 2026-03-21 — Phase 2 Continued: Notification Bell, Preferences, SubmitButton

### Notification Bell in Header
- Created `NotificationBell` client component with Popover dropdown
- Shows unread count badge (red dot with number, "9+" for 10+)
- Popover shows 5 most recent notifications with relative timestamps, unread highlighting, optional links
- "View all notifications" link at bottom
- Wired into `(app)/layout.tsx` with server-side data fetch via `getNotificationBellData()`

### Notification Preferences Page
- Created `NotificationPreference` Prisma model with unique constraint on (companyId, userId, type)
- Added relations to `User` and `Company` models
- Created `notification-preference.ts` query module (list, upsert, get)
- Built `/settings/notifications` page with 6 configurable notification types
- Each type has in-app and email toggle buttons (pill-style) with server action toggle
- Added `updateNotificationPreferenceAction` server action using upsert pattern
- Added "Notification preferences" link card to `/settings` page

### SubmitButton Adoption
- Added `"use client"` directive to `packages/ui/src/components/submit-button.tsx`
- Fixed `ButtonProps` import to use `React.ComponentProps<typeof Button>` instead of non-existent `ButtonProps`
- Replaced `<Button type="submit">` with `<SubmitButton>` in 6 pages:
  - `/hr/leave` — Submit Request
  - `/hr/employees` — Add Employee
  - `/hr/departments` — Add Department
  - `/hr/payroll` — Add Entry
  - `/settings` — Save profile
  - `/ai-credits` — Buy 100 Credits
- All forms now show loading spinner and disable button during server action execution

---

## 2026-03-21 — Phase 2 Continued: Leave, Payroll, CSV UI, Listing Analytics, Agent Performance

### Leave Management
- Created `leave-request.ts` DB query module: CRUD, status counts, approval/rejection
- Built `/hr/leave` page: submission form (employee select, type, dates, reason), status filters (pending/approved/rejected/cancelled), approve/reject/cancel workflow
- Added 4 server actions: `createLeaveRequestAction`, `approveLeaveRequestAction`, `rejectLeaveRequestAction`, `cancelLeaveRequestAction`
- All actions verify employee belongs to company before operating

### Payroll
- Created `payroll.ts` DB query module: CRUD, period summary, available periods, mark paid
- Built `/hr/payroll` page: monthly records, period selector tabs, summary cards (entries/gross/net/status), add entry form, mark paid flow
- Added 2 server actions: `createPayrollEntryAction`, `markPayrollPaidAction`
- Currency formatting with Intl.NumberFormat for NGN

### CSV Export UI
- Created `ExportCsvButton` client component: uses `useTransition`, creates Blob download, uses `URL.createObjectURL`
- Added export buttons to: Leads, Properties, Customers, Appointments, Employees list pages
- Each button calls its corresponding export server action and triggers download

### Listing Analytics Card
- Added per-property analytics card to `/properties/[id]` detail page
- Shows 3 metrics: Views (30 days), Views (7 days), Appointments
- Uses `prisma.analyticsEvent.count` and `prisma.appointment.count` for data

### Agent Performance Analytics
- Added `getAgentPerformanceStats()` query in payroll.ts
- Added agent performance section to analytics page: total appointments, completed appointments per agent
- Query joins agents with appointment groupBy counts

### Sidebar
- Added Leave (CalendarOff icon) and Payroll (Receipt icon) to HR & Team nav group with Plus badges

---

## 2026-03-21 — Phase 2: Analytics Expansion + HR Module

### Analytics Expansion
- Added `getTopPages()` query — groups page views by path, returns top 10
- Added `getTrafficSources()` query — buckets referrer into Direct/Google/Social/Other
- Added `getPropertyAnalytics()` query — property-level view counts
- Added `getLeadSourceBreakdown()` query — lead counts grouped by source
- Updated analytics page: 4-card stats strip (events, visitors, page views, leads), top pages table, traffic sources bars, property views list, lead source bars

### HR Module
- Created Prisma enums: `EmploymentType`, `EmployeeStatus`, `LeaveType`, `LeaveRequestStatus`, `PayrollStatus`
- Created Prisma models: `Department`, `Employee`, `LeaveRequest`, `PayrollEntry`
- Updated `Company` model with relations to departments, employees, payroll entries
- Created query modules: `department.ts` (CRUD + employee counts), `employee.ts` (CRUD + status/department counts)
- Built `/hr/employees` page: add form, status filter tabs, department filter, status badges, employment type badges
- Built `/hr/departments` page: add form, employee counts, link to filtered employee list
- Added server actions: `createEmployeeAction`, `updateEmployeeAction`, `deleteEmployeeAction`, `createDepartmentAction`, `updateDepartmentAction`, `deleteDepartmentAction`

### CSV Export
- Added `toCsvRow()` helper with proper CSV escaping
- Added export actions: `exportLeadsCsvAction`, `exportPropertiesCsvAction`, `exportCustomersCsvAction`, `exportAppointmentsCsvAction`, `exportEmployeesCsvAction`

### Sidebar Navigation
- Added HR & Team nav group with Employees (Briefcase icon), Departments (Network icon), Team links
- Moved Team from Platform to HR & Team group
- Removed Notifications and Settings from Platform group separation

---

## 2026-03-20 (Brain Template Catalog Update)

### Template Catalog Brain Documentation
- Updated `brain/modules/templates-catalog.md`: full per-template record for all 45 templates — description, plan/tier, purchasable flag, default market, accent colour, font pairing, pages, ordered home-page section composition, forms, and primary CTA links.
- Updated `brain/modules/sections-inventory.md`: split into implemented (14 live components) and planned sections. Added type keys, descriptions, form endpoints, and content key references for all implemented sections.
- Updated `brain/modules/pages-inventory.md`: clarified which pages are currently implemented (Home only for all templates), added per-template note about page inventory registry coverage, and retained planned page list.
- Updated `brain/modules/page-to-section-matrix.md`: added full per-template home page section matrix for all 45 templates in render order.

## 2026-03-20 — Tenant Dashboard Phase

### Dashboard Sidebar Navigation
- Created `(app)` route group in `apps/dashboard/src/app/` for all authenticated pages
- Built `DashboardSidebar` component at `src/components/nav/dashboard-sidebar.tsx` using shadcn sidebar primitives
- Nav groups: Overview (Home, Builder, Live Preview), Manage (Properties, Agents, Leads, Appointments), Insights (Analytics, AI Credits, Billing)
- Added `(app)/layout.tsx` wrapping all authenticated pages with `SidebarProvider` + `DashboardSidebar` + `SidebarInset`
- Added header bar with `SidebarTrigger` (mobile hamburger) and `ThemeToggle`
- Moved 11 page directories into `(app)/` route group, updated all relative imports
- Removed "← Dashboard" back links from sub-pages (sidebar handles navigation)
- Redesigned dashboard home page: metrics strip (properties/agents/leads/appointments), quick action cards, site status card
- Fixed missing `"use client"` directive on `packages/ui/src/components/sidebar.tsx`

---

## 2026-03-20 (Session 4 — Next Phase)

### Property/Agent Data Binding
- Wired `listFeaturedProperties()` and `listAgentsForCompany()` into builder page `resolveWebsitePresentation()` call
- Wired same into live page `resolveWebsitePresentation()` call
- PropertyGridSection and AgentShowcaseSection now render real DB data from properties and agents tables
- Pattern matches tenant-site approach already working in `apps/tenant-site/src/app/page.tsx`

### Tenant Domain Status Surfaces
- Added inline alerts on dashboard home page for failed and pending domains
- Failed domains show destructive alert with "View domains" link
- Pending domains show amber alert with "Provision now" form button
- Alerts dynamically computed from existing `domainStatuses` query data

### Email Template Expansion
- Created `packages/email/emails/new-lead.tsx` — React Email template for new lead notifications with lead details section
- Created `packages/email/emails/site-published.tsx` — React Email template for site publish confirmation
- Added `defaultNewLeadSubject()` and `defaultSitePublishedSubject()` to `packages/email/defaults.ts`
- Created `new_lead_captured` notification type definition with email + in_app channels
- Created `site_published` notification type definition with email + in_app channels
- Registered both in `plotKeysNotificationTypes` registry (now 10 types total)
- Added `new_lead_captured` and `site_published` email dispatch handlers in `EmailService.buildEmailPayload()`

---

## 2026-03-20 (Session 3 — High-Priority Phase 1)

### Tenant Domain Management UI
- Created `/domains` dashboard page with full domain listing, status badges (active/pending/provisioning/failed/detached), error display
- Added status filter tabs and summary stats strip (total/active/failed)
- Added re-sync button with `syncTenantDomainsAction` (revalidates `/domains`)
- Added Domains metric card + quick-nav card to dashboard home

### Logo Upload Flow
- Added `@plotkeys/platform-integrations` dependency to dashboard
- Created `LogoUpload` client component with dual mode: file upload (Supabase storage) and URL paste fallback
- Created `setCompanyLogoAction` server action calling `workspace.setCompanyLogo` tRPC procedure
- Created `/settings` page with company info display and logo upload section
- Updated HeroBannerSection to render logo as `<img>` when value is an HTTP URL, text otherwise
- Added Settings quick-nav card to dashboard home

### WebsiteVersion Phase 4 Cleanup (reads)
- Removed SiteConfiguration fallback from `resolveActiveDraftForCompany()` in `packages/db/src/queries/website.ts`
- Removed SiteConfiguration fallback from `resolvePublishedForCompany()` in `packages/db/src/queries/website.ts`
- Added `legacyConfigId` to draft return shape for builder action compatibility
- Updated builder page to read from WebsiteVersion via `resolveActiveDraftForCompany()` (configId for actions still comes from SiteConfiguration via legacyConfigId link)
- Updated dashboard home page to use `resolvePublishedForCompany()` instead of direct SiteConfiguration query
- Updated live page to use `resolvePublishedForCompany()` instead of direct SiteConfiguration query
- Updated `ensureBuilderConfigurationExists()` to check WebsiteVersion existence
- Added `./queries/website` export to `@plotkeys/db` package
- Note: Write paths still go through SiteConfiguration with Phase 2 dual-write (WebsiteVersion stays in sync)

## Roadmap Steps 10-21 Completion

### Step 10: Auto domain sync on onboarding
- Added `grantTemplateLicense()` and `runInBackground(domainSyncHandler)` calls after `createCompanyOnboardingBundle` in `completeOnboarding` mutation
- Both non-blocking — domain sync failures are caught silently

### Step 13: Hostname middleware
- Verified already complete via `proxy.ts` pattern in both dashboard and tenant-site
- `resolveTenantByHostname()` handles DB lookup with slug fallback

### Step 16: Auto-grant free template license
- Added `grantTemplateLicense()` call in `completeOnboarding` mutation
- Grants the selected template as a free pick during onboarding

### Step 17: Section visibility toggles
- Added `visibleSections?: Record<string, boolean>` to `TemplateConfig` type
- Updated serialize/deserialize/applyConfigUpdate helpers
- Added `SectionVisibilityToggles` component with Switch toggles in builder sidebar
- Updated `BuilderPreviewPanel` to filter sections by visibility
- Wired `sectionTypes` and `visibleSections` through builder page.tsx and drawer
- Added visibility filtering to tenant-site public rendering

### Step 18: Website/WebsiteVersion dual-write (Phase 2)
- Updated `createCompanyOnboardingBundle` to create Website + WebsiteVersion in transaction
- Updated all SiteConfiguration CRUD to mirror changes to draft WebsiteVersion
- Converted `publishSiteConfiguration` from batch to interactive transaction for dual-write publish

### Step 20: Lead capture
- Created Prisma model: `lead.prisma` (enum + model with status tracking)
- Created query functions: createLead, listLeadsForCompany, countLeadsByStatus, updateLeadStatus, findLeadById
- Updated tenant-site contact endpoint to persist leads to database
- Added tRPC procedures: listLeads, getLeadStats, updateLeadStatus
- Added server action: updateLeadStatusAction
- Created dashboard page: `/leads` with status filtering, stats bar, status progression buttons

### Step 21: Unified billing (Paystack)
- Created Paystack API client wrapper (`packages/utils/src/paystack.ts`): transaction init, verify, plan CRUD, subscription management, webhook signature verification (HMAC-SHA512)
- Created webhook endpoint (`apps/dashboard/src/app/api/webhooks/paystack/route.ts`): handles charge.success, subscription.create, subscription.disable, invoice.payment_failed events; verifies signature; updates plans and template licenses
- Added tRPC procedures: `getBillingInfo` (plan status + billing history), `initializeCheckout` (create Paystack transaction + pending billing line item)
- Created billing dashboard page (`/billing`): current plan display, monthly/annual toggle, plan comparison cards with upgrade buttons, billing history
- Created checkout callback page (`/billing/callback`): handles Paystack redirect after payment
- Added `initializeCheckoutAction` server action: calls tRPC initializeCheckout and redirects to Paystack authorization URL

## 2026-03-19 (Session 3 — Todos)

### Tenant Domain Management UI
- Created `/domains` dashboard page with domain list, status badges, error details, and re-sync button
- Added `syncDomainsAction` server action (redirects to `/domains?synced=1` on success)
- Updated dashboard home quick-nav from 2 to 4 cards (added Domains + Settings)

### Logo Upload Flow
- Added `@plotkeys/platform-integrations` dependency to `apps/dashboard`
- Created `POST /api/upload` API route that validates file type/size and uploads to Supabase logos bucket
- Created `LogoUploadForm` client component with file picker and URL paste fallback
- Created `/settings` dashboard page with workspace info and logo upload section
- Added `setCompanyLogoAction` server action calling existing `setCompanyLogo` tRPC procedure

### Logo rendering in tenant site
- Added `logoUrl?: string` field to `ThemeConfig` and `TenantThemeRecord`
- Added `companyLogoUrl` option to `ResolveTemplateOptions`
- Updated `resolveWebsitePresentation` to propagate `companyLogoUrl` through theme
- Updated `HeroBannerSection` in `home-page.tsx` to render `<img>` when `theme.logoUrl` is set
- Wired `company.logoUrl` from `tenant-site/page.tsx`

### Better Auth Migration
- Refactored `signUpUser()` to use `auth.api.signUpEmail()` instead of manual Prisma user creation
- Refactored `signInUser()` to use `auth.api.signInEmail()` instead of manual bcrypt comparison
- Removed unused `verifyPasswordHash()` and `compare` import

### Appointment Scheduling
- Created `appointment.prisma` model with AppointmentStatus enum (scheduled/completed/cancelled/no_show)
- Built CRUD queries in `packages/db/src/queries/appointments.ts`
- Added 5 tRPC procedures: listAppointments, getAppointmentStats, createAppointment, updateAppointmentStatus, deleteAppointment
- Created `/appointments` dashboard page with create form, status filtering, management actions
- Added server actions: createAppointmentAction, updateAppointmentStatusAction, deleteAppointmentAction

### Website/WebsiteVersion Phase 3 Read Cutover
- Added `resolveActiveDraftForCompany()` and `resolvePublishedForCompany()` read helpers
- Both prefer WebsiteVersion, fall back to SiteConfiguration for pre-migration companies
- Updated tenant-site page.tsx to use `resolvePublishedForCompany()`

### Stock Image Marketplace
- Created `stock-image-license.prisma` model with unique constraint on companyId+imageId
- Built grant/check/list query functions
- Added listStockImageLicenses + purchaseStockImage tRPC procedures with billing line item creation

### AI Credit Tracking
- Created `ai-credits.prisma` with AiUsageLog and AiCreditLedger models (ledger pattern)
- Built query functions: getAiCreditBalance, hasEnoughCredits, grantAiCredits, deductAiCredits, logAiUsage, getAiUsageStats
- Wired credit deduction + usage logging into smartFillField tRPC mutation
- Added getAiCreditInfo + purchaseAiCredits tRPC procedures
- Created `/ai-credits` dashboard page with balance display, usage breakdown, top-up button

### Analytics Foundations
- Created `analytics.prisma` AnalyticsEvent model with company/type/date indexes
- Built recordAnalyticsEvent, getAnalyticsSummary, getPageViewsByDay query functions
- Created tenant-site `/api/track` endpoint with privacy-safe visitor fingerprinting (SHA-256 of IP+UA)
- Added getAnalytics tRPC procedure
- Created `/analytics` dashboard page with stat cards, event type breakdown, page view bar chart, recent events

- Enhanced Builder Preview page (`/builder/preview`) with:
  - **Sidebar layout**: Added persistent builder config sidebar (hidden below xl breakpoint) with template selector, style presets, color systems, and preview info
  - **Dark mode toggle**: Integrated `ThemeToggle` component in preview header for light/dark mode switching
  - **Compact template picker**: Simplified template selection UI with tier tabs and smooth transitions (compact inline display in header, full sidebar picker on desktop)
  - **Responsive design**: Mobile-friendly template picker dropdown in header, desktop sidebar with comprehensive preview controls
  - **Design tokens**: Used shadcn design tokens throughout (semantic colors, spacing, rounded corners) for consistent visual hierarchy
  - Grid layout matches main builder page structure (2-column on xl: sidebar + content)
  - Style presets and color systems displayed as interactive grid previews in sidebar

## 2026-03-18
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

## 2026-03-19 (Session 4 — Tenant Dashboard System)

### Dashboard route group and sidebar navigation
- Created `(app)` Next.js route group for all authenticated pages (no URL changes)
- Moved 11 page directories (agents, ai-credits, analytics, appointments, billing, builder, domains, leads, live, properties, settings) + their sub-pages into `(app)/`
- Fixed all relative imports across moved files (one extra `../` depth added)
- Created `DashboardSidebar` client component: 4-group nav (Workspace, Operations, Growth, Platform) with active state via `usePathname`, plan badges for Pro/Plus/Coming features, company info header, sign-out in footer
- Created `DashboardShell` client component wrapping SidebarProvider + DashboardSidebar + SidebarInset so `(app)/layout.tsx` stays a server component
- `(app)/layout.tsx` reads planTier from DB and passes to DashboardShell

### Dashboard home page rebuild
- Replaced dev-focused prototype home page with proper tenant-facing dashboard
- Header: company name + plan badge + "View site" + "Open builder" CTAs
- 4-metric stat strip: Properties, Agents, New leads, Appointments (all clickable)
- 4 quick-action cards: Builder, Analytics, Leads, Billing
- Plan upgrade prompt for starter users
- Platform feature roadmap grid (4 sections × features) showing Live/Partial/Plus/Pro/Coming status with icons and descriptions

### Bug fixes
- Fixed CSS custom property syntax in builder/page.tsx: `shadow-(--shadow-soft)` → `shadow-[var(--shadow-soft)]`
- Removed duplicate "Tenant domain management UI" entry from brain/progress.md
- Fixed `domains/page.tsx` locale from `en-US` back to `en-NG` (codebase convention)

## 2026-03-20 (Session 5 — Feature Completion)

### Team Management (Phase 1B)
- Added `/join/[token]` page for accepting team invites (handles expired/revoked/already-accepted states)
- Added `acceptInviteAction` server action calling `team.acceptInvite` tRPC procedure
- Added `/team` link (Users2Icon) and `/notifications` link (BellIcon) to `DashboardSidebar` Platform group

### Notifications Page
- Created `/notifications` dashboard page with list, unread badge, unread/all filter toggle, and "Mark all read" form button
- Direct DB query for notifications (no extra tRPC call needed for server page)

### Property Detail Page + Media Gallery
- Created `/properties/[id]` detail page with:
  - Property info header with publish state badge
  - Publish state controls: Publish, Unpublish, Archive, Restore to draft
  - Media gallery grid: photos, floor plans, virtual tour links
  - Add media form (URL + type + cover checkbox)
  - Set cover star button + delete button per media item
- Updated properties list page to show `publishState` badge on each property card
- Updated properties list to link property title to `/properties/[id]`
- Updated `addPropertyMediaAction`, `deletePropertyMediaAction`, `setPropertyCoverAction` to revalidate both `/properties` and `/properties/[propertyId]` paths
- Updated `updatePropertyPublishStateAction` to revalidate both paths

## 2026-03-20 (Session 6 — Core Product Gaps + Dashboard Expansion)

### Property/Agent Data Binding Fix
- Updated `listFeaturedProperties` to filter by `publishState: "published"` (only published listings appear on live tenant sites)
- Updated `listFeaturedProperties` to include cover media from `PropertyMedia` when `imageUrl` is null (includes `media` relation with cover filter, maps `imageUrl` to cover media URL as fallback)

### Listing Categories & Types
- Added `PropertyType` enum: residential, commercial, land, industrial, mixed_use
- Added `type` and `subType` fields to `Property` model
- Created migration: `20260320093931/migration.sql`
- Updated `createProperty`/`updateProperty` DB queries to accept `type`/`subType`
- Updated `createProperty`/`updateProperty` tRPC procedures (workspace.route.ts) with new fields
- Updated `createPropertyAction`/`updatePropertyAction` server actions to pass type/subType from form
- Updated `PropertyForm` component to include type selector and subType input
- Updated properties list page with type filter tabs and type badge per card
- Added `PropertyTypeValue` type export from `@plotkeys/db`

### Settings Expansion
- Expanded `/settings` page with:
  - Company Profile section with editable name and market (owners/admins only)
  - Workspace read-only section (subdomain, plan with Upgrade button)
  - Logo upload section (unchanged)
  - Danger zone with disabled Delete button (owners/admins only)
- Added `updateCompanyProfile` DB query function
- Added `updateCompanyProfile` tRPC procedure (admin+ role required)
- Added `updateCompanyProfileAction` server action

### Customer Model + Lead Promotion
- Added `CustomerStatus` enum: active, inactive, vip
- Added `Customer` Prisma model (company, name, email, phone, notes, status, sourceLeadId)
- Created migration in `20260320093931/migration.sql`
- Added `Customer` relation to `Company` model
- Created customer DB queries: createCustomer, listCustomersForCompany, getCustomerById, updateCustomer, softDeleteCustomer, countCustomersByStatus
- Created `customers.route.ts` tRPC router: list, stats, create, update, delete
- Registered `customersRouter` in `_app.ts`
- Added server actions: createCustomerAction, updateCustomerStatusAction, deleteCustomerAction, convertLeadToCustomerAction. Superseded on 2026-07-03: customer create/update/delete dashboard UI now uses tRPC mutations; lead conversion still uses `convertLeadToCustomerAction`.
- Created `/customers` dashboard page with stats strip, status filter tabs, customer cards with status management
- Added "→ Customer" convert button on qualified leads in `/leads` page
- Updated `DashboardSidebar` Customers link from `#` to `/customers`

### Construction Project Management — Phase 1
- Created Prisma enums file (`packages/db/prisma/enums/project.prisma`) with 11 enums: ProjectStatus, ProjectType, ProjectPhaseStatus, ProjectMilestoneStatus, ProjectDocumentKind, ProjectDocumentVisibility, ProjectUpdateKind, ProjectIssueSeverity, ProjectIssueStatus, ProjectRole, ProjectAssignmentStatus
- Created 7 Prisma model files: Project, ProjectPhase, ProjectMilestone, ProjectDocument, ProjectUpdate, ProjectIssue, ProjectAssignment
- Added `projects` relation to Company model, `projectAssignments` to Membership model
- Created project query module (`packages/db/src/queries/project.ts`) with full CRUD for projects, phases, milestones, updates, issues, assignments, and documents
- Exported project queries from `@plotkeys/db` index and package.json exports map
- Created `projects.route.ts` tRPC router with all mutations and queries (list, get, stats, create, update, delete + phases, milestones, updates, issues, team assignments)
- Registered `projectsRouter` in `_app.ts`
- Created 6 client components using `useMutation` in `apps/dashboard/src/components/projects/` (create-project-form, project-actions, project-phases, project-milestones, project-updates, project-issues, project-team)
- Refactored `/projects` list page to use client components for mutations
- Refactored `/projects/[id]` detail page to use client components for mutations
- Added "Construction" nav group with HardHat icon to dashboard sidebar

### Construction Project Management — Phase 2 (Finance and Workforce)
- Added 4 new Prisma enums to `project.prisma`: ProjectWorkerPayBasis, ProjectWorkerStatus, ProjectPayrollRunStatus, ProjectWorkerPaymentStatus
- Created `project-budget.prisma` model file with ProjectBudget and ProjectBudgetLineItem models
- Created `project-workforce.prisma` model file with ProjectWorker, ProjectPayrollRun, and ProjectPayrollEntry models
- Updated Project model with relations to budget, workers, and payrollRuns
- Extended `packages/db/src/queries/project.ts` with budget, worker, and payroll queries (getOrCreateProjectBudget, updateProjectBudget, getProjectBudgetWithLineItems, createProjectBudgetLineItem, updateProjectBudgetLineItem, deleteProjectBudgetLineItem, listProjectWorkers, createProjectWorker, updateProjectWorker, deleteProjectWorker, listProjectPayrollRuns, getProjectPayrollRunWithEntries, createProjectPayrollRun, updateProjectPayrollRun, deleteProjectPayrollRun, upsertProjectPayrollEntry, deleteProjectPayrollEntry)
- Extended `projects.route.ts` tRPC router with 16 new Phase 2 procedures for budget, workers, and payroll runs
- Created `project-budget.tsx` client component with BudgetSummaryCard (totals + update form), BudgetLineItemList (with delete), AddBudgetLineItemForm
- Created `project-workforce.tsx` client component with WorkerList (with status toggle + remove), AddWorkerForm, PayrollRunList (with confirm/mark paid/delete), CreatePayrollRunForm
- Created `/projects/[id]/budget` page showing budget summary and line items
- Created `/projects/[id]/workforce` page showing workers and payroll runs
- Updated `/projects/[id]` detail page header with Budget and Workforce navigation buttons
# Progress Log

- 2026-03-25: Fixed the dashboard projects page so failed project-creation attempts now surface the redirected `error` query string in a destructive alert, matching the error-handling pattern already used on properties, agents, team, and other dashboard pages. Also normalized the client-side redirecting forms for project creation, property create/edit, agent create/edit, team invites, employee invites, and final onboarding completion to await server actions directly instead of wrapping them in `startTransition(async () => ...)`, which had been causing submissions to behave like plain page refreshes instead of following the intended redirect flow.
## 2026-03-30 — WebsiteVersion Phase 4 Writes

### What was built
- **WebsiteVersion-first builder writes** — Added `findDraftWebsiteVersionByIdForCompany()` and `upsertDraftWebsiteVersion()` in `packages/db/src/queries/website.ts` so the active draft can be looked up and updated directly by `WebsiteVersion.id` instead of routing writes through legacy `SiteConfiguration`.
- **Workspace mutation cutover** — Updated `createTemplateDraft`, `ensureBuilderConfigurationExists`, `publishSiteConfiguration`, `smartFillField`, `updateSiteField`, and `updateSiteThemeField` in `apps/api/src/routers/workspace.route.ts` to use WebsiteVersion draft records as the primary write target.
- **Builder config ID cutover** — `apps/dashboard/src/components/builder/builder-workspace.tsx` now always passes the resolved active draft WebsiteVersion ID to all builder actions. The previous fallback to `legacyConfigId` / latest `SiteConfiguration.id` was removed.
- **Removed onboarding dual-write in active draft path** — `updateOnboardingInputs` / onboarding AI content updates now write only to the active WebsiteVersion draft instead of mirroring field-by-field back into SiteConfiguration.

### Validation notes
- Focused Biome checks passed on the touched files with only pre-existing warnings in unrelated `workspace.route.ts` mutations (`ctx` unused in lead/appointment handlers).
- `packages/db` typecheck remains blocked in this sandbox because `@plotkeys/tsconfig/base.json` is not resolvable here.
- `apps/api` typecheck remains blocked in this sandbox because installed package resolution for the workspace dependencies is incomplete (`drizzle-orm/node-postgres` and related modules unavailable to `tsc` here).
- Manual code-path verification confirmed the builder now uses `resolvedActiveDraft.id` as `configId`, and the targeted website builder mutations no longer call `createSiteConfiguration`, `updateSiteConfigurationContentField`, `updateSiteConfigurationThemeField`, or `publishSiteConfiguration`.

## 2026-05-22 — Customers Dashboard Midday-Style Migration

### What was built
- Started the page-by-page dashboard UI + structure migration task in `brain/tasks/in-progress.md`, using Midday's invoice page and invoice table modules as the reference structure.
- Refactored `apps/dashboard/src/app/(app)/customers/page.tsx` into a thinner route with `metadata`, loaded URL filter params, success/error alerts, and a Suspense-wrapped content component.
- Split customers UI into feature-owned modules:
  - `customers-header.tsx` for the page/table header, search filters, export action, and create-customer action.
  - `customers-summary.tsx` for status summary cards above the table.
  - `tables/customers/columns.tsx` for table column metadata and row typing.
  - `tables/customers/data-table.tsx` for the customer table and row actions.
  - `tables/customers/empty-states.tsx` for no-data/no-filtered-data presentation.
  - `tables/customers/skeleton.tsx` for the Suspense loading state.
- Superseded on 2026-07-03: this pass initially preserved the server-action and Prisma query flow; the current customers page now uses the Midday-style hydrated tRPC table route and client mutation flow.

### Validation notes
- `bun run --cwd apps/dashboard typecheck` passed.
- Scoped Biome check passed for all migrated customers files.
- Full `bun run --cwd apps/dashboard lint` still fails on pre-existing diagnostics outside the customers migration, including import ordering/formatting in estates, properties, tRPC, and proxy files plus existing array-index key warnings.

### Customer form slice
- Extracted the inline customer creation dropdown from `customers-header.tsx` into `customer-form.tsx`.
- Implemented the create flow as a dashboard sheet using the same `DashboardSheetHeader`, `DashboardSheetBody`, and `DashboardSheetFooter` pattern used by listing forms.
- Superseded on 2026-07-03: client-side Zod validation remains, but the create flow now uses `trpc.customers.create` with query invalidation instead of `createCustomerAction`.
- Validation: scoped Biome check passed for `customer-form.tsx` and `customers-header.tsx`; `bun run --cwd apps/dashboard typecheck` passed.

### Search filter slice
- Moved the customer-specific search/filter wrapper from the customers page root into `tables/customers/search-filter.tsx` so the customers table folder owns filtering alongside columns, table, empty state, and skeleton modules.
- Added `tables/customers/search-filter-skeleton.tsx` and wired it into the customers table skeleton for a more complete Midday-style loading state.
- Updated `customers-header.tsx` to import the table-owned search filter and deleted the old root-level `customers-search-filter.tsx`.
- Validation: scoped Biome check passed for the touched search/filter files; `bun run --cwd apps/dashboard typecheck` passed.

## 2026-05-22 — Customers GND Sales-Book Table Migration

### What was built
- Ported the reusable GND-style table shell into `@plotkeys/ui/data-table`, including `Table.Provider`, `useTableData`, table header/body/row/load-more/summary primitives, skeletons, sticky-column support, table-scroll hook, and `cells.selectColumn`.
- Ported the GND-style search/filter shell into `@plotkeys/ui/search-filter`, including provider context, search input, generated filter menu, chips, clear behavior, debounced URL submission, and keyboard shortcut focus handling.
- Added the reusable list-query helper in `@plotkeys/utils/query-response` with `composeQuery`, `queryMeta`, `queryResponse`, and `composeQueryData`, preserving the offset cursor contract (`cursor = currentOffset + size`, `null` at the end).
- Rebuilt customers data loading around `customers.get` tRPC infinite query, `getCustomersSchema`, `whereCustomers`, and `getCustomers`; superseded on 2026-07-03 to use tRPC mutations for create/update/delete UI as well.
- Reworked `/customers` to server-fetch the generated filter list, prefetch the infinite customer list, hydrate the client, and render the shared table system with GND-style columns, row selection, load-more, search, status filter chips, export, summary cards, and create-customer sheet.

### Validation notes
- `bun run --cwd packages/ui typecheck` passed.
- `bun run --cwd packages/utils typecheck` passed.
- `bun run --cwd apps/api typecheck` passed.
- `bun run --cwd apps/dashboard typecheck` passed.
- Scoped `bunx biome check --write` passed for the new UI table/search-filter files, list-query helper, customer API/query/filter files, customers dashboard route/components, customer URL hook, and dashboard tRPC server.

## 2026-07-03 — Dashboard Route Error Boundaries

- Added Midday-style `ErrorBoundary` + shared `ErrorFallback` composition around hydrated Suspense table/detail surfaces across dashboard home, analytics, reports, billing, notifications, team, agents, customers, properties, leads, appointments, projects, estates, blog, settings, integrations, domains, AI credits, HR employees/departments/leave/payroll, and project detail budget/workforce pages.
- Left the template sandbox route unchanged because it hydrates a sandbox index without the Suspense table/detail boundary shape covered by this pass.
- Added the Midday `batchPrefetch` helper to the dashboard tRPC server helper and converted multi-query dashboard pages to batch their prefetch orchestration, leaving single-query routes on `prefetch`.
- Moved customer and property table search filters off the shared `@plotkeys/ui/search-filter` package and onto the dashboard-local `DashboardSearchFilter`, then removed the unused shared UI search-filter export/files so filter UI ownership matches Midday's dashboard component boundary.
- Added dashboard-local `DashboardSearchFilter` wrappers for leads, projects, and blog, replacing their ad hoc table-header search inputs while preserving URL-backed `q/status` filter params and existing status summary tabs.
- Added dashboard-local q-only search-filter wrappers for agents, team members, and departments, and updated `DashboardSearchFilter` so q-only tables do not render an empty filter dropdown while still using the shared search/chip behavior.
- Added dashboard-local search-filter wrappers for employees, notifications, leave requests, appointments, and payroll, replacing the remaining raw `Input` table-header searches with URL-backed Midday-style filter components.
- Aligned PlotKeys notification Trigger tasks with the after-service job pattern by adding `logger.info` dispatch summaries, notification task max duration, and notification queue concurrency metadata.
- Added an after-service-style generic `notification` Trigger task for PlotKeys that accepts typed notification registry payloads, supports channel overrides and the production-safe `sendEmail` gate, falls back to the company owner recipient, and preserves the existing `notifications.dispatch` tenant-site adapter path.
- Moved generic notification delivery orchestration into `@plotkeys/notifications` via a package-owned `Notifications.send(...)` service, matching the after-service package boundary while keeping Trigger tasks as thin adapters.
- Added a PlotKeys notification message log table/query and wired `Notifications.send(...)` email dispatches to persist after-service-style provider/status audit rows while preserving the `sendEmail` dry-run gate.
- Extended notification message-log persistence to WhatsApp dispatches by exposing per-recipient WhatsApp send outcomes and recording provider/status/error rows from the package-owned notification service.
- Aligned the PlotKeys `email-smoke-test` handler with after-service by creating smoke-test company/lead records, sending through `Notifications.send(...)`, reading the persisted notification message log, and logging dispatch/message-log status from the Trigger task.
- Extended notification message-log persistence to in-app dispatches so package-owned notification delivery now records sent, skipped, and failed audit rows for email, WhatsApp, and in-app channels.
- Added after-service-style `sms` channel support to the PlotKeys notification contract, including phone-number delivery planning, `NotificationResult.dispatches.sms`, and package-owned SMS message-log rows.
- Added the after-service `phone` channel to the PlotKeys notification contract, including phone-number delivery planning, package-owned phone message-log rows, and `NotificationResult.dispatches.phone`.
- Added an after-service-style `NotificationTypes` schema map export for PlotKeys notifications and switched `NotificationTaskPayload` / `Notifications.send(...)` payload typing to use that shared contract.
- Added message-log persistence for the remaining legacy tenant-site property inquiry receipt and newsletter welcome email sends so `notifications.dispatch` now records provider/status audit rows for those customer-facing emails too.
- Added an after-service-style schema-backed notification job payload contract and switched the generic PlotKeys notification Trigger task to `schemaTask` with `machine: "micro"`, max duration, and queue concurrency metadata.
- Extended PlotKeys `NotificationService` with an after-service-style tasks-client transport that triggers the generic `notification` job, preserved its in-memory function transport for React/local planners, and moved dashboard workspace invite emails onto the queued notification job path with message-log persistence.
- Split the domains provisioned-hostname surface into Midday-style table files by adding `components/tables/domains/columns.tsx` and `empty-states.tsx`, then replacing the provisioned-domain card grid with a structured table that keeps cell rendering/actions in the table slice.
- Split billing history into Midday-style table files by moving billing row type, amount/date/reference/status/action cell helpers into `components/tables/billing/columns.tsx` and the no-history state into `empty-states.tsx`, leaving `table.tsx` as the section/table composition layer.
- Split AI credits usage into Midday-style table files by moving feature usage row typing and feature/count cell helpers into `components/tables/ai-credits/columns.tsx` and the no-usage state into `empty-states.tsx`, leaving `table.tsx` focused on section/table composition.
- Split notification preferences into Midday-style table files by moving preference row typing, event label/status cells, and channel toggle actions into `components/tables/notification-preferences/columns.tsx`, and moving the info card into `empty-states.tsx`.
- Split reports tables into Midday-style table files by moving agent/listing row types, badge cells, and report number cells into `components/tables/reports/columns.tsx`, then moving report empty states into `empty-states.tsx` and wiring the reports view through the table folder exports.
- Slimmed the custom-domain connection route into a Midday-style server composer with metadata, moved the page surface into `components/domains/connect-domain-view.tsx`, and moved hostname validation/submission into `components/forms/connect-domain-form.tsx`.
- Slimmed the live preview route into a Midday-style server composer with metadata and moved empty states, published-site header, presentation resolution, and section rendering into `components/live/live-preview.tsx`.
- Slimmed the builder template preview route into a Midday-style metadata composer and moved the client-only template preview studio into `components/builder/builder-template-preview.tsx`.
- Re-aligned `hooks/use-table-scroll.ts` exactly to Midday's table-scroll hook, restoring ArrowLeft/ArrowRight hotkey scrolling and the original column-width scroll/index synchronization behavior.
- Re-aligned `hooks/use-table-settings.ts` exactly to Midday's table settings hook, preserving the unified cookie persistence shape for column visibility, sizing, and ordering.
- Re-aligned `hooks/use-sticky-columns.ts` to Midday's sticky column calculation shape, preserving only the PlotKeys-local default sticky config because this dashboard does not have Midday's `transactions` table id.
- Re-shaped `utils/table-configs.ts` to Midday's documented table config layout and object ordering while preserving PlotKeys-specific table ids, sticky columns, sort field maps, and row heights.

## 2026-07-04 — Dashboard Sheet Registry

- Added a Midday-style `GlobalSheetsProvider`/`GlobalSheets` registry for dashboard sheets, moved the customer create sheet into an always-mounted URL-param sheet, and changed customer header/empty-state actions into lightweight `createCustomer=true` triggers.
- Split property listing and estate launch creation sheets out of their form files into `components/sheets/property-sheet.tsx` and `components/sheets/estate-create-sheet.tsx`, leaving the forms focused on validation, fields, and submit behavior while table/header/empty-state callers import sheet wrappers.
- Split estate launch editing into `components/sheets/estate-launch-details-sheet.tsx` plus a pure `components/forms/estate-launch-details-form.tsx`, removing the last sheet primitive usage from the dashboard forms folder.
- Added a Midday-style `components/modals` folder for dashboard dialogs by moving builder publish confirmation and template re-recommendation dialogs out of the builder feature folder, leaving `components/builder/onboarding-tools.tsx` focused on non-modal AI actions.
- Split analytics display cards, chart, and sections into `components/analytics/sections.tsx` so `components/analytics/index.tsx` is the query/composition layer, and aligned dashboard home plus analytics routes to the Midday `batchPrefetch([...])` server prefetch pattern.
- Split reports header, summary, and performance sections into `components/reports/sections.tsx` so `components/reports/index.tsx` is the query/composition layer, and aligned the reports route to the Midday `batchPrefetch([...])` server prefetch pattern.
- Replaced the remaining dashboard route-level single-query `prefetch(...)` calls with Midday-style `batchPrefetch([...])` across billing, integrations, settings, estates, project detail, blog detail, AI credits, and HR department routes.
- Split the project budget and workforce/payroll detail tables into Midday-style table slices by moving row/header cell rendering into `projects/budget/columns.tsx` and `projects/workforce/columns.tsx`, moving no-data/project-missing states into matching `empty-states.tsx` files, and leaving the public `budget.tsx` / `workforce.tsx` modules as query and section composition layers.
- Split the property form pricing-plan field array out of `property-form.tsx` into `property-pricing-plan-fields.tsx`, keeping the main form focused on defaults/submission while the dedicated field component owns the payment-plan table rendering, add/remove controls, and normalization helpers.
- Added the after-service-compatible `emailSmokeTest` Trigger task export while preserving PlotKeys' existing `emailSmokeTestTask` alias, aligning the jobs task surface without breaking current imports.
- Aligned the dashboard-local search filter with Midday checkbox behavior by keeping dropdown submenus open on checkbox selection and adding array-toggle handling for `checkbox` filters while preserving single-select filter semantics.
- Aligned the dashboard tRPC query client with Midday's data-fetching defaults by adding request-aware server/browser retry behavior, two-minute stale time, ten-minute cache retention, pending-query dehydration, superjson hydrate/dehydrate transforms, and a browser redirect to `/sign-in` on unauthorized query errors.
- Re-aligned the repeated table `data-table-header.tsx` implementations with Midday's draggable-header shape by passing sticky header classes into `DraggableHeader`, removing the extra inner wrapper around header content, and guarding draggable-column resize handles with `header.column.getCanResize()`.
- Moved the builder mobile sidebar drawer into `components/sheets/builder-sidebar-drawer.tsx`, keeping Sheet primitives inside the sheet boundary while the builder workspace imports the drawer through the dashboard-local sheets alias.
- Tightened analytics and reports composition empty-state handling so genuinely empty payloads render a single page-level empty state while populated report pages can still show section-level inline fallbacks.
- Re-aligned the dashboard-local shared search filter trigger with Midday's compact icon-only dropdown control and added a `Filter` icon alias to the PlotKeys UI icon namespace for table filter controls.
- Tightened the dashboard-local filter chip list to render from known filter definitions in definition order, matching Midday's processed active-filter list semantics instead of raw filter-object iteration.
- Aligned the notification registry fallback with after-service by defaulting unspecified notification channels to email while preserving PlotKeys' explicit per-type channel defaults.
- Moved the dashboard sheet layout helpers into `components/sheets/dashboard-sheet-layout.tsx` and rewired form/sheet callers so Sheet primitive wrappers live inside the Midday-style sheet boundary.
- Split form body/footer layout out of the sheet helper into `components/forms/form-layout.tsx`, removing the remaining form imports from the sheet boundary while preserving the previous sheet footer flex/spacing behavior.
- Moved project budget/workforce shared formatting and option helpers out of the table folder into `components/projects`, removing form dependencies on table-owned internals while keeping table slices focused on rendering.
- Normalized repeated dashboard table header rows to Midday's dense `h-[45px]` table-header height across customer, CRM, HR, project, notification, payroll, and blog table slices.
- Moved the remaining table-local domain utility modules for employees, appointments, leads, leave requests, notifications, payroll, blog, and projects into feature component folders, removing form/sheet dependencies on table-owned utility paths.
- Switched the `emailSmokeTest` Trigger job to the same schema-backed `schemaTask` pattern as the generic notification job, exporting its Zod payload schema from `@plotkeys/jobs` and declaring the jobs package's `zod` dependency.
- Switched the legacy `notifications.dispatch` Trigger task to a schema-backed `schemaTask`, composing the generic notification payload schema with contact-form, property-inquiry, and newsletter-signup schemas while exporting the dispatch schemas from `@plotkeys/jobs`.
- Wired the tenant-site contact API route into the shared `notifications.dispatch` job path after lead creation, carrying the created lead id through the dispatch payload so tenant contact submissions use the same after-service-style notification job pipeline.
- Added Zod validation to the tenant-site contact API boundary before lead creation and notification dispatch, keeping public contact submissions compatible with the schema-backed notification job payload contract.
- Rewired dashboard route pages for appointments, blog, employees, leave requests, payroll, leads, and projects to import domain guards/helpers from feature utility modules instead of table-local utility paths.
- Tightened the shared dashboard search filter active-state logic so only configured menu filters can light up the filter trigger or render chips, matching the Midday known-filter surface instead of unrelated URL params.
- Corrected the generic notification Trigger task to import its schema and payload type from `@plotkeys/notifications`, keeping the after-service-style job contract owned by the notification package instead of the handler module.
- Aligned the shared horizontal table pagination control with Midday's back/forward icon contract by adding `ArrowBack`/`ArrowForward` aliases to the PlotKeys icon namespace and using them in the table pager.
- Rewrote the primary CRM, HR, blog, customer, lead, appointment, payroll, and project table route composers to use Midday-style `@/` dashboard imports instead of route-relative component, hook, lib, tRPC, and utility paths.
- Rewrote the analytics, reports, notifications, and notification-preferences route composers to use Midday-style `@/` dashboard imports for page components, skeletons, filters, session helpers, and tRPC prefetch wiring.
- Rewrote the agents, team, properties, domains, billing, integrations, AI credits, estates, and HR departments route composers to use Midday-style `@/` dashboard imports for table components, filters, session helpers, tRPC prefetching, and table settings.
- Rewrote the blog detail, estate detail, project detail/budget/workforce, property detail, settings, and integration-settings route composers to use Midday-style `@/` dashboard imports for table components, skeletons, session helpers, and tRPC prefetch wiring.
- Rewrote the dashboard home, live preview, and app-store route composers to use Midday-style `@/` dashboard imports, leaving no remaining route-relative dashboard-local imports in `(app)` `page.tsx` files.
- Rewrote the central dashboard server actions and app-store server action imports to use Midday-style `@/lib` aliases for session, session-cookie, invite notification, tenant URL, and company-app helpers.
- Rewrote the dashboard shell and app-gate layouts to use Midday-style `@/` imports for chrome, global sheets, app gating, notification bell data, company-app context, and session helpers, leaving no remaining route-relative dashboard-local imports in `(app)` `layout.tsx` files.
- Rewrote the dashboard root layout plus sign-in, tenant sign-up, onboarding, and verify-email route composers to use Midday-style `@/` imports for auth forms, flow shell, onboarding forms, session helpers, tenant URLs, dev loaders, and tRPC provider wiring.
- Rewrote the remaining dashboard app route shells and invite flow helpers to use Midday-style `@/` imports for session helpers, session cookies, app actions, builder workspace, upload routes, dev quick-fill tools, and app-store install actions.
- Aligned the dashboard table-settings server action with Midday's exact cookie persistence contract by using `date-fns/addYears` for the ten-year expiry and declaring `date-fns` directly in the dashboard package manifest.
- Re-aligned the shared dashboard search-filter dropdown internals with Midday by extracting menu/checkbox item helpers, adding an empty-options disabled row, and making single-select filter clicks preserve the selected value until the active chip removes it.
- Aligned the PlotKeys notification package closer to after-service channel semantics by adding provider-channel support guards for email and WhatsApp templates, then skipping unsupported forced provider channels before delivery planning instead of letting jobs fail on unsupported rendered dispatches.
- Aligned WhatsApp notification logging closer to after-service by treating an unavailable WhatsApp provider as a log-only sent dispatch with no provider/error details instead of marking configured WhatsApp dispatches as skipped before logging.
- Moved the active agents roster from a capped finite list to the Midday-style infinite table contract: `workspace.listAgents` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized agents table triggers `useInfiniteScroll` while appointment pickers and public-site agent consumers unwrap the paginated `data` payload.
- Moved the HR leave requests table from a capped finite list to the Midday-style infinite table contract: `workspace.listLeaveRequests` now accepts cursor/size pagination, returns `{ data, meta }`, the route prefetches with `infiniteQueryOptions`, and the virtualized leave requests table triggers `useInfiniteScroll` while preserving URL-backed search/status/sort.
- Moved the HR payroll entries table from a finite period list to the Midday-style infinite table contract: `workspace.listPayrollEntries` now accepts cursor/size pagination, returns `{ data, meta }`, the payroll route prefetches with `infiniteQueryOptions`, and the virtualized payroll table triggers `useInfiniteScroll` while summary and period selectors stay on finite queries.
- Moved the projects overview table from a capped finite list to the Midday-style infinite table contract: `projects.list` now accepts cursor/size pagination, returns `{ data, meta }`, the projects route prefetches with `infiniteQueryOptions`, and the virtualized projects table triggers `useInfiniteScroll` while preserving URL-backed search/status/sort.
- Moved the notifications table from a capped finite list to the Midday-style infinite table contract: `notifications.list` now accepts cursor/size pagination, returns `{ data, meta }`, the notifications route prefetches with `infiniteQueryOptions`, and the virtualized notifications table triggers `useInfiniteScroll` while the topbar bell unwraps the paginated recent-notification `data` payload.
- Moved the blog posts table from a capped finite list to the Midday-style infinite table contract: `workspace.listBlogPosts` now accepts cursor/size pagination, returns `{ data, meta }`, the blog route prefetches with `infiniteQueryOptions`, and the virtualized blog table triggers `useInfiniteScroll` while the builder workspace unwraps the paginated `data` payload.
- Moved the HR departments table from a finite list to the Midday-style infinite table contract: `workspace.listDepartments` now accepts cursor/size pagination, returns `{ data, meta }`, the departments route prefetches with `infiniteQueryOptions`, and the virtualized departments table triggers `useInfiniteScroll` while preserving URL-backed search/sort.
- Moved the team members table from a finite membership list to the Midday-style infinite table contract: `team.listMembers` now accepts cursor/size pagination, returns `{ data, meta }`, the team route prefetches with `infiniteQueryOptions`, and the virtualized team table triggers `useInfiniteScroll` while invite-cap checks use the authoritative `team.getOverview.activeCount`.
