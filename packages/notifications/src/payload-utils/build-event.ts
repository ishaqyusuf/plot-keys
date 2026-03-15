import type { PlotKeysNotificationType } from "./types";
import { createNotificationDispatchFromType, plotKeysNotificationTypes } from "../notification-types";
import { resolveNotificationAuthor } from "./author";
import type {
  NotificationEvent,
  NotificationTriggerInput,
} from "./types";

export function buildNotificationEvent<TType extends PlotKeysNotificationType>(
  type: TType,
  input: NotificationTriggerInput<TType>,
  authUserId?: string | null,
): NotificationEvent<TType> {
  const author = resolveNotificationAuthor({
    author: input.author,
    authUserId,
  });

  createNotificationDispatchFromType(plotKeysNotificationTypes, type, input.payload, {
    channels: input.channels,
    recipients: input.recipients ?? [],
  });

  return {
    author,
    channels: input.channels,
    payload: input.payload,
    recipients: input.recipients ?? null,
    type,
  };
}
