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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import Link from "next/link";
import {
  archiveTemplateSandboxProfileAction,
  cloneTemplateSandboxProfileAction,
  smartFillTemplateSandboxFieldAction,
  updateTemplateSandboxContentFieldAction,
  updateTemplateSandboxProfileAction,
  updateTemplateSandboxThemeFieldAction,
} from "../../app/actions";
import { BuilderPreviewPanel } from "../builder/builder-preview-panel";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "../dashboard/dashboard-page";

type SandboxProfile = {
  companyName: string;
  contentJson: Record<string, unknown>;
  id: string;
  market: string | null;
  name: string;
  planTier: "starter" | "plus" | "pro";
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

  return (
    <div className="space-y-5">
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Template lab</DashboardPageEyebrow>
            <DashboardPageTitle>{profile.name}</DashboardPageTitle>
            <DashboardPageDescription>
              {profile.companyName}
              {profile.market ? ` · ${profile.market}` : ""} ·{" "}
              {template?.name ?? profile.templateKey}
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild variant="outline">
              <Link href="/template-sandbox">Back to sandbox</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={localUrl} rel="noreferrer" target="_blank">
                Open preview
              </a>
            </Button>
            <form action={cloneTemplateSandboxProfileAction}>
              <input name="profileId" type="hidden" value={profile.id} />
              <Button type="submit" variant="outline">
                Clone
              </Button>
            </form>
            <form action={archiveTemplateSandboxProfileAction}>
              <input name="profileId" type="hidden" value={profile.id} />
              <Button type="submit" variant="destructive">
                Archive
              </Button>
            </form>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <div className="grid gap-3 xl:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="space-y-3">
          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Mock tenant identity and template context.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    <Input defaultValue={profile.market ?? ""} name="market" />
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
            </CardContent>
          </Card>

          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Preview URLs</CardTitle>
              <CardDescription>
                Stable links for local and deployed debugging.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <a
                className="block truncate text-muted-foreground hover:text-foreground"
                href={localUrl}
                rel="noreferrer"
                target="_blank"
              >
                Local: {localUrl}
              </a>
              <a
                className="block truncate text-muted-foreground hover:text-foreground"
                href={productionUrl}
                rel="noreferrer"
                target="_blank"
              >
                Production: {productionUrl}
              </a>
            </CardContent>
          </Card>

          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Theme quick edit</CardTitle>
              <CardDescription>
                Save focused theme changes without entering tenant mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="border-border/65 bg-card/78">
            <CardContent className="flex flex-wrap gap-2 p-4">
              <Badge variant="outline">{selectedPageLabel}</Badge>
              <Badge variant="outline">{sectionTypes.length} section types</Badge>
              <Badge variant="outline">
                {preview.editableFields.length} fields
              </Badge>
            </CardContent>
          </Card>
        </aside>

        <DashboardSection className="min-w-0">
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Sandbox preview</DashboardSectionTitle>
              <DashboardSectionDescription>
                This preview uses saved sandbox data and the real template
                registry renderer.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
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
            sections={preview.page.sections.map(
              ({ component: _component, ...rest }) => rest,
            )}
            templateKey={profile.templateKey}
            theme={theme}
            visibleSections={templateConfig.visibleSections}
            onSmartFill={smartFillTemplateSandboxFieldAction}
            onUpdateField={updateTemplateSandboxContentFieldAction}
          />
        </DashboardSection>
      </div>
    </div>
  );
}
