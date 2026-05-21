"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useMemo, useRef } from "react";
import { DevFormQuickFillButton } from "../../../components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "../../../components/dev/quick-fill";
import { useDevToolsStore } from "../../../stores/dev-tools";
import { signUpForInviteAction } from "../../actions";

type InviteSignUpValues = {
  name: string;
  password: string;
};

type InviteSignUpFormProps = {
  companyName: string;
  companySlug: string;
  email: string;
  token: string;
};

export function InviteSignUpForm({
  companyName,
  companySlug,
  email,
  token,
}: InviteSignUpFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const addAccount = useDevToolsStore((state) => state.addAccount);

  const quickFill = useMemo(() => {
    return new QuickFill(
      createQuickFillAdapter<InviteSignUpValues>({
        getValues: () => ({
          name: nameRef.current?.value ?? "",
          password: passwordRef.current?.value ?? "",
        }),
        reset: (values) => {
          if (nameRef.current && typeof values.name === "string") {
            nameRef.current.value = values.name;
          }

          if (passwordRef.current && typeof values.password === "string") {
            passwordRef.current.value = values.password;
          }
        },
        setValue: (name, value) => {
          if (name === "name" && nameRef.current && typeof value === "string") {
            nameRef.current.value = value;
          }

          if (
            name === "password" &&
            passwordRef.current &&
            typeof value === "string"
          ) {
            passwordRef.current.value = value;
          }
        },
      }),
    );
  }, []);

  return (
    <form
      action={signUpForInviteAction}
      className="space-y-5"
      onSubmit={() => {
        if (process.env.NODE_ENV !== "development") {
          return;
        }

        const name = nameRef.current?.value.trim();
        const password = passwordRef.current?.value;

        if (!name || !password) {
          return;
        }

        addAccount({
          company: companyName,
          email,
          name,
          password,
          subdomain: companySlug,
        });
      }}
    >
      <input name="token" type="hidden" value={token} />
      <div className="flex justify-end">
        <DevFormQuickFillButton
          onFill={() => quickFill.fill("invite-sign-up")}
        />
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel>Email address</FieldLabel>
          <Input disabled value={email} />
        </Field>
        <Field>
          <FieldLabel htmlFor="invite-name">Full name</FieldLabel>
          <Input
            autoComplete="name"
            id="invite-name"
            name="name"
            placeholder="Enter your full name"
            ref={nameRef}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="invite-password">Password</FieldLabel>
          <Input
            autoComplete="new-password"
            id="invite-password"
            minLength={8}
            name="password"
            placeholder="Create a password"
            ref={passwordRef}
            required
            type="password"
          />
        </Field>
      </FieldGroup>
      <Button className="w-full" type="submit">
        Create account and accept invite
      </Button>
    </form>
  );
}
