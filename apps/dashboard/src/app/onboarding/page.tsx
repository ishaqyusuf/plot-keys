import { authRoutes } from "@plotkeys/auth/shared";
import { createPrismaClient } from "@plotkeys/db";
import {
  deriveProfile,
  scoreTemplates,
  templateCatalog,
} from "@plotkeys/section-registry";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Checkbox } from "@plotkeys/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { Textarea } from "@plotkeys/ui/textarea";
import { canAccessTemplateTier } from "@plotkeys/utils";
import { cookies } from "next/headers";
import Link from "next/link";
import { FlowShell } from "../../components/flow-shell";
import { OnboardingSignupNotification } from "../../components/onboarding-signup-notification";
import { requireAuthenticatedSession } from "../../lib/session";
import { readPendingOnboardingCookie } from "../../lib/session-cookie";
import {
  completeOnboardingAction,
  saveOnboardingStepAction,
} from "../actions";

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

type StepId =
  | "business-identity"
  | "market-focus"
  | "brand-style"
  | "contact-operations"
  | "content-readiness"
  | "launch";

const STEPS: { id: StepId; label: string }[] = [
  { id: "business-identity", label: "Business identity" },
  { id: "market-focus", label: "Market focus" },
  { id: "brand-style", label: "Brand style" },
  { id: "contact-operations", label: "Contact & operations" },
  { id: "content-readiness", label: "Content readiness" },
  { id: "launch", label: "Launch" },
];

function nextStep(current: StepId): StepId {
  const idx = STEPS.findIndex((s) => s.id === current);
  return STEPS[Math.min(idx + 1, STEPS.length - 1)].id;
}

function prevStepPath(current: StepId): string | null {
  const idx = STEPS.findIndex((s) => s.id === current);
  if (idx <= 0) return null;
  return `/onboarding?step=${STEPS[idx - 1].id}`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type OnboardingPageProps = {
  searchParams?: Promise<{
    company?: string;
    error?: string;
    signup?: string;
    step?: string;
    subdomain?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const session = await requireAuthenticatedSession();
  const params = (await searchParams) ?? {};

  if (session.activeMembership) {
    return (
      <meta content={`0;url=${authRoutes.dashboardHome}`} httpEquiv="refresh" />
    );
  }

  // Load saved onboarding state from DB (durable, survives cookie expiry)
  const prisma = createPrismaClient().db;
  const savedOnboarding = prisma
    ? await prisma.tenantOnboarding.findUnique({
        where: { userId: session.user.id },
      })
    : null;

  // Fall back to cookie for sessions that pre-date DB persistence
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);

  const companyName =
    savedOnboarding?.companyName ??
    pendingOnboarding?.company ??
    params.company ??
    "";
  const subdomain =
    savedOnboarding?.subdomain ??
    pendingOnboarding?.subdomain ??
    params.subdomain ??
    "";

  // Resolve which step to show
  const rawStep = params.step ?? savedOnboarding?.currentStep ?? "business-identity";
  const validStepIds = STEPS.map((s) => s.id);
  const currentStepId: StepId = (
    validStepIds.includes(rawStep as StepId) ? rawStep : "business-identity"
  ) as StepId;

  const currentStepIdx = STEPS.findIndex((s) => s.id === currentStepId);
  const backPath = prevStepPath(currentStepId);
  const next = nextStep(currentStepId);

  const starterTemplates = templateCatalog.filter((t) =>
    canAccessTemplateTier("starter", t.tier),
  );

  // Build template recommendations from saved profile (or freshly derived if step data exists)
  const recommendations =
    currentStepId === "launch"
      ? scoreTemplates(
          deriveProfile({
            businessType: savedOnboarding?.businessType,
            companyName: savedOnboarding?.companyName,
            hasBlogContent: savedOnboarding?.hasBlogContent,
            hasAgents: savedOnboarding?.hasAgents,
            hasExistingContent: savedOnboarding?.hasExistingContent,
            hasListings: savedOnboarding?.hasListings,
            hasLogo: savedOnboarding?.hasLogo,
            hasProjects: savedOnboarding?.hasProjects,
            hasTestimonials: savedOnboarding?.hasTestimonials,
            locations: savedOnboarding?.locations,
            primaryGoal: savedOnboarding?.primaryGoal,
            propertyTypes: savedOnboarding?.propertyTypes,
            stylePreference: savedOnboarding?.stylePreference,
            tagline: savedOnboarding?.tagline,
            targetAudience: savedOnboarding?.targetAudience,
            tone: savedOnboarding?.tone,
          }),
          starterTemplates,
        )
      : [];

  return (
    <>
      <OnboardingSignupNotification
        companyName={companyName || session.user.name || ""}
        dashboardHostname={
          subdomain ? `dashboard.${subdomain}.plotkeys.com` : ""
        }
        email={session.user.email ?? "owner@plotkeys.app"}
        fullName={session.user.name ?? "Workspace owner"}
        show={params.signup === "successful"}
        siteHostname={subdomain ? `${subdomain}.plotkeys.com` : ""}
        subdomain={subdomain}
      />
      <FlowShell
        badge={`Step ${currentStepIdx + 1} of ${STEPS.length}`}
        description={stepDescription(currentStepId)}
        sidePanel={
          <StepSidePanel
            companyName={companyName}
            currentStepId={currentStepId}
            subdomain={subdomain}
          />
        }
        title={stepTitle(currentStepId)}
      >
        {params.error ? (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {currentStepId === "business-identity" && (
          <BusinessIdentityStep
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "market-focus" && (
          <MarketFocusStep
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "brand-style" && (
          <BrandStyleStep
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "contact-operations" && (
          <ContactOperationsStep
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "content-readiness" && (
          <ContentReadinessStep
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "launch" && (
          <LaunchStep
            backPath={backPath}
            companyName={companyName}
            recommendations={recommendations}
            saved={savedOnboarding}
            starterTemplates={starterTemplates}
            subdomain={subdomain}
          />
        )}
      </FlowShell>
    </>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stepTitle(step: StepId): string {
  switch (step) {
    case "business-identity":
      return "Tell us about your business.";
    case "market-focus":
      return "Where do you operate?";
    case "brand-style":
      return "What's your brand personality?";
    case "contact-operations":
      return "How do clients reach you?";
    case "content-readiness":
      return "What content do you already have?";
    case "launch":
      return "Choose your template and launch.";
  }
}

function stepDescription(step: StepId): string {
  switch (step) {
    case "business-identity":
      return "We use this to shape your website copy, section headings, and the overall story your site tells.";
    case "market-focus":
      return "Your market focus helps us recommend the right sections and pre-populate your listings area.";
    case "brand-style":
      return "Your tone and style guide the design system, color palette, and typography defaults we apply to your site.";
    case "contact-operations":
      return "These details pre-fill your contact page, footer, and inquiry CTA so your site is ready from day one.";
    case "content-readiness":
      return "Knowing what you already have helps us hide empty sections and decide where to generate placeholder content.";
    case "launch":
      return "Pick the market you primarily serve and a starting template. Your workspace, domain records, and first site will be created immediately.";
  }
}

// ---------------------------------------------------------------------------
// Side panel
// ---------------------------------------------------------------------------

type StepSidePanelProps = {
  companyName: string;
  currentStepId: StepId;
  subdomain: string;
};

function StepSidePanel({
  companyName,
  currentStepId,
  subdomain,
}: StepSidePanelProps) {
  return (
    <>
      <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
        Onboarding checklist
      </p>
      <div className="mt-6 grid gap-3">
        {STEPS.map((step) => {
          const currentIdx = STEPS.findIndex((s) => s.id === currentStepId);
          const stepIdx = STEPS.findIndex((s) => s.id === step.id);
          const isDone = stepIdx < currentIdx;
          const isCurrent = step.id === currentStepId;

          return (
            <div
              key={step.id}
              className={`rounded-[calc(var(--radius-md)-0.1rem)] border px-4 py-3 text-sm leading-7 ${
                isCurrent
                  ? "border-primary-foreground/30 bg-primary-foreground/20 text-primary-foreground"
                  : isDone
                    ? "border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground/50 line-through"
                    : "border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground/40"
              }`}
            >
              <span className="mr-2 text-primary-foreground/60">
                0{STEPS.findIndex((s) => s.id === step.id) + 1}
              </span>
              {step.label}
            </div>
          );
        })}
      </div>
      {companyName && subdomain ? (
        <div className="mt-8 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-4 text-sm text-primary-foreground/70">
          <p className="font-medium text-primary-foreground/90">{companyName}</p>
          <p className="mt-1">{subdomain}.plotkeys.com</p>
        </div>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

type NavButtonsProps = {
  backPath: string | null;
  submitLabel?: string;
};

function NavButtons({ backPath, submitLabel = "Continue" }: NavButtonsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button type="submit">{submitLabel}</Button>
      {backPath ? (
        <Button asChild variant="secondary">
          <Link href={backPath}>Back</Link>
        </Button>
      ) : (
        <Button asChild variant="secondary">
          <Link href={authRoutes.signOut}>Cancel</Link>
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Business Identity
// ---------------------------------------------------------------------------

type SavedOnboarding = Awaited<
  ReturnType<NonNullable<ReturnType<typeof createPrismaClient>["db"]>["tenantOnboarding"]["findUnique"]>
>;

function BusinessIdentityStep({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboarding;
}) {
  return (
    <form action={saveOnboardingStepAction} className="flex flex-col gap-6">
      <input type="hidden" name="currentStep" value="business-identity" />
      <input type="hidden" name="nextStep" value={nextStep} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="businessType">Business type</FieldLabel>
          <Select defaultValue={saved?.businessType ?? ""} name="businessType">
            <SelectTrigger className="w-full" id="businessType">
              <SelectValue placeholder="Choose business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="residential-sales">Residential Sales</SelectItem>
                <SelectItem value="residential-rentals">Residential Rentals</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="mixed">Mixed / General</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>
            The primary category that best describes your real estate business.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="primaryGoal">Primary goal</FieldLabel>
          <Select defaultValue={saved?.primaryGoal ?? ""} name="primaryGoal">
            <SelectTrigger className="w-full" id="primaryGoal">
              <SelectValue placeholder="What do you want most from your site?" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="generate-leads">Generate leads</SelectItem>
                <SelectItem value="showcase-listings">Showcase listings</SelectItem>
                <SelectItem value="build-brand">Build brand authority</SelectItem>
                <SelectItem value="all-of-above">All of the above</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="tagline">Tagline (optional)</FieldLabel>
          <Input
            defaultValue={saved?.tagline ?? ""}
            id="tagline"
            name="tagline"
            placeholder="Your trusted real estate partner"
          />
          <FieldDescription>
            A short phrase that will appear under your company name in hero sections.
          </FieldDescription>
        </Field>
      </FieldGroup>
      <NavButtons backPath={backPath} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Market Focus
// ---------------------------------------------------------------------------

const PROPERTY_TYPE_OPTIONS = [
  { label: "Apartments", value: "apartments" },
  { label: "Houses", value: "houses" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
  { label: "Luxury", value: "luxury" },
  { label: "Short-let", value: "shortlet" },
];

function MarketFocusStep({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboarding;
}) {
  const savedLocations = saved?.locations?.join(", ") ?? "";
  const savedPropertyTypes = new Set(saved?.propertyTypes ?? []);

  return (
    <form action={saveOnboardingStepAction} className="flex flex-col gap-6">
      <input type="hidden" name="currentStep" value="market-focus" />
      <input type="hidden" name="nextStep" value={nextStep} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="locations">Locations you serve</FieldLabel>
          <Input
            defaultValue={savedLocations}
            id="locations"
            name="locations"
            placeholder="Lekki, Victoria Island, Ikoyi"
          />
          <FieldDescription>
            Comma-separated list of cities, neighbourhoods, or regions.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Property types</FieldLabel>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PROPERTY_TYPE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition hover:border-primary"
              >
                <Checkbox
                  defaultChecked={savedPropertyTypes.has(opt.value)}
                  name="propertyTypes"
                  value={opt.value}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <FieldDescription>
            Select all property categories you handle. These guide which listing sections appear.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="targetAudience">Target audience (optional)</FieldLabel>
          <Input
            defaultValue={saved?.targetAudience ?? ""}
            id="targetAudience"
            name="targetAudience"
            placeholder="First-time buyers, investors, diaspora clients"
          />
        </Field>
      </FieldGroup>
      <NavButtons backPath={backPath} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Brand Style
// ---------------------------------------------------------------------------

function BrandStyleStep({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboarding;
}) {
  return (
    <form action={saveOnboardingStepAction} className="flex flex-col gap-6">
      <input type="hidden" name="currentStep" value="brand-style" />
      <input type="hidden" name="nextStep" value={nextStep} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="tone">Brand tone</FieldLabel>
          <Select defaultValue={saved?.tone ?? ""} name="tone">
            <SelectTrigger className="w-full" id="tone">
              <SelectValue placeholder="Choose a tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly & approachable</SelectItem>
                <SelectItem value="luxury">Luxury & exclusive</SelectItem>
                <SelectItem value="modern">Modern & bold</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>
            Shapes the language and voice used in AI-generated copy.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="stylePreference">Visual style</FieldLabel>
          <Select
            defaultValue={saved?.stylePreference ?? ""}
            name="stylePreference"
          >
            <SelectTrigger className="w-full" id="stylePreference">
              <SelectValue placeholder="Choose a visual style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="minimal">Minimal & clean</SelectItem>
                <SelectItem value="bold">Bold & expressive</SelectItem>
                <SelectItem value="classic">Classic & timeless</SelectItem>
                <SelectItem value="modern">Modern & geometric</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>
            Guides the spacing, typography weight, and layout density of your site.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="preferredColorHint">Colour preference (optional)</FieldLabel>
          <Input
            defaultValue={saved?.preferredColorHint ?? ""}
            id="preferredColorHint"
            name="preferredColorHint"
            placeholder="Deep navy, warm gold, forest green…"
          />
          <FieldDescription>
            A colour name or feeling — we'll translate it into a palette.
          </FieldDescription>
        </Field>
      </FieldGroup>
      <NavButtons backPath={backPath} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Contact And Operations
// ---------------------------------------------------------------------------

function ContactOperationsStep({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboarding;
}) {
  return (
    <form action={saveOnboardingStepAction} className="flex flex-col gap-6">
      <input type="hidden" name="currentStep" value="contact-operations" />
      <input type="hidden" name="nextStep" value={nextStep} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="phone">Phone number</FieldLabel>
          <Input
            defaultValue={saved?.phone ?? ""}
            id="phone"
            name="phone"
            placeholder="+234 801 234 5678"
            type="tel"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contactEmail">Business email</FieldLabel>
          <Input
            defaultValue={saved?.contactEmail ?? ""}
            id="contactEmail"
            name="contactEmail"
            placeholder="hello@yourcompany.com"
            type="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="whatsapp">WhatsApp number (optional)</FieldLabel>
          <Input
            defaultValue={saved?.whatsapp ?? ""}
            id="whatsapp"
            name="whatsapp"
            placeholder="+234 801 234 5678"
            type="tel"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="officeAddress">Office address (optional)</FieldLabel>
          <Textarea
            defaultValue={saved?.officeAddress ?? ""}
            id="officeAddress"
            name="officeAddress"
            placeholder="5 Marina Road, Victoria Island, Lagos"
            rows={3}
          />
        </Field>
      </FieldGroup>
      <NavButtons backPath={backPath} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 5: Content Readiness
// ---------------------------------------------------------------------------

const CONTENT_FLAGS = [
  { description: "You have a logo file ready to upload.", label: "I have a logo", name: "hasLogo" },
  { description: "You have active property listings to add.", label: "I have listings ready", name: "hasListings" },
  { description: "You have written content such as an about section.", label: "I have existing written content", name: "hasExistingContent" },
  { description: "You have agent profiles to add to the site.", label: "I have agents to feature", name: "hasAgents" },
  { description: "You have completed projects or case studies.", label: "I have project case studies", name: "hasProjects" },
  { description: "You have client reviews or recommendations.", label: "I have testimonials", name: "hasTestimonials" },
  { description: "You plan to publish blog or market insight articles.", label: "I plan to publish blog content", name: "hasBlogContent" },
] as const;

function ContentReadinessStep({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboarding;
}) {
  return (
    <form action={saveOnboardingStepAction} className="flex flex-col gap-6">
      <input type="hidden" name="currentStep" value="content-readiness" />
      <input type="hidden" name="nextStep" value={nextStep} />
      <div className="grid gap-3">
        {CONTENT_FLAGS.map((flag) => (
          <label
            key={flag.name}
            className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-4 py-3 text-sm transition hover:border-primary"
          >
            <Checkbox
              className="mt-0.5"
              defaultChecked={Boolean(saved?.[flag.name as keyof typeof saved])}
              name={flag.name}
            />
            <span>
              <span className="block font-medium text-foreground">{flag.label}</span>
              <span className="block text-muted-foreground">{flag.description}</span>
            </span>
          </label>
        ))}
      </div>
      <NavButtons backPath={backPath} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 6: Launch
// ---------------------------------------------------------------------------

function LaunchStep({
  backPath,
  companyName,
  recommendations,
  saved,
  starterTemplates,
  subdomain,
}: {
  backPath: string | null;
  companyName: string;
  recommendations: ReturnType<typeof scoreTemplates>;
  saved: SavedOnboarding;
  starterTemplates: typeof templateCatalog;
  subdomain: string;
}) {
  const savedMarket = saved?.market ?? "";
  // Prefer: user's saved explicit choice → top recommendation → DB saved recommendation → fallback
  const topRecommendedKey = recommendations[0]?.template.key;
  const defaultTemplateKey =
    saved?.templateKey ?? topRecommendedKey ?? saved?.recommendedTemplateKey ?? "template-1";

  return (
    <form action={completeOnboardingAction} className="flex flex-col gap-6">
      <Card className="border-border/60 bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reserved during signup</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Company</p>
            <p>{companyName || "Not available yet"}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Website</p>
            <p>
              {subdomain ? `${subdomain}.plotkeys.com` : "Not available yet"}
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Dashboard</p>
            <p>
              {subdomain
                ? `dashboard.${subdomain}.plotkeys.com`
                : "Not available yet"}
            </p>
          </div>
        </CardContent>
      </Card>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="launch-market">Primary market</FieldLabel>
          <Input
            defaultValue={savedMarket}
            id="launch-market"
            name="market"
            placeholder="Lekki, Lagos"
            required
          />
          <FieldDescription>
            The city or region you serve most — used in your hero section and SEO.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="launch-template">Starting template</FieldLabel>
          {recommendations.length > 0 ? (
            <div className="grid gap-2">
              {recommendations.map((rec, i) => (
                <label
                  key={rec.template.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 text-sm transition ${
                    rec.template.key === defaultTemplateKey
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    className="mt-0.5 accent-primary"
                    defaultChecked={rec.template.key === defaultTemplateKey}
                    name="template"
                    type="radio"
                    value={rec.template.key}
                  />
                  <span>
                    <span className="block font-medium text-foreground">
                      {rec.template.name}
                      {i === 0 && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          Recommended
                        </span>
                      )}
                    </span>
                    <span className="block text-muted-foreground">
                      {rec.reason}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <Select defaultValue={defaultTemplateKey} name="template">
              <SelectTrigger className="w-full" id="launch-template">
                <SelectValue placeholder="Choose a starter template" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {starterTemplates.map((template) => (
                    <SelectItem key={template.key} value={template.key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <FieldDescription>
            Start from a predefined section layout — still fully editable in the builder.
          </FieldDescription>
        </Field>
      </FieldGroup>

      {saved?.businessSummary ? (
        <Card className="border-border/60 bg-muted/20">
          <CardContent className="px-4 py-3 text-sm text-muted-foreground">
            <span className="mr-1 font-medium text-foreground">Your profile:</span>
            {saved.businessSummary}
          </CardContent>
        </Card>
      ) : null}

      {!companyName || !subdomain ? (
        <Alert variant="destructive">
          <AlertDescription>
            Your reserved company details are missing. Please restart from
            signup so onboarding can finish workspace setup.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={!companyName || !subdomain} type="submit">
          Launch my workspace
        </Button>
        {backPath ? (
          <Button asChild variant="secondary">
            <Link href={backPath}>Back</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
