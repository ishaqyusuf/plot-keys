import type { NotificationContact } from "./contacts";

export type NotificationChannel = "email" | "in_app" | "whatsapp";

export type NotificationVariant = "info" | "success" | "warning" | "error";

export type NotificationStatus = "active" | "dismissed";

export type NotificationActionDescriptor = {
  label: string;
  actionId: string;
};

export type NotificationRecord = {
  channels: NotificationChannel[];
  createdAt: string;
  description?: string;
  durationMs?: number;
  id: string;
  notificationType: string;
  recipients: NotificationContact[];
  status: NotificationStatus;
  title: string;
  variant: NotificationVariant;
  action?: NotificationActionDescriptor;
};

export type NotificationInput = {
  channels?: NotificationChannel[];
  description?: string;
  durationMs?: number;
  id?: string;
  notificationType: string;
  recipients?: NotificationContact[];
  title: string;
  variant?: NotificationVariant;
  action?: NotificationActionDescriptor;
};

export type NotificationDispatch = NotificationInput & {
  channels: NotificationChannel[];
  payload: unknown;
  recipients: NotificationContact[];
};

export type NotificationChannelDispatch = {
  channel: NotificationChannel;
  description?: string;
  notificationType: string;
  payload: unknown;
  recipients: NotificationContact[];
  title: string;
  variant: NotificationVariant;
  action?: NotificationActionDescriptor;
};

export type NotificationSkippedChannel = {
  channel: NotificationChannel;
  reason: string;
};

export type NotificationDeliveryPlan = {
  dispatches: NotificationChannelDispatch[];
  skippedChannels: NotificationSkippedChannel[];
};

export type NotificationState = {
  notifications: NotificationRecord[];
};
