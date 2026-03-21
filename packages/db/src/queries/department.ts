import type { Db } from "../prisma";

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

export async function listDepartmentsForCompany(
  db: Db,
  companyId: string,
) {
  return db.department.findMany({
    where: { companyId, deletedAt: null },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { employees: { where: { deletedAt: null } } } },
    },
  });
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

export async function softDeleteDepartment(
  db: Db,
  departmentId: string,
  companyId: string,
) {
  return db.department.update({
    where: { id: departmentId, companyId },
    data: { deletedAt: new Date() },
  });
}
