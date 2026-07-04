"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { notificationTypes } from "./constants";
import { NotificationPreferencesInfoCard } from "./empty-states";
import { NotificationPreferencesSummary } from "./summary";
import { NotificationPreferencesTableCard } from "./table";
import { NotificationPreferencesPageHeader } from "./table-header";

export function NotificationPreferencesTable() {
  const trpc = useTRPC();
  const { data: preferences } = useSuspenseQuery(
    trpc.notifications.listPreferences.queryOptions(),
  );
  const prefMap = new Map(
    preferences.map((preference) => [preference.type, preference]),
  );
  const enabledInApp = notificationTypes.filter(
    (notificationType) => prefMap.get(notificationType.type)?.inApp ?? true,
  ).length;
  const enabledEmail = notificationTypes.filter(
    (notificationType) => prefMap.get(notificationType.type)?.email ?? true,
  ).length;

  return (
    <>
      <NotificationPreferencesPageHeader />
      <NotificationPreferencesSummary
        enabledEmail={enabledEmail}
        enabledInApp={enabledInApp}
        trackedEvents={notificationTypes.length}
      />
      <NotificationPreferencesTableCard preferences={preferences} />
      <NotificationPreferencesInfoCard />
    </>
  );
}
