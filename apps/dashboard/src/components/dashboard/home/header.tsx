import { Button } from "@plotkeys/ui/button";
import Link from "next/link";

type Props = {
  companyName: string;
};

export function DashboardHomeHeader({ companyName }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted-foreground">
          Workspace overview
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          {companyName}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Track listings, team activity, site publishing, and lead flow from a
          single operating surface.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/live">Preview live state</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/builder">Open builder</Link>
        </Button>
      </div>
    </div>
  );
}
