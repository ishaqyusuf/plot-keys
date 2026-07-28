"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Checkbox } from "@plotkeys/ui/checkbox";
import { Label } from "@plotkeys/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";

import type { notificationTypes } from "@/components/notification-preferences/notification-preferences-types";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type NotificationPreference =
  RouterOutputs["notifications"]["listPreferences"][number];
export type NotificationPreferenceEvent = (typeof notificationTypes)[number];
export type PreferenceState = {
  email: boolean;
  inApp: boolean;
};

export function createPreferenceMap(preferences: NotificationPreference[]) {
  return new Map<string, PreferenceState>(
    preferences.map((preference) => [
      preference.type,
      { email: preference.email, inApp: preference.inApp },
    ]),
  );
}

export function NotificationPreferenceEventCell({
  notificationType,
}: {
  notificationType: NotificationPreferenceEvent;
}) {
  return (
    <div className="flex-1 pr-8">
      <Label className="text-sm font-medium">{notificationType.label}</Label>
      <p className="mt-1 text-sm text-muted-foreground">
        {notificationType.description}
      </p>
    </div>
  );
}

export function ChannelToggle({
  channel,
  currentEmail,
  currentInApp,
  enabled,
  label,
  type,
}: {
  channel: "email" | "inApp";
  currentEmail: boolean;
  currentInApp: boolean;
  enabled: boolean;
  label: string;
  type: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const updatePreferenceMutation = useMutation(
    trpc.notifications.updatePreference.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: trpc.notifications.listPreferences.queryKey(),
        });
      },
    }),
  );
  const channelId = `${type}-${channel}`;
  const updateChannel = (nextEnabled: boolean) => {
    updatePreferenceMutation.mutate({
      email: channel === "email" ? nextEnabled : currentEmail,
      inApp: channel === "inApp" ? nextEnabled : currentInApp,
      type,
    });
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Label
        className="text-xs font-medium text-muted-foreground"
        htmlFor={channelId}
      >
        {label}
      </Label>
      <Checkbox
        checked={enabled}
        disabled={updatePreferenceMutation.isPending}
        id={channelId}
        onCheckedChange={(nextChecked) => updateChannel(nextChecked === true)}
      />
    </div>
  );
}
