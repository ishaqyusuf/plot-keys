"use client";

import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { NotificationsColumnVisibility } from "@/components/notifications-column-visibility";
import { useTRPC } from "@/trpc/client";

export function NotificationsActions() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: unreadCount } = useSuspenseQuery(
    trpc.notifications.unreadCount.queryOptions(),
  );

  const invalidateNotifications = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.unreadCount.queryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.bell.queryKey(),
      }),
    ]);
  };

  const markAllReadMutation = useMutation(
    trpc.notifications.markAllRead.mutationOptions({
      onSuccess: invalidateNotifications,
    }),
  );

  return (
    <div className="flex items-center gap-2">
      <NotificationsColumnVisibility />
      {unreadCount > 0 ? (
        <div className="hidden sm:block">
          <SubmitButton
            variant="outline"
            size="sm"
            isSubmitting={markAllReadMutation.isPending}
            onClick={() => markAllReadMutation.mutate()}
          >
            Mark all read
          </SubmitButton>
        </div>
      ) : null}
    </div>
  );
}
