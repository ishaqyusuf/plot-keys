import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const sessionTokenSchema = z.object({
  exp: z.number().int().positive(),
  userId: z.string().trim().min(1),
});

const verificationTokenSchema = sessionTokenSchema.extend({
  email: z.string().email(),
});

type SignedTokenPayload = z.infer<typeof sessionTokenSchema>;
type VerificationTokenPayload = z.infer<typeof verificationTokenSchema>;

function getAuthSecret() {
  return process.env.BETTER_AUTH_SECRET ?? "plotkeys-local-dev-secret";
}

function createSignature(value: string) {
  return createHmac("sha256", getAuthSecret())
    .update(value)
    .digest("base64url");
}

function encodeToken(payload: SignedTokenPayload | VerificationTokenPayload) {
  const serialized = Buffer.from(JSON.stringify(payload)).toString("base64url");

  return `${serialized}.${createSignature(serialized)}`;
}

function decodeToken<TPayload extends SignedTokenPayload>(
  token: string,
  schema: z.ZodSchema<TPayload>,
) {
  const [serialized, signature] = token.split(".");

  if (!serialized || !signature) {
    throw new Error("Invalid token format.");
  }

  const expectedSignature = createSignature(serialized);

  if (
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    throw new Error("Invalid token signature.");
  }

  const payload = schema.parse(
    JSON.parse(Buffer.from(serialized, "base64url").toString("utf8")),
  );

  if (payload.exp <= Date.now()) {
    throw new Error("Token has expired.");
  }

  return payload;
}

export function createEmailVerificationToken(
  input: Pick<VerificationTokenPayload, "email" | "userId">,
) {
  return encodeToken({
    ...input,
    exp: Date.now() + 1000 * 60 * 30,
  });
}

export function decodeVerificationToken(token: string) {
  return decodeToken(token, verificationTokenSchema);
}
