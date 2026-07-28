import { Card } from "@plotkeys/ui/card";
import { Skeleton } from "@plotkeys/ui/skeleton";

const integrationCards = Array.from({ length: 12 });

export function IntegrationsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-3">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-6 w-32" />
      </div>

      <section className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-96 max-w-full" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {integrationCards.map((_, index) => (
            <Card key={index.toString()} className="w-full flex flex-col">
              <div className="pt-6 px-6 h-16 flex items-center justify-between">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="px-6 pb-0 pt-6">
                <div className="flex items-center gap-2 pb-4">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>

              <div className="px-6 pb-4">
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="mt-auto flex gap-2 px-6 pb-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
