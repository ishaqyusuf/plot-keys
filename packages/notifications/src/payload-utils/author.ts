import type { NotificationAuthor } from "./types";

export function resolveNotificationAuthor(input: {
  author?: NotificationAuthor;
  authUserId?: string | null;
}) {
  const explicitAuthor = input.author;

  if (explicitAuthor?.id) {
    return explicitAuthor;
  }

  if (input.authUserId?.trim()) {
    return {
      id: input.authUserId.trim(),
    };
  }

  throw new Error(
    "Notification author is required. Provide author or auth user id.",
  );
}
