import { task } from "@trigger.dev/sdk/v3";

import {
  notificationDispatchHandler,
  type NotificationDispatchPayload,
} from "../handlers/notification-dispatch";

export const notificationDispatchTask = task({
  id: "notifications.dispatch",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 15000,
  },
  run: async (payload: NotificationDispatchPayload) => {
    await notificationDispatchHandler(payload, 1);
  },
});
