import { logger, schemaTask } from "@trigger.dev/sdk/v3";

import {
  notificationDispatchHandler,
  notificationDispatchPayloadSchema,
} from "../handlers/notification-dispatch";

export const notificationDispatchTask = schemaTask({
  id: "notifications.dispatch",
  schema: notificationDispatchPayloadSchema,
  machine: "micro",
  maxDuration: 60,
  queue: {
    concurrencyLimit: 5,
  },
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 15000,
  },
  run: async (payload) => {
    const result = await notificationDispatchHandler(payload, 1);

    logger.info("Processed notification", {
      dispatches: result.dispatches,
      kind: result.kind,
      skippedChannels: result.skippedChannels,
    });

    return result;
  },
});
