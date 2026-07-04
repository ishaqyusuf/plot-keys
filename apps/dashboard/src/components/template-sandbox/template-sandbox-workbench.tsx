import {
  deserializeTemplateConfig,
  getTemplatePageInventoryStrict,
  resolveWebsitePresentation,
  templateCatalog,
  type TenantContentRecord,
  type TenantThemeRecord,
} from "@plotkeys/section-registry";
import {
  buildTemplateSandboxProductionUrl,
  buildTemplateSandboxUrl,
} from "@plotkeys/utils";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent } from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@plotkeys/ui/tooltip";
import {
  Archive,
  Copy,
  ExternalLink,
  Globe2,
  Layers3,
  Link2,
  List,
  Palette,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import {
  archiveTemplateSandboxProfileAction,
  cloneTemplateSandboxProfileAction,
  generateTemplateSandboxLiveWebsiteAction,
  smartFillTemplateSandboxFieldAction,
  updateTemplateSandboxContentFieldAction,
  updateTemplateSandboxProfileAction,
  updateTemplateSandboxThemeFieldAction,
} from "../../app/actions";
import { BuilderPreviewPanel } from "../builder/builder-preview-panel";

type SandboxProfile = {
  companyName: string;
  contentJson: Record<string, unknown>;
  id: string;
  market: string | null;
  name: string;
  planTier: "starter" | "plus" | "pro";
  profileJson: Record<string, unknown>;
  sampleDataJson: Record<string, unknown>;
  shareId: string;
  subdomainLabel: string | null;
  templateKey: string;
  themeJson: Record<string, unknown>;
};

type TemplateSandboxWorkbenchProps = {
  currentOrigin: string;
  pageKey?: string;
  previewPath?: string;
  profile: SandboxProfile;
};

const planOptions = ["starter", "plus", "pro"] as const;
const sidebarRailItems = [
  { icon: Settings2, label: "Profile" },
  { icon: Palette, label: "Theme" },
  { icon: Link2, label: "URLs" },
  { icon: Layers3, label: "Sections" },
] as const;

function toStringRecord(value: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      typeof item === "string" ? item : String(item ?? ""),
    ]),
  );
}

function toArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item),
      )
    : [];
}

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function withSandboxMode(url: string, mode: "draft" | "live") {
  if (!url) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}mode=${mode}`;
}

function getLiveGeneratedAt(profileJson: Record<string, unknown>) {
  const live = profileJson.live;
  if (!live || typeof live !== "object" || Array.isArray(live)) return null;
  const generatedAt = (live as Record<string, unknown>).generatedAt;
  return typeof generatedAt === "string" && generatedAt ? generatedAt : null;
}

function sandboxListings(sampleData: Record<string, unknown>) {
  return toArray(sampleData.listings).map((item, index) => ({
    id: asText(item.id, `listing-${index + 1}`),
    imageUrl: asText(item.imageUrl) || null,
    location: asText(item.location, "Sandbox market"),
    price: asText(item.price),
    slug: asText(item.slug, `listing-${index + 1}`),
    specs: asText(item.specs),
    title: asText(item.title, `Listing ${index + 1}`),
  }));
}

function sandboxAgents(sampleData: Record<string, unknown>) {
  return toArray(sampleData.agents).map((item, index) => ({
    bio: asText(item.bio),
    id: asText(item.id, `agent-${index + 1}`),
    imageUrl: asText(item.imageUrl) || asText(item.photoUrl) || null,
    name: asText(item.name, `Agent ${index + 1}`),
    slug: asText(item.slug, `agent-${index + 1}`),
    title: asText(item.title) || asText(item.role),
  }));
}

function sandboxBlogPosts(sampleData: Record<string, unknown>) {
  return toArray(sampleData.blogPosts).map((item, index) => ({
    content: asText(item.content),
    excerpt: asText(item.excerpt),
    featuredImageUrl: asText(item.featuredImageUrl) || null,
    id: asText(item.id, `post-${index + 1}`),
    publishedAt: asText(item.publishedAt),
    slug: asText(item.slug, `post-${index + 1}`),
    title: asText(item.title, `Post ${index + 1}`),
  }));
}

function ThemeField({
  label,
  name,
  profileId,
  value,
}: {
  label: string;
  name: string;
  profileId: string;
  value?: string;
}) {
  return (
    <form action={updateTemplateSandboxThemeFieldAction}>
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <div className="flex gap-2">
          <input name="configId" type="hidden" value={profileId} />
          <input name="themeKey" type="hidden" value={name} />
          <Input defaultValue={value ?? ""} name="value" />
          <Button type="submit" variant="secondary">
            Save
          </Button>
        </div>
      </Field>
    </form>
  );
}

export function TemplateSandboxWorkbench({
  currentOrigin,
  pageKey,
  previewPath,
  profile,
}: TemplateSandboxWorkbenchProps) {
  const template = templateCatalog.find((item) => item.key === profile.templateKey);
  const inventory = getTemplatePageInventoryStrict(profile.templateKey);
  const availablePages = inventory.pages.map((page) => ({
    label: page.label,
    pageKey: page.pageKey,
    slug: page.slug,
  }));
  const resolvedPageKey =
    pageKey ??
    (() => {
      if (!previewPath || previewPath === "/") return "home";
      return (
        inventory.pages.find((page) => page.slug === previewPath)?.pageKey ??
        "home"
      );
    })();
  const selectedPage =
    availablePages.find((page) => page.pageKey === resolvedPageKey) ??
    availablePages[0];
  const selectedPageKey = selectedPage?.pageKey ?? "home";
  const selectedPageLabel = selectedPage?.label ?? "Home";
  const selectedPageSlug = selectedPage?.slug ?? "/";
  const content = toStringRecord(profile.contentJson) as TenantContentRecord;
  const theme = toStringRecord(profile.themeJson) as TenantThemeRecord;
  const sampleData = profile.sampleDataJson ?? {};
  const preview = resolveWebsitePresentation({
    companyName: profile.companyName,
    content,
    liveAgents: sandboxAgents(sampleData),
    liveBlogPosts: sandboxBlogPosts(sampleData),
    liveListings: sandboxListings(sampleData),
    market: profile.market ?? profile.companyName,
    pageKey: selectedPageKey,
    renderMode: "draft",
    subdomain: profile.subdomainLabel ?? "sandbox",
    templateKey: profile.templateKey,
    theme,
  });
  const templateConfig = deserializeTemplateConfig(theme);
  const sectionTypes = Array.from(
    new Set(
      preview.page.sections.map(
        ({ component: _component, ...rest }) => rest.type,
      ),
    ),
  );
  const localUrl = buildTemplateSandboxUrl(profile.shareId, {
    currentOrigin,
    pathname: selectedPageSlug,
  });
  const productionUrl = buildTemplateSandboxProductionUrl(
    profile.shareId,
    selectedPageSlug,
  );
  const draftLocalUrl = withSandboxMode(localUrl, "draft");
  const liveLocalUrl = withSandboxMode(localUrl, "live");
  const liveProductionUrl = withSandboxMode(productionUrl, "live");
  const liveGeneratedAt = getLiveGeneratedAt(profile.profileJson);

  return (
    <div className="relative h-[calc(100svh-4rem)] min-h-0 overflow-hidden bg-background">
      <BuilderPreviewPanel
        activePageKey={selectedPageKey}
        availablePages={availablePages}
        companySlug={profile.subdomainLabel ?? "sandbox"}
        configId={profile.id}
        defaultContent={content}
        editableFields={preview.editableFields}
        pageKey={selectedPageKey}
        pageLabel={selectedPageLabel}
        pageSlug={selectedPageSlug}
        presentation="canvas"
        sections={preview.page.sections.map(
          ({ component: _component, ...rest }) => rest,
        )}
        templateKey={profile.templateKey}
        theme={theme}
        visibleSections={templateConfig.visibleSections}
        onSmartFill={smartFillTemplateSandboxFieldAction}
        onUpdateField={updateTemplateSandboxContentFieldAction}
      />

      <aside className="group/sidebar absolute bottom-3 left-3 top-3 z-30 min-h-0 max-w-[calc(100vw-1.5rem)]">
        <Card className="relative flex h-full w-12 max-w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden border-border/70 bg-card/96 py-0 shadow-[var(--shadow-card)] backdrop-blur transition-[width] duration-200 ease-out group-hover/sidebar:w-[23rem] group-focus-within/sidebar:w-[23rem]">
          <TooltipProvider delayDuration={100}>
            <div className="absolute inset-y-0 left-0 z-20 flex w-12 flex-col items-center gap-2 border-r border-border/70 bg-card/96 py-2">
              {sidebarRailItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <div className="flex size-8 items-center justify-center rounded-md text-muted-foreground">
                        <Icon className="size-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              })}

              <div className="mt-auto flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      className="size-8"
                      size="icon"
                      variant="ghost"
                    >
                      <Link href="/template-sandbox/profiles">
                        <List className="size-4" />
                        <span className="sr-only">Profiles</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Profiles</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      className="size-8"
                      size="icon"
                      variant="ghost"
                    >
                      <a href={draftLocalUrl} rel="noreferrer" target="_blank">
                        <ExternalLink className="size-4" />
                        <span className="sr-only">Draft preview</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Draft preview</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <form
                      action={generateTemplateSandboxLiveWebsiteAction}
                      target="_blank"
                    >
                      <input name="profileId" type="hidden" value={profile.id} />
                      <input
                        name="pathname"
                        type="hidden"
                        value={selectedPageSlug}
                      />
                      <Button
                        className="size-8"
                        size="icon"
                        type="submit"
                        variant="ghost"
                      >
                        <Globe2 className="size-4" />
                        <span className="sr-only">Live Website</span>
                      </Button>
                    </form>
                  </TooltipTrigger>
                  <TooltipContent side="right">Live Website</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>

          <div className="pointer-events-none flex h-full w-[23rem] translate-x-2 flex-col pl-12 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover/sidebar:pointer-events-auto group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100 group-focus-within/sidebar:pointer-events-auto group-focus-within/sidebar:translate-x-0 group-focus-within/sidebar:opacity-100">
            <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/70 px-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Template Config
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {template?.name ?? profile.templateKey}
                </p>
              </div>
              <Badge variant="outline">{profile.planTier}</Badge>
            </div>

            <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
              <div className="flex flex-col gap-4 p-4">
                <section className="rounded-lg border border-border/70 bg-background/80 p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <Settings2 className="size-4 text-muted-foreground" />
                    <div>
                      <h2 className="text-sm font-semibold">Profile</h2>
                      <p className="text-xs text-muted-foreground">
                        Mock tenant identity and template context.
                      </p>
                    </div>
                  </div>
                  <form action={updateTemplateSandboxProfileAction}>
                    <input name="profileId" type="hidden" value={profile.id} />
                    <FieldGroup className="space-y-4">
                      <Field>
                        <FieldLabel>Name</FieldLabel>
                        <Input defaultValue={profile.name} name="name" />
                      </Field>
                      <Field>
                        <FieldLabel>Template</FieldLabel>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          defaultValue={profile.templateKey}
                          name="templateKey"
                        >
                          {templateCatalog.map((item) => (
                            <option key={item.key} value={item.key}>
                              {item.name} ({item.tier})
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field>
                        <FieldLabel>Company</FieldLabel>
                        <Input
                          defaultValue={profile.companyName}
                          name="companyName"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Market</FieldLabel>
                        <Input
                          defaultValue={profile.market ?? ""}
                          name="market"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Subdomain label</FieldLabel>
                        <Input
                          defaultValue={profile.subdomainLabel ?? ""}
                          name="subdomainLabel"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Plan</FieldLabel>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          defaultValue={profile.planTier}
                          name="planTier"
                        >
                          {planOptions.map((plan) => (
                            <option key={plan} value={plan}>
                              {plan}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Button className="w-full" type="submit">
                        Save profile
                      </Button>
                    </FieldGroup>
                  </form>
                </section>

                <section className="rounded-lg border border-border/70 bg-background/80 p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <Palette className="size-4 text-muted-foreground" />
                    <div>
                      <h2 className="text-sm font-semibold">Theme</h2>
                      <p className="text-xs text-muted-foreground">
                        Save focused style changes while staying in sandbox.
                      </p>
                    </div>
                  </div>
                  <FieldGroup className="space-y-4">
                    <ThemeField
                      label="Accent color"
                      name="accentColor"
                      profileId={profile.id}
                      value={theme.accentColor}
                    />
                    <ThemeField
                      label="Background color"
                      name="backgroundColor"
                      profileId={profile.id}
                      value={theme.backgroundColor}
                    />
                    <ThemeField
                      label="Style preset"
                      name="stylePreset"
                      profileId={profile.id}
                      value={theme.stylePreset}
                    />
                  </FieldGroup>
                </section>

                <section className="rounded-lg border border-border/70 bg-background/80 p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <Link2 className="size-4 text-muted-foreground" />
                    <div>
                      <h2 className="text-sm font-semibold">Website URLs</h2>
                      <p className="text-xs text-muted-foreground">
                        Draft follows edits. Live uses the latest snapshot.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <a
                      className="block truncate text-muted-foreground hover:text-foreground"
                      href={draftLocalUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Draft: {draftLocalUrl}
                    </a>
                    <a
                      className="block truncate text-muted-foreground hover:text-foreground"
                      href={liveLocalUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Live local: {liveLocalUrl}
                    </a>
                    <a
                      className="block truncate text-muted-foreground hover:text-foreground"
                      href={liveProductionUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Live production: {liveProductionUrl}
                    </a>
                    <p className="pt-1 text-muted-foreground">
                      {liveGeneratedAt
                        ? `Last generated: ${liveGeneratedAt}`
                        : "No live snapshot generated yet."}
                    </p>
                  </div>
                </section>

                <section className="rounded-lg border border-border/70 bg-background/80 p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <Layers3 className="size-4 text-muted-foreground" />
                    <div>
                      <h2 className="text-sm font-semibold">Page Summary</h2>
                      <p className="text-xs text-muted-foreground">
                        Current rendered page and registry surface.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{selectedPageLabel}</Badge>
                    <Badge variant="outline">
                      {sectionTypes.length} section types
                    </Badge>
                    <Badge variant="outline">
                      {preview.editableFields.length} fields
                    </Badge>
                  </div>
                </section>
              </div>
            </CardContent>

            <div className="shrink-0 border-t border-border/70 bg-card/96 p-3">
              <div className="grid grid-cols-2 gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/template-sandbox/profiles">
                    <List className="mr-2 size-4" />
                    Profiles
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={draftLocalUrl} rel="noreferrer" target="_blank">
                    <ExternalLink className="mr-2 size-4" />
                    Preview
                  </a>
                </Button>
                <form
                  action={generateTemplateSandboxLiveWebsiteAction}
                  className="col-span-2"
                  target="_blank"
                >
                  <input name="profileId" type="hidden" value={profile.id} />
                  <input
                    name="pathname"
                    type="hidden"
                    value={selectedPageSlug}
                  />
                  <Button className="w-full" size="sm" type="submit">
                    <Globe2 className="mr-2 size-4" />
                    Live Website
                  </Button>
                </form>
                <form action={cloneTemplateSandboxProfileAction}>
                  <input name="profileId" type="hidden" value={profile.id} />
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    variant="outline"
                  >
                    <Copy className="mr-2 size-4" />
                    Clone
                  </Button>
                </form>
                <form action={archiveTemplateSandboxProfileAction}>
                  <input name="profileId" type="hidden" value={profile.id} />
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    variant="destructive"
                  >
                    <Archive className="mr-2 size-4" />
                    Archive
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
