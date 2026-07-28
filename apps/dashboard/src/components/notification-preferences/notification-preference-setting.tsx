"use client";

import {
  ChannelToggle,
  type NotificationPreferenceEvent,
  NotificationPreferenceEventCell,
  type PreferenceState,
} from "@/components/notification-preferences/notification-preferences-cells";

export function NotificationPreferenceSetting({
  notificationType,
  preference,
}: {
  notificationType: NotificationPreferenceEvent;
  preference: PreferenceState;
}) {
  return (
    <div className="mb-4 border-b border-border pb-4 last:mb-0 last:border-b-0">
      <div className="flex items-start justify-between">
        <NotificationPreferenceEventCell notificationType={notificationType} />

        <div className="flex items-center gap-8">
          <ChannelToggle
            channel="inApp"
            currentEmail={preference.email}
            currentInApp={preference.inApp}
            enabled={preference.inApp}
            label="In-app"
            type={notificationType.type}
          />
          <ChannelToggle
            channel="email"
            currentEmail={preference.email}
            currentInApp={preference.inApp}
            enabled={preference.email}
            label="Email"
            type={notificationType.type}
          />
        </div>
      </div>
    </div>
  );
}
