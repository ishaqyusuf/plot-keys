"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Table, TableBody, TableHeader } from "@plotkeys/ui/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardTablePage,
  DashboardTablePageBody,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
} from "@/components/dashboard/dashboard-page";
import { CreatePayrollRunForm } from "@/components/forms/project-payroll-run-form";
import { CreateWorkerForm } from "@/components/forms/project-worker-form";
import { useTRPC } from "@/trpc/client";
import {
  PayrollRunRow,
  PayrollRunTableHeader,
  type ProjectPayrollRun,
  type ProjectWorker,
  WorkerRow,
  WorkerTableHeader,
} from "./workforce/columns";
import {
  ProjectPayrollRunsEmptyState,
  ProjectWorkersEmptyState,
  ProjectWorkforceNotFoundState,
} from "./workforce/empty-states";

type ProjectWorkforceTableProps = {
  projectId: string;
};

type WorkerListProps = {
  projectId: string;
  workers: ProjectWorker[];
};

type PayrollRunListProps = {
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

export function ProjectWorkforceTable({
  projectId,
}: ProjectWorkforceTableProps) {
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
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Project workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Workforce & Payroll</DashboardPageTitle>
            <DashboardPageDescription>
              Manage on-site labor and project payroll runs for{" "}
              {detail.project.name}.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild size="sm" variant="outline">
              <Link href={`/projects/${projectId}`}>Back to project</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardTablePage>
        <DashboardTablePageHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <DashboardTablePageTitle>Site workers</DashboardTablePageTitle>
              <DashboardTablePageDescription>
                Review active workers, pay basis, site roles, and off-project
                status.
              </DashboardTablePageDescription>
            </div>
            <Badge variant="outline">
              {detail.workers.length} total - {activeWorkers.length} active
            </Badge>
          </div>
        </DashboardTablePageHeader>
        <DashboardTablePageBody>
          {detail.workers.length > 0 ? (
            <div className="space-y-5 p-0">
              {activeWorkers.length > 0 ? (
                <WorkerList projectId={projectId} workers={activeWorkers} />
              ) : null}
              {otherWorkers.length > 0 ? (
                <div>
                  <div className="border-b border-border/70 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Off project / completed
                  </div>
                  <WorkerList projectId={projectId} workers={otherWorkers} />
                </div>
              ) : null}
            </div>
          ) : (
            <ProjectWorkersEmptyState />
          )}
        </DashboardTablePageBody>
      </DashboardTablePage>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Add worker</DashboardSectionTitle>
            <DashboardSectionDescription>
              Capture the worker name, site role, pay basis, and rate.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>New site worker</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateWorkerForm projectId={projectId} />
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardTablePage>
        <DashboardTablePageHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <DashboardTablePageTitle>Payroll runs</DashboardTablePageTitle>
              <DashboardTablePageDescription>
                Review project-specific payroll cycles and payment status.
              </DashboardTablePageDescription>
            </div>
            <Badge variant="outline">{detail.payrollRuns.length} runs</Badge>
          </div>
        </DashboardTablePageHeader>
        <DashboardTablePageBody>
          {detail.payrollRuns.length > 0 ? (
            <PayrollRunList projectId={projectId} runs={detail.payrollRuns} />
          ) : (
            <ProjectPayrollRunsEmptyState />
          )}
        </DashboardTablePageBody>
      </DashboardTablePage>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Create payroll run</DashboardSectionTitle>
            <DashboardSectionDescription>
              Start a project payroll period for active site labor.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>New payroll run</CardTitle>
          </CardHeader>
          <CardContent>
            <CreatePayrollRunForm projectId={projectId} />
          </CardContent>
        </Card>
      </DashboardSection>
    </div>
  );
}

export function WorkerList({ projectId, workers }: WorkerListProps) {
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
    <div className="overflow-auto overscroll-contain border-border border-x border-b scrollbar-hide">
      {mutationError ? (
        <Alert className="m-4" variant="destructive">
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
              isDeleting={deleteMutation.isPending}
              isUpdating={updateMutation.isPending}
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

export function PayrollRunList({ projectId, runs }: PayrollRunListProps) {
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
    <div className="overflow-auto overscroll-contain border-border border-x border-b scrollbar-hide">
      {updateMutation.error ? (
        <Alert className="m-4" variant="destructive">
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
              isUpdating={updateMutation.isPending}
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
