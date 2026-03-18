import type { ReactNode } from "react";

import type { RenderMode } from "../types";
import { EditableText } from "./editing-primitives";
import { draftEditableClass } from "./section-utils";

export type ThemeConfig = {
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  headingFontFamily: string;
  logo: string;
  market: string;
  supportLine: string;
};

export type HeroBannerConfig = {
  ctaHref: string;
  ctaText: string;
  eyebrow: string;
  subtitle: string;
  title: string;
};

export type MarketStatConfig = {
  label: string;
  value: string;
};

export type MarketStatsConfig = {
  items: MarketStatConfig[];
};

export type StoryBlockConfig = {
  body: string;
  title: string;
};

export type StoryGridConfig = {
  description: string;
  eyebrow: string;
  items: StoryBlockConfig[];
  title: string;
};

export type ListingSpotlightItem = {
  imageHint: string;
  location: string;
  price: string;
  specs: string;
  title: string;
};

export type ListingSpotlightConfig = {
  description: string;
  eyebrow: string;
  items: ListingSpotlightItem[];
  title: string;
};

export type TestimonialConfig = {
  quote: string;
  role: string;
  speaker: string;
};

export type TestimonialStripConfig = {
  items: TestimonialConfig[];
};

export type CtaBandConfig = {
  body: string;
  primaryHref: string;
  primaryText: string;
  secondaryHref: string;
  secondaryText: string;
  title: string;
};

export type HomeSectionConfig =
  | HeroBannerConfig
  | MarketStatsConfig
  | StoryGridConfig
  | ListingSpotlightConfig
  | TestimonialStripConfig
  | CtaBandConfig;

function shell(theme: ThemeConfig) {
  return {
    backgroundColor: theme.backgroundColor,
    fontFamily: theme.fontFamily,
  };
}

function Eyebrow({
  children,
  tone = "neutral",
}: {
  children: string;
  tone?: "neutral" | "primary" | "accent" | "success";
}) {
  const tones = {
    neutral:
      "border-[color:var(--border)] bg-white/70 text-slate-700 dark:bg-slate-800/70 dark:text-slate-300",
    primary:
      "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-200",
    accent:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-white/82 shadow-[var(--shadow-card)] backdrop-blur-sm dark:bg-slate-800/82 ${className}`}
    >
      {children}
    </div>
  );
}

function ActionButton({
  children,
  href,
  variant = "primary",
}: {
  children: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "inverse";
}) {
  const variants = {
    primary:
      "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-[0_18px_36px_rgba(15,118,110,0.24)]",
    secondary:
      "border border-[color:var(--border)] bg-white/90 text-[color:var(--foreground)] dark:bg-slate-800/90",
    ghost: "bg-transparent text-[color:var(--foreground)]",
    inverse:
      "bg-[color:var(--surface-inverse)] text-white shadow-[0_18px_36px_rgba(16,32,51,0.22)]",
  };

  return (
    <a
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-200 ${variants[variant]}`}
      href={href}
    >
      {children}
    </a>
  );
}

function SectionHeading({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm uppercase tracking-[0.32em] text-[color:var(--muted)]">
        {eyebrow}
      </p>
      <h2 className="font-serif text-4xl text-[color:var(--foreground)] md:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-8 text-[color:var(--muted-foreground)] md:text-lg">
        {description}
      </p>
    </div>
  );
}

export function HeroBannerSection({
  config,
  theme,
}: {
  config: HeroBannerConfig;
  theme: ThemeConfig;
}) {
  return (
    <section className="px-6 py-8 md:px-10 md:py-10" style={shell(theme)}>
      <span className="bg-destructive p-4 rounded-full text-slate-950 dark:text-white">
        adbbsadsandsadsa
      </span>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <Eyebrow tone="primary">{config.eyebrow}</Eyebrow>
          <EditableText
            as="h1"
            className="mt-6 max-w-4xl text-5xl leading-[0.92] text-slate-950 dark:text-white md:text-7xl"
            contentKey="hero.title"
            style={{ fontFamily: theme.headingFontFamily }}
            value={config.title}
          />
          <EditableText
            as="p"
            className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400 md:text-xl"
            contentKey="hero.subtitle"
            value={config.subtitle}
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionButton href={config.ctaHref}>{config.ctaText}</ActionButton>
            <ActionButton href="#featured-listings" variant="secondary">
              See featured inventory
            </ActionButton>
          </div>
        </div>

        <Surface className="overflow-hidden bg-[color:var(--surface-inverse)] text-white">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-teal-200">
              <span>{theme.logo}</span>
              <span>{theme.market}</span>
            </div>

            <div className="mt-8 rounded-[calc(var(--radius-lg)-0.35rem)] bg-white/8 p-5 ring-1 ring-white/10">
              <p className="text-sm text-slate-300">Signature positioning</p>
              <h2
                className="mt-3 text-3xl leading-tight text-white md:text-4xl"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                Listings, trust, and lead capture presented in one polished
                flow.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                This first template is designed for companies that need a
                premium-looking public site without losing consistency across
                sections, mobile layouts, or calls to action.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-[calc(var(--radius-lg)-0.35rem)] border border-white/10 bg-white/6 px-5 py-4">
              <div>
                <p className="text-sm text-slate-300">Live response line</p>
                <p className="mt-1 text-lg font-medium text-white">
                  {theme.supportLine}
                </p>
              </div>
              <Eyebrow tone="success">Available now</Eyebrow>
            </div>
          </div>
        </Surface>
      </div>
    </section>
  );
}

export function MarketStatsSection({
  config,
  theme,
}: {
  config: MarketStatsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section className="px-6 pb-4 md:px-10" style={shell(theme)}>
      <div className="grid gap-4 md:grid-cols-3">
        {config.items.map((item) => (
          <Surface key={item.label} className="bg-white/88 dark:bg-slate-800/88">
            <div className="px-6 py-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p
                className="mt-3 text-4xl text-slate-950 dark:text-white"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.value}
              </p>
            </div>
          </Surface>
        ))}
      </div>
    </section>
  );
}

export function StoryGridSection({
  config,
  theme,
  renderMode = "live",
}: {
  config: StoryGridConfig;
  theme: ThemeConfig;
  renderMode?: RenderMode;
}) {
  return (
    <section
      className={`px-6 py-10 md:px-10 md:py-14 ${draftEditableClass(renderMode)}`}
      style={shell(theme)}
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.32em] text-[color:var(--muted)]">
          {config.eyebrow}
        </p>
        <EditableText
          as="h2"
          className="font-serif text-4xl text-[color:var(--foreground)] md:text-5xl"
          contentKey="story.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />
        <EditableText
          as="p"
          className="max-w-2xl text-base leading-8 text-[color:var(--muted-foreground)] md:text-lg"
          contentKey="story.description"
          value={config.description}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {config.items.map((item) => (
          <Surface key={item.title} className="bg-white dark:bg-slate-900">
            <div className="px-6 py-6">
              <div
                className="h-12 w-12 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,118,110,1) 0%, rgba(20,184,166,0.72) 100%)",
                }}
              />
              <h3
                className="mt-5 text-2xl text-slate-950 dark:text-white"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">
                {item.body}
              </p>
            </div>
          </Surface>
        ))}
      </div>
    </section>
  );
}

export function ListingSpotlightSection({
  config,
  theme,
}: {
  config: ListingSpotlightConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="px-6 py-10 md:px-10 md:py-14"
      id="featured-listings"
      style={shell(theme)}
    >
      <SectionHeading
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {config.items.map((item) => (
          <Surface key={item.title} className="overflow-hidden bg-white dark:bg-slate-900">
            <div className="h-56 bg-[linear-gradient(135deg,#dbeafe_0%,#fde68a_50%,#99f6e4_100%)] dark:bg-[linear-gradient(135deg,#1e3a5f_0%,#78350f_50%,#134e4a_100%)] p-5">
              <div className="flex h-full items-end rounded-[calc(var(--radius-md)-0.25rem)] border border-white/60 bg-white/45 p-4 backdrop-blur-sm dark:border-white/20 dark:bg-slate-800/45">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-600 dark:text-slate-400">
                  {item.imageHint}
                </p>
              </div>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {item.location}
              </p>
              <h3
                className="mt-3 text-2xl text-slate-950 dark:text-white"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </h3>
              <p className="mt-3 text-base text-slate-600 dark:text-slate-400">{item.specs}</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-slate-950 dark:text-white">
                  {item.price}
                </p>
                <ActionButton href="#" variant="ghost">
                  View details
                </ActionButton>
              </div>
            </div>
          </Surface>
        ))}
      </div>
    </section>
  );
}

export function TestimonialStripSection({
  config,
  theme,
}: {
  config: TestimonialStripConfig;
  theme: ThemeConfig;
}) {
  return (
    <section className="px-6 py-10 md:px-10 md:py-14" style={shell(theme)}>
      <div className="grid gap-5 lg:grid-cols-3">
        {config.items.map((item) => (
          <Surface
            key={`${item.speaker}-${item.role}`}
            className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#1e293b_0%,#0f172a_100%)]"
          >
            <div className="px-6 py-6">
              <Eyebrow tone="accent">Client trust</Eyebrow>
              <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
                “{item.quote}”
              </p>
              <div className="mt-6">
                <p className="font-semibold text-slate-950 dark:text-white">{item.speaker}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
              </div>
            </div>
          </Surface>
        ))}
      </div>
    </section>
  );
}

export function CtaBandSection({
  config,
  theme,
}: {
  config: CtaBandConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="px-6 py-8 pb-10 md:px-10 md:py-10 md:pb-14"
      style={shell(theme)}
    >
      <Surface className="overflow-hidden bg-[linear-gradient(145deg,#102033_0%,#0f766e_100%)] text-white">
        <div className="grid gap-6 px-6 py-7 md:px-8 md:py-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-teal-100">
              Ready to enquire
            </p>
            <EditableText
              as="h2"
              className="mt-3 text-4xl text-white"
              contentKey="cta.title"
              style={{ fontFamily: theme.headingFontFamily }}
              value={config.title}
            />
            <EditableText
              as="p"
              className="mt-4 max-w-2xl text-base leading-7 text-slate-200"
              contentKey="cta.body"
              value={config.body}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ActionButton href={config.primaryHref} variant="inverse">
              {config.primaryText}
            </ActionButton>
            <ActionButton href={config.secondaryHref} variant="secondary">
              {config.secondaryText}
            </ActionButton>
          </div>
        </div>
      </Surface>
    </section>
  );
}
