import {
  createNotificationDispatchFromType,
  EmailService,
  makeSubscriberRecipients,
  type NotificationDeliveryPlan,
  NotificationService,
  planNotificationDeliveries,
  plotKeysNotificationTypes,
} from "@plotkeys/notifications";
import type {
  NotificationTriggerInput,
  PlotKeysNotificationType,
} from "@plotkeys/notifications/payload-utils";

function logNotificationPlan(label: string, plan: NotificationDeliveryPlan) {
  console.info(`[notifications] ${label}`, JSON.stringify(plan, null, 2));
}

export async function sendWorkspaceInvitationNotification(input: {
  companyName: string;
  inviteUrl: string;
  inviterName: string;
  recipientEmail: string;
  roleLabel: string;
}) {
  const notifications = new NotificationService(
    async <TType extends PlotKeysNotificationType>(
      type: TType,
      triggerInput: NotificationTriggerInput<TType>,
    ) => {
      const notification = createNotificationDispatchFromType(
        plotKeysNotificationTypes,
        type,
        triggerInput.payload,
        {
          channels: triggerInput.channels,
          recipients: triggerInput.recipients ?? [],
        },
      );
      const deliveryPlan = planNotificationDeliveries(notification);

      logNotificationPlan(type, deliveryPlan);
      await new EmailService().sendBulk(deliveryPlan.dispatches);

      return deliveryPlan;
    },
  ).setRecipients(
    makeSubscriberRecipients({
      displayName: input.recipientEmail,
      email: input.recipientEmail,
      subscriberId: `workspace-invite:${input.recipientEmail.toLowerCase()}`,
      topic: "workspace-invitation",
    }),
  );

  await notifications.send("workspace_invitation_sent", {
    channels: ["email"],
    payload: {
      companyName: input.companyName,
      inviteUrl: input.inviteUrl,
      inviterName: input.inviterName,
      recipientEmail: input.recipientEmail,
      roleLabel: input.roleLabel,
    },
  });
}
