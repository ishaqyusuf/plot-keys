import {
  colorSystems,
  stylePresets,
  type TemplateDefinition,
} from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Separator } from "@plotkeys/ui/separator";
import {
  BuilderTemplatePicker,
  type TemplateTier,
} from "./builder-template-picker";

type Props = {
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (key: string) => void;
  onTabTierChange: (tier: TemplateTier) => void;
  open: boolean;
  sectionCount: number;
  tabTier: TemplateTier;
  template: TemplateDefinition;
};

export function BuilderTemplatePreviewSidebar({
  onOpenChange,
  onSelectTemplate,
  onTabTierChange,
  open,
  sectionCount,
  tabTier,
  template,
}: Props) {
  return (
    <aside className="hidden xl:sticky xl:top-3 xl:block xl:h-[calc(100svh-1.5rem)]">
      <div className="flex h-full flex-col overflow-hidden border bg-background">
        <div className="border-b border-border bg-background px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Template Preview
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Template
            </p>
            <BuilderTemplatePicker
              onOpenChange={onOpenChange}
              onSelectTemplate={onSelectTemplate}
              onTabTierChange={onTabTierChange}
              open={open}
              selectedTemplateKey={template.key}
              selectedTemplateName={template.name}
              selectedTemplateTier={template.tier}
              tabTier={tabTier}
            />
          </section>

          <Separator />

          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Style Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(stylePresets).map(([key, preset]) => (
                <div
                  className="flex h-14 items-center justify-center border border-border"
                  key={key}
                  title={preset.name}
                >
                  <span className="truncate px-2 text-xs font-medium text-muted-foreground">
                    {preset.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Color System
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(colorSystems).map(([key, system]) => (
                <div
                  className="flex flex-col items-center gap-1.5 border border-border px-2 py-2 text-xs"
                  key={key}
                  title={system.name}
                >
                  <div className="flex gap-1">
                    <div
                      className="size-3 rounded-full border border-border"
                      style={{
                        backgroundColor: `hsl(${system.light.primary})`,
                      }}
                    />
                    <div
                      className="size-3 rounded-full border border-border"
                      style={{
                        backgroundColor: `hsl(${system.light.secondary})`,
                      }}
                    />
                  </div>
                  <span className="truncate font-medium text-muted-foreground">
                    {system.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              Preview Info
            </p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">Sections</span>
                <Badge variant="outline">{sectionCount}</Badge>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">Theme</span>
                <span className="font-medium text-foreground">
                  {template.defaultTheme.logo}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}
