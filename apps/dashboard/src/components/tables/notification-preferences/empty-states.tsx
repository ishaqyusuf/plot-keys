import { Card, CardContent } from "@plotkeys/ui/card";
import { Sparkles } from "lucide-react";

export function NotificationPreferencesInfoCard() {
  return (
    <Card className="border-border/70 bg-card/82">
      <CardContent className="flex items-start gap-3 px-5 py-5">
        <div className="rounded-full border border-border/70 bg-background/80 p-2.5">
          <Sparkles className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">Midday direction</p>
          <p className="mt-1 text-muted-foreground text-sm leading-6">
            Notification controls now live in the same quieter surface, spacing,
            and token system as the rest of the redesigned dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
