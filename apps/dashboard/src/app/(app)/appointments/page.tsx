import { createPrismaClient, listAppointmentsForCompany } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import Link from "next/link";

import { requireOnboardedSession } from "../../../lib/session";
import { ExportCsvButton } from "../../../components/export-csv-button";
import {
  createAppointmentAction,
  deleteAppointmentAction,
  exportAppointmentsCsvAction,
  updateAppointmentStatusAction,
} from "../../actions";

type AppointmentsPageProps = {
  searchParams?: Promise<{ status?: string; view?: string }>;
};

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  cancelled: { label: "Cancelled", variant: "destructive" },
  completed: { label: "Completed", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
};

const statusFlow: Record<string, { label: string; next: string }> = {
  confirmed: { label: "Mark completed", next: "completed" },
  pending: { label: "Confirm", next: "confirmed" },
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const params = (await searchParams) ?? {};
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  const filterStatus = params.status ?? undefined;
  const showUpcoming = params.view === "upcoming";

  const appointments = prisma
    ? await listAppointmentsForCompany(
        prisma,
        session.activeMembership.companyId,
        { status: filterStatus, upcoming: showUpcoming, limit: 50 },
      )
    : [];

  const counts = prisma
    ? await prisma.appointment.groupBy({
        by: ["status"],
        _count: true,
        where: { companyId: session.activeMembership.companyId },
      })
    : [];

  const stats: Record<string, number> = {
    cancelled: counts.find((c) => c.status === "cancelled")?._count ?? 0,
    completed: counts.find((c) => c.status === "completed")?._count ?? 0,
    confirmed: counts.find((c) => c.status === "confirmed")?._count ?? 0,
    pending: counts.find((c) => c.status === "pending")?._count ?? 0,
    total: counts.reduce((sum, c) => sum + c._count, 0),
  };

  // Load agents for the create form
  const agents = prisma
    ? await prisma.agent.findMany({
        select: { id: true, name: true },
        where: {
          companyId: session.activeMembership.companyId,
          deletedAt: null,
        },
      })
    : [];

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Appointments
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total ?? 0} appointment
              {(stats.total ?? 0) !== 1 ? "s" : ""} total
            </p>
          </div>
          <ExportCsvButton exportAction={exportAppointmentsCsvAction} filename="appointments.csv" />
        </div>

        {/* Stats / filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={!filterStatus && !showUpcoming ? "default" : "outline"}
          >
            <Link href="/appointments">All ({stats.total ?? 0})</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={showUpcoming ? "default" : "outline"}
          >
            <Link href="/appointments?view=upcoming">Upcoming</Link>
          </Button>
          {(["pending", "confirmed", "completed", "cancelled"] as const).map(
            (s) => (
              <Button
                key={s}
                asChild
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
              >
                <Link href={`/appointments?status=${s}`}>
                  {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
                </Link>
              </Button>
            ),
          )}
        </div>

        {/* Quick-create form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Schedule Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={createAppointmentAction}
              className="grid gap-3 sm:grid-cols-2 md:grid-cols-3"
            >
              <input
                name="name"
                placeholder="Visitor name"
                required
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                name="phone"
                placeholder="Phone (optional)"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                name="scheduledAt"
                type="datetime-local"
                required
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                name="location"
                placeholder="Location (optional)"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {agents.length > 0 && (
                <select
                  name="agentId"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Assign agent (optional)</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              )}
              <textarea
                name="notes"
                placeholder="Notes (optional)"
                rows={1}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm sm:col-span-2"
              />
              <Button type="submit" size="sm">
                Schedule
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Appointment list */}
        {appointments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No appointments found.
          </p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => {
              const flow = statusFlow[appt.status];
              return (
                <Card key={appt.id}>
                  <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {appt.name}
                        </p>
                        <Badge
                          variant={
                            statusConfig[appt.status]?.variant ?? "outline"
                          }
                        >
                          {statusConfig[appt.status]?.label ?? appt.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(appt.scheduledAt)}
                        {appt.durationMin ? ` · ${appt.durationMin} min` : ""}
                        {appt.location ? ` · ${appt.location}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appt.email}
                        {appt.agent ? ` · Agent: ${appt.agent.name}` : ""}
                        {appt.property
                          ? ` · Property: ${appt.property.title}`
                          : ""}
                      </p>
                      {appt.notes && (
                        <p className="mt-1 text-xs text-muted-foreground italic">
                          {appt.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {flow && (
                        <form action={updateAppointmentStatusAction}>
                          <input
                            type="hidden"
                            name="appointmentId"
                            value={appt.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value={flow.next}
                          />
                          <Button type="submit" size="sm" variant="outline">
                            {flow.label}
                          </Button>
                        </form>
                      )}
                      {appt.status !== "cancelled" && (
                        <form action={updateAppointmentStatusAction}>
                          <input
                            type="hidden"
                            name="appointmentId"
                            value={appt.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value="cancelled"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                          >
                            Cancel
                          </Button>
                        </form>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
