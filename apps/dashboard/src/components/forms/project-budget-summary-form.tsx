"use client";

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
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toMinorUnits } from "@/components/projects/project-budget-utils";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const projectBudgetSummaryFormSchema = z.object({
  approvedBudget: z.string().optional(),
  currency: z.string().trim().min(1, "Currency is required."),
  forecastBudget: z.string().optional(),
});

type ProjectBudgetSummaryFormValues = z.infer<
  typeof projectBudgetSummaryFormSchema
>;

type Props = {
  onSuccess?: () => void;
  projectId: string;
};

export function ProjectBudgetSummaryForm({ onSuccess, projectId }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useZodForm(projectBudgetSummaryFormSchema, {
    defaultValues: {
      approvedBudget: "",
      currency: "NGN",
      forecastBudget: "",
    },
  });
  const upsertMutation = useMutation(
    trpc.projects.upsertBudget.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.projects.getOverviewDetail.queryKey({ projectId }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.projects.getBudgetDetail.queryKey({ projectId }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.projects.getBudget.queryKey({ projectId }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.projects.get.queryKey({ projectId }),
          }),
        ]);
        router.refresh();
        onSuccess?.();
      },
    }),
  );

  async function handleSubmit(values: ProjectBudgetSummaryFormValues) {
    await upsertMutation.mutateAsync({
      actualBudgetMinor: 0,
      approvedBudgetMinor: toMinorUnits(values.approvedBudget),
      currency: values.currency.trim().toUpperCase(),
      forecastBudgetMinor: toMinorUnits(values.forecastBudget),
      projectId,
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <p className="text-sm text-muted-foreground">
          No budget set for this project.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="approvedBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approved budget</FormLabel>
                <FormControl>
                  <Input
                    min="0"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="forecastBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forecast</FormLabel>
                <FormControl>
                  <Input
                    min="0"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input placeholder="NGN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {upsertMutation.error ? (
          <Alert variant="destructive">
            <AlertDescription>{upsertMutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <SubmitButton isSubmitting={upsertMutation.isPending}>
          Create budget
        </SubmitButton>
      </form>
    </Form>
  );
}
