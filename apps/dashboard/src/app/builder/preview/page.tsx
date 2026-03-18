"use client";

import {
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
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const template = templateCatalog[currentIndex] ?? templateCatalog[0];
  const [tabTier, setTabTier] = useState<TemplateTier>(
    template?.tier ?? "starter",
  );
  const groups = useMemo(groupedTemplates, []);

  const preview = useMemo(
    () =>
      template
        ? resolveWebsitePresentation({
            companyName: template.defaultTheme.logo,
            content: template.defaultContent,
            renderMode: "draft",
            subdomain: template.name.toLowerCase(),
            templateKey: template.key,
          })
        : null,
    [template],
  );

  function goToTemplate(index: number) {
    const clamped =
      ((index % templateCatalog.length) + templateCatalog.length) %
      templateCatalog.length;
    setCurrentIndex(clamped);
    const target = templateCatalog[clamped];
    if (target) setTabTier(target.tier);
  }

  function selectTemplate(key: string) {
    const idx = templateCatalog.findIndex((t) => t.key === key);
    if (idx >= 0) {
      setCurrentIndex(idx);
      const target = templateCatalog[idx];
      if (target) setTabTier(target.tier);
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

  if (!template || !preview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        No templates available in the catalog.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ── Top navigation bar ── */}
      <nav className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
          <ButtonGroup>
            <Button asChild size="icon" variant="outline">
              <Link href="/builder" aria-label="Back to builder">
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
          </ButtonGroup>

          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-sm font-semibold">
                {template.name}
                <Badge variant="outline" className="ml-1 capitalize">
                  {template.tier}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-80 rounded-lg border-border/70 bg-popover/95 p-2 shadow-xl backdrop-blur"
            >
              <Tabs
                className="flex flex-col gap-3"
                value={tabTier}
                onValueChange={(v) => setTabTier(v as TemplateTier)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  {tierOrder.map((tier) => (
                    <TabsTrigger key={tier} value={tier} className="capitalize">
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

          <ButtonGroup>
            <Button
              size="icon"
              variant="outline"
              aria-label="Next template"
              onClick={() => goToTemplate(currentIndex + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </ButtonGroup>
        </div>
      </nav>

      {/* ── Publish checkbox row ── */}
      <div className="border-b border-border/70 bg-muted/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <div className="flex items-center gap-3 text-sm">
            <Badge variant="outline" className="capitalize">
              {template.tier}
            </Badge>
            <span className="font-medium text-foreground">{template.name}</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              — {template.marketingTagline}
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

      {/* ── Template preview ── */}
      <div className="mx-auto max-w-7xl px-4 py-6">
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
      </div>
    </main>
  );
}
