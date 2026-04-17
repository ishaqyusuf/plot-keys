import type { Prisma } from "../generated/prisma/client";
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
      displayOrder: data.displayOrder ?? 0,
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
  const updateData: Prisma.AgentUpdateInput = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.displayOrder !== undefined) {
    updateData.displayOrder = data.displayOrder ?? 0;
  }

  return db.agent.update({
    data: updateData,
    where: { id: agentId, companyId, deletedAt: null },
  });
}

export async function deleteAgent(db: Db, agentId: string, companyId: string) {
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
    orderBy: [
      { featured: "desc" },
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
    take: options.limit ?? 20,
    where: {
      companyId,
      deletedAt: null,
      ...(options.featured !== undefined && { featured: options.featured }),
    },
  });
}
