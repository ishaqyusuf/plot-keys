"use client";

import {
  resolveWebsitePresentation,
  templateCatalog,
} from "@plotkeys/section-registry";
import { useMemo, useState } from "react";
import type { TemplateTier } from "./builder-template-picker";
import { BuilderTemplatePreviewFrame } from "./builder-template-preview-frame";
import { BuilderTemplatePreviewHeader } from "./builder-template-preview-header";
import { BuilderTemplatePreviewSidebar } from "./builder-template-preview-sidebar";
import { BuilderTemplatePublishStatus } from "./builder-template-publish-status";

export function BuilderTemplatePreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPageKey, setCurrentPageKey] = useState("home");

  const template = templateCatalog[currentIndex] ?? templateCatalog[0];
  const [tabTier, setTabTier] = useState<TemplateTier>(
    template?.tier ?? "starter",
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

  if (!template || !preview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        No templates available in the catalog.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-2 py-2 md:px-3 md:py-3">
      <div className="mx-auto grid max-w-464 gap-3 border bg-background p-3 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <BuilderTemplatePreviewSidebar
          onOpenChange={setDropdownOpen}
          onSelectTemplate={selectTemplate}
          onTabTierChange={setTabTier}
          open={dropdownOpen}
          sectionCount={preview.page.sections.length}
          tabTier={tabTier}
          template={template}
        />

        <section className="flex flex-col gap-3">
          <BuilderTemplatePreviewHeader
            currentPageKey={currentPageKey}
            onNextTemplate={() => goToTemplate(currentIndex + 1)}
            onOpenChange={setDropdownOpen}
            onPreviousTemplate={() => goToTemplate(currentIndex - 1)}
            onSelectTemplate={selectTemplate}
            onTabTierChange={setTabTier}
            open={dropdownOpen}
            tabTier={tabTier}
            template={template}
          />

          <BuilderTemplatePublishStatus
            checked={publishedKeys.has(template.key)}
            onCheckedChange={() => togglePublished(template.key)}
            template={template}
          />

          <BuilderTemplatePreviewFrame
            sections={preview.page.sections}
            templateName={template.name}
            theme={preview.theme}
          />
        </section>
      </div>
    </main>
  );
}
