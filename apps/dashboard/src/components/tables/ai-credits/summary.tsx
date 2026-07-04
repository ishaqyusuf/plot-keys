import { Card, CardContent } from "@plotkeys/ui/card";
import { Bot, Sparkles, Wallet } from "lucide-react";

import { DashboardStatGrid } from "@/components/dashboard/dashboard-page";

type AiCreditsSummaryProps = {
  balance: number;
  totalCalls: number;
  totalCreditsUsed: number;
};

export function AiCreditsSummary({
  balance,
  totalCalls,
  totalCreditsUsed,
}: AiCreditsSummaryProps) {
  return (
    <DashboardStatGrid className="xl:grid-cols-3">
      {[
        {
          icon: Wallet,
          label: "Credit balance",
          suffix: "available",
          value: balance,
        },
        {
          icon: Sparkles,
          label: "Used in 30 days",
          suffix: "credits consumed",
          value: totalCreditsUsed,
        },
        {
          icon: Bot,
          label: "AI calls",
          suffix: "requests processed",
          value: totalCalls,
        },
      ].map((stat) => (
        <Card key={stat.label} className="border-border/70 bg-card/82">
          <CardContent className="flex items-center gap-4 px-5 py-5">
            <div className="rounded-full border border-border/70 bg-background/80 p-3">
              <stat.icon className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.suffix}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </DashboardStatGrid>
  );
}
