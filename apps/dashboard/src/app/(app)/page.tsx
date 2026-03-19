import {
  countLeadsByStatus,
  createPrismaClient,
  findCompanyById,
} from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { resolvePlanEntitlements } from "@plotkeys/utils";
import {
  BarChart3Icon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  LayoutTemplateIcon,
  LockIcon,
  MessageCircleIcon,
  PenLineIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { requireOnboardedSession } from "../../lib/session";
import { ensureBuilderConfigurationExists } from "../actions";

type FeatureStatus = "live" | "partial" | "plus" | "pro" | "coming";

type RoadmapFeature = {
  description: string;
  href?: string;
  label: string;
  status: FeatureStatus;
};

const statusConfig: Record<
  FeatureStatus,
  {
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    variant: "default" | "outline" | "secondary";
  }
> = {
  coming: {
    color: "text-muted-foreground",
    icon: CircleDashedIcon,
    label: "Coming soon",
    variant: "outline",
  },
  live: {
    color: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2Icon,
    label: "Live",
    variant: "default",
  },
  partial: {
    color: "text-amber-600 dark:text-amber-400",
    icon: PenLineIcon,
    label: "Partial",
    variant: "secondary",
  },
  plus: {
    color: "text-blue-600 dark:text-blue-400",
    icon: LockIcon,
    label: "Plus",
    variant: "outline",
  },
  pro: {
    color: "text-purple-600 dark:text-purple-400",
    icon: SparklesIcon,
    label: "Pro",
    variant: "outline",
  },
};

function StatCard({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <Link href={href}>
      <Card className="h-full cursor-pointer bg-card transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-0.5 text-2xl font-semibold text-foreground">
              {value}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function AppHomePage() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  await ensureBuilderConfigurationExists();

  const prisma = createPrismaClient().db;

  const [company, propertyCount, agentCount, leadStats, appointmentCount, publishedConfig] =
    await Promise.all([
      prisma ? findCompanyById(prisma, companyId) : null,
      prisma?.property.count({
        where: { companyId, deletedAt: null },
      }),
      prisma?.agent.count({
        where: { companyId, deletedAt: null },
      }),
      prisma ? countLeadsByStatus(prisma, companyId) : null,
      prisma?.appointment.count({
        where: { companyId },
      }),
      prisma?.siteConfiguration.findFirst({
        orderBy: { updatedAt: "desc" },
        select: { name: true, status: true, updatedAt: true },
        where: { companyId, deletedAt: null, status: "published" },
      }),
    ]);

  const planTier = company?.planTier ?? "starter";
  const entitlements = resolvePlanEntitlements(planTier);

  const siteUrl = `https://${session.activeMembership.companySlug}.plotkeys.com`;
  const livePreviewUrl = `/live?subdomain=${session.activeMembership.companySlug}`;

  const roadmapSections: { features: RoadmapFeature[]; title: string }[] = [
    {
      title: "Website",
      features: [
        {
          description: "Build and publish your website from 45+ templates.",
          href: "/builder",
          label: "Site builder",
          status: "live",
        },
        {
          description: "Preview your live site in the dashboard.",
          href: livePreviewUrl,
          label: "Site preview",
          status: "live",
        },
        {
          description: "Provision your free plotkeys.com subdomain.",
          href: "/domains",
          label: "Subdomain hosting",
          status: "live",
        },
        {
          description:
            "Connect a custom domain to your site (Plus plan required).",
          href: "/domains",
          label: "Custom domain",
          status: "plus",
        },
        {
          description:
            "Manage per-page SEO titles, descriptions, and OG images.",
          label: "SEO & meta tags",
          status: "coming",
        },
      ],
    },
    {
      title: "Operations",
      features: [
        {
          description: "Add, manage, and feature your property listings.",
          href: "/properties",
          label: "Properties",
          status: "live",
        },
        {
          description: "Manage your agents and show them on your public site.",
          href: "/agents",
          label: "Agents",
          status: "live",
        },
        {
          description: "Capture and track inbound leads from your website.",
          href: "/leads",
          label: "Lead capture",
          status: "live",
        },
        {
          description: "Schedule and manage property viewings and meetings.",
          href: "/appointments",
          label: "Appointments",
          status: "live",
        },
        {
          description:
            "Let customers manage their properties and payments (Plus plan required).",
          label: "Customer portal",
          status: "plus",
        },
      ],
    },
    {
      title: "Analytics & AI",
      features: [
        {
          description: "Track page views, unique visitors, and events.",
          href: "/analytics",
          label: "Analytics",
          status: "live",
        },
        {
          description:
            "Use AI to generate website copy and property descriptions.",
          href: "/ai-credits",
          label: "AI content tools",
          status: "pro",
        },
        {
          description:
            "Answer visitor questions with an AI-powered chat widget.",
          label: "AI chat-bot",
          status: "coming",
        },
      ],
    },
    {
      title: "Platform",
      features: [
        {
          description:
            "Manage subscription, plan upgrades, and billing history.",
          href: "/billing",
          label: "Billing",
          status: "live",
        },
        {
          description: "Upload your company logo and configure branding.",
          href: "/settings",
          label: "Branding & logo",
          status: "live",
        },
        {
          description:
            "Connect WhatsApp, Google Analytics, and other app integrations.",
          label: "App store",
          status: "coming",
        },
        {
          description:
            "Send automated emails for leads, appointments, and billing events.",
          label: "Email notifications",
          status: "partial",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {session.activeMembership.companyName}
              </h1>
              <Badge variant="outline" className="capitalize">
                {planTier}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {publishedConfig
                ? `Site published — last updated ${new Date(publishedConfig.updatedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`
                : "No site published yet — open the builder to get started."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link href={siteUrl} target="_blank">
                <ExternalLinkIcon className="size-3.5" />
                View site
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/builder">
                <LayoutTemplateIcon className="size-3.5" />
                Open builder
              </Link>
            </Button>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            href="/properties"
            icon={BuildingIcon}
            label="Properties"
            value={propertyCount ?? 0}
          />
          <StatCard
            href="/agents"
            icon={BriefcaseIcon}
            label="Agents"
            value={agentCount ?? 0}
          />
          <StatCard
            href="/leads"
            icon={MessageCircleIcon}
            label="New leads"
            value={leadStats?.new ?? 0}
          />
          <StatCard
            href="/appointments"
            icon={CalendarIcon}
            label="Appointments"
            value={appointmentCount ?? 0}
          />
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              description: "Edit template, content, and publish your site.",
              href: "/builder",
              icon: LayoutTemplateIcon,
              label: "Site builder",
            },
            {
              description: "Track page views and visitor behaviour.",
              href: "/analytics",
              icon: BarChart3Icon,
              label: "Analytics",
            },
            {
              description: "View and manage all inbound leads.",
              href: "/leads",
              icon: MessageCircleIcon,
              label: "Leads",
            },
            {
              description: "Manage your subscription and billing.",
              href: "/billing",
              icon: CreditCardIcon,
              label: "Billing",
            },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="h-full cursor-pointer border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader className="pb-1 pt-4 px-4">
                  <div className="flex items-center gap-2">
                    <action.icon className="size-4 text-primary" />
                    <CardTitle className="text-sm">{action.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <CardDescription className="text-xs">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Plan entitlements summary */}
        {planTier === "starter" && (
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  Upgrade to unlock more features
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Custom domains, customer portal, WhatsApp integration, and AI
                  tools are available on Plus and Pro plans.
                </p>
              </div>
              <Button asChild size="sm">
                <Link href="/billing">View plans</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Platform roadmap */}
        <div className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Platform features
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                What&apos;s live, what&apos;s coming, and what&apos;s on your
                plan.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2Icon className="size-3.5 text-emerald-500" />
                Live
              </span>
              <span className="flex items-center gap-1">
                <LockIcon className="size-3.5 text-blue-500" />
                Plan-gated
              </span>
              <span className="flex items-center gap-1">
                <CircleDashedIcon className="size-3.5" />
                Coming
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {roadmapSections.map((section) => (
              <Card key={section.title} className="bg-card">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-0.5 px-5 pb-5">
                  {section.features.map((feature) => {
                    const cfg = statusConfig[feature.status];
                    const isPlanGated =
                      (feature.status === "plus" &&
                        !entitlements.features.customDomains) ||
                      (feature.status === "pro" &&
                        !entitlements.features.aiTools);

                    const content = (
                      <div
                        key={feature.label}
                        className="flex items-start justify-between gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-start gap-2.5">
                          <cfg.icon
                            className={`mt-0.5 size-4 shrink-0 ${cfg.color}`}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground leading-tight">
                              {feature.label}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5">
                          <Badge
                            variant={cfg.variant}
                            className="text-xs shrink-0"
                          >
                            {cfg.label}
                          </Badge>
                        </div>
                      </div>
                    );

                    if (feature.href && feature.status === "live") {
                      return (
                        <Link key={feature.label} href={feature.href}>
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <div key={feature.label} className={isPlanGated ? "opacity-60" : undefined}>
                        {content}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
