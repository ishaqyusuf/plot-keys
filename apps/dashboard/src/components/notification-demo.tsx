"use client";

import { useNotifications } from "@plotkeys/notifications-react";
import { Button } from "@plotkeys/ui/button";

export function NotificationDemo() {
  const notifications = useNotifications();

  return (
    <div className="mt-8 rounded-[calc(var(--radius-md)-0.15rem)] border border-[color:var(--border)] bg-slate-50/80 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Notifications package
          </p>
          <h3 className="mt-2 font-serif text-2xl text-slate-950">
            Trigger framework-agnostic notifications through the React layer.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            This demo uses notification types and recipient contacts for both a
            tenant user and a site subscriber.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Active: {notifications.notifications.length}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          onClick={() => {
            notifications.showSuccess("Draft saved", {
              description:
                "The latest builder changes were stored for your tenant workspace.",
              notificationType: "site_configuration_saved",
              recipients: [
                {
                  displayName: "Workspace admin",
                  kind: "user",
                  userId: "workspace-admin",
                },
              ],
            });
          }}
          type="button"
        >
          Show save success
        </Button>

        <Button
          onClick={() => {
            notifications.showInfo("New subscriber captured", {
              description:
                "A marketing lead subscribed from the tenant website footer form.",
              notificationType: "subscriber_lead_created",
              recipients: [
                {
                  displayName: "Ada Subscriber",
                  kind: "subscriber",
                  subscriberId: "subscriber-001",
                  topic: "property-alerts",
                },
                {
                  displayName: "Workspace admin",
                  kind: "user",
                  userId: "workspace-admin",
                },
              ],
            });
          }}
          type="button"
          variant="secondary"
        >
          Show subscriber notice
        </Button>

        <Button
          onClick={() => {
            notifications.showWarning("Publish needs review", {
              action: {
                label: "Open builder",
                onClick: () => {
                  notifications.showInfo("Builder route ready", {
                    description:
                      "Route actions can be connected here without coupling the core package to Next.js.",
                    notificationType: "builder_route_hint",
                  });
                },
              },
              description:
                "Your template has unpublished changes that still need a final pass.",
              notificationType: "site_publish_requires_review",
            });
          }}
          type="button"
          variant="ghost"
        >
          Show review warning
        </Button>
      </div>
    </div>
  );
}
