import { Card, CardContent } from "@plotkeys/ui/card";
import { DashboardStatGrid } from "@/components/dashboard/dashboard-page";
import { formatCurrency } from "@/components/payroll/payroll-utils";

type PayrollSummaryProps = {
  paidCount: number;
  pendingCount: number;
  totalEntries: number;
  totalGross: number;
  totalNet: number;
};

export function PayrollSummary({
  paidCount,
  pendingCount,
  totalEntries,
  totalGross,
  totalNet,
}: PayrollSummaryProps) {
  const stats = [
    { label: "Entries", value: totalEntries },
    { label: "Gross total", value: formatCurrency(totalGross) },
    { label: "Net total", value: formatCurrency(totalNet) },
    { label: "Paid / pending", value: `${paidCount} / ${pendingCount}` },
  ];

  return (
    <DashboardStatGrid>
      {stats.map((stat) => (
        <Card className="border-border/65 bg-card/78" key={stat.label}>
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
