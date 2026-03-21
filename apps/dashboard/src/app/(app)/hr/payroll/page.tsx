import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import Link from "next/link";
import { requireOnboardedSession } from "../../../../lib/session";
import {
  createPayrollEntryAction,
  markPayrollPaidAction,
} from "../../../actions";

type PayrollPageProps = {
  searchParams?: Promise<{ year?: string; month?: string }>;
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatCurrency(amount: number, currency: string = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function PayrollPage({ searchParams }: PayrollPageProps) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const params = (await searchParams) ?? {};

  const now = new Date();
  const periodYear = params.year ? Number.parseInt(params.year, 10) : now.getFullYear();
  const periodMonth = params.month ? Number.parseInt(params.month, 10) : now.getMonth() + 1;

  const prisma = createPrismaClient().db;

  const [entries, employees, periods] = await Promise.all([
    prisma
      ? prisma.payrollEntry.findMany({
          where: { companyId, periodYear, periodMonth },
          include: {
            employee: { select: { id: true, name: true, title: true } },
          },
          orderBy: { employee: { name: "asc" } },
        })
      : [],
    prisma
      ? prisma.employee.findMany({
          where: { companyId, deletedAt: null, status: "active" },
          select: { id: true, name: true, salaryAmount: true },
          orderBy: { name: "asc" },
        })
      : [],
    prisma
      ? prisma.payrollEntry.findMany({
          where: { companyId },
          select: { periodYear: true, periodMonth: true },
          distinct: ["periodYear", "periodMonth"],
          orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
          take: 24,
        })
      : [],
  ]);

  const totalGross = entries.reduce((sum, e) => sum + e.grossAmount, 0);
  const totalNet = entries.reduce((sum, e) => sum + e.netAmount, 0);
  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const paidCount = entries.filter((e) => e.status === "paid").length;

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Payroll
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {monthNames[periodMonth - 1]} {periodYear}
              {" · "}
              {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/hr/employees">← Employees</Link>
          </Button>
        </div>

        {/* Period selector */}
        {periods.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {periods.map((p) => {
              const isActive = p.periodYear === periodYear && p.periodMonth === periodMonth;
              return (
                <Button
                  key={`${p.periodYear}-${p.periodMonth}`}
                  asChild
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                >
                  <Link href={`/hr/payroll?year=${p.periodYear}&month=${p.periodMonth}`}>
                    {monthNames[p.periodMonth - 1]?.slice(0, 3)} {p.periodYear}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{entries.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">Gross Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalGross)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">Net Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalNet)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <span className="font-semibold text-green-600">{paidCount} paid</span>
                {pendingCount > 0 && (
                  <span className="ml-2 text-muted-foreground">{pendingCount} pending</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Payroll Entry Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Payroll Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createPayrollEntryAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="employeeId">Employee *</Label>
                <select
                  id="employeeId"
                  name="employeeId"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Select employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}{e.salaryAmount ? ` (₦${e.salaryAmount.toLocaleString()})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="periodYear">Year *</Label>
                  <Input
                    id="periodYear"
                    name="periodYear"
                    type="number"
                    required
                    defaultValue={periodYear}
                    min={2020}
                    max={2100}
                  />
                </div>
                <div>
                  <Label htmlFor="periodMonth">Month *</Label>
                  <select
                    id="periodMonth"
                    name="periodMonth"
                    required
                    defaultValue={periodMonth}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  >
                    {monthNames.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="grossAmount">Gross Amount (₦) *</Label>
                <Input id="grossAmount" name="grossAmount" type="number" required placeholder="0" />
              </div>
              <div>
                <Label htmlFor="netAmount">Net Amount (₦) *</Label>
                <Input id="netAmount" name="netAmount" type="number" required placeholder="0" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" placeholder="Optional notes" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Add Entry</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Payroll Entries List */}
        {entries.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                No payroll entries for {monthNames[periodMonth - 1]} {periodYear}. Add one above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="bg-card">
                <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {entry.employee.name}
                      </CardTitle>
                      <Badge
                        variant={entry.status === "paid" ? "default" : "secondary"}
                      >
                        {entry.status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {entry.employee.title ?? ""}
                      {" · Gross: "}
                      {formatCurrency(entry.grossAmount, entry.currency)}
                      {" · Net: "}
                      {formatCurrency(entry.netAmount, entry.currency)}
                    </p>
                    {entry.notes && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {entry.status === "pending" && (
                      <form action={markPayrollPaidAction}>
                        <input type="hidden" name="payrollEntryId" value={entry.id} />
                        <Button size="sm" type="submit" variant="default">
                          Mark Paid
                        </Button>
                      </form>
                    )}
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
