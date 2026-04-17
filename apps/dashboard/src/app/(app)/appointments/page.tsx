import { createPrismaClient, listAppointmentsForCompany } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { Textarea } from "@plotkeys/ui/textarea";
import { CalendarRange } from "lucide-react";
import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
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
} from "../../../components/dashboard/dashboard-page";
import { ExportCsvButton } from "../../../components/export-csv-button";
import { requireOnboardedSession } from "../../../lib/session";
import {
  createAppointmentAction,
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

type AppointmentItem = Awaited<
  ReturnType<typeof listAppointmentsForCompany>
>[number];

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
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Scheduling workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Appointments</DashboardPageTitle>
            <DashboardPageDescription>
              Run viewings and customer meetings with a clearer schedule board
              and standardized follow-up controls.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <ExportCsvButton
              exportAction={exportAppointmentsCsvAction}
              filename="appointments.csv"
            />
          </DashboardPageActions>
        </DashboardPageHeaderRow>

        <DashboardPageToolbar>
          <DashboardToolbarGroup className="text-sm text-muted-foreground">
            {stats.total ?? 0} appointment
            {(stats.total ?? 0) !== 1 ? "s" : ""} total
          </DashboardToolbarGroup>
          <DashboardToolbarGroup>
            <DashboardFilterTabs>
              <DashboardFilterTab
                active={!filterStatus && !showUpcoming}
                href="/appointments"
              >
                All ({stats.total ?? 0})
              </DashboardFilterTab>
              <DashboardFilterTab
                active={showUpcoming}
                href="/appointments?view=upcoming"
              >
                Upcoming
              </DashboardFilterTab>
              {(
                ["pending", "confirmed", "completed", "cancelled"] as const
              ).map((s) => (
                <DashboardFilterTab
                  key={s}
                  active={filterStatus === s}
                  href={`/appointments?status=${s}`}
                >
                  {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
                </DashboardFilterTab>
              ))}
            </DashboardFilterTabs>
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Schedule appointment</DashboardSectionTitle>
            <DashboardSectionDescription>
              Add upcoming viewings and assign them to the right team member
              without leaving the schedule view.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        <Card className="border-border/65 bg-card/78">
          <CardHeader>
            <CardTitle className="text-base">Schedule Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createAppointmentAction} className="space-y-4">
              <FieldGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Field>
                  <FieldLabel>Visitor name</FieldLabel>
                  <Input name="name" placeholder="Visitor name" required />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input name="phone" placeholder="Phone (optional)" />
                </Field>
                <Field>
                  <FieldLabel>Scheduled time</FieldLabel>
                  <Input name="scheduledAt" type="datetime-local" required />
                </Field>
                <Field>
                  <FieldLabel>Location</FieldLabel>
                  <Input name="location" placeholder="Location (optional)" />
                </Field>
                {agents.length > 0 && (
                  <Field>
                    <FieldLabel>Assign agent</FieldLabel>
                    <NativeSelect name="agentId">
                      <NativeSelectOption value="">
                        Assign agent (optional)
                      </NativeSelectOption>
                      {agents.map((a) => (
                        <NativeSelectOption key={a.id} value={a.id}>
                          {a.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                )}
                <Field className="sm:col-span-2 xl:col-span-3">
                  <FieldLabel>Notes</FieldLabel>
                  <Textarea
                    name="notes"
                    placeholder="Notes (optional)"
                    rows={3}
                  />
                </Field>
              </FieldGroup>
              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  Schedule
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Appointment queue</DashboardSectionTitle>
            <DashboardSectionDescription>
              Stay on top of upcoming, confirmed, completed, and cancelled
              appointments in one timeline.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        {appointments.length === 0 ? (
          <DashboardEmptyState
            description="No appointments found for this view yet."
            icon={<CalendarRange className="size-5" />}
            title="Nothing on the schedule"
          />
        ) : (
          <div className="space-y-2.5">
            {appointments.map((appt: AppointmentItem) => {
              const flow = statusFlow[appt.status];
              return (
                <Card key={appt.id} className="border-border/65 bg-card/78">
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
      </DashboardSection>
    </DashboardPage>
  );
}
