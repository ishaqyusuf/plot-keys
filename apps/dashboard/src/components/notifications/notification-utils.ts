export function formatNotificationDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatNotificationType(type: string) {
  return type.replace(/_/g, " ");
}
