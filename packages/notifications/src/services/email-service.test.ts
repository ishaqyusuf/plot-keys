import { afterEach, describe, expect, test } from "bun:test";

import { EmailService } from "./email-service";

const originalEnv = {
  EMAIL_DELIVERY_MODE: process.env.EMAIL_DELIVERY_MODE,
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
  EMAIL_QA_DOMAIN_ROUTES: process.env.EMAIL_QA_DOMAIN_ROUTES,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

afterEach(() => {
  if (originalEnv.EMAIL_DELIVERY_MODE === undefined) {
    delete process.env.EMAIL_DELIVERY_MODE;
  } else {
    process.env.EMAIL_DELIVERY_MODE = originalEnv.EMAIL_DELIVERY_MODE;
  }
  if (originalEnv.EMAIL_QA_DOMAIN_ROUTES === undefined) {
    delete process.env.EMAIL_QA_DOMAIN_ROUTES;
  } else {
    process.env.EMAIL_QA_DOMAIN_ROUTES = originalEnv.EMAIL_QA_DOMAIN_ROUTES;
  }
  if (originalEnv.EMAIL_FROM_ADDRESS === undefined) {
    delete process.env.EMAIL_FROM_ADDRESS;
  } else {
    process.env.EMAIL_FROM_ADDRESS = originalEnv.EMAIL_FROM_ADDRESS;
  }

  if (originalEnv.RESEND_API_KEY === undefined) {
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.RESEND_API_KEY = originalEnv.RESEND_API_KEY;
  }
});

describe("EmailService", () => {
  test("skips delivery with an explicit reason when required sender configuration is missing", async () => {
    process.env.EMAIL_DELIVERY_MODE = "live";
    delete process.env.EMAIL_FROM_ADDRESS;
    delete process.env.RESEND_API_KEY;

    const result = await new EmailService().send({
      body: "Hello",
      subject: "Test",
      to: "agent@example.com",
    });

    expect(result).toMatchObject({
      reason: "missing-email-provider-configuration",
      recipients: ["agent@example.com"],
      status: "skipped",
    });
  });
});
