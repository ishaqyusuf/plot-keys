import type {
  HomeSectionDefinition,
  resolveWebsitePresentation,
} from "@plotkeys/section-registry";
import type { JSX } from "react";

type LivePreviewTheme = ReturnType<typeof resolveWebsitePresentation>["theme"];

type Props = {
  sections: HomeSectionDefinition[];
  theme: LivePreviewTheme;
};

function renderLiveSection(
  section: HomeSectionDefinition,
  theme: LivePreviewTheme,
) {
  const SectionComponent = section.component as (props: {
    config: HomeSectionDefinition["config"];
    theme: LivePreviewTheme;
  }) => JSX.Element;

  return (
    <SectionComponent key={section.id} config={section.config} theme={theme} />
  );
}

export function LivePreviewFrame({ sections, theme }: Props) {
  return (
    <div className="overflow-hidden border bg-background">
      {sections.map((section) => renderLiveSection(section, theme))}
    </div>
  );
}
