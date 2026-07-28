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
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const projectPayrollRunFormSchema = z.object({
  periodEnd: z.string().trim().min(1, "Period end is required."),
  periodStart: z.string().trim().min(1, "Period start is required."),
});

type ProjectPayrollRunFormValues = z.infer<typeof projectPayrollRunFormSchema>;

type Props = {
  onSuccess?: () => void;
  projectId: string;
};

export function CreatePayrollRunForm({ onSuccess, projectId }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useZodForm(projectPayrollRunFormSchema, {
    defaultValues: {
      periodEnd: "",
      periodStart: "",
    },
  });
  const createMutation = useMutation(
    trpc.projects.createPayrollRun.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.projects.getOverviewDetail.queryKey({ projectId }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.projects.getWorkforceDetail.queryKey({ projectId }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.projects.listPayrollRuns.queryKey({ projectId }),
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

  async function handleSubmit(values: ProjectPayrollRunFormValues) {
    await createMutation.mutateAsync({
      periodEnd: values.periodEnd,
      periodStart: values.periodStart,
      projectId,
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="periodStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period start</FormLabel>
                <FormControl>
                  <Input required type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="periodEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period end</FormLabel>
                <FormControl>
                  <Input required type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {createMutation.error ? (
          <Alert variant="destructive">
            <AlertDescription>{createMutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end">
          <SubmitButton isSubmitting={createMutation.isPending}>
            Create payroll run
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
