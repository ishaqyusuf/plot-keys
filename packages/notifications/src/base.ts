import type {
  NotificationChannel,
  NotificationSkippedChannel,
} from "./core-types";
import type { NotificationContact } from "./contacts";
import type { PlotKeysNotificationType } from "./payload-utils";
import type { NotificationJobInput } from "./schemas";

export type DeliverySummary = {
  failed: number;
  sent: number;
  skipped: number;
};

export type NotificationOptions = {
  channels?: NotificationChannel[];
  priority?: number;
  recipients?: NotificationContact[];
  sendEmail?: boolean;
};

export type NotificationTaskPayload = NotificationJobInput;

export type NotificationResult = {
  activities: number;
  dispatches: {
    email: DeliverySummary;
    inApp: DeliverySummary;
    phone: DeliverySummary;
    sms: DeliverySummary;
    whatsapp: DeliverySummary;
  };
  skippedChannels: NotificationSkippedChannel[];
  type: PlotKeysNotificationType;
};
