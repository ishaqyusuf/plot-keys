import { Card, CardContent } from "@plotkeys/ui/card";
import { BellRing, Inbox, Mail } from "lucide-react";

import { DashboardStatGrid } from "@/components/dashboard/dashboard-page";

type NotificationPreferencesSummaryProps = {
  enabledEmail: number;
  enabledInApp: number;
  trackedEvents: number;
};

export function NotificationPreferencesSummary({
  enabledEmail,
  enabledInApp,
  trackedEvents,
}: NotificationPreferencesSummaryProps) {
  return (
    <DashboardStatGrid className="xl:grid-cols-3">
      {[
        {
          icon: BellRing,
          label: "Tracked events",
          value: trackedEvents,
        },
        {
          icon: Inbox,
          label: "In-app enabled",
          value: enabledInApp,
        },
        {
          icon: Mail,
          label: "Email enabled",
          value: enabledEmail,
        },
      ].map((stat) => (
        <Card key={stat.label} className="border-border/65 bg-card/78">
          <CardContent className="flex items-center gap-4 px-5 py-5">
            <div className="rounded-full border border-border/60 bg-background/70 p-3">
              <stat.icon className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </DashboardStatGrid>
  );
}
