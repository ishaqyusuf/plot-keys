"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useRef } from "react";

import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useTRPC } from "@/trpc/client";

type InviteProfileCompletionValues = {
  bio?: string;
  imageUrl?: string;
  name: string;
  phone?: string;
};

type Props = {
  assignedRoleLabel: string;
  defaultBio?: string | null;
  defaultImageUrl?: string | null;
  defaultName: string;
  defaultPhone?: string | null;
  email: string;
  isAgentInvite: boolean;
  token: string;
};

export function InviteProfileCompletionForm({
  assignedRoleLabel,
  defaultBio,
  defaultImageUrl,
  defaultName,
  defaultPhone,
  email,
  isAgentInvite,
  token,
}: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const completeProfileMutation = useMutation(
    trpc.team.completeInviteProfile.mutationOptions({
      onError(error) {
        const searchParams = new URLSearchParams({ error: error.message });
        router.replace(
          error.message.includes("Accept the invite") ||
            error.message.includes("different email")
            ? `/join/${token}?${searchParams.toString()}`
            : `/join/${token}/complete?${searchParams.toString()}`,
        );
      },
      onSuccess() {
        router.push("/?inviteProfileCompleted=1");
        router.refresh();
      },
    }),
  );

  const quickFillAdapter = useMemo(() => {
    return createQuickFillAdapter<InviteProfileCompletionValues>({
      getValues: () => ({
        bio: bioRef.current?.value ?? "",
        imageUrl: imageUrlRef.current?.value ?? "",
        name: nameRef.current?.value ?? "",
        phone: phoneRef.current?.value ?? "",
      }),
      reset: (values) => {
        if (nameRef.current && typeof values.name === "string") {
          nameRef.current.value = values.name;
        }

        if (phoneRef.current && typeof values.phone === "string") {
          phoneRef.current.value = values.phone;
        }

        if (bioRef.current && typeof values.bio === "string") {
          bioRef.current.value = values.bio;
        }

        if (imageUrlRef.current && typeof values.imageUrl === "string") {
          imageUrlRef.current.value = values.imageUrl;
        }
      },
      setValue: (name, value) => {
        if (name === "name" && nameRef.current && typeof value === "string") {
          nameRef.current.value = value;
        }

        if (name === "phone" && phoneRef.current && typeof value === "string") {
          phoneRef.current.value = value;
        }

        if (name === "bio" && bioRef.current && typeof value === "string") {
          bioRef.current.value = value;
        }

        if (
          name === "imageUrl" &&
          imageUrlRef.current &&
          typeof value === "string"
        ) {
          imageUrlRef.current.value = value;
        }
      },
    });
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    completeProfileMutation.mutate({
      bio: isAgentInvite ? bioRef.current?.value.trim() || null : null,
      imageUrl: isAgentInvite
        ? imageUrlRef.current?.value.trim() || null
        : null,
      name: nameRef.current?.value.trim() ?? "",
      phone: phoneRef.current?.value.trim() || null,
      token,
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex justify-end">
        <QuickFill
          args={{ form: quickFillAdapter }}
          name="invite-profile-complete"
        />
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input disabled value={email} />
        </Field>

        <Field>
          <FieldLabel>Name *</FieldLabel>
          <Input
            defaultValue={defaultName}
            name="name"
            placeholder="Your full name"
            ref={nameRef}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Job title</FieldLabel>
          <Input disabled value={assignedRoleLabel} />
        </Field>

        <Field>
          <FieldLabel>Phone</FieldLabel>
          <Input
            defaultValue={defaultPhone ?? ""}
            name="phone"
            placeholder="+2348012345678"
            ref={phoneRef}
            type="tel"
          />
        </Field>

        {isAgentInvite ? (
          <>
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Input
                defaultValue={defaultBio ?? ""}
                name="bio"
                placeholder="Short professional bio"
                ref={bioRef}
              />
            </Field>

            <Field>
              <FieldLabel>Photo URL</FieldLabel>
              <Input
                defaultValue={defaultImageUrl ?? ""}
                name="imageUrl"
                placeholder="https://..."
                ref={imageUrlRef}
                type="url"
              />
            </Field>
          </>
        ) : null}
      </FieldGroup>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" type="button" asChild>
          <Link href="/">Skip for now</Link>
        </Button>
        <SubmitButton isSubmitting={completeProfileMutation.isPending}>
          Save and continue
        </SubmitButton>
      </div>
    </form>
  );
}
