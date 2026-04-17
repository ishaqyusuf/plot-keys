import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import Link from "next/link";
import {
  deletePropertyAction,
  togglePropertyFeaturedAction,
} from "../../../../actions";
import { PropertyForm } from "../../property-form";
import { type PropertyTableRow, propertyTableColumns } from "./columns";

type PropertiesDataTableProps = {
  properties: PropertyTableRow[];
  publishVariant: Record<
    string,
    "default" | "outline" | "secondary" | "destructive"
  >;
  statusVariant: Record<string, "default" | "outline" | "secondary">;
  typeLabels: Record<string, string>;
};

export function PropertiesDataTable({
  properties,
  publishVariant,
  statusVariant,
  typeLabels,
}: PropertiesDataTableProps) {
  return (
    <Table>
      <TableHeader className="[&_tr]:border-border/55">
        <TableRow className="hover:bg-transparent">
          {propertyTableColumns.map((column) => (
            <TableHead
              key={column.id}
              className={[
                "text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground",
                column.id === "property" ? "px-5" : "",
                column.id === "actions" ? "px-5 text-right" : "",
              ].join(" ")}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow
            key={property.id}
            className="border-border/50 hover:bg-background/40"
          >
            <TableCell className="px-5 py-4 align-top">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/properties/${property.id}`}
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {property.title}
                  </Link>
                  {property.featured ? (
                    <Badge variant="secondary">Featured</Badge>
                  ) : null}
                </div>
                <p className="max-w-xl text-sm text-muted-foreground">
                  {property.location ?? "No location"}
                </p>
                {property.description ? (
                  <p className="line-clamp-2 max-w-xl text-sm text-muted-foreground">
                    {property.description}
                  </p>
                ) : null}
              </div>
            </TableCell>
            <TableCell className="py-4 align-top">
              <div className="space-y-1">
                <Badge variant="outline" className="capitalize">
                  {property.type
                    ? (typeLabels[property.type] ?? property.type)
                    : "Unassigned"}
                </Badge>
                {property.subType ? (
                  <p className="text-xs text-muted-foreground">
                    {property.subType}
                  </p>
                ) : null}
              </div>
            </TableCell>
            <TableCell className="py-4 align-top">
              <div className="flex flex-col items-start gap-1.5">
                <Badge variant={statusVariant[property.status] ?? "outline"}>
                  {property.status.replace("_", " ")}
                </Badge>
                <Badge
                  variant={publishVariant[property.publishState] ?? "outline"}
                >
                  {property.publishState}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="py-4 align-top">
              <p className="font-medium text-foreground">
                {property.price ?? "—"}
              </p>
            </TableCell>
            <TableCell className="py-4 align-top">
              <p className="text-sm text-muted-foreground">
                {[
                  property.bedrooms ? `${property.bedrooms} bed` : null,
                  property.bathrooms ? `${property.bathrooms} bath` : null,
                  property.specs,
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </p>
            </TableCell>
            <TableCell className="px-5 py-4 align-top">
              <div className="flex justify-end gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/properties/${property.id}`}>View</Link>
                </Button>
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
                    className="text-destructive hover:bg-destructive/5 hover:text-destructive"
                  >
                    Delete
                  </Button>
                </form>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
