import { createPrismaClient, listPropertiesForCompany } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent } from "@plotkeys/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@plotkeys/ui/empty";
import Link from "next/link";

import { requireOnboardedSession } from "../../lib/session";
import {
  createPropertyAction,
  deletePropertyAction,
  togglePropertyFeaturedAction,
} from "../actions";
import { PropertyForm } from "./property-form";

export default async function PropertiesPage() {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  const properties = prisma
    ? await listPropertiesForCompany(prisma, session.activeMembership.companyId)
    : [];

  return (
    <main className="min-h-screen bg-background px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Properties</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {properties.length} listing{properties.length === 1 ? "" : "s"} in your portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/">Back to dashboard</Link>
            </Button>
            <PropertyForm onSave={createPropertyAction} />
          </div>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No listings yet</EmptyTitle>
                  <EmptyDescription>
                    Add your first property to populate the featured listings section on your website.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{property.title}</p>
                      <Badge
                        variant={property.status === "active" ? "default" : "outline"}
                      >
                        {property.status}
                      </Badge>
                      {property.featured && (
                        <Badge variant="outline" className="border-amber-400/60 text-amber-600">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{property.location}</p>
                    {property.price && (
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {property.price}
                      </p>
                    )}
                    {property.specs && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{property.specs}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={togglePropertyFeaturedAction}>
                      <input type="hidden" name="propertyId" value={property.id} />
                      <input
                        type="hidden"
                        name="featured"
                        value={String(!property.featured)}
                      />
                      <Button size="sm" type="submit" variant="ghost">
                        {property.featured ? "Unfeature" : "Feature"}
                      </Button>
                    </form>
                    <PropertyForm
                      initialData={property}
                      onSave={createPropertyAction}
                      trigger={
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      }
                    />
                    <form action={deletePropertyAction}>
                      <input type="hidden" name="propertyId" value={property.id} />
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
