import type { NotificationContact } from "./contacts";

export type NotificationVariant = "info" | "success" | "warning" | "error";

export type NotificationStatus = "active" | "dismissed";

export type NotificationActionDescriptor = {
  label: string;
  actionId: string;
};

export type NotificationRecord = {
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
  description?: string;
  durationMs?: number;
  id?: string;
  notificationType: string;
  recipients?: NotificationContact[];
  title: string;
  variant?: NotificationVariant;
  action?: NotificationActionDescriptor;
};

export type NotificationState = {
  notifications: NotificationRecord[];
};
