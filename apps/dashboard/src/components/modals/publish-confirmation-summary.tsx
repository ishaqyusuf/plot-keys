type Props = {
  changedFieldCount?: number;
  currentName: string;
  templateLabel?: string;
};

function formatChangedFieldCount(changedFieldCount: number) {
  if (changedFieldCount === 0) {
    return "No fields changed since last publish";
  }

  return `${changedFieldCount} field${
    changedFieldCount !== 1 ? "s" : ""
  } changed since last publish`;
}

export function PublishConfirmationSummary({
  changedFieldCount,
  currentName,
  templateLabel,
}: Props) {
  return (
    <div className="space-y-2 border border-border bg-card p-4 text-sm">
      <p className="text-sm font-medium text-foreground">What goes live</p>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
        <span className="text-foreground">Configuration</span>
        <span>{currentName || "Untitled draft"}</span>
        {templateLabel ? (
          <>
            <span className="text-foreground">Template</span>
            <span>{templateLabel}</span>
          </>
        ) : null}
        {changedFieldCount !== undefined ? (
          <>
            <span className="text-foreground">Changes</span>
            <span>{formatChangedFieldCount(changedFieldCount)}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
