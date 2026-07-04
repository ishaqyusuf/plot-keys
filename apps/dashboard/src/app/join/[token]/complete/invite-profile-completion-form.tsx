"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import Link from "next/link";
import { useMemo, useRef } from "react";

import { completeInviteProfileAction } from "@/app/actions";
import { DevFormQuickFillButton } from "@/components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "@/components/dev/quick-fill";

type InviteProfileCompletionValues = {
  bio?: string;
  imageUrl?: string;
  name: string;
  phone?: string;
};

type InviteProfileCompletionFormProps = {
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
}: InviteProfileCompletionFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);

  const quickFill = useMemo(() => {
    return new QuickFill(
      createQuickFillAdapter<InviteProfileCompletionValues>({
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

          if (
            imageUrlRef.current &&
            typeof values.imageUrl === "string"
          ) {
            imageUrlRef.current.value = values.imageUrl;
          }
        },
        setValue: (name, value) => {
          if (name === "name" && nameRef.current && typeof value === "string") {
            nameRef.current.value = value;
          }

          if (
            name === "phone" &&
            phoneRef.current &&
            typeof value === "string"
          ) {
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
      }),
    );
  }, []);

  return (
    <form action={completeInviteProfileAction} className="space-y-6">
      <input name="token" type="hidden" value={token} />

      <div className="flex justify-end">
        <DevFormQuickFillButton
          onFill={() => quickFill.fill("invite-profile-complete")}
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
        <Button asChild type="button" variant="ghost">
          <Link href="/">Skip for now</Link>
        </Button>
        <Button type="submit">Save and continue</Button>
      </div>
    </form>
  );
}
