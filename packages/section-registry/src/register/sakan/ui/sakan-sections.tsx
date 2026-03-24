"use client";

/**
 * Sakan (Rental) family section components.
 *
 * Design identity: fresh, functional, renter-friendly tenant acquisition.
 * Clean white/light backgrounds, teal/emerald accent. Rental listing cards
 * with monthly price display, availability badges, process steps.
 * Tone: "Find your next home."
 *
 * All components:
 *  - Accept { config, theme } matching the generic section config types
 *  - Use EditableText for every static contentKey field
 *  - Render dataSource items (listings, agents) as display-only
 *  - Use Tailwind + var(--pk-*) CSS custom properties only — no shadcn
 */

import type { CSSProperties, ReactNode } from "react";

import { EditableText } from "../../../sections/editing-primitives";
import type {
  PropertyGridConfig,
  WhyChooseUsConfig,
  ServiceHighlightsConfig,
  HeroSearchConfig,
} from "../../../sections/extended-sections";
import type {
  CtaBandConfig,
  HeroBannerConfig,
  ListingSpotlightConfig,
  MarketStatsConfig,
  StoryGridConfig,
  TestimonialStripConfig,
  ThemeConfig,
} from "../../../sections/home-page";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function shell(theme: ThemeConfig) {
  return {
    "--section-bg": theme.backgroundColor,
    fontFamily: theme.fontFamily,
  } as CSSProperties;
}

/** Teal pill label above section headings */
function FreshTag({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-teal-600">
      {children}
    </p>
  );
}

/** Clean teal-accented heading */
function FreshHeading({
  tag = "h2",
  children,
  theme,
  className = "",
}: {
  tag?: "h1" | "h2" | "h3";
  children: ReactNode;
  theme: ThemeConfig;
  className?: string;
}) {
  const Tag = tag;
  return (
    <Tag
      className={`font-bold leading-tight text-slate-800 ${className}`}
      style={{ fontFamily: theme.headingFontFamily }}
    >
      {children}
    </Tag>
  );
}

/** Teal filled button */
function FreshButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: string;
  variant?: "primary" | "outline" | "ghost";
}) {
  const styles = {
    primary:
      "bg-teal-600 text-white shadow-md hover:bg-teal-700 transition-colors",
    outline:
      "border-2 border-teal-600 bg-transparent text-teal-600 hover:bg-teal-50 transition-colors",
    ghost:
      "bg-transparent text-white/80 underline-offset-4 hover:underline hover:text-white",
  };

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold ${styles[variant]}`}
    >
      {children}
    </a>
  );
}

/** "Available Now" green badge */
function AvailableBadge() {
  return (
    <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
      Available Now
    </span>
  );
}

// ---------------------------------------------------------------------------
// SakanHeroBannerSection
// ---------------------------------------------------------------------------
// Rental search hero — "Find Your Next Home", teal gradient, rental search bar.
// ---------------------------------------------------------------------------

export function SakanHeroBannerSection({
  config,
  theme,
}: {
  config: HeroBannerConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="relative overflow-hidden px-6 py-16 md:px-12 md:py-24"
      style={{
        ...shell(theme),
        background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
      }}
    >
      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/90">
          <EditableText
            contentKey="hero.eyebrow"
            value={config.eyebrow}
          />
        </span>

        <EditableText
          as="h1"
          className="mt-6 text-5xl font-extrabold leading-[1.05] text-white md:text-6xl lg:text-7xl"
          contentKey="hero.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />

        <EditableText
          as="p"
          className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/80"
          contentKey="hero.subtitle"
          value={config.subtitle}
        />

        {/* Search bar stub */}
        <div className="mx-auto mt-8 flex max-w-xl overflow-hidden rounded-xl bg-white shadow-lg">
          <input
            type="text"
            placeholder="Search by location, neighbourhood..."
            className="flex-1 px-5 py-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            readOnly
          />
          <a
            href={config.ctaHref}
            className="shrink-0 bg-teal-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            <EditableText
              contentKey="hero.ctaText"
              value={config.ctaText}
            />
          </a>
        </div>

        {/* Rental trust line */}
        <p className="mt-6 text-xs text-white/60">
          {theme.market} &middot; {theme.supportLine}
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanListingSpotlightSection
// ---------------------------------------------------------------------------
// Rental cards with monthly price "/month" display, "Available Now" badge.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function SakanListingSpotlightSection({
  config,
  theme,
}: {
  config: ListingSpotlightConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <FreshTag>{config.eyebrow}</FreshTag>
            <FreshHeading tag="h2" theme={theme} className="mt-2 text-4xl">
              {config.title}
            </FreshHeading>
          </div>
          <a
            href="/rentals"
            className="shrink-0 text-sm font-semibold text-teal-600 hover:underline"
          >
            Browse all rentals →
          </a>
        </div>

        <EditableText
          as="p"
          className="mt-3 max-w-xl text-base leading-7 text-slate-500"
          contentKey="listings.description"
          value={config.description}
        />

        {/* Rental listing cards — display-only */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-teal-50">
                <div className="flex h-full w-full items-center justify-center text-xs text-teal-400">
                  {item.imageHint || "Property image"}
                </div>
                <div className="absolute left-3 top-3">
                  <AvailableBadge />
                </div>
              </div>

              <div className="p-4">
                {/* Monthly price */}
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-slate-800">
                    {item.price}
                  </p>
                  <p className="text-sm font-medium text-teal-600">/month</p>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{item.location}</p>
                {item.specs && (
                  <p className="mt-2 text-xs text-slate-400">{item.specs}</p>
                )}
                <a
                  href="#apply"
                  className="mt-4 block w-full rounded-lg bg-teal-600 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanMarketStatsSection
// ---------------------------------------------------------------------------
// Teal stat bar — rental market numbers.
// ---------------------------------------------------------------------------

export function SakanMarketStatsSection({
  config,
  theme,
}: {
  config: MarketStatsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="border-y border-teal-100 bg-teal-600 px-6 py-10 md:px-12"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid divide-y divide-white/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {config.items.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 px-6 py-8 text-center sm:py-6"
            >
              <p
                className="text-4xl font-extrabold text-white md:text-5xl"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {stat.value}
              </p>
              <p className="text-sm font-medium text-white/75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanStoryGridSection
// ---------------------------------------------------------------------------
// Renter-friendly about section — clean two-column split.
// ---------------------------------------------------------------------------

export function SakanStoryGridSection({
  config,
  theme,
}: {
  config: StoryGridConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-slate-50 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <FreshTag>{config.eyebrow}</FreshTag>
          <FreshHeading tag="h2" theme={theme} className="mt-2 text-4xl md:text-5xl">
            <EditableText
              contentKey="story.title"
              value={config.title}
            />
          </FreshHeading>
          <EditableText
            as="p"
            className="mt-4 text-base leading-8 text-slate-500 md:text-lg"
            contentKey="story.description"
            value={config.description}
          />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-4 h-0.5 w-8 rounded-full bg-teal-400" />
              <p
                className="text-sm font-semibold text-slate-800"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanCtaBandSection
// ---------------------------------------------------------------------------
// Renter call-to-action — "Start your search" energy.
// ---------------------------------------------------------------------------

export function SakanCtaBandSection({
  config,
  theme,
}: {
  config: CtaBandConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-slate-800 px-6 py-16 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-4xl text-center">
        <EditableText
          as="h2"
          className="text-4xl font-extrabold leading-tight text-white md:text-5xl"
          contentKey="cta.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />
        <EditableText
          as="p"
          className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400"
          contentKey="cta.body"
          value={config.body}
        />
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <FreshButton href={config.primaryHref}>{config.primaryText}</FreshButton>
          <FreshButton href={config.secondaryHref} variant="ghost">
            {config.secondaryText}
          </FreshButton>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanServiceHighlightsSection
// ---------------------------------------------------------------------------
// Rental process steps: Search → Apply → Move In.
// Numbered step cards with teal accent.
// ---------------------------------------------------------------------------

export function SakanServiceHighlightsSection({
  config,
  theme,
}: {
  config: ServiceHighlightsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-teal-50 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <FreshTag>{config.eyebrow}</FreshTag>
          <FreshHeading tag="h2" theme={theme} className="mt-2 text-4xl md:text-5xl">
            {config.title}
          </FreshHeading>
          <EditableText
            as="p"
            className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-500"
            contentKey="services.description"
            value={config.description}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-teal-100 bg-white p-6 shadow-sm"
            >
              {/* Step number */}
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-xl">{item.icon}</span>
              </div>
              <p
                className="font-semibold text-slate-800"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                {item.description}
              </p>

              {/* Arrow connector (not last item) */}
              {i < config.items.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-teal-300 lg:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanWhyChooseUsSection
// ---------------------------------------------------------------------------
// Tenant-focused trust signals — teal accent cards.
// ---------------------------------------------------------------------------

export function SakanWhyChooseUsSection({
  config,
  theme,
}: {
  config: WhyChooseUsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <FreshTag>{config.eyebrow}</FreshTag>
          <FreshHeading tag="h2" theme={theme} className="mt-2 text-4xl md:text-5xl">
            {config.title}
          </FreshHeading>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border-l-4 border-teal-500 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 text-2xl">{item.icon}</div>
              <p
                className="text-3xl font-extrabold text-teal-600"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.stat}
              </p>
              <p className="mt-1 font-semibold text-slate-800">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanPropertyGridSection
// ---------------------------------------------------------------------------
// Rental property grid with monthly price and availability.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function SakanPropertyGridSection({
  config,
  theme,
}: {
  config: PropertyGridConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <FreshTag>{config.eyebrow}</FreshTag>
            <FreshHeading tag="h2" theme={theme} className="mt-2 text-4xl">
              {config.title}
            </FreshHeading>
          </div>
          {config.ctaHref && config.ctaText && (
            <a
              href={config.ctaHref}
              className="hidden text-sm font-semibold text-teal-600 hover:underline sm:block"
            >
              {config.ctaText} →
            </a>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 overflow-hidden bg-teal-50">
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover"
                    src={item.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-teal-400">
                    No image
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <AvailableBadge />
                </div>
              </div>
              <div className="p-4">
                {item.price && (
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold text-slate-800">
                      {item.price}
                    </p>
                    <p className="text-xs font-medium text-teal-600">/month</p>
                  </div>
                )}
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{item.location}</p>
                {item.specs && (
                  <p className="mt-1.5 text-xs text-slate-400">{item.specs}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {config.ctaHref && config.ctaText && (
          <div className="mt-8 sm:hidden">
            <a
              href={config.ctaHref}
              className="text-sm font-semibold text-teal-600 hover:underline"
            >
              {config.ctaText} →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanTestimonialStripSection
// ---------------------------------------------------------------------------
// Tenant testimonials — clean white cards, teal accents.
// ---------------------------------------------------------------------------

export function SakanTestimonialStripSection({
  config,
  theme,
}: {
  config: TestimonialStripConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-12 md:px-12"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 h-0.5 w-8 rounded-full bg-teal-400" />
              <p className="text-sm italic leading-7 text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
                  {t.speaker.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {t.speaker}
                  </p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SakanHeroSearchSection
// ---------------------------------------------------------------------------
// Listings-page hero with rental-focused search: type, location, price range.
// ---------------------------------------------------------------------------

export function SakanHeroSearchSection({
  config,
  theme,
}: {
  config: HeroSearchConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="px-6 py-16 md:px-12 md:py-24"
      style={{
        ...shell(theme),
        background: "linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <EditableText
          as="h1"
          className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl"
          contentKey="hero.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />
        <EditableText
          as="p"
          className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/80"
          contentKey="hero.subtitle"
          value={config.subtitle}
        />

        {/* Rental search bar with location selector */}
        <div className="mx-auto mt-8 overflow-hidden rounded-xl bg-white shadow-lg sm:flex">
          <select
            aria-label="Select location"
            className="w-full border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700 focus:outline-none sm:w-auto sm:border-b-0 sm:border-r"
          >
            {config.locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <select
            aria-label="Property type"
            className="w-full border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700 focus:outline-none sm:w-auto sm:border-b-0 sm:border-r"
          >
            <option value="">Any type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
          </select>
          <div className="flex-1" />
          <a
            href={config.ctaHref}
            className="block w-full bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 sm:w-auto"
          >
            <EditableText
              contentKey="hero.ctaText"
              value={config.ctaText}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
