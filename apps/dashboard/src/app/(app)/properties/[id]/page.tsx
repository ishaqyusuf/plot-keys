import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import {
  BarChart3,
  ImageIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addPropertyMediaAction,
  deletePropertyMediaAction,
  setPropertyCoverAction,
  updatePropertyPublishStateAction,
} from "../../../actions";
import { requireOnboardedSession } from "../../../../lib/session";
import { PropertyDescriptionGenerator } from "../../../../components/properties/property-description-generator";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

const publishVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
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

  // Property-level analytics
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
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl">
        {sp.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{sp.error}</AlertDescription>
          </Alert>
        ) : null}

        {/* Header */}
        <div className="mb-8">
          <Button asChild size="sm" variant="ghost">
            <Link href="/properties">← Properties</Link>
          </Button>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-3xl font-semibold text-foreground">
                  {property.title}
                </h1>
                {property.featured && <Badge>Featured</Badge>}
                <Badge variant={publishVariant[property.publishState] ?? "outline"}>
                  {property.publishState}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {[property.location, property.price].filter(Boolean).join(" · ")}
                {property.bedrooms || property.bathrooms ? (
                  <span>
                    {" · "}
                    {[
                      property.bedrooms ? `${property.bedrooms} bed` : null,
                      property.bathrooms ? `${property.bathrooms} bath` : null,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                ) : null}
              </p>
            </div>

            {/* Publish state controls */}
            {canEdit ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {property.publishState !== "published" ? (
                  <form action={updatePropertyPublishStateAction}>
                    <input type="hidden" name="propertyId" value={id} />
                    <input type="hidden" name="publishState" value="published" />
                    <Button size="sm" type="submit">
                      Publish
                    </Button>
                  </form>
                ) : null}
                {property.publishState === "published" ? (
                  <form action={updatePropertyPublishStateAction}>
                    <input type="hidden" name="propertyId" value={id} />
                    <input type="hidden" name="publishState" value="draft" />
                    <Button size="sm" type="submit" variant="outline">
                      Unpublish
                    </Button>
                  </form>
                ) : null}
                {property.publishState !== "archived" ? (
                  <form action={updatePropertyPublishStateAction}>
                    <input type="hidden" name="propertyId" value={id} />
                    <input type="hidden" name="publishState" value="archived" />
                    <Button
                      size="sm"
                      type="submit"
                      variant="ghost"
                      className="text-muted-foreground"
                    >
                      Archive
                    </Button>
                  </form>
                ) : null}
                {property.publishState === "archived" ? (
                  <form action={updatePropertyPublishStateAction}>
                    <input type="hidden" name="propertyId" value={id} />
                    <input type="hidden" name="publishState" value="draft" />
                    <Button size="sm" type="submit" variant="outline">
                      Restore to draft
                    </Button>
                  </form>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <CardTitle className="text-base">Description</CardTitle>
            {canEdit ? (
              <PropertyDescriptionGenerator propertyId={id} />
            ) : null}
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {property.description ? (
              property.description
            ) : (
              <p className="italic">No description yet. Use AI to generate one or edit the property to add one manually.</p>
            )}
          </CardContent>
        </Card>

        {/* Analytics Card */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Listing Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">{views30}</p>
                <p className="text-xs text-muted-foreground">Views (30 days)</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">{views7}</p>
                <p className="text-xs text-muted-foreground">Views (7 days)</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">{appointmentsCount}</p>
                <p className="text-xs text-muted-foreground">Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media gallery */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Media</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {media.length} item{media.length !== 1 ? "s" : ""}
                {" · "}photos, floor plans, virtual tour links
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add media form */}
            {canEdit ? (
              <form action={addPropertyMediaAction} className="space-y-3 rounded-lg border border-dashed border-input p-4">
                <p className="text-sm font-medium text-foreground">Add media</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      URL
                    </label>
                    <input
                      name="url"
                      required
                      type="url"
                      placeholder="https://..."
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Type
                    </label>
                    <select
                      name="kind"
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                    >
                      <option value="image">Photo</option>
                      <option value="floor_plan">Floor plan</option>
                      <option value="virtual_tour">Virtual tour</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" name="isCover" value="true" className="h-3.5 w-3.5" />
                    Set as cover image
                  </label>
                  <Button size="sm" type="submit" variant="outline">
                    Add
                  </Button>
                </div>
                <input type="hidden" name="propertyId" value={id} />
              </form>
            ) : null}

            {/* Media grid */}
            {media.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No media yet. Add photos, floor plans, or virtual tour links.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {media.map((m) => (
                  <div
                    key={m.id}
                    className={`group relative overflow-hidden rounded-lg border ${m.isCover ? "border-primary ring-2 ring-primary/20" : "border-input"}`}
                  >
                    {m.kind === "image" || m.kind === "floor_plan" ? (
                      <div className="relative aspect-video bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.url}
                          alt={kindLabels[m.kind] ?? m.kind}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-muted">
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary underline underline-offset-2"
                        >
                          Virtual tour ↗
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-xs">
                          {kindLabels[m.kind] ?? m.kind}
                        </Badge>
                        {m.isCover && (
                          <Badge className="text-xs">Cover</Badge>
                        )}
                      </div>
                      {canEdit ? (
                        <div className="flex items-center gap-1">
                          {!m.isCover && m.kind === "image" ? (
                            <form action={setPropertyCoverAction}>
                              <input type="hidden" name="mediaId" value={m.id} />
                              <input type="hidden" name="propertyId" value={id} />
                              <button
                                type="submit"
                                title="Set as cover"
                                className="rounded p-1 text-muted-foreground hover:text-foreground"
                              >
                                <StarIcon className="h-3.5 w-3.5" />
                              </button>
                            </form>
                          ) : null}
                          <form action={deletePropertyMediaAction}>
                            <input type="hidden" name="mediaId" value={m.id} />
                            <input type="hidden" name="propertyId" value={id} />
                            <button
                              type="submit"
                              title="Remove"
                              className="rounded p-1 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2Icon className="h-3.5 w-3.5" />
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
      </div>
    </main>
  );
}
