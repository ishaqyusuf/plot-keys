import { sessionBridgeInputSchema } from "@plotkeys/auth/shared";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  clearAuthSessionCookie,
  clearPendingOnboardingCookie,
  setAuthSessionCookie,
  setPendingOnboardingCookie,
} from "../../../lib/session-cookie";

const sessionPayloadSchema = sessionBridgeInputSchema.extend({
  onboarding: z
    .object({
      company: z.string().trim().min(1),
      subdomain: z.string().trim().min(1),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = sessionPayloadSchema.parse(await request.json());
    const cookieStore = await cookies();
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");

    setAuthSessionCookie(cookieStore, body.sessionToken, host);
    if (body.onboarding) {
      setPendingOnboardingCookie(cookieStore, body.onboarding);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to persist session.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  clearAuthSessionCookie(cookieStore, host);
  clearPendingOnboardingCookie(cookieStore);

  return NextResponse.json({ ok: true });
}
