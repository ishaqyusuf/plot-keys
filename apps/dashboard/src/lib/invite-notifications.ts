import {
  notificationHandler,
  triggerJob,
  type NotificationTaskPayload,
} from "@plotkeys/jobs";
import { notification } from "@plotkeys/jobs/tasks";
import { NotificationService } from "@plotkeys/notifications";

export async function sendWorkspaceInvitationNotification(input: {
  companyId: string;
  companyName: string;
  inviteUrl: string;
  inviterId: string;
  inviterName: string;
  recipientEmail: string;
  roleLabel: string;
}) {
  const tasksClient = {
    trigger: async (_taskId: string, payload: NotificationTaskPayload) => {
      await triggerJob(notification, notificationHandler, payload);
    },
  };

  const notifications = new NotificationService(tasksClient, {
    companyId: input.companyId,
    userId: input.inviterId,
  }).setRecipients([
    {
      displayName: input.recipientEmail,
      email: input.recipientEmail,
      kind: "subscriber",
      subscriberId: `workspace-invite:${input.recipientEmail.toLowerCase()}`,
      topic: "workspace-invitation",
    },
  ]);

  await notifications.send("workspace_invitation_sent", {
    channels: ["email"],
    payload: {
      companyName: input.companyName,
      inviteUrl: input.inviteUrl,
      inviterName: input.inviterName,
      recipientEmail: input.recipientEmail,
      roleLabel: input.roleLabel,
    },
    sendEmail: true,
  });
}
