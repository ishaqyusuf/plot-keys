import type { Prisma } from "../generated/prisma/client";
import type { Db } from "../prisma";
import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

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

  const result = await db.agent.updateMany({
    data: updateData,
    where: { id: agentId, companyId, deletedAt: null },
  });

  if (result.count === 0) {
    return null;
  }

  return getAgentForCompany(db, agentId, companyId);
}

export async function deleteAgent(db: Db, agentId: string, companyId: string) {
  return db.agent.updateMany({
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

  const result = await db.agent.updateMany({
    data: { featured: !agent.featured },
    where: { id: agentId, companyId, deletedAt: null },
  });

  return result.count > 0
    ? { featured: !agent.featured, id: agentId }
    : null;
}

export async function getAgentForCompany(
  db: Db,
  agentId: string,
  companyId: string,
) {
  return db.agent.findFirst({
    where: { companyId, deletedAt: null, id: agentId },
  });
}

export async function listAgentsForCompany(
  db: Db,
  companyId: string,
  options: {
    cursor?: string | number | null;
    featured?: boolean;
    limit?: number;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
  } = {},
) {
  const query = options.q?.trim();
  const size = normalizeListPageSize(options.size ?? options.limit);
  const offset = normalizeListOffsetCursor(options.cursor);
  const where: Prisma.AgentWhereInput = {
    companyId,
    deletedAt: null,
    ...(options.featured !== undefined && { featured: options.featured }),
    ...(query ? { OR: getAgentSearchFilters(query) } : {}),
  };

  const [count, data] = await db.$transaction([
    db.agent.count({ where }),
    db.agent.findMany({
      orderBy: getAgentOrderBy(options.sort),
      skip: offset,
      take: size,
      where,
    }),
  ]);
  return createPaginatedListResult(data, { count, offset, size });
}

function getAgentSearchFilters(query: string): Prisma.AgentWhereInput[] {
  return [
    { bio: { contains: query, mode: "insensitive" } },
    { email: { contains: query, mode: "insensitive" } },
    { name: { contains: query, mode: "insensitive" } },
    { phone: { contains: query, mode: "insensitive" } },
    { title: { contains: query, mode: "insensitive" } },
  ];
}

function getAgentOrderBy(
  sort: string[] | null | undefined,
): Prisma.AgentOrderByWithRelationInput[] {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return [
      { featured: "desc" },
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ];
  }

  switch (field) {
    case "bio":
      return [{ bio: direction }];
    case "createdAt":
      return [{ createdAt: direction }];
    case "displayOrder":
      return [{ displayOrder: direction }];
    case "email":
      return [{ email: direction }];
    case "featured":
      return [{ featured: direction }];
    case "name":
      return [{ name: direction }];
    case "title":
      return [{ title: direction }];
    default:
      return [
        { featured: "desc" },
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ];
  }
}
