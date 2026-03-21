import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import Link from "next/link";
import { requireOnboardedSession } from "../../../../lib/session";
import {
  createLeaveRequestAction,
  approveLeaveRequestAction,
  rejectLeaveRequestAction,
  cancelLeaveRequestAction,
} from "../../../actions";

type LeavePageProps = {
  searchParams?: Promise<{ status?: string }>;
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
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
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Leave Requests
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total} request{stats.total !== 1 ? "s" : ""}
              {stats.pending > 0 ? ` · ${stats.pending} pending` : ""}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/hr/employees">← Employees</Link>
          </Button>
        </div>

        {/* Status filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={!filterStatus ? "default" : "outline"}
          >
            <Link href="/hr/leave">All ({stats.total})</Link>
          </Button>
          {(["pending", "approved", "rejected", "cancelled"] as const).map((s) => (
            <Button
              key={s}
              asChild
              size="sm"
              variant={filterStatus === s ? "default" : "outline"}
            >
              <Link href={`/hr/leave?status=${s}`}>
                {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
              </Link>
            </Button>
          ))}
        </div>

        {/* Submit Leave Request Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit Leave Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createLeaveRequestAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="leaveType">Leave Type *</Label>
                <select
                  id="leaveType"
                  name="leaveType"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="annual">Annual</option>
                  <option value="sick">Sick</option>
                  <option value="maternity">Maternity</option>
                  <option value="paternity">Paternity</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="compassionate">Compassionate</option>
                </select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="reason">Reason</Label>
                <Input id="reason" name="reason" placeholder="Optional reason for leave" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Leave Request List */}
        {requests.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                {filterStatus
                  ? `No ${statusConfig[filterStatus]?.label ?? filterStatus} leave requests.`
                  : "No leave requests yet. Submit one above."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <Card key={req.id} className="bg-card">
                <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {req.employee.name}
                      </CardTitle>
                      <Badge variant={statusConfig[req.status]?.variant ?? "outline"}>
                        {statusConfig[req.status]?.label ?? req.status}
                      </Badge>
                      <Badge variant="outline">
                        {leaveTypeLabels[req.leaveType] ?? req.leaveType}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {req.employee.title ?? ""}
                      {" · "}
                      {formatDate(req.startDate)} → {formatDate(req.endDate)}
                    </p>
                    {req.reason && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {req.reason}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {req.status === "pending" && (
                      <>
                        <form action={approveLeaveRequestAction}>
                          <input type="hidden" name="leaveRequestId" value={req.id} />
                          <Button size="sm" type="submit" variant="default">
                            Approve
                          </Button>
                        </form>
                        <form action={rejectLeaveRequestAction}>
                          <input type="hidden" name="leaveRequestId" value={req.id} />
                          <Button size="sm" type="submit" variant="destructive">
                            Reject
                          </Button>
                        </form>
                      </>
                    )}
                    {(req.status === "pending" || req.status === "approved") && (
                      <form action={cancelLeaveRequestAction}>
                        <input type="hidden" name="leaveRequestId" value={req.id} />
                        <Button size="sm" type="submit" variant="outline">
                          Cancel
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
