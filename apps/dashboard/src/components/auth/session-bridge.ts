"use client";

type PendingOnboardingPayload = {
  company: string;
  subdomain: string;
};

export async function persistSession(
  sessionToken: string,
  onboarding?: PendingOnboardingPayload,
) {
  const response = await fetch("/api/session", {
    body: JSON.stringify({
      onboarding,
      sessionToken,
    }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(payload?.error ?? "Unable to persist session.");
  }
}

export async function clearSession() {
  const response = await fetch("/api/session", {
    credentials: "include",
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to clear session.");
  }
}
