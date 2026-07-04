import {
  notificationTaskPayloadSchema,
  type NotificationTaskPayload,
} from "@plotkeys/notifications";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";

import {
  emailSmokeTestHandler,
  emailSmokeTestPayloadSchema,
} from "../handlers/email-smoke-test";
import { notificationHandler } from "../handlers/notification-dispatch";

export const notification = schemaTask({
  id: "notification",
  schema: notificationTaskPayloadSchema,
  machine: "micro",
  maxDuration: 60,
  queue: {
    concurrencyLimit: 5,
  },
  run: async (input) => {
    const notificationInput = input as NotificationTaskPayload;
    const result = await notificationHandler(notificationInput, 1);

    logger.info("Processed notification", {
      companyId: notificationInput.companyId,
      dispatches: result.dispatches,
      skippedChannels: result.skippedChannels,
      type: notificationInput.type,
    });

    return result;
  },
});

export const emailSmokeTest = schemaTask({
  id: "email-smoke-test",
  schema: emailSmokeTestPayloadSchema,
  machine: "micro",
  maxDuration: 60,
  run: async (payload) => {
    const result = await emailSmokeTestHandler(payload);

    logger.info("Processed email smoke test", {
      companyId: result.companyId,
      dispatches: result.result.dispatches,
      leadId: result.leadId,
      messageLogId: result.messageLog?.id,
      messageLogStatus: result.messageLog?.status,
      recipient: result.recipient,
    });

    return result;
  },
});

export const emailSmokeTestTask = emailSmokeTest;
