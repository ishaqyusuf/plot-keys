import type { Db } from "../prisma";

export async function createCustomer(
  db: Db,
  input: {
    companyId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    status?: "active" | "inactive" | "vip";
    sourceLeadId?: string | null;
  },
) {
  return db.customer.create({
    data: {
      companyId: input.companyId,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
      status: input.status ?? "active",
      sourceLeadId: input.sourceLeadId ?? null,
    },
  });
}

export async function listCustomersForCompany(
  db: Db,
  companyId: string,
  options: { status?: "active" | "inactive" | "vip"; take?: number } = {},
) {
  return db.customer.findMany({
    where: {
      companyId,
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: options.take ?? 100,
  });
}

export async function getCustomerById(
  db: Db,
  customerId: string,
  companyId: string,
) {
  return db.customer.findFirst({
    where: { id: customerId, companyId, deletedAt: null },
  });
}

export async function updateCustomer(
  db: Db,
  customerId: string,
  companyId: string,
  data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    status?: "active" | "inactive" | "vip";
  },
) {
  return db.customer.update({
    where: { id: customerId, companyId },
    data,
  });
}

export async function softDeleteCustomer(
  db: Db,
  customerId: string,
  companyId: string,
) {
  return db.customer.update({
    where: { id: customerId, companyId },
    data: { deletedAt: new Date() },
  });
}

export async function countCustomersByStatus(db: Db, companyId: string) {
  const rows = await db.customer.groupBy({
    by: ["status"],
    where: { companyId, deletedAt: null },
    _count: { id: true },
  });

  const result: Record<string, number> = { active: 0, inactive: 0, vip: 0 };
  for (const row of rows) {
    result[row.status] = row._count.id;
  }
  return result;
}
