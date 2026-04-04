"use client";

import {
  colorSystems,
  stylePresets,
  type TemplateConfig,
  resolveWebsitePresentation,
  sectionComponents,
  type ThemeConfig,
  templateCatalog,
} from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { ButtonGroup } from "@plotkeys/ui/button-group";
import { Checkbox } from "@plotkeys/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@plotkeys/ui/tabs";
import { Separator } from "@plotkeys/ui/separator";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import { Icon } from "@plotkeys/ui/icons";
import Link from "next/link";
import { useMemo, useState } from "react";

type TemplateTier = "starter" | "plus" | "pro";

const tierOrder: TemplateTier[] = ["starter", "plus", "pro"];

function groupedTemplates() {
  return {
    starter: templateCatalog.filter((t) => t.tier === "starter"),
    plus: templateCatalog.filter((t) => t.tier === "plus"),
    pro: templateCatalog.filter((t) => t.tier === "pro"),
  };
}

export default function BuilderPreviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPageKey, setCurrentPageKey] = useState("home");

  const template = templateCatalog[currentIndex] ?? templateCatalog[0];
  const [tabTier, setTabTier] = useState<TemplateTier>(
    template?.tier ?? "starter",
  );
  const groups = useMemo(groupedTemplates, []);

  const templatePages = useMemo(
    () => (template ? getTemplatePageInventory(template.key).pages : []),
    [template],
  );

  const preview = useMemo(
    () =>
      template
        ? resolveWebsitePresentation({
            companyName: template.defaultTheme.logo,
            content: template.defaultContent,
            pageKey: currentPageKey,
            renderMode: "draft",
            subdomain: template.name.toLowerCase(),
            templateKey: template.key,
          })
        : null,
    [template, currentPageKey],
  );

  function goToTemplate(index: number) {
    const clamped =
      ((index % templateCatalog.length) + templateCatalog.length) %
      templateCatalog.length;
    setCurrentIndex(clamped);
    const target = templateCatalog[clamped];
    if (target) setTabTier(target.tier);
    setCurrentPageKey("home");
  }

  function selectTemplate(key: string) {
    const idx = templateCatalog.findIndex((t) => t.key === key);
    if (idx >= 0) {
      setCurrentIndex(idx);
      const target = templateCatalog[idx];
      if (target) setTabTier(target.tier);
      setCurrentPageKey("home");
    }
    setDropdownOpen(false);
  }

  function togglePublished(key: string) {
    setPublishedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const currentPageSlug =
    templatePages.find((p) => p.pageKey === currentPageKey)?.slug ?? "/";

  if (!template || !preview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        No templates available in the catalog.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-2 py-2 md:px-3 md:py-3">
      <div className="mx-auto grid max-w-464 gap-3 xl:grid-cols-[14rem_minmax(0,1fr)]">
        {/* ── Builder Config Sidebar (hidden on mobile) ── */}
        <aside className="hidden xl:sticky xl:top-3 xl:block xl:h-[calc(100svh-1.5rem)]">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
            <div className="border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--primary)/0.14),transparent)] px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                  Template Preview
                </p>
                <Badge variant="outline">Studio</Badge>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              {/* Template Selector */}
              <section className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Template
                </p>
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className="relative w-full rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                      type="button"
                    >
                      <span className="block text-xs text-muted-foreground">
                        Template
                      </span>
                      <span className="mt-0.5 block pr-9 text-sm font-medium text-foreground truncate">
                        {template.name}
                      </span>
                      <Badge className="mt-1.5" variant="outline">
                        {template.tier}
                      </Badge>
                      <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-72 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
                    side="right"
                  >
                    <Tabs
                      className="flex flex-col gap-2"
                      value={tabTier}
                      onValueChange={(v) => setTabTier(v as TemplateTier)}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        {tierOrder.map((tier) => (
                          <TabsTrigger
                            key={tier}
                            value={tier}
                            className="capitalize"
                          >
                            {tier}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {tierOrder.map((tier) => (
                        <TabsContent key={tier} className="mt-0" value={tier}>
                          <DropdownMenuRadioGroup
                            value={template.key}
                            onValueChange={selectTemplate}
                          >
                            <DropdownMenuGroup>
                              {groups[tier].map((t) => (
                                <DropdownMenuRadioItem
                                  key={t.key}
                                  value={t.key}
                                  className="items-start rounded-md py-2 pr-8"
                                >
                                  <div className="min-w-0">
                                    <p className="font-medium text-foreground">
                                      {t.name}
                                    </p>
                                    {t.marketingTagline && (
                                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                        {t.marketingTagline}
                                      </p>
                                    )}
                                  </div>
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuGroup>
                          </DropdownMenuRadioGroup>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </DropdownMenuContent>
                </DropdownMenu>
              </section>

              <Separator />

              {/* Style Presets */}
              <section className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Style Presets
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(stylePresets).map(([key, preset]) => (
                    <button
                      key={key}
                      className="flex h-14 items-center justify-center rounded-lg border border-border/70 transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                      type="button"
                      title={preset.displayName}
                    >
                      <span className="text-xs font-medium text-muted-foreground truncate px-2">
                        {preset.displayName}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Color Systems */}
              <section className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Color System
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(colorSystems).map(([key, system]) => (
                    <button
                      key={key}
                      className="flex flex-col items-center gap-1.5 rounded-lg border border-border/70 px-2 py-2 text-xs transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                      type="button"
                      title={system.name}
                    >
                      <div className="flex gap-1">
                        <div
                          className="size-3 rounded-full border border-border/50"
                          style={{ backgroundColor: `hsl(${system.light.primary})` }}
                        />
                        <div
                          className="size-3 rounded-full border border-border/50"
                          style={{ backgroundColor: `hsl(${system.light.secondary})` }}
                        />
                      </div>
                      <span className="truncate font-medium text-muted-foreground">
                        {system.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Preview Info */}
              <section className="flex flex-col gap-1.5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Preview Info
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">Sections</span>
                    <Badge variant="outline">
                      {preview.page.sections.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">Theme</span>
                    <span className="font-medium text-foreground">
                      {template.defaultTheme.displayName}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </aside>

        {/* ── Main Preview Section ── */}
        <section className="flex flex-col gap-3">
          {/* Header with Template Picker and Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex flex-wrap items-center gap-2">
              <ButtonGroup>
                <Button asChild size="icon" variant="outline">
                  <Link href="/builder" aria-label="Back to builder">
                    <Icon.ChevronLeft className="size-4" />
                  </Link>
                </Button>
              </ButtonGroup>

              {/* Compact Template Picker for Mobile */}
              <div className="xl:hidden">
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-2 text-sm font-semibold px-2"
                    >
                      <span className="truncate">{template.name}</span>
                      <Badge variant="outline" className="capitalize">
                        {template.tier}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-72 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
                  >
                    <Tabs
                      className="flex flex-col gap-2"
                      value={tabTier}
                      onValueChange={(v) => setTabTier(v as TemplateTier)}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        {tierOrder.map((tier) => (
                          <TabsTrigger
                            key={tier}
                            value={tier}
                            className="capitalize text-xs"
                          >
                            {tier}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {tierOrder.map((tier) => (
                        <TabsContent key={tier} className="mt-0" value={tier}>
                          <DropdownMenuRadioGroup
                            value={template.key}
                            onValueChange={selectTemplate}
                          >
                            <DropdownMenuGroup>
                              {groups[tier].map((t) => (
                                <DropdownMenuRadioItem
                                  key={t.key}
                                  value={t.key}
                                  className="items-start rounded-md py-2 pr-8"
                                >
                                  <div className="min-w-0">
                                    <p className="font-medium text-foreground">
                                      {t.name}
                                    </p>
                                    {t.marketingTagline && (
                                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                        {t.marketingTagline}
                                      </p>
                                    )}
                                  </div>
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuGroup>
                          </DropdownMenuRadioGroup>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Badge variant="outline">{preview.page.page}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <ButtonGroup>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Previous template"
                  onClick={() => goToTemplate(currentIndex - 1)}
                >
                  <Icon.ChevronLeft className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Next template"
                  onClick={() => goToTemplate(currentIndex + 1)}
                >
                  <Icon.ChevronRight className="size-4" />
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Publish checkbox row */}
          <div className="border rounded-lg border-border/70 bg-muted/30">
            <div className="flex items-center justify-between gap-4 px-4 py-2">
              <div className="flex items-center gap-3 text-sm">
                <Badge variant="outline" className="capitalize">
                  {template.tier}
                </Badge>
                <span className="font-medium text-foreground">
                  {template.name}
                </span>
              </div>
              <label
                htmlFor="preview-published-toggle"
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  id="preview-published-toggle"
                  checked={publishedKeys.has(template.key)}
                  onCheckedChange={() => togglePublished(template.key)}
                />
                <span className="text-muted-foreground">Published</span>
              </label>
            </div>
          </div>

          {/* Template preview */}
          <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-[0_30px_70px_-35px_hsl(var(--foreground)/0.45)]">
            {/* Browser bar */}
            <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-foreground/20" />
                <span className="size-2.5 rounded-full bg-foreground/20" />
                <span className="size-2.5 rounded-full bg-foreground/20" />
              </div>
              <p className="truncate text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {template.name.toLowerCase()}.plotkeys.app / preview
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {preview.page.sections.length} sections
                </Badge>
              </div>
            </div>

            {/* Sections */}
            <div className="max-h-[78vh] overflow-auto bg-muted/20 p-3 md:p-4">
              <div
                className="overflow-hidden rounded-lg border border-border/70"
                style={{
                  backgroundColor: preview.theme.backgroundColor ?? "#f8fafc",
                  fontFamily: preview.theme.fontFamily ?? "Satoshi, sans-serif",
                }}
              >
                {preview.page.sections.map((section) => {
                  const Component = sectionComponents[section.type];
                  if (!Component) return null;
                  return (
                    <Component
                      key={section.id}
                      config={section.config}
                      theme={preview.theme as ThemeConfig}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
