"use client";

import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";

type Props = {
  role: "admin" | "agent" | "owner" | "platform_admin" | "staff";
  token: string;
};

export function AcceptInviteButton({ role, token }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const acceptInviteMutation = useMutation(
    trpc.team.acceptInvite.mutationOptions({
      onError(error) {
        const searchParams = new URLSearchParams({ error: error.message });
        router.replace(`/join/${token}?${searchParams.toString()}`);
      },
      onSuccess() {
        router.push(
          role === "agent" || role === "staff"
            ? `/join/${token}/complete`
            : "/",
        );
        router.refresh();
      },
    }),
  );

  return (
    <SubmitButton
      className="w-full"
      isSubmitting={acceptInviteMutation.isPending}
      onClick={() => acceptInviteMutation.mutate({ token })}
      type="button"
    >
      Accept invite
    </SubmitButton>
  );
}
