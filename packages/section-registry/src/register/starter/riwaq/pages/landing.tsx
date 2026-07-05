"use client";

import type { CSSProperties } from "react";
import {
  BarChart3,
  Building2,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { EditableText } from "../../../../sections/editing-primitives";
import { useRiwaqPage } from "../hooks/use-riwaq-page";
import {
  joinClasses,
  resolveMenuPillClass,
  resolveRiwaqRadiusClass,
} from "../ui/style";
import { RiwaqTemplateAnchor } from "../ui/template-anchor";

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";
const fallbackDetailImage =
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80";

export function RiwaqLandingPage() {
  const ctx = useRiwaqPage();
  const preset = ctx.ui.preset;
  const companyName = ctx.tenant?.companyName ?? "Riwaq";
  const market = ctx.tenant?.market ?? ctx.content("contact.address", "Lagos");
  const heroImage = ctx.content("media.heroImage", fallbackHeroImage);
  const detailImage = ctx.content("media.detailImage", fallbackDetailImage);
  const showHero = ctx.sectionVisible("hero_banner");
  const showMetrics = ctx.sectionVisible("market_stats");
  const showStory = ctx.sectionVisible("story_grid");
  const showRoadmap = ctx.sectionVisible("riwaq_roadmap_timeline");
  const showContact = ctx.sectionVisible("contact_section");
  const showCta = ctx.sectionVisible("cta_band");
  const storyRoadmapGridClassName = joinClasses(
    "mx-auto grid max-w-7xl",
    preset.spacing.sectionGap,
    showStory &&
      showRoadmap &&
      "lg:grid-cols-[0.88fr_1.12fr] lg:items-end",
  );
  const heroFrameClassName = joinClasses(
    "relative min-h-[44rem] overflow-hidden border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#fff)] shadow-2xl shadow-black/10",
    resolveRiwaqRadiusClass(ctx.theme.radius, "hero"),
  );
  const overlayPanelClassName = joinClasses(
    "border border-white/50 bg-white/[0.92] shadow-2xl shadow-black/[0.15] backdrop-blur",
    resolveRiwaqRadiusClass(ctx.theme.radius, "panel"),
  );
  const compactPanelClassName = joinClasses(
    "bg-white/90 text-slate-950 shadow-xl backdrop-blur",
    resolveRiwaqRadiusClass(ctx.theme.radius, "panel"),
  );
  const searchModeClassName = joinClasses(
    "mt-4 grid grid-cols-3 gap-1 border border-slate-200/80 bg-slate-100/80 p-1 text-center text-xs font-semibold text-slate-500",
    resolveRiwaqRadiusClass(ctx.theme.radius, "panel"),
  );
  const filterRowClassName = joinClasses(
    "flex items-center gap-3 border border-slate-200/90 bg-white/[0.92] px-3 py-3 shadow-sm shadow-slate-950/[0.04]",
    resolveRiwaqRadiusClass(ctx.theme.radius, "panel"),
  );
  const heroImageStyle = {
    backgroundImage: `linear-gradient(180deg, rgb(8 9 10 / 0.06), color-mix(in srgb, var(--pk-primary,#522C1F) 64%, transparent)), url("${heroImage}")`,
  } satisfies CSSProperties;
  const detailImageStyle = {
    backgroundImage: `url("${detailImage}")`,
  } satisfies CSSProperties;
  const metrics = [
    {
      label: ctx.content("marketStats.stat1Label", "Projects documented"),
      labelKey: "marketStats.stat1Label",
      value: ctx.content("marketStats.stat1Value", "18"),
      valueKey: "marketStats.stat1Value",
    },
    {
      label: ctx.content("marketStats.stat2Label", "Active communities"),
      labelKey: "marketStats.stat2Label",
      value: ctx.content("marketStats.stat2Value", "6"),
      valueKey: "marketStats.stat2Value",
    },
    {
      label: ctx.content("marketStats.stat3Label", "Years operating"),
      labelKey: "marketStats.stat3Label",
      value: ctx.content("marketStats.stat3Value", "9"),
      valueKey: "marketStats.stat3Value",
    },
  ];

  return (
    <main
      className="bg-[color:var(--pk-background,#ececec)] text-[color:var(--pk-foreground,#08090a)]"
      data-page-key={ctx.page.pageKey ?? "home"}
    >
      {showHero ? (
        <section className={joinClasses(preset.spacing.containerX, "py-6")}>
          <div
            className={joinClasses(
              "mx-auto grid min-h-[82svh] max-w-7xl lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)]",
              preset.spacing.gridGap,
            )}
          >
            <div className="flex flex-col justify-center py-12 md:py-16">
              <div className="inline-flex w-fit items-center rounded-full border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#fff)] px-3 py-1 text-xs font-medium text-[color:var(--pk-muted-foreground,#64748b)]">
                <EditableText
                  contentKey="hero.eyebrow"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "hero.eyebrow",
                    "Discover your ideal property",
                  )}
                />
              </div>
              <EditableText
                as="h1"
                className="mt-6 block max-w-3xl text-5xl font-semibold leading-[1.02] text-[color:var(--pk-foreground,#0f172a)] [font-family:var(--pk-font-heading)] md:text-6xl lg:text-7xl"
                contentKey="hero.title"
                display="block"
                onCommit={ctx.commitContent}
                value={ctx.content(
                  "hero.title",
                  "Find spaces that feel ready for your next chapter.",
                )}
              />
              <EditableText
                as="p"
                className="mt-6 block max-w-xl text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)] md:text-lg"
                contentKey="hero.subtitle"
                display="block"
                onCommit={ctx.commitContent}
                value={ctx.content(
                  "hero.subtitle",
                  "Search calm homes, compare trusted projects, and see the delivery history behind each opportunity before you enquire.",
                )}
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <RiwaqTemplateAnchor
                  className={ctx.ui.button({
                    className: "px-5",
                    intent: "primary",
                    size: "lg",
                  })}
                  page="contact"
                >
                  <EditableText
                    contentKey="hero.ctaText"
                    onCommit={ctx.commitContent}
                    value={ctx.content("hero.ctaText", "Start your search")}
                  />
                </RiwaqTemplateAnchor>
                <RiwaqTemplateAnchor
                  className={ctx.ui.button({
                    className: "px-5",
                    intent: "outline",
                    size: "lg",
                  })}
                  page="roadmap"
                >
                  <EditableText
                    contentKey="hero.secondaryCtaText"
                    onCommit={ctx.commitContent}
                    value={ctx.content(
                      "hero.secondaryCtaText",
                      "View project history",
                    )}
                  />
                </RiwaqTemplateAnchor>
              </div>
            </div>

            <div className={heroFrameClassName}>
              <div
                aria-label={`${companyName} featured property`}
                className="absolute inset-0 bg-cover bg-center"
                role="img"
                style={heroImageStyle}
              />
              <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
                <div
                  className={resolveMenuPillClass({
                    emphasis: "brand",
                    menuAccent: ctx.theme.menuAccent,
                    menuStyle: ctx.theme.menuStyle,
                  })}
                >
                  {companyName}
                </div>
                <div
                  className={resolveMenuPillClass({
                    emphasis: "market",
                    menuAccent: ctx.theme.menuAccent,
                    menuStyle: ctx.theme.menuStyle,
                  })}
                >
                  {market}
                </div>
              </div>
              <div
                className={joinClasses(
                  "absolute right-5 top-24 hidden max-w-[12rem] border border-white/35 bg-slate-950/[0.72] p-3 text-white shadow-2xl shadow-black/[0.24] backdrop-blur-xl xl:block",
                  resolveRiwaqRadiusClass(ctx.theme.radius, "panel"),
                )}
              >
                <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase text-white/60">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-[color:var(--pk-primary,#f97316)] shadow-[0_0_0_4px_rgb(255_255_255_/_0.12)]"
                  />
                  <EditableText
                    contentKey="hero.badgeEyebrow"
                    onCommit={ctx.commitContent}
                    value={ctx.content("hero.badgeEyebrow", "Curated match")}
                  />
                </div>
                <EditableText
                  as="p"
                  className="mt-3 block text-sm font-semibold leading-5"
                  contentKey="hero.badgeTitle"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "hero.badgeTitle",
                    `Prime homes in ${market}`,
                  )}
                />
                <EditableText
                  as="p"
                  className="mt-2 block text-xs text-white/60"
                  contentKey="hero.badgeMeta"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content("hero.badgeMeta", "Updated weekly")}
                />
              </div>
              <div
                className={joinClasses(
                  "absolute left-5 right-5 top-20 p-4 text-slate-950 md:right-auto md:w-[22rem] xl:w-[24rem]",
                  overlayPanelClassName,
                )}
              >
                <p className="text-xs font-medium uppercase text-slate-500">
                  <EditableText
                    contentKey="hero.searchEyebrow"
                    onCommit={ctx.commitContent}
                    value={ctx.content("hero.searchEyebrow", "Discover")}
                  />
                </p>
                <EditableText
                  as="p"
                  className="mt-2 block text-xl font-semibold leading-tight"
                  contentKey="hero.searchTitle"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "hero.searchTitle",
                    "Your ideal property, filtered for the way you want to live.",
                  )}
                />
                <div className={searchModeClassName}>
                  {[
                    ["hero.searchMode1", "Rent"],
                    ["hero.searchMode2", "Buy"],
                    ["hero.searchMode3", "Short let"],
                  ].map(([modeKey, modeFallback], index) => (
                    <span
                      className={
                        index === 0
                          ? joinClasses(
                              "bg-[color:var(--pk-primary,#0f172a)] px-2 py-2 text-[color:var(--pk-primary-foreground,#fff)] shadow-sm",
                              resolveRiwaqRadiusClass(ctx.theme.radius, "pill"),
                            )
                          : joinClasses(
                              "px-2 py-2",
                              resolveRiwaqRadiusClass(ctx.theme.radius, "pill"),
                            )
                      }
                      key={modeKey}
                    >
                      <EditableText
                        contentKey={modeKey}
                        onCommit={ctx.commitContent}
                        value={ctx.content(modeKey, modeFallback)}
                      />
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid gap-2">
                  {[
                    [
                      "location",
                      "hero.searchLocationLabel",
                      "Location",
                      "hero.searchLocationValue",
                      market,
                    ],
                    [
                      "home",
                      "hero.searchTypeLabel",
                      "Property type",
                      "hero.searchTypeValue",
                      "Apartment",
                    ],
                    [
                      "budget",
                      "hero.searchBudgetLabel",
                      "Budget",
                      "hero.searchBudgetValue",
                      "Flexible",
                    ],
                  ].map(
                    ([
                      iconType,
                      labelKey,
                      labelFallback,
                      valueKey,
                      valueFallback,
                    ]) => {
                      const SearchIcon =
                        iconType === "location"
                          ? MapPin
                          : iconType === "home"
                            ? Building2
                            : BarChart3;

                      return (
                        <div
                          className={filterRowClassName}
                          key={labelKey}
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-inner shadow-white/70">
                            <SearchIcon aria-hidden="true" className="size-4" />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <EditableText
                              as="span"
                              className="text-[0.68rem] font-semibold uppercase text-slate-500"
                              contentKey={labelKey}
                              onCommit={ctx.commitContent}
                              value={ctx.content(labelKey, labelFallback)}
                            />
                            <EditableText
                              as="span"
                              className="mt-0.5 min-w-0 truncate text-sm font-semibold text-slate-950"
                              contentKey={valueKey}
                              onCommit={ctx.commitContent}
                              value={ctx.content(valueKey, valueFallback)}
                            />
                          </span>
                          <ChevronRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-slate-400"
                          />
                        </div>
                      );
                    },
                  )}
                </div>
                <RiwaqTemplateAnchor
                  className={ctx.ui.button({
                    className: "mt-4 w-full",
                    intent: "primary",
                    size: "lg",
                  })}
                  page="contact"
                >
                  <EditableText
                    contentKey="hero.searchButton"
                    onCommit={ctx.commitContent}
                    value={ctx.content("hero.searchButton", "Start search")}
                  />
                </RiwaqTemplateAnchor>
              </div>
              <div className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-[1fr_auto]">
                <div className={joinClasses("p-4", compactPanelClassName)}>
                  <p className="text-xs font-medium text-slate-500">
                    <EditableText
                      contentKey="story.cardEyebrow"
                      onCommit={ctx.commitContent}
                      value={ctx.content(
                        "story.cardEyebrow",
                        "Featured delivery",
                      )}
                    />
                  </p>
                  <EditableText
                    as="p"
                    className="mt-1 block text-lg font-semibold"
                    contentKey="story.heading"
                    display="block"
                    onCommit={ctx.commitContent}
                    value={ctx.content(
                      "story.heading",
                      "A calm record of progress.",
                    )}
                  />
                  <EditableText
                    as="p"
                    className="mt-2 block line-clamp-2 text-sm leading-6 text-slate-600"
                    contentKey="story.body"
                    display="block"
                    onCommit={ctx.commitContent}
                    value={ctx.content(
                      "story.body",
                      "Show visitors what has been launched, improved, handed over, and planned across time.",
                    )}
                  />
                </div>
                <div
                  aria-label={`${companyName} interior detail`}
                  className={joinClasses(
                    "hidden size-32 bg-cover bg-center shadow-xl md:block",
                    resolveRiwaqRadiusClass(ctx.theme.radius, "panel"),
                  )}
                  role="img"
                  style={detailImageStyle}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showMetrics ? (
        <section className={joinClasses(preset.spacing.containerX, "pb-8")}>
          <div
            className={joinClasses(
              "mx-auto grid max-w-7xl md:grid-cols-3",
              preset.spacing.gridGap,
            )}
          >
            {metrics.map((metric) => (
              <div
                className={ctx.ui.surface({
                  className: "px-5 py-4",
                })}
                key={metric.label}
              >
                <EditableText
                  as="p"
                  className="block text-3xl font-semibold text-[color:var(--pk-foreground,#0f172a)]"
                  contentKey={metric.valueKey}
                  display="block"
                  onCommit={ctx.commitContent}
                  style={{
                    color: "var(--pk-chart, var(--pk-foreground,#0f172a))",
                  }}
                  value={metric.value}
                />
                <EditableText
                  as="p"
                  className="mt-1 block text-sm text-[color:var(--pk-muted-foreground,#64748b)]"
                  contentKey={metric.labelKey}
                  display="block"
                  onCommit={ctx.commitContent}
                  value={metric.label}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showStory || showRoadmap ? (
        <section
          className={joinClasses(
            preset.spacing.containerX,
            preset.spacing.sectionY,
          )}
        >
          <div className={storyRoadmapGridClassName}>
            {showStory ? (
              <div>
                <p className="text-sm font-medium text-[color:var(--pk-primary,#2563eb)]">
                  <EditableText
                    contentKey="story.eyebrow"
                    onCommit={ctx.commitContent}
                    value={ctx.content("story.eyebrow", "Why Riwaq works")}
                  />
                </p>
                <EditableText
                  as="h2"
                  className="mt-4 block max-w-2xl text-3xl font-semibold leading-tight [font-family:var(--pk-font-heading)] md:text-5xl"
                  contentKey="story.heading"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "story.heading",
                    "A calm record of progress.",
                  )}
                />
                <EditableText
                  as="p"
                  className="mt-5 block max-w-xl text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]"
                  contentKey="story.body"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "story.body",
                    "Show visitors what has been launched, improved, handed over, and planned across time.",
                  )}
                />
                <RiwaqTemplateAnchor
                  className={ctx.ui.button({
                    className: "mt-7",
                    intent: "outline",
                    size: "lg",
                  })}
                  page="roadmap"
                >
                  <EditableText
                    contentKey="story.ctaLabel"
                    onCommit={ctx.commitContent}
                    value={ctx.content("story.ctaLabel", "Read the roadmap")}
                  />
                  <ChevronRight className="size-4" />
                </RiwaqTemplateAnchor>
              </div>
            ) : null}
            {showRoadmap ? (
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["roadmap.item1.year", "roadmap.item1.title"],
                  ["roadmap.item2.year", "roadmap.item2.title"],
                  ["roadmap.item3.year", "roadmap.item3.title"],
                ].map(([yearKey, titleKey]) => (
                  <div
                    className={ctx.ui.surface({
                      className: "p-4",
                    })}
                    key={yearKey}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: "var(--pk-chart, var(--pk-primary,#2563eb))",
                      }}
                    >
                      <EditableText
                        contentKey={yearKey}
                        onCommit={ctx.commitContent}
                        value={ctx.content(yearKey, "2026")}
                      />
                    </p>
                    <EditableText
                      as="p"
                      className="mt-3 block text-sm font-semibold leading-6"
                      contentKey={titleKey}
                      display="block"
                      onCommit={ctx.commitContent}
                      value={ctx.content(titleKey, "Project milestone")}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {showContact || showCta ? (
        <section
          className={joinClasses(
            preset.spacing.containerX,
            "pb-20 md:pb-24",
          )}
        >
          <div
            className={ctx.ui.surface({
              className:
                "mx-auto grid max-w-7xl gap-8 overflow-hidden p-5 md:grid-cols-[1fr_auto] md:items-center md:p-8",
            })}
          >
            {showCta ? (
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-[color:var(--pk-primary,#2563eb)]">
                  <EditableText
                    contentKey="cta.subheading"
                    onCommit={ctx.commitContent}
                    value={ctx.content(
                      "cta.subheading",
                      "Share your goals and let the team respond with the right property, project, or partnership path.",
                    )}
                  />
                </p>
                <EditableText
                  as="h2"
                  className="mt-3 block text-3xl font-semibold leading-tight [font-family:var(--pk-font-heading)] md:text-4xl"
                  contentKey="cta.heading"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "cta.heading",
                    "Ready to discuss the next project?",
                  )}
                />
              </div>
            ) : null}
            {showContact ? (
              <div className="grid gap-3 sm:grid-cols-2 md:min-w-[28rem] md:grid-cols-1">
                <a
                  className={ctx.ui.button({
                    className: "justify-start",
                    intent: "outline",
                    size: "lg",
                  })}
                  href={`mailto:${ctx.content("contact.email", "hello@example-realestate.com")}`}
                >
                  <Mail className="size-4" />
                  <EditableText
                    contentKey="contact.email"
                    onCommit={ctx.commitContent}
                    value={ctx.content(
                      "contact.email",
                      "hello@example-realestate.com",
                    )}
                  />
                </a>
                <a
                  className={ctx.ui.button({
                    className: "justify-start",
                    intent: "secondary",
                    size: "lg",
                  })}
                  href={`tel:${ctx.content("contact.phone", "+234 800 000 0000")}`}
                >
                  <Phone className="size-4" />
                  <EditableText
                    contentKey="contact.phone"
                    onCommit={ctx.commitContent}
                    value={ctx.content("contact.phone", "+234 800 000 0000")}
                  />
                </a>
                <RiwaqTemplateAnchor
                  className={ctx.ui.button({
                    className: "justify-start sm:col-span-2 md:col-span-1",
                    intent: "primary",
                    size: "lg",
                  })}
                  page="contact"
                >
                  <EditableText
                    contentKey="cta.ctaLabel"
                    onCommit={ctx.commitContent}
                    value={ctx.content("cta.ctaLabel", "Contact us")}
                  />
                  <ChevronRight className="size-4" />
                </RiwaqTemplateAnchor>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
