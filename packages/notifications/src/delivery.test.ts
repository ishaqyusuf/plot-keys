import { describe, expect, test } from "bun:test";

import { createUserNotificationContact } from "./contacts";
import { planNotificationDeliveries } from "./delivery";
import type { NotificationDispatch } from "./core-types";

function dispatch(
  recipients: NotificationDispatch["recipients"],
): NotificationDispatch {
  return {
    channels: ["in_app", "email", "whatsapp"],
    notificationType: "new_lead_captured",
    payload: { body: "A new lead arrived." },
    recipients,
    title: "New lead",
  };
}

describe("notification delivery planning", () => {
  test("plans in-app, email, and WhatsApp based on recipient contact availability", () => {
    const plan = planNotificationDeliveries(
      dispatch([
        createUserNotificationContact({
          email: "agent@example.com",
          phoneNumber: "+2348012345678",
          userId: "user-1",
        }),
      ]),
    );

    expect(plan.dispatches.map((item) => item.channel)).toEqual([
      "in_app",
      "email",
      "whatsapp",
    ]);
    expect(plan.skippedChannels).toEqual([]);
  });

  test("records unavailable-channel skips when recipients lack contact fields", () => {
    const plan = planNotificationDeliveries(
      dispatch([
        createUserNotificationContact({
          userId: "user-1",
        }),
      ]),
    );

    expect(plan.dispatches.map((item) => item.channel)).toEqual(["in_app"]);
    expect(plan.skippedChannels).toEqual([
      {
        channel: "email",
        reason: "No recipients had an email address for email delivery.",
      },
      {
        channel: "whatsapp",
        reason: "No recipients had a phone number for WhatsApp delivery.",
      },
    ]);
  });
});
