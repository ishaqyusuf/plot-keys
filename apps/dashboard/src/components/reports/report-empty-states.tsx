export function AgentPerformanceEmptyState() {
  return (
    <p className="text-sm text-muted-foreground">
      No agents found. Add agents to see performance data.
    </p>
  );
}

export function ListingsPerformanceEmptyState() {
  return (
    <p className="text-sm text-muted-foreground">
      No properties found. Add properties to see listing data.
    </p>
  );
}

export function ReportsEmptyState() {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <h3 className="font-medium text-foreground">No report data yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Reports will become more useful as agents, listings, and business
          events accumulate.
        </p>
      </div>
    </div>
  );
}
