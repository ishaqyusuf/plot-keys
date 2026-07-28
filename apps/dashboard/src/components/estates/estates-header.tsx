import { Button } from "@plotkeys/ui/button";
import Link from "next/link";

import { OpenEstateCreateSheet } from "@/components/open-estate-create-sheet";

export function EstatesHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted-foreground">Listings</p>
        <h1 className="text-2xl font-semibold text-foreground">
          Estate launches
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Group land listings into presale launches with plan import,
          availability tracking, and customer purchase workflows.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/properties?type=land">View land listings</Link>
        </Button>
        <OpenEstateCreateSheet />
      </div>
    </div>
  );
}
