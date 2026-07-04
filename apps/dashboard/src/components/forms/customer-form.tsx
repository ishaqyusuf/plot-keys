"use client";

import { Button } from "@plotkeys/ui/button";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@plotkeys/ui/form";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { Textarea } from "@plotkeys/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const customerFormSchema = z.object({
  email: z.string().email("Enter a valid email.").or(z.literal("")),
  name: z.string().trim().min(1, "Name is required."),
  notes: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["active", "vip", "inactive"]),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

type CustomerFormProps = {
  onCancel?: () => void;
  onSuccess?: () => void;
  sourceLeadId?: string | null;
};

export function CustomerForm({
  onCancel,
  onSuccess,
  sourceLeadId,
}: CustomerFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useZodForm(customerFormSchema, {
    defaultValues: {
      email: "",
      name: "",
      notes: "",
      phone: "",
      status: "active",
    },
  });
  const createCustomerMutation = useMutation(
    trpc.customers.create.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.customers.get.infiniteQueryKey(),
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

  async function handleSubmit(values: CustomerFormValues) {
    await createCustomerMutation.mutateAsync({
      email: values.email.trim() || null,
      name: values.name.trim(),
      notes: values.notes?.trim() || null,
      phone: values.phone?.trim() || null,
      sourceLeadId: sourceLeadId ?? null,
      status: values.status,
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <DashboardFormBody>
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
                  <FormControl>
                    <NativeSelect {...field}>
                      <NativeSelectOption value="active">
                        Active
                      </NativeSelectOption>
                      <NativeSelectOption value="vip">VIP</NativeSelectOption>
                      <NativeSelectOption value="inactive">
                        Inactive
                      </NativeSelectOption>
                    </NativeSelect>
                  </FormControl>
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

          {createCustomerMutation.error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {createCustomerMutation.error.message}
              </AlertDescription>
            </Alert>
          ) : null}
        </DashboardFormBody>

        <DashboardFormFooter>
          <div className="flex justify-end gap-3">
            <Button onClick={onCancel} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={createCustomerMutation.isPending} type="submit">
              {createCustomerMutation.isPending
                ? "Adding..."
                : "Add customer"}
            </Button>
          </div>
        </DashboardFormFooter>
      </form>
    </Form>
  );
}
