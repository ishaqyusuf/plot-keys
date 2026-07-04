import { Card, CardContent } from "@plotkeys/ui/card";

import { DashboardStatGrid } from "@/components/dashboard/dashboard-page";

type EstatesSummaryProps = {
  estateCount: number;
  publishedCount: number;
  totalListings: number;
  totalReservations: number;
};

export function EstatesSummary({
  estateCount,
  publishedCount,
  totalListings,
  totalReservations,
}: EstatesSummaryProps) {
  return (
    <DashboardStatGrid className="xl:grid-cols-4">
      {[
        { label: "Estate launches", value: estateCount },
        { label: "Published", value: publishedCount },
        { label: "Estate listings", value: totalListings },
        { label: "Purchase requests", value: totalReservations },
      ].map((stat) => (
        <Card key={stat.label} className="border-border/70 bg-card/82">
          <CardContent className="px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </DashboardStatGrid>
  );
}
