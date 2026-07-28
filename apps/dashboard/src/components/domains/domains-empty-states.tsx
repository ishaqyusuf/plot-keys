export function DomainsEmptyState() {
  return (
    <div className="flex min-h-56 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <h3 className="font-medium text-foreground">No domains provisioned</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No domains have been provisioned yet. Complete onboarding or trigger a
          sync to create them.
        </p>
      </div>
    </div>
  );
}
