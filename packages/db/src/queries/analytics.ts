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

// ---------------------------------------------------------------------------
// Top pages by view count
// ---------------------------------------------------------------------------

export async function getTopPages(
  db: Db,
  companyId: string,
  options?: { since?: Date; limit?: number },
) {
  const since =
    options?.since ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const limit = options?.limit ?? 10;

  const rows = await db.analyticsEvent.groupBy({
    by: ["path"],
    _count: true,
    where: {
      companyId,
      createdAt: { gte: since },
      eventType: "page_view",
      path: { not: null },
    },
    orderBy: { _count: { path: "desc" } },
    take: limit,
  });

  return rows.map((r) => ({ path: r.path!, views: r._count }));
}

// ---------------------------------------------------------------------------
// Traffic source breakdown (referrer bucketing)
// ---------------------------------------------------------------------------

function bucketReferrer(referrer: string | null): string {
  if (!referrer) return "Direct";
  const lower = referrer.toLowerCase();
  if (lower.includes("google")) return "Google";
  if (
    lower.includes("facebook") ||
    lower.includes("twitter") ||
    lower.includes("instagram") ||
    lower.includes("linkedin") ||
    lower.includes("tiktok") ||
    lower.includes("x.com")
  )
    return "Social";
  return "Other";
}

export async function getTrafficSources(
  db: Db,
  companyId: string,
  options?: { since?: Date },
) {
  const since =
    options?.since ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const events = await db.analyticsEvent.findMany({
    select: { referrer: true },
    where: {
      companyId,
      createdAt: { gte: since },
      eventType: "page_view",
    },
  });

  const buckets: Record<string, number> = {};
  for (const event of events) {
    const bucket = bucketReferrer(event.referrer);
    buckets[bucket] = (buckets[bucket] ?? 0) + 1;
  }

  return Object.entries(buckets)
    .sort(([, a], [, b]) => b - a)
    .map(([source, count]) => ({ source, count }));
}

// ---------------------------------------------------------------------------
// Property-level analytics
// ---------------------------------------------------------------------------

export async function getPropertyAnalytics(
  db: Db,
  companyId: string,
  options?: { since?: Date; limit?: number },
) {
  const since =
    options?.since ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const limit = options?.limit ?? 10;

  const rows = await db.analyticsEvent.groupBy({
    by: ["propertyId"],
    _count: true,
    where: {
      companyId,
      createdAt: { gte: since },
      eventType: "property_view",
      propertyId: { not: null },
    },
    orderBy: { _count: { propertyId: "desc" } },
    take: limit,
  });

  return rows.map((r) => ({ propertyId: r.propertyId!, views: r._count }));
}

// ---------------------------------------------------------------------------
// Lead source breakdown
// ---------------------------------------------------------------------------

export async function getLeadSourceBreakdown(
  db: Db,
  companyId: string,
  options?: { since?: Date },
) {
  const since =
    options?.since ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = await db.lead.groupBy({
    by: ["source"],
    _count: { id: true },
    where: {
      companyId,
      createdAt: { gte: since },
    },
  });

  return rows
    .map((r) => ({ source: r.source ?? "unknown", count: r._count.id }))
    .sort((a, b) => b.count - a.count);
}
