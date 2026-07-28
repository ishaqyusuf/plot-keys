import type { AppRouter } from "@plotkeys/api/router";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type EstateDetail = NonNullable<RouterOutputs["estates"]["get"]>;

type Props = {
  estate: EstateDetail;
};

export function EstateDetailStats({ estate }: Props) {
  const statusCounts = estate.properties.reduce<Record<string, number>>(
    (counts, property) => {
      counts[property.status] = (counts[property.status] ?? 0) + 1;
      return counts;
    },
    {},
  );

  const stats = [
    { label: "Listings", value: estate.properties.length },
    { label: "Active offers", value: statusCounts.active ?? 0 },
    {
      label: "Sold / Off-market",
      value: (statusCounts.sold ?? 0) + (statusCounts.off_market ?? 0),
    },
    { label: "Purchase requests", value: estate._count.reservations },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          className="border border-border bg-card p-5 transition-all duration-300"
          key={stat.label}
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-3 text-xl font-medium">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
