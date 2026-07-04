import {
  createNotificationChannelTriggers,
  type PlotKeysNotificationType,
  type NotificationTriggerInput,
} from "./payload-utils";

export {
  createSubscriberNotificationContact,
  createUserNotificationContact,
  isNotificationContactKind,
} from "./contacts";
export type {
  NotificationContact,
  NotificationContactKind,
  NotificationSubscriberContact,
  NotificationUserContact,
} from "./contacts";
export type {
  NotificationActionDescriptor,
  NotificationChannel,
  NotificationChannelDispatch,
  NotificationDeliveryPlan,
  NotificationDispatch,
  NotificationInput,
  NotificationRecord,
  NotificationSkippedChannel,
  NotificationState,
  NotificationStatus,
  NotificationVariant,
} from "./core-types";
export { planNotificationDeliveries } from "./delivery";
export { createMemoryNotificationStore } from "./memory-store";
export type {
  DeliverySummary,
  NotificationOptions,
  NotificationResult,
  NotificationTaskPayload,
} from "./base";
export { Notifications } from "./notifications";
export {
  createNotificationDispatchFromType,
  createNotificationFromType,
  defineNotificationType,
  defineNotificationTypes,
  plotKeysNotificationTypes,
} from "./notification-types";
export type {
  NotificationTypeDefinition,
  NotificationTypeRegistry,
} from "./notification-types";
export {
  notificationChannelSchema,
  notificationContactSchema,
  notificationTaskPayloadSchema,
} from "./schemas";
export type { NotificationJobInput, NotificationTypes } from "./schemas";
export {
  EmailService,
  supportsEmailNotificationType,
} from "./services/email-service";
export type {
  EmailDispatchInput,
  EmailDispatchSendResult,
  EmailInput,
  EmailSendResult,
} from "./services/email-service";
export { NotificationService } from "./services/triggers";
export {
  supportsWhatsAppNotificationType,
  WhatsAppService,
} from "./services/whatsapp-service";
export type { WhatsAppDispatchSendResult } from "./services/whatsapp-service";
export type { NotificationListener, NotificationStore } from "./store";
export {
  makeSubscriberRecipients,
  makeUserRecipients,
  normalizeRecipients,
} from "./payload-utils";
export type {
  NotificationAuthor,
  NotificationEvent,
  NotificationPayload,
  NotificationRecipients,
  NotificationTriggerInput,
  PlotKeysNotificationType,
} from "./payload-utils";
export { createNotificationChannelTriggers };

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
