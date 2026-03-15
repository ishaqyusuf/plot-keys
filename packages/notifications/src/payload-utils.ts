import {
  createNotificationChannelTriggers,
  type PlotKeysNotificationType,
  type NotificationTriggerInput,
} from "./payload-utils/index";

export * from "./payload-utils/index";

export const notify = (
  send: <TType extends PlotKeysNotificationType>(
    type: TType,
    input: NotificationTriggerInput<TType>,
  ) => unknown | Promise<unknown>,
) => {
  return createNotificationChannelTriggers({
    send,
    getStoredRecipients: () => null,
  });
};
