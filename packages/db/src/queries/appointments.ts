import type { Db } from "../client";

export async function createAppointment(
  db: Db,
  data: {
    agentId?: string;
    companyId: string;
    durationMin?: number;
    email: string;
    leadId?: string;
    location?: string;
    name: string;
    notes?: string;
    phone?: string;
    propertyId?: string;
    scheduledAt: Date;
  },
) {
  return db.appointment.create({
    data: {
      agentId: data.agentId,
      companyId: data.companyId,
      durationMin: data.durationMin ?? 30,
      email: data.email,
      leadId: data.leadId,
      location: data.location,
      name: data.name,
      notes: data.notes,
      phone: data.phone,
      propertyId: data.propertyId,
      scheduledAt: data.scheduledAt,
    },
  });
}

export async function listAppointmentsForCompany(
  db: Db,
  companyId: string,
  options?: {
    status?: string;
    upcoming?: boolean;
    limit?: number;
  },
) {
  return db.appointment.findMany({
    include: {
      agent: { select: { id: true, name: true } },
      lead: { select: { id: true, name: true } },
      property: { select: { id: true, title: true } },
    },
    orderBy: { scheduledAt: "asc" },
    take: options?.limit ?? 50,
    where: {
      companyId,
      ...(options?.status
        ? {
            status: options.status as
              | "pending"
              | "confirmed"
              | "completed"
              | "cancelled",
          }
        : {}),
      ...(options?.upcoming ? { scheduledAt: { gte: new Date() } } : {}),
    },
  });
}

export async function updateAppointmentStatus(
  db: Db,
  data: {
    appointmentId: string;
    notes?: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
  },
) {
  return db.appointment.update({
    data: {
      notes: data.notes,
      status: data.status,
    },
    where: { id: data.appointmentId },
  });
}

export async function deleteAppointment(db: Db, appointmentId: string) {
  return db.appointment.delete({ where: { id: appointmentId } });
}

export async function countAppointmentsByStatus(db: Db, companyId: string) {
  return db.appointment.groupBy({
    by: ["status"],
    _count: true,
    where: { companyId },
  });
}

export async function findAppointmentById(db: Db, appointmentId: string) {
  return db.appointment.findUnique({
    include: {
      agent: { select: { id: true, name: true } },
      lead: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true } },
    },
    where: { id: appointmentId },
  });
}
