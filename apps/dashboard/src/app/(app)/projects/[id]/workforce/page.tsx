import { createPrismaClient } from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  DashboardPage,
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
} from "../../../../../components/dashboard/dashboard-page";
import {
  AddWorkerForm,
  CreatePayrollRunForm,
  PayrollRunList,
  WorkerList,
} from "../../../../../components/projects/project-workforce";
import { requireOnboardedSession } from "../../../../../lib/session";

type WorkforcePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectWorkforcePage({
  params,
}: WorkforcePageProps) {
  const { id: projectId } = await params;
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const prisma = createPrismaClient().db;
  if (!prisma) throw new Error("Database not configured.");

  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId, deletedAt: null },
    select: { id: true, name: true },
  });

  if (!project) notFound();

  const [workers, payrollRuns] = await Promise.all([
    prisma.projectWorker.findMany({
      where: { projectId },
      include: {
        employee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.projectPayrollRun.findMany({
      where: { projectId },
      include: { _count: { select: { entries: true } } },
      orderBy: { periodStart: "desc" },
    }),
  ]);

  const activeWorkers = workers.filter((worker) => worker.status === "active");
  const otherWorkers = workers.filter((worker) => worker.status !== "active");

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Project workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Workforce & Payroll</DashboardPageTitle>
            <DashboardPageDescription>
              Manage on-site labor and project payroll runs for {project.name}
              inside the same shared Midday-style shell.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild size="sm" variant="outline">
              <Link href={`/projects/${projectId}`}>Back to project</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Site workers</DashboardSectionTitle>
            <DashboardSectionDescription>
              Active and off-project workers now share the same calmer section
              framing used across the dashboard.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>
              Site workers ({workers.length} total · {activeWorkers.length}{" "}
              active)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workers.length > 0 ? (
              <>
                {activeWorkers.length > 0 ? (
                  <WorkerList workers={activeWorkers} projectId={projectId} />
                ) : null}
                {otherWorkers.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                      Off project / completed
                    </p>
                    <WorkerList workers={otherWorkers} projectId={projectId} />
                  </div>
                ) : null}
              </>
            ) : null}
            <AddWorkerForm projectId={projectId} />
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Payroll runs</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review and create project-specific payroll cycles from one
              consistent operational view.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>Payroll runs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PayrollRunList runs={payrollRuns} projectId={projectId} />
            <CreatePayrollRunForm projectId={projectId} />
          </CardContent>
        </Card>
      </DashboardSection>
    </DashboardPage>
  );
}
