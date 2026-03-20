import type { Db } from "../prisma";

export async function createLead(
  db: Db,
  input: {
    companyId: string;
    email: string;
    message?: string;
    name: string;
    phone?: string;
    source?: string;
  },
) {
  return db.lead.create({
    data: {
      companyId: input.companyId,
      email: input.email,
      message: input.message,
      name: input.name,
      phone: input.phone,
      source: input.source ?? "contact_form",
    },
  });
}

export async function listLeadsForCompany(
  db: Db,
  companyId: string,
  options?: {
    limit?: number;
    status?: "new" | "contacted" | "qualified" | "closed";
  },
) {
  return db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: options?.limit ?? 50,
    where: {
      companyId,
      ...(options?.status ? { status: options.status } : {}),
    },
  });
}

export async function countLeadsByStatus(db: Db, companyId: string) {
  const counts = await db.lead.groupBy({
    by: ["status"],
    _count: true,
    where: { companyId },
  });

  return {
    closed: counts.find((c) => c.status === "closed")?._count ?? 0,
    contacted: counts.find((c) => c.status === "contacted")?._count ?? 0,
    new: counts.find((c) => c.status === "new")?._count ?? 0,
    qualified: counts.find((c) => c.status === "qualified")?._count ?? 0,
    total: counts.reduce((sum, c) => sum + c._count, 0),
  };
}

export async function updateLeadStatus(
  db: Db,
  input: {
    leadId: string;
    notes?: string;
    status: "new" | "contacted" | "qualified" | "closed";
  },
) {
  return db.lead.update({
    data: {
      notes: input.notes,
      status: input.status,
    },
    where: { id: input.leadId },
  });
}

export async function findLeadById(db: Db, leadId: string) {
  return db.lead.findUnique({ where: { id: leadId } });
}
