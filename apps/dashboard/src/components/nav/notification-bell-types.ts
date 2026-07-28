export type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};
