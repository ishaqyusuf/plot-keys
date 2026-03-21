import type { Db } from "../prisma";

// ---------------------------------------------------------------------------
// Monthly business summary
// ---------------------------------------------------------------------------

export async function getMonthlyBusinessSummary(
  db: Db,
  companyId: string,
  options?: { year?: number; month?: number },
) {
  const now = new Date();
  const year = options?.year ?? now.getFullYear();
  const month = options?.month ?? now.getMonth() + 1;

  const periodStart = new Date(year, month - 1, 1);
  const periodEnd = new Date(year, month, 1);

  const [
    newLeads,
    qualifiedLeads,
    closedLeads,
    totalAppointments,
    completedAppointments,
    newProperties,
    publishedProperties,
    newCustomers,
    pageViews,
  ] = await Promise.all([
    db.lead.count({
      where: { companyId, createdAt: { gte: periodStart, lt: periodEnd } },
    }),
    db.lead.count({
      where: {
        companyId,
        createdAt: { gte: periodStart, lt: periodEnd },
        status: "qualified",
      },
    }),
    db.lead.count({
      where: {
        companyId,
        createdAt: { gte: periodStart, lt: periodEnd },
        status: "closed",
      },
    }),
    db.appointment.count({
      where: { companyId, createdAt: { gte: periodStart, lt: periodEnd } },
    }),
    db.appointment.count({
      where: {
        companyId,
        createdAt: { gte: periodStart, lt: periodEnd },
        status: "completed",
      },
    }),
    db.property.count({
      where: { companyId, createdAt: { gte: periodStart, lt: periodEnd } },
    }),
    db.property.count({
      where: {
        companyId,
        createdAt: { gte: periodStart, lt: periodEnd },
        publishState: "published",
      },
    }),
    db.customer.count({
      where: { companyId, createdAt: { gte: periodStart, lt: periodEnd } },
    }),
    db.analyticsEvent.count({
      where: {
        companyId,
        createdAt: { gte: periodStart, lt: periodEnd },
        eventType: "page_view",
      },
    }),
  ]);

  return {
    period: {
      year,
      month,
      label: periodStart.toLocaleString("en-GB", {
        month: "long",
        year: "numeric",
      }),
    },
    leads: { new: newLeads, qualified: qualifiedLeads, closed: closedLeads },
    appointments: { total: totalAppointments, completed: completedAppointments },
    properties: { new: newProperties, published: publishedProperties },
    customers: { new: newCustomers },
    pageViews,
  };
}

// ---------------------------------------------------------------------------
// Agent performance report
// ---------------------------------------------------------------------------

export async function getAgentPerformanceReport(
  db: Db,
  companyId: string,
  options?: { year?: number; month?: number },
) {
  const now = new Date();
  const year = options?.year ?? now.getFullYear();
  const month = options?.month ?? now.getMonth() + 1;

  const periodStart = new Date(year, month - 1, 1);
  const periodEnd = new Date(year, month, 1);

  const agents = await db.agent.findMany({
    where: { companyId, deletedAt: null },
    select: { id: true, name: true, title: true },
    orderBy: { name: "asc" },
  });

  if (agents.length === 0) return [];

  const agentIds = agents.map((a) => a.id);

  const [allAppts, completedAppts, leadsByAgent] = await Promise.all([
    db.appointment.groupBy({
      by: ["agentId"],
      _count: { id: true },
      where: {
        companyId,
        agentId: { in: agentIds },
        createdAt: { gte: periodStart, lt: periodEnd },
      },
    }),
    db.appointment.groupBy({
      by: ["agentId"],
      _count: { id: true },
      where: {
        companyId,
        agentId: { in: agentIds },
        createdAt: { gte: periodStart, lt: periodEnd },
        status: "completed",
      },
    }),
    db.appointment.groupBy({
      by: ["agentId"],
      _count: { id: true },
      where: {
        companyId,
        agentId: { in: agentIds },
        createdAt: { gte: periodStart, lt: periodEnd },
      },
    }),
  ]);

  const apptMap = new Map(allAppts.map((r) => [r.agentId, r._count.id]));
  const compMap = new Map(completedAppts.map((r) => [r.agentId, r._count.id]));
  const leadMap = new Map(leadsByAgent.map((r) => [r.agentId, r._count.id]));

  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    title: agent.title,
    appointments: apptMap.get(agent.id) ?? 0,
    completed: compMap.get(agent.id) ?? 0,
    leads: leadMap.get(agent.id) ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// Listings performance report
// ---------------------------------------------------------------------------

export async function getListingsReport(
  db: Db,
  companyId: string,
  options?: { limit?: number },
) {
  const limit = options?.limit ?? 20;
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const properties = await db.property.findMany({
    where: { companyId, deletedAt: null },
    select: {
      id: true,
      title: true,
      status: true,
      publishState: true,
      type: true,
      price: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  if (properties.length === 0) return [];

  const propertyIds = properties.map((p) => p.id);

  const [viewsByProperty, appointmentsByProperty] = await Promise.all([
    db.analyticsEvent.groupBy({
      by: ["propertyId"],
      _count: { id: true },
      where: {
        companyId,
        propertyId: { in: propertyIds },
        eventType: "property_view",
        createdAt: { gte: since30 },
      },
    }),
    db.appointment.groupBy({
      by: ["propertyId"],
      _count: { id: true },
      where: {
        companyId,
        propertyId: { in: propertyIds },
      },
    }),
  ]);

  const viewsMap = new Map(
    viewsByProperty.map((r) => [r.propertyId, r._count.id]),
  );
  const apptsMap = new Map(
    appointmentsByProperty.map((r) => [r.propertyId, r._count.id]),
  );

  return properties.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    publishState: p.publishState,
    type: p.type,
    price: p.price,
    createdAt: p.createdAt,
    views30d: viewsMap.get(p.id) ?? 0,
    appointments: apptsMap.get(p.id) ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// CSV export for reports
// ---------------------------------------------------------------------------

function toCsvValue(val: unknown): string {
  if (val == null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function businessSummaryToCsv(
  summary: Awaited<ReturnType<typeof getMonthlyBusinessSummary>>,
): string {
  const lines = [
    `Business Summary — ${summary.period.label}`,
    "",
    "Metric,Value",
    `New Leads,${summary.leads.new}`,
    `Qualified Leads,${summary.leads.qualified}`,
    `Closed Leads,${summary.leads.closed}`,
    `Total Appointments,${summary.appointments.total}`,
    `Completed Appointments,${summary.appointments.completed}`,
    `New Properties,${summary.properties.new}`,
    `Published Properties,${summary.properties.published}`,
    `New Customers,${summary.customers.new}`,
    `Page Views,${summary.pageViews}`,
  ];
  return lines.join("\n");
}

export function agentPerformanceToCsv(
  agents: Awaited<ReturnType<typeof getAgentPerformanceReport>>,
): string {
  const header = "Agent,Title,Appointments,Completed,Leads";
  const rows = agents.map(
    (a) =>
      [toCsvValue(a.name), toCsvValue(a.title), a.appointments, a.completed, a.leads].join(","),
  );
  return [header, ...rows].join("\n");
}

export function listingsReportToCsv(
  listings: Awaited<ReturnType<typeof getListingsReport>>,
): string {
  const header = "Title,Type,Status,Publish State,Price,Views (30d),Appointments,Listed";
  const rows = listings.map((p) =>
    [
      toCsvValue(p.title),
      toCsvValue(p.type),
      toCsvValue(p.status),
      toCsvValue(p.publishState),
      p.price ?? "",
      p.views30d,
      p.appointments,
      p.createdAt.toISOString().split("T")[0],
    ].join(","),
  );
  return [header, ...rows].join("\n");
}
