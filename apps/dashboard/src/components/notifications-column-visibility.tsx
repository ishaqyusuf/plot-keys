"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useNotificationsStore } from "@/store/notifications";

export function NotificationsColumnVisibility() {
  const { columns } = useNotificationsStore();

  return <CoreColumnVisibility columns={columns} />;
}
