"use client";

import type { TemplateConfig } from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Separator } from "@plotkeys/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@plotkeys/ui/sheet";
import { Settings2 } from "lucide-react";

import { BuilderSidebarControls } from "./builder-sidebar-controls";

type BuilderSidebarDrawerProps = {
  activeConfigName: string;
  activeTemplateLabel: string;
  configId: string;
  configStatus: string;
  currentTemplateKey: string;
  editableFieldCount: number;
  sectionCount: number;
  templateConfig: TemplateConfig;
  totalConfigurations: number;
  onCreateDraft: (formData: FormData) => Promise<void>;
  onUpdateTheme: (formData: FormData) => Promise<void>;
  onUpdateThemeSilent?: (formData: FormData) => Promise<void>;
};

export function BuilderSidebarDrawer({
  activeConfigName,
  configId,
  configStatus,
  currentTemplateKey,
  editableFieldCount,
  sectionCount,
  templateConfig,
  totalConfigurations,
  onCreateDraft,
  onUpdateTheme,
  onUpdateThemeSilent,
}: BuilderSidebarDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="xl:hidden"
          size="icon"
          variant="outline"
          aria-label="Open builder settings"
        >
          <Settings2 className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto p-0">
        <SheetHeader className="border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--primary)/0.14),transparent)] px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SheetTitle className="text-xs uppercase tracking-[0.34em] text-muted-foreground font-normal">
              Builder setup
            </SheetTitle>
            <Badge variant="outline">Studio</Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 p-6">
          <section className="space-y-4">
            <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Active configuration
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {activeConfigName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {totalConfigurations} saved configurations
                </p>
              </div>
              <Badge
                variant={configStatus === "published" ? "default" : "outline"}
              >
                {configStatus}
              </Badge>
            </div>

            <BuilderSidebarControls
              configId={configId}
              currentTemplateKey={currentTemplateKey}
              templateConfig={templateConfig}
              onCreateDraft={onCreateDraft}
              onUpdateTheme={onUpdateTheme}
              onUpdateThemeSilent={onUpdateThemeSilent}
            />
          </section>

          <Separator />

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Editable fields
            </p>
            <p className="text-xs text-muted-foreground leading-5">
              Click any section in the preview to reveal its inline field
              editor. Changes are saved per field.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">{editableFieldCount} fields</Badge>
              <Badge variant="outline">{sectionCount} sections</Badge>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
