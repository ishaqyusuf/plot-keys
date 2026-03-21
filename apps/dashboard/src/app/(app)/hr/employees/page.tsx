import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import Link from "next/link";
import { requireOnboardedSession } from "../../../../lib/session";
import { ExportCsvButton } from "../../../../components/export-csv-button";
import {
  createEmployeeAction,
  deleteEmployeeAction,
  exportEmployeesCsvAction,
  updateEmployeeAction,
} from "../../../actions";

type EmployeesPageProps = {
  searchParams?: Promise<{ status?: string; department?: string }>;
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
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

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const params = (await searchParams) ?? {};
  const filterStatus = params.status || undefined;
  const filterDepartment = params.department || undefined;

  const prisma = createPrismaClient().db;

  const [employees, departments, counts] = await Promise.all([
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
      ? prisma.department.findMany({
          where: { companyId, deletedAt: null },
          orderBy: { name: "asc" },
        })
      : [],
    prisma
      ? prisma.employee.groupBy({
          by: ["status"],
          _count: true,
          where: { companyId, deletedAt: null },
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
            <ExportCsvButton exportAction={exportEmployeesCsvAction} filename="employees.csv" />
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
          {(["active", "on_leave", "suspended", "terminated"] as const).map((s) => (
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
          ))}
        </div>

        {/* Add Employee Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createEmployeeAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required placeholder="Full name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" placeholder="+234..." />
              </div>
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" placeholder="e.g. Sales Manager" />
              </div>
              <div>
                <Label htmlFor="departmentId">Department</Label>
                <select
                  id="departmentId"
                  name="departmentId"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">None</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <select
                  id="employmentType"
                  name="employmentType"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="salaryAmount">Monthly Salary (₦)</Label>
                <Input id="salaryAmount" name="salaryAmount" type="number" placeholder="0" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Add Employee</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Employee List */}
        {employees.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                {filterStatus
                  ? `No ${statusConfig[filterStatus]?.label ?? filterStatus} employees.`
                  : "No employees yet. Add your first employee above."}
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
                      <Badge variant={statusConfig[emp.status]?.variant ?? "outline"}>
                        {statusConfig[emp.status]?.label ?? emp.status}
                      </Badge>
                      <Badge variant="outline">
                        {employmentTypeLabels[emp.employmentType] ?? emp.employmentType}
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
