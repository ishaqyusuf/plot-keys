import { Skeleton } from "@plotkeys/ui/skeleton";

const sidebarGroups = ["template", "styles", "colors", "info"];
const previewSections = ["hero", "listings", "agents", "contact"];

export function BuilderTemplatePreviewSkeleton() {
  return (
    <main className="min-h-screen bg-background px-2 py-2 md:px-3 md:py-3">
      <div className="mx-auto grid max-w-464 gap-3 border bg-background p-3 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="hidden xl:sticky xl:top-3 xl:block xl:h-[calc(100svh-1.5rem)]">
          <div className="flex h-full flex-col overflow-hidden border bg-background">
            <div className="border-b border-border bg-background px-4 py-4">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              {sidebarGroups.map((group) => (
                <section className="flex flex-col gap-2" key={group}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </section>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <Skeleton className="size-9" />
              <Skeleton className="h-9 w-44 xl:hidden" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border bg-background px-4 py-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
            <Skeleton className="h-6 w-10" />
          </div>

          <div className="overflow-hidden border bg-background">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-2.5 rounded-full" />
                <Skeleton className="size-2.5 rounded-full" />
                <Skeleton className="size-2.5 rounded-full" />
              </div>
              <Skeleton className="h-3 w-52" />
              <Skeleton className="h-3 w-20" />
            </div>

            <div className="max-h-[78vh] overflow-hidden bg-background p-3 md:p-4">
              <div className="overflow-hidden border">
                <Skeleton className="h-72 w-full rounded-none" />
                <div className="grid gap-0 md:grid-cols-2">
                  {previewSections.map((section) => (
                    <div className="border-t border-border p-6" key={section}>
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="mt-3 h-4 w-full max-w-sm" />
                      <Skeleton className="mt-2 h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
