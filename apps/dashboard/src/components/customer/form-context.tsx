"use client";

import type { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import { z } from "zod";
import { useZodForm } from "@/hooks/use-zod-form";

export const customerFormSchema = z.object({
  email: z.string().email("Enter a valid email.").or(z.literal("")),
  name: z.string().trim().min(1, "Name is required."),
  notes: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["active", "vip", "inactive"]),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

type Props = {
  children: ReactNode;
  defaultValues?: Partial<CustomerFormValues>;
};

export function CustomerFormContext({ children, defaultValues }: Props) {
  const form = useZodForm(customerFormSchema, {
    defaultValues: {
      email: defaultValues?.email ?? "",
      name: defaultValues?.name ?? "",
      notes: defaultValues?.notes ?? "",
      phone: defaultValues?.phone ?? "",
      status: defaultValues?.status ?? "active",
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
