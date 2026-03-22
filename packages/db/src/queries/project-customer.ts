import type { Db } from "../prisma";

// ---------------------------------------------------------------------------
// Customer Access — Staff-side management
// ---------------------------------------------------------------------------

export async function grantCustomerProjectAccess(
  db: Db,
  input: {
    projectId: string;
    customerId: string;
    level?: "overview" | "detailed";
  },
) {
  return db.projectCustomerAccess.upsert({
    where: {
      projectId_customerId: {
        projectId: input.projectId,
        customerId: input.customerId,
      },
    },
    update: {
      level: input.level ?? "overview",
      disabledAt: null,
      enabledAt: new Date(),
    },
    create: {
      projectId: input.projectId,
      customerId: input.customerId,
      level: input.level ?? "overview",
    },
  });
}

export async function revokeCustomerProjectAccess(
  db: Db,
  projectId: string,
  customerId: string,
) {
  return db.projectCustomerAccess.update({
    where: {
      projectId_customerId: {
        projectId,
        customerId,
      },
    },
    data: { disabledAt: new Date() },
  });
}

export async function listCustomerAccessForProject(
  db: Db,
  projectId: string,
) {
  return db.projectCustomerAccess.findMany({
    where: { projectId, disabledAt: null },
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true, status: true },
      },
    },
    orderBy: { enabledAt: "desc" },
  });
}

export async function listProjectsForCustomer(
  db: Db,
  customerId: string,
) {
  return db.projectCustomerAccess.findMany({
    where: { customerId, disabledAt: null },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          code: true,
          type: true,
          status: true,
          location: true,
          startDate: true,
          targetCompletionDate: true,
          description: true,
        },
      },
    },
    orderBy: { enabledAt: "desc" },
  });
}

// ---------------------------------------------------------------------------
// Customer-visible data — Read-only for customers
// ---------------------------------------------------------------------------

export async function getCustomerProjectOverview(
  db: Db,
  projectId: string,
  customerId: string,
) {
  // Verify access
  const access = await db.projectCustomerAccess.findUnique({
    where: {
      projectId_customerId: { projectId, customerId },
    },
  });

  if (!access || access.disabledAt) return null;

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      code: true,
      type: true,
      status: true,
      location: true,
      startDate: true,
      targetCompletionDate: true,
      description: true,
    },
  });

  if (!project) return null;

  // Customer-visible milestones only
  const milestones = await db.projectMilestone.findMany({
    where: { projectId, customerVisible: true },
    select: {
      id: true,
      name: true,
      status: true,
      dueDate: true,
      completedAt: true,
    },
    orderBy: { dueDate: "asc" },
  });

  // Customer-visible updates only
  const updates = await db.projectUpdate.findMany({
    where: { projectId, customerVisible: true },
    select: {
      id: true,
      kind: true,
      summary: true,
      details: true,
      progressPercent: true,
      postedAt: true,
    },
    orderBy: { postedAt: "desc" },
    take: 20,
  });

  // Shared documents only
  const documents = await db.projectDocument.findMany({
    where: { projectId, visibility: "shared" },
    select: {
      id: true,
      kind: true,
      title: true,
      fileUrl: true,
      versionLabel: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Notices for this customer
  const notices = await db.projectCustomerNotice.findMany({
    where: { projectId, customerId },
    orderBy: { postedAt: "desc" },
    take: 10,
  });

  // Phase progress
  const phases = await db.projectPhase.findMany({
    where: { projectId },
    select: {
      id: true,
      name: true,
      status: true,
      order: true,
    },
    orderBy: { order: "asc" },
  });

  return {
    project,
    milestones,
    updates,
    documents,
    notices,
    phases,
    accessLevel: access.level,
  };
}

// ---------------------------------------------------------------------------
// Customer Notices
// ---------------------------------------------------------------------------

export async function createProjectCustomerNotice(
  db: Db,
  input: {
    projectId: string;
    customerId: string;
    title: string;
    body: string;
  },
) {
  return db.projectCustomerNotice.create({
    data: {
      projectId: input.projectId,
      customerId: input.customerId,
      title: input.title,
      body: input.body,
    },
  });
}

export async function listProjectNoticesForCustomer(
  db: Db,
  projectId: string,
  customerId: string,
) {
  return db.projectCustomerNotice.findMany({
    where: { projectId, customerId },
    orderBy: { postedAt: "desc" },
    take: 20,
  });
}

export async function deleteProjectCustomerNotice(db: Db, noticeId: string) {
  return db.projectCustomerNotice.delete({ where: { id: noticeId } });
}

// ---------------------------------------------------------------------------
// Toggle visibility helpers
// ---------------------------------------------------------------------------

export async function toggleMilestoneCustomerVisibility(
  db: Db,
  milestoneId: string,
  visible: boolean,
) {
  return db.projectMilestone.update({
    where: { id: milestoneId },
    data: { customerVisible: visible },
  });
}

export async function toggleUpdateCustomerVisibility(
  db: Db,
  updateId: string,
  visible: boolean,
) {
  return db.projectUpdate.update({
    where: { id: updateId },
    data: { customerVisible: visible },
  });
}
