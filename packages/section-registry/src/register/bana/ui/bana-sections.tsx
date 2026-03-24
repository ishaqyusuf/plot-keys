"use client";

/**
 * Bana (Developer) family section components.
 *
 * Design identity: industrial strength, project-forward developer brand.
 * Deep charcoal/steel palette with amber/orange accent. Construction progress
 * visuals, project status badges, bold sans-serif headings.
 * Grid layouts with project cards, status indicators.
 * Tone: "We build communities."
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
  AgentShowcaseConfig,
  PropertyGridConfig,
  ServiceHighlightsConfig,
  WhyChooseUsConfig,
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

/** Industrial badge label above section headings */
function IndustrialTag({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.32em] text-amber-500">
      <span
        className="inline-block h-0.5 w-5 bg-amber-500"
        aria-hidden
      />
      {children}
    </p>
  );
}

/** Bold industrial heading */
function IndustrialHeading({
  tag = "h2",
  children,
  theme,
  className = "",
}: {
  tag?: "h1" | "h2" | "h3";
  children: string;
  theme: ThemeConfig;
  className?: string;
}) {
  const Tag = tag;
  return (
    <Tag
      className={`font-extrabold leading-tight tracking-tight text-[color:var(--foreground)] ${className}`}
      style={{ fontFamily: theme.headingFontFamily }}
    >
      {children}
    </Tag>
  );
}

/** Status badge — "Under Construction" (amber) or "Ready" (green) */
function ProjectBadge({ label }: { label: "Under Construction" | "Ready" | string }) {
  const isReady = label === "Ready";
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        isReady
          ? "bg-emerald-600 text-white"
          : "bg-amber-500 text-zinc-950"
      }`}
    >
      {label}
    </span>
  );
}

/** Filled amber/charcoal button */
function BuilderButton({
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
      "bg-amber-500 text-zinc-950 font-bold shadow-[0_6px_20px_rgba(245,158,11,0.30)] hover:bg-amber-400",
    outline:
      "border-2 border-white/25 bg-transparent text-white hover:border-amber-500 hover:text-amber-500",
    ghost:
      "bg-transparent text-white/70 underline-offset-4 hover:text-white hover:underline",
  };

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-sm px-6 py-3 text-sm transition-all duration-150 ${styles[variant]}`}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// BanaHeroBannerSection
// ---------------------------------------------------------------------------
// Full-width dark charcoal hero with diagonal steel texture and amber accent.
// Two-column split: main headline left, credential panel right.
// ---------------------------------------------------------------------------

export function BanaHeroBannerSection({
  config,
  theme,
}: {
  config: HeroBannerConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="relative overflow-hidden bg-zinc-950 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      {/* Steel diagonal stripe texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #f59e0b 0px, #f59e0b 1px, transparent 1px, transparent 24px)",
        }}
        aria-hidden
      />
      {/* Amber glow top-left */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Left: main content */}
          <div>
            <IndustrialTag>
              <EditableText contentKey="hero.eyebrow" value={config.eyebrow} />
            </IndustrialTag>

            <EditableText
              as="h1"
              className="mt-5 text-5xl font-extrabold leading-[0.92] tracking-tight text-white md:text-7xl"
              contentKey="hero.title"
              style={{ fontFamily: theme.headingFontFamily }}
              value={config.title}
            />

            <EditableText
              as="p"
              className="mt-6 max-w-xl text-lg leading-8 text-zinc-400 md:text-xl"
              contentKey="hero.subtitle"
              value={config.subtitle}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <BuilderButton href={config.ctaHref}>{config.ctaText}</BuilderButton>
              <BuilderButton href="#projects" variant="outline">
                View projects
              </BuilderButton>
            </div>
          </div>

          {/* Right: developer credential panel */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            {/* Logo row */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              {theme.logoUrl ? (
                <img
                  alt={theme.logo}
                  className="h-7 max-w-[140px] object-contain brightness-0 invert"
                  src={theme.logoUrl}
                />
              ) : (
                <span
                  className="text-base font-extrabold tracking-tight text-white"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {theme.logo}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {theme.market}
              </span>
            </div>

            {/* Project credential stats */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Projects delivered", value: "40+" },
                { label: "Units built", value: "3,200+" },
                { label: "Years active", value: "15+" },
                { label: "Client satisfaction", value: "98%" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-sm bg-white/6 p-3">
                  <p className="text-2xl font-extrabold text-amber-400">{stat.value}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs leading-5 text-zinc-600">{theme.supportLine}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BanaListingSpotlightSection
// ---------------------------------------------------------------------------
// Project spotlight grid with "Under Construction" / "Ready" status badges.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function BanaListingSpotlightSection({
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
            <IndustrialTag>{config.eyebrow}</IndustrialTag>
            <IndustrialHeading tag="h2" theme={theme} className="mt-3 text-4xl md:text-5xl">
              {config.title}
            </IndustrialHeading>
          </div>
          <a
            href="/projects"
            className="shrink-0 text-sm font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400"
          >
            All projects →
          </a>
        </div>

        <p className="mt-3 max-w-2xl text-base text-[color:var(--muted-foreground)]">
          {config.description}
        </p>

        {/* Project cards — dataSource items are display-only */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => {
            // Alternate badge between "Under Construction" and "Ready" for demo purposes
            const badge = i % 3 === 2 ? "Ready" : "Under Construction";
            return (
              <div
                key={i}
                className="group overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Image placeholder */}
                <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">
                    {item.imageHint || "Project render"}
                  </div>
                  {/* Construction progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700/50">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: badge === "Ready" ? "100%" : `${45 + i * 18}%` }}
                    />
                  </div>
                  <div className="absolute left-3 top-3">
                    <ProjectBadge label={badge} />
                  </div>
                </div>

                <div className="p-5">
                  <p
                    className="text-lg font-extrabold leading-tight text-[color:var(--foreground)]"
                    style={{ fontFamily: theme.headingFontFamily }}
                  >
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                    {item.location}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xl font-extrabold text-amber-500">{item.price}</p>
                    {item.specs && (
                      <p className="text-xs text-[color:var(--muted-foreground)]">{item.specs}</p>
                    )}
                  </div>
                  <a
                    href="#contact"
                    className="mt-4 block w-full rounded-sm border border-amber-500/40 py-2 text-center text-xs font-bold uppercase tracking-wider text-amber-500 transition-colors hover:border-amber-500 hover:bg-amber-500/10"
                  >
                    Enquire about project
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BanaMarketStatsSection
// ---------------------------------------------------------------------------
// Dark steel stat band — large amber numbers on charcoal background.
// ---------------------------------------------------------------------------

export function BanaMarketStatsSection({
  config,
  theme,
}: {
  config: MarketStatsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-zinc-900 px-6 py-12 md:px-12"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {config.items.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 px-6 py-8 text-center sm:py-6"
            >
              <p
                className="text-4xl font-extrabold tracking-tight text-amber-400 md:text-5xl"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {stat.value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BanaStoryGridSection
// ---------------------------------------------------------------------------
// Brand story: two-column layout — bold headline + description left, feature
// cards with amber accent bars right.
// ---------------------------------------------------------------------------

export function BanaStoryGridSection({
  config,
  theme,
}: {
  config: StoryGridConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
          {/* Left: headline + description */}
          <div>
            <IndustrialTag>{config.eyebrow}</IndustrialTag>
            <IndustrialHeading tag="h2" theme={theme} className="mt-3 text-4xl md:text-5xl">
              {config.title}
            </IndustrialHeading>
            <EditableText
              as="p"
              className="mt-5 text-base leading-8 text-[color:var(--muted-foreground)] md:text-lg"
              contentKey="story.description"
              value={config.description}
            />

            {/* Construction milestone visual */}
            <div className="mt-8 space-y-3">
              {["Foundation", "Structure", "Finishing", "Handover"].map(
                (phase, i) => (
                  <div key={phase} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-amber-500/15 text-[10px] font-bold text-amber-500">
                      {i + 1}
                    </div>
                    <div className="flex-1 overflow-hidden rounded-sm bg-zinc-200 dark:bg-zinc-700/50">
                      <div
                        className="h-1.5 rounded-sm bg-amber-500"
                        style={{ width: `${[100, 100, 75, 45][i]}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[10px] font-bold text-zinc-500">
                      {["Done", "Done", "75%", "45%"][i]}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Right: feature cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {config.items.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-5"
              >
                <div className="mt-0.5 h-full w-1 shrink-0 rounded-full bg-amber-500" />
                <div>
                  <h3
                    className="text-sm font-bold text-[color:var(--foreground)]"
                    style={{ fontFamily: theme.headingFontFamily }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BanaCtaBandSection
// ---------------------------------------------------------------------------
// Full-width charcoal band with amber CTA button and bold headline.
// ---------------------------------------------------------------------------

export function BanaCtaBandSection({
  config,
  theme,
}: {
  config: CtaBandConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="relative overflow-hidden bg-zinc-950 px-6 py-16 md:px-12 md:py-20"
      style={shell(theme)}
    >
      {/* Diagonal stripe texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #f59e0b 0px, #f59e0b 1px, transparent 1px, transparent 28px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-6 h-1 w-16 rounded-full bg-amber-500" />
        <EditableText
          as="h2"
          className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl"
          contentKey="cta.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />
        <EditableText
          as="p"
          className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400"
          contentKey="cta.body"
          value={config.body}
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <BuilderButton href={config.primaryHref}>{config.primaryText}</BuilderButton>
          <BuilderButton href={config.secondaryHref} variant="ghost">
            {config.secondaryText}
          </BuilderButton>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BanaAgentShowcaseSection
// ---------------------------------------------------------------------------
// Team grid — project managers and site leads. 4-column, card with role badge.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function BanaAgentShowcaseSection({
  config,
  theme,
}: {
  config: AgentShowcaseConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <IndustrialTag>{config.eyebrow}</IndustrialTag>
          <IndustrialHeading tag="h2" theme={theme} className="mt-3 text-4xl md:text-5xl">
            {config.title}
          </IndustrialHeading>
          {config.description && (
            <p className="mt-3 max-w-xl text-base text-[color:var(--muted-foreground)]">
              {config.description}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {config.items.map((agent) => (
            <div
              key={agent.id}
              className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--card)]"
            >
              {/* Photo */}
              <div className="relative h-44 bg-zinc-100 dark:bg-zinc-800">
                {agent.photoUrl ? (
                  <img
                    alt={agent.name}
                    className="h-full w-full object-cover"
                    src={agent.photoUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-zinc-300 dark:text-zinc-600">
                    {agent.name.charAt(0)}
                  </div>
                )}
                {/* Amber bottom stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
              </div>

              <div className="p-4">
                <p
                  className="font-bold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {agent.name}
                </p>
                <p className="text-xs text-[color:var(--muted-foreground)]">{agent.role}</p>
                {agent.listings !== undefined && (
                  <p className="mt-2 text-xs font-bold text-amber-500">
                    {agent.listings} projects managed
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BanaWhyChooseUsSection
// ---------------------------------------------------------------------------
// Trust signals with stat + description — steel card with amber left border.
// ---------------------------------------------------------------------------

export function BanaWhyChooseUsSection({
  config,
  theme,
}: {
  config: WhyChooseUsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-zinc-50 px-6 py-14 dark:bg-zinc-900/40 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <IndustrialTag>{config.eyebrow}</IndustrialTag>
          <IndustrialHeading tag="h2" theme={theme} className="mt-3 text-4xl md:text-5xl">
            {config.title}
          </IndustrialHeading>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border-l-4 border-amber-500 bg-white p-5 shadow-sm dark:bg-zinc-900"
            >
              <div className="mb-2 text-2xl">{item.icon}</div>
              <p
                className="text-3xl font-extrabold text-amber-500"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.stat}
              </p>
              <p
                className="mt-1 text-sm font-bold text-[color:var(--foreground)]"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </p>
              <p className="mt-2 text-xs leading-6 text-[color:var(--muted-foreground)]">
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
// BanaPropertyGridSection
// ---------------------------------------------------------------------------
// Full property/unit grid. dataSource items are display-only.
// ---------------------------------------------------------------------------

export function BanaPropertyGridSection({
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
            <IndustrialTag>{config.eyebrow}</IndustrialTag>
            <IndustrialHeading tag="h2" theme={theme} className="mt-3 text-4xl md:text-5xl">
              {config.title}
            </IndustrialHeading>
          </div>
          {config.ctaHref && config.ctaText && (
            <a
              href={config.ctaHref}
              className="hidden text-sm font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 sm:block"
            >
              {config.ctaText} →
            </a>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                    No image
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-sm bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-950">
                  Available
                </span>
              </div>
              <div className="p-4">
                {item.price && (
                  <p className="text-xl font-extrabold text-amber-500">{item.price}</p>
                )}
                <p
                  className="mt-1 text-sm font-bold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
                  {item.location}
                </p>
                {item.specs && (
                  <p className="mt-1.5 text-xs text-[color:var(--muted-foreground)]">
                    {item.specs}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {config.ctaHref && config.ctaText && (
          <div className="mt-8 sm:hidden">
            <a
              href={config.ctaHref}
              className="text-sm font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400"
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
// BanaTestimonialStripSection
// ---------------------------------------------------------------------------
// Client testimonials — dark card with amber quotation mark and rule.
// ---------------------------------------------------------------------------

export function BanaTestimonialStripSection({
  config,
  theme,
}: {
  config: TestimonialStripConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-zinc-950 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((t, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="mb-3 text-3xl font-extrabold leading-none text-amber-500/60">
                &ldquo;
              </div>
              <p className="text-sm leading-7 text-zinc-300">{t.quote}</p>
              <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="h-8 w-1 rounded-full bg-amber-500" />
                <div>
                  <p className="text-sm font-bold text-white">{t.speaker}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
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
// BanaServiceHighlightsSection
// ---------------------------------------------------------------------------
// Construction & developer services — icon grid with amber icon containers.
// ---------------------------------------------------------------------------

export function BanaServiceHighlightsSection({
  config,
  theme,
}: {
  config: ServiceHighlightsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <IndustrialTag>{config.eyebrow}</IndustrialTag>
          <IndustrialHeading tag="h2" theme={theme} className="mt-3 text-4xl md:text-5xl">
            {config.title}
          </IndustrialHeading>
          <p className="mt-3 max-w-2xl text-base text-[color:var(--muted-foreground)]">
            {config.description}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {config.items.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-amber-500/15 text-2xl text-amber-500">
                {item.icon}
              </div>
              <div>
                <h3
                  className="text-sm font-bold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
