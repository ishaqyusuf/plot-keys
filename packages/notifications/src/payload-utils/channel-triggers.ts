import type {
  NotificationRecipients,
  NotificationTriggerInput,
  PlotKeysNotificationType,
} from "./types";
import { normalizeRecipients } from "./recipients";

type SendFn = <TType extends PlotKeysNotificationType>(
  type: TType,
  input: NotificationTriggerInput<TType>,
) => unknown | Promise<unknown>;

type ChannelTriggerFactoryOptions = {
  getStoredRecipients?: () => NotificationRecipients;
  send: SendFn;
};

function resolveRecipients(
  explicitRecipients: NotificationRecipients | undefined,
  storedRecipients: NotificationRecipients | undefined,
) {
  if (explicitRecipients?.length) {
    return normalizeRecipients(explicitRecipients);
  }

  if (storedRecipients?.length) {
    return normalizeRecipients(storedRecipients);
  }

  return null;
}

type TriggerInput<TType extends PlotKeysNotificationType> =
  NotificationTriggerInput<TType>;

export function createNotificationChannelTriggers(
  options: ChannelTriggerFactoryOptions,
) {
  const getStoredRecipients = options.getStoredRecipients ?? (() => null);

  function send<TType extends PlotKeysNotificationType>(
    type: TType,
    input: TriggerInput<TType>,
  ) {
    const { recipients, ...rest } = input;

    return options.send(type, {
      ...rest,
      recipients: resolveRecipients(recipients, getStoredRecipients()),
    });
  }

  return {
    authVerificationRequested(input: TriggerInput<"auth_verification_requested">) {
      return send("auth_verification_requested", input);
    },
    authEmailVerified(input: TriggerInput<"auth_email_verified">) {
      return send("auth_email_verified", input);
    },
    onboardingReminder(input: TriggerInput<"onboarding_reminder">) {
      return send("onboarding_reminder", input);
    },
    signupSuccessful(input: TriggerInput<"signup_successful">) {
      return send("signup_successful", input);
    },
  };
}
