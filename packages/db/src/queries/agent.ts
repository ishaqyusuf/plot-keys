import type { Db } from "../prisma";

export async function createAgent(
  db: Db,
  data: {
    companyId: string;
    name: string;
    title?: string | null;
    bio?: string | null;
    email?: string | null;
    phone?: string | null;
    imageUrl?: string | null;
    featured?: boolean;
    displayOrder?: number | null;
  },
) {
  return db.agent.create({
    data: {
      companyId: data.companyId,
      name: data.name,
      title: data.title ?? null,
      bio: data.bio ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      imageUrl: data.imageUrl ?? null,
      featured: data.featured ?? false,
      displayOrder: data.displayOrder ?? null,
    },
  });
}

export async function updateAgent(
  db: Db,
  agentId: string,
  companyId: string,
  data: {
    name?: string;
    title?: string | null;
    bio?: string | null;
    email?: string | null;
    phone?: string | null;
    imageUrl?: string | null;
    featured?: boolean;
    displayOrder?: number | null;
  },
) {
  return db.agent.update({
    data,
    where: { id: agentId, companyId, deletedAt: null },
  });
}

export async function deleteAgent(
  db: Db,
  agentId: string,
  companyId: string,
) {
  return db.agent.update({
    data: { deletedAt: new Date() },
    where: { id: agentId, companyId, deletedAt: null },
  });
}

export async function toggleAgentFeatured(
  db: Db,
  agentId: string,
  companyId: string,
) {
  const agent = await db.agent.findFirst({
    select: { featured: true },
    where: { id: agentId, companyId, deletedAt: null },
  });

  if (!agent) return null;

  return db.agent.update({
    data: { featured: !agent.featured },
    where: { id: agentId, companyId },
  });
}

export async function listAgentsForCompany(
  db: Db,
  companyId: string,
  options: { limit?: number; featured?: boolean } = {},
) {
  return db.agent.findMany({
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "asc" }],
    take: options.limit ?? 20,
    where: {
      companyId,
      deletedAt: null,
      ...(options.featured !== undefined && { featured: options.featured }),
    },
  });
}
