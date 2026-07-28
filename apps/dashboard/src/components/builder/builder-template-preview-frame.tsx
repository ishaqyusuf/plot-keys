import {
  type ResolvedWebsitePresentation,
  sectionComponents,
  type ThemeConfig,
} from "@plotkeys/section-registry";

type Props = {
  sections: ResolvedWebsitePresentation["page"]["sections"];
  templateName: string;
  theme: ThemeConfig;
};

export function BuilderTemplatePreviewFrame({
  sections,
  templateName,
  theme,
}: Props) {
  return (
    <div className="overflow-hidden border bg-background">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-foreground/20" />
          <span className="size-2.5 rounded-full bg-foreground/20" />
          <span className="size-2.5 rounded-full bg-foreground/20" />
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {templateName.toLowerCase()}.plotkeys.app / preview
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {sections.length} sections
          </span>
        </div>
      </div>

      <div className="max-h-[78vh] overflow-auto bg-background p-3 md:p-4">
        <div
          className="overflow-hidden border"
          style={{
            backgroundColor: theme.backgroundColor ?? "#f8fafc",
            fontFamily: theme.fontFamily ?? "Satoshi, sans-serif",
          }}
        >
          {sections.map((section) => {
            const Component = sectionComponents[section.type];
            if (!Component) return null;

            return (
              <Component
                config={section.config}
                key={section.id}
                theme={theme as ThemeConfig}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
