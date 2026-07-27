import { describe, expect, test } from "bun:test";
import { resolveEmailRecipients } from "./email";

describe("PlotKeys hybrid email routing", () => {
  test("routes mapped QA recipients independently from ordinary mail", () => {
    const result = resolveEmailRecipients(
      ["owner@plot.test", "customer@example.com"],
      {
        EMAIL_QA_DOMAIN_ROUTES: '{"plot.test":"tester@example.com"}',
      },
    );
    expect(result.routes).toEqual([
      {
        originalRecipient: "owner@plot.test",
        qaRouted: true,
        recipient: "tester@example.com",
      },
      {
        originalRecipient: "customer@example.com",
        qaRouted: false,
        recipient: "customer@example.com",
      },
    ]);
  });

  test("fails closed for unmapped test recipients", () => {
    expect(() =>
      resolveEmailRecipients("owner@unknown.test", {
        EMAIL_QA_DOMAIN_ROUTES: '{"plot.test":"tester@example.com"}',
      }),
    ).toThrow("blocked unmatched recipient domain");
  });
});
