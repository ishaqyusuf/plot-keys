import type { JSX } from "react";
import type { PageDefinition } from "./page-inventory";
import type { RegistryContextValue, RegistryPageInfo } from "./runtime-context";
import type { TemplateTier } from "./types";

export type EmptyTemplatePageProps = Record<string, never>;

export type RouteSlugTemplatePageProps = {
  slug: string;
};

export type TemplatePageComponent<Props> = (props: Props) => JSX.Element | null;

export type TemplatePageInfo = RegistryPageInfo & {
  label?: string;
  pageKey: string;
  supportedPlans: TemplateTier[];
  templateKey?: string;
  templateName?: string;
};

export type TemplatePageHandle<Props = EmptyTemplatePageProps> = {
  Page: TemplatePageComponent<Props>;
  info: TemplatePageInfo;
};

export type TemplatePageRegistration<Props = EmptyTemplatePageProps> = {
  Page: TemplatePageComponent<Props>;
  info?: Partial<TemplatePageInfo>;
};

export type TemplatePageResolution = {
  page: PageDefinition;
  supportedPlans: TemplateTier[];
  templateKey: string;
  templateName: string;
};

export type TemplatePageContext = Pick<
  RegistryContextValue,
  "page" | "templateKey"
>;

export type TemplatePageSlot<Props = EmptyTemplatePageProps> = {
  pageKey: string;
  resolve: (ctx: TemplatePageContext) => TemplatePageHandle<Props>;
  routeKind: "dynamic" | "static";
};

export type TemplatePageRegistryOptions = {
  registrations?: Partial<{
    [templateKey: string]: Partial<Record<string, TemplatePageRegistration>>;
  }>;
  resolveTemplatePage: (
    templateKey: string,
    pageKey: string,
  ) => TemplatePageResolution | undefined;
};

export type TemplatePageRegistry = ReturnType<
  typeof createTemplatePageRegistry
>;

type TemplatePageSlotDefinition = {
  label: string;
  pageKey: string;
  routeKind?: "dynamic" | "static";
};

const unregisteredPage = (() => null) as TemplatePageComponent<unknown>;

function canonicalPathFor(slug: string, routeSlug: string | null | undefined) {
  if (!routeSlug) return slug;
  return slug.replace("[slug]", routeSlug);
}

function routeInfoForSlot(
  pageKey: string,
  ctx: TemplatePageContext,
): Partial<RegistryPageInfo> {
  return ctx.page.pageKey === pageKey ? ctx.page : {};
}

export function createTemplatePageSlot<Props = EmptyTemplatePageProps>(
  definition: TemplatePageSlotDefinition,
  options: TemplatePageRegistryOptions,
): TemplatePageSlot<Props> {
  return {
    pageKey: definition.pageKey,
    routeKind: definition.routeKind ?? "static",
    resolve(ctx) {
      const routeInfo = routeInfoForSlot(definition.pageKey, ctx);
      const routeSlug = routeInfo.routeSlug ?? null;
      const templateKey = ctx.templateKey;
      const registration = templateKey
        ? options.registrations?.[templateKey]?.[definition.pageKey]
        : undefined;

      let resolution: TemplatePageResolution | undefined;
      let resolutionFailed = false;

      if (templateKey) {
        try {
          resolution = options.resolveTemplatePage(
            templateKey,
            definition.pageKey,
          );
        } catch {
          resolutionFailed = true;
        }
      }

      const pageNotSupported =
        routeInfo.pageNotSupported ??
        Boolean(templateKey && (!resolution || resolutionFailed));

      const info: TemplatePageInfo = {
        canonicalPath:
          routeInfo.canonicalPath ??
          (resolution
            ? canonicalPathFor(resolution.page.slug, routeSlug)
            : undefined),
        label: resolution?.page.label ?? definition.label,
        pageDisabled: routeInfo.pageDisabled ?? false,
        pageKey: definition.pageKey,
        pageNotSupported,
        routeSlug,
        supportedPlans: resolution?.supportedPlans ?? [],
        templateKey,
        templateName: resolution?.templateName,
        ...registration?.info,
      };

      return {
        Page:
          (registration?.Page as TemplatePageComponent<Props> | undefined) ??
          (unregisteredPage as TemplatePageComponent<Props>),
        info,
      };
    },
  };
}

export function createTemplatePageRegistry(
  options: TemplatePageRegistryOptions,
) {
  return {
    aboutPage: createTemplatePageSlot(
      { label: "About", pageKey: "about" },
      options,
    ),
    agentsPage: createTemplatePageSlot(
      { label: "Agents", pageKey: "agents" },
      options,
    ),
    areasPage: createTemplatePageSlot(
      { label: "Areas", pageKey: "areas" },
      options,
    ),
    blogContentPage: createTemplatePageSlot<RouteSlugTemplatePageProps>(
      {
        label: "Blog post",
        pageKey: "blog-post",
        routeKind: "dynamic",
      },
      options,
    ),
    blogPage: createTemplatePageSlot(
      { label: "Blog", pageKey: "blog" },
      options,
    ),
    careersPage: createTemplatePageSlot(
      { label: "Careers", pageKey: "careers" },
      options,
    ),
    contactPage: createTemplatePageSlot(
      { label: "Contact", pageKey: "contact" },
      options,
    ),
    eventsPage: createTemplatePageSlot(
      { label: "Events", pageKey: "events" },
      options,
    ),
    faqPage: createTemplatePageSlot({ label: "FAQ", pageKey: "faq" }, options),
    galleryPage: createTemplatePageSlot(
      { label: "Gallery", pageKey: "gallery" },
      options,
    ),
    homePage: createTemplatePageSlot(
      { label: "Home", pageKey: "home" },
      options,
    ),
    howItWorksPage: createTemplatePageSlot(
      { label: "How it works", pageKey: "how-it-works" },
      options,
    ),
    inquirePage: createTemplatePageSlot(
      { label: "Inquire", pageKey: "inquire" },
      options,
    ),
    insightsPage: createTemplatePageSlot(
      { label: "Insights", pageKey: "insights" },
      options,
    ),
    investorsPage: createTemplatePageSlot(
      { label: "Investors", pageKey: "investors" },
      options,
    ),
    landlordsPage: createTemplatePageSlot(
      { label: "Landlords", pageKey: "landlords" },
      options,
    ),
    listingDetailPage: createTemplatePageSlot<RouteSlugTemplatePageProps>(
      {
        label: "Listing detail",
        pageKey: "listing-detail",
        routeKind: "dynamic",
      },
      options,
    ),
    listingsPage: createTemplatePageSlot(
      { label: "Listings", pageKey: "listings" },
      options,
    ),
    portfolioDetailPage: createTemplatePageSlot<RouteSlugTemplatePageProps>(
      {
        label: "Portfolio detail",
        pageKey: "portfolio-detail",
        routeKind: "dynamic",
      },
      options,
    ),
    portfolioPage: createTemplatePageSlot(
      { label: "Portfolio", pageKey: "portfolio" },
      options,
    ),
    pressPage: createTemplatePageSlot(
      { label: "Press", pageKey: "press" },
      options,
    ),
    privateSalesPage: createTemplatePageSlot(
      { label: "Private sales", pageKey: "private-sales" },
      options,
    ),
    projectDetailPage: createTemplatePageSlot<RouteSlugTemplatePageProps>(
      {
        label: "Project detail",
        pageKey: "project-detail",
        routeKind: "dynamic",
      },
      options,
    ),
    projectsPage: createTemplatePageSlot(
      { label: "Projects", pageKey: "projects" },
      options,
    ),
    propertiesPage: createTemplatePageSlot(
      { label: "Properties", pageKey: "properties" },
      options,
    ),
    propertyDetailPage: createTemplatePageSlot<RouteSlugTemplatePageProps>(
      {
        label: "Property detail",
        pageKey: "property-detail",
        routeKind: "dynamic",
      },
      options,
    ),
    rentalsPage: createTemplatePageSlot(
      { label: "Rentals", pageKey: "rentals" },
      options,
    ),
    rentalDetailPage: createTemplatePageSlot<RouteSlugTemplatePageProps>(
      {
        label: "Rental detail",
        pageKey: "rental-detail",
        routeKind: "dynamic",
      },
      options,
    ),
    resourcesPage: createTemplatePageSlot(
      { label: "Resources", pageKey: "resources" },
      options,
    ),
    roadmapPage: createTemplatePageSlot(
      { label: "Roadmap", pageKey: "roadmap" },
      options,
    ),
    servicesPage: createTemplatePageSlot(
      { label: "Services", pageKey: "services" },
      options,
    ),
    tenantResourcesPage: createTemplatePageSlot(
      { label: "Tenant resources", pageKey: "tenant-resources" },
      options,
    ),
    tenantsPage: createTemplatePageSlot(
      { label: "Tenants", pageKey: "tenants" },
      options,
    ),
    termsPage: createTemplatePageSlot(
      { label: "Terms", pageKey: "terms" },
      options,
    ),
    testimonialsPage: createTemplatePageSlot(
      { label: "Testimonials", pageKey: "testimonials" },
      options,
    ),
    privacyPage: createTemplatePageSlot(
      { label: "Privacy", pageKey: "privacy" },
      options,
    ),
  };
}
