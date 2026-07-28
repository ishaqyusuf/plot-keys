"use client";

import { templateCatalog } from "@plotkeys/section-registry";
import { Avatar, AvatarFallback } from "@plotkeys/ui/avatar";
import { Badge } from "@plotkeys/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@plotkeys/ui/tabs";
import {
  describeTemplateAccess,
  type SubscriptionTier,
  templateTierLabels,
  tierLabels,
} from "@plotkeys/utils";
import { BuilderSidebarPickerButton } from "./builder-sidebar-picker-button";
import {
  type BuilderTemplateGroup,
  useBuilderPageSelection,
  useBuilderTemplateSelection,
} from "./use-builder-template-page-selection";

type TemplatePickerInput = {
  currentTemplateKey: string;
  licensedTemplateKeys: Set<string>;
  planTier: SubscriptionTier;
};

type PagePickerInput = {
  currentPageKey: string;
  currentTemplateKey: string;
};

export function TemplatePicker({
  currentTemplateKey,
  licensedTemplateKeys,
  planTier,
}: TemplatePickerInput) {
  const {
    currentTemplate,
    errorMessage,
    group,
    handleSelectTemplate,
    setGroup,
    usageMap,
  } = useBuilderTemplateSelection({ currentTemplateKey });

  const groupTemplates = templateCatalog.filter((t) => t.tier === group);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <BuilderSidebarPickerButton label="Template">
          <span className="block truncate pr-2">
            {currentTemplate?.name ?? currentTemplateKey}
          </span>
          <Badge variant="outline" className="mt-1.5">
            {templateTierLabels[currentTemplate?.tier ?? "starter"]}
          </Badge>
        </BuilderSidebarPickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-1.5"
        align="start"
        sideOffset={10}
        side="right"
      >
        <Tabs
          className="flex flex-col gap-2"
          onValueChange={(v) => setGroup(v as BuilderTemplateGroup)}
          value={group}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="starter">
              {templateTierLabels.starter}
            </TabsTrigger>
            <TabsTrigger value="plus">{templateTierLabels.plus}</TabsTrigger>
            <TabsTrigger value="pro">{templateTierLabels.pro}</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-0" value={group}>
            <DropdownMenuRadioGroup
              onValueChange={handleSelectTemplate}
              value={currentTemplateKey}
            >
              <DropdownMenuGroup>
                {groupTemplates.map((template) => {
                  const templateAccess = describeTemplateAccess(
                    planTier,
                    template.tier,
                  );
                  const isLocked =
                    !licensedTemplateKeys.has(template.key) &&
                    !templateAccess.allowed;

                  return (
                    <DropdownMenuRadioItem
                      className="items-start"
                      disabled={isLocked}
                      key={template.key}
                      value={template.key}
                    >
                      <div className="flex min-w-0 items-start gap-2.5">
                        <Avatar className="size-6">
                          <AvatarFallback className="text-[10px] font-medium">
                            {template.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <span className="truncate font-medium text-foreground">
                            {template.name}
                          </span>
                          {template.marketingTagline && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {template.marketingTagline}
                            </p>
                          )}
                          {(() => {
                            const count = usageMap.get(template.key) ?? 0;
                            return count > 0 ? (
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {count} using
                              </p>
                            ) : null;
                          })()}
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {template.tier}
                            </Badge>
                            {isLocked ? (
                              <span className="text-[11px] text-warning">
                                Upgrade to{" "}
                                {tierLabels[templateAccess.requiredTier]}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuRadioGroup>
          </TabsContent>
        </Tabs>
        {errorMessage ? (
          <p className="px-2 pb-1 text-xs text-destructive">{errorMessage}</p>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PagePicker({
  currentPageKey,
  currentTemplateKey,
}: PagePickerInput) {
  const { currentPage, handleSelectPage, pages } = useBuilderPageSelection({
    currentPageKey,
    currentTemplateKey,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <BuilderSidebarPickerButton label="Page">
          {currentPage?.label ?? currentPage?.pageKey ?? "Home"}
        </BuilderSidebarPickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-1.5"
        align="start"
        sideOffset={10}
        side="right"
      >
        <DropdownMenuRadioGroup
          onValueChange={handleSelectPage}
          value={currentPage?.pageKey ?? "home"}
        >
          <DropdownMenuGroup>
            {pages.map((page) => (
              <DropdownMenuRadioItem
                className="items-start"
                key={page.pageKey}
                value={page.pageKey}
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{page.label}</p>
                  <p className="text-xs text-muted-foreground">{page.slug}</p>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
