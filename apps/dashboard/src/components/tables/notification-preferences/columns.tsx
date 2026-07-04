"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import type { inferRouterOutputs } from "@trpc/server";
import { Inbox, Mail } from "lucide-react";

import { updateNotificationPreferenceAction } from "@/app/actions";
import type { notificationTypes } from "./constants";

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
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="font-medium text-foreground">{notificationType.label}</p>
        <Badge variant="outline" className="text-[11px]">
          {notificationType.type.replaceAll("_", " ")}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">
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
  const Icon = channel === "inApp" ? Inbox : Mail;

  return (
    <form action={updateNotificationPreferenceAction}>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="channel" value={channel} />
      <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
      <input type="hidden" name="currentInApp" value={String(currentInApp)} />
      <input type="hidden" name="currentEmail" value={String(currentEmail)} />
      <button
        type="submit"
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          enabled
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-border/60 bg-background/80 text-muted-foreground hover:bg-muted/50"
        }`}
      >
        <Icon className="size-3.5" />
        {label}
      </button>
    </form>
  );
}
