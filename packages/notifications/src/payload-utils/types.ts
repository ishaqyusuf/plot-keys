import type { z } from "zod";
import type { NotificationContact } from "../contacts";
import { plotKeysNotificationTypes } from "../notification-types";
import type { NotificationChannel } from "../core-types";

export type NotificationAuthor = {
  id: string;
};

export type NotificationRecipients = NotificationContact[] | null;

export type PlotKeysNotificationType = keyof typeof plotKeysNotificationTypes & string;

export type NotificationPayload<TType extends PlotKeysNotificationType> = z.infer<
  (typeof plotKeysNotificationTypes)[TType]["schema"]
>;

export type NotificationEvent<TType extends PlotKeysNotificationType> = {
  author: NotificationAuthor;
  channels?: NotificationChannel[];
  payload: NotificationPayload<TType>;
  recipients: NotificationRecipients;
  type: TType;
};

export type NotificationTriggerInput<TType extends PlotKeysNotificationType> =
  Omit<NotificationEvent<TType>, "author" | "recipients" | "type"> & {
    author?: NotificationAuthor;
    recipients?: NotificationRecipients;
  };
