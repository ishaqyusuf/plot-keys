import {
  buildNotificationEvent,
  createNotificationChannelTriggers,
  makeSubscriberRecipients,
  makeUserRecipients,
  normalizeRecipients,
  type NotificationRecipients,
  type NotificationTriggerInput,
  type PlotKeysNotificationType,
} from "../payload-utils";
import type { NotificationTaskPayload } from "../base";

type NotificationServiceContext = {
  companyId?: string | null;
  userId?: string | null;
};

type WithoutAuthor<TType extends PlotKeysNotificationType> = Omit<
  NotificationTriggerInput<TType>,
  "author"
> & {
  author?: NotificationTriggerInput<TType>["author"];
};

type SendFn = <TType extends PlotKeysNotificationType>(
  type: TType,
  input: NotificationTriggerInput<TType>,
) => unknown | Promise<unknown>;

type TriggerTasksClient = {
  trigger: (taskId: string, payload: NotificationTaskPayload) => Promise<unknown>;
};

type NotificationServiceTransport = SendFn | TriggerTasksClient;

function isTriggerTasksClient(
  transport: NotificationServiceTransport,
): transport is TriggerTasksClient {
  return typeof transport !== "function";
}

export class NotificationService {
  private recipients: NotificationRecipients = null;
  public readonly channel: ReturnType<typeof createNotificationChannelTriggers>;

  constructor(
    private readonly transport: NotificationServiceTransport,
    private readonly ctx: NotificationServiceContext = {},
  ) {
    this.channel = createNotificationChannelTriggers({
      getStoredRecipients: () => this.recipients,
      send: (type, input) => this.emit(type, input as never),
    });
  }

  private async emit<TType extends PlotKeysNotificationType>(
    type: TType,
    input: WithoutAuthor<TType>,
  ) {
    const event = buildNotificationEvent(type, input, this.ctx.userId);

    if (isTriggerTasksClient(this.transport)) {
      if (!this.ctx.companyId) {
        throw new Error(
          "NotificationService requires ctx.companyId when using a tasks client.",
        );
      }

      return this.transport.trigger("notification", {
        author: event.author,
        channels: event.channels,
        companyId: this.ctx.companyId,
        payload: event.payload,
        recipients: event.recipients ?? undefined,
        sendEmail: input.sendEmail,
        type,
      } as Extract<NotificationTaskPayload, { type: TType }>);
    }

    return this.transport(type, {
      author: event.author,
      channels: event.channels,
      payload: event.payload,
      recipients: event.recipients,
      sendEmail: input.sendEmail,
    } as NotificationTriggerInput<TType>);
  }

  async send<TType extends PlotKeysNotificationType>(
    type: TType,
    input: WithoutAuthor<TType>,
  ) {
    return this.emit(type, input);
  }

  setRecipients(recipients: NotificationRecipients) {
    this.recipients = normalizeRecipients(recipients);
    return this;
  }

  setUserRecipients(...userIds: string[]) {
    this.recipients = normalizeRecipients(
      makeUserRecipients(...userIds.map((userId) => ({ userId }))),
    );
    return this;
  }

  setSubscriberRecipients(...subscriberIds: string[]) {
    this.recipients = normalizeRecipients(
      makeSubscriberRecipients(
        ...subscriberIds.map((subscriberId) => ({ subscriberId })),
      ),
    );
    return this;
  }
}
