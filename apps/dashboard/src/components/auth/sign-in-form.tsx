"use client";

import {
  type SignInInput,
  signInInputSchema,
} from "@plotkeys/api/schemas/auth";
import { authRoutes } from "@plotkeys/auth/shared";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@plotkeys/ui/command";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Icon } from "@plotkeys/ui/icons";
import { Input } from "@plotkeys/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@plotkeys/ui/popover";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  TenantLink as Link,
  useTenantRouter,
} from "@/components/nav/tenant-link";
import { useZodForm } from "@/hooks/use-zod-form";
import { type DevAccount, useDevToolsStore } from "@/stores/dev-tools";
import { useTRPC } from "@/trpc/client";
import { AuthFormError } from "./auth-form-error";
import { persistSession } from "./session-bridge";

function DevEmailCombobox({
  accounts,
  onSelect,
  value,
}: {
  accounts: DevAccount[];
  onSelect: (account: DevAccount) => void;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedAccount =
    accounts.find((account) => account.email === value) ?? null;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAccounts = useMemo(() => {
    if (!normalizedQuery) {
      return accounts.slice(0, 30);
    }

    return accounts
      .filter((account) =>
        [account.name, account.email, account.company, account.subdomain]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 30);
  }, [accounts, normalizedQuery]);

  function selectAccount(account: DevAccount) {
    onSelect(account);
    setQuery("");
    setOpen(false);
  }

  return (
    <Field>
      <FieldLabel htmlFor="sign-in-email">Email address</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            id="sign-in-email"
            variant="outline"
            className="h-11 w-full justify-between px-3 text-left font-normal"
            type="button"
          >
            <span className="min-w-0 truncate">
              {selectedAccount?.email ?? "Search email"}
            </span>
            <Icon.ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-96 max-w-[calc(100vw-2rem)] p-1"
        >
          <Command shouldFilter={false}>
            <CommandInput
              onValueChange={setQuery}
              placeholder="Search email"
              value={query}
            />
            <CommandList>
              {filteredAccounts.length > 0 ? (
                <CommandGroup>
                  {filteredAccounts.map((account) => (
                    <CommandItem
                      key={account.email}
                      onSelect={() => selectAccount(account)}
                      value={account.email}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {account.name} - {account.role}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {account.email}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {account.company}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {account.role}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No emails found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
}

export function SignInForm({
  initialError,
  showCreateAccount = true,
}: {
  initialError?: string;
  showCreateAccount?: boolean;
}) {
  const router = useTenantRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const redirectTo = searchParams.get("redirect");
  const [formError, setFormError] = useState<string | null>(
    initialError ?? null,
  );
  const form = useZodForm(signInInputSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const devAccounts = useDevToolsStore((s) => s.accounts);
  const showDevEmailPicker = process.env.NODE_ENV === "development";
  const signInMutation = useMutation(
    trpc.auth.signIn.mutationOptions({
      onError(error) {
        setFormError(error.message);
      },
      async onSuccess(result) {
        // console.log("Sign-in successful, session token received:", result);
        await persistSession(result.sessionToken);
        router.push(redirectTo || result.redirectTo);
        router.refresh();
      },
    }),
  );

  async function onSubmit(values: SignInInput) {
    setFormError(null);
    await signInMutation.mutateAsync(values);
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="border border-border bg-card px-4 py-3 text-sm leading-7 text-muted-foreground">
        Sign-in is scoped to the current tenant host. Dev account autofill only
        shows saved accounts that match this workspace.
      </div>

      <FieldGroup>
        {showDevEmailPicker ? (
          <>
            <input type="hidden" {...form.register("email")} />
            <DevEmailCombobox
              accounts={devAccounts}
              onSelect={(account) => {
                form.setValue("email", account.email, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                form.setValue("password", account.password, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              value={form.watch("email")}
            />
          </>
        ) : (
          <Field>
            <FieldLabel htmlFor="sign-in-email">Email address</FieldLabel>
            <Input
              id="sign-in-email"
              placeholder="founder@astergrove.com"
              type="email"
              {...form.register("email")}
            />
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
          <Input
            id="sign-in-password"
            placeholder="Enter your password"
            type="password"
            {...form.register("password")}
          />
        </Field>
      </FieldGroup>

      <AuthFormError
        message={
          formError ??
          form.formState.errors.email?.message ??
          form.formState.errors.password?.message
        }
      />

      <div className="flex flex-col gap-3">
        <SubmitButton
          className="h-11 w-full"
          isSubmitting={signInMutation.isPending}
        >
          Sign in
        </SubmitButton>
        {showCreateAccount ? (
          <Button variant="secondary" className="w-full" asChild>
            <Link
              href={
                redirectTo
                  ? `${authRoutes.signUp}?redirect=${encodeURIComponent(redirectTo)}`
                  : authRoutes.signUp
              }
            >
              Create account
            </Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
