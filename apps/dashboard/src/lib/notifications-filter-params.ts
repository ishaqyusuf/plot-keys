import { createLoader, parseAsString } from "nuqs/server";

export const notificationsFilterParams = {
  filter: parseAsString,
  q: parseAsString,
};

export const loadNotificationsFilterParams = createLoader(
  notificationsFilterParams,
);

export type NotificationsFilters = ReturnType<
  typeof loadNotificationsFilterParams
>;
