import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { clearPendingOnboardingCookie } from "@/lib/session-cookie";

export async function DELETE() {
  const cookieStore = await cookies();

  clearPendingOnboardingCookie(cookieStore);

  return NextResponse.json({ ok: true });
}
