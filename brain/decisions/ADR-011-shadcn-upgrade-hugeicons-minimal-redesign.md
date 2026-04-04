# ADR-011: shadcn Upgrade, HugeIcons Migration, and Minimal Page Redesign

## Status
In Progress — branch `claude/upgrade-shadcn-redesign-8wncn`

## Date
2026-04-04

## Context

The existing UI layer has accumulated several problems:
- Heavy decorative gradients (`radial-gradient`, `linear-gradient` dark panels) throughout auth, onboarding, and marketing pages make the product feel visually noisy and hard to maintain.
- Icons are imported directly from `lucide-react` in 37+ files with no central abstraction — changing icon library requires touching dozens of files.
- `components.json` still targets `"style": "new-york"` and `"iconLibrary": "lucide"`, predating the shadcn base-ui pivot.
- The warm sandy background (`#f4efe7`), oversized border-radii (2rem, 1.75rem), and serif heading fonts used in product UI are aesthetically inconsistent with the minimal shadcn standard.

## Decision

### 1. shadcn preset upgrade
Run `bunx --bun shadcn@latest init --preset b2D0wqNxT --base base --template next --monorepo` to reinitialize shadcn with:
- `base` primitives (`@base-ui/react`) instead of `radix-ui`
- nova style
- monorepo alias layout

> **Note:** ui.shadcn.com is not reachable from the CI/build environment. The changes that the CLI would produce are applied manually (components.json, globals.css, component updates) on the same branch.

### 2. Icon library: lucide → HugeIcons via centralized `Icon` namespace
- Install `@hugeicons/react@^0.6` (v0.6.x includes 4000+ individual icon components)
- Create **`packages/ui/src/components/icons.tsx`** that exports all project icons as an `Icon` namespace: `Icon.Home`, `Icon.Settings`, `Icon.Bell`, etc.
- Add `"./icons": "./src/components/icons.tsx"` export to `packages/ui/package.json`
- All files previously importing from `lucide-react` are updated to `import { Icon } from '@plotkeys/ui/icons'`
- `lucide-react` is removed from all `package.json` files

**Rationale for central icons file:** one place to swap, rename, or add icons. Consumers never import from an icon library directly — they always go through `Icon.X`.

### 3. globals.css: clean minimal tokens
Replace the current warm/sandy custom palette with a standard shadcn neutral base:
- Remove `body` radial/linear gradient backgrounds
- Replace `#f4efe7` background with clean off-white neutral
- Remove `h1–h4` serif font override from product CSS (serif remains available as a utility class)
- Body uses only `bg-background`, no multi-layer gradient
- Sidebar tokens updated to align with new base palette

### 4. Page redesign: standard minimal shadcn
Rules for every page/component touched:
- **Remove:** `bg-[radial-gradient(...)]`, `bg-[linear-gradient(145deg,...)]` dark panel cards, `blur-3xl` decorative divs
- **Remove:** Oversized radius `rounded-[2rem]` / `rounded-[1.75rem]` / `rounded-[1.5rem]` → use `rounded-xl` or standard `rounded-lg`
- **Remove:** Heavy letter-spacing `tracking-[0.45em]` / `tracking-[0.32em]` → `tracking-wide` or none
- **Replace:** Dark gradient side-panel in `FlowShell` with `bg-muted` light panel
- **Replace:** Gradient logo badge in sign-in with plain text or simple `bg-primary` circle

**Pages/components redesigned:**
- `packages/ui/src/components/section-heading.tsx`
- `apps/website/src/app/page.tsx` — full marketing homepage
- `apps/dashboard/src/app/sign-in/page.tsx`
- `apps/dashboard/src/components/flow-shell.tsx`
- `apps/dashboard/src/app/(app)/page.tsx` — dashboard home

## Consequences

### Positive
- One icon source — `Icon.X` everywhere — trivial to change the underlying library again in future
- Cleaner, more maintainable pages: standard shadcn visual language, no bespoke gradient logic
- `packages/ui` stays coherent: single import pattern for icons, consistent token usage
- Easier dark mode: no custom color overrides needed when tokens are standard

### Negative / Trade-offs
- Lucide icons have different names/shapes than HugeIcons; some icon choices are approximations
- base-ui component migration (radix → `@base-ui/react`) is complex and deferred to a follow-up — the CLI would handle it cleanly but requires network access to ui.shadcn.com
- `@hugeicons/react@0.6.x` is not the latest v1.x API (which requires separate icon data packages not yet available); the 0.6 API with named exports is simpler and ships everything in one package

## Files Changed

| Path | Change |
|------|--------|
| `packages/ui/components.json` | Update style, iconLibrary to hugeicons, baseColor to slate |
| `packages/ui/src/globals.css` | New clean neutral palette, no body gradients |
| `packages/ui/src/components/icons.tsx` | **NEW** — centralized Icon namespace |
| `packages/ui/package.json` | Add @hugeicons/react, add ./icons export, remove lucide-react |
| `packages/ui/src/components/*.tsx` (22 files) | lucide → Icon.X |
| `apps/dashboard/src/components/nav/dashboard-sidebar.tsx` | 22 icons → Icon.X |
| `apps/dashboard/src/components/nav/notification-bell.tsx` | Icon.X |
| `apps/dashboard/src/components/flow-shell.tsx` | Remove dark gradient side panel |
| `apps/dashboard/src/app/sign-in/page.tsx` | Remove gradients, clean layout |
| `apps/website/src/app/page.tsx` | Full redesign, remove gradients |
| `apps/dashboard/src/app/(app)/page.tsx` | Minor cleanup |

## Icon Mapping (lucide → hugeicons)

| Lucide | HugeIcons |
|--------|-----------|
| Home | Home01Icon |
| Paintbrush | PaintBrush01Icon |
| Globe | Globe02Icon |
| Building2 | Building02Icon |
| UsersRound | UserGroupIcon |
| Users | UserMultiple02Icon |
| Mail | Mail01Icon |
| Calendar | Calendar01Icon |
| CalendarOff | CalendarRemove01Icon |
| BarChart3 | Analytics01Icon |
| Bell | Notification01Icon |
| Bot | RoboticIcon |
| Briefcase | Briefcase01Icon |
| CreditCard | CreditCardAcceptIcon |
| FileText | File01Icon |
| HardHat | (nearest: ChefHatIcon or construction placeholder) |
| LayoutDashboard | DashboardCircleIcon |
| Network | AiNetworkIcon |
| Receipt | Invoice01Icon |
| Settings | Settings01Icon |
| Settings2 | Settings02Icon |
| Sparkles | SparklesIcon |
| Store | Store01Icon |
| UserRoundCog | UserSettings01Icon |
| ChevronDown | (Arrow / expand icon) |
| ChevronLeft | ArrowLeft01Icon |
| ChevronRight | ArrowRight01Icon |
| Check | Tick01Icon |
| X / Close | Cancel01Icon |
| Search | Search01Icon |
| Circle | CircleIcon (or RadioButtonIcon) |
| GripVertical | HandGripIcon |
| PanelLeft | SidebarLeft01Icon |
| Sun | Sun01Icon |
| Moon | Moon01Icon |
| Loader2 | Loading01Icon |
| MoreHorizontal | MoreHorizontalIcon |
| CheckCircle2 | CheckmarkBadge01Icon |
| Download | Download01Icon |
| Eye | EyeIcon |
| EyeOff | ViewOffIcon |
| Plus / PlusCircle | PlusSignIcon / PlusSignCircleIcon |
| Minus | MinusSignIcon |
