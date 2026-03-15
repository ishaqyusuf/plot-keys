import {
  createNotificationChannelTriggers,
  type PlotKeysNotificationType,
  type NotificationTriggerInput,
} from "./payload-utils";

export * from "./payload-utils/index";
export * from "./contacts";
export * from "./core-types";
export * from "./delivery";
export * from "./memory-store";
export * from "./notification-types";
export * from "./services/email-service";
export * from "./services/triggers";
export * from "./services/whatsapp-service";
export * from "./store";
export * from "./types";

export const notify = (
  send: <TType extends PlotKeysNotificationType>(
    type: TType,
    input: NotificationTriggerInput<TType>,
  ) => unknown | Promise<unknown>,
) => {
  return createNotificationChannelTriggers({
    getStoredRecipients: () => null,
    send,
  });
};
