type Props = {
  balance: number;
  totalCalls: number;
  totalCreditsUsed: number;
};

export function AiCreditsSummary({
  balance,
  totalCalls,
  totalCreditsUsed,
}: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {[
        { label: "Credit balance", suffix: "available", value: balance },
        {
          label: "Used in 30 days",
          suffix: "credits consumed",
          value: totalCreditsUsed,
        },
        { label: "AI calls", suffix: "requests processed", value: totalCalls },
      ].map((stat) => (
        <div
          className="border border-border bg-card p-5 transition-all duration-300"
          key={stat.label}
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-3 text-xl font-medium">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.suffix}</p>
        </div>
      ))}
    </div>
  );
}
