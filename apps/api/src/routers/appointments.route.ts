import {
  countAppointmentsByStatus,
  createAppointment,
  deleteAppointment,
  listAppointmentsForCompany,
  updateAppointmentStatus,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  appointmentIdInputSchema,
  appointmentIdsInputSchema,
  createAppointmentInputSchema,
  listAppointmentsInputSchema,
  updateAppointmentStatusInputSchema,
} from "../schemas/appointments.schema";

export const appointmentsRouter = createTRPCRouter({
  create: membershipProcedure
    .input(createAppointmentInputSchema)
    .mutation(async ({ ctx, input }) => {
      return createAppointment(ctx.db.db, {
        agentId: input.agentId,
        companyId: ctx.auth.activeMembership.companyId,
        email: input.email,
        leadId: input.leadId,
        location: input.location,
        name: input.name,
        notes: input.notes,
        phone: input.phone,
        propertyId: input.propertyId,
        scheduledAt: new Date(input.scheduledAt),
      });
    }),

  delete: membershipProcedure
    .input(appointmentIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await deleteAppointment(ctx.db.db, {
        appointmentId: input.appointmentId,
        companyId: ctx.auth.activeMembership.companyId,
      });

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Appointment not found.",
        });
      }

      return { appointmentId: input.appointmentId };
    }),

  deleteMany: membershipProcedure
    .input(appointmentIdsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const appointmentIds = Array.from(new Set(input.appointmentIds));
      const results = await Promise.all(
        appointmentIds.map((appointmentId) =>
          deleteAppointment(ctx.db.db, {
            appointmentId,
            companyId: ctx.auth.activeMembership.companyId,
          }),
        ),
      );

      if (results.some((result) => result.count === 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more appointments were not found.",
        });
      }

      return { ids: appointmentIds };
    }),

  list: membershipProcedure
    .input(listAppointmentsInputSchema)
    .query(async ({ ctx, input }) => {
      return listAppointmentsForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input,
      );
    }),

  stats: membershipProcedure.query(async ({ ctx }) => {
    return countAppointmentsByStatus(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  updateStatus: membershipProcedure
    .input(updateAppointmentStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await updateAppointmentStatus(ctx.db.db, {
        appointmentId: input.appointmentId,
        companyId: ctx.auth.activeMembership.companyId,
        notes: input.notes,
        status: input.status,
      });

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Appointment not found.",
        });
      }

      return {
        appointmentId: input.appointmentId,
        status: input.status,
      };
    }),
});
