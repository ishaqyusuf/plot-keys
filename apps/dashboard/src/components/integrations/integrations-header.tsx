import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import Link from "next/link";

import { integrations } from "@/components/integrations/integration-catalog";

type Props = {
  connectedCount: number;
};

export function IntegrationsHeader({ connectedCount }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            Connection workspace
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            Integrations
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Connect analytics, communication, and scheduling tools to your
            website and operational stack.
          </p>
        </div>
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings/integrations">
              <Icon.Settings className="mr-1.5 size-3.5" />
              Configure credentials
            </Link>
          </Button>
        </div>
      </div>
      <div>
        <span className="text-sm text-muted-foreground">
          {connectedCount} of {integrations.length} connected
        </span>
      </div>
    </div>
  );
}
