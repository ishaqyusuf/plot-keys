import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { WalletCards } from "lucide-react";
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
  DashboardStatGrid,
  DashboardToolbarGroup,
} from "../../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../../lib/session";
import {
  createPayrollEntryAction,
  markPayrollPaidAction,
} from "../../../actions";

type PayrollPageProps = {
  searchParams?: Promise<{ year?: string; month?: string }>;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatCurrency(amount: number, currency = "NGN") {
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
  const periodYear = params.year
    ? Number.parseInt(params.year, 10)
    : now.getFullYear();
  const periodMonth = params.month
    ? Number.parseInt(params.month, 10)
    : now.getMonth() + 1;

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

  const totalGross = entries.reduce((sum, entry) => sum + entry.grossAmount, 0);
  const totalNet = entries.reduce((sum, entry) => sum + entry.netAmount, 0);
  const pendingCount = entries.filter(
    (entry) => entry.status === "pending",
  ).length;
  const paidCount = entries.filter((entry) => entry.status === "paid").length;

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Payroll</DashboardPageTitle>
            <DashboardPageDescription>
              Manage payroll periods, entries, and payment status in the same
              compact product shell as the rest of the dashboard.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild size="sm" variant="outline">
              <Link href="/hr/employees">Back to employees</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
        {periods.length > 0 ? (
          <DashboardPageToolbar>
            <DashboardToolbarGroup>
              <DashboardFilterTabs>
                {periods.map((period) => {
                  const isActive =
                    period.periodYear === periodYear &&
                    period.periodMonth === periodMonth;
                  return (
                    <DashboardFilterTab
                      key={`${period.periodYear}-${period.periodMonth}`}
                      active={isActive}
                      href={`/hr/payroll?year=${period.periodYear}&month=${period.periodMonth}`}
                    >
                      {monthNames[period.periodMonth - 1]?.slice(0, 3)}{" "}
                      {period.periodYear}
                    </DashboardFilterTab>
                  );
                })}
              </DashboardFilterTabs>
            </DashboardToolbarGroup>
          </DashboardPageToolbar>
        ) : null}
      </DashboardPageHeader>

      <DashboardStatGrid>
        {[
          { label: "Entries", value: entries.length },
          { label: "Gross total", value: formatCurrency(totalGross) },
          { label: "Net total", value: formatCurrency(totalNet) },
          { label: "Paid / pending", value: `${paidCount} / ${pendingCount}` },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/65 bg-card/78">
            <CardContent className="px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </DashboardStatGrid>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Add payroll entry</DashboardSectionTitle>
            <DashboardSectionDescription>
              Record new payroll items for the active period with shared form
              styling and spacing.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        <Card className="border-border/65 bg-card/78">
          <CardHeader className="px-5 py-4">
            <CardTitle>New payroll entry</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <form action={createPayrollEntryAction} className="space-y-4">
              <FieldGroup className="sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="employeeId">Employee</FieldLabel>
                  <NativeSelect id="employeeId" name="employeeId" required>
                    <NativeSelectOption value="">
                      Select employee
                    </NativeSelectOption>
                    {employees.map((employee) => (
                      <NativeSelectOption key={employee.id} value={employee.id}>
                        {employee.name}
                        {employee.salaryAmount
                          ? ` (₦${employee.salaryAmount.toLocaleString()})`
                          : ""}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
                <FieldGroup className="grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="periodYear">Year</FieldLabel>
                    <Input
                      id="periodYear"
                      name="periodYear"
                      type="number"
                      required
                      defaultValue={periodYear}
                      min={2020}
                      max={2100}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="periodMonth">Month</FieldLabel>
                    <NativeSelect
                      id="periodMonth"
                      name="periodMonth"
                      required
                      defaultValue={String(periodMonth)}
                    >
                      {monthNames.map((month, index) => (
                        <NativeSelectOption
                          key={month}
                          value={String(index + 1)}
                        >
                          {month}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                </FieldGroup>
                <Field>
                  <FieldLabel htmlFor="grossAmount">
                    Gross amount (NGN)
                  </FieldLabel>
                  <Input
                    id="grossAmount"
                    name="grossAmount"
                    type="number"
                    required
                    placeholder="0"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="netAmount">Net amount (NGN)</FieldLabel>
                  <Input
                    id="netAmount"
                    name="netAmount"
                    type="number"
                    required
                    placeholder="0"
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <Input id="notes" name="notes" placeholder="Optional notes" />
                </Field>
              </FieldGroup>
              <div className="flex justify-end">
                <SubmitButton loadingLabel="Adding…">Add entry</SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Period ledger</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review payroll entries for {monthNames[periodMonth - 1]}{" "}
              {periodYear}.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        {entries.length === 0 ? (
          <DashboardEmptyState
            title="No payroll entries"
            description={`No payroll entries for ${monthNames[periodMonth - 1]} ${periodYear}. Add the first one above.`}
            icon={<WalletCards className="size-5" />}
          />
        ) : (
          <div className="grid gap-2.5">
            {entries.map((entry) => (
              <Card key={entry.id} className="border-border/65 bg-card/78">
                <CardHeader className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {entry.employee.name}
                      </CardTitle>
                      <Badge
                        variant={
                          entry.status === "paid" ? "default" : "secondary"
                        }
                      >
                        {entry.status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.employee.title ?? "No title"} · Gross{" "}
                      {formatCurrency(entry.grossAmount, entry.currency)} · Net{" "}
                      {formatCurrency(entry.netAmount, entry.currency)}
                    </p>
                    {entry.notes ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {entry.notes}
                      </p>
                    ) : null}
                  </div>
                  {entry.status === "pending" ? (
                    <form action={markPayrollPaidAction}>
                      <input
                        type="hidden"
                        name="payrollEntryId"
                        value={entry.id}
                      />
                      <Button size="sm" type="submit">
                        Mark paid
                      </Button>
                    </form>
                  ) : null}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
