import { sessionBridgeInputSchema } from "@plotkeys/auth/shared";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  clearPendingOnboardingCookie,
  clearAuthSessionCookie,
  setPendingOnboardingCookie,
  setAuthSessionCookie,
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

    setAuthSessionCookie(cookieStore, body.sessionToken);
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

  clearAuthSessionCookie(cookieStore);
  clearPendingOnboardingCookie(cookieStore);

  return NextResponse.json({ ok: true });
}
