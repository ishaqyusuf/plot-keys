"use client";

import { Button } from "@plotkeys/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";

type CreateBlogPostButtonProps = {
  children?: React.ReactNode;
  showIcon?: boolean;
  size?: "default" | "sm";
};

export function CreateBlogPostButton({
  children = "New post",
  showIcon = false,
  size = "sm",
}: CreateBlogPostButtonProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createPostMutation = useMutation(
    trpc.workspace.createBlogPost.mutationOptions({
      async onSuccess(post) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.getBlogPostStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.listBlogPosts.queryKey(),
          }),
        ]);
        router.push(`/blog/${post.id}?created=1`);
      },
    }),
  );

  return (
    <Button
      disabled={createPostMutation.isPending}
      onClick={() => createPostMutation.mutate()}
      size={size}
      type="button"
    >
      {showIcon ? <PlusCircle className="size-4" /> : null}
      {createPostMutation.isPending ? "Creating..." : children}
    </Button>
  );
}
