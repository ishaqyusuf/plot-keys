import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { ErrorFallback } from "@/components/error-fallback";
import {
  IntegrationSettings,
  IntegrationSettingsSkeleton,
} from "@/components/integrations/integration-settings";

export function IntegrationSettingsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected services</CardTitle>
        <CardDescription>
          Manage the services wired into your site and dashboard.
        </CardDescription>
      </CardHeader>

      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<IntegrationSettingsSkeleton />}>
          <IntegrationSettings />
        </Suspense>
      </ErrorBoundary>
    </Card>
  );
}
