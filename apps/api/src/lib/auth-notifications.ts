import {
  createNotificationDispatchFromType,
  EmailService,
  makeUserRecipients,
  type NotificationDeliveryPlan,
  NotificationService,
  planNotificationDeliveries,
  plotKeysNotificationTypes,
  WhatsAppService,
} from "@plotkeys/notifications";
import type {
  NotificationTriggerInput,
  PlotKeysNotificationType,
} from "@plotkeys/notifications/payload-utils";
import {
  buildDashboardHostnameForTenantHostname,
  buildTenantDashboardUrl,
} from "@plotkeys/utils";

function getDashboardAppUrl() {
  return process.env.DASHBOARD_APP_URL ?? "http://localhost:3901";
}

function logNotificationPlan(label: string, plan: NotificationDeliveryPlan) {
  console.info(`[notifications] ${label}`, JSON.stringify(plan, null, 2));
}

async function executeNotificationTrigger(input: {
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  recipientUserId: string;
  trigger: (notifications: NotificationService) => Promise<unknown>;
}) {
  let notification: ReturnType<
    typeof createNotificationDispatchFromType<
      typeof plotKeysNotificationTypes,
      PlotKeysNotificationType
    >
  > | null = null;
  let plan: NotificationDeliveryPlan | null = null;

  const notifications = new NotificationService(
    async <TType extends PlotKeysNotificationType>(
      type: TType,
      triggerInput: NotificationTriggerInput<TType>,
    ) => {
      const builtNotification = createNotificationDispatchFromType(
        plotKeysNotificationTypes,
        type,
        triggerInput.payload,
        {
          channels: triggerInput.channels,
          recipients: triggerInput.recipients ?? [],
        },
      );
      const deliveryPlan = planNotificationDeliveries(builtNotification);

      notification = builtNotification as typeof notification;
      plan = deliveryPlan;
      logNotificationPlan(type, deliveryPlan);

      await Promise.all([
        new EmailService().sendBulk(deliveryPlan.dispatches),
        new WhatsAppService().sendBulk(deliveryPlan.dispatches),
      ]);

      return deliveryPlan;
    },
    {
      userId: input.recipientUserId,
    },
  ).setRecipients(
    makeUserRecipients({
      displayName: input.fullName,
      email: input.email,
      phoneNumber: input.phoneNumber ?? undefined,
      userId: input.recipientUserId,
    }),
  );

  await input.trigger(notifications);

  return {
    notification,
    plan,
  };
}

export async function planAuthVerificationRequestedNotification(input: {
  companyName: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  subdomain: string;
  token: string;
  userId: string;
}) {
  const verificationUrl = new URL(
    buildTenantDashboardUrl(input.subdomain, {
      currentOrigin: getDashboardAppUrl(),
      pathname: "/onboarding",
    }),
  );
  verificationUrl.searchParams.set("token", input.token);
  verificationUrl.searchParams.set("email", input.email);
  verificationUrl.searchParams.set("company", input.companyName);
  verificationUrl.searchParams.set("subdomain", input.subdomain);
  const result = await executeNotificationTrigger({
    email: input.email,
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    recipientUserId: input.userId,
    trigger: async (notifications) =>
      notifications.channel.authVerificationRequested({
        payload: {
          companyName: input.companyName,
          email: input.email,
          fullName: input.fullName,
          verificationUrl: verificationUrl.toString(),
        },
      }),
  });

  return {
    ...result,
    verificationUrl: verificationUrl.toString(),
  };
}

export async function planAuthEmailVerifiedNotification(input: {
  companyName: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  siteHostname: string;
  userId: string;
}) {
  const dashboardHostname = buildDashboardHostnameForTenantHostname(
    input.siteHostname,
  );

  return executeNotificationTrigger({
    email: input.email,
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    recipientUserId: input.userId,
    trigger: async (notifications) =>
      notifications.channel.authEmailVerified({
        payload: {
          companyName: input.companyName,
          dashboardHostname,
          email: input.email,
          fullName: input.fullName,
          siteHostname: input.siteHostname,
        },
      }),
  });
}

export async function planOnboardingReminderNotification(input: {
  companyName: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  siteHostname: string;
  userId: string;
}) {
  const dashboardHostname = buildDashboardHostnameForTenantHostname(
    input.siteHostname,
  );

  return executeNotificationTrigger({
    email: input.email,
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    recipientUserId: input.userId,
    trigger: async (notifications) =>
      notifications.channel.onboardingReminder({
        payload: {
          companyName: input.companyName,
          dashboardHostname,
          email: input.email,
          fullName: input.fullName,
          siteHostname: input.siteHostname,
        },
      }),
  });
}
