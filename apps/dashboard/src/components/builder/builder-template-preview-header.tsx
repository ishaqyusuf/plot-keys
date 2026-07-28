import type { TemplateDefinition } from "@plotkeys/section-registry";
import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import Link from "next/link";
import {
  BuilderTemplatePicker,
  type TemplateTier,
} from "./builder-template-picker";

type Props = {
  currentPageKey: string;
  onNextTemplate: () => void;
  onOpenChange: (open: boolean) => void;
  onPreviousTemplate: () => void;
  onSelectTemplate: (key: string) => void;
  onTabTierChange: (tier: TemplateTier) => void;
  open: boolean;
  tabTier: TemplateTier;
  template: TemplateDefinition;
};

export function BuilderTemplatePreviewHeader({
  currentPageKey,
  onNextTemplate,
  onOpenChange,
  onPreviousTemplate,
  onSelectTemplate,
  onTabTierChange,
  open,
  tabTier,
  template,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link aria-label="Back to builder" href="/builder">
            <Icon.ArrowBack className="size-4" />
          </Link>
        </Button>

        <div className="xl:hidden">
          <BuilderTemplatePicker
            onOpenChange={onOpenChange}
            onSelectTemplate={onSelectTemplate}
            onTabTierChange={onTabTierChange}
            open={open}
            selectedTemplateKey={template.key}
            selectedTemplateName={template.name}
            selectedTemplateTier={template.tier}
            tabTier={tabTier}
            variant="mobile"
          />
        </div>

        <span className="text-sm text-muted-foreground">{currentPageKey}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ThemeToggle />
        <div className="flex h-9 items-center border">
          <Button
            aria-label="Previous template"
            variant="ghost"
            size="icon"
            className="p-0 w-6 h-6 hover:bg-transparent mr-4 ml-2"
            onClick={onPreviousTemplate}
          >
            <Icon.ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            aria-label="Next template"
            variant="ghost"
            size="icon"
            className="p-0 w-6 h-6 hover:bg-transparent ml-4 mr-2"
            onClick={onNextTemplate}
          >
            <Icon.ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
