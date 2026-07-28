import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { ErrorFallback } from "@/components/error-fallback";
import {
  NotificationPreferencesSettings,
  NotificationPreferencesSettingsSkeleton,
} from "@/components/notification-preferences/notification-preferences-settings";

export function NotificationPreferencesSettingsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event notifications</CardTitle>
        <CardDescription>
          Manage how operational events notify your team.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<NotificationPreferencesSettingsSkeleton />}>
            <NotificationPreferencesSettings />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}
