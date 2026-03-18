import type { Db } from "../prisma";

export async function listAgentsForCompany(
  db: Db,
  companyId: string,
  options: { limit?: number; featured?: boolean } = {},
) {
  return db.agent.findMany({
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "asc" }],
    take: options.limit ?? 50,
    where: {
      companyId,
      deletedAt: null,
      ...(options.featured !== undefined && { featured: options.featured }),
    },
  });
}

export type CreateAgentInput = {
  bio?: string | null;
  displayOrder?: number;
  email?: string | null;
  featured?: boolean;
  imageUrl?: string | null;
  name: string;
  phone?: string | null;
  title?: string | null;
};

export async function createAgent(
  db: Db,
  companyId: string,
  data: CreateAgentInput,
) {
  return db.agent.create({
    data: {
      bio: data.bio ?? null,
      companyId,
      displayOrder: data.displayOrder ?? 0,
      email: data.email ?? null,
      featured: data.featured ?? false,
      imageUrl: data.imageUrl ?? null,
      name: data.name,
      phone: data.phone ?? null,
      title: data.title ?? null,
    },
  });
}

export async function updateAgent(
  db: Db,
  agentId: string,
  companyId: string,
  data: Partial<CreateAgentInput>,
) {
  return db.agent.updateMany({
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
    where: { companyId, deletedAt: null, id: agentId },
  });
}

export async function deleteAgent(
  db: Db,
  agentId: string,
  companyId: string,
) {
  return db.agent.updateMany({
    data: { deletedAt: new Date() },
    where: { companyId, deletedAt: null, id: agentId },
  });
}

export async function toggleAgentFeatured(
  db: Db,
  agentId: string,
  companyId: string,
  featured: boolean,
) {
  return db.agent.updateMany({
    data: { featured },
    where: { companyId, deletedAt: null, id: agentId },
  });
}
