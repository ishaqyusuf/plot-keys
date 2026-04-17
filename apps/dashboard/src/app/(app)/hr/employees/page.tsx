import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import { UsersRound } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "../../../../components/dashboard/dashboard-empty-state";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardToolbarGroup,
} from "../../../../components/dashboard/dashboard-page";
import { ExportCsvButton } from "../../../../components/export-csv-button";
import { requireOnboardedSession } from "../../../../lib/session";
import {
  deleteEmployeeAction,
  exportEmployeesCsvAction,
  revokeInviteAction,
  updateEmployeeAction,
} from "../../../actions";
import { EmployeeInviteForm } from "../employee-invite-form";

type EmployeesPageProps = {
  searchParams?: Promise<{
    department?: string;
    error?: string;
    invited?: string;
    status?: string;
  }>;
};

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  on_leave: { label: "On Leave", variant: "secondary" },
  suspended: { label: "Suspended", variant: "outline" },
  terminated: { label: "Terminated", variant: "destructive" },
};

const employmentTypeLabels: Record<string, string> = {
  contract: "Contract",
  full_time: "Full-time",
  intern: "Intern",
  part_time: "Part-time",
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function EmployeesPage({
  searchParams,
}: EmployeesPageProps) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const params = (await searchParams) ?? {};
  const filterStatus = params.status || undefined;
  const filterDepartment = params.department || undefined;

  const prisma = createPrismaClient().db;
  const [employees, counts, pendingInvites] = await Promise.all([
    prisma
      ? prisma.employee.findMany({
          where: {
            companyId,
            deletedAt: null,
            ...(filterStatus ? { status: filterStatus as never } : {}),
            ...(filterDepartment ? { departmentId: filterDepartment } : {}),
          },
          include: { department: { select: { id: true, name: true } } },
          orderBy: { name: "asc" },
          take: 200,
        })
      : [],
    prisma
      ? prisma.employee.groupBy({
          by: ["status"],
          _count: true,
          where: { companyId, deletedAt: null },
        })
      : [],
    prisma
      ? prisma.teamInvite.findMany({
          orderBy: { createdAt: "desc" },
          where: {
            acceptedAt: null,
            companyId,
            expiresAt: { gt: new Date() },
            revokedAt: null,
            role: "staff",
          },
        })
      : [],
  ]);

  const stats: Record<string, number> = {
    active: counts.find((c) => c.status === "active")?._count ?? 0,
    on_leave: counts.find((c) => c.status === "on_leave")?._count ?? 0,
    suspended: counts.find((c) => c.status === "suspended")?._count ?? 0,
    terminated: counts.find((c) => c.status === "terminated")?._count ?? 0,
    total: counts.reduce((sum, c) => sum + c._count, 0),
  };

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      {params.invited ? (
        <Alert>
          <AlertDescription>
            Employee invite sent. They&apos;ll receive an email to join and
            complete their details directly.
          </AlertDescription>
        </Alert>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Employees</DashboardPageTitle>
            <DashboardPageDescription>
              Manage employee lifecycle, invite flows, and workforce structure
              from a unified Midday-style dashboard layout.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild variant="outline" size="sm">
              <Link href="/hr/departments">Departments</Link>
            </Button>
            <ExportCsvButton
              exportAction={exportEmployeesCsvAction}
              filename="employees.csv"
            />
          </DashboardPageActions>
        </DashboardPageHeaderRow>

        <DashboardPageToolbar>
          <DashboardToolbarGroup>
            <DashboardFilterTabs>
              <DashboardFilterTab active={!filterStatus} href="/hr/employees">
                All ({stats.total})
              </DashboardFilterTab>
              {(["active", "on_leave", "suspended", "terminated"] as const).map(
                (status) => (
                  <DashboardFilterTab
                    key={status}
                    active={filterStatus === status}
                    href={`/hr/employees?status=${status}`}
                  >
                    {statusConfig[status]?.label ?? status} (
                    {stats[status] ?? 0})
                  </DashboardFilterTab>
                ),
              )}
            </DashboardFilterTabs>
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Invite employee</DashboardSectionTitle>
            <DashboardSectionDescription>
              Send a self-serve onboarding link so new staff can complete their
              profile inside the workspace.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/65 bg-card/78">
          <CardHeader className="px-5 py-4">
            <CardTitle>Invite an employee</CardTitle>
            <CardDescription>
              Employees will receive a secure invite link and finish their own
              setup after joining.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <EmployeeInviteForm />
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Pending invites</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review staff invitations that still need attention.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        {pendingInvites.length > 0 ? (
          <div className="grid gap-2.5">
            {pendingInvites.map((invite) => (
              <Card
                key={invite.id}
                className="border-border/65 border-dashed bg-card/78"
              >
                <CardContent className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {invite.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pending employee setup ·{" "}
                      {WORK_ROLE_LABELS[invite.workRole] ?? invite.workRole}
                    </p>
                  </div>
                  <form action={revokeInviteAction}>
                    <input name="inviteId" type="hidden" value={invite.id} />
                    <Button size="sm" type="submit" variant="ghost">
                      Revoke
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="No pending employee invites"
            description="Invitations that have not yet been accepted will appear here."
            icon={<UsersRound className="size-5" />}
          />
        )}
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Employee roster</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review status, role, department, and quick actions from one calmer
              roster view.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        {employees.length === 0 ? (
          <DashboardEmptyState
            title="No employees yet"
            description={
              filterStatus
                ? `No ${statusConfig[filterStatus]?.label ?? filterStatus} employees found.`
                : "Invite your first employee above to start building the roster."
            }
            icon={<UsersRound className="size-5" />}
          />
        ) : (
          <div className="grid gap-4">
            {employees.map((emp) => (
              <Card key={emp.id} className="border-border/70 bg-card/82">
                <CardHeader className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {emp.name}
                      </CardTitle>
                      <Badge
                        variant={statusConfig[emp.status]?.variant ?? "outline"}
                      >
                        {statusConfig[emp.status]?.label ?? emp.status}
                      </Badge>
                      <Badge variant="outline">
                        {employmentTypeLabels[emp.employmentType] ??
                          emp.employmentType}
                      </Badge>
                      <Badge variant="secondary">
                        {WORK_ROLE_LABELS[emp.workRole] ?? emp.workRole}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {emp.title ?? "No title"}
                      {emp.department ? ` · ${emp.department.name}` : ""}
                      {emp.email ? ` · ${emp.email}` : ""}
                    </p>
                    {emp.startDate ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Started {formatDate(emp.startDate)}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {emp.status === "active" ? (
                      <form action={updateEmployeeAction}>
                        <input type="hidden" name="employeeId" value={emp.id} />
                        <input type="hidden" name="name" value={emp.name} />
                        <input
                          type="hidden"
                          name="workRole"
                          value={emp.workRole}
                        />
                        <input type="hidden" name="status" value="on_leave" />
                        <Button size="sm" type="submit" variant="outline">
                          Set on leave
                        </Button>
                      </form>
                    ) : null}

                    {emp.status === "on_leave" ? (
                      <form action={updateEmployeeAction}>
                        <input type="hidden" name="employeeId" value={emp.id} />
                        <input type="hidden" name="name" value={emp.name} />
                        <input
                          type="hidden"
                          name="workRole"
                          value={emp.workRole}
                        />
                        <input type="hidden" name="status" value="active" />
                        <Button size="sm" type="submit" variant="outline">
                          Reactivate
                        </Button>
                      </form>
                    ) : null}

                    <form action={deleteEmployeeAction}>
                      <input type="hidden" name="employeeId" value={emp.id} />
                      <Button size="sm" type="submit" variant="destructive">
                        Remove
                      </Button>
                    </form>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
