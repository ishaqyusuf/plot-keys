import { sessionBridgeInputSchema } from "@plotkeys/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  clearAuthSessionCookie,
  setAuthSessionCookie,
} from "../../../lib/session-cookie";

export async function POST(request: Request) {
  try {
    const body = sessionBridgeInputSchema.parse(await request.json());
    const cookieStore = await cookies();

    setAuthSessionCookie(cookieStore, body.sessionToken);

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

  return NextResponse.json({ ok: true });
}
