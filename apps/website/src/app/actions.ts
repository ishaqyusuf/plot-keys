"use server";

import { createPrismaClient } from "@plotkeys/db";

type ActionState = {
  success: boolean;
  message: string;
} | null;

export async function requestEarlyAccess(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!name || name.trim().length === 0) {
    return { success: false, message: "Please enter your name." };
  }

  try {
    const prisma = createPrismaClient().db!;
    await prisma.waitlistEntry.upsert({
      where: { email_type: { email: email.toLowerCase(), type: "early_access" } },
      create: {
        email: email.toLowerCase(),
        name: name.trim(),
        type: "early_access",
      },
      update: { name: name.trim() },
    });

    return { success: true, message: "You're on the list! We'll be in touch soon." };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function subscribeNewsletter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get("email") as string | null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const prisma = createPrismaClient().db!;
    await prisma.waitlistEntry.upsert({
      where: { email_type: { email: email.toLowerCase(), type: "newsletter" } },
      create: {
        email: email.toLowerCase(),
        type: "newsletter",
      },
      update: {},
    });

    return { success: true, message: "Subscribed! You'll hear from us soon." };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
