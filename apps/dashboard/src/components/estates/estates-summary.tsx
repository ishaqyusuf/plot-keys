type Props = {
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
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Estate launches", value: estateCount },
        { label: "Published", value: publishedCount },
        { label: "Estate listings", value: totalListings },
        { label: "Purchase requests", value: totalReservations },
      ].map((stat) => (
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
