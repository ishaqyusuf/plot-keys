import { authRoutes } from "@plotkeys/auth/shared";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  clearAuthSessionCookie,
  clearPendingOnboardingCookie,
} from "../../lib/session-cookie";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  clearAuthSessionCookie(cookieStore);
  clearPendingOnboardingCookie(cookieStore);

  return NextResponse.redirect(new URL(authRoutes.signIn, request.url));
}
