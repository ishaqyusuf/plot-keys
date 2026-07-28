export function AiCreditsUsageEmptyState() {
  return (
    <div className="flex min-h-56 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <h3 className="font-medium text-foreground">No AI usage yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          AI feature consumption will appear here after your team uses Smart
          Fill, page generation, or project summaries.
        </p>
      </div>
    </div>
  );
}
