"use client";

/**
 * Extended section library.
 *
 * Sections beyond the base home-page set:
 * - PropertyGridSection  — Live listing grid (fetched or placeholder)
 * - AgentShowcaseSection — Agent team grid with name/role/photo
 * - ContactSection       — Company contact form with map stub
 * - FAQAccordionSection  — Expandable FAQ items
 * - NewsletterSection    — Simple newsletter signup strip
 */

import { useState, type JSX } from "react";
import type { ThemeConfig } from "./home-page";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PropertyGridItem = {
  bedrooms?: number;
  id: string;
  imageUrl?: string | null;
  location: string;
  price?: string | null;
  slug?: string;
  specs?: string | null;
  title: string;
};

export type PropertyGridConfig = {
  /** Text for the "view all" link. Omit to hide the link. */
  ctaHref?: string;
  ctaText?: string;
  description?: string;
  eyebrow: string;
  items: PropertyGridItem[];
  title: string;
};

export type AgentCardItem = {
  bio?: string;
  id: string;
  listings?: number;
  name: string;
  photoUrl?: string | null;
  role: string;
  slug?: string;
};

export type AgentShowcaseConfig = {
  description?: string;
  eyebrow: string;
  items: AgentCardItem[];
  title: string;
};

export type ContactSectionConfig = {
  address?: string;
  ctaText: string;
  email?: string;
  /**
   * API endpoint to POST the form data to.
   * If provided, the form will submit via fetch instead of the local stub handler.
   * Set to "/api/contact" in the tenant-site renderer.
   */
  formEndpoint?: string;
  /** Placeholder note shown before a real map embed is connected */
  mapPlaceholder?: string;
  phone?: string;
  /** The company subdomain — included in the POST body so the API can route the submission. */
  subdomain?: string;
  subtitle: string;
  title: string;
  whatsapp?: string;
};

export type FAQItem = {
  answer: string;
  id: string;
  question: string;
};

export type FAQAccordionConfig = {
  eyebrow?: string;
  items: FAQItem[];
  title: string;
};

export type NewsletterConfig = {
  disclaimer?: string;
  placeholder: string;
  submitText: string;
  subtitle: string;
  title: string;
};

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function shell(theme: ThemeConfig) {
  return { backgroundColor: theme.backgroundColor, fontFamily: theme.fontFamily };
}

function SectionTag({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  theme,
}: {
  children: string;
  theme: ThemeConfig;
}) {
  return (
    <h2
      className="mt-2 text-3xl font-bold text-[color:var(--foreground)] md:text-4xl"
      style={{ fontFamily: theme.headingFontFamily }}
    >
      {children}
    </h2>
  );
}

function SectionDescription({ children }: { children: string }) {
  return (
    <p className="mt-3 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// PropertyGridSection
// ---------------------------------------------------------------------------

/**
 * Displays a responsive grid of property listing cards.
 * When `items` is empty a 3-column skeleton placeholder is rendered.
 */
export function PropertyGridSection({
  config,
  theme,
}: {
  config: PropertyGridConfig;
  theme: ThemeConfig;
}): JSX.Element {
  const isEmpty = config.items.length === 0;

  return (
    <section className="px-6 py-16 md:px-10 md:py-20" style={shell(theme)}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <SectionTag>{config.eyebrow}</SectionTag>
            <SectionTitle theme={theme}>{config.title}</SectionTitle>
            {config.description && (
              <SectionDescription>{config.description}</SectionDescription>
            )}
          </div>
          {config.ctaHref && config.ctaText && (
            <a
              className="hidden shrink-0 text-sm font-medium text-[color:var(--primary)] underline-offset-4 hover:underline md:block"
              href={config.ctaHref}
            >
              {config.ctaText} →
            </a>
          )}
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isEmpty
            ? Array.from({ length: 3 }).map((_, i) => (
                // Skeleton card
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]"
                >
                  <div className="h-52 bg-[color:var(--muted)]" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-[color:var(--muted)]" />
                    <div className="h-3 w-1/2 rounded bg-[color:var(--muted)]" />
                    <div className="h-3 w-2/3 rounded bg-[color:var(--muted)]" />
                  </div>
                </div>
              ))
            : config.items.map((item) => (
                <a
                  key={item.id}
                  href={item.slug ? `/listings/${item.slug}` : "#"}
                  className="group overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-[color:var(--muted)]">
                    {item.imageUrl ? (
                      <img
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={item.imageUrl}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[color:var(--muted-foreground)]">
                        No image
                      </div>
                    )}
                    {item.price && (
                      <span
                        className="absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        {item.price}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      {item.location}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[color:var(--foreground)]">
                      {item.title}
                    </h3>
                    {item.specs && (
                      <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                        {item.specs}
                      </p>
                    )}
                  </div>
                </a>
              ))}
        </div>

        {/* Mobile CTA */}
        {config.ctaHref && config.ctaText && (
          <div className="mt-8 text-center md:hidden">
            <a
              className="text-sm font-medium text-[color:var(--primary)] underline-offset-4 hover:underline"
              href={config.ctaHref}
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
// AgentShowcaseSection
// ---------------------------------------------------------------------------

export function AgentShowcaseSection({
  config,
  theme,
}: {
  config: AgentShowcaseConfig;
  theme: ThemeConfig;
}): JSX.Element {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20" style={shell(theme)}>
      <div className="mx-auto max-w-7xl">
        <SectionTag>{config.eyebrow}</SectionTag>
        <SectionTitle theme={theme}>{config.title}</SectionTitle>
        {config.description && (
          <SectionDescription>{config.description}</SectionDescription>
        )}

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {config.items.map((agent) => (
            <a
              key={agent.id}
              href={agent.slug ? `/agents/${agent.slug}` : "#"}
              className="group flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[color:var(--border)] bg-[color:var(--muted)]">
                {agent.photoUrl ? (
                  <img
                    alt={agent.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={agent.photoUrl}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl font-bold text-[color:var(--muted-foreground)]">
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p
                  className="font-semibold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {agent.name}
                </p>
                <p className="mt-0.5 text-sm text-[color:var(--muted-foreground)]">
                  {agent.role}
                </p>
                {agent.bio && (
                  <p className="mt-2 line-clamp-2 text-xs text-[color:var(--muted-foreground)]">
                    {agent.bio}
                  </p>
                )}
                {agent.listings !== undefined && (
                  <p
                    className="mt-2 text-xs font-medium"
                    style={{ color: theme.accentColor }}
                  >
                    {agent.listings} active listings
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ContactSection
// ---------------------------------------------------------------------------

export function ContactSection({
  config,
  theme,
}: {
  config: ContactSectionConfig;
  theme: ThemeConfig;
}): JSX.Element {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20" style={shell(theme)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left — copy + contacts */}
          <div>
            <SectionTitle theme={theme}>{config.title}</SectionTitle>
            <SectionDescription>{config.subtitle}</SectionDescription>

            <ul className="mt-8 space-y-4 text-sm text-[color:var(--foreground)]">
              {config.phone && (
                <li className="flex items-center gap-3">
                  <span className="text-base">📞</span>
                  <a href={`tel:${config.phone}`} className="hover:underline">
                    {config.phone}
                  </a>
                </li>
              )}
              {config.whatsapp && (
                <li className="flex items-center gap-3">
                  <span className="text-base">💬</span>
                  <a
                    href={`https://wa.me/${config.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    WhatsApp: {config.whatsapp}
                  </a>
                </li>
              )}
              {config.email && (
                <li className="flex items-center gap-3">
                  <span className="text-base">✉️</span>
                  <a href={`mailto:${config.email}`} className="hover:underline">
                    {config.email}
                  </a>
                </li>
              )}
              {config.address && (
                <li className="flex items-start gap-3">
                  <span className="text-base">📍</span>
                  <span>{config.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Right — contact form */}
          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-8 shadow-sm">
            <ContactForm config={config} theme={theme} />
          </div>
        </div>

        {/* Map placeholder */}
        {config.mapPlaceholder && (
          <div className="mt-12 flex h-56 items-center justify-center rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--muted)] text-sm text-[color:var(--muted-foreground)]">
            {config.mapPlaceholder}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactForm({
  config,
  theme,
}: {
  config: ContactSectionConfig;
  theme: ThemeConfig;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-4xl">✅</span>
        <p
          className="mt-4 font-semibold text-[color:var(--foreground)]"
          style={{ fontFamily: theme.headingFontFamily }}
        >
          Message received
        </p>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          We'll be in touch shortly.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (config.formEndpoint) {
      setSubmitting(true);
      setError(null);
      try {
        const body = {
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? "") || undefined,
          subdomain: config.subdomain ?? "",
        };
        const res = await fetch(config.formEndpoint, {
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => null) as { error?: string } | null;
          throw new Error(payload?.error ?? "Unable to send message.");
        }
        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to send message.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitted(true);
    }
  }

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[color:var(--foreground)]">
            Name
          </label>
          <input
            required
            className="w-full rounded-lg border border-[color:var(--input)] bg-[color:var(--background)] px-3 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            placeholder="Your name"
            type="text"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[color:var(--foreground)]">
            Phone
          </label>
          <input
            className="w-full rounded-lg border border-[color:var(--input)] bg-[color:var(--background)] px-3 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            placeholder="+234..."
            type="tel"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-[color:var(--foreground)]">
          Email
        </label>
        <input
          className="w-full rounded-lg border border-[color:var(--input)] bg-[color:var(--background)] px-3 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
          placeholder="you@example.com"
          type="email"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-[color:var(--foreground)]">
          Message
        </label>
        <textarea
          className="w-full resize-none rounded-lg border border-[color:var(--input)] bg-[color:var(--background)] px-3 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
          placeholder="How can we help you?"
          rows={4}
        />
      </div>
      <button
        className="w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        disabled={submitting}
        style={{ backgroundColor: theme.accentColor }}
        type="submit"
      >
        {submitting ? "Sending…" : config.ctaText}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// FAQAccordionSection
// ---------------------------------------------------------------------------

export function FAQAccordionSection({
  config,
  theme,
}: {
  config: FAQAccordionConfig;
  theme: ThemeConfig;
}): JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="px-6 py-16 md:px-10 md:py-20" style={shell(theme)}>
      <div className="mx-auto max-w-3xl">
        {config.eyebrow && <SectionTag>{config.eyebrow}</SectionTag>}
        <SectionTitle theme={theme}>{config.title}</SectionTitle>

        <div className="mt-10 divide-y divide-[color:var(--border)]">
          {config.items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  className="flex w-full items-center justify-between py-5 text-left"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  type="button"
                >
                  <span className="pr-6 text-sm font-medium text-[color:var(--foreground)]">
                    {item.question}
                  </span>
                  <span
                    className="shrink-0 text-lg text-[color:var(--muted-foreground)] transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(45deg)" : undefined }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// NewsletterSection
// ---------------------------------------------------------------------------

export function NewsletterSection({
  config,
  theme,
}: {
  config: NewsletterConfig;
  theme: ThemeConfig;
}): JSX.Element {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      className="px-6 py-14 md:px-10"
      style={{ backgroundColor: theme.accentColor, fontFamily: theme.fontFamily }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: theme.headingFontFamily }}
        >
          {config.title}
        </h2>
        <p className="mt-3 text-base text-white/80">{config.subtitle}</p>

        {submitted ? (
          <p className="mt-8 text-lg font-semibold text-white">
            ✓ You're subscribed!
          </p>
        ) : (
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              required
              className="flex-1 rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder={config.placeholder}
              type="email"
            />
            <button
              className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ color: theme.accentColor }}
              type="submit"
            >
              {config.submitText}
            </button>
          </form>
        )}

        {config.disclaimer && (
          <p className="mt-4 text-xs text-white/60">{config.disclaimer}</p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Types — HeroSearch, WhyChooseUs, ServiceHighlights
// ---------------------------------------------------------------------------

export type HeroSearchConfig = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  locationOptions: string[];
  ctaText: string;
  ctaHref: string;
};

export type WhyChooseUsItem = {
  icon: string;
  stat: string;
  title: string;
  description: string;
};

export type WhyChooseUsConfig = {
  eyebrow: string;
  title: string;
  items: WhyChooseUsItem[];
};

export type ServiceHighlightItem = {
  title: string;
  description: string;
  icon: string;
};

export type ServiceHighlightsConfig = {
  eyebrow: string;
  title: string;
  description: string;
  items: ServiceHighlightItem[];
};

// ---------------------------------------------------------------------------
// HeroSearchSection
// ---------------------------------------------------------------------------

export function HeroSearchSection({
  config,
  theme,
}: {
  config: HeroSearchConfig;
  theme: ThemeConfig;
}): JSX.Element {
  return (
    <section
      className="px-6 py-20 md:px-10 md:py-28"
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1
          className="text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          style={{ fontFamily: theme.headingFontFamily }}
        >
          {config.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
          {config.subtitle}
        </p>

        {/* Search bar */}
        <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-white/10 p-3 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <select
              className="flex-1 rounded-lg bg-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40"
              defaultValue=""
            >
              <option className="text-gray-900" value="">
                Any Type
              </option>
              <option className="text-gray-900" value="house">
                House
              </option>
              <option className="text-gray-900" value="apartment">
                Apartment
              </option>
              <option className="text-gray-900" value="villa">
                Villa
              </option>
              <option className="text-gray-900" value="commercial">
                Commercial
              </option>
            </select>

            <input
              className="flex-1 rounded-lg bg-white/20 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder={config.searchPlaceholder}
              type="text"
            />

            <select
              className="flex-1 rounded-lg bg-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40"
              defaultValue=""
            >
              <option className="text-gray-900" value="">
                Any Price
              </option>
              <option className="text-gray-900" value="under-500k">
                Under $500K
              </option>
              <option className="text-gray-900" value="500k-1m">
                $500K-$1M
              </option>
              <option className="text-gray-900" value="1m-2m">
                $1M-$2M
              </option>
              <option className="text-gray-900" value="2m-plus">
                $2M+
              </option>
            </select>

            <a
              className="shrink-0 rounded-lg px-6 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
              href={config.ctaHref}
              style={{ backgroundColor: theme.accentColor }}
            >
              {config.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WhyChooseUsSection
// ---------------------------------------------------------------------------

export function WhyChooseUsSection({
  config,
  theme,
}: {
  config: WhyChooseUsConfig;
  theme: ThemeConfig;
}): JSX.Element {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20" style={shell(theme)}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <SectionTag>{config.eyebrow}</SectionTag>
          <SectionTitle theme={theme}>{config.title}</SectionTitle>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {config.items.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                style={{
                  backgroundColor: `${theme.accentColor}1a`,
                  color: theme.accentColor,
                }}
              >
                {item.icon}
              </div>
              <p
                className="mt-4 text-3xl font-bold"
                style={{
                  color: theme.accentColor,
                  fontFamily: theme.headingFontFamily,
                }}
              >
                {item.stat}
              </p>
              <h3 className="mt-2 text-sm font-bold text-[color:var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
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
// ServiceHighlightsSection
// ---------------------------------------------------------------------------

export function ServiceHighlightsSection({
  config,
  theme,
}: {
  config: ServiceHighlightsConfig;
  theme: ThemeConfig;
}): JSX.Element {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20" style={shell(theme)}>
      <div className="mx-auto max-w-7xl">
        <div>
          <SectionTag>{config.eyebrow}</SectionTag>
          <SectionTitle theme={theme}>{config.title}</SectionTitle>
          <SectionDescription>{config.description}</SectionDescription>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {config.items.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-[color:var(--border)] p-5 transition-shadow hover:shadow-md"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl"
                style={{
                  backgroundColor: `${theme.accentColor}1a`,
                  color: theme.accentColor,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[color:var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
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
