"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";

import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import {
  ChannelToggle,
  createPreferenceMap,
  NotificationPreferenceEventCell,
  type NotificationPreference,
} from "./columns";
import { notificationTypes } from "./constants";

export function NotificationPreferencesTableCard({
  preferences,
}: {
  preferences: NotificationPreference[];
}) {
  const prefMap = createPreferenceMap(preferences);

  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Event routing</DashboardSectionTitle>
          <DashboardSectionDescription>
            Toggle delivery by channel for each important system event.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>

      <Card className="border-border/65 bg-card/78">
        <CardHeader className="px-5 py-4">
          <CardTitle>Event notifications</CardTitle>
          <CardDescription>
            Each toggle updates immediately and follows the shared Midday
            control styling for calmer settings management.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5 px-5 pb-5 pt-0">
          {notificationTypes.map((notificationType) => {
            const pref = prefMap.get(notificationType.type) ?? {
              email: true,
              inApp: true,
            };

            return (
              <div
                key={notificationType.type}
                className="flex flex-col gap-4 rounded-[calc(var(--radius-lg)+0.125rem)] border border-border/60 bg-background/55 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <NotificationPreferenceEventCell
                  notificationType={notificationType}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <ChannelToggle
                    channel="inApp"
                    currentEmail={pref.email}
                    currentInApp={pref.inApp}
                    enabled={pref.inApp}
                    label="In-app"
                    type={notificationType.type}
                  />
                  <ChannelToggle
                    channel="email"
                    currentEmail={pref.email}
                    currentInApp={pref.inApp}
                    enabled={pref.email}
                    label="Email"
                    type={notificationType.type}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
