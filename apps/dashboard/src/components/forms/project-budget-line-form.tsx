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
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { Textarea } from "@plotkeys/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  budgetLineCategories,
  budgetLineCategoryLabels,
  toMinorUnits,
} from "@/components/projects/project-budget-utils";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const projectBudgetLineFormSchema = z.object({
  actualAmount: z.string().optional(),
  category: z.enum(budgetLineCategories),
  description: z.string().trim().min(1, "Description is required."),
  estimatedAmount: z.string().optional(),
  notes: z.string().optional(),
  quantity: z.string().optional(),
  unitRate: z.string().optional(),
});

type ProjectBudgetLineFormValues = z.infer<typeof projectBudgetLineFormSchema>;

type CreateBudgetLineFormProps = {
  budgetId: string;
  onSuccess?: () => void;
  projectId: string;
};

function parseOptionalNumber(value?: string) {
  if (!value) return null;

  const numericValue = Number(value);

  return Number.isNaN(numericValue) ? null : numericValue;
}

export function CreateBudgetLineForm({
  budgetId,
  onSuccess,
  projectId,
}: CreateBudgetLineFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useZodForm(projectBudgetLineFormSchema, {
    defaultValues: {
      actualAmount: "",
      category: "other",
      description: "",
      estimatedAmount: "",
      notes: "",
      quantity: "",
      unitRate: "",
    },
  });
  const createMutation = useMutation(
    trpc.projects.createBudgetLine.mutationOptions({
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
        form.reset();
        router.refresh();
        onSuccess?.();
      },
    }),
  );

  async function handleSubmit(values: ProjectBudgetLineFormValues) {
    await createMutation.mutateAsync({
      actualMinor: toMinorUnits(values.actualAmount),
      budgetId,
      category: values.category,
      description: values.description.trim(),
      estimatedMinor: toMinorUnits(values.estimatedAmount),
      notes: values.notes?.trim() || null,
      projectId,
      quantity: parseOptionalNumber(values.quantity),
      unitRateMinor: values.unitRate ? toMinorUnits(values.unitRate) : null,
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Line item description"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <NativeSelect {...field}>
                    {budgetLineCategories.map((category) => (
                      <NativeSelectOption key={category} value={category}>
                        {budgetLineCategoryLabels[category]}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated amount</FormLabel>
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
            name="actualAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual amount</FormLabel>
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    min="0"
                    placeholder="0"
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
            name="unitRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit rate</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional delivery or QS notes"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {createMutation.error ? (
          <Alert variant="destructive">
            <AlertDescription>{createMutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end">
          <Button disabled={createMutation.isPending} type="submit">
            {createMutation.isPending ? "Adding..." : "Add line item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
