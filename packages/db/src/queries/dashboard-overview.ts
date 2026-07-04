import type { Db } from "../prisma";

export async function getDashboardOverview(db: Db, companyId: string) {
  const [
    domainStatuses,
    propertyCount,
    agentCount,
    leadCount,
    appointmentCount,
    publishedVersion,
  ] = await Promise.all([
    db.tenantDomain.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        apexDomain: true,
        hostname: true,
        id: true,
        kind: true,
        status: true,
      },
      where: {
        companyId,
        deletedAt: null,
      },
    }),
    db.property.count({
      where: { companyId, deletedAt: null },
    }),
    db.agent.count({
      where: { companyId, deletedAt: null },
    }),
    db.lead.count({
      where: { companyId },
    }),
    db.appointment.count({
      where: { companyId },
    }),
    db.websiteVersion.findFirst({
      orderBy: { versionNumber: "desc" },
      select: {
        id: true,
        publishedAt: true,
        status: true,
        versionNumber: true,
      },
      where: {
        status: "published",
        website: {
          companyId,
          deletedAt: null,
        },
      },
    }),
  ]);

  return {
    counts: {
      agentCount,
      appointmentCount,
      leadCount,
      propertyCount,
    },
    domainStatuses,
    publishedVersion,
  };
}
