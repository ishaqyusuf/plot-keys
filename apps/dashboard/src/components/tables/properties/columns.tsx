"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PropertySheet } from "@/components/sheets/property-sheet";
import {
  deletePropertyAction,
  togglePropertyFeaturedAction,
} from "@/app/actions";

export type PropertyTableRow = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  price: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  specs: string | null;
  type: string | null;
  subType: string | null;
  quantityAvailable?: number | null;
  status: string;
  publishState: string;
  featured: boolean;
};

type BadgeVariant = "default" | "outline" | "secondary" | "destructive";

export type PropertyTableColumnOptions = {
  publishVariant: Record<string, BadgeVariant>;
  statusVariant: Record<string, Exclude<BadgeVariant, "destructive">>;
  typeLabels: Record<string, string>;
};

function getListingDetails(property: PropertyTableRow) {
  const availability =
    property.quantityAvailable != null
      ? `${property.quantityAvailable} units available`
      : null;

  if (property.type === "land") {
    return (
      [property.specs || property.subType, availability]
        .filter(Boolean)
        .join(" · ") || "Land details pending"
    );
  }

  return (
    [
      property.bedrooms ? `${property.bedrooms} bed` : null,
      property.bathrooms ? `${property.bathrooms} bath` : null,
      property.specs,
      availability,
    ]
      .filter(Boolean)
      .join(" · ") || "Home details pending"
  );
}

function PropertyCell({ property }: { property: PropertyTableRow }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Link
          className="truncate font-medium text-foreground underline-offset-2 hover:underline"
          href={`/properties/${property.id}`}
          onClick={(event) => event.stopPropagation()}
        >
          {property.title}
        </Link>
        {property.featured ? <Badge variant="secondary">Featured</Badge> : null}
      </div>
      <p className="truncate text-sm text-muted-foreground">
        {property.location ?? "No location"}
      </p>
      {property.description ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {property.description}
        </p>
      ) : null}
    </div>
  );
}

function ActionsCell({ property }: { property: PropertyTableRow }) {
  return (
    <div
      className="flex justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Button asChild size="sm" variant="ghost">
        <Link href={`/properties/${property.id}`}>View</Link>
      </Button>
      <form action={togglePropertyFeaturedAction}>
        <input name="propertyId" type="hidden" value={property.id} />
        <Button size="sm" type="submit" variant="outline">
          {property.featured ? "Unfeature" : "Feature"}
        </Button>
      </form>
      <PropertySheet mode="edit" property={property} />
      <form action={deletePropertyAction}>
        <input name="propertyId" type="hidden" value={property.id} />
        <Button
          className="text-destructive hover:bg-destructive/5 hover:text-destructive"
          size="sm"
          type="submit"
          variant="ghost"
        >
          Delete
        </Button>
      </form>
    </div>
  );
}

export const columns = (
  options: PropertyTableColumnOptions,
): ColumnDef<PropertyTableRow>[] => [
  {
    cell: ({ row }) => <PropertyCell property={row.original} />,
    header: "Listing",
    id: "property",
    meta: {
      className: "min-w-[280px] md:sticky md:left-0 md:z-20 md:bg-background",
      headerLabel: "Listing",
      skeleton: { type: "text", width: "w-48" },
      sticky: true,
    },
    size: 320,
  },
  {
    cell: ({ row }) => (
      <div className="space-y-1">
        <Badge className="capitalize" variant="outline">
          {row.original.type
            ? (options.typeLabels[row.original.type] ?? row.original.type)
            : "Unassigned"}
        </Badge>
        {row.original.subType ? (
          <p className="text-xs text-muted-foreground">
            {row.original.subType}
          </p>
        ) : null}
      </div>
    ),
    header: "Type",
    id: "type",
    meta: {
      headerLabel: "Type",
      skeleton: { type: "badge", width: "w-20" },
    },
    size: 160,
  },
  {
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1.5">
        <Badge variant={options.statusVariant[row.original.status] ?? "outline"}>
          {row.original.status.replace("_", " ")}
        </Badge>
        <Badge
          variant={options.publishVariant[row.original.publishState] ?? "outline"}
        >
          {row.original.publishState}
        </Badge>
      </div>
    ),
    header: "Status",
    id: "status",
    meta: {
      headerLabel: "Status",
      skeleton: { type: "badge", width: "w-20" },
    },
    size: 150,
  },
  {
    cell: ({ row }) => (
      <p className="font-medium text-foreground">{row.original.price ?? "—"}</p>
    ),
    header: "Price",
    id: "price",
    meta: {
      headerLabel: "Price",
      skeleton: { type: "text", width: "w-24" },
    },
    size: 150,
  },
  {
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground">
        {getListingDetails(row.original)}
      </p>
    ),
    header: "Details",
    id: "details",
    meta: {
      className: "min-w-[260px]",
      headerLabel: "Details",
      skeleton: { type: "text", width: "w-48" },
    },
    size: 300,
  },
  {
    cell: ({ row }) => <ActionsCell property={row.original} />,
    header: "",
    id: "actions",
    meta: {
      className:
        "min-w-[360px] text-right md:sticky md:right-0 md:z-20 md:border-l md:border-border md:bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-[#0f0f0f]",
      headerLabel: "Actions",
      skeleton: { type: "text", width: "w-32" },
      sticky: true,
    },
    size: 380,
  },
];
