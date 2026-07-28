import type { Metadata } from "next";
import { Suspense } from "react";

import { NotificationPreferencesSettingsList } from "@/components/notification-preferences/notification-preferences-settings-list";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Notification Preferences | Plot Keys",
};

export default async function NotificationPreferencesPage() {
  await requireOnboardedSession();

  prefetch(trpc.notifications.listPreferences.queryOptions());

  return (
    <HydrateClient>
      <Suspense>
        <NotificationPreferencesSettingsList />
      </Suspense>
    </HydrateClient>
  );
}
