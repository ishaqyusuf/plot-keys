type Props = {
  conversionFocus: string;
  designIntent: string;
  segment: string;
};

export function RecommendTemplateProfileSummary({
  conversionFocus,
  designIntent,
  segment,
}: Props) {
  return (
    <div className="space-y-2 border border-border bg-card p-4 text-sm">
      <p className="text-sm font-medium text-foreground">Updated profile</p>
      <dl className="grid gap-1 text-muted-foreground">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-foreground">Segment</dt>
          <dd>{segment}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-foreground">Design</dt>
          <dd>{designIntent}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-foreground">Conversion</dt>
          <dd>{conversionFocus}</dd>
        </div>
      </dl>
    </div>
  );
}
