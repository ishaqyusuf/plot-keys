import { Badge } from "@plotkeys/ui/badge";
import { cn } from "@plotkeys/ui/cn";

type Props = {
  activeConfigName: string;
  className?: string;
  configStatus: string;
  statusDisplay?: "badge" | "text";
  statusVariant?: "default" | "outline";
  totalConfigurations?: number;
  versionNumber?: number | null;
};

export function BuilderSidebarConfigurationSummary({
  activeConfigName,
  className,
  configStatus,
  statusDisplay = "text",
  statusVariant = "outline",
  totalConfigurations,
  versionNumber,
}: Props) {
  const supportingLabel =
    versionNumber != null
      ? `Version ${versionNumber}`
      : `${totalConfigurations ?? 0} saved configurations`;

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-2 border bg-background p-3",
        className,
      )}
    >
      <div>
        <p className="text-xs text-muted-foreground">Active configuration</p>
        <p className="mt-1.5 text-sm font-semibold text-foreground">
          {activeConfigName}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {supportingLabel}
        </p>
      </div>
      {statusDisplay === "badge" ? (
        <Badge variant={statusVariant}>{configStatus}</Badge>
      ) : (
        <span className="text-xs font-medium text-muted-foreground">
          {configStatus}
        </span>
      )}
    </div>
  );
}
