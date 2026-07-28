"use client";

import { Badge } from "@plotkeys/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

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
        <p className="truncate font-medium text-foreground">{property.title}</p>
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

export const columns = (
  options: PropertyTableColumnOptions,
): ColumnDef<PropertyTableRow>[] => [
  createSelectColumn<PropertyTableRow>(),
  {
    cell: ({ row }) => <PropertyCell property={row.original} />,
    header: "Listing",
    id: "property",
    meta: {
      className:
        "min-w-[280px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Listing",
      skeleton: { type: "text", width: "w-48" },
      sticky: true,
    },
    size: 320,
  },
  {
    cell: ({ row }) => (
      <div className="space-y-1">
        <Badge variant="outline" className="capitalize">
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
        <Badge
          variant={options.statusVariant[row.original.status] ?? "outline"}
        >
          {row.original.status.replace("_", " ")}
        </Badge>
        <Badge
          variant={
            options.publishVariant[row.original.publishState] ?? "outline"
          }
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
    cell: ({ row }) => <ActionsMenu row={row.original} />,
    header: "Actions",
    id: "actions",
    meta: {
      className:
        "w-[80px] min-w-[80px] md:sticky md:right-0 bg-background group-hover:bg-muted z-30 justify-center !border-l !border-border",
      headerLabel: "Actions",
      skeleton: { type: "icon" },
      sticky: true,
    },
    size: 80,
  },
];
