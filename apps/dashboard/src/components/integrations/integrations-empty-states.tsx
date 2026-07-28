export function IntegrationsEmptyState() {
  return (
    <div className="flex min-h-56 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <h3 className="font-medium text-foreground">
          No integrations available
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Integration options will appear here when services are available for
          this workspace.
        </p>
      </div>
    </div>
  );
}
