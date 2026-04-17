import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { CalendarClock } from "lucide-react";
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
import { requireOnboardedSession } from "../../../../lib/session";
import {
  approveLeaveRequestAction,
  cancelLeaveRequestAction,
  createLeaveRequestAction,
  rejectLeaveRequestAction,
} from "../../../actions";

type LeavePageProps = {
  searchParams?: Promise<{ status?: string }>;
};

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  approved: { label: "Approved", variant: "default" },
  cancelled: { label: "Cancelled", variant: "outline" },
  pending: { label: "Pending", variant: "secondary" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const leaveTypeLabels: Record<string, string> = {
  annual: "Annual",
  compassionate: "Compassionate",
  maternity: "Maternity",
  paternity: "Paternity",
  sick: "Sick",
  unpaid: "Unpaid",
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function LeavePage({ searchParams }: LeavePageProps) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const params = (await searchParams) ?? {};
  const filterStatus = params.status || undefined;

  const prisma = createPrismaClient().db;
  const [requests, employees, counts] = await Promise.all([
    prisma
      ? prisma.leaveRequest.findMany({
          where: {
            employee: { companyId, deletedAt: null },
            ...(filterStatus ? { status: filterStatus as never } : {}),
          },
          include: {
            employee: { select: { id: true, name: true, title: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 200,
        })
      : [],
    prisma
      ? prisma.employee.findMany({
          where: { companyId, deletedAt: null, status: "active" },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : [],
    prisma
      ? prisma.leaveRequest.groupBy({
          by: ["status"],
          _count: true,
          where: { employee: { companyId, deletedAt: null } },
        })
      : [],
  ]);

  const stats: Record<string, number> = {
    approved: counts.find((c) => c.status === "approved")?._count ?? 0,
    cancelled: counts.find((c) => c.status === "cancelled")?._count ?? 0,
    pending: counts.find((c) => c.status === "pending")?._count ?? 0,
    rejected: counts.find((c) => c.status === "rejected")?._count ?? 0,
    total: counts.reduce((sum, c) => sum + c._count, 0),
  };

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Leave Requests</DashboardPageTitle>
            <DashboardPageDescription>
              Track time away, review pending approvals, and keep leave
              operations inside the unified dashboard contract.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild size="sm" variant="outline">
              <Link href="/hr/employees">Back to employees</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
        <DashboardPageToolbar>
          <DashboardToolbarGroup>
            <DashboardFilterTabs>
              <DashboardFilterTab active={!filterStatus} href="/hr/leave">
                All ({stats.total})
              </DashboardFilterTab>
              {(["pending", "approved", "rejected", "cancelled"] as const).map(
                (status) => (
                  <DashboardFilterTab
                    key={status}
                    active={filterStatus === status}
                    href={`/hr/leave?status=${status}`}
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
            <DashboardSectionTitle>Submit request</DashboardSectionTitle>
            <DashboardSectionDescription>
              Capture new leave requests with the same input styling and spacing
              used elsewhere in the redesign.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        <Card className="border-border/65 bg-card/78">
          <CardHeader className="px-5 py-4">
            <CardTitle>New leave request</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <form action={createLeaveRequestAction} className="space-y-4">
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
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
                <Field>
                  <FieldLabel htmlFor="leaveType">Leave type</FieldLabel>
                  <NativeSelect id="leaveType" name="leaveType" required>
                    {Object.entries(leaveTypeLabels).map(([value, label]) => (
                      <NativeSelectOption key={value} value={value}>
                        {label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
                <Field>
                  <FieldLabel htmlFor="startDate">Start date</FieldLabel>
                  <Input id="startDate" name="startDate" type="date" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="endDate">End date</FieldLabel>
                  <Input id="endDate" name="endDate" type="date" required />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="reason">Reason</FieldLabel>
                  <Input
                    id="reason"
                    name="reason"
                    placeholder="Optional reason for leave"
                  />
                </Field>
              </FieldGroup>
              <div className="flex justify-end">
                <SubmitButton loadingLabel="Submitting…">
                  Submit request
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Request queue</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review the current leave pipeline and action requests without
              leaving the roster flow.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        {requests.length === 0 ? (
          <DashboardEmptyState
            title="No leave requests"
            description={
              filterStatus
                ? `No ${statusConfig[filterStatus]?.label ?? filterStatus} leave requests found.`
                : "No leave requests yet. Submit one above to start the workflow."
            }
            icon={<CalendarClock className="size-5" />}
          />
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-border/70 bg-card/82">
                <CardHeader className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {request.employee.name}
                      </CardTitle>
                      <Badge
                        variant={
                          statusConfig[request.status]?.variant ?? "outline"
                        }
                      >
                        {statusConfig[request.status]?.label ?? request.status}
                      </Badge>
                      <Badge variant="outline">
                        {leaveTypeLabels[request.leaveType] ??
                          request.leaveType}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.employee.title ?? "No title"} ·{" "}
                      {formatDate(request.startDate)} to{" "}
                      {formatDate(request.endDate)}
                    </p>
                    {request.reason ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.reason}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {request.status === "pending" ? (
                      <>
                        <form action={approveLeaveRequestAction}>
                          <input
                            type="hidden"
                            name="leaveRequestId"
                            value={request.id}
                          />
                          <Button size="sm" type="submit">
                            Approve
                          </Button>
                        </form>
                        <form action={rejectLeaveRequestAction}>
                          <input
                            type="hidden"
                            name="leaveRequestId"
                            value={request.id}
                          />
                          <Button size="sm" type="submit" variant="destructive">
                            Reject
                          </Button>
                        </form>
                      </>
                    ) : null}
                    {request.status === "pending" ||
                    request.status === "approved" ? (
                      <form action={cancelLeaveRequestAction}>
                        <input
                          type="hidden"
                          name="leaveRequestId"
                          value={request.id}
                        />
                        <Button size="sm" type="submit" variant="outline">
                          Cancel
                        </Button>
                      </form>
                    ) : null}
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
