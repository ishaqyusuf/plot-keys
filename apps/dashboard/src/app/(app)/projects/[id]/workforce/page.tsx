import { createPrismaClient } from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireOnboardedSession } from "../../../../../lib/session";
import {
  AddWorkerForm,
  CreatePayrollRunForm,
  PayrollRunList,
  WorkerList,
} from "../../../../../components/projects/project-workforce";

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

  if (!project) {
    notFound();
  }

  const [workers, payrollRuns] = await Promise.all([
    prisma.projectWorker.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.projectPayrollRun.findMany({
      where: { projectId },
      include: { _count: { select: { entries: true } } },
      orderBy: { periodStart: "desc" },
    }),
  ]);

  const activeWorkers = workers.filter((w) => w.status === "active");
  const otherWorkers = workers.filter((w) => w.status !== "active");

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Workforce & Payroll
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{project.name}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${projectId}`}>← Back to Project</Link>
          </Button>
        </div>

        {/* Workers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Site Workers{" "}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({workers.length} total · {activeWorkers.length} active)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workers.length > 0 && (
              <>
                {activeWorkers.length > 0 && (
                  <WorkerList workers={activeWorkers} projectId={projectId} />
                )}
                {otherWorkers.length > 0 && (
                  <>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Off Project / Completed
                    </p>
                    <WorkerList
                      workers={otherWorkers}
                      projectId={projectId}
                    />
                  </>
                )}
              </>
            )}
            <AddWorkerForm projectId={projectId} />
          </CardContent>
        </Card>

        {/* Payroll Runs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payroll Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <PayrollRunList
              runs={payrollRuns}
              projectId={projectId}
            />
            <CreatePayrollRunForm projectId={projectId} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
