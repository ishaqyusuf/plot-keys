import { templateCatalog } from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@plotkeys/ui/tabs";
import { BuilderSidebarPickerButton } from "./builder-sidebar-picker-button";

export type TemplateTier = "starter" | "plus" | "pro";

const templateTiers: TemplateTier[] = ["starter", "plus", "pro"];

type Props = {
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (key: string) => void;
  onTabTierChange: (tier: TemplateTier) => void;
  open: boolean;
  selectedTemplateKey: string;
  selectedTemplateName: string;
  selectedTemplateTier: TemplateTier;
  tabTier: TemplateTier;
  variant?: "desktop" | "mobile";
};

export function BuilderTemplatePicker({
  onOpenChange,
  onSelectTemplate,
  onTabTierChange,
  open,
  selectedTemplateKey,
  selectedTemplateName,
  selectedTemplateTier,
  tabTier,
  variant = "desktop",
}: Props) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        {variant === "mobile" ? (
          <Button variant="ghost" className="gap-2 px-2 text-sm font-semibold">
            <span className="truncate">{selectedTemplateName}</span>
            <Badge variant="outline" className="capitalize">
              {selectedTemplateTier}
            </Badge>
          </Button>
        ) : (
          <BuilderSidebarPickerButton label="Template">
            <span className="block truncate pr-2">{selectedTemplateName}</span>
            <Badge variant="outline" className="mt-1.5">
              {selectedTemplateTier}
            </Badge>
          </BuilderSidebarPickerButton>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-1.5"
        align="start"
        sideOffset={10}
        side={variant === "desktop" ? "right" : undefined}
      >
        <Tabs
          className="flex flex-col gap-2"
          onValueChange={(value) => onTabTierChange(value as TemplateTier)}
          value={tabTier}
        >
          <TabsList className="grid w-full grid-cols-3">
            {templateTiers.map((tier) => (
              <TabsTrigger
                className={
                  variant === "mobile" ? "capitalize text-xs" : "capitalize"
                }
                key={tier}
                value={tier}
              >
                {tier}
              </TabsTrigger>
            ))}
          </TabsList>
          {templateTiers.map((tier) => (
            <TabsContent className="mt-0" key={tier} value={tier}>
              <DropdownMenuRadioGroup
                onValueChange={onSelectTemplate}
                value={selectedTemplateKey}
              >
                <DropdownMenuGroup>
                  {templateCatalog
                    .filter((template) => template.tier === tier)
                    .map((template) => (
                      <DropdownMenuRadioItem
                        className="items-start"
                        key={template.key}
                        value={template.key}
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">
                            {template.name}
                          </p>
                          {template.marketingTagline ? (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {template.marketingTagline}
                            </p>
                          ) : null}
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
  );
}
