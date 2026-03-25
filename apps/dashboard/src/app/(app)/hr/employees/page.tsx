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
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { EMPLOYEE_WORK_ROLE_VALUES, WORK_ROLE_LABELS } from "@plotkeys/utils";
import Link from "next/link";
import { DevFormQuickFillButton } from "../../../../components/dev/dev-form-quick-fill-button";
import { ExportCsvButton } from "../../../../components/export-csv-button";
import { requireOnboardedSession } from "../../../../lib/session";
import {
  deleteEmployeeAction,
  exportEmployeesCsvAction,
  inviteEmployeeAction,
  revokeInviteAction,
  updateEmployeeAction,
} from "../../../actions";

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

const employeeWorkRoleOptions = EMPLOYEE_WORK_ROLE_VALUES.map((value) => ({
  label: WORK_ROLE_LABELS[value],
  value,
}));

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
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {params.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.invited ? (
          <Alert className="mb-6">
            <AlertDescription>
              Employee invite sent. They&apos;ll receive an email to join and
              complete their details directly.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Employees
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total} employee{stats.total !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/hr/departments">Departments</Link>
            </Button>
            <ExportCsvButton
              exportAction={exportEmployeesCsvAction}
              filename="employees.csv"
            />
          </div>
        </div>

        {/* Status filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={!filterStatus ? "default" : "outline"}
          >
            <Link href="/hr/employees">All ({stats.total})</Link>
          </Button>
          {(["active", "on_leave", "suspended", "terminated"] as const).map(
            (s) => (
              <Button
                key={s}
                asChild
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
              >
                <Link href={`/hr/employees?status=${s}`}>
                  {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
                </Link>
              </Button>
            ),
          )}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Invite an employee</CardTitle>
            <CardDescription>
              Send an invite by email and let the employee complete their
              profile after they join the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={inviteEmployeeAction}
              className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_15rem_auto]"
              data-dev-quick-fill-label="Invite employee"
              data-dev-quick-fill-profile="invite-employee"
            >
              <div>
                <Label htmlFor="employee-email">Email address</Label>
                <Input
                  id="employee-email"
                  name="email"
                  placeholder="employee@company.com"
                  required
                  type="email"
                />
              </div>
              <div>
                <Label htmlFor="employee-work-role">Role</Label>
                <select
                  id="employee-work-role"
                  name="workRole"
                  defaultValue="operations"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  {employeeWorkRoleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="flex gap-2">
                  <DevFormQuickFillButton profile="invite-employee" />
                  <Button type="submit">Send invite</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {pendingInvites.length > 0 ? (
          <div className="mb-8 grid gap-3">
            {pendingInvites.map((invite) => (
              <Card key={invite.id} className="border-dashed">
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
        ) : null}

        {/* Employee List */}
        {employees.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                {filterStatus
                  ? `No ${statusConfig[filterStatus]?.label ?? filterStatus} employees.`
                  : "No employees yet. Invite your first employee above."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {employees.map((emp) => (
              <Card key={emp.id} className="bg-card">
                <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
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
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {emp.title ?? "No title"}
                      {emp.department ? ` · ${emp.department.name}` : ""}
                      {emp.email ? ` · ${emp.email}` : ""}
                    </p>
                    {emp.startDate && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Started: {formatDate(emp.startDate)}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {emp.status === "active" && (
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
                          Set On Leave
                        </Button>
                      </form>
                    )}
                    {emp.status === "on_leave" && (
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
                    )}
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
      </div>
    </main>
  );
}
