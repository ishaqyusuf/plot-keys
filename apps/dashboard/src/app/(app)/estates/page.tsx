import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { MapIcon } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardPage,
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
  DashboardStatGrid,
} from "../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../lib/session";
import { CreateEstateForm } from "./create-estate-form";

type EstatesPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const publishVariant: Record<string, "default" | "outline" | "secondary"> = {
  archived: "secondary",
  draft: "outline",
  published: "default",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function EstatesPage({ searchParams }: EstatesPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const prisma = createPrismaClient().db;
  const estates = prisma
    ? await prisma.estate.findMany({
        include: {
          _count: {
            select: {
              plots: { where: { deletedAt: null } },
              properties: { where: { deletedAt: null } },
              reservations: true,
            },
          },
        },
        orderBy: [{ createdAt: "desc" }],
        where: {
          companyId: session.activeMembership.companyId,
          deletedAt: null,
        },
      })
    : [];

  const totalPlots = estates.reduce(
    (sum, estate) => sum + estate._count.properties,
    0,
  );
  const totalReservations = estates.reduce(
    (sum, estate) => sum + estate._count.reservations,
    0,
  );
  const publishedCount = estates.filter(
    (estate) => estate.publishState === "published",
  ).length;

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Listings</DashboardPageEyebrow>
            <DashboardPageTitle>Estate launches</DashboardPageTitle>
            <DashboardPageDescription>
              Group land listings into presale launches with plan import,
              availability tracking, and customer purchase workflows.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild size="sm" variant="outline">
              <Link href="/properties?type=land">View land listings</Link>
            </Button>
            <CreateEstateForm />
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-4">
        {[
          { label: "Estate launches", value: estates.length },
          { label: "Published", value: publishedCount },
          { label: "Estate listings", value: totalPlots },
          { label: "Purchase requests", value: totalReservations },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/70 bg-card/82">
            <CardContent className="px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </DashboardStatGrid>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Launches</DashboardSectionTitle>
            <DashboardSectionDescription>
              Estate presales sit inside Listings as grouped land inventory. The
              launch workspace keeps flyer copy, uploads, offers, and purchase
              requests together.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        {estates.length === 0 ? (
          <DashboardEmptyState
            title="No estate launches yet"
            description="Create an estate launch when you want to group land listings around a presale deal and estate plan."
            icon={<MapIcon className="size-5" />}
            actions={<CreateEstateForm />}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {estates.map((estate) => (
              <Card key={estate.id} className="border-border/70 bg-card/82">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {estate.title}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {estate.location ?? "No location"}
                      </p>
                    </div>
                    <Badge
                      variant={publishVariant[estate.publishState] ?? "outline"}
                    >
                      {estate.publishState}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {estate.description ? (
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {estate.description}
                    </p>
                  ) : null}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <p className="font-medium text-foreground">
                        {estate._count.plots}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        mapped plots
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <p className="font-medium text-foreground">
                        {estate._count.properties}
                      </p>
                      <p className="text-xs text-muted-foreground">listings</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(estate.createdAt)}
                    </p>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/estates/${estate.slug}`}>Open</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
