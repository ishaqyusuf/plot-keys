"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@plotkeys/ui/accordion";
import { Icon } from "@plotkeys/ui/icons";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NotificationPreferenceSetting } from "@/components/notification-preferences/notification-preference-setting";
import { createPreferenceMap } from "@/components/notification-preferences/notification-preferences-cells";
import {
  notificationCategoryLabels,
  notificationTypes,
} from "@/components/notification-preferences/notification-preferences-types";
import { useTRPC } from "@/trpc/client";

const categoryOrder = ["website", "workspace", "account"] as const;

export function NotificationPreferencesSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {categoryOrder.map((category) => (
        <div className="border-b border-border" key={category}>
          <div className="flex flex-1 items-center justify-between py-4">
            <Skeleton className="h-5 w-24" />
            <Icon.ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  );
}

function getGroupedNotificationTypes() {
  return categoryOrder
    .map((category) => ({
      category,
      label: notificationCategoryLabels[category],
      notifications: notificationTypes
        .filter((notificationType) => notificationType.category === category)
        .sort((a, b) => a.order - b.order),
    }))
    .filter((group) => group.notifications.length > 0);
}

export function NotificationPreferencesSettings() {
  const trpc = useTRPC();
  const { data: preferences } = useSuspenseQuery(
    trpc.notifications.listPreferences.queryOptions(),
  );
  const prefMap = createPreferenceMap(preferences);
  const groupedNotificationTypes = getGroupedNotificationTypes();

  return (
    <div className="space-y-6">
      <Accordion className="w-full" type="multiple">
        {groupedNotificationTypes.map((group) => (
          <AccordionItem key={group.category} value={group.category}>
            <AccordionTrigger className="text-base">
              {group.label}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {group.notifications.map((notificationType) => {
                  const preference = prefMap.get(notificationType.type) ?? {
                    email: true,
                    inApp: true,
                  };

                  return (
                    <NotificationPreferenceSetting
                      key={notificationType.type}
                      notificationType={notificationType}
                      preference={preference}
                    />
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
