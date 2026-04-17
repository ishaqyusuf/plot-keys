import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { BarChart3, ImageIcon, StarIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardEmptyState } from "../../../../components/dashboard/dashboard-empty-state";
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
} from "../../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../../lib/session";
import {
  addPropertyMediaAction,
  deletePropertyMediaAction,
  setPropertyCoverAction,
  updatePropertyPublishStateAction,
} from "../../../actions";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

const publishVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  published: "default",
  archived: "secondary",
};

const kindLabels: Record<string, string> = {
  image: "Photo",
  floor_plan: "Floor plan",
  virtual_tour: "Virtual tour",
};

export default async function PropertyDetailPage({
  params,
  searchParams,
}: PropertyDetailPageProps) {
  const session = await requireOnboardedSession();
  const { id } = await params;
  const sp = (await searchParams) ?? {};

  const prisma = createPrismaClient().db;
  if (!prisma) return notFound();

  const property = await prisma.property.findFirst({
    where: {
      id,
      companyId: session.activeMembership.companyId,
      deletedAt: null,
    },
  });

  if (!property) return notFound();

  const media = await prisma.propertyMedia.findMany({
    where: { propertyId: id },
    orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [views30, views7, appointmentsCount] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        companyId: session.activeMembership.companyId,
        propertyId: id,
        eventType: "property_view",
        createdAt: { gte: since30 },
      },
    }),
    prisma.analyticsEvent.count({
      where: {
        companyId: session.activeMembership.companyId,
        propertyId: id,
        eventType: "property_view",
        createdAt: { gte: since7 },
      },
    }),
    prisma.appointment.count({
      where: {
        companyId: session.activeMembership.companyId,
        propertyId: id,
      },
    }),
  ]);

  const canEdit =
    session.activeMembership.role === "owner" ||
    session.activeMembership.role === "admin" ||
    session.activeMembership.role === "agent";

  return (
    <DashboardPage>
      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Listings workspace</DashboardPageEyebrow>
            <DashboardPageTitle>{property.title}</DashboardPageTitle>
            <DashboardPageDescription>
              {[property.location, property.price].filter(Boolean).join(" · ")}
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            {property.featured ? <Badge>Featured</Badge> : null}
            <Badge variant={publishVariant[property.publishState] ?? "outline"}>
              {property.publishState}
            </Badge>
            <Button asChild size="sm" variant="outline">
              <Link href="/properties">Back to properties</Link>
            </Button>
            {canEdit && property.publishState !== "published" ? (
              <form action={updatePropertyPublishStateAction}>
                <input type="hidden" name="propertyId" value={id} />
                <input type="hidden" name="publishState" value="published" />
                <Button size="sm" type="submit">
                  Publish
                </Button>
              </form>
            ) : null}
            {canEdit && property.publishState === "published" ? (
              <form action={updatePropertyPublishStateAction}>
                <input type="hidden" name="propertyId" value={id} />
                <input type="hidden" name="publishState" value="draft" />
                <Button size="sm" type="submit" variant="outline">
                  Unpublish
                </Button>
              </form>
            ) : null}
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-3">
        {[
          { label: "Views (30 days)", value: views30 },
          { label: "Views (7 days)", value: views7 },
          { label: "Appointments", value: appointmentsCount },
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

      {property.description ? (
        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Description</DashboardSectionTitle>
              <DashboardSectionDescription>
                Narrative and selling points for this property listing.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
            <CardContent className="px-6 py-6 text-sm leading-6 text-muted-foreground">
              {property.description}
            </CardContent>
          </Card>
        </DashboardSection>
      ) : null}

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Listing analytics</DashboardSectionTitle>
            <DashboardSectionDescription>
              Engagement signals and booking interest for this listing.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Engagement overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Views (30 days)", value: views30 },
              { label: "Views (7 days)", value: views7 },
              { label: "Appointments", value: appointmentsCount },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[calc(var(--radius-lg)+0.125rem)] border border-border/60 bg-background/55 p-4 text-center"
              >
                <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Media gallery</DashboardSectionTitle>
            <DashboardSectionDescription>
              Photos, floor plans, and virtual tours managed with the shared
              dashboard treatment.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {canEdit ? (
              <form
                action={addPropertyMediaAction}
                className="space-y-3 rounded-[calc(var(--radius-lg)+0.125rem)] border border-dashed border-border/70 bg-background/55 p-4"
              >
                <p className="text-sm font-medium text-foreground">Add media</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="property-media-url"
                      className="mb-1 block text-xs text-muted-foreground"
                    >
                      URL
                    </label>
                    <input
                      id="property-media-url"
                      name="url"
                      required
                      type="url"
                      placeholder="https://..."
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="property-media-kind"
                      className="mb-1 block text-xs text-muted-foreground"
                    >
                      Type
                    </label>
                    <select
                      id="property-media-kind"
                      name="kind"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="image">Photo</option>
                      <option value="floor_plan">Floor plan</option>
                      <option value="virtual_tour">Virtual tour</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      name="isCover"
                      value="true"
                      className="h-3.5 w-3.5"
                    />
                    Set as cover image
                  </label>
                  <Button size="sm" type="submit" variant="outline">
                    Add
                  </Button>
                </div>
                <input type="hidden" name="propertyId" value={id} />
              </form>
            ) : null}

            {media.length === 0 ? (
              <DashboardEmptyState
                title="No media yet"
                description="Add photos, floor plans, or virtual tour links to make the listing more complete."
                icon={<ImageIcon className="size-5" />}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-[calc(var(--radius-lg)+0.125rem)] border bg-background/55 ${
                      item.isCover
                        ? "border-primary ring-2 ring-primary/15"
                        : "border-border/70"
                    }`}
                  >
                    {item.kind === "image" || item.kind === "floor_plan" ? (
                      <div className="relative aspect-video bg-muted">
                        {/* biome-ignore lint/performance/noImgElement: existing remote media URLs vary by provider */}
                        <img
                          src={item.url}
                          alt={kindLabels[item.kind] ?? item.kind}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-muted">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary underline underline-offset-2"
                        >
                          Virtual tour ↗
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-1 px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-xs">
                          {kindLabels[item.kind] ?? item.kind}
                        </Badge>
                        {item.isCover ? (
                          <Badge className="text-xs">Cover</Badge>
                        ) : null}
                      </div>
                      {canEdit ? (
                        <div className="flex items-center gap-1">
                          {!item.isCover && item.kind === "image" ? (
                            <form action={setPropertyCoverAction}>
                              <input
                                type="hidden"
                                name="mediaId"
                                value={item.id}
                              />
                              <input
                                type="hidden"
                                name="propertyId"
                                value={id}
                              />
                              <button
                                type="submit"
                                title="Set as cover"
                                className="rounded p-1 text-muted-foreground hover:text-foreground"
                              >
                                <StarIcon className="size-3.5" />
                              </button>
                            </form>
                          ) : null}
                          <form action={deletePropertyMediaAction}>
                            <input
                              type="hidden"
                              name="mediaId"
                              value={item.id}
                            />
                            <input type="hidden" name="propertyId" value={id} />
                            <button
                              type="submit"
                              title="Remove"
                              className="rounded p-1 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2Icon className="size-3.5" />
                            </button>
                          </form>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardSection>
    </DashboardPage>
  );
}
