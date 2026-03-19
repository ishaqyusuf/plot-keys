import { createPrismaClient, findCompanyById } from "@plotkeys/db";
import {
  getPlanPricing,
  planPricingByTier,
  type BillingInterval,
  type PlanPricing,
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
import { Separator } from "@plotkeys/ui/separator";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireOnboardedSession } from "../../../lib/session";
import { initializeCheckoutAction } from "../../actions";

type BillingPageProps = {
  searchParams?: Promise<{ interval?: string; success?: string }>;
};

const tierFeatures: Record<string, string[]> = {
  plus: [
    "Everything in Starter",
    "Custom domain",
    "Estate management",
    "WhatsApp integration",
    "Customer accounts",
    "Website payments",
  ],
  pro: [
    "Everything in Plus",
    "All premium templates",
    "AI content tools",
    "Payment integrations",
    "Priority support",
  ],
  starter: [
    "1 free template",
    "Basic site builder",
    "Subdomain hosting",
    "Lead capture",
  ],
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const params = (await searchParams) ?? {};
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  const company = prisma
    ? await findCompanyById(prisma, session.activeMembership.companyId)
    : null;

  if (!company) redirect("/");

  const currentTier = (company.planTier ?? "starter") as
    | "starter"
    | "plus"
    | "pro";
  const currentStatus = company.planStatus ?? "active";
  const selectedInterval: BillingInterval =
    params.interval === "annual" ? "annual" : "monthly";

  const recentItems = prisma
    ? await prisma.billingLineItem.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        where: { companyId: company.id },
      })
    : [];

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Button asChild size="sm" variant="ghost">
                <Link href="/">← Dashboard</Link>
              </Button>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">
              Billing &amp; Plans
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your subscription and billing history.
            </p>
          </div>
        </div>

        {params.success === "1" && (
          <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CardContent className="py-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✓ Payment successful! Your plan has been updated.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Current plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Current Plan</CardTitle>
            <CardDescription>
              You are on the{" "}
              <strong className="capitalize">{currentTier}</strong> plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Badge
              variant={currentStatus === "active" ? "default" : "secondary"}
            >
              {currentStatus === "active"
                ? "Active"
                : currentStatus === "past_due"
                  ? "Past due"
                  : "Canceled"}
            </Badge>
            {company.planStartedAt && (
              <span className="text-xs text-muted-foreground">
                Since{" "}
                {new Intl.DateTimeFormat("en-NG", {
                  dateStyle: "medium",
                }).format(company.planStartedAt)}
              </span>
            )}
            {company.planEndsAt && (
              <span className="text-xs text-muted-foreground">
                · Ends{" "}
                {new Intl.DateTimeFormat("en-NG", {
                  dateStyle: "medium",
                }).format(company.planEndsAt)}
              </span>
            )}
          </CardContent>
        </Card>

        {/* Interval toggle */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Button
            asChild
            size="sm"
            variant={selectedInterval === "monthly" ? "default" : "outline"}
          >
            <Link href="/billing?interval=monthly">Monthly</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={selectedInterval === "annual" ? "default" : "outline"}
          >
            <Link href="/billing?interval=annual">
              Annual{" "}
              <Badge variant="secondary" className="ml-1">
                Save 20%
              </Badge>
            </Link>
          </Button>
        </div>

        {/* Plan cards */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {(["starter", "plus", "pro"] as const).map((tier) => {
            const pricing = getPlanPricing(tier);
            const price =
              selectedInterval === "monthly" ? pricing.monthly : pricing.annual;
            const isCurrent = tier === currentTier;
            const isUpgrade =
              ["starter", "plus", "pro"].indexOf(tier) >
              ["starter", "plus", "pro"].indexOf(currentTier);

            return (
              <Card
                key={tier}
                className={isCurrent ? "border-2 border-primary" : ""}
              >
                <CardHeader>
                  <CardTitle className="capitalize">{tier}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">
                      {price.formatted}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                    {(tierFeatures[tier] ?? []).map((feature) => (
                      <li key={feature}>✓ {feature}</li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button disabled variant="outline" className="w-full">
                      Current plan
                    </Button>
                  ) : tier === "starter" ? (
                    <Button disabled variant="outline" className="w-full">
                      Free
                    </Button>
                  ) : isUpgrade ? (
                    <form action={initializeCheckoutAction}>
                      <input type="hidden" name="planTier" value={tier} />
                      <input
                        type="hidden"
                        name="interval"
                        value={selectedInterval}
                      />
                      <Button type="submit" className="w-full">
                        Upgrade to {tier}
                      </Button>
                    </form>
                  ) : (
                    <Button disabled variant="outline" className="w-full">
                      Contact support
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Billing history */}
        <Separator className="my-8" />
        <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
          Billing History
        </h2>

        {recentItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No billing records yet.
          </p>
        ) : (
          <div className="space-y-2">
            {recentItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {item.kind.replace("_", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-NG", {
                        dateStyle: "medium",
                      }).format(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      ₦{(item.amountMinorUnits / 100).toLocaleString("en-NG")}
                    </span>
                    <Badge
                      variant={
                        item.status === "active"
                          ? "default"
                          : item.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
