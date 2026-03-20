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
import Link from "next/link";
import { requireOnboardedSession } from "../../../lib/session";
import {
  deletePropertyAction,
  togglePropertyFeaturedAction,
} from "../../actions";
import { PropertyForm } from "./property-form";

type PropertiesPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const statusVariant: Record<string, "default" | "outline" | "secondary"> = {
  active: "default",
  off_market: "outline",
  rented: "secondary",
  sold: "outline",
};

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  const prisma = createPrismaClient().db;
  const properties = prisma
    ? await prisma.property.findMany({
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        where: {
          companyId: session.activeMembership.companyId,
          deletedAt: null,
        },
      })
    : [];

  const siteUrl = `https://${session.activeMembership.companySlug}.plotkeys.com`;

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {params.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Properties
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {properties.length} listing{properties.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="outline">
              <a href={siteUrl} rel="noopener noreferrer" target="_blank">
                View site ↗
              </a>
            </Button>
            <PropertyForm mode="create" />
          </div>
        </div>

        {properties.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                No properties yet. Add your first listing to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {properties.map((property) => (
              <Card key={property.id} className="bg-card">
                <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-6 pb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold">
                          {property.title}
                        </CardTitle>
                        {property.featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        <Badge variant={statusVariant[property.status] ?? "outline"}>
                          {property.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {[property.location, property.price]
                          .filter(Boolean)
                          .join(" · ")}
                        {property.bedrooms || property.bathrooms ? (
                          <span>
                            {" "}
                            ·{" "}
                            {[
                              property.bedrooms
                                ? `${property.bedrooms} bed`
                                : null,
                              property.bathrooms
                                ? `${property.bathrooms} bath`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <form action={togglePropertyFeaturedAction}>
                      <input name="propertyId" type="hidden" value={property.id} />
                      <Button size="sm" type="submit" variant="outline">
                        {property.featured ? "Unfeature" : "Feature"}
                      </Button>
                    </form>
                    <PropertyForm mode="edit" property={property} />
                    <form action={deletePropertyAction}>
                      <input name="propertyId" type="hidden" value={property.id} />
                      <Button
                        size="sm"
                        type="submit"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </form>
                  </div>
                </CardHeader>
                {property.description ? (
                  <CardContent className="px-6 pb-5 text-sm text-muted-foreground">
                    {property.description}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
