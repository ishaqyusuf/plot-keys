import type { Prisma } from "../generated/prisma/client";
import { createPrismaClient, type Db } from "../prisma";
import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

export type DepartmentMutationResult =
  | { ok: true }
  | { ok: false; reason: "database-unavailable" };

// ---------------------------------------------------------------------------
// Department CRUD
// ---------------------------------------------------------------------------

export async function createDepartment(
  db: Db,
  input: {
    companyId: string;
    name: string;
    description?: string | null;
  },
) {
  return db.department.create({
    data: {
      companyId: input.companyId,
      name: input.name,
      description: input.description ?? null,
    },
  });
}

export async function createCompanyDepartment(input: {
  companyId: string;
  description?: string | null;
  name: string;
}): Promise<DepartmentMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await createDepartment(db, input);

  return { ok: true };
}

export async function listDepartmentsForCompany(
  db: Db,
  companyId: string,
  options: {
    cursor?: string | number | null;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
  } = {},
) {
  const query = options.q?.trim();
  const size = normalizeListPageSize(options.size);
  const offset = normalizeListOffsetCursor(options.cursor);
  const where: Prisma.DepartmentWhereInput = {
    companyId,
    deletedAt: null,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [count, data] = await db.$transaction([
    db.department.count({ where }),
    db.department.findMany({
      include: {
        _count: { select: { employees: { where: { deletedAt: null } } } },
      },
      orderBy: getDepartmentOrderBy(options.sort),
      skip: offset,
      take: size,
      where,
    }),
  ]);
  return createPaginatedListResult(data, { count, offset, size });
}

function getDepartmentOrderBy(
  sort: string[] | null | undefined,
): Prisma.DepartmentOrderByWithRelationInput {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return { name: "asc" };
  }

  switch (field) {
    case "createdAt":
      return { createdAt: direction };
    case "description":
      return { description: direction };
    case "name":
      return { name: direction };
    default:
      return { name: "asc" };
  }
}

export async function getDepartmentById(
  db: Db,
  departmentId: string,
  companyId: string,
) {
  return db.department.findFirst({
    where: { id: departmentId, companyId, deletedAt: null },
  });
}

export async function updateDepartment(
  db: Db,
  departmentId: string,
  companyId: string,
  data: {
    name?: string;
    description?: string | null;
  },
) {
  return db.department.update({
    where: { id: departmentId, companyId },
    data,
  });
}

export async function updateCompanyDepartment(input: {
  companyId: string;
  data: {
    description?: string | null;
    name?: string;
  };
  departmentId: string;
}): Promise<DepartmentMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await updateDepartment(db, input.departmentId, input.companyId, input.data);

  return { ok: true };
}

export async function softDeleteDepartment(
  db: Db,
  departmentId: string,
  companyId: string,
) {
  return db.department.updateMany({
    where: { id: departmentId, companyId, deletedAt: null },
    data: { deletedAt: new Date() },
  });
}

export async function deleteCompanyDepartment(input: {
  companyId: string;
  departmentId: string;
}): Promise<DepartmentMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await softDeleteDepartment(db, input.departmentId, input.companyId);

  return { ok: true };
}
