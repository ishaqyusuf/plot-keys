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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  toMinorUnits,
  workerPayBasis,
  workerPayBasisLabels,
} from "@/components/projects/project-workforce-utils";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const projectWorkerFormSchema = z.object({
  fullName: z.string().trim().min(1, "Worker name is required."),
  payBasis: z.enum(workerPayBasis),
  payRate: z.string().optional(),
  role: z.string().optional(),
});

type ProjectWorkerFormValues = z.infer<typeof projectWorkerFormSchema>;

type Props = {
  onSuccess?: () => void;
  projectId: string;
};

export function CreateWorkerForm({ onSuccess, projectId }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useZodForm(projectWorkerFormSchema, {
    defaultValues: {
      fullName: "",
      payBasis: "daily",
      payRate: "",
      role: "",
    },
  });
  const createMutation = useMutation(
    trpc.projects.createWorker.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.projects.getOverviewDetail.queryKey({ projectId }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.projects.getWorkforceDetail.queryKey({ projectId }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.projects.listWorkers.queryKey({ projectId }),
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

  async function handleSubmit(values: ProjectWorkerFormValues) {
    await createMutation.mutateAsync({
      fullName: values.fullName.trim(),
      payBasis: values.payBasis,
      payRateMinor: toMinorUnits(values.payRate),
      projectId,
      role: values.role?.trim() || null,
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Worker name" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mason, electrician, site hand..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payBasis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay basis</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pay basis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workerPayBasis.map((basis) => (
                      <SelectItem key={basis} value={basis}>
                        {workerPayBasisLabels[basis]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay rate</FormLabel>
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

        {createMutation.error ? (
          <Alert variant="destructive">
            <AlertDescription>{createMutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end">
          <SubmitButton isSubmitting={createMutation.isPending}>
            Add worker
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
