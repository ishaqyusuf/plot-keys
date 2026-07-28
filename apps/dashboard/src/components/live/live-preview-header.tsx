import { Button } from "@plotkeys/ui/button";
import Link from "next/link";

type Props = {
  companyName: string;
  configurationName: string;
  hostname?: string | null;
};

export function LivePreviewHeader({
  companyName,
  configurationName,
  hostname,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted-foreground">
          Published live site
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          {companyName}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          This workspace is currently serving{" "}
          <strong>{configurationName}</strong>.
        </p>
        {hostname ? (
          <p className="text-xs text-muted-foreground">Hostname: {hostname}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Published
        </span>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/builder">Back to builder</Link>
        </Button>
      </div>
    </div>
  );
}
