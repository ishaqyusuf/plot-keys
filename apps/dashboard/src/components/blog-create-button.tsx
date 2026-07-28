"use client";

import { Icon } from "@plotkeys/ui/icons";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useTRPC } from "@/trpc/client";

type Props = {
  children?: ReactNode;
  showIcon?: boolean;
  size?: "default" | "sm";
  variant?: "default" | "outline";
};

export function CreateBlogPostButton({
  children = "New post",
  showIcon = false,
  size = "sm",
  variant = "default",
}: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createPostMutation = useMutation(
    trpc.blog.create.mutationOptions({
      async onSuccess(post) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.blog.stats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.blog.list.queryKey(),
          }),
        ]);
        router.push(`/blog/${post.id}`);
      },
    }),
  );

  return (
    <SubmitButton
      isSubmitting={createPostMutation.isPending}
      onClick={() => createPostMutation.mutate()}
      variant={variant}
      size={size}
      type="button"
    >
      {showIcon ? <Icon.Add className="size-4" /> : null}
      {children}
    </SubmitButton>
  );
}
