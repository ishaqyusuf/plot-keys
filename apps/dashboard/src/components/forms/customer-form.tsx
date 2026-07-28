"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@plotkeys/ui/form";
import { Input } from "@plotkeys/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { Textarea } from "@plotkeys/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import type { CustomerFormValues } from "@/components/customer/form-context";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { useTRPC } from "@/trpc/client";

type Props = {
  customerId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  sourceLeadId?: string | null;
};

export function CustomerForm({
  customerId,
  onCancel,
  onSuccess,
  sourceLeadId,
}: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useFormContext<CustomerFormValues>();
  const createCustomerMutation = useMutation(
    trpc.customers.create.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.customers.get.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.customers.getById.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.customers.stats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.filters.customers.queryKey(),
          }),
        ]);
        form.reset();
        onSuccess?.();
      },
    }),
  );
  const updateCustomerMutation = useMutation(
    trpc.customers.update.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.customers.get.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.customers.getById.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.customers.stats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.filters.customers.queryKey(),
          }),
        ]);
        onSuccess?.();
      },
    }),
  );
  const activeMutation = customerId
    ? updateCustomerMutation
    : createCustomerMutation;

  async function handleSubmit(values: CustomerFormValues) {
    const payload = {
      email: values.email.trim() || null,
      name: values.name.trim(),
      notes: values.notes?.trim() || null,
      phone: values.phone?.trim() || null,
      status: values.status,
    };

    if (customerId) {
      await updateCustomerMutation.mutateAsync({
        customerId,
        ...payload,
      });
      return;
    }

    await createCustomerMutation.mutateAsync({
      ...payload,
      sourceLeadId: sourceLeadId ?? null,
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormBody>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      placeholder="Full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        placeholder="name@company.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="tel"
                        placeholder="+234..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Budget, preferred areas, follow-up context..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {activeMutation.error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {activeMutation.error.message}
              </AlertDescription>
            </Alert>
          ) : null}
        </FormBody>

        <FormFooter>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onCancel} type="button">
              Cancel
            </Button>
            <SubmitButton isSubmitting={activeMutation.isPending}>
              {customerId ? "Save customer" : "Add customer"}
            </SubmitButton>
          </div>
        </FormFooter>
      </form>
    </Form>
  );
}
