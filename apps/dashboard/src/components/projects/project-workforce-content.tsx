"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Table, TableBody, TableHeader } from "@plotkeys/ui/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CreatePayrollRunForm } from "@/components/forms/project-payroll-run-form";
import { CreateWorkerForm } from "@/components/forms/project-worker-form";
import { ProjectSection } from "@/components/projects/project-section";
import { ProjectSubpageHeader } from "@/components/projects/project-subpage-header";
import {
  ProjectPayrollRunsEmptyState,
  ProjectWorkersEmptyState,
  ProjectWorkforceNotFoundState,
} from "@/components/projects/project-workforce-empty-states";
import {
  PayrollRunRow,
  PayrollRunTableHeader,
  type ProjectPayrollRun,
  type ProjectWorker,
  WorkerRow,
  WorkerTableHeader,
} from "@/components/projects/project-workforce-rows";
import { useTRPC } from "@/trpc/client";

type Props = {
  projectId: string;
};

type WorkerListInput = {
  projectId: string;
  workers: ProjectWorker[];
};

type PayrollRunListInput = {
  projectId: string;
  runs: ProjectPayrollRun[];
};

function useInvalidateProjectWorkforce(projectId: string) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return async function invalidateProjectWorkforce() {
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
        queryKey: trpc.projects.listPayrollRuns.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.get.queryKey({ projectId }),
      }),
    ]);
    router.refresh();
  };
}

export function ProjectWorkforceContent({ projectId }: Props) {
  const trpc = useTRPC();
  const { data: detail } = useSuspenseQuery(
    trpc.projects.getWorkforceDetail.queryOptions({ projectId }),
  );

  if (!detail) {
    return <ProjectWorkforceNotFoundState />;
  }

  const activeWorkers = detail.workers.filter(
    (worker) => worker.status === "active",
  );
  const otherWorkers = detail.workers.filter(
    (worker) => worker.status !== "active",
  );

  return (
    <div className="flex flex-col gap-6">
      <ProjectSubpageHeader
        description={`Manage on-site labor and project payroll runs for ${detail.project.name}.`}
        projectId={projectId}
        title="Workforce & Payroll"
      />

      <section className="overflow-hidden border bg-background">
        <div className="border-b border-border px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-sm font-medium text-foreground">
                Site workers
              </h2>
              <p className="text-sm text-muted-foreground">
                Review active workers, pay basis, site roles, and off-project
                status.
              </p>
            </div>
            <Badge variant="outline">
              {detail.workers.length} total - {activeWorkers.length} active
            </Badge>
          </div>
        </div>
        <div>
          {detail.workers.length > 0 ? (
            <div className="space-y-5 p-0">
              {activeWorkers.length > 0 ? (
                <WorkerList projectId={projectId} workers={activeWorkers} />
              ) : null}
              {otherWorkers.length > 0 ? (
                <div>
                  <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
                    Off project / completed
                  </div>
                  <WorkerList projectId={projectId} workers={otherWorkers} />
                </div>
              ) : null}
            </div>
          ) : (
            <ProjectWorkersEmptyState />
          )}
        </div>
      </section>

      <ProjectSection
        description="Capture the worker name, site role, pay basis, and rate."
        title="Add worker"
      >
        <div className="border bg-background p-5">
          <CreateWorkerForm projectId={projectId} />
        </div>
      </ProjectSection>

      <section className="overflow-hidden border bg-background">
        <div className="border-b border-border px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-sm font-medium text-foreground">
                Payroll runs
              </h2>
              <p className="text-sm text-muted-foreground">
                Review project-specific payroll cycles and payment status.
              </p>
            </div>
            <Badge variant="outline">{detail.payrollRuns.length} runs</Badge>
          </div>
        </div>
        <div>
          {detail.payrollRuns.length > 0 ? (
            <PayrollRunList projectId={projectId} runs={detail.payrollRuns} />
          ) : (
            <ProjectPayrollRunsEmptyState />
          )}
        </div>
      </section>

      <ProjectSection
        description="Start a project payroll period for active site labor."
        title="Create payroll run"
      >
        <div className="border bg-background p-5">
          <CreatePayrollRunForm projectId={projectId} />
        </div>
      </ProjectSection>
    </div>
  );
}

export function WorkerList({ projectId, workers }: WorkerListInput) {
  const trpc = useTRPC();
  const invalidateProjectWorkforce = useInvalidateProjectWorkforce(projectId);
  const updateMutation = useMutation(
    trpc.projects.updateWorker.mutationOptions({
      onSuccess: invalidateProjectWorkforce,
    }),
  );
  const deleteMutation = useMutation(
    trpc.projects.deleteWorker.mutationOptions({
      onSuccess: invalidateProjectWorkforce,
    }),
  );
  const mutationError =
    updateMutation.error?.message ?? deleteMutation.error?.message;
  const handleStatusChange = (
    workerId: ProjectWorker["id"],
    status: ProjectWorker["status"],
  ) => {
    updateMutation.mutate({
      projectId,
      status,
      workerId,
    });
  };
  const handleDelete = (workerId: ProjectWorker["id"]) => {
    deleteMutation.mutate({
      projectId,
      workerId,
    });
  };

  return (
    <div className="overflow-auto overscroll-contain border-x border-b border-border scrollbar-hide">
      {mutationError ? (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{mutationError}</AlertDescription>
        </Alert>
      ) : null}

      <Table className="min-w-full">
        <TableHeader className="bg-background">
          <WorkerTableHeader />
        </TableHeader>
        <TableBody>
          {workers.map((worker) => (
            <WorkerRow
              isDeletePending={deleteMutation.isPending}
              isDeleting={
                deleteMutation.isPending &&
                deleteMutation.variables?.workerId === worker.id
              }
              isUpdatePending={updateMutation.isPending}
              isUpdating={
                updateMutation.isPending &&
                updateMutation.variables?.workerId === worker.id
              }
              key={worker.id}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              worker={worker}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function PayrollRunList({ projectId, runs }: PayrollRunListInput) {
  const trpc = useTRPC();
  const invalidateProjectWorkforce = useInvalidateProjectWorkforce(projectId);
  const updateMutation = useMutation(
    trpc.projects.updatePayrollRun.mutationOptions({
      onSuccess: invalidateProjectWorkforce,
    }),
  );
  const handleStatusChange = (
    payrollRunId: ProjectPayrollRun["id"],
    status: ProjectPayrollRun["status"],
  ) => {
    updateMutation.mutate({
      payrollRunId,
      projectId,
      status,
    });
  };

  return (
    <div className="overflow-auto overscroll-contain border-x border-b border-border scrollbar-hide">
      {updateMutation.error ? (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{updateMutation.error.message}</AlertDescription>
        </Alert>
      ) : null}

      <Table className="min-w-full">
        <TableHeader className="bg-background">
          <PayrollRunTableHeader />
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <PayrollRunRow
              isUpdatePending={updateMutation.isPending}
              isUpdating={
                updateMutation.isPending &&
                updateMutation.variables?.payrollRunId === run.id
              }
              key={run.id}
              onStatusChange={handleStatusChange}
              run={run}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
