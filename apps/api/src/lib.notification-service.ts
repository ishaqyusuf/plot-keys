import {
  type NotificationTaskPayload,
  notificationHandler,
  triggerJob,
} from "@plotkeys/jobs";
import { notification } from "@plotkeys/jobs/tasks";
import { NotificationService } from "@plotkeys/notifications";

export type NotificationUser = {
  email?: string | null;
  id: string;
  name?: string | null;
  phoneNumber?: string | null;
};

export function createNotificationService(input: {
  companyId: string;
  user: NotificationUser;
}) {
  const tasksClient = {
    trigger: async (_taskId: string, payload: NotificationTaskPayload) => {
      await triggerJob(notification, notificationHandler, payload);
    },
  };

  return new NotificationService(tasksClient, {
    companyId: input.companyId,
    userId: input.user.id,
  }).setRecipients([
    {
      displayName: input.user.name ?? input.user.email ?? input.user.id,
      email: input.user.email ?? undefined,
      kind: "user",
      phoneNumber: input.user.phoneNumber ?? undefined,
      userId: input.user.id,
    },
  ]);
}
