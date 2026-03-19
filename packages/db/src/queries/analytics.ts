import type { Db } from "../client";

// ---------------------------------------------------------------------------
// Event recording
// ---------------------------------------------------------------------------

export async function recordAnalyticsEvent(
  db: Db,
  data: {
    companyId: string;
    eventType: string;
    meta?: Record<string, unknown>;
    path?: string;
    propertyId?: string;
    referrer?: string;
    userAgent?: string;
    visitorId?: string;
  },
) {
  return db.analyticsEvent.create({
    data: {
      companyId: data.companyId,
      eventType: data.eventType,
      meta: data.meta ?? {},
      path: data.path,
      propertyId: data.propertyId,
      referrer: data.referrer,
      userAgent: data.userAgent?.slice(0, 256),
      visitorId: data.visitorId,
    },
  });
}

// ---------------------------------------------------------------------------
// Aggregations
// ---------------------------------------------------------------------------

export async function getAnalyticsSummary(
  db: Db,
  companyId: string,
  options?: { since?: Date },
) {
  const since =
    options?.since ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

  const [totalEvents, byType, uniqueVisitors, recentEvents] = await Promise.all(
    [
      db.analyticsEvent.count({
        where: { companyId, createdAt: { gte: since } },
      }),
      db.analyticsEvent.groupBy({
        by: ["eventType"],
        _count: true,
        where: { companyId, createdAt: { gte: since } },
      }),
      db.analyticsEvent.findMany({
        distinct: ["visitorId"],
        select: { visitorId: true },
        where: {
          companyId,
          createdAt: { gte: since },
          visitorId: { not: null },
        },
      }),
      db.analyticsEvent.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          createdAt: true,
          eventType: true,
          id: true,
          path: true,
          referrer: true,
        },
        take: 50,
        where: { companyId },
      }),
    ],
  );

  return {
    byType: byType.map((t) => ({
      count: t._count,
      eventType: t.eventType,
    })),
    period: { since },
    recentEvents,
    totalEvents,
    uniqueVisitors: uniqueVisitors.length,
  };
}

export async function getPageViewsByDay(
  db: Db,
  companyId: string,
  days: number = 30,
) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const events = await db.analyticsEvent.findMany({
    select: { createdAt: true },
    where: {
      companyId,
      createdAt: { gte: since },
      eventType: "page_view",
    },
  });

  // Group by date
  const byDay: Record<string, number> = {};
  for (const event of events) {
    const day = event.createdAt.toISOString().split("T")[0]!;
    byDay[day] = (byDay[day] ?? 0) + 1;
  }

  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ count, date }));
}
