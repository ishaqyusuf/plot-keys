import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { getEstatePublishVariant } from "@/components/estates/estate-launch-card";
import { OpenEstateLaunchDetailsSheet } from "@/components/open-estate-launch-details-sheet";
import { OpenPropertySheet } from "@/components/open-property-sheet";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type EstateDetail = NonNullable<RouterOutputs["estates"]["get"]>;

type Props = {
  estate: EstateDetail;
  estateReturnPath: string;
};

export function EstateDetailHeader({ estate, estateReturnPath }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted-foreground">
          Estate launch
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          {estate.title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {[estate.location, estate.phaseLabel].filter(Boolean).join(" - ")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getEstatePublishVariant(estate.publishState)}>
          {estate.publishState}
        </Badge>
        <Button variant="outline" size="sm" asChild>
          <Link href="/estates">Back to launches</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/properties?type=land">Land listings</Link>
        </Button>
        <OpenEstateLaunchDetailsSheet estateSlug={estate.slug} />
        <OpenPropertySheet
          defaults={{
            estateId: estate.id,
            location: estate.location,
            returnTo: estateReturnPath,
            type: "land",
          }}
        />
      </div>
    </div>
  );
}
